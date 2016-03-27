// Needed
var mongoose    = require('mongoose');
var sha1        = require('sha1');
var jwt         = require('jsonwebtoken');
var common      = require('../common')
var config      = common.config();

// Models
var User        = require('../models/user');

// register a new user
module.exports = {
  registration: function(req, res, next){

    var user = new User();

    user.email = req.body.email ? req.body.email : user.email;
    user.password = req.body.password ? sha1(req.body.password) : user.password;

    User.findOne({'email': user.email},function(err, u){
        if(err) res.status(403).send(err);

        if(!u) {
            user.save(function(err){
                if(err) res.status(403).send(err);

                var token = jwt.sign({id: user._id, email:user.email}, config.secret, {
                    expiresIn: '24h' // expires in 24 hours
                });

                res.send({success: true, message: 'Created', token: token});
            });

        }else{
            res.status(403).send({success: false, message: 'Email exists.'});
        }

    });
  },

  authenticate: function(req, res, next) {
      // find the user
      User.findOne({
          email: req.body.email
      }, function(err, user) {
          if (err) res.status(403).send(err);

          if (!user) {
          res.status(403).send({ success: false, message: 'Authentication failed. User not found.' });
          } else if (user) {
            // check if password matches
            if (user.password != sha1(req.body.password)) {
                res.status(403).send({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign({id: user._id, email:user.email}, config.secret, {
                    expiresIn: '24h' // expires in 24 hours
                });

                // return the information including token as JSON
                res.send({
                    success: true,
                    message: 'Authenticated',
                    token: token
                });
            }
          }
      });
  }
}
