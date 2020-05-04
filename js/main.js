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

    searchButton.click(function(){
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: 'a4ea792285866fc38f076bcbb9cdca74',
                language: 'it-IT',
                query: searchBar.val()
            },
            success: function(res){
                resultsArea.html('');
                var searchResults = res.results;
                for(var i = 0; i < searchResults.length; i++){
                    var singleResult = searchResults[i];
                    var context = {
                        title: singleResult.title,
                        originalLanguage: singleResult.original_language,
                        originalTitle: singleResult.original_title,
                        rating: singleResult.vote_average
                    };
                    var html = template(context);
                    resultsArea.append(html);
                }
            },
            error: function(){
                console.log('ERRORE');
            }
        });

        searchBar.val('');
    });
}); // <---- end document ready