/**
 * B O O L F L I X
 */

$(document).ready(function () {
    // Refs
    var searchBar = $('.search-area .search-bar');
    var searchButton = $('.search-area .search-button');

    //Init Handlebars
    var source = $('#results-template').html();
    var template = Handlebars.compile(source);

    // Search movie
    searchButton.click(function(){
        var query = searchBar.val().trim();

        if(query !== ''){
            apiSearch(query, template);
        } else {
            alert('Hai inserito un campo vuoto! Per favore, inserisci un valore per la ricerca');
            searchBar.focus();
        }
        searchBar.val('');
    });
}); // <---- end document ready

// Funzione api call
function apiSearch(query, template) {
    //Variables
    var apiBasicUrl = 'https://api.themoviedb.org/3/search/';
    var apiArrayUrls = [
        {
            type: 'movie',
            url: apiBasicUrl + 'movie'
        },
        {
            type: 'tv',
            url: apiBasicUrl + 'tv'
        }
    ];

    //References
    var searchBar = $('.search-area .search-bar');
    var resultsArea = $('.results .display-results');
    resetContainer(resultsArea);

    // Ciclo per chiamate ajax
    for(var i = 0; i < apiArrayUrls.length; i++) {
        var apiUrl = apiArrayUrls[i];
        $.ajax({
            url: apiUrl.url, 
            method: 'GET',
            data: {
                api_key: 'a4ea792285866fc38f076bcbb9cdca74',
                language: 'it-IT',
                query: query
            }, 
            success: function(res) {                
                if(res.results.length > 0) {
                    printShows(apiUrl.type, template, res.results);
                } else {
                    resultsArea.append('Non ho trovato nessun risultato in ' + "'" + apiUrl.type + "'" + '<br>');
                };
            },
            error: function() {
                alert('Errore chiamata API');
            }
        });
    };
};

// Funzione per stampare i risultati
function printShows(type, template, shows){
    // Ref results list
    var resultsArea = $('.results .display-results');
    
    // Loop sugli elementi della lista
    for(var i = 0; i < shows.length; i++){
        var show = shows[i];
        var context = {
            title: show.title || show.name,
            originalLanguage: printFlag(show.original_language),
            originalTitle: show.original_title || show.original_name,
            rating: printStarsRating(show.vote_average),
            type: type
        };
        var html = template(context);
        resultsArea.append(html);
    };
};

// Funzione di reset
function resetContainer(element){
    element.html('');
}

// Funzione stampa voto stelline
function printStarsRating(val) {
    var toStarsRating = Math.ceil(val / 2);
    var starsHtml = '';
    var fullStar = '<i class="fas fa-star"></i>';
    var emptyStar = '<i class="far fa-star"></i>';

    for(var i = 0; i < 5; i++) {
        if(toStarsRating > i) {
            starsHtml += fullStar;
        } else {
            starsHtml += emptyStar
        };
    }
    return starsHtml;
}

// Funzione stampa bandiera al posto della lingua originale
function printFlag(lang) {
    var italyFlag = '<img class="flag" src="img/it.svg" alt="italy flag">';
    var englishFlag = '<img class="flag" src="img/en.svg" alt="england flag">';

    if(lang == 'it') {
        return italyFlag;
    } else if (lang == 'en') {
        return englishFlag;
    } else {
        return lang;
    }
};

