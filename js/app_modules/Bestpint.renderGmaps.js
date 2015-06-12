/* global L*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderGmaps = function () {

    var map;
    var tiles;
    var cluster;
    var is_device = Bestpint.isMobile.any();

    var map_options = {
        center: {lat: 0, lng: 0},
        zoom: 6,
        disableDefaultUI: is_device ? false : true
    };

    // initialize the map on the "map" div with a given center and zoom
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function addMarkers() {

        var i;
        var iLength = Bestpint.entries.length;
        var marker;
        var position;
        var coords = [];
        var bounds = new google.maps.LatLngBounds();
        var latlong;
        var infowindow = new google.maps.InfoWindow();
        var markers = [];

        cluster = new L.MarkerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 10});

        for (i = 0; i < iLength; i++) {

            if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {


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
                        infowindow.setContent(_createInfoWindowContent(entries[i]));
                        infowindow.open(map, marker);
                    };
                })(marker, i));
            }

            markers.push(marker);
        }


        //on desktop, show the whole data set
        if (!is_device || !(Bestpint.device_lat && Bestpint.device_long)) {
            //fit bounds to whole data set
            map.fitBounds(coords, {padding: [50, 50]});
        }
        else {
            //on device, just show the data close to user location and amarker where the user acutally is (30m accuracy)

            position = L.marker([Bestpint.device_lat, Bestpint.device_long]);
            position.addTo(map);
            map.fitBounds([[Bestpint.device_lat, Bestpint.device_long]], {padding: [100, 100]});
            map.setZoom(12, {animate: true});
        }

        map.addLayer(cluster);

        tiles.on("load", function () {
            console.log("all visible tiles have been loaded");
            Bestpint.fakeloader.fadeOut();
        });
    }

    addMarkers();


};