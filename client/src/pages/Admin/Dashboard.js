import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function Dashboard() {
  const { token } = useContext(AdminAuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setData(r.data))
      .catch(() => {});
  }, [token]);

  return (
    <div className="dash">
      <div className="cards">
        <div className="card stat">
          <div className="statK">Total Visits</div>
          <div className="statV">{data?.stats?.totalVisits ?? "—"}</div>
        </div>
        <div className="card stat">
          <div className="statK">Total Responses</div>
          <div className="statV">{data?.stats?.totalResponses ?? "—"}</div>
        </div>
        <div className="card stat">
          <div className="statK">Today Visits</div>
          <div className="statV">{data?.stats?.todayVisits ?? "—"}</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="sectionTitleSmall">Recent Activity</div>
          <div className="feed">
            {(data?.recentActivity || []).map((a) => (
              <div key={a.id} className="feedItem">
                <b>{a.element_type}</b> — {a.label || "click"} <span className="muted small">({a.page})</span>
              </div>
            ))}
            {!data?.recentActivity?.length ? <div className="muted">No activity yet</div> : null}
          </div>
        </div>

        <div className="card">
          <div className="sectionTitleSmall">System Status</div>
          <div className="muted">DB: <b>{data?.system?.db || "—"}</b></div>
          <div className="muted">Server time: <b>{data?.system?.serverTime || "—"}</b></div>
          <div className="spacer" />
          <div className="quick">
            <a className="btn" href="/admin/questions">Manage Questions</a>
            <a className="btn" href="/admin/slider-images">Manage Slider</a>
            <a className="btn" href="/admin/tracking">View Tracking</a>
          </div>
        </div>
      </div>
    </div>
  );
}
