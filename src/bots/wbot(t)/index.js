module.exports = async (db) => {
    const TwitchBot = require('twitch-bot'),
        config = require('./config.json'),
        querystring = require("querystring"),
        fetch = require("node-fetch"),
        moment = require("moment-timezone"),
        db = db.Twitch.Wbot;

    const Bot = new TwitchBot({
        username: config.botname,
        oauth: config.botoauth,
        channels: config.channels
    })

    const qs = querystring.stringify({
        first: 2
    });

    Bot.on('join', channel => {
        console.log(`Joined channel: ${channel}`)
    })

    Bot.on('error', err => {
        console.log(err);
    })

    Bot.on('message', message => {
        console.log(message)
        if (!db[message.room_id]) {
            db[message.room_id] = {
                autosay: {},
                badwords: []
            };
            db.save();
        };
        if (db[message.room_id].autosay[message.message]) {
            Bot.say(db[message.room_id].autosay[message.message][Math.floor(Math.random() * db[message.room_id].autosay[message.message].length)]);
        };
        if (db[message.room_id].badwords.some(i => message.message.includes(i))) {
            if (message.user_id == message.room_id || message.mod) return
            Bot.say(`/timeout ${message.username} 30 금지어 사용으로 30초 채팅금지`)
            Bot.say(`${message.username}님이 금지어를 사용하여 30초동안 채팅금지가 적용되었습니다.`)
            return;
        };
        if (!message.message.startsWith(config.prefix)) return;
        const args = message.message.slice(config.prefix.length).split(/ +/g);
        const command = args.shift().toLocaleLowerCase();
        if (command == '업타임') {
            const STREAMS_URL = `https://api.twitch.tv/kraken/streams/${message.room_id}`;
            const qUrl = `${STREAMS_URL}?${qs}`;

            const fetchArgs = {
                headers: {
                    'Accept': "application/vnd.twitchtv.v5+json",
                    "Client-ID": config.client_id
                }
            };

            fetch(qUrl, fetchArgs)
                .then(res => res.json())
                .then(data => {
                    if (data.stream == null) {
                        Bot.say("방송중이 아닙니다!");
                    } else {
                        let t2 = moment(),
                            t1 = moment(data.stream.created_at),
                            times = {
                                day: moment.duration(t2.diff(t1)).days(),
                                hour: moment.duration(t2.diff(t1)).hours(),
                                minute: moment.duration(t2.diff(t1)).minutes(),
                                second: moment.duration(t2.diff(t1)).seconds()
                            };
                        Bot.say(`방송 시작으로부터 ${times.day}일 ${times.hour}시간 ${times.minute}분 ${times.second}초 지났습니다.`);
                    };
                })
                .catch(err => console.error(err));
        } else if (command == "명령어") {
            if (message.user_id !== message.room_id && !message.mod) return Bot.say("당신에겐 권한이 없습니다!");
            if (!args[0]) return Bot.say("명령어 사용법을 다시 확인해주세요!");
            if (args[0] == "추가") {
                if (args.length < 2) return Bot.say("추가할 명령어와 응답을 함께 적어주세요");
                let com = args[1];
                let rep = args.slice(2).join(" ");
                if (rep.startsWith("/")) return Bot.say("명령어에 대한 응답은 /로 시작할수 없습니다.");
                if (!db[message.room_id].autosay[com]) {
                    db[message.room_id].autosay[com] = [rep];
                } else if (db[message.room_id].autosay[com].includes(rep)) {
                    Bot.say("이미 있는 명령어에 대한 응답입니다.");
                } else {
                    db[message.room_id].autosay[com].push(rep);
                };
                db.save();
                Bot.say("　" + args[1] + "에 대한 응답을 저장했습니다!");
            } else if (args[0] == "제거") {
                let com = args[1];
                let rep = args.slice(2).join(" ");
                if (args.length < 2) return Bot.say("제거할 명령어와 그 명령어에 대한 응답을 함께 적어주세요");
                if (!db[message.room_id].autosay[com]) return Bot.say("없는 명령어입니다.");
                if (!db[message.room_id].autosay[com].includes(rep)) return Bot.say("없는 명령어입니다.");
                const idx = db[message.room_id].autosay[com].indexOf(rep);
                if (idx > -1) db[message.room_id].autosay[com].splice(idx, 1);
                if (db[message.room_id].autosay[com].length == 0) {
                    delete db[message.room_id].autosay[com];
                };
                db.save();
                Bot.say("　" + args[1] + "에 대한 응답을 삭제했습니다!");
            }
        } else if (command == "금지어") {
            if (message.user_id !== message.room_id && !message.mod) return Bot.say("당신에겐 권한이 없습니다!");
            if (!args[0]) return Bot.say("명령어 사용법을 다시 확인해주세요!");
            if (args[0] == "추가") {
                if (args.length < 1) return Bot.say("추가할 금지어를 함께 적어주세요");
                let rep = args.slice(1).join(" ");
                if (db[message.room_id].badwords.includes(rep)) return Bot.say("이미 있는 금지어입니다.");
                db[message.room_id].badwords.push(rep);
                db.save();
                Bot.say("　" + args[1] + "를 금지어로 추가했습니다!");
            } else if (args[0] == "제거") {
                let rep = args.slice(1).join(" ");
                if (args.length < 1) return Bot.say("제거할 금지어를 함께 적어주세요");
                if (!db[message.room_id].badwords.includes(rep)) return Bot.say("없는 금지어입니다.");
                const idx = db[message.room_id].badwords.indexOf(rep);
                if (idx > -1) db[message.room_id].badwords.splice(idx, 1);
                db.save();
                Bot.say("　" + args[1] + "를 금지어에서 삭제했습니다!");
            };
        } else if (command == "test") {
            console.log(message)
        };
    })
}