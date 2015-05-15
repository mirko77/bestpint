/* global L, $ */
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
    var cluster;
    var tiles;

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

    var image = L.icon({
        iconUrl: 'img/marker-icon.png',
        // size: new google.maps.Size(128, 128),

        //size to be displayed (down from orignal 128 x128)
        iconSize: [32, 32],

        //origin of the image is 0,0 top left
        //  origin: new google.maps.Point(0, 0),
        //specify the anchor based on the scaled image (i.e keep the image centerd over the lat,long location otherwise it shifts)
        iconAnchor: [16, 16]
    });

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


        html += '<table class="infoWindow table-striped table-bordered table-condensed">';
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


        //html += '<tr>';
        //html += '<td colspan="2" class="text-center">' + bestpint.ecplus_Beer_ctrl7 + '</td>';
        //html += '</tr>';
        html += '<tr colspan="2">';
        //set fixed height for table cell to avoid cell resizing messing up the auto panning when infoWindow is open
        html += '<tr><td colspan="2" class="img-wrapper">';
        html += '<div class="desktop-frame-square">';
        html += '<div class="crop">';
        html += '<i class="fa fa-spinner fa-spin fa-3x"></i>';
        html += '<img src="' + entry.ecplus_Beer_ctrl7 + '" alt="" title="" width="200">';
        html += '</div>';
        html += '</div>';
        html += '</td></tr>';
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

    function _createMobileInfoContent(the_entry) {

        var entry = the_entry;
        var html = '';

        //replace missing images (and the horrible ec+ placeholder) with nice placeholder
        if (entry.ecplus_Beer_ctrl7 === undefined || entry.ecplus_Beer_ctrl7.indexOf('thumbnail=true') > -1 || entry.ecplus_Beer_ctrl7 === '') {
            entry.ecplus_Beer_ctrl7 = 'img/placeholder.png';
        }

        html += '<table class="mobile-info-window table-condensed table-bordered table-striped">';
        html += '<thead><tr><th colspan="2" class="text-center">' + (entry.ecplus_Beer_ctrl6 || '') + ', ' + (entry.ecplus_Beer_ctrl13 || '') + '</th></tr></thead>';
        html += '<tbody>';

        //How would you rate it
        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl14.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<td>' + bestpint.ecplus_Beer_ctrl11.key + '</td>';
        html += '<td>' + (bestpint.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
        html += '</tr>';


        html += '<tr><td colspan="2" class="img-wrapper">';
        html += '<div class="frame-square">';
        html += '<div class="crop">';
        html += '<i class="fa fa-spinner fa-spin fa-3x"></i>';
        html += '<img src="' + entry.ecplus_Beer_ctrl7 + '" alt="" title="small wide image">';
        html += '</div>';
        html += '</div>';
        html += '</td></tr>';

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
            zoomControl: is_device ? false : true
            //disableDefaultUI: is_device ? true : false
        };

        //set default images path since we are using a custom location
        L.Icon.Default.imagePath = './img/leaflet/';

        // initialize the map on the "map" div with a given center and zoom
        map = L.map('map-canvas', mapOptions);
        //  map.addControl(L.control.zoom({position: 'bottomleft'}));
        tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        ////center popup when it is open
        map.on('popupopen', function (e) {
            var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
            px.y -= e.popup._container.clientHeight / 2;// find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            map.panTo(map.unproject(px), {animate: true}); // pan to new center
        });

        function addMarkers() {

            var i;
            var iLength = entries.length;
            var marker;
            var position;
            var coords = [];


            cluster = new L.MarkerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 10});

            for (i = 0; i < iLength; i++) {

                // console.log(entries[i].ecplus_Place_ctrl3.latitude, ', ' + entries[i].ecplus_Place_ctrl3.longitude);

                if (entries[i].ecplus_Place_ctrl3.latitude !== "") {


                    marker = L.marker([entries[i].ecplus_Place_ctrl3.latitude, entries[i].ecplus_Place_ctrl3.longitude], {icon: image});
                    // marker.addTo(map);

                    if (!is_device) {
                        //on desktop, create full info window content (bootstrap table)
                        marker.bindPopup(_createInfoWindowContent(entries[i]));
                    }
                    else {

                        //on device, show a mobile friendly info window with crucial data only (titles + picture (if any))
                        marker.bindPopup(_createMobileInfoContent(entries[i]), {closeButton: false});
                    }

                    coords.push([entries[i].ecplus_Place_ctrl3.latitude, entries[i].ecplus_Place_ctrl3.longitude]);
                    cluster.addLayer(marker);
                }
            }


            //on desktop, show the whole data set
            if (!is_device || !(device_lat && device_long)) {
                //fit bounds to whole data set
                map.fitBounds(coords, {padding: [50, 50]});
            }
            else {
                //on device, just show the data close to user location and amarker where the user acutally is (30m accuracy)

                position = L.marker([device_lat, device_long]);
                position.addTo(map);
                map.fitBounds([[device_lat, device_long]], {padding: [100, 100]});
                map.setZoom(12, {animate: true});
            }

            map.addLayer(cluster);

            tiles.on("load", function () {
                console.log("all visible tiles have been loaded");
                fakeloader.fadeOut();
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

                //load test
                var i;
                var iLength = 250000;
                var entry;


                //for (i = 0; i < iLength; i++) {
                //
                //    entry = entries[Math.floor(Math.random() * 10) + 1];
                //    entry.ecplus_Place_ctrl3.latitude = chance.latitude();
                //    entry.ecplus_Place_ctrl3.longitude = chance.longitude();
                //
                //    entries.push(entry);
                //}
                //console.log('Test with total entries of ' + entries.length);


                //get user location (on mobile only) to give just the entries around the area
                if (is_device) {

                    //get current position first
                    var onPosSuccess = function (position) {

                        device_lat = position.coords.latitude;
                        device_long = position.coords.longitude;

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
                $('#proxy-error').removeClass('hidden');
                fakeloader.fadeOut();
            }
        });
});
