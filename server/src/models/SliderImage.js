import { DataTypes, Model } from "sequelize";

export default class SliderImage extends Model {
  static initModel(sequelize) {
    SliderImage.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        image_url: { type: DataTypes.STRING(500), allowNull: false },
        title: { type: DataTypes.STRING(200), allowNull: true },
        description: { type: DataTypes.STRING(500), allowNull: true },

        group_index: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // 2 per slide
        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

        click_count: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 }
      },
      {
        sequelize,
        modelName: "SliderImage",
        tableName: "slider_images",
        timestamps: true,
        indexes: [{ fields: ["group_index"] }, { fields: ["is_active"] }, { fields: ["display_order"] }]
      }
    );
  }
}
