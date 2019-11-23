/*
Anti-theft System Server v1.0
©2019
*/

const basicAuth = require('basic-auth');

const version = "1.0";

let devices = {
    "abc": {
        password: "abc",
        sender: "1593379"
    },
    client2: {
        password: "passwd2",
        sender: "sender2"
    },
    "1593379": {
        password: "843001",
        alarmActivated: 0,
        alarmDeactivated: 0,
        locked: false
    },
    sender2: {
        password: "passwd4",
        alarmActivated: 0,
        alarmDeactivated: 0,
        locked: false
    }
};

let auth = function(req, res, next) {
    let user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    } else if (!(user.name in devices) || (user.pass !== devices[user.name].password)) {
        res.sendStatus(403);
    } else {
        next();
    }
};

module.exports = function (app) {
    console.log("ATS Server v" + version + " started");
    app.post("/ats/client", auth, function (req, res) { //client app
        let user = basicAuth(req);
        if (req.body.alarmActivated) {
            devices[devices[user.name].sender].alarmActivated = Date.now();
        }
        if (req.body.alarmDeactivated) {
            devices[devices[user.name].sender].alarmDeactivated = Date.now();
        }
        res.json({
            alarmActivated: devices[devices[user.name].sender].alarmActivated,
            alarmDeactivated: devices[devices[user.name].sender].alarmDeactivated,
            locked: devices[devices[user.name].sender].locked
        })
    });
    app.post("/ats/sender", auth, function (req, res) { //sender app
        let user = basicAuth(req);
        if (req.body.alarmActivated) {
            devices[user.name].alarmActivated = Date.now();
        }
        if (req.body.alarmDeactivated) {
            devices[user.name].alarmDeactivated = Date.now();
        }
        devices[user.name].locked = req.body.locked;
        res.json({
            alarmActivated: devices[user.name].alarmActivated,
            alarmDeactivated: devices[user.name].alarmDeactivated
        })
    });
};
