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

var loadPage = function () {
    var gameValue = localStorage.getItem("game");

    if (gameValue !== null) {
        gameArray = JSON.parse(gameValue);

        for (i = 0; i < gameArray.length; i++) {
            var searchedGame = gameArray[i];
            console.log(searchedGame);
            addSearchHistoryItem(searchedGame);
        }
    }
}

loadPage();

//Add search hitory to page an make clickable 
function addSearchHistoryItem(game) {
    var history = document.createElement("a");
    history.setAttribute("class", "navbar-item");
    history.innerHTML = game;
    var searched = document.querySelector("#searched");
    searched.appendChild(history);
    history.addEventListener("click", () => {
        displayGame(event.target.textContent);
        console.log(event.target.textContent);
    });
    console.log(game);
}

document.querySelector(".navbar-item").addEventListener("click", function(event){

});


function addSearchHistory(game) {
    var getGame = localStorage.getItem("game");
    var gameArray = [];

    // if get city is empty, make new array of city
    if (getGame == null) {
        gameArray.unshift(game);
    } else {
        gameArray = JSON.parse(getGame);
        gameArray.push(game);
    }

    // if it's not empty
    var gameString = JSON.stringify(gameArray);

    localStorage.setItem("game", gameString);
    addSearchHistoryItem(game);
}

function handleSearchEvent() {
    var input = document.querySelector("input").value;
    // console.log(input);
    displayGame(input);
    addSearchHistory(input);
    addSearchHistoryItem(input);
}


$("#submit").click(function () {
    if (gameSearch.val() != "") {
        handleSearchEvent();
    }

})

function displayGame(game) {
    // var searchTerm = gameSearch.val().replace(' ', '-');
    $.ajax(`https://api.rawg.io/api/games?search=banjo-kazooiehttps://api.rawg.io/api/games?search=${game}`)
        .then(function (result) {
            // console.log(result)
            return $.ajax(`https://api.rawg.io/api/games/${result.results[0].id}`)
        })
        .then(function (result) {
            // console.log(result)

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

function initMap() {
    gamesMap = new google.maps.Map(document.getElementById('games-map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(gamesMap);
            gamesMap.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, gamesMap.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, gamesMap.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(gamesMap);
}

