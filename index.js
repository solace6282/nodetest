var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/api/users'));

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})