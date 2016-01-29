angular.module('starter').controller('MeController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils) {

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
                setEMAs();
            }
        });
    };

    //broadcast event

    $ionicPlatform.ready(function() {
        var watchOptions = {
            timeout: 5000,
            enableHighAccuracy: false // may cause errors if true
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function(err) {
                // error
                console.log(err);
            },
            function(position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                $scope.currentLocation = [lat, long];
            });

    });


    //iniitalize feed

    var setEMAs = function() {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        $scope.EMAs = $firebaseArray(emaRef);
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
                setEMAs();
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

    //create EMA modal

    $ionicModal.fromTemplateUrl('templates/createEMA.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.emaModal = modal;
    });


    $scope.createEMA = function(EMA) {
        Utils.getReverseGeo($scope.currentLocation).then(function(res) {
            console.log(res);
            $scope.EMAs.$add({
                thought: EMA.thought,
                mood: EMA.mood,
                lat: $scope.currentLocation[0],
                long: $scope.currentLocation[1],
                location : res.data.display_name,
                timestamp: Firebase.ServerValue.TIMESTAMP,
                uid: $scope.currentUser.uid
            })
            $scope.emaModal.hide();
        });


    };

    $scope.convertCoords = function(lat, long) {

    };

    init();
});