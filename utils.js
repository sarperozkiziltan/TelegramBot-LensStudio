const os = require("os");
const fs = require("fs");

const filePath = "./src/feedbacks.txt";

const addFeedback = function (feedback) {
  fs.appendFile(filePath, feedback + os.EOL, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("Feedback written to file successfully");
    }
  });
};

module.exports.addFeedback = addFeedback;
