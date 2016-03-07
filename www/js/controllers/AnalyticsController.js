starter.controller('AnalyticsController', function($scope, $rootScope, $firebaseArray, $ionicModal, $ionicHistory) {

    $scope.labels = ["Happy","Sad","Depressed","Ecstatic","Blah"];
    $scope.values = [];
    $scope.labels1 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.series = ['EMAs'];
    $scope.data = [[]];
    $scope.showFrequency = false;
    $scope.options = {animationEasing : 'easeOutBounce'};
     $scope.type = 'Pie';
     $scope.text = "Radar Chart";
    $scope.toggleChart = function () {
      $scope.type = $scope.type === 'PolarArea' ?
        'Pie' : 'PolarArea';
        $scope.text = $scope.text === 'Pie Chart'? 'Radar Chart' : 'Pie Chart';
    };

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
           $scope.data = [[]];
           var d = 0;
           var s = 0;
           var b = 0;
           var h = 0;
           var e = 0;  
           var sunday = 0;
           var monday = 0;
           var tuesday = 0;
           var wednesday = 0;
           var thursday = 0;
           var friday = 0;
           var saturday = 0;
           var today = new Date();
           var todaysDay = today.getDay();
           angular.forEach(snapshot.val(), function(EMA){
                var myDate = new Date(EMA.timestamp);
                var day=myDate.getDay();
                
                switch(EMA.mood){
                    case 1: d++;break;
                    case 2: s++;break;
                    case 3: b++;break;
                    case 4: h++;break;
                    case 5: e++;break;
                }
                if(today.getFullYear() == myDate.getFullYear() && 
                        today.getMonth() == myDate.getMonth() &&
                             Math.abs(today.getDate() - myDate.getDate()) < 7){
                switch(day){
                    case 0: sunday++;break;
                    case 1: monday++;break;
                    case 2: tuesday++;break;
                    case 3: wednesday++;break;
                    case 4: thursday++;break;
                    case 5: friday++;break;
                    case 6: saturday++;break;
                    }
                }
            });
            $scope.values.push(h);
            $scope.values.push(s);
            $scope.values.push(d);
            $scope.values.push(e);
            $scope.values.push(b);     

            $scope.labels1[todaysDay] = $scope.labels1[todaysDay] +  " (Today)";
            $scope.data[0].push(sunday);
            $scope.data[0].push(monday);
            $scope.data[0].push(tuesday);
            $scope.data[0].push(wednesday);
            $scope.data[0].push(thursday);
            $scope.data[0].push(friday);
            $scope.data[0].push(saturday);

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