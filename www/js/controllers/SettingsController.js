starter.controller('SettingsController', function($scope, $rootScope, $ionicModal, $firebaseArray, UserService, $ionicPlatform, Utils) {

    var ref, userRef, auth;

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
                UserService.getUser($rootScope.currentUser.uid).then(function(user) {
                    userRef = new Firebase("https://thevibe.firebaseio.com/users/" + $rootScope.currentUser.uid);

                    $scope.settings = {
                        email : $rootScope.currentUser.password.email
                    };
                    if (user.age != null) {
                        $scope.settings.age = user.age;
                    }
                    else {
                        $scope.settings.age = null;
                    }
                    if (user.gender != null){
                        $scope.settings.gender = user.gender;
                    }
                    else {
                        $scope.settings.gender = null;
                    }
                });

            }
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

    $scope.changedAge = function(age) {
        console.log(age);
        userRef.update({
            age: age
        });

    }

    $scope.changedGender = function(gender) {
        console.log(gender);
        userRef.update({
            gender: gender
        });
    }


    $scope.$on("$ionicView.beforeEnter", function(event) {
        init();
    })
});