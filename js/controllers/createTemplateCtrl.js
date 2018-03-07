rosApp.controller('createTemplateCtrl', ['$scope', '$rootScope', 'methodApi','RELATIONSTABLE' , function($scope, $rootScope, methodApi, RELATIONSTABLE){
    $scope.listShow = false;
    $rootScope.layoutTemplate = true;
    $rootScope.generatedTemplate = false;
    $rootScope.createTemplate = true;
    $scope.resourceList = [
        {
            'name': '计算与网络',
            'field': 'computerAndNet',
            'childList': [
                {
                    'name': '主机',
                    'icon': 'icon-zhuji',
                    'field': 'host'
                },
                {
                    'name': '私有网络',
                    'icon': 'icon-siyouwangluo',
                    'field': 'privateNet'
                }
            ]
        },
        {
            'name': '存储',
            'field': 'storage',
            'childList': [
                {
                    'name': '硬盘',
                    'icon': 'icon-yingpan',
                    'field': 'disk'
                },
                {
                    'name': 'NAS',
                    'icon': 'icon-nas',
                    'field': 'nas'
                },
            ]
        }
    ];

    $scope.toolbar = [
        {
            'text': '清空',
            'class': 'btn-clear',
            'icon': 'icon-qingkong'
        },
        {
            'text': '放大',
            'class': 'btn-amplify',
            'icon': 'icon-fangda'
        },
        {
            'text': '缩小',
            'class': 'btn-lessen',
            'icon': 'icon-suoxiao'
        },
        {
            'text': '提交',
            'class': 'btn-submit',
            'icon': 'icon-tijiao',
            'disabled': 'disabled'
        },
        {
            'class': 'btn-export',
            'text': '导出PNG'
        }
    ];

    var canvasWidth = $(".canvas-container").width();
    document.getElementById("canvas").setAttribute("width", canvasWidth);


    $scope.toggleList = function($event){
        var target = $($event.target).parent();
        var $resourceList = target.children(".resource-detail");
        $resourceList.slideToggle();
    };

    /*设定三级路径导航的宽度*/
    methodApi.setNavWidth(".crumb-navigation", 180);

    /*初始化canvas*/
    var result = methodApi.initCanvas();
    var canvas = result.canvas;
    var stage = result.stage;
    var scene = result.scene;
    var resConfig = result.resConfig;//资源配置
    var baseNetwork = null;//基础网络节点
    var link = null;//连线
    var selectedNode = null;//选中的节点
    var newNode = null;
    var currentNode = null;//表示当前选中的节点
    var $ziyuanpeizhiUl = $(".ziyuanpeizhi-ul");
    var $gaojixuanxiangUl = $(".gaojixuanxiang-ul");
    var effect = JTopo.Effect.spring({
        minLength: 150
    });
    var jsonResult = {};
    var resourceIndex = [
        {
            resourceName: "主机",
            index: 1
        },
        {
            resourceName: "私有网络",
            index: 1
        },
        {
            resourceName: "硬盘",
            index: 1
        },
        {
            resourceName: "NAS",
            index: 1
        }
    ];

    var methods = {
        /*资源拖拽*/
        resourceDrag: function (){
            var resourceTooltip = [
                {
                    resourceName: "基础网络",
                    tooltip: "请拖入一个私有网络或者主机加入到基础网络中！"
                },
                {
                    resourceName: "主机",
                    tooltip: "请拖入一个硬盘加入到主机中！"
                },
                {
                    resourceName: "私有网络",
                    tooltip: "请拖入一个主机加入到私有网络中！"
                },
                {
                    resourceName: "硬盘",
                    tooltip: "硬盘只能加入到主机中！"
                },
                {
                    resourceName: "NAS",
                    tooltip: "NAS只能加入到私有网络中！"
                }
            ];

            $(".tooltip-d").remove();

            /*选中一个节点,并绑定事件*/
            scene.addEventListener("click", function(){
                selectedNode = this.selectedElements[0];
                    if(selectedNode instanceof JTopo.Node){
                        var resourceAllocation  = selectedNode.configuration.resourceAllocation;
                        var advancedOptions = selectedNode.configuration.advancedOptions;
                        methodApi.setConfigurationLi(resourceAllocation, $ziyuanpeizhiUl);
                        methodApi.setConfigurationLi(advancedOptions, $gaojixuanxiangUl);
                        methodApi.showPopup(newNode, selectedNode);
                    }else{
                    };
            });

            /*获取canvas的left和top*/
            var canvasLeft = methodApi.getLeft(canvas);
            var canvasTop = methodApi.getTop(canvas);
            /*设置拖拽元素draggable的操作*/
            $(".drag-li").draggable({
                start: function () {
                    $(this).addClass("drag-li-moving");
                },
                stop: function (event, ui) {
                    $(this).removeClass("drag-li-moving");
                },
                appendTo: "body",
                helper: "clone",
                cursor: "pointer",
                cursorAt: {
                    left: 4,
                    bottom: 2
                }
            });
            /*设置接收者droppable的操作*/
            $("#canvas").droppable({
                accept: ".drag-li",
                drop: function(event, ul){
                    var x = 0;
                    var y = 0;
                    var resourceName = ""
                    var imgSrc = "";
                    var text = "";
                    var img = "";
                    nodes = scene.getDisplayedNodes();
                    var index = 0;
                    var $ziyuanpeizhi = $(".description .ziyuanpeizhi");
                    var $gaojixuanxiang = $(".description .gaojixuanxiang");

                    if(baseNetwork == null){
                        x = 200;
                        y = 300;
                        resourceName = "基础网络";
                        imgSrc = "././imgs/siyouwangluo.png";
                        baseNetwork = methodApi.createNode(x, y, resourceName, imgSrc);
                        baseNetwork.resourceName = resourceName;
                        baseNetwork.id = 1;
                        baseNetwork.type = 1;
                        baseNetwork.jsonExpress = {
                            id:  baseNetwork.id,
                            type: baseNetwork.type,
                            name: baseNetwork.text,
                            resourceName: baseNetwork.resourceName,
                            x: baseNetwork.x,
                            y: baseNetwork.y,
                            configuration: null,
                            node: baseNetwork,
                            children: []
                        };
                        jsonResult = baseNetwork.jsonExpress;

                        scene.add(baseNetwork);
                        baseNetwork.addEventListener("mouseup", function(event){
                            currentNode = this;
                            methodApi.handle(event, event.pageX - canvasLeft, event.pageY - canvasTop);
                        });
                    }

                    x = ul.position.left - canvasLeft;
                    y = ul.position.top - canvasTop;
                    resourceName = ul.draggable.children(".resource-name").text();
                    text = "新建" + resourceName;
                    img = ul.draggable.children(".iconfont")[0].className.split(" ")[1].split("-")[1];
                    imgSrc = "././imgs/" + img + ".png";


                    if(selectedNode == null && nodes.length < 2){
                        if(methodApi.judgeRelation(baseNetwork.resourceName, resourceName, RELATIONSTABLE)){
                            index = methodApi.setNodeIndex(resourceName, resourceIndex);
                            text += index;
                            newNode  = methodApi.createNode(x, y, text, imgSrc);
                            newNode.resourceName = resourceName;
                            newNode.type = methodApi.getType(newNode.resourceName);
                            scene.add(newNode);
                            link = methodApi.link(baseNetwork, newNode);
                            newNode.id = baseNetwork.id * 10 + 1;
                            baseNetwork.children = newNode;
                            scene.add(link);
                        }else{
                            methodApi.setTooltip(methodApi.setNodeTooltip(baseNetwork, resourceTooltip));
                        }
                    }else if(selectedNode == null){
                        methodApi.setTooltip("请选中某个节点进行操作！");
                    }else{
                        if(methodApi.judgeRelation(selectedNode.resourceName, resourceName, RELATIONSTABLE)){
                            index = methodApi.setNodeIndex(resourceName, resourceIndex);
                            text += index;
                            newNode  = methodApi.createNode(x, y, text, imgSrc);
                            newNode.resourceName = resourceName;
                            newNode.type = methodApi.getType(newNode.resourceName);
                            scene.add(newNode);
                            link = methodApi.link(selectedNode, newNode);
                            if(selectedNode.children){
                                newNode.id = selectedNode.children.id + 1;
                            }else{
                                newNode.id = selectedNode.id * 10 + 1;
                            }
                            selectedNode.children = newNode;
                            scene.add(link);
                        }else{
                            angular.forEach(resourceTooltip, function(data){
                               if(data.resourceName == selectedNode.resourceName){
                                   methodApi.setTooltip(data.tooltip);
                               }
                            });
                        }
                    }

                    if(newNode){
                        newNode.addEventListener("mouseup", function(event){
                            currentNode = this;
                            methodApi.handle(event,  currentNode.x + 10 ,  currentNode.y + 10);
                        });
                    }

                    /*给每个节点生成对应的配置项*/
                    nodes = scene.getDisplayedNodes();

                    angular.forEach(nodes, function(data){
                        data.configuration = {};
                        for(var i = 0; i < resConfig.length; i++){
                            if(data.resourceName == resConfig[i].name){
                                angular.copy(resConfig[i].configuration, data.configuration);
                                break;
                            }
                        }
                        data.configuration.resourceAllocation["名称"] = data.text;
                    });

                    if(baseNetwork.jsonExpress.configuration == null){
                        baseNetwork.jsonExpress.configuration = baseNetwork.configuration;
                    };



                    if(newNode){
                          var resourceAllocation  = newNode.configuration.resourceAllocation;
                          var advancedOptions = newNode.configuration.advancedOptions;
                          methodApi.setConfigurationLi(resourceAllocation, $ziyuanpeizhiUl);
                          methodApi.setConfigurationLi(advancedOptions, $gaojixuanxiangUl);
                          methodApi.showPopup(newNode, selectedNode);
                    }else{
                    };


                    $("#contextmenu a").click(function(){

                        var id = currentNode.id;
                        var content = $(this).text();
                        if(content  == "撤销上一次操作"){
                            currentNode.restore();
                        }else{
                            currentNode.save();
                        };
                        if(content == "顺时针旋转"){
                            currentNode.rotate += 0.5;
                            $("#contextmenu").hide();
                        }else if(content == "逆时针旋转"){
                            currentNode.rotate -= 0.5;
                            $("#contextmenu").hide();
                        };
                        if(content == "删除该节点"){
                            if(currentNode.resourceName == "基础网络"){
                                scene.clear();
                                baseNetwork = null;
                                jsonResult = {};
                            }else{
                                for(var i = 0; i < nodes.length; i++){
                                    idString = nodes[i].id.toString();
                                    if(idString.indexOf(id) != -1){
                                        scene.remove(nodes[i]);
                                    }
                                };
                                methodApi.modifyJsonResult(id, jsonResult.children);
                            }
                            $(".configuration-ul").empty();
                            $("#contextmenu").hide();
                        }
                    });
                    methodApi.contextmenuHide(scene);

                    jsonResult = methodApi.jsonParse(baseNetwork, selectedNode, newNode, jsonResult);
                    if(jsonResult.children){
                        $(".btn-submit").removeClass("disabled");
                    }

                    newNode = null;
                    // console.log(nodes);
                }
            });
        },
        /*切换资源配置和高级选项*/
        tabToggle: function(){
            var $tabs = $(".description .tab");
            $tabs.on("click", function(){
                $(this).addClass("active")
                    .siblings().removeClass("active");
            });
        }
    }

    $scope.operation = function(text){
        nodes = scene.getDisplayedNodes();
        if(text == "清空"){
            if(nodes.length > 0){
                $(".layer").fadeIn();
                $(".qingkong-modal").fadeIn();
            }else{
            };

            $(".qingkong-sure").on("click", function(){
                $(".btn-submit").addClass("disabled");
                $(".layer").fadeOut();
                $(".qingkong-modal").fadeOut();
                scene.clear();
                baseNetwork = null;
                selectedNode = null;
                $(".configuration-ul").empty();
                angular.forEach(resourceIndex, function(data){
                    data.index = 1;
                });
                jsonResult = {};
            });
            $(".qingkong-cancel").on("click", function(){
                $(".layer").fadeOut();
                $(".qingkong-modal").fadeOut();
            });
        }else if(text == "放大"){
            if(nodes.length > 0){
                var width = nodes[0].width;
                var height = nodes[0].height;
                angular.forEach(nodes, function(data){
                    if(width < 35 && height< 35){
                        data.setSize(width + 1, height + 1);
                    }else{
                        data.setSize(35, 35);
                        $(".fangdaTooltip").fadeIn();
                        setTimeout(function(){
                            $(".fangdaTooltip").fadeOut();
                        }, 1500);
                    }
                })
            }else{
                return;
            }
        }else if(text == "缩小"){
            if(nodes.length > 0){
                var width = nodes[0].width;
                var height = nodes[0].height;
                angular.forEach(nodes, function(data){
                    if(width > 23 && height > 23){
                        data.setSize(width - 1, height - 1);
                    }else{
                        data.setSize(23, 23);
                        $(".suoxiaoTooltip").fadeIn();
                        setTimeout(function(){
                            $(".suoxiaoTooltip").fadeOut();
                        }, 1500);
                    }
                })
            }else{
                return;
            }
        }else if(text == "提交"){
            console.log(jsonResult);
            if(jsonResult.children){
                $("#submitModal").on("show.bs.modal", function(){
                    var date = new Date();
                    var seperator1 = "-";
                    var seperator2 = ":";
                    var month = date.getMonth() + 1;
                    var strDate = date.getDate();
                    if(month >= 1 && month <= 9){
                        month = "0" + month;
                    }
                    if(strDate >= 0 && strDate <= 9){
                        strDate = "0" + strDate;
                    }
                    var currentTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
                        + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2
                        + date.getSeconds();
                    $("#time").val(currentTime);
                });
                $("#submitModal").modal({
                    keyboard: true
                 });
            };

        }else{
            stage.saveImageInfo();
        }
    };

    $rootScope.submitTemplate = function(id, name, status, createTime, description){
        $rootScope.contents.push({
            checkbox: false,
            id: id,
            name: name,
            status: status,
            createTime: createTime,
            description: description,
            network: jsonResult
        });
    };

    $scope.modify = function(text){
       if(text == "资源配置"){
           $ziyuanpeizhiUl.show();
           $gaojixuanxiangUl.hide();
       }else{
           $ziyuanpeizhiUl.hide();
           $gaojixuanxiangUl.show();
       }
    };

    $(document).ready(function(){
        methods.resourceDrag();

        methods.tabToggle();
    });
}]);
