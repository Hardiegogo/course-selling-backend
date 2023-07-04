const mongoose = require("mongoose");

interface IUser {
  username: string;
  password: string;
  purchasedCourses: string[];
}

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User; 
