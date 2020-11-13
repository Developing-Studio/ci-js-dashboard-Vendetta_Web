module.exports = {
    name: ['재시작', 'restart'],
    kr: "재시작",
    en: "restart",
    filename: "restart",
    description: "일시정지한 곡이 있다면 재시작합니다.",
    usage: "restart",
    type: "음악",
    permisson: "Everyone",
    run(client, message, args, misc) {
        try {
            if (!misc.music[message.guild.id]) {
                misc.music[message.guild.id] = {
                    guild: message.guild.id,
                    channel: message.channel.id,
                    volume: 25,
                    queue: [],
                    connection: null
                }
            }
            if (message.member.voice.channel != message.guild.me.voice.channel) {
                message.reply('봇과 같은 채널에서 사용해주시길 바랍니다.')
                return;
            }
            if (misc.music[message.guild.id].queue[0]) {
                resume(client, args, message, misc)
            } else {
                message.reply('곡이 없습니다.')
            }
        } catch (e) {
            message.reply('재시작을 요청하던 도중 오류가 발생했습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.')
        }
    }
}

async function resume(client, args, message, misc) {
    try {
        await misc.music[message.guild.id].queue[0].dispatcher.resume()
        message.reply('곡을 재시작 했습니다.')
    } catch (e) {
        message.reply(`재시작을 도중 오류가 발생했습니다\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
    }
}