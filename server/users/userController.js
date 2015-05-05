var Users = require('../../app/collections/users');
var User  = require('../../app/models/user');
var Q    = require('q');
var jwt  = require('jwt-simple');
var passport = require('passport');
var http = require('http');
var app = require('./../app');

module.exports = {
  signin: function (req, res, next) {
    console.log('signin');
    var username = req.body.username;
    var password = req.body.password;
    // return app.post('/auth/local',{username:username,password:password});

    // new User({username:username})
    //     .fetch()
    //     .then(function(model){
    //       // user exists in database
    //       if (model){
    //         if (User.comparePasswords(model.password)){
    //           res.json({token: token});
    //         }
    //       } else {
    //         next(new Error('User does not exist in database'));
    //       }
    //     })
    // var findUser = Q.nbind(User.fetchOne, User);
    // findUser({username: username})
    //   .then(function (user) {
    //     if (!user) {
    //       next(new Error('User does not exist'));
    //     } else {
    //       return user.comparePasswords(password)
    //         .then(function(foundUser) {
    //           if (foundUser) {
    //             var token = jwt.encode(user, 'secret');
    //             res.json({token: token});
    //           } else {
    //             return next(new Error('No user'));
    //           }
    //         });
    //     }
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });
  },

  signup: function (req, res, next) {
    console.log('signup');
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    
    new User({username:username})
        .fetch()
        .then(function(model){
          if(model) {
            next(new Error('User already exists'));
          } else {
            new User({username:username,password:password},{isNew:true}).save()
                    .then(function(model){
                      console.log(model);
                      var token = jwt.encode(model.attributes.username, 'secret');
                      res.json({token: token});
                      console.log('New user saved');
                    });
          }
        })
        .catch(function(error){
          console.log('hi',error);
        });
    //var findOne = Q.nbind(User.fetchOne, User);

    // check to see if user already exists
    /*
    findOne({username: username})
      .then(function(user) {
        console.log('found',user);
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
      */
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.fetchOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }
};
