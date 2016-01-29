angular.module('starter').service('Utils', function($q, $http) {
    var self = this;

    self.getReverseGeo = function(location){
        return $http.get("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + location[0] + "&lon=" + location[1]);
    }
    
});