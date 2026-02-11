import Admin from "./Admin.js";
import UserTracking from "./UserTracking.js";
import ButtonClick from "./ButtonClick.js";
import UserResponse from "./UserResponse.js";
import UserLiveText from "./UserLiveText.js";
import Question from "./Question.js";
import SliderImage from "./SliderImage.js";
import SocialLink from "./SocialLink.js";
import Story from "./Story.js";
import ShareRequest from "./ShareRequest.js";
import UserShare from "./UserShare.js";
import UserShareFile from "./UserShareFile.js";


export const initModels = (sequelize) => {
  Admin.initModel(sequelize);

  UserTracking.initModel(sequelize);
  ButtonClick.initModel(sequelize);
  UserResponse.initModel(sequelize);
  UserLiveText.initModel(sequelize);
  ShareRequest.initModel(sequelize);
  UserShare.initModel(sequelize);
  UserShareFile.initModel(sequelize);


  Question.initModel(sequelize);
  SliderImage.initModel(sequelize);
  SocialLink.initModel(sequelize);
  Story.initModel(sequelize);

  // relationships (session-based)
  UserTracking.hasMany(ButtonClick, { foreignKey: "session_id", sourceKey: "session_id" });
  ButtonClick.belongsTo(UserTracking, { foreignKey: "session_id", targetKey: "session_id" });

  UserTracking.hasMany(UserResponse, { foreignKey: "session_id", sourceKey: "session_id" });
  UserResponse.belongsTo(UserTracking, { foreignKey: "session_id", targetKey: "session_id" });

  UserTracking.hasMany(UserLiveText, { foreignKey: "session_id", sourceKey: "session_id" });
  UserLiveText.belongsTo(UserTracking, { foreignKey: "session_id", targetKey: "session_id" });

  ShareRequest.hasMany(UserShare, { foreignKey: "share_request_id" });
  UserShare.belongsTo(ShareRequest, { foreignKey: "share_request_id" });

  UserShare.hasMany(UserShareFile, { foreignKey: "user_share_id", as: "files" });
  UserShareFile.belongsTo(UserShare, { foreignKey: "user_share_id" });

};
