const mongoose = require("mongoose");

interface IAdmin {
  username: string;
  password: string;
}

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin