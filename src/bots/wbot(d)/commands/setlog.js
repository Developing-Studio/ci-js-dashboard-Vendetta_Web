module.exports = {
    name: ['로그설정', 'setlog'],
    kr: "로그설정",
    en: "setlog",
    filename: "setlog",
    description: "로그를 설정합니다",
    usage: `로그설정 로그이름\n\n로그설정 메세지삭제\n로그설정 메세지삭제 #채널\n\n\n**로그 목록**\n[메세지삭제,메세지수정,환영]`,
    type: "관리자",
    permisson: "MANAGE_CHANNELS",
    run(client, message, args, misc) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply("당신은 권한이 없습니다.")
        if (!args[0]) return message.reply("명령어를 잘못 사용하셨습니다.\n도움말을 다시 확인해주세요.")
        if (!misc.logs.includes(args[0])) return message.reply("없거나 지원되지 않는 로그입니다.")
        let channel = message.mentions.channels.first() ? message.mentions.channels.first() : message.channel
        if (!channel.type == "text") return message.reply("로그는 메세지 채널에만 가능합니다.")
        if (!misc.db.guilds[message.guild.id]) {
            misc.db.guilds[message.guild.id] = {}
        }
        misc.db.guilds[message.guild.id][args[0]] = channel.id
        misc.db.save()
        message.reply(`${args[0]} 로그를 ${channel}로 지정하였습니다.`)
    },
};