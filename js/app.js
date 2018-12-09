var bkSearch = angular.module("bksearch", ['ui.router', 'ui.bootstrap', 'leaflet-directive', 'bsLoadingOverlay', 'ngMaterial']);
bkSearch.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
      
        $stateProvider

            .state('main', {
                url: '/',
                templateUrl: 'templates/main.html',
                controller: 'MainController',
            })

            .state('q', {
                url: '/:query',
                templateUrl: 'templates/query.html',
                controller: 'QueryController',
                
            });
});

