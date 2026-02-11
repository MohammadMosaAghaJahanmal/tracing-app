export const tokenKey = "admin_token";

export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (t) => localStorage.setItem(tokenKey, t);
export const clearToken = () => localStorage.removeItem(tokenKey);
