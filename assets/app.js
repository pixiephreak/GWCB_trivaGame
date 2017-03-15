
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;';
	//set number of questions
	var gameLength = 10;
	//set how much time the player has to answer + 2
	var timerDuration = 22*1000;
	//time count for stopwatch
	var time;
	//correct answer each time a question loads
	var answer;
	//record score for each round of game
	var score = 0;
	//interval for question screen
	var intervalId;
	//interval for stopwatch
	var stopwatchIntervalId;
	//interval for correct screen
	var correctIntervalId;
	var timeUpInterval;
	//keeps track of how many questions have been asked
	var counter=0;
	//code to run on data return
	var game = {
		init: function(){

			$('#start').off('click').on('click', function(){
				//figure out how to start stopwatch and hide 'page loading' at moment of response(is it in ajax call?)
				stopwatch.start();
				$('#loadingDiv').html('Page loading...');
				setTimeout(game.removeLoader(), 100);
				$('#start').toggleClass('hidden');
				$('#loading').html("questions loading");
				//load first instantly
				game.showQuestion();
				//load reamaining questions at interval
				game.startGame();
				$('#choices').off('click', '.choice').on('click', '.choice', function(){
					if(($(this).html()) == answer){
						//if answer is correct, show correct screen
						game.correct();
						//start the game again after x seconds
						game.thisInterval(game.startGameAgain, 5000, 1)
					}else{
						game.incorrect();
						game.thisInterval(game.startGameAgain, 5000, 1)
					}
				});
			});

		},
		startGame: function(){
			intervalId = setInterval(game.showQuestion,timerDuration-1);
		},
		startGameAgain: function(){
			stopwatch.reset();
			stopwatch.start();
			game.showQuestion();
			game.startGame();
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
				if(game.random(2) === 0){
					//TO-DO: keep working on this to that correct isn't always first;
					$('#choices').append(`<li class="choice">${answer.toLocaleString()}</li>`);
					}else{
					$('#choices').prepend(`<li class="choice">${answer.toLocaleString()}</li>`);
					}
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
					game.checkGameLength();
					game.timeUp();
				},
				correct: function(){
					score++;
					$('#score').html(`Score: ${score}`)
					$('#result').html('Correct!');
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();
					// TO-DO why did I put this here?
					game.stopGame();
				},
				incorrect: function(){
					$('#result').html(`The correct answer was ${answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();
					game.stopGame();
				},
				timeOut: function(){
					$('#result').html(`Time's up. The correct answer was ${answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();
					game.stopGame();
					game.thisInterval(game.startGameAgain, 5000, 1)
				},
				checkGameLength: function(){
					if(counter > gameLength){
						game.restart();
					}
				},
				stopGame: function(){
					//why does the "correct" screen prevent the game from stopping at end?
					//TO-DO: how do I stop the timer
					clearInterval(timeUpInterval);
					clearInterval(intervalId);
					clearInterval(stopwatchIntervalId);
					clearInterval(correctIntervalId);
				},
				restart: function(){
					game.stopGame();
					counter = 0;
					$('#timer').empty();
					$('#question').empty();
					$('#choices').empty();
					$('#start').toggleClass('hidden');
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
				timeUp: function(){
					timeUpInterval = setInterval(game.timeOut, 21*1000);
				},
				removeLoader: function(){
			// fadeOut complete. Remove the loading div
			$( "#loadingDiv" ).fadeOut(1000, function() {
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


