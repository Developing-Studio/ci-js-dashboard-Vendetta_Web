module.exports = async (client, misc, message) => {
    try {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        try {
            if (command == "실험") {
                if (!misc.config.manager.includes(message.author.id)) return;
                client.emit("guildMemberAdd", message.member)
            }
            let commandfile = client.commands.find(i => i.name.includes(command))
            console.log(commandfile)
            if (!commandfile) return
            commandfile.run(client, message, args, misc);
        } catch (e) {
            console.log(e);
        };
    } catch (e) {
        misc.db.error.push(e)
        client.channels.cache.get("776766697087827988").send(`메세지 오류 : ${e.length}`)
    }
}