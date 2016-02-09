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
                    deferred.resolve(landmark);
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
                if (key == ID) {
                    deferred.resolve(landmark);
                }
            });
        });
        return deferred.promise;
    };

    var getID = function(name) {
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
        emasRef.once("value", function(EMAs) {
            var EMAs = landmark.EMAs;
            for (var i in EMAs) {
                var emaRef = new Firebase("https://thevibe.firebaseio.com/EMAs/" + EMAs[i].emaID);
                emaRef.once("value", function(ema) {
                    data.push(ema.val());
                });
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    };


    self.averageMood = function(name) {
        var deferred = $q.defer();
        var mood = 0;
        self.getLandmarkByName(name).then(function(landmark) {
            getEMAData(landmark).then(function(data) {
                for (i in data) {
                    mood += data[i].mood
                }

                mood /= data.length;
                if (isNaN(mood)) {
                    mood = "N/A";
                }
                deferred.resolve(mood);
            });
        });
        return deferred.promise;
    }

    self.removeEMA = function(landmarkID, emaID) {
        var url = "https://thevibe.firebaseio.com/Landmarks/" + landmarkID + "/EMAs";
        var landmarkEMARef = new Firebase(url);
        var landmarkEMAs = $firebaseArray(landmarkEMARef);
        landmarkEMAs.$loaded().then(function(emas) {
            angular.forEach(landmarkEMAs, function(e) {
                if (e.emaID == emaID) {
                    var record = landmarkEMAs.$getRecord(e.$id);
                    landmarkEMAs.$remove(record);
                }
            })

            landmarkEMAs.$remove();
        });
    }

});