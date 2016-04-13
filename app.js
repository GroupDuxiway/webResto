// The main application script, ties everything together.
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var util = require('util');
var path = require('path');
var oauth = require('oauth');
var fs = require('fs');
var https = require('https');
var querystring = require('querystring');
var vhost = require('vhost');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var errorHandler = require('errorhandler');
var c = require('./config/colors');
var cors = require('cors');

// Server configuration initialization
require(path.join(__dirname, 'config', 'env-vars'));


// Create server
var app = express();

// Set server configuration
//================================================
app.set('port', process.env.WEB || 80);
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(cors());
app.use(express.static(path.join(__dirname, 'assets')));



// End server configuration
//================================================


// Error handlers
// =============================================
function logErrors(err, req, res, next) {
    if (typeof err === 'string')
        err = new Error(err);
    console.error('logErrors', err.toString());
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        console.error('clientErrors response');
        res.status(500).json({ error: err.toString() });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    console.error('lastErrors response');
    res.status(500).send(err.toString());
}
// End Error handlers
// =============================================



// Set errors handlers
app.get('*', function (req, res) {
    res.status(404).send();
})
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);



//================================================
// Running server
//================================================
if (require.main === module) {
    // Create HTTP server 	
    var server = http.createServer(app);
    server.listen(app.get('port'), app.get('ipaddress'), function () {
        console.info(c.white + 'Express server listening on port ' + app.get('port') + c.reset);
    });
}
else {
    console.info(c.blue + 'Running app as a module' + c.reset)
    exports.app = app;
}



exports.run= function(port) {
    // Create HTTP server 	
    var server = http.createServer(app);
    server.listen(port, app.get('ipaddress'), function () {
        console.info('Express server listening on port ' + port+ c.reset);
    });  
};







