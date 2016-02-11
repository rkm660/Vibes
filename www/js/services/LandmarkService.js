angular.module('starter').service('LandmarkService', function($q, $firebaseArray) {
    var self = this;

    self.getLandmarkByName = function(name) {
        var ref = new Firebase("https://thevibe.firebaseio.com/Landmarks");
        var deferred = $q.defer();
        ref.once("value", function(landmarks) {
            landmarks.forEach(function(l) {
                var key = l.key();
                var landmark = l.val();
                if (landmark.name === name) {
                    deferred.resolve(key);
                }
            });
        });
        return deferred.promise;
    };

    self.getLandmarkByID = function(ID) {
        var ref = new Firebase("https://thevibe.firebaseio.com/Landmarks");
        var deferred = $q.defer();
        ref.once("value", function(landmarks) {
            landmarks.forEach(function(l) {
                var key = l.key();
                var landmark = l.val();
                if (key == ID) {
                    deferred.resolve(landmark);
                }
            });
        });
        return deferred.promise;
    };

    self.getID = function(name) {
        var ref = new Firebase("https://thevibe.firebaseio.com/Landmarks");
        var deferred = $q.defer();
        ref.once("value", function(landmarks) {
            landmarks.forEach(function(l) {
                var key = l.key();
                var landmark = l.val();
                if (landmark.name === name) {
                    deferred.resolve(key);
                }
            });
        });
        return deferred.promise;
    }

    var getEMAData = function(landmark) {
        var deferred = $q.defer();
        var data = [];
        var emasRef = new Firebase("https://thevibe.firebaseio.com/EMAs");
        emasRef.once("value", function(e) {
            var EMAs = e.val();
            for (i in EMAs) {
                if (EMAs[i].landmarkID == landmark) {
                    data.push(EMAs[i]);
                }
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    };


    self.landmarkData = function(name) {
        var deferred = $q.defer();
        var mood = 0;
        self.getLandmarkByName(name).then(function(l) {
            getEMAData(l).then(function(data) {
                for (i in data) {
                    mood += data[i].mood
                }

                mood /= data.length;
                if (isNaN(mood)) {
                    mood = "N/A";
                }
                deferred.resolve([mood,data.length]);
            });
        });
        return deferred.promise;
    }



});