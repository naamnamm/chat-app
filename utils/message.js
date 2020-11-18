const moment = require('moment');

function formatMessage(channel_name, user_name, message_text) {
  return {
    channel_name,
    user_name,
    message_text,
    post_time: moment().format('h:mm a'),
  };
}

module.exports = formatMessage;
