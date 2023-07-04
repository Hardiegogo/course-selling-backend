const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRouter=require('./routes/adminRoutes')
const userRouter=require('./routes/userRoutes')
const {errorLogger,customErrorHandler}=require("./middlewares/errorMiddleware")
require('./config/database')

app.use(cors());
app.use(bodyParser.json());
app.use('/admin',adminRouter)
app.use('/user',userRouter)
app.use(errorLogger);
app.use(customErrorHandler);


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
