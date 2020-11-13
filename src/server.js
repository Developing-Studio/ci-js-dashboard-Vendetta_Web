let express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    device = require('express-device'),
    session = require('express-session'),
    path = require('path'),
    config = require("./config.json"),
    reload = require("self-reload-json"),
    db = new reload("./index.json"),
    passport = require("passport"),
    DiscordStrategy = require('passport-discord').Strategy,
    twitchStrategy = require("passport-twitch-latest").Strategy;


//Passport Setting
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
//Twitch
passport.use(new twitchStrategy({
    clientID: config.Twitch.ClientID,
    clientSecret: config.Twitch.ClientSecret,
    callbackURL: config.Twitch.CallbackURL,
    scope: config.Twitch.Scopes
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));
//Discord Oauth2 Setting
passport.use(new DiscordStrategy({
    clientID: config.Discord.ClientID,
    clientSecret: config.Discord.ClientSecret,
    callbackURL: config.Discord.CallbackURL,
    scope: config.Discord.Scopes
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

//Discord Bots Starting
//WBOT
require("./bots/wbot(d)/index")(db)

//Twitch Bots Starting
//WBOT
require("./bots/wbot(t)/index")(db)
//Express Settings
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.engine('html', require('ejs').renderFile)
app.use(device.capture());
app.use(session({
    secret: config.Express.Secret,
    resave: config.Express.Resave,
    saveUninitialized: config.Express.SaveUninitialized
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('images'));
app.use(express.static('public'));
app.use(express.static('jquery'));
app.use(express.static('images'));
app.use(express.static('fonts'));

//Starting Web
app.listen(config.port, () => {
    console.log(`https://localhost:${config.Express.port}`);
});

//Router
require('./router/main')(app, passport, db);