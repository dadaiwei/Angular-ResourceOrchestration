var rosApp = angular.module("rosApp", ['ui.router']);

rosApp.controller('mainCtrl', ['$scope', '$rootScope', 'methodApi', function($scope, $rootScope, methodApi){

    methodApi.initPageFunction($rootScope);

    $rootScope.selectAll = function(allCheck, contents, index, entry){
        if (index==undefined){
        }else{
            contents = contents.slice(index*entry, (index+1)*entry);
        }
        for (var i = 0; i< contents.length;i++) {
            contents[i].checkbox = allCheck;
        }
    };

    $rootScope.remove = function(){
        var arr = [];

        angular.forEach($rootScope.contents, function(item){
            if(item.checkbox != true){
                arr.push(item);
            }
        });

        $rootScope.contents = arr;
        $rootScope.childScope.contents = arr;
        $rootScope.childScope.allCheck = false;

        $rootScope.pageButtons = [{index:0, active: true, name: 1}];

        for(var i = 1; i < Math.ceil($rootScope.contents.length /   $rootScope.pageEntry ); i++){
            $rootScope.pageButtons.push({
                index: i,
                active: false,
                name: i + 1
            });
        };

        angular.copy($rootScope.childScope.contents, $rootScope.childScope.searchContents);
    };

    $rootScope.changeEntry = function(value){
        $rootScope.pageIndex = 0;
        $rootScope.pageEntry = value;
        $rootScope.pageButtons = [{index:0, active: true, name: 1}];

        for(var i = 1; i < Math.ceil($rootScope.contents.length /  $rootScope.pageEntry ); i++){
            $rootScope.pageButtons.push({
                index: i,
                active: false,
                name: i + 1
            });
        };

        for(var i = 0; i < $rootScope.contents.length; i++){
            $rootScope.contents[i].checkbox = false;
        }

        $rootScope.childScope.allCheck = false;
    };

    $rootScope.goPageButton = function(index){
        if(index < 0 || index>= $rootScope.pageButtons.length){
            return;
        }

        $rootScope.pageIndex = index;
        for(var i = 0; i < $rootScope.pageButtons.length; i++){
            $rootScope.pageButtons[i].active = false;
        }
        $rootScope.pageButtons[index].active = true;

        for(var i = 0; i < $rootScope.contents.length; i++){
            $rootScope.contents[i].checkbox = false;
        }

        $rootScope.childScope.allCheck = false;
    };

    $rootScope.refresh= function(){
        var $loading = $(".loading");
        $loading.fadeIn(300);
        $loading.fadeOut(300);
    }

    $(".tooltip-d").remove();
}]);