const express = require("express");
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
const {
  getAllCourses,
  userLogin,
  userSignup,
  purchaseCourse,
  getPurchasedCourses,
} = require("../controllers/userControllers");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const router = express.Router();

const authenticateJwtForUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.USER_SECRET,
      (err: Error, verifiedToken: { username: string }) => {
        if (err) {
          res.status(401).send("authentication failed");
        } else {
          req.user = verifiedToken;
          next();
        }
      }
    );
  } else {
    res.status(401);
  }
};

// User routes
router.post("/signup", userSignup);

router.post("/login", userLogin);

router.get("/courses", authenticateJwtForUser, getAllCourses);

router.post("/courses/:courseId", authenticateJwtForUser, purchaseCourse);

router.get("/purchasedCourses", authenticateJwtForUser, getPurchasedCourses);

module.exports = router;
