angular.module('starter').service('UserService', function($q) {
    var self = this;
    var ref = new Firebase("https://thevibe.firebaseio.com/");

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
                    email : credentials.email
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