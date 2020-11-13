module.exports = async (client, misc, message) => {
    try {
        if (message.author.bot) return;
        if (misc.db.guilds[message.guild.id].메세지삭제) return
        let channel = message.guild.channels.cache.get(misc.db.guilds[message.guild.id].메세지삭제)
        if (!channel) return
        var entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first());
        var user = "";
        var Attachment = (message.attachments).array();
        let files = "";
        Attachment.forEach(function (attachment) {
            files += `[${attachment.name}](${attachment.proxyURL})`;
        });
        if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (moment(message.createdTimestamp).tz('America/Los_Angeles').format("x") >= (moment(Date.now()).tz('America/Los_Angeles').format('x') - 5000))
            && (entry.extra.count >= 1)) {
            user = message.guild.members.cache.get(entry.executor.id);
        } else {
            user = message.member;
        }
        let embed = new Discord.MessageEmbed()
            .setTitle("메세지 수정 감지")
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(message.content)
            .addField("파일", files ? files : "없음")
            .addField("전송자", message.member.nickname ? message.member.nickname : message.author.username)
            .addField("전송자 유저아이디", message.author.id)
            .addField("삭제자", user.nickname ? user.nickname : user.user.username)
            .addField("삭제자 유저아이디", user.user.id);
        channel.send(embed);
    } catch (e) {
        misc.db.error.push(e)
        client.channels.cache.get("776766697087827988").send(`메세지 삭제 오류 : ${e.length}`)
    }
}