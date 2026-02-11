import { DataTypes, Model } from "sequelize";

export default class Question extends Model {
  static initModel(sequelize) {
    Question.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        text: { type: DataTypes.TEXT, allowNull: false },
        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
      },
      {
        sequelize,
        modelName: "Question",
        tableName: "questions",
        timestamps: true,
        indexes: [{ fields: ["is_active"] }, { fields: ["display_order"] }]
      }
    );
  }
}
