/**
 * B O O L F L I X
 */

$(document).ready(function () {
    // Refs
    var searchBar = $('.search-area .search-bar');
    var searchButton = $('.search-area .search-button');
    var resultsArea = $('.results .display-results');

    //Init Handlebars
    var source = $('#results-template').html();
    var template = Handlebars.compile(source);

    // Search movie
    searchButton.click(function(){
        var query = searchBar.val().trim();

        if(query !== ''){
            $.ajax({
                url: 'https://api.themoviedb.org/3/search/movie',
                method: 'GET',
                data: {
                    api_key: 'a4ea792285866fc38f076bcbb9cdca74',
                    language: 'it-IT',
                    query: query
                },
                success: function(res){
                    var searchResults = res.results;

                    if(searchResults.length > 0) {
                        printMovies(template, searchResults, resultsArea);
                    } else {
                        alert('Nessun film trovato');
                        searchBar.select();
                    }
                },
                error: function(){
                    alert('Errore chiamata API');
                }
            });
        } else {
            alert('Hai inserito un campo vuoto! Per favore, inserisci un valore per la ricerca');
            searchBar.focus();
        }

        searchBar.val('');
    });
}); // <---- end document ready

// Funzione per stampare i risultati
function printMovies(template, movies, container){
    // Reset lista
    resetContainer(container);
    // Loop sugli elementi della lista
    for(var i = 0; i < movies.length; i++){
        var movie = movies[i];
        var context = {
            title: movie.title,
            originalLanguage: printFlag(movie.original_language),
            originalTitle: movie.original_title,
            rating: printStarsRating(movie.vote_average)
        };
        var html = template(context);
        container.append(html);
    }
}

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
}