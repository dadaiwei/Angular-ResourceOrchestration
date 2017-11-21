rosApp.provider('methodApi', function(){

    this.$get = function(){
        var api = {};

        /*获取元素的纵坐标*/
        api.getTop = function(e){
            var offset = e.offsetTop;
            if(e.offsetParent != null){
                offset+= arguments.callee(e.offsetParent);
            }
            return offset;
        };

        /*获取元素的横坐标*/
        api.getLeft = function(e){
            var offset = e.offsetLeft;
            if(e.offsetParent != null){
                offset+= arguments.callee(e.offsetParent);
            }
            return offset;
        };

        /*设定面包导航栏的宽度*/
        api.setNavWidth = function(elem, width){
            $(elem).css({
                "width": width + "px"
            });
        };

        /*对对象进行深度克隆*/
        api.clone = function(obj){
            var o;
            if(typeof obj == "object"){
                if(obj === null){
                    o = null;
                }else{
                    if(obj instanceof Array){
                        o = [];
                        for(var i = 0, len = obj.length; i < len; i++){
                            o.push(clone(obj[i]));
                        }
                    }else{
                        o = {};
                        for(var k in obj){
                            o[k] = clone(obj[k]);
                        }
                    }
                }
            }else{
                o = obj;
            }
            return o;
        };

        /*资源列表除第一个外都隐藏*/
        api.resourceHide = function(elem){
            $(elem).hide();
        };

        /*分页初始化*/
        api.initPageFunction = function(obj){
            obj.entryOptions = [5, 10, 15, 20, 30];
            obj.pageEntry = obj.entryOptions[0];
            obj.pageIndex = 0;
            obj.contents = [];
            return;
        };

        /*分页功能初始化*/
        api.setPageFunction = function(localObj, obj){
            obj.pageButtons = [{index: 0, active: true, name: 1}];

            for(var i = 1; i < Math.ceil(localObj.contents.length / obj.pageEntry); i++){
                obj.pageButtons.push({
                    index: i,
                    active: false,
                    name: i + 1
                });
            }

            obj.contents = localObj.contents;
            obj.childScope = localObj;

            localObj.searchContents = [];
            angular.copy(localObj.contents, localObj.searchContents);
        }

        /*搜索功能实现*/
        api.searchButton = function(searchOption, searchValue, obj, localObj){
            if(searchValue == "" || searchValue == null || searchValue == undefined){
                angular.copy(localObj.searchContents,  localObj.contents);
            }else{
                angular.copy(localObj.searchContents,  localObj.contents);

                var searchOptions = localObj.searchOptions;
                var searchKey;
                var contents = [];

                for(var i = 0; i < searchOptions.length; i++){
                    if(searchOptions[i].value == searchOption){
                        searchKey = searchOptions[i].key;
                        break;
                    }
                }

                for(var i = 0; i < localObj.contents.length; i++){
                    if(localObj.contents[i][searchKey].indexOf(searchValue) != -1){
                        contents.push(localObj.contents[i]);
                    }
                }

                localObj.contents  = contents;
                obj.contents  = contents;
            }

            for(var i = 0; i < obj.contents.length; i++){
                obj.contents[i].checkbox = false;
            }

            obj.childScope.allCheck = false;

            obj.pageButtons = [{index:0, active: true, name: 1}];

            for(var i = 1; i < Math.ceil(obj.contents.length /  obj.pageEntry ); i++){
                obj.pageButtons.push({
                    index: i,
                    active: false,
                    name: i + 1
                });
            };

            obj.pagIndex = 0;
            obj.pageButtons[0].active = true;
        };

        /*画布初始化工作*/
        api.initCanvas = function(){
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var stage = new JTopo.Stage(canvas);
            var scene = new JTopo.Scene(stage);
            var resConfig = [
                {
                    name: "基础网络",
                    type: 1,
                    configuration: {		//基础网络设置
                        resourceAllocation: {
                            "名称": "",
                            "描述": "无",
                            "ID": "vxnet-0"
                        }
                    }
                },
                {
                    name: "主机",
                    type: 3,
                    configuration: {	//主机配置
                        resourceAllocation: {
                            "名称": "",
                            "描述": "无",
                            "映像": "CentOS6.6",
                            "主机类型": "普通型",
                            "CPU数量": 1,
                            "内存": "1G",                      
                            "用户名": "root"
                        },
                        advancedOptions: {
                            "Hostname": "无",
                            "用户数据": "无"
                        }
                    }
                },
                {
                    name: "私有网络",
                    type: 2,
                    configuration: {	//私有网络设置
                        resourceAllocation: {
                            "名称": "",
                            "描述": "无",
                            "类型": "受管",
                            "网络地址": "192.168.100.0/24",
                            "管理地址": "192.168.100.1",
                        },
                        advancedOptions: {
                            "DHCP": "启用",
                            "DHCP起始地址": "192.168.100.2",
                            "DHCP结束地址": "192.168.100.254"
                        }
                    }
                },
                {
                    name: "硬盘",
                    type: 4,
                    configuration:{	//硬盘设置
                        resourceAllocation:{
                            "名称": "",
                            "描述": "无",
                            "类型": "性能型",
                            "容量": "10GB"
                        }
                    }
                },
                {
                    name: "NAS",
                    type: 5,
                    configuration:{	//NAS设置
                        resourceAllocation:{
                            "名称": "",
                            "描述": "无",
                            "类型": "性能型",
                            "配置": "小型",
                            "IP": "自动分配"
                        }
                    }
                }
            ];

            return {
                canvas: canvas,
                context: context,
                stage: stage,
                scene: scene,
                resConfig: resConfig
            }
        };

        /*创建节点*/
        api.createNode = function (x, y , text, imgSrc){
            var node = new JTopo.Node();
            node.text = text;
            node.setImage(imgSrc, true);
            node.setLocation(x, y);
            node.textPosition = "Bottom_Center";
            node.fontColor = "0, 0, 0";
            node.font = "14px Aeria";
            return node;
        };

        /*连线*/
        api.link = function(nodeA, nodeZ){
            var link = new JTopo.FoldLink(nodeA, nodeZ);
            link.direction = "horizontal";
            link.lineWidth = 1.5;
            link.bundleOffset = 60; // 折线拐角处的长度
            link.strokeColor = "#38255C";
            return link;
        };

        /*判断两种资源之间的依赖关系*/
        api.judgeRelation = function(name1, name2, stable){
            var result = false;
            for(var key in stable){
                if(name1 == key){
                    angular.forEach(stable[key], function(data){
                            if(data.children == name2){
                               result = data.value;
                            }
                    });
                }
            }
            return result;
        };

        /*设置右上角提示内容*/
        api.setTooltip = function(text){
            var $dragTooltip = $(".drag-tooltip");
            $dragTooltip.text(text);
            $dragTooltip.fadeIn();
            setTimeout(function(){
                $dragTooltip.fadeOut();
            }, 1500);
        };

        /*根据节点的resourceName设置tooltip内容*/
        api.setNodeTooltip = function(node, resourceTooltip){
            var resourceName = node.resourceName;
            var tooltip = "";
            angular.forEach(resourceTooltip, function(data){
                if(data.resourceName == resourceName){
                    tooltip = data.tooltip;
                }else{

                }
            });
            return tooltip;
        };

        /*根据节点的resourceName设置索引*/
        api.setNodeIndex = function(resourceName, resourceIndex){
            var index = 0;
            angular.forEach(resourceIndex, function(data){
                if(data.resourceName == resourceName){
                    index = data.index++;
                }
            });
            return index;
        };

        /*根据配置项生成列表*/
        api.setConfigurationLi = function(configuration, el){
            var configurationItem = "";
            el.empty();
            for(var key in configuration){
                configurationItem += "<li class='configuration-item ziyuanpeizhi-item'><span class='configuration-key'>" +
                    key + "</span><div class='configuration-value'><span class='name-value control'>" + configuration[key] +
                    "</span><span class='iconfont icon-bianji' ng-click='modalShow()'></span></div></li>";
            }
            el.append($(configurationItem));
        };

        /*点击编辑实现弹框及弹框按钮作用*/
        api.showPopup = function(newNode, selectedNode){
           var newNode = newNode;
           var selectedNode = selectedNode;
           var node = selectedNode;
           var title = "";
           var $that = null;
           if(selectedNode){
               title = selectedNode.text;
           }else{
           };

           if(newNode){
               title = newNode.text;
           }else{
           };

            $(".icon-bianji").on("click", function(){
                $(".layer").fadeIn();
                $(".popup").fadeIn();
                $(".header-title").html(title);
                var controlName = $(this).parents(".ziyuanpeizhi-item").find(".configuration-key").html();
                var controlDescription = $(this).parents(".ziyuanpeizhi-item").find(".name-value").html();
                $(".control-name").val(controlName);
                $(".control-description").val(controlDescription);
                $that = $(this);

                $(".sure").click(function() {
                    $(".layer").fadeOut();
                    $(".popup").fadeOut();
                    var key = $(".control-name").val();
                    var value = $(".control-description").val();
                    if ($that.length > 0) {
                        $that.parents(".ziyuanpeizhi-item").find(".name-value").html(value);
                    }

                    if(key == "名称" && node != null) {
                        node.text = value;
                        node.jsonExpress.name = value;
                        node.configuration.resourceAllocation["名称"] = value;
                        node.jsonExpress.configuration.resourceAllocation["名称"] = value;
                    }else{
                        if(key in node.jsonExpress.configuration.resourceAllocation){
                            node.jsonExpress.configuration.resourceAllocation[key] = value;
                        }else{
                            node.jsonExpress.configuration.advancedOptions[key] = value;
                        }
                    }
                });
            });

            $(".icon-x").on("click", function(){
                $(".layer").fadeOut();
                $(".popup").fadeOut();
            });

            $(".cancel").on("click", function(){
                $(".layer").fadeOut();
                $(".popup").fadeOut();
            });

        };

        /*节点右键生成菜单,点击左键菜单消失*/
        api.handle = function(event, left, top) {
            if (event.button == 2) {
                $("#contextmenu").css({
                    left: left + 15,
                    top: top + 10
                }).show();
            }else{
            }
        };

        /*点击鼠标左键操作菜单消失*/
        api.contextmenuHide = function(stage){
            stage.addEventListener('click', function (event) {
                if (event.button == 0) {
                    $("#contextmenu").hide();
                }else{
                }
            })
        };

        /*实现递归获取当前节点的子节点*/
        api.recusion = function(node){
            if(node.children){

            }else{
                return node;
            }
        };

        /*根据节点resourceName返回type*/
        api.getType = function(resourceName){
            var type = 0;

            switch(resourceName){
                case "基础网络":
                    type = 1;
                    break;
                case "私有网络":
                    type = 2;
                    break;
                case "主机":
                    type = 3;
                    break;
                case "硬盘":
                    type = 4;
                   break;
                case "NAS":
                    type = 5;
                    break;
                default:
                    type = 0;
            }
            return type;
        }

        /*当增加节点时,选中的节点解析到jsonResult中*/
        api.jsonParse = function(baseNetwork, selectedNode, newNode, jsonResult){
            var jsonResult = jsonResult;
            if(baseNetwork != null && selectedNode == null && newNode){
                    newNode.jsonExpress = {
                        id:  newNode.id,
                        type: newNode.type,
                        name: newNode.text,
                        resourceName: newNode.resourceName,
                        x: newNode.x,
                        y: newNode.y,
                        configuration: newNode.configuration,
                        node: newNode
                    };
                    if(newNode.type == 2 || newNode.type == 3){
                        newNode.jsonExpress.children = [];
                    };
                    baseNetwork.jsonExpress.children.push(newNode.jsonExpress);
            }else if(selectedNode && newNode){
                newNode.jsonExpress = {
                    id:  newNode.id,
                    type: newNode.type,
                    name: newNode.text,
                    resourceName: newNode.resourceName,
                    x: newNode.x,
                    y: newNode.y,
                    configuration: newNode.configuration,
                    node: newNode
                };
                if(newNode.type == 2 || newNode.type == 3){
                    newNode.jsonExpress.children = [];
                }

                selectedNode.jsonExpress.children.push(newNode.jsonExpress);
            }
            return jsonResult;
        };

        /*删除指定节点及其子节点的json*/
        api.modifyJsonResult = function(id, children){
            for(var i = 0; i < children.length; i++){
                if(children[i].id.toString().indexOf(id) != -1){
                   children.splice(i, 1);
                   break;
                }else{
                    arguments.callee(id, children[i].children);
                }
            };
        }

        /*鼠标右键应用模板*/
        api.tooltipShow = function(target){
            var left = api.getLeft(target);
            var top = api.getTop(target) + 25;
            var $tooltip = $("<div></div>");
            $tooltip.css({
                "display" : "block",
                "position": "absolute",
                "left": left + "px",
                "top": top + "px",
                "width": "100px",
                "height": "auto",
                "border": "1px solid #CCC",
                "border-radius": "1px",
                "background-color": "#FFF",
                "color": "#4d4d4d",
                "boxShadow": "0 0 0 1px #CCC",
                "word-wrap": "break-word",
                "z-index": "1001",
                "cursor": "pointer",
                "text-align": "center"
            });
            var lis = $("<ul style='margin-bottom: 0px;'><li class='tooltip-li'>应用模板</li><li class='tooltip-li tooltip-cancel'>取消</li></ul>");
            $tooltip.append(lis);
            $tooltip.addClass("tooltip-d");
            $(document.body).append($tooltip);

            $(".tooltip-cancel").click(function(){
                $(".tooltip-d").remove();
            });
        }

        //tooltip消失
        api.tooltipDis = function(){
            $(".tooltip-d").remove();
        };

        return api;
    }
});
