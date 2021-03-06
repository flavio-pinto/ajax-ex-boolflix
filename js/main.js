/**
 * B O O L F L I X
 */

$(document).ready(function () {
    // Refs
    var searchBar = $('.navbar__search__input');
    var searchButton = $('.navbar__search__button');

    //Init Handlebars
    var source = $('#template__results').html();
    var template = Handlebars.compile(source);

    // Search movie
    // Evento click su pulsante cerca
    searchButton.click(function(){
        var query = searchBar.val().trim();
        if(query !== ''){
            apiSearch(query, template);
        } else {
            emptyFieldError();
        }
        searchBar.val('');
    });

    // Evento keyup pulsante invio nella barra di input
    searchBar.keypress(function(event) {
        var query = searchBar.val().trim();
        if((event.which == 13) && (query !== '')){
            apiSearch(query, template);
        } else if ((event.which == 13) && (query == '')) {
            emptyFieldError();
        };
    });
}); // <---- end document ready

/**********************
 **FUNZIONI************
 **********************/

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
    var resultsArea = $('.results__list');
    resetContainer(resultsArea);

    // Ciclo per chiamate ajax
    apiArrayUrls.forEach(function(element){
        $.ajax({
            url: element.url, 
            method: 'GET',
            data: {
                api_key: 'a4ea792285866fc38f076bcbb9cdca74',
                language: 'it-IT',
                query: query
            }, 
            success: function(el) {                
                if(el.results.length > 0) {
                    printShows(element.type, template, el.results);
                } else {
                    alert('Non ho trovato nessun risultato in ' + "'" + element.type + "'");
                };
            },
            error: function() {
                alert('Errore chiamata API');
            }
        });
    });
};

// Funzione per stampare i risultati
function printShows(type, template, shows){
    // Ref results list
    var resultsArea = $('.results__list');
    
    // Loop sugli elementi della lista
    for(var i = 0; i < shows.length; i++){
        var show = shows[i];
        var title, originalTitle;
        if (type === 'movie'){
            title = show.title;
            originalTitle = show.original_title;
        } else if (type === 'tv') {
            title = show.name;
            originalTitle = show.original_name;
        };

        var posterPath = 'https://image.tmdb.org/t/p/w342' + show.poster_path;

        if (show.poster_path === null){
            posterPath = 'img/no-poster.png';
        };

        var context = {
            poster: posterPath,
            title: title,
            originalLanguage: printFlag(show.original_language),
            originalTitle: originalTitle,
            rating: printStarsRating(show.vote_average),
            type: type,
            overview: show.overview.substr(0, 250) + '...'
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

// Funzione alert campo vuoto + focus
function emptyFieldError() {
    alert('Hai inserito un campo vuoto! Per favore, inserisci un valore per la ricerca');
    searchBar.focus();
}