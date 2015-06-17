'use strict';
var Bestpint = Bestpint || {};
Bestpint.config = function () {

    //from MDN https://goo.gl/kla3zJ -> get value of a parameter specified in the query string when requesting the page
    this.getURLParam = function (oTarget, sVar) {
        return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    };

    //type of map to display, will default to Leaflet.js
    this.type = this.getURLParam(window.location, 'type');
    this.entries = {};
    this.device_lat = 0;
    this.device_long = 0;

    this.max_zoom =18;

    //http://joaopereirawd.github.io/fakeLoader.js/
    this.fakeloader = $('#fakeloader');
    this.map_wrapper = $('#map-canvas');
    this.proxy_error_wrapper = $('#proxy-error');
    this.fakeloader.fakeLoader({
        timeToHide: 1000000,
        bgColor: '#333',
        spinner: 'spinner1'
    });

};
'use strict';
var Bestpint = Bestpint || {};
Bestpint.createInfoWindowContent = function(the_entry) {

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
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl13 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl13 || '') + '</td>';
    html += '</tr>';

    //type of place
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Place_ctrl4.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Place_ctrl4.values[entry.ecplus_Place_ctrl4] || '') + '</td>';
    html += '</tr>';

    //Name of beer
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl6 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl6 || '') + '</td>';
    html += '</tr>';

    //Brewery
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl8 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl8 || '') + '</td>';
    html += '</tr>';

    //Type of beer
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl9.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl9.values[entry.ecplus_Beer_ctrl9] || '') + '</td>';
    html += '</tr>';


    //html += '<tr>';
    //html += '<td colspan="2" class="text-center">' + Bestpint.project.ecplus_Beer_ctrl7 + '</td>';
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
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl14.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
    html += '</tr>';

    //how is the price range
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl11.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
    html += '</tr>';

    //price and currency
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl12 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl12 || '') + '</td>';
    html += '</tr>';

    //Any comments?
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Place_ctrl5 + '</td>';
    html += '<td>' + (entry.ecplus_Place_ctrl5 || '') + '</td>';
    html += '</tr>';

    html += '</tbody>';
    html += '</table>';

    return html;
}
'use strict';
var Bestpint = Bestpint || {};
Bestpint.createMobileInfoContent = function (the_entry) {

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
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl14.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl11.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
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
};
'use strict';
var Bestpint = Bestpint || {};
Bestpint.getData = function () {

    var deferred = new $.Deferred();
    var url = 'http://plus.epicollect.net/Bestpint/Beer.json';

    //try a cors request to epicollect server using yql https://developer.yahoo.com/yql
    $.getJSON("http://query.yahooapis.com/v1/public/yql",
        {
            q: "select * from json where url='http://plus.epicollect.net/Bestpint/Beer.json'",
            format: "json"
        },
        function (data, status) {
            //if the proxy is down for some reasons, show error message
            if (data.query.results) {
                //console.log(data.query.results.json.json);
                deferred.resolve(data.query.results.json.json);
            }
            else {
                deferred.reject(status);
            }
        });
    return deferred.promise();
};
'use strict';
var Bestpint = Bestpint || {};
Bestpint.init = function () {
    //request data from Epicollect+ via a proxy
    $.when(Bestpint.getData()).then(function (response) {

        Bestpint.entries = response;
        //get user location (on mobile only) to give just the entries around the area
        if (Bestpint.isMobile.any()) {
            //get device position before init map
            navigator.geolocation.getCurrentPosition(function (position) {
                Bestpint.device_lat = position.coords.latitude;
                Bestpint.device_long = position.coords.longitude;
                Bestpint.initialiseMap();
            }, function (error) {
                console.log(error);
                Bestpint.initialiseMap();
            });
        }
        else {
            //init maps on desktop
            Bestpint.initialiseMap();
        }
    }, function (error) {
        //show error message, request failed
        console.log(error);
        Bestpint.map_wrapper.hide();
        Bestpint.proxy_error_wrapper.removeClass('hidden');
        Bestpint.fakeloader.fadeOut();
    });
};

/* global L*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.initialiseMap = function () {

    var self = this;

    if (self.isMobile.any()) {
        //hack to make map show on Chrome Android
        self.map_wrapper.height('100vh');
    }

    //render map based on type (Leaflet by default, Gmaps or OpenLayers)
    switch (self.type) {
        case'gm':
            self.renderGmaps();
            break;
        case 'ol':
            self.renderOpenLayers();
            break;
        default:
            self.renderLeaflet();
    }
};
'use strict';
var Bestpint = Bestpint || {};
Bestpint.isMobile = {
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
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }
};
'use strict';
var Bestpint = Bestpint || {};
Bestpint.project = {
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
/* global L*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderLeaflet = function () {

    var map;
    var position;
    var tiles;
    var cluster;
    var is_device = Bestpint.isMobile.any();

    var map_options = {
        center: {lat: 0, lng: 0},
        zoom: 6,
        maxZoom: Bestpint.max_zoom,
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

    //on mobile devices, remove current device position marker on maximum zoom so it is possible to tap on any overlapping markers
    if (is_device) {
        map.on('zoomend', function () {
            if (Bestpint.max_zoom === map.getZoom()) {
                map.removeLayer(position);
            }
            else {
                position.addTo(map);
            }
        });
    }

    function addMarkers() {

        var i;
        var iLength = Bestpint.entries.length;
        var marker;
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
/* global ol*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.renderOpenLayers = function () {

    var map;
    var position;
    var is_device = Bestpint.isMobile.any();

    //load Google Maps script async
    loadScript('http://openlayers.org/en/v3.6.0/build/ol.js', function () {
        console.log('open layers has been loaded');

        console.log('I should render the map with Open Layers ;)');
        doRender();
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

    function doRender() {
        //create the style
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.75,
                // size: [32,32], does not work ? https://goo.gl/Trr27y
                scale: 0.25,
                src: 'img/marker-icon.png'
            }))
        });


        function addMarkers() {

            var i;
            var iLength = Bestpint.entries.length;
            var vectorSource = new ol.source.Vector({
                //create empty vector
            });

            //create a bunch of point and add to source vector
            for (i = 0; i < iLength; i++) {
                if (Bestpint.entries[i].ecplus_Place_ctrl3.latitude !== "") {
                    var iconFeature = new ol.Feature({
                        //imp: he EPSG:4326 coordinate order lon, lat not lat, lon (http://goo.gl/EioTmw)
                        geometry: new
                            ol.geom.Point(ol.proj.transform([parseFloat(Bestpint.entries[i].ecplus_Place_ctrl3.longitude, 10), parseFloat(Bestpint.entries[i].ecplus_Place_ctrl3.latitude, 10)], 'EPSG:4326', 'EPSG:3857')),
                        name: Bestpint.entries[i].ecplus_Beer_ctrl13 + ', ' + Bestpint.entries[i].ecplus_Beer_ctrl6,
                        id: i // we use the id to get info for the popup
                    });
                    vectorSource.addFeature(iconFeature);
                }
            }

            //add the feature vector to the layer vector, and apply a style to whole layer
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                distance: 40
                //style: iconStyle
            });

            // a clustered source is configured with another vector source that it
            // operates on
            var clusterSource = new ol.source.Cluster({
                source: vectorSource
            });

            // it needs a layer too
            var styleCache = {};
            var clusterLayer = new ol.layer.Vector({
                source: clusterSource,
                style: function (feature, resolution) {
                    var size = feature.get('features').length;
                    var style;
                    // var style = styleCache[size];
                    // if (!style) {
                    if (size > 1) {
                        style = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 10,
                                stroke: new ol.style.Stroke({
                                    color: '#fff'
                                }),
                                fill: new ol.style.Fill({
                                    color: '#3399CC'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                    }
                    else {
                        style = [iconStyle];
                    }

                    return style;
                }
            });


            var element = document.getElementById('popup');
            var popup_content = $('#popup-content');

            //create Overlay to be used as a popup
            var popup = new ol.Overlay({
                element: element,
                positioning: 'top-center',
                stopEvent: false,
                //parameters for auto pan animation, to fit the popup into view
                autoPan: true,
                autoPanMargin: 50,
                autoPanAnimation: {duration: 500}
            });

            var map = new ol.Map({
                layers: [new ol.layer.Tile({
                    //get tiles from Open Street Maps
                    source: new ol.source.OSM({})
                }), vectorLayer, clusterLayer],
                overlays: [popup],
                target: document.getElementById('map-canvas'),
                view: new ol.View({
                    center: [0, 0],
                    zoom: 3
                })
            });

            // display popup on click
            map.on('click', function (evt) {

                var html;

                //check if a feature (icon) was clicked
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function (feature, layer) {
                        return feature;
                    });

                //zoom in fior a cluster or trigger popup
                if (feature) {
                    var geometry;
                    var coord;
                    var current_view;
                    var current_zoom;
                    var zoom_animation;
                    //get all features for cluster
                    var features = feature.get('features');

                    if (features.length > 1) {
                        //user tapped a cluster, zoom in

                        //get current elements
                        geometry = feature.getGeometry();
                        coord = geometry.getCoordinates();
                        current_view = map.getView();
                        current_zoom = current_view.getZoom();

                        //animate on click (zoom in)
                        zoom_animation = ol.animation.zoom({
                            resolution: map.getView().getResolution(),
                            duration: 500
                        });
                        map.beforeRender(zoom_animation);

                        //set view to clicked cluster
                        map.setView(new ol.View({
                            center: coord,
                            zoom: current_zoom + 3
                        }));
                    }
                    else {
                        //user tapped a point, show popup
                        html = Bestpint.createMobileInfoContent(Bestpint.entries[features[0].get('id')]);
                        geometry = features[0].getGeometry();
                        coord = geometry.getCoordinates();

                        //show popup wrapper
                        element.style.visibility = "visible";
                        popup_content.html(html);
                        popup.setPosition(coord);
                    }
                } else {
                    //remove popup content and hide popup
                    popup_content.html('');
                    element.style.visibility = "hidden";
                }
            });

            // change mouse cursor when over marker
            $(map.getViewport()).on('mousemove', function(e) {
                var pixel = map.getEventPixel(e.originalEvent);
                var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    return true;
                });
                if (hit) {
                    map.getTarget().style.cursor = 'pointer';
                } else {
                    map.getTarget().style.cursor = '';
                }
            });
        }
        addMarkers();
        Bestpint.fakeloader.fadeOut();
    }
};

/*jslint vars: true , nomen: true devel: true, plusplus: true*/
/*global $, jQuery, BestPint*/
(function () {
    "use strict";

    var custom = "epicollectplus://view?project=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
    var ios_uri = "epicollectplus://project=" + encodeURI("plus.epicollect.net/bestpint.xml");
    // var firefox_android_uri = "http://epicollectplus.imperial.ac.uk?project=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
    var alt = "https://play.google.com/store/apps/details?id=uk.ac.imperial.epicollectplus.html5&hl=en_GB&referrer=" + encodeURI("http://plus.epicollect.net/bestpint.xml");

    //TODO: check this intent syntax as it might not work, see test button below
    var g_intent = "intent:#Intent;action=uk.ac.imperial.epicollectplus.html5.REQUEST_PROJECT;S.project=";
    g_intent += encodeURI("http://plus.epicollect.net/bestpint.xml");
    g_intent += ";S.referrer=";
    g_intent += encodeURI("http://plus.epicollect.net/bestpint.xml");
    g_intent += ";package=uk.ac.imperial.epicollectplus.html5;launchFlags=268435456;end";

    var timer;
    var heartbeat;
    var iframe_timer;

    function clearTimers() {
        clearTimeout(timer);
        clearTimeout(heartbeat);
        clearTimeout(iframe_timer);
    }

    //clear timers and stop everything if the web page is not visible anymore
    //which means either the Play Store or the app are on the foreground
    function intervalHeartbeat() {
        if (document.webkitHidden || document.hidden) {
            clearTimers();
            document.location = "http://bestpint.net";
        }
    }

    //old browser use the iframe approach (https://developer.chrome.com/multidevice/android/intents)
    function tryIframeApproach() {
        var iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.onload = function () {
            document.location = alt;
        };
        iframe.src = custom;
        document.body.appendChild(iframe);
    }

    /*
     * Some webkit browsers can handle the scheme, showing an error.
     * the timeout will load the Play Store page (I tested this on Firefox only,
     * which displayes a toast warning)
     */
    function tryWebkitApproach() {
       // document.location = custom;
        document.location = "epicollectplus://project?plus.epicollect.net/bestpint.xml";
        timer = setTimeout(function () {
            document.location = alt;
        }, 2000);
    }

    /**
     * handle Opera browser, showing app chooser
     * (hopefully the user will open the Play Store, duh!)
     *
     */
    function handleOpera() {
        document.location = alt;
    }

    /*
     * Handle Firefox browser and its crazy behaviour
     * look here https://support.mozilla.org/en-US/questions/977330
     */
    function handleFirefox() {
        //does not work
        //document.location = firefox_android_uri;

        //works
        document.location = alt;
    }

    /*
     * Use Chrome intent, work on 25+, not sure what happens on <25
     * as I cannot test... Chrome for Android 25 was released in February 2013
     * https://developer.chrome.com/multidevice/android/intents
     */
    function useIntent() {

        tryWebkitApproach();
       // window.location = g_intent;
    }

    function launch_app_or_alt_url(el) {

        //continue to check if the page is still on the foreground
        heartbeat = setInterval(intervalHeartbeat, 200);

        //use Chrome intent (on Chrome > 25 it works)
        if (navigator.userAgent.match(/Chrome/)) {
            //alert(navigator.userAgent);

            //is Opera? The new builds use Chrome but intents do not work!
            if (navigator.userAgent.match(/Opera|OPR\//)) {

                //let's handle Opera browser showing the app chooser
                handleOpera();
            } else {
                useIntent();
            }

        } else if (navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Opera/)) {

            //handle Firefox
            if (navigator.userAgent.match(/Firefox/)) {
                handleFirefox();
            } else {
                //Old Opera, try webkit approach, if that fails, go for the iFrame approach
                tryWebkitApproach();
                iframe_timer = setTimeout(function () {
                    tryIframeApproach();
                }, 1500);
            }

        } else {
            // alert("iframe?");
            //Old Opera, try webkit approach, if that fails, go for the iFrame approach
            tryWebkitApproach();
            iframe_timer = setTimeout(function () {
                tryIframeApproach();
            }, 1500);
        }
    }


    $(".source_url").click(function (e) {
        //alert(navigator.userAgent);

        if (BestPint.isMobile.Android()) {
            //handle Android here
            launch_app_or_alt_url($(this));

        } else if (BestPint.isMobile.iOS()) {

            //handle iOS (iPhone, iPad) here

            //if app not installed, redirect
            //TODO: test this with real link when app will be published
            // how to : http://stackoverflow.com/questions/433907/how-to-link-to-apps-on-the-app-store
            setTimeout(function () {
                window.location = "itms://itunes.apple.com/us/app/kaon-v-stream/id378890806?mt=8&uo=4";
            }, 25);

            //if the app is installed, it will open
            //document.location = ios_uri;
            //TODO:
            //testing this here as Safari on i8 doe not want '=' or ':' in the URL
            document.location = "epicollectplus://project?plus.epicollect.net/bestpint.xml";
            //window.location.href = "epicollectplus://project?123456";
        }

        e.preventDefault();
    });

    //handle click on download app button, to redirect to App Store or Google Play
    //TODO

}());

