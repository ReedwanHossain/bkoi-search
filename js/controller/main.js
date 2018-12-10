var bkSearch = angular.module("bksearch");
bkSearch.controller("MainController", ['$scope', '$stateParams', 'HttpService', '$http', 'bsLoadingOverlayService', '$mdBottomSheet', '$rootScope',

    function ($scope, $stateParams, HttpService, $http, bsLoadingOverlayService, $mdBottomSheet, $rootScope) {
        console.log('query');

        //sidebar hide for mobile and web
        if (screen.width < 768) {
            console.log($scope.sidebarFull)
            console.log($scope.sidebarMobile)
            $scope.sidebarFull = true
            $scope.sidebarMobile = true
            $scope.addressDetails = false
        }

        //address details hide & show
        $scope.sidebar = function () {
            console.log("in address details")
            if ($scope.addressDetails) {
                console.log($scope.addressDetails)
                $scope.addressDetails = false
            } else {
                console.log($scope.addressDetails)
                $scope.addressDetails = true
            }
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
                zoom: 18
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
                        iconSize: [70, 70],
                        iconAnchor: [50, 50]
                    },
                },
            },


            events: { // or just {} //all events
                map: {
                    enable: ['moveend', 'popupopen', 'click'],
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

        var init = function () {
            HttpService.post_anything($stateParams.query).then(function (data) {

                console.log($stateParams.query)
                if (Array.isArray(data.places)) {
                    $scope.selected = data.places[0];
                    localStorage.setItem('selectedLocation', JSON.stringify(data.places[0]))
                    if (screen.width < 768) {
                        $scope.showListBottomSheet();
                    } else {
                        $scope.addressDetails = true
                    }

                }

                $scope.markers.m1.lat = parseFloat($scope.selected.latitude);
                $scope.markers.m1.lng = parseFloat($scope.selected.longitude)
                $scope.center.lat = parseFloat($scope.selected.latitude);
                $scope.center.lng = parseFloat($scope.selected.longitude);
                $scope.center.zoom = 18

            }, function (status) {
                $scope.loading = true;
            });
        }
        init()

        $scope.onSelect = function (user) {
            $scope.selected = user;

            localStorage.setItem('selectedLocation', JSON.stringify($scope.selected))

            if ($scope.selected !== null) {
                console.log("in selected")
                if (screen.width < 768) {
                    $scope.showListBottomSheet()
                } else {
                    $scope.addressDetails = true
                }
            } else {
                $scope.addressDetails = false

            }

            console.log(user);
            $scope.markers.m1.lat = parseFloat($scope.selected.latitude);
            $scope.markers.m1.lng = parseFloat($scope.selected.longitude)
            $scope.center.lat = parseFloat($scope.selected.latitude);
            $scope.center.lng = parseFloat($scope.selected.longitude);
            $scope.center.zoom = 17
        }

        //Reverse Geocoding

        $scope.$on("leafletDirectiveMap.click", function (event, args) {
            console.log(args.leafletEvent.latlng)

            $scope.markers.m1.lat = args.leafletEvent.latlng.lat
            $scope.markers.m1.lng = args.leafletEvent.latlng.lng

            const markerLatitude = $scope.markers.m1.lat
            const markerLongitude = $scope.markers.m1.lng

            let paramData = {
                params: {
                    latitude: markerLatitude,
                    longitude: markerLongitude
                }
            }

            //[""0""] latlng.lat

            $http.get("https://barikoi.xyz/v1/reverse/without/auth", paramData)
                .success(function (response) {
                    $scope.selected = response[0]
                    // $rootScope.error_message

                    localStorage.setItem('selectedLocation', JSON.stringify($scope.selected))

                    if ($scope.selected) {

                        console.log("in selected & found")
                        $rootScope.error_message = false

                        if (screen.width < 768) {
                            $scope.showListBottomSheet()
                        } else {
                            $scope.addressDetails = true
                        }
                    } else {

                        console.log("in selected & notNound")

                        $rootScope.error_message = true
                        $scope.addressDetails = false
                    }
                })
        })


        $scope.users = function (userName) {

            bsLoadingOverlayService.start({
                referenceId: 'first'
            });
            $rootScope.error_message = '';
            if (userName.length < minLength) {
                return [];
            }
            $scope.loading = false;
            return HttpService.post_anything(userName).then(function (data) {
                if (!Array.isArray(data.places)) {

                    $rootScope.error_message = data.places.Message;

                    console.log($scope.error_message)
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




        //bottomsheet function

        $scope.showListBottomSheet = function () {
            console.log("ello")
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'templates/location-details.html',
                controller: 'ListBottomSheetCtrl'
            }).then(function (clickedItem) {
                $scope.alert = clickedItem['name'] + ' clicked!';
            }).catch(function (error) {
                // User clicked outside or hit escape
            })

        }

        //Reverse Geocoding

        // $scope.events = {
        //     map: {
        //         enable: leafletMapEvents.getAvailableMapEvents(),
        //         logic: 'emit'
        //     }
        // }

    }
]);

bkSearch.controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet) {

    $scope.location = []
    $scope.location.push(JSON.parse(localStorage.getItem('selectedLocation')))
    console.log($scope.location)

    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    }
})

bkSearch.controller('NoResultBottomSheet', function ($scope, $mdBottomSheet) {
    $scope.NoResultBottomSheet = function () {
        console.log("show bottonsheet pls")
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'templates/noResult.html',
            // controller: 'NoResultBottomSheet'
        }).then(function (clickedItem) {
            $scope.alert = clickedItem['name'] + ' clicked!';
        }).catch(function (error) {
            // User clicked outside or hit escape
        })

    }
})