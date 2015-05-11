/* */
$(document).ready(function () {
    'use strict';

    console.log('Let \'s display some map');
    var url = 'http://plus.epicollect.net/Bestpint/Beer.json';
    var fakeloader;
    var entries;
    var map;
    var mapOptions;
    var is_device;
    var device_lat;
    var device_long;

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    var bestpint = {
        created: '',
        ecplus_Beer_ctrl6: 'Name of beer',
        ecplus_Beer_ctrl7: "Take a photo of the beer",
        ecplus_Beer_ctrl8: "Brewery",
        ecplus_Beer_ctrl9: {
            key: 'Type of beer',
            values: {
                1: 'Ale',
                2: 'Pale Ale',
                3: 'IPA',
                4: 'Porter',
                5: 'Stout',
                6: 'Other'
            }
        },
        ecplus_Beer_ctrl11: {
            key: 'How is the price range?',
            values: {
                1: 'Expensive',
                2: 'Average',
                3: 'Cheap'
            }
        },
        ecplus_Beer_ctrl12: "Price and currency?",
        ecplus_Beer_ctrl13: "Name of the place?",
        ecplus_Beer_ctrl14: {
            key: 'How would you rate it?',
            values: {
                1: 'Excellent',
                2: 'Good',
                3: 'Average',
                4: 'Fair',
                5: 'Poor'
            }
        },
        ecplus_Place_ctrl3: "Location",
        ecplus_Place_ctrl4: {
            key: 'Type of Place',
            values: {
                1: 'Pub',
                2: 'Bar',
                3: 'Festival',
                4: 'Exhibition',
                5: 'Brewery',
                6: 'Other'
            }
        },
        ecplus_Place_ctrl5: "Any comments?"

    };

    var image = {
        url: 'img/marker-icon.png',
        size: new google.maps.Size(128, 128),

        //size to be displayed (down from orignal 128 x128)
        scaledSize: new google.maps.Size(32, 32),

        //origin of the image is 0,0 top left
        origin: new google.maps.Point(0, 0),
        //specify the anchor based on the scaled image (i.e keep the image centerd over the lat,long location otherwise it shifts)
        anchor: new google.maps.Point(16, 16)
    }

    //http://joaopereirawd.github.io/fakeLoader.js/
    fakeloader = $('#fakeloader');
    fakeloader.fakeLoader({
        timeToHide: 1000000,
        bgColor: '#333',
        spinner: 'spinner1'
    });

    $('#proxy-error').hide();


    function _createInfoWindowContent(the_entry) {

        var entry = the_entry;
        var html = '';

        //replace missing images (and the horrible ec+ placeholder) with nice placeholder
        if (entry.ecplus_Beer_ctrl7 === undefined || entry.ecplus_Beer_ctrl7.indexOf('thumbnail=true') > -1) {
            entry.ecplus_Beer_ctrl7 = 'img/placeholder.png';
        }


        html += '<table class="infoWindow table table-striped table-bordered table-condensed">';
        html += '<thead><tr><th colspan="2" class="text-center">' + (entry.ecplus_Beer_ctrl6 || '') + '</th></tr></thead>';
        html += '<tbody>';


        //let's do it manually as we kow all the fields

        //name of the place
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl13 + '</td>';
        html += '<td>' + (entry.ecplus_Beer_ctrl13 || '') + '</td>';
        html += '</tr>';

        //type of place
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Place_ctrl4.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Place_ctrl4.values[entry.ecplus_Place_ctrl4] || '') + '</td>';
        html += '</tr>';

        //Name of beer
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl6 + '</td>';
        html += '<td>' + (entry.ecplus_Beer_ctrl6 || '') + '</td>';
        html += '</tr>';

        //Brewery
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl8 + '</td>';
        html += '<td>' + (entry.ecplus_Beer_ctrl8 || '') + '</td>';
        html += '</tr>';

        //Type of beer
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl9.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Beer_ctrl9.values[entry.ecplus_Beer_ctrl9] || '') + '</td>';
        html += '</tr>';

        //photo (todo check for landscape and portrait)
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl7 + '</td>';
        //set fixed height for table cell to avoid cell resizing messing up the auto panning when infoWindow is open
        html += '<td height="200" class="pint-image-cell"><img class="pint-image" src="' + entry.ecplus_Beer_ctrl7 + '" width="100" /></td>';
        html += '</tr>';

        //How would you rate it
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl14.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
        html += '</tr>';

        //how is the price range
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl11.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
        html += '</tr>';

        //price and currency
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl12 + '</td>';
        html += '<td>' + (entry.ecplus_Beer_ctrl12 || '') + '</td>';
        html += '</tr>';

        //Any comments?
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Place_ctrl5 + '</td>';
        html += '<td>' + (entry.ecplus_Place_ctrl5 || '') + '</td>';
        html += '</tr>';

        html += '</tbody>';
        html += '</table>';

        return html;
    }

    function initialize() {

        if (is_device) {
            $('#map-canvas').height('100vh');
        }

        mapOptions = {
            center: {lat: 0, lng: 0},
            zoom: 6,
            disableDefaultUI: is_device ? true : false
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        function addMarkers() {

            var i;
            var iLength = entries.length;
            var bounds = new google.maps.LatLngBounds();
            var latlong;
            var marker;
            var infowindow = new google.maps.InfoWindow();

            for (i = 0; i < iLength; i++) {

                console.log(entries[i].ecplus_Place_ctrl3.latitude, ', ' + entries[i].ecplus_Place_ctrl3.longitude);

                if (entries[i].ecplus_Place_ctrl3.latitude !== "") {

                    latlong = new google.maps.LatLng(entries[i].ecplus_Place_ctrl3.latitude, entries[i].ecplus_Place_ctrl3.longitude);
                    marker = new google.maps.Marker({
                        position: latlong,
                        map: map,
                        title: entries[i].ecplus_Beer_ctrl13 + ', ' + entries[i].ecplus_Beer_ctrl6,
                        icon: image
                    });
                }

                //add current marker to bounds
                bounds.extend(latlong);

                //add infoWindow
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(_createInfoWindowContent(entries[i]));
                        infowindow.open(map, marker);
                    };
                })(marker, i));

            }

            if (!is_device || !(device_lat && device_long)) {
                map.setCenter(bounds.getCenter());

                //fit map to bounds
                map.fitBounds(bounds);
            }
            else {
                map.setCenter(new google.maps.LatLng(device_lat, device_long));
                map.setZoom(10);
            }


            var listener = google.maps.event.addListener(map, "idle", function () {
                //    console.log(map.getZoom());
                //
                //   // map.setZoom(map.getZoom() + 1);
                fakeloader.fadeOut();
                //
                google.maps.event.removeListener(listener);
            });
        }


        addMarkers();
    }

    is_device = isMobile.any();


///try a cors request to epicollect server using yql https://developer.yahoo.com/yql
    $.getJSON("http://query.yahooapis.com/v1/public/yql",
        {
            q: "select * from json where url='http://plus.epicollect.net/Bestpint/Beer.json'",
            format: "json"
        },
        function (data, status) {
            //console.log(data);
            console.log(status);

            //if the proxy is down for some reasons, show error message
            if (data.query.results) {

                entries = data.query.results.json.json;
                console.log(data.query.results.json.json);


                //get user location (on mobile only) to give just the entries around the area
                if (is_device) {

                    //get current position first
                    var onPosSuccess = function (position) {

                        device_lat = position.coords.latitude;
                        device_long = position.coords.longitude

                        initialize();
                    }

                    var onPosError = function (error) {
                        console.log(error);
                        initialize();
                    }

                    navigator.geolocation.getCurrentPosition(onPosSuccess, onPosError);


                }
                else {
                    //display entries on map
                    //init maps
                    initialize();
                }
            }
            else {

                $('#map-canvas').hide();
                $('#proxy-error').show();
                fakeloader.fadeOut();

            }


        });
});
