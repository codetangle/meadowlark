var express = require('express');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// Set up static folder
app.use(express.static(__dirname + '/public'));

// custom home page
app.get('/', function(req, res) {
    res.render('home');
});

var fortunes = [
    "If you conquer your fears you will conquer the world.",
    "Rivers not only deliver water, but life.",
    "No unknown is worth your fear.",
    "A pleasant surprise awaits you in the near future.",
    "Whenever possible make things simpler."
];

// custom about page
app.get('/about', function(req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune: randomFortune });
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
