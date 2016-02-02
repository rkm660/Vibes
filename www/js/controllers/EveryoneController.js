angular.module('starter').controller('EveryoneController', function($scope, $cordovaGeolocation, $ionicPlatform, $firebaseArray) {
    console.log("in EveryoneController");
    var ref = new Firebase("https://thevibe.firebaseio.com/");
    var auth = ref.getAuth();
    $scope.loggedIn = false;

    //init
    var init = function() {
        if (!auth) {} else {
            $scope.currentUser = auth;
            $scope.loggedIn = true;
            setEMAs();
        }
    };

    var setEMAs = function() {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        $scope.EMAs = $firebaseArray(emaRef);
    }

    var startWatch = function() {
        var watchOptions = {
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
        };
        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function(err) {
                // error
                console.log(err);
                startWatch();
            },
            function(position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                google.maps.event.addListenerOnce($scope.map, 'idle', function() {

                    angular.forEach($scope.EMAs, function(value, key) {
                        var coords = new google.maps.LatLng(value.lat, value.lng);
                        console.log(value.mood);
                        if (value.mood >= 5) {
                            var cityCircle = new google.maps.Circle({
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.2,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: (value.mood-5) / 5,
                                map: $scope.map,
                                center: coords,
                                radius: 20
                            });
                        } else {
                            var cityCircle = new google.maps.Circle({
                                strokeColor: '#00FF00',
                                strokeOpacity: 0.2,
                                strokeWeight: 2,
                                fillColor: '#00FF00',
                                fillOpacity: 1-(value.mood) / 5,
                                map: $scope.map,
                                center: coords,
                                radius: 20
                            });
                        }

                    });
                });
            });
    };

    $ionicPlatform.ready(function() {
        startWatch();

    });

    init();
});