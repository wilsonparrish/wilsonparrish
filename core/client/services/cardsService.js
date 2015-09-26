(function () {
    "use strict";

    angular.module('app')
        .service('cardsService', function ($http, $q) {

            this.getDeck = function () {
                return $http.get('http://deckofcardsapi.com/api/deck/new/').error(function (err) {
                    return err;
                })
            }
            
            this.reshuffle = function (deckId) {
                return $http.get('http://deckofcardsapi.com/api/deck/' + deckId + '/shuffle/').error(function (err) {
                    return err;
                })
            }

            this.drawCard = function (deckId) {
                return $http.get('http://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1').error(function (err) {
                    return err;
                })
            }
        });


} ());

