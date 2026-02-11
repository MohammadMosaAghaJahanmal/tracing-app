import { DataTypes, Model } from "sequelize";

export default class Story extends Model {
  static initModel(sequelize) {
    Story.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING(220), allowNull: false },
        content_html: { type: DataTypes.TEXT("long"), allowNull: false },
        category: { type: DataTypes.STRING(80), allowNull: true },
        author: { type: DataTypes.STRING(120), allowNull: true },

        read_time_min: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        is_published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
      },
      {
        sequelize,
        modelName: "Story",
        tableName: "stories",
        timestamps: true,
        indexes: [{ fields: ["is_published"] }, { fields: ["display_order"] }, { fields: ["category"] }]
      }
    );
  }
}
