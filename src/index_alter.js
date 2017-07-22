const Discord = require('discord.js');
const opus = require('opusscript');
const ffmpeg = require('ffmpeg');
const request = require('request');
const fs = require('fs');
const client = new Discord.Client();
const token = 'MzI5NTg5ODI4ODM4NDkwMTEy.DDUqIw.Z_7979z0kWp4vp3yXmjtDjZnvig';
const stream = require('stream');

client.on('ready', () => {
  console.log('Bot is ready.');
});

client.on(
  'message',
  message => {
    if (message.content === 'dzr') {
      message.channel.send('Wait for it...', {
        tts: false
      });
      var req = request('http://e-cdn-preview-5.deezer.com/stream/51afcde9f56a132096c0496cc95eb24b-4.mp3');
      req.on('data', () => {
        console.log("Fetching data...");
      });
      req.pipe(fs.createWriteStream('/usr/src/app/song.mp3'));
      req.on('end', () => {
        console.log("Fetch complete.");
        console.log("Joining channel...");
        message.member.voiceChannel.join()
          .then(connection => {
            return connection.playFile('/usr/src/app/song.mp3');
          })
          .then(dispatcher => {
            dispatcher.on('end', () => {
              console.log("Stream is done");
            });
            dispatcher.on('speaking', () => {
              console.log("Streaming");
            });
            dispatcher.on('start', () => {
              console.log("Stream starts");
            });
            dispatcher.on('error', console.error);
          })
          .catch(console.error);
      });
      return;
      var read = new stream.Readable();
      read.on('readable', () => {
        url: 'http://e-cdn-preview-5.deezer.com/stream/51afcde9f56a132096c0496cc95eb24b-4.mp3'
      });
      message.member.voiceChannel.join()
        .then(connection => {
          connection.playStream(
            read, {
              seek: 0,
              volume: 1
            }
          )
        })
        .catch(console.error);
      return;
      message.channel.send('Pong')
        .then(message => console.log(Sent message: $ {
          message.content
        }))
        .catch(console.error);
      return;
      const embed = new Discord.RichEmbed()
        .setTitle("This is your title, it can hold 256 characters")
        .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         /
        .setColor(0x00AE86)
        .setDescription("This is the main body of text, it can hold 2048 characters.")
        .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
        .setImage("http://i.imgur.com/yVpymuV.png")
        .setThumbnail("http://i.imgur.com/p2qNFag.png")
        /
         * Takes a Date object, defaults to current date.
         /
        .setTimestamp()
        .setURL("http://e-cdn-preview-5.deezer.com/stream/51afcde9f56a132096c0496cc95eb24b-4.mp3")
        .addField("This is a field title, it can hold 256 characters",
          "This is a field value, it can hold 2048 characters.")
        /
         * Inline fields may not display as inline if the thumbnail and/or image is too big.
         /
        .addField("Inline Field", "They can also be inline.", true)
        /
         * Blank field, useful to create some space.
         */
        .addBlankField(true)
        .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);

      message.channel.send({
          embed
        })
        .catch(console.error);
      return;
      message.channel.send('Pong')
        .then(message => console.log(Sent message: $ {
          message.content
        }))
        .catch(console.error);
      return;
      message.reply('https://www.deezer.com/album/302127')
        .then(msg => console.log('Sent a reply to ${msg.author}'))
        .catch(console.error);
    }
  }
);

client.on('authenticated', () => {
  console.log("Bot connected.");
});

client.login(token);