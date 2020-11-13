module.exports = {
    name: ['채팅청소', 'clear'],
    kr: "채팅청소",
    en: "clear",
    description: "채팅을 청소합니다.",
    usage: "채팅청소 20",
    type: "관리자",
    filename: "clear",
    permisson: "MANAGE_MESSAGES",
    async run(client, message, args, misc) {
        try {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("권한이 부족합니다!\n요구 권한 : 채팅 관리 권한")
            if (!args[0]) return message.reply("지울 메세지의 양을 함께 적어주세요.")
            if (isNaN(Number(args[0])) || !Number.isInteger(Number(args[0]))) return message.reply("잘못된 값입니다.")
            if (Number(args[0]) > 100 || Number(args[0]) < 1) return message.reply("채팅청소는 2~100개의 채팅만 지울수 있습니다.")
            message.channel.bulkDelete(args[0])
            message.reply("채팅청소가 완료되었습니다.").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            })
        } catch (e) {
            misc.db.error.push(e)
            message.reply(`에러발생\n제작자에게 에러번호를 전달해주세요!\n\n에러번호 : ${misc.db.error.length - 1}`)
        }
    },
};