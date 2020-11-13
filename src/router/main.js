module.exports = function (app, passport) {
    //passport router

    app.use(passport.initialize());
    app.use(passport.session());

    //Main Section

    app.get('/', (req, res) => {
        res.render('./index.ejs', {
            type: "메인",
            wtype: 0
        });
    });

    app.get('/info', (req, res) => {
        res.render('./info.ejs', {
            type: "제작 정보",
            wtype: 0
        });
    });

    app.get('/developer', (req, res) => {
        res.render('./developer.ejs', {
            type: "제작자 정보",
            wtype: 0
        });
    });

    //Discord Section

    app.get('/discord/main', (req, res) => {
        res.render('./discord/main.ejs', {
            type: "Discord",
            wtype: 4,
            login: null
        });
    });

    //Discord Login

    app.get('/discord/bot/login', passport.authenticate('discord'));

    app.get('/discord/bot/callback', passport.authenticate('discord', {
        failureRedirect: '/discord/bot/callback'
    }), function (req, res) {
        res.redirect('/discord/bot') // Successful auth
    });

    //Discord Bots

    app.get("/discord/bot", (req, res) => {
        res.render('./discord/bot.ejs', {
            type: "Discord",
            wtype: 4
        });
    })

    //Discord WBOT

    app.get("/discord/bot/wbot", isLogined, (req, res) => {
        platform(req, res, 'discord')
        res.render('./discord/bot/wbot.ejs', {
            type: 'Discord',
            wtype: 1,
            login: req.user ? req.user : null
        })
    })

    //Youtube Section

    app.get('/youtube/main', (req, res) => {
        res.render('./youtube/main.ejs', {
            type: "youtube",
            wtype: 4,
            login: null
        });
    });

    //Twitch Section

    app.get('/twitch/main', (req, res) => {
        res.render('./twitch/main.ejs', {
            type: "twitch",
            wtype: 4,
            login: null
        });
    });

    //Twitch Login
    app.get("/twitch/bot/login", passport.authenticate("twitch"));

    app.get("/twitch/bot/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function (req, res) {
        res.redirect("/twitch/bot");
    });

    //Twitch WBOT
    app.get("/twitch/bot/wbot", isLogined, (req, res) => {
        platform(req, res, 'twitch')
        res.json(
            { "data": req.user }
        )
    })
}

//Login Check

var isLogined = function (req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated())
        return next();
    res.redirect('./login');
};


//Platform req,res,Check

var platform = function (req, res, platform) {
    if (req.user.provider != platform) {
        req.logout();
        return res.redirect('./login');
    }
};

