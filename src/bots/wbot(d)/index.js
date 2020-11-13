module.exports = async (db) => {
    /*
        Studing Disocrd Bot in
        https://discord.js.org/
        https://discordjs.guide/
    */
    let Discord = require("discord.js"),
        client = new Discord.Client(),
        fs = require('fs'),
        commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')),
        fonts = fs.readdirSync('./fonts').filter(file => file.endsWith('.ttf')),
        config = require("./settings/config.json"),
        Canvas = require("canvas"),
        moment = require("moment-timezone"),
        db = db,
        prefix = config.prefix;
    client.commands = new Discord.Collection()
    client._events = [];
    client.music = {};
    var music = client.music;

    loading = async () => {
        misc = {
            Discord: Discord,
            db: db.Discord.Wbot,
            prefix: prefix,
            fs: fs,
            config: config,
            music: music,
            moment: moment,
            canvas: Canvas,
            logs: ['메세지수정', '메세지삭제', '환영'],
            permissions: ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]
        };
        console.log("모듈 준비 끝");
        for await (let file of commandFiles) {
            let command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        };
        console.log("커맨드 로드 끝");
        fs.readdir('./events/', (err, files) => {
            if (err) return console.error;
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                let event = require(`./events/${file}`)
                let eventName = file.split('.')[0]
                client.on(eventName, event.bind(null, client, misc));
                client._events.push(eventName)
            })
        })
        console.log("이벤트 로드 끝")
        for await (let file of fonts) {
            console.log(file);
            Canvas.registerFont(`./fonts/${file}`, { family: 'Comic Sans' });
        };
        console.log("폰트 로드 끝");
    };
    await loading();

    client.login(config.token);
}