import { DataTypes, Model } from "sequelize";

export default class UserShareFile extends Model {
  static initModel(sequelize) {
    UserShareFile.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        user_share_id: { type: DataTypes.BIGINT, allowNull: false },

        original_name: { type: DataTypes.STRING(255), allowNull: false },
        mime_type: { type: DataTypes.STRING(120), allowNull: false },
        size_bytes: { type: DataTypes.BIGINT, allowNull: false },

        // served from server static: /uploads/shares/filename.ext
        file_url: { type: DataTypes.STRING(500), allowNull: false }
      },
      {
        sequelize,
        modelName: "UserShareFile",
        tableName: "user_share_files",
        timestamps: true,
        indexes: [{ fields: ["user_share_id"] }]
      }
    );
  }
}
