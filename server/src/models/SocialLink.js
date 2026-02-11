import { DataTypes, Model } from "sequelize";

export default class SocialLink extends Model {
  static initModel(sequelize) {
    SocialLink.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        platform: { type: DataTypes.STRING(60), allowNull: false }, // instagram, facebook, twitter, etc.
        url: { type: DataTypes.STRING(500), allowNull: false },
        description: { type: DataTypes.STRING(300), allowNull: true },

        icon_key: { type: DataTypes.STRING(60), allowNull: true },
        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

        click_count: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 }
      },
      {
        sequelize,
        modelName: "SocialLink",
        tableName: "social_links",
        timestamps: true,
        indexes: [{ fields: ["platform"] }, { fields: ["is_active"] }, { fields: ["display_order"] }]
      }
    );
  }
}
