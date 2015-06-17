/* global MarkerClusterer*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderGmaps = function () {

    var map;
    var position;
    var is_device = Bestpint.isMobile.any();

    //load Google Maps script async
    loadScript('http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=doRender', function () {
        console.log('google-loader has been loaded, but not the maps-API ');
    });

    function loadScript(src, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (callback) {
            script.onload = callback;
        }
        document.getElementsByTagName("head")[0].appendChild(script);
        script.src = src;
    }

    //Google Maps API callback needs to be a global function
    window.doRender = function () {

        var mc;
        var map_options = {
            center: {lat: 0, lng: 0},
            zoom: 6,
            disableDefaultUI: is_device ? false : true
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
        };

        // initialize the map on the "map" div with a given center and zoom
        map = new google.maps.Map(document.getElementById('map-canvas'), map_options);

        function addMarkers() {

            var i;
            var iLength = Bestpint.entries.length;
            var marker;
            var bounds = new google.maps.LatLngBounds();
            var latlong;
            var infowindow = new google.maps.InfoWindow();
            var markers = [];

            for (i = 0; i < iLength; i++) {

                if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {

                    latlong = new google.maps.LatLng(Bestpint.entries[i].ecplus_Place_ctrl3.latitude, Bestpint.entries[i].ecplus_Place_ctrl3.longitude);
                    marker = new google.maps.Marker({
                        position: latlong,
                        map: map,
                        title: Bestpint.entries[i].ecplus_Beer_ctrl13 + ', ' + Bestpint.entries[i].ecplus_Beer_ctrl6,
                        icon: image
                    });

                    //add current marker to bounds
                    bounds.extend(latlong);

                    //add infoWindow
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {

                        if(is_device) {
                            return function () {
                                infowindow.setContent(Bestpint.createMobileInfoContent(Bestpint.entries[i]));
                                infowindow.open(map, marker);
                            };
                        }
                        else {
                            return function () {
                                infowindow.setContent(Bestpint.createInfoWindowContent(Bestpint.entries[i]));
                                infowindow.open(map, marker);
                            };
                        }


                    })(marker, i));
                    markers.push(marker);
                }


            }

            //on desktop, show the whole data set
            if (!is_device || !(Bestpint.device_lat && Bestpint.device_long)) {
                map.setCenter(bounds.getCenter());

                //fit map to bounds
                map.fitBounds(bounds);
            }
            else {

                //on device, just show the data close to user location and amarker where the user actually is (30m accuracy)
                map.setCenter(new google.maps.LatLng(Bestpint.device_lat, Bestpint.device_long));
                map.setZoom(10);

                //show a marker with device cuurent position (30m accuracy)
                position = new google.maps.Marker({
                    position: new google.maps.LatLng(Bestpint.device_lat, Bestpint.device_long),
                    map: map
                });
            }

            //todo test if it is better to use 'tilesloaded' event
            var listener = google.maps.event.addListener(map, "idle", function () {
                Bestpint.fakeloader.fadeOut();
                google.maps.event.removeListener(listener);
            });

            //close info window tapping on map
            google.maps.event.addListener(map, "click", function(event) {
                infowindow.close();
            });

            mc = new MarkerClusterer(map, markers);
        }
        addMarkers();
    };
};