const express = require("express");
import { Request, Response, ErrorRequestHandler } from "express";
import { NextFunction } from "express-serve-static-core";
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Admin = require("./models/adminModel");
const Course = require("./models/courseModel");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  next(err);
};
const customErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Something is broken in the server" });
};

app.use(cors());
app.use(bodyParser.json());
app.use(errorLogger);
app.use(customErrorHandler);

interface IAdmin {
  username: string;
  password: string;
  _id?: string;
}

interface IUser {
  username: string;
  password: string;
  purchasedCourses: string[];
  _id?: string;
}

interface ICourse {
  title: string;
  rating: number;
  description: string;
  published: boolean;
  price: number;
  imgLink: string;
  _id?: string;
}

const generatejwtForUser = (user: IUser): string => {
  return jwt.sign({ username: user.username }, process.env.USER_SECRET, {
    expiresIn: "2h",
  });
};

const generatejwtForAdmin = (admin: IAdmin): string => {
  return jwt.sign({ username: admin.username }, process.env.ADMIN_SECRET, {
    expiresIn: "2h",
  });
};

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

mongoose.connect(
  "mongodb+srv://chiraggps:chiraggps@chiragscluster.yviarut.mongodb.net/",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

// Admin routes
app.post("/admin/signup", async (req: Request, res: Response) => {
  const admin: IAdmin = req.body;
  const existingAdmin = await Admin.findOne({ username: admin.username });
  if (existingAdmin) {
    res.status(403).send("username already exists");
  } else {
    const newAdmin = new Admin(admin);
    await newAdmin.save();
    const authToken = generatejwtForAdmin(admin);
    res
      .status(201)
      .json({ message: "Admin created successfully", token: authToken });
  }
});

app.post("/admin/login", async (req: Request, res: Response) => {
  // logic to log in admin
  const admin = req.body;
  const existingAdmin = await Admin.findOne(admin);
  if (existingAdmin) {
    const token = generatejwtForAdmin(admin);
    res.json({ message: "Logged in successfully", token: token });
  } else res.status(404).send("User not found");
});

app.post(
  "/admin/courses",
  authenticateJwtForAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    // logic to create a course
    const course = new Course(req.body);
    await course
      .save()
      .then((course: ICourse) => {
        res.status(201).json({
          message: "Course created successfully",
          courseId: course._id.toString(),
        });
      })
      .catch((err: unknown) => {
        next(err);
      });
  }
);

app.put(
  "/admin/courses/:courseId",
  authenticateJwtForAdmin,
  async (req: Request, res: Response) => {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );
    if (course) {
      console.log(course);
      res.json({ message: "Course updated successfully", course: course });
    } else res.status(404).json({ message: "Course not found" });
  }
);

app.get(
  "/admin/courses",
  authenticateJwtForAdmin,
  async (req: Request, res: Response) => {
    // logic to get all courses
    const courses = await Course.find({});
    res.json(courses);
  }
);

// User routes
app.post("/users/signup", async (req: Request, res: Response) => {
  // logic to sign up user
  const user: IUser = req.body;
  const existingUser = await Admin.findOne({ username: user.username });
  if (existingUser) {
    res.status(403).send("username already exists");
  } else {
    user.purchasedCourses = [];
    const newUser = new User(user);
    await newUser.save();
    const authToken = generatejwtForUser(user);
    res
      .status(201)
      .json({ message: "User created successfully", token: authToken });
  }
});

app.post("/users/login", async (req: Request, res: Response) => {
  // logic to log in user
  const user = req.body;
  const existingUser = await User.findOne(user);
  if (existingUser) {
    const token = generatejwtForUser(user);
    res.json({ message: "Logged in successfully", token: token });
  } else res.status(404).send("User not found");
});

app.get(
  "/users/courses",
  authenticateJwtForUser,
  async (req: Request, res: Response) => {
    // logic to list all courses
    const courses = await Course.find({});
    res.json(courses);
  }
);

app.post(
  "/users/courses/:courseId",
  authenticateJwtForUser,
  async (req: Request, res: Response) => {
    // logic to purchase a course
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (course) {
      const user = await User.findOne({ username: req.user.username });
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
);

app.get(
  "/users/purchasedCourses",
  authenticateJwtForUser,
  async (req: Request, res: Response) => {
    // logic to view purchased courses
    const user = await User.findOne({ username: req.user.username }).populate(
      "purchasedCourses"
    );
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
