const gameSearch = $("#game-search");
const gameTitle = $("#game-title");
const gameDesc = $("#description");
const gameRatingLink = $("#metacritic");
const gameRatingMeta = $("#meta-rating");
const gameRating = $("#overall-rating");
const gameRatingContainer = $("#rating-container");
const gamePoster = $("#poster");

gameTitle.text("Search for a game dude!");
gameDesc.text("Once you search for a game up in the top right corner, we'll display the information for it down here, including the summary, average rating, and the cover art!");
gamePoster.hide();
gameRatingContainer.hide();

$("#submit").click(function() {
    if (gameSearch.val() != "") {
        displayGame()
    }

})

function displayGame() {
    var searchTerm = gameSearch.val().replace(' ', '-');
    $.ajax(`https://api.rawg.io/api/games?search=banjo-kazooiehttps://api.rawg.io/api/games?search=${searchTerm}`)
    .then(function(result) {
        console.log(result)
        return $.ajax(`https://api.rawg.io/api/games/${result.results[0].id}`)
    })
    .then(function(result) {
        console.log(result)

        //name/desc
        gameTitle.text(result.name)
        gameDesc.html(result.description)

        //poster/screenshot
        gamePoster.children().children().attr('src', result.background_image)
        gamePoster.children().children().attr('style', 'width:512px;height:512px;')
        gamePoster.show()

        //ratings
        gameRatingLink.attr('href', result.metacritic_url)
        gameRatingMeta.text(result.metacritic)
        gameRating.text(result.rating)
        gameRatingContainer.show()
    })
}