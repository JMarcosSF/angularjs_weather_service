var app = angular.module('app', ['ngRoute', 'ngResource']);

app.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {
	$scope.city = cityService.getCity();
	$scope.$watch('city', function() {
		cityService.setCity($scope.city);
	});
	$scope.submit = function() {
		console.log('Submitting...');
		$location.path('/forecast');
	}
}]);

app.controller('forecastController', ['$scope', '$routeParams', 'weatherService', 'cityService', function($scope, $routeParams, weatherService, cityService) {
	$scope.city = cityService.getCity();
	$scope.days = $routeParams.days || '2';
	weatherService.weatherAPI.get({q:$scope.city, cnt: $scope.days, APPID: weatherService.appID}).$promise.then(function(value) {
		$scope.results = value;
	}, function(err) {
		console.log(err);
	});;
	$scope.dateFormat = 'EEEE MMM d, y';

	$scope.formatDate = function(date) {
		return new Date(date * 1000);
	}
	$scope.convertToF = function(temp) {
		return Math.round((1.8 * (temp - 273)) + 32);
	}
}]);

// SERVICES
app.service('cityService', function() {
	this.city = "San Francisco, CA";
	this.getCity = function() {
		return this.city;
	};
	this.setCity = function(city) {
		this.city = city;
	}
});
app.service('weatherService', ['$resource', function($resource) {
	this.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily?&mode=json', {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP'}});
	this.appID = '122995bcf62c020a137fdd08087b123d';
}])

//ROUTES
app.config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl: 'home/home.htm',
		controller: 'homeController'
	})

	.when('/forecast', {
		templateUrl: 'forecast/forecast.htm',
		controller: 'forecastController'
	})

	.when('/forecast/:days', {
		templateUrl: 'forecast/forecast.htm',
		controller: 'forecastController'
	})
});

// DIRECTIVES
// DIRECTIVES
app.directive('forecastDirective', function() {
	return {
		restrict: 'E',
		templateUrl: 'forecast/forecastDirective.html',
		replace: true,
		scope: {
			res: '=',
			convertToF: '&',
			formatDate: '&',
			formatStr: '@'
		}
	}
});