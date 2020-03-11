var express = require("express");
var jsonexport = require('jsonexport');
var offline = require('express-offline');
var fs = require("fs");
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');


var app = express();

app.use(offline())





var db = new sqlite3.Database('Database/data.db');


app.use(express.static(__dirname + '/Public'));
app.use(bodyParser.urlencoded({ extended: false }));


//routing
app.get('/', function(request, resposnse) {

    //resposnse.send("hello world");
});

app.get('/data', function(request, response) {
    console.log("GET request recived at /registration");

    db.all('select * from formdata', function(err, rows) {
        if (err) {
            console.log('error:' + err);
        } else {
            // console.log(rows);

        }
    });
});

app.post('/data', function(request, response) {
    console.log(" request recived at /registration");
    db.run('CREATE TABLE IF NOT EXISTS formdata(Button varchar, Name varchar, Email varchar, Contact number, Age number, Glasses varchar, Gender varchar, Avatar varchar )', function(err) {

        if (err) {
            console.log("Table creation error:");
        } else {
            db.run('insert into formdata values(?, ?, ?, ?, ?, ?, ?, ?)', ['', request.body.Name, request.body.Email, request.body.Contact, request.body.Age, request.body.Glasses, request.body.Gender, request.body.avatar], function(err) {
                if (err) {
                    // console.log("Error: sagar " + err);
                } else {
                    db.all('select * from formdata', function(err, rows) {
                        if (err) {
                            console.log('error:' + err);
                        } else {
                            const jsonCustomers = JSON.parse(JSON.stringify(rows));


                            jsonexport(jsonCustomers, function(err, csv) {
                                if (err) return //console.log(err);
                                    //console.log(csv)
                                fs.writeFileSync(__dirname + "\\Public\\file.csv", csv)

                            });


                        }
                    });
                    response.status(200).redirect('index.html');

                }
            });

        }

    });




});

app.post('/clicked', function(request, res) {
    // console.log("onclick");

    var file = 'file.csv';
    res.download(file);



});



app.listen(3030, function() {
    console.log("running server at PORT :- 3000 !");
});