/*jslint vars: true , nomen: true devel: true, plusplus: true*/
/*global $, jQuery, BestPint*/
( function() {"use strict";
        var custom = "epicollect5://view?project=bestpint";
        var alt = "https://play.google.com/store/apps/details?id=uk.ac.imperial.epicollect5&hl=en_GB";
        var g_intent = "intent:#Intent;action=uk.ac.imperial.epicollect5.REQUEST_PROJECT;S.project=bestpint;package=uk.ac.imperial.epicollect5;end";

        //uk.ac.epicollect5.REQUEST_PROJECT

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
         * which displyes a toast warning)
         */
        function tryWebkitApproach() {
            document.location = custom;
            timer = setTimeout(function() {
                document.location = alt;
            }, 2500);
        }

        /*
         * Use Chrome intent, work on 25+, not sure what happens on <25
         * as I cannot test... Chrome for Android 25 was released in February 2013
         * https://developer.chrome.com/multidevice/android/intents
         */
        function useIntent() {
            document.location = g_intent;

            //for Chrome < 25 and Opera
            setTimeout(function() {
                tryWebkitApproach();
            }, 1000);
        }

        function launch_app_or_alt_url(el) {
           

            //continue to check if the page s still on the foreground
            heartbeat = setInterval(intervalHeartbeat, 200);

            //use Chrome intent (on Chrome > 25 it works)
            if (navigator.userAgent.match(/Chrome/)) {

                //is Opera? The new builds use Chrome but intents do not work!
                if (navigator.userAgent.match(/Opera|OPR\//)) {
                    tryIframeApproach();
                } else {
                    useIntent();
                }

            } else if (navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Opera/)) {

                //on Firefox and old Opera, try webkit approach, if that fails, go for the iFrame approach
                tryWebkitApproach();
                iframe_timer = setTimeout(function() {
                    tryIframeApproach();
                }, 1500);
            } else {
                tryIframeApproach();
            }
        }


        $(".source_url").click(function(event) {

            if (BestPint.isMobile.Android()) {

                //handle Android here
                launch_app_or_alt_url($(this));
            } else if (BestPint.isMobile.iOS()) {

                //handle iOS (iPhone, iPad) here
                //TODO

            }

            event.preventDefault();
        });

    }());

