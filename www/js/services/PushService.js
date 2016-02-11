angular.module('starter').service('PushService', function($q, $ionicUser, $ionicPush) {
    var self = this;
    
    self.identifyUser = function(uid) {
        var deferred = $q.defer();
        var user = $ionicUser.get();
        if (!user.user_id) {
            user.user_id = uid;
        }

        $ionicUser.identify(user).then(function() {
            console.log('Identified user ID ' + user.user_id);
            deferred.resolve(user);
        });
        return deferred.promise;
    }


    self.registerUser = function(user) {

        $ionicPush.register({
            canShowAlert: true,
            canSetBadge: true,
            canPlaySound: true,
            canRunActionsOnWake: true,
            onNotification: function(notification) {

                return true;
            }
        });
    }

});