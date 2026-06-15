import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "docmind.access_token";
const REFRESH_KEY = "docmind.refresh_token";

export const tokens = {
  get access() {
    return localStorage.getItem(TOKEN_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access, refresh) {
    if (access) localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

api.interceptors.request.use((config) => {
  const t = tokens.access;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retried &&
      tokens.refresh
    ) {
      original._retried = true;
      refreshPromise ??= axios
        .post(`${BASE_URL}/auth/refresh`, { refresh_token: tokens.refresh })
        .then((r) => {
          tokens.set(r.data.access_token, r.data.refresh_token);
          return r.data.access_token;
        })
        .catch((e) => {
          tokens.clear();
          throw e;
        })
        .finally(() => (refreshPromise = null));
      try {
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const SSE_URL = (path) => `${BASE_URL}${path}`;
