// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  /**
   * The menu factory handles saving and loading menus
   * from local storage, and also lets us save and load the
   * last active menu index.
   */
  .factory('Menus', function () {
    return {
      all: function () {
        var menuString = window.localStorage['menus'];
        if (menuString) {
          return angular.fromJson(menuString);
        }

        return [];
      },
      save: function (menus) {
        window.localStorage['menus'] = angular.toJson(menus);
      },
      newMenu: function (menu) {
        return {
          title: menu,
          tasks: []
        };
      },
      getLastActiveIndex: function () {
        return parseInt(window.localStorage['lastActiveMenu']) || 0;
      },
      setLastActiveIndex: function (index) {
        window.localStorage['lastActiveMenu'] = index;
      }

    }
  })
  .factory('Test', function () {
    return {

      getItems: function () {
        window.localStorage['items'] = '';
        var initItems;
        var itemString = window.localStorage['items'];
        if (itemString) {
          initItems = angular.fromJson(itemString)
        }
        //填补静态数据
        if (!initItems) {
          var items = [
            {title: '测试header', url: 'test_header.html'},
            {'title': '测试button', 'url': 'test_button.html'},
            {title: '测试list', url: 'test_list.html'},
            {title: '测试card', url: 'test_card.html'}
          ]
          initItems = [];
          for (var item in items) {

            initItems.push(items[item]);
            console.log(items[item].title);
          }
          window.localStorage['items'] = angular.toJson(initItems);
        }

        return initItems;
      }
      ,
      newItem: function (_title, _url) {
        return {title: _title, url: _url};
      }
      ,
      saveItems: function (_items) {
        window.localStorage['items'] = angular.toJson(_items);
      }
    }

  })
  .controller('starterCtrl', function ($scope, $timeout, $ionicModal, Menus, $ionicSideMenuDelegate, $location, Test, $rootScope, $http) {

    // A utility function for creating a new menu
    // with the given menuTitle
    $scope.showMainList = true;

    var createMenu = function (menuTitle) {
      var newMenu = Menus.newMenu(menuTitle);
      $scope.menus.push(newMenu);
      Menus.save($scope.menus);
      $scope.selectMenu(newMenu, $scope.menus.length - 1)
    }


    //load or initalize menus
    $scope.menus = Menus.all();

    $scope.selectTestMenus = function () {
      $scope.activeMenu = '';
      $scope.showMainList = false;
      Menus.setLastActiveIndex(-1);
      $ionicSideMenuDelegate.toggleLeft(false);
    }

    //Grab the last active,or the first menu
    var menusIndex = Menus.getLastActiveIndex();
    if (menusIndex == -1) {
      $scope.selectTestMenus();
    } else {

      $scope.activeMenu = $scope.menus[Menus.getLastActiveIndex()];
    }

    //called to create a new mneu

    $scope.newMenu = function () {
      var menuTitle = prompt('新的菜单名称');
      if (menuTitle) {
        createMenu(menuTitle);
      }
    };

    $scope.selectMenu = function (menu, index) {
      $scope.activeMenu = menu;
      Menus.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
      $scope.showMainList = true;
    };

    // $scope.tasks = [
    //   {title: '测试1'},
    //   {title: '测试2'},
    //   {title: '测试3'},
    //   {title: '测试4'},
    //   {title: '测试5'},
    //   {title: '测试6'}
    // ]
    //载入新建模板
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
      $scope.taskModal = modal;
    }, {scope: $scope, animation: 'slide-in-up'});
    //提交表单
    $scope.createNewTask = function (task) {
      $scope.activeMenu.tasks.push({title: task.title});
      $scope.taskModal.hide();
      task.title = '';
    };
    //打开新建页面
    $scope.newTask = function () {
      $scope.taskModal.show();
    };
    //关闭新建页面
    $scope.closeNewTask = function () {
      $scope.taskModal.hide();
    };

    $scope.toggleProjects = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };


    var addItem = function (_title, _url) {
      var newItem = Test.newItem(_title, _url);
      $scope.items.push(newItem);
      Test.saveItems($scope.items);
    }

    $scope.testItems = Test.getItems();

    //载入新建test item模板
    $ionicModal.fromTemplateUrl('new-item.html', function (modal) {
      $scope.itemModal = modal;
    }, {scope: $scope, animation: 'slide-in-up'});
    //提交表单
    $scope.createNewItem = function (item) {
      addItem(item.title, item.url);
      $scope.itemModal.hide();
      item.title = '';
      item.url = '';
    };
    //打开新建页面
    $scope.showNewItem = function () {
      $scope.itemModal.show();
    };
    //关闭新建页面
    $scope.closeNewItem = function () {
      $scope.itemModal.hide();
    };


    $scope.newSomething = function () {
      if ($scope.showMainList) {
        $scope.newTask();
      } else {
        $scope.showNewItem();
      }
    }
    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    $timeout(function () {
      if ($scope.menus.length == 0) {
        while (true) {
          var menuTitle = prompt("你第一个菜单的名字");
          if (menuTitle) {
            createMenu(menuTitle);
            break;
          }
        }
      }
    });
    $scope.goThisPage = function (_page) {
      window.location.href = _page;
      console.log("location = " + $location.path());
    }

    //
    // $http.get('templet.html').success(function (response) {
    //   alert(response);
    //   response = response.replace("***js", "/js/thismy.js").replace("***title", 'ceshi').replace("***subtitle", 'subtitle')
    //   saveAs(/test.html')
    // });

    ///utils
    // var readFile = function (_filePath) {
    //   $http.get(_filePath).success( function(response) {
    //     res
    //   });
    // }
  })
  .run(
    ['$ionicPlatform', '$ionicPopup', '$rootScope', '$location', function ($ionicPlatform, $ionicPopup, $rootScope, $location) {

      //主页面显示退出提示框
      $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();
        console.log('$location.path==' + $location.path)
        function showConfirm() {
          var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '你确定要退出应用吗?',
            okText: '退出',
            cancelText: '取消'
          });

          confirmPopup.then(function (res) {
            if (res) {
              ionic.Platform.exitApp();
            } else {
              // Don't close
            }
          });
        }

        // Is there a page to go back to?
        if ($location.path() == '') {
          showConfirm();
        }

        return false;
      }, 101);
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

    }]);



