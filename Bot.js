const Discord = require("discord.js")
const npm = require("npm")
const client = new Discord.Client()
const ytdl = require("ytdl-core")
var badwords = []
// Insert a list of curse words in this list and the bot will warnings those who swear!
var cscore = 0
var pscore = 0
var chit = 0
var phit = 0
var On = 0
const PREFIX = '!'
var servers = {}
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})
client.on("message", msg => {
    let args = msg.content.substring(PREFIX.length).split(" ")
    var check = (msg.toString()).split(" ")
    var doo = badwords.some(word => check.includes(word))
    if (doo == true) {
        msg.reply("Watch your language")
    }
    if (On == 1) {
        if (msg.content == 's') {
            while (chit < 4) {
                if (cscore < 15) {
                    cscore += Math.floor((Math.random() * 11))
                }
                chit++
            }
            msg.reply('You: ' + pscore.toString() + ' Dealer: ' + cscore.toString())
            if (cscore > 21) {
                msg.reply('you win')
            } else {
                if (pscore > cscore) {
                    msg.reply('You win')
                }
                if (cscore > pscore) {
                    msg.reply('You lose')
                }
                if (cscore == pscore) {
                    msg.reply('Draw')
                }
            }
            On -= 1
        }
        if (msg.content === 'h') {
            if (phit < 4) {
                pscore += Math.floor((Math.random() * 11))
                phit++
                msg.reply('You: ' + pscore.toString() + ' Dealer: ' + cscore.toString())
                if (pscore > 21) {
                    msg.reply('You lose')
                    On -= 1
                } else {
                    msg.reply('Hit (h) or stand (s)?')
                }
            } else {
                msg.reply('You: ' + pscore.toString() + ' Dealer: ' + cscore.toString())
                msg.reply('Press (s) to stand')
            }
        }
    }
    switch (args[0]) {
        case 'help':
            msg.reply("Commands: !info, !help, !play, !slots, !blackjack, !kick, !ban, !skip, !stop")
            break;
        case 'info':
            msg.reply("Be advised, the Lucky 38 is not open to the general public. Trespassers will be shot. Thank you!")
            break;
        case 'blackjack':
            pscore += Math.floor((Math.random() * 11)) + Math.floor((Math.random() * 11))
            cscore += Math.floor((Math.random() * 11)) + Math.floor((Math.random() * 11))
            phit == 0
            chit == 0
            msg.reply('You: ' + pscore.toString() + ' Dealer: ' + cscore.toString())
            msg.reply("Hit (h) or stand (s)?")
            On += 1
            break;
        case 'slots':
            var Slot = []
            var options = ['🍒', '🍊', '🍉', '🍇']
            Slot.push(options[Math.floor((Math.random() * 4))])
            Slot.push(options[Math.floor((Math.random() * 4))])
            Slot.push(options[Math.floor((Math.random() * 4))])
            msg.reply('' + Slot)
            if ((Slot[0] == '🍒') && (Slot[1] == '🍒') && (Slot[2] == '🍒')) {
                msg.reply('YOU WIN')
            }
            if ((Slot[0] == '🍊') && (Slot[1] == '🍊') && (Slot[2] == '🍊')) {
                msg.reply('YOU WIN')
            }
            if ((Slot[0] == '🍉') && (Slot[1] == '🍉') && (Slot[2] == '🍉')) {
                msg.reply('YOU WIN')
            }
            if ((Slot[0] == '🍇') && (Slot[1] == '🍇') && (Slot[2] == '🍇')) {
                msg.reply('YOU WIN')
            } else {
                msg.reply('YOU LOSE')
            }
            break;
        case 'kick':
            if (!args[1]) {
                msg.reply("You need to specify a person")
            }
            const user = msg.mentions.users.first()
            if (user) {
                const member = msg.guild.member(user);
                if (member) {
                    if (msg.member.hasPermission("KICK_MEMBERS")) {
                        member.kick(`You were obliterated from the server`).then(() => {
                            msg.reply(`${user.tag} was obliterated`);
                        }).catch(err => {
                            msg.reply("I was unable to kick the member")
                            console.log(err);
                        });
                    } else {
                        msg.reply("You don't have permissions to do that")
                    }
                } else {
                    msg.reply("That user is not in this guild")
                }
            } else {
                msg.reply('That user is not in this guild')
            }
            break;
        case 'ban':
            if (!args[1]) {
                msg.reply("You need to specify a person");
                return;
            }
            if (user) {
                const member = msg.guild.member(user);
                if (member) {
                    if (msg.member.hasPermission("BAN_MEMBERS")) {
                        member.ban({
                            days: 7,
                            reason: 'Deserved it'
                        }).then(() => {
                            msg.reply(`${user.tag} was completely and utterly destroyed`);
                        }).catch(err => {
                            msg.reply("I was unable to ban the member")
                            console.log(err);
                        });
                    } else {
                        msg.reply("You don't have permissions to do that")
                    }
                } else {
                    msg.reply("That user is not in this guild")
                }
            } else {
                msg.reply('That user is not in this guild')
            }
            break;
        case 'play':
            function play(connection, msg) {
                var server = servers[msg.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {
                    filter: "audioonly"
                }));
                server.queue.shift();
                server.dispatcher.on("end", function () {
                    if (server.queue[0]) {
                        play(connection, msg);
                    } else {
                        connection.disconnect();
                    }
                })
            }
            if (!args[1]) {
                msg.reply("You need to use a link")
            }
            if (!msg.member.voice.channel) {
                msg.reply("You must be in a channel to play music")
                return;
            }
            if (!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }
            var server = servers[msg.guild.id]
            server.queue.push(args[1]);
            if (!msg.guild.VoiceConnection) msg.member.voice.channel.join().then(function (connection) {
                play(connection, msg)
            })
            break;

        case 'skip':
            var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.end()
                msg.channel.send("Skipped")
            }
            break;

        case 'stop':
            var server = servers[msg.guild.id];
            if (msg.guild.VoiceConnection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                console.log('stopped the queue')
            }
            if (msg.guild.connection) {
                msg.guild.VoiceConnection.disconnect();
            }
            break;
    }
})
client.login("NzIzMjI2MTI4MTY4Mzg2NjAy.Xuujpw.7rVm2rNzOmuMSNq7ngYNSZ-2eoA")
