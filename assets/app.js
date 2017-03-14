
	// api endpoint (include languages?):
	var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;';
	var gameLength = 5;
	var timerDuration = 12*1000;
	var time = 0;
	var answer;
	var score = 0;
	var intervalId;
	var stopwatchIntervalId;
	//code to run on data return
	var game = {
		init: function(){

			$('#start').off('click').on('click', function(){
				//figure out how to start stopwatch and hide 'page loading' when api comes back (is it in ajax call?)
				stopwatch.start();
				$('#loadingDiv').html('Page loading...');
				setTimeout(game.removeLoader(), 1000);
				$('#start').toggleClass('hidden');
				$('#loading').html("questions loading");
				intervalId = setInterval(game.showQuestion,timerDuration);
				$('#choices').off('click', '.choice').on('click', '.choice', function(){
					if(($(this).html()) == answer){
						score++;
						$('#result').html('Correct!');
						$('#question').empty();
						$('#choices').empty();

					}
				});
			});

		},
		showQuestion: function(){
			stopwatch.reset();
			console.log(gameLength);
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
						};
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
						});

				}
			wrongChoices();
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

	var stopwatch = {

	  time: 0,
	  count: function() {
	  	console.log('incounter',stopwatch.time);
	        seconds = stopwatch.time++
	        $('#timer').html(stopwatch.timeConverter(seconds));
	  },
	  start: function(){
	  	stopwatchIntervalId = setInterval(stopwatch.count,1000);
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

		  	  stopwatch.time = 0;
		  	  console.log('inreset',stopwatch.time);
		  	  //  TODO: Change the "display" div to "00:00."
		  	  $('#timer').html('00:00');

		  	}
		}

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


