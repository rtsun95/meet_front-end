var lat;
var lng;
var markers = [];

function setMapOnOne(map, marker) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i] !== marker) {
            markers[i].setMap(null);
        }
    }
}

function geocodeLatLng(geocoder, map) {
    var latlng = {lat: lat, lng: lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {

                $('input#pac-input').val(results[1].formatted_address);

            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function processAddress (map, marker) {
    setMapOnOne(map, marker)
    map.setCenter(marker.getPosition());
    map.setZoom(16);
    lat = marker.position.lat();
    lng = marker.position.lng();
    var geocoder = new google.maps.Geocoder;
    geocodeLatLng(geocoder, map);
}

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5041866, lng: -73.5773056},
        zoom: 14,
        maxZoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        $('#submitLocation').removeClass('disabled');

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();

        lat = places[0].geometry.location.lat();
        lng = places[0].geometry.location.lng();

        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });

            marker.addListener('click', function() {
                processAddress(map, marker);
            });

            // Create a marker for each place.
            markers.push(marker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
    });
    // [END region_getplaces]
}
