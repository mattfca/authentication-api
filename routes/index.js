// Needed
var express     = require('express');
var common      = require('../common')
var config      = common.config();
var middlewares = require("../middlewares");

// Routes
var authentication= require('../routes/authentication');

// Router
var router = express.Router();

// Export
module.exports = (function(){
    'use strict';

    /**
    * @api {post} /registration Registers a new user
    * @apiName Registration
    * @apiGroup Registration
    * @apiPermission admin
    * @apiVersion 0.1.0
    *
    * @apiParam {String} email Users unique email.
    * @apiParam {String} password Users password.
    *
    * @apiSuccess {Boolean} success Status of the request.
    * @apiSuccess {String} message  Message describing status.
    * @apiSuccess {String} token  Authentication token for new user.
    */
    router.post('/registration', authentication.registration);

    /**
    * @api {post} /authenticate Authenticates a user
    * @apiName Authentication
    * @apiGroup Authentication
    * @apiVersion 0.1.0
    *
    * @apiParam {String} email Users unique email.
    * @apiParam {String} password Users password.
    *
    * @apiSuccess {Boolean} success Status of the request.
    * @apiSuccess {String} message  Message describing status.
    * @apiSuccess {String} token  Authentication token for new user.
    */
    router.post('/authenticate', authentication.authenticate);

    return router;
})();
