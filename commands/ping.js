module.exports = {
    name: 'ping',
    description: 'Writes you the actually Ping!',
    async execute(client, message, args, Discord){
        message.reply('Calculating ping...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            message.reply(`Bot Latency: ${ping}ms , API Latency: ${client.ws.ping}ms`)
            message.react("👍")
        })
    }
}