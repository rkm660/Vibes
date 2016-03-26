// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic', 'ionic.service.core', 'firebase', 'ngCordova', 'ngTouch', 'angularMoment', 'chart.js']);

starter.run(function($ionicPlatform, $rootScope, $cordovaSplashscreen, $ionicPopup, Utils) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        Utils.startBGWatch();

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        var push = new Ionic.Push({
            "onNotification": function(notification) {
                if (notification["_raw"]["additionalData"]["foreground"] == true) {
                    $ionicPopup.alert({
                        title: 'Hello!',
                        template: notification["_raw"]["message"]
                    });
                }
            }
        });


        push.register(function(token) {
            console.log("Device token:", token.token);
            $rootScope.token = token.token;
            $cordovaSplashscreen.hide();
        });





    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me.html',
                controller: 'MeController'
            }
        }
    })

    .state('tab.us', {
        url: '/us',
        views: {
            'tab-us': {
                templateUrl: 'templates/tab-us.html',
                controller: 'EveryoneController'
            }
        }
    })

    .state('tab.landmark-detail', {
        url: '/us/:landmarkID',
        views: {
            'tab-us': {
                templateUrl: 'templates/landmark.html',
                controller: 'LandmarkController'
            }
        }
    })

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/tab-settings.html',
                controller: 'SettingsController'
            }
        }
    })

    .state('tab.analytics', {
        url: '/analytics',
        cache:false,
        views: {
            'tab-analytics': {
                templateUrl: 'templates/tab-analytics.html',
                controller: 'SelfAnalysisController'
            }
        }
    })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/me');
});