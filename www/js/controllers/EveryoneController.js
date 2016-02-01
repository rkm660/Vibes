angular.module('starter').controller('EveryoneController', function($scope) {
    console.log("in EveryoneController");
    var ref = new Firebase("https://thevibe.firebaseio.com/");
    var auth = ref.getAuth();
    $scope.loggedIn = false;
    $scope.createEMADisabled = false;

    //init
    var init = function() {
        if (!auth) {
            $scope.loginModal.show();
        } else {
            $scope.currentUser = auth;
            $scope.loggedIn = true;
            $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 15 };
        }
    };



    init();
});