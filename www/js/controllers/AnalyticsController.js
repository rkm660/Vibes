starter.controller('AnalyticsController', function($scope, $rootScope, $firebaseArray, $ionicModal, $ionicHistory) {

    $scope.labels = ["Happy","Sad","Depressed","Ecstatic","Blah"];
    $scope.values = [];
    //init
    var initialize = function() {
         
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
                if ($rootScope.token) {
                    var deviceRef = new Firebase("https://thevibe.firebaseio.com/Devices/");
                    deviceRef.child($rootScope.token).set({
                        uid: $rootScope.currentUser.uid
                    });
                }
                $scope.loggedIn = true;
                getEMAs($rootScope.currentUser.uid);
                setLandmarks();
            }
        });
    };

    //iniitalize feed

    var getEMAs = function(uid) {
        var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/");
        emaRef.orderByChild("uid").equalTo(uid).on('value', function(snapshot){
           $scope.values = [];
           var d = 0;
           var s = 0;
           var b = 0;
           var h = 0;
           var e = 0;  
            angular.forEach(snapshot.val(), function(EMA){
                switch(EMA.mood){
                    case 1: d++;break;
                    case 2: s++;break;
                    case 3: b++;break;
                    case 4: h++;break;
                    case 5: e++;break;
                }
            });
            $scope.values.push(h);
            $scope.values.push(s);
            $scope.values.push(d);
            $scope.values.push(e);
            $scope.values.push(b);
        }); 
            
    }

    var setLandmarks = function() {
        var locRef = new Firebase("https://thevibe.firebaseio.com/Landmarks/");
        $scope.landmarks = $firebaseArray(locRef);
    };

    $scope.$on("$ionicView.beforeEnter", function(event) {
        initialize();
    });
});