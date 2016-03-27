var express     = require('express');
var app         = express();
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
require('mongoose-moment')(mongoose);
var sha1        = require('sha1');
var jwt         = require('jsonwebtoken');
var cors        = require('cors')

var common      = require('./common')
var config      = common.config();
var routes = require('./routes');

// Port
var port = config.port;

// Mongoose
mongoose.connect(config.database);

// Cookies
app.use(cookieParser(config.cookieSecret));

// Cors
app.use(cors());

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgon to log requests to console
app.use(morgan('dev'));

// Routes
app.get('/', function(req, res) {
    res.send('authentication-api is at http://localhost:' + port + '/api/v1');
});

// apply the routes
app.use('/api/v1', routes);

// start the server
app.listen(port,"0.0.0.0");
console.log('tracking-api on port ' + port);
