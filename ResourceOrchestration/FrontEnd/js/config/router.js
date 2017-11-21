var app = angular.module('rosApp');

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/topology_templates');
	$stateProvider
        .state('topology_templates', {
            url: '/topology_templates',
            templateUrl: 'template/topology_templates.html'
        })
		.state('createTemplate', {
			url: '/createTemplate',
			templateUrl: 'template/createTemplate.html'
		})
		.state('topologies', {
			url: '/topologies',
			templateUrl: 'template/topologies.html'
		})
}]);
