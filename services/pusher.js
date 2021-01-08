const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1135012",
  key: "0e504c7ddcf5f680ebea",
  secret: "13180332979ab2c16011",
  cluster: "us2",
  useTLS: true
});

module.exports = pusher;