var Client = require('mattermost-client');
// https://github.com/loafoe/mattermost-client

module.exports = function(botkit) {


  botkit.middleware.spawn.use(function(bot, next) {

    bot.api = new Client(botkit.config.mattermost.host,botkit.config.mattermost.group, botkit.config.mattermost.email, botkit.config.mattermost.password);
    bot.api.login();

    bot.api.onMessage(function(message) {

      botkit.ingest(bot, message);

    });

    bot.send = function(message, cb) {

      bot.api.postMessage(message,  message.channel);
      cb();
    }

    bot.reply = function(src, reply, cb) {

      // what part of src message do we need to set in reply?
      // reply.channel = src.channel;

      // make this a reply
      reply.root_id = src.data.id; // referring to a native field
      reply.channel = src.channel;

      bot.say(reply,cb);

    }

  });


  botkit.middleware.normalize.use(function(bot, message, next) {

    console.log('BOT RECEIVED A MESSAGE', message);

    // event type is in message.event
    message.type = message.event;

    // mattermost message content is in message.data
    message.text = message.data.message;
    message.user = message.data.user_id;
    message.channel = message.data.channel_id;

    console.log('NORMALIZED MESSAGE', message);

    next();

  });


  botkit.middleware.format.use(function(bot, message, platform_message, next) {

    // copy every key in message into platform_message
    for (var key in message) {
      platform_message[key] = message[key];
    }

    platform_message.channel_id = message.channel;
    platform_message.message = message.text;

    next();


  });


}
