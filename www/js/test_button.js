/**
 * Created by andyliu on 16-6-17.
 */
angular.module('test_button', ['ionic'])
  .controller('test_button_control', function ($scope) {

    $scope._back = function () {
      window.history.back(-1);
      console.log("goback")
    }
  })
  .run(
    ['$ionicPlatform', '$ionicPopup', '$rootScope', '$location', function ($ionicPlatform, $ionicPopup, $rootScope, $location) {

      //主页面显示退出提示框
      $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();
        window.history.back(-1);
        return false;
      }, 101);

    }]);
