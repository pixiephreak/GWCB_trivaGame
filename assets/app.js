	//interval for question screen
	var intervalId;
	//interval for stopwatch
	var stopwatchIntervalId;
	//interval for correct screen
	var correctIntervalId;
	// interval for timeUp scree
	var timeUpInterval;

	var model = {
	// api endpoint (include languages?):
	queryURL: 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;',
	//set number of questions TO-DO ask for user input
	gameLength:5,
	//set how much time the player has to answer + 2
	timerDuration: 16*1000,
	// set how much time the player has to see result +2
	resultDuration: 5*1000,
	//correct answer each time a question loads
	answer: '',
	//record # correct for each round of game
	correct: 0,
	//record # inccorect for each round of game
	incorrect: 0,
	//record # inccorect for each round of game
	unanswered: 0,
	//keeps track of how many questions have been asked
	counter:0,
	//keep track of clicks
	click: false
}

	//code to run on data return
	var game = {
		init: function(){
			//Question: why does this off/on click syntax work on dynamically created elements?
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
					model.click = true;
					if(($(this).html()) == model.answer){
						game.stopGame();
						//have the set number of questions been asked?
						if(model.counter>=model.gameLength){
							game.correct();
							game.restart();
							}else{
							//show correct screen
							game.correct();
							//start the game again after x seconds
							game.thisInterval(game.startGameAgain, model.resultDuration, 1);
						}
					}else{
						game.stopGame();
						if(model.counter>=model.gameLength){
							// display incorrect scree
							game.incorrect();
							// show/hide elem for start of game
							game.restart();
						}else{
						game.incorrect();
						//if the game isn't over, then start it again after the established # of seconds
						//Question: what would be a better/other way to do this?
						game.thisInterval(game.startGameAgain, model.resultDuration, 1);
					}
					}
				});
			});

		},
		//show questions at a set interval
		startGame: function(){
			intervalId = setInterval(game.showQuestion,model.timerDuration);
		},
		//reset intervals and call them again to restart
		startGameAgain: function(){
			stopwatch.reset();
			stopwatch.start();
			game.showQuestion();
			game.startGame();
		},
		//use data in api response object to create trivia questions
		showQuestion: function(){
			//reset model data and displays
			model.counter++;
			console.log(model.counter);
			stopwatch.reset();
			$('#choices').empty();
			$('#result').empty();
			//TO-DO move clue type/question/etc to model and wrongChoices to game obj
			var clueTypes = ['population', 'capital','region','area'];
			var clueType = clueTypes[game.random(clueTypes.length)];
			var countryIndex = game.random(result.length);
			var country = result[countryIndex];
			var question = `What is the ${clueType} of ${country.name}?`;
			console.log(question);
			$('#question').html(question);
			//Retreive and store answer from data obj
			model.answer = country[clueType];
			answers = [];
			console.log('answer', model.answer);
			if(typeof model.answer != 'undefined'){
				answers.push(model.answer.toLocaleString('en'));
			}else{
				//if answer is undefined, include alternative data
				('#choices').append(`<li class="choice">Freebie.We don't know.</li>`);
			}
			//generate wrong choices by accessing clueType data on other countries
			function wrongChoices(){
						//insert excpetion for entries that lack a property
						var wrongAnswer = function(){
							return result[game.random(result.length)][clueType];
						};
						for(let i=0; i<3; i++){
							var thisWrongAnswer = wrongAnswer();
							if(answers.indexOf(thisWrongAnswer) === -1 && thisWrongAnswer != model.answer){
								if(typeof thisWrongAnswer != 'undefined')
									answers.push(thisWrongAnswer);
							}else{
								answers.push("I really don't know.");
							}
							//randomize order that answers are stored in answers array
							game.shuffle(answers);
							console.log(answers);
						}
						//display each entry in answers array by adding to dom
						answers.forEach(function(answer){
							$('#choices').append(`<li class="choice">${answer.toLocaleString('en')}</li>`);
						});

					}
					wrongChoices();
				},
				//display appropriate info if user clicks correct answer
				correct: function(){
					model.correct++;
					$('#correct').html(`Correct: ${model.correct}`);
					$('#result').html('Correct!');
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.');
					stopwatch.pause();

				},
				//or incorrect answer
				incorrect: function(){
					model.incorrect++;
					$('#incorrect').html(`Incorrect: ${model.incorrect}`)
					$('#result').html(`The correct answer was ${model.answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.');
					stopwatch.pause();

				},
				//or doesn't answer in allotted time
				timeOut: function(){
					model.unanswered++;
					$('#unanswered').html(`Unanswered: ${model.unanswered}`);
					$('#result').html(`Time's up. The correct answer was ${model.answer}.`);
					$('#question').empty();
					$('#choices').empty();
					$('#question').html('Please stand by for the next question.');
					stopwatch.pause();
				},
				//clear all game intervals
				stopGame: function(){
					console.log('stopping');
					clearInterval(timeUpInterval);
					clearInterval(intervalId);
					clearInterval(stopwatchIntervalId);
					clearInterval(correctIntervalId);
				},
				restart: function(){
					console.log('firing restart', model.counter);
					game.stopGame();
					model.counter = 0;
					$('#timer').empty();
					$('#question').empty();
					$('#choices').empty();
					$('#start').toggleClass('hidden');
					$('#game-over').html('You answered all the questions. Thanks for playing.');
				},
				//only run the code at an interval a set amount of times
				//Question: is this an overly complicated approach?
				thisInterval: function(callback, delay, repetitions) {
					var x = 0;
					var intervalID = window.setInterval(function () {
						callback();
						if (++x === repetitions) {
							window.clearInterval(intervalID);
						}
					}, delay);
				},
				//check if user has failed to select and answer in allotted time.
				timeUp: function(){
					game.stopGame();
					stopwatch.pause();
					if(model.counter>=model.gameLength){
							game.timeOut();
							game.restart();
							}else{
							//show correct screen
							game.timeOut();
							//start the game again after x seconds
							game.thisInterval(game.startGameAgain, model.resultDuration, 1);
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
	//time-keeping object
	var stopwatch = {
		time: 15,
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
		  	  $('#timer').html('00:15');

		  	}
		};
		//callback to start game at api return
		  function init(result) {
		  	game.init();
		  }
		  //callback to start game should api fail
		  function onFail(){
		  	game.init();
		  }

	//execute when server responds with api data
	apiCall(init);

	// apiCall itself is defined as follows:
	function apiCall(callback) {
		$.ajax({
			url: model.queryURL,
			method: 'GET',
			success: callback,
			error: onFail()
		});
	}



