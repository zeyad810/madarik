import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const moduleRequire = createRequire(import.meta.url);

// Run the real TypeScript modules with isolated browser/API dependencies.
function load(file, dependencies = {}, globals = {}) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, URL, URLSearchParams, setTimeout, clearTimeout,
    require: (id) => id in dependencies ? dependencies[id] : moduleRequire(id),
    ...globals,
  }, { filename: file });
  return exports;
}
const flow = load('src/features/payment/paymentFlow.ts');

test('gateway IDs never become the backend payment ID', () => {
  const result = flow.resolvePaymentReturn(new URLSearchParams('id=gateway'), 'local');
  assert.equal(result.paymentId, 'local');
  assert.equal(result.gatewayId, 'gateway');
  assert.equal(flow.resolvePaymentReturn(new URLSearchParams('id=gateway'), null).paymentId, null);
});

test('Stream payment_id is separate from our saved checkout ID', () => {
  const params = new URLSearchParams('payment_id=stream&id=gateway&invoice_id=invoice');
  assert.equal(flow.resolvePaymentReturn(params, 'local').paymentId, 'local');
  assert.equal(flow.resolvePaymentReturn(params, null).paymentId, null);
});

test('explicit local IDs and legacy callback URLs remain supported', () => {
  for (const key of ['paymentId', 'payment_id']) {
    assert.equal(flow.resolvePaymentReturn(new URLSearchParams(`${key}=local&id=gateway`), 'old').paymentId, 'local');
  }
  assert.equal(flow.getVerificationUrl('local/42', 'gateway &42'), '/subscription/payment/local%2F42?id=gateway+%2642');
});

test('pending and delayed activation cannot report success', () => {
  for (const status of ['initiated', 'pending', 'processing', 'failed_internal_error', 'unknown']) {
    assert.equal(flow.getPaymentState({ status, is_subscribed: true }), 'pending');
  }
  assert.equal(flow.getPaymentState({ status: 'paid', is_subscribed: false }), 'pending');
  assert.equal(flow.getPaymentState({ status: 'PAID', is_subscribed: true }), 'success');
  assert.equal(flow.getPaymentState({ is_subscribed: true }), 'success');
});

test('an existing subscription cannot hide a failed renewal', () => {
  for (const status of ['failed', 'cancelled', 'canceled', 'expired', 'refunded']) {
    assert.equal(flow.getPaymentState({ status, is_subscribed: true }), 'failed');
  }
});

test('checkout IDs survive return navigation and unavailable storage is tolerated', () => {
  const entries = new Map();
  const saved = load('src/features/payment/paymentFlow.ts', {}, {
    sessionStorage: { getItem: key => entries.get(key), setItem: (key, value) => entries.set(key, value) },
  });
  saved.rememberPayment('local');
  assert.equal(saved.getPendingPaymentId(), 'local');
  entries.set('madarik:pending-payment', JSON.stringify({ paymentId: 'old', createdAt: 0 }));
  assert.equal(saved.getPendingPaymentId(), null);
  entries.set('madarik:pending-payment', 'broken json');
  assert.equal(saved.getPendingPaymentId(), null);
  assert.doesNotThrow(() => flow.rememberPayment('local'));
  assert.equal(flow.getPendingPaymentId(), null);
});

test('checkout links reject executable protocols and support Stream short IDs', () => {
  assert.equal(flow.getCheckoutUrl('abc_123').href, 'https://streampay.sa/ds/abc_123');
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'https://user:pass@streampay.sa']) {
    assert.throws(() => flow.getCheckoutUrl(value));
  }
});

function loadApi(response, calls = []) {
  return load('src/features/payment/api.ts', {
    '@/services/api': { API_BASE_URL: 'https://backend.test/api/v1', handleResponse: async value => value },
    '@/lib/auth': { getStoredAuthToken: () => 'stored-token' },
  }, { fetch: async (...args) => { calls.push(args); return response; } });
}

test('checkout rejects application failures and normalizes legacy transaction URLs', async () => {
  await assert.rejects(loadApi({ success: false, message: 'declined' }).checkoutSubscription({ package_id: '1' }), /declined/);
  const result = await loadApi({ success: true, data: { payment_id: 'local', transaction_url: 'https://gateway.test' } }).checkoutSubscription({ package_id: '1' });
  assert.equal(result.data.payment_url, 'https://gateway.test');
});

test('verification requests preserve both IDs and authentication, without caching', async () => {
  const calls = [];
  await loadApi({ success: true, data: { status: 'paid', is_subscribed: true } }, calls).verifySubscriptionPayment('local/42', 'gateway &42', 'session-token');
  assert.equal(calls[0][0], 'https://backend.test/api/v1/subscription/payment/local%2F42?id=gateway%20%2642');
  assert.equal(calls[0][1].headers.Authorization, 'Bearer session-token');
  assert.equal(calls[0][1].cache, 'no-store');
  await assert.rejects(loadApi(null).verifySubscriptionPayment('local'));
  await assert.rejects(loadApi({ success: false, data: { status: 'paid' } }).verifySubscriptionPayment('local'));
});

test('the dynamic verification route forwards gateway query parameters', async () => {
  const page = load('src/app/(site)/subscription/payment/[paymentId]/page.tsx', {
    '@/features/payment': { PaymentVerificationView: 'verification' },
  });
  const result = await page.default({ params: Promise.resolve({ paymentId: 'local' }), searchParams: Promise.resolve({ id: 'gateway' }) });
  assert.equal(result.props.paymentId, 'local');
  assert.equal(result.props.streamPayId, 'gateway');
});

test('Stream redirects navigate once, reject unrelated messages, and do not depend on callback identity', async () => {
  let listener, cleanup, dependencies;
  let destroyed = 0;
  const iframe = { src: 'https://streampay.sa/ds/link?embed=true', contentWindow: {} };
  const completed = [];
  const fakeWindow = {
    location: { origin: 'https://madarik.test' },
    Stream: { Checkout: () => ({ getIframe: () => iframe, destroy: () => destroyed++ }) },
    addEventListener: (type, callback, capture) => { assert.equal(capture, true); listener = callback; },
    removeEventListener: () => {},
  };
  const react = {
    useRef: () => ({ current: {} }),
    useState: value => [value, () => {}],
    useEffectEvent: callback => callback,
    useEffect: (callback, deps) => { dependencies = deps; cleanup = callback(); },
  };
  const { StreamCheckoutEmbed } = load('src/features/payment/components/StreamCheckoutEmbed.tsx', {
    react, '../paymentFlow': flow,
  }, { window: fakeWindow });
  StreamCheckoutEmbed({ paymentUrl: 'https://streampay.sa/ds/link', paymentId: 'local', onSuccess: id => completed.push(id) });
  await Promise.resolve();
  assert.deepEqual(Array.from(dependencies), ['https://streampay.sa/ds/link', true]);
  let stopped = 0;
  const event = {
    data: { type: 'stream:redirect', url: 'https://backend.test/return?id=gateway' },
    origin: 'https://streampay.sa', source: iframe.contentWindow,
    stopImmediatePropagation: () => stopped++,
  };
  listener({ ...event, origin: 'https://untrusted.test' });
  listener({ ...event, source: {} });
  assert.equal(completed.length, 0);
  listener(event);
  listener(event);
  assert.deepEqual(completed, ['gateway']);
  assert.equal(stopped, 4);
  cleanup();
  assert.equal(destroyed, 1);
});

test('verification waits for session hydration and refreshes subscription caches without refetching itself', async () => {
  let options;
  const invalidated = [];
  const hooks = load('src/features/payment/hooks/usePayment.ts', {
    react: { useEffect: callback => callback() },
    '../paymentFlow': flow,
    '../api': { verifySubscriptionPayment: async () => ({ data: { status: 'paid', is_subscribed: true } }) },
    'next-auth/react': { useSession: () => ({ status: 'loading' }) },
    '@tanstack/react-query': {
      useQueryClient: () => ({ invalidateQueries: ({ queryKey }) => invalidated.push(Array.from(queryKey)) }),
      useQuery: value => { options = value; return { data: { status: 'paid', is_subscribed: true } }; },
    },
  });
  hooks.useVerifySubscriptionPayment('local');
  assert.equal(options.enabled, false);
  assert.deepEqual(invalidated, [['subscription', 'current'], ['subscription', 'history'], ['packages']]);
  await options.queryFn();
  assert.equal(invalidated.length, 3);
});

test('verification renders pending, success, and network failure as distinct states', () => {
  const { renderToStaticMarkup } = moduleRequire('react-dom/server');
  const react = moduleRequire('react');
  const cases = [
    [{ status: 'pending', is_subscribed: false }, false, 'الدفعة قيد المعالجة'],
    [{ status: 'paid', is_subscribed: false }, false, 'الدفعة قيد المعالجة'],
    [{ status: 'paid', is_subscribed: true }, false, 'تمت عملية الدفع بنجاح!'],
    [{ status: 'failed', is_subscribed: true }, false, 'لم تكتمل عملية الدفع'],
    [undefined, true, 'تعذر التحقق من حالة الدفع حالياً'],
  ];
  for (const [data, isError, expected] of cases) {
    let options;
    const { PaymentVerificationView } = load('src/features/payment/components/PaymentVerificationView.tsx', {
      '../paymentFlow': flow,
      '../hooks/usePayment': { useVerifySubscriptionPayment: (_id, _gateway, value) => {
        options = value;
        return { data, isError, isPending: false, isFetching: false, isAwaitingSession: false };
      } },
      'next/link': { default: 'a', __esModule: true },
      'framer-motion': { motion: { div: 'div' } },
      '@/components/ui/Breadcrumb': { Breadcrumb: Object.assign(() => react.createElement('nav'), { List: 'ol', Item: 'li', Link: 'a', Separator: 'span', Page: 'span' }) },
    });
    const html = renderToStaticMarkup(react.createElement(PaymentVerificationView, { paymentId: 'local', result: 'failed' }));
    assert.ok(html.includes(expected), expected);
    if (data?.status === 'paid' && data.is_subscribed) assert.ok(!html.includes('لم تكتمل عملية الدفع'));
    if (!isError) {
      const interval = options.refetchInterval({ state: { data, dataUpdateCount: 1 } });
      assert.equal(interval, flow.getPaymentState(data) === 'pending' ? 3000 : false);
      assert.equal(options.refetchInterval({ state: { data, dataUpdateCount: 40 } }), false);
    }
  }
});


test('checkout with no payment URL goes to verification instead of declaring success', () => {
  const navigated = [];
  const stateChanges = [];
  const { CheckoutModal } = load('src/features/payment/components/CheckoutModal.tsx', {
    react: { useState: initial => [initial, next => stateChanges.push(next)] },
    '../paymentFlow': flow,
    '../hooks/usePayment': { useCheckoutSubscription: () => ({
      isPending: false,
      mutate: (_payload, callbacks) => callbacks.onSuccess({ success: true, data: { payment_id: 'local', status: 'initiated' } }),
    }) },
    './StreamCheckoutEmbed': { StreamCheckoutEmbed: 'checkout' },
    'next/navigation': { useRouter: () => ({ push: url => navigated.push(url) }) },
    'react-hot-toast': { default: { success: () => assert.fail('Pending payment must not show success') }, __esModule: true },
  });
  const tree = CheckoutModal({ isOpen: true, pkg: { id: '1', name: 'Test', price: 100, icon: '/icon.png' }, onClose: () => {} });
  function findPayButton(node) {
    if (!node || typeof node !== 'object') return null;
    if (node.type === 'button' && node.props.className.includes('py-4')) return node;
    const children = Array.isArray(node) ? node : [node.props?.children];
    for (const child of children) {
      const found = findPayButton(child);
      if (found) return found;
    }
    return null;
  }
  const button = findPayButton(tree);
  assert.ok(button);
  button.props.onClick();
  assert.deepEqual(navigated, ['/subscription/payment/local']);
  assert.ok(!stateChanges.includes(true));
});
