var bkSearch = angular.module("bksearch", ['ui.bootstrap', 'leaflet-directive', 'bsLoadingOverlay', 'ngMaterial']);
bkSearch.controller("MainController", ['$scope', '$timeout', 'HttpService', 'bsLoadingOverlayService', '$mdBottomSheet',
    function ($scope, $timeout, HttpService, bsLoadingOverlayService, $mdBottomSheet, Holder) {
        $scope.sidebar = function () {
            console.log("show me dog")
            if ($scope.addressDetails) {
                $scope.addressDetails = false
            } else {
                $scope.addressDetails = true
            }
        }

        var local_icons = {
            default_icon: {},
            leaf_icon: {
                iconUrl: 'assets/img/bmarker.png',
                iconSize: [20, 20],
                // iconSize:     [50, 64], // size of the icon
            },
        }

        var minLength = 0;
        $scope.no_result = true

        $scope.selected = {};

        $scope.clear = function () {
            $scope.selecting = null;
            $scope.addressDetails = false;
        }
        // 
        bsLoadingOverlayService.setGlobalConfig({
            templateUrl: './templates/loader.html'
        });


        angular.extend($scope, {
            center: {
                lat: 23.757087,
                lng: 90.390370,
                zoom: 16
            },
            defaults: {
                zoomAnimation: true,
                markerZoomAnimation: true,
                fadeAnimation: true
            },

            markers: {
                m1: {
                    lat: 23.757087,
                    lng: 90.390370,
                    draggable: false,
                    icon: {
                        iconUrl: 'assets/img/bmarker.png',
                        iconSize: [70, 70]
                    },
                },
            },


            events: { // or just {} //all events
                map: {
                    enable: ['moveend', 'popupopen'],
                    logic: 'emit'
                },
                markers: {
                    enable: ['dragend', 'moveend'],
                    logic: 'emit'
                }
            },
            layers: {
                baselayers: {

                    bkoi: {
                        name: 'barikoi',
                        url: 'http://map.barikoi.xyz:8080/styles/klokantech-basic/{z}/{x}/{y}.png',
                        type: 'xyz',
                        layerOptions: {
                            attribution: 'Barikoi',
                            maxZoom: 23
                        },
                    },


                    mapbox_light: {
                        name: 'Mapbox Streets',
                        url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                        type: 'xyz',
                        layerOptions: {
                            apikey: 'pk.eyJ1Ijoicmhvc3NhaW4iLCJhIjoiY2o4Ymt0NndlMHVoMDMzcnd1ZGs4dnJjMSJ9.5Y-mrWQCMXqWTe__0J5w4w',
                            mapid: 'mapbox.streets',
                            attribution: 'barikoi',
                            maxZoom: 23
                        },
                        layerParams: {
                            showOnSelector: true
                        }
                    }
                }
            }
        });

        // $scope.pls = "please"
        // $scope.$watch('pls',function(newValue){
        //     $rootScope.shared=$scope.pls
        //     })

        $scope.onSelect = function (user) {
            $scope.selected = user;

            localStorage.setItem('selectedLocation', JSON.stringify($scope.selected))

            if ($scope.selected !== null) {
                $scope.addressDetails = true
                // $scope.showListBottomSheet()
            } else {
                $scope.addressDetails = false
            }

            console.log(user);
            $scope.markers.m1.lat = parseFloat($scope.selected.latitude);
            $scope.markers.m1.lng = parseFloat($scope.selected.longitude)
            $scope.center.lat = parseFloat($scope.selected.latitude);
            $scope.center.lng = parseFloat($scope.selected.longitude);
        };
        $scope.users = function (userName) {

            // console.log('loader')
            bsLoadingOverlayService.start({
                referenceId: 'first'
            });
            $scope.error_message = '';
            if (userName.length < minLength) {
                return [];
            }
            $scope.loading = false;
            return HttpService.post_anything(userName).then(function (data) {
                if (!Array.isArray(data.places)) {
                    $scope.error_message = data.places.Message;
                    bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
                    $scope.loading = true;
                } else {
                    $scope.error_message = '';
                    bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
                    $scope.loading = true;
                }
                return data.places;
            }, function (status) {
                bsLoadingOverlayService.stop({
                    referenceId: 'first'
                });
                $scope.loading = true;
            });
        };

        $scope.showListBottomSheet = function () {
            console.log("ello")
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'templates/test.html',
                controller: 'ListBottomSheetCtrl'
            }).then(function ( clickedItem ) {
                $scope.alert = clickedItem['name'] + ' clicked!';
            }).catch(function ( error ) {
                // User clicked outside or hit escape
            })
        }
    }
]);

bkSearch.service('Holder', function($rootScope){
    return { text: 'ddd' };
});

bkSearch.controller('ListBottomSheetCtrl', function ($rootScope, $scope, $mdBottomSheet, Holder) {

    // $scope.location = JSON.parse(localStorage.getItem('selectedLocation'))
    $scope.location = []
    $scope.location.push(JSON.parse(localStorage.getItem('selectedLocation')))
    console.log($scope.location)

    $scope.items = [{
            name: 'Share',
            icon: 'share-arrow'
        },
        {
            name: 'Upload',
            icon: 'upload'
        },
        {
            name: 'Copy',
            icon: 'copy'
        },
        {
            name: 'Print this page',
            icon: 'print'
        },
    ]

    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    }
})

// bkSearchmodule.factory('userServices', function(){

// 	let fac = {};

// 	fac.users = ['John', 'James', 'Jake']; 

// 	return fac;

// });