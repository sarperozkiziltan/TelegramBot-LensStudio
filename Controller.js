const TelegramBot = require("node-telegram-bot-api");

const utils = require("./utils");
const messageContents = require("./messageContents");
const users = require("./users");

const token = "5879285564:AAGouk4pRcQgLF-gkL3FVVnvQ2InShonQJU";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const user = users.userRegister(msg);

  if (msg.text == "/help") {
    bot.sendMessage(user.chatId, messageContents.HELP);
    user.state = null;
    return;
  }

  if (msg.text == "/restart") {
    bot.sendMessage(user.chatId, messageContents.RESTART);
    user.state = null;
    user.resetMessage();
    return;
  }

  if (msg.text == "/feedback") {
    bot.sendMessage(user.chatId, "Please send your feedback now");
    user.state = "feedback";
  } else if (user.state === "feedback") {
    console.log("Feedback received:", msg.text);
    utils.addFeedback(msg.text, user.chatId, user.firstName);
    bot.sendMessage(user.chatId, "Feedback received, thank you!");
    user.state = null;
    return;
  }

  if (msg.text == "/start") {
    user.resetMessage();
    bot.sendMessage(user.chatId, "Please enter your snapchat link");
    user.state = "pendingSnapchatLink";
  } else if (user.state == "pendingSnapchatLink") {
    bot.sendMessage(user.chatId, "Please enter your drive link");
    user.finalMessage.snapchatLink = msg.text;
    user.state = "pendingDriveLink";
  } else if (user.state == "pendingDriveLink") {
    bot.sendMessage(
      user.chatId,
      "Please enter improvements you had done in this version and submit F when you done"
    );
    user.finalMessage.driveLink = msg.text;
    user.state = "pendingImprovements";
  } else if (user.state == "pendingImprovements" && msg.text != "F") {
    user.finalMessage.improvements.push(msg.text);
  } else if (user.state == "pendingImprovements" && msg.text == "F") {
    bot.sendMessage(
      user.chatId,
      "Please enter work in progress elements you have in this version and submit F when you done"
    );
    user.state = "pendingWips";
  } else if (user.state == "pendingWips" && msg.text != "F") {
    user.finalMessage.wips.push(msg.text);
  } else if (user.state == "pendingWips" && msg.text == "F") {
    bot.sendMessage(user.chatId, "Please enter your project size");
    user.state = "pendingSize";
  } else if (user.state == "pendingSize") {
    user.finalMessage.size = msg.text;
    user.state = null;
    bot.sendMessage(
      user.chatId,
      users.createFormattedFinalMessage(user.finalMessage),
      { parse_mode: "HTML" }
    );
    user.resetMessage();
    return;
  }
});
