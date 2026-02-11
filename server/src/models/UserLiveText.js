import { DataTypes, Model } from "sequelize";

export default class UserLiveText extends Model {
  static initModel(sequelize) {
    UserLiveText.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.STRING(80), allowNull: false },

        field_key: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "main" },
        version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

        content: { type: DataTypes.TEXT("long"), allowNull: false },

        keystrokes: { type: DataTypes.INTEGER, allowNull: true },
        typing_duration_ms: { type: DataTypes.INTEGER, allowNull: true },
        typing_speed_kpm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

        // admin management
        is_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        admin_notes: { type: DataTypes.TEXT, allowNull: true }
      },
      {
        sequelize,
        modelName: "UserLiveText",
        tableName: "user_live_text",
        timestamps: true,
        indexes: [
          { fields: ["session_id"] },
          { fields: ["field_key"] },
          { fields: ["is_reviewed"] },
          { fields: ["createdAt"] }
        ]
      }
    );
  }
}
