const moment = require('moment');

function formatMessage(channel_name, username, text, created_at) {
  console.log(channel_name, username, text, created_at)
  return {
    channel_name,
    username,
    text,
    created_at
  };
}

module.exports = formatMessage;
