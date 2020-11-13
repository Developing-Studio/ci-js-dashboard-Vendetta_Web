const ytsearch = require('yt-search')
const ytdl = require('ytdl-core')
module.exports = {
    name: ['재생', 'play'],
    kr: "재생",
    en: "play",
    filename: "play",
    description: "유튜브에서 곡을 검색하여 재생합니다.",
    usage: "play 천마 untitled project(妓生)",
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
            if (!message.member.voice.channel) {
                message.reply('음성채팅방에 먼저 들어가주세요.')
                return;
            }
            if (!args[0]) {
                message.reply('재생할 곡을 명령어와 함께 언급해주세요.')
                return;
            }
            addqueue(client, args, message, misc)
        } catch (e) {
            console.log(e)
            message.reply(`곡을 신청하던 도중 오류가 발생하였습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
        }
    }
}
async function addqueue(client, args, message, misc) {
    let video = await ytdl.validateURL(args[0]);
    if (!video) {
        return search(client, args, message, misc)
    }

    let info = await ytdl.getInfo(args[0]);

    if (!misc.music[message.guild.id].connection) {
        misc.music[message.guild.id].connection = await message.member.voice.channel.join();
    } else {
        if (message.member.voice.channel != message.guild.me.voice.channel) {
            message.reply('봇과 같은 통화방에서 사용하시길 바랍니다.')
            return;
        }
    }
    misc.music[message.guild.id].queue.push({
        title: info.videoDetails.title,
        request: message.author.id,
        thumbnail: `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`,
        length: info.videoDetails.lengthSeconds,
        url: args[0],
        requester: message.author.id
    })


    if (!misc.music[message.guild.id].queue[0].dispatcher) {
        play(client, args, message, misc)
    } else {
        message.reply('요청을 성공하였습니다.')
    }
}

async function play(client, args, message, misc) {
    try {
        misc.music[message.guild.id].queue[0].dispatcher = await misc.music[message.guild.id].connection.play(ytdl(misc.music[message.guild.id].queue[0].url, { filter: 'audioonly' }))
        await misc.music[message.guild.id].queue[0].dispatcher.setVolume(misc.music[message.guild.id].volume / 100)
        message.channel.send(`현재 재생중인 곡 ${misc.music[message.guild.id].queue[0].title}\n신청자 : <@!${misc.music[message.guild.id].queue[0].requester}>`)
        misc.music[message.guild.id].queue[0].dispatcher.once('finish', () => {
            end(client, args, message, misc)
        })
    } catch (e) {
        console.log(e)
        message.reply(`곡 재생을 시도하던 도중 에러가 발생하였습니다\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
    }
}
async function end(client, args, message, misc) {
    try {
        if (misc.music[message.guild.id].queue.length > 1) {
            song = await misc.music[message.guild.id].queue.shift()
            play(client, args, message, misc)
        } else {
            message.channel.send('모든 곡을 재생하였습니다.\n뮤직기능을 종료합니다.')
            misc.music[message.guild.id].queue[0].dispatcher.destroy();
            misc.music[message.guild.id].queue = []
            misc.music[message.guild.id].connection = null
            message.guild.me.voice.channel.leave();
        }
    } catch (e) {
        message.reply(`곡 종료 도중 에러가 발생하였습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
    }
}

async function search(client, args, message, misc) {
    const msg = await message.channel.send(`Searching for ${args.join(" ")}`);
    ytsearch(args.join(" "), async (err, res) => {
        if (err) return message.reply(`곡을 검색하던 도중 오류가 발생하였습니다.\nhttp://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
        if (!res.videos[0]) return message.reply(`곡을 찾을 수 없습니다.\n혹시 버그라고 생각되신다면, http://vendetta.tk/invite 에서 오류를 신고해주시길 바랍니다.`)
        msg.delete();
        let videos = res.videos.slice(0, 10);
        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** ${videos[i].title}\n`;
        }
        resp += `\n<@${message.author.id}> **\n\`1~${videos.length}\`**\n원하시는 곡의 번호를 적어주세요`
        const infomsg = await message.channel.send(`🔎 \`\`${args.join(" ")}에 대한 검색결과입니다.\`\`\n${resp}`);
        const filter = (m) => {
            if (m.author.id === message.author.id) {
                if (m.content.toLowerCase().startsWith("c") || m.content.toLowerCase().startsWith("$재생")) {
                    return true;
                } else if (!isNaN(m.content) && m.content < videos.length + 1 && m.content > 0 && m.author.id == message.author.id) {
                    return true;
                }
            }
        }
        const collector = message.channel.createMessageCollector(filter);
        collector.videos = videos;
        collector.once('collect', function (m) {
            infomsg.delete();
            if (m.content.toLowerCase().startsWith("$재생")) {
                message.reply("검색을 취소했습니다.")
                return
            }
            if (m.content.toLowerCase().startsWith("c")) {
                message.reply("검색을 취소했습니다.")
                return
            }
            addqueue(client, [this.videos[parseInt(m.content) - 1].url], message, misc)
        });
    });
}