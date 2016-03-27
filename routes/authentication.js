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

    // check if email is an email and password is set

    user.email = req.body.email ? req.body.email : user.email;
    user.password = req.body.password ? sha1(req.body.password) : user.password;

    User.findOne({'email': user.email},function(err, u){
        if(err) res.status(403).send(err);

        if(!u) {
            var refreshToken = sha1(req.body.name);

            var device = {
              name: req.body.name,
              token: refreshToken
            };

            user.devices.push(device);

            user.save(function(err){
                if(err) res.status(403).send({ success: false, message: 'Registration failed.' });

                var token = jwt.sign({id: user._id, email:user.email}, config.secret, {
                    expiresIn: '15m' // expires in 24 hours
                });

                res.send({success: true, message: 'Created', token: token, refresh: refreshToken });
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
                // check if device is already recorded with a refresh token
                var refreshToken = null;

                for (var device in user.devices){
                  if(!user.devices.hasOwnProperty(device)) continue;

                  if(user.devices[device]['name'] == req.body.name){
                    // this device has a refresh token
                    refreshToken = user.devices[device]['token'];
                  }
                }

                if(refreshToken == null){
                  refreshToken = sha1(req.body.name);

                  user.devices.push({
                    name: req.body.name,
                    token: refreshToken
                  });

                  user.save(function(err){
                    if(err) res.status(403).send({ success: false, message: 'Authentication failed. New device token failure.' });
                  });
                }

                // create a token
                var token = jwt.sign({id: user._id, email:user.email}, config.secret, {
                    expiresIn: '15m' // expires in 24 hours
                });

                // return the information including token as JSON
                res.send({
                    success: true,
                    message: 'Authenticated',
                    token: token,
                    refresh: refreshToken
                });
            }
          }
      });
  },

  refresh: function(req, res, next) {
    // Look up email
    // Check devices for name / token
    // If they exist issue a new token
    // If they do not exist return failure
      res.send({success:false, message: 'EP failure'});
  }
}
