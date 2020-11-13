module.exports = {
    name: ['도움', '도움말', 'help'],
    kr: "도움말",
    en: "help",
    description: "봇에 대한 명령어를 알려줍니다.",
    usage: "도움",
    type: "기본",
    filename: "help",
    permisson: "Everyone",
    run(client, message, args, misc) {
        if (!args[0]) {
            let common = ''
            let manage = ''
            let music = ''
            let owner = ''
            let unknown = ''
            client.commands.forEach(i => {
                console.log(i)
                if (i.type == "기본") {
                    common += `,\`${i.name[0]}\``;
                } else if (i.type == "관리자") {
                    manage += `,\`${i.name[0]}\``;
                } else if (i.type == "개발자") {
                    owner += `,\`${i.name[0]}\``;
                } else if (i.type == "음악") {
                    music += `,\`${i.name[0]}\``;
                } else {
                    unknown += `,\`${i.name[0]}\``;
                };
            })
            let embed = new misc.Discord.MessageEmbed()
                .setTitle("명령어 모음")
                .setDescription("WBOT의 사진에 사용된폰트들은 [구글의 Noto Serif](https://www.google.com/get/noto/)를 사용하였습니다.")
                .addField("기본", common.slice(1))
                .addField("관리자", manage.slice(1))
                .addField("음악", music.slice(1))
                .addField("개발자", owner.slice(1))
                .setFooter(`원하시는 도움말에 대한 정보는\n\`${misc.prefix}명령어\` 를 통해 확인하실수 있습니다.`);
            if (unknown) {
                embed.addField("지정되지 않음", unknown.slice(1))
            };
            message.reply(embed);
        } else {
            let command = client.commands.find(i => i.name.includes(args[0]))
            if (!command) return message.reply("없는 명령어입니다.");
            let embed = new misc.Discord.MessageEmbed()
                .setTitle(command.name[0])
                .addField("설명", command.description)
                .addField("사용법", command.usage)
                .addField("명령어 권한", command.permisson)
                .addField("명령어 분류", command.type);
            message.reply(embed);
        };
    },
};