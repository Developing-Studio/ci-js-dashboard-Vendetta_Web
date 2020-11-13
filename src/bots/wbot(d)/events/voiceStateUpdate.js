module.exports = async (client, misc, o, n) => {
    try {
        if (o.member.user.bot) return
        if (!o.channelID) {
            let embed = new Discord.MessageEmbed()
                .setTitle("통화방 입장 감지")
        } else if (!n.channelID) {
            let embed = new Discord.MessageEmbed()
                .setTitle("통화방 퇴장 감지")
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle("통화방 이동 감지")
        }
        console.log(o)
        console.log("================")
        console.log(n)
    } catch (e) {
        misc.db.error.push(e)
        client.channels.cache.get("776766697087827988").send(`보이스 스텟 오류 : ${e.length}`)
    }
}