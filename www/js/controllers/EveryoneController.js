angular.module('starter').controller('EveryoneController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils) {

    var ref, auth;
    //init
    var init = function() {
        ref = new Firebase("https://thevibe.firebaseio.com/");
        auth = ref.getAuth();
        $scope.loggedIn = false;
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.loginModal = modal;
            if (!auth) {
                $scope.loginModal.show();
            } else {
                $scope.currentUser = auth;
                $scope.loggedIn = true;
                setEMAs($scope.currentUser.uid);
                $ionicPlatform.ready(function() {
                    startWatch();
                });
            }
        });
    };

    //iniitalize feed

    var setEMAs = function(uid) {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        var query = emaRef.orderByChild("uid").equalTo(uid);
        $scope.EMAs = $firebaseArray(query);
    }

    // default login screen

    $scope.login = function(credentials) {
        UserService.login(credentials).then(function(resLogin) {
            var errorLogin = resLogin[1];
            var authLogin = resLogin[0];
            if (authLogin) {
                $scope.loggedIn = true;
                $scope.loginModal.hide();
                $scope.currentUser = authLogin;
                setEMAs($scope.currentUser.uid);
                $ionicPlatform.ready(function() {
                    startWatch();
                });
            }
            if (errorLogin) {
                alert(errorLogin);
            }
        });
    };

    $scope.logout = function() {
        ref.unauth();
        $scope.loggedIn = false;
        clearWatch($scope.watch.watchID);
        $scope.loginModal.show();
    }

    $scope.register = function(credentials) {
        UserService.register(credentials).then(function(resRegister) {
            var errorRegister = resRegister[1];
            var authRegister = resRegister[0];
            console.log(resRegister);
            if (authRegister) {
                $scope.login(credentials);
            }
            if (errorRegister) {
                alert(errorRegister);
            }
        });
    };


    var startWatch = function() {
        var watchOptions = {
            frequency: 4000,
            timeout: 5000,
            enableHighAccuracy: false // may cause errors if true
        };
        $scope.watch = $cordovaGeolocation.watchPosition(watchOptions);
        $scope.watch.then(
            null,
            function(err) {
                // error
                console.log(err);
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
                        if (value.mood < 5) {
                            var marker = new google.maps.Marker({
                                position: coords,
                                map: $scope.map,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    strokeColor: "red",
                                    scale: 5
                                },
                            });
                            var infowindow = new google.maps.InfoWindow({
                                content: value.thought,
                            });
                            marker.addListener('click', function() {
                                infowindow.open($scope.map, marker);
                            });
                        } else {
                            var marker = new google.maps.Marker({
                                position: coords,
                                map: $scope.map,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    strokeColor: "green",
                                    scale: 5
                                },
                            });
                            var infowindow = new google.maps.InfoWindow({
                                content: value.thought,
                            });
                            marker.addListener('click', function() {
                                infowindow.open($scope.map, marker);
                            });
                        }
                    });
                });
            });
    };

    var clearWatch = function(id) {
        $cordovaGeolocation.clearWatch(id);
    };

    $scope.startBGWatch = function() {
        var bgGeo = window.BackgroundGeolocation;
        console.log("bg geo: ", bgGeo);
        /**
         * This callback will be executed every time a geolocation is recorded in the background.
         */
        var callbackFn = function(location, taskId) {
            var coords = location.coords;
            var lat = coords.latitude;
            var lng = coords.longitude;
            var bgRef = new Firebase("https://thevibe.firebaseio.com/BGLocation/");
            bgRef.push({
                lat: lat,
                lng: lng,
                uid: $scope.currentUser.uid,
                timestamp: Firebase.ServerValue.TIMESTAMP
            }, function(error) {
                console.log("in bg callback");
                bgGeo.finish(taskId); // <-- execute #finish when your work in callbackFn is complete
            });

        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        };

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            // Geolocation config
            desiredAccuracy: 0,
            stationaryRadius: 10,
            distanceFilter: 0,
            activityRecognitionInterval: 0,
            activityType: 'Other',
            debug: false

        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        bgGeo.start();
    };

    $scope.$on("$ionicView.beforeLeave", function(event) {
        clearWatch($scope.watch.watchID);
    })

    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    })
});