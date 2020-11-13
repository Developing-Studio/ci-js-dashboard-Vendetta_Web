module.exports = async (client, misc, member) => {
    try {
        let applyText = (canvas, text) => {
            let ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 10}px "Comic Sans"`;
            } while (ctx.measureText(text).width > canvas.width - 300);
            return ctx.font;
        };

        if (misc.db.guilds[message.guild.id].환영) return
        let channel = member.guild.channels.cache.get(misc.db.guilds[member.guild.id].환영);
        if (!channel) return;

        let canvas = Canvas.createCanvas(700, 250);
        let ctx = canvas.getContext('2d');

        let background = await Canvas.loadImage('./wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = `28px "Comic Sans"`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('반가워요,', canvas.width / 2.5, canvas.height / 3.5);

        ctx.font = applyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        let avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`${member}`, attachment);
    } catch (e) {
        misc.db.error.push(e)
        client.channels.cache.get("776766697087827988").send(`유저 환영 오류 : ${e.length}`)
    }
}