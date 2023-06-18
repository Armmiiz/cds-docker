var jwt = require('jsonwebtoken');
var connection = require('../config/server');
const auth = require("../middlewares/auth");
var bodyParser = require('body-parser')


const addquizs = (req, res, next) => {
    const {test} = req.body
    // console.log(req.body)
    res.send(req.body)

    var sql = "CREATE TABLE quiztest (id INT AUTO_INCREMENT PRIMARY KEY, Question VARCHAR(255)  , Answer VARCHAR(255))";
    connection.query(sql, function (err, result) {
    if (err) throw err;

    return res.status(200).json({
                        status: '200',
                        message: 'addquiz success'
                      });

    if(result){
        var quiz = "INSERT INTO quiztest (Question, Answer) VALUES ?";
        var values = req.body.quiz;

        connection.query(quiz, [values], function (err, result) {
                if(err){
                  return res.json({
                  status: '400', 
                  message: err
                });
                }
        
                return res.status(200).json({
                    status: '200',
                    message: 'addquiz success'
                  });
                })
        }
    }
  )
}
module.exports = addquizs