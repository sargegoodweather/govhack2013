var randomCompliment = function() {
	var randomNumber = Math.floor(Math.random()*compliments.length);
	return compliments[randomNumber];
};

var randomInsult = function() {
	var randomAdj = insultadj[Math.floor(Math.random()*insultadj.length)];
	var randomNoun = insultnoun[Math.floor(Math.random()*insultnoun.length)];
	return "You are a " + randomAdj + " " + randomNoun + "!";
}