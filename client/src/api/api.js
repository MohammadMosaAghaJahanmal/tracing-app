// const API_BASE = "http://localhost:8080/api";
const API_BASE = "https://trcapi.jahanmal.xyz/api";

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const api = {
  getHomeContent: () => http("GET", "/content/home"),
  startVisit: (payload) => http("POST", "/visits/start", payload),
  trackEvent: (payload) => http("POST", "/events", payload),
  saveDraft: (payload) => http("POST", "/responses/draft", payload),
  submit: (payload) => http("POST", "/responses/submit", payload)
};
