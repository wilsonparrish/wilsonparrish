(function () {
	"use strict";

	angular.module('app')
		.controller('homeController', function ($scope) {

			$scope.test = "test";
			
			setInterval(function(){
				$scope.blink = $scope.blink === false ? true: false;
				console.log($scope.blink);
				$scope.$apply();
			}, 700);

		});

} ());