module.exports = {
    name: ["이블", 'eval', 'cmd', 'debug'],
    kr: "이블",
    en: "eval",
    filename: "eval",
    description: "봇 개발자가 테스트 할때 사용됩니다.",
    usage: "eval (command)",
    type: "개발자",
    permisson: "Owner",
    run(client, message, args, misc) {
        console.log(misc.config.manager)
        if (!misc.config.manager.includes(message.author.id)) return;
        try {
            let end = eval(args.join(" "));
            end = require("util").inspect(end);
            if (end.length > 1024) {
                end = end.slice(0, 1000) + `\n${end.length - 1000}more...`
            }
            const embed = new misc.Discord.MessageEmbed()
                .setTitle("Result")
                .setColor("#00ff00")
                .addField("Input", `\`\`\`js\n${args.join(" ")}\`\`\``)
                .addField("Output", `\`\`\`js\n${end}\`\`\``);
            message.reply(embed);
        } catch (e) {
            const embed = new misc.Discord.MessageEmbed()
                .setTitle("Error")
                .setColor("#ff0000")
                .setDescription(`\`\`\`js\n${e}\`\`\``);
            message.reply(embed);
        };
    },
};