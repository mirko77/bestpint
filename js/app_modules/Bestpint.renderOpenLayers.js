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

        var positionStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 1,
                // size: [32,32], does not work ? https://goo.gl/Trr27y
                scale: 0.08,
                src: 'img/map-marker-512x512.png'
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
                        //imp: the EPSG:4326 coordinate order lon, lat not lat, lon (http://goo.gl/EioTmw)
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
            });

            // a clustered source is configured with another vector source that it
            // operates on
            var clusterSource = new ol.source.Cluster({
                source: vectorSource
            });

            var clusterLayer = new ol.layer.Vector({
                source: clusterSource,
                style: function (feature, resolution) {
                    var size = feature.get('features').length;
                    var style;

                    //on cluster, show circle witht he total size of the cluster
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
                        //on single points just show the pint icon ;)
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

            //on desktop, show the whole data set
            if (!is_device || !(Bestpint.device_lat && Bestpint.device_long)) {
                map = new ol.Map({
                    layers: [new ol.layer.Tile({
                        //get tiles from Open Street Maps
                        source: new ol.source.OSM({})
                    }), vectorLayer, clusterLayer],
                    overlays: [popup],
                    target: document.getElementById('map-canvas'),
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 3,
                        maxZoom: Bestpint.max_zoom
                    })
                });
            }
            else {

                var positionSource = new ol.source.Vector({
                    //create empty vector
                });
                //on device, just show the data close to user location and a marker where the user actually is (30m accuracy)
                //create icon at new map center
                var positionFeature = new ol.Feature({
                    geometry: new
                        ol.geom.Point(ol.proj.transform([parseFloat(Bestpint.device_long, 10), parseFloat(Bestpint.device_lat, 10)], 'EPSG:4326', 'EPSG:3857')),
                    name: 'You'
                });

                //add position to its vector source
                positionSource.addFeature(positionFeature);

                var positionLayer = new ol.layer.Vector({
                    source: positionSource,
                    style: positionStyle
                });

                map = new ol.Map({
                    layers: [new ol.layer.Tile({
                        //get tiles from Open Street Maps
                        source: new ol.source.OSM({})
                    }), vectorLayer, clusterLayer, positionLayer],
                    overlays: [popup],
                    target: document.getElementById('map-canvas'),
                    view: new ol.View({
                        center: ol.proj.transform([parseFloat(Bestpint.device_long, 10), parseFloat(Bestpint.device_lat, 10)], 'EPSG:4326', 'EPSG:3857'),
                        zoom: 10,
                        maxZoom: Bestpint.max_zoom
                    })
                });
            }

            // display popup on click
            map.on('click', function (evt) {

                var html;

                //check if a feature (icon) was clicked
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function (feature, layer) {
                        return feature;
                    });

                //zoom in for a cluster or trigger popup
                if (feature) {
                    var geometry;
                    var coord;
                    var current_view;
                    var current_zoom;
                    var zoom_animation;
                    //get all features for cluster
                    var features = feature.get('features');

                    //if the user tapped a cluster, zoom in
                    if (features.length > 1) {

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
                        if(is_device) {
                            html = Bestpint.createMobileInfoContent(Bestpint.entries[features[0].get('id')]);
                        }
                        else {
                            html = Bestpint.createInfoWindowContent(Bestpint.entries[features[0].get('id')]);
                        }
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


            $(map).on('moveend', function(){


                if(is_device) {
                    if (map.getView().getZoom() === Bestpint.max_zoom) {
                        console.log('max zoom reached!!!');
                        positionLayer.setVisible(false);
                    }
                    else {
                        positionLayer.setVisible(true);
                    }
                }

                console.log('zoomend called with zoom level ' + map.getView().getZoom());
            });
        }
        addMarkers();
        Bestpint.fakeloader.fadeOut();
    }
};
