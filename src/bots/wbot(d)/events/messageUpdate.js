module.exports = async (client, misc, o, n) => {
    try {
        if (o.author.bot) return;
        if (misc.db.guilds[o.guild.id].메세지수정) return
        let channel = o.guild.channels.cache.get(misc.db.guilds[o.guild.id].메세지수정)
        if (!channel) return
        let nc = n.content;
        var Attachment = (o.attachments).array();
        let files = "";
        Attachment.forEach(function (attachment) {
            files += `[${attachment.name}](${attachment.proxyURL})`;
        });
        if (nc.length > 1024) {
            await fs.writeFileSync('./messageupdate.txt', n.content);
            embed.attachFiles(['./messageupdate.txt']);
            nc = "글이 너무 길어 파일으로 첨부하였습니다.";
        };
        let embed = new Discord.MessageEmbed()
            .setTitle("메세지 수정 감지")
            .setAuthor(o.member.nickname ? o.member.nickname : o.member.user.username, o.author.displayAvatarURL())
            .setDescription(o.content ? o.content : "메세지가 없었습니다.")
            .addField("수정후", nc ? nc : "메세지가 없습니다.")
            .addField("파일", files ? files : "없음")
            .addField("수정자 유저아이디", o.author.id);
        channel.send(embed);
    } catch (e) {
        misc.db.error.push(e)
        client.channels.cache.get("776766697087827988").send(`메세지 수정 오류 : ${e.length}`)
    }
}