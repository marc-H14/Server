const mongoose = require("mongoose");
const crypto = require("crypto");
const basicAuth = require('basic-auth');


const version = "1.0";
const delay = 15;

let sessions = {};
let panic = false;

module.exports = function (app) {
    console.log("ATS Server v" + version + " started");
    app.post("/ats/client/heartbeat", function (req, res) { //main app

    });
    app.post("/ats/sender/heartbeat", function (req, res) { //main app

    });
};