/*jslint vars: true , nomen: true devel: true, plusplus: true*/
/*global $, jQuery, BestPint*/
( function() {"use strict";
        var custom = "epicollect5://view?project=bestpint";
        var alt = "https://play.google.com/store/apps/details?id=uk.ac.imperial.epicollect5&hl=en_GB";
        
        //var alt = "market://details?id=uk.ac.imperial.epicollect5";
        
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

        function intervalHeartbeat() {
            if (document.webkitHidden || document.hidden) {
                clearTimers();
            }
        }

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

        function tryWebkitApproach() {
            document.location = custom;
            timer = setTimeout(function() {
                document.location = alt;
            }, 2500);
        }

        function useIntent() {
            document.location = g_intent;
        }

        function launch_app_or_alt_url(el) {
            heartbeat = setInterval(intervalHeartbeat, 200);
            if (navigator.userAgent.match(/Chrome/)) {
                useIntent();
            } else if (navigator.userAgent.match(/Firefox/)) {
                tryWebkitApproach();
                iframe_timer = setTimeout(function() {
                    tryIframeApproach();
                }, 1500);
            } else {
                tryIframeApproach();
            }
        }


        $(".source_url").click(function(event) {

          //  if (BestPint.isMobile.Android()) {

                console.log("Android browser detected **********************");
                launch_app_or_alt_url($(this));
          //  }

            event.preventDefault();
        });

    }());

