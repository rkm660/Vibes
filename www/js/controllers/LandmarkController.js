starter.controller('LandmarkController', function($scope, $rootScope, $ionicModal, $ionicPopup, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils, LandmarkService, $stateParams, $location) {

    var ref, auth;
    $scope.moods = [{ id: 1, url: "img/crying1.png" }, { id: 2, url: "img/crying2.png" }, { id: 3, url: "img/neutral.png" }, { id: 4, url: "img/smile4.png" }, { id: 5, url: "img/smile5.png" }];
    $scope.selectedIndex = 2;

    //init
    var init = function() {
        ref = new Firebase("https://thevibe.firebaseio.com/");
        auth = ref.getAuth();
        $scope.loggedIn = false;
        $scope.createEMADisabled = false;
        $scope.EMA = {
            thought: "",
            mood: 3,
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

    $scope.setEmojiValue = function(emojiID, $index) {
        $scope.EMA.mood = emojiID;
        $scope.selectedIndex = $index;
    };

    $scope.moreInfo = function(EMA) {
        console.log(EMA);
        LandmarkService.getLandmarkByID(EMA.landmarkID).then(function(l) {
            console.log(l);
        });

        var myPopup = $ionicPopup.show({
            template: '<div class="list"><span class="item item-avatar item-text-wrap"><img ng-src="' + EMA.weather.icon + '" />' + '<p><strong>Temperature:</strong> ' + Math.round(EMA.weather.temp) + '&deg; F</p><p><strong>Daylight:</strong> ' + Utils.formatDayLength(EMA.weather.sunset, EMA.weather.sunrise) + ' hours</p></span></div>',
            title: 'My Vibe',
            subTitle: 'Created: ' + Utils.formatDate(EMA.timestamp),
            scope: $scope,
            buttons: [{
                text: 'Okay',
                type: 'button-positive',
            }]
        });
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
        if (!EMA.thought || EMA.thought.length == 0) {
            alert("Please enter a quick thought!");
            $scope.createEMADisabled = false;
        } else {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: true
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    Utils.getWeather(lat, lng).success(function(weather) {
                        $scope.EMAs.$add({
                            thought: EMA.thought,
                            mood: EMA.mood,
                            lat: lat,
                            lng: lng,
                            weather: {
                                temp: weather.main.temp * 1.8 + 32,
                                sunrise: weather.sys.sunrise,
                                sunset: weather.sys.sunset,
                                type: weather.weather[0].main,
                                desc: weather.weather[0].description,
                                icon: "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
                            },
                            timestamp: Firebase.ServerValue.TIMESTAMP,
                            landmarkID: EMA.landmark,
                            uid: $rootScope.currentUser.uid,
                            notify: true
                        }).then(function(ref) {

                        });

                        $scope.EMA = {
                            thought: "",
                            mood: null,
                            landmark: null
                        }
                        $scope.emaModal.hide();
                        $scope.createEMADisabled = false;
                    }).error(function(err) {
                        console.log(err);
                    });
                }, function(err) {
                    // error
                    if (err.code === 1) {
                        alert("Please enable location on your device.");
                    } else {
                        alert(err.message);
                    }
                    $scope.createEMADisabled = false;

                });
        }


    };



    $scope.removeEMA = function(EMA) {
        if (EMA.uid == $rootScope.currentUser.uid) {
            $scope.EMAs.$remove(EMA);
        } else {
            alert("You cannot delete someone else's Vibe!");
        }
    }

    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    })
    $scope.$on("$ionicView.afterEnter", function(event) {
        LandmarkService.getLandmarkByID($stateParams.landmarkID).then(function(landmark) {
            $scope.landmark = landmark;
            UserService.getNearbyLandmarkIDs($rootScope.currentUser.uid).then(function(ls) {
                if (ls.indexOf($stateParams.landmarkID) == -1) {
                    $scope.showCreate = false;
                } else {
                    $scope.showCreate = true;
                }
            });
        });
    });
});