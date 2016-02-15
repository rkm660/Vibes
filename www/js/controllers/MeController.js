angular.module('starter').controller('MeController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils, PushService, LandmarkService) {

    var ref, auth;
    $scope.moodID = [1,2,3,4,5];


    //init
    var init = function() {
        ref = new Firebase("https://thevibe.firebaseio.com/");
        auth = ref.getAuth();
        $scope.loggedIn = false;
        $scope.createEMADisabled = false;
        $scope.EMA = {
            thought: "",
            mood: null,
            landmark: null
        }
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

                $ionicPlatform.ready(function() {
                    PushService.identifyUser($rootScope.currentUser.uid).then(function(user) {
                        PushService.registerUser();
                    });
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

    //iniitalize landmarks 

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
            enableHighAccuracy: true
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                $scope.EMAs.$add({
                    thought: EMA.thought,
                    mood: EMA.mood,
                    lat: lat,
                    lng: lng,
                    timestamp: Firebase.ServerValue.TIMESTAMP,
                    landmarkID: EMA.landmark,
                    uid: $rootScope.currentUser.uid
                }).then(function(ref) {
                  
                });

                $scope.EMA = {
                    thought: "",
                    mood: null,
                    landmark: null
                }
                $scope.emaModal.hide();
                $scope.createEMADisabled = false;
            }, function(err) {
                // error
                if (err.code === 1) {
                    alert("Please enable location on your device.");
                } else {
                    alert(err.message);
                }
                $scope.createEMADisabled = false;

            });

    };

    $scope.removeEMA = function(EMA) {
        $scope.EMAs.$remove(EMA);
    }

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        console.log('Ionic Push: Got token ', data.token, data.platform);
        $scope.token = data.token;
    });

//in switch-case for now
    $scope.getURL = function(emojiID)
        {
          
            var url;
            switch(emojiID) {
                case 1:
                    url = "img/crying1.png";
                    break;
                case 2:
                    url = "img/crying2.png";
                    break;
                case 3:
                    url = "img/neutral.png";
                    break;
                case 4:
                    url = "img/smile4.png";
                    break;
                case 5:
                    url = "img/smile5.png";
                    break;
                default:
                    url = "img/happy.png";

            }

            return url;

        };

    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    })
});