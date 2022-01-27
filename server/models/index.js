const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require('./user.model');
db.userRole = require('./role.model');

db.USER_ROLES = ["user", "admin"];

module.exports = db;