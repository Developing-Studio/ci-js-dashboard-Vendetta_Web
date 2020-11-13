module.exports = {
    name: ['리로드', 'reload'],
    kr: "리로드",
    en: "reload",
    filename: "reload",
    description: "봇 개발자가 봇의 명령어들을 다시 불러올때 사용됩니다.",
    usage: "reload",
    type: "개발자",
    permisson: "Owner",
    run(client, message, args, misc) {
        if (!misc.config.manager.includes(message.author.id)) return;
        message.channel.send("Reloading...").then(async msg => {
            client.commands.forEach(i => {
                delete require.cache[require.resolve(`../commands/${i.filename}.js`)];
            });
            client.commands = new misc.Discord.Collection();
            const commandFiles = misc.fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for await (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                client.commands.set(command.name, command);
            };
            msg.edit("done!");
        });
    },
};