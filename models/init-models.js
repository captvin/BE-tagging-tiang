var DataTypes = require("sequelize").DataTypes;
var _allprovider = require("./allprovider");
var _data_tiang_r5 = require("./data_tiang_r5");
var _linedata = require("./linedata");
var _lineprovider = require("./lineprovider");
var _linetiang = require("./linetiang");
var _tagtiangbot_checklist_tiang_r5 = require("./tagtiangbot_checklist_tiang_r5");
var _tagtiangbot_checklist_tiang_r5_provider = require("./tagtiangbot_checklist_tiang_r5_provider");
var _tagtiangbot_nomor_tiang_r5 = require("./tagtiangbot_nomor_tiang_r5");
var _tagtiangbot_user_list = require("./tagtiangbot_user_list");

function initModels(sequelize) {
  var allprovider = _allprovider(sequelize, DataTypes);
  var data_tiang_r5 = _data_tiang_r5(sequelize, DataTypes);
  var linedata = _linedata(sequelize, DataTypes);
  var lineprovider = _lineprovider(sequelize, DataTypes);
  var linetiang = _linetiang(sequelize, DataTypes);
  var tagtiangbot_checklist_tiang_r5 = _tagtiangbot_checklist_tiang_r5(sequelize, DataTypes);
  var tagtiangbot_checklist_tiang_r5_provider = _tagtiangbot_checklist_tiang_r5_provider(sequelize, DataTypes);
  var tagtiangbot_nomor_tiang_r5 = _tagtiangbot_nomor_tiang_r5(sequelize, DataTypes);
  var tagtiangbot_user_list = _tagtiangbot_user_list(sequelize, DataTypes);


  return {
    allprovider,
    data_tiang_r5,
    linedata,
    lineprovider,
    linetiang,
    tagtiangbot_checklist_tiang_r5,
    tagtiangbot_checklist_tiang_r5_provider,
    tagtiangbot_nomor_tiang_r5,
    tagtiangbot_user_list,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
