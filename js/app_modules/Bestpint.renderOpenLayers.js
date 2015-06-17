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
