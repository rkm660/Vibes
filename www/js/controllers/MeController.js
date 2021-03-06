starter.controller('MeController', function($scope, $rootScope, $ionicModal, $ionicPopup, $firebaseArray, UserService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $ionicPlatform, Utils, LandmarkService) {

    var ref, auth, mood;
    $scope.moods = [{ id: 1, url: "img/crying1.png" }, { id: 2, url: "img/crying2.png" }, { id: 3, url: "img/neutral.png" }, { id: 4, url: "img/smile4.png" }, { id: 5, url: "img/smile5.png" }];

    $scope.selectedIndex = 2;

    //init
    var init = function() {
        ref = new Firebase("https://thevibe.firebaseio.com/");
        auth = ref.getAuth();
        $scope.loggedIn = false;
        $scope.createEMADisabled = false;
        $scope.EMA = {
            mood: 3,
            q1: null,
            q2: 'C',
            q3: 'C',
            q4: 'C',
            q5: 'C',
            q6: 'C',
            q7: 'C',
            q8: 'C',
            q9: 'C',
            q10: 'C',
            q11: 'C',
            q12: 'C',
            q13: 'C',
            q14: 'C',
            q15: 'C',
            q16: 'C'
        };

        $scope.answers2 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers3 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers4 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers5 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers6 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers7 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers8 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers9 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers3 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers10 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers11 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers12 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers13 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers14 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers15 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $scope.answers16 = [
            { text: "Not at all", value: "A" },
            { text: "Not very much", value: "B" },
            { text: "Neutral", value: "C" },
            { text: "A little", value: "D" },
            { text: "A lot", value: "E" }
        ];

        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.loginModal = modal;
            if (!auth) {
                $scope.loginModal.show();
            } else {
                $rootScope.currentUser = auth;
                if ($rootScope.token) {
                    var deviceRef = new Firebase("https://thevibe.firebaseio.com/Devices/");
                    deviceRef.child($rootScope.token).set({
                        uid: $rootScope.currentUser.uid
                    });
                }
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

    $scope.moreInfo = function(EMA) {
        var landmark;
        if (EMA.landmarkID) {
            LandmarkService.getLandmarkByID(EMA.landmarkID).then(function(l) {
                landmark = l;
                var myPopup = $ionicPopup.show({
                    template: '<div class="list"><span class="item item-avatar item-text-wrap"><img ng-src="' + EMA.weather.icon + '" />' + '<p><strong>Temperature:</strong> ' + Math.round(EMA.weather.temp) + '&deg; F</p><p><strong>Daylight:</strong> ' + Utils.formatDayLength(EMA.weather.sunset, EMA.weather.sunrise) + ' hours</p></span><span class="item item-avatar item-text-wrap"><img src="' + $scope.moods[EMA.mood - 1].url + '"/><p><strong>Location:</strong> ' + landmark.name + '</p><p><strong>Mood: </strong> ' + EMA.mood + '</p></span></div>',
                    title: 'My EMA',
                    subTitle: 'Created: ' + Utils.formatDate(EMA.timestamp),
                    scope: $scope,
                    buttons: [{
                        text: 'Okay',
                        type: 'button-positive',
                    }]
                });
            });
        } else {
            var myPopup = $ionicPopup.show({
                template: '<div class="list"><span class="item item-avatar item-text-wrap"><img ng-src="' + EMA.weather.icon + '" />' + '<p><strong>Temperature:</strong> ' + Math.round(EMA.weather.temp) + '&deg; F</p><p><strong>Daylight:</strong> ' + Utils.formatDayLength(EMA.weather.sunset, EMA.weather.sunrise) + ' hours</p></span></div>',
                title: 'My EMA',
                subTitle: 'Created: ' + Utils.formatDate(EMA.timestamp),
                scope: $scope,
                buttons: [{
                    text: 'Okay',
                    type: 'button-positive',
                }]
            });
        }


    };

    $scope.setEmojiValue = function(emojiID, $index) {
        $scope.EMA.mood = emojiID;
        $scope.selectedIndex = $index;
    };

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
                init();
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
        console.log(EMA);
        $scope.createEMADisabled = true;
        if (!EMA.thought || EMA.thought.length == 0) {
            alert("Please enter a quick thought!");
            $scope.createEMADisabled = false;
        } else {

            // if (EMA.landmark == "") {
            //     EMA.landmark = null;
            // }
            // Utils.getWeather($scope.currentPosition.lat, $scope.currentPosition.lng).success(function(weather) {

            $scope.EMAs.$add({
                thought: EMA.thought,
                mood: EMA.mood,
                EMA: EMA,
                // lat: $scope.currentPosition.lat,
                // lng: $scope.currentPosition.lng,
                // weather: {
                //     temp: weather.main.temp * 1.8 + 32,
                //     sunrise: weather.sys.sunrise,
                //     sunset: weather.sys.sunset,
                //     type: weather.weather[0].main,
                //     desc: weather.weather[0].description,
                //     icon: "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
                // },
                timestamp: Firebase.ServerValue.TIMESTAMP,
                //landmarkID: EMA.landmark,
                uid: $rootScope.currentUser.uid,
                notify: true
            }).then(function(ref) {});

            $scope.EMA = {
                mood: 3,
                q1: null,
                q2: 'C',
                q3: 'C',
                q4: 'C',
                q5: 'C',
                q6: 'C',
                q7: 'C',
                q8: 'C',
                q9: 'C',
                q10: 'C',
                q11: 'C',
                q12: 'C',
                q13: 'C',
                q14: 'C',
                q15: 'C',
                q16: 'C'
            };
            $scope.emaModal.hide();
            $scope.createEMADisabled = false;
            // }).error(function(err) {
            //     console.log(err);
            //     $scope.createEMADisabled = false;
            // });

        }
    };

    $scope.removeEMA = function(EMA) {
        $scope.EMAs.$remove(EMA);
    }

    $scope.showEMAModal = function() {
        // $scope.showModalDisabled = true;
        // var posOptions = {
        //     timeout: 10000,
        //     enableHighAccuracy: true
        // };
        // $cordovaGeolocation
        //     .getCurrentPosition(posOptions)
        //     .then(function(position) {
        //         var lat = position.coords.latitude;
        //         var lng = position.coords.longitude;
        //         $scope.currentPosition = { lat: lat, lng: lng };
        //         UserService.getNearbyLandmarks($scope.currentPosition).then(function(ls) {
        //             console.log(ls);
        //             $scope.nearbyLandmarks = ls;
        $scope.emaModal.show();
        $scope.showModalDisabled = false;
        //     });
        // }, function(err) {
        //     // error
        //     $scope.showModalDisabled = false;
        //     if (err.code === 1) {
        //         alert("Please enable location on your device.");
        //     } else {
        //         console.log(err);
        //     }
        // });
    };


    $scope.questionUpdated = function(q, num) {
        console.log(q, num);
    }

    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    });
});