module.exports = {
	name: ['핑', 'ping'],
	kr: "핑",
	en: "ping",
	description: '봇에 대한 응답속도를 확인합니다.',
	usage: "핑",
	type: "기본",
	filename: "ping",
	permission: "Everyone",
	run(client, message, args, misc) {
		message.channel.send("핑?").then(msg => {
			let ping = msg.createdTimestamp - message.createdTimestamp
			let embed = new misc.Discord.MessageEmbed()
				.setTitle("📊퐁")
				.addField("💬메세지 응답속도", ping)
				.addField("🤖API 응답속도", client.ws.ping)
			msg.edit(null, embed)
		})
	},
};