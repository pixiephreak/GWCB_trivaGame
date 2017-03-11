var queryURL = 'https://restcountries.eu/rest/v2/all?fields=name;capital;currencies'

$.ajax({
             url: queryURL,
             method: 'GET'
           }).done(function(response){
            console.log(response);
            var thisResponse = response;
            $('body').append(JSON.stringify(thisResponse));
            console.log(response[0])
           });