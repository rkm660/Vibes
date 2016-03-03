starter.service('Utils', function($q, $http, $rootScope) {
    var self = this;

    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }

    self.getWeather = function(lat, lng) {
        return $http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=208ee7e43c22b88e8f0c0e6b68d407d0");
    };

    self.withinRadius = function(a, b, radius) {
        var R = 6371000; // metres
        var φ1 = a.lat.toRad();
        var φ2 = b.lat.toRad();
        var Δφ = (b.lat - a.lat).toRad();
        var Δλ = (b.lng - a.lng).toRad();

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        if (d <= radius) {
            return true;
        } else {
            return false;
        }
    };

    self.formatDate = function(timestamp) {
        var date = new Date(timestamp);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    };

    self.formatDayLength = function(sunset, sunrise){
        return ((sunset-sunrise)/60/60).toFixed(2);
    };

    self.startBGWatch = function() {
        var bgGeo = window.BackgroundGeolocation;
        /**
         * This callback will be executed every time a geolocation is recorded in the background.
         */
        var callbackFn = function(location, taskId) {
            var coords = location.coords;
            var lat = coords.latitude;
            var lng = coords.longitude;
            if ($rootScope && $rootScope.currentUser) {
                var bgRef = new Firebase("https://thevibe.firebaseio.com/users/" + $rootScope.currentUser.uid + "/BGLocation/");
                bgRef.set({
                    lat: lat,
                    lng: lng,
                    timestamp: Firebase.ServerValue.TIMESTAMP
                }, function(error) {
                    console.log("in bg callback");
                    bgGeo.finish(taskId); // <-- execute #finish when your work in callbackFn is complete
                });
            } else {
                bgGeo.finish(taskId);
            }

        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        };

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            // Geolocation config
            desiredAccuracy: 0,
            stationaryRadius: 10,
            preventSuspend: true,
            heartbeatInterval: 30,
            distanceFilter: 0,
            activityRecognitionInterval: 0,
            activityType: 'Other',
            debug: false,
            stopOnTerminate: false

        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        bgGeo.start();
    };

});