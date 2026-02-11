import { DataTypes, Model } from "sequelize";

export default class UserShare extends Model {
  static initModel(sequelize) {
    UserShare.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.STRING(80), allowNull: false },

        share_request_id: { type: DataTypes.BIGINT, allowNull: true },
        title_snapshot: { type: DataTypes.STRING(255), allowNull: true },

        message: { type: DataTypes.TEXT, allowNull: true },
        file_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
      },
      {
        sequelize,
        modelName: "UserShare",
        tableName: "user_shares",
        timestamps: true,
        indexes: [{ fields: ["session_id"] }, { fields: ["share_request_id"] }, { fields: ["createdAt"] }]
      }
    );
  }
}
