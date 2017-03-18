
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;';
	//set number of questions TO-DO ask for user input
	var gameLength = 5;
	//set how much time the player has to answer + 2
	var timerDuration = 16*1000;
	// set how much time the player has to see result +2
	var resultDuration = 5*1000
	//time count for stopwatch
	var time;
	//correct answer each time a question loads
	var answer;
	//record # correct for each round of game
	var correct = 0;
	//record # inccorect for each round of game
	var incorrect = 0;
	//record # inccorect for each round of game
	var unanswered = 0;
	//interval for question screen
	var intervalId;
	//interval for stopwatch
	var stopwatchIntervalId;
	//interval for correct screen
	var correctIntervalId;
	// interval for timeUp scree
	var timeUpInterval;
	//keeps track of how many questions have been asked
	var counter=0;
	//keep track of clicks
	var click = false

	//code to run on data return
	var game = {
		init: function(){
			$('#start').off('click').on('click', function(){
				//figure out how to start stopwatch and hide 'page loading' at moment of response(is it in ajax call?)
				$('#game-over').empty();
				stopwatch.start();
				// $('#loadingDiv').html('Page loading...');
				setTimeout(game.removeLoader(), 100);
				$('#start').toggleClass('hidden');
				// $('#loading').html("questions loading");
				//load first instantly
				game.showQuestion();
				//load reamaining questions at interval
				game.startGame();
				$('#choices').off('click', '.choice').on('click', '.choice', function(){
					click = true;
					if(($(this).html()) == answer){
						game.stopGame();
						if(counter>=gameLength){
							game.correct();
							game.restart();
							}else{
							//show correct screen
							game.correct();
							//start the game again after x seconds
							game.thisInterval(game.startGameAgain, resultDuration, 1)
						}
					}else{
						game.stopGame();
						if(counter>=gameLength){
							game.incorrect();
							game.restart();
						}else{
						game.incorrect();
						game.thisInterval(game.startGameAgain, resultDuration, 1)
					}
					}
				});
			});

		},
		startGame: function(){
			intervalId = setInterval(game.showQuestion,timerDuration);
		},
		startGameAgain: function(){
			click = false;
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
			var question = `What is the ${clueType} of ${country.name}?`;
			console.log(question);
			$('#question').html(question);
			answer = country[clueType].toLocaleString('en');
			answers = [];
			console.log('answer', answer);
			if(typeof answer != 'undefined'){
				answers.push(answer);
			}else{
				('#choices').append(`<li class="choice">Freebie.We don't know.</li>`);
			}
			function wrongChoices(){
						//insert excpetion for entries that lack a property
						var wrongAnswer = function(){
							return result[game.random(result.length)][clueType];
						};
						for(let i=0; i<3; i++){
							var thisWrongAnswer = wrongAnswer();
							if(answers.indexOf(thisWrongAnswer) === -1 && thisWrongAnswer != answer){
								if(typeof thisWrongAnswer != 'undefined')
									answers.push(thisWrongAnswer);
							}else{
								answers.push("I really don't know.")
							}
							game.shuffle(answers);
							console.log(answers);
						}
						answers.forEach(function(answer){
							$('#choices').append(`<li class="choice">${answer.toLocaleString('en')}</li>`);
						});

					}
					wrongChoices();
					console.log(`stopwatch: ${stopwatch.time}`);




				},
				correct: function(){
					correct++;
					$('#correct').html(`Correct: ${correct}`)
					$('#result').html('Correct!');
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();

				},
				incorrect: function(){
					incorrect++
					$('#incorrect').html(`Incorrect: ${incorrect}`)
					$('#result').html(`The correct answer was ${answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();

				},
				timeOut: function(){
					unanswered++
					$('#unanswered').html(`Unanswered: ${unanswered}`)
					$('#result').html(`Time's up. The correct answer was ${answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.')
					stopwatch.pause();
				},
				stopGame: function(){
					//why does the "correct" screen prevent the game from stopping at end?
					//TO-DO: how do I stop the timer
					console.log('stopping')
					clearInterval(timeUpInterval);
					clearInterval(intervalId);
					clearInterval(stopwatchIntervalId);
					clearInterval(correctIntervalId);
				},
				restart: function(){
					console.log('firing restart', counter);
					game.stopGame();
					counter = 0;
					$('#timer').empty();
					$('#question').empty();
					$('#choices').empty();
					$('#start').toggleClass('hidden');
					$('#game-over').html('You answered all the questions. Thanks for playing.');
				},
				//only run the code a set amount of times
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
					if(!click){
					game.stopGame();
					stopwatch.pause();
					if(counter>=gameLength){
							game.timeOut();
							game.restart();
							}else{
							//show correct screen
							game.timeOut();
							//start the game again after x seconds
							game.thisInterval(game.startGameAgain, resultDuration, 1)
						}
					}
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
		},
		// Fisher–Yates Shuffle
		shuffle: function(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

	};

	var stopwatch = {
		count: function() {
			seconds = stopwatch.time--;
			$('#timer').html(stopwatch.timeConverter(seconds));
			if(stopwatch.time === 0){
				game.timeUp();
			}
		},
		start: function(){
			stopwatchIntervalId = setInterval(stopwatch.count,1000);
			//set timeout here to check for stopwatch.time == 1?
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

			stopwatch.time = 15;
		  	  //  TODO: Change the "display" div to "00:00."
		  	  $('#timer').html('00:15');

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



