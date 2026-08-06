export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
  }
  return res.json();
}
