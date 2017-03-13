// api endpoint:
var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;languages'
//code to run on data return
function init(result) {
    var clueType = ['name', 'languages', 'capital'];
    var countryIndex = random(result.length);
    var country = result[countryIndex];
    var languages = result[countryIndex].languages;
    var languagesArr = [];
    languages.forEach(function(language) {
  		languagesArr.push(language.name);
	});
	console.log(languagesArr);
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