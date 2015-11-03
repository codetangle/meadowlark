var express = require('express');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// Add custom fortune module
var fortune = require('./lib/fortune.js');

// Set up static folder
app.use(express.static(__dirname + '/public'));

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