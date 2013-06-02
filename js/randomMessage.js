var randomCompliment = function(name) {
	var randomNumber = Math.floor(Math.random()*compliments.length);
	return compliments[randomNumber] + (name ? ", " + name : "");
};

var randomInsult = function() {
	var randomAdj = insultadj[Math.floor(Math.random()*insultadj.length)];
	var randomNoun = insultnoun[Math.floor(Math.random()*insultnoun.length)];
	return "What a " + randomAdj + " " + randomNoun + "! Try harder next time!";
}
