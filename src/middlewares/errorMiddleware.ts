import {ErrorRequestHandler } from "express";

const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  next(err);
};
const customErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Something is broken in the server" });
};


module.exports={errorLogger,customErrorHandler}