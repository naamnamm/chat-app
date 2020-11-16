const moment = require('moment');

function formatMessage(channel, username, text) {
  return {
    channel,
    username,
    text,
    time: moment().format('h:mm a'),
  };
}

module.exports = formatMessage;
