bkSearch.factory('HttpService', function($http, $q){
  return {
    post_anything : function(query){
      // console.log(query);
      var deffered = $q.defer();
      var data = {
        'search' : query
      }
      $http.post('https://barikoi.xyz/v1/tnt/search/test/', data)
        .success(function(data){
          deffered.resolve(data);
        })
        .error(function(data, status){
          deffered.reject(status);
        });

      return deffered.promise;
    }
  }
});