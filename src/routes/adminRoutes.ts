const express = require("express");
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
const {
  getCourses,
  updateCourse,
  createCourse,
  adminSignup,
  adminLogin,
} = require("../controllers/adminControllers");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const router = express.Router();

const authenticateJwtForAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.ADMIN_SECRET,
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

router.post("/signup", adminSignup);

router.post("/login", adminLogin);

router.post("/courses", authenticateJwtForAdmin, createCourse);

router.put("/courses/:courseId", authenticateJwtForAdmin, updateCourse);

router.get("/courses", authenticateJwtForAdmin, getCourses);

module.exports = router;
