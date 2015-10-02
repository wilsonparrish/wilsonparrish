(function () {
    "use strict";

    angular.module('app')
        .controller('blackjackCtrl', function ($scope, cardsService) {
            
            //clean table
            $scope.houseHand = {
                hand: [],
                handSum: null
            };

            $scope.playerHand = {
                wins: 0,
                losses: 0,
                hand: [],
                handSum: null
            };

            $scope.discardPile = [];

            $scope.isDisabled = false;
            
            //start by getting a fresh deck and shuffling it
            cardsService.getDeck().then(function (res) {
                $scope.deck = res.data;
                console.log(res.data);
                shuffle($scope.deck.deck_id);
                playHand();
            })
            
            //Used for dealing
            var dealCard = function (deck, hand) {
                if (deck.remaining < 5) {
                    cardsService.getDeck().then(function (res) {
                        $scope.deck = res.data;
                        console.log(res.data);
                        shuffle($scope.deck.deck_id);
                        $scope.discardPile = [];
                        // return dealCard(deck, hand);
                    })
                }
                cardsService.drawCard(deck.deck_id).then(function (res) {
                    if (res.data.cards[0].code === 'AD') {
                        res.data.cards[0].image = "http://deckofcardsapi.com/static/img/AH.png";
                    }
                    hand.push(res.data.cards[0]);
                    if ($scope.houseHand.hand.length === 1) {
                        $scope.houseHand.hand[0].actualImage = $scope.houseHand.hand[0].image;
                        $scope.houseHand.hand[0].image = "http://i296.photobucket.com/albums/mm181/Wilson_Parrish/cardBack_zpsplwjc9sq.png?1443816642910&1443816643306";
                    }
                    $scope.deck = res.data;
                    console.log(res.data);
                    if ($scope.playerHand.hand.length === 2) {
                        $scope.houseHand.handSum = handSummer($scope.houseHand.hand);
                        $scope.playerHand.handSum = handSummer($scope.playerHand.hand);
                    }
                })
            };
            
            //shuffles
            var shuffle = function (deckId) {
                cardsService.reshuffle(deckId).then(function (res) {
                    $scope.deck = res.data;
                    console.log(res.data);
                })
            };
            
            //determines the total of card values
            var handSummer = function (hand) {
                var handSum = 0;
                var acesArray = [];
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i].value === "KING" || hand[i].value === "QUEEN" || hand[i].value === "JACK") {
                        handSum = handSum + 10;
                    } else if (hand[i].value !== "ACE") {
                        handSum = handSum + parseInt(hand[i].value);
                    } else {
                        acesArray.push(hand[i]);
                    }
                }
                for (var j = 0; j < acesArray.length; j++) {
                    if (acesArray.indexOf(i + 1) !== -1) {
                        handSum = handSum + 1;
                    } else if (handSum > 10) {
                        handSum = handSum + 1;
                    } else {
                        handSum = handSum + 11;
                    }
                }
                if (handSum >= 21) {
                    $scope.isDisabled = true;
                }
                return handSum;
            };



            var playHand = function () {
                // ************* Hands begin at and return to this point ************ //
                //burn a card, send to discardPile
                dealCard($scope.deck, $scope.discardPile);
                //deal house 1st card face down
                dealCard($scope.deck, $scope.houseHand.hand);
                //deal player 1st card
                dealCard($scope.deck, $scope.playerHand.hand);
                //deal house 2nd card face up
                dealCard($scope.deck, $scope.houseHand.hand);
                //deal player 2nd card 
                dealCard($scope.deck, $scope.playerHand.hand)
                
                // if($scope.playerHand.hand.length === 0 || $scope.houseHand.hand.length === 0){
                //     playHand();
                // }  //I want it to check and make sure cards have been dealt
                
                //player hits?
                $scope.drawCard = function (deck) {
                    if (deck.remaining === 0) {
                        cardsService.getDeck().then(function (res) {
                            $scope.deck = res.data;
                            console.log(res.data);
                            shuffle($scope.deck.deck_id);
                            $scope.discardPile = [];
                            // return $scope.drawcard(deck);
                        })
                    }
                    cardsService.drawCard(deck.deck_id).then(function (res) {
                        $scope.playerHand.hand.push(res.data.cards[0]);
                        $scope.playerHand.handSum = handSummer($scope.playerHand.hand);
                        console.log($scope.playerHand);
                        $scope.deck = res.data;
                    })
                };
            
                //if player stays, decide if house hits
                
                $scope.stay = function (hand) {
                    hand.handSum = handSummer(hand);
                    $scope.houseHand.hand[0].image = $scope.houseHand.hand[0].actualImage;
                    resolveHand();
                };
            
                //resolve, and discard both hands to discard pile
            }
            //resolves hand
            var resolveHand = function () {

                if ($scope.playerHand.handSum > 21) {
                    alert("You busted :P");
                    $scope.playerHand.losses++;
                } else if ($scope.playerHand.handSum === 21) {
                    alert("You got 21!");
                    $scope.playerHand.wins++;
                } else {
                    $scope.houseHand.handSum = handSummer($scope.houseHand.hand);
                    if ($scope.houseHand.handSum <= $scope.playerHand.handSum || $scope.houseHand.handSum === null) {
                        dealCard($scope.deck, $scope.houseHand.hand);
                        console.log($scope.houseHand);
                        $scope.houseHand.handSum = handSummer($scope.houseHand.hand);
                        setTimeout(function () {
                            resolveHand();
                        }, 1000);
                        return
                    } else if ($scope.houseHand.handSum > 21) {
                        alert("You won! House hand total was " + $scope.houseHand.handSum);
                        $scope.playerHand.wins++;
                    } else {
                        alert("You lost, Your hand total was " + $scope.playerHand.handSum + " while the House had " + $scope.houseHand.handSum);
                        $scope.playerHand.losses++;
                    }
                }
                for (var i = 0; i < $scope.playerHand.hand.length; i++) {
                    $scope.discardPile.push($scope.playerHand.hand[i]);
                }
                for (var j = 0; j < $scope.houseHand.hand.length; j++) {
                    $scope.discardPile.push($scope.houseHand.hand[j]);
                }
                $scope.playerHand.hand = [];
                $scope.playerHand.handSum = null;
                $scope.houseHand = {
                    hand: [],
                    handSum: null
                };
                $scope.isDisabled = false;
                return playHand();
            };

        });

} ());