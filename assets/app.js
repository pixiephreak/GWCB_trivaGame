
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;'
	var gameLength = 5;
	var answer;
	var score = 0;
	var count = 0;
	var intervalId;
	//code to run on data return
	var game = {
		init: function(){

			$('#start').off('click').on('click', function(){
				$('#loadingDiv').html('Page loading...')
				setTimeout(game.removeLoader(), 1000);
				$('#start').toggleClass('hidden');
				$('#loading').html("questions loading");
				game.questions();

			})

			$('#choices').off('click', '.choice').on('click', '.choice', function(){
				if(($(this).html()) == answer){
					score++;
					$('#result').html('Correct!');
				}
			})
		},
		showQuestion: function(){
			count++;
			console.log(count);
			console.log(gameLength);
			$('#choices').empty();
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
			answer = country[clueType];
			console.log('answer', answer);
			if(typeof answer != 'undefined'){
				$('#choices').append(`<li class="choice">${answer.toLocaleString()}</li>`);
				}
			console.log(country);
			wrongAnswers = [];
			function wrongChoices(){
						//insert excpetion for entries that lack a property
						var wrongAnswer = function(){
							return result[game.random(result.length)][clueType];
						}
						for(let i=0; i<3; i++){
							var thisWrongAnswer = wrongAnswer();
							// typeof thisWrongAnswer != 'undefined'
							console.log(thisWrongAnswer, wrongAnswers.indexOf(thisWrongAnswer), typeof thisWrongAnswer);
								if(wrongAnswers.indexOf(thisWrongAnswer) === -1 && thisWrongAnswer != answer){
									if(typeof thisWrongAnswer != 'undefined')
									wrongAnswers.push(thisWrongAnswer);
								}else{
									var thisWrongAnswer = wrongAnswer();
									if(wrongAnswers.indexOf(thisWrongAnswer) === -1){
										if(typeof thisWrongAnswer != 'undefined')
										wrongAnswers.push(thisWrongAnswer);
									}
								}
							console.log(wrongAnswers);
						}
						wrongAnswers.forEach(function(answer){
							$('#choices').append(`<li class="choice">${answer.toLocaleString('en')}</li>`);
						})

				}
			wrongChoices();
		},
		questions: function(){

		intervalId = setInterval(game.showQuestion,5*1000);

		},
		removeLoader: function(){
			// fadeOut complete. Remove the loading div
			$( "#loadingDiv" ).fadeOut(3000, function() {
      			 $( "#loadingDiv" ).remove(); //makes page more lightweight
  			});
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


		// thisInterval: function(callback, delay, repetitions) {
	 //    var x = 0;
	 //    var intervalID = window.setInterval(function () {

	 //       callback();

		//        if (++x === repetitions) {
		//            	window.clearInterval(intervalID);
		//        	}
	 //    	}, delay);
		// },


