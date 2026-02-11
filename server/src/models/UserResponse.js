import { DataTypes, Model } from "sequelize";

export default class UserResponse extends Model {
  static initModel(sequelize) {
    UserResponse.init(
      {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        session_id: { type: DataTypes.STRING(80), allowNull: false },

        question_id: { type: DataTypes.BIGINT, allowNull: true },
        question_text: { type: DataTypes.TEXT, allowNull: true },

        response_text: { type: DataTypes.TEXT("long"), allowNull: false },
        word_count: { type: DataTypes.INTEGER, allowNull: true },
        char_count: { type: DataTypes.INTEGER, allowNull: true },

        // admin management
        is_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        admin_notes: { type: DataTypes.TEXT, allowNull: true }
      },
      {
        sequelize,
        modelName: "UserResponse",
        tableName: "user_responses",
        timestamps: true,
        indexes: [
          { fields: ["session_id"] },
          { fields: ["question_id"] },
          { fields: ["is_reviewed"] },
          { fields: ["createdAt"] }
        ]
      }
    );
  }
}
