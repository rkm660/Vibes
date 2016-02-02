angular.module('starter').controller('EveryoneController', function($scope, $cordovaGeolocation, $ionicPlatform) {
    console.log("in EveryoneController");
    var ref = new Firebase("https://thevibe.firebaseio.com/");
    var auth = ref.getAuth();
    $scope.loggedIn = false;
    $scope.createEMADisabled = false;

    //init
    var init = function() {
        if (!auth) {} else {
            $scope.currentUser = auth;
            $scope.loggedIn = true;

        }
    };

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


            });
    };

    $ionicPlatform.ready(function() {
        init();
        startWatch();
    });


});