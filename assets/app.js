
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;'
	var gameLength = 5;
	//code to run on data return
	var game = {
		init: function(){
			$('#start').on('click', function(){
				$('#start').toggleClass('hidden');
				$('#choices').empty();
				game.showQuestion();
				game.thisInterval(function () {
				    game.showNextQuestion();
				}, 5000, gameLength-1);
			})
			$('#choices').off('click', '.choice').on('click', '.choice', function(){
				console.log('click choice')
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
			if(typeof answer != 'undefined'){
				$('#choices').append(`<li class="choice">${answer.toLocaleString()}</li>`);
				}else{
					game.showQuestion();
				}
			console.log(country);
			var wrongAnswers =[];
			function wrongChoices(){
					//insert excpetion for entries that lack a property
					var wrongAnswer = function(){
						return result[game.random(result.length)][clueType];
					}
					for(let i=0; i<3; i++){
						var thisWrongAnswer = wrongAnswer();
							if(wrongAnswers.indexOf(thisWrongAnswer) === -1 || typeof thisWrongAnswer != 'undefined'){
								console.log('adding', thisWrongAnswer);
								wrongAnswers.push(thisWrongAnswer);
							}
					}
					wrongAnswers.forEach(function(answer){
						$('#choices').append(`<li class="choice">${answer.toLocaleString('en')}</li>`)}
				);
			}
			wrongChoices();

		},
		thisInterval: function(callback, delay, repetitions) {
	    var x = 0;
	    var intervalID = window.setInterval(function () {

	       callback();

		       if (++x === repetitions) {
		           	window.clearInterval(intervalID);
		       	}
	    	}, delay);
		},
		showNextQuestion: function(){
			  $('#choices').empty();
			  game.showQuestion();
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



