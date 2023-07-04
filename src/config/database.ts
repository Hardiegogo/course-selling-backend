const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://chiraggps:chiraggps@chiragscluster.yviarut.mongodb.net/",
  { useUnifiedTopology: true, useNewUrlParser: true }
);
