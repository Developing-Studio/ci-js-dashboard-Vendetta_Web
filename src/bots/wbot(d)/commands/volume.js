module.exports = {
    name: ['볼륨', 'volume'],
    kr: "볼륨",
    en: "volume",
    filename: "volume",
    description: "음악의 볼륨을 조절합니다.",
    usage: "volume 30",
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
            if (!args[0]) {
                message.reply(`볼륨 : ${misc.music[message.guild.id].volume}`)
                return;
            }
            if (isNaN(args[0]) || !Number.isInteger(Number(args[0]))) {
                message.reply('올바른 볼륨을 적어주세요.')
                return;
            }
            if (args[0] == misc.music[message.guild.id].volume) {
                message.reply(`볼륨이 이미 ${args[0]} 입니다.`)
                return;
            }
            if (args[0] >= 150) {
                message.reply('볼륨은 150 이하로 설정 가능합니다.')
                return;
            }
            if (args[0] <= 0) {
                message.reply('볼륨은 0 이상으로 설정 가능합니다.')
                return;
            }
            volume(client, args[0], message, misc)
        } catch (e) {
            message.reply('볼륨 설정 도중 오류가 발생했습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.')
        }
    }
}

async function volume(client, vol, message, misc) {
    try {
        await misc.music[message.guild.id].queue[0].dispatcher.setVolume(vol / 100)
        misc.music[message.guild.id].volume = vol
        message.reply(`볼륨을 ${vol}로 설정했습니다.`)
    } catch (e) {
        message.reply(`볼륨 설정 도중 오류가 발생했습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
    }
}
