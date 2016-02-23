angular.module('starter').controller('EveryoneController', function($scope, $compile, $rootScope, $ionicModal, $ionicPlatform, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, Utils, LandmarkService, $window) {

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
                $rootScope.currentUser = auth;
                $scope.loggedIn = true;
                setEMAs($rootScope.currentUser.uid);
                setLandmarks();
            }
        });
    };

    //iniitalize feed

    var setEMAs = function(uid) {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        var query = emaRef.orderByChild("uid").equalTo(uid);
        $scope.EMAs = $firebaseArray(query);
    }

    var setLandmarks = function() {
        var locRef = new Firebase("https://thevibe.firebaseio.com/Landmarks/");
        $scope.landmarks = $firebaseArray(locRef);

    };

    // default login screen

    $scope.login = function(credentials) {
        UserService.login(credentials).then(function(resLogin) {
            var errorLogin = resLogin[1];
            var authLogin = resLogin[0];
            if (authLogin) {
                $scope.loggedIn = true;
                $scope.loginModal.hide();
                $rootScope.currentUser = authLogin;
                setEMAs($rootScope.currentUser.uid);
                setLandmarks();
                $ionicPlatform.ready(function() {
                    try {
                        startBGWatch();

                    } catch (err) {
                        alert("There was an error initializing background Geolocation, please restart the app.");
                        console.log(err);
                    }
                    $scope.refreshMap();

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


    $scope.refreshMap = function() {
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                google.maps.event.addListenerOnce($scope.map, 'idle', function() {
                    var infoWindow = new google.maps.InfoWindow();

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

                            marker.addListener('click', function() {
                                infoWindow.open($scope.map, marker);
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
                            marker.addListener('click', function() {
                                infoWindow.open($scope.map, marker);
                                infoWindow.setContent(value.thought);
                            });
                        }
                    });

                    //Create landmarks

                    angular.forEach($scope.landmarks, function(landmark) {
                        LandmarkService.landmarkData(landmark.name).then(function(data) {
                            var center = new google.maps.LatLng(landmark.lat, landmark.lng);
                            var color, mood, length;
                            mood = data[0];
                            emasLength = data[1];
                            if (mood == NaN) {
                                color = "#000000";
                            }
                            if (mood < 5) {
                                color = "#FF0000";
                            }
                            if (mood >= 5) {
                                color = "#00FF00";
                            }

                            var cityCircle = new google.maps.Circle({
                                strokeColor: color,
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: color,
                                fillOpacity: 0.15,
                                map: $scope.map,
                                center: center,
                                radius: landmark.radius
                            });
                            
                            var infoString = "<div class=\"list\">" +
                                "<a class=\"item\" ng-click=\"goToDetail('"+landmark.$id+"')\">" +
                                "<span>Landmark: " + landmark.name + "</span><br>" +
                                "<span>Average Vibe: " + mood + "</span><br>" +
                                "<span>Num Responses: " + emasLength + "</span>" +
                                "</a></div>";
                            var compiled = $compile(infoString)($scope)
                            cityCircle.addListener('click', function() {
                                infoWindow.open($scope.map, cityCircle);
                                infoWindow.setPosition(center);
                                infoWindow.setContent(compiled[0]);
                            });
                        });


                    });



                });


            }, function(err) {
                // error
                if (err.code === 1) {
                    alert("Please enable location on your device.");
                } else {
                    alert(err.message);
                }

            });
    };

    $scope.goToDetail = function(id){
        console.log(id);
        $window.location.assign('#/tab/us/'+id);
    }

    var startBGWatch = function() {
        var bgGeo = window.BackgroundGeolocation;
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
                uid: $rootScope.currentUser.uid,
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

    $scope.$on("$ionicView.afterEnter", function(event) {
        init();
        $scope.refreshMap();
    })

    $scope.$on("$ionicView.loaded", function(event) {
        $ionicPlatform.ready(function() {
            try {
                startBGWatch();
            } catch (err) {
                alert("There was an error with background geolocation, please change location settings and restart the app.");
                console.log(err);
            }

        });
    })
});