const basicAuth = require('basic-auth');

const version = "1.0";

let devices = {
    client1: {
        password: "passwd1",
        sender: "sender1"
    },
    client2: {
        password: "passwd2",
        sender: "sender2"
    },
    sender1: {
        password: "passwd3",
        alarmActivated: 0,
        alarmDeactivated: 0
    },
    sender2: {
        password: "passwd4",
        alarmActivated: 0,
        alarmDeactivated: 0
    }
};

let auth = function(req, res, next) {
    let user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    } else if (!user.name in devices || user.pass === devices[user.name].password) {
        res.sendStatus(403);
    } else {
        next();
    }
};

module.exports = function (app) {
    console.log("ATS Server v" + version + " started");
    app.post("/ats/client/heartbeat", auth, function (req, res) { //client app
        let user = basicAuth(req);
        devices[devices[user.name].sender].alarmActivated = req.body.alarmActivated;
        devices[devices[user.name].sender].alarmDeactivated = req.body.alarmDeactivated;
        res.json({
            alarmActivated: devices[devices[user.name].sender].alarmActivated,
            alarmDeactivated: devices[devices[user.name].sender].alarmDeactivated
        })
    });
    app.post("/ats/sender/heartbeat", auth, function (req, res) { //sender app
        let user = basicAuth(req);
        devices[user.name].alarmActivated = req.body.alarmActivated;
        devices[user.name].alarmDeactivated = req.body.alarmDeactivated;
        res.json({
            alarmActivated: devices[user.name].alarmActivated,
            alarmDeactivated: devices[user.name].alarmDeactivated
        })
    });
};