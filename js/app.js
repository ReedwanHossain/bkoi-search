var bkSearch = angular.module("bksearch", ['ui.bootstrap', 'leaflet-directive', 'bsLoadingOverlay']);
bkSearch.controller("MainController", ['$scope', '$timeout', 'HttpService', 'bsLoadingOverlayService',
  function($scope, $timeout, HttpService, bsLoadingOverlayService) {
      $scope.sidebar = function () {
          console.log("show me dog")
          if ($scope.addressDetails) {
            $scope.addressDetails = false
          } else {
              $scope.addressDetails = true
          }
      }
    var minLength = 0;
    $scope.no_result = true

     $scope.selected={};
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
                    },
                },

                events: { // or just {} //all events
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    markers:{
                      enable: [ 'dragend', 'moveend' ],
                      logic: 'emit'
                    }
                }, layers: {
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

    $scope.onSelect = function(user){
      $scope.selected = user;
        if ( $scope.selected !== null ) {
            $scope.addressDetails = true
        } else {
            $scope.addressDetails = false
        }

      console.log(user);
      $scope.markers.m1.lat = parseFloat($scope.selected.latitude);
      $scope.markers.m1.lng = parseFloat($scope.selected.longitude)
      $scope.center.lat = parseFloat($scope.selected.latitude);
      $scope.center.lng = parseFloat($scope.selected.longitude);
    };
    $scope.users = function(userName) {

        // console.log('loader')
      bsLoadingOverlayService.start({
                referenceId: 'first'
        });
     $scope.error_message = '';
      if (userName.length < minLength) {
        return [];
      }
      $scope.loading = true;
      return HttpService.post_anything(userName).then(function(data){
        if (!Array.isArray(data.places)) {
           $scope.error_message = data.places.Message;
          bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
        }
        else {
          $scope.error_message = '';
          bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
        }
        return data.places;
      }, function(status){
        bsLoadingOverlayService.stop({
                        referenceId: 'first'
                    });
      });
    };
  }
]);


