const gameSearch = $("#game-search");
const gameTitle = $("#game-title");
const gameDesc = $("#description");
const gameRatingLink = $("#metacritic");
const gameRatingMeta = $("#meta-rating");
const gameRating = $("#overall-rating");
const gameRatingContainer = $("#rating-container");
const gamePoster = $("#poster");
var map;
var service;
var infoWindow;

gameTitle.text("Search for a game dude!");
gameDesc.text("Once you search for a game up in the top right corner, we'll display the information for it down here, including the summary, average rating, and the cover art!");
gamePoster.hide();
gameRatingContainer.hide();


$("#submit").click(function () {
    if (gameSearch.val() != "") {
        displayGame()
    }

})

function displayGame() {
    var searchTerm = gameSearch.val().replace(' ', '-');
    $.ajax(`https://api.rawg.io/api/games?search=banjo-kazooiehttps://api.rawg.io/api/games?search=${searchTerm}`)
        .then(function (result) {
            console.log(result)
            return $.ajax(`https://api.rawg.io/api/games/${result.results[0].id}`)
        })
        .then(function (result) {
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

function initialize() {
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            map = new google.maps.Map(document.getElementById('games-map'), {
                center: pos,
                zoom: 15
                });

            var request = {
                location: pos,
                radius: '41000',
                type: ['restaurant']
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
            
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

  
}

function createMarker(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');
  
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
  
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
  
    
  
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function callback(results, status) {
    console.log(results, status);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
      createMarker(results);
      
    
  }
}


