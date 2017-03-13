// api endpoint (include languages?):
var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;area;'
//code to run on data return
function init(result) {
    var clueTypes = ['population', 'capital','region','area'];
    var clueType = clueTypes[random(clueTypes.length)];
    var countryIndex = random(result.length);
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
		return result[random(result.length)][clueType]
	}
	//insert excpetion for entries that lack a property
	var wrongAnswers =[wrongAnswer(), wrongAnswer(), wrongAnswer()];
	console.log(wrongAnswers)
	wrongAnswers.forEach(function(answer){$('#choices').append(`<li>${answer.toLocaleString('en')}</li>`)}
);
}

//execute when server responds
apiCall(init);

// apiCall itself is defined as follows:
function apiCall(callback) {
    $.ajax({
             url: queryURL,
             method: 'GET',
             success: callback
           })
}

function random(length){
		num = Math.floor((Math.random() * length) + 0);
		return num;
	}