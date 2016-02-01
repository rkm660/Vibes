angular.module('starter').controller('MeController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils) {

    var ref = new Firebase("https://thevibe.firebaseio.com/");
    var auth = ref.getAuth();
    $scope.loggedIn = false;
    $scope.createEMADisabled = false;

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
        $scope.createEMADisabled = true;
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                Utils.getReverseGeo(lat, lng).then(function(res) {
                    $scope.EMAs.$add({
                        thought: EMA.thought,
                        mood: EMA.mood,
                        lat: lat,
                        lng: lng,
                        location: res.data.display_name,
                        timestamp: Firebase.ServerValue.TIMESTAMP,
                        uid: $scope.currentUser.uid
                    })
                    $scope.emaModal.hide();
                    $scope.createEMADisabled = false;
                });
            }, function(err) {
                // error
            });

    };

    $scope.removeEMA = function(EMA){
        $scope.EMAs.$remove(EMA);
    }

    init();
});