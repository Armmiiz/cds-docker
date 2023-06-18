const jwt = require('jsonwebtoken');

const config = process.env;

module.exports = ((req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, config.TOKEN_KEY)
        
        return res.status(200).json({
          status: '200',
          message:'Authentication Token'
        });
      }catch (err) {
        return res.status(401).send("Invalid Token");
      }
})

