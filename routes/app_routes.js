const pushNotificationController = require("../controllers/push-controller");
const express = require("express");
const router = express.Router();



router.post('/dbsave', function(req, res, next) {
    let token = req.body.token;
    let time = req.body.time;
    pushNotificationController.connection.query(`INSERT INTO Flutter_project.UserData (Token, Time) VALUES (?,?) `, [token,time], (err, rows) => {
        if(err) throw err;
        else {
            res.send({"result": "save ok"});
        }
    });
  });

  router.post('/dbupdate', function(req, res, next) {
    let token = req.body.token;
    let time = req.body.time;
    pushNotificationController.connection.query(`UPDATE Flutter_project.UserData SET Time=? WHERE Token=? `, [time,token], (err, rows) => {
        if(err) throw err;
        else {
            res.send({"result": "update ok"});
        }
    });
  });

  router.post('/dbdel', function(req, res, next) {
    let token = req.body.token;
    pushNotificationController.connection.query(`DELETE FROM Flutter_project.UserData WHERE Token=? `, [token], (err, rows) => {
        if(err) throw err;
        else {
            res.send({"result": "del ok"});
        }
    });
  });

router.post("/send-notification", pushNotificationController.sendPushNotification);

module.exports = router;