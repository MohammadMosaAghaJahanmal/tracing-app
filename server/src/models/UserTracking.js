import { DataTypes, Model } from "sequelize";

export default class UserTracking extends Model {
  static initModel(sequelize) {
    UserTracking.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.STRING(80), allowNull: false, unique: true },

        ip: { type: DataTypes.STRING(64), allowNull: true },
        country: { type: DataTypes.STRING(80), allowNull: true },
        city: { type: DataTypes.STRING(80), allowNull: true },
        region: { type: DataTypes.STRING(80), allowNull: true },
        latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
        longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

        os: { type: DataTypes.STRING(120), allowNull: true },
        browser: { type: DataTypes.STRING(120), allowNull: true },
        device: { type: DataTypes.STRING(120), allowNull: true },
        user_agent: { type: DataTypes.TEXT, allowNull: true },
        language: { type: DataTypes.STRING(40), allowNull: true },
        timezone: { type: DataTypes.STRING(60), allowNull: true },
        screen_resolution: { type: DataTypes.STRING(30), allowNull: true },
        referrer: { type: DataTypes.TEXT, allowNull: true },

        first_seen_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        last_seen_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
      },
      {
        sequelize,
        modelName: "UserTracking",
        tableName: "user_tracking",
        timestamps: true,
        indexes: [
          { fields: ["session_id"] },
          { fields: ["ip"] },
          { fields: ["createdAt"] }
        ]
      }
    );
  }
}
