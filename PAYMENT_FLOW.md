# Payment flow

## Checkout and verification

1. `CheckoutModal` sends `POST /subscription/checkout` with `package_id` and the authenticated user's bearer token. The API may also accept a legacy `source` payload.
2. The backend creates the payment and returns its own `payment_id`, plus `payment_url` (or the legacy `transaction_url`). Missing links do not imply successful payment.
3. The frontend remembers the backend payment ID in this tab's session storage for up to 24 hours, then embeds the checkout. Only the payment ID and its timestamp are stored.
4. Stream's `stream:redirect` message opens `/subscription/payment/{paymentId}?id={gatewayId}`. The listener checks the iframe's origin and window before handling messages, and handles the redirect before the SDK navigates away. Legacy completion messages and the manual verification button use the same route.
5. The verification route preserves the gateway `id` query parameter and calls `GET /subscription/payment/{paymentId}?id={gatewayId}` after session hydration. The backend remains responsible for confirming the payment and activating the subscription.
6. Pending states poll every three seconds for up to 40 successful responses. A manual recheck remains available. Network errors show an inability to verify, rather than claiming the bank declined payment.
7. Confirmed success refreshes subscription and package caches. Verification does not invalidate its own query.

A paid response with `is_subscribed: false` remains pending while activation completes. Failed, cancelled, expired, and refunded payments cannot appear successful merely because the user already has a subscription from a previous purchase. Free subscriptions require confirmation in the backend response.

## Return routes and identifiers

The canonical route is `/subscription/payment/{paymentId}`. It uses the backend payment ID from the path, and forwards `id` or `streampay_id` to the backend verification endpoint.

Legacy return routes remain supported:

- `/payment/callback?payment_id={backendPaymentId}&id={gatewayId}`
- `/payment-operations?paymentId={backendPaymentId}&id={gatewayId}`

These redirect to the canonical route. Per the backend checkout contract, `payment_id` on `/payment/callback` identifies the local payment and takes precedence over session storage, even when provider metadata is present. A bare gateway `id` is never used as the backend payment ID. If the local ID cannot be recovered, the page provides a link to subscription status.

When a bank loads verification inside an iframe belonging to this site, verification moves to the full page. The external checkout fallback opens in the same tab to preserve session storage.

## Backend configuration

This repository contains the frontend, not the backend payment integration. The backend must configure both success and failure return URLs when creating Stream payment links. Prefer an explicit local ID, for example:

```text
https://<frontend-origin>/subscription/payment/<backend-payment-id>
```

The backend must verify the payment's owner, amount, currency, and provider status before activating the subscription. Redirect query parameters alone are not proof of payment. The frontend retains the existing API contract and does not send undocumented redirect fields to `/subscription/checkout`.

Stream documentation:

- [Embedded checkout](https://docs.streampay.sa/embedded-checkout/)
- [Payment redirects and provider identifiers](https://docs.streampay.sa/#handling-payment-redirects)

## Validation

```sh
npm run test:payment
npx tsc --noEmit --incremental false
npm run build
```

The regression tests cover identifier separation, session storage recovery, malformed responses, checkout URL validation, gateway query forwarding, trusted SDK events, session hydration, cache invalidation, and rendered verification states. They use mocked gateway/API dependencies and do not charge a card. A complete provider test still requires the backend's test environment and a test account.
