/* global Microsoft, PinClusterer*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderBingMaps = function () {

    var map;
    var position;
    var is_device = Bestpint.isMobile.any();
    var use_cluster = true;

    //todo this can be a common method, as a helper

    //load Bing Maps script async
    loadScript('http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onscriptload=doRender', function () {
        console.log('Bing Maps has been loaded');
        //window.doRender();
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

    window.doRender = function () {

        console.log('doRender called');

        var map_options = {
            //todo hide credentials
            credentials: 'AtngEB1UF7LHXlR0EwAhKYEoo7E1EiCyJ2DAHBifxJHry6mQKoK4nMkuiMALuUNV',
            center: new Microsoft.Maps.Location(0, 0),
            zoom: 3,
            showDashboard: is_device ? false : true,
            mapTypeId: Microsoft.Maps.MapTypeId.road, //show road map
            enableSearchLogo: false
        };

        //Bing API does not have a 'scale' option?
        var marker_options = {
            icon: 'img/marker-icon-32x32.png',
            anchor: {x: 16, y: 16},
            width: 32,
            height: 32
        };

        // initialize the map on the "map" div with a given center and zoom
        // map = new Microsoft.Maps.Map(document.getElementById('map-canvas'), map_options);


        addMarkers();


        function addMarkers() {

            var i;
            var iLength = Bestpint.entries.length;
            var marker;
            var marker_click;
            var infowindow;
            var infowindow_layer = new Microsoft.Maps.EntityCollection();
            var marker_layer = new Microsoft.Maps.EntityCollection();
            var infowindow_options;
            var current_lat;
            var current_long;

            //map.entities.clear();

            var data = [];

            //generate points from data and add to source vector
            for (i = 0; i < iLength; i++) {
                if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {

                    current_lat = Bestpint.entries[i].ecplus_Place_ctrl3.latitude;
                    current_long = Bestpint.entries[i].ecplus_Place_ctrl3.longitude;

                    data.push({latitude: +current_lat, longitude: +current_long});

                    /*************************************************
                     Following code is ok if we do not need clusters
                     */

                    //marker = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(current_lat, current_long), marker_options);
                    //marker.Description = Bestpint.createInfoWindowContent(Bestpint.entries[i]);
                    //marker_layer.push(marker);
                    //
                    //// Create the infobox for the pushpin
                    //infowindow = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(current_lat, current_long),null);
                    //infowindow.setOptions({visible: false});
                    ////infowindow.setHtmlContent('<div class="bestpint-infobox"></div><div>');
                    //infowindow_layer.push(infowindow);
                    //
                    //// Add handler for the pushpin click event.
                    //Microsoft.Maps.Events.addHandler(marker, 'click', displayInfobox);
                    /****************************************************/
                }
            }


            var pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {visible: false}),
                map = new Microsoft.Maps.Map(document.getElementById('map-canvas'), {
                    credentials: 'AtngEB1UF7LHXlR0EwAhKYEoo7E1EiCyJ2DAHBifxJHry6mQKoK4nMkuiMALuUNV',
                    center: new Microsoft.Maps.Location(0, 0),
                    zoom: 2,
                    showDashboard: is_device ? false : true,
                    mapTypeId: Microsoft.Maps.MapTypeId.road, //show road map
                    enableSearchLogo: false
                }),
                pinClusterer = new PinClusterer(map, {
                    onClusterToMap: function (pushpin, cluster) {

                        if (cluster.length === 1) {
                            pushpin.setOptions({
                                icon: 'img/marker-icon-32x32.png',
                                anchor: {x: 16, y: 16},
                                width: 32,
                                height: 32
                            });
                        }
                        else {
                            pushpin.setOptions({
                                icon: 'img/pushpin-32x32.png',
                                anchor: {x: 16, y: 16},
                                width: 32,
                                height: 32
                            });
                        }


                        Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', function () {
                            displayInfoBox(pushpin, cluster);
                        });

                        Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', hideInfoBox);


                        Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function (e) {

                            //when zoom is level 3, all markers disappear?
                            //solution, change MIN_ZOOM = 3, (it was 2), in pin_clusterer.js

                            console.log(map.getZoom());


                        });

                    }
                });

            map.entities.push(pinInfobox);
            pinClusterer.cluster(data);
            map.setView({center: new Microsoft.Maps.Location(0, 0), zoom: 2});


            var displayInfoBox = function displayInfoBox(pushpin, cluster) {
                pinInfobox.setLocation(pushpin.getLocation());
                pinInfobox.setOptions({
                    title: 'Pushpin',
                    description: 'This pin is within a cluster of ' + cluster.locations.length + ' pins.',
                    visible: true
                });
            };

            var hideInfoBox = function hideInfoBox() {
                pinInfobox.setOptions({visible: false});
            };

            /*
             Uncomment if using code without clusters
             */

            //map.entities.push(marker_layer);
            // map.entities.push(infowindow_layer);
            /********************************************/

            function displayInfobox(e) {
                infowindow.setOptions({description: e.target.Description, visible: true, showPointer: false});
                infowindow.setLocation(e.target.getLocation());
            }

            function hideInfobox(e) {
                infowindow.setOptions({visible: false});
            }

            Bestpint.fakeloader.fadeOut();


        }

    };


};