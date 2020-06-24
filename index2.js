const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./scores.sqlite');

client.on("ready", () => {
  // Check if the table "points" exists.
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, points INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // And then we have two prepared statements to get and set the score data.
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, points) VALUES (@id, @user, @points);");
});

client.on('message', message => {
  if (message.author.bot) return;
  let score;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Command-specific code here!
  if(command === 'points') {
    const baitUser = message.mentions.users.first();
    score = client.getScore.get(baitUser.id);
    if (!score) {
      score = { id: `${message.author.id}`, user: message.author.id, points: 0}
    }
    if (score.points == 1) {
      return message.reply(`${baitUser.username} has tried to bait someone ${score.points} time.`);
    }
    else {
      return message.reply(`${baitUser.username} has tried to bait someone ${score.points} times.`);
    }
  }

  if(command === 'bait') {
    const baitUser = message.mentions.users.first();
    score = client.getScore.get(baitUser.id);
    if (!score) {
      score = { id: `${message.author.id}`, user: message.author.id, points: 0}
    }
    score.points++;
    client.setScore.run(score);
    return message.reply(`${baitUser.username} has failed to catch anyone. This is your ${score.points} time.`);
  }
});

client.login(config.token);