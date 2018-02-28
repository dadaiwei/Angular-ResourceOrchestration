rosApp.controller('topologyTempsCtrl', ['$scope', '$state', '$rootScope', 'methodApi',
    function($scope, $state, $rootScope, methodApi){
    $scope.isActive1 = true;
    $scope.isCreateModal = true;
    $rootScope.layoutTemplate = true;
    $rootScope.generatedTemplate = false;
    $rootScope.createTemplate = false;
    $scope.headers = [{'name': 'ID', 'field': 'id', 'link': true},
        {'name': '名称', 'field': 'name'},
        {'name': '状态', 'field': 'status'},
        {'name': '创建时间', 'field': 'createTime'}];
     var contents = [
        {
            'checkbox': false,
            'id': 'temp1',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:00:00'
        },
         {
             'checkbox': false,
             'id': 'temp2',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:00:00'
         },
         {
             'checkbox': false,
             'id': 'temp3',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:00:00'
         },
        {
            'checkbox': false,
            'id': 'temp4',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:30:00'
        },
        {
            'checkbox': false,
            'id': 'temp5',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:00:00'
        },
        {
            'checkbox': false,
            'id': 'temp6',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:30:00'
        },
        {
            'checkbox': false,
            'id': 'temp7',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 15:00:00'
        }, {
             'checkbox': false,
             'id': 'temp8',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:00:00'
         },
         {
             'checkbox': false,
             'id': 'temp9',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:00:00'
         },
         {
             'checkbox': false,
             'id': 'temp10',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:00:00'
         },
         {
             'checkbox': false,
             'id': 'temp11',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 13:30:00'
         },
         {
             'checkbox': false,
             'id': 'temp12',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 14:00:00'
         },
         {
             'checkbox': false,
             'id': 'temp13',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 14:30:00'
         },
         {
             'checkbox': false,
             'id': 'temp14',
             'name': '无',
             'status': '可用',
             'createTime': '2017-06-27 15:00:00'
         }
    ];

    $scope.searchOptions = [
        {
            'key': 'id',
            'value': '按ID搜索'
        },
        {
            'key': 'name',
            'value': '按名称搜索',
        },
        {
            'key': 'status',
            'value': '按状态搜索'
        }
    ];

    $scope.contents = contents;

    $scope.goCreate = function(){
        $state.go("createTemplate");
    };

    $(".tooltip-d").remove();

    methodApi.setNavWidth(".crumb-navigation", 170);

    /*分页功能初始化*/
    methodApi.initPageFunction($rootScope);
    methodApi.setPageFunction($scope, $rootScope);

    /*搜索功能实现*/
    $scope.searchButton = function(searchOption, searchValue){
        methodApi.searchButton(searchOption, searchValue, $rootScope, $scope);
    };

    /*鼠标右键应用模板*/
    $scope.tooltipShow = function($event){
        var target = $event.target;
        methodApi.tooltipShow(target);
    };
    /*鼠标右键应用模板*/
    $scope.tooltipShow = function($event){
        var target = $event.target;
        methodApi.tooltipShow(target);
    };

}]);