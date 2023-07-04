const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://chiraggps:<password>@chiragscluster.yviarut.mongodb.net/",
  { useUnifiedTopology: true, useNewUrlParser: true }
);
