import { DataTypes, Model } from "sequelize";

export default class ButtonClick extends Model {
  static initModel(sequelize) {
    ButtonClick.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.STRING(80), allowNull: false },

        element_type: { type: DataTypes.STRING(60), allowNull: false }, // button, link, image, help, etc.
        label: { type: DataTypes.STRING(255), allowNull: true },
        page: { type: DataTypes.STRING(255), allowNull: true },

        x: { type: DataTypes.INTEGER, allowNull: true },
        y: { type: DataTypes.INTEGER, allowNull: true },

        meta: { type: DataTypes.JSON, allowNull: true }
      },
      {
        sequelize,
        modelName: "ButtonClick",
        tableName: "button_clicks",
        timestamps: true,
        indexes: [
          { fields: ["session_id"] },
          { fields: ["createdAt"] },
          { fields: ["element_type"] }
        ]
      }
    );
  }
}
