const mongoose = require("mongoose");

interface ICourse {
  title: string;
  rating: number;
  description: string;
  published: boolean;
  price: number;
  imgLink: string;
}

const CourseSchema = new mongoose.Schema({
  title: String,
  rating: Number,
  description: String,
  published: Boolean,
  price: Number,
  imgLink: String,
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
