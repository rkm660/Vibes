starter.service('UserService', function($q, LandmarkService, Utils) {
    var self = this;
    var ref = new Firebase("https://thevibe.firebaseio.com/");


    self.getUsers = function() {
        var deferred = $q.defer();
        var userRef = new Firebase("https://thevibe.firebaseio.com/users/");
        userRef.once("value", function(users) {
            deferred.resolve(users.val());
        });
        return deferred.promise;
    };

    self.getUsersWithinLandmark = function(name) {
        var returnUsers = [];
        var deferred = $q.defer();
        self.getUsers().then(function(users) {
            LandmarkService.getLandmarkDataByName(name).then(function(data) {
                for (uid in users) {
                    var userLocation = { lat: users[uid].BGLocation.lat, lng: users[uid].BGLocation.lng };
                    var landmarkLocation = { lat: data.lat, lng: data.lng };
                    if (Utils.withinRadius(userLocation, landmarkLocation, data.radius)) {
                        returnUsers.push(uid);
                    }
                }
                deferred.resolve(returnUsers);
            });
        });
        return deferred.promise;
    };


    self.getUser = function(uid) {
        var deferred = $q.defer();
        var userRef = new Firebase("https://thevibe.firebaseio.com/users/" + uid);
        userRef.once("value", function(user) {
            deferred.resolve(user.val());
        });
        return deferred.promise;
    }

    self.login = function(credentials) {
        var deferred = $q.defer();
        ref.authWithPassword({
            email: credentials.email,
            password: credentials.password
        }, function(error, authData) {
            if (error) {
                deferred.resolve([null, error]);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                deferred.resolve([authData, null]);
            }
        });
        return deferred.promise;
    };

    self.register = function(credentials) {
        var deferred = $q.defer();
        ref.createUser({
            email: credentials.email,
            password: credentials.password
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
                deferred.resolve([null, error]);
            } else {
                console.log("Successfully created user account with uid:", userData);
                var newUserRef = ref.child("users").child(userData.uid).set({
                    email: credentials.email,
                    lastNotiReceived: 0
                }, function(error) {
                    if (error) {
                        console.log('Synchronization failed');
                    } else {
                        console.log('Synchronization succeeded');
                    }
                });
                deferred.resolve([userData.uid, null]);
            }
        });
        return deferred.promise;
    };
});