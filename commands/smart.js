const { MessageButton } = require("discord-buttons")

module.exports = {
    name: 'smart buttons',
    description: 'uses the buttons of the discord api',
    async execute(client, message, args, Discord){

        const embed = new Discord.MessageEmbed()
        .setTitle("Are you smart with buttons?")
        .setColor("BLUE")

        const yes = new MessageButton()
        .setStyle("purple")
        .setLabel('Yes')
        .setID("smart")

        const no = new MessageButton()
        .setStyle("red")
        .setLabel("No")
        .setID("dumbass")

        message.channel.send("Hello", {
            buttons: [yes, no],
            embed: embed
        })

    }
}