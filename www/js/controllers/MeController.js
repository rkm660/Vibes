angular.module('starter').controller('MeController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $ionicPlatform) {

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

    $ionicPlatform.ready(function() {
        
        $cordovaBackgroundGeolocation.configure({})
            .then(
                null, // Background never resolves
                function(err) { // error callback
                    console.error(err);
                },
                function(location) { // notify callback
                    console.log(location);
                });


        $scope.stopBackgroundGeolocation = function() {
            $cordovaBackgroundGeolocation.stop();
        };

    });


    var setEMAs = function() {
        var userRef = new Firebase("https://thevibe.firebaseio.com/users/" + $scope.currentUser.uid + "/emas");
        $scope.EMAs = $firebaseArray(userRef);
    }

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

    $ionicModal.fromTemplateUrl('templates/createEMA.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.emaModal = modal;
    });


    $scope.createEMA = function(EMA) {
        $scope.EMAs.$add({
            thought: EMA.thought,
            mood: EMA.mood,
            timestamp: Firebase.ServerValue.TIMESTAMP
        })
        $scope.emaModal.hide();
    };

    init();
});