var fortunes = [
    "If you conquer your fears you will conquer the world.",
    "Rivers not only deliver water, but life.",
    "No unknown is worth your fear.",
    "A pleasant surprise awaits you in the near future.",
    "Whenever possible make things simpler."
];

exports.getFortune = function() {
	var index = Math.floor(Math.random() * fortunes.length);
	return fortunes[index];
}