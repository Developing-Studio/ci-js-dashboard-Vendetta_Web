module.exports = {
    name: ['일시정지', 'pause'],
    kr: "일시정지",
    en: "pause",
    filename: "pause",
    description: "재생중인 곡을 일시정지시킵니다.",
    usage: "pause",
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
                pause(client, args, message, misc)
            } else {
                message.reply('곡이 없습니다.')
            }
        } catch (e) {
            message.reply('일시정지를 요청하던 도중 오류가 발생했습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.')
        }
    }
}

async function pause(client, args, message, misc) {
    try {
        await misc.music[message.guild.id].queue[0].dispatcher.pause()
        message.reply('곡을 일시정지했습니다.')
    } catch (e) {
        message.reply(`일시정지 도중 오류가 발생했습니다\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
    }
}