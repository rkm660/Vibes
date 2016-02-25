angular.module('starter').controller('LandmarkController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils, LandmarkService, $stateParams, $location) {

    var ref, auth;
    $scope.moods = [{id:1,url:"img/crying1.png"},{id:2,url:"img/crying2.png"},{id:3,url:"img/neutral.png"}
    ,{id:4,url:"img/smile4.png"},{id:5,url:"img/smile5.png"}];
    $scope.selectedIndex = 0;
    //init
    var init = function() {
        ref = new Firebase("https://thevibe.firebaseio.com/");
        auth = ref.getAuth();
        $scope.loggedIn = false;
        $scope.createEMADisabled = false;
        $scope.EMA = {
            thought: "",
            mood: null,
            landmark: $stateParams.landmarkID
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
                setEMAs($stateParams.landmarkID);
                setLandmarks();
                LandmarkService.getLandmarkByID($stateParams.landmarkID).then(function(landmark) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.landmark = landmark;
                            console.log($scope.landmark);
                        })
                    }, 1000);
                });
            }
        });

    };

    //iniitalize feed

    var setEMAs = function(landmarkID) {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        var query = emaRef.orderByChild("landmarkID").equalTo(landmarkID);
        $scope.EMAs = $firebaseArray(query);
    }

    //iniitalize landmarks 

    var setLandmarks = function() {
        var locRef = new Firebase("https://thevibe.firebaseio.com/Landmarks/");
        $scope.landmarks = $firebaseArray(locRef);

    };
    $scope.setEmojiValue = function(emojiID, $index)
        {         
            $scope.EMA.mood = emojiID;
            $scope.selectedIndex = $index;
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
                setEMAs($stateParams.landmarkID);
                setLandmarks();
            }
            if (errorLogin) {
                alert(errorLogin);
            }
        });
    };


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
        if (EMA.uid == $rootScope.currentUser.uid){
            $scope.EMAs.$remove(EMA);
        }
        else {
            alert("Sorry, you don't have permission to delete this.");
        }
    }

    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    })
});