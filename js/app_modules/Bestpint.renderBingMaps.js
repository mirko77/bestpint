/* global Microsoft, PinClusterer*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderBingMaps = function () {

    var map;
    var position;
    var is_device = Bestpint.isMobile.any();

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
        map = new Microsoft.Maps.Map(document.getElementById('map-canvas'), map_options);


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

            //generate points from data and add to source vector
            for (i = 0; i < iLength; i++) {
                if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {

                    current_lat = Bestpint.entries[i].ecplus_Place_ctrl3.latitude;
                    current_long = Bestpint.entries[i].ecplus_Place_ctrl3.longitude;

                    marker = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(current_lat, current_long), marker_options);
                    marker.Description = Bestpint.createInfoWindowContent(Bestpint.entries[i]);
                    marker_layer.push(marker);

                    // Create the infobox for the pushpin
                    infowindow = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(current_lat, current_long),null);
                    infowindow.setOptions({visible: false});
                    //infowindow.setHtmlContent('<div class="bestpint-infobox"></div><div>');
                    infowindow_layer.push(infowindow);

                    // Add handler for the pushpin click event.
                    Microsoft.Maps.Events.addHandler(marker, 'click', displayInfobox);
                }
            }


            map.entities.push(marker_layer);
            map.entities.push(infowindow_layer);

            function displayInfobox(e) {
                infowindow.setOptions({description: e.target.Description, visible: true, showPointer:false});
                infowindow.setLocation(e.target.getLocation());
            }

            function hideInfobox(e) {
                infowindow.setOptions({visible: false});
            }

            Bestpint.fakeloader.fadeOut();


        }

    };


};