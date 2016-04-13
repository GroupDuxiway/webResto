var express = require('express'); 
var app = exports.app = express(); 
 
console.log('*************Application'); 
app.get('/yy', function(req, res){ 
    res.send('Hello World app'); 
}); 