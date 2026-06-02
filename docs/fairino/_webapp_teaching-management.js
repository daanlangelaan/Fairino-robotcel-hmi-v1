angular
    .module('frApp')
    .controller('teachingmanagementCtrl', ['$scope', '$window', 'dataFactory', 'toastFactory', 'testDataService', teachingmanagementCtrlFn])

function teachingmanagementCtrlFn($scope, $window, dataFactory, toastFactory, testDataService) {
    // È°µÈù¢Ê?æÁ§∫Ë??Â?¥‰øÆÊ?π
    $scope.quitSetMounting();
    $scope.fullContentView();
    $scope.switchVirtualFunc(0);
    /* ‰æùÊçÆÁ≥ªÁª?ËØ≠Ë®?Ë?∑Âè?ÂØπÂ∫?Á??ËØ≠Ë®?Â??Âè?ÂΩ?Â?çÈ°µÈù¢Â?ùÂß?Â?? */
    let tmDynamicTags;
    tmDynamicTags = langJsonData.teaching_management;
    /* Â?ùÂß?Â?? */
    getToolCoordData();
    getExToolCoordData();
    getWObjCoordData();
    handlePointTableName();
    /* ./Â?ùÂß?Â?? */
    let logDynamicTags;
    logDynamicTags = langJsonData.log;
    // Â??È°µ‚??‚??‰∏?Ê??È??Ê?©‰∏?È°µÂ±?Á§∫Â§?Â∞?Êù°
    $scope.pageSelect = logDynamicTags.var_object.pageSelect;
    
    // ÂΩ?Â?çÈ°µ
    $scope.currentPageNum = 1;
    // Ë∑≥ËΩ¨Ë?≥Â§?Â∞?È°µÁ??ÂΩ?Â?çÈ°µ
    $scope.currentInputPageNum = 1;
    // Ê?ªÈ°µÊ?∞
    $scope.pageNumTotal;
    // Â??È°µÁ?πÂ?ª/Ë∑≥ËΩ¨Á??Â±?Á§∫È°π
    $scope.paginationSize;
    // Êê?Á¥¢Ê°?Â??È?ÆÈ¢?ÊèêÁ§∫
    $scope.placeholderTip = tmDynamicTags.info_messages[6];
    $scope.coverPointParam = {
        name: null,
        flag: 1
    };
    // ÊØèÈ°µÊ?æÁ§∫Â§?Â∞?Êù°(Ê?†Áº?Â≠?Ê?∞ÊçÆÊ?∂Ôº?Èª?ËÆ§Ê?æÁ§∫10Êù°/È°µ)
    if (localStorage.getItem("pointPageSizeValue")) {
        $scope.pageSize = $scope.pageSelect.find(item => item.value == localStorage.getItem("pointPageSizeValue"));
    } else {
        $scope.pageSize = $scope.pageSelect[0];
    }
    // Ê∑ªÂ?†Ê??È?Æ
    /* ÊØèÊ¨°‰øÆÊ?πÁ§∫Ê??Á?πÂê?Â?∑Ê?∞Ê?∞ÊçÆ */
    function refreshTable() {
        setInterval(() => {
            if(g_refreshTableFlag){
                g_refreshTableFlag = 0;
                $("#teachrefreshpoint").click();
            }
        }, 1000);
    }
    refreshTable();

    //Á§∫Ê??Á?πÊê?Á¥¢
    $scope.searchPointName = function () {
        $scope.currentPageNum = 1;//ÊØèÊ¨°Êê?Á¥¢Ê?∂Ôº?‰ª?Á¨¨‰∏?È°µÂº?Âß?Ê?•ËØ¢
        let searchPointTableName = document.getElementById("pointNameFind").value;
        const pattern = new RegExp(searchPointTableName, 'i');//‰∏çÂ?∫Â??Â§ßÂ∞èÂ??
        $scope.tmpPointTableData = [];
        $scope.optionsData.forEach(item => {
            if (pattern.test(item.name) || pattern.test(item.toolnum) || pattern.test(item.workpiecenum) || pattern.test(item.speed)) {
                $scope.tmpPointTableData.push(item);
            }
        })
        $scope.displayPointsData = $scope.tmpPointTableData;
        getPageSize($scope.currentPageNum);
    }

	// Ë?∑Âè?Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    function getToolCoordData() {
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.ToolCoordeData = JSON.parse(JSON.stringify(data));
            $scope.toolCoordeTotal = JSON.parse(JSON.stringify(data)).length;
            getOptionsData();
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[0]);
            /* test */
            if (g_testCode) {
                $scope.ToolCoordeData = JSON.parse(JSON.stringify(testDataService.testToolCoordeData));
                $scope.toolCoordeTotal = JSON.parse(JSON.stringify(testDataService.testToolCoordeData)).length;
                getOptionsData();
            }
            /* ./test */
        });
    };

    /** Ë?∑Âè?Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ*/
    function getExToolCoordData() {
        let getCmd = {
            cmd: "get_ex_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.exToolCoordeData = JSON.parse(JSON.stringify(data));
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.exToolCoordeData = JSON.parse(JSON.stringify(testDataService.testExToolCoordeData));
            }
            /* ./test */
        });
    }

    // Ë?∑Âè?Â∑•‰ª∂ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    function getWObjCoordData() {
        let getCmd = {
            cmd: "get_wobj_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.WObjCoordeData = JSON.parse(JSON.stringify(data));
            hidePageLoading();
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[1]);
            hidePageLoading();
            /* test */
            if (g_testCode) {
                $scope.WObjCoordeData = JSON.parse(JSON.stringify(testDataService.testWobjCoordeData));
            }
            /* ./test */
        });
    };

    /**
     * Á?πÂ?ªÊ??Âê?‰∏?Â??Â?∫ÂÆ?Á??tdÊ?∂Ôº?È?çÁΩÆÊ??Ê??tdÁ??z-index‰∏∫1.Âê¶Â??dropdown-menuÊ?†Ê≥?Ê?æÁ§∫
     * @param {String} pointName tdÊ??Â?®Ë°?Á??Á?πÂêçÁß∞Ôº?‰∏çË?ΩÁ?®indexÂÅ?È?ÆÂ?º
     */
    $scope.setDropdownMenuZIndex = function(pointName) {
        let dropdownTdList = document.querySelectorAll('tbody td.operate');
        dropdownTdList.forEach(item => {
            item.style.zIndex = 1;
        });
        document.getElementById(`operate${pointName}`).style.zIndex = 2;
    }

    // Ë?∑Âè?Á§∫Ê??Á?πÊ?∞ÊçÆ
    function getOptionsData() {
        let getCmd = {
            cmd: "get_points",
        };
        dataFactory.getData(getCmd).then((data) => {
            let pointNameArr = Object.keys(data);
            pointNameArr.forEach(function (item, i) {
                if (data[pointNameArr[i]].toolnum < $scope.toolCoordeTotal) {
                    data[pointNameArr[i]].toolnum = $scope.ToolCoordeData[data[pointNameArr[i]].toolnum].name;        
                } else {
                    data[pointNameArr[i]].toolnum = data[pointNameArr[i]].toolnum - $scope.toolCoordeTotal;
                    data[pointNameArr[i]].toolnum = tmDynamicTags.info_messages[4] + data[pointNameArr[i]].toolnum;  
                };
                data[pointNameArr[i]].workpiecenum = tmDynamicTags.info_messages[5] + data[pointNameArr[i]].workpiecenum;
            });
            $window.displayoptionsData = JSON.parse(JSON.stringify(data));
            let array = [];
            pointNameArr.forEach(function (item, i) {
                array.push(data[item]);
            })
            $scope.optionsData = array;
            //$scope.displayPointsData = data;
            $scope.searchPointName();
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[2]);
            /* test */
            if (g_testCode) {
                let data = JSON.parse(JSON.stringify(testDataService.testLimitPointData));
                let pointNameArr = Object.keys(testDataService.testLimitPointData);
                pointNameArr.forEach(function (item, i) {
                    if (data[pointNameArr[i]].toolnum < $scope.toolCoordeTotal) {
                        data[pointNameArr[i]].toolnum = $scope.ToolCoordeData[data[pointNameArr[i]].toolnum].name;        
                    } else {
                        data[pointNameArr[i]].toolnum = data[pointNameArr[i]].toolnum - $scope.toolCoordeTotal;
                        data[pointNameArr[i]].toolnum = tmDynamicTags.info_messages[4] + data[pointNameArr[i]].toolnum;  
                    };
                    data[pointNameArr[i]].workpiecenum = tmDynamicTags.info_messages[5] + data[pointNameArr[i]].workpiecenum;
                });
                $window.displayoptionsData = JSON.parse(JSON.stringify(data));
                let array = [];
                pointNameArr.forEach(function (item, i) {
                    array.push(data[item]);
                })
                $scope.optionsData = array;
                $scope.searchPointName();
            }
            /* ./test */
        });
    };

    function getOptionsData2() {
        let getCmd = {
            cmd: "get_points",
        };
        dataFactory.getData(getCmd).then((data) => {
            let pointNameArr = Object.keys(data);
            pointNameArr.forEach(function (item, i) {
                if (data[pointNameArr[i]].toolnum < $scope.toolCoordeTotal) {
                    data[pointNameArr[i]].toolnum = $scope.ToolCoordeData[data[pointNameArr[i]].toolnum].name;        
                } else {
                    data[pointNameArr[i]].toolnum = data[pointNameArr[i]].toolnum - $scope.toolCoordeTotal;
                    data[pointNameArr[i]].toolnum = tmDynamicTags.info_messages[4] + data[pointNameArr[i]].toolnum;  
                };
                data[pointNameArr[i]].workpiecenum = tmDynamicTags.info_messages[5] + data[pointNameArr[i]].workpiecenum;
            });
            $window.displayoptionsData = JSON.parse(JSON.stringify(data));
            let array = [];
            pointNameArr.forEach(function (item, i) {
                array.push(data[item]);
            })
            $scope.optionsData = array;
            //$scope.displayPointsData = data;
            $scope.searchPointName();
            
        }, (status) => {
            toastFactory.error(status);
        });
    };

    $scope.deleteItemsArray = [];
    $scope.setAllCbs = function () {
        let cbMain = document.getElementById("cbMain");
        let cbItems = document.getElementsByName("cbItem");
        if (cbMain.checked == false) {
            cbItems.forEach(function (item, index, arr) {
                item.checked = false;
            });
            $scope.deleteItemsArray = [];
        } else {
            $scope.deleteItemsArray = [];
            cbItems.forEach(function (item, index, arr) {
                item.checked = true;
                if (item.id == 'cbItemseamPos' || item.id == 'cbItemCurrentPos' || item.id == 'cbItemcvrCatchPoint' || item.id == 'cbItemcvrRaisePoint') {
                    item.checked = false;
                    return;
                }
                $scope.deleteItemsArray = $scope.deleteItemsArray.concat($scope.displayPointsData[index].name);
            });
        };
    };
    
    $scope.clickCbItem = function (index, pointName) {
        let cbItem = document.getElementById("cbItem" + pointName);
        if(cbItem.checked == true) {
            $scope.deleteItemsArray.push(pointName);
        } else {
            $scope.deleteItemsArray.forEach(function (item, index, arr) {
                if(item == pointName) {
                    arr.splice(index, 1);
                };
            });
        };
        $scope.deleteItemsArray = [...(new Set($scope.deleteItemsArray))]; // Ê?∞Áª?Â?ªÈ?ç
    };

    // Ê†πÊçÆÊ?∞ÊçÆÊ?ªÊù°Ê?∞ËÆ°ÁÆ?Ê?æÁ§∫È°µÁ†Å
    function getPageSize(currentPageNumVlaue) {  
        $scope.deleteItemsArray = []; 
        let cbMain = document.getElementById("cbMain");
        let cbItems = document.getElementsByName("cbItem");
        cbMain.checked = false; //Ê∏?È?§Â?æÈ??Ê°?
        cbItems.forEach(item => {
            item.checked = false;
        });

        if ($scope.displayPointsData) {
            $scope.pageTotal = $scope.displayPointsData.length;
            $scope.recordPointTableList = $scope.displayPointsData.slice((currentPageNumVlaue - 1) * $scope.pageSize.value, currentPageNumVlaue * $scope.pageSize.value);
        } else {
            $scope.pageTotal = 0;
        }
        $scope.pageNumTotal = Math.ceil($scope.pageTotal / $scope.pageSize.value);
        $scope.paginationSize = [];
        if (8 > $scope.pageNumTotal) {
            // ÂΩ?Ë°®Ê†ºÊ?ªÈ°µÊ?∞Â∞è‰∫?Á≠?‰∫?‰∏?Êù°Ê?∂
            if ($scope.pageNumTotal > 1) {
                for (let i = 2; i < $scope.pageNumTotal; i++) {
                    $scope.paginationSize.push(i);
                }   
            }
        } else if ($scope.pageNumTotal > 7) {
            // ÂΩ?Ë°®Ê†ºÊ?∞ÊçÆÂ§ß‰∫?‰∏?Êù°Ê?∂
            if (currentPageNumVlaue < 6) {
                // ÂΩ?Â?çÈ°µÁ†ÅÊ?∞ÊçÆÂ∞è‰∫?‰∏?Ê?∂Ôº?Âè™È??Ë¶ÅÊ?æÁ§∫Â?çÂ?≠‰ΩçË∑≥ËΩ¨Ê?∞
                for (let i = 2; i < 7; i++) {
                    $scope.paginationSize.push(i);
                }
            } else if (currentPageNumVlaue > Number($scope.pageNumTotal) - 5) {
                // ÂΩ?Â?çÈ°µÁ†ÅÊ?∞ÊçÆÊØ?Ë°®Ê†ºÊ?ªÊ?∞Â∞è6‰ª•Â??Ê?∂Ôº?Âè™È??Ë¶ÅÊ?æÁ§∫Âê?Â?≠‰ΩçË∑≥ËΩ¨Ê?∞
                for (let i = Number($scope.pageNumTotal) - 5; i < $scope.pageNumTotal; i++) {
                    $scope.paginationSize.push(i);
                }
            } else {
                // ÂΩ?Â?çÈ°µÁ†ÅÁ¨¨‰∏?‰ΩçÂ?∞Â??Ê?∞Âê?Â?≠‰Ωç‰π?È?¥
                for (let i = Number(currentPageNumVlaue) - 2; i < Number(currentPageNumVlaue) + 3; i++) {
                    $scope.paginationSize.push(i);
                }
            }
        }
    }

    // È?êË?èÈ°µÁ†ÅÁ??ÁßªÂ?•ÁßªÂ?∫Â??ÂÆπÊ?πÂè?
    document.getElementById('page-less').onmouseover = function() {
        document.getElementById('page-less').innerHTML = "<<";
    }
    document.getElementById('page-less').onmouseout = function() {
        document.getElementById('page-less').innerHTML = "‚?¢‚?¢‚?¢";
    }
    document.getElementById('page-more').onmouseover = function() {
        document.getElementById('page-more').innerHTML = ">>";
    }
    document.getElementById('page-more').onmouseout = function() {
        document.getElementById('page-more').innerHTML = "‚?¢‚?¢‚?¢";
    }

    // ÂΩ?Â?çÈ°µÁ†ÅË∑≥ËΩ¨
    $scope.pageJumpStep = function(type, currentPageNumVlaue) {
        if ((currentPageNumVlaue == 1 && type == 'prev') || (currentPageNumVlaue == $scope.pageNumTotal && type == 'next')) return;
        switch (type) {
            // Á?πÂ?ªË∑≥ËΩ¨‰∏?‰∏?È°µ
            case 'prev':
                if (currentPageNumVlaue > 1) {
                    $scope.currentPageNum = Number(currentPageNumVlaue) - 1;
                } else {
                    $scope.currentPageNum = 1;
                }
                break;
            // Á?πÂ?ªË∑≥ËΩ¨‰∏?‰∏?È°µ
            case 'next':
                if (currentPageNumVlaue < $scope.pageNumTotal) {
                    $scope.currentPageNum = Number(currentPageNumVlaue) + 1;
                } else {
                    $scope.currentPageNum = $scope.pageNumTotal;
                }
                break;
            // Á?πÂ?ªË∑≥ËΩ¨Ê??ÂÆ?È°µ
            case 'specify':
                $scope.currentPageNum = currentPageNumVlaue;
                break;
            case 'more':
                $scope.currentPageNum = currentPageNumVlaue + 5 > $scope.pageNumTotal ? $scope.pageNumTotal : currentPageNumVlaue + 5;
                break;
            case 'less':
                $scope.currentPageNum = currentPageNumVlaue - 5 > 1 ? currentPageNumVlaue - 5 : 1;
                break;
            default:
                break;
        }
        $scope.currentInputPageNum = $scope.currentPageNum;
        getPageSize($scope.currentPageNum);
    };

    // ÂΩ?Â?çÈ°µÁ†ÅÊ?πÂè?Ôº?inputËæ?Â?•Ê°?Â§±Â?ªÁ?¶Á?π
    $scope.currentPageNumChange = function(value) {
        $scope.currentPageNum = Number(value);
        getPageSize($scope.currentPageNum);
    }

    /* EnterÈ?ÆÁª?ÂÆ? */
    // ÂΩ?Â?çÈ°µÁ†ÅÊ?πÂè?Ôº?È?ÆÁ??Á??enter
    $(function () {
        $('#currentPageNum').keydown(function (event) {
            if (event.keyCode == 13) {
                $scope.currentPageNum = Number($scope.currentInputPageNum);
                getPageSize($scope.currentPageNum);
                $scope.$apply();
            }
        });
    })
    /* EnterÈ?ÆÁª?ÂÆ? */

    // ‰∏?È°µÊ?æÁ§∫Â§?Â∞?Êù°Ê?πÂè?
    $scope.pageSelectChange = function() {
        $scope.currentPageNum = 1;
        $scope.currentInputPageNum = 1;
        getPageSize($scope.currentPageNum);
        localStorage.setItem("pointPageSizeValue", $scope.pageSize.value);
    }

    /**Ëø?Â?•Á§∫Ê??ÁÆ°Áê?È°µÈù¢Ê?∂Á?π‰ΩçË°®ÂêçÈ?çÁΩÆ */
    function handlePointTableName() {
        if (g_appliedPointTableName != undefined) {
            localStorage.setItem("pointTableName",g_appliedPointTableName);
        }
        let data = localStorage.getItem("pointTableName");
        if (data) {
            $scope.pointTableFlag = 1;
            $scope.pointTableName = data;
            $scope.selectedPointTable = data;
            getPointTableList();
        } else {
            $scope.pointTableFlag = 0;
        }
    }

    /*** Ë?∑Âè?Á?π‰ΩçË°®Â??Ë°®*/
    function getPointTableList() {
        let getPointTableListCmd = {
            cmd: "get_point_table_list"
        };
        dataFactory.getData(getPointTableListCmd).then((data) => {
            $scope.pointTableList = JSON.parse(JSON.stringify(data));
            toastFactory.success(tmDynamicTags.success_messages[5]);
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[8]);
            /* test */
            if (g_testCode) {
                $scope.pointTableList = ["point_table_1.db","point_table_2.db","point_table_3.db"];
                $scope.pointTableName = $scope.pointTableList[0];
            }
            /* ./test */
        });
    }

    /**
     * Â??Âª∫Á?π‰ΩçË°®
     * @param {string} name Ê??‰ª∂ÂêçÁß∞
     */
    $scope.createPointTable = function(name) {
        if (!name) {
            toastFactory.info(tmDynamicTags.info_messages[8]);
            return;
        }

        let nameData = "point_table_" + name + ".db";
        if ($scope.pointTableList.findIndex(item => item == nameData) != -1) {
            toastFactory.info(tmDynamicTags.info_messages[11]);
            return;
        }

        let createPointTableCmd = {
            cmd: "create_point_table",
            data: {
                name: nameData
            }
        };
        dataFactory.actData(createPointTableCmd).then(() => {
            $('#addPointTableModal').modal('hide');
            getPointTableList();
            toastFactory.success(tmDynamicTags.success_messages[6]);
        }, (status) => {
            $('#addPointTableModal').modal('hide');
            toastFactory.error(status, tmDynamicTags.error_messages[9]);
        });
    }

    /**
     * Â?†È?§Á?π‰ΩçË°®
     * @param {array} array Ê??‰ª∂ÂêçÁß∞Â??Ë°®
     */
    let deleteFlag = 0; // Â?†È?§Ê†?Âø?Ôº?È??Ë¶ÅÂ?†È?§Á°ÆËÆ§
    $scope.removePointTable = function(array) {
        if (!array) {
            toastFactory.info(tmDynamicTags.info_messages[7]);
            return;
        }
        if ($scope.selectedPointTable == $scope.pointTableName) {
            toastFactory.info(tmDynamicTags.info_messages[12]);
            return;
        }
        if (deleteFlag == 0) {
            deleteFlag = 1;
            toastFactory.info(tmDynamicTags.info_messages[9]);
            return;
        }

        let removePointTableCmd = {
            cmd: "remove_point_table",
            data: {
                name: [array]
            }
        };
        dataFactory.actData(removePointTableCmd).then(() => {
            deleteFlag = 0;
            if ($scope.pointTableName == $scope.selectedPointTable) {
                $scope.pointTableName = '';
            }
            getPointTableList();
            toastFactory.success(tmDynamicTags.success_messages[7]);
        }, (status) => {
            deleteFlag = 0;
            toastFactory.error(status, tmDynamicTags.error_messages[10]);
        });
    }

    /**
     * Á?π‰ΩçË°®È?çÂ?ΩÂêç
     * @param {string} newName Ê?∞Ê??‰ª∂ÂêçÁß∞
     * @param {string} oldName Ê?ßÊ??‰ª∂ÂêçÁß∞
     */
    $scope.renamePointTable = function(newName, oldName) {
        if (!newName) {
            toastFactory.info(tmDynamicTags.info_messages[8]);
            return;
        }

        let newData = "point_table_" + newName + ".db";
        if ($scope.pointTableList.findIndex(item => item == newData) != -1) {
            toastFactory.info(tmDynamicTags.info_messages[11]);
            return;
        }

        let renamePointTableCmd = {
            cmd: "rename_point_table",
            data: {
                newname: newData,
                oldname: oldName
            }
        };
        dataFactory.actData(renamePointTableCmd).then(() => {
            $('#renamePointTableModal').modal('hide');
            getPointTableList();
            toastFactory.success(tmDynamicTags.success_messages[8]);
        }, (status) => {
            $('#renamePointTableModal').modal('hide');
            toastFactory.error(status, tmDynamicTags.error_messages[11]);
        });
    }

    /**
     * Â∫?Á?®Á?π‰ΩçË°®
     * @param {string} name Â∫?Á?®Á??Á?π‰ΩçË°®ÂêçÁß∞
     */
    $scope.applyPointTable = function(name) {
        let sendContent;
        if (!name && $scope.pointTableFlag == 1) {
            toastFactory.info(tmDynamicTags.info_messages[7]);
            return;
        } else if ($scope.pointTableFlag == 0) {
            sendContent = "PointTableSwitch('')";
            $('#enterSystemModeModal').modal('hide');
        } else {
            if ($scope.selectedPointTable == $scope.pointTableName) {
                toastFactory.info(tmDynamicTags.info_messages[14]);
                return;
            }
            sendContent = "PointTableSwitch('" + name + "')";
        }

        let applyPointTableCmd = {
            cmd: 844,
            data: {
                content: sendContent
            }
        };
        dataFactory.setData(applyPointTableCmd).then(() => {
            $('#pageLoading').css({display: 'block'});
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[12]);
        });
    }
    document.getElementById('teachingManagement').addEventListener('table_name', e => {
        $('#pageLoading').css({display: 'none'});
        let pointTableNameData = e.detail;
        if (pointTableNameData.current) {
            //Á≥ªÁª?Ê®°Âºè -> Á?π‰ΩçË°®Ê®°Âºè / Á?π‰ΩçË°®Ê®°Âºè‰π?È?¥Â??Êç¢
            $scope.pointTableName = pointTableNameData.current;
            localStorage.setItem("pointTableName",pointTableNameData.current);
        }
        getOptionsData();
    })

    /**Âè?Ê∂?Â??Êç¢Á≥ªÁª?Ê®°Âºè */
    $scope.cancelSwitchSystemMode = function() {
        $scope.pointTableFlag = 1;
        $scope.lastPointTableFlag = $scope.pointTableFlag;
    }

    /**ÂØºÂ?∫Á?π‰ΩçË°®Ê?∞ÊçÆ */
    $scope.exportPointTable = function() {
        if (!$scope.selectedPointTable) {
            toastFactory.info(tmDynamicTags.info_messages[7]);
            return;
        }
        dataFactory.downloadData(`${$scope.selectedPointTable.split('.')[0]}.db`, "pointTable");
    }

    /**ÂØºÂ?•Á?π‰ΩçË°®Ê?∞ÊçÆ */
    $scope.importPointTable = function() {
        var formData = new FormData();
        var file = document.getElementById("pointTableImported").files[0];
        if (null == file) {
            toastFactory.info(tmDynamicTags.info_messages[2]);
            return;
        }
        if (file.name.indexOf(".db") == -1 || file.name.substring(0, 12) != 'point_table_') {
            toastFactory.info(tmDynamicTags.warning_messages[10]);
            return;
        }
        formData.append('file', file);
        dataFactory.uploadData(formData).then((data) => {
            if (typeof(data) != "object") {
                if ($scope.selectedPointTable == $scope.pointTableName) {
                    getOptionsData();
                }
                getPointTableList();
                $("#importPointTableModal").modal('hide');
                toastFactory.success(tmDynamicTags.success_messages[3] + file.name);
            }
        }, (status) => {
            $("#importPointTableModal").modal('hide');
            toastFactory.error(status, tmDynamicTags.error_messages[6]);
        });
    }

    /**
     * ‰øÆÊ?πÁ§∫Ê??Á?π‰ø°ÊÅØ
     * @param {Object} pointItem 
     */
    $scope.clickmodItem = function (pointItem) {
        let toolItemParams;
        // Â∑•Â?∑ÂùêÊ†?Á≥ª
        const toolItem = $scope.ToolCoordeData.find(element => element.name == pointItem.toolnum);
        // Â∑•Â?∑ÂùêÊ†?Á≥ªÂ??Âê´Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªÔº?ÂΩ?toolnumÊ?∞Â?ºË∂?Ëø?Â∑•Â?∑ÂùêÊ†?Á≥ªÁ??‰∏™Ê?∞Ê?∂‰∏∫Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ª
        if ($scope.toolCoordeTotal &&  $scope.toolCoordeTotal >= toolItem.id) {
            // Â∑•Â?∑ÂùêÊ†?Á≥ª
            toolItemParams = `${toolItem.x},${toolItem.y},${toolItem.z},${toolItem.rx},${toolItem.ry},${toolItem.rz}`;
        } else {
            // Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ª
            const extoolId = pointItem.toolnum.split(tmDynamicTags.info_messages[4])[1];
            toolItem = $scope.exToolCoordeData[`etoolcoord${extoolId}`];
            toolItemParams = `${toolItem.ex},${toolItem.ey},${toolItem.ez},${toolItem.erx},${toolItem.ery},${toolItem.erz}`;
        }
        const workpieceId = pointItem.workpiecenum.split(tmDynamicTags.info_messages[5])[1];
        const workpieceItem = $scope.WObjCoordeData[`wobjcoord${workpieceId}`];
		const oldPoint = $window.displayoptionsData[pointItem.name];
        if (oldPoint.x == pointItem.x && oldPoint.y == pointItem.y && oldPoint.z == pointItem.z && oldPoint.rx == pointItem.rx && oldPoint.ry == pointItem.ry && oldPoint.rz == pointItem.rz) {
            if (oldPoint.speed == pointItem.speed) {
                toastFactory.info(tmDynamicTags.info_messages[1]);
            } else {
                $window.modPoint = JSON.parse(JSON.stringify(pointItem));
                $window.modPoint.toolnum = toolItem.id;
                $window.modPoint.workpiecenum = workpieceId;
                startModifYPoint();
            }
        } else {
            var commputePointStr = pointItem.j1 + "," + pointItem.j2 + "," + pointItem.j3 + "," + pointItem.j4 + "," + pointItem.j5 + "," + pointItem.j6 + ","
                + pointItem.x + "," + pointItem.y + "," + pointItem.z + "," + pointItem.rx + "," + pointItem.ry + "," + pointItem.rz + "," + toolItem.id + ","
                + toolItemParams + "," + workpieceId + "," + workpieceItem.x + "," + workpieceItem.y + "," + workpieceItem.z + "," + workpieceItem.rx + "," 
                + workpieceItem.ry + "," + workpieceItem.rz + "," + pointItem.E1 + "," + pointItem.E2 + "," + pointItem.E3 + "," + pointItem.E4;
            let commputePointCmd = {
                cmd: 380,
                data: {
                    content: "ModifyTeachPoint(" + commputePointStr + ")",
                },
            };
            dataFactory.setData(commputePointCmd).then(() => {
            }, (status) => {
                toastFactory.error(status, tmDynamicTags.error_messages[3]);
            });
            $window.modPoint = JSON.parse(JSON.stringify(pointItem));
            $window.modPoint.toolnum = toolItem.id;
            $window.modPoint.workpiecenum = workpieceId;
        }
    };

    //Ë?∑Âè?Á§∫Ê??Á?πËÆ°ÁÆ?Ê?∞ÊçÆ
    document.getElementById('teachingManagement').addEventListener('380', e => {
        if (g_modifyPointFlag) {
            g_modifyPointFlag = 0;
            temparr = JSON.parse(e.detail);
			$window.modPoint.j1 = parseFloat(temparr.j1).toFixed(3);
			$window.modPoint.j2 = parseFloat(temparr.j2).toFixed(3);
			$window.modPoint.j3 = parseFloat(temparr.j3).toFixed(3);
			$window.modPoint.j4 = parseFloat(temparr.j4).toFixed(3);
			$window.modPoint.j5 = parseFloat(temparr.j5).toFixed(3);
			$window.modPoint.j6 = parseFloat(temparr.j6).toFixed(3);
			startModifYPoint();
        }
    });

    //‰øÆÊ?πÁ§∫Ê??Á?π‰ø°ÊÅØ
	function startModifYPoint(){
        if("1" != $scope.controlMode){
            toastFactory.warning(tmDynamicTags.warning_messages[7]);
            return;
        }
        let savePointCmd = {
            cmd: "modify_point",
            data: $window.modPoint,
        };
        dataFactory.actData(savePointCmd).then(() => {
            toastFactory.success(tmDynamicTags.success_messages[1] + $window.modPoint.name + tmDynamicTags.success_messages[2]);
            getOptionsData2();
        }, (status) => {
            toastFactory.error(status, tmDynamicTags.error_messages[4] + $window.modPoint.name + tmDynamicTags.error_messages[5]);
        });
    };

    $('#btnImportPoints').click(function () {
        // Ê∏?Á©∫Ê??‰ª∂Â??ÂÆπ
        var importPointsHtml = document.getElementById("pointsImported");
        importPointsHtml.value = '';
        // Ê??Âº?Ê®°Ê?ÅÁ™?
        $('#importPointsModal').modal('show');
    });

    $('#btnImportPointTable').click(function () {
        // Ê∏?Á©∫Ê??‰ª∂Â??ÂÆπ
        var importPointTableHtml = document.getElementById("pointTableImported");
        importPointTableHtml.value = '';
        // Ê??Âº?Ê®°Ê?ÅÁ™?
        $('#importPointTableModal').modal('show');
    });

    /**Ê?∞Â¢?Á?π‰ΩçË°® */
    $scope.addTableName = function() {
        $('#addPointTableModal').modal('show');
        $scope.addPointTableContent = '';
    }

    /**È?çÂ?ΩÂêçÁ?π‰ΩçË°®ÂêçÁß∞ */
    $scope.renameTableName = function() {
        //Ê?™Â∫?Á?®Á?π‰ΩçË°®Ê?†Ê≥?Ê?πÂêç
        if (!$scope.selectedPointTable) {
            toastFactory.info(tmDynamicTags.info_messages[2]);
            return;
        }
        if ($scope.selectedPointTable == $scope.pointTableName) {
            toastFactory.info(tmDynamicTags.info_messages[13]);
            return;
        }
        $scope.renamePointTableContent = $scope.selectedPointTable.split('.')[0].split('_')[2];
        $('#renamePointTableModal').modal('show');
    }

    /**È??Ê?©Á?π‰ΩçÊ®°Âºè 0-Á≥ªÁª?Ê®°Âºè 1-Á?π‰ΩçË°®Ê®°Âºè */
    $scope.changePointMode = function() {
        if ($scope.lastPointTableFlag == $scope.pointTableFlag) return;
        $scope.lastPointTableFlag = $scope.pointTableFlag;
        if ($scope.pointTableFlag == 0) {
            if (g_appliedPointTableName == '') {
                getOptionsData(); // Ê?™Â∫?Á?®Á?π‰ΩçË°®Â??Â??Á≥ªÁª?Ê®°Âºè‰∏çÈ??Ë¶ÅÊèêÁ§∫
            } else {
                $('#enterSystemModeModal').modal('show');
            }
        } else {
            $scope.pointTableName = '';
            $scope.selectedPointTable = '';
            $scope.displayPointsData = [];
            getPageSize($scope.currentPageNum);
            getPointTableList();
        }
        let cbMain = document.getElementById("cbMain");
        cbMain.checked = false; //Ê∏?È?§Â?®È??Â?æÈ??Ê°?
    }

    /**ÂØºÂ?•Á§∫Ê??Á?πÊ??‰ª∂ */
    $scope.submitPoints = function () {
        var formData = new FormData();
        var file = document.getElementById("pointsImported").files[0];
        if(null == file){
            toastFactory.info(tmDynamicTags.info_messages[2]);
            return;
        } else if("web_point.db" != file.name){
            toastFactory.warning(tmDynamicTags.warning_messages[9]);
            return;
        }
        formData.append('file', file);
        dataFactory.uploadData(formData).then((data) => {
            if (typeof(data) != "object") {
                $("#importPointsModal").modal('hide');
                getOptionsData();
                toastFactory.success(tmDynamicTags.success_messages[3] + file.name);
            }
        }, (status) => {
            getOptionsData();
            toastFactory.error(status, tmDynamicTags.error_messages[6]);
        });
    };

    /**ÂØºÂ?∫Á§∫Ê??Á?πÊ??‰ª∂ */
    $scope.exportPoints = function () {
        dataFactory.downloadData("web_point.db");
    };

    // Â?†È?§Á§∫Ê??Á?π
    let deletePointFlag = false;
    $scope.deletePoints = function() {
        if (!deletePointFlag) {
            deletePointFlag = true;
            toastFactory.info(tmDynamicTags.info_messages[9]);
            return;
        }
        if ($scope.deleteItemsArray.length < 1) {
            toastFactory.info(tmDynamicTags.info_messages[3]);
            return;
        }
        let deletePointsCmd = {
            cmd: "remove_points",
            data: {
                name: $scope.deleteItemsArray
            }
        };
        $scope.deleteItemsArray = [];
        dataFactory.actData(deletePointsCmd).then(() => {
            getOptionsData();
            let cbMain = document.getElementById("cbMain");
            cbMain.checked = false;
            deletePointFlag = false;
            toastFactory.success(tmDynamicTags.success_messages[4]);
        }, (status) => {
            getOptionsData();
            toastFactory.error(status, tmDynamicTags.error_messages[7]);
        });
    };

    // Ê??Âº?Á§∫Ê??Á?πËØ¶Ê??Ê®°Ê?ÅÊ°?
    $scope.openPointDetailsModal = function(detailsItem) {
        $('#pointDetailsModal').modal('show');
        $scope.teachManagementDetails = detailsItem;
    }

    // Ê??Âº?Â∞?ÂΩ?Â?çÊ?∫Â?®‰∫∫‰ΩçÂßøË¶?Á??Â?∞Á§∫Ê??Á?π‰ΩçÂπ∂Âê?Ê≠•Ê?¥Ê?∞Â?∞Á§∫Ê??Á®?Â∫è‰∏≠Ê®°Ê?ÅÊ°?
    $scope.openCoverPointModal = function(teachingPointItem) {
        $('#pointCoverModal').modal('show');
        $scope.coverPointParam.name = teachingPointItem.name
    }

    /**
     * Â∞?ÂΩ?Â?çÊ?∫Â?®‰∫∫‰ΩçÂßøË¶?Á??Â?∞Á§∫Ê??Á?π‰ΩçÂπ∂Âê?Ê≠•Ê?¥Ê?∞Â?∞Á§∫Ê??Á®?Â∫è‰∏≠
     * @param {object} pointName ÂΩ?Â?çË¶?Á??Á??Á§∫Ê??Á?πÊ?∞ÊçÆ
     * @param {Number} coverFlag ÂΩ?Â?çË¶?Á??Á??Á§∫Ê??Á?πÊ?∞ÊçÆ
     */
    $scope.coverPoint = function(pointName, coverFlag) {
        // Ê?¥Ê?∞Á§∫Ê??Á®?Â∫èÊ?∂ÂºπÂ?∫Loading
        $('#pageLoading').css("display", "block");
        dataFactory.savePoint(pointName, coverFlag).then(() => {
            getOptionsData();
            $('#pageLoading').css("display", "none");
            $('#pointCoverModal').modal('hide');
        }, (status) => {
            $('#pageLoading').css("display", "none");
            $('#pointCoverModal').modal('hide');
        })
    }

    /**
     * Â?®Â±?Á§∫Ê??Á?πÂç?Á?πËøêË°?--PTP
     * @param {object} teachingPointItem ÂΩ?Â?çÂæ?ËøêË°?Á??Á§∫Ê??Á?πÂ??Á¥†
     */
    $scope.stepOverPointPTP = function(teachingPointItem) {
        const moveJCmd = {
            cmd: 201,
            data: {
                joints: {
                    j1: teachingPointItem.j1,
                    j2: teachingPointItem.j2,
                    j3: teachingPointItem.j3,
                    j4: teachingPointItem.j4,
                    j5: teachingPointItem.j5,
                    j6: teachingPointItem.j6
                },
                tcf: {
                    x: teachingPointItem.x,
                    y: teachingPointItem.y,
                    z: teachingPointItem.z,
                    rx: teachingPointItem.rx,
                    ry: teachingPointItem.ry,
                    rz: teachingPointItem.rz
                },
                speed: $scope.speed.toString(),
                acc: $scope.acceleration,
                ovl: "50"  // 50-150
            }
        };
        dataFactory.setData(moveJCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        })
    }

    /**
     * Â?®Â±?Á§∫Ê??Á?πÂç?Á?πËøêË°?--Lin
     * @param {object} teachingPointItem ÂΩ?Â?çÂæ?ËøêË°?Á??Á§∫Ê??Á?πÂ??Á¥†
     */
    $scope.stepOverPointLin = function(teachingPointItem) {
        const moveJCmd = {
            cmd: 203,
            data: {
                content: "MoveL('" + teachingPointItem.name + "')"
            }
        };
        dataFactory.setData(moveJCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        })
    }

    /**
     * È?çÂ?ΩÂêçÁ§∫Ê??Á?π
     * @param {object} e Á?¶Á?πÊ∂?Â§±‰∫?‰ª∂
     * @param {int} index ÂΩ?Â?çÈ°µÈù¢Ë°®Ê†ºÁ?π‰ΩçÂ∫èÂè∑
     */
    $scope.renamePoint = function (e, index) {
        let newPointName = e.currentTarget.innerText.trim();
        if ($scope.recordPointTableList[index].name != newPointName && newPointName != "") {
            let cmd = {
                cmd: "rename_point",
                data: {
                    old_name: $scope.recordPointTableList[index].name,
                    new_name: newPointName
                }
            };
            dataFactory.actData(cmd).then(() => {
                $scope.recordPointTableList[index].name = newPointName;
                getOptionsData();
                toastFactory.success(tmDynamicTags.success_messages[1] + tmDynamicTags.success_messages[2]);
            }, (status) => {
                e.currentTarget.innerText = $scope.recordPointTableList[index].name;
                toastFactory.error(status, tmDynamicTags.error_messages[13]);
            })
        } else if (newPointName == "") {
            e.currentTarget.innerText = $scope.recordPointTableList[index].name;
            toastFactory.warning(langJsonData.index.info_messages[12]);
        }
    }
}
