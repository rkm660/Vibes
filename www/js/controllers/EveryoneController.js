angular.module('starter').controller('EveryoneController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils) {

    var ref = new Firebase("https://thevibe.firebaseio.com/");
    var auth = ref.getAuth();
    $scope.loggedIn = false;

    //init
    var init = function() {
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
                        if (value.mood >= 5) {
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

    $ionicPlatform.ready(function() {
        startWatch();

    });


    init();
});