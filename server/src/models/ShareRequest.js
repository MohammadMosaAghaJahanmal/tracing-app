import { DataTypes, Model } from "sequelize";

export default class ShareRequest extends Model {
  static initModel(sequelize) {
    ShareRequest.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
      },
      {
        sequelize,
        modelName: "ShareRequest",
        tableName: "share_requests",
        timestamps: true,
        indexes: [{ fields: ["is_active"] }, { fields: ["display_order"] }]
      }
    );
  }
}
