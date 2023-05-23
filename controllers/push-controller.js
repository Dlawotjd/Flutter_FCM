var admin = require("firebase-admin");
var fcm = require("fcm-notification");
const schedule = require('node-schedule');

var serviceAccount = require("../config/push_key.json");

// const certPath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(certPath)

const sendPushNotification = (req, res, next) => {

    try {
        let message = {
            notification: {
              title: '모기 알리미',
              body: '오늘의 모기 지수를 확인해보세요!!',
            },
            
            token: req.body.fcm_token
          };
          

        FCM.send(message, function(err, resp) {
            if(err) {
                return res.status(500).send({
                    message: err
                });
            }
            else {
                return res.status(200).send({
                    message: "성공"
                })
            }
        })
    }
     catch(err) {
        throw err;
     }
}

const certPath = admin.credential.cert(serviceAccount);
const FCM = new fcm(certPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//DB연결
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'oceanit.synology.me',
    user:'uit',
    password:'Hoseo12345^',
    port:3308,
    database:'Flutter_project'
});

connection.connect( function(err){
    if(err) throw err;
    console.log("DB연결성공!")
});

function startHourlyJob() {
    
    schedule.scheduleJob('* * * * *', function() {
      console.log('Hourly job triggered. Searching for new schedules...');
      
        connection.query(` SELECT * FROM Flutter_project.UserData`, (err, user) => {
          if(err) throw err;
          else{
            user.forEach(user => {
              let userSchedule = user.Time.split(':');
              let scheduleHour = Number(userSchedule[0]);
              let scheduleMinute = Number(userSchedule[1]);
            
              let currentHour = (new Date().getHours());
              let currentMinute = (new Date().getMinutes());
            
              if (currentHour === scheduleHour && currentMinute === scheduleMinute) {
                console.log('Scheduling notification for user: ', user.Token);
                scheduleNotification(user.Token);
              }
            }); 

          }
        });

      
    });
  }

// 알림 스케쥴링 함수
function scheduleNotification(token) {
  let message = {
    notification: {
      title: '모기 알리미',
      body: '오늘의 모기 지수를 확인해보세요!!',
    },
    token: token
  };

  FCM.send(message, function(err, response) {
    if (err) {
      console.error('Error sending FCM message:', err);
    } else {
      console.log('FCM message sent successfully:', response);
    }
  });
}

startHourlyJob();

module.exports={
  connection,
  sendPushNotification
}