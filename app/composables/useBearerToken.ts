export function useBearerToken() {
  return import.meta.client ? localStorage.getItem('bearer_token') || '' : ''
}
