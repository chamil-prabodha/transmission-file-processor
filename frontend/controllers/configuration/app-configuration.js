/**
 * Created by chamilp on 1/12/18.
 */
(function(){
  angular.module('tfpApp', ['ngMaterial', 'md.data.table', 'ngAnimate', 'toastr'])
  .config(function (toastrConfig) {
    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-right'
    });
  });
})();