/* */
$(document).ready(function () {
    'use strict';

    console.log('Let \'s display some map');
    var url = 'http://plus.epicollect.net/Bestpint/Beer.json';
    var fakeloader;
    var entries;
    var map;
    var mapOptions;

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
    $(document).ready(function () {
        fakeloader = $('#fakeloader');
        fakeloader.fakeLoader({
            timeToHide: 1500,
            bgColor: '#333',
            spinner: 'spinner1'
        });


    });

    function _createInfoWindowContent(the_entry) {

        var deferred = new $.Deferred();
        var entry = the_entry;
        var html = '';
        html += '<table class="infoWindow table table-striped table-bordered table-condensed">';
        html += '<thead><tr><th colspan="2" class="text-center">' + 'Bestpint entry' + '</th></tr></thead>';
        html += '<tbody>';


        //let's do it manually as we kow all the fields

        //name of the place
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl13 + '</td>';
        html += '<td>' + entry.ecplus_Beer_ctrl13 + '</td>';
        html += '</tr>';

        //type of place
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Place_ctrl4.key + '</td>';
        html += '<td>' + bestpint.ecplus_Place_ctrl4.values[entry.ecplus_Place_ctrl4] + '</td>';
        html += '</tr>';

        //Name of beer
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl6 + '</td>';
        html += '<td>' + entry.ecplus_Beer_ctrl6 + '</td>';
        html += '</tr>';

        //Brewery
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl8 + '</td>';
        html += '<td>' + (entry.ecplus_Beer_ctrl8 || '') + '</td>';
        html += '</tr>';

        //Type of beer
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl9.key + '</td>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl9.values[entry.ecplus_Beer_ctrl9] + '</td>';
        html += '</tr>';

        //photo (todo check for landscape and portrait)
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl7 + '</td>';
        html += '<td style:"height: 200px" ><img src="' + entry.ecplus_Beer_ctrl7 + '" width="100" /></td>';
        html += '</tr>';

        //How would you rate it
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl14.key + '</td>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] + '</td>';
        html += '</tr>';

        //how is the price range
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl11.key + '</td>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] + '</td>';
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

        $("img").one("load", function () {

            deferred.resolve(html);
            // do stuff
        }).each(function () {
            if (this.complete) {
                $(this).load();
            }
        });

        //$('img').on('load',function () {
        //
        //    deferred.resolve(html);
        //
        //});

        return deferred.promise();
    }

    function initialize() {

        mapOptions = {
            center: {lat: 0, lng: 0},
            zoom: 8
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

                latlong = new google.maps.LatLng(entries[i].ecplus_Place_ctrl3.latitude, entries[i].ecplus_Place_ctrl3.longitude);
                marker = new google.maps.Marker({
                    position: latlong,
                    map: map,
                    title: entries[i].ecplus_Beer_ctrl13 + ', ' + entries[i].ecplus_Beer_ctrl6,
                    icon: image
                });

                //add current marker to bounds
                bounds.extend(latlong);

                //add infoWindow
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {

                        $.when(_createInfoWindowContent(entries[i])).then(function (response) {

                            infowindow.setContent(response);
                            infowindow.open(map, marker);
                        });
                    };
                })(marker, i));

            }

            //fit map to bounds
            map.fitBounds(bounds);
        }


        addMarkers();
    }

    ///try a cors request to epicollect server using yql https://developer.yahoo.com/yql
    $.getJSON("http://query.yahooapis.com/v1/public/yql",
        {
            q: "select * from json where url='http://plus.epicollect.net/Bestpint/Beer.json'",
            format: "json"
        },
        function (data) {
            //console.log(data);
            entries = data.query.results.json.json;
            console.log(data.query.results.json.json);


            //on Bestpint project on Epicollect+, 'ecplus_Place_ctrl3' is the key of the location object

            //display entries on map
            //init maps
            initialize();

            fakeloader.fadeOut();
        });
});
