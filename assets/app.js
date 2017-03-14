
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;';
	var gameLength = 4;
	var timerDuration = 22*1000;
	var time;
	var answer;
	var score = 0;
	var intervalId;
	var stopwatchIntervalId;
	var correctIntervalId;
	var counter=0;
	//code to run on data return
	var game = {
		init: function(){

			$('#start').off('click').on('click', function(){
				//figure out how to start stopwatch and hide 'page loading' when api comes back (is it in ajax call?)
				stopwatch.start();
				$('#loadingDiv').html('Page loading...');
				setTimeout(game.removeLoader(), 100);
				$('#start').toggleClass('hidden');
				$('#loading').html("questions loading");
				//make first question load instantly
				game.showQuestion();
				//load reamaining questions at interval
				game.startGame();
				$('#choices').off('click', '.choice').on('click', '.choice', function(){
					if(($(this).html()) == answer){
						game.correct();
						game.thisInterval(game.startGameAgain, 5000, 1)
					}else{
						console.log('click wrong', $(this));
					}


				});
			});

		},
		startGame: function(){
			intervalId = setInterval(game.showQuestion,timerDuration-1);
		},
		startGameAgain: function(){
			gameLength = gameLength-counter;
			stopwatch.reset();
			stopwatch.start();
			game.showQuestion();
			game.startGame();
		},
		stopGame: function(){
			clearInterval(intervalId);
		},
		showQuestion: function(){
			counter++;
			console.log(counter);
			stopwatch.reset();
			$('#choices').empty();
			$('#result').empty();
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
			console.log(question);
			$('#question').html(question);
			answer = country[clueType].toString();
			console.log('answer', answer);
			if(typeof answer != 'undefined'){
				$('#choices').append(`<li class="choice">${answer.toLocaleString()}</li>`);
			}else{
				$('#choices').append(`<li class="choice">Freebie.We don't know.</li>`);
			}

			wrongAnswers = [];
			function wrongChoices(){
						//insert excpetion for entries that lack a property
						var wrongAnswer = function(){
							return result[game.random(result.length)][clueType];
						};
						for(let i=0; i<3; i++){
							var thisWrongAnswer = wrongAnswer();
							if(wrongAnswers.indexOf(thisWrongAnswer) === -1 && thisWrongAnswer != answer){
								if(typeof thisWrongAnswer != 'undefined')
									wrongAnswers.push(thisWrongAnswer);
							}else{
								wrongAnswers.push("I really don't know.")
							}
							console.log(wrongAnswers);
						}
						wrongAnswers.forEach(function(answer){
							$('#choices').append(`<li class="choice">${answer.toLocaleString('en')}</li>`);
						});

					}
					wrongChoices();
					game.checkGameLangth();
				},
				correct: function(){
					score++;
					$('#score').html(`Score: ${score}`)
					$('#result').html('Correct!');
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();
					game.stopGame();
				},
				checkGameLangth: function(){
					if(counter > gameLength){
						game.stopGame();
						clearInterval(stopwatchIntervalId);
						counter = 0;
						$('#timer').empty();
						$('#question').empty();
						$('#choices').empty();
						$('#start').toggleClass('hidden');
					}
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

	};

	var stopwatch = {
		count: function() {
			seconds = stopwatch.time--;
			$('#timer').html(stopwatch.timeConverter(seconds));
		},
		start: function(){
			stopwatchIntervalId = setInterval(stopwatch.count,1000);
		},
		pause: function(){
			clearInterval(stopwatchIntervalId);
		},
		timeConverter: function(t) {

		    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
		    var minutes = Math.floor(t / 60);
		    var seconds = t - (minutes * 60);

		    if (seconds < 10) {
		    	seconds = "0" + seconds;
		    }

		    if (minutes === 0) {
		    	minutes = "00";
		    }

		    else if (minutes < 10) {
		    	minutes = "0" + minutes;
		    }

		    return minutes + ":" + seconds;
		},
		reset: function() {

			stopwatch.time = 20;
		  	  //  TODO: Change the "display" div to "00:00."
		  	  $('#timer').html('00:20');

		  	}
		  };

		  function init(result) {
		  	game.init();
		  }

		  function onFail(){
		  	game.init();
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
		});
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


