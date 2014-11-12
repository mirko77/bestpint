/*jslint vars: true , nomen: true devel: true, plusplus: true*/
/*global $, jQuery, BestPint*/
( function() {"use strict";

        var custom = "epicollect5://view?project=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
        var ios_uri = "epicollect5://project=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
        // var firefox_android_uri = "http://epicollect5.imperial.ac.uk?project=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
        var alt = "https://play.google.com/store/apps/details?id=uk.ac.imperial.epicollect5&hl=en_GB&referrer=" + encodeURI("http://plus.epicollect.net/bestpint.xml");
        var g_intent = "intent:#Intent;action=uk.ac.imperial.epicollect5.REQUEST_PROJECT;S.project=";
        g_intent += encodeURI("http://plus.epicollect.net/bestpint.xml");
        g_intent += ";S.referrer=";
        g_intent += encodeURI("http://plus.epicollect.net/bestpint.xml");
        g_intent += ";package=uk.ac.imperial.epicollect5;end";

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
            iframe.onload = function() {
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
            document.location = custom;
            timer = setTimeout(function() {
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
            document.location = g_intent;
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
                    iframe_timer = setTimeout(function() {
                        tryIframeApproach();
                    }, 1500);
                }

            } else {
                // alert("iframe?");
                //Old Opera, try webkit approach, if that fails, go for the iFrame approach
                tryWebkitApproach();
                iframe_timer = setTimeout(function() {
                    tryIframeApproach();
                }, 1500);
            }
        }


        $(".source_url").click(function(e) {
            //alert(navigator.userAgent);

            if (BestPint.isMobile.Android()) {
                //handle Android here
                launch_app_or_alt_url($(this));

            } else if (BestPint.isMobile.iOS()) {

                //handle iOS (iPhone, iPad) here

                //if app not installed, redirect
                //TODO: test this with real link when app will be published
                // how to : http://stackoverflow.com/questions/433907/how-to-link-to-apps-on-the-app-store
                setTimeout(function() {
                    //window.location = "itms://itunes.apple.com/us/app/kaon-v-stream/id378890806?mt=8&uo=4";
                }, 25);

                //if the app is installed, it will open
                document.location = ios_uri;
            }

            e.preventDefault();
        });

        //handle click on download app button, to redirect to App Store or Google Play
        //TODO

    }());

