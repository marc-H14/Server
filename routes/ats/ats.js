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
        alarmOn: false,
        activateAlarm: false,
        deactivateAlarm: false
    },
    sender2: {
        password: "passwd4",
        alarmOn: false,
        activateAlarm: false,
        deactivateAlarm: false
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
    app.post("/ats/client/heartbeat", auth, function (req, res) { //main app
        let user = basicAuth(req);
        devices[devices[user.name].sender].activateAlarm = req.body.activateAlarm;
        devices[devices[user.name].sender].deactivateAlarm = req.body.deactivateAlarm;
        res.json({
            alarmOn: devices[devices[user.name].sender].alarmOn,
        })
    });
    app.post("/ats/sender/heartbeat", auth, function (req, res) { //main app
        let user = basicAuth(req);
        devices[user.name].alarmOn = req.body.alarmOn;
        res.json({
            activateAlarm: devices[user.name].activateAlarm,
            deactivateAlarm: devices[user.name].deactivateAlarm
        })
    });
};