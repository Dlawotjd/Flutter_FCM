const pushNotificationController = require("../controllers/push-controller");
const express = require("express");
const router = express.Router();



router.get('/db', function(req, res, next) {
    let token = req.body.token;
    pushNotificationController.connection.query(`SELECT Time FROM Flutter_project.UserData WHERE Token=?`, [token],(err, rows) => {
        if(err) throw err;
        else{
            res.send({"result": rows});
        }
    });
});

router.post('/dbsave', function(req, res, next) {
    let token = req.body.token;
    let time = req.body.time;

    pushNotificationController.connection.query(`SELECT * FROM Flutter_project.UserData WHERE Token=?`, [token],(err, rows) => {
        if(err) throw err;
        else if(rows[0]==null){ //토큰없음
            pushNotificationController.connection.query(`INSERT INTO Flutter_project.UserData (Token, Time) VALUES (?,?) `, [token,time], (err, rows) => {
                if(err) throw err;
                else {
                    res.send({"result": "save ok"});
                }
            });
        }else{//토큰있음
            pushNotificationController.connection.query(`UPDATE Flutter_project.UserData SET Time=? WHERE Token=? `, [time,token], (err, rows) => {
                if(err) throw err;
                else {
                    res.send({"result": "update ok"});
                }
            });
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