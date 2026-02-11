import { api } from "../services/api";

const SESSION_KEY = "tracking_session_id";

export const getSessionId = () => localStorage.getItem(SESSION_KEY);
export const setSessionId = (sid) => localStorage.setItem(SESSION_KEY, sid);

const detectOS = () => {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
};

const detectBrowser = () => {
  const ua = navigator.userAgent;
  if (/edg/i.test(ua)) return "Edge";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox/i.test(ua)) return "Firefox";
  return "Unknown";
};

const detectDevice = () => (window.innerWidth < 768 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop");

export const startSession = async () => {
  const payload = {
    session_id: String(getSessionId() || ""),
    os: String(detectOS() || ""),
    browser: String(detectBrowser() || ""),
    device: String(detectDevice() || ""),
    user_agent: String(navigator.userAgent || ""),
    language: String(navigator.language || ""),
    timezone: String(Intl.DateTimeFormat().resolvedOptions().timeZone || ""),
    screen_resolution: String(`${window.screen.width}x${window.screen.height}`),
    referrer: String(document.referrer || "")
  };

  // remove empty session_id so backend doesn't store ""
  if (!payload.session_id) delete payload.session_id;

  const res = await api.post("/tracking/session", payload);
  setSessionId(res.data.session_id);
  return res.data.session_id;
};


export const logClick = async ({ element_type, label, x, y, page, meta }) => {
  const session_id = getSessionId();
  if (!session_id) return;
  try {
    await api.post("/tracking/button-click", { session_id, element_type, label, x, y, page, meta });
  } catch {}
};

export const saveLiveText = async (data) => {
  const session_id = getSessionId();
  if (!session_id) return;
  return api.post("/tracking/save-live-text", { session_id, ...data });
};

export const submitResponse = async (data) => {
  const session_id = getSessionId();
  if (!session_id) return;
  return api.post("/tracking/save-response", { session_id, ...data });
};

