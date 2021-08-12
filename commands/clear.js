module.exports = {
    name: 'clear',
    description: 'Clears Messages!',
    async execute(client, message, args, Discord){
        if(message.content.startsWith("!clear")){
            let messages = message.content.split(" ").slice(1).join("");
            message.delete();

            if(isNaN(messages)) return message.reply("Du hast keine Zahl sondern Buchstaben angegeben. :(").then(msg=>msg.delete({timeout:"5000"}));

            message.channel.bulkDelete(messages);

            message.channel.send("Ich habe " + messages + " nachrichten gelöscht.").then(msg=>msg.delete({timeout:"5000"}));
        }
    }
}