(function () {
    "use strict";

    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'components/home/home.client.template.html',
                    controller: 'homeController'
                })
                .state('blackjack', {
                    url: '/blackjack',
                    templateUrl: 'modules/blackjack/blackjackTemplate.html',
                    controller: 'blackjackCtrl'
                })
        });

} ());