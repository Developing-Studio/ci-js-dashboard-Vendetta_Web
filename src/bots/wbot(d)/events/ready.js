exports.run = async (client) => {
    console.log("ready");
    setpresence = () => {
        client.user.setPresence({ activity: { "name": config.playing, "type": config.playtype, "url": config.streamlink ? config.streamlink : null }, status: config.status });
        setInterval(() => {
            setpresence();
        }, 200000);
    };
    setpresence();
};