rosApp.controller('topologiesCtrl', ['$scope', '$state', '$rootScope', 'methodApi',function($scope, $state, $rootScope, methodApi){
    $scope.isActive2 = true;
    $rootScope.layoutTemplate = false;
    $rootScope.generatedTemplate = true;
    $rootScope.createTemplate = false;

    $scope.headers = [{'name': 'ID', 'field': 'id', 'link': true},
        {'name': '模板ID', 'field': 'modalId'},
        {'name': '名称', 'field': 'name'},
        {'name': '状态', 'field': 'status'},
        {'name': '创建时间', 'field': 'createTime'}];

    $scope.searchOptions = [
        {
            'key': 'id',
            'value': '按ID搜索'
        },
        {
            'key': 'modalId',
            'value': '按模板ID搜索',
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

    var contents = [
        {
            'checkbox': false,
            'id': '1',
            'modalId': 'temp1',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:00:00'
        },
        {
            'checkbox': false,
            'id': '2',
            'modalId': 'temp2',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:30:00'
        },
        {
            'checkbox': false,
            'id': '3',
            'modalId': 'temp3',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:00:00'
        },
        {
            'checkbox': false,
            'id': '4',
            'modalId': 'temp4',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:30:00'
        },
        {
            'checkbox': false,
            'id': '5',
            'modalId': 'temp5',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 15:00:00'
        },
        {
            'checkbox': false,
            'id': '1',
            'modalId': 'temp6',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:00:00'
        },
        {
            'checkbox': false,
            'id': '2',
            'modalId': 'temp6',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:30:00'
        },
        {
            'checkbox': false,
            'id': '3',
            'modalId': 'temp6',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:00:00'
        },
        {
            'checkbox': false,
            'id': '4',
            'modalId': 'temp6',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:30:00'
        },
        {
            'checkbox': false,
            'id': '5',
            'modalId': 'temp7',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 15:00:00'
        },
        {
            'checkbox': false,
            'id': '1',
            'modalId': 'temp8',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:00:00'
        },
        {
            'checkbox': false,
            'id': '2',
            'modalId': 'temp9',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 13:30:00'
        },
        {
            'checkbox': false,
            'id': '3',
            'modalId': 'temp10',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:00:00'
        },
        {
            'checkbox': false,
            'id': '4',
            'modalId': 'temp11',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 14:30:00'
        },
        {
            'checkbox': false,
            'id': '5',
            'modalId': 'temp12',
            'name': '无',
            'status': '可用',
            'createTime': '2017-06-27 15:00:00'
        }
    ];
    $(".tooltip-d").remove();

    $scope.contents = contents;

    methodApi.setNavWidth(".crumb-navigation", 180);

    /*分页功能初始化*/
    methodApi.initPageFunction($rootScope);
    methodApi.setPageFunction($scope, $rootScope);

    /*搜索功能实现*/
    $scope.searchButton = function(searchOption, searchValue){
        methodApi.searchButton(searchOption, searchValue, $rootScope, $scope);
    }

    $("")
}]);
