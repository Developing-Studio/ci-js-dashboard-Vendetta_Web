module.exports = {
    name: ['킥', 'kick'],
    kr: "킥",
    en: "kick",
    description: "서버에서 유저를 추방할때 사용됩니다.",
    usage: "킥 @유저",
    type: "관리자",
    filename: "kick",
    permisson: "Kick_Member",
    async run(client, message, args, misc) {
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("권한이 부족합니다!\n요구 권한 : 유저를 킥할 권한")
        if (!message.mentions.members) return message.reply("킥할 유저를 함께 언급해주세요")
        let failed = []
        for (i in message.mentions.members.array()) {
            try {
                await message.mentions.members.array()[i].kick()
            } catch (e) {
                failed.push(`\`${message.mentions.members.array()[i].nickname ? message.mentions.members.array()[i].nickname : message.mentions.members.array()[i].user.username}\``)
            }
        }
        let fail = failed.join(",")
        if (fail.length > 1600) {
            fail = fail.slice(0, 1600) + `\n${end.length - 1600}more...`
        }
        let embed = new misc.Discord.MessageEmbed()
            .setTitle("킥 성공")
            .setDescription(`\`킥하지 못한 유저들\`\n\n${failed ? fail : "없음"}`)
        message.reply(embed)
    },
};