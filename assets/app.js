
// api endpoint (include languages?):
var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;'
//code to run on data return
var game = {
	init: function(){
		$('#start').toggleClass('hidden');
		$('#start').on('click', function(){
			$('#start').toggleClass('hidden');
			game.showQuestion()
			setTimeout(function(){
			  game.showQuestion();
			},5*1000)
		})
	},
	showQuestion: function(){
		var clueTypes = ['population', 'capital','region','area'];
	    var clueType = clueTypes[game.random(clueTypes.length)];
	    var countryIndex = game.random(result.length);
	    var country = result[countryIndex];
	    // var languages = result[countryIndex].languages;
	    // var languagesArr = [];
		// languages.forEach(function(language) {
		// 		languagesArr.push(language.name);
		// });
		var question = `What is the ${clueType} of ${country.name}`;
		console.log(question)
		$('#question').html(question);
		console.log('cluetype', clueType);
		var answer = country[clueType];
		console.log('answer', answer);
		$('#choices').append(`<li>${answer.toLocaleString()}</li>`);
		console.log(country);
		var wrongAnswer = function(){
			return result[game.random(result.length)][clueType]
		}
		//insert excpetion for entries that lack a property
		var wrongAnswers =[wrongAnswer(), wrongAnswer(), wrongAnswer()];
		console.log(wrongAnswers)
		wrongAnswers.forEach(function(answer){$('#choices').append(`<li>${answer.toLocaleString('en')}</li>`)}
	);
	},
	random: function(length){
		num = Math.floor((Math.random() * length) + 0);
		return num;
	}

}
function init(result) {
	game.init()
}

function onFail(){
	game.init()
}

//execute when server responds
apiCall(init);

// apiCall itself is defined as follows:
function apiCall(callback) {
    $.ajax({
             url: queryURL,
             method: 'GET',
             success: callback,
             error: onFail()
           })
}



