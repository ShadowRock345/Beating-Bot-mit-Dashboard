console.log('Loading...')

const Discord = require('discord.js')

const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json' , 'utf8'))

const client = new Discord.Client({partials: ['MESSAGE','CHANNEL','REACTION']})

const http = require('http')

const host = 'localhost'
const port = 8000

const DisTube = require('distube')
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });
client.distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

require('discord-buttons')(client)

client.command = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

const messages = ["Hört @Beat Bot zu" , "Spielt Five Nights At Freddy's: Security Beach" ]
let current = 1
const reactionRolesConfig = JSON.parse(fs.readFileSync('reactionroles.json' , 'utf8'))

client.on('ready' , () => {
    console.log('Bot Logged in as ' + client.user.tag + '!')
    console.log('The Bot is on ' + client.guilds.cache.size + ' servers!')

})

client.on('message' , async (msg) => {
    if(msg.author.bot || !msg.guild) return
    if(!msg.author.bot && msg.guild){
        if(msg.content == '!test'){
            msg.channel.send('Test!')
            console.log(msg.member.user.tag + ' executed Command !test!')
        }else if(msg.content.startsWith('!avatar')){
            if(msg.mentions.users.first()){
                var user = msg.mentions.users.first()
                var attachment = new Discord.MessageAttachment(user.avatarURL())
                msg.reply(attachment)
            }else{
                var attachment = new Discord.MessageAttachment(msg.member.user.avatarURL())
                msg.reply(attachment)
            }
                console.log(msg.member.user.tag + ' executed Command !av!')
        }
        
    }
    
    if(msg.content.startsWith('!createReactionRole')){
        var args = msg.content.split(' ')
        if(args.length == 3){
            var emoji = args[1]
            var roleid = args[2]
            var role = msg.guild.roles.cache.get(roleid)
            if(!role){
                msg.reply('Die Rolle gibt es nicht')
                return
            }
            var embed = new Discord.MessageEmbed()
            .setTitle(`Klicke auf ${emoji}`)
            .setDescription(`Klicke auf ${emoji} um die Verifizierung zu starten. Dadurch verifizierst du dich als Mensch und erhältst die Rolle <@&${roleid}>`)
            .setColor("#333bab");

            var sendedMessage = await msg.channel.send(embed)
            sendedMessage.react(emoji)

            var toSave = {message: sendedMessage.id , emoji: emoji, role: roleid}
            reactionRolesConfig.reactions.push(toSave)

            fs.writeFileSync('reactionroles.json' , JSON.stringify(reactionRolesConfig))
        }else{
            msg.reply('!createReactionRole <emoji> <roleid>')
        }
    }
})

client.on('clickButton', async (button) => {
    if(button.id == 'dumbass') {
        button.defer()
        button.channel.send(`${button.clicker.user.tag} says no!`)
    }
})

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(`<html><body><h1>This is HTML</h1></body></html>`);
};
const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

client.on('messageReactionAdd' , (reaction, user) => {
    if(reaction.message.partial) reaction.fetch
    if(reaction.partial) reaction.fetch
    if(user.bot || !reaction.message.guild) return;

    for(let index = 0; index < reactionRolesConfig.reactions.length; index++){
        let reactionRole = reactionRolesConfig.reactions[index]

        if(reaction.message.id == reactionRole.message && reaction.emoji.name == reactionRole.emoji && !reaction.message.guild.members.cache.get(user.id).roles.cache.has(reactionRole.roleid)){
            reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole.role)
        }
    }
})

client.on("message", async (message) => {
    const prefix = '!'
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "playSong"){
        if(distube.isPlaying(message)){
            distube.stop(message);
        }
        distube.play(message, args.join(" "));

        let queue2 = distube.getQueue(message)
        var embedmusic = new Discord.MessageEmbed()
        .setTitle(`Aktuell gespielte Musik`)
        .setDescription(
            `${queue2.song}`
        )
        .setColor("#0055ff")
        .setThumbnail(message.author.avatarURL())
        .setTimestamp()
        .setFooter(message.guild.name);

        var sendedMessagemusic = await message.channel.send(embedmusic)
        sendedMessagemusic.react("⏭️")
        sendedMessagemusic.react("⏹️")
        sendedMessagemusic.react("🔀")
        sendedMessagemusic.react("🔁")

    }

    if (["repeatmusic", "loopmusic"].includes(command))
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stopmusic") {
        distube.stop(message);
        message.channel.send("Stopped the music!");
    }

    if(command == "maxlisteners"){
        distube.setMaxListeners(message, args[0])
        message.channel.send("Die Anzahl der Maximalen Zuhörer wurde auf " + args[1] + " gesetzt")
    }

    if(command == "volume"){
        distube.setVolume(message, args[0])
        message.channel.send("Volume was set to " + args[1])
    }

    if (command == "skipmusic")
        distube.skip(message);
    
    if (command == "pausemusic"){
        distube.pause(message);
    }

    if (command == "resumemusic") {
        distube.resume(message);
    }

    if(command == "addSong"){
        message.channel.send("Hier kommt noch eine Funktion, dass man Songs zur Queue hinzufügen kann!")
    }

    if(command == "playList"){
        distube.playlist(message);
    }

    if(command == "addList"){
        distube.add(message);
    }

    if (command == "musicqueue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Current queue filter: " + (filter || "Off"));
    }
    
});

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below with typing the number into the channel WITHOUT the prefix**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });


//client.login(process.env.token)
client.login(config.token)