const users = new Array();
const URL = require("url").URL;

class User {
  constructor(chatId, firstName) {
    this.chatId = chatId;
    this.firstName = firstName;
    this.state = null;
    this.resetMessage();
    users.push(this);
  }
  resetMessage() {
    this.finalMessage = {
      snapchatLink: null,
      driveLink: null,
      improvements: [],
      wips: [],
      size: null,
    };
  }
}

const userRegister = function (msg) {
  const chatId = msg.chat.id;
  const first_name = msg.from.first_name;

  let user = users.find((user) => user.chatId === chatId);
  if (user) {
    return user;
  } else {
    user = new User(chatId, first_name);
    return user;
  }
};

const separator =
  "\n_____________________________________________________________________\n";

const createFormattedFinalMessage = function (finalMessage) {
  return (
    createLinkFormatted(finalMessage.snapchatLink, "Snapchat Link") +
    separator +
    createLinkFormatted(finalMessage.driveLink, "Drive Link") +
    (finalMessage.improvements.length > 0
      ? separator + "Improvements:\n✅"
      : "") +
    finalMessage.improvements.join("\n✅") +
    (finalMessage.wips.length > 0 ? separator + "Wips:\n🛠" : "") +
    finalMessage.wips.join("\n🛠") +
    separator +
    "Project size: " +
    finalMessage.size +
    separator +
    ""
  );
};

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

const createLinkFormatted = function (text, replacementText) {
  if (stringIsAValidUrl(text)) {
    return '<a href="' + text + '">' + replacementText + "</a>";
  } else {
    return replacementText;
  }
};

module.exports = { userRegister, createFormattedFinalMessage };
