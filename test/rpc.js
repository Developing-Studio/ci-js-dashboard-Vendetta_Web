module.exports = {
    name: ['명령어1', '명령어2'],
    kr: "한국어",
    en: "english",
    filename: "commandsample",
    description: "샘플",
    usage: "sample",
    type: "개발자",
    permisson: "Owner",
    run(client, message, args, misc) {
        message.react('👍')
        const filter = (reaction, user) => {
            return ['👍'].includes(reaction.emoji.name) && !user.bot;
        };
        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '👍') {
                    message.edit("게임 진행중..")
                    let first = "";
                    let second = "";

                    message.author.send("가위바위보! (60초 안에 고르지 않으면 기권처리됩니다.)").then(msg => {
                        msg.react("✌️").then(r => {
                            msg.react("✊").then(r => {
                                msg.react("🖐️").then(start => {
                                    const filter = (reaction, user) => {
                                        return ['👍'].includes(reaction.emoji.name) && !user.bot;
                                    };
                                    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
                                        const reaction = collected.first();
                                        if (reaction.emoji.name === '✌️') {
                                            first = "가위"
                                        } else if (reaction.emoji.name === '✊') {
                                            first = "바위"
                                        } else if (reaction.emoji.name === '🖐️') {
                                            first = "보"
                                        }
                                        msg.reply(`${first}를 내셨습니다`)
                                    }).catch(collected => {
                                        first = "기권"
                                        msg.reply('기권하셨습니다.');
                                    });
                                })
                            })
                        })
                    })
                    reaction.users.cache.first().send("가위바위보!").then(msg => {
                        msg.react("✌️").then(r => {
                            msg.react("✊").then(r => {
                                msg.react("🖐️").then(start => {
                                    const filter = (reaction, user) => {
                                        return ['👍'].includes(reaction.emoji.name) && !user.bot;
                                    };
                                    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
                                        const reaction = collected.first();
                                        if (reaction.emoji.name === '✌️') {
                                            second = "가위"
                                        } else if (reaction.emoji.name === '✊') {
                                            second = "바위"
                                        } else if (reaction.emoji.name === '🖐️') {
                                            second = "보"
                                        }
                                        msg.reply(`${second}를 내셨습니다`)
                                    }).catch(collected => {
                                        second = "기권"
                                        msg.reply('기권하셨습니다.');
                                    });
                                })
                            })
                        })
                    })
                    setTimeout(() => {
                        let choice = ["비겼습니다", `${reaction.users.cache.first().tag}님이 승리하셨습니다.`, `${message.author.tag}님이 승리하셨습니다.`]
                        let end = ""
                        if (first == second) {
                            end = choice[0]
                        } else if (first == "기권") {
                            end = choice[1]
                        } else if (second == "기권") {
                            end = choice[2]
                        } else if (first == "보") {
                            if (second == "가위") {
                                end = choice[1]
                            } else if (second == "바위") {
                                end = choice[2]
                            }
                        } else if (first == "가위") {
                            if (second == "보") {
                                end = choice[2]
                            } else if (second == "바위") {
                                end = choice[1]
                            }
                        } else if (first == "바위") {
                            if (second == "가위") {
                                end = choice[1]
                            } else if (second == "보") {
                                end = choice[2]
                            }
                        }
                        message.edit(`결과는...`).then(m => {
                            setTimeout(() => {
                                m.edit(`${message.author}, ${reaction.users.cache.first()}\n${end}\n\n${message.author.tag}님의 선택 : ${first}\n${reaction.users.cache.first().tag}님의 선택 : ${second}`)
                            }, 5000);
                        })
                    }, 65000)
                }
            })
            .catch(collected => {
                message.reply('같이 할 유저를 구하지 못했습니다.');
            });
    },
};