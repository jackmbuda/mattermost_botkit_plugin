var Botkit = require('botkit');
require('./mattermost.js')(Botkit);

var controller = Botkit({
  mattermost: {
      host: process.env.MATTERMOST_HOST,
      group: process.env.MATTERMOST_GROUP,
      email: process.env.MATTERMOST_EMAIL,
      password: process.env.MATTERMOST_PASSWORD,
  }
});

controller.hears('hello','message',function(bot, message) {
  bot.reply(message,'heard it!');
})
