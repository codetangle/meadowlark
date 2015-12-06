var express = require('express');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

var bodyParser = require('body-parser');

// Add custom fortune module
var fortune = require('./lib/fortune.js');

// For handling file uploads
var formidable = require('formidable');

// Set up static folder
app.use(express.static(__dirname + '/public'));

// Set up handlebars templates
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set port
app.set('port', process.env.PORT || 3000);

// Set up middleware to parse URL-encoded body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up query string to turn on test
app.use(function(req, res, next) {
    res.locals.showTest = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

//Routes
// custom home page
app.get('/', function(req, res) {
    res.render('home');
});

// custom about page
app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

// Form test page
app.get('/test', function(req, res) {
    res.render('testform');
});

app.post('/test-form', function(req, res) {
    console.log('Query Data');
    console.log(req.query);
    console.log('Body data');
    console.log(req.body);
    res.redirect(303, '/thank-you');
});

// Newsletter Sign Up
app.get('/newsletter', function(req, res) {
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res) {
    if(req.xhr || req.accepts('json') === 'json' || req.accepts('html') === 'html') {
        res.send({ success: true });
    } else {
        console.log('Else was triggered');
        res.redirect(303, '/thank-you');
    }
});

// Vacation photo upload page
app.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

// Url to process vacation photo uploads
app.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            console.log('And the error was');
            console.log(err);
            return res.redirect(303, '/error');
        }
        console.log('Received fields');
        console.log(fields);
        console.log('Received files');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/thank-you', function(req, res) {
    res.render('thankyou');
});

app.get('/error', function(req, res) {
    res.render('error');
});

// Hood river tour
app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

// Request Group Rates
app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

app.get('/jquery-test', function(req, res) {
    res.render('jquery-tests');
});

// View headers
app.get('/headers', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.set('Custom-Header', 'i-make-this-up');
    var s = '';
    for(var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
});

// custom 404 page
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
                app.get('port') + ': press CTRL-C to quit.');
});
