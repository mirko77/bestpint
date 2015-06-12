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
        zoomControl: is_device ? false : true
        //disableDefaultUI: is_device ? true : false
    };

    var image = L.icon({
        iconUrl: 'img/marker-icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    //set default images path since we are using a custom location
    L.Icon.Default.imagePath = './img/leaflet/';

    // initialize the map on the "map" div with a given center and zoom
    map = L.map('map-canvas', map_options);
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
        var iLength = Bestpint.entries.length;
        var marker;
        var position;
        var coords = [];


        cluster = new L.MarkerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 10});

        for (i = 0; i < iLength; i++) {

            // console.log(entries[i].ecplus_Place_ctrl3.latitude, ', ' + entries[i].ecplus_Place_ctrl3.longitude);

            if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {


                marker = L.marker([Bestpint.entries[i].ecplus_Place_ctrl3.latitude, Bestpint.entries[i].ecplus_Place_ctrl3.longitude], {icon: image});
                // marker.addTo(map);

                if (!is_device) {
                    //on desktop, create full info window content (bootstrap table)
                    marker.bindPopup(Bestpint.createInfoWindowContent(Bestpint.entries[i]));
                }
                else {

                    //on device, show a mobile friendly info window with crucial data only (titles + picture (if any))
                    marker.bindPopup(Bestpint.createMobileInfoContent(Bestpint.entries[i]), {closeButton: false});
                }

                coords.push([Bestpint.entries[i].ecplus_Place_ctrl3.latitude, Bestpint.entries[i].ecplus_Place_ctrl3.longitude]);
                cluster.addLayer(marker);
            }
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