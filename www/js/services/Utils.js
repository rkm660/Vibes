angular.module('starter').service('Utils', function($q, $http) {
    var self = this;

    self.getReverseGeo = function(lat, lng){
        return $http.get("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lng);
    }
    
});