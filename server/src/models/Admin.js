import { DataTypes, Model } from "sequelize";

export default class Admin extends Model {
  static initModel(sequelize) {
    Admin.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(200), allowNull: false },
        name: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "Admin" }
      },
      {
        sequelize,
        modelName: "Admin",
        tableName: "admins",
        timestamps: true,
        indexes: [{ fields: ["email"] }]
      }
    );
  }
}
