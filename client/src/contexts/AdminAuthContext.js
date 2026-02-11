import React, { createContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../services/auth";

export const AdminAuthContext = createContext(null);

export default function AdminAuthProvider({ children }) {
  const [token, setTok] = useState(getToken());

  const value = useMemo(() => ({
    token,
    isAuthed: Boolean(token),
    login: (t) => { setToken(t); setTok(t); },
    logout: () => { clearToken(); setTok(null); }
  }), [token]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
