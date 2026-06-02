angular
    .module('frApp')
    .controller('graphicalprogrammingCtrl', ['$scope', '$window', 'dataFactory', 'toastFactory', 'liveCode', 'constantService', graphicalprogrammingCtrlFn])

function graphicalprogrammingCtrlFn($scope, $window, dataFactory, toastFactory, liveCode, constantService) {
    // é¡µé¢æ¾ç¤ºèå´ä¿®æ¹
    $scope.quitSetMounting();
    let viewFlg = 0;   //0-half,1-full
    $scope.halfBothView();
    $scope.setProgramUrdf(false);
    $scope.changeView = function () {
        if (viewFlg) {
            $scope.halfBothView();
            onresize();
            viewFlg = 0;
            $scope.graphViewFlg = 0;
            // èåæ ç¼©è¿æ¶è°æ´å³è¾¹è·
            if (g_resizeFlg) {
                $(".block-code-container").css('right',`calc(55% - 35rem + 18rem)`);
            } else {
                $(".block-code-container").css('right',`calc(55% - 35rem + 12rem)`);
            }
        } else {
            $scope.fullContentView();
            onresize();
            viewFlg = 1;
            $scope.graphViewFlg = 1;
            $(".block-code-container").css('right','0rem');
            $(".block-code-container").css('transition','none');
        }
        // åæ¢è§å¾æ¶é»è®¤å³é­ä»£ç è½¬è¯æ 
        if (codeArrowFlg) {
            codeArrowFlg = 0;
            document.getElementById("live-code-arrow").classList.toggle("live-code-arrow-clicked");
        }
    }
    liveCode.initLiveCode();
    /* ä¾æ®ç³»ç»è¯­è¨è·åå¯¹åºçè¯­è¨ååå½åé¡µé¢åå§å */
    let gpDynamicTags;
    // è·åæ°æ®æ å¿ä½ï¼åªæå¨å¨é¨æ°æ®è·åå°çæ¶åæè¿è¡blocklyåå§å
    let getPointsFlg = 0;
    let getTPDFlg = 0;
    let getSensorToolCoordFlg = 0;
    /* è·åDIOï¼AIOæ°æ® */
    let tempItem = [];
    let userData =[];
    let diOptionsArr = [];
    let toolDiOptionsArr = [];
    let doModeOptionsArr = [];
    let PauseOptionsArr = [];
    let doOptionsArr = [];
    let toolDoOptionsArr = [];
    let aiOptionsArr = [];
    let aoOptionsArr = [];
    let toolCoordOptionsArr = [];
    let toolTrsfCoordeArr = [];
    let exToolCoordOptionsArr = [];
    let exToolCoordTrsOptionsArr = [];
    let wobjToolCoordOptionsArr = [];
    let wobjTrsCoordeDataArr = [];
    let waitMultiDIOptionArr = [];
    let blockDataArr = [];
    let detectionDataArr = [];
    let collsionBlockDataArr = [];
    let whetherDataArr = [];
    let gradientModeArr = [];
    let fixWeaveDatumArr = [];
    let strangeAvoidStrategyDataArr = [];
    let treatStrategyDataArr = [];
    let whetherSingleDataArr = [];
    let whetherMotionArr = [];
    let connectionDataArr = [];
    let comparationDataArr = [];
    let linModeDataArr = [];
    let whetherTruthDataArr = [];
    let layerIdDataArr = [];
    let functionTypeDataArr = [];
    let delayModeDataArr = [];
    let trackMotionModeDataArr = [];
    let trackTriggerModeDataArr = [];
    let segmentModeDataArr = [];
    let functionModeDataArr = [];
    let functionIOTypeDataArr = [];
    let weaveModeDataArr = [];
    let roundingRuleDataArr = [];
    let loadPosSensorDriverDataArr = [];
    let hSprialDriectionArr = [];
    let offsetFlagDataArr = [];
    let offsetTypeDataArr = [];
    let newSplineModeDataArr = [];
    let nSpiralOffsetFlagDataArr = [];
    let spiralDirectionDataArr = [];
    let trajectoryJModeArr = [];
    let curveFittingArr = [];
    let curveFittingSmoothArr = [];
    let zeroModeDataArr = [];
    let servoZeroModeDataArr = [];
    let auxServoCommandModeArr = [];
    let servoEnableDataArr = [];
    let servoIdDataArr = [];
    let servoIdData = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
    let conTrackModeDataArr = [];
    let enableDataArr = [];
    let polishCommandModeArr = [];
    let cncWaitRunArr = [];
    let cncChuckStatusArr = [];
    let cncTimeoutArr = [];
    let cncTimeoutPolicyArr = [];
    let collideModeDataArr = [];
    let traceIsleftrightDataArr = [];
    let biasModeDataArr = [];
    let weldTraceAxisselectDataArr = [];
    let weldTraceReferenceTypeDataArr = [];
    let FTControlAdjSignDataArr = [];
    let FTControlILCSignDataArr = [];
    let FTReferenceCoordDataArr = [];
    let FTRotOrnDataArr = [];
    let FTRotRotOrnDataArr = [];
    let checkStrategyDataArr = [];
    let wobjAxisDataArr = [];
    let torqueSmoothTypeDataArr = [];
    let ioStateArr = [];
    let AIcompareArr = [];
    let suckerStateDictArr = [];
    let suctionPortDict = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    let suctionPortDictArr = [];
    let suckerControlModeArr = [];
    let axisTypeDataArr = [];
    let modbusRegReadFunctionCodeDataArr = [];
    let modbusRegWriteFunctionCodeDataArr = [];
    let lockXPointModeDataArr = [];
    let techPlateTypeArr = [];
    let techMotionDirectionArr = [];
    let infPointTypeArr = [];
    let wireSearchType1MethodDataArr = [];
    let wireSearchType2MethodDataArr = [];
    let outputMoveDOModeDataArr = [];
    let IOTypeDictArr = [];
    let outputAOArr = [];
    let weldSmoothArr = [];
    let wireRefPosDataArr = [];
    let wireSearchBackFlagDataArr = [];
    let wireSearchModeDataArr = [];
    let setTPDModeArr = [];
    let smoothStrategyDataArr = [];
    let wireSearchRefPointDataArr = [];
    let wireSearchResPointDataArr = [];
    let weldRecordDataArr = [];
    let TplateTypeArr = [];
    let servoCModeDataArr = [];
    let collisionLevel1Arr = [];
    let collisionLevel2Arr = [];
    let collisionLevel3Arr = [];
    let collisionLevel4Arr = [];
    let collisionLevel5Arr = [];
    let collisionLevel6Arr = [];
    let socketSendBlockDataArr = [];
    let socketReceiveTimeoutDataArr = [];
    let modbusWaitAIDataArr = [];
    let polishChannelDataArr = [];
    gpDynamicTags = langJsonData.graphical_programming;
    let commandNameData = langJsonData.commandlist["commandName"]; //ä»£ç ååç§°
    let descriptionData = langJsonData.commandlist["customContent"]; //ä»£ç åæè¿°ææ¬
    let programCategoryArray = langJsonData.program_teach.var_object["program_category_array"]; //ä»£ç åæè¿°æ é¢
    let graphInputTitles = langJsonData.commandlist.nodeEditorCommands
    let DinData = langJsonData.commandlist.DinData;
    let DoData = langJsonData.commandlist.DoData;
    let AIport = langJsonData.commandlist.AIport;
    let AOport = langJsonData.commandlist.AOport;
    let spaceSelectionData = langJsonData.program_teach.var_object.spaceSelectionData;
    let modbusWaitAIData = [
        {
            name: ">",
            num: "0"
        },
        {
            name: "<",
            num: "1"
        },
        {
            name: "=",
            num: "2"
        }
    ];
    let polishChannelData = [
        {
            id: "0",
            name: "1"
        },
        {
            id: "1",
            name: "2"
        }
    ];
    let luaPath;
    if (g_systemFlag == 1) {
        luaPath = "/usr/local/etc/controller/lua/"
    } else {
        luaPath = "/fruser/"
    }
    /* åå§å */
    getToolCoordData();
    getPointsData();
    getTPDName();
    getBlocklyWorkspaceNames();
    getIOAliasData();
    getUserFiles();
    getToolTrsfCoordData();
    getExToolCoordData();
    getWobjCoordData();
    getTrajectoryFileNameList();
    getModbusMasterConfig();
    getModbusSlaveAliasConfig();
    getModbusRtuSlaveAliasConfig();
    getPointTableModeList();
    getsocketIDList();
    g_programErr = 0; //æ¸é¤ç¤ºæç¨åºNewdofileæ¥éå½±åå¾å½¢åç¼ç¨ç¨åºè¿è¡
    g_nodeLuaError = false; //æ¸é¤èç¹å¾ç¼ç¨Newdofileæ¥éå½±åå¾å½¢åç¼ç¨ç¨åºè¿è¡
    /* ./åå§å */

    /* TODO: Change toolbox XML ID if necessary. Can export toolbox XML from Workspace Factory. */

    // Blockly.defineBlocksWithJsonArray([
    //     // Block for colour picker.
    //     {
    //         "type": "colour_picker",
    //         "message0": "%1",
    //         "args0": [
    //             {
    //                 "type": "field_colour",
    //                 "name": "COLOUR",
    //                 "colour": "#ff0000"
    //             }
    //         ],
    //         "output": "Colour",
    //         "helpUrl": "%{BKY_COLOUR_PICKER_HELPURL}",
    //         "style": "colour_blocks",
    //         "tooltip": "%{BKY_COLOUR_PICKER_TOOLTIP}",
    //         "extensions": ["parent_tooltip_when_inline"]
    //     },
    //     // Block for random colour.
    //     {
    //         "type": "colour_random",
    //         "message0": "%{BKY_COLOUR_RANDOM_TITLE}",
    //         "output": "Colour",
    //         "helpUrl": "%{BKY_COLOUR_RANDOM_HELPURL}",
    //         "style": "colour_blocks",
    //         "tooltip": "%{BKY_COLOUR_RANDOM_TOOLTIP}"
    //     }
    // ]);

    //è·åå·¥å·åæ ç³»æ°æ®
    let toolCoordTempItem = [];
    let sensorCoordTempItem = [];
    let toolCoordForLaserOptionsArr = [];
    let sensorCoordOptionsArr = [];
    function getToolCoordData() {
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            data.forEach(element => {
                toolCoordTempItem = [];
                toolCoordTempItem[0] = element.name;
                toolCoordTempItem[1] = element.id;
                toolCoordForLaserOptionsArr.push(toolCoordTempItem);
                if (element.type == "1") {
                    sensorCoordTempItem = [];
                    sensorCoordTempItem[0] = element.name;
                    sensorCoordTempItem[1] = element.id;
                    sensorCoordOptionsArr.push(sensorCoordTempItem);
                }
            });
            if (sensorCoordOptionsArr.length == 0) {
                sensorCoordOptionsArr.push([gpDynamicTags.info_messages[0], "-1"]);
            }
            // success
            getSensorToolCoordFlg = 1;
            if (document.getElementById("graphicalProgramming") != null) {
                document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
            }
        }, (status) => {
            /* test */
            if (g_testCode) {
                sensorCoordOptionsArr = [
                    ["toolCoord2", "2"]
                ];
                getSensorToolCoordFlg = 1;
                if (document.getElementById("graphicalProgramming") != null) {
                    document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
                }
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[0]);
        });
    };

    /**è·åç³»ç»åè½¨è¿¹ï¼trajãtrajJï¼æä»¶åç§°åè¡¨ */
    let trajFileNameData = [];
    let trajFileNameArr = [];
    function getTrajectoryFileNameList() {
        let getTrajFileNameListCmd = {
            cmd: "get_traj_files",
        }
        dataFactory.getData(getTrajFileNameListCmd).then((data) => {
            trajFileNameData = data;
            if (!$.isEmptyObject(trajFileNameData)) {
                trajFileNameData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    trajFileNameArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                trajFileNameArr.push(tempItem);
            }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                trajFileNameArr = [
                    ["è½¨è¿¹æä»¶1", "è½¨è¿¹æä»¶1"],
                    ["è½¨è¿¹æä»¶2", "è½¨è¿¹æä»¶2"]
                ];
            }
            /* ./test */
        });
    }

    
    /**è·åä¸»ç«éç½® */
    let modbusMasterAddressDataArr = [];
    function getModbusMasterConfig() {
        let modbusMasterConfigCmd = {
            cmd: 886,
            data: {
                content: "ModbusMasterGetConfig()"
            }
        }
        dataFactory.setData(modbusMasterConfigCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.modbusMasterConfigData = [
                    {
                        id: 0,
                        ip: "192.168.58.33",
                        port: 8020,
                        slaveID: 0,
                        period: 200,
                        alias: "Modbus_1"
                    },
                    {
                        id: 1,
                        ip: "192.168.58.34",
                        port: 8021,
                        slaveID: 1,
                        period: 200,
                        alias: "Modbus_2"
                    }
                ]
                $scope.modbusMasterConfigData.forEach(item => {
                    tempItem = [];
                    tempItem[0] = item.alias;
                    tempItem[1] = item.alias;
                    modbusMasterAddressDataArr.push(tempItem);
                });
                getModbusMasterAddressConfig();
            }
            /* ./test */
        });
    }
    document.getElementById('graphicalProgramming').addEventListener('886', e => {
        $scope.modbusMasterConfigData = JSON.parse(e.detail);
        if (!$.isEmptyObject($scope.modbusMasterConfigData)) {
            $scope.modbusMasterConfigData.forEach(item => {
                tempItem = [];
                tempItem[0] = item.alias;
                tempItem[1] = item.alias;
                modbusMasterAddressDataArr.push(tempItem);
            });
        }else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            modbusMasterAddressDataArr.push(tempItem);
        }
        getModbusMasterAddressConfig();
    })

    /**è·åä¸»ç«å¯å­å¨éç½® */
    let modbusMasterDIDataArr = [];
    let modbusMasterDODataArr = [];
    let modbusMasterAIDataArr = [];
    let modbusMasterAODataArr = [];
    function getModbusMasterAddressConfig() {
        let modbusMasterConfigCmd = {
            cmd: 889,
            data: {
                content: "ModbusMasterGetAddressConfig()"
            }
        }
        dataFactory.setData(modbusMasterConfigCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                let data = [];
                $scope.modbusMasterAddressData = [
                    {
                        id: 0,
                        addressnum: 3,
                        addresstype: [0,1,3],
                        address: [2000,2001,2002],
                        alias: ["Register_di1","Register_do2","Register_ai3"]
                    },
                    {
                        id: 1,
                        addressnum: 3,
                        addresstype: [2,1,3],
                        address: [2000,2001,2002],
                        alias: ["Register_ai1","Register_do2","Register_ai3"]
                    },
                    {
                        id: 2,
                        addressnum: 3,
                        addresstype: [0,4,3],
                        address: [2000,2001,2002],
                        alias: ["Register_di1","Register_ai2","Register_ai3"]
                    },
                    {
                        id: 3,
                        addressnum: 3,
                        addresstype: [7,5,6],
                        address: [2000,2001,2002],
                        alias: ["Register_ao1","Register_ao2","Register_ao3"]
                    }
                ]
                $scope.modbusMasterAddressData.forEach(item => {
                    for(let i=0; i<item.addressnum; i++) {
                        let array_new = {};
                        array_new = {
                            id: item.id,
                            addresstype: item.addresstype[i], 
                            address: item.address[i], 
                            alias: item.alias[i],
                        }
                        data.push(array_new);
                    }
                });
                $scope.modbusMasterNewData = data;
                $scope.modbusMasterDIData = $scope.modbusMasterNewData.filter(item => item.addresstype == 0);
                $scope.modbusMasterDOData = $scope.modbusMasterNewData.filter(item => item.addresstype == 1);
                $scope.modbusMasterAIData = $scope.modbusMasterNewData.filter(item => item.addresstype == 2 || item.addresstype == 3 || item.addresstype == 4);
                $scope.modbusMasterAOData = $scope.modbusMasterNewData.filter(item => item.addresstype == 5 || item.addresstype == 6 || item.addresstype == 7);
        
                $scope.modbusMasterDIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.alias;
                    tempItem[1] = element.alias;
                    modbusMasterDIDataArr.push(tempItem);
                });
                $scope.modbusMasterDOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.alias;
                    tempItem[1] = element.alias;
                    modbusMasterDODataArr.push(tempItem);
                });
                $scope.modbusMasterAIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.alias;
                    tempItem[1] = element.alias;
                    modbusMasterAIDataArr.push(tempItem);
                });
                $scope.modbusMasterAOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.alias;
                    tempItem[1] = element.alias;
                    modbusMasterAODataArr.push(tempItem);
                });
            }
            /* ./test */
        });
    }
    document.getElementById('graphicalProgramming').addEventListener('889', e => {
        $scope.modbusMasterAddressData = JSON.parse(e.detail);
        let data = [];
        $scope.modbusMasterAddressData.forEach(item => {
            for(let i=0; i<item.addressnum; i++) {
                let array_new = {};
                array_new = {
                    id: item.id,
                    addresstype: item.addresstype[i], 
                    address: item.address[i], 
                    alias: item.alias[i],
                }
                data.push(array_new);
            }
        });
        $scope.modbusMasterNewData = data;
        $scope.modbusMasterDIData = $scope.modbusMasterNewData.filter(item => item.addresstype == 0);
        $scope.modbusMasterDOData = $scope.modbusMasterNewData.filter(item => item.addresstype == 1);
        $scope.modbusMasterAIData = $scope.modbusMasterNewData.filter(item => item.addresstype == 2 || item.addresstype == 3 || item.addresstype == 4);
        $scope.modbusMasterAOData = $scope.modbusMasterNewData.filter(item => item.addresstype == 5 || item.addresstype == 6 || item.addresstype == 7);

        if (!$.isEmptyObject($scope.modbusMasterDIData)) {
            $scope.modbusMasterDIData.forEach(item => {
                tempItem = [];
                tempItem[0] = item.alias;
                tempItem[1] = item.alias;
                modbusMasterDIDataArr.push(tempItem);
            });
        }else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            modbusMasterDIDataArr.push(tempItem);
        }

        if (!$.isEmptyObject($scope.modbusMasterDOData)) {
            $scope.modbusMasterDOData.forEach(item => {
                tempItem = [];
                tempItem[0] = item.alias;
                tempItem[1] = item.alias;
                modbusMasterDODataArr.push(tempItem);
            });
        }else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            modbusMasterDODataArr.push(tempItem);
        }

        if (!$.isEmptyObject($scope.modbusMasterAIData)) {
            $scope.modbusMasterAIData.forEach(item => {
                tempItem = [];
                tempItem[0] = item.alias;
                tempItem[1] = item.alias;
                modbusMasterAIDataArr.push(tempItem);
            });
        }else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            modbusMasterAIDataArr.push(tempItem);
        }

        if (!$.isEmptyObject($scope.modbusMasterAOData)) {
            $scope.modbusMasterAOData.forEach(item => {
                tempItem = [];
                tempItem[0] = item.alias;
                tempItem[1] = item.alias;
                modbusMasterAODataArr.push(tempItem);
            });
        }else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            modbusMasterAODataArr.push(tempItem);
        }
        initialLoadProgram();
    })

    /**è·åä»ç«å¯å­å¨å«å */
    let slaveDIDataArr = [];
    let slaveDODataArr = [];
    let slaveAIDataArr = [];
    let slaveAODataArr = [];
    function getModbusSlaveAliasConfig() {
        let getModbusSlaveAliasCmd = {
            cmd: "get_modbusslave_IO_alias_cfg"
        }
        dataFactory.getData(getModbusSlaveAliasCmd).then((data) => {
            $scope.modbusSlaveIOAliasData = data;
            $scope.slaveDIData = $scope.modbusSlaveIOAliasData["DI"];
            $scope.slaveDOData = $scope.modbusSlaveIOAliasData["DO"];
            $scope.slaveAIData = $scope.modbusSlaveIOAliasData["AI"];
            $scope.slaveAOData = $scope.modbusSlaveIOAliasData["AO"];

            if (!$.isEmptyObject($scope.slaveDIData)) {
                $scope.slaveDIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveDIDataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveDIDataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveDOData)) {
                $scope.slaveDOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveDODataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveDODataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveAIData)) {
                $scope.slaveAIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveAIDataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveAIDataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveAOData)) {
                $scope.slaveAOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveAODataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveAODataArr.push(tempItem);
            }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                let data = {
                    "DI":["DI0","DI1","DI2","DI3","DI4","DI5","DI6","DI7","DI8","DI9","DI10","DI11","DI12","DI13","DI14","DI15","DI16"],
                    "DO":["DO0","DO1","DO2","DO3","DO4","DO5","DO6","DO7","DO8","DO9","DO10","DO11","DO12","DO13","DO14","DO15","DO16"],
                    "AI":["AI0","AI1","AI2","AI3","AI4","AI5","AI6","AI7","AI8","AI9","AI10","AI11","AI12","AI13","AI14","AI15","AI16"],
                    "AO":["AO0","AO1","AO2","AO3","AO4","AO5","AO6","AO7","AO8","AO9","AO10","AO11","AO12","AO13","AO14","AO15","AO16"],
                }
                $scope.modbusSlaveIOAliasData = data;
                $scope.slaveDIData = $scope.modbusSlaveIOAliasData["DI"];
                $scope.slaveDOData = $scope.modbusSlaveIOAliasData["DO"];
                $scope.slaveAIData = $scope.modbusSlaveIOAliasData["AI"];
                $scope.slaveAOData = $scope.modbusSlaveIOAliasData["AO"];

                $scope.slaveDIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveDIDataArr.push(tempItem);
                });

                $scope.slaveDOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveDODataArr.push(tempItem);
                });

                $scope.slaveAIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveAIDataArr.push(tempItem);
                });

                $scope.slaveAOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveAODataArr.push(tempItem);
                });
            }
            /* ./test */
        });
    }

    /**è·åä»ç«å¯å­å¨å«å */
    let slaveRtuDIDataArr = [];
    let slaveRtuDODataArr = [];
    let slaveRtuAIDataArr = [];
    let slaveRtuAODataArr = [];
    function getModbusRtuSlaveAliasConfig() {
        let getCmd = {
            cmd: "get_modbusslave_IO_alias_rtu_cfg"
        }
        dataFactory.getData(getCmd).then((data) => {
            $scope.modbusRtuSlaveIOAliasData = data;
            $scope.slaveRtuDIData = $scope.modbusRtuSlaveIOAliasData["DI"];
            $scope.slaveRtuDOData = $scope.modbusRtuSlaveIOAliasData["DO"];
            $scope.slaveRtuAIData = $scope.modbusRtuSlaveIOAliasData["AI"];
            $scope.slaveRtuAOData = $scope.modbusRtuSlaveIOAliasData["AO"];

            if (!$.isEmptyObject($scope.slaveRtuDIData)) {
                $scope.slaveRtuDIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveRtuDIDataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveRtuDIDataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveRtuDOData)) {
                $scope.slaveRtuDOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveRtuDODataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveRtuDODataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveRtuAIData)) {
                $scope.slaveRtuAIData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveRtuAIDataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveRtuAIDataArr.push(tempItem);
            }

            if (!$.isEmptyObject($scope.slaveRtuAOData)) {
                $scope.slaveRtuAOData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    slaveRtuAODataArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                slaveRtuAODataArr.push(tempItem);
            }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                let data = {
                    "DI":["DI0","DI1","DI2","DI3","DI4","DI5","DI6","DI7","DI8","DI9","DI10","DI11","DI12","DI13","DI14","DI15","DI16"],
                    "DO":["DO0","DO1","DO2","DO3","DO4","DO5","DO6","DO7","DO8","DO9","DO10","DO11","DO12","DO13","DO14","DO15","DO16"],
                    "AI":["AI0","AI1","AI2","AI3","AI4","AI5","AI6","AI7","AI8","AI9","AI10","AI11","AI12","AI13","AI14","AI15","AI16"],
                    "AO":["AO0","AO1","AO2","AO3","AO4","AO5","AO6","AO7","AO8","AO9","AO10","AO11","AO12","AO13","AO14","AO15","AO16"],
                }
                $scope.modbusRtuSlaveIOAliasData = data;
                $scope.slaveRtuDIData = $scope.modbusRtuSlaveIOAliasData["DI"];
                $scope.slaveRtuDOData = $scope.modbusRtuSlaveIOAliasData["DO"];
                $scope.slaveRtuAIData = $scope.modbusRtuSlaveIOAliasData["AI"];
                $scope.slaveRtuAOData = $scope.modbusRtuSlaveIOAliasData["AO"];

                if (!$.isEmptyObject($scope.slaveRtuDIData)) {
                    $scope.slaveRtuDIData.forEach(element => {
                        tempItem = [];
                        tempItem[0] = element;
                        tempItem[1] = element;
                        slaveRtuDIDataArr.push(tempItem);
                    });
                } else {
                    tempItem = [];
                    tempItem[0] = gpDynamicTags.info_messages[4];
                    tempItem[1] = gpDynamicTags.info_messages[4];
                    slaveRtuDIDataArr.push(tempItem);
                }

                if (!$.isEmptyObject($scope.slaveRtuDOData)) {
                    $scope.slaveRtuDOData.forEach(element => {
                        tempItem = [];
                        tempItem[0] = element;
                        tempItem[1] = element;
                        slaveRtuDODataArr.push(tempItem);
                    });
                } else {
                    tempItem = [];
                    tempItem[0] = gpDynamicTags.info_messages[4];
                    tempItem[1] = gpDynamicTags.info_messages[4];
                    slaveRtuDODataArr.push(tempItem);
                }

                if (!$.isEmptyObject($scope.slaveRtuAIData)) {
                    $scope.slaveRtuAIData.forEach(element => {
                        tempItem = [];
                        tempItem[0] = element;
                        tempItem[1] = element;
                        slaveRtuAIDataArr.push(tempItem);
                    });
                } else {
                    tempItem = [];
                    tempItem[0] = gpDynamicTags.info_messages[4];
                    tempItem[1] = gpDynamicTags.info_messages[4];
                    slaveRtuAIDataArr.push(tempItem);
                }

                if (!$.isEmptyObject($scope.slaveRtuAOData)) {
                    $scope.slaveRtuAOData.forEach(element => {
                        tempItem = [];
                        tempItem[0] = element;
                        tempItem[1] = element;
                        slaveRtuAODataArr.push(tempItem);
                    });
                } else {
                    tempItem = [];
                    tempItem[0] = gpDynamicTags.info_messages[4];
                    tempItem[1] = gpDynamicTags.info_messages[4];
                    slaveRtuAODataArr.push(tempItem);
                }
            }
            /* ./test */
        });
    }

    /** è·åç¹ä½è¡¨åè¡¨*/
    let pointTableModeListArr = [];
    function getPointTableModeList() {
        let getPointTableListCmd = {
            cmd: "get_point_table_list"
        };
        dataFactory.getData(getPointTableListCmd).then((data) => {
            $scope.pointTableModeList = JSON.parse(JSON.stringify(data));
            if (!$.isEmptyObject($scope.pointTableModeList)) {
                $scope.pointTableModeList.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    pointTableModeListArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                pointTableModeListArr.push(tempItem);
            }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.pointTableModeList = ["point_table_1.db","point_table_2.db","point_table_3.db"];
                $scope.pointTableModeList.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element;
                    tempItem[1] = element;
                    pointTableModeListArr.push(tempItem);
                });
            }
            /* ./test */
        });
    }

    /** è·åSocket-IDåè¡¨*/
    let socketIDListArr = [];
    function getsocketIDList() {
        let setCmd = {
            cmd: 1231,
            data: {
                content: `GetSocketConnectParam()`
            }
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.socketIDList = [0,2];
                $scope.socketIDList.forEach(element => {
                    tempItem = [];
                    tempItem[0] = String(element);
                    tempItem[1] = String(element);
                    socketIDListArr.push(tempItem);
                });
            }
            /* ./test */
        });
    }
    document.getElementById('graphicalProgramming').addEventListener('1231', (e) => {
        let socketSettingData = JSON.parse(e.detail).socket_connect_param;
        let idArray = [];
        socketSettingData.forEach((item, index) => {
            if (item.enable == 1) {
                idArray.push(index);
            }
        })
        // socketæä»¤å¯ç¨ID
        $scope.socketIDList = [...(new Set(idArray))];
        if (!$.isEmptyObject($scope.socketIDList)) {
            $scope.socketIDList.forEach(element => {
                tempItem = [];
                tempItem[0] = String(element);
                tempItem[1] = String(element);
                socketIDListArr.push(tempItem);
            });
        } else {
            tempItem = [];
            tempItem[0] = gpDynamicTags.info_messages[4];
            tempItem[1] = gpDynamicTags.info_messages[4];
            socketIDListArr.push(tempItem);
        }
    });

    /* è·åç¤ºæç¹æ°æ® */
    let pointsArr = [];
    let pointItem = [];
    function getPointsData() {
        let getCmd = {
            cmd: "get_points",
        };
        dataFactory.getData(getCmd).then((data) => {
            let pointNameArr = Object.keys(data);
            pointNameArr.forEach(function (item, i) {
                // å¾å½¢åä»£ç åä¸ææ¡ç¹æ°æ®
                pointItem = [];
                pointItem[0] = item;
                pointItem[1] = item;
                pointsArr[i] = pointItem;
            });
            getPointsFlg = 1;
            if (document.getElementById("graphicalProgramming") != null) {
                if (recordSavePoint == 1) return;
                document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
            }
        }, (status) => {
            /* test */
            if (g_testCode) {
                pointsArr = [
                    ["point1", "point1"],
                    ["point2", "point2"],
                    ["point3", "point3"]
                ];
                getPointsFlg = 1;
                if (document.getElementById("graphicalProgramming") != null) {
                    document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
                }
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[1]);
        });
    };
    
    /*è·åIOå«åéç½®æ°æ® */
    function getIOAliasData() {
        const getAliasCmd = {
            cmd: 'get_IO_alias_cfg'
        };
        dataFactory.getData(getAliasCmd).then(data => {
            $scope.ctrlDIAliasData = data.CtrlBox.DI;
            $scope.ctrlDOAliasData = data.CtrlBox.DO;
            $scope.ctrlAIAliasData = data.CtrlBox.AI;
            $scope.ctrlAOAliasData = data.CtrlBox.AO;
            $scope.endDIAliasData = data.EndEff.DI;
            $scope.endDOAliasData = data.EndEff.DO;
            $scope.endAIAliasData = data.EndEff.AI;
            $scope.endAOAliasData = data.EndEff.AO;
            DinData.forEach((item, index) => {
                switch (index) {
                    case 16:
                        if ($scope.endDIAliasData[0]) {
                            item['aliasName'] = `(${$scope.endDIAliasData[0]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 17:
                        if ($scope.endDIAliasData[1]) {
                            item['aliasName'] = `(${$scope.endDIAliasData[1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    default:
                        if ($scope.ctrlDIAliasData[index]) {
                            item['aliasName'] = `(${$scope.ctrlDIAliasData[index]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                }
            });
            DoData.forEach((item, index) => {
                switch (index) {
                    case 16:
                        if ($scope.endDOAliasData[0]) {
                            item['aliasName'] = `(${$scope.endDOAliasData[0]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 17:
                        if ($scope.endDOAliasData[1]) {
                            item['aliasName'] = `(${$scope.endDOAliasData[1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    default:
                        if ($scope.ctrlDOAliasData[index]) {
                            item['aliasName'] = `(${$scope.ctrlDOAliasData[index]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                }
            });
            AIport.forEach((item, index) => {
                switch (index) {
                    case 2:
                        item['aliasName'] = $scope.endAIAliasData[0] ? `(${$scope.endAIAliasData[0]})` : '';
                        break;
                    default:
                        item['aliasName'] = $scope.ctrlAIAliasData[index] ? `(${$scope.ctrlAIAliasData[index]})` : '';
                        break;
                }
            });
            AOport.forEach((item, index) => {
                switch (index) {
                    case 2:
                        item['aliasName'] = $scope.endAOAliasData[0] ? `(${$scope.endAOAliasData[0]})` : '';
                        break;
                    default:
                        item['aliasName'] = $scope.ctrlAOAliasData[index] ? `(${$scope.ctrlAOAliasData[index]})` : '';
                        break;
                }
            });
            //SetDOç«¯å£å·
            DoData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name + element.aliasName;
                tempItem[1] = element.num;
                toolDoOptionsArr.push(tempItem);
                if (element.num <= 15) {
                    doOptionsArr.push(tempItem);
                }
            });
            //GetDIç«¯å£å·
            DinData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name + element.aliasName;
                tempItem[1] = element.num;
                toolDiOptionsArr.push(tempItem);
                if (element.num <= 15) {
                    diOptionsArr.push(tempItem);
                }
            });
            //SetAOç«¯å£å·
            AOport.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name + element.aliasName;
                tempItem[1] = element.num;
                aoOptionsArr.push(tempItem);
            });
            //GetAIç«¯å£å·
            AIport.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name + element.aliasName;
                tempItem[1] = element.num;
                aiOptionsArr.push(tempItem);
            });
        }, (status) => {
            /* test */
            if (g_testCode) {
                //SetDOç«¯å£å·
                DoData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    toolDoOptionsArr.push(tempItem);
                    if (element.num <= 15) {
                        doOptionsArr.push(tempItem);
                    }
                });
                //GetDIç«¯å£å·
                DinData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    toolDiOptionsArr.push(tempItem);
                    if (element.num <= 15) {
                        diOptionsArr.push(tempItem);
                    }
                });
                //SetAOç«¯å£å·
                AOport.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    aoOptionsArr.push(tempItem);
                });
                //GetAIç«¯å£å·
                AIport.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    aiOptionsArr.push(tempItem);
                });
                DoData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    toolCoordOptionsArr.push(tempItem);
                    toolTrsfCoordeArr.push(tempItem);
                });
                DoData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    exToolCoordOptionsArr.push(tempItem);
                });
                DoData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name + element.aliasName;
                    tempItem[1] = element.num;
                    wobjToolCoordOptionsArr.push(tempItem);
                    wobjTrsCoordeDataArr.push(tempItem);
                });
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[5]);
        });
    };

    /**è·ådofileå­ç¨åº */
    let array_new = [];
    function getUserFiles() {
        let getCmd = {
            cmd: "get_user_data",
            data: {
                type: '2'
            }
        };
        dataFactory.getData(getCmd).then((data) => {
            // $scope.graUserData = data;
            let array = Object.keys(data);
            userData = [];
            if (array.length != 0) {
                array.forEach(item => {
                    array_new = [];
                    array_new = [item, item];
                    userData.push(array_new);
                }) 
            } else {
                array_new = [];
                array_new[0] = descriptionData[33].name;
                array_new[1] = descriptionData[33].name;
                userData.push(array_new);
            }
        }, (status) => {
            /* test */
            if (g_testCode) {
                userData = [
                    ["test.lua", "test.lua"],
                    ["test2.lua", "test2.lua"],
                ]
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[4]);
        });
    };
    
    /**
     * è·åå­ç¨åºè¯¦ç»æ°æ®
     * @param {string} name ç¨åºåç§°
     * @param {int} n ç¬¬äºå±NewDofileæ¯ç¬¬å ä¸ª
     */
    function getGraphLuaData(name,n,m) {
        let getCmd = {
            cmd: "get_lua_data",
            data: {
                name: name,
                type: '2',
            }
        };
        dataFactory.getData(getCmd).then((data) => {
                if (!n) {
                    // ç¬¬ä¸å±çº§å¤çé»è¾
                    var singleLine_NewDofile_Arr = createCommandsArray(data);
                    let tempLen = singleLine_NewDofile_Arr.length;
                    if (tempLen === 0) {
                        graphicalOrder++;
                        g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + gpDynamicTags.warning_messages[2] + gpDynamicTags.warning_messages[7];
                        g_graphicalErr = true;
                    } else {
                        graphicalOrder++;
                        if (handleresult[1] != 1) {
                            g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + gpDynamicTags.warning_messages[4];
                            g_graphicalErr = true;
                        } else {
                            var checkidreturn = checkNewDofileID(handleresult);
                            if (checkidreturn != -1 && $scope.finallyGraNewDofileArr_index != 0) {
                                g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + + gpDynamicTags.warning_messages[2] + gpDynamicTags.warning_messages[6];
                                g_graphicalErr = true;
                            } else {
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index] = new Array();
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][0] = handleresult[0];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][1] = handleresult[1];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][2] = handleresult[2];
                                $scope.finallyGraNewDofileArr_index = $scope.finallyGraNewDofileArr_index + 1;
                                handleDofileArr_second(singleLine_NewDofile_Arr, name, graphicalOrder);
                            }
                        }
                    }
                } else {
                    // ç¬¬äºå±çº§å¤çé»è¾
                    var singleLine_NewDofile_Arr = createCommandsArray(data);
                    let tempLen = singleLine_NewDofile_Arr.length;
                    if (tempLen === 0) {
                        g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[3] + gpDynamicTags.warning_messages[7];
                        g_graphicalErr = true;
                    } else {
                        if (handleresult[1] != 2) {
                            g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[5];
                            g_graphicalErr = true;
                        } else {
                            var checkidreturn = checkNewDofileID(handleresult);
                            if (checkidreturn != -1 && $scope.finallyGraNewDofileArr_index != 0) {
                                g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[3] + gpDynamicTags.warning_messages[6];
                                g_graphicalErr = true;
                            } else {
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index] = new Array();
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][0] = handleresult[0];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][1] = handleresult[1];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][2] = handleresult[2];
                                $scope.finallyGraNewDofileArr_index = $scope.finallyGraNewDofileArr_index+1;
                                handleDofileArr_Third(singleLine_NewDofile_Arr,n,m+1)
                            }
                        }
                    }
                }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                if (!n) {  
                    let data = {
                        name: "test.lua",
                        ws_code: "NewDofile(\"/fruser/test.lua\",1,1000)\nDofileEnd()\n",
                    }
                    // ç¬¬ä¸å±çº§å¤çé»è¾
                    var singleLine_NewDofile_Arr = createCommandsArray(data.ws_code);
                    let tempLen = singleLine_NewDofile_Arr.length;
                    if (tempLen === 0) {
                        graphicalOrder++;
                        g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + gpDynamicTags.warning_messages[2] + gpDynamicTags.warning_messages[7];
                        g_graphicalErr = true;
                    } else {
                        graphicalOrder++;
                        if (handleresult[1] != 1) {
                            g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + gpDynamicTags.warning_messages[4];
                            g_graphicalErr = true;
                        } else {
                            var checkidreturn = checkNewDofileID(handleresult);
                            if (checkidreturn != -1 && $scope.finallyGraNewDofileArr_index != 0) {
                                g_graphicalErrString = gpDynamicTags.warning_messages[1] + graphicalOrder + + gpDynamicTags.warning_messages[2] + gpDynamicTags.warning_messages[6];
                                g_graphicalErr = true;
                            } else {
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index] = new Array();
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][0] = handleresult[0];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][1] = handleresult[1];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][2] = handleresult[2];
                                $scope.finallyGraNewDofileArr_index = $scope.finallyGraNewDofileArr_index + 1;
                                handleDofileArr_second(singleLine_NewDofile_Arr, name, graphicalOrder);
                            }
                        }
                    }
                } else {
                    let data = {
                        name: "test2.lua",
                        ws_code: "PTP(point1,100,-1,0)\nWaitMs(1000)\n"
                    }
                    // ç¬¬äºå±çº§å¤çé»è¾
                    var singleLine_NewDofile_Arr = createCommandsArray(data.ws_code);
                    let tempLen = singleLine_NewDofile_Arr.length;
                    if (tempLen === 0) {
                        g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[3] + gpDynamicTags.warning_messages[7];
                        g_graphicalErr = true;
                    } else {
                        if (handleresult[1] != 2) {
                            g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[5];
                            g_graphicalErr = true;
                        } else {
                            var checkidreturn = checkNewDofileID(handleresult);
                            if (checkidreturn != -1 && $scope.finallyGraNewDofileArr_index != 0) {
                                g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[3] + gpDynamicTags.warning_messages[6];
                                g_graphicalErr = true;
                            } else {
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index] = new Array();
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][0] = handleresult[0];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][1] = handleresult[1];
                                $scope.finallyGraNewDofileArr[$scope.finallyGraNewDofileArr_index][2] = handleresult[2];
                                $scope.finallyGraNewDofileArr_index = $scope.finallyGraNewDofileArr_index+1;
                                handleDofileArr_Third(singleLine_NewDofile_Arr,n,m+1)
                            }
                        }
                    }
                }
            }
            /* ./test */
        });
    };

    /**è·åå·¥å·åæ ç³»æ°æ® */
    function getToolTrsfCoordData() {
        toolCoordOptionsArr = [];
        toolTrsfCoordeArr = [];
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.toolCoordData = JSON.parse(JSON.stringify(data));
            $scope.toolCoordData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                toolCoordOptionsArr.push(tempItem);
            });
            $scope.toolTrsfCoordeData = JSON.parse(JSON.stringify(data)).filter(item => item.type == 1);
            if (!$.isEmptyObject($scope.toolTrsfCoordeData)) {
                $scope.toolTrsfCoordeData.forEach(element => {
                    tempItem = [];
                    tempItem[0] = element.name;
                    tempItem[1] = element.id;
                    toolTrsfCoordeArr.push(tempItem);
                });
            } else {
                tempItem = [];
                tempItem[0] = gpDynamicTags.info_messages[4];
                tempItem[1] = gpDynamicTags.info_messages[4];
                toolTrsfCoordeArr.push(tempItem);
            }
            getExToolCoordData();
        }, (status) => {
            toastFactory.error(status, gpDynamicTags.error_messages[0]);
        });
    };

    /*è·åå¤é¨å·¥å·åæ ç³»æ°æ® */
    function getExToolCoordData() {
        exToolCoordOptionsArr = [];
        exToolCoordTrsOptionsArr = [];
        $scope.exToolCoordeData = [];
        let getCmd = {
            cmd: "get_ex_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            const tempExToolCoordeData = JSON.parse(JSON.stringify(data));
            const exToolCoordeKeys = Object.keys(tempExToolCoordeData);
            exToolCoordeKeys.forEach(item => {
                $scope.exToolCoordeData.push(tempExToolCoordeData[item]);
            });
            $scope.exToolCoordeData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                exToolCoordOptionsArr.push(tempItem);
            })
            $scope.exToolCoordeData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                exToolCoordTrsOptionsArr.push(tempItem);
            })
        }, (status) => {
            toastFactory.error(status, gpDynamicTags.error_messages[9]);
        });
    };

    /* è·åå·¥ä»¶åæ ç³»æ°æ®*/
    function getWobjCoordData() {
        wobjToolCoordOptionsArr = [];
        wobjTrsCoordeDataArr = [];
        let getCmd = {
            cmd: "get_wobj_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            const wobjCoordeArr = [];
            const wobjCoordeData = JSON.parse(JSON.stringify(data));
            const wobjCoordeKeys = Object.keys(wobjCoordeData);
            wobjCoordeKeys.forEach(item => {
                wobjCoordeArr.push(wobjCoordeData[item]);
            });
            wobjCoordeArr.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                wobjToolCoordOptionsArr.push(tempItem);
            });
            wobjCoordeArr.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wobjTrsCoordeDataArr.push(tempItem);
            });
        }, (status) => {
            toastFactory.error(status, gpDynamicTags.error_messages[10]);
        });
    };

    /**
     * æ£æµIDæ¯å¦éå¤
     * @param {array} resultArr å½ådofileåå®¹
     * @returns 
     */
    function checkNewDofileID(resultArr){
        for (let m=0; m < $scope.finallyGraNewDofileArr.length; m++ ) {
            if ($scope.finallyGraNewDofileArr[m][2] == resultArr[2]) {
                if ($scope.finallyGraNewDofileArr[m][0] == resultArr[0] && resultArr[1] == 2) {

                } else if ($scope.finallyGraNewDofileArr[m][1] != resultArr[1]) {

                } else {
                    return resultArr[1];
                }
            }
        }
        return -1;
    }

    /**
     * åéluaç¨åº
     * @param {string} commandsData luaç¨åº
     * @returns 
     */
    function createCommandsArray(commandsData) {
        let commandsArray = commandsData.split('\n');
        return commandsArray;
    };

    /**
     * å¤çç¨åºä¸­ç¬¬ä¸å±NewDofileè¯­å¥
     * @param {array} programArr ç¬¬ä¸å±NewDofileå½ä»¤åå®¹
     */
    var graphicalOrder; // å½åNewDofileæ¯ç¬¬å ä¸ª
    var handleresult; // å¤çå½åç»æ
    function handleDofileArr(programArr) {
        graphicalOrder = 0;
        g_graphicalErr = false;//æ¯æ¬¡åç½®ä¸º0ï¼ç¨åºæ è¯¯
        g_graphicalErrString = "";//æ¯æ¬¡åç½®ä¸ºç©ºï¼æ æ¥éä¿¡æ¯
        $scope.finallyGraNewDofileArr = new Array();
        $scope.finallyGraNewDofileArr_index = 0;
        let mainProgramLength = programArr.length;
        for(let m = 0; m < mainProgramLength; m++) {
            //å¤çå½ä»¤è¡
            if (handleDofileCommand(programArr[m]) != -1 && handleDofileCommand(programArr[m]) != -2) {
                handleresult = handleDofileCommand(programArr[m]);
                var NewDofileName = handleresult[0];
                getGraphLuaData(NewDofileName);
            }
        }
    }

    /**
     * å¤çç¨åºä¸­ç¬¬äºå±NewDofileè¯­å¥
     * @param {array} programArr ç¬¬äºå±NewDofileå½ä»¤åå®¹
     * @param {Object} lastfilename ç¬¬äºå±NewDofileä¸ä¸å±çå½ä»¤åå®¹
     * @param {number} n ç¬¬äºå±NewDofileæ¯ç¬¬å ä¸ª
     */
    function handleDofileArr_second(programArr, lastfilename, n){
        let mainProgramLength = programArr.length;
        for (let m = 0; m < mainProgramLength; m++) {
            //å¤çå½ä»¤è¡
            if (handleDofileCommand(programArr[m]) != -1 && handleDofileCommand(programArr[m]) != -2) {
                handleresult = handleDofileCommand(programArr[m]);
                var NewDofileName = handleresult[0];
                if (lastfilename == NewDofileName) {
                    g_graphicalErrString = gpDynamicTags.warning_messages[1] + n + gpDynamicTags.warning_messages[8] + (m + 1) + gpDynamicTags.warning_messages[10];
                    g_graphicalErr = true;
                } else {
                    getGraphLuaData(NewDofileName,n,m);
                }
            }
        }
    }

    /**
     * å¤çç¨åºä¸­ç¬¬ä¸å±NewDofileè¯­å¥
     * @param {array} programArr ç¬¬ä¸å±NewDofileçå½ä»¤åå®¹
     * @param {number} j ç¬¬ä¸å±NewDofileä¸ä¸å±çå½ä»¤è¡å·
     * @param {number} k ç¬¬äºå±NewDofileå½ä»¤åå®¹çè¡å·
     */
    function handleDofileArr_Third(programArr, j, k){
        let mainProgramLength = programArr.length;
        for (let m = 0; m < mainProgramLength; m++) {
            //å¤çå½ä»¤è¡
            var handleresult = handleDofileCommand(programArr[m]);
            if (handleresult != -1 && handleresult != -2) {
                g_graphicalErrString = gpDynamicTags.warning_messages[1] + j + gpDynamicTags.warning_messages[8] + k + gpDynamicTags.warning_messages[9];
                g_graphicalErr = true;
            }
        }
    }

    /**
     * æååºåè¡å½ä»¤NewDofileä¿¡æ¯
     * @param {string} command åè¡å½ä»¤NewDofileä¿¡æ¯
     * @returns 
     */
    function handleDofileCommand(command) {
        command = command.trim();
        var dofile_index;
        if (g_systemFlag == 1) {
            dofile_index = command.indexOf("NewDofile(\"/usr/local/etc/controller/lua/");
        } else {
            dofile_index = command.indexOf("NewDofile(\"/fruser/");
        }
        if (dofile_index !== -1) {
            var resultArr = [];
            command = command.trim();
            var notes_flag = command.search(/--/i);  
            if (notes_flag == -1) {
                //æä»¤ä¸å«luaèªå¸¦æ³¨é--
                tempString = command.trim();
                var lua_index = tempString.indexOf(".lua");
                if (lua_index !== -1) {
                    //åå²æåæä»¶å
                    var NewDofileName;
                    if (g_systemFlag == 1) {
                        NewDofileName = tempString.substring(dofile_index + 41, lua_index + 4).replace(/[\r\n]/g,"");//å»æåè½¦æ¢è¡
                    } else {
                        NewDofileName = tempString.substring(dofile_index + 19, lua_index + 4).replace(/[\r\n]/g,"");//å»æåè½¦æ¢è¡
                    }
                    //åå²æåå±æ°åè¡å·
                    var length = tempString.length;
                    let dofileParaArr = tempString.substring(0, length-1).replace(/[\r\n]/g,"").split(",");
                    var NewDofileLayer = dofileParaArr[1];
                    var NewDofileRow = dofileParaArr[2];
                    resultArr[0] = NewDofileName;
                    resultArr[1] = NewDofileLayer;
                    resultArr[2] = NewDofileRow;
                    return resultArr;
                } else {
                    return -2;
                }
            } else {
                //æä»¤åå«luaèªå¸¦æ³¨é--
                if (notes_flag  == 0) {
                    return -1;
                } else {
                    //å¦æ--å¨æä»¤åé¢é¢ï¼éè¦å¤ç
                    var luaindex = command.indexOf("--");
                    let tempString;
                    if(luaindex != -1){
                        tempString = command.substring(0,luaindex);
                    }
                    tempString = tempString.trim();
                    var lua_index = tempString.indexOf(".lua");
                    if (lua_index !== -1) {
                        //åå²æåæä»¶å
                        var NewDofileName = tempString.substring(dofile_index+19, lua_index+4).replace(/[\r\n]/g,"");//å»æåè½¦æ¢è¡
                        //åå²æåå±æ°åè¡å·
                        var length = tempString.length;
                        let dofileParaArr = tempString.substring(0, length-1).replace(/[\r\n]/g,"").split(",");
                        var NewDofileLayer = dofileParaArr[1];
                        var NewDofileRow = dofileParaArr[2];
                        resultArr[0] = NewDofileName;
                        resultArr[1] = NewDofileLayer;
                        resultArr[2] = NewDofileRow;
                        return resultArr;
                    } else {
                        return -2;
                    }
                }
            }
        } else {
            return -1;
        }
    }

    /* è·åTPDè½¨è¿¹æä»¤ */
    let tpdNameItem = [];
    let tpdNamesArr = [];
    function getTPDName() {
        let getTPDNameCmd = {
            cmd: "get_tpd_name",
        };
        dataFactory.getData(getTPDNameCmd).then((data) => {
            let tpdTemp = data;
            if (tpdTemp.length != 0) {
                tpdTemp.forEach((item, index, arr) => {
                    tpdNameItem = [];
                    tpdNameItem[0] = item;
                    tpdNameItem[1] = item;
                    tpdNamesArr.push(tpdNameItem);
                });
            } else {
                tpdNameItem = [];
                tpdNameItem[0] = descriptionData[34].name;
                tpdNameItem[1] = descriptionData[34].name;
                tpdNamesArr.push(tpdNameItem);
            }
            getTPDFlg = 1;
            if (document.getElementById("graphicalProgramming") != null) {
                document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
            }
        }, (status) => {
            /* test */
            if (g_testCode) {
                tpdNamesArr = [
                    ["track1", "track1"],
                    ["track2", "track2"],
                    ["track3", "track3"]
                ];
                getTPDFlg = 1;
                if (document.getElementById("graphicalProgramming") != null) {
                    document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('init-blockly', { bubbles: true, cancelable: true, composed: true }));
                }
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[2]);
        });
    }

    /**ç¦»å¼å½åé¡µé¢æ¶è§¦å */
    let navigateUrl;//è·³è½¬é¡µé¢çè·¯å¾
    $scope.$on('$routeChangeStart', function(event, current, previous) {
        monitorContent = Blockly.Lua.workspaceToCode(workspace);
        if (monitorContent != code && $scope.workspaceNameForGP != "" && $scope.workspaceNameForGP != undefined && $scope.workspaceNameForGP != null && recordIndex != 4) {
            event.preventDefault(); //æ¦æªè·¯ç±è·³è½¬
            $("#confirmChangeModal").modal('show');
            navigateUrl = '#' + current.originalPath; //è·³è½¬æå­çè·¯å¾
            recordIndex = 4;
        } else {
            workspace.clear();
        }
    })

    /**çæµå¨å±ç¤ºæç¨åºï¼åçæ¹åæ¶è§¦å */
    $scope.$watch(() => {
        if (workspace) {
            monitorContent = Blockly.Lua.workspaceToCode(workspace);
        }
        if (monitorContent != code && $scope.workspaceNameForGP != "" && $scope.workspaceNameForGP != undefined && $scope.workspaceNameForGP != null) {
            g_programChangeFlag = 2; // å¾å½¢åç¼ç¨åçæ¹å
        } else {
            g_programChangeFlag = 3; // æªåçæ¹å
        }
    })

    /**ç¹å»Blocklyä»£ç åå·¥ä½åºæ¶è§¦å */
    $scope.clickBlockDiv = function() {
        if(("1" != $scope.controlMode)){
            $(".blocklyFlyout").css("display", "none"); //éèä»£ç ååè¡¨
            $(".blocklyScrollbarHandle").css("width", "0"); //éèç©ºç½æ»å¨æ¨ªæ¡
            toastFactory.warning(gpDynamicTags.warning_messages[11]);
        }
    }

    /**ç§»å¥Blocklyä»£ç åå·¥ä½åºæ¶è§¦å */
    $scope.mouseOverDisable = function() {
        if(("1" != $scope.controlMode)){
            $(".blocklyDraggable").css("pointer-events", "none"); //èªå¨æ¨¡å¼ä¸ï¼ç¦æ­¢æä½é¡µé¢æä»¤
            document.getElementById('graphicalProgramming').oncontextmenu = function() {
                $(".blocklyWidgetDiv .blocklyMenu").css("pointer-events","none");
            }
        } else {
            $(".blocklyDraggable").css("pointer-events", "auto");
            document.getElementById('graphicalProgramming').oncontextmenu = function() {
                $(".blocklyWidgetDiv .blocklyMenu").css("pointer-events","auto");
            }
        }
    }

    let errorWarning;
    let errorWarning2;
    /* åå§åèªå®ä¹ä»£ç å */
    function initBlocks() {
        /* custom block: PTP */
        Blockly.Blocks['gotofunction'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 499, 1), "RADIUS")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherSingleDataArr), "ISOFFSET")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Blocks['ptp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 499, 1), "RADIUS")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherSingleDataArr), "ISOFFSET")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ptp'] = function (block) {
            var dropdown_pointname = block.getFieldValue('POINTNAME');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            var drop_value = block.getFieldValue('DROPVALUE');
            var number_radius = block.getFieldValue('RADIUS');
            var dropdown_isoffset = block.getFieldValue('ISOFFSET');
            // TODO: Assemble Lua into code variable.
            var code = "";
            if (drop_value == 0) {
                code = 'PTP(' + dropdown_pointname + ',' + number_debugspeed + ',' + number_radius + ',' + dropdown_isoffset + ')\n';
            } else {
                code = 'PTP(' + dropdown_pointname + ',' + number_debugspeed + ',' + drop_value + ',' + dropdown_isoffset + ')\n';
            }
            return code;
        };

        /** PTPââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['PtpFIRPlanningStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_start + ')')
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 1), "ANGLEACC")
                    .appendField(",")
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "ANGLEJERT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['PtpFIRPlanningStart'] = function (block) {
            var number_angleAcc = block.getFieldValue('ANGLEACC');
            var number_anglejerk = block.getFieldValue('ANGLEJERT');
            // TODO: Assemble Lua into code variable.
            var code = "PtpFIRPlanningStart(" + number_angleAcc + ',' + number_anglejerk + ")\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['PtpFIRPlanningEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['PtpFIRPlanningEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "PtpFIRPlanningEnd()\n";
            return code;
        };
        /** ./PTPââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */

        /** PTPè¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['ptpAccSmoothStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_start + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ptpAccSmoothStart'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothStart()\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['ptpAccSmoothEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ptpAccSmoothEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothEnd()\n";
            return code;
        };
        /** ./è¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */

        /* LIN */
        Blockly.Blocks['lin'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name)
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "ISCHOICE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "RADIUS")
                    .appendField(',')
                    .appendField(new Blockly.FieldDropdown(smoothStrategyDataArr), "SMOOTHSTRATEGY")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "ISPOSITION")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherSingleDataArr), "ISOFFSET")
                this.appendDummyInput()
                    .appendField(descriptionData[42].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "JointProtect")
                this.appendDummyInput()
                    .appendField(descriptionData[43].name)
                    .appendField(new Blockly.FieldDropdown(treatStrategyDataArr), "TreatStrategy")
                this.appendDummyInput()
                    .appendField(descriptionData[44].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "AllowSpeedThreshold")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lin'] = function (block) {
            var dropdown_pointname = block.getFieldValue('POINTNAME');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            var is_choice = block.getFieldValue('ISCHOICE');
            var smoothStrategy = block.getFieldValue("SMOOTHSTRATEGY");
            var number_radius = block.getFieldValue('RADIUS');
            var dropdown_position = block.getFieldValue('ISPOSITION');
            var dropdown_isoffset = block.getFieldValue('ISOFFSET');
            var joint_protect = block.getFieldValue('JointProtect');
            var treat_strategy = block.getFieldValue('TreatStrategy');
            var allow_speed_threshold = block.getFieldValue('AllowSpeedThreshold');
            // TODO: Assemble Lua into code variable.
            var code = "";
            if (joint_protect == 0) {
                if (is_choice == -1) {
                    code = 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + is_choice + ',' + dropdown_position + ',' + dropdown_isoffset + ')\n';
                } else {
                    code = 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + number_radius + ',' + dropdown_position + ',' + dropdown_isoffset + (smoothStrategy == 1 ? ',0,0,0,0,0,0,1' : '') + ')\n';
                }
            } else {
                if (is_choice == -1) {
                    if (treat_strategy == 3) {
                        code = 'JointOverSpeedProtectStart(3,' + allow_speed_threshold + ')\n' 
                             + 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + is_choice + ',' + dropdown_position + ',' + dropdown_isoffset + ')\n'
                             + 'JointOverSpeedProtectEnd()\n'; 
                    } else {
                        code = 'JointOverSpeedProtectStart(' + treat_strategy + ',0)\n' 
                             + 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + is_choice + ',' + dropdown_position + ',' + dropdown_isoffset + ')\n'
                             + 'JointOverSpeedProtectEnd()\n';
                    }

                } else {
                    if (treat_strategy == 3) {
                        code = 'JointOverSpeedProtectStart(3,' + allow_speed_threshold + ')\n' 
                             + 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + number_radius + ',' + dropdown_position + ',' + dropdown_isoffset + (smoothStrategy == 1 ? ',0,0,0,0,0,0,1' : '') + ')\n'
                             + 'JointOverSpeedProtectEnd()\n'; 
                    } else {
                        code = 'JointOverSpeedProtectStart(' + treat_strategy + ',0)\n' 
                             + 'Lin(' + dropdown_pointname + ',' + number_debugspeed + ',' + number_radius + ',' + dropdown_position + ',' + dropdown_isoffset + (smoothStrategy == 1 ? ',0,0,0,0,0,0,1' : '') + ')\n'
                             + 'JointOverSpeedProtectEnd()\n'; 
                    }         
                }
            }
            return code;
        };

        /* LIN-è¿æ¸¡ç¹è§åº¦è°è */
        // å¼å§
        Blockly.Blocks['lintranspointanglestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + "(" + langJsonData.commandlist.nodeEditorCommands.motion._trans_point_angle_adjustable_start + ")")
                this.appendDummyInput()
                    .appendField(descriptionData[46].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 1), "ANGLESPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lintranspointanglestart'] = function (block) {
            var angle_speed = block.getFieldValue('ANGLESPEED');
            // TODO: Assemble Lua into code variable.
            var code = 'AngularSpeedStart(' + angle_speed + ')\n' ;
            return code;
        };
        // ç»æ
        Blockly.Blocks['lintranspointangleend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._trans_point_angle_adjustable_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lintranspointangleend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AngularSpeedEnd()\n";
            return code;
        };
        /* ./LIN-è¿æ¸¡ç¹è§åº¦è°è */

        /* LIN-å¥å¼ç¹è§é¿ */
        // å¼å§
        Blockly.Blocks['linsingulavoidstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + "(" + graphInputTitles.motion._singularity_avoidance_start + ")")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._protection_mode)
                    .appendField(new Blockly.FieldDropdown(strangeAvoidStrategyDataArr), "AVOIDSTRTEGY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._shoulderadjustment)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0.01), "AVOIDVALUESHOULDER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._elbow_adjustment)
                    .appendField(new Blockly.FieldNumber(50, 0, 10000, 0.01), "AVOIDVALUEELBOW")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wrist_adjustment)
                    .appendField(new Blockly.FieldNumber(10, 0, 10000, 0.01), "AVOIDVALUEWRIST")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linsingulavoidstart'] = function (block) {
            var avoid_strategy = block.getFieldValue('AVOIDSTRTEGY');
            var avoid_shoulder = block.getFieldValue('AVOIDVALUESHOULDER');
            var avoid_elbow = block.getFieldValue('AVOIDVALUEELBOW');
            var avoid_wrist = block.getFieldValue('AVOIDVALUEWRIST');
            // TODO: Assemble Lua into code variable.
            var code = 'SingularAvoidStart(' + avoid_strategy + ',' + avoid_shoulder + ',' + avoid_elbow + ',' + avoid_wrist + ')\n';
            return code;
        };
        // ç»æ
        Blockly.Blocks['linsingulavoidend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_avoidance_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linsingulavoidend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "SingularAvoidEnd()\n";
            return code;
        };
        /* ./LIN-å¥å¼ç¹è§é¿ */

        /* LIN-å¥å¼ç¹ç©¿è¶ */
        // å¼å§
        Blockly.Blocks['linsingulcrossstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + "(" + graphInputTitles.motion._singularity_crossing_start + ")")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._shoulderadjustment)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0.01), "AVOIDVALUESHOULDER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._elbow_adjustment)
                    .appendField(new Blockly.FieldNumber(50, 0, 10000, 0.01), "AVOIDVALUEELBOW")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wrist_adjustment)
                    .appendField(new Blockly.FieldNumber(10, 0, 10000, 0.01), "AVOIDVALUEWRIST")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linsingulcrossstart'] = function (block) {
            var avoid_shoulder = block.getFieldValue('AVOIDVALUESHOULDER');
            var avoid_elbow = block.getFieldValue('AVOIDVALUEELBOW');
            var avoid_wrist = block.getFieldValue('AVOIDVALUEWRIST');
            // TODO: Assemble Lua into code variable.
            var code = 'SingularAvoidStart(2,' + avoid_shoulder + ',' + avoid_elbow + ',' + avoid_wrist + ')\n';
            return code;
        };
        // ç»æ
        Blockly.Blocks['linsingulcrossend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_crossing_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linsingulcrossend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "SingularAvoidEnd()\n";
            return code;
        };
        /* ./LIN-å¥å¼ç¹è§é¿ */

        /** LINââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['linFIRPlanningStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_start + ')')
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 15000, 1), "ANGLEACC")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_jerk)
                    .appendField(new Blockly.FieldNumber(0, 0, 150000, 1), "ANGLEJERK")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._linear_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 15000, 1), "LINEARACC")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._linear_jerk)
                    .appendField(new Blockly.FieldNumber(0, 0, 150000, 1), "LINEARJERK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linFIRPlanningStart'] = function (block) {
            var number_angleAcc = block.getFieldValue('ANGLEACC');
            var number_angleJerk = block.getFieldValue('ANGLEJERK');
            var number_linearAcc = block.getFieldValue('LINEARACC');
            var number_linearJerk = block.getFieldValue('LINEARJERK');
            // TODO: Assemble Lua into code variable.
            var code = "LinArcFIRPlanningStart(" + number_angleAcc + ',' + number_angleJerk + ',' + number_linearAcc + ',' + number_linearJerk + ")\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['linFIRPlanningEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linFIRPlanningEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "LinArcFIRPlanningEnd()\n";
            return code;
        };
        /** ./LINââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */

        /* LIN-seamPos */
        Blockly.Blocks['linseampos'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(seamPos)')
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._smooth_stop)
                    .appendField(new Blockly.FieldDropdown(setTPDModeArr), "STOP")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._smooth_trans_radius)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'SMOOTH')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._smooth_trans_mode)
                    .appendField(new Blockly.FieldDropdown(smoothStrategyDataArr), "SMOOTHSTRATEGY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weld_record)
                    .appendField(new Blockly.FieldDropdown(weldRecordDataArr), "CHOICE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._tech_plate_type)
                    .appendField(new Blockly.FieldDropdown(TplateTypeArr), "TYPE")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "OFFSET")
                this.appendDummyInput()
                    .appendField('dx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINX')
                    .appendField(',')
                    .appendField('dy')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINY')
                    .appendField(',')
                    .appendField('dz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINZ')
                this.appendDummyInput()
                    .appendField('drx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINRX')
                    .appendField(',')
                    .appendField('dry')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINRY')
                    .appendField(',')
                    .appendField('drz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'LINRZ')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linseampos'] = function (block) {
            var point = block.getFieldValue('POINTNAME');
            var speed = block.getFieldValue('DEBUGSPEED');
            var stop = block.getFieldValue('STOP');
            var smoothStrategy = block.getFieldValue("SMOOTHSTRATEGY");
            var smooth = block.getFieldValue('SMOOTH');
            var choice = block.getFieldValue('CHOICE');
            var type = block.getFieldValue('TYPE');
            var offset = block.getFieldValue('OFFSET');
            var x = block.getFieldValue('LINX');
            var y = block.getFieldValue('LINY');
            var z = block.getFieldValue('LINZ');
            var rx = block.getFieldValue('LINRX');
            var ry = block.getFieldValue('LINRY');
            var rz = block.getFieldValue('LINRZ');
            // TODO: Assemble Lua into code variable.
            var code = "";
            if (offset == 0) {
                code = `Lin(${point},${speed},${stop == 'true' ? -1 : smooth},${choice},${type},${offset}${smoothStrategy == 1 && stop != 'true' ? ',0,0,0,0,0,0,1' : ''})\n`;
            } else {
                code = `Lin(${point},${speed},${stop == 'true' ? -1 : smooth},${choice},${type},${offset},${x},${y},${z},${rx},${ry},${rz}${smoothStrategy == 1 && stop != 'true' ? ',1' : ''})\n`;
            }
            return code;
        };

        /** Linè¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['linAccSmoothStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_start + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linAccSmoothStart'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothStart()\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['linAccSmoothEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[1].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['linAccSmoothEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothEnd()\n";
            return code;
        };
        /** ./è¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */

        /* ARC */
        Blockly.Blocks['arc'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name)
                this.appendDummyInput()
                    .appendField(commandNameData[0].name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME1")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED1")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 499, 1), "RADIUS")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherSingleDataArr), "ISOFFSET1")
                this.appendDummyInput()
                    .appendField(commandNameData[2].name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME2")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME3")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED2")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arc'] = function (block) {
            var dropdown_pointname1 = block.getFieldValue('POINTNAME1');
            var dropdown_pointname2 = block.getFieldValue('POINTNAME2');
            var dropdown_pointname3 = block.getFieldValue('POINTNAME3');
            var number_debugspeed1 = block.getFieldValue('DEBUGSPEED1');
            var number_debugspeed2 = block.getFieldValue('DEBUGSPEED2');
            var number_radius = block.getFieldValue('RADIUS');
            var dropdown_isoffset1 = block.getFieldValue('ISOFFSET1');
            // TODO: Assemble Lua into code variable.
            var code = 'PTP(' + dropdown_pointname1 + ',' + number_debugspeed1 + ',' + number_radius + ',' + dropdown_isoffset1 + ')\n' 
                + 'ARC(' + dropdown_pointname2 + ',0,0,0,0,0,0,0,' + dropdown_pointname3 + ',0,0,0,0,0,0,0,' + number_debugspeed2 + ',-1' + ')\n';
            return code;
        };

        /* ARC--å¥å¼ç¹è§é¿ */
        // å¼å§
        Blockly.Blocks['arcsingulavoidstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_avoidance_start + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._protection_mode)
                    .appendField(new Blockly.FieldDropdown(strangeAvoidStrategyDataArr), "AVOIDSTRTEGY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._shoulderadjustment)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0.01), "AVOIDVALUESHOULDER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._elbow_adjustment)
                    .appendField(new Blockly.FieldNumber(50, 0, 10000, 0.01), "AVOIDVALUEELBOW")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wrist_adjustment)
                    .appendField(new Blockly.FieldNumber(10, 0, 10000, 0.01), "AVOIDVALUEWRIST")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcsingulavoidstart'] = function (block) {
            var avoid_strategy = block.getFieldValue('AVOIDSTRTEGY');
            var avoid_shoulder = block.getFieldValue('AVOIDVALUESHOULDER');
            var avoid_elbow = block.getFieldValue('AVOIDVALUEELBOW');
            var avoid_wrist = block.getFieldValue('AVOIDVALUEWRIST');
            // TODO: Assemble Lua into code variable. 
            var code = 'SingularAvoidStart(' + avoid_strategy + ',' + avoid_shoulder + ',' + avoid_elbow + ',' + avoid_wrist + ')\n';
            return code;
        };
        // ç»æ
        Blockly.Blocks['arcsingulavoidend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_avoidance_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcsingulavoidend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "SingularAvoidEnd()\n";
            return code;
        };
        /* ./ARC--å¥å¼ç¹è§é¿ */

        /* ARC--å¥å¼ç¹ç©¿è¶ */
        // å¼å§
        Blockly.Blocks['arcsingulcrossstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_crossing_start + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._shoulderadjustment)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0.01), "AVOIDVALUESHOULDER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._elbow_adjustment)
                    .appendField(new Blockly.FieldNumber(50, 0, 10000, 0.01), "AVOIDVALUEELBOW")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wrist_adjustment)
                    .appendField(new Blockly.FieldNumber(10, 0, 10000, 0.01), "AVOIDVALUEWRIST")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcsingulcrossstart'] = function (block) {
            var avoid_shoulder = block.getFieldValue('AVOIDVALUESHOULDER');
            var avoid_elbow = block.getFieldValue('AVOIDVALUEELBOW');
            var avoid_wrist = block.getFieldValue('AVOIDVALUEWRIST');
            // TODO: Assemble Lua into code variable. 
            var code = 'SingularAvoidStart(2,' + avoid_shoulder + ',' + avoid_elbow + ',' + avoid_wrist + ')\n';
            return code;
        };
        // ç»æ
        Blockly.Blocks['arcsingulcrossend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._singularity_crossing_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcsingulcrossend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "SingularAvoidEnd()\n";
            return code;
        };
        /* ./ARC--å¥å¼ç¹è§é¿ */

        /** ARCââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['arcFIRPlanningStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_start + ')')
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 15000, 1), "ANGLEACC")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._angular_jerk)
                    .appendField(new Blockly.FieldNumber(0, 0, 150000, 1), "ANGLEJERK")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._linear_acceleration)
                    .appendField(new Blockly.FieldNumber(0, 0, 15000, 1), "LINEARACC")
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.motion._linear_jerk)
                    .appendField(new Blockly.FieldNumber(0, 0, 150000, 1), "LINEARJERK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcFIRPlanningStart'] = function (block) {
            var number_angleAcc = block.getFieldValue('ANGLEACC');
            var number_angleJerk = block.getFieldValue('ANGLEJERK');
            var number_linearAcc = block.getFieldValue('LINEARACC');
            var number_linearJerk = block.getFieldValue('LINEARJERK');
            // TODO: Assemble Lua into code variable.
            var code = "LinArcFIRPlanningStart(" + number_angleAcc + ',' + number_angleJerk + ',' + number_linearAcc + ',' + number_linearJerk + ")\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['arcFIRPlanningEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._time_optimization_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcFIRPlanningEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "LinArcFIRPlanningEnd()\n";
            return code;
        };
        /** ./ARCââè¿å¨ä¿æ¤ï¼æ¶é´æä¼æ¨¡å¼ */

        /** ARCè¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['arcAccSmoothStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_start + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcAccSmoothStart'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothStart()\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['arcAccSmoothEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[2].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcAccSmoothEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothEnd()\n";
            return code;
        };
        /** ./è¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */

        /* SPLINEï¼SPTP */
        Blockly.Blocks['sptp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("SplineStart()");
                this.appendDummyInput()
                    .appendField("SPTP")
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                this.appendDummyInput()
                    .appendField("SplineEnd()");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['sptp'] = function (block) {
            var dropdown_pointname = block.getFieldValue('POINTNAME');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            // TODO: Assemble Lua into code variable.
            var code = 'SplineStart()\n'
                + 'SPTP(' + dropdown_pointname + ',' + number_debugspeed + ')\n'
                + 'SplineEnd()\n';
            return code;
        };

        /* SPLINEï¼SLIN */
        Blockly.Blocks['slin'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("SplineStart()");
                this.appendDummyInput()
                    .appendField("SLIN")
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                this.appendDummyInput()
                    .appendField("SplineEnd()");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['slin'] = function (block) {
            var dropdown_pointname = block.getFieldValue('POINTNAME');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            // TODO: Assemble Lua into code variable.
            var code = 'SplineStart()\n'
                + 'SLIN(' + dropdown_pointname + ',' + number_debugspeed + ')\n'
                + 'SplineEnd()\n';
            return code;
        };

        /* SPLINEï¼SCIRC */
        Blockly.Blocks['scric'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("SplineStart()");
                this.appendDummyInput()
                    .appendField("SCIRC")
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME1")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME2")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                this.appendDummyInput()
                    .appendField("SplineEnd()");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['scric'] = function (block) {
            var dropdown_pointname1 = block.getFieldValue('POINTNAME1');
            var dropdown_pointname2 = block.getFieldValue('POINTNAME2');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            // TODO: Assemble Lua into code variable.
            var code = 'SplineStart()\n'
                + 'SCIRC(' + dropdown_pointname1 + ',' + dropdown_pointname2 + ',' + number_debugspeed + ')\n'
                + 'SplineEnd()\n';
            return code;
        };

        /* CIRCLE */
        Blockly.Blocks['circle'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[0].name)
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAMEPTP")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 499, 1), "RADIUS")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(whetherSingleDataArr), "ISOFFSETPTP")
                this.appendDummyInput()
                    .appendField(commandNameData[3].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset_type)
                    .appendField(new Blockly.FieldDropdown(offsetTypeDataArr), "OFFSETTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._circle1_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME1")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(offsetFlagDataArr), "ISOFFSET1")
                this.appendDummyInput()
                    .appendField('dx')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEX1')
                    .appendField(',')
                    .appendField('dy')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEY1')
                    .appendField(',')
                    .appendField('dz')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEZ1')
                this.appendDummyInput()
                    .appendField('drx')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERX1')
                    .appendField(',')
                    .appendField('dry')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERY1')
                    .appendField(',')
                    .appendField('drz')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERZ1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._circle2_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME2")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(offsetFlagDataArr), "ISOFFSET2")
                this.appendDummyInput()
                    .appendField('dx')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEX2')
                    .appendField(',')
                    .appendField('dy')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEY2')
                    .appendField(',')
                    .appendField('dz')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLEZ2')
                this.appendDummyInput()
                    .appendField('drx')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERX2')
                    .appendField(",")
                    .appendField('dry')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERY2')
                    .appendField(',')
                    .appendField('drz')
                    .appendField(new Blockly.FieldNumber(0, 0, 300, 0), 'CIRCLERZ2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED2")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "ISCHOICE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "SMOOTHRADIUS")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['circle'] = function (block) {
            var pointptp = block.getFieldValue('POINTNAMEPTP');
            var speed = block.getFieldValue('DEBUGSPEED');
            var number_radius = block.getFieldValue('RADIUS');
            var offset0 = block.getFieldValue('ISOFFSETPTP');
            var type = block.getFieldValue('OFFSETTYPE');
            var name1 = block.getFieldValue('POINTNAME1');
            var offset1 = block.getFieldValue('ISOFFSET1');
            var x1 = block.getFieldValue('CIRCLEX1');
            var y1 = block.getFieldValue('CIRCLEY1');
            var z1 = block.getFieldValue('CIRCLEZ1');
            var rx1 = block.getFieldValue('CIRCLERX1');
            var ry1 = block.getFieldValue('CIRCLERY1');
            var rz1 = block.getFieldValue('CIRCLERZ1');
            var name2 = block.getFieldValue('POINTNAME2');
            var offset2 = block.getFieldValue('ISOFFSET2');
            var x2 = block.getFieldValue('CIRCLEX2');
            var y2 = block.getFieldValue('CIRCLEY2');
            var z2 = block.getFieldValue('CIRCLEZ2');
            var rx2 = block.getFieldValue('CIRCLERX2');
            var ry2 = block.getFieldValue('CIRCLERY2');
            var rz2 = block.getFieldValue('CIRCLERZ2');
            var speed2 = block.getFieldValue('DEBUGSPEED2');
            var is_choice = block.getFieldValue('ISCHOICE');
            var smooth_radius = block.getFieldValue('SMOOTHRADIUS');
            // TODO: Assemble Lua into code variable. 
            //ç¸ååç§»é -- è®¾ç½®ä¸ä¸ªåç§»é
            if (type == 1) {
                if (offset2 == 0) {
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},${name2},${speed2},${offset2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`;
                } else {
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},${name2},${speed2},${offset2},${x2},${y2},${z2},${rx2},${ry2},${rz2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`
                }
            } else {
                //ä¸ååç§»é -- åå«è®¾ç½®ä¸¤ä¸ªåç§»é
                if (offset1 == 0 && offset2 == 0) {
                    //ç¹1ãç¹2é½ä¸åç§»
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},${name2},${speed2},${offset2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`;
                } else if (offset1 != 0 && offset2 == 0) {
                    //åªæç¹1åç§»
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},${offset1},${x1},${y1},${z1},${rx1},${ry1},${rz1},${name2},0,${speed2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`;
                } else if (offset1 == 0 && offset2 != 0) {
                    //åªæç¹2åç§»
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},0,${name2},${offset2},${x2},${y2},${z2},${rx2},${ry2},${rz2},${speed2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`;
                } else {
                    // ç¹1ãç¹2é½åç§»
                    var code = 'PTP(' + pointptp + ',' + speed + ',' + number_radius + ',' + offset0 + ')\n' 
                             + `Circle(${name1},${offset1},${x1},${y1},${z1},${rx1},${ry1},${rz1},${name2},${offset2},${x2},${y2},${z2},${rx2},${ry2},${rz2},${speed2}${is_choice == -1 ? ',-1' : `,${smooth_radius}`})\n`
                }
            }
            return code;
        };

        /** Circleè¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */
        // å¼å§
        Blockly.Blocks['circleAccSmoothStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[3].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_start + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['circleAccSmoothStart'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothStart()\n";
            return code;
        };
        // ç»æ
        Blockly.Blocks['circleAccSmoothEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[3].name + '(' + langJsonData.commandlist.nodeEditorCommands.motion._acc_smooth_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['circleAccSmoothEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothEnd()\n";
            return code;
        };
        /** ./è¿å¨ä¿æ¤ï¼å éåº¦å¹³æ»æ¨¡å¼ */

        /* èºæSpiral */
        Blockly.Blocks['spiral'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[1].children[4].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral1_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral2_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral3_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(offsetFlagDataArr), "WHETHEROFFSET")
                this.appendDummyInput()
                    .appendField('dx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALX')
                    .appendField(',')
                    .appendField('dy')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALY')
                    .appendField(',')
                    .appendField('dz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALZ')
                this.appendDummyInput()
                    .appendField('drx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALRX')
                    .appendField(",")
                    .appendField('dry')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALRY')
                    .appendField(',')
                    .appendField('drz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'SPIRALRZ')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_circle_num)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "CIRCLENUMBER")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._angle_correct_rx)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "ANGLERX")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._angle_correct_ry)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "ANGLERY")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._angle_correct_rz)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "ANGLERZ")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_radius_add)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "ADDVALUE")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._spiral_rotaxis_add)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "TRANSVALUE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['spiral'] = function (block) {
            var point1 = block.getFieldValue('POINT1');
            var point2 = block.getFieldValue('POINT2');
            var point3 = block.getFieldValue('POINT3');
            var speed = block.getFieldValue('SPEED');
            var whether = block.getFieldValue('WHETHEROFFSET');
            var x = block.getFieldValue('SPIRALX');
            var y = block.getFieldValue('SPIRALY');
            var z = block.getFieldValue('SPIRALZ');
            var rx = block.getFieldValue('SPIRALRX');
            var ry = block.getFieldValue('SPIRALRY');
            var rz = block.getFieldValue('SPIRALRZ');
            var number = block.getFieldValue('CIRCLENUMBER');
            var angle_rx = block.getFieldValue('ANGLERX');
            var angle_ry = block.getFieldValue('ANGLERY');
            var angle_rz = block.getFieldValue('ANGLERZ');
            var add_value = block.getFieldValue('ADDVALUE');
            var trans_value = block.getFieldValue('TRANSVALUE');
            // TODO: Assemble Lua into code variable. 
            if (whether == 0) {
                var code = `Spiral(${point1},${point2},${point3},${speed},${whether},0,0,0,0,0,0,${number},${angle_rx},${angle_ry},${angle_rz},${add_value},${trans_value})\n`
            } else {
                var code = `Spiral(${point1},${point2},${point3},${speed},${whether},${x},${y},${z},${rx},${ry},${rz},${number},${angle_rx},${angle_ry},${angle_rz},${add_value},${trans_value})\n`
            }
            return code;
        };

        /* æ°èºæN-Spiral */
        Blockly.Blocks['nspiral'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[1].children[5].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT1")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(nSpiralOffsetFlagDataArr), "WHETHEROFFSET")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._spiral_circle_num)
                    .appendField(new Blockly.FieldNumber(5, 0, 100, 1), "CIRCLENUMBER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_dip_angle)
                    .appendField(new Blockly.FieldNumber(30, 0, 45, 1), "ROATEANGLE")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._spiral_oringin_radius)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "INITIALRADIUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_radius_add)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 1), "ADDVALUE")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._spiral_rotaxis_add)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 1), "ROTATEVALUE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spiral_direction)
                    .appendField(new Blockly.FieldDropdown(spiralDirectionDataArr), "ROTATEDIRECTION")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['nspiral'] = function (block) {
            var point1 = block.getFieldValue('POINT1');
            var speed = block.getFieldValue('SPEED');
            var whether = block.getFieldValue('WHETHEROFFSET');
            var number = block.getFieldValue('CIRCLENUMBER');
            var angle = block.getFieldValue('ROATEANGLE');
            var radius = block.getFieldValue('INITIALRADIUS');
            var add_value = block.getFieldValue('ADDVALUE');
            var rotate_value = block.getFieldValue('ROTATEVALUE');
            var rotate_direction = block.getFieldValue('ROTATEDIRECTION');
            // TODO: Assemble Lua into code variable. 
            var code = `PTP(${point1},${speed},0,${whether},${radius},0,0,-${angle},0,0)\n`
                     + `NewSpiral(${point1},${speed},${whether},${radius},0,0,-${angle},0,0,${number},${angle},${radius},${add_value},${rotate_value},${rotate_direction})\n`
            return code;
        };

        /* æ ·æ¡Splineå¼å§ */
        Blockly.Blocks['splinestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spline_start)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['splinestart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'SplineStart()\n' 
            return code;
        };

        /* æ ·æ¡Splineç»æ */
        Blockly.Blocks['splineend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spline_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['splineend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'SplineEnd()\n' 
            return code;
        };

        /* æ ·æ¡Spline-SPTP */
        Blockly.Blocks['splinesptp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._spline_start + '(SPTP)')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name + '(SPL)')
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['splinesptp'] = function (block) {
            var point = block.getFieldValue('POINT');
            var speed = block.getFieldValue('SPEED');
            // TODO: Assemble Lua into code variable. 
            var code = 'SPTP(' + point + ',' + speed + ')\n' 
            return code;
        };

        /* æ°æ ·æ¡Splineå¼å§ */
        Blockly.Blocks['newsplinestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[148].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._control_mode)
                    .appendField(new Blockly.FieldDropdown(newSplineModeDataArr), "MODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._global_average_connect_time)
                    .appendField(new Blockly.FieldNumber(2000, 0, 2000, 1), "SPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['newsplinestart'] = function (block) {
            var model = block.getFieldValue('MODE');
            var speed = block.getFieldValue('SPEED');
            // TODO: Assemble Lua into code variable. 
            var code = 'NewSplineStart(' + model + ',' + speed + ')\n' 
            return code;
        };

        /* æ°æ ·æ¡Splineç»æ */
        Blockly.Blocks['newsplineend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[149].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['newsplineend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'NewSplineEnd(' + ')\n' 
            return code;
        };

        /* æ°æ ·æ¡Spline-SPL */
        Blockly.Blocks['newsplinespl'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[148].name + '(SPL)')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINT")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._smooth_radius)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 1), "SMOOTHRADIUS")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._new_spline_last_flag)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WHETHER")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['newsplinespl'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point = block.getFieldValue('POINT');
            var speed = block.getFieldValue('SPEED');
            var smooth_radius = block.getFieldValue('SMOOTHRADIUS');
            var whether = block.getFieldValue('WHETHER');
            var code = 'NewSP(' + point + ',' + speed + ',' + smooth_radius + ',' + whether + ')\n' 
            return code;
        };

        /* æå¨æ¸åå¼å§ */
        Blockly.Blocks['WeaveChangeStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weave_gradient_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weave_gradient_mode)
                    .appendField(new Blockly.FieldDropdown(gradientModeArr), "GRADIENTMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weave_gradient_start_speed)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "STRATSPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weave_gradient_end_speed)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "ENDSPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['WeaveChangeStart'] = function (block) {
            var number_weaveid = block.getFieldValue('WEAVEID');
            var gradientMode = block.getFieldValue('GRADIENTMODE');
            var startSpeed = block.getFieldValue('STRATSPEED');
            var endSpeed = block.getFieldValue('ENDSPEED');
            // TODO: Assemble Lua into code variable.
            var code = 'WeaveChangeStart(' + gradientMode + ',' + number_weaveid + ',' + (startSpeed ? startSpeed : 0) + ',' + (endSpeed ? endSpeed : 0) + ')\n';
            return code;
        };

        /* æå¨æ¸åç»æ */
        Blockly.Blocks['WeaveChangeEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weave_gradient_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['WeaveChangeEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'WeaveChangeEnd()\n';
            return code;
        };

        /* å®ç¹æå¨å¼å§ */
        Blockly.Blocks['OriginPointWeaveStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._fixed_oscillation_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._oscillation_reference)
                    .appendField(new Blockly.FieldDropdown(fixWeaveDatumArr), "FIXDATUM")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._reference_point)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "FIXPOINT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._oscillation_time)
                    .appendField(new Blockly.FieldNumber(0, 0, 500, 0.1), "FIXTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['OriginPointWeaveStart'] = function (block) {
            var weaveId = block.getFieldValue('WEAVEID');
            var fixDatum = block.getFieldValue('FIXDATUM');
            var fixPoint = block.getFieldValue('FIXPOINT');
            var fixTime = block.getFieldValue('FIXTIME');
            // TODO: Assemble Lua into code variable.
            var code = '';
            code += 'OriginPointWeaveStart(' + weaveId + ',' + fixDatum + ',' + (fixDatum == '0' ? '' : `${fixPoint},`) + fixTime + ')\n';
            code += 'MoveStationary()\n';
            return code;
        };

        /* å®ç¹æå¨ç»æ */
        Blockly.Blocks['OriginPointWeaveEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._fixed_oscillation_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['OriginPointWeaveEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'OriginPointWeaveEnd()\n';
            return code;
        };
        
        /* æå¨ä»¿çå¼å§ */
        Blockly.Blocks['weavestartsim'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[139].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weavestartsim'] = function (block) {
            var id = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable. 
            var code = 'WeaveStartSim(' + id + ')\n' 
            return code;
        };
        
        /* æå¨ä»¿çç»æ */
        Blockly.Blocks['weaveendsim'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[140].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weaveendsim'] = function (block) {
            var id = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable. 
            var code = 'WeaveEndSim(' + id + ')\n' 
            return code;
        };
        
        /* å¼å§è½¨è¿¹é¢è­¦ */
        Blockly.Blocks['weaveinspectstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weavesine_start_warning)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weaveinspectstart'] = function (block) {
            var id = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable. 
            var code = 'WeaveInspectStart(' + id + ')\n' 
            return code;
        };
        
        /* åæ­¢è½¨è¿¹é¢è­¦ */
        Blockly.Blocks['weaveinspectend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weavesine_end_warning)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weaveinspectend'] = function (block) {
            var id = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable. 
            var code = 'WeaveInspectEnd(' + id + ')\n' 
            return code;
        };
        
        /* åç§»å¼å¯ */
        Blockly.Blocks['pointsoffsetenable'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset_open)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset_coordinate)
                    .appendField(new Blockly.FieldDropdown(axisTypeDataArr), "AXISTYPE")
                this.appendDummyInput()
                    .appendField('âx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE1")
                    .appendField(',')
                    .appendField('ây')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE2")
                    .appendField(',')
                    .appendField('âz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE3")
                this.appendDummyInput()
                    .appendField('ârx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE4")
                    .appendField(',')
                    .appendField('âry')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE5")
                    .appendField(',')
                    .appendField('ârz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 1), "VALUE6")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['pointsoffsetenable'] = function (block) {
            var type = block.getFieldValue('AXISTYPE');
            var value1 = block.getFieldValue('VALUE1');
            var value2 = block.getFieldValue('VALUE2');
            var value3 = block.getFieldValue('VALUE3');
            var value4 = block.getFieldValue('VALUE4');
            var value5 = block.getFieldValue('VALUE5');
            var value6 = block.getFieldValue('VALUE6');
            // TODO: Assemble Lua into code variable. 
            var code = 'PointsOffsetEnable(' + type + ',' + value1 + ',' + value2 + ',' + value3 + ',' + value4 + ',' + value5 + ',' + value6 + ')\n' 
            return code;
        };
        
        /* åç§»ç»æ */
        Blockly.Blocks['pointsoffsetdisable'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset_close)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['pointsoffsetdisable'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'PointsOffsetDisable()\n' 
            return code;
        };
        
        /* ä¼ºæç¬å¡å°ç©ºé´è¿å¨ */
        Blockly.Blocks['servocart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._cartesian_space_motion)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._motion_mode)
                    .appendField(new Blockly.FieldDropdown(servoCModeDataArr), "WEAVEMODE")
                    .appendField(',')
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE1")
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE2")
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE3")
                this.appendDummyInput()
                    .appendField('Rx')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE4")
                    .appendField(',')
                    .appendField('Ry')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE5")
                    .appendField(',')
                    .appendField('Rz')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "VALUE6")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._scale_factor + 'x')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE7")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._scale_factor + 'y')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE8")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._scale_factor + 'z')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE9")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._scale_factor + 'rx')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE10")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._scale_factor + 'ry')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE11")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._scale_factor + 'rz')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "VALUE12")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_acc)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "VALUE13")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._search_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "VALUE14")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._command_cycle)
                    .appendField(new Blockly.FieldNumber(0.001, 0.001, 0.016, 0.001), "VALUE15")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._lookahead_time)
                    .appendField(new Blockly.FieldNumber(1, 0, 1000, 0.01), "VALUE16")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._gain)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0.01), "VALUE17")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['servocart'] = function (block) {
            var weave_mode = block.getFieldValue('WEAVEMODE');
            var value1 = block.getFieldValue('VALUE1');
            var value2 = block.getFieldValue('VALUE2');
            var value3 = block.getFieldValue('VALUE3');
            var value4 = block.getFieldValue('VALUE4');
            var value5 = block.getFieldValue('VALUE5');
            var value6 = block.getFieldValue('VALUE6');
            var value7 = block.getFieldValue('VALUE7');
            var value8 = block.getFieldValue('VALUE8');
            var value9 = block.getFieldValue('VALUE9');
            var value10 = block.getFieldValue('VALUE10');
            var value11 = block.getFieldValue('VALUE11');
            var value12 = block.getFieldValue('VALUE12');
            var value13 = block.getFieldValue('VALUE13');
            var value14 = block.getFieldValue('VALUE14');
            var value15 = block.getFieldValue('VALUE15');
            var value16 = block.getFieldValue('VALUE16');
            var value17 = block.getFieldValue('VALUE17');
            // TODO: Assemble Lua into code variable. 
            var code = 'ServoCart('+ weave_mode + ',' + value1 + ',' + value2 + ',' + value3 + ',' + value4 + ',' + value5 + ',' + value6 + ',' + value7 + ',' + value8 + ',' + value9 + ',' + value10 + ',' + value11 + ',' + value12 + ',' + value13 + ',' + value14 + ',' + value15 + ',' + value16 + ',' + value17 + ')\n' 
            return code;
        };

        /* ä¼ºæå³èç©ºé´è¿å¨ */
        Blockly.Blocks['servoj'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._joint_space_motion)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._joints_location + '(Â°)')
                    .appendField(':')
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTX")
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTY")
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTZ")
                    .appendField(',')
                    .appendField('Rx')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTRX")
                    .appendField(',')
                    .appendField('Ry')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTRY")
                    .appendField(',')
                    .appendField('Rz')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "JOINTRZ")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._extended_axis_position + '(mm)')
                    .appendField(':')
                    .appendField('Ext.1')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "EXTPOS1")
                    .appendField(',')
                    .appendField('Ext.2')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "EXTPOS2")
                    .appendField(',')
                    .appendField('Ext.3')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "EXTPOS3")
                    .appendField(',')
                    .appendField('Ext.4')
                    .appendField(new Blockly.FieldNumber(0, -300, 300, 0.01), "EXTPOS4")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_acc)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "ACC")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._search_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._command_cycle)
                    .appendField(new Blockly.FieldNumber(0.001, 0.001, 0.016, 0.001), "CYCLE")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['servoj'] = function (block) {
            var jointX = block.getFieldValue('JOINTX');
            var jointY = block.getFieldValue('JOINTY');
            var jointZ = block.getFieldValue('JOINTZ');
            var jointRx = block.getFieldValue('JOINTRX');
            var jointRy = block.getFieldValue('JOINTRY');
            var jointRz = block.getFieldValue('JOINTRZ');
            var exPos1 = block.getFieldValue('EXTPOS1');
            var exPos2 = block.getFieldValue('EXTPOS2');
            var exPos3 = block.getFieldValue('EXTPOS3');
            var exPos4 = block.getFieldValue('EXTPOS4');
            var acc = block.getFieldValue('ACC');
            var speed = block.getFieldValue('SPEED');
            var cycle = block.getFieldValue('CYCLE');
            // TODO: Assemble Lua into code variable. 
            var code = `ServoJ(${jointX},${jointY},${jointZ},${jointRx},${jointRy},${jointRz},${exPos1},${exPos2},${exPos3},${exPos4},${acc},${speed},${cycle},0,0)\n` 
            return code;
        };

        /* è½¨è¿¹è¿å¨ */
        Blockly.Blocks['trajectory'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[1].children[13].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._select_traj_file)
                    .appendField(new Blockly.FieldDropdown(trajFileNameArr), "TRAJECTORYFILE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['trajectory'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var file = block.getFieldValue('TRAJECTORYFILE');
            var speed = block.getFieldValue('SPEED');
            var trajPath = g_systemFlag ? `/usr/local/etc/controller/lua/traj/` : `/fruser/traj/`;
            var startPose = `startPose = GetTrajectoryStartPose(\"${trajPath}${file}\")`;
            var toolNum = `tool_num = GetActualTCPNum()`;
            var wobjNum = `wobj_num = GetActualWObjNum()`;
            var moveCart = `MoveCart(startPose,tool_num,wobj_num,100.0,100.0,${speed},-1.0,-1)`;
            var moveTrajectory = `MoveTrajectory(\"${trajPath}${file}\",${speed})`;
            var printTrajPointNum = `num = GetTrajectoryPointNum()\nRegisterVar(\"number\",\"num\")`;
            var code = `LoadTrajectory(\"${trajPath}${file}\")\n${startPose}\n${toolNum}\n${wobjNum}\n${moveCart}\n${moveTrajectory}\n${printTrajPointNum}\n`
            return code;
        };

        /* è½¨è¿¹è¿å¨J */
        Blockly.Blocks['trajectoryJ'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[1].children[14].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._select_traj_file)
                    .appendField(new Blockly.FieldDropdown(trajFileNameArr), "TRAJECTORYFILE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._traj_mode)
                    .appendField(new Blockly.FieldDropdown(trajectoryJModeArr), "TRAJECTORYMODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['trajectoryJ'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var file = block.getFieldValue('TRAJECTORYFILE');
            var speed = block.getFieldValue('SPEED');
            var mode = block.getFieldValue('TRAJECTORYMODE');
            var trajPath = g_systemFlag ? `/usr/local/etc/controller/lua/traj/` : `/fruser/traj/`;
            var startPose = `startPose = GetTrajectoryStartPose(\"${trajPath}${file}\")`;
            var toolNum = `tool_num = GetActualTCPNum()`;
            var wobjNum = `wobj_num = GetActualWObjNum()`;
            var moveCart = `MoveCart(startPose,tool_num,wobj_num,100.0,100.0,${speed},-1.0,-1)`;
            var moveTrajectory = `MoveTrajectoryJ()`;
            var printTrajPointNum = `num = GetTrajectoryPointNum()\nRegisterVar(\"number\",\"num\")`;
            var code = `LoadTrajectoryJ(\"${trajPath}${file}\",${speed},${mode})\n${startPose}\n${toolNum}\n${wobjNum}\n${moveCart}\n${moveTrajectory}\n${printTrajPointNum}\n`
            return code;
        };

        /* è½¨è¿¹è¿å¨åç» */
        Blockly.Blocks['trajectoryLA'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[1].children[15].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._select_traj_file)
                    .appendField(new Blockly.FieldDropdown(trajFileNameArr), "TRAJECTORYFILE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._curve_fitting_method)
                    .appendField(new Blockly.FieldDropdown(curveFittingArr), "CURVEFITTING")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._error_limits)
                    .appendField(new Blockly.FieldNumber(0, 1, 100, 0.1), "MISTAKE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._smooth_curve_method)
                    .appendField(new Blockly.FieldDropdown(curveFittingSmoothArr), "CURVEFITTINGSMOOTH")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._smooth_acc)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0.1), "SMOOTH")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._maximum_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0.1), "MAXSPEED")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._maximum_acceleration)
                    .appendField(new Blockly.FieldNumber(100, 0, 2000, 0.1), "MAXACC")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._maximum_jerk)
                    .appendField(new Blockly.FieldNumber(100, 0, 4000, 0.1), "MAXJERK")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._uniform_motion)
                    .appendField(new Blockly.FieldDropdown(traceIsleftrightDataArr), "UNIFORMMOTION")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['trajectoryLA'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var file = block.getFieldValue('TRAJECTORYFILE');
            var curveFitting = block.getFieldValue('CURVEFITTING');
            var mistake = block.getFieldValue('MISTAKE');
            var curveFittingSmooth = block.getFieldValue('CURVEFITTINGSMOOTH');
            var smooth = block.getFieldValue('SMOOTH');
            var maxSpeed = block.getFieldValue('MAXSPEED');
            var maxAcc = block.getFieldValue('MAXACC');
            var maxJerk = block.getFieldValue('MAXJERK');
            var uniformMode = block.getFieldValue('UNIFORMMOTION');
            var trajPath = g_systemFlag ? `/usr/local/etc/controller/lua/traj/` : `/fruser/traj/`;
            var startPose = `startPose = GetTrajectoryStartPose(\"${trajPath}${file}\")`;
            var toolNum = `tool_num = GetActualTCPNum()`;
            var wobjNum = `wobj_num = GetActualWObjNum()`;
            var moveCart = `MoveCart(startPose,tool_num,wobj_num,100.0,100.0,100.0,-1.0,-1)`;
            var moveTrajectory = `MoveTrajectoryLA(\"${trajPath}${file}\")`;
            var printTrajPointNum = `num = GetTrajectoryPointNum()\nRegisterVar(\"number\",\"num\")`;
            var code = `LoadTrajectoryLA(\"${trajPath}${file}\",${curveFitting},${mistake},${curveFittingSmooth},${smooth},${maxSpeed},${maxAcc},${maxJerk},${uniformMode})\n${startPose}\n${toolNum}\n${wobjNum}\n${moveCart}\n${moveTrajectory}\n${printTrajPointNum}\n`
            return code;
        };

        /* DMPæä»¤ */
        Blockly.Blocks['dmp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('DMP')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "SPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['dmp'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point = block.getFieldValue('POINTNAME');
            var speed = block.getFieldValue('SPEED');
            var code = 'DMP(' + point + ',' + speed + ')\n'
            return code;
        };

        /* å·¥å·è½¬æ¢ */
        Blockly.Blocks['tooltrsfstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[144].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coordinate_system)
                    .appendField(new Blockly.FieldDropdown(toolTrsfCoordeArr), "EXISNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['tooltrsfstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var name = block.getFieldValue('EXISNAME');
            var code = 'ToolTrsfStart(' + name + ')\n'
            return code;
        };
        
        /* å·¥å·è½¬æ¢ç»æ */
        Blockly.Blocks['tooltrsfend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[145].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['tooltrsfend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'ToolTrsfEnd()\n'
            return code;
        };

        /* å·¥ä»¶è½¬æ¢å¼å§ */
        Blockly.Blocks['wptrsfstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[146].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wobjcoord_system)
                    .appendField(new Blockly.FieldDropdown(wobjTrsCoordeDataArr), "EXISNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wptrsfstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var name = block.getFieldValue('EXISNAME');
            var code = 'WorkPieceTrsfStart(' + name + ')\n'
            return code;
        };

        /* å·¥ä»¶è½¬æ¢ç»æ */
        Blockly.Blocks['wptrsfend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[147].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wptrsfend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'WorkPieceTrsfEnd()\n'
            return code;
        };

        /* MOVETPD */
        Blockly.Blocks['movetpd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[4].name)
                this.appendDummyInput()
                    .appendField(descriptionData[0].name)
                    .appendField(new Blockly.FieldDropdown(tpdNamesArr), "TRACKNAME")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._move_mode)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['LIN', '1']]), "MOVEMODE")
                    .appendField(",")
                    .appendField(graphInputTitles.motion._move_speed)
                    .appendField(new Blockly.FieldNumber(25, 0, 100, 1), "MOVESPEED")
                this.appendDummyInput()
                    .appendField(descriptionData[1].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TRACKSMOOTH")
                    .appendField(",")
                    .appendField(descriptionData[2].name)
                    .appendField(new Blockly.FieldNumber(100, 0, 200, 1), "DEBUGSPEED")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movetpd'] = function (block) {
            var dropdown_trackname = block.getFieldValue('TRACKNAME');
            var dropdown_tracksmooth = block.getFieldValue('TRACKSMOOTH');
            var number_debugspeed = block.getFieldValue('DEBUGSPEED');
            var moveMode = block.getFieldValue('MOVEMODE');
            var moveSpeed = block.getFieldValue('MOVESPEED');
            // TODO: Assemble Lua into code variable.
            var code;
            code += 'MoveToTPDStart(\"' + dropdown_trackname + '\",' + moveMode + ',' + moveSpeed + ')\n';
            code += 'MoveTPD(\"' + dropdown_trackname + '\",' + dropdown_tracksmooth + ',' + number_debugspeed + ')\n';
            return code;
        };

        /* HSpiral-æ°´å¹³èºæè¿å¨å¼å§ */
        Blockly.Blocks['HSpiralStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[126].name)
                this.appendDummyInput()
                    .appendField(descriptionData[37].name)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0.001), "HSPIRALRADIUS")
                    .appendField('mm')
                    .appendField(",")
                    .appendField(descriptionData[38].name)
                    .appendField(new Blockly.FieldNumber(1, 0, 2, 0.001), "HSPIRALSPEED")
                    .appendField('rev/s')
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[39].name)
                    .appendField(new Blockly.FieldDropdown(hSprialDriectionArr), "HSPIRALDRIECTION")
                    .appendField(",")
                    .appendField(descriptionData[40].name)
                    .appendField(new Blockly.FieldNumber(20, 0, 40, 0.001), "HSPIRALANGLE")
                    .appendField('deg')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['HSpiralStart'] = function (block) {
            var hSpiralRadius = block.getFieldValue('HSPIRALRADIUS');
            var hSpiralSpeed = block.getFieldValue('HSPIRALSPEED');
            var hSpiralDriection = block.getFieldValue('HSPIRALDRIECTION');
            var hSpiralAngle = block.getFieldValue('HSPIRALANGLE');
            var code = 'HorizonSpiralMotionStart(' + hSpiralRadius + ',' + hSpiralSpeed + ',' + hSpiralDriection + ',' + hSpiralAngle + ')\n';
            return code;
        };

        /* HSpiral-æ°´å¹³èºæè¿å¨ç»æ */
        Blockly.Blocks['HSpiralEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[127].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6eb3f7");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['HSpiralEnd'] = function () {
            var code = 'HorizonSpiralMotionEnd()\n';
            return code;
        };

        /* WAITMS */
        Blockly.Blocks['waitms'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[5].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, Infinity, 1), "WAITTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['waitms'] = function (block) {
            var number_waittime = block.getFieldValue('WAITTIME');
            // TODO: Assemble Lua into code variable.
            var code = 'WaitMs(' + number_waittime + ')\n';
            return code;
        };

        /* GETDI */
        Blockly.Blocks['getdi'] = {
            init: function () {
                this.appendValueInput("GETDI")
                    .setCheck(null)
                    .appendField(commandNameData[15].name)
                    .appendField("(")
                    .appendField(new Blockly.FieldDropdown(diOptionsArr), "DINAME")
                    .appendField(") ==");
                this.appendDummyInput();
                this.setOutput(true, null);
                this.setColour(210);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['getdi'] = function (block) {
            var dropdown_diname = block.getFieldValue('DINAME');
            var value_getdi = Blockly.Lua.valueToCode(block, 'GETDI', Blockly.Lua.ORDER_ATOMIC);
            // TODO: Assemble Lua into code variable.
            var code = 'GetDI(' + dropdown_diname + ') == ' + value_getdi;
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* GETTOOLDI */
        Blockly.Blocks['gettooldi'] = {
            init: function () {
                this.appendValueInput("GETTOOLDI")
                    .setCheck(null)
                    .appendField(commandNameData[16].name)
                    .appendField("(")
                    .appendField(new Blockly.FieldDropdown(toolDiOptionsArr), "TOOLDINAME")
                    .appendField(") ==");
                this.appendDummyInput();
                this.setOutput(true, null);
                this.setColour(210);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['gettooldi'] = function (block) {
            var dropdown_tooldiname = block.getFieldValue('TOOLDINAME');
            var value_gettooldi = Blockly.Lua.valueToCode(block, 'GETTOOLDI', Blockly.Lua.ORDER_ATOMIC);
            // TODO: Assemble Lua into code variable.
            var code = 'GetToolDI(' + dropdown_tooldiname + ') == ' + value_gettooldi;
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* SETMODE */
        Blockly.Blocks['mode'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[6].name)
                    .appendField(new Blockly.FieldDropdown([["Manual", "1"]]), "MODENAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['mode'] = function (block) {
            var dropdown_modename = block.getFieldValue('MODENAME');
            // TODO: Assemble Lua into code variable.
            var code = 'Mode(' + dropdown_modename + ')\n';
            return code;
        };

        /* GOTOFUNCTION */
        Blockly.Blocks['gotofunction'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("::")
                    .appendField(new Blockly.FieldTextInput("default"), "GOTOLABEL")
                    .appendField(":: do");
                this.appendStatementInput("GOTO")
                    .setCheck(null);
                this.appendDummyInput()
                    .appendField("end");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(210);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['gotofunction'] = function (block) {
            var text_gotolabel = block.getFieldValue('GOTOLABEL');
            var statements_goto = Blockly.Lua.statementToCode(block, 'GOTO');
            // TODO: Assemble Lua into code variable.
            var code = '::' + text_gotolabel + '::do' + '\n' + statements_goto + 'end\n';
            return code;
        };

        /* GOTO */
        Blockly.Blocks['goto'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("goto")
                    .appendField(new Blockly.FieldTextInput("default"), "GOTOLABEL");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(210);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['goto'] = function (block) {
            var text_gotolabel = block.getFieldValue('GOTOLABEL');
            // TODO: Assemble Lua into code variable.
            var code = 'goto ' + text_gotolabel + '\n';
            return code;
        };

        /* PAUSE */
        Blockly.Blocks['pause'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[7].name)
                    .appendField(new Blockly.FieldDropdown(PauseOptionsArr), "PAUSEFUNCTION")
                this.setColour('#cd50d5');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['pause'] = function (block) {
            var pause_func = block.getFieldValue('PAUSEFUNCTION');
            var code = "";
            code = 'Pause(' + pause_func + ')\n';
            return code;
        };

        /* TOOLLIST */
        Blockly.Blocks['settoollist'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[8].name)
                    .appendField(new Blockly.FieldDropdown(toolCoordOptionsArr), "TOOLCOORDNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['settoollist'] = function (block) {
            var dropdown_toolcoordname = block.getFieldValue('TOOLCOORDNAME');
            // TODO: Assemble Lua into code variable.
            var code = 'SetToolList(' + dropdown_toolcoordname + ')\n';
            return code;
        };

        /* EXTOOLLIST */
        Blockly.Blocks['setextoollist'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[9].name)
                    .appendField(new Blockly.FieldDropdown(exToolCoordOptionsArr), "EXTOOLCOORDNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setextoollist'] = function (block) {
            var dropdown_extoolcoordname = block.getFieldValue('EXTOOLCOORDNAME');
            // TODO: Assemble Lua into code variable.
            var code = 'SetExToolList(' + dropdown_extoolcoordname + ')\n';
            return code;
        };

        /* WOBJTOOLLIST */
        Blockly.Blocks['setwobjtoollist'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[10].name)
                    .appendField(new Blockly.FieldDropdown(wobjToolCoordOptionsArr), "WOBJTOOLCOORDNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setwobjtoollist'] = function (block) {
            var dropdown_wobjtoolcoordname = block.getFieldValue('WOBJTOOLCOORDNAME');
            // TODO: Assemble Lua into code variable.
            var code = 'SetWObjList(' + dropdown_wobjtoolcoordname + ')\n';
            return code;
        };

        /* LASEROFF */
        Blockly.Blocks['laseroff'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[20].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['laseroff'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'LTLaserOff()\n';
            return code;
        };

        /* LOADLASERDRIVER */
        Blockly.Blocks['loadlaserdriver'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[21].name)
                this.appendDummyInput()
                    .appendField(descriptionData[14].name)
                    .appendField(new Blockly.FieldDropdown(loadPosSensorDriverDataArr), "DRIVER")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['loadlaserdriver'] = function (block) {
            var dropdown_driver = block.getFieldValue('DRIVER');
            // TODO: Assemble Lua into code variable.
            var code = 'LoadPosSensorDriver(' + dropdown_driver + ')\n';
            return code;
        };

        /* UNLOADLASERDRIVER */
        Blockly.Blocks['unloadlaserdriver'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[22].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['unloadlaserdriver'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'UnloadPosSensorDriver()\n';
            return code;
        };

        /* LASERTRACKON */
        Blockly.Blocks['lasertrackon'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[23].name)
                this.appendDummyInput()
                    .appendField(descriptionData[15].name)
                    .appendField(new Blockly.FieldDropdown(sensorCoordOptionsArr), "TRACKCOORD")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lasertrackon'] = function (block) {
            var dropdown_trackcoord = block.getFieldValue('TRACKCOORD');
            // TODO: Assemble Lua into code variable.
            var code = 'LTTrackOn(' + dropdown_trackcoord + ')\n';
            return code;
        };

        /* LASERTRACKOFF */
        Blockly.Blocks['lasertrackoff'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[24].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lasertrackoff'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'LTTrackOff()\n';
            return code;
        };

        /* LASERRECORDPOINT(PTP-0,LIN-1) */
        Blockly.Blocks['laserrecordpoint'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[26].name)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['LIN', '1']]), "LASERPOINTTYPE")
                this.appendDummyInput()
                    .appendField(descriptionData[15].name)
                    .appendField(new Blockly.FieldDropdown(sensorCoordOptionsArr), "TOOLCOORD")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[2].name)
                    .appendField(new Blockly.FieldNumber(30, 0, 100, 1), "LASERPOINTSPEED");
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._search_pos)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "LASERPOINTWHETHERPOS");
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._pos_point)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERPOINTPOS");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['laserrecordpoint'] = function (block) {
            var dropdown_type = block.getFieldValue('LASERPOINTTYPE');
            var dropdown_toolcoord = block.getFieldValue('TOOLCOORD');
            var number_laserPointSpeed = block.getFieldValue('LASERPOINTSPEED');
            var dropdown_laserPointWhether = block.getFieldValue('LASERPOINTWHETHERPOS');
            var dropdown_laserPointPos = block.getFieldValue('LASERPOINTPOS');
            // TODO: Assemble Lua into code variable. ptp-0,lin-1
            var code;
            if (dropdown_laserPointWhether == '0') {
                code = 'pos = {}\n' + 'pos = LaserRecordPoint(' + dropdown_toolcoord + ',' + dropdown_type + ',' + number_laserPointSpeed + ')\n';
            } else {
                code = 'pos = {}\n' + 'pos = LaserRecordPoint(' + dropdown_toolcoord + ',' + dropdown_type + ',' + number_laserPointSpeed + ',0,0,0,' + dropdown_laserPointPos + ')\n';
            }
            return code;
        };

        /* LASERRECORDEND */
        Blockly.Blocks['laserrecordend'] = {
            init: function () {
                this.appendDummyInput()
                .appendField(commandNameData[27].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['laserrecordend'] = function () {
            var code = 'if type(pos) == \"table\" then\n' + 'laserPTP(#pos,pos)\n' + 'end\n';
            return code;
        };

        /* ä¸ç¹å¯»ä½æ±äº¤ç¹ */
        Blockly.Blocks['laserthrough3'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[154].name)
                    this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point1)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point2)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point3)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._search_pos)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "LASERPOINTWHETHERPOS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._pos_point)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERPOINTPOS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._motion_mode)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['Lin', '1']]), "LASERPOINTTYPE")
                this.appendDummyInput()
                    .appendField(descriptionData[2].name)
                    .appendField(new Blockly.FieldNumber(30, 0, 100, 1), "LASERPOINTSPEED");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['laserthrough3'] = function (block) {
            var dropdown_lasersearch1 = block.getFieldValue('LASERSEARCH1');
            var dropdown_lasersearch2 = block.getFieldValue('LASERSEARCH2');
            var dropdown_lasersearch3 = block.getFieldValue('LASERSEARCH3');
            var dropdown_laserPointWhether = block.getFieldValue('LASERPOINTWHETHERPOS');
            var dropdown_laserPointPos = block.getFieldValue('LASERPOINTPOS');
            var dropdown_laserPointType = block.getFieldValue('LASERPOINTTYPE');
            var dropdown_laserPointSpeed = block.getFieldValue('LASERPOINTSPEED');
            var code;
            if (dropdown_laserPointWhether == '0') {
                if (dropdown_laserPointType == '0') {
                    code = `pos = {}\npos = GetIntersectionThrough3Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserPTP(#pos,pos)\nend\n`
                } else {
                    code = `pos = {}\npos = GetIntersectionThrough3Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserLin(#pos,pos)\nend\n`
                }
                
            } else {
                if (dropdown_laserPointType == '0') {
                    code = `pos = {}\npos = GetIntersectionThrough3Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_laserPointPos},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserPTP(#pos,pos)\nend\n`
                } else {
                    code = `pos = {}\npos = GetIntersectionThrough3Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_laserPointPos},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserLin(#pos,pos)\nend\n`
                }
            }
            return code;
        };

        /* åç¹å¯»ä½æ±äº¤ç¹ */
        Blockly.Blocks['laserthrough4'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[155].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point1)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point2)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point3)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._point4)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERSEARCH4")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._search_pos)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "LASERPOINTWHETHERPOS");
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._pos_point)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "LASERPOINTPOS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._motion_mode)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['Lin', '1']]), "LASERPOINTTYPE");
                this.appendDummyInput()
                    .appendField(descriptionData[2].name)
                    .appendField(new Blockly.FieldNumber(30, 0, 100, 1), "LASERPOINTSPEED");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['laserthrough4'] = function (block) {
            var dropdown_lasersearch1 = block.getFieldValue('LASERSEARCH1');
            var dropdown_lasersearch2 = block.getFieldValue('LASERSEARCH2');
            var dropdown_lasersearch3 = block.getFieldValue('LASERSEARCH3');
            var dropdown_lasersearch4 = block.getFieldValue('LASERSEARCH4');
            var dropdown_laserPointWhether = block.getFieldValue('LASERPOINTWHETHERPOS');
            var dropdown_laserPointPos = block.getFieldValue('LASERPOINTPOS');
            var dropdown_laserPointType = block.getFieldValue('LASERPOINTTYPE');
            var dropdown_laserPointSpeed = block.getFieldValue('LASERPOINTSPEED');
            var code = '';
            code += `pos = {}\n`
            if (dropdown_laserPointWhether == '0') {
                if (dropdown_laserPointType == '0') {
                    code = `pos = {}\nGetIntersectionThrough4Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_lasersearch4},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserPTP(#pos,pos)\nend\n`
                } else {
                    code = `pos = {}\nGetIntersectionThrough4Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_lasersearch4},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserLin(#pos,pos)\nend\n`
                }
            } else {
                if (dropdown_laserPointType == '0') {
                    code = `pos = {}\nGetIntersectionThrough4Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_lasersearch4},${dropdown_laserPointPos},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserPTP(#pos,pos)\nend\n`
                } else {
                    code = `pos = {}\nGetIntersectionThrough4Point(${dropdown_lasersearch1},${dropdown_lasersearch2},${dropdown_lasersearch3},${dropdown_lasersearch4},${dropdown_laserPointPos},${dropdown_laserPointType},${dropdown_laserPointSpeed})\nif type(pos) == \"table\" then\nlaserLin(#pos,pos)\nend\n`
                }
            }
            return code;
        };

        /* LASERTRACKRECURRENT */
        Blockly.Blocks['lasertrackrecurrent'] = {
            init: function () {
                this.appendDummyInput()
                .appendField(commandNameData[38].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lasertrackrecurrent'] = function () {
            var code = 'MoveLTR()\n';
            return code;
        };

        /* SEARCHSTART */
        Blockly.Blocks['searchstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[28].name)
                this.appendDummyInput()
                    .appendField(descriptionData[16].name)
                    .appendField(new Blockly.FieldDropdown([["+X", "0"], ["-X", "1"], ["+Y", "2"], ["-Y", "3"], ["+Z", "4"], ["-Z", "5"]]), "SEARCHDIST")
                    .appendField(",")
                    .appendField(descriptionData[17].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "SEARCHSPEED")
                    .appendField(",")
                    .appendField(descriptionData[18].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 1), "SEARCHLEN")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[19].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "SEARCHTIME")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[15].name)
                    .appendField(new Blockly.FieldDropdown(sensorCoordOptionsArr), "SEARCHTOOLCOORD")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['searchstart'] = function (block) {
            var dropdown_searchdist = block.getFieldValue('SEARCHDIST');
            var number_searchspeed = block.getFieldValue('SEARCHSPEED');
            var number_searchlen = block.getFieldValue('SEARCHLEN');
            var number_searchtime = block.getFieldValue('SEARCHTIME');
            var dropdown_searchtoolcoord = block.getFieldValue('SEARCHTOOLCOORD');
            // TODO: Assemble Lua into code variable.
            var code = 'LTSearchStart(0,' + dropdown_searchdist + "," + number_searchspeed + "," + number_searchlen + "," + number_searchtime + "," + dropdown_searchtoolcoord + ')\n';
            return code;
        };

        /* SEARCHSTOP */
        Blockly.Blocks['searchstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[29].name);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['searchstop'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = 'LTSearchStop()\n';
            return code;
        };

        /* WEIDARCSTART */
        Blockly.Blocks['weldarcstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[30].name)
                this.appendDummyInput()
                    .appendField(descriptionData[41].name)
                    .appendField(new Blockly.FieldDropdown(functionIOTypeDataArr), "FUNCTIONIOTYPE")
                    .appendField(", ")
                this.appendDummyInput()
                    .appendField(descriptionData[20].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 7, 1), "WELDID")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[21].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, 10000, 1), "WELDWAITTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weldarcstart'] = function (block) {
            var number_weldid = block.getFieldValue('WELDID');
            var number_weldwaittime = block.getFieldValue('WELDWAITTIME');
            var io_type = block.getFieldValue('FUNCTIONIOTYPE');
            // TODO: Assemble Lua into code variable.
            var code = 'ARCStart(' + io_type + "," + number_weldid + "," + number_weldwaittime + ')\n';
            return code;
        };

        /* WEIDARCEND */
        Blockly.Blocks['weldarcend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[31].name)
                this.appendDummyInput()
                    .appendField(descriptionData[41].name)
                    .appendField(new Blockly.FieldDropdown(functionIOTypeDataArr), "FUNCTIONIOTYPE")
                    .appendField(", ")
                this.appendDummyInput()
                    .appendField(descriptionData[20].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 7, 1), "WELDID")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(commandNameData[21].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, 10000, 1), "WELDWAITTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weldarcend'] = function (block) {
            var number_weldid = block.getFieldValue('WELDID');
            var number_weldwaittime = block.getFieldValue('WELDWAITTIME');
            var io_type = block.getFieldValue('FUNCTIONIOTYPE');
            // TODO: Assemble Lua into code variable.
            var code = 'ARCEnd(' + io_type + "," + number_weldid + "," + number_weldwaittime + ')\n';
            return code;
        };

        /* WEAVESTART */
        Blockly.Blocks['weavestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[32].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weavestart'] = function (block) {
            var number_weaveid = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable.
            var code = 'WeaveStart(' + number_weaveid + ')\n';
            return code;
        };

        /* WEAVEEND */
        Blockly.Blocks['weaveend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[33].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._exaxis_list_id)
                    .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "WEAVEID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#6eb3f7');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['weaveend'] = function (block) {
            var number_weaveid = block.getFieldValue('WEAVEID');
            // TODO: Assemble Lua into code variable.
            var code = 'WeaveEnd(' + number_weaveid + ')\n';
            return code;
        };

        /* SEGMENT */
        Blockly.Blocks['segment'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[34].name)
                this.appendDummyInput()
                    .appendField(langJsonData.commandlist.nodeEditorCommands.weld._segment_mode)
                    .appendField(new Blockly.FieldDropdown(segmentModeDataArr), "SEGMENTMODE")
                this.appendDummyInput()
                    .appendField(descriptionData[23].name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "SEGMENTSTARTPOINT")
                    .appendField(",")
                    .appendField(langJsonData.commandlist.nodeEditorCommands.weld._segment_end_point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "SEGMENTENDPOINT")
                    .appendField(",")
                    .appendField(descriptionData[2].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "TOTALLEN")
                this.appendDummyInput()
                    .appendField(descriptionData[25].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 1), "EFFECTIVELEN")
                    .appendField(",")
                    .appendField(descriptionData[26].name)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 1), "LOSELEN")
                this.appendDummyInput()
                    .appendField(descriptionData[27].name)
                    .appendField(new Blockly.FieldDropdown(functionModeDataArr), "FUNCTIONMODE")
                this.appendDummyInput()
                    .appendField(descriptionData[28].name)
                    .appendField(new Blockly.FieldDropdown(weaveModeDataArr), "WEAVEMODE")
                this.appendDummyInput() 
                    .appendField(descriptionData[29].name)
                    .appendField(new Blockly.FieldDropdown(roundingRuleDataArr), "ISROUNDING")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#ed5a3e');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['segment'] = function (block) {
            var dropdown_segmentmode = block.getFieldValue('SEGMENTMODE');
            var dropdown_segmentstartpoint = block.getFieldValue('SEGMENTSTARTPOINT');
            var dropdown_segmentendpoint = block.getFieldValue('SEGMENTENDPOINT');
            var number_totallen = block.getFieldValue('TOTALLEN');
            var number_effectivelen = block.getFieldValue('EFFECTIVELEN');
            var number_loselen = block.getFieldValue('LOSELEN');
            var dropdown_functionmode = block.getFieldValue('FUNCTIONMODE');
            var dropdown_weavemode = block.getFieldValue('WEAVEMODE');
            var dropdown_isrounding = block.getFieldValue('ISROUNDING');
            // TODO: Assemble Lua into code variable.
            var code = "";
            code += "seg_distance,seg_x,seg_y,seg_z = GetSegWeldDisDir(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ")"  + "\n";
            code += "if seg_distance ~= nil and seg_x ~= nil and seg_y ~= nil and seg_z ~= nil then" + "\n";
            code += "PTP(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0)" + "\n";
            code += "i = 0; j = 0; k = 0" + "\n";
            code += "m =" + number_effectivelen + "; n =" + number_loselen + "\n";

            if (dropdown_weavemode == 0) {
                if (dropdown_functionmode == 0) {
                    if (dropdown_isrounding == 0) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "k=k+1" + "\n";
                        code += "i=i+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "k=k+1" + "\n";
                        code += "j=j+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 1) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "k=k+1" + "\n";
                        code += "i=i+1" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "else" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 2) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "k=k+1" + "\n";
                        code += "i=i+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    }
                } else {
                    if (dropdown_isrounding == 0) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 1) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 2) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    }
                }
            } else {
                if (dropdown_functionmode == 0) {
                    if (dropdown_isrounding == 0) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 1) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "else" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 2) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    }
                } else {
                    if (dropdown_isrounding == 0) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",seg_distance)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "seg_distance*seg_x," + "seg_distance*seg_y," + "seg_distance*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 1) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    } else if (dropdown_isrounding == 2) {
                        code += "while(k<(math.floor(seg_distance/(m+n))*2+2)) do" + "\n";
                        code += "if((-1)^k == 1) then" + "\n";
                        code += "j=j+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "end" + "\n";
                        code += "else" + "\n";
                        code += "i=i+1" + "\n";
                        code += "k=k+1" + "\n";
                        code += "if((i*m+j*n)>seg_distance) then" + "\n";
                        // code += "break" + "\n";
                        code += "else" + "\n";
                        code += "ARCStart(0,0,1000)" + "\n";
                        code += "WeaveStart(0)" + "\n";
                        code += "SegWeldParam(m,n,i,j,k)" + "\n";
                        if (dropdown_segmentmode == 1) {
                            code += "compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum = GetSegmentWeldPoint(" + dropdown_segmentstartpoint + ","+  dropdown_segmentendpoint + ",i*m+j*n)" + "\n";
                            code += "MoveL(compute_j1,compute_j2,compute_j3,compute_j4,compute_j5,compute_j6,compute_x,compute_y,compute_z,compute_rx,compute_ry,compute_rz,compute_tool_num,compute_workPieceNum," + number_totallen + ",30,30,0,0,0,0,0,0,0,0,0,0,0,0,0)" + "\n";
                        } else {
                            code += "Lin(" + dropdown_segmentstartpoint + "," + number_totallen + ",-1,0,1," + "(i*m+j*n)*seg_x," + "(i*m+j*n)*seg_y," + "(i*m+j*n)*seg_z," + "0,0,0)" + "\n";
                        }
                        code += "WeaveEnd(0)" + "\n";
                        code += "ARCEnd(0,0,1000)" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                        code += "end" + "\n";
                    }
                }
            }
            code += "end" + "\n";
            return code;
        };

        /* DIO */
        Blockly.Blocks['set_do'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[14].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDoOptionsArr), "POINTNAME4")
                    .appendField(",")
                    .appendField(descriptionData[6].name)
                    .appendField(new Blockly.FieldDropdown(whetherTruthDataArr), "DIOSTATE")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "DEBUGSPEED4")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[1].name)
                    .appendField(new Blockly.FieldDropdown(doModeOptionsArr), "RADIUS4")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "ISOFFSET4")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['set_do'] = function (block) {
            var dropdown_pointname4 = block.getFieldValue('POINTNAME4');
            var number_debugspeed4 = block.getFieldValue('DEBUGSPEED4');
            var number_radius4 = block.getFieldValue('RADIUS4');
            var dropdown_isoffset4 = block.getFieldValue('ISOFFSET4');
            var dio_state = block.getFieldValue('DIOSTATE');
            var code = "";
            if (number_debugspeed4 == 0) {
                if (dropdown_pointname4 > 15) {
                    code = 'SetToolDO(' + (dropdown_pointname4 - 16) + ',' + dio_state + ',' + number_radius4+ ',' + dropdown_isoffset4 + ')\n';
                } else {
                    code = 'SetDO(' + dropdown_pointname4 + ',' + dio_state + ',' + number_radius4+ ',' + dropdown_isoffset4 + ')\n';
                }
            } else {
                if (dropdown_pointname4 > 15) {
                    code = 'SPLCSetToolDO(' + (dropdown_pointname4 - 16) + ',' + dio_state + ')\n';
                }else {
                    code = 'SPLCSetDO(' + dropdown_pointname4 + ',' + dio_state + ')\n';
                }
            }
            return code;
        };

        Blockly.Blocks['get_do'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[186].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDoOptionsArr), "GETDOPORT")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "GETDOBLOCK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['get_do'] = function (block) {
            var port = block.getFieldValue('GETDOPORT');
            var block = block.getFieldValue('GETDOBLOCK');
            var code = "";
            if (port > 15) {
                code = 'SetToolDO(' + (port - 16) + ',' + block + ')\n';
            } else {
                code = 'SetDO(' + port + ',' + block + ')\n';
            }
            return code;
        };

        Blockly.Blocks['get_di'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[15].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDiOptionsArr), "getdi_port")
                    .appendField(",")
                    .appendField(descriptionData[6].name)
                    .appendField(new Blockly.FieldDropdown(whetherTruthDataArr), "getdi_state")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "getdi_false")
                    .appendField(",")
                    .appendField(commandNameData[5].name)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 1), "getdi_waittime")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "getdi_isuse")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['get_di'] = function (block) {
            var getdi_port = block.getFieldValue('getdi_port');
            var getdi_state = block.getFieldValue('getdi_state');
            var getdi_false = block.getFieldValue('getdi_false');
            var getdi_waittime = block.getFieldValue('getdi_waittime');
            var getdi_isuse = block.getFieldValue('getdi_isuse');
            var code = "";
            if (getdi_false == 1) {
                if (getdi_port > 15) {
                    code = 'SPLCGetToolDI(' + (getdi_port - 16) + ',' + getdi_state + ',' + getdi_waittime + ')\n';
                }else {
                    code = 'SPLCGetDI(' + getdi_port + ',' + getdi_state + ',' + getdi_waittime + ')\n';
                }
            } else {
                if (getdi_port > 15) {
                    code = 'GetToolDI(' + (getdi_port - 16) + ',' + getdi_isuse + ')\n';
                }else {
                    code = 'GetDI(' + getdi_port + ',' + getdi_isuse + ')\n';
                }
            }
            return code;
        };

        /* AIO */
        Blockly.Blocks['set_ao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[17].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(aoOptionsArr), "POINTNAME5")
                    .appendField(",")
                    .appendField(descriptionData[4].name)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED5")
                    .appendField("%")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "ISOFFSET5")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "ISUSE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['set_ao'] = function (block) {
            var dropdown_pointname5 = block.getFieldValue('POINTNAME5');
            var number_debugspeed5 = block.getFieldValue('DEBUGSPEED5');
            var dropdown_isoffset5 = block.getFieldValue('ISOFFSET5');
            var is_use = block.getFieldValue('ISUSE');
            var code = "";
            if (dropdown_isoffset5 == 0) {
                if (dropdown_pointname5 > 1) {
                    code = 'SetToolAO(' + (dropdown_pointname5 - 2) + ',' + number_debugspeed5 + ',' + is_use + ')\n';
                } else {
                    code = 'SetAO(' + dropdown_pointname5 + ',' + number_debugspeed5 + ','+ is_use + ')\n';
                }
            } else {
                if (dropdown_pointname5 > 1) {
                    code = 'SPLCSetToolAO(' + (dropdown_pointname5 - 2) + ',' + number_debugspeed5 + ')\n';
                } else {
                    code = 'SPLCSetAO(' + dropdown_pointname5 + ',' + number_debugspeed5 + ')\n';
                }
            }
            return code;
        };

        Blockly.Blocks['get_ao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[187].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(aoOptionsArr), "GETAOPORT")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "GETAOBLOCK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['get_ao'] = function (block) {
            var port = block.getFieldValue('GETAOPORT');
            var block = block.getFieldValue('GETAOBLOCK');
            var code = "";
            if (port > 1) {
                code = 'SetToolAO(' + (port - 2) + ',' + block + ')\n';
            } else {
                code = 'SetAO(' + port + ',' + block + ')\n';
            }
            return code;
        };

        Blockly.Blocks['get_ai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[18].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(aiOptionsArr), "POINTNAME55")
                    .appendField(",")
                    .appendField(descriptionData[4].name)
                    .appendField(new Blockly.FieldDropdown(comparationDataArr), "AIVAL")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[5].name)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "DEBUGSPEED55")
                    .appendField("%")
                    .appendField(",")
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "ISOFFSET55")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "ISUSE5")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['get_ai'] = function (block) {
            var dropdown_pointname55 = block.getFieldValue('POINTNAME55');
            var dropdown_isoffset55 = block.getFieldValue('ISOFFSET55');
            var is_use5 = block.getFieldValue('ISUSE5');
            var number_debugspeed55 = block.getFieldValue('DEBUGSPEED55');
            var ai_val = block.getFieldValue('AIVAL');
            var code = "";
            if (dropdown_isoffset55 == 1) {
                if (dropdown_pointname55 > 1) {
                    code = 'SPLCGetToolAI(' + (dropdown_pointname55 - 2) + ',' + ai_val + ',' + number_debugspeed55 + ',' + is_use5+ ')\n';
                } else {
                    code = 'SPLCGetAI(' + dropdown_pointname55 + ',' + number_debugspeed55 + ',' + ai_val + ',' + is_use5 + ')\n';
                }
            } else {
                if (dropdown_pointname55 > 1) {
                    code = 'GetToolAI(' + (dropdown_pointname55 - 2) + ',' + is_use5 + ')\n';
                } else {
                    code = 'GetAI(' + dropdown_pointname55 + ',' + is_use5 + ')\n';
                }
            }
            return code;
        };

        /* wait_AIæä»¤ */
        Blockly.Blocks['wait_AI'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[11].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(aiOptionsArr), "WAITAIPORT")
                    .appendField(",")
                    .appendField(descriptionData[4].name)
                    .appendField(new Blockly.FieldDropdown(comparationDataArr), "WAITAIIF")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[5].name)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "WAITAIVALUE")
                    .appendField("%")
                    .appendField(",")
                    .appendField(descriptionData[7].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, 10000, 1), "WAITAIMAXTIME")
                    .appendField("ms")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[10].name)
                    .appendField(new Blockly.FieldDropdown(whetherMotionArr), "WAITAIOVERTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wait_AI'] = function (block) {
            var WAITAIPORT = block.getFieldValue('WAITAIPORT');
            var WAITAIIF = block.getFieldValue('WAITAIIF');
            var WAITAIVALUE = block.getFieldValue('WAITAIVALUE');
            var WAITAIMAXTIME = block.getFieldValue('WAITAIMAXTIME');
            var WAITAIOVERTIME = block.getFieldValue('WAITAIOVERTIME');
            var code = "";
            if (WAITAIPORT > 1) {
                if (WAITAIOVERTIME == 2) {
                    code = 'WaitToolAI(' + (WAITAIPORT - 2) + ',' + WAITAIIF + ',' + WAITAIVALUE+ ',' + '0' + ',' + WAITAIOVERTIME +')\n';
                } else {
                    code = 'WaitToolAI(' + (WAITAIPORT - 2) + ',' + WAITAIIF + ',' + WAITAIVALUE+ ',' + WAITAIMAXTIME + ',' + WAITAIOVERTIME +')\n';
                }
            } else {
                if (WAITAIOVERTIME == 2) {
                    code = 'WaitAI(' + WAITAIPORT + ',' + WAITAIIF + ',' + WAITAIVALUE+ ',' + '0' + ',' + WAITAIOVERTIME +')\n';
                } else {
                    code = 'WaitAI(' + WAITAIPORT + ',' + WAITAIIF + ',' + WAITAIVALUE+ ',' + WAITAIMAXTIME + ',' + WAITAIOVERTIME +')\n';
                }
            }
            return code;
        };

        /* wait_DIæä»¤ */
        Blockly.Blocks['wait_DI'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[12].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDiOptionsArr), "WAITDIPORT")
                    .appendField(",")
                    .appendField(descriptionData[6].name)
                    .appendField(new Blockly.FieldDropdown(whetherTruthDataArr), "WAITDIIF")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[7].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, 10000, 1), "WAITDIMAXTIME")
                    .appendField("ms")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[10].name)
                // this.appendDummyInput() 
                    .appendField(new Blockly.FieldDropdown(whetherMotionArr), "WAITDIOVERTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wait_DI'] = function (block) {
            var waitdi_port = block.getFieldValue('WAITDIPORT');
            var waitdi_if = block.getFieldValue('WAITDIIF');
            var waitdi_maxtime = block.getFieldValue('WAITDIMAXTIME');
            var waitdi_overtime = block.getFieldValue('WAITDIOVERTIME');
            var code = "";
            if (waitdi_port > 15) {
                if (waitdi_overtime == 2) {
                    code = 'WaitToolDI(' + (waitdi_port - 16) + ',' + waitdi_if + ',' + '0' + ',' + waitdi_overtime +')\n';
                } else {
                    code = 'WaitToolDI(' + (waitdi_port - 16) + ',' + waitdi_if + ',' + waitdi_maxtime + ',' + waitdi_overtime +')\n';
                }
            } else {
                if (waitdi_overtime == 2) {
                    code = 'WaitDI(' + waitdi_port + ',' + waitdi_if + ',' + '0' + ',' + waitdi_overtime +')\n';
                } else {
                    code = 'WaitDI(' + waitdi_port + ',' + waitdi_if + ',' + waitdi_maxtime + ',' + waitdi_overtime +')\n';
                }
            }
            return code;
        };

        /* Wait_MultiDIæä»¤ */
        Blockly.Blocks['Wait_MultiDI'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[13].name)
                this.appendDummyInput()
                    .appendField(descriptionData[8].name)
                    .appendField(new Blockly.FieldDropdown(connectionDataArr), "WAITMULTICHOICE")
                    .appendField(",")
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldTextInput("DI0,DI1"), 'WAITMULTIVALUE')
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[9].name)
                    .appendField(new Blockly.FieldTextInput("DI0,DI1"), 'WAITMULTITRUE')
                this.appendDummyInput()
                    .appendField(descriptionData[7].name)
                    .appendField(new Blockly.FieldNumber(1000, 0, 10000, 0), 'WAITMULTITIME')
                    .appendField("ms")
                    .appendField(",")
                this.appendDummyInput()
                    .appendField(descriptionData[10].name)
                    .appendField(new Blockly.FieldDropdown(whetherMotionArr), "WAITMULTIOPTION")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('#cd50d5');
                this.setTooltip(commandNameData[13].name);
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['Wait_MultiDI'] = function (block) {
            var waitmultidi_choice = block.getFieldValue('WAITMULTICHOICE');
            var waitmultidi_value = block.getFieldValue('WAITMULTIVALUE');
            var waitmultidi_true = block.getFieldValue('WAITMULTITRUE');
            var waitmultidi_time = block.getFieldValue('WAITMULTITIME');
            var waitmultidi_option = block.getFieldValue('WAITMULTIOPTION');
            var code = "";
            var multi_number = 0;
            if (waitmultidi_value) {
                var multi_value = waitmultidi_value.split(',');
    
                //è®¡ç®ä½æ°
                multi_value.forEach(data => {
                    if (waitMultiDIOptionArr.filter(item => item[0] == data).length == 1) {
                        let multi_check = waitMultiDIOptionArr.filter(item => item[0] == data)[0][1];
                        multi_number += Math.pow(2, multi_check);
                        errorWarning = 0;
                    } else {
                        errorWarning = 1;
                    }
                })
            } else {
                multi_number = 0;
            }

            var multi_true = 0;
            if (waitmultidi_true) {
                var multi_arrau = waitmultidi_true.split(',');
    
                //è®¡ç®ä½æ°
                multi_arrau.forEach(data => {
                    if (waitMultiDIOptionArr.filter(item => item[0] == data).length == 1) {
                        let multi_boolean = waitMultiDIOptionArr.filter(item => item[0] == data)[0][1];
                        multi_true += Math.pow(2, multi_boolean);
                        errorWarning2 = 0;
                    } else {
                        errorWarning2 = 1;
                    }
                })
            } else {
                multi_true = 0;
            }

            code = "WaitMultiDI" + "(" + waitmultidi_choice + "," + multi_number + "," + multi_true + "," + waitmultidi_time + "," + waitmultidi_option + ")" + "\n";
            return code;
        };
        
        /* è¿å¨DO-è¿ç»­è¾åº */
        Blockly.Blocks['movetooldostart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[137].name + commandNameData[130].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDoOptionsArr), "PORT")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._set_Interval)
                    .appendField(new Blockly.FieldNumber(500, 0, 500, 0), 'INTERVAL')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._output_pulse_duty_cycle)
                    .appendField(new Blockly.FieldNumber(99, 0, 99, 0), 'OUTPUTVALUE')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movetooldostart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var port = block.getFieldValue('PORT');
            var interval = block.getFieldValue('INTERVAL');
            var output = block.getFieldValue('OUTPUTVALUE');
            var code = "";
            if(port > 15) {
                code = 'MoveToolDOStart(' + (port-15) + ',' + interval + ',' + output + ')\n'
            } else {
                code = 'MoveDOStart(' + port + ',' + interval + ',' + output + ')\n'
            }
            return code;
        };
        
        /* è¿å¨DO-åæ¬¡è¾åº */
        Blockly.Blocks['movetooldostartonce'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[137].name + commandNameData[131].name)
                this.appendDummyInput()
                    .appendField(descriptionData[3].name)
                    .appendField(new Blockly.FieldDropdown(toolDoOptionsArr), "PORT")
                this.appendDummyInput()
                    .appendField(commandNameData[132].name)
                    .appendField(new Blockly.FieldDropdown(outputMoveDOModeDataArr), "MODE")
                this.appendDummyInput()
                    .appendField(commandNameData[133].name)
                    .appendField(new Blockly.FieldNumber(500, 0, 500, 0), 'TIME1')
                    .appendField(',')
                    .appendField(commandNameData[134].name)
                    .appendField(new Blockly.FieldNumber(500, 0, 500, 0), 'TIME2')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movetooldostartonce'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var port = block.getFieldValue('PORT');
            var mode = block.getFieldValue('MODE');
            var time1 = block.getFieldValue('TIME1');
            var time2 = block.getFieldValue('TIME2');
            var code = "";
            if(mode == 0) {
                if(port > 15) {
                    code = 'MoveToolDOOnceStart(' + (port-16) + ',-1,-1)\n'
                } else {
                    code = 'MoveDOOnceStart(' + port + ',-1,-1)\n'
                }
            } else {
                if(port > 15) {
                    code = 'MoveToolDOOnceStart(' + (port-16) + ',' + time1 + ',' + time2 + ')\n'
                } else {
                    code = 'MoveDOOnceStart(' + port + ',' + time1 + ',' + time2 + ')\n'
                }
            }
            return code;
        };
        
        /* è¿å¨DOç»æ */
        Blockly.Blocks['movedostop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[141].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movedostop'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var mode = block.getFieldValue('MODE');
            var code = "";
            if (mode == 1) {
                code = 'MoveDOStop()\n' 
            } else {
                code = 'MoveDOOnceStop()\n' 
            }
            return code;
        };

        /* è¿å¨AO */
        Blockly.Blocks['moveaostart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[142].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._control_box_ao_number)
                    .appendField(new Blockly.FieldDropdown(aoOptionsArr), "PORT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._max_tcp_speed)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'SPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._max_tcp_speed_ao_percent)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'PERCENT1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._period_compensation_ao_percent)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'PERCENT2')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['moveaostart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var port = block.getFieldValue('PORT');
            var speed = block.getFieldValue('SPEED');
            var percent1 = block.getFieldValue('PERCENT1');
            var percent2 = block.getFieldValue('PERCENT2');
            var code = "";
            if(port > 1) {
                code = 'MoveToolAOStart(' + (port-2) + ',' + speed + ',' + percent1 + ',' + percent2 + ')\n'
            } else {
                code = 'MoveAOStart(' + port + ',' + speed + ',' + percent1 + ',' + percent2 + ')\n'
            }
            return code;
        };
                
        /* è¿å¨DOç»æ */
        Blockly.Blocks['moveaostop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[143].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['moveaostop'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'MoveAOStop()\n' 
            return code;
        };

        /* ç¢°æç­çº§-æ åç­çº§ */
        Blockly.Blocks['setanticollision'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[2].children[8].name + '-' + collideModeDataArr[0][0])
                this.appendDummyInput()
                    .appendField('Joint1')
                    .appendField(new Blockly.FieldDropdown(collisionLevel1Arr), "JOINT1")
                    .appendField(',')
                    .appendField('Joint2')
                    .appendField(new Blockly.FieldDropdown(collisionLevel2Arr), 'JOINT2')
                    .appendField(',')
                    .appendField('Joint3')
                    .appendField(new Blockly.FieldDropdown(collisionLevel3Arr), 'JOINT3')
                this.appendDummyInput()
                    .appendField('Joint4')
                    .appendField(new Blockly.FieldDropdown(collisionLevel4Arr), 'JOINT4')
                    .appendField(',')
                    .appendField('Joint5')
                    .appendField(new Blockly.FieldDropdown(collisionLevel5Arr), 'JOINT5')
                    .appendField(',')
                    .appendField('Joint6')
                    .appendField(new Blockly.FieldDropdown(collisionLevel6Arr), 'JOINT6')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setanticollision'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var joint1 = block.getFieldValue('JOINT1');
            var joint2 = block.getFieldValue('JOINT2');
            var joint3 = block.getFieldValue('JOINT3');
            var joint4 = block.getFieldValue('JOINT4');
            var joint5 = block.getFieldValue('JOINT5');
            var joint6 = block.getFieldValue('JOINT6');
            var code = "";
            code = 'SetAnticollision(0,{' + joint1 + ',' + joint2 + ',' + joint3 + ',' + joint4 + ',' + joint5 + ',' + joint6 +'},0)\n' 
            return code;
        };

        /* ç¢°æç­çº§-èªå®ä¹ç¾åæ¯ */
        Blockly.Blocks['setanticollisionauto'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[2].children[8].name + '-' + collideModeDataArr[1][0])
                this.appendDummyInput()
                    .appendField('Joint1')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT1')
                    .appendField(',')
                    .appendField('Joint2')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT2')
                    .appendField(',')
                    .appendField('Joint3')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT3')
                this.appendDummyInput()
                    .appendField('Joint4')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT4')
                    .appendField(',')
                    .appendField('Joint5')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT5')
                    .appendField(',')
                    .appendField('Joint6')
                    .appendField(new Blockly.FieldNumber(50, 1, 100, 0), 'JOINT6')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setanticollisionauto'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var joint1 = block.getFieldValue('JOINT1');
            var joint2 = block.getFieldValue('JOINT2');
            var joint3 = block.getFieldValue('JOINT3');
            var joint4 = block.getFieldValue('JOINT4');
            var joint5 = block.getFieldValue('JOINT5');
            var joint6 = block.getFieldValue('JOINT6');
            var code = "";
            code = 'SetAnticollision(1,{' + joint1/10 + ',' + joint2/10 + ',' + joint3/10 + ',' + joint4/10 + ',' + joint5/10 + ',' + joint6/10 +'},0)\n' 
            return code;
        };

        /* ç¢°ææ£æµå¼å¯ */
        Blockly.Blocks['setcollisiondetectionstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._detect_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._detection)
                    .appendField(new Blockly.FieldDropdown(detectionDataArr), "DETECTION")
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT3')
                this.appendDummyInput()
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(100, 1, 1000, 0), 'JOINT6')
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'X')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'Y')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'Z')
                this.appendDummyInput()
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'RX')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'RY')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(300, 1, 1000, 0), 'RZ')
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(collsionBlockDataArr), "ISBLOCK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };

        Blockly.Lua['setcollisiondetectionstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var detection = block.getFieldValue('DETECTION');
            var joint1 = block.getFieldValue('JOINT1');
            var joint2 = block.getFieldValue('JOINT2');
            var joint3 = block.getFieldValue('JOINT3');
            var joint4 = block.getFieldValue('JOINT4');
            var joint5 = block.getFieldValue('JOINT5');
            var joint6 = block.getFieldValue('JOINT6');
            var x = block.getFieldValue('X');
            var y = block.getFieldValue('Y');
            var z = block.getFieldValue('Z');
            var rx = block.getFieldValue('RX');
            var ry = block.getFieldValue('RY');
            var rz = block.getFieldValue('RZ');
            var clog = block.getFieldValue('ISBLOCK');
            var code = "";
            code = `CustomCollisionDetectionStart(${detection},{${joint1},${joint2},${joint3},${joint4},${joint5},${joint6}},{${x},${y},${z},${rx},${ry},${rz}},${clog})\n`;
            return code;
        };

        /* ç¢°ææ£æµå³é­ */
        Blockly.Blocks['setcollisiondetectionend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._detect_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setcollisiondetectionend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CustomCollisionDetectionEnd()\n' 
            return code;
        };
        
        /* å éåº¦ */
        Blockly.Blocks['setoaccscale'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[2].children[11].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_acc_percentage)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'PERCENT')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#cd50d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setoaccscale'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var percent = block.getFieldValue('PERCENT');
            var code = 'SetOaccScale(' + percent + ')\n' 
            return code;
        };
        
        /* å¤¹çªè¿å¨ */
        Blockly.Blocks['movegripper'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[47].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._gripper_number)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]]), "ID")
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._gripper_position)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'POSITION')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._gripper_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._gripper_moment)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'TORQUE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._maxtime)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'MAXTIME')
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._whether_block)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WHETHERBLOCK")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movegripper'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue('ID');
            var position = block.getFieldValue('POSITION');
            var speed = block.getFieldValue('SPEED');
            var torque = block.getFieldValue('TORQUE');
            var maxtime = block.getFieldValue('MAXTIME');
            var whether = block.getFieldValue('WHETHERBLOCK');
            var code = 'MoveGripper(' + id + ',' + position + ',' + speed + ',' + torque + ',' + maxtime + ',' + whether + ')\n' 
            return code;
        };
        
        /* å¤¹çªå¤ä½ */
        Blockly.Blocks['actgripperreset'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[48].name)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]]), "ID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['actgripperreset'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue('ID');
            var code = 'ActGripper(' + id + ',0)\n' 
            return code;
        };
        
        /* å¤¹çªæ¿æ´» */
        Blockly.Blocks['actgripper'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[49].name)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]]), "ID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['actgripper'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue('ID');
            var code = 'ActGripper(' + id + ',1)\n' 
            return code;
        };

        /* å¼å§å·æ¶ */
        Blockly.Blocks['spraystart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[50].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['spraystart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'SprayStart()\n' 
            return code;
        };

        /* åæ­¢å·æ¶ */
        Blockly.Blocks['spraystop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[51].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['spraystop'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'SprayStop()\n' 
            return code;
        };

        /* å¼å§æ¸æª */
        Blockly.Blocks['powercleanstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[52].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['powercleanstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'PowerCleanStart()\n' 
            return code;
        };

        /* åæ­¢æ¸æª */
        Blockly.Blocks['powercleanstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[53].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['powercleanstop'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'PowerCleanStop()\n' 
            return code;
        };

        /* æ©å±è½´UDPéä¿¡å è½½ */
        Blockly.Blocks['extdevloadudpdriver'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[67].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extdevloadudpdriver'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'ExtDevLoadUDPDriver()\n' 
            return code;
        };

        /* æ©å±è½´UDPéä¿¡éç½® */
        Blockly.Blocks['extdevudpcomparam'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[68].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_modbus_communicate_ip)
                    .appendField(new Blockly.FieldTextInput("192.168.61.8080"), 'ADDRESS')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_modbus_communicate_port)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'PORT')
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._externa_modbus_communicate_period)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'PERIOD')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extdevudpcomparam'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var address = block.getFieldValue("ADDRESS");
            var port = block.getFieldValue("PORT");
            var period = block.getFieldValue("PERIOD");
            var code = 'ExtDevSetUDPComParam(\"' + address + '\",' + port + ',' + period + ')\n' 
            return code;
        };

        /* æ©å±è½´è¿å¨ï¼å éåº¦å¹³æ»æ¨¡å¼å¼å§ï¼*/
        Blockly.Blocks['extaxismovestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[3].children[2].name + '(' + graphInputTitles.motion._acc_smooth_start + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxismovestart'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothStart()\n";
            return code;
        };

        /* æ©å±è½´è¿å¨ï¼å éåº¦å¹³æ»æ¨¡å¼ç»æï¼*/
        Blockly.Blocks['extaxismoveend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(programCategoryArray[3].children[2].name + '(' + graphInputTitles.motion._acc_smooth_end + ')')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxismoveend'] = function (block) {
            // TODO: Assemble Lua into code variable.
            var code = "AccSmoothEnd()\n";
            return code;
        };

        /* æ©å±è½´å¼æ­¥è¿å¨ */
        Blockly.Blocks['extaxisptp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[69].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 500, 1), "RADIUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxisptp'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point = block.getFieldValue("POINTNAME");
            var dropValue = block.getFieldValue("DROPVALUE");
            var radius = block.getFieldValue("RADIUS");
            var speed = block.getFieldValue("SPEED");
            var code = '';
            if (dropValue == -1) {
                code = 'EXT_AXIS_PTP(0,' + point + ',' + speed + ',-1)\n'
            } else {
                code = 'EXT_AXIS_PTP(0,' + point + ',' + speed + ',' + radius + ')\n'
            }
            return code;
        };

        /* æ©å±è½´åæ­¥PTPè¿å¨ */
        Blockly.Blocks['extaxismoveptp'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[70].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 500, 1), "RADIUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxismoveptp'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point = block.getFieldValue("POINTNAME");
            var dropValue = block.getFieldValue('DROPVALUE');
            var radius = block.getFieldValue('RADIUS');
            var speed = block.getFieldValue("SPEED");
            var code = "";
            
            if (dropValue == -1) {
                code += 'EXT_AXIS_PTP(1,' + point + ',' + speed + ',-1)\n';
                code += 'PTP(' + point + ',' + speed + ',-1,0)\n';
            } else {
                code += 'EXT_AXIS_PTP(1,' + point + ',' + speed + ',' + radius + ')\n';
                code += 'PTP(' + point + ',' + speed + ',' + radius + ',0)\n';
            }
            return code;
        };

        /* æ©å±è½´åæ­¥LINè¿å¨ */
        Blockly.Blocks['extaxismovelin'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[182].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), "RADIUS")
                    .appendField(',')
                    .appendField(new Blockly.FieldDropdown(smoothStrategyDataArr), "SMOOTHSTRATEGY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxismovelin'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point = block.getFieldValue("POINTNAME");
            var dropValue = block.getFieldValue('DROPVALUE');
            var radius = block.getFieldValue('RADIUS');
            var smoothStrategy = block.getFieldValue("SMOOTHSTRATEGY");
            var speed = block.getFieldValue("SPEED");
            var code = "";
            if (dropValue == -1) {
                code += 'EXT_AXIS_PTP(1,' + point + ',' + speed + ',-1)\n';
                code += 'Lin(' + point + ',' + speed + ',-1,0,0)\n';
            } else {
                code += 'EXT_AXIS_PTP(1,' + point + ',' + speed + ',' + radius + ')\n';
                if (smoothStrategy == 0) {
                    code += 'Lin(' + point + ',' + speed + ',' + radius + ',0,0)\n';
                } else {
                    code += 'Lin(' + point + ',' + speed + ',' + radius + ',0,0,0,0,0,0,0,0,1)\n';
                }
            }
            return code;
        };

        /* æ©å±è½´åæ­¥ARCè¿å¨ */
        Blockly.Blocks['extaxisarc'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[71].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._arc1_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._arc_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME2")
                    .appendField(",")
                    .appendField(new Blockly.FieldDropdown(linModeDataArr), "DROPVALUE")
                    .appendField(",")
                    .appendField(new Blockly.FieldNumber(0, 0, 500, 1), "RADIUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxisarc'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var point1 = block.getFieldValue("POINTNAME1");
            var point2 = block.getFieldValue("POINTNAME2");
            var dropValue = block.getFieldValue('DROPVALUE');
            var radius = block.getFieldValue('RADIUS');
            var speed = block.getFieldValue("SPEED");
            var code = '';
            if (dropValue == -1) {
                code += 'EXT_AXIS_PTP(1,' + point2 + ',' + speed + ',-1)\n';
                code += 'ARC(' + point1 + ',0,0,0,0,0,0,0,' + point2 + ',0,0,0,0,0,0,0,' + speed + ',-1)\n';
            } else {
                code += 'EXT_AXIS_PTP(1,' + point2 + ',' + speed + ',' + radius + ')\n';
                code += 'ARC(' + point1 + ',0,0,0,0,0,0,0,' + point2 + ',0,0,0,0,0,0,0,' + speed + ',' + radius + ')\n';
            }
            return code;
        };

        /* æ©å±è½´åé¶æä»¤ */
        Blockly.Blocks['extaxissethoming'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[72].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_id)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "4"], ["4", "8"]]), "ID")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_zero_mode)
                    .appendField(new Blockly.FieldDropdown(zeroModeDataArr), "HOMING")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_search_speed)
                    .appendField(new Blockly.FieldNumber(5, 0, 300, 0), 'SPEED1')
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._externa_axis_latch_speed)
                    .appendField(new Blockly.FieldNumber(2, 0, 300, 0), 'SPEED2')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxissethoming'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var homing = block.getFieldValue("HOMING");
            var speed1 = block.getFieldValue("SPEED1");
            var speed2 = block.getFieldValue("SPEED2");
            var code = 'ExtAxisSetHoming(' + id + ',' + homing + ',' + speed1 + ',' + speed2 + ')\n' 
            return code;
        };

        /* æ©å±è½´ä½¿è½æä»¤ */
        Blockly.Blocks['extaxisservoon'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[73].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_id)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "4"], ["4", "8"]]), "ID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['extaxisservoon'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var code = 'ExtAxisServoOn(' + id + ',1)\n' 
            return code;
        };

        /* æ©å±è½´ä¼ºæID */
        Blockly.Blocks['auxservostatusid'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[74].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservostatusid'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var code = 'AuxServoSetStatusID(' + id + ')\n' 
            return code;
        };

        /* æ©å±è½´æ§å¶æ¨¡å¼ */
        Blockly.Blocks['auxservocontrol'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[75].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                    .appendField(graphInputTitles.pherial._control_mode)
                    .appendField(new Blockly.FieldDropdown(auxServoCommandModeArr), "CONTROLMODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservocontrol'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var control_mode = block.getFieldValue("CONTROLMODE");
            var code = 'AuxServoEnable(' + id + ',0)\n' 
                     + 'AuxServoSetControlMode(' + id + ',' + control_mode + ')\n' 
                     + 'AuxServoEnable(' + id + ',1)\n'; 
            return code;
        };

        /* æ©å±è½´ä¼ºæä½¿è½ */
        Blockly.Blocks['auxservoenable'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[76].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                    .appendField(graphInputTitles.pherial._externa_servo_on)
                    .appendField(new Blockly.FieldDropdown(servoEnableDataArr), "SERVOENABLE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservoenable'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var enable = block.getFieldValue("SERVOENABLE");
            var code = 'AuxServoEnable(' + id + ',' + enable + ')\n'; 
            return code;
        };

        /* æ©å±è½´ä¼ºæåé¶ */
        Blockly.Blocks['auxservohoming'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[77].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_zero_mode)
                    .appendField(new Blockly.FieldDropdown(servoZeroModeDataArr), "HOMINGMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_search_speed)
                    .appendField(new Blockly.FieldNumber(0, 0, 2000, 0), 'SPEED1')
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._externa_axis_latch_speed)
                    .appendField(new Blockly.FieldNumber(0, 0, 2000, 0), 'SPEED2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_acc_percentage)
                    .appendField(new Blockly.FieldNumber(100, 1, 100, 0), 'ACC')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservohoming'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var mode = block.getFieldValue("HOMINGMODE");
            var speed1 = block.getFieldValue("SPEED1");
            var speed2 = block.getFieldValue("SPEED2");
            var acc = block.getFieldValue("ACC");
            var code = 'AuxServoHoming(' + id + ',' + mode + ',' + speed1 + ',' + speed2 + ',' + acc + ')\n'; 
            return code;
        };

        /* æ©å±è½´ä½ç½®æ¨¡å¼ */
        Blockly.Blocks['auxservotargetpos'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[78].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._target_pos)
                    .appendField(new Blockly.FieldNumber(100, -10000, 10000, 0), 'POSITION')
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._running_speed)
                    .appendField(new Blockly.FieldNumber(100, -10000, 10000, 0), 'SPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_acc_percentage)
                    .appendField(new Blockly.FieldNumber(100, 1, 100, 0), 'ACC')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservotargetpos'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var position = block.getFieldValue("POSITION");
            var speed = block.getFieldValue("SPEED");
            var acc = block.getFieldValue("ACC");
            var code = 'AuxServoSetTargetPos(' + id + ',' + position + ',' + speed + ',' + acc + ')\n'; 
            return code;
        };

        /* æ©å±è½´éåº¦æ¨¡å¼ */
        Blockly.Blocks['auxservotargetspeed'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[79].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._servo_id)
                    .appendField(new Blockly.FieldDropdown(servoIdDataArr), "ID")
                    .appendField(',')
                    .appendField(graphInputTitles.pherial._target_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._debug_acc_percentage)
                    .appendField(new Blockly.FieldNumber(100, 1, 100, 0), 'ACC')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['auxservotargetspeed'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var id = block.getFieldValue("ID");
            var speed = block.getFieldValue("SPEED");
            var acc = block.getFieldValue("ACC");
            var code = 'AuxServoSetTargetSpeed(' + id + ',' + speed + ',' + acc + ')\n'; 
            return code;
        };

        /* ä¼ éå¸¦ioå®æ¶æ£æµ */
        Blockly.Blocks['conveyoriodetect'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[54].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._weld_time)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'MAXWAITTIME')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['conveyoriodetect'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var time = block.getFieldValue("MAXWAITTIME");
            var code = 'ConveyorIODetect(' + time + ')\n'; 
            return code;
        };

        /* ä¼ éå¸¦ä½ç½®å®æ¶æ£æµ */
        Blockly.Blocks['conveyorgettrack'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[55].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._work_mode)
                    .appendField(new Blockly.FieldDropdown(conTrackModeDataArr), "MODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['conveyorgettrack'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var mode = block.getFieldValue("MODE");
            var code = 'ConveyorGetTrackData(' + mode + ')\n'; 
            return code;
        };

        /* ä¼ éå¸¦è·è¸ªå¼å¯ */
        Blockly.Blocks['conveyortrackstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[56].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._work_mode)
                    .appendField(new Blockly.FieldDropdown(conTrackModeDataArr), "MODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['conveyortrackstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var mode = block.getFieldValue("MODE");
            var code = 'ConveyorTrackStart(' + mode + ')\n'; 
            return code;
        };

        /* ä¼ éå¸¦è·è¸ªå³é­ */
        Blockly.Blocks['conveyortrackend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[57].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['conveyortrackend'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'ConveyorTrackEnd()\n'; 
            return code;
        };

        /* æç£¨è®¾å¤ä½¿è½ */
        Blockly.Blocks['polishingdeviceenable'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[60].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._device_enable)
                    .appendField(new Blockly.FieldDropdown(enableDataArr), "ENABLEMODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingdeviceenable'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var mode = block.getFieldValue("ENABLEMODE");
            var code = 'PolishingDeviceEnable(' + mode + ')\n'; 
            return code;
        };

        /* æç£¨è®¾å¤éè¯¯æ¸é¤ */
        Blockly.Blocks['polishingclearerror'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[61].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingclearerror'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'PolishingClearError()\n'; 
            return code;
        };

        /* æç£¨è®¾å¤åä¼ æå¨æ¸é¶ */
        Blockly.Blocks['polishingtorquesensorreset'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[62].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtorquesensorreset'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'PolishingTorqueSensorReset()\n'; 
            return code;
        };

        /* æç£¨è½¬é */
        Blockly.Blocks['polishingtargetVel'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[63].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._rotate_speed)
                    .appendField(new Blockly.FieldNumber(5500, 0, 5500, 0), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtargetVel'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var speed = block.getFieldValue("SPEED");
            var code = 'PolishingSetTargetVelocity(' + speed + ')\n'; 
            return code;
        };

        /* æç£¨æ¥è§¦å */
        Blockly.Blocks['polishingtargettorque'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[64].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._set_force)
                    .appendField(new Blockly.FieldNumber(200, 0, 200, 0), 'FORCE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtargettorque'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var force = block.getFieldValue("FORCE");
            var code = 'PolishingSetTargetTorque(' + force + ')\n'; 
            return code;
        };

        /* æç£¨ä¼¸åºè·ç¦» */
        Blockly.Blocks['polishingtargetposition'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[65].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._protrusion_distance)
                    .appendField(new Blockly.FieldNumber(0, 0, 12, 0), 'LENGTH')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtargetposition'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var length = block.getFieldValue("LENGTH");
            var code = 'PolishingSetTargetPosition(' + length + ')\n'; 
            return code;
        };

        /* æç£¨æ¥è§¦å */
        Blockly.Blocks['polishingtouchforce'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[151].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._set_force)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'FORCE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtouchforce'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var force = block.getFieldValue("FORCE");
            var code = 'PolishingSetTargetTouchForce(' + force + ')\n'; 
            return code;
        };

        /* æç£¨è®¾å®è¿æ¸¡æ¶é´ */
        Blockly.Blocks['polishingtouchtorquetime'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[152].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._set_force_trans_time)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'TIME')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtouchtorquetime'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var time = block.getFieldValue("TIME");
            var code = 'PolishingSetTargetTouchTime(' + time + ')\n'; 
            return code;
        };

        /* æç£¨å·¥ä»¶éé */
        Blockly.Blocks['polishingworkpieceweight'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[153].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._workpice_weight)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'WEIGHT')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingworkpieceweight'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var weight = block.getFieldValue("WEIGHT");
            var code = 'PolishingSetWorkPieceWeight(' + weight + ')\n'; 
            return code;
        };

        /* æç£¨æ§å¶æ¨¡å¼ */
        Blockly.Blocks['polishingtargetcontrolmode'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[66].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._control_mode)
                    .appendField(new Blockly.FieldDropdown(polishCommandModeArr), "CONTROLMODE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingtargetcontrolmode'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var mode = block.getFieldValue("CONTROLMODE");
            var code = 'PolishingSetOperationMode(' + mode + ')\n'; 
            return code;
        };

        /* è®¾ç½®DFCæç£¨å¤´çåè®¾å®å¼ */
        Blockly.Blocks['polishingsetdfcforce'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[183].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._polish_channel)
                    .appendField(new Blockly.FieldDropdown(polishChannelDataArr), "CHANNELMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._set_force + "(N)")
                    .appendField(new Blockly.FieldNumber(10, 0, 30, 0), 'TARGETFORCE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishingsetdfcforce'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var channel = block.getFieldValue("CHANNELMODE");
            var force = block.getFieldValue("TARGETFORCE");
            var code = 'SetDFCForce(' + channel + "," + force + ')\n'; 
            return code;
        };

        /* è·åå½åDFCæç£¨å¤´çå®æ¶ç¶æ */
        Blockly.Blocks['polishinggetdfcstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[184].name)
                this.setOutput(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['polishinggetdfcstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'GetDFCState()\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };
        
        /* å¸çââå¸çæ§å¶æä»¤ */
        Blockly.Blocks['setsuckerctrl'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._suction_cup_control_command)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave_name)
                    .appendField(new Blockly.FieldDropdown(suckerControlModeArr), "SUCKERCONTROLMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave_name)
                    .appendField(new Blockly.FieldDropdown(suctionPortDictArr), "SUCKERPORT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._write_quantity)
                    .appendField(new Blockly.FieldNumber(1, 1, 20, 0), "SUCKERNUMBER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._suction_status)
                    .appendField(new Blockly.FieldTextInput("2"), 'SUCKERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setsuckerctrl'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("SUCKERCONTROLMODE");
            var port = block.getFieldValue("SUCKERPORT");
            var number = block.getFieldValue("SUCKERNUMBER");
            var value = block.getFieldValue("SUCKERVALUE");
            var code = `SetSuckerCtrl(${mode == 1 ? 0 : port},${mode == 1 ? 1 : number},{${value}})\n`; 
            return code;
        };

        /* å¸çââè·åå¸çç¶ææä»¤ */
        Blockly.Blocks['getsuckerstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._get_suction_cup_status)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave_name)
                    .appendField(new Blockly.FieldDropdown(suctionPortDictArr), "SUCKERPORT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['getsuckerstate'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SUCKERPORT");
            var code = `GetSuckerState(${port})\n`; 
            return code;
        };

        /* ç­å¾å¸çå¸éç¶æ */
        Blockly.Blocks['waitsuckerstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._wait_for_suction_status)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave_name)
                    .appendField(new Blockly.FieldDropdown(suctionPortDictArr), "SUCKERPORT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._new_spline_mode)
                    .appendField(new Blockly.FieldDropdown(suckerStateDictArr), "SUCKERMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(1000, 0, 100000, 0), "SUCKERTIME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['waitsuckerstate'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SUCKERPORT");
            var mode = block.getFieldValue("SUCKERMODE");
            var time = block.getFieldValue("SUCKERTIME");
            var code = `WaitSuckerState(${port},${mode},${time})\n`; 
            return code;
        };
        
        /* è·åæ«ç«¯å¨ææ°æ®é¿åº¦ */
        Blockly.Blocks['getaxlegencomcycle'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._get_end_period_length)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['getaxlegencomcycle'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = `GetAxleGenComCycleData()\n`; 
            return code;
        };

        /* åéæ«ç«¯éå¨ææ°æ® */
        Blockly.Blocks['sndrcvaxlegencom'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._send_non_period_data)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._data_length)
                    .appendField(new Blockly.FieldNumber(1, 0, 16, 1), "ENDTPLENGTH")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._send_data)
                    .appendField(new Blockly.FieldTextInput("2"), 'ENDTPDATA')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._res_length)
                    .appendField(new Blockly.FieldNumber(1, 0, 16, 1), "ENDTPRESLENGTH")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['sndrcvaxlegencom'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var length = block.getFieldValue("ENDTPLENGTH");
            var data = block.getFieldValue("ENDTPDATA");
            var resLength = block.getFieldValue("ENDTPRESLENGTH");
            var code = `SndRcvAxleGenComCmdData(${length},{${data}},${resLength})\n`; 
            return code;
        };

        /* CNC--æºåºå¼å§è¿è¡å å·¥ */
        Blockly.Blocks['cncworkstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[160].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncworkstart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCWorkStart()\n';
            return code;
        };

        /* CNC--æºåºåæ­¢è¿è¡å å·¥ */
        Blockly.Blocks['cncworkstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[161].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncworkstop'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCWorkStop()\n';
            return code;
        };

        /* CNC--æºåºå¼é¨ */
        Blockly.Blocks['cncdooropen'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[162].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncdooropen'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCDoorOpen()\n';
            return code;
        };

        /* CNC--æºåºå³é¨ */
        Blockly.Blocks['cncdoorclose'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[163].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncdoorclose'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCDoorClose()\n';
            return code;
        };

        /* CNC--æºåºå¡çæ¾å¼ */
        Blockly.Blocks['cncchuckopen'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[164].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncchuckopen'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCChuckOpen()\n';
            return code;
        };

        /* CNC--æºåºå¡çå¤¹ç´§ */
        Blockly.Blocks['cncchuckfastening'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[165].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncchuckfastening'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCChuckFastening()\n';
            return code;
        };

        /* CNC--æºåºæ¥åçæ */
        Blockly.Blocks['cncsetemergencyon'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[166].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncsetemergencyon'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCSetEmergencyOn()\n';
            return code;
        };

        /* CNC--æºåºæ¥åéåº */
        Blockly.Blocks['cncsetemergencyoff'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[167].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncsetemergencyoff'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCSetEmergencyOff()\n';
            return code;
        };

        /* CNC--æºåºå½åç¶æè·å */
        Blockly.Blocks['cncgetstatus'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[168].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetstatus'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetStatus()\n';
            return code;
        };

        /* CNC--æºåºè¿è¡ç¶æè·å */
        Blockly.Blocks['cncgetrunningstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[169].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetrunningstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetRunningState()\n';
            return code;
        };

        /* CNC--æºåºé¨ç¶æè·å */
        Blockly.Blocks['cncgetdoorstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[170].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetdoorstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetDoorState()\n';
            return code;
        };

        /* CNC--æºåºå¡çç¶æè·å */
        Blockly.Blocks['cncgetchuckstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[171].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetchuckstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetChuckState()\n';
            return code;
        };

        /* CNC--æºåºæ¥åç¶æè·å */
        Blockly.Blocks['cncgetemergencystate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[172].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetemergencystate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetEmergencyState()\n';
            return code;
        };

        /* CNC--æºåºæ¥è­¦ç¶æè·å */
        Blockly.Blocks['cncgetwarningstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[173].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncgetwarningstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var code = 'CNCGetWarningState()\n';
            return code;
        };

        /* CNC--ç­å¾æºåºè¿è¡ç¶æ */
        Blockly.Blocks['cncwaitrunningstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[174].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._program_status)
                    .appendField(new Blockly.FieldDropdown(cncWaitRunArr), "STATUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timeout_select)
                    .appendField(new Blockly.FieldDropdown(cncTimeoutArr), "TIMEOUT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timestamp)
                    .appendField(new Blockly.FieldNumber(1, 1, 10000, 1), 'TIMESTAMP')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timeout_policy)
                    .appendField(new Blockly.FieldDropdown(cncTimeoutPolicyArr), "POLICY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncwaitrunningstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var status = block.getFieldValue("STATUS");
            var timeout = block.getFieldValue("TIMEOUT");
            var timestamp = block.getFieldValue("TIMESTAMP");
            var policy = block.getFieldValue("POLICY");
            var code;
            if (timeout == 0) {
                code = `CNCWaitRunningState(${status},${timestamp ? timestamp : 1},${policy})\n`;
            } else {
                code = `CNCWaitRunningState(${status},${timeout},${policy})\n`;
            }
            return code;
        };

        /* CNC--ç­å¾æºåºå¡çç¶æ */
        Blockly.Blocks['cncwaitchuckstate'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[175].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._chuck_state)
                    .appendField(new Blockly.FieldDropdown(cncChuckStatusArr), "STATUS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timeout_select)
                    .appendField(new Blockly.FieldDropdown(cncTimeoutArr), "TIMEOUT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timestamp)
                    .appendField(new Blockly.FieldNumber(1, 1, 10000, 1), 'TIMESTAMP')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._timeout_policy)
                    .appendField(new Blockly.FieldDropdown(cncTimeoutPolicyArr), "POLICY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#e5804a");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['cncwaitchuckstate'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var status = block.getFieldValue("STATUS");
            var timeout = block.getFieldValue("TIMEOUT");
            var timestamp = block.getFieldValue("TIMESTAMP");
            var policy = block.getFieldValue("POLICY");
            var code;
            if (timeout == 0) {
                code = `CNCWaitChuckState(${status},${timestamp ? timestamp : 1},${policy})\n`;
            } else {
                code = `CNCWaitChuckState(${status},${timeout},${policy})\n`;
            }
            return code;
        };

        /* çæ¥çµæµ */
        Blockly.Blocks['setweldingcurrent'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[85].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_electric)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'CURRENT')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._output_AO_current)
                    .appendField(new Blockly.FieldDropdown(outputAOArr), "OUTPUTAO")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_smooth)
                    .appendField(new Blockly.FieldDropdown(weldSmoothArr), "SMOOTH")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setweldingcurrent'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var current = block.getFieldValue("CURRENT");
            var outputAO = block.getFieldValue("OUTPUTAO");
            var smooth = block.getFieldValue("SMOOTH");
            var code;
            if (type == 0) {
                code = 'WeldingSetCurrent(' + type + ',' + current + ',' + outputAO + ',' + smooth + ')\n';
            } else {
                code = 'WeldingSetCurrent(' + type + ',' + current + ',0,0)\n';
            };
            return code;
        };

        /* çæ¥çµæµæ¸åå¼å§ */
        Blockly.Blocks['setCurrentGradualChangeStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[176].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_electric_start)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'CURRENTSTART')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_electric_end)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'CURRENTEND')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._output_AO_current)
                    .appendField(new Blockly.FieldDropdown(outputAOArr), "OUTPUTAO")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_smooth)
                    .appendField(new Blockly.FieldDropdown(weldSmoothArr), "SMOOTH")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setCurrentGradualChangeStart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var currentStart = block.getFieldValue("CURRENTSTART");
            var currentEnd = block.getFieldValue("CURRENTEND");
            var outputAO = block.getFieldValue("OUTPUTAO");
            var smooth = block.getFieldValue("SMOOTH");
            var code;
            if (type == 0) {
                code = 'WeldingSetCurrentGradualChangeStart(' + type + ',' + currentStart + ',' + currentEnd + ',' + outputAO + ',' + smooth + ')\n';
            } else {
                code = 'WeldingSetCurrentGradualChangeStart(' + type + ',' + currentStart + ',' + currentEnd + ',0,0)\n';
            };
            return code;
        };

        /* çæ¥çµæµæ¸åç»æ */
        Blockly.Blocks['setCurrentGradualChangeEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[177].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setCurrentGradualChangeEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'WeldingSetCurrentGradualChangeEnd()\n';
            return code;
        };

        /* çæ¥çµå */
        Blockly.Blocks['setweldingvoltage'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[84].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_voltage)
                    .appendField(new Blockly.FieldNumber(100, 0, 200, 0), 'VOLTAGE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._output_AO_current)
                    .appendField(new Blockly.FieldDropdown(outputAOArr), "OUTPUTAO")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_smooth)
                    .appendField(new Blockly.FieldDropdown(weldSmoothArr), "SMOOTH")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setweldingvoltage'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var type = block.getFieldValue("IOTYPE");
            var voltage = block.getFieldValue("VOLTAGE");
            var outputAO = block.getFieldValue("OUTPUTAO");
            var smooth = block.getFieldValue("SMOOTH");
            var code;
            if (type == 0) {
                code = 'WeldingSetVoltage(' + type + ',' + voltage + ',' + outputAO + ',' + smooth + ')\n';
            } else {
                code = 'WeldingSetVoltage(' + type + ',' + voltage + ',0,0)\n';
            };
            return code;
        };

        /* çæ¥çµåæ¸åå¼å§ */
        Blockly.Blocks['setVoltageGradualChangeStart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[178].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_voltage_start)
                    .appendField(new Blockly.FieldNumber(100, 0, 200, 0), 'VOLTAGESTART')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_voltage_end)
                    .appendField(new Blockly.FieldNumber(100, 0, 200, 0), 'VOLTAGEEND')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._output_AO_current)
                    .appendField(new Blockly.FieldDropdown(outputAOArr), "OUTPUTAO")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_smooth)
                    .appendField(new Blockly.FieldDropdown(weldSmoothArr), "SMOOTH")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setVoltageGradualChangeStart'] = function (block) {
            // TODO: Assemble Lua into code variable. 
            var type = block.getFieldValue("IOTYPE");
            var voltageStart = block.getFieldValue("VOLTAGESTART");
            var voltageEnd = block.getFieldValue("VOLTAGEEND");
            var outputAO = block.getFieldValue("OUTPUTAO");
            var smooth = block.getFieldValue("SMOOTH");
            var code;
            if (type == 0) {
                code = 'WeldingSetVoltageGradualChangeStart(' + type + ',' + voltageStart + ',' + voltageEnd + ',' + outputAO + ',' + smooth + ')\n';
            } else {
                code = 'WeldingSetVoltageGradualChangeStart(' + type + ',' + voltageStart + ',' + voltageEnd + ',0,0)\n';
            };
            return code;
        };

        /* çæ¥çµåæ¸åç»æ */
        Blockly.Blocks['setVoltageGradualChangeEnd'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[179].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setVoltageGradualChangeEnd'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'WeldingSetVoltageGradualChangeEnd()\n';
            return code;
        };

        /* å³æ° */
        Blockly.Blocks['setaspirated'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[88].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setaspirated'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetAspirated(' + type + ',0)\n'; 
            return code;
        };

        /* éæ° */
        Blockly.Blocks['setaspiratedout'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[89].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setaspiratedout'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetAspirated(' + type + ',1)\n'; 
            return code;
        };

        /* æ­£åéä¸ */
        Blockly.Blocks['setforwardWirefeed'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[91].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setforwardWirefeed'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetForwardWireFeed(' + type + ',1)\n'; 
            return code;
        };

        /* åæ­¢æ­£åéä¸ */
        Blockly.Blocks['setforwardWirefeedstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[90].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setforwardWirefeedstop'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetForwardWireFeed(' + type + ',0)\n'; 
            return code;
        };

        /* ååéä¸ */
        Blockly.Blocks['setreversewirefeed'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[93].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setreversewirefeed'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetReverseWireFeed(' + type + ',1)\n'; 
            return code;
        };

        /* åæ­¢ååéä¸ */
        Blockly.Blocks['setreversewirefeedstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[92].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._io_type)
                    .appendField(new Blockly.FieldDropdown(IOTypeDictArr), "IOTYPE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['setreversewirefeedstop'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("IOTYPE");
            var code = 'SetReverseWireFeed(' + type + ',0)\n'; 
            return code;
        };

        /* æå¼ä¼ æå¨-çç¼ç±»å */
        Blockly.Blocks['ltlaseron1'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[128].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_type)
                    .appendField(new Blockly.FieldNumber(49, 0, 49, 0), 'LASERTYPE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ltlaseron1'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("LASERTYPE");
            var code = 'LTLaserOn(' + type + ')\n'; 
            return code;
        };

        /* æå¼ä¼ æå¨-ä»»å¡å· */
        Blockly.Blocks['ltlaseron2'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[129].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_task)
                    .appendField(new Blockly.FieldNumber(255, 0, 255, 0), 'LASERTYPE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ltlaseron2'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("LASERTYPE");
            var code = 'LTLaserOn(' + type + ')\n'; 
            return code;
        };

        /* æå¼ä¼ æå¨-ä»»å¡å· */
        Blockly.Blocks['ltlaseron3'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[136].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_solution)
                    .appendField(new Blockly.FieldNumber(5, 0, 5, 0), 'LASERTYPE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ltlaseron3'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var type = block.getFieldValue("LASERTYPE");
            var code = 'LTLaserOn(' + type + ')\n'; 
            return code;
        };

        /* çç¼æ°æ®è®°å½ */
        Blockly.Blocks['lasersensorrecord'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[25].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._function_select)
                    .appendField(new Blockly.FieldDropdown(functionTypeDataArr), "FUNCTIONCHOICE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._function_select)
                    .appendField(new Blockly.FieldDropdown(delayModeDataArr), "DELAYMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._track_motion_mode)
                    .appendField(new Blockly.FieldDropdown(trackMotionModeDataArr), "TRACKMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._track_trigger_mode)
                    .appendField(new Blockly.FieldDropdown(trackTriggerModeDataArr), "TRIGGERMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._track_time)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'TRACKTIME')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._log_time_menu)
                    .appendField(new Blockly.FieldNumber(10, 0, 10000, 0), 'TIME')
                this.appendDummyInput()
                    .appendField(graphInputTitles.pherial._externa_axis_id)
                    .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "4"], ["4", "8"]]), "EXAXISID")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._distance)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 1), 'DISTANCE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._sensitive)
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.1), 'SENSITIVE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._search_speed)
                    .appendField(new Blockly.FieldNumber(30, 0, 100, 1), 'SPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['lasersensorrecord'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func = block.getFieldValue("FUNCTIONCHOICE");
            var delayMode = block.getFieldValue("DELAYMODE");
            var trackMode = block.getFieldValue("TRACKMODE");
            var triggerMode = block.getFieldValue("TRIGGERMODE");
            var trackTime = block.getFieldValue("TRACKTIME");
            var time = block.getFieldValue("TIME");
            var exaxisId = block.getFieldValue("EXAXISID");
            var distance = block.getFieldValue("DISTANCE");
            var sensitive = block.getFieldValue("SENSITIVE");
            var speed = block.getFieldValue("SPEED");
            var code = ""; 
            code += 'LaserSensorRecord(' + func + ',' + delayMode + ',' + time + ',' + exaxisId + ',' + distance + ',' + sensitive + ',' + trackMode + ',' + triggerMode + ',' + trackTime + ',' + speed +')\n'; 
            if (trackMode == 1 && func == 4) {
                code += 'MoveStationary()\n';
            }
            return code;
        };

        /* è¿å¨è³çç¼èµ·ç¹ */
        Blockly.Blocks['movetolaserrecordstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[107].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._motion_mode)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['LIN', '1']]), "FUNCTIONCHOICE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._search_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movetolaserrecordstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func = block.getFieldValue("FUNCTIONCHOICE");
            var speed = block.getFieldValue("SPEED");
            var code = 'MoveToLaserRecordStart(' + func + ',' + speed +')\n'; 
            return code;
        };

        /* è¿å¨è³çç¼ç»ç¹ */
        Blockly.Blocks['movetolaserrecordend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[106].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._motion_mode)
                    .appendField(new Blockly.FieldDropdown([['PTP', '0'], ['LIN', '1']]), "FUNCTIONCHOICE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._search_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['movetolaserrecordend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func = block.getFieldValue("FUNCTIONCHOICE");
            var speed = block.getFieldValue("SPEED");
            var code = 'MoveToLaserRecordEnd(' + func + ',' + speed +')\n'; 
            return code;
        };

        /* å¼å§å§¿æè°æ´ */
        Blockly.Blocks['postureadjuston'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[111].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._tech_plate_type)
                    .appendField(new Blockly.FieldDropdown(techPlateTypeArr), "FUNCTIONCHOICE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._tech_motion_direction)
                    .appendField(new Blockly.FieldDropdown(techMotionDirectionArr), "MOTIONOPERATION")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._tech_adjust_time)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'ADJUSTTIME')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._first_length)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'LENGTH1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._inflection_point_type)
                    .appendField(new Blockly.FieldDropdown(infPointTypeArr), "TYPE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._second_length)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'LENGTH2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._third_length)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'LENGTH3')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._fourth_length)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'LENGTH4')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._fifth_length)
                    .appendField(new Blockly.FieldNumber(100, 0, 1000, 0), 'LENGTH5')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['postureadjuston'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func = block.getFieldValue("FUNCTIONCHOICE");
            var motion_operation = block.getFieldValue("MOTIONOPERATION");
            var adjust_time = block.getFieldValue("ADJUSTTIME");
            var length1 = block.getFieldValue("LENGTH1");
            var type = block.getFieldValue("TYPE");
            var length2 = block.getFieldValue("LENGTH2");
            var length3 = block.getFieldValue("LENGTH3");
            var length4 = block.getFieldValue("LENGTH4");
            var length5 = block.getFieldValue("LENGTH5");
            var code = ""; 
            if (motion_operation == 0) {
                code = `PostureAdjustOn(${func},PosA,PosB,PosC,${adjust_time},${length1},`
                     + `${type},${length2},${length3},${length4},${length5})\n`;
            } else {
                code = `PostureAdjustOn(${func},PosA,PosC,PosB,${adjust_time},${length1},`
                     + `${type},${length2},${length3},${length4},${length5})\n`;
            }
            return code;
        };

        /* å³é­å§¿æè°æ´ */
        Blockly.Blocks['postureadjustoff'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[110].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._tech_plate_type)
                    .appendField(new Blockly.FieldDropdown(techPlateTypeArr), "FUNCTIONCHOICE")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['postureadjustoff'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func = block.getFieldValue("FUNCTIONCHOICE");
            var code = 'PostureAdjustOff(' + func + ')\n'; 
            return code;
        };

        /* çä¸å¯»ä½å¼å§ */
        Blockly.Blocks['wiresearchstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[112].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_reference_pos)
                    .appendField(new Blockly.FieldDropdown(wireRefPosDataArr), "SEARCHPOSITION")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_speed)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHSPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_distance)
                    .appendField(new Blockly.FieldNumber(10, 0, 1000, 0), 'SEARCHLENGTH')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_back_flag)
                    .appendField(new Blockly.FieldDropdown(wireSearchBackFlagDataArr), "SEARCHFLAG")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_back_speed)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHRETURNSPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_back_distance)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHRETURNLENGTH')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_mode)
                    .appendField(new Blockly.FieldDropdown(wireSearchModeDataArr), "SEARCHMODE")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var position = block.getFieldValue("SEARCHPOSITION");
            var search_speed = block.getFieldValue("SEARCHSPEED");
            var search_length = block.getFieldValue("SEARCHLENGTH");
            var flag = block.getFieldValue("SEARCHFLAG");
            var return_speed = block.getFieldValue("SEARCHRETURNSPEED");
            var return_length = block.getFieldValue("SEARCHRETURNLENGTH");
            var mode = block.getFieldValue("SEARCHMODE");
            var code = 'WireSearchStart(' + position + ',' + search_speed + ',' + search_length + ',' + flag + ',' + return_speed + ',' + return_length + ',' + mode + ')\n'; 
            return code;
        };

        /* çä¸å¯»ä½ç»æ */
        Blockly.Blocks['wiresearchend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[113].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_reference_pos)
                    .appendField(new Blockly.FieldDropdown(wireRefPosDataArr), "SEARCHPOSITION")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_speed)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHSPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_distance)
                    .appendField(new Blockly.FieldNumber(10, 0, 1000, 0), 'SEARCHLENGTH')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_back_flag)
                    .appendField(new Blockly.FieldDropdown(wireSearchBackFlagDataArr), "SEARCHFLAG")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_back_speed)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHRETURNSPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_back_distance)
                    .appendField(new Blockly.FieldNumber(10, 0, 100, 0), 'SEARCHRETURNLENGTH')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_mode)
                    .appendField(new Blockly.FieldDropdown(wireSearchModeDataArr), "SEARCHMODE")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var position = block.getFieldValue("SEARCHPOSITION");
            var search_speed = block.getFieldValue("SEARCHSPEED");
            var search_length = block.getFieldValue("SEARCHLENGTH");
            var flag = block.getFieldValue("SEARCHFLAG");
            var return_speed = block.getFieldValue("SEARCHRETURNSPEED");
            var return_length = block.getFieldValue("SEARCHRETURNLENGTH");
            var mode = block.getFieldValue("SEARCHMODE");
            var code = 'WireSearchEnd(' + position + ',' + search_speed + ',' + search_length + ',' + flag + ',' + return_speed + ',' + return_length + ',' + mode + ')\n'; 
            return code;
        };

        /* å¯»ä½ç¹è®¾ç½®æå a~fç¹ */
        Blockly.Blocks['wiresearchwait'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[138].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._point_name)
                    .appendField(new Blockly.FieldDropdown(pointsArr), "POINTNAME")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._debug_speed)
                    .appendField(new Blockly.FieldNumber(100, 0, 100, 0), 'SPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._smooth_stop)
                    .appendField(new Blockly.FieldDropdown(setTPDModeArr), "STOP")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._smooth_ptp)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 0), 'SMOOTH')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._search_flag)
                    .appendField(new Blockly.FieldDropdown(setTPDModeArr), "SEARCHFLAG")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._wire_search_point_name)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "SEARCHVAR")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._weld_record)
                    .appendField(new Blockly.FieldDropdown(weldRecordDataArr), "CHOICE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._tech_plate_type)
                    .appendField(new Blockly.FieldDropdown(TplateTypeArr), "TYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._offset)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "OFFSET")
                    .appendField(',')
                    .appendField('dx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHX')
                this.appendDummyInput()
                    .appendField('dy')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHY')
                    .appendField(',')
                    .appendField('dz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHZ')
                    .appendField(',')
                    .appendField('drx')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHRX')
                this.appendDummyInput()
                    .appendField('dry')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHRY')
                    .appendField(',')
                    .appendField('drz')
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'WIRESEARCHRZ')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchwait'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("POINTNAME");
            var speed = block.getFieldValue("SPEED");
            var stop = block.getFieldValue("STOP");
            var smooth = block.getFieldValue("SMOOTH");
            var flag = block.getFieldValue("SEARCHFLAG");
            var vary = block.getFieldValue("SEARCHVAR");
            var choice = block.getFieldValue("CHOICE");
            var type = block.getFieldValue("TYPE");
            var offset = block.getFieldValue("OFFSET");
            var x = block.getFieldValue("WIRESEARCHX");
            var y = block.getFieldValue("WIRESEARCHY");
            var z = block.getFieldValue("WIRESEARCHZ");
            var rx = block.getFieldValue("WIRESEARCHRX");
            var ry = block.getFieldValue("WIRESEARCHRY");
            var rz = block.getFieldValue("WIRESEARCHRZ");
            var code = "";
            if (name == "seamPos") {
                if (offset == 0) {
                    code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},${choice},${type},${offset})\n`;
                } else {
                    code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},${choice},${type},${offset},${x},${y},${z},${rx},${ry},${rz})\n`;
                }
            } else {
                if (flag == "false") {
                    if (offset == 0) {
                        code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},0,${offset})\n`;
                    } else {
                        code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},0,${offset},${x},${y},${z},${rx},${ry},${rz})\n`;
                    }
                } else {
                    if (offset == 0) {
                        code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},1,${offset})\n`
                             + `WireSearchWait(\"${vary}\")\n`;
                    } else {
                        code = `Lin(${name},${speed},${stop == 'true' ? -1 : smooth},1,${offset},${x},${y},${z},${rx},${ry},${rz})\n`
                             + `WireSearchWait(\"${vary}\")\n`;
                    }
                }
            }
            return code;
        };

        /* è®¡ç®åç§»é(è§çç¼) */
        Blockly.Blocks['wiresearchoffset'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[120].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_method)
                    .appendField(new Blockly.FieldDropdown(wireSearchType1MethodDataArr), "COMPUTEMODE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_ref_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT2")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point3)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH1")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_res_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point3)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH3")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchoffset'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("COMPUTEMODE");
            var point1 = block.getFieldValue("POINT1");
            var point2 = block.getFieldValue("POINT2");
            var point3 = block.getFieldValue("POINT3");
            var touch1 = block.getFieldValue("TOUCH1");
            var touch2 = block.getFieldValue("TOUCH2");
            var touch3 = block.getFieldValue("TOUCH3");
            var code = "";
            switch (mode) {
                case "0":
                    code = `GetWireSearchOffset(0,${mode},\"${point1}\",\"#\",\"#\",\"#\",\"#\",\"#\",\"${touch1}\",\"#\",\"#\",\"#\",\"#\",\"#\")\n`;
                    break;
                case "1":
                    code = `GetWireSearchOffset(0,${mode},\"${point1}\",\"${point2}\",\"#\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"#\",\"#\",\"#\",\"#\")\n`;
                    break;
                case "2":
                    code = `GetWireSearchOffset(0,${mode},\"${point1}\",\"${point2}\",\"${point3}\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"${touch3}\",\"#\",\"#\",\"#\")\n`;
                    break;
                case "3":
                    code = `GetWireSearchOffset(0,${mode},\"${point1}\",\"${point2}\",\"${point3}\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"${touch3}\",\"#\",\"#\",\"#\")\n`;
                    break;
                default:
                    break;
            }
            return code;
        };

        /* è®¡ç®åç§»é(åå¤å¾) */
        Blockly.Blocks['wiresearchoffsetin'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[121].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_method)
                    .appendField(new Blockly.FieldDropdown(wireSearchType2MethodDataArr), "COMPUTEMODE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_ref_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT2")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH1")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_res_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point3)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH3")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchoffsetin'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("COMPUTEMODE");
            var point1 = block.getFieldValue("POINT1");
            var point2 = block.getFieldValue("POINT2");
            var point3 = block.getFieldValue("POINT3");
            var touch1 = block.getFieldValue("TOUCH1");
            var touch2 = block.getFieldValue("TOUCH2");
            var touch3 = block.getFieldValue("TOUCH3");
            var code = `GetWireSearchOffset(1,${mode},\"${point1}\",\"${point2}\",\"${point3}\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"${touch3}\",\"#\",\"#\",\"#\")\n`;
            return code;
        };

        /* è®¡ç®åç§»é(ç¹) */
        Blockly.Blocks['wiresearchoffsetpoint'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[122].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_method)
                    .appendField(new Blockly.FieldDropdown([['3D(xyz)','6']]), "COMPUTEMODE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_res_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH2")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchoffsetpoint'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("COMPUTEMODE");
            var touch1 = block.getFieldValue("TOUCH1");
            var touch2 = block.getFieldValue("TOUCH2");
            var code =  `GetWireSearchOffset(2,${mode},\"#\",\"#\",\"#\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"#\",\"#\",\"#\",\"#\")\n`;
            return code;
        };

        /* è®¡ç®åç§»é(ç¸æº) */
        Blockly.Blocks['wiresearchoffsetcamera'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[123].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_method)
                    .appendField(new Blockly.FieldDropdown([['3D+(xyzrxryrz)','7']]), "COMPUTEMODE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_res_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH2")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchoffsetcamera'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("COMPUTEMODE");
            var touch1 = block.getFieldValue("TOUCH1");
            var touch2 = block.getFieldValue("TOUCH2");
            var code = `GetWireSearchOffset(3,${mode},\"#\",\"#\",\"#\",\"#\",\"#\",\"#\",\"${touch1}\",\"${touch2}\",\"#\",\"#\",\"#\",\"#\")\n`;
            return code;
        };
        
        /* è®¡ç®åç§»é(é¢) */
        Blockly.Blocks['wiresearchoffsetsurface'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[124].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_method)
                    .appendField(new Blockly.FieldDropdown([['3D+(xyzrxryrz)','8']]), "COMPUTEMODE")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_ref_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT2")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_ref_point3)
                    .appendField(new Blockly.FieldDropdown(wireSearchRefPointDataArr), "POINT3")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point1)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH1")
                    .appendField(',')
                    .appendField(graphInputTitles.weld._wire_search_res_point2)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point3)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCH3")
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['wiresearchoffsetsurface'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("COMPUTEMODE");
            var point1 = block.getFieldValue("POINT1");
            var point2 = block.getFieldValue("POINT2");
            var point3 = block.getFieldValue("POINT3");
            var touch1 = block.getFieldValue("TOUCH1");
            var touch2 = block.getFieldValue("TOUCH2");
            var touch3 = block.getFieldValue("TOUCH3");
            var code = `GetWireSearchOffset(4,${mode},\"#\",\"#\",\"#\",\"#\",\"#\",\"#\",\"${point1}\",\"${point2}\",\"${point3}\",\"${touch1}\",\"${touch2}\",\"${touch3}\")\n`;
            return code;
        };
        
        /* æ¥è§¦ç¹æ°æ®åå¥ */
        Blockly.Blocks['pointtodatabase'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[125].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point_write_name)
                    .appendField(new Blockly.FieldDropdown(wireSearchResPointDataArr), "TOUCHNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._wire_search_res_point_write_data)
                    .appendField(new Blockly.FieldTextInput("{0,0,0,0,0,0}"), 'TOUCHDATA')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['pointtodatabase'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("TOUCHNAME");
            var data = block.getFieldValue("TOUCHDATA");
            var code = 'SetPointToDatabase(' + name + ',' + data +')\n';
            return code;
        };
        
        /* çµå¼§è·è¸ªå¼å¯ */
        Blockly.Blocks['arcweldtracecontrol'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[109].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._arc_track_lag_time)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'DELAYTIME')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_isleftright)
                    .appendField(new Blockly.FieldDropdown(traceIsleftrightDataArr), "COMPEMSATE1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_klr)
                    .appendField(new Blockly.FieldNumber(0.06, -1, 1, 0.001), 'ADJUSTCOEFFICIENT1')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_tstartlr)
                    .appendField(new Blockly.FieldNumber(5, 0, 300, 0), 'STARTCOMPEMSATE1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_stepmaxlr)
                    .appendField(new Blockly.FieldNumber(5, 0, 300, 0), 'MAXCOMPEMSATE1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_summaxlr)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'TOTALCOMPEMSATE1')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_isuplow)
                    .appendField(new Blockly.FieldDropdown(traceIsleftrightDataArr), "COMPEMSATE2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._bias_mode)
                    .appendField(new Blockly.FieldDropdown(biasModeDataArr), 'BIASMODE')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._sampling_start_period)
                    .appendField(new Blockly.FieldNumber(4, 0, 10000, 0.001), 'SAMPLING')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._percentage)
                    .appendField(new Blockly.FieldNumber(0, -100, 100, 0.001), 'PERCENTAGE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_kud)
                    .appendField(new Blockly.FieldNumber(0.06, -1, 1, 0.001), 'ADJUSTCOEFFICIENT2')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_tstartud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'STARTCOMPEMSATE2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_stepmaxud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'MAXCOMPEMSATE2')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_summaxud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'TOTALCOMPEMSATE2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_axisselect)
                    .appendField(new Blockly.FieldDropdown(weldTraceAxisselectDataArr), "AXISCHOICE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_reference_type)
                    .appendField(new Blockly.FieldDropdown(weldTraceReferenceTypeDataArr), "MODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._up_down_reference_current_start)
                    .appendField(new Blockly.FieldNumber(4, 0, 10000, 0), 'STARTCOUNT')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._up_down_reference_current)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'CURRENTCOUNT')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_reference_current)
                    .appendField(new Blockly.FieldNumber(10, 0, 300, 0), 'CURRENT')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcweldtracecontrol'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var delay_time = block.getFieldValue("DELAYTIME");
            var compensate1 = block.getFieldValue("COMPEMSATE1");
            var adjust1 = block.getFieldValue("ADJUSTCOEFFICIENT1");
            var start_compensate1 = block.getFieldValue("STARTCOMPEMSATE1");
            var max_compensate1 = block.getFieldValue("MAXCOMPEMSATE1");
            var total1 = block.getFieldValue("TOTALCOMPEMSATE1");
            var compensate2 = block.getFieldValue("COMPEMSATE2");
            var bias = block.getFieldValue("BIASMODE");
            var sampling = block.getFieldValue("SAMPLING");
            var percentage = block.getFieldValue("PERCENTAGE");
            var adjust2 = block.getFieldValue("ADJUSTCOEFFICIENT2");
            var start_compensate2 = block.getFieldValue("STARTCOMPEMSATE2");
            var max_compensate2 = block.getFieldValue("MAXCOMPEMSATE2");
            var total2 = block.getFieldValue("TOTALCOMPEMSATE2");
            var choice = block.getFieldValue("AXISCHOICE");
            var mode = block.getFieldValue("MODE");
            var start_count = block.getFieldValue("STARTCOUNT");
            var current_count = block.getFieldValue("CURRENTCOUNT");
            var current = block.getFieldValue("CURRENT");
            let selectBiasVal;
            switch (bias) {
                case '0':
                    selectBiasVal = 0;
                    break;
                case '1':
                    selectBiasVal = sampling;
                    break;
                case '2':
                    selectBiasVal = percentage;
                    break;
                default:
                    break;
            };
            if (mode == 0) {
                var code = `ArcWeldTraceControl(1,${delay_time},${compensate1},${adjust1},${start_compensate1},${max_compensate1},${total1},${compensate2},${adjust2},${start_compensate2},${max_compensate2},${total2},${choice},${mode},${start_count},${current_count},10,${bias},${selectBiasVal})\n`
            } else {
                var code = `ArcWeldTraceControl(1,${delay_time},${compensate1},${adjust1},${start_compensate1},${max_compensate1},${total1},${compensate2},${adjust2},${start_compensate2},${max_compensate},${total2},${choice},${mode},4,1,${current},${bias},${selectBiasVal})\n`
            }
            return code;
        };
        
        /* çµå¼§è·è¸ªå³é­ */
        Blockly.Blocks['arcweldtracecontrolend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[108].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._arc_track_lag_time)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'DELAYTIME')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_isleftright)
                    .appendField(new Blockly.FieldDropdown(traceIsleftrightDataArr), "COMPEMSATE1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_klr)
                    .appendField(new Blockly.FieldNumber(0.06, -1, 1, 0.001), 'ADJUSTCOEFFICIENT1')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_tstartlr)
                    .appendField(new Blockly.FieldNumber(5, 0, 300, 0), 'STARTCOMPEMSATE1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_stepmaxlr)
                    .appendField(new Blockly.FieldNumber(5, 0, 300, 0), 'MAXCOMPEMSATE1')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_summaxlr)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'TOTALCOMPEMSATE1')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_isuplow)
                    .appendField(new Blockly.FieldDropdown(traceIsleftrightDataArr), "COMPEMSATE2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._bias_mode)
                    .appendField(new Blockly.FieldDropdown(biasModeDataArr), 'BIASMODE')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._sampling_start_period)
                    .appendField(new Blockly.FieldNumber(4, 0, 10000, 0.001), 'SAMPLING')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._percentage)
                    .appendField(new Blockly.FieldNumber(0, -100, 100, 0.001), 'PERCENTAGE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_kud)
                    .appendField(new Blockly.FieldNumber(0.06, -1, 1, 0.001), 'ADJUSTCOEFFICIENT2')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_tstartud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'STARTCOMPEMSATE2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_stepmaxud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'MAXCOMPEMSATE2')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_summaxud)
                    .appendField(new Blockly.FieldNumber(300, 0, 300, 0), 'TOTALCOMPEMSATE2')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_axisselect)
                    .appendField(new Blockly.FieldDropdown(weldTraceAxisselectDataArr), "AXISCHOICE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._weld_trace_reference_type)
                    .appendField(new Blockly.FieldDropdown(weldTraceReferenceTypeDataArr), "MODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._up_down_reference_current_start)
                    .appendField(new Blockly.FieldNumber(4, 0, 10000, 0), 'STARTCOUNT')
                this.appendDummyInput()
                    .appendField(graphInputTitles.weld._up_down_reference_current)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'CURRENTCOUNT')
                    .appendField(',')
                    .appendField(graphInputTitles.weld._weld_trace_reference_current)
                    .appendField(new Blockly.FieldNumber(10, 0, 300, 0), 'CURRENT')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#ed5a3e");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['arcweldtracecontrolend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var delay_time = block.getFieldValue("DELAYTIME");
            var compensate1 = block.getFieldValue("COMPEMSATE1");
            var adjust1 = block.getFieldValue("ADJUSTCOEFFICIENT1");
            var start_compensate1 = block.getFieldValue("STARTCOMPEMSATE1");
            var max_compensate1 = block.getFieldValue("MAXCOMPEMSATE1");
            var total1 = block.getFieldValue("TOTALCOMPEMSATE1");
            var compensate2 = block.getFieldValue("COMPEMSATE2");
            var bias = block.getFieldValue("BIASMODE");
            var sampling = block.getFieldValue("SAMPLING");
            var percentage = block.getFieldValue("PERCENTAGE");
            var adjust2 = block.getFieldValue("ADJUSTCOEFFICIENT2");
            var start_compensate2 = block.getFieldValue("STARTCOMPEMSATE2");
            var max_compensate2 = block.getFieldValue("MAXCOMPEMSATE2");
            var total2 = block.getFieldValue("TOTALCOMPEMSATE2");
            var choice = block.getFieldValue("AXISCHOICE");
            var mode = block.getFieldValue("MODE");
            var start_count = block.getFieldValue("STARTCOUNT");
            var current_count = block.getFieldValue("CURRENTCOUNT");
            var current = block.getFieldValue("CURRENT");
            let selectBiasVal;
            switch (bias) {
                case '0':
                    selectBiasVal = 0;
                    break;
                case '1':
                    selectBiasVal = sampling;
                    break;
                case '2':
                    selectBiasVal = percentage;
                    break;
                default:
                    break;
            };
            if (mode == 0) {
                var code = `ArcWeldTraceControl(0,${delay_time},${compensate1},${adjust1},${start_compensate1},${max_compensate1},${total1},${compensate2},${adjust2},${start_compensate2},${max_compensate2},${total2},${choice},${mode},${start_count},${current_count},10,${bias},${selectBiasVal})\n`
            } else {
                var code = `ArcWeldTraceControl(0,${delay_time},${compensate1},${adjust1},${start_compensate1},${max_compensate1},${total1},${compensate2},${adjust2},${start_compensate2},${max_compensate},${total2},${choice},${mode},4,1,${current},${bias},${selectBiasVal})\n`
            }
            return code;
        };
                
        /* å¼å¯ç¢°ææ£æµ */
        Blockly.Blocks['ftguard'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[80].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(toolTrsfCoordeArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField('Fx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FX")
                    .appendField(',')
                    .appendField('Fy')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FY")
                    .appendField(',')
                    .appendField('Fz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FZ")
                this.appendDummyInput()
                    .appendField('Tx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TX")
                    .appendField(',')
                    .appendField('Ty')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TY")
                    .appendField(',')
                    .appendField('Tz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TZ")
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZVALUE')
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXMAXVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYMAXVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZMAXVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXMAXVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYMAXVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZMAXVALUE')
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXMINVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYMINVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZMINVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXMINVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYMINVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZMINVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftguard'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var fx = block.getFieldValue("FX");
            var fy = block.getFieldValue("FY");
            var fz = block.getFieldValue("FZ");
            var tx = block.getFieldValue("TX");
            var ty = block.getFieldValue("TY");
            var tz = block.getFieldValue("TZ");
            var fx_value = block.getFieldValue("FXVALUE");
            var fy_value = block.getFieldValue("FYVALUE");
            var fz_value = block.getFieldValue("FZVALUE");
            var tx_value = block.getFieldValue("TXVALUE");
            var ty_value = block.getFieldValue("TYVALUE");
            var tz_value = block.getFieldValue("TZVALUE");
            var fx_max_value = block.getFieldValue("FXMAXVALUE");
            var fy_max_value = block.getFieldValue("FYMAXVALUE");
            var fz_max_value = block.getFieldValue("FZMAXVALUE");
            var tx_max_value = block.getFieldValue("TXMAXVALUE");
            var ty_max_value = block.getFieldValue("TYMAXVALUE");
            var tz_max_value = block.getFieldValue("TZMAXVALUE");
            var fx_min_value = block.getFieldValue("FXMINVALUE");
            var fy_min_value = block.getFieldValue("FYMINVALUE");
            var fz_min_value = block.getFieldValue("FZMINVALUE");
            var tx_min_value = block.getFieldValue("TXMINVALUE");
            var ty_min_value = block.getFieldValue("TYMINVALUE");
            var tz_min_value = block.getFieldValue("TZMINVALUE");
            var code = 'FT_Guard(1,' + name + ',' + fx + ',' + fy + ',' + fz + ',' + tx + ',' + ty + ',' + tz + ',' + fx_value + ',' + fy_value + ',' + fz_value + ',' + tx_value + ',' + ty_value + ',' + tz_value + ',' + fx_max_value + ',' + fy_max_value + ',' + fz_max_value + ',' + tx_max_value + ',' + ty_max_value + ',' + tz_max_value + ',' + fx_min_value + ',' + fy_min_value + ',' + fz_min_value + ',' + tx_min_value + ',' + ty_min_value + ',' + tz_min_value +')\n';
            return code;
        };
                        
        /* å³é­ç¢°ææ£æµ */
        Blockly.Blocks['ftguardclose'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[81].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(toolTrsfCoordeArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField('Fx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FX")
                    .appendField(',')
                    .appendField('Fy')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FY")
                    .appendField(',')
                    .appendField('Fz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FZ")
                this.appendDummyInput()
                    .appendField('Tx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TX")
                    .appendField(',')
                    .appendField('Ty')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TY")
                    .appendField(',')
                    .appendField('Tz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TZ")
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZVALUE')
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXMAXVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYMAXVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZMAXVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXMAXVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYMAXVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_max_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZMAXVALUE')
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXMINVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYMINVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZMINVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXMINVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYMINVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_min_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZMINVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftguardclose'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var fx = block.getFieldValue("FX");
            var fy = block.getFieldValue("FY");
            var fz = block.getFieldValue("FZ");
            var tx = block.getFieldValue("TX");
            var ty = block.getFieldValue("TY");
            var tz = block.getFieldValue("TZ");
            var fx_value = block.getFieldValue("FXVALUE");
            var fy_value = block.getFieldValue("FYVALUE");
            var fz_value = block.getFieldValue("FZVALUE");
            var tx_value = block.getFieldValue("TXVALUE");
            var ty_value = block.getFieldValue("TYVALUE");
            var tz_value = block.getFieldValue("TZVALUE");
            var fx_max_value = block.getFieldValue("FXMAXVALUE");
            var fy_max_value = block.getFieldValue("FYMAXVALUE");
            var fz_max_value = block.getFieldValue("FZMAXVALUE");
            var tx_max_value = block.getFieldValue("TXMAXVALUE");
            var ty_max_value = block.getFieldValue("TYMAXVALUE");
            var tz_max_value = block.getFieldValue("TZMAXVALUE");
            var fx_min_value = block.getFieldValue("FXMINVALUE");
            var fy_min_value = block.getFieldValue("FYMINVALUE");
            var fz_min_value = block.getFieldValue("FZMINVALUE");
            var tx_min_value = block.getFieldValue("TXMINVALUE");
            var ty_min_value = block.getFieldValue("TYMINVALUE");
            var tz_min_value = block.getFieldValue("TZMINVALUE");
            var code = 'FT_Guard(0,' + name + ',' + fx + ',' + fy + ',' + fz + ',' + tx + ',' + ty + ',' + tz + ',' + fx_value + ',' + fy_value + ',' + fz_value + ',' + tx_value + ',' + ty_value + ',' + tz_value + ',' + fx_max_value + ',' + fy_max_value + ',' + fz_max_value + ',' + tx_max_value + ',' + ty_max_value + ',' + tz_max_value + ',' + fx_min_value + ',' + fy_min_value + ',' + fz_min_value + ',' + tx_min_value + ',' + ty_min_value + ',' + tz_min_value +')\n';
            return code;
        };

        /* å¼å¯æ§å¶ */
        Blockly.Blocks['ftcontrol'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[82].name)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(toolTrsfCoordeArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField('Fx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FX")
                    .appendField(',')
                    .appendField('Fy')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FY")
                    .appendField(',')
                    .appendField('Fz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "FZ")
                this.appendDummyInput()
                    .appendField('Tx')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TX")
                    .appendField(',')
                    .appendField('Ty')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TY")
                    .appendField(',')
                    .appendField('Tz')
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "TZ")
                this.appendDummyInput()
                    .appendField('Fx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXVALUE')
                    .appendField(',')
                    .appendField('Fy' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYVALUE')
                this.appendDummyInput()
                    .appendField('Fz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZVALUE')
                    .appendField(',')
                    .appendField('Tx' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXVALUE')
                this.appendDummyInput()
                    .appendField('Ty' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYVALUE')
                    .appendField(',')
                    .appendField('Tz' + graphInputTitles.motion._ft_current_value)
                    .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZVALUE')
                this.appendDummyInput()
                    .appendField('F_P_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FPVALUE')
                    .appendField(',')
                    .appendField('F_I_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FIVALUE')
                    .appendField(',')
                    .appendField('F_D_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FDVALUE')
                this.appendDummyInput()
                    .appendField('T_P_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TPVALUE')
                    .appendField(',')
                    .appendField('T_I_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TIVALUE')
                    .appendField(',')
                    .appendField('T_D_gain')
                    .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TDVALUE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_control_adj_sign)
                    .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "STATE1")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_control_ilc_sign)
                    .appendField(new Blockly.FieldDropdown(FTControlILCSignDataArr), "STATE2")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_control_length)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'MAXLENGTH')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_control_angle)
                    .appendField(new Blockly.FieldNumber(0, 0, 90, 0), 'MAXANGLE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_control_disc_radius)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'DISCRADIUS')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._filtering_waves)
                    .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "FILTER")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._postural_adaptation)
                    .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "ADJUSTPOSE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._inertia_coefficient + 'RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "INERTIARX")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._inertia_coefficient + 'RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "INERTIARY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._damping_coefficient + 'RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "DAMPINGRX")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._damping_coefficient + 'RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "DAMPINGRY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._open_threshold + 'RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "THRESHOLDRX")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._open_threshold + 'RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "THRESHOLDRY")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._adjust_coefficient + 'RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "ADJUSTRX")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._adjust_coefficient + 'RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "ADJUSTRY")
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(blockDataArr), "ISBLOCK")
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setColour("#30c1d5");
                    this.setTooltip("");
                    this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcontrol'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var fx = block.getFieldValue("FX");
            var fy = block.getFieldValue("FY");
            var fz = block.getFieldValue("FZ");
            var tx = block.getFieldValue("TX");
            var ty = block.getFieldValue("TY");
            var tz = block.getFieldValue("TZ");
            var fx_value = block.getFieldValue("FXVALUE");
            var fy_value = block.getFieldValue("FYVALUE");
            var fz_value = block.getFieldValue("FZVALUE");
            var tx_value = block.getFieldValue("TXVALUE");
            var ty_value = block.getFieldValue("TYVALUE");
            var tz_value = block.getFieldValue("TZVALUE");
            var f_p_gain = block.getFieldValue("FPVALUE");
            var f_I_gain = block.getFieldValue("FIVALUE");
            var f_d_gain = block.getFieldValue("FDVALUE");
            var t_p_gain = block.getFieldValue("TPVALUE");
            var t_I_gain = block.getFieldValue("TIVALUE");
            var t_d_gain = block.getFieldValue("TDVALUE");
            var state1 = block.getFieldValue("STATE1");
            var state2 = block.getFieldValue("STATE2");
            var length = block.getFieldValue("MAXLENGTH");
            var angle = block.getFieldValue("MAXANGLE");
            var radius = block.getFieldValue("DISCRADIUS");
            var filter = block.getFieldValue("FILTER");
            var adjust_pose = block.getFieldValue("ADJUSTPOSE");
            var inertiaRx = block.getFieldValue("INERTIARX");
            var inertiaRy = block.getFieldValue("INERTIARY");
            var dampingRx = block.getFieldValue("DAMPINGRX");
            var dampingRy = block.getFieldValue("DAMPINGRY");
            var thresholdRx = block.getFieldValue("THRESHOLDRX");
            var thresholdRy = block.getFieldValue("THRESHOLDRY");
            var adjustRx = block.getFieldValue("ADJUSTRX");
            var adjustRy = block.getFieldValue("ADJUSTRY");
            let posAdaptStr;
            if (adjust_pose == 0) {
                posAdaptStr = '0,0,0,0,0,0,0,0'
            } else {
                posAdaptStr = `${inertiaRx},${inertiaRy},${dampingRx},${dampingRy},${thresholdRx},${thresholdRy},${adjustRx},${adjustRy}`
            }
            var is_block = block.getFieldValue("ISBLOCK");
            var code = 'FT_Control(1,' + name + ',' + fx + ',' + fy + ',' + fz + ',' + tx + ',' + ty + ',' + tz + ',' + fx_value + ',' + fy_value + ',' + fz_value + ','
                + tx_value + ',' + ty_value + ',' + tz_value + ',' + f_p_gain + ',' + f_I_gain + ',' + f_d_gain + ',' + t_p_gain + ',' + t_I_gain + ',' + t_d_gain + ','
                + state1 + ',' + state2 + ',' + length + ',' + angle + ',' + ((fx == 1 || fy == 1) ? radius : 0) + ',' + filter + ',' + adjust_pose + ',' + posAdaptStr + ','
                + is_block +')\n';
            return code;
        };
                                
        /* å³é­æ§å¶ */
        Blockly.Blocks['ftcontrolclose'] = {
            init: function () {
            this.appendDummyInput()
                .appendField(commandNameData[83].name)
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._coord_name)
                .appendField(new Blockly.FieldDropdown(toolTrsfCoordeArr), "AXISNAME")
            this.appendDummyInput()
                .appendField('Fx')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "FX")
                .appendField(',')
                .appendField('Fy')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "FY")
                .appendField(',')
                .appendField('Fz')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "FZ")
            this.appendDummyInput()
                .appendField('Tx')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "TX")
                .appendField(',')
                .appendField('Ty')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "TY")
                .appendField(',')
                .appendField('Tz')
                .appendField(new Blockly.FieldDropdown(whetherDataArr), "TZ")
            this.appendDummyInput()
                .appendField('Fx' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FXVALUE')
                .appendField(',')
                .appendField('Fy' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FYVALUE')
            this.appendDummyInput()
                .appendField('Fz' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'FZVALUE')
                .appendField(',')
                .appendField('Tx' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TXVALUE')
            this.appendDummyInput()
                .appendField('Ty' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TYVALUE')
                .appendField(',')
                .appendField('Tz' + graphInputTitles.motion._ft_current_value)
                .appendField(new Blockly.FieldNumber(0, -1000, 1000, 0), 'TZVALUE')
            this.appendDummyInput()
                .appendField('F_P_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FPVALUE')
                .appendField(',')
                .appendField('F_I_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FIVALUE')
                .appendField(',')
                .appendField('F_D_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'FDVALUE')
            this.appendDummyInput()
                .appendField('T_P_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TPVALUE')
                .appendField(',')
                .appendField('T_I_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TIVALUE')
                .appendField(',')
                .appendField('T_D_gain')
                .appendField(new Blockly.FieldNumber(0, -1, 1, 0.0001), 'TDVALUE')
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._ft_control_adj_sign)
                .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "STATE1")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._ft_control_ilc_sign)
                .appendField(new Blockly.FieldDropdown(FTControlILCSignDataArr), "STATE2")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._ft_control_length)
                .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'MAXLENGTH')
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._ft_control_angle)
                .appendField(new Blockly.FieldNumber(0, 0, 90, 0), 'MAXANGLE')
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._ft_control_disc_radius)
                .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'DISCRADIUS')
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._filtering_waves)
                .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "FILTER")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._postural_adaptation)
                .appendField(new Blockly.FieldDropdown(FTControlAdjSignDataArr), "ADJUSTPOSE")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._inertia_coefficient + 'RX')
                .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "INERTIARX")
                .appendField(',')
                .appendField(graphInputTitles.motion._inertia_coefficient + 'RY')
                .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "INERTIARY")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._damping_coefficient + 'RX')
                .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "DAMPINGRX")
                .appendField(',')
                .appendField(graphInputTitles.motion._damping_coefficient + 'RY')
                .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "DAMPINGRY")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._open_threshold + 'RX')
                .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "THRESHOLDRX")
                .appendField(',')
                .appendField(graphInputTitles.motion._open_threshold + 'RY')
                .appendField(new Blockly.FieldNumber(0, 0, 10, 0.01), "THRESHOLDRY")
            this.appendDummyInput()
                .appendField(graphInputTitles.motion._adjust_coefficient + 'RX')
                .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "ADJUSTRX")
                .appendField(',')
                .appendField(graphInputTitles.motion._adjust_coefficient + 'RY')
                .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "ADJUSTRY")
            this.appendDummyInput()
                .appendField(descriptionData[11].name)
                .appendField(new Blockly.FieldDropdown(blockDataArr), "ISBLOCK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcontrolclose'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var fx = block.getFieldValue("FX");
            var fy = block.getFieldValue("FY");
            var fz = block.getFieldValue("FZ");
            var tx = block.getFieldValue("TX");
            var ty = block.getFieldValue("TY");
            var tz = block.getFieldValue("TZ");
            var fx_value = block.getFieldValue("FXVALUE");
            var fy_value = block.getFieldValue("FYVALUE");
            var fz_value = block.getFieldValue("FZVALUE");
            var tx_value = block.getFieldValue("TXVALUE");
            var ty_value = block.getFieldValue("TYVALUE");
            var tz_value = block.getFieldValue("TZVALUE");
            var f_p_gain = block.getFieldValue("FPVALUE");
            var f_I_gain = block.getFieldValue("FIVALUE");
            var f_d_gain = block.getFieldValue("FDVALUE");
            var t_p_gain = block.getFieldValue("TPVALUE");
            var t_I_gain = block.getFieldValue("TIVALUE");
            var t_d_gain = block.getFieldValue("TDVALUE");
            var state1 = block.getFieldValue("STATE1");
            var state2 = block.getFieldValue("STATE2");
            var length = block.getFieldValue("MAXLENGTH");
            var angle = block.getFieldValue("MAXANGLE");
            var filter = block.getFieldValue("FILTER");
            var radius = block.getFieldValue("DISCRADIUS");
            var adjust_pose = block.getFieldValue("ADJUSTPOSE");
            var inertiaRx = block.getFieldValue("INERTIARX");
            var inertiaRy = block.getFieldValue("INERTIARY");
            var dampingRx = block.getFieldValue("DAMPINGRX");
            var dampingRy = block.getFieldValue("DAMPINGRY");
            var thresholdRx = block.getFieldValue("THRESHOLDRX");
            var thresholdRy = block.getFieldValue("THRESHOLDRY");
            var adjustRx = block.getFieldValue("ADJUSTRX");
            var adjustRy = block.getFieldValue("ADJUSTRY");
            let posAdaptStr;
            if (adjust_pose == 0) {
                posAdaptStr = '0,0,0,0,0,0,0,0'
            } else {
                posAdaptStr = `${inertiaRx},${inertiaRy},${dampingRx},${dampingRy},${thresholdRx},${thresholdRy},${adjustRx},${adjustRy}`
            }
            var is_block = block.getFieldValue("ISBLOCK");
            var code = 'FT_Control(0,' + name + ',' + fx + ',' + fy + ',' + fz + ',' + tx + ',' + ty + ',' + tz + ',' + fx_value + ',' + fy_value + ',' + fz_value + ','
                + tx_value + ',' + ty_value + ',' + tz_value + ',' + f_p_gain + ',' + f_I_gain + ',' + f_d_gain + ',' + t_p_gain + ',' + t_I_gain + ',' + t_d_gain + ','
                + state1 + ',' + state2 + ',' + length + ',' + angle + ',' + ((fx == 1 || fy == 1) ? radius : 0) + ',' + filter + ',' + adjust_pose + ',' + posAdaptStr + ','
                + is_block +')\n';
            return code;
        };

        /* æé¡ºæ§å¶å¼å¯ */
        Blockly.Blocks['ftcompliancestart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ftcom_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_compliance_adjust)
                    .appendField(new Blockly.FieldNumber(0, 0, 1, 0.001), 'ADJUSTVALUE')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_compliance_threshold)
                    .appendField(new Blockly.FieldNumber(0, -100, 100, 0.01), 'CONTROLVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcompliancestart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var value1 = block.getFieldValue("ADJUSTVALUE");
            var value2 = block.getFieldValue("CONTROLVALUE");
            var code = 'FT_ComplianceStart(' + value1 + ',' + value2 + ')\n'; 
            return code;
        };

        /* æé¡ºæ§å¶å³é­ */
        Blockly.Blocks['ftcompliancestop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ftcom_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcompliancestop'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'FT_ComplianceStop()\n'; 
            return code;
        };

        /* èºææå¥ */
        Blockly.Blocks['ftspiralsearch'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_spiral_search_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(FTReferenceCoordDataArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_spiral_increase_turn)
                    .appendField(new Blockly.FieldNumber(0.7, 0, 100, 0.001), 'RADIUSVALUE')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_spiral_force_insertion)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'VALUE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_spiral_time_max)
                    .appendField(new Blockly.FieldNumber(0, 0, 6000, 0), 'TIME')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_spiral_vel_speed)
                    .appendField(new Blockly.FieldNumber(5, 0, 100, 0), 'MAXSPEED')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftspiralsearch'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var radius = block.getFieldValue("RADIUSVALUE");
            var value = block.getFieldValue("VALUE");
            var time = block.getFieldValue("TIME");
            var speed = block.getFieldValue("MAXSPEED");
            var code = 'FT_SpiralSearch(' + name + ',' + radius + ',' + value + ',' + time + ',' + speed + ')\n'; 
            return code;
        };

        /* æè½¬æå¥ */
        Blockly.Blocks['ftrotinsertion'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_rot_insertion_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(FTReferenceCoordDataArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_rot_ang_vel_rot)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0.001), 'ROTATEANGLESPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_rot_force_insertion)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'STOPFORCETORQUE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_rot_angle_max)
                    .appendField(new Blockly.FieldNumber(5, 0, 100, 0), 'MAXROTATEANGLE')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_rot_orn)
                    .appendField(new Blockly.FieldDropdown(FTRotOrnDataArr), "FORCEDIRECTION")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_rot_angle_acc_max)
                    .appendField(new Blockly.FieldNumber(5, 0, 100, 0), 'MAXROTATEACC')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_insert_orn)
                    .appendField(new Blockly.FieldDropdown(FTRotRotOrnDataArr), "INSERTDIRECTION")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_check_force_strategy)
                    .appendField(new Blockly.FieldDropdown(checkStrategyDataArr), "CHECKSTRAGETY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftrotinsertion'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var speed = block.getFieldValue("ROTATEANGLESPEED");
            var torque = block.getFieldValue("STOPFORCETORQUE");
            var angle = block.getFieldValue("MAXROTATEANGLE");
            var force_direction = block.getFieldValue("FORCEDIRECTION");
            var acc = block.getFieldValue("MAXROTATEACC");
            var insert_direction = block.getFieldValue("INSERTDIRECTION");
            var check_strategy = block.getFieldValue("CHECKSTRAGETY");
            var code = 'FT_RotInsertion(' + name + ',' + speed + ',' + torque + ',' + angle + ',' + force_direction + ',' + acc + ',' + insert_direction + ',' + check_strategy + ')\n'; 
            return code;
        };

        /* ç´çº¿æå¥ */
        Blockly.Blocks['ftlininsertion'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_lin_insertion_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(FTReferenceCoordDataArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_lin_force_goal)
                    .appendField(new Blockly.FieldNumber(50, 0, 100, 0), 'STOPFORCETORQUE')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_lin_vel)
                    .appendField(new Blockly.FieldNumber(1, 0, 100, 0), 'LINSPEED')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_lin_acc)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'LINACC')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_lin_distance_max)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'MAXINSERTLENGTH')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_insert_orn)
                    .appendField(new Blockly.FieldDropdown(FTRotRotOrnDataArr), "INSERTDIRECTION")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftlininsertion'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var torque = block.getFieldValue("STOPFORCETORQUE");
            var speed = block.getFieldValue("LINSPEED");
            var acc = block.getFieldValue("LINACC");
            var length = block.getFieldValue("MAXINSERTLENGTH");
            var insert_direction = block.getFieldValue("INSERTDIRECTION");
            var code = 'FT_LinInsertion(' + name + ',' + torque + ',' + speed + ',' + acc + ',' + length + ',' + insert_direction + ')\n'; 
            return code;
        };

        /* è¡¨é¢å®ä½ */
        Blockly.Blocks['ftfindsurface'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_find_surface)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._coord_name)
                    .appendField(new Blockly.FieldDropdown(FTReferenceCoordDataArr), "AXISNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_find_surface_diretcion)
                    .appendField(new Blockly.FieldDropdown(FTRotRotOrnDataArr), "MOVEDIRECTION")
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_find_surface_axis)
                    .appendField(new Blockly.FieldDropdown(wobjAxisDataArr), "MOVEAXIS")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_find_surface_vel)
                    .appendField(new Blockly.FieldNumber(1, 0, 100, 0), 'LINSPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_find_surface_acc)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'LINACC')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_find_surface_distance_max)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'MAXINSERTLENGTH')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._ft_find_surface_force_goal)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'STOPFORCEVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftfindsurface'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var name = block.getFieldValue("AXISNAME");
            var move_direction = block.getFieldValue("MOVEDIRECTION");
            var axis = block.getFieldValue("MOVEAXIS");
            var speed = block.getFieldValue("LINSPEED");
            var acc = block.getFieldValue("LINACC");
            var length = block.getFieldValue("MAXINSERTLENGTH");
            var value = block.getFieldValue("STOPFORCEVALUE");
            var code = 'FT_FindSurface(' + name + ',' + move_direction + ',' + axis + ',' + speed + ',' + acc + ',' + length + ',' + value + ')\n'; 
            return code;
        };

        /* è®¡ç®å¼å§ */
        Blockly.Blocks['ftcalcenterstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ftcal_start)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcalcenterstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'FT_CalCenterStart()\n'; 
            return code;
        };

        /* è®¡ç®ç»æ */
        Blockly.Blocks['ftcalcenterend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ftcal_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftcalcenterend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'FT_CalCenterEnd()\n'; 
            return code;
        };

        /* å³èç©ºé´é»ææ§å¶å¼å¯ */
        Blockly.Blocks['ftimpedancejointstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_imdepance_on + '(' + spaceSelectionData[0].name + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._force_threshold)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(30, 10, 50, 0), 'FORCE1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(30, 10, 50, 0), 'FORCE2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(30, 10, 50, 0), 'FORCE3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(7, 1, 10, 0), 'FORCE4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(7, 1, 10, 0), 'FORCE5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(7, 1, 10, 0), 'FORCE6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._quality_factor)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._damping_coefficient)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._stiffness_coefficient)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._maximum_speed + '(Â°/s)')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'SPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._maximum_acceleration + '(Â°/sÂ²)')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'ACC')
                    .appendField(',')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftimpedancejointstart'] = function (block) {
            var force1 = block.getFieldValue("FORCE1");
            var force2 = block.getFieldValue("FORCE2");
            var force3 = block.getFieldValue("FORCE3");
            var force4 = block.getFieldValue("FORCE4");
            var force5 = block.getFieldValue("FORCE5");
            var force6 = block.getFieldValue("FORCE6");
            var quality1 = block.getFieldValue("QUALITY1");
            var quality2 = block.getFieldValue("QUALITY2");
            var quality3 = block.getFieldValue("QUALITY3");
            var quality4 = block.getFieldValue("QUALITY4");
            var quality5 = block.getFieldValue("QUALITY5");
            var quality6 = block.getFieldValue("QUALITY6");
            var damping1 = block.getFieldValue("DAMPING1");
            var damping2 = block.getFieldValue("DAMPING2");
            var damping3 = block.getFieldValue("DAMPING3");
            var damping4 = block.getFieldValue("DAMPING4");
            var damping5 = block.getFieldValue("DAMPING5");
            var damping6 = block.getFieldValue("DAMPING6");
            var stiffness1 = block.getFieldValue("STIFFNESS1");
            var stiffness2 = block.getFieldValue("STIFFNESS2");
            var stiffness3 = block.getFieldValue("STIFFNESS3");
            var stiffness4 = block.getFieldValue("STIFFNESS4");
            var stiffness5 = block.getFieldValue("STIFFNESS5");
            var stiffness6 = block.getFieldValue("STIFFNESS6");
            var speed = block.getFieldValue("SPEED");
            var acc = block.getFieldValue("ACC");
            var code = "";
            code += `ImpedanceControlStartStop(1,0,{${force1},${force2},${force3},${force4},${force5},${force6}},{${quality1},${quality2},${quality3},`
            code += `${quality4},${quality5},${quality6}},{${damping1},${damping2},${damping3},${damping4},${damping5},${damping6}},{${stiffness1},`
            code += `${stiffness2},${stiffness3},${stiffness4},${stiffness5},${stiffness6}},${speed},${acc},0,0)\n`;
            return code;
        };

        /* å³èç©ºé´é»ææ§å¶å³é­ */
        Blockly.Blocks['ftimpedancejointstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_imdepance_off + '(' + spaceSelectionData[0].name + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._force_threshold)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._quality_factor)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._damping_coefficient)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._stiffness_coefficient)
                this.appendDummyInput()
                    .appendField('J1')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS1')
                    .appendField(',')
                    .appendField('J2')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS2')
                    .appendField(',')
                    .appendField('J3')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS3')
                    .appendField(',')
                    .appendField('J4')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS4')
                    .appendField(',')
                    .appendField('J5')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS5')
                    .appendField(',')
                    .appendField('J6')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._maximum_speed + '(Â°/s)')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'SPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._maximum_acceleration + '(Â°/sÂ²)')
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), 'ACC')
                    .appendField(',')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftimpedancejointstop'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var force1 = block.getFieldValue("FORCE1");
            var force2 = block.getFieldValue("FORCE2");
            var force3 = block.getFieldValue("FORCE3");
            var force4 = block.getFieldValue("FORCE4");
            var force5 = block.getFieldValue("FORCE5");
            var force6 = block.getFieldValue("FORCE6");
            var quality1 = block.getFieldValue("QUALITY1");
            var quality2 = block.getFieldValue("QUALITY2");
            var quality3 = block.getFieldValue("QUALITY3");
            var quality4 = block.getFieldValue("QUALITY4");
            var quality5 = block.getFieldValue("QUALITY5");
            var quality6 = block.getFieldValue("QUALITY6");
            var damping1 = block.getFieldValue("DAMPING1");
            var damping2 = block.getFieldValue("DAMPING2");
            var damping3 = block.getFieldValue("DAMPING3");
            var damping4 = block.getFieldValue("DAMPING4");
            var damping5 = block.getFieldValue("DAMPING5");
            var damping6 = block.getFieldValue("DAMPING6");
            var stiffness1 = block.getFieldValue("STIFFNESS1");
            var stiffness2 = block.getFieldValue("STIFFNESS2");
            var stiffness3 = block.getFieldValue("STIFFNESS3");
            var stiffness4 = block.getFieldValue("STIFFNESS4");
            var stiffness5 = block.getFieldValue("STIFFNESS5");
            var stiffness6 = block.getFieldValue("STIFFNESS6");
            var speed = block.getFieldValue("SPEED");
            var acc = block.getFieldValue("ACC");
            var code = "";
            code += `ImpedanceControlStartStop(0,0,{${force1},${force2},${force3},${force4},${force5},${force6}},{${quality1},${quality2},${quality3},`
            code += `${quality4},${quality5},${quality6}},{${damping1},${damping2},${damping3},${damping4},${damping5},${damping6}},{${stiffness1},`
            code += `${stiffness2},${stiffness3},${stiffness4},${stiffness5},${stiffness6}},${speed},${acc},0,0)\n`;
            return code;
        };

        /* ç¬å¡å°ç©ºé´é»ææ§å¶å¼å¯ */
        Blockly.Blocks['ftimpedancetcpstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_imdepance_on + '(' + spaceSelectionData[1].name + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._force_threshold)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._quality_factor)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._damping_coefficient)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._stiffness_coefficient)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._max_linear_velocity + '(mm/s)')
                    .appendField(new Blockly.FieldNumber(250, 0, 1000, 0), 'LINEARSPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._max_linear_acc + '(mm/sÂ²)')
                    .appendField(new Blockly.FieldNumber(500, 0, 10000, 0), 'LINEARACC')
                    .appendField(',')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._angle_speed + '(Â°/s)')
                    .appendField(new Blockly.FieldNumber(90, 0, 1000, 0), 'ANGLESPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._max_angular_acc + '(Â°/sÂ²)')
                    .appendField(new Blockly.FieldNumber(180, 0, 10000, 0), 'ANGLEACC')
                    .appendField(',')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftimpedancetcpstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var force1 = block.getFieldValue("FORCE1");
            var force2 = block.getFieldValue("FORCE2");
            var force3 = block.getFieldValue("FORCE3");
            var force4 = block.getFieldValue("FORCE4");
            var force5 = block.getFieldValue("FORCE5");
            var force6 = block.getFieldValue("FORCE6");
            var quality1 = block.getFieldValue("QUALITY1");
            var quality2 = block.getFieldValue("QUALITY2");
            var quality3 = block.getFieldValue("QUALITY3");
            var quality4 = block.getFieldValue("QUALITY4");
            var quality5 = block.getFieldValue("QUALITY5");
            var quality6 = block.getFieldValue("QUALITY6");
            var damping1 = block.getFieldValue("DAMPING1");
            var damping2 = block.getFieldValue("DAMPING2");
            var damping3 = block.getFieldValue("DAMPING3");
            var damping4 = block.getFieldValue("DAMPING4");
            var damping5 = block.getFieldValue("DAMPING5");
            var damping6 = block.getFieldValue("DAMPING6");
            var stiffness1 = block.getFieldValue("STIFFNESS1");
            var stiffness2 = block.getFieldValue("STIFFNESS2");
            var stiffness3 = block.getFieldValue("STIFFNESS3");
            var stiffness4 = block.getFieldValue("STIFFNESS4");
            var stiffness5 = block.getFieldValue("STIFFNESS5");
            var stiffness6 = block.getFieldValue("STIFFNESS6");
            var linearSpeed = block.getFieldValue("LINEARSPEED");
            var linearAcc = block.getFieldValue("LINEARACC");
            var angleSpeed = block.getFieldValue("ANGLESPEED");
            var angleAcc = block.getFieldValue("ANGLEACC");
            var code = "";
            code += `ImpedanceControlStartStop(1,1,{${force1},${force2},${force3},${force4},${force5},${force6}},{${quality1},${quality2},${quality3},`
            code += `${quality4},${quality5},${quality6}},{${damping1},${damping2},${damping3},${damping4},${damping5},${damping6}},{${stiffness1},`
            code += `${stiffness2},${stiffness3},${stiffness4},${stiffness5},${stiffness6}},${linearSpeed},${linearAcc},${angleSpeed},${angleAcc})\n`;
            return code;
        };

        /* ç¬å¡å°ç©ºé´é»ææ§å¶å³é­ */
        Blockly.Blocks['ftimpedancetcpstop'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._ft_imdepance_off + '(' + spaceSelectionData[1].name + ')')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._force_threshold)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(30, 30, 150, 0), 'FORCE3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(7, 7, 30, 0), 'FORCE6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._quality_factor)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0.04, 0, 1, 0), 'QUALITY3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0.01, 0, 1, 0), 'QUALITY6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._damping_coefficient)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0.1, 0, 2, 0), 'DAMPING3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0.08, 0, 1.5, 0), 'DAMPING6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._stiffness_coefficient)
                this.appendDummyInput()
                    .appendField('X')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS1')
                    .appendField(',')
                    .appendField('Y')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS2')
                    .appendField(',')
                    .appendField('Z')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS3')
                    .appendField(',')
                    .appendField('RX')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS4')
                    .appendField(',')
                    .appendField('RY')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS5')
                    .appendField(',')
                    .appendField('RZ')
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'STIFFNESS6')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._max_linear_velocity + '(mm/s)')
                    .appendField(new Blockly.FieldNumber(250, 0, 1000, 0), 'LINEARSPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._max_linear_acc + '(mm/sÂ²)')
                    .appendField(new Blockly.FieldNumber(500, 0, 10000, 0), 'LINEARACC')
                    .appendField(',')
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._angle_speed + '(Â°/s)')
                    .appendField(new Blockly.FieldNumber(90, 0, 1000, 0), 'ANGLESPEED')
                    .appendField(',')
                    .appendField(graphInputTitles.motion._max_angular_acc + '(Â°/sÂ²)')
                    .appendField(new Blockly.FieldNumber(180, 0, 10000, 0), 'ANGLEACC')
                    .appendField(',')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['ftimpedancetcpstop'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var force1 = block.getFieldValue("FORCE1");
            var force2 = block.getFieldValue("FORCE2");
            var force3 = block.getFieldValue("FORCE3");
            var force4 = block.getFieldValue("FORCE4");
            var force5 = block.getFieldValue("FORCE5");
            var force6 = block.getFieldValue("FORCE6");
            var quality1 = block.getFieldValue("QUALITY1");
            var quality2 = block.getFieldValue("QUALITY2");
            var quality3 = block.getFieldValue("QUALITY3");
            var quality4 = block.getFieldValue("QUALITY4");
            var quality5 = block.getFieldValue("QUALITY5");
            var quality6 = block.getFieldValue("QUALITY6");
            var damping1 = block.getFieldValue("DAMPING1");
            var damping2 = block.getFieldValue("DAMPING2");
            var damping3 = block.getFieldValue("DAMPING3");
            var damping4 = block.getFieldValue("DAMPING4");
            var damping5 = block.getFieldValue("DAMPING5");
            var damping6 = block.getFieldValue("DAMPING6");
            var stiffness1 = block.getFieldValue("STIFFNESS1");
            var stiffness2 = block.getFieldValue("STIFFNESS2");
            var stiffness3 = block.getFieldValue("STIFFNESS3");
            var stiffness4 = block.getFieldValue("STIFFNESS4");
            var stiffness5 = block.getFieldValue("STIFFNESS5");
            var stiffness6 = block.getFieldValue("STIFFNESS6");
            var linearSpeed = block.getFieldValue("LINEARSPEED");
            var linearAcc = block.getFieldValue("LINEARACC");
            var angleSpeed = block.getFieldValue("ANGLESPEED");
            var angleAcc = block.getFieldValue("ANGLEACC");
            var code = "";
            code += `ImpedanceControlStartStop(0,1,{${force1},${force2},${force3},${force4},${force5},${force6}},{${quality1},${quality2},${quality3},`
            code += `${quality4},${quality5},${quality6}},{${damping1},${damping2},${damping3},${damping4},${damping5},${damping6}},{${stiffness1},`
            code += `${stiffness2},${stiffness3},${stiffness4},${stiffness5},${stiffness6}},${linearSpeed},${linearAcc},${angleSpeed},${angleAcc})\n`;
            return code;
        };

        /* æ­ç©è®°å½å¯å¨ */
        Blockly.Blocks['torquerecordstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_record_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_smooth)
                    .appendField(new Blockly.FieldDropdown(torqueSmoothTypeDataArr), "SMOOTHCHOICE")
                this.appendDummyInput()
                    .appendField('J1' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J1MINUSVALUE')
                    .appendField(',')
                    .appendField('J2' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J2MINUSVALUE')
                this.appendDummyInput()
                    .appendField('J3' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J3MINUSVALUE')
                    .appendField(',')
                    .appendField('J4' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J4MINUSVALUE')
                this.appendDummyInput()
                    .appendField('J5' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J5MINUSVALUE')
                    .appendField(',')
                    .appendField('J6' + graphInputTitles.motion._torque_negative_value)
                    .appendField(new Blockly.FieldNumber(0, -100, 0, 0), 'J6MINUSVALUE')
                this.appendDummyInput()
                    .appendField('J1' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J1POSITIVEVALUE')
                    .appendField(',')
                    .appendField('J2' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J2POSITIVEVALUE')
                this.appendDummyInput()
                    .appendField('J3' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J3POSITIVEVALUE')
                    .appendField(',')
                    .appendField('J4' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J4POSITIVEVALUE')
                this.appendDummyInput()
                    .appendField('J5' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J5POSITIVEVALUE')
                    .appendField(',')
                    .appendField('J6' + graphInputTitles.motion._torque_positive_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 100, 0), 'J6POSITIVEVALUE')
                this.appendDummyInput()
                    .appendField('J1' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J1COLLISIONCHECKTIME')
                    .appendField(',')
                    .appendField('J2' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J2COLLISIONCHECKTIME')
                this.appendDummyInput()
                    .appendField('J3' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J3COLLISIONCHECKTIME')
                    .appendField(',')
                    .appendField('J4' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J4COLLISIONCHECKTIME')
                this.appendDummyInput()
                    .appendField('J5' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J5COLLISIONCHECKTIME')
                    .appendField(',')
                    .appendField('J6' + graphInputTitles.motion._collision_detection_duration)
                    .appendField(new Blockly.FieldNumber(0, 0, 1000, 0), 'J6COLLISIONCHECKTIME')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['torquerecordstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var choice = block.getFieldValue("SMOOTHCHOICE");
            var j1_minus = block.getFieldValue("J1MINUSVALUE");
            var j2_minus = block.getFieldValue("J2MINUSVALUE");
            var j3_minus = block.getFieldValue("J3MINUSVALUE");
            var j4_minus = block.getFieldValue("J4MINUSVALUE");
            var j5_minus = block.getFieldValue("J5MINUSVALUE");
            var j6_minus = block.getFieldValue("J6MINUSVALUE");
            var j1_positive = block.getFieldValue("J1POSITIVEVALUE");
            var j2_positive = block.getFieldValue("J2POSITIVEVALUE");
            var j3_positive = block.getFieldValue("J3POSITIVEVALUE");
            var j4_positive = block.getFieldValue("J4POSITIVEVALUE");
            var j5_positive = block.getFieldValue("J5POSITIVEVALUE");
            var j6_positive = block.getFieldValue("J6POSITIVEVALUE");
            var j1_time = block.getFieldValue("J1COLLISIONCHECKTIME");
            var j2_time = block.getFieldValue("J2COLLISIONCHECKTIME");
            var j3_time = block.getFieldValue("J3COLLISIONCHECKTIME");
            var j4_time = block.getFieldValue("J4COLLISIONCHECKTIME");
            var j5_time = block.getFieldValue("J5COLLISIONCHECKTIME");
            var j6_time = block.getFieldValue("J6COLLISIONCHECKTIME");
            var code = `negativeValues = {${j1_minus},${j2_minus},${j3_minus},${j4_minus},${j5_minus},${j6_minus}}\n`
                     + `positiveValues = {${j1_positive},${j2_positive},${j3_positive},${j4_positive},${j5_positive},${j6_positive}}\n`
                     + `collisionTime = {${j1_time},${j2_time},${j3_time},${j4_time},${j5_time},${j6_time}}\n`
                     + `TorqueRecordStart(${choice},negativeValues,positiveValues,collisionTime)\n`;
            return code;
        };

        /* æ­ç©è®°å½åæ­¢ */
        Blockly.Blocks['torquerecordend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_record_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['torquerecordend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'TorqueRecordEnd()\n'; 
            return code;
        };

        /* æ­ç©è®°å½å¤ä½ */
        Blockly.Blocks['torquerecordreset'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._torque_record_reset)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#30c1d5");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['torquerecordreset'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'TorqueRecordReset()\n'; 
            return code;
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) è¯»çº¿å*/
        Blockly.Blocks['modbusmasterreaddo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._read_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterDODataArr), "DONAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 100, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterreaddo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusMasterReadDO(' + master_name + ',' + do_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) åçº¿å*/
        Blockly.Blocks['modbusmasterwritedo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._write_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterDODataArr), "DONAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterwritedo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusMasterWriteDO(' + master_name + ',' + do_name + ',' + number + ',{' + value +'})\n'; 
            return code;
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) è¯»ç¦»æ£é*/
        Blockly.Blocks['modbusmasterreaddi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._read_inbits)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterDIDataArr), "DINAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterreaddi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var di_name = block.getFieldValue("DINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusMasterReadDI(' + master_name + ',' + di_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) è¯»æ¨¡æè¾åº*/
        Blockly.Blocks['modbusmasterreadao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._modbus_read_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAODataArr), "AONAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterreadao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusMasterReadAO(' + master_name + ',' + ao_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) åæ¨¡æè¾åº*/
        Blockly.Blocks['modbusmasterwriteao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._modbus_write_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAODataArr), "AONAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterwriteao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusMasterWriteAO(' + master_name + ',' + ao_name + ',' + number + ',{' + value + '})\n'; 
            return code;
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) è¯»æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusmasterreadai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._modbus_read_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAIDataArr), "AINAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterreadai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var ai_name = block.getFieldValue("AINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusMasterReadAI(' + master_name + ',' + ai_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) ç­å¾æ°å­è¾å¥*/
        Blockly.Blocks['modbusmasterwaitdi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._modbus_wait_di)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterDIDataArr), "DINAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WAITSTATE")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'OVERTIME')
                    this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterwaitdi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var di_name = block.getFieldValue("DINAME");
            var wait_time = block.getFieldValue("WAITSTATE");
            var overtime = block.getFieldValue("OVERTIME");
            var code = 'ModbusMasterWaitDI(' + master_name + ',' + di_name + ',' + wait_time + ',' + overtime + ')\n'; 
            return code;
        };

        /* Modbusä¸»ç«è®¾ç½®(å®¢æ·ç«¯) ç­å¾æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusmasterwaitai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master + graphInputTitles.modbus._modbus_wait_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_master_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAddressDataArr), "MASTERNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(modbusMasterAIDataArr), "AINAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(modbusWaitAIDataArr), "WAITSTATE")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'OVERTIME')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusmasterwaitai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var master_name = block.getFieldValue("MASTERNAME");
            var ai_name = block.getFieldValue("AINAME");
            var wait_time = block.getFieldValue("WAITSTATE");
            var value = block.getFieldValue("REGISTERVALUE");
            var overtime = block.getFieldValue("OVERTIME");
            var code = 'ModbusMasterWaitAI(' + master_name + ',' + ai_name + ',' + wait_time + ',' + value + ',' + overtime + ')\n'; 
            return code;
        };

        /* modbusä»ç«è®¾ç½®è¯»çº¿å*/
        Blockly.Blocks['modbusslavereaddo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._read_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(slaveDODataArr), "DONAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavereaddo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadDO(' + do_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* modbusä»ç«è®¾ç½®åçº¿å*/
        Blockly.Blocks['modbusslavewritedo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._write_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(slaveDODataArr), "DONAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavewritedo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWriteDO(' + do_name + ',' + number + ',{' + value + '})\n'; 
            return code;
        };

        /* modbusä»ç«è®¾ç½®è¯»ç¦»æ£é*/
        Blockly.Blocks['modbusslavereaddi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._read_inbits)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(slaveDIDataArr), "DINAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavereaddi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var di_name = block.getFieldValue("DINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadDI(' + di_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* modbusä»ç«è®¾ç½®è¯»æ¨¡æè¾åº*/
        Blockly.Blocks['modbusslavereadao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._modbus_read_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(slaveAODataArr), "AONAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavereadao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadAO(' + ao_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };
        
        /* modbusä»ç«è®¾ç½®åæ¨¡æè¾åº*/
        Blockly.Blocks['modbusslavewriteao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._modbus_write_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(slaveAODataArr), "AONAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavewriteao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWriteAO(' + ao_name + ',' + number + ',{' + value + '})\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®è¯»æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusslavereadai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._modbus_read_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(slaveAIDataArr), "AINAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavereadai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ai_name = block.getFieldValue("AINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadAI(' + ai_name + ',' + number + ')\n'; 
            return [code, Blockly.Lua.ORDER_NONE];
        };
        
        /* modbusä»ç«è®¾ç½®ç­å¾æ°å­è¾å¥*/
        Blockly.Blocks['modbusslavewaitdi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._modbus_wait_di)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(slaveDIDataArr), "DINAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WAITSTATE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'OVERTIME')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavewaitdi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var di_name = block.getFieldValue("DINAME");
            var number = block.getFieldValue("WAITSTATE");
            var overtime = block.getFieldValue("OVERTIME");
            var code = 'ModbusSlaveWaitDI(' + di_name + ',' + number + ',' + overtime + ')\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®ç­å¾æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusslavewaitai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_slave + graphInputTitles.modbus._modbus_wait_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(slaveAIDataArr), "AINAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(modbusWaitAIDataArr), "WAITSTATE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusslavewaitai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ai_name = block.getFieldValue("AINAME");
            var state = block.getFieldValue("WAITSTATE");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWaitAI(' + ai_name + ',' + state + ',' + number + ',' + value + ')\n'; 
            return code;
        };
        
        /* è¯»å¯å­å¨æä»¤*/
        Blockly.Blocks['modbusregread'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_read_register_command)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_function_code)
                    .appendField(new Blockly.FieldDropdown(modbusRegReadFunctionCodeDataArr), "FUNCTIONNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_rtu_get_adress)
                    .appendField(new Blockly.FieldTextInput("192.168.61.80"), 'SLAVEADDRESS')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_rtu_get_num)
                    .appendField(new Blockly.FieldNumber(1, 1, 192, 0), 'SLAVENUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_adress)
                    .appendField(new Blockly.FieldNumber(1, 1, 12, 0), 'ADDRESS')
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WHETHERAPPLY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusregread'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func_time = block.getFieldValue("FUNCTIONNAME");
            var salve_address = block.getFieldValue("SLAVEADDRESS");
            var salve_number = block.getFieldValue("SLAVENUMBER");
            var address = block.getFieldValue("ADDRESS");
            var whether = block.getFieldValue("WHETHERAPPLY");
            var code = 'ModbusRegRead(' + func_time + ',"' + salve_address + '",' + salve_number + ',"' + address + '",' + whether + ')\n'; 
            return code;
        };
        
        /* è¯»å¯å­å¨æ°æ®*/
        Blockly.Blocks['modbusreggetdata'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_read_register_data)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_rtu_get_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 255, 0), 'SLAVENUMBER')
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WHETHERAPPLY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusreggetdata'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var salve_number = block.getFieldValue("SLAVENUMBER");
            var whether = block.getFieldValue("WHETHERAPPLY");
            var code = 'ModbusRegGetData(' + salve_number + ',' + whether + ')\n'; 
            return code;
        };
        
        /* åå¯å­å¨*/
        Blockly.Blocks['modbusregwrite'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_write_register_data)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_function_code)
                    .appendField(new Blockly.FieldDropdown(modbusRegWriteFunctionCodeDataArr), "FUNCTIONNAME")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_rtu_write_adress)
                    .appendField(new Blockly.FieldTextInput("192.168.61.80"), 'SLAVEADDRESS')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_rtu_write_num)
                    .appendField(new Blockly.FieldNumber(1, 1, 192, 0), 'SLAVENUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_array)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'ARRAYDATA')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_adress)
                    .appendField(new Blockly.FieldNumber(1, 1, 12, 0), 'ADDRESS')
                this.appendDummyInput()
                    .appendField(descriptionData[12].name)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WHETHERAPPLY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusregwrite'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var func_time = block.getFieldValue("FUNCTIONNAME");
            var salve_address = block.getFieldValue("SLAVEADDRESS");
            var salve_number = block.getFieldValue("SLAVENUMBER");
            var array = block.getFieldValue("ARRAYDATA");
            var address = block.getFieldValue("ADDRESS");
            var whether = block.getFieldValue("WHETHERAPPLY");
            var code = 'ModbusRegWrite(' + func_time + ',"' + salve_address + '",' + salve_number + ',' + array + ',"' + address + '",' + whether + ')\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®è¯»çº¿å*/
        Blockly.Blocks['modbusrtuslavereaddo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._read_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuDODataArr), "DONAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavereaddo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadDO_RTU(' + do_name + ',' + number + ')\n'; 
            return code;
        };

        /* modbusä»ç«è®¾ç½®åçº¿å*/
        Blockly.Blocks['modbusrtuslavewritedo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._write_coils)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._do_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuDODataArr), "DONAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavewritedo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var do_name = block.getFieldValue("DONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWriteDO_RTU(' + do_name + ',' + number + ',{' + value + '})\n'; 
            return code;
        };

        /* modbusä»ç«è®¾ç½®è¯»ç¦»æ£é*/
        Blockly.Blocks['modbusrtuslavereaddi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._read_inbits)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuDIDataArr), "DINAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavereaddi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var di_name = block.getFieldValue("DINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadDI_RTU(' + di_name + ',' + number + ')\n'; 
            return code;
        };

        /* modbusä»ç«è®¾ç½®è¯»æ¨¡æè¾åº*/
        Blockly.Blocks['modbusrtuslavereadao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._modbus_read_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuAODataArr), "AONAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavereadao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadAO_RTU(' + ao_name + ',' + number + ')\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®åæ¨¡æè¾åº*/
        Blockly.Blocks['modbusrtuslavewriteao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._modbus_write_ao)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ao_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuAODataArr), "AONAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavewriteao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ao_name = block.getFieldValue("AONAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWriteAO_RTU(' + ao_name + ',' + number + ',{' + value + '})\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®è¯»æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusrtuslavereadai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._modbus_read_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuAIDataArr), "AINAME")
                    .appendField(graphInputTitles.modbus._register_num)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavereadai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ai_name = block.getFieldValue("AINAME");
            var number = block.getFieldValue("REGISTERNUMBER");
            var code = 'ModbusSlaveReadAI_RTU(' + ai_name + ',' + number + ')\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®ç­å¾æ°å­è¾å¥*/
        Blockly.Blocks['modbusrtuslavewaitdi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._modbus_wait_di)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._di_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuDIDataArr), "DINAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "WAITSTATE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'OVERTIME')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavewaitdi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var di_name = block.getFieldValue("DINAME");
            var number = block.getFieldValue("WAITSTATE");
            var overtime = block.getFieldValue("OVERTIME");
            var code = 'ModbusSlaveWaitDI_RTU(' + di_name + ',' + number + ',' + overtime + ')\n'; 
            return code;
        };
        
        /* modbusä»ç«è®¾ç½®ç­å¾æ¨¡æè¾å¥*/
        Blockly.Blocks['modbusrtuslavewaitai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_rtu_slave + graphInputTitles.modbus._modbus_wait_ai)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._ai_name)
                    .appendField(new Blockly.FieldDropdown(slaveRtuAIDataArr), "AINAME")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(modbusWaitAIDataArr), "WAITSTATE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldNumber(1, 0, 10000, 0), 'REGISTERNUMBER')
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(-1, -1, 10000, 0), 'REGISTERVALUE')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['modbusrtuslavewaitai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var ai_name = block.getFieldValue("AINAME");
            var state = block.getFieldValue("WAITSTATE");
            var number = block.getFieldValue("REGISTERNUMBER");
            var value = block.getFieldValue("REGISTERVALUE");
            var code = 'ModbusSlaveWaitAI_RTU(' + ai_name + ',' + state + ',' + number + ',' + value + ')\n'; 
            return code;
        };

        /* æ¿å¡ââè®¾ç½®ä»ç«DO */
        Blockly.Blocks['fieldbusslavewritedo'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._set_slave_DO)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._DO_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 63, 1), "DOID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._write_quantity)
                    .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "WRITENUM")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._write_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'WRITEVAL')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavewritedo'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var doId = block.getFieldValue("DOID");
            var doWriteNum = block.getFieldValue("WRITENUM");
            var doWriteVal = block.getFieldValue("WRITEVAL");
            var code = `FieldBusSlaveWriteDO(${doId},${doWriteNum},{${doWriteVal}})\n`; 
            return code;
        };

        /* æ¿å¡ââè®¾ç½®ä»ç«AO */
        Blockly.Blocks['fieldbusslavewriteao'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._set_slave_AO)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._AO_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 31, 1), "AOID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._write_quantity)
                    .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "WRITENUM")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._write_value)
                    .appendField(new Blockly.FieldTextInput("1"), 'WRITEVAL')
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavewriteao'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var aoId = block.getFieldValue("AOID");
            var aoWriteNum = block.getFieldValue("WRITENUM");
            var aoWriteVal = block.getFieldValue("WRITEVAL");
            var code = `FieldBusSlaveWriteAO(${aoId},${aoWriteNum},{${aoWriteVal}})\n`; 
            return code;
        };

        /* æ¿å¡ââè·åä»ç«DI */
        Blockly.Blocks['fieldbusslavereaddi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._get_slave_DI)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._DI_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 79, 1), "DIID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._read_quantity)
                    .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "READQUANTITY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavereaddi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var diId = block.getFieldValue("DIID");
            var diReadQuantity = block.getFieldValue("READQUANTITY");
            var code = `FieldBusSlaveReadDI(${diId},${diReadQuantity})\n`; 
            return code;
        };

        /* æ¿å¡ââè·åä»ç«AI */
        Blockly.Blocks['fieldbusslavereadai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._get_slave_AI)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._DI_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 31, 1), "AIID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._read_quantity)
                    .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "READQUANTITY")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavereadai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var aiId = block.getFieldValue("AIID");
            var aiReadQuantity = block.getFieldValue("READQUANTITY");
            var code = `FieldBusSlaveReadAI(${aiId},${aiReadQuantity})\n`; 
            return code;
        };

        /* æ¿å¡ââç­å¾ä»ç«DI */
        Blockly.Blocks['fieldbusslavewaitdi'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._wait_slave_DI)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._DI_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 79, 1), "DIID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(ioStateArr), "WAITSTATE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._wait_forever)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "DITIMEOUT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._custom_time)
                    .appendField(new Blockly.FieldNumber(1, 1, 10000, 0), "TIMEOUT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavewaitdi'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var diId = block.getFieldValue("DIID");
            var diWaitState = block.getFieldValue("WAITSTATE");
            var isWait = block.getFieldValue("DITIMEOUT");
            var diTimeout = block.getFieldValue("TIMEOUT");
            var code = `FieldBusSlaveWaitDI(${diId},${diWaitState},${isWait == 1 ? -1 : diTimeout})\n`; 
            return code;
        };

        /* æ¿å¡ââç­å¾ä»ç«AI */
        Blockly.Blocks['fieldbusslavewaitai'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._wait_slave_AI)
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._AI_number)
                    .appendField(new Blockly.FieldNumber(0, 0, 31, 1), "DIID")
                    .appendField(',')
                    .appendField(graphInputTitles.modbus._wait_type)
                    .appendField(new Blockly.FieldDropdown(AIcompareArr), "WAITTYPE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._register_value)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000, 0), "REGISTERVAL")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._wait_forever)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "AITIMEOUT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._custom_time)
                    .appendField(new Blockly.FieldNumber(1, 1, 10000, 0), "TIMEOUT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fieldbusslavewaitai'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var aiId = block.getFieldValue("DIID");
            var aiWaitType = block.getFieldValue("WAITTYPE");
            var aiRegisterVal = block.getFieldValue("REGISTERVAL");
            var isWait = block.getFieldValue("AITIMEOUT");
            var aiTimeout = block.getFieldValue("TIMEOUT");
            var code = `FieldBusSlaveWaitAI(${aiId},${aiWaitType},${aiRegisterVal},${isWait == 1 ? -1 : aiTimeout})\n`; 
            return code;
        };
        
        
        /* æå¼Socketè¿æ¥ */
        Blockly.Blocks['opensocketconnect'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._open_socket)
                this.appendDummyInput()
                    .appendField("Socket-ID")
                    .appendField(new Blockly.FieldDropdown(socketIDListArr), "SOCKETPORT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['opensocketconnect'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SOCKETPORT");
            var code = `OpenSocketConnect(${port})\n`; 
            return code;
        };
        /* å³é­Socketè¿æ¥ */
        Blockly.Blocks['closesocketconnect'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._close_socket)
                this.appendDummyInput()
                    .appendField("Socket-ID")
                    .appendField(new Blockly.FieldDropdown(socketIDListArr), "SOCKETPORT")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['closesocketconnect'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SOCKETPORT");
            var code = `CloseSocketConnect(${port})\n`; 
            return code;
        };
        /* åéSocketæ°æ® */
        Blockly.Blocks['socketsend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._send_socket)
                this.appendDummyInput()
                    .appendField("Socket-ID")
                    .appendField(new Blockly.FieldDropdown(socketIDListArr), "SOCKETPORT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._data_transmission)
                    .appendField(new Blockly.FieldTextInput("hello"), 'SOCKETSENDDATA')
                this.appendDummyInput()
                    .appendField(descriptionData[11].name)
                    .appendField(new Blockly.FieldDropdown(socketSendBlockDataArr), "SOCKETBLOCK")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['socketsend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SOCKETPORT");
            var sendData = block.getFieldValue("SOCKETSENDDATA");
            var isBlock = block.getFieldValue("SOCKETBLOCK");
            var code = `SocketSend(${port},"${sendData}",${isBlock})\n`; 
            return code;
        };
        /* æ¥æ¶Socketæ°æ® */
        Blockly.Blocks['socketreceive'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._receive_socket)
                this.appendDummyInput()
                    .appendField("Socket-ID")
                    .appendField(new Blockly.FieldDropdown(socketIDListArr), "SOCKETPORT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_timeout)
                    .appendField(new Blockly.FieldNumber(100, 0, 10000, 1), "SOCKETTIMEOUT")
                this.appendDummyInput()
                    .appendField(graphInputTitles.modbus._modbus_wait_state)
                    .appendField(new Blockly.FieldDropdown(socketReceiveTimeoutDataArr), "SOCKETTIMEOUTSTRATEGY")
                this.setOutput(true, null);
                this.setColour("#6750d3");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['socketreceive'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var port = block.getFieldValue("SOCKETPORT");
            var timeout = block.getFieldValue("SOCKETTIMEOUT");
            var timeoutStrategy = block.getFieldValue("SOCKETTIMEOUTSTRATEGY");
            var code = `SocketReceive(${port},${timeout},${timeoutStrategy})\n`; 
            return [code, Blockly.Lua.ORDER_NONE];
        };

        /* ç¹ä½è¡¨æ¨¡å¼*/
        Blockly.Blocks['pointtableswitch'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._point_table_mode)
                    .appendField(new Blockly.FieldDropdown(pointTableModeListArr), "POINTTABLEMODE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._sync_update_all_teach_points)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "COVERTABLE")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._program_name)
                    .appendField(new Blockly.FieldDropdown(userData), "PROGRAMNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#FFA500");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['pointtableswitch'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var mode = block.getFieldValue("POINTTABLEMODE");
            var coverTable = block.getFieldValue("COVERTABLE");
            var luaName = block.getFieldValue("PROGRAMNAME");
            var code = '';
            code += 'PointTableSwitch(\'' + mode + '\')\nWaitMs(100)\n'; 
            if (coverTable == 1) {
                code += `PointTableUpdateLua('${luaName}')\n`;
            }
            return code;
        };

        /* ç³»ç»æ¨¡å¼*/
        Blockly.Blocks['systempointtableswitch'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._system_mode)
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._sync_update_all_teach_points)
                    .appendField(new Blockly.FieldDropdown(whetherDataArr), "COVERSYSTEM")
                this.appendDummyInput()
                    .appendField(graphInputTitles.motion._program_name)
                    .appendField(new Blockly.FieldDropdown(userData), "PROGRAMNAME")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#FFA500");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['systempointtableswitch'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var coverSystem = block.getFieldValue("COVERSYSTEM");
            var luaName = block.getFieldValue("PROGRAMNAME");
            var code = '';
            code += 'PointTableSwitch(\'\')\nWaitMs(100)\n'; 
            if (coverSystem == 1) {
                code += `PointTableUpdateLua('${luaName}')\n`;
            }
            return code;
        };

        /* ç¦ç¹è·éå¼å§*/
        Blockly.Blocks['focusstart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._focus_follows_start)
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._scale_parameter)
                    .appendField(new Blockly.FieldNumber(50.0, 0, 1000, 0.01), 'RATEPARAM')
                    .appendField(',')
                    .appendField(graphInputTitles.auxiliary._feedforward_parameters)
                    .appendField(new Blockly.FieldNumber(19.0, 0, 1000, 0.01), 'PREPARAM')
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._maximum_angular_acc_limit)
                    .appendField(new Blockly.FieldNumber(1440, 0, 10000, 0.01), 'MAXANGLEACCLIMIT')
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._maximum_angular_vel_limit)
                    .appendField(new Blockly.FieldNumber(180, 0, 1000, 0.01), 'MAXANGLESPEEDLIMIT')
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary._lock_axis_pointing)
                    .appendField(new Blockly.FieldDropdown(lockXPointModeDataArr), "LOCKXDIRECTION")
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#FFA500");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['focusstart'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var rate = block.getFieldValue("RATEPARAM");
            var preparam = block.getFieldValue("PREPARAM");
            var acc_limit = block.getFieldValue("MAXANGLEACCLIMIT");
            var angle_limit = block.getFieldValue("MAXANGLESPEEDLIMIT");
            var lock_direction = block.getFieldValue("LOCKXDIRECTION");
            var code = 'FocusStart(' + rate + "," + preparam + ',' + acc_limit + ',' + angle_limit + ','+ lock_direction + ')\n'; 
            return code;
        };

        /* ç¦ç¹è·éç»æ*/
        Blockly.Blocks['focusend'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(graphInputTitles.auxiliary.focus_follows_end)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour("#FFA500");
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['focusend'] = function (block) {
            // TODO: Assemble Lua into code variable.  
            var code = 'FocusEnd()\n'; 
            return code;
        };

        /* æå ä»£ç åæä»¤ -- ä»£ç åæå­è¯´æ */
        Blockly.Blocks['fold_block'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldTextInput(descriptionData[30].name), 'FOLDNAME')
                this.appendStatementInput("FOLDBLOCK")
                    .appendField(commandNameData[35].name)
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour('FFA500');
                this.setTooltip(commandNameData[35].name);
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['fold_block'] = function (block) {
            var fold_name = block.getFieldValue("FOLDNAME");
            var fold_value = Blockly.Lua.statementToCode(block, 'FOLDBLOCK', Blockly.Lua.ORDER_ATOMIC);
            var code = "";
            code = "--" + fold_name + '\n' + fold_value + '\n';
            return code;
        };

        /* dofileè°ç¨å­ç¨åºæä»¤ */
        Blockly.Blocks['dofile'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(commandNameData[36].name)
                    .appendField(new Blockly.FieldDropdown(userData), "file_lua")
                    .appendField(new Blockly.FieldDropdown(layerIdDataArr), "file_number")
                    .appendField(new Blockly.FieldNumber(1000, 0, Infinity, 1), "file_id")
                this.setNextStatement(true, null);
                this.setPreviousStatement(true, null);
                this.setColour('FFA500');
                this.setTooltip(commandNameData[36].name);
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['dofile'] = function (block) {
            var file_number = block.getFieldValue("file_number");
            var file_id = block.getFieldValue("file_id");
            var file_lua = block.getFieldValue("file_lua");
            var code = "";
            if (g_systemFlag == 0) {
                code = 'NewDofile("/fruser/' +  file_lua + '"' + ',' + file_number + ',' + file_id + ')' + '\n' + 'DofileEnd()\n';
            } else {
                code = 'NewDofile("/usr/local/etc/controller/lua/' +  file_lua + '"' + ',' + file_number + ',' + file_id + ')' + '\n' + 'DofileEnd()\n';
            }
            return code;
        };

        /**åå»ºè¾å©çº¿ç¨æä»¤ */
        Blockly.Blocks['aux_thread'] = {
            init: function () {
                this.appendValueInput('THREADVALUE')
                    .appendField(new Blockly.FieldTextInput(descriptionData[31].name), 'AUXVALUE')
                this.appendDummyInput()
                    .appendField(commandNameData[37].name)
                this.setColour('FFA500');
                this.setPreviousStatement(true, null)
                this.setNextStatement(true, null);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['aux_thread'] = function (block) {
            var input_more = Blockly.Lua.valueToCode(block, 'THREADVALUE', Blockly.Lua.ORDER_ATOMIC);
            var aux_value = block.getFieldValue('AUXVALUE');
            var code = "";
            if (input_more) {
                input_more = input_more.replace("(", "");
                input_more = input_more.replace(")", "");
                code = 'NewAuxThread(' + aux_value + ',' + '{' + input_more + '})' + '\n';
            } else {
                code = 'NewAuxThread(' + aux_value + ',' + '{' +  '})' + '\n';
            }
            return code;
        };

        /**èªå®ä¹stringç±»åæ°å¼ */
        Blockly.Blocks['input_string'] = {
            init: function () {
                this.appendValueInput('VALUESTRING')
                    .setCheck(null)
                    .appendField(new Blockly.FieldTextInput(descriptionData[32].name), 'INPUTVAL')
                this.setOutput(true);
                this.setColour('FFA500');
                this.setTooltip(descriptionData[32].name);
                this.setHelpUrl("");
            }
        };
        Blockly.Lua['input_string'] = function (block) {
            var input_string = Blockly.Lua.valueToCode(block, 'VALUESTRING', Blockly.Lua.ORDER_ATOMIC);
            var input_val = block.getFieldValue('INPUTVAL');
            var code = "";
            if (input_string) {
                input_string = input_string.replace("(", "");
                input_string = input_string.replace(")", "");
                code =  '"' + input_val + '"'+ ',' + input_string;
            } else {
                code =  '"' + input_val + '"';
            }
            return [code, Blockly.Lua.ORDER_NONE];
        };

          //èªå®ä¹numberç±»åæ°å¼
        Blockly.Blocks['math_out'] = {
            init: function() {
                this.appendValueInput('MATHVALUE')
                    .setCheck(null)
                    .appendField(new Blockly.FieldNumber(0, 0, 10000 ,0), "MATHNAME");
                this.setOutput(true, null);
                this.setColour('FFA500');
                this.setTooltip('');
                this.setHelpUrl('');
            }
        }
        Blockly.Lua['math_out'] = function(block) {
            var code = "";
            var argument0 = block.getFieldValue('MATHNAME')
            var argument1 = Blockly.Lua.valueToCode(block, 'MATHVALUE',Blockly.Lua.ORDER_ATOMIC)
            if (argument1) {
                argument1 = argument1.replace("(", "");
                argument1 = argument1.replace(")", "");
                code = argument0 + "," + argument1;
            } else {
                code = argument0;
            }
            return [code, Blockly.Lua.ORDER_NONE];
        };
    } 

    /* åå§åBlockly */
    let workspace;
    let toolbox;
    let blocklyDiv = document.getElementById('blocklyDiv');
    function initBlockly() {
        toolbox = {
            "kind": "categoryToolbox",
            "contents": [
                {
                    "id":"frluoji",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][0].name,
                    "colour": "#1777d7",
                    "contents": [
                        {
                            "kind": "block",
                            "type": "controls_if",
                        },
                        {
                            "kind": "block",
                            "type": "logic_compare"
                        },
                        {
                            "kind": "block",
                            "type": "logic_operation"
                        },
                        {
                            "kind": "block",
                            "type": "logic_boolean"
                        },
                        {
                            "kind": "block",
                            "type": "logic_negate"
                        },
                        {
                            "kind": "block",
                            "type": "getdi"
                        },
                        {
                            "kind": "block",
                            "type": "gettooldi"
                        },
                        {
                            "kind": "block",
                            "type": "gotofunction"
                        },
                        {
                            "kind": "block",
                            "type": "goto"
                        },
                        {
                            "kind": "label",
                            "text": langJsonData.commandlist["commandTitle"][1].name,
                        },
                        {
                            "kind": "block",
                            "type": "controls_whileUntil"
                        },
                        {
                            "kind": "block",
                            "type": "controls_for"
                        },
                        {
                            "kind": "block",
                            "type": "controls_repeat_ext"
                        },
                        {
                            "kind": "block",
                            "type": "controls_flow_statements"
                        },
                        {
                            "kind": "label",
                            "text": langJsonData.commandlist["commandTitle"][2].name,
                        },
                        {
                            "kind": "block",
                            "type": "math_number"
                        },
                        {
                            "kind": "block",
                            "type": "math_arithmetic"
                        }
                    ]
                },
                {
                    "id":"frbianliang",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][3].name,
                    "categorystyle": "variable_category",
                    "custom": "VARIABLE"
                },
                {
                    "id":"frhanshutiaoyong-z",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][4].name,
                    "colour": "#e34f99",
                    "custom": "PROCEDURE"
                },
                {
                    "id":"frkongzhidian",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][5].name,
                    "colour": "#6eb3f7",
                    "contents": [
                        {
                            "kind": "label",
                            "text": commandNameData[0].name,
                        },
                        {
                            "kind": "block",
                            "type": "ptp"
                        },
                        {
                            "kind": "block",
                            "type": "PtpFIRPlanningStart"
                        },
                        {
                            "kind": "block",
                            "type": "PtpFIRPlanningEnd"
                        },
                        {
                            "kind": "block",
                            "type": "ptpAccSmoothStart"
                        },
                        {
                            "kind": "block",
                            "type": "ptpAccSmoothEnd"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[1].name,
                        },
                        {
                            "kind": "block",
                            "type": "lin"
                        },
                        {
                            "kind": "block",
                            "type": "lintranspointanglestart"
                        },
                        {
                            "kind": "block",
                            "type": "lintranspointangleend"
                        },
                        {
                            "kind": "block",
                            "type": "linsingulavoidstart"
                        },
                        {
                            "kind": "block",
                            "type": "linsingulavoidend"
                        },
                        {
                            "kind": "block",
                            "type": "linsingulcrossstart"
                        },
                        {
                            "kind": "block",
                            "type": "linsingulcrossend"
                        },
                        {
                            "kind": "block",
                            "type": "linFIRPlanningStart"
                        },
                        {
                            "kind": "block",
                            "type": "linFIRPlanningEnd"
                        },
                        {
                            "kind": "block",
                            "type": "linseampos"
                        },
                        {
                            "kind": "block",
                            "type": "linAccSmoothStart"
                        },
                        {
                            "kind": "block",
                            "type": "linAccSmoothEnd"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[2].name,
                        },
                        {
                            "kind": "block",
                            "type": "arc"
                        },
                        {
                            "kind": "block",
                            "type": "arcsingulavoidstart"
                        },
                        {
                            "kind": "block",
                            "type": "arcsingulavoidend"
                        },
                        {
                            "kind": "block",
                            "type": "arcsingulcrossstart"
                        },
                        {
                            "kind": "block",
                            "type": "arcsingulcrossend"
                        },
                        {
                            "kind": "block",
                            "type": "arcFIRPlanningStart"
                        },
                        {
                            "kind": "block",
                            "type": "arcFIRPlanningEnd"
                        },
                        {
                            "kind": "block",
                            "type": "arcAccSmoothStart"
                        },
                        {
                            "kind": "block",
                            "type": "arcAccSmoothEnd"
                        },
                        // {
                        //     "kind": "block",
                        //     "type": "sptp"
                        // },
                        // {
                        //     "kind": "block",
                        //     "type": "slin"
                        // },
                        // {
                        //     "kind": "block",
                        //     "type": "scric"
                        // },
                        {
                            "kind": "label",
                            "text": commandNameData[3].name,
                        },
                        {
                            "kind": "block",
                            "type": "circle"
                        },
                        {
                            "kind": "block",
                            "type": "circleAccSmoothStart"
                        },
                        {
                            "kind": "block",
                            "type": "circleAccSmoothEnd"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[4].name,
                        },
                        {
                            "kind": "block",
                            "type": "spiral"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[5].name,
                        },
                        {
                            "kind": "block",
                            "type": "nspiral"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[6].name,
                        },
                        {
                            "kind": "block",
                            "type": "HSpiralStart"
                        },
                        {
                            "kind": "block",
                            "type": "HSpiralEnd"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[7].name,
                        },
                        {
                            "kind": "block",
                            "type": "splinestart"
                        },
                        {
                            "kind": "block",
                            "type": "splineend"
                        },
                        {
                            "kind": "block",
                            "type": "splinesptp"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[8].name,
                        },
                        {
                            "kind": "block",
                            "type": "newsplinestart"
                        },
                        {
                            "kind": "block",
                            "type": "newsplineend"
                        },
                        {
                            "kind": "block",
                            "type": "newsplinespl"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[9].name,
                        },
                        {
                            "kind": "block",
                            "type": "weavestart"
                        },
                        {
                            "kind": "block",
                            "type": "weaveend"
                        },
                        {
                            "kind": "block",
                            "type": "weavestartsim"
                        },
                        {
                            "kind": "block",
                            "type": "weaveendsim"
                        },
                        {
                            "kind": "block",
                            "type": "weaveinspectstart"
                        },
                        {
                            "kind": "block",
                            "type": "weaveinspectend"
                        },
                        {
                            "kind": "block",
                            "type": "WeaveChangeStart"
                        },
                        {
                            "kind": "block",
                            "type": "WeaveChangeEnd"
                        },
                        {
                            "kind": "block",
                            "type": "OriginPointWeaveStart"
                        },
                        {
                            "kind": "block",
                            "type": "OriginPointWeaveEnd"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[11].name,
                        },
                        {
                            "kind": "block",
                            "type": "pointsoffsetenable"
                        },
                        {
                            "kind": "block",
                            "type": "pointsoffsetdisable"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[12].name,
                        },
                        {
                            "kind": "block",
                            "type": "servocart"
                        },
                        {
                            "kind": "block",
                            "type": "servoj"
                        },
                        {
                            "kind": "label",
                            "text":  programCategoryArray[1].children[13].name,
                        },
                        {
                            "kind": "block",
                            "type": "trajectory"
                        },
                        {
                            "kind": "label",
                            "text":  programCategoryArray[1].children[14].name,
                        },
                        {
                            "kind": "block",
                            "type": "trajectoryJ"
                        },
                        {
                            "kind": "label",
                            "text":  programCategoryArray[1].children[15].name,
                        },
                        {
                            "kind": "block",
                            "type": "trajectoryLA"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[10].name,
                        },
                        {
                            "kind": "block",
                            "type": "movetpd"
                        },
                        {
                            "kind": "label",
                            "text": "DMP",
                        },
                        {
                            "kind": "block",
                            "type": "dmp"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[18].name,
                        },
                        {
                            "kind": "block",
                            "type": "tooltrsfstart"
                        },
                        {
                            "kind": "block",
                            "type": "tooltrsfend"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[1].children[17].name,
                        },
                        {
                            "kind": "block",
                            "type": "wptrsfstart"
                        },
                        {
                            "kind": "block",
                            "type": "wptrsfend"
                        },
                    ]
                },
                {
                    "id":"frDIpeizhi",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][6].name,
                    "colour": "#cd50d5",
                    "contents": [
                        {
                            "kind": "label",
                            "text": programCategoryArray[0].children[3].name
                        },
                        {
                            "kind": "block",
                            "type": "waitms"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[6].name
                        },
                        {
                            "kind": "block",
                            "type": "mode"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[0].children[4].name
                        },
                        {
                            "kind": "block",
                            "type": "pause"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[6].name
                        },
                        {
                            "kind": "block",
                            "type": "settoollist"
                        },
                        {
                            "kind": "block",
                            "type": "setextoollist"
                        },
                        {
                            "kind": "block",
                            "type": "setwobjtoollist"
                        },
                        {
                            "kind": "label",
                            "text": "I/O"
                        },
                        {
                            "kind": "block",
                            "type": "set_ao"
                        },
                        {
                            "kind": "block",
                            "type": "get_ao"
                        },
                        {
                            "kind": "block",
                            "type": "get_ai"
                        },
                        {
                            "kind": "block",
                            "type": "wait_AI"
                        },
                        {
                            "kind": "block",
                            "type": "set_do"
                        },
                        {
                            "kind": "block",
                            "type": "get_do"
                        },
                        {
                            "kind": "block",
                            "type": "get_di"
                        },
                        {
                            "kind": "block",
                            "type": "wait_DI"
                        },
                        {
                            "kind": "block",
                            "type": "Wait_MultiDI"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[4].name,
                        },
                        {
                            "kind": "block",
                            "type": "movetooldostart"
                        },
                        {
                            "kind": "block",
                            "type": "movetooldostartonce"
                        },
                        {
                            "kind": "block",
                            "type": "movedostop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[5].name,
                        },
                        {
                            "kind": "block",
                            "type": "moveaostart"
                        },
                        {
                            "kind": "block",
                            "type": "moveaostop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[8].name,
                        },
                        {
                            "kind": "block",
                            "type": "setanticollision"
                        },
                        {
                            "kind": "block",
                            "type": "setanticollisionauto"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[9].name,
                        },
                        {
                            "kind": "block",
                            "type": "setcollisiondetectionstart"
                        },
                        {
                            "kind": "block",
                            "type": "setcollisiondetectionend"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[2].children[10].name,
                        },
                        {
                            "kind": "block",
                            "type": "setoaccscale"
                        }
                    ]
                },
                {
                    "id":"frkuozhanzhoutubiao",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][9].name,
                    "colour": "#e5804a",
                    "contents": [
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[0].name,
                        },
                        {
                            "kind": "block",
                            "type": "movegripper"
                        },
                        {
                            "kind": "block",
                            "type": "actgripperreset"
                        },
                        {
                            "kind": "block",
                            "type": "actgripper"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[1].name,
                        },
                        {
                            "kind": "block",
                            "type": "spraystart"
                        },
                        {
                            "kind": "block",
                            "type": "spraystop"
                        },
                        {
                            "kind": "block",
                            "type": "powercleanstart"
                        },
                        {
                            "kind": "block",
                            "type": "powercleanstop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[2].name + "-UDP",
                        },
                        {
                            "kind": "block",
                            "type": "extdevloadudpdriver"
                        },
                        {
                            "kind": "block",
                            "type": "extdevudpcomparam"
                        },
                        {
                            "kind": "block",
                            "type": "extaxismovestart"
                        },
                        {
                            "kind": "block",
                            "type": "extaxismoveend"
                        },
                        {
                            "kind": "block",
                            "type": "extaxisptp"
                        },
                        {
                            "kind": "block",
                            "type": "extaxismoveptp"
                        },
                        {
                            "kind": "block",
                            "type": "extaxismovelin"
                        },
                        {
                            "kind": "block",
                            "type": "extaxisarc"
                        },
                        {
                            "kind": "block",
                            "type": "extaxissethoming"
                        },
                        {
                            "kind": "block",
                            "type": "extaxisservoon"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[2].name + "-485",
                        },
                        {
                            "kind": "block",
                            "type": "auxservostatusid"
                        },
                        {
                            "kind": "block",
                            "type": "auxservocontrol"
                        },
                        {
                            "kind": "block",
                            "type": "auxservoenable"
                        },
                        {
                            "kind": "block",
                            "type": "auxservohoming"
                        },
                        {
                            "kind": "block",
                            "type": "auxservotargetpos"
                        },
                        {
                            "kind": "block",
                            "type": "auxservotargetspeed"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[3].name,
                        },
                        {
                            "kind": "block",
                            "type": "conveyoriodetect"
                        },
                        {
                            "kind": "block",
                            "type": "conveyorgettrack"
                        },
                        {
                            "kind": "block",
                            "type": "conveyortrackstart"
                        },
                        {
                            "kind": "block",
                            "type": "conveyortrackend"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[4].name,
                        },
                        {
                            "kind": "block",
                            "type": "polishingdeviceenable"
                        },
                        {
                            "kind": "block",
                            "type": "polishingclearerror"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtorquesensorreset"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtargetVel"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtargettorque"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtargetposition"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtouchforce"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtouchtorquetime"
                        },
                        {
                            "kind": "block",
                            "type": "polishingworkpieceweight"
                        },
                        {
                            "kind": "block",
                            "type": "polishingtargetcontrolmode"
                        },
                        {
                            "kind": "block",
                            "type": "polishingsetdfcforce"
                        },
                        {
                            "kind": "block",
                            "type": "polishinggetdfcstate"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[3].children[6].name,
                        },
                        {
                            "kind": "block",
                            "type": "setsuckerctrl"
                        },
                        {
                            "kind": "block",
                            "type": "getsuckerstate"
                        },
                        {
                            "kind": "block",
                            "type": "waitsuckerstate"
                        },
                        {
                            "kind": "block",
                            "type": "getaxlegencomcycle"
                        },
                        {
                            "kind": "block",
                            "type": "sndrcvaxlegencom"
                        },
                    ]
                },
                {
                    "id":"frWeld",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][7].name,
                    "colour": "#ed5a3e",
                    "contents": [
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[0].name,
                        },
                        {
                            "kind": "block",
                            "type": "setweldingcurrent"
                        },
                        {
                            "kind": "block",
                            "type": "setCurrentGradualChangeStart"
                        },
                        {
                            "kind": "block",
                            "type": "setCurrentGradualChangeEnd"
                        },
                        {
                            "kind": "block",
                            "type": "setweldingvoltage"
                        },
                        {
                            "kind": "block",
                            "type": "setVoltageGradualChangeStart"
                        },
                        {
                            "kind": "block",
                            "type": "setVoltageGradualChangeEnd"
                        },
                        {
                            "kind": "block",
                            "type": "weldarcstart"
                        },
                        {
                            "kind": "block",
                            "type": "weldarcend"
                        },
                        {
                            "kind": "block",
                            "type": "setaspirated"
                        },
                        {
                            "kind": "block",
                            "type": "setaspiratedout"
                        },
                        {
                            "kind": "block",
                            "type": "setforwardWirefeed"
                        },
                        {
                            "kind": "block",
                            "type": "setforwardWirefeedstop"
                        },
                        {
                            "kind": "block",
                            "type": "setreversewirefeed"
                        },
                        {
                            "kind": "block",
                            "type": "setreversewirefeedstop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[1].name,
                        },
                        {
                            "kind": "block",
                            "type": "segment"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[2].name,
                        },
                        {
                            "kind": "block",
                            "type": "ltlaseron1"
                        },
                        {
                            "kind": "block",
                            "type": "ltlaseron2"
                        },
                        {
                            "kind": "block",
                            "type": "ltlaseron3"
                        },
                        {
                            "kind": "block",
                            "type": "unloadlaserdriver"
                        },
                        {
                            "kind": "block",
                            "type": "loadlaserdriver"
                        },
                        {
                            "kind": "block",
                            "type": "laseroff"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[28].name,
                        },
                        {
                            "kind": "block",
                            "type": "searchstart"
                        },
                        {
                            "kind": "block",
                            "type": "searchstop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[3].name,
                        },
                        {
                            "kind": "block",
                            "type": "lasersensorrecord"
                        },
                        {
                            "kind": "block",
                            "type": "movetolaserrecordstart"
                        },
                        {
                            "kind": "block",
                            "type": "movetolaserrecordend"
                        },
                        {
                            "kind": "block",
                            "type": "lasertrackon"
                        },
                        {
                            "kind": "block",
                            "type": "lasertrackoff"
                        },
                        {
                            "kind": "block",
                            "type": "laserrecordpoint"
                        },
                        {
                            "kind": "block",
                            "type": "laserrecordend"
                        },
                        {
                            "kind": "block",
                            "type": "lasertrackrecurrent"
                        },
                        {
                            "kind": "block",
                            "type": "laserthrough3"
                        },
                        {
                            "kind": "block",
                            "type": "laserthrough4"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[4].name,
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchstart"
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchend"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[138].name,
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchwait"
                        },
                        {
                            "kind": "label",
                            "text": commandNameData[150].name,
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchoffset"
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchoffsetin"
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchoffsetpoint"
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchoffsetcamera"
                        },
                        {
                            "kind": "block",
                            "type": "wiresearchoffsetsurface"
                        },
                        {
                            "kind": "block",
                            "type": "pointtodatabase"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[5].name,
                        },
                        {
                            "kind": "block",
                            "type": "arcweldtracecontrol"
                        },
                        {
                            "kind": "block",
                            "type": "arcweldtracecontrolend"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[4].children[6].name,
                        },
                        {
                            "kind": "block",
                            "type": "postureadjuston"
                        },
                        {
                            "kind": "block",
                            "type": "postureadjustoff"
                        },
                    ]
                },
                {
                    "id": "frlichuanganqizhiling",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][10].name,
                    "colour": "30c1d5",
                    "contents": [
                        {
                            "kind": "label",
                            "text": programCategoryArray[5].children[0].name,
                        },
                        {
                            "kind": "block",
                            "type": "ftguard"
                        },
                        {
                            "kind": "block",
                            "type": "ftguardclose"
                        },
                        {
                            "kind": "block",
                            "type": "ftcontrol"
                        },
                        {
                            "kind": "block",
                            "type": "ftcontrolclose"
                        },
                        {
                            "kind": "block",
                            "type": "ftcompliancestart"
                        },
                        {
                            "kind": "block",
                            "type": "ftcompliancestop"
                        },
                        {
                            "kind": "block",
                            "type": "ftspiralsearch"
                        },
                        {
                            "kind": "block",
                            "type": "ftrotinsertion"
                        },
                        {
                            "kind": "block",
                            "type": "ftlininsertion"
                        },
                        {
                            "kind": "block",
                            "type": "ftfindsurface"
                        },
                        {
                            "kind": "block",
                            "type": "ftcalcenterstart"
                        },
                        {
                            "kind": "block",
                            "type": "ftcalcenterend"
                        },
                        {
                            "kind": "block",
                            "type": "ftimpedancejointstart"
                        },
                        {
                            "kind": "block",
                            "type": "ftimpedancejointstop"
                        },
                        {
                            "kind": "block",
                            "type": "ftimpedancetcpstart"
                        },
                        {
                            "kind": "block",
                            "type": "ftimpedancetcpstop"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[5].children[1].name,
                        },
                        {
                            "kind": "block",
                            "type": "torquerecordstart"
                        },
                        {
                            "kind": "block",
                            "type": "torquerecordend"
                        },
                        {
                            "kind": "block",
                            "type": "torquerecordreset"
                        },
                    ]
                },
                {
                    "id": "frModbustongxun-z",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][11].name,
                    "colour": "#6750d3",
                    "contents": [
                        {
                            "kind": "label",
                            "text": graphInputTitles.modbus._modbus_master,
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterreaddo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterwritedo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterreaddi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterreadao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterwriteao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterreadai"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterwaitdi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusmasterwaitai"
                        },
                        {
                            "kind": "label",
                            "text": graphInputTitles.modbus._modbus_slave,
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavereaddo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavewritedo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavereaddi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavereadao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavewriteao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavereadai"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavewaitdi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusslavewaitai"
                        },
                        {
                            "kind": "label",
                            "text": graphInputTitles.modbus._modbus_rtu_read_register_command,
                        },
                        {
                            "kind": "block",
                            "type": "modbusregread"
                        },
                        {
                            "kind": "block",
                            "type": "modbusreggetdata"
                        },
                        {
                            "kind": "block",
                            "type": "modbusregwrite"
                        },
                        {
                            "kind": "label",
                            "text": graphInputTitles.modbus._modbus_rtu_slave,
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavereaddo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavewritedo"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavereaddi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavereadao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavewriteao"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavereadai"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavewaitdi"
                        },
                        {
                            "kind": "block",
                            "type": "modbusrtuslavewaitai"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[8].children[2].name,
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavewritedo"
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavewriteao"
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavereaddi"
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavereadai"
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavewaitdi"
                        },
                        {
                            "kind": "block",
                            "type": "fieldbusslavewaitai"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[8].children[3].name,
                        },
                        {
                            "kind": "block",
                            "type": "opensocketconnect"
                        },
                        {
                            "kind": "block",
                            "type": "closesocketconnect"
                        },
                        {
                            "kind": "block",
                            "type": "socketsend"
                        },
                        {
                            "kind": "block",
                            "type": "socketreceive"
                        },
                    ]
                },
                {
                    "id": "frgaoji",
                    "kind": "category",
                    "name": langJsonData.commandlist["commandTitle"][8].name,
                    "colour": "FFA500",
                    "contents": [
                        {
                            "kind": "block",
                            "type": "fold_block"
                        },
                        {
                            "kind": "block",
                            "type": "dofile"
                        },
                        {
                            "kind": "block",
                            "type": "aux_thread"
                        },
                        {
                            "kind": "block",
                            "type": "input_string"
                        },
                        {
                            "kind": "block",
                            "type": "math_out"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[9].children[2].name,
                        },
                        {
                            "kind": "block",
                            "type": "pointtableswitch"
                        },
                        {
                            "kind": "block",
                            "type": "systempointtableswitch"
                        },
                        {
                            "kind": "label",
                            "text": programCategoryArray[9].children[3].name,
                        },
                        {
                            "kind": "block",
                            "type": "focusstart"
                        },
                        {
                            "kind": "block",
                            "type": "focusend"
                        },
                    ]
                }
            ]
        };

        if (g_systemFlag == 1) {
            toolbox.contents[5].contents.push(
                {
                    "kind": "label",
                    "text": programCategoryArray[3].children[5].name,
                },
                {
                    "kind": "block",
                    "type": "cncworkstart"
                },
                {
                    "kind": "block",
                    "type": "cncworkstop"
                },
                {
                    "kind": "block",
                    "type": "cncdooropen"
                },
                {
                    "kind": "block",
                    "type": "cncdoorclose"
                },
                {
                    "kind": "block",
                    "type": "cncchuckopen"
                },
                {
                    "kind": "block",
                    "type": "cncchuckfastening"
                },
                {
                    "kind": "block",
                    "type": "cncsetemergencyon"
                },
                {
                    "kind": "block",
                    "type": "cncsetemergencyoff"
                },
                {
                    "kind": "block",
                    "type": "cncgetstatus"
                },
                {
                    "kind": "block",
                    "type": "cncgetrunningstate"
                },
                {
                    "kind": "block",
                    "type": "cncgetdoorstate"
                },
                {
                    "kind": "block",
                    "type": "cncgetchuckstate"
                },
                {
                    "kind": "block",
                    "type": "cncgetemergencystate"
                },
                {
                    "kind": "block",
                    "type": "cncgetwarningstate"
                },
                {
                    "kind": "block",
                    "type": "cncwaitrunningstate"
                },
                {
                    "kind": "block",
                    "type": "cncwaitchuckstate"
                }
            );
        }

        let options = {
            toolbox: toolbox,
            collapse: true,
            comments: false,
            disable: false,
            maxBlocks: Infinity,
            trashcan: false,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            media: '',
            rtl: false,
            scrollbars: true,
            sounds: true,
            oneBasedIndex: true,
            grid: {
                spacing: 20,
                length: 1,
                colour: '#888',
                snap: false
            },
            zoom: {
                // controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.5,
                scaleSpeed: 1.2
            },
        };

        /* Inject your workspace */
        workspace = Blockly.inject(blocklyDiv, options);

    }

    /**
     * ä¿å­å·¥ä½åº
     * @param {string} name å·¥ä½åºåç§°
     * @param {string} xmlText xmlä»£ç 
     * @param {string} code luaä»£ç 
     */
    function saveWorkspace(name, xmlText, code) {
        let cmdContent = {
            cmd: "save_blockly_workspace",
            data: {
                ws_name: name + ".json",       
                ws_xml_text: xmlText,
                ws_code: code
            }
        };
        dataFactory.actData(cmdContent).then((data) => {
            if (navigateUrl) {
                location = navigateUrl; //åæ¢è·¯å¾æ¶ï¼è·³è½¬å°æå­è·¯å¾
                workspace.clear();//ç¦»å¼é¡µé¢æ¶ï¼ä¿å­ç¨åºåæ¸é¤ä»£ç å
            }
            localStorage.setItem('graphFileName', cmdContent.data.ws_name);
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * ä¿å­å¾å½¢åç¼ç¨æ¶æ ¡éªæ¯å¦åå
     * @param {string} workspaceName å·¥ä½åºåå­
     */
    let monitorSaveContent;
    $scope.checkLuaSameName = function(workspaceName) {
        let nowGPName = workspaceName + ".json";
        let checkCmd = {
            cmd: "check_lua_file",
            data: {
                name: workspaceName + '.lua',
                type: '2'
            },
        };
        dataFactory.getData(checkCmd).then((data) => {
            switch (data.same_name) {
                case '0':
                    textToDomContent(importFileContent);
                    save();
                    break;
                case '1':
                    toastFactory.warning(gpDynamicTags.warning_messages[12] + gpDynamicTags.warning_messages[14]);
                    break;
                case '2':
                    if ($scope.selectedBlocklyWorkspaceName == undefined || $scope.selectedBlocklyWorkspaceName == null) {
                        $("#confirmChangeModal").modal('hide');
                        $('#importGraphModal').modal('hide');
                        $("#confirmGPNameModal").modal('show');
                        //ç¨åºä¿å­åè¦çéªè¯,é»æ­¢ç¨åºè¿è¡
                        g_programErrorFlag = 1;
                    } else {
                        if ($scope.selectedBlocklyWorkspaceName != nowGPName) {
                            monitorSaveContent = Blockly.Lua.workspaceToCode(workspace);
                            $("#confirmChangeModal").modal('hide');
                            $('#importGraphModal').modal('hide');
                            $("#confirmGPNameModal").modal('show');
                            g_programErrorFlag = 1;
                        } else {
                            save();
                        }
                    }
                    break;
                case '3':
                    toastFactory.warning(gpDynamicTags.warning_messages[13] + gpDynamicTags.warning_messages[14]);
                    break;
                default:
                    break;
            }
        }, (status) => {
            toastFactory.error(status, gpDynamicTags.error_messages[6]);
            /* test */
            if (g_testCode) {
                textToDomContent(importFileContent);
                save();
            }
            /* ./test */
        });
    }

    /**
     * ä¿å­luaæä»¶
     * @param {string} saveCode  è¦çluaæä»¶code
     */
    let xmlText;
    let code;
    function save(saveCode) {
        // code: çæåºæ¥çä»£ç 
        let normalCode; //å»ææåä¸è¡\nçä»£ç 
        code = Blockly.Lua.workspaceToCode(workspace);
        normalCode = code.slice(0, -1);
        let saveCmdContent;
        if (saveCode) {
            saveCode = saveCode.slice(0, -1);
            saveCmdContent = {
                cmd: "open_lua_file",
                data: {
                    name: $scope.workspaceNameForGP + ".lua",
                    pgvalue: saveCode,
                    type: '2'
                },
            };
            handleDofileArr(createCommandsArray(saveCode));
        } else {
            saveCmdContent = {
                cmd: "open_lua_file",
                data: {
                    name: $scope.workspaceNameForGP + ".lua",
                    pgvalue: normalCode,
                    type: '2'
                },
            };
            handleDofileArr(createCommandsArray(code));
        }
        dataFactory.actData(saveCmdContent).then(() => {
            g_fileNameForUpload = $scope.workspaceNameForGP + ".lua";
            g_fileDataForUpload = code;

            // save workspace
            // xmlï¼å·¥ä½åºç®åç¼è¾ç xml dom å¯¹è±¡
            // xmlText: xml dom å¯¹è±¡è½¬ text
            let xml = Blockly.Xml.workspaceToDom(workspace);
            xmlText = Blockly.Xml.domToText(xml);
            saveWorkspace($scope.workspaceNameForGP, xmlText, code);
            $scope.selectedBlocklyWorkspaceName = $scope.workspaceNameForGP + ".json";
            toastFactory.success(gpDynamicTags.success_messages[0] + $scope.workspaceNameForGP);
            $("#confirmGPNameModal").modal('hide');
            $("#confirmChangeModal").modal('hide');
            $("#importGraphModal").modal('hide');
            if (importFileContent) {
                importFileContent = '';
            }
            if (recordIndex == 1) {
                $("#loadBlocklyWorkspaceModal").modal('show');
            } else if (recordIndex == 2) {
                $("#importGraphModal").modal('show');
            } else if (recordIndex == 3) {
                $('#exportGraphModal').modal('show');
            }
            getUserFiles();
            if (startProgramFlag == 1 && g_programErrorFlag == 1) {
                $('#startProgramModal').modal('show');//æå¼è¿è¡å¼¹åºæ¡
            }
            g_programErrorFlag = 0;
            startProgramFlag = 0;
            liveCode.refresh(code);
        }, (status) => {
            /* test */
            if (g_testCode) {
                let xml = Blockly.Xml.workspaceToDom(workspace);
                xmlText = Blockly.Xml.domToText(xml);
                liveCode.refresh(code);
                saveWorkspace($scope.workspaceNameForGP, xmlText, code);
                $("#confirmGPNameModal").modal('hide');
                $("#confirmChangeModal").modal('hide');
                $("#importGraphModal").modal('hide');
                if (importFileContent) {
                    importFileContent = '';
                }
                if (recordIndex == 1) {
                    $("#loadBlocklyWorkspaceModal").modal('show');
                } else if (recordIndex == 2) {
                    $("#importGraphModal").modal('show');
                } else if (recordIndex == 3) {
                    $('#exportGraphModal').modal('show');
                }
            }
            /* ./test */
            toastFactory.error(status, gpDynamicTags.error_messages[3]);
        });
    }

    // è¿è¡ç¤ºæç¨åºåç¨åºåçæ¹å¨,èªå¨è§¦åä¿å­æé®
    let startProgramFlag;//ç¨åºè¦çåç»§ç»­è¿è¡ç¨åºæ å¿ 0-ä¸æå¼ 1-æå¼
    document.getElementById('graphicalProgramming').addEventListener('save-graphical-program', () => {
        if (g_programChangeFlag == 2) {
            navigateUrl = undefined;
            $scope.saveLuaFile();
            startProgramFlag = 1;
        }
    })

    $scope.saveLuaFile = function (type) {
        if (type) {
            recordIndex = 5;
        }
        if ($scope.workspaceNameForGP == null || $scope.workspaceNameForGP == undefined || $scope.workspaceNameForGP == '') {
            toastFactory.info(gpDynamicTags.info_messages[1]);
        } else {
            if (errorWarning || errorWarning2) {
                // ç­å¾å¤æ¡DIæ¥éæç¤ºå¨ä¿å­æ¶éªè¯ï¼åªæç¤ºä¸æ¬¡
                toastFactory.warning(gpDynamicTags.warning_messages[0]);
                return;
            }
            $scope.checkLuaSameName($scope.workspaceNameForGP);
        }
    }

    /* ç¡®è®¤è¦ç */
    $scope.confirmGPName = function () {
        textToDomContent(importFileContent);
        save(monitorSaveContent);
    }

    /* åæ¶è¦ç */
    $scope.cancelGPName = function() {
        g_programErrorFlag = 0;
        startProgramFlag = 0;
        if (navigateUrl) {
            location = navigateUrl;
        }
        $("#confirmGPNameModal").modal('hide');
        if($scope.selectedBlocklyWorkspaceName) {
            $scope.workspaceNameForGP = $scope.selectedBlocklyWorkspaceName.split('.')[0]; // åæ¶è¦çåï¼å·¥ä½åºåç§°åä¸ºä¹åçåå®¹
        } else {
            $scope.workspaceNameForGP = '';
        }
    }

    /* è·åå·¥ä½åºæ°ç» */
    $scope.blocklyWorkspaceNamesArr = [];
    function getBlocklyWorkspaceNames() {
        let cmdContent = {
            cmd: "get_blockly_workspace_names"
        };
        dataFactory.getData(cmdContent).then((data) => {
            $scope.blocklyWorkspaceNamesArr = data;
            hidePageLoading();
        }, (status) => {
            /* test */
            if (g_testCode) {
                $scope.blocklyWorkspaceNamesArr = ["bws1.json", "bws2.json", "bws3.json"];
            }
            /* ./test */
            toastFactory.error(status);
            hidePageLoading();
        });
    }

    /**
     * æ£æµå¾å½¢åç¼ç¨é¡µé¢åå®¹ï¼è¥åçæ¹ååè§¦å
     * @param {int} index åæ¶åç»§ç»­ç¸å³æä»¶æä½ 1-å è½½æä»¶ 2-å¯¼å¥æä»¶ 3-å¯¼åºæä»¶
     * @returns 
     */
    let recordIndex;
    let monitorContent;
    $scope.judegeBlocklyChange = function(index) {
        if (index) {
            recordIndex = index;
            monitorContent = Blockly.Lua.workspaceToCode(workspace);
            if (monitorContent != code && $scope.workspaceNameForGP != "" && $scope.workspaceNameForGP != undefined && $scope.workspaceNameForGP != null) {
                $("#confirmChangeModal").modal('show');
                return;
            }
        } else {
            //ä¸ä¿å­æ¶è§¦å
            $("#confirmChangeModal").modal('hide');
            if (navigateUrl) {
                location = navigateUrl;
                workspace.clear();//ç¦»å¼é¡µé¢æ¶ï¼æ¸é¤è¾å¥æ¡ä»å­å¨çé®é¢
            }
        }

        switch(recordIndex) {
            case 1:
                $scope.openLoadBlocklyWorkspaceModal();
                break;
            case 2:
                $('#importGraphModal').modal('show');
                break;
            case 3:
                $('#exportGraphModal').modal('show');
                break;
            default:
                break;
        }
    }

    //å½åæ¢é¡µé¢æ¶ï¼å³é­é¡µé¢é»è®¤ä¸ä¿å­åè·³è½¬
    $scope.closeGraphicalProgramModal = function() {
        if (navigateUrl) {
            $scope.judegeBlocklyChange();
        }
    }

    /* æå¼å è½½å·¥ä½åºxmlæ¨¡æçª */
    $scope.openLoadBlocklyWorkspaceModal = function () {
        let cmdContent = {
            cmd: "get_blockly_workspace_names"
        };
        dataFactory.getData(cmdContent).then((data) => {
            $scope.blocklyWorkspaceNamesArr = data;
            $("#loadBlocklyWorkspaceModal").modal('show');
            g_programErrorFlag = 0;
        }, (status) => {
            /* test */
            if (g_testCode) {
                $scope.blocklyWorkspaceNamesArr = ["bwswerewrwerewerwe1.json", "bws2.json", "bws3.json"];
                $("#loadBlocklyWorkspaceModal").modal('show');
            }
            /* ./test */
            toastFactory.error(status)
        });
    }

    /**
     * å è½½å·¥ä½åº
     * @param {string} flag æ å¿ä½ï¼åå§å è½½é¡µé¢æ¶è§¦å
     * @returns 
     */
    $scope.loadWorkspace = function (flag) {
        if(("1" != $scope.controlMode) && !flag){
            toastFactory.warning(gpDynamicTags.warning_messages[11]);
            return;
        }
        if ($scope.selectedBlocklyWorkspaceName == null || $scope.selectedBlocklyWorkspaceName == undefined) {
            toastFactory.info(gpDynamicTags.info_messages[2]);
        } else {
            let cmdContent = {
                cmd: "get_lua_data",
                data: {
                    name: $scope.selectedBlocklyWorkspaceName,
                    type: '2',
                }
            };
            dataFactory.getData(cmdContent).then((data) => {
                // æ¸ç©ºå·¥ä½åº
                $scope.clearWorkspace();
                // éè¦å°ä¿å­ç xmlText è½¬ä¸º xml dom å¯¹è±¡
                let xml = Blockly.Xml.textToDom(data.ws_xml_text);
                // åæ¾æ°æ®
                Blockly.Xml.domToWorkspace(xml, workspace);
                $scope.workspaceNameForGP = $scope.selectedBlocklyWorkspaceName.split('.')[0];
                $("#loadBlocklyWorkspaceModal").modal("hide");
                // ä¿å­æ°æ®
                recordIndex = 5;
                save();
            }, (status) => {
                /* test */
                if (g_testCode) {
                    let data = {
                        ws_xml_text: "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"dofile\" id=\"6gx!(HS53%kmpnodekVT\" x=\"42\" y=\"114\"><field name=\"file_lua\">test.lua</field><field name=\"file_number\">1</field><field name=\"file_id\">1000</field><next><block type=\"ptp\" id=\"#eBc;y}Zp3w+Q|(9ryEe\"><field name=\"POINTNAME\">point1</field><field name=\"DEBUGSPEED\">100</field><field name=\"DROPVALUE\">-1</field><field name=\"RADIUS\">0</field><field name=\"ISOFFSET\">0</field><next><block type=\"waitms\" id=\"HO,DGUHMInghi3ET0kp@\"><field name=\"WAITTIME\">1000</field></block></next></block></next></block></xml>",   //å·¥ä½åºxml 
                        ws_code: "NewDofile(\"/fruser/test.lua\",1,1000)\nDofileEnd()\nPTP(point1,100,-1,0)\nWaitMs(1000)\n",        //å·¥ä½åºluaä»£ç 
                    };
                    let xml = Blockly.Xml.textToDom(data.ws_xml_text);
                    Blockly.Xml.domToWorkspace(xml, workspace);
                    $scope.workspaceNameForGP = $scope.selectedBlocklyWorkspaceName.split('.')[0];
                    g_fileNameForUpload = $scope.selectedBlocklyWorkspaceName;
                    g_fileDataForUpload = data.ws_code;
                    $("#loadBlocklyWorkspaceModal").modal("hide");
                }
                /* ./test */
                toastFactory.error(status);
            });
        }
    }

    /* å é¤å·¥ä½åºæä»¶ */
    $scope.isDeleteGraphial = false;
    $scope.deleteWorkspace = function() {
        if ($scope.selectedBlocklyWorkspaceName) {
            const deleteName = $scope.selectedBlocklyWorkspaceName.split('.json')[0];
            if (!$scope.isDeleteGraphial) {
                toastFactory.info(gpDynamicTags.info_messages[3]);
                $scope.isDeleteGraphial = true;
                return;
            }
            let deleteCmd = {
                cmd: "remove_lua_file",
                data: {
                    name: [deleteName + '.lua'],
                    type: '2'
                }
            };
            dataFactory.actData(deleteCmd).then(() => {
                $('#loadBlocklyWorkspaceModal').modal('hide');
                $scope.selectedBlocklyWorkspaceName = null;
                $scope.isDeleteGraphial = false;
                // å é¤æååéæ°è·åç¨åºæä»¶
                getUserFiles();
                // å é¤æä»¶ä¸å½åæå¼æä»¶ç¸åæ¶ï¼éè¦æ¸é¤è¿è¡çç¸å³ä¿¡æ¯åå¾å½¢åç¼ç¨å·¥ä½åºåå®¹
                if ($scope.workspaceNameForGP && deleteName == $scope.workspaceNameForGP ) {
                    g_fileNameForUpload = "";
                    g_fileDataForUpload = "";
                    $scope.clearWorkspace();
                }
                if ((localStorage.getItem("graphFileName") != null) && (localStorage.getItem("graphFileName") != "")) {
                    if (deleteName + '.json' == localStorage.getItem("graphFileName")) {
                        localStorage.removeItem('graphFileName');
                    }
                } 
                toastFactory.success(gpDynamicTags.success_messages[2]);
            }, (status) => {
                $('#loadBlocklyWorkspaceModal').modal('hide');
                $scope.selectedBlocklyWorkspaceName = null;
                $scope.isDeleteGraphial = false;
                toastFactory.error(status, gpDynamicTags.error_messages[7]);
            });
        } else {
            toastFactory.info(gpDynamicTags.info_messages[2]);
        }
    }

    /* å³é­å·¥ä½åº */
    $scope.closeWorkspace = function() {
        recordIndex = 5; //ä¸åè§¦åèªå¨æå¼å·¥ä½åºæä½
    }

    /* æ¸ç©ºå·¥ä½åº */
    $scope.clearWorkspace = function () {
        $scope.workspaceNameForGP = null;
        workspace.clear();
        liveCode.refresh('');
    }

    /** å¯¼å¥å·¥ä½åº */
    let importFileContent; //å¯¼å¥çæä»¶åå®¹
    let importFileName; //å¯¼å¥çæä»¶åç§°
    $scope.importGraphFile = function() {
        importFileName = document.getElementById("graphFileImported").files; //è·åå½åéæ©çæä»¶å¯¹è±¡
        if (null == importFileName[0]) {
            toastFactory.info(gpDynamicTags.info_messages[2]);
            return;
        }
        let fr = new FileReader();
        try {
            fr.readAsText(importFileName.item(0));
            fr.onload = function (e) {
                importFileContent = JSON.parse(e.target.result);
                $scope.workspaceNameForGP = importFileName[0].name.split('.')[0];
                $scope.checkLuaSameName($scope.workspaceNameForGP); // æ ¡éªååæä»¶
            }
        }
        catch (err) {
        }
    }

    /**
     * å¯¼å¥æååå·¥ä½åºçæä»£ç å
     * @param {string} content ä¸ä¼ çjsonæä»¶åå®¹
     */
    function textToDomContent(content) {
        if (content) {
            let xml = Blockly.Xml.textToDom(content.ws_xml_text);
            Blockly.Xml.domToWorkspace(xml, workspace);
            monitorSaveContent = Blockly.Lua.workspaceToCode(workspace);
        }
    }

    /** å¯¼åºå·¥ä½åº */
    $scope.exportGraphFile = function() {
        if (!$scope.selectedBlocklyWorkspaceName) {
            toastFactory.info(gpDynamicTags.info_messages[2]);
        } else {
            $('#exportGraphModal').modal('hide');
            dataFactory.downloadData($scope.selectedBlocklyWorkspaceName, "blocklyWorkspace");
        }
    }

    /* æ´æ°å¾å½¢åç¼ç¨é¡µé¢ */
    let recordSavePoint;
    blocklyDiv.addEventListener('savepoints', () => {
        if (blocklyDiv != null) {
            getPointsData();
            recordSavePoint = 1;
        }
    });

    /*å±å¼/éèä»£ç ç¼è¯ */
    let codeArrowFlg = 0; //ä»£ç æ å±å¼ç¶æ
    $scope.livaCodeArrow = function() {
        codeArrowFlg = 1 ^ codeArrowFlg;
        $(".block-code-container").css('transition','right 0.5s');
        if (!$scope.graphViewFlg) {
            document.getElementById("block-code-container").classList.toggle("live-code-half-closed");
        } else {
            document.getElementById("block-code-container").classList.toggle("live-code-closed");
        }
        document.getElementById("live-code-arrow").classList.toggle("live-code-arrow-clicked");
        liveCode.refresh(Blockly.Lua.workspaceToCode(workspace));
    }

    /*å±å¼/éèä»£ç ç¼è¯ */
    $scope.liveCodeRefresh = function() {
        liveCode.refresh(Blockly.Lua.workspaceToCode(workspace));
    }

    /**é¡µé¢åå§åæèå·æ°æ¶å è½½ä¸æ¬¡æä½çç¨åº */
    function initialLoadProgram() {
        if ((localStorage.getItem("graphFileName") != null) && (localStorage.getItem("graphFileName") != "")) {
            if ($scope.blocklyWorkspaceNamesArr.findIndex(item => item == localStorage.getItem("graphFileName")) != -1) {
                $scope.selectedBlocklyWorkspaceName = localStorage.getItem("graphFileName");
                $scope.loadWorkspace('init');
            }
        } 
    }

    /**åå»ºèªå®ä¹ç±»å«ï¼ååå»ºèªå®ä¹ç±»å«ï¼ç»§æ¿èªBlockly.ToolboxCategory */
    class CustomCategory extends Blockly.ToolboxCategory {
        // èªå®ä¹ç±»å«åé å½æ°
        // categoryDef: ç±»å«å®ä¹çä¿¡æ¯
        // toolbox: è¡¨ç¤ºç±»å«çç¶çº§toolbox
        // opt_parent: å¯éåæ°ï¼è¡¨ç¤ºå¶ç¶ç±»å«
        constructor(categoryDef, toolbox, opt_parent) {
            super(categoryDef, toolbox, opt_parent);
        }
        // ç¹å»å¯¼èªæ æ¹åé¢è²
        addColourBorder_(colour){
            this.rowDiv_.style.backgroundColor = colour;
        }
        // ç¹å»å¯¼èªæ åç±»æ¶ï¼å»é¤ç©ºç½è²
        setSelected(isSelected){
            // ç¹å»å·¥å·ç®±å¯¼èªæ ï¼ç¼©æ¾æ¢å¤é»è®¤å¤§å°
            this.workspace_.scale = 1;
            // ä½¿ç¨getElementsByClassNameéä¸­ç±»å«å¯¹åºçspanåç´ 
            var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
            if (isSelected) {
            // éä¸­çç±»å«èæ¯è²è²åº¦åæµ
            this.rowDiv_.style.opacity = '0.6';
            } else {
            // æªéä¸­çç±»å«èæ¯è²è®¾ç½®
            this.rowDiv_.style.backgroundColor = this.colour_;
            // æªéä¸­çç±»å«ææ¬è®¾ç½®ä¸ºç½è²
            labelDom.style.color = 'white';
            this.rowDiv_.style.opacity = '1';
            }
            Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
                Blockly.utils.aria.State.SELECTED, isSelected);
        }
        // æ·»å å¾æ 
        createIconDom_() {
            const svg = document.createElement('svg');
            if (this.toolboxItemDef_.id == 'frbianliang') {
                svg.setAttribute('style','width: 34px; height: 34px; color:#fff;font-size: 36px');
            } else {
                svg.setAttribute('style','width: 34px; height: 34px; color:#fff;font-size: 26px');
            }
            svg.setAttribute('class',`frfont d-flex justify-content-center align-items-center`);
            svg.setAttribute('class',`frfont ${this.toolboxItemDef_.id} d-flex justify-content-center align-items-center`);
            svg.setAttribute("aria-hidden", true);
            return svg;
        }
    }

    /**èªå®ä¹ç±»å«éè¦åBlocklyæ³¨åï¼åç¥èªå®ä¹ç±»å«çå­å¨ï¼ä¸ç¶ä¼æ æ³è¯å«æ°å»ºçç±» */
    Blockly.registry.register(
        Blockly.registry.Type.TOOLBOX_ITEM,
        Blockly.ToolboxCategory.registrationName,
    CustomCategory, true);

    /* åå§åé¡µé¢ */
    var onresize = function () {
        Blockly.svgResize(workspace);
    };
    document.getElementById("graphicalProgramming").addEventListener('init-blockly', () => {
        if (getPointsFlg && getTPDFlg && getSensorToolCoordFlg) {
            //SetDOæ¨¡å¼(å¹³æ»è½¨è¿¹)       
            langJsonData.commandlist["setIOMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                doModeOptionsArr.push(tempItem);
            });
            //Pauseæåæ¨¡å¼      
            langJsonData.commandlist["PauseFunction"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                PauseOptionsArr.push(tempItem);
            });

            //waitMultiDI
            langJsonData.IOlists["clDI"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                waitMultiDIOptionArr.push(tempItem);
            });

            //WhetherMotion
            langJsonData.commandlist["WhetherMotion"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                whetherMotionArr.push(tempItem);
            });

            //æ£æµ
            langJsonData.program_teach.var_object["detectionData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                detectionDataArr.push(tempItem);
            });

            //ç¢°ææ£æµ--é»å¡/éé»å¡
            langJsonData.program_teach.var_object["blockData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collsionBlockDataArr.push(tempItem);
            });

            //é»å¡/éé»å¡
            langJsonData.commandlist["IOBlockData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                blockDataArr.push(tempItem);
            });

            //æ¯/å¦
            langJsonData.commandlist["WhetherData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                whetherDataArr.push(tempItem);
            });

            //ä¿æ¤æ¨¡å¼
            langJsonData.program_teach.var_object["strangeAvoidStrategyData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id.toString();;
                strangeAvoidStrategyDataArr.push(tempItem);
            });

            //å¦
            langJsonData.commandlist["WhetherSingleData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                whetherSingleDataArr.push(tempItem);
            });

            //ä¸/æ
            langJsonData.commandlist["ConnectionData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                connectionDataArr.push(tempItem);
            });

            //å¤§äº/å°äº
            langJsonData.commandlist["ComparationData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                comparationDataArr.push(tempItem);
            });

            //åæ­¢/å¹³æ»è¿æ¸¡
            langJsonData.commandlist["LinModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                linModeDataArr.push(tempItem);
            });

            //æ­£ç¡®/éè¯¯
            langJsonData.commandlist["WhetherTruthData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                whetherTruthDataArr.push(tempItem);
            });

            //éè¯¯
            langJsonData.commandlist["LayerIdData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                layerIdDataArr.push(tempItem);
            });

            //åè½ç±»å
            langJsonData.program_teach.var_object["functionTypeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                functionTypeDataArr.push(tempItem);
            });

            //åè½ç±»å
            langJsonData.program_teach.var_object["delayModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                delayModeDataArr.push(tempItem);
            });

            //å®ç¹è·è¸ªè¿å¨ç±»å
            langJsonData.program_teach.var_object["trackMotionModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                trackMotionModeDataArr.push(tempItem);
            });

            //å®ç¹è·è¸ªè§¦åæ¹å¼
            langJsonData.program_teach.var_object["trackTriggerModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                trackTriggerModeDataArr.push(tempItem);
            });

            //æ®µçæ¨¡å¼ 0-ä¸ååå§¿æ 1-ååå§¿æ
            langJsonData.program_teach.var_object["segmentModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                segmentModeDataArr.push(tempItem);
            });

            //æ§è¡åè½
            langJsonData.program_teach.var_object["functionModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                functionModeDataArr.push(tempItem);
            });

            //å³èè¶éä¿æ¤å¤çç­ç¥
            langJsonData.program_teach.var_object["treatStrategyData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id.toString();
                treatStrategyDataArr.push(tempItem);
            });

            //I/Oç±»å
            langJsonData.commandlist["IOTypeDict"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                functionIOTypeDataArr.push(tempItem);
            });

            //æå¨æ¨¡å¼
            langJsonData.program_teach.var_object["weaveModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                weaveModeDataArr.push(tempItem);
            });

            //åæ´ç±»å
            langJsonData.program_teach.var_object["roundingRuleData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                roundingRuleDataArr.push(tempItem);
            });

            //ä¼ æå¨é©±å¨åè®®--ç¿ç
            langJsonData.commandlist["LoadPosSensorDriverData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                loadPosSensorDriverDataArr.push(tempItem);
            });

            //æè½¬æ¹åï¼é¡ºæ¶é/éæ¶éï¼
            langJsonData.program_teach.var_object["spiralDirectionData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                hSprialDriectionArr.push(tempItem);
            });

            //åç§»ç±»å
            langJsonData.program_teach.var_object["offsetTypeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                offsetTypeDataArr.push(tempItem);
            });

            //æ¯å¦åç§»
            langJsonData.program_teach.var_object["offsetFlagData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                offsetFlagDataArr.push(tempItem);
            });

            //å·¥å·åæ åç§»
            langJsonData.program_teach.var_object["nSpiralOffsetFlagData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                nSpiralOffsetFlagDataArr.push(tempItem);
            });

            //æè½¬æ¹å
            langJsonData.program_teach.var_object["spiralDirectionData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                spiralDirectionDataArr.push(tempItem);
            });

            //æ§å¶æ¨¡å¼
            langJsonData.program_teach.var_object["newSplineModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                newSplineModeDataArr.push(tempItem);
            });

            //è½¨è¿¹æ¨¡å¼
            langJsonData.commandlist["trajectoryJMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                trajectoryJModeArr.push(tempItem);
            });

            //è½¨è¿¹åç»ââæ²çº¿æåæ¹å¼
            langJsonData.program_teach.var_object["curveFittingData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                curveFittingArr.push(tempItem);
            });

            //è½¨è¿¹åç»ââæ²çº¿å¹³æ»è¡æ¥æ¹å¼
            langJsonData.program_teach.var_object["curveFittingSmoothData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                curveFittingSmoothArr.push(tempItem);
            });

            //åé¶æ¨¡å¼
            langJsonData.program_teach.var_object["ZeroModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                zeroModeDataArr.push(tempItem);
            });

            //ä¼ºæåé¶æ¨¡å¼
            langJsonData.peripheral_setting.var_object["servoZeroModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                servoZeroModeDataArr.push(tempItem);
            });

            //ä¼ºææ§å¶æ¨¡å¼
            langJsonData.commandlist["auxServoCommandMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                auxServoCommandModeArr.push(tempItem);
            });

            //ä¼ºæä½¿è½æ¨¡å¼
            langJsonData.program_teach.var_object["servoEnableData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                servoEnableDataArr.push(tempItem);
            });

            //ä¼ºæID
            servoIdData.forEach(element => {
                tempItem = [];
                tempItem[0] = element;
                tempItem[1] = element;
                servoIdDataArr.push(tempItem);
            });
            
            //ä¼ éå¸¦å·¥ä½æ¨¡å¼
            langJsonData.program_teach.var_object["ConTrackModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                conTrackModeDataArr.push(tempItem);
            });
            
            //è®¾å¤ä½¿è½
            langJsonData.program_teach.var_object["enableData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                enableDataArr.push(tempItem);
            });
            
            //æç£¨æ§å¶æ¨¡å¼
            langJsonData.program_teach.var_object["polishCommandMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                polishCommandModeArr.push(tempItem);
            });

            //CNC--ç­å¾æºåºè¿è¡ç¶æââè¿è¡ç¶æ
            langJsonData.program_teach.var_object["cncWaitRunData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                cncWaitRunArr.push(tempItem);
            });

            //CNC--ç­å¾æºåºå¡çç¶æââå¡çç¶æ
            langJsonData.index.var_object["CNCChuckStatus"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                cncChuckStatusArr.push(tempItem);
            });

            //CNC--ç­å¾æºåºè¿è¡/å¡çç¶æââè¶æ¶éæ©
            langJsonData.program_teach.var_object["cncTimeoutData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                cncTimeoutArr.push(tempItem);
            });

            //CNC--ç­å¾æºåºè¿è¡/å¡çç¶æââè¶æ¶ç­ç¥
            langJsonData.program_teach.var_object["cncTimeoutPolicyData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                cncTimeoutPolicyArr.push(tempItem);
            });
            
            //ç¢°æç­çº§
            langJsonData.program_teach.var_object["collideModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collideModeDataArr.push(tempItem);
            });
            
            //å·¦å³åç§»è¡¥å¿
            langJsonData.program_teach.var_object["traceIsleftrightData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                traceIsleftrightDataArr.push(tempItem);
            });

            //å·¦å³åç§»åç½®æ¹å¼
            langJsonData.program_teach.var_object["biasModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                biasModeDataArr.push(tempItem);
            });
            
            //ä¸ä¸åæ ç³»éæ©
            langJsonData.program_teach.var_object["weldTraceAxisselectData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                weldTraceAxisselectDataArr.push(tempItem);
            });
            
            //ä¸ä¸åºåçµæµè®¾å®æ¹å¼
            langJsonData.program_teach.var_object["weldTraceReferenceTypeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                weldTraceReferenceTypeDataArr.push(tempItem);
            });
            
            //å¯åç¶æ
            langJsonData.program_teach.var_object["FTControlILCSignData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                FTControlILCSignDataArr.push(tempItem);
            });
            
            //æ§å¶å¯åç¶æ
            langJsonData.program_teach.var_object["FTControlAdjSignData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                FTControlAdjSignDataArr.push(tempItem);
            });
            
            //åæ ç³»åç§°
            langJsonData.program_teach.var_object["FTReferenceCoordData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                FTReferenceCoordDataArr.push(tempItem);
            });
            
            //åçæ¹å
            langJsonData.program_teach.var_object["FTRotOrnData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                FTRotOrnDataArr.push(tempItem);
            });
            
            //æå¥æ¹å
            langJsonData.program_teach.var_object["FTRotRotOrnData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                FTRotRotOrnDataArr.push(tempItem);
            });
            
            //æªæ£æµå°å¤åå¤çç­ç¥
            langJsonData.program_teach.var_object["checkStrategyData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                checkStrategyDataArr.push(tempItem);
            });
            
            //ç§»å¨è½´
            langJsonData.process.var_object["wobjAxisData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wobjAxisDataArr.push(tempItem);
            });
            
            //å¹³æ»éæ©
            langJsonData.program_teach.var_object["torqueSmoothTypeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                torqueSmoothTypeDataArr.push(tempItem);
            });

            //ç­å¾ç±»å
            langJsonData.commandlist["IOState"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                ioStateArr.push(tempItem);
            });
            
            //ç­å¾ç¶æ
            langJsonData.commandlist["AIcompare"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                AIcompareArr.push(tempItem);
            });
            
            //ç­å¾æ¨¡æè¾åº-ç­å¾ç¶æ
            modbusWaitAIData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                modbusWaitAIDataArr.push(tempItem);
            });
            
            //æç£¨å¤´éé
            polishChannelData.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                polishChannelDataArr.push(tempItem);
            });

            //å¸çæ§å¶æ¨¡å¼
            langJsonData.program_teach.var_object["suckerStateDict"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                suckerStateDictArr.push(tempItem);
            });

            //å¸çä»ç«å·
            suctionPortDict.forEach(element => {
                tempItem = [];
                tempItem[0] = String(element);
                tempItem[1] = String(element);
                suctionPortDictArr.push(tempItem);
            });

            //å¸çæ¨¡å¼
            langJsonData.program_teach.var_object["suckerControlMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                suckerControlModeArr.push(tempItem);
            });

            //åç§»åæ ç³»ç±»å
            langJsonData.program_teach.var_object["axisTypeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                axisTypeDataArr.push(tempItem);
            });
            
            //è¯»å¯å­å¨åè½ç 
            langJsonData.program_teach.var_object["modbusRegReadFunctionCodeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                modbusRegReadFunctionCodeDataArr.push(tempItem);
            });
            
            //åå¯å­å¨åè½ç 
            langJsonData.program_teach.var_object["modbusRegWriteFunctionCodeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                modbusRegWriteFunctionCodeDataArr.push(tempItem);
            });
            
            //éå®Xè½´æå
            langJsonData.program_teach.var_object["lockXPointModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                lockXPointModeDataArr.push(tempItem);
            });
            
            //æ¿æç±»å
            langJsonData.program_teach.var_object["techPlateType"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                techPlateTypeArr.push(tempItem);
            });
            
            //è¿å¨æ¹å
            langJsonData.program_teach.var_object["techMotionDirection"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                techMotionDirectionArr.push(tempItem);
            });
            
            //æç¹ç±»å
            langJsonData.program_teach.var_object["infPointType"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                infPointTypeArr.push(tempItem);
            });
            
            //è®¡ç®æ¹æ³1
            langJsonData.program_teach.var_object["wireSearchType1MethodData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wireSearchType1MethodDataArr.push(tempItem);
            });
            
            //è®¡ç®æ¹æ³2
            langJsonData.program_teach.var_object["wireSearchType2MethodData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wireSearchType2MethodDataArr.push(tempItem);
            });
            
            //è¾åºæ¨¡å¼
            langJsonData.program_teach.var_object["outputMoveDOModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                outputMoveDOModeDataArr.push(tempItem);
            });
            
            //IOç±»å
            langJsonData.commandlist["IOTypeDict"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                IOTypeDictArr.push(tempItem);
            });

            //çæºçµæµçµåæ§å¶AO
            langJsonData.commandlist["AOport"].slice(0, -1).forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                outputAOArr.push(tempItem);
            });

            //çæºçµæµçµåå¹³æ»éæ©
            langJsonData.commandlist["setIOMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.num;
                weldSmoothArr.push(tempItem);
            });
            
            //åºåä½ç½®
            langJsonData.program_teach.var_object["wireRefPosData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wireRefPosDataArr.push(tempItem);
            });

            //è¿åæ¹å¼
            langJsonData.program_teach.var_object["wireSearchBackFlagData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wireSearchBackFlagDataArr.push(tempItem);
            });

            //å¯»ä½æ¹å¼
            langJsonData.program_teach.var_object["wireSearchModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                wireSearchModeDataArr.push(tempItem);
            });

            //æ¯å¦å¯»ä½
            langJsonData.commandlist["setTPDMode"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                setTPDModeArr.push(tempItem);
            });

            //å¹³æ»è¿æ¸¡æ¹å¼
            langJsonData.program_teach.var_object["smoothStrategyData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                smoothStrategyDataArr.push(tempItem);
            });

            //å¯»ä½ç¹åé-åºåç¹
            constantService["wireSearchRefPointData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                wireSearchRefPointDataArr.push(tempItem);
            });

            //æ¥è§¦ç¹
            constantService["wireSearchResPointData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.name;
                wireSearchResPointDataArr.push(tempItem);
            });

            //çç¼ç¼å­æ°æ®éæ©
            langJsonData.program_teach.var_object["weldRecordData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                weldRecordDataArr.push(tempItem);
            });

            //æ¿æç±»å
            langJsonData.program_teach.var_object["TplateType"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                TplateTypeArr.push(tempItem);
            });

            //ä¼ºææ¨¡å¼
            langJsonData.program_teach.var_object["servoCModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                servoCModeDataArr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j1
            $scope.collisionLevelData.j1.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel1Arr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j2
            $scope.collisionLevelData.j2.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel2Arr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j3
            $scope.collisionLevelData.j3.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel3Arr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j4
            $scope.collisionLevelData.j4.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel4Arr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j5
            $scope.collisionLevelData.j5.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel5Arr.push(tempItem);
            });

            //ç¢°æç­çº§-æ åç­çº§j6
            $scope.collisionLevelData.j6.forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                collisionLevel6Arr.push(tempItem);
            });

            //é»å¡ç¶æ
            langJsonData.program_teach.var_object["socketSendBlockData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                socketSendBlockDataArr.push(tempItem);
            });
            //è¶æ¶ç­å¾ç¶æ
            langJsonData.program_teach.var_object["socketReceiveTimeoutData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = String(element.id);
                socketReceiveTimeoutDataArr.push(tempItem);
            });

            // æå¨æ¸åââæ¸åæ¨¡å¼
            langJsonData.program_teach.var_object["weaveGradientModeData"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                gradientModeArr.push(tempItem);
            });

            // å®ç¹æå¨ââ
            langJsonData.program_teach.var_object["fixWeaveDatumList"].forEach(element => {
                tempItem = [];
                tempItem[0] = element.name;
                tempItem[1] = element.id;
                fixWeaveDatumArr.push(tempItem);
            });

            initBlocks();
            initBlockly();
            /* èªéåº */
            $window.addEventListener('resize', onresize, false);
            // éèæ»å¨æ¡èæ¯ï¼è§£å³ä¸ä»£ç è½¬è¯å¼¹åºæ¡å²çªé®é¢
            $(".blocklyScrollbarVertical").css("display", "none"); 
            $(".blocklyScrollbarHorizontal").css("display", "none"); 
        }
    });

    document.getElementById("graphicalProgramming").addEventListener("resize-workspace", onresize);
};
