var express = require('express')
var app = express()
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt')
const saltRounds = 10
const uuid = require('uuid');
var jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())
var connection = require('./config/server');
const auth = require("./middlewares/auth");

require('dotenv').config({path: "vars/.env"});


app.post('/user/register', jsonParser, async function (req, res, next) {
  const uuid4 = uuid.v4()
  if (req.body.email != null && req.body.password != null && req.body.fullname != null && req.body.phone != null){
    connection.execute('SELECT * FROM user WHERE email=?', [req.body.email], function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
          return res.json({
            status_code: '403',
            message: 'email already exist'
          });
      }
      else {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            connection.execute(
              'INSERT INTO user (uid, email, password, fullname, tel, score) VALUES (?,?,?,?,?,?)',
              [uuid4, req.body.email, hash, req.body.fullname, req.body.phone, "0"],
              function(err, results, fields) {
                if(err){
                  return res.json({
                  status_code: '400', 
                  message: err
                });
                }
                
                if(result){
                  return res.json({
                    status_code: '200',
                    message: 'register success',
                    id : uuid4,
                    username : req.body.fullname,
                    score : '0'
                    });
                }
                }
            );
          });
        }
      })
  }else{
    return res.json({
      status_code: '403',
      message: 'email wrong format'
    });
  }

  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   connection.execute(
  //     'INSERT INTO user (uid, email, password, fullname, tel) VALUES (?,?,?,?,?)',
  //     [uuid4, req.body.email, hash, req.body.fullname, req.body.phone],
  //     function(err, results, fields) {
  //       if(err){
  //         return res.json({
  //         status: '400', 
  //         message: err
  //       });
  //       }
        
  //       return res.status(200).json({
  //           status: '200',
  //           message: 'register success'
  //         });
  //       }
  //   );
  // });
})

app.post('/user/login', jsonParser, async function (req, res, next) {
  connection.execute(
    'SELECT * FROM user WHERE email=?',
    [req.body.email],
    function(err, result, fields) {
      if(err){
        return res.json({
          status_code: '400',
          message:err
        });
      }
      else if(result.length == 0){
        return res.json({status_code: '403', 
        message: 'email not found'
        });
      }
      else{
        // var token = jwt.sign({ email: result[0].email }, process.env.TOKEN_KEY , { expiresIn: '1h' });
      }

      var userid = result.uid;
      var name = result.fullname;

      bcrypt.compare(req.body.password, result[0].password, function(err, results) {
        if(err){
          console.error('Error during comparison!', err);
          return res.json({
            status_code: '403',
            message:'login failed'
          });
          }
          if(results){
              return res.json({
              status_code: '200',
              message:'login success',
              id : result[0].uid,
              username : result[0].fullname,
              score : result[0].score
              });
          }
          return res.json({
            status_code: '403',
            message:'wrong password'
          });
      });
    }


  );
})

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.post("/addscore", jsonParser, (req, res) => {
  if(req.body.uuid != null){
    connection.execute(
      'SELECT * FROM user WHERE uid=?',
      [req.body.uuid],
      function(err, result, fields) {
        if(result.length > 0){
          connection.execute(
          'UPDATE user SET score = ? WHERE uid = ?',
          [req.body.score,req.body.uuid],
              function(err, results, fields) {
                if(err){
                  return res.json({
                  status_code: '400', 
                  message: err
                });
                }
                
                return res.json({
                  status_code: '200',
                    message: 'addscore success',
                    score : result[0].score
                  });
                }
        )}
      }
    );
  }else{
    return res.json({
      status_code: '403',
      message: 'user not found'
    });
  }
});

app.get('/user/ranking', jsonParser, async function (req, res, next) {
  connection.execute(
    'SELECT uid,fullname,score FROM user ORDER BY score DESC LIMIT 50',
    function(err, result, fields) {
      return res.json({
        data : result
        });
    });
})

app.listen(process.env.PORT, function () {
  console.log('CORS-enabled web server listening on port ' + process.env.PORT)
})