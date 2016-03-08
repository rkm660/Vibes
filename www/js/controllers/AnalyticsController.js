starter.controller('AnalyticsController', function($scope, $rootScope, $firebaseArray, $ionicModal, $ionicHistory) {

    $scope.labels = ["Happy","Sad","Depressed","Ecstatic","Blah"];
    $scope.values = [];
    $scope.labels1 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.series = ['Total EMAs per Day','Sad', 'Depressed', 'Ecstatic','Blah', 'Happy'];
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
           var sd = 0;
           var md = 0;
           var tud = 0;
           var wd = 0;
           var thd = 0;
           var fd = 0;
           var sad = 0;

           var ss = 0;
           var ms = 0;
           var tus = 0;
           var ws = 0;
           var ths = 0;
           var fs = 0;
           var sas = 0;

           var sb = 0;
           var mb = 0;
           var tub = 0;
           var wb = 0;
           var thb = 0;
           var fb = 0;
           var sab = 0;

           var sh = 0;
           var mh = 0;
           var tuh = 0;
           var wh = 0;
           var thh = 0;
           var fh = 0;
           var sah = 0;

           var se = 0;
           var me = 0;
           var tue = 0;
           var we = 0;
           var the = 0;
           var fe = 0;
           var sae = 0;


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
                    case 0: sunday++;
                               switch(EMA.mood){
                                    case 1: sd++;break;
                                    case 2: ss++;break;
                                    case 3: sb++;break;
                                    case 4: sh++;break;
                                    case 5: se++;break;
                                    }
                                break;
                    case 1: monday++;
                              switch(EMA.mood){
                                    case 1: md++;break;
                                    case 2: ms++;break;
                                    case 3: mb++;break;
                                    case 4: mh++;break;
                                    case 5: me++;break;
                                    
                                }break;
                    case 2: tuesday++;
                                  switch(EMA.mood){
                                    case 1: tud++;break;
                                    case 2: tus++;break;
                                    case 3: tub++;break;
                                    case 4: tuh++;break;
                                    case 5: tue++;break;
                                    }break;
                    case 3: wednesday++;
                                  switch(EMA.mood){
                                    case 1: wd++;break;
                                    case 2: ws++;break;
                                    case 3: wb++;break;
                                    case 4: wh++;break;
                                    case 5: we++;break;
                                   
                                }break;
                    case 4: thursday++;
                                  switch(EMA.mood){
                                    case 1: thd++;break;
                                    case 2: ths++;break;
                                    case 3: thb++;break;
                                    case 4: thh++;break;
                                    case 5: the++;break;
                                    
                                }break;
                    case 5: friday++;
                                switch(EMA.mood){
                                    case 1: fd++;break;
                                    case 2: fs++;break;
                                    case 3: fb++;break;
                                    case 4: fh++;break;
                                    case 5: fe++;break;
                                 }break;
                    case 6: saturday++;
                      switch(EMA.mood){
                                    case 1: sad++;break;
                                    case 2: sas++;break;
                                    case 3: sab++;break;
                                    case 4: sah++;break;
                                    case 5: sae++;break;
                                    
                            }break;
                    }
                }
            });
            $scope.values.push(h);
            $scope.values.push(s);
            $scope.values.push(d);
            $scope.values.push(e);
            $scope.values.push(b);     

            $scope.labels1[todaysDay] = $scope.labels1[todaysDay] +  " (Today)";
            $scope.data[0] = [];
            $scope.data[1] = [];
            $scope.data[2] = [];
            $scope.data[3] = [];
            $scope.data[4] = [];
            $scope.data[5] = [];

            $scope.data[0].push(sunday);
            $scope.data[0].push(monday);
            $scope.data[0].push(tuesday);
            $scope.data[0].push(wednesday);
            $scope.data[0].push(thursday);
            $scope.data[0].push(friday);
            $scope.data[0].push(saturday);


            $scope.data[1].push(ss);
            $scope.data[1].push(ms);
            $scope.data[1].push(tus);
            $scope.data[1].push(ws);
            $scope.data[1].push(ths);
            $scope.data[1].push(fs);
            $scope.data[1].push(sas);

            $scope.data[2].push(sd);
            $scope.data[2].push(md);
            $scope.data[2].push(tud);
            $scope.data[2].push(wd);
            $scope.data[2].push(thd);
            $scope.data[2].push(fd);
            $scope.data[2].push(sad);
            
            $scope.data[3].push(se);
            $scope.data[3].push(me);
            $scope.data[3].push(tue);
            $scope.data[3].push(we);
            $scope.data[3].push(the);
            $scope.data[3].push(fe);
            $scope.data[3].push(sae);

            $scope.data[4].push(sb);
            $scope.data[4].push(mb);
            $scope.data[4].push(tub);
            $scope.data[4].push(wb);
            $scope.data[4].push(thb);
            $scope.data[4].push(fb);
            $scope.data[4].push(sab);

            $scope.data[5].push(sh);
            $scope.data[5].push(mh);
            $scope.data[5].push(tuh);
            $scope.data[5].push(wh);
            $scope.data[5].push(thh);
            $scope.data[5].push(fh);
            $scope.data[5].push(sah);

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