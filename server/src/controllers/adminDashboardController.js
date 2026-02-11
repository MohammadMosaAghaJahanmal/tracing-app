import { asyncHandler } from "../middleware/asyncHandler.js";
import { sequelize } from "../config/db.js";
import UserTracking from "../models/UserTracking.js";
import UserResponse from "../models/UserResponse.js";
import UserLiveText from "../models/UserLiveText.js";
import ButtonClick from "../models/ButtonClick.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalVisits = await UserTracking.count();
  const totalResponses = await UserResponse.count();

  // today activity (server date)
  const [todayRow] = await sequelize.query(`
    SELECT COUNT(*) as cnt
    FROM user_tracking
    WHERE DATE(createdAt) = CURDATE()
  `);

  const recentClicks = await ButtonClick.findAll({
    order: [["createdAt", "DESC"]],
    limit: 12
  });

  res.json({
    stats: {
      totalVisits,
      totalResponses,
      todayVisits: Number(todayRow?.[0]?.cnt || 0)
    },
    recentActivity: recentClicks.map((c) => ({
      id: c.id,
      session_id: c.session_id,
      element_type: c.element_type,
      label: c.label,
      page: c.page,
      createdAt: c.createdAt
    })),
    system: {
      db: "ok",
      serverTime: new Date().toISOString()
    }
  });
});
