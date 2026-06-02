"use strict";

angular
    .module('frApp')
    .controller('settingCtrl', ['$scope', 'dataFactory', 'toastFactory', '$timeout', 'testDataService', settingCtrlFn])

function settingCtrlFn($scope, dataFactory, toastFactory, $timeout, testDataService) {
    // È°µÈù¢Ê?æÁ§∫Ë??Â?¥ËÆæÁΩÆ
    addHoverIn();
    $scope.halfBothView();
    $scope.setProgramUrdf(false);
    $scope.initRobotViewFlag();
    /* ‰æùÊçÆÁ≥ªÁª?ËØ≠Ë®?Ë?∑Âè?ÂØπÂ∫?Á??ËØ≠Ë®?Â??Âè?ÂΩ?Â?çÈ°µÈù¢Â?ùÂß?Â?? */
    let rsDynamicTags;
    rsDynamicTags = langJsonData.robot_setting;
    // Ë?∑Âè?ÂØºË?™Ê†èÂØπË±°È°µÈù¢Ê?æÁ§∫
    $scope.rsSettingNavList = rsDynamicTags.navbar;    
    // Ë?∑Âè?Âè?È?èÂØπË±°
    // Â∑•Â?∑ÂùêÊ†?Á≥ª
    $scope.toolTypeData = rsDynamicTags.var_object.toolTypeData;
    $scope.mountingLocationData = rsDynamicTags.var_object.mountingLocationData;
    $scope.laserLocationData = rsDynamicTags.var_object.LaserLocationData;
    $scope.toolCalMethod = rsDynamicTags.var_object.toolCalMethod;
    $scope.laserCalMethod = rsDynamicTags.var_object.laserCalMethod;
    // Â∑•‰ª∂ÂùêÊ†?Á≥ª
    $scope.wobjMethodData = rsDynamicTags.var_object.wobjMethodData;
    $scope.DOCfgData = rsDynamicTags.var_object.DOCfgData;
    $scope.DICfgData = rsDynamicTags.var_object.DICfgData;
    $scope.EndDICfgData = rsDynamicTags.var_object.EndDICfgData;
    $scope.digitvalid = rsDynamicTags.var_object.digitvalid;
    $scope.controlBoxDoData = rsDynamicTags.var_object.controlBoxDoData;
    $scope.outputResetData = rsDynamicTags.var_object.outputResetData;
    $scope.outputWhetherData = langJsonData.commandlist.WhetherData;
    // Ê??Â?®Â??Ë°•ÂÅø
    $scope.dragFrictionData = rsDynamicTags.var_object.DragFrictionData;
    $scope.collideModeData = rsDynamicTags.var_object.collideModeData;
    $scope.collideStrategyData = rsDynamicTags.var_object.collideStrategyData;
    $scope.endLoadTypeData = rsDynamicTags.var_object.endLoadTypeData;
    $scope.endLoadVersionData = rsDynamicTags.var_object.endLoadVersionData;
    $scope.CIOptions = langJsonData.peripheral_setting.var_object.diOptionsDictData;
    /* IOÂ?´ÂêçÈ?çÁΩÆ */
    $scope.aliasNameText = rsDynamicTags.info_messages[47];
    $scope.ctrlDIArr = langJsonData.IOlists.clDI;
    $scope.ctrlDOArr = langJsonData.IOlists.clDO;
    $scope.ctrlAIArr = langJsonData.IOlists.clAI;
    $scope.ctrlAOArr = langJsonData.IOlists.clAO;
    $scope.endDIArr = langJsonData.IOlists.toolDI;
    $scope.endDOArr = langJsonData.IOlists.toolDO;
    $scope.endAIArr = langJsonData.IOlists.toolAI;
    $scope.endAOArr = langJsonData.IOlists.toolAO;
    // IOÊª§Ê≥¢
    $scope.ioFilterParamData = rsDynamicTags.var_object.ioFilterParamData;
    // IOËæ?Â?∫Â§ç‰Ωç
    $scope.ioOutputParamData = rsDynamicTags.var_object.ioOutputParamData;
    let jointThird = {
        value: 30,
        flag: 0,
        flag1: 0,
        flag2: 0,
        flag3: 0,
    };
    let jointFifth = {
        value: 30,
        flag: 0,
        flag0: 0,
        flag1: 0,
        flag2: 0,
        flag3: 0,
    };
    let jointSix = {
        value: 30,
        flag: 0,
        flag1: 0,
        flag2: 0,
        flag3: 0,
    };
    /* Â?ùÂß?Â?? */
    // Â∑•Â?∑ÂùêÊ†?Âè?È?èÂ?ùÂß?Â??
    $scope.toolCoordParam = {
        select: {},
        renameFlag: false,
        rename: null,
        selectType: null,
        selectLoad: null,
        selectMount: null,
        calibrate: false,
        modifyToolType: null,
        modifyToolId: null,
        modifyLoad: null,
        modifyLaser: null,
        calMethod: null,
        toolFourRecord: [],
        toolFourRecordRes: null,
        toolSixRecord: [],
        toolSixRecordRes: null,
        toolCalculate: null,
        saveToolRes: null,
        laserSixRecord: [],
        laserSixRecordRes: null,
        laserEightRecord: [],
        laserEightRecordRes: null,
        laserFiveRecord: [],
        laserFiveResult: [
            {
                x: null,
                y: null,
                z: null
            },
            {
                x: null,
                y: null,
                z: null
            },
            {
                x: null,
                y: null,
                z: null
            },
            {
                x: null,
                y: null,
                z: null
            },
            {
                x: null,
                y: null,
                z: null
            }
        ],
        laserFiveRecordRes: null,
        laserThreeRecord: [],
        laserThreeRecordRes: null,
        laserCalculate: null,
        saveLaserRes: null,
        photoElectric: {
            deviceShow: false,
            coord: {},
            isDeviceConfig: false,
            isSetIO: false,
            xDI: $scope.CIOptions[1],
            yDI: $scope.CIOptions[0],
            isSetCenterP: false,
            offsetX: null,
            offsetY: null,
            offsetZ: null,
            isSetParam: false,
            isRunPro: false,
            calParShow: false,
            isCalParConfig: false,
            isSetCalPar: false,
            absOffset: null,
        },
        photoToolTCPRes: null,
        tabletTool: {
            show: false,
            isSetPoint: false,
        },
        tabletToolTCPRes: null,
        runFlag: -1,
        toolFourUrl1: null,
        toolFourUrl4: null,
        toolSixUrl1: null,
        toolSixUrl4: null,
        toolSixUrl5: null,
        toolSixUrl6: null,
        laserSixUrl1: null,
        laserSixUrl2: null,
        laserSixUrl3: null,
        laserSixUrl4: null,
        laserSixUrl5: null,
        laserSixUrl6: null,
        laserEightUrl1: null,
        laserEightUrl2: null,
        laserEightUrl3: null,
        laserEightUrl4: null,
        laserEightUrl5: null,
        laserEightUrl6: null,
        laserEightUrl7: null,
        laserEightUrl8: null,
        laserFiveUrl1: null,
        laserFiveUrl2: null,
        laserFiveUrl3: null,
        laserFiveUrl4: null,
        laserFiveUrl5: null,
        laserThreeUrl1: null,
        laserThreeUrl2: null,
        laserThreeUrl3: null,
        centerUrl: null,
        planeUrl: null,
    };
    // Â§?È?®Â∑•Â?∑TCPÂè?È?èÂ?ùÂß?Â??
    $scope.exToolCoordParam = {
        select: {},
        calibrate: false,
        tcpCalculate: null,
        tcpRecord: [],
        tcpRes1: null,
        tcpRes2: null,
        isTcf: false,
        tcfCalculate: null,
        tcfRecord: [],
        saveRes: null,
        tcpUrl: null,
        calTcpUrl: null,
        calXUrl: null,
        calZUrl: null,
    };
    // Â∑•‰ª∂ÂùêÊ†?Âè?È?èÂ?ùÂß?Â??
    $scope.wobjCoordParam = {
        select: {},
        reference: null,
        method: $scope.wobjMethodData[0],
        record: [],
        calculate: null,
        calUrl1: null,
        calUrl2: null,
        calUrl3: null,
        calUrl4: null,
    };
    // Ë¥?ËΩΩÔº?ËΩ®ËøπËæ®ËØ?Â??‰º†Ê??Â?®Ëæ®ËØ?Ôº?Âè?È?èÂ?ùÂß?Â??
    $scope.loadParam = {
        identType: '',
        select: {},
        renameFlag: false,
        rename: null,
        identShow: false,
        trajRecord: [],
        trajCalculate: null,
        trajIdentRes: null,
        slowMotionFile: '',
        excitationShow: false,
        excitationSpeed: 10,
        excitationPoint: 0,
        excitRecord: [],
        excitCalculate: null,
        excitIdentRes: null,
        sensorAutoIdent: 0,
        sensorTool: null,
        sensorApplyRes: null,
        ftWeight: null,
        ftLocation: {
            x: null,
            y: null,
            z: null,
        },
        maualRecord: [],
        sensorToolRes: null,
        ftCompute: {
            weight: null,
            x: null,
            y: null,
            z: null,
        },
        sensorComRes: null,
        sensorSaveRes: null,
        sampleTime: 300,
        sensorParamRes: null,
        autoPointFlag: false,
    };
    // Â?≥Ë??--ËΩØÈ?ê‰ΩçÂè?Ê?∞
    $scope.softLimitParam = {
        isSet: false,
        initFlag: false, // Â?ùÂß?Â??Âª∫Êª?Âù?Ê†?Âø?Ôº?Èª?ËÆ§falseÔº?false-Â?ùÂß?Â??Ôº?true-Â∑≤Â?ùÂß?Â??
        protect: 0,
        sliderData: {
            slider1: "",
            slider2: "",
            slider3: "",
            slider4: "",
            slider5: "",
            slider6: ""
        },
        minLimit: {
            j1: 0,
            j2: 0,
            j3: 0,
            j4: 0,
            j5: 0,
            j6: 0
        },
        maxLimit: {
            j1: 0,
            j2: 0,
            j3: 0,
            j4: 0,
            j5: 0,
            j6: 0
        },
        resumeRes: null,
        applyRes: null,
    };
    // Â?≥Ë??--Á¢∞Ê??Á≠?Á∫ßÂè?Ê?∞
    $scope.reboundFactorDict = [
        {
            id:"1"
        },
        {
            id:"2"
        },
        {
            id:"3"
        },
        {
            id:"4"
        },
        {
            id:"5"
        },
        {
            id:"6"
        },
        {
            id:"7"
        },
        {
            id:"8"
        },
        {
            id:"9"
        },
        {
            id:"10"
        }
    ];
    $scope.collisionParam = {
        mode: $scope.collideModeData[0],
        grade: {
            j1: $scope.collisionLevelData.j1[10],
            j2: $scope.collisionLevelData.j2[10],
            j3: $scope.collisionLevelData.j3[10],
            j4: $scope.collisionLevelData.j4[10],
            j5: $scope.collisionLevelData.j5[10],
            j6: $scope.collisionLevelData.j6[10]
        },
        custom: {
            j1: null,
            j2: null,
            j3: null,
            j4: null,
            j5: null,
            j6: null
        },
        modeRes: null,
        strategy: $scope.collideStrategyData[0],
        strategyRes: null,
        time: '1000',
        distance: '150',
        speed: '50',
        rebound: {
            j1: $scope.reboundFactorDict[4],
            j2: $scope.reboundFactorDict[4],
            j3: $scope.reboundFactorDict[4],
            j4: $scope.reboundFactorDict[4],
            j5: $scope.reboundFactorDict[4],
            j6: $scope.reboundFactorDict[4]
        },
        detect: 0,
        drag: 0,
        impulse: 0,
    };
    // Â?≥Ë??--Ê?©Ê?¶Â??Ë°•ÂÅø
    $scope.frictionParam = {
        switch: 0,
        free: {
            j1: null,
            j2: null,
            j3: null,
            j4: null,
            j5: null,
            j6: null
        },
        res: null,
    };
    // Â?≥Ë??--Ê??Â?®Â??Ë°•ÂÅø
    $scope.dragCompParam = {
        flag: $scope.dragFrictionData[0],
        adjustFlag: $scope.dragFrictionData[0],
        coefficient: {},
        res: null,
    };
    //Á?¥Á∫øÈΩøÊù°ÂØºËΩ®Âè?Ê?∞
    $scope.linRailCollision = [
        {
            id: "100",
            name: $scope.dragFrictionData[0].name
        },
        {
            id: "1",
            name: "Level1"
        },
        {
            id: "2",
            name: "Level2"
        },
        {
            id: "3",
            name: "Level3"
        },
        {
            id: "4",
            name: "Level4"
        },
        {
            id: "5",
            name: "Level5"
        },
        {
            id: "6",
            name: "Level6"
        },
        {
            id: "7",
            name: "Level7"
        },
        {
            id: "8",
            name: "Level8"
        },
        {
            id: "9",
            name: "Level9"
        },
        {
            id: "10",
            name: "Level10"
        }
    ]
    $scope.linearRailParam = {
        linRailCollisionEnable: 0,
        collisionLevel: $scope.linRailCollision[0],
        gearRadius: 0,
        sliderMass: 0,
        modeRes: null,
    }
    // ËΩØÈ?ê‰ΩçÈª?ËÆ§Ê??Â§ßË??Â?¥
    if (g_robotTypeCode == 1 || g_robotTypeCode == 2 || g_robotTypeCode == 906) {    // FR3„?ÅFR3(C)
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -150;
        $scope.j3SoftLimitRangeMax = 150;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 3) {    // FR3 V6.0(Mirror)
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -85;
        $scope.j2SoftLimitRangeMax = 265;
        $scope.j3SoftLimitRangeMin = -150;
        $scope.j3SoftLimitRangeMax = 150;
        $scope.j4SoftLimitRangeMin = -85;
        $scope.j4SoftLimitRangeMax = 265;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotType.type == 6) {    // ART3(1,5,7Â?≥Ë??Ê?†Á°¨È?ê‰Ωç)
        $scope.j1SoftLimitRangeMin = -360;
        $scope.j1SoftLimitRangeMax = 360;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -150;
        $scope.j3SoftLimitRangeMax = 150;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -360;
        $scope.j5SoftLimitRangeMax = 360;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotType.type == 7) {     // ART5(1,5,7Â?≥Ë??Ê?†Á°¨È?ê‰Ωç)
        $scope.j1SoftLimitRangeMin = -360;
        $scope.j1SoftLimitRangeMax = 360;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -160;
        $scope.j3SoftLimitRangeMax = 160;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -360;
        $scope.j5SoftLimitRangeMax = 360;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotTypeCode == 702) {    // FR3WML
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -163;
        $scope.j3SoftLimitRangeMax = 163;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotTypeCode == 703) {    // FR3WMS
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -150;
        $scope.j3SoftLimitRangeMax = 150;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotTypeCode == 802) {    // FR5WM
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -135;
        $scope.j3SoftLimitRangeMax = 135;
        $scope.j4SoftLimitRangeMin = -175;
        $scope.j4SoftLimitRangeMax = 175;
        $scope.j5SoftLimitRangeMin = -85;
        $scope.j5SoftLimitRangeMax = 265;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 803) {    // FR5L
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -170;
        $scope.j3SoftLimitRangeMax = 170;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotTypeCode == 804) {    // FR5C
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -160;
        $scope.j3SoftLimitRangeMax = 160;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -360;
        $scope.j6SoftLimitRangeMax = 360;
    } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904) {    // FR3MT || FR3C
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -150;
        $scope.j3SoftLimitRangeMax = 150;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = 0;
        $scope.j5SoftLimitRangeMax = 355;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 902) {    // FR10YD
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -160;
        $scope.j3SoftLimitRangeMax = 160;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = 0;
        $scope.j5SoftLimitRangeMax = 355;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 905) {    // FR30L
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -240;
        $scope.j2SoftLimitRangeMax = 60;
        $scope.j3SoftLimitRangeMin = -160;
        $scope.j3SoftLimitRangeMax = 160;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 907) {    // ART3-R6-XM
        $scope.j1SoftLimitRangeMin = -5;
        $scope.j1SoftLimitRangeMax = 350;
        $scope.j2SoftLimitRangeMin = -40;
        $scope.j2SoftLimitRangeMax = 90;
        $scope.j3SoftLimitRangeMin = -90;
        $scope.j3SoftLimitRangeMax = 90;
        $scope.j4SoftLimitRangeMin = -175;
        $scope.j4SoftLimitRangeMax = 175;
        $scope.j5SoftLimitRangeMin = -95;
        $scope.j5SoftLimitRangeMax = 95;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    } else if (g_robotTypeCode == 908) {    // FC3-R6-B
        $scope.j1SoftLimitRangeMin = -165;
        $scope.j1SoftLimitRangeMax = 165;
        $scope.j2SoftLimitRangeMin = -180;
        $scope.j2SoftLimitRangeMax = 0;
        $scope.j3SoftLimitRangeMin = 0;
        $scope.j3SoftLimitRangeMax = 180;
        $scope.j4SoftLimitRangeMin = -90;
        $scope.j4SoftLimitRangeMax = 90;
        $scope.j5SoftLimitRangeMin = 0;
        $scope.j5SoftLimitRangeMax = 180;
        $scope.j6SoftLimitRangeMin = -165;
        $scope.j6SoftLimitRangeMax = 165;
    } else {                                 // FR5 & FR10 & FR16 & FR20 & FR30
        $scope.j1SoftLimitRangeMin = -175;
        $scope.j1SoftLimitRangeMax = 175;
        $scope.j2SoftLimitRangeMin = -265;
        $scope.j2SoftLimitRangeMax = 85;
        $scope.j3SoftLimitRangeMin = -160;
        $scope.j3SoftLimitRangeMax = 160;
        $scope.j4SoftLimitRangeMin = -265;
        $scope.j4SoftLimitRangeMax = 85;
        $scope.j5SoftLimitRangeMin = -175;
        $scope.j5SoftLimitRangeMax = 175;
        $scope.j6SoftLimitRangeMin = -175;
        $scope.j6SoftLimitRangeMax = 175;
    }
    // IOËÆæÁΩÆ--DI
    $scope.diParam = {
        configerableInput: {
            di8: $scope.DICfgData[1].value,
            di9: $scope.DICfgData[1].value,
            di10: $scope.DICfgData[1].value,
            di11: $scope.DICfgData[1].value,
            di12: $scope.DICfgData[1].value,
            di13: $scope.DICfgData[1].value,
            di14: $scope.DICfgData[1].value,
            di15: $scope.DICfgData[1].value,
        },
        configRes: null,
        configerableInputValid: {
            di8: $scope.digitvalid[0],
            di9: $scope.digitvalid[0],
            di10: $scope.digitvalid[0],
            di11: $scope.digitvalid[0],
            di12: $scope.digitvalid[0],
            di13: $scope.digitvalid[0],
            di14: $scope.digitvalid[0],
            di15: $scope.digitvalid[0],
        },
        validRes: null,
        generalInputValid: {
            di0: $scope.digitvalid[0],
            di1: $scope.digitvalid[0],
            di2: $scope.digitvalid[0],
            di3: $scope.digitvalid[0],
            di4: $scope.digitvalid[0],
            di5: $scope.digitvalid[0],
            di6: $scope.digitvalid[0],
            di7: $scope.digitvalid[0],
        },
        generalRes: null,
        endInput: {
            di1: $scope.EndDICfgData[1].value,
            di2: $scope.EndDICfgData[1].value,
        },
        endInputRes: null,
        endValid: {
            di1: $scope.digitvalid[0],
            di2: $scope.digitvalid[0],
        },
        endValidRes: null,
    };
    const robotDIList = ['di8', 'di9', 'di10', 'di11', 'di12', 'di13', 'di14', 'di15'];
    const robotEndDIList = ['di1', 'di2'];
    // IOËÆæÁΩÆ--DI
    $scope.doParam = {
        configerableOut: {
            do8: $scope.DOCfgData[1].value,
            do9: $scope.DOCfgData[1].value,
            do10: $scope.DOCfgData[1].value,
            do11: $scope.DOCfgData[1].value,
            do12: $scope.DOCfgData[1].value,
            do13: $scope.DOCfgData[1].value,
            do14: $scope.DOCfgData[1].value,
            do15: $scope.DOCfgData[1].value
        },
        configRes: null,
        configerableOutValid: {
            do8: $scope.digitvalid[0],
            do9: $scope.digitvalid[0],
            do10: $scope.digitvalid[0],
            do11: $scope.digitvalid[0],
            do12: $scope.digitvalid[0],
            do13: $scope.digitvalid[0],
            do14: $scope.digitvalid[0],
            do15: $scope.digitvalid[0]
        },
        validRes: null,
        generalOutValid: {
            do0: $scope.digitvalid[0],
            do1: $scope.digitvalid[0],
            do2: $scope.digitvalid[0],
            do3: $scope.digitvalid[0],
            do4: $scope.digitvalid[0],
            do5: $scope.digitvalid[0],
            do6: $scope.digitvalid[0],
            do7: $scope.digitvalid[0]
        },
        generalRes: null,
        ctrlPowerValid: {
            do0: $scope.controlBoxDoData[0],
            do1: $scope.controlBoxDoData[0],
            do2: $scope.controlBoxDoData[0],
            do3: $scope.controlBoxDoData[0],
            do4: $scope.controlBoxDoData[0],
            do5: $scope.controlBoxDoData[0],
            do6: $scope.controlBoxDoData[0],
            do7: $scope.controlBoxDoData[0],
            co0: $scope.controlBoxDoData[0],
            co1: $scope.controlBoxDoData[0],
            co2: $scope.controlBoxDoData[0],
            co3: $scope.controlBoxDoData[0],
            co4: $scope.controlBoxDoData[0],
            co5: $scope.controlBoxDoData[0],
            co6: $scope.controlBoxDoData[0],
            co7: $scope.controlBoxDoData[0],
        },
        powerRes: null,
    };
    const robotDOList = ['do8', 'do9', 'do10', 'do11', 'do12', 'do13', 'do14', 'do15'];
    // IO--Â?´ÂêçÈ?çÁΩÆ
    $scope.aliasParam = {
        ctrlBox: {
            di: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            do: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ai: ["", ""],
            ao: ["", ""]
        },
        endEff: {
            di: ["", ""],
            do: ["", ""],
            ai: [""],
            ao: [""]
        },
        res: null
    };
    // IOÊª§Ê≥¢
    $scope.ioFilterParam = {
        controlDi: 0,
        toolDi: 0,
        controlAi0: 0,
        controlAi1: 0,
        toolAi0: 0,
        boxDi: 0,
        auxDI: 0,
        auxAi0: 0,
        auxAi1: 0,
        auxAi2: 0,
        auxAi3: 0,
        smartDi: 0,
        type: $scope.ioFilterParamData[0],
        value: null,
        res: null,
    };
    // IOËæ?Â?∫Â§ç‰Ωç
    $scope.ioOutputParam = {
        controlDo: null,
        controlDoReload: null,
        controlAo: null,
        controlAoReload: null,
        endPlateDo: null,
        endPlateDoReload: null,
        endPlateAo: null,
        endPlateAoReload: null,
        auxDo: null,
        auxDoReload: null,
        auxAo: null,
        auxAoReload: null,
        smartDo: null,
        smartDoReload: null,
        type: $scope.ioOutputParamData[0],
        value: $scope.outputResetData[0],
        reload: $scope.outputWhetherData[0],
        res: null,
    };
    // ‰Ω?‰∏?Â??Á?π
    $scope.workHomeParam = {
        isSet: 0,
        setRes: null,
        moveRes: null,
        point: {
            j1: "0",
            j2: "0",
            j3: "0",
            j4: "0",
            j5: "0",
            j6: "0"
        },
        diList: [
            {
                name: "CI0",
                value: '8',
                disable: false
            },
            {
                name: "CI1",
                value: '9',
                disable: false
            },
            {
                name: "CI2",
                value: '10',
                disable: false
            },
            {
                name: "CI3",
                value: '11',
                disable: false
            },
            {
                name: "CI4",
                value: '12',
                disable: false
            },
            {
                name: "CI5",
                value: '13',
                disable: false
            },
            {
                name: "CI6",
                value: '14',
                disable: false
            },
            {
                name: "CI7",
                value: '15',
                disable: false
            }
        ],
        endDiList: [
            {
                name: "DI0",
                value: '0',
                disable: false
            },
            {
                name: "DI1",
                value: '1',
                disable: false
            }
        ],
        signal: null,
        signalRes: null,
        endSignal: null,
        endSignalRes: null,
    };
    // Â?§Ê?≠Â≠êÈ°µÈù¢Ê?ØÂê¶Ê??Êù?È?ê
    $scope.userAuthData = getUserAuthority();

    /* Ë?∑Âè?‰∏?Á≥ªÂ??Ê?∞ÊçÆÂ?ùÂß?Â??È°µÈù¢ */
    getExToolCoordData();
    getToolCoordData();
    getWobjCoordData();
    // ËØªÂè?È?çÁΩÆÊ??‰ª∂Â?ùÂß?Â??È°µÈù¢Â??ÂÆπ
    getRobotdata();
    getDynamicData('init');
    /* ./Ë?∑Âè?‰∏?Á≥ªÂ??Ê?∞ÊçÆÂ?ùÂß?Â??È°µÈù¢ */

    // Á??Âê¨SDKÊ?ç‰Ω?ÂùêÊ†?Á≥ªÊ?∞ÊçÆË?™Â?®Ê?¥Ê?∞
    document.getElementById('robotSetting').addEventListener('1256', e => {
        let typeName = JSON.parse(e.detail).type_name;

        switch (typeName) {
            case 'ToolCoord':
                getToolCoordData();
                break;
            case 'WObjCoord':
                getWobjCoordData();
                break;
            case 'ExtToolCoord':
                getExToolCoordData();
                break;
            case 'PayLoad':
                getEndLoadData();
                break;
            default:
                break;
        }
    })

    /* Ë?∑Âè?Ê?∫Â?®‰∫∫ÂΩ?Â?çÈ?çÁΩÆ */
    function getRobotdata() {
        let getRobotCfgCmd = {
            cmd: "get_robot_cfg",
        };
        dataFactory.getData(getRobotCfgCmd).then((data) => {
            /* Â?≥Ë??--ËΩØÈ?ê‰Ωç */
            // ËΩØÈ?ê‰ΩçË??Â?¥ËÆæÁΩÆÂ?º
            if (g_robotTypeCode == 1 || g_robotTypeCode == 2 || g_robotTypeCode == 906) {
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr3_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr3_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 3) {    // FR3 V6.0(Mirror)
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.fr3_left_j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.fr3_left_j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr3_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr3_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.fr3_left_j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.fr3_left_j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotType.type == 6) {
                $scope.softLimitParam.maxLimit.j1 = ~~data.art_j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.art_j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr3_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr3_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.art_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.art_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.art_j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.art_j6_min_joint_limit;
            } else if (g_robotType.type == 7) {
                $scope.softLimitParam.maxLimit.j1 = ~~data.art_j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.art_j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.art_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.art_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.art_j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.art_j6_min_joint_limit;
            } else if (g_robotTypeCode == 802) {
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.wm_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.wm_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.wm_j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.wm_j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.wm_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.wm_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 803) { // FR5L
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr5l_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr5l_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 702) { // FR3WML
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.fr3wml_j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.fr3wml_j6_min_joint_limit;
            } else if (g_robotTypeCode == 703) { // FR3WMS 
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr3_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr3_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.fr3wml_j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.fr3wml_j6_min_joint_limit;
            } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904) { // FR3MT || FR3C
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fr3_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fr3_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.mt3_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.mt3_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 902) {
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.yd10_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.yd10_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 905) {                  // FR30L
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.fr30l_j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.fr30l_j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 907) {                  // ART3-R6-XM
                $scope.softLimitParam.maxLimit.j1 = ~~data.m001_j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.m001_j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.m001_j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.m001_j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.m001_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.m001_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.wm_j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.wm_j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.m001_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.m001_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            } else if (g_robotTypeCode == 908) {                  // FC3-R6-B
                $scope.softLimitParam.maxLimit.j1 = ~~data.fc3b_j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.fc3b_j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.fc3b_j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.fc3b_j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.fc3b_j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.fc3b_j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.fc3b_j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.fc3b_j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.fc3b_j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.fc3b_j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.fc3b_j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.fc3b_j6_min_joint_limit;
            } else {
                $scope.softLimitParam.maxLimit.j1 = ~~data.j1_max_joint_limit;
                $scope.softLimitParam.minLimit.j1 = ~~data.j1_min_joint_limit;
                $scope.softLimitParam.maxLimit.j2 = ~~data.j2_max_joint_limit;
                $scope.softLimitParam.minLimit.j2 = ~~data.j2_min_joint_limit;
                $scope.softLimitParam.maxLimit.j3 = ~~data.j3_max_joint_limit;
                $scope.softLimitParam.minLimit.j3 = ~~data.j3_min_joint_limit;
                $scope.softLimitParam.maxLimit.j4 = ~~data.j4_max_joint_limit;
                $scope.softLimitParam.minLimit.j4 = ~~data.j4_min_joint_limit;
                $scope.softLimitParam.maxLimit.j5 = ~~data.j5_max_joint_limit;
                $scope.softLimitParam.minLimit.j5 = ~~data.j5_min_joint_limit;
                $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
            }
            // Ê†πÊçÆÈ?ê‰ΩçÊ®°ÂºèÊ?πÂè?joint6ËΩØÈ?ê‰Ωç 0-Â?∫ÂÆ?È?ê‰Ωç 1-Ê?©Â±?È?ê‰Ωç¬±360
            $scope.rot360Type = ~~data.rot360_joint6rottype;
            if (g_robotTypeCode == 2 || g_robotTypeCode == 103 || g_robotTypeCode == 202 || g_robotTypeCode == 302 || g_robotTypeCode == 402 || g_robotTypeCode == 803 || g_robotTypeCode == 804) {
                if ($scope.rot360Type == 1) {
                    $scope.softLimitParam.maxLimit.j6 = ~~data.j6_rot360_max_joint_limit;
                    $scope.softLimitParam.minLimit.j6 = ~~data.j6_rot360_min_joint_limit;
                    $scope.j6SoftLimitRangeMin = -360;
                    $scope.j6SoftLimitRangeMax = 360;
                } else {
                    $scope.softLimitParam.maxLimit.j6 = ~~data.j6_max_joint_limit;
                    $scope.softLimitParam.minLimit.j6 = ~~data.j6_min_joint_limit;
                }
            } 
            // Â?≥Ë??ËΩØÈ?ê‰Ωç‰øùÊ?§Âº?Â?≥
            $scope.softLimitParam.protect = parseInt(data.soft_limit_protect_flag);
            // Â?≥Ë??ËΩØÈ?ê‰ΩçÈ?çÊ?∞Â??Âª∫Êª?Âù?
            createNewSlider();
            /* ./Â?≥Ë??--ËΩØÈ?ê‰Ωç */
            /* Â?≥Ë??--Á¢∞Ê??Á≠?Á∫ß */
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ßÁ±ªÂ??
            $scope.collisionParam.mode = $scope.collideModeData[~~data.collision_level_type];
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Ë?™ÂÆ?‰π?
            if ($scope.collisionParam.mode.id == 1) {
                $scope.collisionParam.custom.j1 = parseFloat(data.j1_collision_level*10).toFixed(3);
                $scope.collisionParam.custom.j2 = parseFloat(data.j2_collision_level*10).toFixed(3);
                $scope.collisionParam.custom.j3 = parseFloat(data.j3_collision_level*10).toFixed(3);
                $scope.collisionParam.custom.j4 = parseFloat(data.j4_collision_level*10).toFixed(3);
                $scope.collisionParam.custom.j5 = parseFloat(data.j5_collision_level*10).toFixed(3);
                $scope.collisionParam.custom.j6 = parseFloat(data.j6_collision_level*10).toFixed(3);
                $scope.collisionParam.grade.j1 = $scope.collisionLevelData.j1[4];
                $scope.collisionParam.grade.j2 = $scope.collisionLevelData.j2[4];
                $scope.collisionParam.grade.j3 = $scope.collisionLevelData.j3[4];
                $scope.collisionParam.grade.j4 = $scope.collisionLevelData.j4[4];
                $scope.collisionParam.grade.j5 = $scope.collisionLevelData.j5[4];
                $scope.collisionParam.grade.j6 = $scope.collisionLevelData.j6[4];
            } else { // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Ê†?Â??Á≠?Á∫ß
                if (~~data.j1_collision_level == 100) {
                    $scope.collisionParam.grade.j1 = $scope.collisionLevelData.j1[10];
                } else {
                    $scope.collisionParam.grade.j1 = $scope.collisionLevelData.j1[~~(data.j1_collision_level - 1)];
                }
                if (~~data.j2_collision_level == 100) {
                    $scope.collisionParam.grade.j2 = $scope.collisionLevelData.j2[10];
                } else {
                    $scope.collisionParam.grade.j2 = $scope.collisionLevelData.j2[~~(data.j2_collision_level - 1)];
                }
                if (~~data.j3_collision_level == 100) {
                    $scope.collisionParam.grade.j3 = $scope.collisionLevelData.j3[10];
                } else {
                    $scope.collisionParam.grade.j3 = $scope.collisionLevelData.j3[~~(data.j3_collision_level - 1)];
                }
                if (~~data.j4_collision_level == 100) {
                    $scope.collisionParam.grade.j4 = $scope.collisionLevelData.j4[10];
                } else {
                    $scope.collisionParam.grade.j4 = $scope.collisionLevelData.j4[~~(data.j4_collision_level - 1)];
                }
                if (~~data.j5_collision_level == 100) {
                    $scope.collisionParam.grade.j5 = $scope.collisionLevelData.j5[10];
                } else {
                    $scope.collisionParam.grade.j5 = $scope.collisionLevelData.j5[~~(data.j5_collision_level - 1)];
                }
                if (~~data.j6_collision_level == 100) {
                    $scope.collisionParam.grade.j6 = $scope.collisionLevelData.j6[10];
                } else {
                    $scope.collisionParam.grade.j6 = $scope.collisionLevelData.j6[~~(data.j6_collision_level - 1)];
                }
                $scope.collisionParam.custom.j1 = 50;
                $scope.collisionParam.custom.j2 = 50;
                $scope.collisionParam.custom.j3 = 50;
                $scope.collisionParam.custom.j4 = 50;
                $scope.collisionParam.custom.j5 = 50;
                $scope.collisionParam.custom.j6 = 50;
            }
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Á¢∞Ê??Á≠?Á?•
            $scope.collisionParam.strategy = $scope.collideStrategyData[~~(data.collision_pause)];
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Á¢∞Ê??Â??ÂºπÊ®°ÂºèÂÆ?Â?®Ê?∂È?¥
            $scope.collisionParam.time = ~~data.collision_safetime;
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Á¢∞Ê??Â??ÂºπÊ®°ÂºèÂÆ?Â?®Ë∑ùÁ¶ª
            $scope.collisionParam.distance = ~~data.collision_safedistance;
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Á¢∞Ê??Â??ÂºπÊ®°ÂºèÂÆ?Â?®È??Â∫¶
            $scope.collisionParam.speed = ~~data.collision_safespeed;
            // Â?≥Ë??Á¢∞Ê??Á≠?Á∫ß‚??‚??Á¢∞Ê??Â??ÂºπÊ®°ÂºèJ1~J6ÂÆ?Â?®Á≥ªÊ?∞
            $scope.collisionParam.rebound.j1 = $scope.reboundFactorDict[~~(data.collision_safemargin1) - 1];
            $scope.collisionParam.rebound.j2 = $scope.reboundFactorDict[~~(data.collision_safemargin2) - 1];
            $scope.collisionParam.rebound.j3 = $scope.reboundFactorDict[~~(data.collision_safemargin3) - 1];
            $scope.collisionParam.rebound.j4 = $scope.reboundFactorDict[~~(data.collision_safemargin4) - 1];
            $scope.collisionParam.rebound.j5 = $scope.reboundFactorDict[~~(data.collision_safemargin5) - 1];
            $scope.collisionParam.rebound.j6 = $scope.reboundFactorDict[~~(data.collision_safemargin6) - 1];
            // Èù?Ê?Å‰∏?Á¢∞Ê??Ê£?Êµ?Âº?Â?≥
            $scope.collisionParam.detect = parseInt(~~data.collision_static);
            // Ë?∑Âè?Ê??Â?®Â?çÂ??Á?©Ê£?Êµ?
            $scope.collisionParam.drag = parseInt(~~data.drag_protect_enable);
            // Ë?∑Âè?Á?¥Á∫øÈΩøÊù°ÂØºËΩ®Á¢∞Ê??Ê£?Êµ?
            $scope.linearRailParam.linRailCollisionEnable = ~~data.linear_rail_collision_flag;
            $scope.linearRailParam.collisionLevel = $scope.linRailCollision.find(item => item.id == ~~data.linear_rail_collision_level);
            $scope.linearRailParam.gearRadius = ~~data.linear_rail_gear_radius;
            $scope.linearRailParam.sliderMass = ~~data.linear_rail_slider_mass;
            /* ./Â?≥Ë??--Á¢∞Ê??Á≠?Á∫ß */
            /* Â?≥Ë??--Ê?©Ê?¶Â??Ë°•ÂÅø */
            $scope.frictionParam.toggle = parseInt(~~data.fric_compensation);
            $scope.frictionParam.free.j1 = parseFloat(data.fric_value_free_j1).toFixed(3);
            $scope.frictionParam.free.j2 = parseFloat(data.fric_value_free_j2).toFixed(3);
            $scope.frictionParam.free.j3 = parseFloat(data.fric_value_free_j3).toFixed(3);
            $scope.frictionParam.free.j4 = parseFloat(data.fric_value_free_j4).toFixed(3);
            $scope.frictionParam.free.j5 = parseFloat(data.fric_value_free_j5).toFixed(3);
            $scope.frictionParam.free.j6 = parseFloat(data.fric_value_free_j6).toFixed(3);
            /* ./Â?≥Ë??--Ê?©Ê?¶Â??Ë°•ÂÅø */
            // DIÈ?çÁΩÆ--ÂèØÈ?çÁΩÆËæ?Â?•Ôº?CI0~CI7Ôº?Â??Ë?ΩÂ?º
            $scope.diParam.configerableInput.di8 = ~~data.ctl_di8_config + "";
            $scope.diParam.configerableInput.di9 = ~~data.ctl_di9_config + "";
            $scope.diParam.configerableInput.di10 = ~~data.ctl_di10_config + "";
            $scope.diParam.configerableInput.di11 = ~~data.ctl_di11_config + "";
            $scope.diParam.configerableInput.di12 = ~~data.ctl_di12_config + "";
            $scope.diParam.configerableInput.di13 = ~~data.ctl_di13_config + "";
            $scope.diParam.configerableInput.di14 = ~~data.ctl_di14_config + "";
            $scope.diParam.configerableInput.di15 = ~~data.ctl_di15_config + "";
            // DIÈ?çÁΩÆ--ÂèØÈ?çÁΩÆËæ?Â?•Ôº?CI0~CI7Ôº?Ê??Ê??Á?∂Ê?Å
            $scope.diParam.configerableInputValid.di8 = $scope.digitvalid[~~data.ctl_di8_level];
            $scope.diParam.configerableInputValid.di9 = $scope.digitvalid[~~data.ctl_di9_level];
            $scope.diParam.configerableInputValid.di10 = $scope.digitvalid[~~data.ctl_di10_level];
            $scope.diParam.configerableInputValid.di11 = $scope.digitvalid[~~data.ctl_di11_level];
            $scope.diParam.configerableInputValid.di12 = $scope.digitvalid[~~data.ctl_di12_level];
            $scope.diParam.configerableInputValid.di13 = $scope.digitvalid[~~data.ctl_di13_level];
            $scope.diParam.configerableInputValid.di14 = $scope.digitvalid[~~data.ctl_di14_level];
            $scope.diParam.configerableInputValid.di15 = $scope.digitvalid[~~data.ctl_di15_level];
            // DIÈ?çÁΩÆ--È??Á?®Ëæ?Â?•Ôº?DI0~DI7Ôº?Ê??Ê??Á?∂Ê?Å
            $scope.diParam.generalInputValid.di0 = $scope.digitvalid[~~data.ctl_di0_level];
            $scope.diParam.generalInputValid.di1 = $scope.digitvalid[~~data.ctl_di1_level];
            $scope.diParam.generalInputValid.di2 = $scope.digitvalid[~~data.ctl_di2_level];
            $scope.diParam.generalInputValid.di3 = $scope.digitvalid[~~data.ctl_di3_level];
            $scope.diParam.generalInputValid.di4 = $scope.digitvalid[~~data.ctl_di4_level];
            $scope.diParam.generalInputValid.di5 = $scope.digitvalid[~~data.ctl_di5_level];
            $scope.diParam.generalInputValid.di6 = $scope.digitvalid[~~data.ctl_di6_level];
            $scope.diParam.generalInputValid.di7 = $scope.digitvalid[~~data.ctl_di7_level];
            // DIÈ?çÁΩÆ--Ê?´Á´ØËæ?Â?•Ôº?End DI0~End DI1Ôº?Â??Ë?ΩÂ?º
            $scope.diParam.endInput.di1 = ~~data.tool_di1_config + "";
            $scope.diParam.endInput.di2 = ~~data.tool_di2_config + "";
            // DIÈ?çÁΩÆ--Ê?´Á´ØËæ?Â?•Ôº?End DI0~End DI1Ôº?Ê??Ê??Á?∂Ê?Å
            $scope.diParam.endValid.di1 = $scope.digitvalid[~~data.tool_di1_level];
            $scope.diParam.endValid.di2 = $scope.digitvalid[~~data.tool_di2_level];
            // Â∑•Â?∑ÂùêÊ†?
            robotDIList.forEach((item, index) => {
                if ($scope.diParam.configerableInput[item] == "18") {
                    $scope.toolCoordParam.photoElectric.xDI = "18";
                }
                if ($scope.diParam.configerableInput[item] == "19") {
                    $scope.toolCoordParam.photoElectric.yDI = "19";
                }
            });
            robotEndDIList.forEach((item, index) => {
                if ($scope.diParam.endInput[item] == "14") {
                    $scope.toolCoordParam.photoElectric.xDI = "14";
                }
                if ($scope.diParam.endInput[item] == "15") {
                    $scope.toolCoordParam.photoElectric.yDI = "15";
                }
            })
            if ($scope.toolCoordParam.photoElectric.xDI.id != -1 && $scope.toolCoordParam.photoElectric.yDI.id != -1) {
                $scope.toolCoordParam.photoElectric.isSetIO = true;
            }
            // Êø?Â??Ê†?ÂÆ?ËÆæÂ§?ÂùêÊ†?
            $scope.toolCoordParam.photoElectric.coord.x = data.tcp_coord_x;
            $scope.toolCoordParam.photoElectric.coord.y = data.tcp_coord_y;
            $scope.toolCoordParam.photoElectric.coord.z = data.tcp_coord_z;
            $scope.toolCoordParam.photoElectric.coord.rx = data.tcp_coord_a;
            $scope.toolCoordParam.photoElectric.coord.ry = data.tcp_coord_b;
            $scope.toolCoordParam.photoElectric.coord.rz = data.tcp_coord_c;
            if (data.tcp_coord_x == 0 && data.tcp_coord_y == 0 && data.tcp_coord_z == 0 && data.tcp_coord_a == 0 && data.tcp_coord_b == 0 && data.tcp_coord_c == 0) {
                $scope.toolCoordParam.photoElectric.isDeviceConfig = false;
            } else {
                $scope.toolCoordParam.photoElectric.isDeviceConfig = true;
            }
            // DOÈ?çÁΩÆ--ÂèØÈ?çÁΩÆËæ?Â?∫Ôº?CO0~CO7Ôº?Â??Ë?ΩÂ?º
            $scope.doParam.configerableOut.do8 = ~~data.ctl_do8_config + "";
            $scope.doParam.configerableOut.do9 = ~~data.ctl_do9_config + "";
            $scope.doParam.configerableOut.do10 = ~~data.ctl_do10_config + "";
            $scope.doParam.configerableOut.do11 = ~~data.ctl_do11_config + "";
            $scope.doParam.configerableOut.do12 = ~~data.ctl_do12_config + "";
            $scope.doParam.configerableOut.do13 = ~~data.ctl_do13_config + "";
            $scope.doParam.configerableOut.do14 = ~~data.ctl_do14_config + "";
            $scope.doParam.configerableOut.do15 = ~~data.ctl_do15_config + "";
            // DOÈ?çÁΩÆ--ÂèØÈ?çÁΩÆËæ?Â?∫Ôº?CO0~CO7Ôº?Ê??Ê??Á?∂Ê?Å
            $scope.doParam.configerableOutValid.do8 = $scope.digitvalid[~~data.ctl_do8_level];
            $scope.doParam.configerableOutValid.do9 = $scope.digitvalid[~~data.ctl_do9_level];
            $scope.doParam.configerableOutValid.do10 = $scope.digitvalid[~~data.ctl_do10_level];
            $scope.doParam.configerableOutValid.do11 = $scope.digitvalid[~~data.ctl_do11_level];
            $scope.doParam.configerableOutValid.do12 = $scope.digitvalid[~~data.ctl_do12_level];
            $scope.doParam.configerableOutValid.do13 = $scope.digitvalid[~~data.ctl_do13_level];
            $scope.doParam.configerableOutValid.do14 = $scope.digitvalid[~~data.ctl_do14_level];
            $scope.doParam.configerableOutValid.do15 = $scope.digitvalid[~~data.ctl_do15_level];
            // DOÈ?çÁΩÆ--È??Á?®Ëæ?Â?∫Ôº?DO0~DO7Ôº?Ê??Ê??Á?∂Ê?Å
            $scope.doParam.generalOutValid.do0 = $scope.digitvalid[~~data.ctl_do0_level];
            $scope.doParam.generalOutValid.do1 = $scope.digitvalid[~~data.ctl_do1_level];
            $scope.doParam.generalOutValid.do2 = $scope.digitvalid[~~data.ctl_do2_level];
            $scope.doParam.generalOutValid.do3 = $scope.digitvalid[~~data.ctl_do3_level];
            $scope.doParam.generalOutValid.do4 = $scope.digitvalid[~~data.ctl_do4_level];
            $scope.doParam.generalOutValid.do5 = $scope.digitvalid[~~data.ctl_do5_level];
            $scope.doParam.generalOutValid.do6 = $scope.digitvalid[~~data.ctl_do6_level];
            $scope.doParam.generalOutValid.do7 = $scope.digitvalid[~~data.ctl_do7_level];
            // Ë?∑Âè?IOÂ?´Âêç
            getIOAliasData();
            // IOÊª§Ê≥¢
            $scope.ioFilterParam.controlDi = ~~data.ctl_di_filtertime;
            $scope.ioFilterParam.toolDi = ~~data.axle_di_filtertime;
            $scope.ioFilterParam.controlAi0 = ~~data.ctl_ai0_filtertime;
            $scope.ioFilterParam.controlAi1 = ~~data.ctl_ai1_filtertime;
            $scope.ioFilterParam.toolAi0 = ~~data.axle_ai0_filtertime;
            $scope.ioFilterParam.boxDi = ~~data.tb_di_filtertime;
            $scope.ioFilterParam.auxDI = ~~data.ext_di_filtertime;
            $scope.ioFilterParam.auxAi0 = ~~data.ext_ai0_filtertime;
            $scope.ioFilterParam.auxAi1 = ~~data.ext_ai1_filtertime;
            $scope.ioFilterParam.auxAi2 = ~~data.ext_ai2_filtertime;
            $scope.ioFilterParam.auxAi3 = ~~data.ext_ai3_filtertime;
            $scope.ioFilterParam.smartDi = ~~data.smart_tool_di_filtertime;
            /* Ëæ?Â?∫Â§ç‰ΩçÈ?çÁΩÆÁ??Èù¢È?çÁΩÆÈ°πË?∑Âè? */
            $scope.ioOutputParam.controlDo = $scope.outputResetData.find(item => item.id == ~~data.ctl_do_output_reset);
            $scope.ioOutputParam.controlAo = $scope.outputResetData.find(item => item.id == ~~data.ctl_ao_output_reset);
            $scope.ioOutputParam.endPlateDo = $scope.outputResetData.find(item => item.id == ~~data.axle_do_output_reset);
            $scope.ioOutputParam.endPlateAo = $scope.outputResetData.find(item => item.id == ~~data.axle_ao_output_reset);
            $scope.ioOutputParam.auxDo = $scope.outputResetData.find(item => item.id == ~~data.ext_do_output_reset);
            $scope.ioOutputParam.auxAo = $scope.outputResetData.find(item => item.id == ~~data.ext_ao_output_reset);
            $scope.ioOutputParam.smartDo = $scope.outputResetData.find(item => item.id == ~~data.smarttool_do_output_reset);
            $scope.ioOutputParam.controlDoReload = $scope.outputWhetherData.find(item => item.num == ~~data.ctl_do_output_reload);
            $scope.ioOutputParam.controlAoReload = $scope.outputWhetherData.find(item => item.num == ~~data.ctl_ao_output_reload);
            $scope.ioOutputParam.endPlateDoReload = $scope.outputWhetherData.find(item => item.num == ~~data.axle_do_output_reload);
            $scope.ioOutputParam.endPlateAoReload = $scope.outputWhetherData.find(item => item.num == ~~data.axle_ao_output_reload);
            $scope.ioOutputParam.auxDoReload = $scope.outputWhetherData.find(item => item.num == ~~data.ext_do_output_reload);
            $scope.ioOutputParam.auxAoReload = $scope.outputWhetherData.find(item => item.num == ~~data.ext_ao_output_reload);
            $scope.ioOutputParam.smartDoReload = $scope.outputWhetherData.find(item => item.num == ~~data.smarttool_do_output_reload);
            /* ./Ëæ?Â?∫Â§ç‰ΩçÈ?çÁΩÆÁ??Èù¢È?çÁΩÆÈ°πË?∑Âè? */
            /* ‰Ω?‰∏?Â??Á?π */
            $scope.workHomeParam.isSet = ~~data.origin_setflag;
            $scope.workHomeParam.point.j1 = parseFloat(data.origin_j1).toFixed(3);
            $scope.workHomeParam.point.j2 = parseFloat(data.origin_j2).toFixed(3);
            $scope.workHomeParam.point.j3 = parseFloat(data.origin_j3).toFixed(3);
            $scope.workHomeParam.point.j4 = parseFloat(data.origin_j4).toFixed(3);
            $scope.workHomeParam.point.j5 = parseFloat(data.origin_j5).toFixed(3);
            $scope.workHomeParam.point.j6 = parseFloat(data.origin_j6).toFixed(3);
            if ($scope.diParam.configerableInput.di8 == '11') {
                $scope.workHomeParam.signal = '8';
            }
            if ($scope.diParam.configerableInput.di9 == '11') {
                $scope.workHomeParam.signal = '9';
            }
            if ($scope.diParam.configerableInput.di10 == '11') {
                $scope.workHomeParam.signal = '10';
            }
            if ($scope.diParam.configerableInput.di11 == '11') {
                $scope.workHomeParam.signal = '11';
            }
            if ($scope.diParam.configerableInput.di12 == '11') {
                $scope.workHomeParam.signal = '12';
            }
            if ($scope.diParam.configerableInput.di13 == '11') {
                $scope.workHomeParam.signal = '13';
            }
            if ($scope.diParam.configerableInput.di14 == '11') {
                $scope.workHomeParam.signal = '14';
            }
            if ($scope.diParam.configerableInput.di15 == '11') {
                $scope.workHomeParam.signal = '15';
            }
            $scope.workHomeParam.diList.forEach((item, index) => {
                item.disable = $scope.diParam.configerableInput[`di${index + 8}`] != '0' && $scope.diParam.configerableInput[`di${index + 8}`] != '11';
            });
            if ($scope.diParam.endInput.di1 == '16') {
                $scope.workHomeParam.endSignal = '0';
            }
            if ($scope.diParam.endInput.di2 == '16') {
                $scope.workHomeParam.endSignal = '1';
            }
            $scope.workHomeParam.endDiList.forEach((item, index) => {
                item.disable = $scope.diParam.endInput[`di${index + 1}`] != '0' && $scope.diParam.endInput[`di${index + 1}`] != '16';
            });
            /* ./‰Ω?‰∏?Â??Á?π */
            hidePageLoading();
        }, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[0]);
            hidePageLoading();
            /* test */
            if (g_testCode) {
                createNewSlider();
                $scope.workHomeParam.diList.forEach((item, index) => {
                    item.disable = $scope.diParam.configerableInput[`di${index + 8}`] != '0' && $scope.diParam.configerableInput[`di${index + 8}`] != '11';
                });
                $scope.workHomeParam.endDiList.forEach((item, index) => {
                    item.disable = $scope.diParam.endInput[`di${index + 1}`] != '0' && $scope.diParam.endInput[`di${index + 1}`] != '16';
                });
            }
            /* ./test */
        });
    }

    /**
     * Ë?∑Âè?Ê?∫Â?®‰∫∫Â??Ê?ßÈ?çÁΩÆÊ?∞ÊçÆ
     * @param {string} dynamicType 'init'--Â?ùÂß?Â??Ôº?'sensorLoad'--Ë¥?ËΩΩ‚??‚??‰º†Ê??Â?®Ëæ®ËØ?;'dragComp'--Â?≥Ë??--Ê??Â?®Â??Ë°•ÂÅøÔº?
     */
    function getDynamicData(dynamicType) {
        let getDynamicCfgCmd = {
            cmd: "get_dynamic_cfg",
        };
        dataFactory.getData(getDynamicCfgCmd).then((data) => {
            if (dynamicType == 'init' || dynamicType == 'sensorLoad') {
                // Ë¥?ËΩΩ‚??‚??‰º†Ê??Â?®Ëæ®ËØ?Á??È?çÈ?èÂ??Ë¥®Âø?ÂùêÊ†?
                $scope.loadParam.ftWeight = parseFloat(data.forcesensor_loadweight).toFixed(3);
                $scope.loadParam.ftLocation.x = parseFloat(data.forcesensor_loadcoordx).toFixed(3);
                $scope.loadParam.ftLocation.y = parseFloat(data.forcesensor_loadcoordy).toFixed(3);
                $scope.loadParam.ftLocation.z = parseFloat(data.forcesensor_loadcoordz).toFixed(3);
                // ‰º†Ê??Â?®Ëæ®ËØ?‚??‚??Ë¥?ËΩΩË?™Â?®Ëæ®ËØ?Âº?Â?≥
                $scope.loadParam.sensorAutoIdent = ~~data.load_identify_dyn;
                // ‰º†Ê??Â?®Ëæ®ËØ?‚??‚??Ë¥?ËΩΩË?™Â?®Ëæ®ËØ?È??Ê†∑Â?®Ê??
                $scope.loadParam.sampleTime = ~~data.load_identify_time;
            }
            // Â?≥Ë??--Ê??Â?®Â??Ë°•ÂÅø
            if (dynamicType == 'init' || dynamicType == 'dragComp') {
                $scope.dragCompParam.flag = $scope.dragFrictionData[~~data.drag_flag];
                $scope.dragCompParam.adjustFlag = $scope.dragFrictionData[~~data.drag_adaptive_sign];
                $scope.dragCompParam.coefficient.j1 = parseFloat(data.drag_gain1).toFixed(3);
                $scope.dragCompParam.coefficient.j2 = parseFloat(data.drag_gain2).toFixed(3);
                $scope.dragCompParam.coefficient.j3 = parseFloat(data.drag_gain3).toFixed(3);
                $scope.dragCompParam.coefficient.j4 = parseFloat(data.drag_gain4).toFixed(3);
                $scope.dragCompParam.coefficient.j5 = parseFloat(data.drag_gain5).toFixed(3);
                $scope.dragCompParam.coefficient.j6 = parseFloat(data.drag_gain6).toFixed(3);
            }
        }, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[25]);
        });
    }

    //Ê†πÊçÆ‰∫?Á∫ßËè?Âç?Â??Êç¢ÂØπÂ∫?ËÆæÁΩÆÁ??Èù¢
    $('.setting-menu').tree();
    $scope.switchSettingPage = function(id){
        // Ë?™Á?±ÂÆ?Ë£?Â?∫Â∫ßËß?Â∫¶Ê?πÂè?Ê?™‰øùÂ≠?Ê?∂Ëß¶Âè?
        if ($scope.freeMountModifyFlag) {
            $("#robot-mounting-confirm").modal('show');
            return;
        }
        $(".navItem").removeClass("item-selected");
        $(".navItem" + id).addClass("item-selected");
        $(".childrenItem").removeClass("childItem-selected");
        $(".childrenItem" + id).addClass("childItem-selected");
        changeVRobotWidth();
        $scope.switchVirtualFunc(0);
        $scope.showRobotSet = {
            worldCoord: false,
            toolCoord: false,
            exToolCoord: false,
            wobjCoord: false,
            load: false,
            softLimit: false,
            collide: false,
            friction: false,
            di: false,
            do: false,
            alias: false,
            filter: false,
            outPut: false,
            workpoint: false,
            configFile: false
        };
        $scope.toolCoordParam.calibrate = false;
        $scope.exToolCoordParam.calibrate = false;
        $scope.wobjCoordParam.calibrate = false;
        switch(id) {
            case "free_mount":
                $scope.switchVirtualFunc(1);
                changeMountingWidth(false);
                break;
            case "world_coord":
                $scope.showRobotSet.worldCoord = true;
                break;
            case "tool_coord":
                $scope.toolCoordParam.toolFourUrl1 = `./img/tool1.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.toolFourUrl2 = `./img/tool2.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.toolSixUrl1 = `./img/tool1.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.toolSixUrl4 = `./img/tool2.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.toolSixUrl5 = `./img/tool3.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.toolSixUrl6 = `./img/tool4.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl1 = `./img/Laser_Six_TCP1.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl2 = `./img/Laser_Six_TCP2.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl3 = `./img/Laser_Six_TCP3.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl4 = `./img/Laser_Six_TCP4.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl5 = `./img/Laser_Six_TCP5.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserSixUrl6 = `./img/Laser_Six_TCP6.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl1 = `./img/Eight-Laser1.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl2 = `./img/Eight-Laser2.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl3 = `./img/Eight-Laser3.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl4 = `./img/Eight-Laser4.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl5 = `./img/Eight-Laser5.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl6 = `./img/Eight-Laser6.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl7 = `./img/Eight-Laser7.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserEightUrl8 = `./img/Eight-Laser8.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserFiveUrl1 = `./img/Eight-Laser_Five1.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserFiveUrl2 = `./img/Eight-Laser2.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserFiveUrl3 = `./img/Eight-Laser3.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserFiveUrl4 = `./img/Eight-Laser4.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserFiveUrl5 = `./img/Eight-Laser5.jpg?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserThreeUrl1 = `./img/Laser_Three_TCP1.png?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserThreeUrl2 = `./img/Laser_Three_TCP2.png?v=${new Date().getTime()}`;
                $scope.toolCoordParam.laserThreeUrl3 = `./img/Laser_Three_TCP3.png?v=${new Date().getTime()}`;
                $scope.toolCoordParam.centerUrl = `./img/OGLW2-70T-CenterPose_340x340.png?v=${new Date().getTime()}`;
                $scope.toolCoordParam.planeUrl = `./img/plane-point.png?v=${new Date().getTime()}`;
                $scope.showRobotSet.toolCoord = true;
                getCheckLocalPoint('FR_CalibrateTheToolTcpPlane.lua', 'FR_CalibratePlaneReferencePose');
                getToolCoordData();
                break;
            case "external_tool_coord":
                $scope.exToolCoordParam.tcpUrl = `./img/ExTCP.jpg?v=${new Date().getTime()}`;
                $scope.exToolCoordParam.calTcpUrl = `./img/ExCoord_TCP.jpg?v=${new Date().getTime()}`;
                $scope.exToolCoordParam.calXUrl = `./img/ExCoord_X.jpg?v=${new Date().getTime()}`;
                $scope.exToolCoordParam.calZUrl = `./img/ExCoord_Z.jpg?v=${new Date().getTime()}`;
                $scope.showRobotSet.exToolCoord = true;
                break;
            case "workpiece_coord":
                $scope.wobjCoordParam.calUrl1 = `./img/wobj1.png?v=${new Date().getTime()}`;
                $scope.wobjCoordParam.calUrl2 = `./img/wobj2.png?v=${new Date().getTime()}`
                $scope.wobjCoordParam.calUrl3 = `./img/wobj3.png?v=${new Date().getTime()}`
                $scope.wobjCoordParam.calUrl4 = `./img/wobj4.png?v=${new Date().getTime()}`
                $scope.showRobotSet.wobjCoord = true;
                break;
            case "end_load":
                // Ë?∑Âè?Ê?´Á´ØË¥?ËΩΩÁº?Âè∑
                getEndLoadData();
                $scope.showRobotSet.load = true;
                getCheckLocalPoint('ForceSensorAutoZero.lua', 'ForceSensorAutoZero');
                break;
            case "soft_limit":
                $scope.showRobotSet.softLimit = true;
                break;
            case "collision_level":
                $scope.showRobotSet.collide = true;
                getImpulseDetectionSwitch();
                break;
            case "friction_compensation":
                $scope.showRobotSet.friction = true;
                break;
            case "di_config":
                $scope.showRobotSet.di = true;
                break;
            case "do_config":
                $scope.showRobotSet.do = true;
                getPowerOnDOLevel();
                break;
            case "io_alias":
                $scope.showRobotSet.alias = true;
                break;
            case "io_filtering":
                $scope.showRobotSet.filter = true;
                break;
            case "out_put_reset":
                $scope.showRobotSet.outPut = true;
                break;
            case "starting_point":
                $scope.showRobotSet.workpoint = true;
                getRobotdata();
                break;
            case "file_import_export":
                $scope.showRobotSet.configFile = true;
                break;
            default:
                break;
        }
    }

    /** Â∑•Â?∑ÂùêÊ†?Á≥ªËÆæÁΩÆ */
    // Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰øùÁ??‰∏?‰ΩçÂ∞èÊ?∞
    function toolHandledecimal(data) {
        for (let i = 0; i < data.length; i++) {
            let valuearr = Object.keys(data[i]);
            var valuelength = valuearr.length;
            for (let j = 2; j < valuelength - 2; j++) {
                if (valuearr[j] == 'x' || valuearr[j] == 'y' || valuearr[j] == 'z' || valuearr[j] == 'rx' || valuearr[j] == 'ry' || valuearr[j] == 'rz' || valuearr[j] == 'precisionX' || valuearr[j] == 'precisionY' || valuearr[j] == 'precisionZ' || valuearr[j] == 'precision') {
                    data[i][valuearr[j]] = parseFloat(data[i][valuearr[j]]).toFixed(3);
                }
            }
        }
    }

    // Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰øùÁ??‰∏?‰ΩçÂ∞èÊ?∞
    function handledecimal(data) {
        let namearr = Object.keys(data);
        let namelength = namearr.length;
        for (let i = 0; i < namelength; i++) {
            let valuearr = Object.keys(data[namearr[i]]);
            var valuelength = valuearr.length;
            if (8 == valuelength) {
                for (let j = 2; j < valuelength; j++) {
                    data[namearr[i]][valuearr[j]] = parseFloat(data[namearr[i]][valuearr[j]]).toFixed(3);
                }
            } else if (9 == valuelength) {
                for (let j = 2; j < valuelength - 1; j++) {
                    data[namearr[i]][valuearr[j]] = parseFloat(data[namearr[i]][valuearr[j]]).toFixed(3);
                }
            } else if (10 == valuelength) {
                for (let j = 2; j < valuelength - 1; j++) {
                    data[namearr[i]][valuearr[j]] = parseFloat(data[namearr[i]][valuearr[j]]).toFixed(3);
                }
            } else {
                for (let j = 3; j < valuelength; j++) {
                    data[namearr[i]][valuearr[j]] = parseFloat(data[namearr[i]][valuearr[j]]).toFixed(3);
                }
            }
        }
    }

    // Ë¥?ËΩΩÊ??Â?®Ëæ®ËØ?È??Ê?©‰º†Ê??Â?®Á??Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰øùÁ??‰∏?‰ΩçÂ∞èÊ?∞
    function rotScreenSensor(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == 0) {
                data.splice(i, 1);
                i = i - 1;
            } else {
                let valuearr = Object.keys(data[i]);
                var valuelength = valuearr.length;
                for (let j = 2; j < valuelength - 2; j++) {
                    data[i][valuearr[j]] = parseFloat(data[i][valuearr[j]]).toFixed(3);
                }
            }
        }
    }
    
    // ËÆ°ÁÆ?Â?∫Á??Áª?Ê??‰øùÁ??‰∏?‰ΩçÂ∞èÊ?∞
    function handlecompute(data) {
        let temparr = Object.keys(data);
        var templength = temparr.length;
        for (let i = 0; i < templength; i++) {
            if ((data[temparr[i]] == "nan") || (data[temparr[i]] == "-nan")) {
                data[temparr[i]] = 0.000;
            } else {
                data[temparr[i]] = parseFloat(data[temparr[i]]).toFixed(3);
            }
        }
        return data;
    }

    // Ë?∑Âè?Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    function getToolCoordData() {
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                toolHandledecimal(data);
                $scope.toolCoordeData = JSON.parse(JSON.stringify(data));
                $scope.toolCoordeTotal = JSON.parse(JSON.stringify(data)).length;
                $scope.originToolCoordeData = JSON.parse(JSON.stringify(data));
				if (null != $scope.toolCoordParam.select?.id) {
                    $scope.toolCoordParam.select = $scope.toolCoordeData[$scope.toolCoordParam.select.id];
				} else {
                    if ($scope.currentCoord < $scope.toolCoordeTotal) {
                        $scope.toolCoordParam.select = $scope.toolCoordeData[~~$scope.currentCoord];   
                    } else {
                        $scope.toolCoordParam.select = $scope.toolCoordeData[0];
                    }
                }
                $scope.toolTypeData.forEach(item => {
                    if (item.id == $scope.toolCoordParam.select.type) {
                        $scope.toolCoordParam.selectType = item;
                    }
                });
                $scope.mountingLocationData.forEach(item => {
                    if (item.id == $scope.toolCoordParam.select.installation_site) {
                        $scope.toolCoordParam.selectMount = item;
                    }
                });
                // Ë¥?ËΩΩ‰º†Ê??Â?®Ëæ®ËØ?‚??‚??È??Ê?©‰º†Ê??Â?®Á±ªÂ??Á??Â∑•Â?∑ÂùêÊ†?Á≥ª
                rotScreenSensor(data);
                $scope.rotSensorCoordeData = JSON.parse(JSON.stringify(data));
                $scope.loadParam.sensorTool = $scope.rotSensorCoordeData[0];
                // Â§?Áê?Ë¥?ËΩΩÁº?Âè∑Á??Ê?∞ÊçÆ
                let getLoadCmd = {
                    cmd: 'get_load'
                }
                dataFactory.getData(getLoadCmd).then((data) => {
                    $scope.endLoadData = data;
                    $scope.endLoadData.forEach(item => {
                        if (item.id == $scope.toolCoordParam.select.load_id) {
                            $scope.toolCoordParam.selectLoad = item;
                        }
                    });
                }, (status) => {
                    $scope.endLoadData = [];
                });
                document.dispatchEvent(new CustomEvent('saveToolCoordData', { bubbles: true, cancelable: true, composed: true }));
            }, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[1]);
                /* test */
                if (g_testCode) {
                    $scope.currentCoord = 0;
                    toolHandledecimal(testDataService.testToolCoordeData);
                    $scope.toolCoordeData = JSON.parse(JSON.stringify(testDataService.testToolCoordeData));
                    $scope.originToolCoordeData = JSON.parse(JSON.stringify(testDataService.testToolCoordeData));
                    if (null != $scope.toolCoordParam.select.id) {
                        $scope.toolCoordParam.select = $scope.toolCoordeData[$scope.toolCoordParam.select.id];
                    } else {
                        if ($scope.currentCoord <= $scope.toolCoordeTotal) {
                            $scope.toolCoordParam.select = $scope.toolCoordeData[~~$scope.currentCoord];   
                        } else {
                            $scope.toolCoordParam.select = $scope.toolCoordeData[0];
                        }
                    }
                    $scope.toolTypeData.forEach(item => {
                        if (item.id == $scope.toolCoordParam.select.type) {
                            $scope.toolCoordParam.selectType = item;
                        }
                    });
                    $scope.mountingLocationData.forEach(item => {
                        if (item.id == $scope.toolCoordParam.select.installation_site) {
                            $scope.toolCoordParam.selectMount = item;
                        }
                    });
                    // Ë¥?ËΩΩ‰º†Ê??Â?®Ëæ®ËØ?‚??‚??È??Ê?©‰º†Ê??Â?®Á±ªÂ??Á??Â∑•Â?∑ÂùêÊ†?Á≥ª
                    rotScreenSensor(testDataService.testToolCoordeData);
                    $scope.rotSensorCoordeData = JSON.parse(JSON.stringify(testDataService.testToolCoordeData));
                    $scope.loadParam.sensorTool = $scope.rotSensorCoordeData[0];
                    // Â§?Áê?Ë¥?ËΩΩÁº?Âè∑Á??Ê?∞ÊçÆ
                    let getLoadCmd = {
                        cmd: 'get_load'
                    }
                    dataFactory.getData(getLoadCmd).then((data) => {
                        $scope.endLoadData = data;
                        $scope.endLoadData.forEach(item => {
                            if (item.id == $scope.toolCoordParam.select.load_id) {
                                $scope.toolCoordParam.selectLoad = item;
                            }
                        });
                    }, (status) => {
                        $scope.endLoadData = [];
                        /* test */
                        $scope.endLoadData = testDataService.testEndLoadList;
                        $scope.endLoadData.forEach(item => {
                            if (item.id == $scope.toolCoordParam.select.load_id) {
                                $scope.toolCoordParam.selectLoad = item;
                            }
                        });
                        /* ./test */
                    });
                }
                /* ./test */
            });
    };

    /**
     * Â??Êç¢Â∑•Â?∑ÂùêÊ†?Á≥ªÂê?Â?§Ê?≠id‰∏∫0Ôº?Â∞?Ê†?ÂÆ?Ê?πÊ≥?Â??ÂÆπÈ?êË?è
     * @param {object} data ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
     */
    $scope.changeToolCoord = function(data) {
        if (data.id == 0) {
            $scope.toolCoordParam.calibrate = false;
        }
        $scope.toolTypeData.forEach(item => {
            if (item.id == data.type) {
                $scope.toolCoordParam.selectType = item;
            }
        });
        $scope.mountingLocationData.forEach(item => {
            if (item.id == data.installation_site) {
                $scope.toolCoordParam.selectMount = item;
            }
        });
        $scope.endLoadData.forEach(item => {
            if (item.id == data.load_id) {
                $scope.toolCoordParam.selectLoad = item;
            }
        });
    }

    // Ê†°È™?Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?ØÂê¶Ê?πÂ?®
    function checkToolCoord() {
        const originalTool = $scope.originToolCoordeData[$scope.toolCoordParam.select.id];
        if((parseFloat(originalTool.x) != parseFloat($scope.toolCoordParam.select.x))
            || (parseFloat(originalTool.y) != parseFloat($scope.toolCoordParam.select.y))
            || (parseFloat(originalTool.z) != parseFloat($scope.toolCoordParam.select.z))
            || (parseFloat(originalTool.rx) != parseFloat($scope.toolCoordParam.select.rx))
            || (parseFloat(originalTool.ry) != parseFloat($scope.toolCoordParam.select.ry))
            || (parseFloat(originalTool.rz) != parseFloat($scope.toolCoordParam.select.rz))
            || (parseFloat(originalTool.type) != parseFloat($scope.toolCoordParam.select.type))
            || (parseFloat(originalTool.installation_site) != parseFloat($scope.toolCoordParam.select.installation_site))
            || (parseFloat(originalTool.tool_id_no) != parseFloat($scope.toolCoordParam.select.tool_id_no))
            || (parseFloat(originalTool.load_id) != parseFloat($scope.toolCoordParam.select.load_id))
        ) {
            $('#toolModal').modal('show');
        } else {
            applyToolCoord();
        }
    }

    // Â∫?Á?®Â∑•Â?∑ÂùêÊ†?Á≥ª
    function applyToolCoord() {
        console.log($scope.toolCoordParam, '$scope.toolCoordParam');
        var toolCoordString = "SetToolCoord(" + $scope.toolCoordParam.select.id + "," + $scope.toolCoordParam.select.x + "," + $scope.toolCoordParam.select.y + ","
            + $scope.toolCoordParam.select.z + "," + $scope.toolCoordParam.select.rx + "," + $scope.toolCoordParam.select.ry + "," + $scope.toolCoordParam.select.rz + ","
            + $scope.toolCoordParam.select.type + "," + $scope.toolCoordParam.select.installation_site + "," + $scope.toolCoordParam.select.tool_id_no + ","
            + $scope.toolCoordParam.selectLoad.id + ")";
        let setToolCoordCmd = {
            cmd: 316,
            data: {
                content: toolCoordString,
            },
        };
        dataFactory.setData(setToolCoordCmd).then(() => {}, (status) => {
            getToolCoordData();
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('316', e => {
        if (e.detail == 1) {
            let setLoadWeightCmd = {
                cmd: 'modify_load',
                data: $scope.toolCoordParam.selectLoad
            };
            dataFactory.actData(setLoadWeightCmd).then(() => {}, (status) => {
                getToolCoordData();
                toastFactory.error(status, rsDynamicTags.error_messages[22]);
            });
        }
    })

    // ‰øÆÊ?πÂ∑•Â?∑ÂùêÊ†?Á≥ª
    $scope.modifyToolCoord = function() {
        $('#toolModal').modal('hide');
        if ($scope.toolCoordParam.select.id == 0) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
        } else {
            let saveCmd = {
                cmd: "modify_tool_cdsystem",
                data: $scope.toolCoordParam.select,
            };
            dataFactory.actData(saveCmd).then(() => {
                applyToolCoord();
            }, (status) => {
                toastFactory.error(status);
            });
        }
    }

    // Â∑•Â?∑ÂùêÊ†?Á≥ªÊ†?ÂÆ?Ê?πÊ≥?Ê?æÁ§∫
    function newToolCoord() {
        if ($scope.toolCoordParam.select.id == 0) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        if ($scope.currentCoord != 0) {
            toastFactory.info(rsDynamicTags.info_messages[49]);
            return;
        }
        $scope.toolCoordParam.calibrate = !$scope.toolCoordParam.calibrate;
    }

    // Ê∏?Á©∫ÂΩ?Â?çÂùêÊ†?Á≥ª(Â?®È?®ÁΩÆ‰∏∫0)
    let clearToolCoordFlg = 0;
    function clearToolCoord() {
        if (clearToolCoordFlg == 0) {
            toastFactory.info(rsDynamicTags.info_messages[2]);
            clearToolCoordFlg = 1;
        } else {
            clearToolCoordFlg = 0;
            var senddata = {
                name: $scope.toolCoordParam.select.name,
                id: $scope.toolCoordParam.select.id,
                x: "0",
                y: "0",
                z: "0",
                rx: "0",
                ry: "0",
                rz: "0",
                type: "0",
                installation_site: "0",
                tool_id_no: "0",
                load_id: "0"
            }
            let saveCmd = {
                cmd: "modify_tool_cdsystem",
                data: senddata,
            };
            dataFactory.actData(saveCmd).then(() => {
                getToolCoordData();
            }, (status) => {
                toastFactory.error(status);
            });
        }
    }

    // È?çÂ?ΩÂêçÂΩ?Â?çÂùêÊ†?Á≥ªÂêçÁß∞
    function renameToolCoordName() {
        if ($scope.toolCoordParam.rename == "" || $scope.toolCoordParam.rename == null) {
            toastFactory.info(rsDynamicTags.info_messages[4]);
        } else {
            $scope.toolCoordParam.select.name = $scope.toolCoordParam.rename;
            let saveCmd = {
                cmd: "modify_tool_cdsystem",
                data: $scope.toolCoordParam.select,
            };
            dataFactory.actData(saveCmd).then(() => {
                $scope.toolCoordParam.renameFlag = false;
                g_renameToolCoordFlag = 1;
                getToolCoordData();
            }, (status) => {
                toastFactory.error(status);
                /* test */
                if (g_testCode) {
                    $scope.toolCoordParam.renameFlag = false;
                    getToolCoordData();
                }
                /* ./test */
            });
        }
    }

    /**
     * Â∑•Â?∑ÂùêÊ†?Á≥ªÊ??È?ÆÁº?Ëæ?
     * @param {int} type Ê??È?ÆÁ±ªÂ??
    */
    $scope.operateToolCoord = function(type) {
        switch (type) {
            // ÂùêÊ†?Á≥ªÊ†?ÂÆ?
            case 'edit':
                $scope.toolCoordParam.renameFlag = false;
                newToolCoord();
                break;
            // Â∫?Á?®
            case 'apply':
                $scope.toolCoordParam.renameFlag = false;
                checkToolCoord();
                break;
            // È?çÂ?ΩÂêç
            case 'rename':
                if ($scope.toolCoordParam.renameFlag) {
                    renameToolCoordName();
                } else {
                    $scope.toolCoordParam.rename = $scope.toolCoordParam.select.name;
                    $scope.toolCoordParam.renameFlag = true;
                }
                break;
            // Ê∏?È?§
            case 'clear':
                $scope.toolCoordParam.renameFlag = false;
                clearToolCoord();
                break;
            default:
                break;
        }
    }

    /**
     * È??Ê?©Â∑•Â?∑Á±ªÂ??
     * @param {Object} toolType Â∑•Â?∑Á±ªÂ??Ôº?0-Â∑•Â?∑„?Å1-‰º†Ê??Â?®Ôº?
     */
    $scope.changeToolType = function(toolType) {
        switch (toolType.id) {
            case '0':
                $scope.toolCoordParam.calMethod = $scope.toolCalMethod[0];
                break;
            case '1':
                $scope.toolCoordParam.modifyLaser = $scope.laserLocationData[0];
                $scope.toolCoordParam.calMethod = $scope.laserCalMethod[0];
                break;
            default:
                break;
        }
        $scope.cancelToolCoord();
    }

    /**
     * ‰øÆÊ?πÂ∑•Â?∑Á±ªÂ??Ê?∂Ôº?Âê?Ê≠•‰øÆÊ?πÂ∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰∏≠Á??typeÂ≠?ÊÆµ
     * @param {string} toolType Â∑•Â?∑Á±ªÂ??Á??id
     */
    $scope.modifyToolType = function(toolType) {
        $scope.toolCoordParam.select.type = toolType.id;
    }
    
    /**
     * ‰øÆÊ?πË¥?ËΩΩÁº?Âè∑Ê?∂Ôº?Âê?Ê≠•‰øÆÊ?πÂ∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰∏≠Á??load_idÂ≠?ÊÆµ
     * @param {string} endLoad Ë¥?ËΩΩÁº?Âè∑Á??id
     */
    $scope.modifyEndLoad = function(endLoad) {
        $scope.toolCoordParam.select.load_id = endLoad.id;
    }

    /**
     * Â∑•Â?∑--Â??Á?πÊ≥?Ê†?ÂÆ?Á?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~4
     */
    let toolFourPointIndex;
    $scope.setToolFourPoint = function(pointIndex) {
        toolFourPointIndex = pointIndex;
        let setToolFourPointCmd = {
            cmd: 556,
            data: {
                content: `SetTcp4RefPoint(${toolFourPointIndex})`,
            },
        };
        dataFactory.setData(setToolFourPointCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#toolFour${toolFourPointIndex}`).removeClass("warning");
                $(`#toolFour${toolFourPointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â??Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.toolFourRecord.findIndex(value => value == toolFourPointIndex) != -1) {
                    return;
                }
                $scope.toolCoordParam.toolFourRecord.push(toolFourPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('556', e => {
        if (e.detail == '1') {
            $(`#toolFour${toolFourPointIndex}`).removeClass("warning");
            $(`#toolFour${toolFourPointIndex}`).addClass("success");
            if ($scope.toolCoordParam.toolFourRecord.findIndex(value => value == toolFourPointIndex) != -1) return;
            $scope.toolCoordParam.toolFourRecord.push(toolFourPointIndex);
        } else {
            $(`#toolFour${toolFourPointIndex}`).addClass("warning");
            $(`#toolFour${toolFourPointIndex}`).removeClass("success");
        }
    })

    // Â∑•Â?∑--Â??Á?πÊ≥?Ê†?ÂÆ?Á?πÂÆ?Ê?êÂê?ËÆ°ÁÆ?Áª?Ê??
    $scope.computeToolFourCoord = function() {
        let computeToolCmd = {
            cmd: 557,
            data: {
                content: "ComputeTcp4()",
            },
        };
        $scope.toolCoordParam.toolFourRecordRes = 'loading';
        dataFactory.setData(computeToolCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.toolFourRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.toolFourRecordRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.toolCalculate = {
                    x: '1.11',
                    y: '1.11',
                    z: '1.11',
                    rx: '1.11',
                    ry: '1.11',
                    rz: '1.11',
                }
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?Â??Á?πÊ≥?ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('557', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.toolCalculate = handlecompute(JSON.parse(e.detail));
        } else {
            $scope.toolCoordParam.toolFourRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.toolFourRecordRes = null;
        }, 5000)
    })

    /**
     * Â∑•Â?∑--Â?≠Á?πÊ≥?Ê†?ÂÆ?Á?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~6
     */
    let toolSixPointIndex;
    $scope.setToolSixPoint = function(pointIndex) {
        toolSixPointIndex = pointIndex;
        let setToolSixPointCmd = {
            cmd: 313,
            data: {
                content: `SetToolPoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setToolSixPointCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#toolSix${toolSixPointIndex}`).removeClass("warning");
                $(`#toolSix${toolSixPointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.toolSixRecord.findIndex(value => value == toolSixPointIndex) != -1) {
                    return;
                }
                $scope.toolCoordParam.toolSixRecord.push(toolSixPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('313', e => {
        if (e.detail == '1') {
            $(`#toolSix${toolSixPointIndex}`).removeClass("warning");
            $(`#toolSix${toolSixPointIndex}`).addClass("success");
            // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
            if ($scope.toolCoordParam.toolSixRecord.findIndex(value => value == toolSixPointIndex) != -1) return;
            $scope.toolCoordParam.toolSixRecord.push(toolSixPointIndex);
        } else {
            $(`#toolSix${toolSixPointIndex}`).addClass("warning");
            $(`#toolSix${toolSixPointIndex}`).removeClass("success");
        }
    })

    // Â∑•Â?∑--Â?≠Á?πÊ≥?Ê†?ÂÆ?Á?πÂÆ?Ê?êÂê?ËÆ°ÁÆ?Áª?Ê??
    $scope.computeToolSixCoord = function() {
        var computeToolString = "ComputeTool()";
        let computeToolCmd = {
            cmd: 314,
            data: {
                content:computeToolString,
            },
        };
        $scope.toolCoordParam.toolSixRecordRes = 'loading';
        dataFactory.setData(computeToolCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.toolSixRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.toolSixRecordRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.toolCalculate = {
                    x: '2.22',
                    y: '2.22',
                    z: '2.22',
                    rx: '2.22',
                    ry: '2.22',
                    rz: '2.22',
                }
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?Â?≠Á?πÊ≥?ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('314', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.toolCalculate = handlecompute(JSON.parse(e.detail));
        } else {
            $scope.toolCoordParam.toolSixRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.toolSixRecordRes = null;
        }, 5000)
    })

    // Âè?Ê∂?‰øùÂ≠?Â∑•Â?∑ÂùêÊ†?Á≥ªÁ??ËÆ°ÁÆ?Áª?Ê??
    $scope.cancelToolCoord = function() {
        // Â∑•Â?∑Â??Á?πÊ≥?„?ÅÂ∑•Â?∑Â?≠Á?πÊ≥?„?ÅÊø?Â??Ë?™Â?®Ê†?ÂÆ?Â??Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?ËÆ°ÁÆ?Áª?Ê??Ê∏?Á©∫
        $scope.toolCoordParam.toolCalculate = null;
        // Â∑•Â?∑Â??Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.toolFourRecord.forEach(item => {
            $(`#toolFour${item}`).removeClass("warning");
            $(`#toolFour${item}`).removeClass("success");
        });
        $scope.toolCoordParam.toolFourRecord = [];
        // Â∑•Â?∑Â?≠Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.toolSixRecord.forEach(item => {
            $(`#toolSix${item}`).removeClass("warning");
            $(`#toolSix${item}`).removeClass("success");
        });
        $scope.toolCoordParam.toolSixRecord = [];
        // ‰º†Ê??Â?®‚??Ê?∫Â?®‰∫∫Ê?´Á´ØÂ?≠Á?πÊ≥?„?ÅÂ?´Á?πÊ≥?„?Å‰∫?Á?πÊ≥?Â??Â§?È?®Ê†?ÂÆ?ËÆ°ÁÆ?Áª?Ê??Ê∏?Á©∫
        $scope.toolCoordParam.laserCalculate = null;
        // ‰º†Ê??Â?®‚??‚??Ê?∫Â?®‰∫∫Ê?´Á´ØÂ?≠Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.laserSixRecord.forEach(item => {
            $(`#laserSix${item}`).removeClass("warning");
            $(`#laserSix${item}`).removeClass("success");
        });
        $scope.toolCoordParam.laserSixRecord = [];
        // ‰º†Ê??Â?®‚??‚??Ê?∫Â?®‰∫∫Ê?´Á´ØÂ?´Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.laserEightRecord.forEach(item => {
            $(`#laserEight${item}`).removeClass("warning");
            $(`#laserEight${item}`).removeClass("success");
        });
        $scope.toolCoordParam.laserEightRecord = [];
        // ‰º†Ê??Â?®‚??‚??Ê?∫Â?®‰∫∫Ê?´Á´Ø‰∫?Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.laserFiveRecord.forEach(item => {
            $(`#laserFive${item}`).removeClass("warning");
            $(`#laserFive${item}`).removeClass("success");
        });
        $scope.toolCoordParam.laserFiveRecord = [];
        // ‰º†Ê??Â?®‚??‚??Ê?∫Â?®‰∫∫Ê?´Á´Ø‰∫?Á?πÊ≥?Ê†?ÂÆ?Á?πÁª?Ê??Ê∏?Á©∫
        $scope.toolCoordParam.laserFiveResult.forEach(item => {
            item.x = null;
            item.y = null;
            item.z = null;
        });
        // ‰º†Ê??Â?®‚??‚??Ê?∫Â?®‰∫∫Â§?È?®‰∏?Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.toolCoordParam.laserThreeRecord.forEach(item => {
            $(`#laserThree${item}`).removeClass("warning");
            $(`#laserThree${item}`).removeClass("success");
        });
        $scope.toolCoordParam.laserThreeRecord = [];
    }

    // ‰øùÂ≠?Â∑•Â?∑Â??Á?πÊ≥?„?ÅÂ∑•Â?∑Â?≠Á?πÊ≥?„?ÅÊø?Â??Ë?™Â?®Ê†?ÂÆ?Â??Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?Á??ËÆ°ÁÆ?Áª?Ê??
    $scope.saveToolCoord = function() {
        if (0 === $scope.toolCoordParam.select.id) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        $scope.toolCoordParam.select.x = $scope.toolCoordParam.toolCalculate.x + "";
        $scope.toolCoordParam.select.y = $scope.toolCoordParam.toolCalculate.y + "";
        $scope.toolCoordParam.select.z = $scope.toolCoordParam.toolCalculate.z + "";
        $scope.toolCoordParam.select.rx = $scope.toolCoordParam.toolCalculate.rx + "";
        $scope.toolCoordParam.select.ry = $scope.toolCoordParam.toolCalculate.ry + "";
        $scope.toolCoordParam.select.rz = $scope.toolCoordParam.toolCalculate.rz + "";
        if ($scope.toolCoordParam.modifyToolType) {
            $scope.toolCoordParam.select.type = $scope.toolCoordParam.modifyToolType.id;
        }
        if ($scope.toolCoordParam.modifyToolId) {
            $scope.toolCoordParam.select.tool_id_no = $scope.toolCoordParam.modifyToolId;
        }
        if ($scope.toolCoordParam.modifyLoad) {
            $scope.toolCoordParam.select.load_id = $scope.toolCoordParam.modifyLoad.id;
        }
        let saveCmd = {
            cmd: "modify_tool_cdsystem",
            data: $scope.toolCoordParam.select,
        };
        $scope.toolCoordParam.saveToolRes = 'loading';
        dataFactory.actData(saveCmd).then(() => {
            getToolCoordData();
            applyToolCoord();
            $scope.toolCoordParam.calibrate = false;
            $scope.toolCoordParam.modifyToolType = null;
            $scope.toolCoordParam.modifyLaser = null;
            $scope.toolCoordParam.toolCalculate = null;
            $scope.toolCoordParam.saveToolRes = 'success';
            $timeout(function() {
                $scope.toolCoordParam.saveToolRes = null;
            }, 5000)
            toastFactory.success(rsDynamicTags.success_messages[0]);
        }, (status) => {
            $scope.toolCoordParam.saveToolRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.saveToolRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }

    /**
     * ‰øÆÊ?πÂÆ?Ë£?‰ΩçÁΩÆÊ?∂Ôº?Âê?Ê≠•‰øÆÊ?πÂ∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ‰∏≠Á??installation_siteÂ≠?ÊÆµ
     * @param {string} mountLocation ÂÆ?Ë£?‰ΩçÁΩÆÁ??id
     */
    $scope.modifyMountLocation = function(mountLocation) {
        $scope.toolCoordParam.select.installation_site = mountLocation.id;
    }

    $scope.repeatMessage = function(){
        toastFactory.info(rsDynamicTags.info_messages[9]);
    }

    /**
     * ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?È?çÁΩÆ‰ΩçÂßøÁ?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~6
     */
    let laserSixPointIndex;
    $scope.setLaserSixPoint = function(pointIndex) {
        laserSixPointIndex = pointIndex;
        let setLTPointCmd = {
            cmd: 261,
            data: {
                content: `SetLaserTrackingPoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setLTPointCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#laserSix${laserSixPointIndex}`).removeClass("warning");
                $(`#laserSix${laserSixPointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.laserSixRecord.findIndex(value => value == laserSixPointIndex) != -1) {
                    return;
                }
                $scope.toolCoordParam.laserSixRecord.push(laserSixPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('261', e => {
        if (e.detail == '1') {
            $(`#laserSix${laserSixPointIndex}`).removeClass("warning");
            $(`#laserSix${laserSixPointIndex}`).addClass("success");
            // ËÆ∞ÂΩ?‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
            if ($scope.toolCoordParam.laserSixRecord.findIndex(value => value == laserSixPointIndex) != -1) return;
            $scope.toolCoordParam.laserSixRecord.push(laserSixPointIndex);
        } else {
            $(`#laserSix${laserSixPointIndex}`).addClass("warning");
            $(`#laserSix${laserSixPointIndex}`).removeClass("success");
        }
    })

    // ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?ËÆ°ÁÆ?‰º†Ê??Â?®‰ΩçÂßø
    $scope.computeLaserSixCoord = function() {
        let computesixLTCmd = {
            cmd: 262,
            data: {
                content: "ComputeLaserTracking()",
            },
        };
        $scope.toolCoordParam.laserSixRecordRes = 'loading';
        dataFactory.setData(computesixLTCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.laserSixRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.laserSixRecordRes = null;
            }, 5000)
            toastFactory.error(status, rsDynamicTags.error_messages[2]);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.laserCalculate = {
                    x: '3.33',
                    y: '3.33',
                    z: '3.33',
                    rx: '3.33',
                    ry: '3.33',
                    rz: '3.33',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('262', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.laserCalculate = handlecompute(JSON.parse(e.detail));
        } else {
            $scope.toolCoordParam.laserSixRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.laserSixRecordRes = null;
        }, 5000)
    })

    /**
     * ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?´Á?πÊ≥?È?çÁΩÆ‰ΩçÂßøÁ?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~8
     */
    let laserEightPointIndex;
    $scope.setLaserEightPoint = function(pointIndex) {
        laserEightPointIndex = pointIndex;
        let setEightLTPointCmd = {
            cmd: 273,
            data: {
                content: `SetLaserSensorPoint_EightPoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setEightLTPointCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#laserEight${laserEightPointIndex}`).removeClass("warning");
                $(`#laserEight${laserEightPointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.laserEightRecord.findIndex(value => value == laserEightPointIndex) != -1) return;
                $scope.toolCoordParam.laserEightRecord.push(laserEightPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('273', e => {
        if (e.detail == '1') {
            $(`#laserEight${laserEightPointIndex}`).removeClass("warning");
            $(`#laserEight${laserEightPointIndex}`).addClass("success");
            // ËÆ∞ÂΩ?‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
            if ($scope.toolCoordParam.laserEightRecord.findIndex(value => value == laserEightPointIndex) != -1) return;
            $scope.toolCoordParam.laserEightRecord.push(laserEightPointIndex);
        } else {
            $(`#laserEight${laserEightPointIndex}`).addClass("warning");
            $(`#laserEight${laserEightPointIndex}`).removeClass("success");
        }
    })

    // ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?´Á?πÊ≥?ËÆ°ÁÆ?‰º†Ê??Â?®‰ΩçÂßø
    $scope.computeLaserEightCoord = function() {
        let computetEightLTCmd = {
            cmd: 274,
            data: {
                content: "ComputeLaserSensorTCP_EightPoint()",
            },
        };
        $scope.toolCoordParam.laserEightRecordRes = 'loading';
        dataFactory.setData(computetEightLTCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.laserEightRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.laserEightRecordRes = null;
            }, 5000)
            toastFactory.error(status, rsDynamicTags.error_messages[3]);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.laserCalculate = {
                    x: '4.44',
                    y: '4.44',
                    z: '4.44',
                    rx: '4.44',
                    ry: '4.44',
                    rz: '4.44',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('274', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.laserCalculate = handlecompute(JSON.parse(e.detail));
            $scope.toolCoordParam.laserEightRecordRes = 'success';
        } else {
            $scope.toolCoordParam.laserEightRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.laserEightRecordRes = null;
        }, 5000)
    })

    /**
     * ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--‰∫?Á?πÊ≥?È?çÁΩÆ‰ΩçÂßøÁ?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~5
     */
    let laserFivePointIndex;
    $scope.setLaserFivePoint = function(pointIndex) {
        laserFivePointIndex = pointIndex;
        let setFiveLTPointCmd = {
            cmd: 658,
            data: {
                content: `SetLaserSensorPoint_FivePoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setFiveLTPointCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#laserFive${laserFivePointIndex}`).removeClass("warning");
                $(`#laserFive${laserFivePointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.laserFiveRecord.findIndex(value => value == laserFivePointIndex) != -1) return;
                $scope.toolCoordParam.laserFiveRecord.push(laserFivePointIndex);
                $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].x = laserFivePointIndex*88.88;
                $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].y = laserFivePointIndex*88.88;
                $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].z = laserFivePointIndex*88.88;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('658', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            const fivePointResult = JSON.parse(e.detail);
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].x = parseFloat(fivePointResult.x).toFixed(2);
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].y = parseFloat(fivePointResult.y).toFixed(2);
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].z = parseFloat(fivePointResult.z).toFixed(2);
            $(`#laserFive${laserFivePointIndex}`).removeClass("warning");
            $(`#laserFive${laserFivePointIndex}`).addClass("success");
            // ËÆ∞ÂΩ?‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
            if ($scope.toolCoordParam.laserFiveRecord.findIndex(value => value == laserFivePointIndex) != -1) return;
            $scope.toolCoordParam.laserFiveRecord.push(laserFivePointIndex);
        } else {
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].x = null;
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].y = null;
            $scope.toolCoordParam.laserFiveResult[laserFivePointIndex - 1].z = null;
            $(`#laserFive${laserFivePointIndex}`).addClass("warning");
            $(`#laserFive${laserFivePointIndex}`).removeClass("success");
        }
    })

    // ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--‰∫?Á?πÊ≥?ËÆ°ÁÆ?‰º†Ê??Â?®‰ΩçÂßø
    $scope.computeLaserFiveCoord = function() {
        let computetFiveLTCmd = {
            cmd: 659,
            data: {
                content: "ComputeLaserSensorTCP_FivePoint()",
            },
        };
        $scope.toolCoordParam.laserFiveRecordRes = 'loading';
        dataFactory.setData(computetFiveLTCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.laserFiveRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.laserFiveRecordRes = null;
            }, 5000)
            toastFactory.error(status, rsDynamicTags.error_messages[18]);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.laserCalculate = {
                    x: '5.55',
                    y: '5.55',
                    z: '5.55',
                    rx: '5.55',
                    ry: '5.55',
                    rz: '5.55',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('659', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.laserCalculate = handlecompute(JSON.parse(e.detail));
            $scope.toolCoordParam.laserFiveRecordRes = 'success';
        } else {
            $scope.toolCoordParam.laserFiveRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.laserFiveRecordRes = null;
        }, 5000)
    })

    /**
     * ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Â§?È?®--‰∏?Á?πÊ≥?È?çÁΩÆ‰ΩçÂßøÁ?π
     * @param {Number} pointIndex Á?πÁ??Â∫èÂè∑1~3
     */
    let laserThreePointIndex;
    $scope.setLaserThreePoint = function(pointIndex) {
        laserThreePointIndex = pointIndex;
        let setThreeLTPointCmd = {
            cmd: 276,
            data: {
                content: `SetLaserSensorPoint_ThreePoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setThreeLTPointCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#laserThree${laserThreePointIndex}`).removeClass("warning");
                $(`#laserThree${laserThreePointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.toolCoordParam.laserThreeRecord.findIndex(value => value == laserThreePointIndex) != -1) return;
                $scope.toolCoordParam.laserThreeRecord.push(laserThreePointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('276', e => {
        if (e.detail == '1') {
            $(`#laserThree${laserThreePointIndex}`).removeClass("warning");
            $(`#laserThree${laserThreePointIndex}`).addClass("success");
            // ËÆ∞ÂΩ?‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Ê?´Á´Ø--Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
            if ($scope.toolCoordParam.laserThreeRecord.findIndex(value => value == laserThreePointIndex) != -1) return;
            $scope.toolCoordParam.laserThreeRecord.push(laserThreePointIndex);
        } else {
            $(`#laserThree${laserThreePointIndex}`).addClass("warning");
            $(`#laserThree${laserThreePointIndex}`).removeClass("success");
        }
    })

    // ‰º†Ê??Â?®--Ê?∫Â?®‰∫∫Â§?È?®--‰∏?Á?πÊ≥?ËÆ°ÁÆ?‰º†Ê??Â?®‰ΩçÂßø
    $scope.computeLaserThreeCoord = function () {
        let computeThreeLTCmd = {
            cmd: 277,
            data: {
                content: "ComputeLaserSensorTCP_ThreePoint()",
            },
        };
        $scope.toolCoordParam.laserThreeRecordRes = 'loading';
        dataFactory.setData(computeThreeLTCmd).then(() => {}, (status) => {
            $scope.toolCoordParam.laserThreeRecordRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.laserThreeRecordRes = null;
            }, 5000)
            toastFactory.error(status, rsDynamicTags.error_messages[4]);
            /* test */
            if (g_testCode) {
                $scope.toolCoordParam.laserCalculate = {
                    x: '6.66',
                    y: '6.66',
                    z: '6.66',
                    rx: '6.66',
                    ry: '6.66',
                    rz: '6.66',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('277', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.toolCoordParam.laserCalculate = handlecompute(JSON.parse(e.detail));
            $scope.toolCoordParam.laserThreeRecordRes = 'success';
        } else {
            $scope.toolCoordParam.laserThreeRecordRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.laserThreeRecordRes = null;
        }, 5000)
    })

    // ‰øùÂ≠?‰º†Ê??Â?®ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÁ??Áª?Ê??
    $scope.saveLaserCoord = function() {
        if ($scope.toolCoordParam.select.id == 0) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        $scope.toolCoordParam.select.x = $scope.toolCoordParam.laserCalculate.x + "";
        $scope.toolCoordParam.select.y = $scope.toolCoordParam.laserCalculate.y + "";
        $scope.toolCoordParam.select.z = $scope.toolCoordParam.laserCalculate.z + "";
        $scope.toolCoordParam.select.rx = $scope.toolCoordParam.laserCalculate.rx + "";
        $scope.toolCoordParam.select.ry = $scope.toolCoordParam.laserCalculate.ry + "";
        $scope.toolCoordParam.select.rz = $scope.toolCoordParam.laserCalculate.rz + "";
        $scope.toolCoordParam.select.type = $scope.toolCoordParam.modifyToolType.id + "";
        $scope.toolCoordParam.select.installation_site = $scope.toolCoordParam.modifyLaser.id + "";
        if ($scope.toolCoordParam.modifyToolId) {
            $scope.toolCoordParam.select.tool_id_no = $scope.toolCoordParam.modifyToolId;
        }
        if ($scope.toolCoordParam.modifyLoad) {
            $scope.toolCoordParam.select.load_id = $scope.toolCoordParam.modifyLoad.id;
        }
        let saveCmd = {
            cmd: "modify_tool_cdsystem",
            data: $scope.toolCoordParam.select,
        };
        $scope.toolCoordParam.saveLaserRes = 'loading';
        dataFactory.actData(saveCmd).then(() => {
            $scope.toolCoordParam.calibrate = false;
            $scope.toolCoordParam.modifyToolType = null;
            $scope.toolCoordParam.modifyLaser = null;
            getToolCoordData();
            applyToolCoord();
            $scope.toolCoordParam.saveLaserRes = 'success';
            $timeout(function() {
                $scope.toolCoordParam.saveLaserRes = null;
            }, 5000)
            toastFactory.success(rsDynamicTags.success_messages[0]);
        }, (status) => {
            $scope.toolCoordParam.saveLaserRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.saveLaserRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }

    /** ÂÆ?Ê?êÊ??Ëø?Â??Âê?Ê?¥Ê?∞Ê?∞ÊçÆ */
    function updateTCPCorrectionData() {
        let getRobotCfgCmd = {
            cmd: "get_robot_cfg",
        };
        dataFactory.getData(getRobotCfgCmd).then((data) => {
            $scope.diParam.configerableInput.di8 = ~~data.ctl_di8_config + "";
            $scope.diParam.configerableInput.di9 = ~~data.ctl_di9_config + "";
            $scope.diParam.configerableInput.di10 = ~~data.ctl_di10_config + "";
            $scope.diParam.configerableInput.di11 = ~~data.ctl_di11_config + "";
            $scope.diParam.configerableInput.di12 = ~~data.ctl_di12_config + "";
            $scope.diParam.configerableInput.di13 = ~~data.ctl_di13_config + "";
            $scope.diParam.configerableInput.di14 = ~~data.ctl_di14_config + "";
            $scope.diParam.configerableInput.di15 = ~~data.ctl_di15_config + "";
            $scope.diParam.endInput.di1 = ~~data.tool_di1_config + "";
            $scope.diParam.endInput.di2 = ~~data.tool_di2_config + "";
            robotDIList.forEach(item => {
                if ($scope.diParam.configerableInput[item] == "18") {
                    $scope.toolCoordParam.photoElectric.xDI = "18";
                }
                if ($scope.diParam.configerableInput[item] == "19") {
                    $scope.toolCoordParam.photoElectric.yDI = "19";
                }
            });
            robotEndDIList.forEach(item => {
                if ($scope.diParam.endInput[item] == "14") {
                    $scope.toolCoordParam.photoElectric.xDI = "14";
                }
                if ($scope.diParam.endInput[item] == "15") {
                    $scope.toolCoordParam.photoElectric.yDI = "15";
                }
            })
            if ($scope.toolCoordParam.photoElectric.xDI.id != -1 && $scope.toolCoordParam.photoElectric.yDI.id != -1) {
                $scope.toolCoordParam.photoElectric.isSetIO = true;
            } else {
                $scope.toolCoordParam.photoElectric.isSetIO = false;
            }
            $scope.toolCoordParam.photoElectric.coord.x = data.tcp_coord_x;
            $scope.toolCoordParam.photoElectric.coord.y = data.tcp_coord_y;
            $scope.toolCoordParam.photoElectric.coord.z = data.tcp_coord_z;
            $scope.toolCoordParam.photoElectric.coord.rx = data.tcp_coord_a;
            $scope.toolCoordParam.photoElectric.coord.ry = data.tcp_coord_b;
            $scope.toolCoordParam.photoElectric.coord.rz = data.tcp_coord_c;
            if (data.tcp_coord_x == 0 && data.tcp_coord_y == 0 && data.tcp_coord_z == 0 && data.tcp_coord_a == 0 && data.tcp_coord_b == 0 && data.tcp_coord_c == 0) {
                $scope.toolCoordParam.photoElectric.isDeviceConfig = false;
            } else {
                $scope.toolCoordParam.photoElectric.isDeviceConfig = true;
            }
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /** Ëø?Â?•Êø?Â??Ê†°Â??ËÆæÂ§?È?çÁΩÆÈ°µ */
    $scope.enterTCPCorrectionDeviceConfig = function () {
        $scope.toolCoordParam.tabletTool.show = false;
        $scope.toolCoordParam.photoElectric.calParShow = false;
        $scope.toolCoordParam.photoElectric.deviceShow = true;
        checkLocalPoint();
    }

    /** Ëø?Â?•Êø?Â??Ê†°Â??Âè?Ê?∞È?çÁΩÆÈ°µ */
    $scope.enterTCPCorrectionParamConfig = function () {
        $scope.toolCoordParam.tabletTool.show = false;
        $scope.toolCoordParam.photoElectric.deviceShow = false;
        $scope.toolCoordParam.photoElectric.calParShow = true;
    }

    /** Ëø?Â??Êø?Â??Ê†°Â??È°µ */
    $scope.returnTCPCorrectionPage = function () {
        $scope.toolCoordParam.photoElectric.deviceShow = false;
        $scope.toolCoordParam.photoElectric.calParShow = false;
        updateTCPCorrectionData();
    }

    /** CIÂØπÂ∫?Â??Ë?Ωdisable‰∏?Ê??Ê°? */
    $scope.tcpCIOptionsDisabled = function (selectedValue) {
        if (selectedValue != '0' && selectedValue != '18' && selectedValue != '19') {
            return true;
        } else {
            return false;
        }
    }

    /** DIÂØπÂ∫?Â??Ë?Ωdisable‰∏?Ê??Ê°? */
    $scope.tcpDIOptionsDisabled = function (selectedValue) {
        if (selectedValue != '0' && selectedValue != '14' && selectedValue != '15') {
            return true;
        } else {
            return false;
        }
    }

    /** ËøêË°?TCPÊ†°Â??Á®?Â∫è */
    $scope.calibrateToolTCP = function() {
        // Á??Ê?êluaÁ®?Â∫è
        let initProgramCmd = {
            cmd: "apply_internal_program",
            data: {
                name: "FR_CalibrateTheToolTcp.lua"
            }
        }
        $scope.toolCoordParam.photoToolTCPRes = 'loading';
        dataFactory.actData(initProgramCmd).then(() => {
            g_fileNameForUpload = "FR_CalibrateTheToolTcp.lua";
            $scope.toolCoordParam.runFlag = 1;
            $scope.index_uploadProgName();
        }, (status) => {
            $scope.toolCoordParam.photoToolTCPRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.photoToolTCPRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }

    /** ËÆ°ÁÆ?TCPÊø?Â??Ë?™Â?®Ê†?ÂÆ?Á??XYZ */
    function computeXYZ() {
        let setCmd = {
            cmd: 647,
            data: {
                content: `TCPComputeXYZ(3,0,{0,0,0},{0,0,0},{0,0,0},{0,0,0})`
            }
        }
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('647', e => {
        if (e.detail) {
            let arr = e.detail.split(',');
            $scope.toolCoordParam.toolCalculate['x'] = arr[0];
            $scope.toolCoordParam.toolCalculate['y'] = arr[1];
            $scope.toolCoordParam.toolCalculate['z'] = arr[2];
            $scope.toolCoordParam.photoToolTCPRes = 'success';
        } else {
            $scope.toolCoordParam.photoToolTCPRes = 'error';
        }
        $timeout(function() {
            $scope.toolCoordParam.photoToolTCPRes = null;
        }, 5000)
    });

    /** ËÆ°ÁÆ?TCPPÊø?Â??Ë?™Â?®Ê†?ÂÆ?Á??RPY */
    function computeRPY() {
        let setCmd = {
            cmd: 646,
            data: {
                content: `TCPComputeRPY({0,0,0,0,0,0},{0,0,0,0,0,0},{0,0,0,0,0,0},0,10000,{0,0},{0,0})`
            }
        }
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('646', e => {
        let arr = e.detail.split(',');
        $scope.toolCoordParam.toolCalculate['rx'] = arr[0];
        $scope.toolCoordParam.toolCalculate['ry'] = arr[1];
        $scope.toolCoordParam.toolCalculate['rz'] = arr[2];
    });

    /** Ê£?Ê?•Â±?È?®Á§∫Ê??Á?πÊ?ØÂê¶Â≠?Â?® */
    function checkLocalPoint() {
        const checkParams = {
            cmd: 'get_checklocalpoint',
            data: {
                local: "FR_CalibrateTheSensorCoodinateSystem.lua",
                name: "FR_CalibrateTeachingCenterPose"
            }
        }
        dataFactory.getData(checkParams).then((data) => {
            if (data.result == '1') {
                $scope.toolCoordParam.photoElectric.isSetCenterP = true;
            } else {
                $scope.toolCoordParam.photoElectric.isSetCenterP = false;
            }
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /** Â?ùÂß?Â??Á®?Â∫èÂπ∂ËÆ∞ÂΩ?TCP‰∏≠Âø?Á?π */
    $scope.recordCorrectionCenterPoint = function () {
        //Á??Ê?êluaÁ®?Â∫è
        let initProgramCmd = {
            cmd: "apply_internal_program",
            data: {
                name: "FR_CalibrateTheSensorCoodinateSystem.lua"
            }
        }
        dataFactory.actData(initProgramCmd).then(() => {
            g_fileNameForUpload = "FR_CalibrateTheSensorCoodinateSystem.lua";
            let savePointCmd = {
                cmd: "save_local_point",
                data: {
                    local: g_fileNameForUpload,
                    name: "FR_CalibrateTeachingCenterPose",
                    speed: $scope.velocity,
                    elbow_speed: $scope.velocity,
                    acc: $scope.acceleration,
                    elbow_acc: $scope.acceleration,
                    toolnum: $scope.currentCoord + "",
                    workpiecenum: $scope.currentWobjCoord + "",
                    update_programfile: 1
                }
            };
            dataFactory.actData(savePointCmd).then(() => {
                $scope.toolCoordParam.photoElectric.isSetCenterP = true;
            }, (status) => {
                $scope.toolCoordParam.photoElectric.isSetCenterP = false;
                toastFactory.error(status);
            });
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /** ËÆæÁΩÆÂ??Á?µËÆæÂ§?Âè?Ê?∞ */
    $scope.setCorrectionDeviceParam = function(offset) {
        if (offset == '' || offset == undefined || offset == null) {
            toastFactory.info(rsDynamicTags.info_messages[51]);
            return;
        }
        $scope.setSysVarValue(4, offset);
        $scope.toolCoordParam.photoElectric.isSetParam = true;
    }

    /**
     * ËÆæÁΩÆÂ??Á?µÊ†°Â??Âè?Ê?∞
     * @param {string} offsetX XÊ?πÂê?ÂÅèÁßª
     * @param {string} offsetY YÊ?πÂê?ÂÅèÁßª
     * @param {string} offsetZ ZÊ?πÂê?ÂÅèÁßª
     * @returns 
     */
    $scope.setCorrectionParam = function(offsetX, offsetY, offsetZ) {
        if (offsetX == '' || offsetX == undefined || offsetX == null) {
            toastFactory.info(rsDynamicTags.info_messages[51]);
            return;
        }
        if (offsetY == '' || offsetY == undefined || offsetY == null) {
            toastFactory.info(rsDynamicTags.info_messages[51]);
            return;
        }
        if (offsetZ == '' || offsetZ == undefined || offsetZ == null) {
            toastFactory.info(rsDynamicTags.info_messages[51]);
            return;
        }
        $scope.setSysVarValue(1, offsetX);
        $scope.setSysVarValue(2, offsetY);
        $scope.setSysVarValue(3, offsetZ);
        $scope.toolCoordParam.photoElectric.isSetCalPar = true;
        $scope.toolCoordParam.photoElectric.isCalParConfig = true;
    }

    /** ËøêË°?Êø?Â??ËÆæÂ§?Ê†?ÂÆ?Á®?Â∫è */
    $scope.runCorrectionProgram = function () {
        if (!$scope.toolCoordParam.photoElectric.isSetIO && !$scope.toolCoordParam.photoElectric.isSetCenterP && !$scope.toolCoordParam.photoElectric.isSetParam) {
            toastFactory.info(rsDynamicTags.info_messages[52]);
            return;
        }
        $scope.toolCoordParam.runFlag = 0;
        $scope.index_uploadProgName();
    }

    /** Ëø?Â?•Âπ≥ÊùøÂ∑•Â?∑È?çÁΩÆÁ??Èù¢ */
    $scope.enterTabletToolConfig = function() {
        $scope.toolCoordParam.photoElectric.deviceShow = false;
        $scope.toolCoordParam.photoElectric.calParShow = false;
        $scope.toolCoordParam.tabletTool.show = true;
    }

    /** Ëø?Â??Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?Â?ùÂß?Á??Èù¢ */
    $scope.returnTabletToolPage = function() {
        $scope.toolCoordParam.tabletTool.show = false;
    }

    /** Á§∫Ê??Âπ≥ÊùøÂ∑•Â?∑Âπ≥Èù¢Âè?Ë??Á?π */
    $scope.recordPlanePoint = function () {
        //Á??Ê?êluaÁ®?Â∫è
        let initProgramCmd = {
            cmd: "apply_internal_program",
            data: {
                name: "FR_CalibrateTheToolTcpPlane.lua"
            }
        }
        dataFactory.actData(initProgramCmd).then(() => {
            g_fileNameForUpload = "FR_CalibrateTheToolTcpPlane.lua";
            let savePointCmd = {
                cmd: "save_local_point",
                data: {
                    local: g_fileNameForUpload,
                    name: "FR_CalibratePlaneReferencePose",
                    speed: $scope.velocity,
                    elbow_speed: $scope.velocity,
                    acc: $scope.acceleration,
                    elbow_acc: $scope.acceleration,
                    toolnum: $scope.currentCoord + "",
                    workpiecenum: $scope.currentWobjCoord + "",
                    update_programfile: 1
                }
            };
            dataFactory.actData(savePointCmd).then(() => {
                $scope.toolCoordParam.tabletTool.isSetPoint = true;
            }, (status) => {
                $scope.toolCoordParam.tabletTool.isSetPoint = false;
                toastFactory.error(status);
            });
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /** ËøêË°?Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?Á®?Â∫è */
    $scope.runTabletToolProgram = function() {
        if (!$scope.toolCoordParam.tabletTool.isSetPoint) {
            toastFactory.info(rsDynamicTags.info_messages[52]);
            return;
        }
        g_fileNameForUpload = "FR_CalibrateTheToolTcpPlane.lua";
        $scope.toolCoordParam.runFlag = 2;
        $scope.toolCoordParam.tabletToolTCPRes = 'loading';
        $scope.index_uploadProgName();
    }

    /** Ë?∑Âè?Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?Áª?Ê?? */
    function getTabletToolCorrectResult() {
        let setCmd = {
            cmd: 1040,
            data: {
                content: `TCPPlaneComputeXYZ(${$scope.variableValueJson[0].value},${$scope.variableValueJson[1].value},${$scope.variableValueJson[2].value})`
            }
        }
        dataFactory.setData(setCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
        });
    };
    document.getElementById('robotSetting').addEventListener('1040', e => {
        if (e.detail) {
            let arr = e.detail.split(',');
            $scope.toolCoordParam.toolCalculate['x'] = arr[0];
            $scope.toolCoordParam.toolCalculate['y'] = arr[1];
            $scope.toolCoordParam.toolCalculate['z'] = arr[2];
            $scope.toolCoordParam.toolCalculate['rx'] = $scope.toolCoordParam.select.rx + "";
            $scope.toolCoordParam.toolCalculate['ry'] = $scope.toolCoordParam.select.ry + "";
            $scope.toolCoordParam.toolCalculate['rz'] = $scope.toolCoordParam.select.rz + "";
            $scope.toolCoordParam.tabletToolTCPRes = 'success';
            $timeout(function() {
                $scope.toolCoordParam.tabletToolTCPRes = null;
            }, 5000)
        } else {
            $scope.toolCoordParam.tabletToolTCPRes = 'error';
            $timeout(function() {
                $scope.toolCoordParam.tabletToolTCPRes = null;
            }, 5000)
        }
    });

    /** ËøêË°?ÂÆ?Ê?êÂ§?Áê? */
    document.getElementById('robotSetting').addEventListener('program-completion', e => {
        if (e.detail == 1) {
            switch ($scope.toolCoordParam.runFlag) {
                case 0:
                    $scope.toolCoordParam.photoElectric.isRunPro = true;
                    updateTCPCorrectionData();
                    break;
                case 1:
                    $scope.toolCoordParam.toolCalculate = {};
                    computeXYZ();
                    computeRPY();
                    break;
                // Âπ≥ÊùøÂ∑•Â?∑Ê†?ÂÆ?ËÆ°ÁÆ?
                case 2:
                    $scope.toolCoordParam.toolCalculate = {};
                    getTabletToolCorrectResult();
                    break;
                default:
                    break;
            }
            $scope.toolCoordParam.runFlag = -1;
        }
    });

    /**
     * Ê£?Ê?•Â±?È?®Á§∫Ê??Á?πÊ?ØÂê¶Â≠?Â?®
     * @param {string} editFileName Â±?È?®Á§∫Ê??Á?πÂØπÂ∫?Á®?Â∫èÂêç
     * @param {string} localPointName Â±?È?®Á§∫Ê??Á?π
     */
    function getCheckLocalPoint(editFileName, localPointName) {
        const checkParams = {
            cmd: 'get_checklocalpoint',
            data: {
                local: editFileName,
                name: localPointName
            }
        }
        dataFactory.getData(checkParams).then((data) => {
            if (data.result == '1') {
                switch (localPointName) {
                    case 'FR_CalibratePlaneReferencePose':
                        $scope.toolCoordParam.tabletTool.isSetPoint = true;
                        break;
                    case 'ForceSensorAutoZero':
                        $scope.loadParam.autoPointFlag = true;
                        break;
                    default:
                        break;
                }
            } else {
                switch (localPointName) {
                    case 'FR_CalibratePlaneReferencePose':
                        $scope.toolCoordParam.tabletTool.isSetPoint = false;
                        break;
                    case 'ForceSensorAutoZero':
                        $scope.loadParam.autoPointFlag = false;
                        break;
                    default:
                        break;
                }
            }
        }, (status) => {
            toastFactory.error(status);
        });
    }
    /** ./Â∑•Â?∑ÂùêÊ†?Á≥ªËÆæÁΩÆ */

    /* Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªËÆæÁΩÆ */
    // Ë?∑Âè?Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    function getExToolCoordData() {
        let getCmd = {
            cmd: "get_ex_tool_cdsystem",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
				handledecimal(data);
                $scope.exToolCoordeData = data;
                if ($scope.exToolCoordParam.select.id) {
					$scope.exToolCoordParam.select = $scope.exToolCoordeData[$scope.exToolCoordParam.select.name];
				} else {
                    if ($scope.currentCoord <= $scope.toolCoordeTotal) {
                        $scope.exToolCoordParam.select = $scope.exToolCoordeData.etoolcoord0;
                    } else {
                        $scope.exToolCoordParam.select = $scope.exToolCoordeData["etoolcoord"+(~~$scope.currentCoord - $scope.toolCoordeTotal)];
                    }
				}
            }, (status) => {
                toastFactory.error(status, rsDynamicTags.success_messages[5]);
                /* test */
                if (g_testCode) {
                    $scope.exToolCoordeData = testDataService.testExToolCoordeData;
                    if ($scope.exToolCoordParam.select.id) {
                        $scope.exToolCoordParam.select = $scope.exToolCoordeData[$scope.exToolCoordParam.select.name];
                    } else {
                        if ($scope.currentCoord <= $scope.indexToolCoordeTotal) {
                            $scope.exToolCoordParam.select = $scope.exToolCoordeData.etoolcoord0;
                        } else {
                            $scope.exToolCoordParam.select = $scope.exToolCoordeData["etoolcoord"+(~~$scope.currentCoord - $scope.toolCoordeTotal)];
                        }
                    }
                }
                /* ./test */
            });
    };

    /**
     * Â??Êç¢ÂùêÊ†?Á≥ªÂê?Â?§Ê?≠id‰∏∫0Ôº?Â??Â∞?‰øÆÊ?πÂê?ÂØºÈ?êË?è
     * @param {object} data ÂùêÊ†?Á≥ªÊ?∞ÊçÆÔº?Â∑•Â?∑Ôº?Â§?È?®Â∑•Â?∑Ôº?Â∑•‰ª∂Ôº?Ê?©Â±?ËΩ¥Ôº?
     */
    $scope.changeExCoord = function (data) {
        if (data.id == 0) {
            $scope.exToolCoordParam.calibrate = false;
        }
    }

    /**
     * Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªÊ?ç‰Ω?Ê??È?Æ
     * @param {int} type Ê??È?ÆÁ±ªÂ??
    */
    $scope.operateExToolCoord = function(type) {
        switch (type) {
            // ÂùêÊ†?Á≥ªÊ†?ÂÆ?
            case 'edit':
                newExTCPCoord()
                break;
            // Â∫?Á?®
            case 'apply':
                applyExToolCoord();
                break;
            // È?çÂ?ΩÂêç
            case 'rename':
                renameExToolCoordName();
                break;
            // Ê∏?È?§
            case 'clear':
                clearExToolCoord();
                break;
            default:
                break;
        }
    }

    // Â∫?Á?®Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ª
    function applyExToolCoord() {
        var extoolCoordString = "SetExToolCoord(" + (~~($scope.exToolCoordParam.select.id) + $scope.toolCoordeTotal) + ","
            + $scope.exToolCoordParam.select.ex + "," + $scope.exToolCoordParam.select.ey + "," + $scope.exToolCoordParam.select.ez + ","
            + $scope.exToolCoordParam.select.erx + "," + $scope.exToolCoordParam.select.ery + "," + $scope.exToolCoordParam.select.erz + ","
            + $scope.exToolCoordParam.select.tx + "," + $scope.exToolCoordParam.select.ty + "," + $scope.exToolCoordParam.select.tz + ","
            + $scope.exToolCoordParam.select.trx + "," + $scope.exToolCoordParam.select.try + "," + $scope.exToolCoordParam.select.trz + ")";
        let setexToolCoordCmd = {
            cmd: 330,
            data: {
                content: extoolCoordString,
            },
        };
        dataFactory.setData(setexToolCoordCmd).then(() => {
        }, (status) => {
            getExToolCoordData();
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('330', e => {
        getExToolCoordData();
    })

    // ‰øÆÊ?πÂ§?È?®TCPÂùêÊ†?Á≥ªÊ?ç‰Ω?Ê?æÁ§∫
    function newExTCPCoord() {
        if($scope.exToolCoordParam.select.id == 0){
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        if (!$scope.exToolCoordParam.calibrate) {
            $scope.cancelExToolTCPSet();
        }
        $scope.exToolCoordParam.calibrate = !$scope.exToolCoordParam.calibrate;
    }

    // È?çÂ?ΩÂêçÂΩ?Â?çÂùêÊ†?Á≥ªÂêçÁß∞
    function renameExToolCoordName() {
        if ($scope.exToolCoordParam.select.user_name == "" || $scope.exToolCoordParam.select.user_name == null) {
            toastFactory.info(rsDynamicTags.info_messages[10]);
        } else {
            let saveCmd = {
                cmd: "modify_ex_tool_cdsystem",
                data: $scope.exToolCoordParam.select,
            };
            dataFactory.actData(saveCmd).then(() => {
                if ($scope.exToolCoordParam.select.id == ($scope.currentCoord - $scope.toolCoordeTotal)) {
                    g_renameExToolCoordFlag = 1;
                }
                getExToolCoordData();
            }, (status) => {
                toastFactory.error(status);
                /* test */
                if (g_testCode) {
                    getExToolCoordData();
                }
                /* ./test */
            });
        }
    }

    // Ê∏?Á©∫ÂΩ?Â?çÂ§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ª
    let clearExToolCoordFlg = 0;
    function clearExToolCoord() {
        if (clearExToolCoordFlg == 0) {
            toastFactory.info(rsDynamicTags.info_messages[2]);
            clearExToolCoordFlg = 1;
        } else {
            clearExToolCoordFlg = 0;
            let sendData = {
                name: $scope.exToolCoordParam.select.name,
                user_name: $scope.exToolCoordParam.select.user_name,
                id: $scope.exToolCoordParam.select.id,
                ex: "0",
                ey: "0",
                ez: "0",
                erx: "0",
                ery: "0",
                erz: "0",    
                tx: "0",
                ty: "0",
                tz: "0",
                trx: "0",
                try: "0",
                trz: "0"   
            };
            let saveCmd = {
                cmd: "modify_ex_tool_cdsystem",
                data: sendData,
            };
            dataFactory.actData(saveCmd).then(() => {
                getExToolCoordData();
            }, (status) => {
                toastFactory.error(status);
            });
        }
    }

    /**
     * Â§?È?®TCFÂè?Ë??Á?πÊ†?ÂÆ?
     * @param {Number} pointIndex Á?π‰ΩçÂ∫èÂè∑1~3
     */
    let exTcpPointIndex;
    $scope.setExTCPPoint = function(pointIndex) {
        exTcpPointIndex = pointIndex;
        let setExTCPCmd = {
            cmd: 326,
            data: {
                content: `SetExTCPPoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setExTCPCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#exToolTCP${exTcpPointIndex}`).removeClass("warning");
                $(`#exToolTCP${exTcpPointIndex}`).addClass("success");
                if ($scope.exToolCoordParam.tcpRecord.findIndex(value => value == exTcpPointIndex) != -1) return;
                $scope.exToolCoordParam.tcpRecord.push(exTcpPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('326', e => {
        if (e.detail == '1') {
            $(`#exToolTCP${exTcpPointIndex}`).removeClass("warning");
            $(`#exToolTCP${exTcpPointIndex}`).addClass("success");
            if ($scope.exToolCoordParam.tcpRecord.findIndex(value => value == exTcpPointIndex) != -1) return;
            $scope.exToolCoordParam.tcpRecord.push(exTcpPointIndex);
        } else {
            $(`#exToolTCP${exTcpPointIndex}`).addClass("warning");
            $(`#exToolTCP${exTcpPointIndex}`).removeClass("success");
        }
    })

    // ËÆ°ÁÆ?Â§?È?®TCP
    $scope.computeExToolTCP = function() {
        let computeExToolTCPCmd = {
            cmd: 327,
            data: {
                content: "ComputeExTCF()",
            },
        };
        $scope.exToolCoordParam.tcpRes1 = 'loading';
        dataFactory.setData(computeExToolTCPCmd).then(() => {}, (status) => {
            $scope.exToolCoordParam.tcpRes1 = 'error';
            $timeout(function() {
                $scope.exToolCoordParam.tcpRes1 = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.exToolCoordParam.tcpCalculate = {
                    x: '7.77',
                    y: '7.77',
                    z: '7.77',
                    rx: '7.77',
                    ry: '7.77',
                    rz: '7.77',
                }
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?Â§?È?®TCPÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('327', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.exToolCoordParam.tcpCalculate = handlecompute(JSON.parse(e.detail));
            $scope.exToolCoordParam.tcpRes1 = 'success';
        } else {
            $scope.exToolCoordParam.tcpRes1 = 'error';
        }
        $timeout(function() {
            $scope.exToolCoordParam.tcpRes1 = null;
        }, 5000)
    })

    // Âè?Ê∂?Â§?È?®TCPÁ??Ê†?ÂÆ?Áª?Ê??
    $scope.cancelExToolTCPSet = function() {
        $scope.exToolCoordParam.tcpCalculate = null;
        // Â∑•Â?∑Â??Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.exToolCoordParam.tcpRecord.forEach(item => {
            $(`#exToolTCP${item}`).removeClass("warning");
            $(`#exToolTCP${item}`).removeClass("success");
        });
        $scope.exToolCoordParam.tcpRecord = [];
        $scope.exToolCoordParam.isTcf = false;
        $scope.cancelExToolTCFSet();
    }

    /**
     * Â∑•Â?∑TCFÂè?Ë??Á?πÊ†?ÂÆ?
     * @param {Number} pointIndex Á?π‰ΩçÂ∫èÂè∑1~6
     */
    let exTcfPointIndex;
    $scope.setExTCFPoint = function(pointIndex) {
        exTcfPointIndex = pointIndex;
        let setExTCPToolCmd = {
            cmd: 328,
            data: {
                content: `SetExTCPToolPoint(${pointIndex})`,
            },
        };
        dataFactory.setData(setExTCPToolCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#exToolTCF${exTcfPointIndex}`).removeClass("warning");
                $(`#exToolTCF${exTcfPointIndex}`).addClass("success");
                if ($scope.exToolCoordParam.tcfRecord.findIndex(value => value == exTcfPointIndex) != -1) return;
                $scope.exToolCoordParam.tcfRecord.push(exTcfPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('328', e => {
        if (e.detail == '1') {
            $(`#exToolTCF${exTcfPointIndex}`).removeClass("warning");
            $(`#exToolTCF${exTcfPointIndex}`).addClass("success");
            if ($scope.exToolCoordParam.tcfRecord.findIndex(value => value == exTcfPointIndex) != -1) return;
            $scope.exToolCoordParam.tcfRecord.push(exTcfPointIndex);
        } else {
            $(`#exToolTCF${exTcfPointIndex}`).addClass("warning");
            $(`#exToolTCF${exTcfPointIndex}`).removeClass("success");
        }
    })

    // ËÆ°ÁÆ?Â∑•Â?∑TCF
    $scope.computeExToolTCF = function() {
        let computeExToolTCFCmd = {
            cmd: 329,
            data: {
                content: "ComputeToolExTCF()",
            },
        };
        $scope.exToolCoordParam.tcpRes2 = 'loading';
        dataFactory.setData(computeExToolTCFCmd).then(() => {}, (status) => {
            $scope.exToolCoordParam.tcpRes2 = 'error';
            $timeout(function() {
                $scope.exToolCoordParam.tcpRes2 = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.exToolCoordParam.tcfCalculate = {
                    x: '8.88',
                    y: '8.88',
                    z: '8.88',
                    rx: '8.88',
                    ry: '8.88',
                    rz: '8.88',
                }
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?Â∑•Â?∑TCFÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('329', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.exToolCoordParam.tcfCalculate = handlecompute(JSON.parse(e.detail));
            $scope.exToolCoordParam.tcpRes2 = 'success';
        } else {
            $scope.exToolCoordParam.tcpRes2 = 'error';
        }
        $timeout(function() {
            $scope.exToolCoordParam.tcpRes2 = null;
        }, 5000)
    })

    // Âè?Ê∂?Â∑•Â?∑TCFÁ??Ê†?ÂÆ?Áª?Ê??
    $scope.cancelExToolTCFSet = function() {
        $scope.exToolCoordParam.tcfCalculate = null;
        // Â∑•Â?∑Â??Á?πÊ≥?Ê†?ÂÆ?Á?πÊ∏?Á©∫
        $scope.exToolCoordParam.tcfRecord.forEach(item => {
            $(`#exToolTCF${item}`).removeClass("warning");
            $(`#exToolTCF${item}`).removeClass("success");
        });
        $scope.exToolCoordParam.tcfRecord = [];
    }

    // ‰øùÂ≠?Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ª
    $scope.saveExToolCoord = function() {
        if ($scope.exToolCoordParam.select.id == 0) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        $scope.exToolCoordParam.select.ex = $scope.exToolCoordParam.tcpCalculate.x + "";
        $scope.exToolCoordParam.select.ey = $scope.exToolCoordParam.tcpCalculate.y + "";
        $scope.exToolCoordParam.select.ez = $scope.exToolCoordParam.tcpCalculate.z + "";
        $scope.exToolCoordParam.select.erx = $scope.exToolCoordParam.tcpCalculate.rx + "";
        $scope.exToolCoordParam.select.ery = $scope.exToolCoordParam.tcpCalculate.ry + "";
        $scope.exToolCoordParam.select.erz = $scope.exToolCoordParam.tcpCalculate.rz + "";
        $scope.exToolCoordParam.select.tx = $scope.exToolCoordParam.tcfCalculate.x + "";
        $scope.exToolCoordParam.select.ty = $scope.exToolCoordParam.tcfCalculate.y + "";
        $scope.exToolCoordParam.select.tz = $scope.exToolCoordParam.tcfCalculate.z + "";
        $scope.exToolCoordParam.select.trx = $scope.exToolCoordParam.tcfCalculate.rx + "";
        $scope.exToolCoordParam.select.try = $scope.exToolCoordParam.tcfCalculate.ry + "";
        $scope.exToolCoordParam.select.trz = $scope.exToolCoordParam.tcfCalculate.rz + "";
        let saveCmd = {
            cmd: "modify_ex_tool_cdsystem",
            data: $scope.exToolCoordParam.select,
        };
        $scope.exToolCoordParam.saveRes = 'loading';
        dataFactory.actData(saveCmd).then(() => {
            $scope.exToolCoordParam.calibrate = false;
            getExToolCoordData();
            $scope.exToolCoordParam.saveRes = 'success';
            $timeout(function() {
                $scope.exToolCoordParam.saveRes = null;
            }, 5000)
        }, (status) => {
            $scope.exToolCoordParam.saveRes = 'error';
            $timeout(function() {
                $scope.exToolCoordParam.saveRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    /** ./Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªËÆæÁΩÆ */

    /** Â∑•‰ª∂ÂùêÊ†?Á≥ªËÆæÁΩÆ */
    // Ê†°È™?Â∑•‰ª∂ÂùêÊ†?Á≥ªÊ?ØÂê¶Ê?πÂ?®
    function checkWobjCoord() {
        const originalWobj = $scope.originwobjCoordeData[$scope.wobjCoordParam.select.name];
        if((parseFloat(originalWobj.x) != parseFloat($scope.wobjCoordParam.select.x))
            || (parseFloat(originalWobj.y) != parseFloat($scope.wobjCoordParam.select.y))
            || (parseFloat(originalWobj.z) != parseFloat($scope.wobjCoordParam.select.z))
            || (parseFloat(originalWobj.rx) != parseFloat($scope.wobjCoordParam.select.rx))
            || (parseFloat(originalWobj.ry) != parseFloat($scope.wobjCoordParam.select.ry))
            || (parseFloat(originalWobj.rz) != parseFloat($scope.wobjCoordParam.select.rz))
        ) {
            $('#wobjModal').modal('show');
        } else {
            applyWObjCoord();
        }
    }

    // Ë?∑Âè?Â∑•‰ª∂ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    function getWobjCoordData() {
        let getCmd = {
            cmd: "get_wobj_tool_cdsystem",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                handledecimal(data);
                $scope.wobjCoordeData = JSON.parse(JSON.stringify(data));
                $scope.originwobjCoordeData = JSON.parse(JSON.stringify(data));
				if ($scope.wobjCoordParam.select.id) {
					$scope.wobjCoordParam.select = $scope.wobjCoordeData[$scope.wobjCoordParam.select.name];
				} else {
                    if ($scope.currentWobjCoord) {
                        $scope.wobjCoordParam.select = $scope.wobjCoordeData["wobjcoord"+~~$scope.currentWobjCoord];
                    } else {
                        $scope.wobjCoordParam.select = $scope.wobjCoordeData.wobjcoord0;
                    }
				}
                $scope.wobjCoordParam.reference = $scope.wobjCoordeData[`wobjcoord${~~$scope.wobjCoordParam.select.reference}`];
            }, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[6]);
                /* test */
                if (g_testCode) {
                    $scope.wobjCoordeData = JSON.parse(JSON.stringify(testDataService.testWobjCoordeData));
                    $scope.originwobjCoordeData = JSON.parse(JSON.stringify(testDataService.testWobjCoordeData));
                    if ($scope.wobjCoordParam.select.id) {
                        $scope.wobjCoordParam.select = $scope.wobjCoordeData[$scope.wobjCoordParam.select.name];
                    } else {
                        if ($scope.currentWobjCoord) {
                            $scope.wobjCoordParam.select = $scope.wobjCoordeData["wobjcoord"+~~$scope.currentWobjCoord];
                            
                        } else {
                            $scope.wobjCoordParam.select = $scope.wobjCoordeData.wobjcoord0;
                        }
                    }
                    $scope.wobjCoordParam.reference = $scope.wobjCoordeData[`wobjcoord${~~$scope.wobjCoordParam.select.reference}`];
                }
                /* ./test */
            });
    };

    /**
     * Â∑•‰ª∂ÂùêÊ†?Á≥ªÊ??È?ÆÁº?Ëæ?
     * @param {int} type Ê??È?ÆÁ±ªÂ??
    */
    $scope.operateWobjCoord = function(type) {
        switch (type) {
            // ÂùêÊ†?Á≥ªÊ†?ÂÆ?
            case 'edit':
                newWobjCoord();
                break;
            // Â∫?Á?®
            case 'apply':
                checkWobjCoord();
                break;
            // Ê∏?È?§
            case 'clear':
                clearWobjCoord();
                break;
            default:
                break;
        }
    }

    /**
     * Â??Êç¢Â§?È?®Â∑•Â?∑ÂùêÊ†?Á≥ªÂê?Â?§Ê?≠id‰∏∫0Ôº?Â??Â∞?‰øÆÊ?πÂê?ÂØºÈ?êË?è
     * @param {object} data ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
     */
    $scope.changeWobjCoord = function (data) {
        if (data.id == 0) {
            $scope.wobjCoordParam.calibrate = false;
        }
        $scope.wobjCoordParam.reference = $scope.wobjCoordeData[`wobjcoord${~~data.reference}`];
        $scope.cancelWobjCoord();
    }

    // Â∫?Á?®Â∑•‰ª∂ÂùêÊ†?Á≥ª
    function applyWObjCoord() {
        let wobjCoordString = "SetWObjCoord(" + $scope.wobjCoordParam.select.id + "," + $scope.wobjCoordParam.select.x + "," + $scope.wobjCoordParam.select.y + ","
            + $scope.wobjCoordParam.select.z + "," + $scope.wobjCoordParam.select.rx + "," + $scope.wobjCoordParam.select.ry + "," + $scope.wobjCoordParam.select.rz + ","
            + $scope.wobjCoordParam.reference.id + ")";
        let setWObjCoordCmd = {
            cmd: 251,
            data: {
                content: wobjCoordString,
            },
        };
        dataFactory.setData(setWObjCoordCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    // ‰øÆÊ?πÂ∑•‰ª∂ÂùêÊ†?Á≥ªÊ?ç‰Ω?Ê?æÁ§∫
    function newWobjCoord() {
        if ($scope.wobjCoordParam.select.id == 0) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        if (!$scope.wobjCoordParam.calibrate) {
            $scope.cancelWobjCoord();
        }
        $scope.wobjCoordParam.calibrate = !$scope.wobjCoordParam.calibrate;
    }

    // ‰øÆÊ?πÂ∑•‰ª∂ÂùêÊ†?Á≥ª
    $scope.modifyWobjCoord = function() {
        $('#wobjModal').modal('hide');
        if (0 == $scope.wobjCoordParam.select.id) {
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        let saveCmd = {
            cmd: "modify_wobj_tool_cdsystem",
            data: $scope.wobjCoordParam.select,
        };
        dataFactory.actData(saveCmd).then(() => {
            applyWObjCoord();
            document.dispatchEvent(new CustomEvent('update_wobjCoord_data', { bubbles: true, cancelable: true, composed: true }));
        }, (status) => {
            toastFactory.error(status);
        });
    }

    // Ê∏?Á©∫ÂΩ?Â?çÂ∑•‰ª∂ÂùêÊ†?Á≥ª
    let clearWobjCoordFlg = 0;
    function clearWobjCoord() {
        if (clearWobjCoordFlg == 0) {
            toastFactory.info(rsDynamicTags.info_messages[2]);
            clearWobjCoordFlg = 1;
        } else {
            clearWobjCoordFlg = 0;
            var senddata = {
                "name": $scope.wobjCoordParam.select.name,
                "id": $scope.wobjCoordParam.select.id,
                "x": "0",
                "y": "0",
                "z": "0",
                "rx": "0",
                "ry": "0",
                "rz": "0",
                "reference": $scope.wobjCoordParam.select.name
            }
            let saveCmd = {
                cmd: "modify_wobj_tool_cdsystem",
                data: senddata,
            };
            dataFactory.actData(saveCmd).then(() => {
                getWobjCoordData();
                document.dispatchEvent(new CustomEvent('update_wobjCoord_data', { bubbles: true, cancelable: true, composed: true }));
            }, (status) => {
                toastFactory.error(status);
            });
        }
    }

    /**
     * Â∑•‰ª∂ÂùêÊ†?Á≥ªÂè?Ë??Á?π
     * @param {Number} pointIndex Á?π‰ΩçÂ∫èÂè∑1~3
     * @returns 
     */
    let wobjPointIndex;
    $scope.setWobjPoint = function(pointIndex) {
        /* test */
        if (g_testCode) {
            $scope.currentCoord = 1;
        }
        /* ./test */
        if ($scope.currentCoord == 0) {
            toastFactory.info(rsDynamicTags.info_messages[11]);
            return
        };
        wobjPointIndex = pointIndex;
        let setWobjPointCmd = {
            cmd: 249,
            data: {
                content: `SetWObjCoordPoint(${wobjPointIndex})`,
            },
        };
        dataFactory.setData(setWobjPointCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#wobjTool${wobjPointIndex}`).removeClass("warning");
                $(`#wobjTool${wobjPointIndex}`).addClass("success");
                // ËÆ∞ÂΩ?Â∑•Â?∑Â?≠Á?πÊ≥?ËÆæÁΩÆÁ??Âè?Ë??Á?π‰∏™Ê?∞Á??Ê?∞Áª?
                if ($scope.wobjCoordParam.record.findIndex(value => value == wobjPointIndex) != -1) return;
                $scope.wobjCoordParam.record.push(wobjPointIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('249', e => {
        if (e.detail == '1') {
            $(`#wobjTool${wobjPointIndex}`).removeClass("warning");
            $(`#wobjTool${wobjPointIndex}`).addClass("success");
            if ($scope.wobjCoordParam.record.findIndex(value => value == wobjPointIndex) != -1) return;
            $scope.wobjCoordParam.record.push(wobjPointIndex);
        } else {
            $(`#wobjTool${wobjPointIndex}`).addClass("warning");
            $(`#wobjTool${wobjPointIndex}`).removeClass("success");
        }
    })

    /**
     * ËÆ°ÁÆ?Â∑•‰ª∂TCF
     * @param {int} methodId Ê†?ÂÆ?Ê?πÊ≥?Ôº?0-Â??Á?π-xËΩ¥-zËΩ¥Ôº?1-Â??Á?π-xËΩ¥-xy+Âπ≥Èù¢
     * @param {int} refFrame Âè?Ë??Â∑•‰ª∂ÂùêÊ†?Á≥ªÔº?Ë??Â?¥[0~19]
     */
    $scope.computeWObjCoord = function(methodId,refFrame) {
        let computeWObjCoordCmd = {
            cmd: 250,
            data: {
                content: `ComputeWObjCoord(${methodId},${refFrame})`
            },
        };
        $scope.wobjCoordParam.computeRes = 'loading';
        dataFactory.setData(computeWObjCoordCmd).then(() => {}, (status) => {
            $scope.wobjCoordParam.computeRes = 'error';
            $timeout(function() {
                $scope.wobjCoordParam.computeRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.wobjCoordParam.calculate = {
                    x: '9.99',
                    y: '9.99',
                    z: '9.99',
                    rx: '9.99',
                    ry: '9.99',
                    rz: '9.99',
                }
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?Â∑•‰ª∂TCPÂ∑•Â?∑Ê?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('250', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.wobjCoordParam.calculate = handlecompute(JSON.parse(e.detail));
            $scope.wobjCoordParam.computeRes = 'success';
        } else {
            $scope.wobjCoordParam.computeRes = 'error';
        }
        $timeout(function() {
            $scope.wobjCoordParam.computeRes = null;
        }, 5000)
    })

    // Âè?Ê∂?Â∑•‰ª∂ÂùêÊ†?Á≥ªÊ†?ÂÆ?Á?π
    $scope.cancelWobjCoord = function() {
        $scope.wobjCoordParam.calculate = null;
        $scope.wobjCoordParam.record.forEach(item => {
            $(`#wobjTool${item}`).removeClass("warning");
            $(`#wobjTool${item}`).removeClass("success");
        });
        $scope.wobjCoordParam.record = [];
    }

    // ‰øùÂ≠?Â∑•‰ª∂ÂùêÊ†?Á≥ª
    $scope.saveWobjCoord = function() {
        if($scope.wobjCoordParam.select.id == 0){
            toastFactory.info(rsDynamicTags.info_messages[0]);
            return;
        }
        $scope.wobjCoordParam.select.x = $scope.wobjCoordParam.calculate.x + "";
        $scope.wobjCoordParam.select.y = $scope.wobjCoordParam.calculate.y + "";
        $scope.wobjCoordParam.select.z = $scope.wobjCoordParam.calculate.z + "";
        $scope.wobjCoordParam.select.rx = $scope.wobjCoordParam.calculate.rx + "";
        $scope.wobjCoordParam.select.ry = $scope.wobjCoordParam.calculate.ry + "";
        $scope.wobjCoordParam.select.rz = $scope.wobjCoordParam.calculate.rz + "";
        $scope.wobjCoordParam.select.reference = $scope.wobjCoordParam.reference.id + "";
        let saveCmd = {
            cmd: "modify_wobj_tool_cdsystem",
            data: $scope.wobjCoordParam.select,
        };
        $scope.wobjCoordParam.saveRes = 'loading';
        dataFactory.actData(saveCmd).then(() => {
            $scope.wobjCoordParam.calibrate = false;
            toastFactory.success(rsDynamicTags.success_messages[1]);
            getWobjCoordData();
            document.dispatchEvent(new CustomEvent('update_wobjCoord_data', { bubbles: true, cancelable: true, composed: true }));
            applyWObjCoord();
            $scope.wobjCoordParam.saveRes = 'success';
            $timeout(function() {
                $scope.wobjCoordParam.saveRes = null;
            }, 5000)
        }, (status) => {
            $scope.wobjCoordParam.saveRes = 'error';
            $timeout(function() {
                $scope.wobjCoordParam.saveRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    /** ./Â∑•‰ª∂ÂùêÊ†?Á≥ªËÆæÁΩÆ */

    /* Ë¥?ËΩΩËÆæÁΩÆ(ËΩ®ËøπËæ®ËØ?Â??‰º†Ê??Â?®Ëæ®ËØ?) */
    /** Ë¥?ËΩΩ‚??‚??ËΩ®ËøπËæ®ËØ? */
    /**
     * È??Ê?©Ë¥?ËΩΩÁ??Èù¢Á±ªÂ??
     * @param {string} identId '':È¶?È°µÔº?'0'Ôº?ËΩ®ËøπËæ®ËØ?Ôº?'1'Ôº?'‰º†Ê??Â?®Ëæ®ËØ?'
     */
    $scope.selectLoadIdentType = function(identId) {
        $scope.loadParam.identType = identId;
    }

    // Ë?∑Âè?Ê?´Á´ØË¥?ËΩΩÂ??Ë°®
    function getEndLoadData() {
        let getLoadCmd = {
            cmd: 'get_load'
        }
        dataFactory.getData(getLoadCmd).then((data) => {
            $scope.endLoadList = data;
            if ($scope.loadParam.select.id) {
                $scope.loadParam.select = $scope.endLoadList.find(item => item.id == $scope.loadParam.select.id);
            } else {
                $scope.loadParam.select = $scope.endLoadList.find(item => item.id == $scope.currentLoad.id);
            }
        }, (status) => {
            $scope.endLoadList = [];
            toastFactory.error(status, rsDynamicTags.error_messages[21]);
            /* test */
            if (g_testCode) {
                $scope.endLoadList = testDataService.testEndLoadList;
                if ($scope.loadParam.select.id) {
                    $scope.loadParam.select = $scope.endLoadList.find(item => item.id == $scope.loadParam.select.id);
                } else {
                    $scope.loadParam.select = $scope.endLoadList.find(item => item.id == $scope.currentLoad.id);
                }
            }
            /* ./test */
        });
    }

    /**
     * Ë¥?ËΩΩÊ??È?ÆÁº?Ëæ?
     * @param {int} type Ê??È?ÆÁ±ªÂ??
     * @param {*} item Áª?ÂÆ?Â?º
     */
    $scope.operateLoad = function(type, item) {
        switch (type) {
            case 'edit':
                $scope.setLoadIdent();
                break;
            case 'apply':
                setEndLoadData($scope.loadParam.select);
                break;
            case 'rename':
                if (!$scope.loadParam.select) {
                    toastFactory.info(rsDynamicTags.info_messages[48]);
                } else {
                    if ($scope.loadParam.renameFlag) {
                        renameEndLoad();
                    } else {
                        $scope.loadParam.rename = $scope.loadParam.select.name;
                        $scope.loadParam.renameFlag = true;
                    }
                }
                break;
            case 'clear':
                clearLoad();
                break;
            default:
                break;
        }
    }

    // Ê??Âº?Ë¥?ËΩΩËæ®ËØ?È°µÈù¢:V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?„?ÅV2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?
    $scope.setLoadIdent = function() {
        if ($scope.loadParam.sensorAutoIdent == 0) {
            $scope.loadParam.identShow = !$scope.loadParam.identShow;
        } else {
            toastFactory.info(rsDynamicTags.info_messages[45]);
        }
    }

    /**
     * ‰øÆÊ?πÊ?´Á´ØË¥?ËΩΩ
     * @param {Object} selectLoad Ê?´Á´ØË¥?ËΩΩ‰ø°ÊÅØÔº?id--Ë¥?ËΩΩÁº?Âè∑„?Åname--ÂêçÁß∞„?Åweight--Ë¥?ËΩΩÈ?çÈ?è„?Åx--Ë¥®Âø?ÂùêÊ†?X„?Åy--Ë¥®Âø?ÂùêÊ†?Y„?Åz--Ë¥®Âø?ÂùêÊ†?Z
     */
    function setEndLoadData(selectLoad) {
        if (selectLoad.name == "" || selectLoad.name == null || selectLoad.name == undefined) {
            toastFactory.info(rsDynamicTags.info_messages[48]);
        } else if (selectLoad.weight == "" || selectLoad.weight == null || selectLoad.weight == undefined) {
            toastFactory.info(rsDynamicTags.info_messages[29]);
        } else if (selectLoad.x == "" || selectLoad.x == null || selectLoad.x == undefined) {
            toastFactory.info(rsDynamicTags.info_messages[30]);
        } else if (selectLoad.y == "" || selectLoad.y == null || selectLoad.y == undefined) {
            toastFactory.info(rsDynamicTags.info_messages[31]);
        } else if (selectLoad.z == "" || selectLoad.z == null || selectLoad.z == undefined) {
            toastFactory.info(rsDynamicTags.info_messages[32]);
        } else {
            let setLoadWeightCmd = {
                cmd: 'modify_load',
                data: selectLoad
            };
            dataFactory.actData(setLoadWeightCmd).then(() => {
                $scope.loadParam.renameFlag = false;
                getEndLoadData();
                if (selectLoad.id == $scope.currentLoad.id) {
                    g_renameLoadFlag = 1;
                };
                if ($scope.loadParam.select.name == selectLoad.name) {
                    toastFactory.success(rsDynamicTags.success_messages[7]);
                } else {
                    $scope.loadParam.select.name = selectLoad.name;
                    toastFactory.success(rsDynamicTags.success_messages[8]);
                }
                $scope.loadParam.identShow = false;
                $scope.cancelLoadTrajIdent();
                // ÁÆ?Âç?ËΩ®Ëøπ
                if ($scope.loadParam.trajIdentRes == 'loading') {
                    $scope.loadParam.trajIdentRes = 'error';
                    $timeout(function() {
                        $scope.loadParam.trajIdentRes = null;
                    }, 5000)
                }
                // Êø?Â?±Ëæ®ËØ?
                if ($scope.loadParam.excitIdentRes == 'loading') {
                    $scope.loadParam.excitIdentRes = 'error';
                    $timeout(function() {
                        $scope.loadParam.excitIdentRes = null;
                    }, 5000)
                }
            }, (status) => {
                // ÁÆ?Âç?ËΩ®Ëøπ
                if ($scope.loadParam.trajIdentRes == 'loading') {
                    $scope.loadParam.trajIdentRes = 'error';
                    $timeout(function() {
                        $scope.loadParam.trajIdentRes = null;
                    }, 5000)
                }
                // Êø?Â?±Ëæ®ËØ?
                if ($scope.loadParam.excitIdentRes == 'loading') {
                    $scope.loadParam.excitIdentRes = 'error';
                    $timeout(function() {
                        $scope.loadParam.excitIdentRes = null;
                    }, 5000)
                }
                toastFactory.error(status, rsDynamicTags.error_messages[22]);
                /* test */
                if (g_testCode) {
                    $scope.loadParam.renameFlag = false;
                }
            });
        }
    }

    /* Á°ÆËÆ§‰øÆÊ?πÊ?´Á´ØË¥?ËΩΩÂêçÁß∞ */
    function renameEndLoad() {
        const loadData = {
            id: $scope.loadParam.select.id,
            name: $scope.loadParam.rename,
            weight: $scope.loadParam.select.weight,
            x: $scope.loadParam.select.x,
            y: $scope.loadParam.select.y,
            z: $scope.loadParam.select.z
        };
        setEndLoadData(loadData);
    }

    // Ê∏?Á©∫Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    function clearLoad() {
        const loadData = {
            id: $scope.loadParam.select.id,
            name: $scope.loadParam.select.name,
            weight: '0',
            x: '0',
            y: '0',
            z: '0'
        };
        setEndLoadData(loadData);
    }

    /**
     * 
     * @param {Number} operateIndex V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?Ê?ç‰Ω?Ê≠•È™§Â∫èÂè∑1~4Ôº?1-ËÆ∞ÂΩ?‰º†Ê??Â?®Â?ùÂß?‰ΩçÁΩÆÊ?∞ÊçÆËÆ∞ÂΩ?„?Å2-Á©∫ËΩΩËæ®ËØ?„?Å3-Êª°ËΩΩËæ®ËØ?„?Å4-Ë?∑Âè?Ëæ®ËØ?Áª?Ê??
     */
    let simpleTrajIdentIndex;
    $scope.setLoadSimpleTrajIdentify = function(operateIndex) {
        simpleTrajIdentIndex = operateIndex;
        switch (simpleTrajIdentIndex) {
            case 1:
                if ($scope.controlMode != 0) {
                    toastFactory.warning(rsDynamicTags.warning_messages[1]);
                    return;
                } 
                if ($scope.currentWobjCoord != 0 || $scope.currentCoord != 0) {
                    toastFactory.info(rsDynamicTags.info_messages[33]);
                    return;
                }
                // Á°ÆÂÆ?Ë¥?ËΩΩË¥®È?èË??Â?¥
                switch (g_robotTypeCode) {
                    case 1:
                    case 2:
                    case 3:
                    case 501:
                    case 702:
                    case 703:
                    case 901:
                    case 904:
                    case 906:
                        // FR3„?ÅART5„?ÅFR3-WML„?ÅFR3-WMS„?ÅFR3MT„?ÅFR3-C„?ÅFR3(C)
                        jointThird.value = 30;
                        break;
                    default:
                        jointThird.value = 50;
                        break;
                }
                jointFifth.value = 5;
                jointSix.value = 30;
                $scope.loadParam.excitationSpeed = 5;
                recordLaserInitialPosition();
                break;
            case 2:
                runLoadSimpleTrajIdentify(0);
                break;
            case 3:
                runLoadSimpleTrajIdentify(1);
                break;
            case 4:
                computeLoadSimpleTrajIdentify();
                break;
            default:
                break;
        }
    }

    // V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?Ê≠•È™§‰∏?Ôº?ËÆ∞ÂΩ?‰º†Ê??Â?®Â?ùÂß?‰ΩçÁΩÆÊ?∞ÊçÆËÆ∞ÂΩ?
    function recordLaserInitialPosition() {
        //Á??Ê?êluaÁ®?Â∫è
        let applyInternalProgramCmd = {
            cmd: "apply_internal_program",
            data: {
                name: "SimpleLoadIdentify.lua"
            }
        }
        dataFactory.actData(applyInternalProgramCmd).then(() => {
            g_fileNameForUpload = "SimpleLoadIdentify.lua";
            let savePointCmd = {
                cmd: "save_local_point",
                data: {
                    local: g_fileNameForUpload,
                    name: "SimpleLoadIdentify",
                    speed: $scope.velocity,
                    elbow_speed: $scope.velocity,
                    acc: $scope.acceleration,
                    elbow_acc: $scope.acceleration,
                    toolnum: $scope.currentCoord + "",
                    workpiecenum: $scope.currentWobjCoord + "",
                    update_programfile: 1
                }
            };
            dataFactory.actData(savePointCmd).then(() => {
                $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("warning");
                $(`#trajIdent${simpleTrajIdentIndex}`).addClass("success");
                if ($scope.loadParam.trajRecord.findIndex(value => value == simpleTrajIdentIndex) != -1) return;
                $scope.loadParam.trajRecord.push(simpleTrajIdentIndex);
            }, (status) => {
                $(`#trajIdent${simpleTrajIdentIndex}`).addClass("warning");
                $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("success");
                toastFactory.error(status);
            });
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("warning");
                $(`#trajIdent${simpleTrajIdentIndex}`).addClass("success");
                if ($scope.loadParam.trajRecord.findIndex(value => value == simpleTrajIdentIndex) != -1) return;
                $scope.loadParam.trajRecord.push(simpleTrajIdentIndex);
            }
            /* ./test */
        });
    }
    
    /**
     * V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?Ê≠•È™§‰∫?Â??Ê≠•È™§‰∏?Ôº?ËÆæÁΩÆÁ©∫ËΩΩÊ??Êª°ËΩΩËøêË°?
     * @param {int} index 0-Á©∫ËΩΩ 1-Êª°ËΩΩ
     */
    function runLoadSimpleTrajIdentify(index) {
        if($scope.controlMode != 0) {
            toastFactory.warning(rsDynamicTags.warning_messages[1]);
            return;
        } 
        if ($scope.programStatus != "Stopped") {
            toastFactory.info(rsDynamicTags.info_messages[50]);
            return;
        }
        let setCmd = {
            cmd: 990,
            data: {
                content: "SetCurrentLoadIdentifyFlag(" + index + ")" ,
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("warning");
                $(`#trajIdent${simpleTrajIdentIndex}`).addClass("success");
                if ($scope.loadParam.trajRecord.findIndex(value => value == simpleTrajIdentIndex) != -1) return;
                $scope.loadParam.trajRecord.push(simpleTrajIdentIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('990', e => {
        if (e.detail == 1) {
            $scope.index_uploadProgName();
            g_loadIdentFlag = 1;
        } else {
            $(`#trajIdent${simpleTrajIdentIndex}`).addClass("warning");
            $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("success");
        }
    })

    document.getElementById('robotSetting').addEventListener('loadIdentRunning', e => {
        $(`#trajIdent${simpleTrajIdentIndex}`).removeClass("warning");
        $(`#trajIdent${simpleTrajIdentIndex}`).addClass("success");
        if ($scope.loadParam.trajRecord.findIndex(value => value == simpleTrajIdentIndex) != -1) return;
        $scope.loadParam.trajRecord.push(simpleTrajIdentIndex);
    })

    // V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?‚??‚??ËÆ°ÁÆ?Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    function computeLoadSimpleTrajIdentify() {
        if ($scope.programStatus != "Stopped") {
            toastFactory.info(rsDynamicTags.info_messages[39]);
            return;
        }
        let setCmd = {
            cmd: 992,
            data: {
                content: "ComputCurrentLoadIdentify()" ,
            },
        };
        dataFactory.setData(setCmd).then(() => {
            $scope.loadParam.trajCalculate = {};
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.loadParam.trajCalculate = {
                    weight: '5.000',
                    x: '1.111',
                    y: '1.111',
                    z: '1.111',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('992', e => {
        var loadData = e.detail.split(",");
        $scope.loadParam.trajCalculate['weight'] = parseFloat(loadData[0]).toFixed(3);
        $scope.loadParam.trajCalculate['x'] = parseFloat(loadData[1]).toFixed(3);
        $scope.loadParam.trajCalculate['y'] = parseFloat(loadData[2]).toFixed(3);
        $scope.loadParam.trajCalculate['z'] = parseFloat(loadData[3]).toFixed(3);
    });

    // V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?‚??‚??Âè?Ê∂?Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    $scope.cancelLoadTrajIdent = function() {
        $scope.loadParam.trajCalculate = null;
        $scope.loadParam.trajRecord.forEach(item => {
            $(`#trajIdent${item}`).removeClass("warning");
            $(`#trajIdent${item}`).removeClass("success");
        });
        $scope.loadParam.trajRecord = [];
    }

    // V1.0-ÁÆ?Âç?ËΩ®ËøπËæ®ËØ?‚??‚??Â∫?Á?®Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    $scope.applyLoadTrajIdent = function() {
        const loadData = {
            id: $scope.loadParam.select.id,
            name: $scope.loadParam.select.name,
            weight: String($scope.loadParam.trajCalculate.weight),
            x: String($scope.loadParam.trajCalculate.x),
            y: String($scope.loadParam.trajCalculate.y),
            z: String($scope.loadParam.trajCalculate.z)
        };
        $scope.loadParam.trajIdentRes = 'loading';
        setEndLoadData(loadData);
    }

    // V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?Ëø?Â?•Á??Èù¢Â?çÁ??Â?§Ê?≠Ê?ØÂê¶‰∏∫FR5Â??Â??Â§?Â∑•‰Ω?
    $scope.enterLoadExcitTrajIdentify = function() {
        // ËØ•Â??Ë?ΩÁ?ÆÂ?çÂè™È??Á?®‰∫?FR5
        if (g_robotType.type != 2) return;
        $scope.loadParam.excitationPoint = 1;
        let loadclacTCFCmd = {
            cmd: 320,
            data: {
                j1: "-72.365",
                j2: "-64.691",
                j3: "61.602",
                j4: "35.486",
                j5: "-67.450",
                j6: "18.045"
            }
        };
        dataFactory.setData(loadclacTCFCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.loadParam.excitationShow = true;
            }
            /* ./test */
        })
    }
    
    /**
     * 
     * @param {Number} operateIndex V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?Ê?ç‰Ω?Ê≠•È™§Ôº?0-Ê?¢È??ËØ?ËøêË°?„?Å1-Ê≠£Â∏∏ËøêË°?„?Å2-Ë?∑Âè?ËÆ°ÁÆ?Áª?Ê??
     */
    let excitTrajIdentIndex;
    $scope.setLoadExcitTrajIdentify = function(operateIndex) {
        excitTrajIdentIndex = operateIndex;
        switch (excitTrajIdentIndex) {
            case 0:
                excitTrajIndet(0);
                break;
            case 1:
                excitTrajIndet(1);
                break;
            case 2:
                computeLoadExcitIdent();
                break;
            default:
                break;
        }
    }

    /**
     * V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?ËøêÂ?®
     * @param {*} motionType 0:Ê?¢È??ËØ?ËøêË°?;1-Ê≠£Â∏∏ËøêË°?
     * @returns 
     */
    let excitTrajIndetFlag;
    function excitTrajIndet(motionType) {
        if ($scope.controlMode != 0) {
            toastFactory.warning(rsDynamicTags.warning_messages[1]);
            return;
        };
        switch (motionType) {
            case 0:
                g_fileDataForUpload = $scope.loadParam.slowMotionFile;
                break;
            case 1:
                g_fileDataForUpload = $scope.loadParam.normalMotionFile;
                break;
            default:
                break;
        };
        let setSpeedCmd = {
            cmd: 206,
            data: {
                content: `SetSpeed(${$scope.loadParam.excitationSpeed})`,
            },
        };
        dataFactory.setData(setSpeedCmd).then(() => {
            excitTrajIndetFlag = 1;
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                if (excitTrajIdentIndex == 1) {
                    $(`#excitIdent${excitTrajIdentIndex}`).removeClass("warning");
                    $(`#excitIdent${excitTrajIdentIndex}`).addClass("success");
                    if ($scope.loadParam.excitRecord.findIndex(value => value == excitTrajIdentIndex) != -1) return;
                    $scope.loadParam.excitRecord.push(excitTrajIdentIndex);
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('206', e => {
        if (excitTrajIndetFlag) {
            if (e.detail == 1) {
                $scope.index_uploadProgName();
                if (excitTrajIdentIndex == 1) {
                    $(`#excitIdent${excitTrajIdentIndex}`).removeClass("warning");
                    $(`#excitIdent${excitTrajIdentIndex}`).addClass("success");
                    if ($scope.loadParam.excitRecord.findIndex(value => value == excitTrajIdentIndex) != -1) return;
                    $scope.loadParam.excitRecord.push(excitTrajIdentIndex);
                }
            } else {
                if (excitTrajIdentIndex == 1) {
                    $(`#excitIdent${excitTrajIdentIndex}`).addClass("warning");
                    $(`#excitIdent${excitTrajIdentIndex}`).removeClass("success");
                }
            };
            excitTrajIndetFlag = 0;
        }
    })

    // V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?‚??‚??Ë?∑Âè?ËÆ°ÁÆ?Áª?Ê??
    function computeLoadExcitIdent() {
        if ($scope.programStatus != "Stopped") {
            toastFactory.info(rsDynamicTags.info_messages[39]);
            return;
        }
        let setLoadIdentifyGetResultCmd = {
            cmd: 663,
            data: {
                content: "LoadIdentifyGetResult({1,1,1,1,1.05,1,1,1,1,1,1,1})",
            },
        };
        dataFactory.setData(setLoadIdentifyGetResultCmd).then(() => {
            $scope.loadParam.excitCalculate = {};
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.loadParam.excitCalculate = {
                    weight: '10.000',
                    x: '2.222',
                    y: '2.222',
                    z: '2.222',
                }
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('663', e => {
        $scope.loadParam.excitCalculate = handlecompute(JSON.parse(e.detail));
    });

    // V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?‚??‚??Âè?Ê∂?Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    $scope.cancelLoadExcitIdent = function() {
        $scope.loadParam.excitCalculate = null;
        $scope.loadParam.excitRecord.forEach(item => {
            $(`#excitIdent${item}`).removeClass("warning");
            $(`#excitIdent${item}`).removeClass("success");
        });
        $scope.loadParam.excitRecord = [];
    }

    // V2.0-Êø?Â?±ËΩ®ËøπËæ®ËØ?‚??‚??Â∫?Á?®Ë¥?ËΩΩËæ®ËØ?Áª?Ê??
    $scope.applyLoadExcitIdent = function() {
        const loadData = {
            id: $scope.loadParam.select.id,
            name: $scope.loadParam.select.name,
            weight: $scope.loadParam.excitCalculate.weight,
            x: $scope.loadParam.excitCalculate.x,
            y: $scope.loadParam.excitCalculate.y,
            z: $scope.loadParam.excitCalculate.z
        };
        $scope.loadParam.excitIdentRes = 'loading';
        setEndLoadData(loadData);
    }

    // ËÆæÁΩÆË¥?ËΩΩËæ®ËØ?Â?≥Ë??ËøêÂ?®Ë??Â?¥Âπ∂Ê†πÊçÆÂ?≥Ë??ËÆ°ÁÆ?TCF
    function LoadIdentifySetJointRange(index) {
        if($scope.currentWobjCoord != 0 || $scope.currentCoord != 0){
            toastFactory.info(rsDynamicTags.info_messages[33]);
            return;
        }
	    let idJointsData = {
            "j1":"-134.571",
            "j2":"-89.884",
            "j3":"-90.035",
            "j4":"-179.990",
            "j5":"0.084",
            "j6":"0.020"
        };
        switch(index) {
            case 0:
                jointFifth.flag0 = 1;
                let loadj5_0clacTCFCmd = {
                    "cmd": 320,
                    "data": idJointsData,
                }
                dataFactory.setData(loadj5_0clacTCFCmd).then(() => {}, (status) => {
                    toastFactory.error(status, rsDynamicTags.error_messages[13]);
                })
                break;
            case 1:
                jointFifth.flag1 = 1;
                idJointsData.j5 = "0";
                let loadj5clacTCFCmd = {
                    "cmd": 320,
                    "data": idJointsData,
                }
                dataFactory.setData(loadj5clacTCFCmd).then(() => {}, (status) => {
                    toastFactory.error(status, rsDynamicTags.error_messages[13]);
                })
                break;
            case 2:
                if (!jointFifth.flag) {
                    toastFactory.info(rsDynamicTags.info_messages[35]);
                    return;
                }
                jointThird.flag1 = 1;
                idJointsData.j3 = "-90";
                let loadj3clacTCFCmd = {
                    "cmd": 320,
                    "data": idJointsData,
                }
                dataFactory.setData(loadj3clacTCFCmd).then(() => {}, (status) => {
                    toastFactory.error(status, rsDynamicTags.error_messages[14]);
                })
                break;
            case 3:
                if (!jointFifth.flag) {
                    toastFactory.info(rsDynamicTags.info_messages[35]);
                    return;
                } else if (!jointThird.flag) {
                    toastFactory.info(rsDynamicTags.info_messages[36]);
                    return;
                }
                jointSix.flag1 = 1;
                idJointsData.j6 = "0";
                let loadj6clacTCFCmd = {
                    "cmd": 320,
                    "data": idJointsData,
                }
                dataFactory.setData(loadj6clacTCFCmd).then(() => {}, (status) => {
                    toastFactory.error(status, rsDynamicTags.error_messages[15]);
                })
                break;
            default:
                break;
        }
    }
    
    let loadMoveJData = {};
    /** Ë?∑Âè?TCFÊ?∞ÊçÆÂπ∂Áª?Ê?êÁ®?Â∫èÁ§∫Ê??Ê??‰ª∂ */
    document.getElementById('robotSetting').addEventListener('320', e => {
        $scope.loadParam.excitationShow = true;
        let idJointsData = {
            "j1":"-134.571",
            "j2":"-89.884",
            "j3":"-90.035",
            "j4":"-179.990",
            "j5":"0.084",
            "j6":"0.020"
        };
        loadMoveJData["speed"] = $scope.speed.toString();
        loadMoveJData["acc"] = $scope.acceleration;
        loadMoveJData["ovl"] = "50"; // 50-150
        loadMoveJData["joints"] = idJointsData;
        loadMoveJData["tcf"] = JSON.parse(e.detail);
        if (jointFifth.flag0) {
            g_fileDataForUpload = "";
            jointFifth.flag0 = 0;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + idJointsData.j5 + ","
                + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            LoadIdentifySetJointRange(1);
        } else if (jointFifth.flag1) {
            jointFifth.flag1 = 0;
            jointFifth.flag2 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + "0" + ","
                + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j5 = 0 - jointFifth.value + "";
            let loadj5clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj5clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[13]);
            })
        } else if (jointFifth.flag2) {
            jointFifth.flag2 = 0;
            jointFifth.flag3 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + (-jointFifth.value)
                + "," + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + ","
                + JSON.parse(e.detail).rx + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + ","
                + $scope.currentWobjCoord + "," + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j5 = jointFifth.value + "";
            let loadj5clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj5clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[13]);
            })
        } else if (jointFifth.flag3) {
            jointFifth.flag3 = 0;
            jointFifth.flag = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + jointFifth.value + ","
                + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            LoadIdentifySetJointRange(2);
        } else if (jointThird.flag1) {
            jointThird.flag1 = 0;
            jointThird.flag2 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + "-90" + "," + idJointsData.j4 + "," + idJointsData.j5 + ","
                + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j3 = -90-jointThird.value + "";
            let loadj3clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj3clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[14]);
            })
        } else if (jointThird.flag2) {
            jointThird.flag2 = 0;
            jointThird.flag3 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + (-90 - jointThird.value + "") + "," + idJointsData.j4 + ","
                + idJointsData.j5 + "," + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + ","
                + JSON.parse(e.detail).rx + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + ","
                + $scope.currentWobjCoord + "," + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j3 = jointThird.value-90 + "";
            let loadj3clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj3clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[14]);
            })
        } else if (jointThird.flag3) {
            jointThird.flag3 = 0;
            jointThird.flag = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + (jointThird.value - 90 + "") + "," + idJointsData.j4 + ","
                + idJointsData.j5 + "," + idJointsData.j6 + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + ","
                + JSON.parse(e.detail).rx + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + ","
                + $scope.currentWobjCoord + "," + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            LoadIdentifySetJointRange(3);
        } else if (jointSix.flag1) {
            jointSix.flag1 = 0;
            jointSix.flag2 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + idJointsData.j5 + ","
                + "0" + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j6 = 0-jointSix.value + "";
            let loadj6clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj6clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[15]);
            })
        } else if (jointSix.flag2) {
            jointSix.flag2 = 0;
            jointSix.flag3 = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + idJointsData.j5 + ","
                + (-jointSix.value) + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx
                + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + ","
                + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            idJointsData.j6 = jointSix.value + "";
            let loadj6clacTCFCmd = {
                "cmd": 320,
                "data": idJointsData,
            }
            dataFactory.setData(loadj6clacTCFCmd).then(() => {}, (status) => {
                toastFactory.error(status, rsDynamicTags.error_messages[15]);
            })
        } else if (jointSix.flag3) {
            jointSix.flag3 = 0;
            jointSix.flag = 1;
            g_fileDataForUpload += "MoveJ(" + idJointsData.j1 + "," + idJointsData.j2 + "," + idJointsData.j3 + "," + idJointsData.j4 + "," + idJointsData.j5 + ","
                + jointSix.value + "," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + "," + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + ","
                + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + ","
                + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            g_fileNameForUpload = "loadweight.lua";
        } else if ($scope.loadParam.excitationPoint) {
            g_fileNameForUpload = "loadweight.lua";
            $scope.loadParam.slowMotionFile = "";
            $scope.loadParam.normalMotionFile = "";
            jointFifth.flag0 = 0;
            $scope.loadParam.slowMotionFile += "file = assert(io.open(\"/root/web/file/user/Trace.lua\", \"r\"))\n"+
                "io.input(file)\n"+
                "ourline = {}\n"+
                "for i = 1, 10000 do\n"+
                    "ourline[i] = io.read()\n"+
                "end\n";
            $scope.loadParam.normalMotionFile += "file = assert(io.open(\"/root/web/file/user/Trace.lua\", \"r\"))\n"+
                "io.input(file)\n"+
                "ourline = {}\n"+
                "for i = 1, 10000 do\n"+
                    "ourline[i] = io.read()\n"+
                "end\n";
            $scope.loadParam.slowMotionFile += "MoveJ(-72.365,-64.691,61.602,35.486,-67.450,18.045," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + ","
                + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + ","
                + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0"+ ")" + "\n";
            $scope.loadParam.normalMotionFile += "MoveJ(-72.365,-64.691,61.602,35.486,-67.450,18.045," + JSON.parse(e.detail).x + "," + JSON.parse(e.detail).y + ","
                + JSON.parse(e.detail).z + "," + JSON.parse(e.detail).rx + "," + JSON.parse(e.detail).ry + "," + JSON.parse(e.detail).rz + ","
                + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.speed + "," + $scope.acceleration + "," + 30 + "," + "0,0,0,0,0,0,0,0,0,0,0,0" + ")" + "\n";
            $scope.loadParam.slowMotionFile += "WaitMs(1000)\n"+
                "LoadIdentifyDynFilterInit()\n"+
                "LoadIdentifyDynVarInit()\n"+
                "for j = 1,10000 do\n"+
                    "str1 = ourline[j]\n"+
                    "res = str_split(str1,\",\")\n"+
                    "j1 = -72.362\n"+
                    "j2 =  -64.691\n"+
                    "j3 = 61.605\n"+
                    "j4 = tonumber(res[4])\n"+
                    "j5 = tonumber(res[5])\n"+
                    "j6 = tonumber(res[6])\n"+
                    "ServoJ(j1,j2,j3,j4,j5,j6,0,0,0.024,0,0)\n"+
                    "ja1,ja2,ja3,ja4,ja5,ja6 = GetActualJointPosDegree(1)\n"+
                    "T1,T2,T3,T4,T5,T6 = GetJointTorques(1)\n"+
                    "joint_pos = {ja1,ja2,ja3,ja4,ja5,ja6}\n"+
                    "tau= {T1,T2,T3,T4,T5,T6}\n"+
                    "LoadIdentifyMain(tau,joint_pos,10)\n"+
                "end\n"+
                "LoadIdentifyDynFilterInit()\n";
            $scope.loadParam.normalMotionFile += "WaitMs(1000)\n"+
                "LoadIdentifyDynFilterInit()\n"+
                "LoadIdentifyDynVarInit()\n"+
                "for j = 1,10000 do\n"+
                    "str1 = ourline[j]\n"+
                    "res = str_split(str1,\",\")\n"+
                    "j1 = -72.362\n"+
                    "j2 =  -64.691\n"+
                    "j3 = 61.605\n"+
                    "j4 = tonumber(res[4])\n"+
                    "j5 = tonumber(res[5])\n"+
                    "j6 = tonumber(res[6])\n"+
                    "ServoJ(j1,j2,j3,j4,j5,j6,0,0,0.001,0,0)\n"+
                    "ja1,ja2,ja3,ja4,ja5,ja6 = GetActualJointPosDegree(1)\n"+
                    "T1,T2,T3,T4,T5,T6 = GetJointTorques(1)\n"+
                    "joint_pos = {ja1,ja2,ja3,ja4,ja5,ja6}\n"+
                    "tau= {T1,T2,T3,T4,T5,T6}\n"+
                    "LoadIdentifyMain(tau,joint_pos,10)\n"+
                "end\n"+
                "LoadIdentifyDynFilterInit()\n";
        }
    })
    /** ./Ë¥?ËΩΩ‚??‚??ËΩ®ËøπËæ®ËØ? */

    /** Ë¥?ËΩΩ‚??‚??‰º†Ê??Â?®Ëæ®ËØ?Ôº?Â??/Ê?≠Á?©‰º†Ê??Â?®Ë¥?ËΩΩËæ®ËØ?Ôº? */
    /**
     * Â∫?Á?®Ë¥?ËΩΩÈ?çÈ?è
     * @param {string} weight 1~5kg
     * @param {string} x 
     * @param {string} y 
     * @param {string} z 
     * @param {Number} flag 0-Ê∏?È?§Ôº?1-Á?¥Ê?•Â∫?Á?®Ôº?2-ËÆ°ÁÆ?Âê?Â∫?Á?®
     */
    let tempLoadFTLocationX;
    let tempLoadFTLocationY;
    let tempLoadFTLocationZ;
    $scope.applyLoadFTWeight = function(ftWeight, x, y, z, flag) {
        if ($scope.loadParam.sensorAutoIdent == 0) {
            if (ftWeight == "" || ftWeight == null) {
                toastFactory.info(rsDynamicTags.info_messages[29]);
            } else {
                switch (flag) {
                    case 1:
                        $scope.loadParam.sensorApplyRes = 'loading';
                        break;
                    case 2:
                        $scope.loadParam.sensorSaveRes = 'loading';
                        break;
                    default:
                        break;
                }
                let setLoadWeightCmd = {
                    cmd: 692,
                    data: {
                        content: `SetForceSensorPayload(${ftWeight})`,
                    }
                };
                dataFactory.setData(setLoadWeightCmd).then(() => {
                    tempLoadFTLocationX = x;
                    tempLoadFTLocationY = y;
                    tempLoadFTLocationZ = z;
                }, (status) => {
                    if ($scope.loadParam.sensorApplyRes == 'loading') {
                        $scope.loadParam.sensorApplyRes = 'error';
                        $timeout(function() {
                            $scope.loadParam.sensorApplyRes = null;
                        }, 5000)
                    }
                    if ($scope.loadParam.sensorSaveRes == 'loading') {
                        $scope.loadParam.sensorSaveRes = 'error';
                        $timeout(function() {
                            $scope.loadParam.sensorSaveRes = null;
                        }, 5000)
                    }
                    toastFactory.error(status);
                });
            }
        } else {
            toastFactory.info(rsDynamicTags.info_messages[45]);
        }
    }
    document.getElementById('robotSetting').addEventListener('692', e => {
        applyLoadFTLocation(tempLoadFTLocationX, tempLoadFTLocationY, tempLoadFTLocationZ);
    })

    /**
     * Â∫?Á?®Ë¥?ËΩΩË¥®Âø?ÂùêÊ†?
     * @param {string} ftLocationX Ë¥®Âø?ÂùêÊ†?X,-1000~1000mm
     * @param {string} ftLocationY Ë¥®Âø?ÂùêÊ†?Y,-1000~1000mm
     * @param {string} ftLocationZ Ë¥®Âø?ÂùêÊ†?Z,-1000~1000mm
     */
    function applyLoadFTLocation(ftLocationX, ftLocationY, ftLocationZ) {
        if ($scope.loadParam.sensorAutoIdent == 0) {
            if (ftLocationX == "" || ftLocationX == null) {
                toastFactory.info(rsDynamicTags.info_messages[30]);
            } else if (ftLocationY == "" || ftLocationY == null) {
                toastFactory.info(rsDynamicTags.info_messages[31]);
            } else if (ftLocationZ == "" || ftLocationZ == null) {
                toastFactory.info(rsDynamicTags.info_messages[32]);
            } else {
                let setLoadLocationCmd = {
                    cmd: 693,
                    data: {
                        content: `SetForceSensorPayloadCog(${ftLocationX},${ftLocationY},${ftLocationZ})`,
                    }
                };
                dataFactory.setData(setLoadLocationCmd).then(() => {}, (status) => {
                    toastFactory.error(status);
                });
            }
        } else {
            toastFactory.info(rsDynamicTags.info_messages[45]);
        }
    }
    document.getElementById('robotSetting').addEventListener('693', e => {
        getDynamicData('sensorLoad');
        if (e.detail == 1) {
            if ($scope.loadParam.sensorApplyRes == 'loading') {
                $scope.loadParam.sensorApplyRes = 'success';
                $timeout(function() {
                    $scope.loadParam.sensorApplyRes = null;
                }, 5000)
            }
            if ($scope.loadParam.sensorSaveRes == 'loading') {
                $scope.loadParam.sensorSaveRes = 'success';
                $timeout(function() {
                    $scope.loadParam.sensorSaveRes = null;
                }, 5000)
            }
        } else {
            if ($scope.loadParam.sensorApplyRes == 'loading') {
                $scope.loadParam.sensorApplyRes = 'error';
                $timeout(function() {
                    $scope.loadParam.sensorApplyRes = null;
                }, 5000)
            }
            if ($scope.loadParam.sensorSaveRes == 'loading') {
                $scope.loadParam.sensorSaveRes = 'error';
                $timeout(function() {
                    $scope.loadParam.sensorSaveRes = null;
                }, 5000)
            }
        }
    })


    // Ë¥®È?èÊµ?ÂÆ?--È??Ê?©‰º†Ê??Â?®ËÆ∞ÂΩ?
    $scope.recordSensorTool = function(sensorToolId) {
        let FT_pdIdenRecordCmd = {
            cmd: 529,
            data: {
                content: `FT_PdIdenRecord(${sensorToolId})`,
            },
        };
        $scope.loadParam.sensorToolRes = 'loading';
        dataFactory.setData(FT_pdIdenRecordCmd).then(() => {}, (status) => {
            $scope.loadParam.sensorToolRes = 'error';
            $timeout(function() {
                $scope.loadParam.sensorToolRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                computeFTWeight();
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('529', e => {
        if (e.detail == 1) {
            computeFTWeight();
            $scope.loadParam.sensorToolRes = 'success';
        } else {
            $scope.loadParam.sensorToolRes = 'error';
        }
        $timeout(function() {
            $scope.loadParam.sensorToolRes = null;
        }, 5000)
    })

    // Ë¥®È?èÊµ?ÂÆ?--ËÆ°ÁÆ?
    function computeFTWeight() {
        let FT_pdIdenComputeCmd = {
            cmd: 530,
            data: {
                content:"FT_PdIdenCompute()",
            },
        };
        dataFactory.setData(FT_pdIdenComputeCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.loadParam.ftCompute.weight = '3.000';
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('530', e => {
        $scope.loadParam.ftCompute.weight = parseFloat(JSON.parse(e.detail).weight).toFixed(3);
    })

    /**
     * Ê??Â?®Ëæ®ËØ?‚??‚??Ë¥®Âø?Ëæ®ËØ?‰º†Ê??Â?®Ê?∞ÊçÆËÆ∞ÂΩ?
     * @param {string} sensorToolId È??Ê?©‰º†Ê??Â?®ID
     * @param {Number} index ËÆ∞ÂΩ?Á?πÂ∫èÂè∑1~3
     */
    let sensorManulIndex;
    $scope.recordSensorPoint = function(sensorToolId, index) {
        sensorManulIndex = index;
        let FT_pdCogIdenRecordCmd = {
            cmd: 531,
            data: {
                content: `FT_PdCogIdenRecord(${sensorToolId},${sensorManulIndex})`,
            },
        };
        dataFactory.setData(FT_pdCogIdenRecordCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $(`#sensorManul${sensorManulIndex}`).removeClass("warning");
                $(`#sensorManul${sensorManulIndex}`).addClass("success");
                if ($scope.loadParam.maualRecord.findIndex(value => value == sensorManulIndex) != -1) return;
                $scope.loadParam.maualRecord.push(sensorManulIndex);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('531', e => {
        if (e.detail == '1') {
            $(`#sensorManul${sensorManulIndex}`).removeClass("warning");
            $(`#sensorManul${sensorManulIndex}`).addClass("success");
            if ($scope.loadParam.maualRecord.findIndex(value => value == sensorManulIndex) != -1) return;
            $scope.loadParam.maualRecord.push(sensorManulIndex);
        } else {
            $(`#sensorManul${sensorManulIndex}`).addClass("warning");
            $(`#sensorManul${sensorManulIndex}`).removeClass("success");
        }
    })

    // Ê??Â?®Ëæ®ËØ?‚??‚??Ë¥®Âø?Ëæ®ËØ?Ê?∞ÊçÆËÆ°ÁÆ?
    $scope.computeFTCoord = function() {
        let FT_pdCogIdenComputeCmd = {
            cmd: 532,
            data: {
                content:"FT_PdCogIdenCompute()",
            },
        };
        $scope.loadParam.sensorComRes = 'loading';
        dataFactory.setData(FT_pdCogIdenComputeCmd).then(() => {}, (status) => {
            $scope.loadParam.sensorComRes = 'error';
            $timeout(function() {
                $scope.loadParam.sensorComRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.loadParam.ftCompute.x = '3.333';
                $scope.loadParam.ftCompute.y = '3.333';
                $scope.loadParam.ftCompute.z = '3.333';
            }
            /* ./test */
        });
    }
    // Ë?∑Âè?ËÆ°ÁÆ?ÂùêÊ†?Á≥ªÊ?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('532', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            $scope.loadParam.ftCompute.x = parseFloat(JSON.parse(e.detail).x).toFixed(3);
            $scope.loadParam.ftCompute.y = parseFloat(JSON.parse(e.detail).y).toFixed(3);
            $scope.loadParam.ftCompute.z = parseFloat(JSON.parse(e.detail).z).toFixed(3);
            $scope.loadParam.sensorComRes = 'success';
        } else {
            $scope.loadParam.sensorComRes = 'error';
        }
        $timeout(function() {
            $scope.loadParam.sensorComRes = null;
        }, 5000)
        
    })

    // Âè?Ê∂?Ê??Â?®Ëæ®ËØ?ËÆ°ÁÆ?Áª?Ê??
    $scope.cancelFTCoord = function() {
        $scope.loadParam.ftCompute.weight = null;
        $scope.loadParam.ftCompute.x = null;
        $scope.loadParam.ftCompute.y = null;
        $scope.loadParam.ftCompute.z = null;
        $scope.loadParam.maualRecord.forEach(item => {
            $(`#sensorManul${item}`).removeClass("warning");
            $(`#sensorManul${item}`).removeClass("success");
        });
        $scope.loadParam.maualRecord = [];
    }

    /**
     * Ë?™Â?®Ëæ®ËØ?‚??‚??Ë¥?ËΩΩÂ?®Ê?ÅËæ®ËØ?Âº?È?≠
     * @param {Number} index 0-Â?≥È?≠Ôº?1-Âº?ÂêØ
     */
    $scope.setLoadIdentifyDynOnOff = function(index) {
        let setLoadIdentifyDynOnOffCmd = {
            cmd: 651,
            data: {
                content: `LoadIdentifyDynOnOff(${index})`,
            },
        };
        dataFactory.setData(setLoadIdentifyDynOnOffCmd).then(() => {}, (status) => {
            getDynamicData('sensorLoad')
            toastFactory.error(status);
        });
    }
    // Ë?™Â?®Ëæ®ËØ?‚??‚??Ë¥?ËΩΩÂ?®Ê?ÅËæ®ËØ?Âº?È?≠Âê?Ôº?Ë?∑Âè?Áª?Ê??
    document.getElementById('robotSetting').addEventListener('651', () => {
        getDynamicData('sensorLoad')
    });

    /**
     * Ë?™Â?®Ëæ®ËØ?‚??‚??È??Ê†∑Â?®Ê??Á≠?Âè?Ê?∞ËÆæÁΩÆ
     * @param {string} sampleTime È??Ê†∑Â?®Ê??
     */
    $scope.setLoadIdentifySetParam = function(sampleTime) {
        let setLoadIdentifySetParamCmd = {
            cmd: 652,
            data: {
                content: `LoadIdentifySetParam(${sampleTime})`,
            },
        };
        $scope.loadParam.sensorParamRes = 'loading';
        dataFactory.setData(setLoadIdentifySetParamCmd).then(() => {}, (status) => {
            $scope.loadParam.sensorParamRes = 'error';
            $timeout(function() {
                $scope.loadParam.sensorParamRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('652', e => {
        getDynamicData('sensorLoad');
        if (e.detail == 1) {
            $scope.loadParam.sensorParamRes = 'success';
        } else {
            $scope.loadParam.sensorParamRes = 'error';
        }
        $timeout(function() {
            $scope.loadParam.sensorParamRes = null;
        }, 5000)
    });

    /** ËÆ∞ÂΩ?‰º†Ê??Â?®Ë?™Â?®Ê†°È?∂Ê?∞ÊçÆËÆ∞ÂΩ? */
    $scope.recordInitialPosition = function() {
        // Á??Ê?êluaÁ®?Â∫è
        let applyInternalProgramCmd = {
            cmd: "apply_internal_program",
            data: {
                name: "ForceSensorAutoZero.lua"
            }
        }
        dataFactory.actData(applyInternalProgramCmd).then(() => {
            g_fileNameForUpload = "ForceSensorAutoZero.lua";
            let savePointCmd = {
                cmd: "save_local_point",
                data: {
                    local: g_fileNameForUpload,
                    name: "ForceSensorAutoZero",
                    speed: $scope.velocity,
                    elbow_speed: $scope.velocity,
                    acc: $scope.acceleration,
                    elbow_acc: $scope.acceleration,
                    toolnum: $scope.currentCoord + "",
                    workpiecenum: $scope.currentWobjCoord + "",
                    update_programfile: 1
                },
            };
            dataFactory.actData(savePointCmd).then(() => {
                $scope.loadParam.autoPointFlag = true;
            }, (status) => {
                toastFactory.error(status);
            });
        }, (status) => {
            toastFactory.error(status);
        });
    }

    // ‰º†Ê??Â?®Ë?™Â?®Ê†°È?∂
    $scope.computeForceSensorAutoZero = function() {
        g_forceSensorAutoZeroFlag = 1;
        $scope.index_uploadProgName();
    };
    document.getElementById('robotSetting').addEventListener('forceSensorAutoZeroRunning', () => {
        getDynamicData('sensorLoad');
    });
    /** ./Ë¥?ËΩΩ‚??‚??‰º†Ê??Â?®Ëæ®ËØ?Ôº?Â??/Ê?≠Á?©‰º†Ê??Â?®Ë¥?ËΩΩËæ®ËØ?Ôº? */
    /* ./Ë¥?ËΩΩËÆæÁΩÆ(ËΩ®ËøπËæ®ËØ?Â??‰º†Ê??Â?®Ëæ®ËØ?) */

    /**
     * ÂêØÁ?®Á?¥Á∫øÈΩøÊù°ÂØºËΩ®Á¢∞Ê??Ê£?Êµ?
     * @param {int} enable 
    */
    $scope.setLinearRailCollisionDetectionFlag = function(enable) {
        $scope.linearRailParam.linRailCollisionEnable = 0;
        
        let setCmd = {
            cmd: 1267,
            data: {
                content: "SetLinearRailCollisionDetectionFlag("+enable+")"
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1267', () => {
        getRobotdata();
    })

    // Ë?∑Âè?Â?≤È?èÊ£?Êµ?Âº?Â?≥
    function getImpulseDetectionSwitch() {
        let setCmd = {
            cmd: 1295,
            data: {
                content: `GetImpulseDetectionOnOff()`
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1295', (e) => {
        if (e.detail) {
            $scope.collisionParam.impulse = Number(e.detail);
        }
    })

    /**
     * ËÆæÁΩÆÂ?≤È?èÊ£?Êµ?Âº?Â?≥
     * @param {int} enable 
    */
    $scope.setImpulseDetectionSwitch = function(enable) {
        let setCmd = {
            cmd: 1294,
            data: {
                content: `SetImpulseDetectionOnOff(${enable})`
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1294', () => {
        getImpulseDetectionSwitch();
    })
    
    /**
     * È?çÁΩÆÁ?¥Á∫øÈΩøÊù°ÂØºËΩ®Á¢∞Ê??Ê£?Êµ?Âè?Ê?∞
     * @param {int} level ÂØºËΩ®Á≠?Á∫ß
     * @param {int} radius ÈΩøËΩÆÂç?Âæ?
     * @param {int} mass Êª?Âù?Ë¥®È?è
     */
    $scope.setLinearRailCollisionParam = function(level,radius,mass) {
        let setCmd = {
            cmd: 1268,
            data: {
                content: `SetLinearRailCollisionParam(${level},${radius},${mass})`
            }
        };
    $scope.linearRailParam.modeRes = 'loading';
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            $scope.linearRailParam.modeRes = 'error';
            $timeout(function() {
                $scope.linearRailParam.modeRes = null;
            }, 5000)
        });
    }
    document.getElementById('robotSetting').addEventListener('1268', () => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.linearRailParam.modeRes = 'success';
        } else {
            $scope.linearRailParam.modeRes = 'error';
        }
        $timeout(function() {
            $scope.linearRailParam.modeRes = null;
        }, 5000)
    })

    /* Ê?∫Â?®‰∫∫Â?≥Ë??È?ê‰Ωç */
    /** Â??Âª∫Âè?Âê?Êª?Âù?-Ëµ?Â?ºÂê?Â??Âª∫ */
    function createNewSlider() {
        // Â?ùÊ¨°Â??Âª∫Êª?Âù?Ê?∂‰∏çÈ??Ë¶ÅÈ??ÊØÅ
        if ($scope.softLimitParam.initFlag) {
            for(let i=0; i<6; i++) {
                $scope.softLimitParam.sliderData[`slider${i+1}`].destroy();
            }
        } else {
            $scope.softLimitParam.initFlag = 1;
        }
        for(let i=0; i<6; i++) {
            $(`#softLimit${i+1}`)[0].dataset.sliderMin = $scope[`j${i+1}SoftLimitRangeMin`];
            $(`#softLimit${i+1}`)[0].dataset.sliderMax = $scope[`j${i+1}SoftLimitRangeMax`];
            $(`#softLimit${i+1}`)[0].dataset.sliderValue = `[${$scope.softLimitParam.minLimit[`j${i+1}`]},${$scope.softLimitParam.maxLimit[`j${i+1}`]}]`;
            $scope.softLimitParam.sliderData[`slider${i+1}`] = new Slider(`#softLimit${i+1}`);
            // Êª?Âù?Ê?πÂè?Âê?Ëß¶Âè?
            $(`#softLimit${i+1}`).slider().on('change', function(slideEvt) {
                $scope.slideValue = slideEvt;
                $scope.softLimitParam.minLimit[`j${i+1}`] = slideEvt.value.newValue[0];
                $scope.softLimitParam.maxLimit[`j${i+1}`] = slideEvt.value.newValue[1];
                $scope.$apply();
            })
        }
        $scope.softLimitParam.isSet = false; // Â?®È?®Ê??‰ª§ËÆæÁΩÆË?∑Âè?ÂÆ?Ê?êÔº?Êª?Âù?Â??Á¥†Â??Âª∫ÂÆ?Ê?êÂê?ÂêØÁ?®Â??Ë?ΩÊ??È?Æ
    }

    /**
     * ËÆæÁΩÆÊ?∫Â?®‰∫∫Ê≠£È?ê‰Ωç
     * @param {string} positiveValue Ê≠£È?ê‰ΩçÂ?≠‰∏™Â?≥Ë??Ê?∞ÊçÆ
     */
    function setPositiveLimit(positiveValue) {
        $scope.softLimitParam.isSet = true; // Âº?Âß?ËÆæÁΩÆÊ?∂Á¶ÅÁ?®Â??Ë?ΩÊ??È?Æ
        let setPositiveLimitCmd = {
            cmd: 308,
            data: {
                content: `SetLimitPositive(${positiveValue})`
            }
        }
        dataFactory.setData(setPositiveLimitCmd).then(() => {}, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[11]);
        });
    }
    document.getElementById('robotSetting').addEventListener('308', e => {
        if (e.detail == 1) {
            // Ê≠£È?ê‰ΩçËÆæÁΩÆÊ?êÂ??Âê?ËÆæÁΩÆË¥?È?ê‰Ωç
            setNegativeLimit(`${negativeLimitCmdStr}`);
        } else {
            if ($scope.softLimitParam.resumeRes == 'loading') {
                $scope.softLimitParam.resumeRes = 'error';
                $timeout(function() {
                    $scope.softLimitParam.resumeRes = null;
                }, 5000)
            }
            if ($scope.softLimitParam.applyRes == 'loading') {
                $scope.softLimitParam.applyRes = 'error';
                $timeout(function() {
                    $scope.softLimitParam.applyRes = null;
                }, 5000)
            }
        }
    });

    /**
     * ËÆæÁΩÆÊ?∫Â?®‰∫∫Ë¥?È?ê‰Ωç
     * @param {string} negativeValue Ë¥?È?ê‰ΩçÂ?≠‰∏™Â?≥Ë??Ê?∞ÊçÆ
     */
    function setNegativeLimit(negativeValue) {
        let setNegativeLimitCmd = {
            cmd: 309,
            data: {
                content: `SetLimitNegative(${negativeValue})`
            }
        }
        dataFactory.setData(setNegativeLimitCmd).then(() => {}, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[12]);
        });
    }
    document.getElementById('robotSetting').addEventListener('309', e => {
        if (e.detail == 1) {
            // Ê?∫Â?®‰∫∫Ë¥?È?ê‰ΩçËÆæÁΩÆÊ?êÂ??Âê?Ôº?Â?≥Ë??ËΩØÈ?ê‰ΩçÊ?∞ÊçÆÂ∫?Á?®Ê?êÂ??Ôº?Ê≠§Ê?∂Â?≥Ë??ËΩØÈ?ê‰Ωç‰øùÊ?§Â?≥È?≠Âê?Ë?∑Âè?Áª?Ê??Âπ∂È?çÊ?∞Á??Ê?êÊª?Âù?
            $scope.setSoftLimitProtectFlag(0);
            if ($scope.softLimitParam.resumeRes == 'loading') {
                $scope.softLimitParam.resumeRes = 'success';
                
            }
            if ($scope.softLimitParam.applyRes == 'loading') {
                $scope.softLimitParam.applyRes = 'success';
            }
        } else {
            if ($scope.softLimitParam.resumeRes == 'loading') {
                $scope.softLimitParam.resumeRes = 'error';
            }
            if ($scope.softLimitParam.applyRes == 'loading') {
                $scope.softLimitParam.applyRes = 'error';
            }
        }
        $timeout(function() {
            $scope.softLimitParam.resumeRes = null;
        }, 5000)
        $timeout(function() {
            $scope.softLimitParam.applyRes = null;
        }, 5000)
    });

    /**
     * Â∫?Á?®Ê?∫Â?®‰∫∫È?ê‰Ωç
     * @param {Object} max Â?≥Ë??Ê≠£È?ê‰ΩçÁ??Ê?∞ÊçÆ
     * @param {Object} min Â?≥Ë??Ë¥?È?ê‰ΩçÁ??Ê?∞ÊçÆ
     */
    $scope.applySoftLimit = function(max, min) {
        if (max.j1 === "") {
            toastFactory.info(rsDynamicTags.info_messages[17]);
        } else if (max.j2 === "") {
            toastFactory.info(rsDynamicTags.info_messages[18]);
        } else if (max.j3 === "") {
            toastFactory.info(rsDynamicTags.info_messages[19]);
        } else if (max.j4 === "") {
            toastFactory.info(rsDynamicTags.info_messages[20]);
        } else if (max.j5 === "") {
            toastFactory.info(rsDynamicTags.info_messages[21]);
        } else if (max.j6 === "") {
            toastFactory.info(rsDynamicTags.info_messages[22]);
        } else if (min.j1 === "") {
            toastFactory.info(rsDynamicTags.info_messages[23]);
        } else if (min.j2 === "") {
            toastFactory.info(rsDynamicTags.info_messages[24]);
        } else if (min.j3 === "") {
            toastFactory.info(rsDynamicTags.info_messages[25]);
        } else if (min.j4 === "") {
            toastFactory.info(rsDynamicTags.info_messages[26]);
        } else if (min.j5 === "") {
            toastFactory.info(rsDynamicTags.info_messages[27]);
        } else if (min.j6 === "") {
            toastFactory.info(rsDynamicTags.info_messages[28]);
        } else {
            $scope.softLimitParam.applyRes = 'loading';
            setPositiveLimit(`${max.j1},${max.j2},${max.j3},${max.j4},${max.j5},${max.j6}`);
            negativeLimitCmdStr = `${min.j1},${min.j2},${min.j3},${min.j4},${min.j5},${min.j6}`;
        }
    }


    /** ÊÅ¢Â§çÊ?∫Â?®‰∫∫Èª?ËÆ§È?ê‰Ωç */
    let positiveLimitCmdStr;
    let negativeLimitCmdStr;
    $scope.resumeSoftLimit = function() {
        if (g_robotTypeCode == 1 || g_robotTypeCode == 2 || g_robotTypeCode == 906) {
            positiveLimitCmdStr = "175,85,150,85,175,175";
            negativeLimitCmdStr = "-175,-265,-150,-265,-175,-175";
        } else if (g_robotTypeCode == 3) {
            positiveLimitCmdStr = "175,265,150,265,175,175";
            negativeLimitCmdStr = "-175,-85,-150,-85,-175,-175";
        } else if (g_robotType.type == 6) {
            positiveLimitCmdStr = "360,85,150,85,360,360";
            negativeLimitCmdStr = "-360,-265,-150,-265,-360,-360";
        } else if (g_robotType.type == 7) {
            positiveLimitCmdStr = "360,85,160,85,360,360";
            negativeLimitCmdStr = "-360,-265,-160,-265,-360,-360";
        } else if (g_robotTypeCode == 702) { // FR3WML
            positiveLimitCmdStr = "175,85,163,85,175,360";
            negativeLimitCmdStr = "-175,-265,-163,-265,-175,-360";
        } else if (g_robotTypeCode == 703) { // FR3WMS
            positiveLimitCmdStr = "175,85,150,85,175,360";
            negativeLimitCmdStr = "-175,-265,-150,-265,-175,-360";
        } else if (g_robotTypeCode == 802) {
            positiveLimitCmdStr = "175,85,135,175,265,175";
            negativeLimitCmdStr = "-175,-265,-135,-175,-85,-175";
        } else if (g_robotTypeCode == 803) { // FR5L
            positiveLimitCmdStr = "SetLimitPositive(175,85,170,85,175,360)";
            negativeLimitCmdStr = "SetLimitNegative(-175,-265,-170,-265,-175,-360)";
        } else if (g_robotTypeCode == 901 || g_robotTypeCode == 804) { // FR5C
            positiveLimitCmdStr = "175,85,160,85,175,360";
            negativeLimitCmdStr = "-175,-265,-160,-265,-175,-360";
        } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904) { // FR3MT || FR3C
            positiveLimitCmdStr = "175,85,150,85,355,175";
            negativeLimitCmdStr = "-175,-265,-150,-265,0,-175";
        } else if (g_robotTypeCode == 902) {
            positiveLimitCmdStr = "175,85,160,85,355,175";
            negativeLimitCmdStr = "-175,-265,-160,-265,0,-175";
        } else if (g_robotTypeCode == 905) { // FR30L
            positiveLimitCmdStr = "SetLimitPositive(175,60,160,85,175,175)";
            negativeLimitCmdStr = "SetLimitNegative(-175,-240,-160,-265,-175,-175)";
        } else if (g_robotTypeCode == 907) { // ART3-R6-XM
            positiveLimitCmdStr = "SetLimitPositive(350,90,90,175,95,175)";
            negativeLimitCmdStr = "SetLimitNegative(-5,-40,-90,-175,-95,-175)";
        } else if (g_robotTypeCode == 908) { // FC3-R6-B
            positiveLimitCmdStr = "SetLimitPositive(165,0,180,90,180,165)";
            negativeLimitCmdStr = "SetLimitNegative(-165,-180,0,-90,0,-165)";
        } else {
            positiveLimitCmdStr = "175,85,160,85,175,175";
            negativeLimitCmdStr = "-175,-265,-160,-265,-175,-175";
        }
        // Ê†πÊçÆÈ?ê‰ΩçÊ®°ÂºèÊ?πÂè?joint6ËΩØÈ?ê‰Ωç 0-Â?∫ÂÆ?È?ê‰Ωç 1-Ê?©Â±?È?ê‰Ωç¬±360
        if (g_robotTypeCode == 2 || g_robotTypeCode == 103 || g_robotTypeCode == 202 || g_robotTypeCode == 302 || g_robotTypeCode == 402) {
            if ($scope.rot360Type == 1) {
                positiveLimitCmdStr = "175,85,160,85,175,360";
                negativeLimitCmdStr = "-175,-265,-160,-265,-175,-360";
            }
        }
        $scope.softLimitParam.resumeRes = 'loading';
        // ‰∏?Âè?Èª?ËÆ§Ê≠£È?ê‰Ωç
        setPositiveLimit(positiveLimitCmdStr);
    }

    /**
     * Â?≥Ë??ËΩØÈ?ê‰Ωç‰øùÊ?§Âº?ÂêØ/Â?≥È?≠
     * @param {Number} protectFlag Â??Ë?ΩÂº?ÂêØÊ†?Âø?‰ΩçÔº?Â?≥È?≠Ôº?0Ôº?Ôº?Âº?ÂêØÔº?1Ôº?
     */
    $scope.setSoftLimitProtectFlag = function(protectFlag) {
        let setSoftLimitProtectFlagCmd = {
            cmd: 1191,
            data: {
                content: `SetSoftLimitProtectFlag(${protectFlag})`
            },
        }
        dataFactory.setData(setSoftLimitProtectFlagCmd).then(() => {}, (status) => {
            getRobotdata();
            toastFactory.error(status);
        })
    };
    document.getElementById('robotSetting').addEventListener('1191', function (e) {
        getRobotdata();
    });
    document.getElementById('robotSetting').addEventListener('setSoftLimitProtectError', function (e) {
        getRobotdata();
    });
    /* ./Ê?∫Â?®‰∫∫Â?≥Ë??È?ê‰Ωç */

    /* Ê?∫Â?®‰∫∫Á¢∞Ê??Á≠?Á∫ß */
    // ËÆæÁΩÆÁ¢∞Ê??Á≠?Á∫ß
    $scope.applyCollision = function() {
        let collisionString;
        if ($scope.collisionParam.mode.id == 1) {
            collisionString = "SetAnticollision(" + $scope.collisionParam.mode.id + ",{" + $scope.collisionParam.custom.j1 / 10 + ","
                + $scope.collisionParam.custom.j2 / 10 + "," + $scope.collisionParam.custom.j3 / 10 + "," + $scope.collisionParam.custom.j4 / 10 + ","
                + $scope.collisionParam.custom.j5 / 10 + "," + $scope.collisionParam.custom.j6 / 10 + "},1)";
        } else {
            collisionString = "SetAnticollision(" + $scope.collisionParam.mode.id + ",{" + $scope.collisionParam.grade.j1.id + ","
                + $scope.collisionParam.grade.j2.id + "," + $scope.collisionParam.grade.j3.id + "," + $scope.collisionParam.grade.j4.id + ","
                + $scope.collisionParam.grade.j5.id + "," + $scope.collisionParam.grade.j6.id + "},1)";
        }
        let setcollisionCmd = {
            cmd: 305,
            data: {
                content: collisionString,
            },
        };
        $scope.collisionParam.modeRes = 'loading';
        dataFactory.setData(setcollisionCmd).then(() => {}, (status) => {
            $scope.collisionParam.modeRes = 'error';
            $timeout(function() {
                $scope.collisionParam.modeRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    // ËÆæÁΩÆÊ?êÂ??Ê??Â§±Ë¥•Âê?Â?çÊ¨°Ë?∑Âè?Ê?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('305', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.collisionParam.modeRes = 'success';
        } else {
            $scope.collisionParam.modeRes = 'error';
        }
        $timeout(function() {
            $scope.collisionParam.modeRes = null;
        }, 5000)
    })

    /**
     * ËÆæÁΩÆÁ¢∞Ê??Á≠?Á?•Âè?Ê?∞
     * @param {Object} strategy Á¢∞Ê??Á≠?Á?•Ê®°Âºè
     * @param {String} time Á¢∞Ê??Â??ÂºπÊ®°Âºè‚??‚??ÂÆ?Â?®Ê?∂È?¥
     * @param {String} distance Á¢∞Ê??Â??ÂºπÊ®°Âºè‚??‚??ÂÆ?Â?®Ë∑ùÁ¶ª
     * @param {String} speed Á¢∞Ê??Â??ÂºπÊ®°Âºè‚??‚??ÂÆ?Â?®È??Â∫¶
     * @param {Object} rebound Á¢∞Ê??Â??ÂºπÊ®°Âºè‚??‚??J1~J6ÂÆ?Â?®Á≥ªÊ?∞
     */
    $scope.applyCollisionStrategy = function(strategy, time, distance, speed, rebound) {
        let setcollisionStrategyCmd = {
            cmd: 569,
            data: {
                content: `SetCollisionStrategy(${strategy.id},${time},${distance},${speed},{${rebound.j1.id},${rebound.j2.id},${rebound.j3.id},${rebound.j4.id},${rebound.j5.id},${rebound.j6.id}})`,
            },
        };
        $scope.collisionParam.strategyRes = 'loading';
        dataFactory.setData(setcollisionStrategyCmd).then(() => {}, (status) => {
            $scope.collisionParam.strategyRes = 'error';
            $timeout(function() {
                $scope.collisionParam.strategyRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    // ËÆæÁΩÆÊ?êÂ??Ê??Â§±Ë¥•Âê?Â?çÊ¨°Ë?∑Âè?Ê?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('569', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.collisionParam.strategyRes = 'success';
        } else {
            $scope.collisionParam.strategyRes = 'error';
        }
        $timeout(function() {
            $scope.collisionParam.strategyRes = null;
        }, 5000)
    })

    /**
     * Èù?Ê?Å‰∏?Á¢∞Ê??Ê£?Êµ?Âº?Â?≥
     * @param {int} enable 0-Â?≥È?≠Ôº?1-Âº?ÂêØ
     */
    $scope.setStaticCollisionOnOff = function(enable) {
        let setCmd = {
            cmd: 960,
            data: {
                content: `SetStaticCollisionOnOff(${enable})`
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    // ËÆæÁΩÆÊ?êÂ??Ê??Â§±Ë¥•Âê?Â?çÊ¨°Ë?∑Âè?Ê?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('960', () => {
        getRobotdata();
    })
    
    /**
     * Ê??Â?®Â?çÂ??Á?©Ê£?Êµ?
     * @param {int} enable 
     */
    $scope.setDragDetectionSwitch = function(enable) {
        let setCmd = {
            cmd: 1250,
            data: {
                content: "SetTorqueDetectionSwitch("+enable+")"
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            getRobotdata();
            toastFactory.error(status);
        });
    }
    // Ê??Â?®Â?çÂ??Á?©Ê£?Êµ?ËÆæÁΩÆ‰∏çÁÆ°Ê?êÂ??Ê??Â§±Ë¥•Âê?Â?çÊ¨°Ë?∑Âè?Ê?∞ÊçÆ
    document.getElementById('robotSetting').addEventListener('1250', () => {
        getRobotdata();
    })
    /* ./Ê?∫Â?®‰∫∫Á¢∞Ê??Á≠?Á∫ß */

    /* Ê?∫Â?®‰∫∫Ê?©Ê?¶Â??Ë°•ÂÅøÁ≥ªÊ?∞ */
    /**
     * ËÆæÁΩÆÊ?©Ê?¶Â??Ë°•ÂÅøÁ≥ªÊ?∞
     * @param {Object} freeData J1~J6Á??Ê?©Ê?¶Â??Ë°•ÂÅøÁ≥ªÊ?∞
     * @returns 
     */
    $scope.applyFrictionValue = function(freeData) {
        if (freeData.j1 === "" || freeData.j2 === "" || freeData.j3 === "" || freeData.j4 === "" || freeData.j5 === "" || freeData.j6 === "") {
            toastFactory.info(rsDynamicTags.info_messages[41]);
            return;
        }
        const frictionValueCmd = {
            cmd: 637,
            data: {
                content: `SetFrictionValue_freedom(${freeData.j1},${freeData.j2},${freeData.j3},${freeData.j4},${freeData.j5},${freeData.j6})`,
            },
        };
        $scope.frictionParam.res = 'loading';
        dataFactory.setData(frictionValueCmd).then(() => {}, (status) => {
            $scope.frictionParam.res = 'error';
            $timeout(function() {
                $scope.frictionParam.res = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('637', e => {
        if (e.detail == 1) {
            $scope.frictionParam.res = 'success';
        } else {
            $scope.frictionParam.res = 'error';
        }
        $timeout(function() {
            $scope.frictionParam.res = null;
        }, 5000)
    })

    /**
     * ËÆæÁΩÆÊ?©Ê?¶Â??Ë°•ÂÅøÂº?Â?≥
     * @param {Number} toggle 0-Â?≥È?≠Ôº?1-Âº?ÂêØ
     */
    $scope.applyDragFriction = function(toggle) {
        let dragFrictionCmd = {
            cmd: 338,
            data: {
                content: `FrictionCompensationOnOff(${toggle})`,
            },
        };
        dataFactory.setData(dragFrictionCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * ËÆæÁΩÆÊ??Â?®Â??Ë°•ÂÅøÂè?Ê?∞
     * @param {string} flag Ê??Â?®Â??Ë°•ÂÅøÂº?Â?≥
     * @param {string} adjustFlag Ê??Â?®Â??Ë°•ÂÅøË?™È??Â∫?Âº?Â?≥
     * @param {Object} jointsCof J1~J6Á??Ê??Â?®Â??Ë°•ÂÅøÁ≥ªÊ?∞
     */
    $scope.setDragCompensationParam = function(flag, adjustFlag, jointsCof) { 
        let dragCompensationCmd = {
            cmd: 1219,
            data: {
                content: `SetDragGain(${flag},${adjustFlag},{${jointsCof.j1},${jointsCof.j2},${jointsCof.j3},${jointsCof.j4},${jointsCof.j5},${jointsCof.j6}})`,
            }
        };
        $scope.dragCompParam.res = 'loading';
        dataFactory.setData(dragCompensationCmd).then(() => {}, (status) => {
            $scope.dragCompParam.res = 'error';
            $timeout(function() {
                $scope.dragCompParam.res = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1219', (e) => {
        if (e.detail == 1) {
            $scope.dragCompParam.res = 'success';
        } else {
            getDynamicData('dragComp');
            $scope.dragCompParam.res = 'error';
        }
        $timeout(function() {
            $scope.dragCompParam.res = null;
        }, 5000)
    });
    /* ./Ê?∫Â?®‰∫∫Ê?©Ê?¶Â??Ë°•ÂÅøÁ≥ªÊ?∞ */

    /* IO--DIÈ?çÁΩÆ */
    let manualAutoSwitchRes = false; // Ê?ØÂê¶Âê?Ê?∂È?çÁΩÆÊ??Ë?™Â?®Â??Êç¢Ôº?Ë??Â?≤‰ø°Âè∑Ôº?Â??Ê??Ë?™Â?®Â??Êç¢Ôº?È´?‰Ω?Á?µÂπ≥Ôº?
    /**
     * È?çÁΩÆDIÂ??Ë?ΩÊ?∂Ôº?‰∏çË?ΩÂê?Ê?∂È??Ê?©Á??Â?∫Ê?ØÔº?ÂΩ?Â?ç‰∏çË?ΩÂê?Ê?∂Ôº?
     * @param {string} currentDIVal ÂΩ?Â?çÈ??Ê?©Á??CI‰ø°Âè∑ÂØπÂ∫?Á??Â?ºÔº?ÂØπÂ∫?selectedCfgDI8~selectedCfgDI15Á??Â?º
     * @param {number} DIIndex ÂΩ?Â?çÈ??Ê?©Á??CI‰ø°Âè∑ÂØπÂ∫?Á??indexÔº?8~15
     */
    $scope.changeDICfg = function(currentDIVal, DIIndex) {
        // Â∞?config-selectÁ??ng-modelÂ?ºËµ?Â?ºÂ?∞ÂΩ?Â?çjs‰∏≠ÂØπÂ∫?Á??$scopeÂ?ºÔº?Âê¶Â??‰∏?Á?¥Ê?Ø‰∏?‰∏?Ê¨°Á??Â?º
        $scope.diParam.configerableInput[`di${DIIndex}`] = currentDIVal;
        manualAutoSwitchRes = false;
        robotDIList.forEach((item, itemIndex) => {
            $(`#selectedCfgDI${Number(itemIndex) + 8} select`).removeClass("is-invalid");
            robotDIList.forEach((element, elementIndex) => {
                if (item != element && (($scope.diParam.configerableInput[item] == '12' && $scope.diParam.configerableInput[element] == '31')
                    || ($scope.diParam.configerableInput[item] == '31' && $scope.diParam.configerableInput[element] == '12'))) {
                    manualAutoSwitchRes = true;
                    $(`#selectedCfgDI${Number(itemIndex) + 8} select`).addClass("is-invalid");
                    $(`#selectedCfgDI${Number(elementIndex) + 8} select`).addClass("is-invalid");
                }
            })
        })
    }

    /** CI0~CI7ÂØπÂ∫?Â??Ë?Ωdisable‰∏?Ê??Ê°? */
    $scope.ctrlCIOptionsDisabled = function (selectedValue) {
        if (selectedValue == '-1' 
            || (selectedValue == '20' && g_systemFlag)
            || (selectedValue == '21' && g_systemFlag)
            || (selectedValue == '22' && g_systemFlag)
            || (selectedValue == '23' && g_systemFlag)
            || (selectedValue == '24' && g_systemFlag)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * È?çÁΩÆDIÂèØÈ?çÁΩÆËæ?Â?•Ôº?CI0~CI7Ôº?Â??Ë?ΩÂ?ΩÊ?∞
     * @param {string} di8 ÂèØÈ?çÁΩÆËæ?Â?•CI0Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di9 ÂèØÈ?çÁΩÆËæ?Â?•CI1Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di10 ÂèØÈ?çÁΩÆËæ?Â?•CI2Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di11 ÂèØÈ?çÁΩÆËæ?Â?•CI3Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di12 ÂèØÈ?çÁΩÆËæ?Â?•CI4Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di13 ÂèØÈ?çÁΩÆËæ?Â?•CI5Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di14 ÂèØÈ?çÁΩÆËæ?Â?•CI6Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {string} di15 ÂèØÈ?çÁΩÆËæ?Â?•CI7Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     */
    $scope.setDICfg = function(di8, di9, di10, di11, di12, di13, di14, di15) {
        if (manualAutoSwitchRes) {
            toastFactory.info(rsDynamicTags.info_messages[53]);
        } else {
            let setDiCfgCmd = {
                cmd: 323,
                data: {
                    content: `SetDIConfig(${di8},${di9},${di10},${di11},${di12},${di13},${di14},${di15})`,
                },
            };
            if ($scope.showRobotSet.di) {
                $scope.diParam.configRes = 'loading';
            }
            dataFactory.setData(setDiCfgCmd).then(() => {}, (status) => {
                if ($scope.diParam.configRes == 'loading') {
                    $scope.diParam.configRes = 'error';
                    $timeout(function() {
                        $scope.diParam.configRes = null;
                    }, 5000)
                }
                toastFactory.error(status);
                $scope.setEndDICfg($scope.diParam.endInput.di1, $scope.diParam.endInput.di2);
            });
        }
    }
    document.getElementById('robotSetting').addEventListener('323', (e) => {
        if (e.detail == '1') {
            if ($scope.toolCoordParam.photoElectric.deviceShow) {
                updateTCPCorrectionData();
                $scope.setEndDICfg(diParam.endInput.di1,diParam.endInput.di2);
            } else {
                getRobotdata();
            }
            if ($scope.showRobotSet.workpoint) {
                $scope.setIOAlias($scope.aliasParam.ctrlBox.di, $scope.aliasParam.ctrlBox.do, $scope.aliasParam.ctrlBox.ai, $scope.aliasParam.ctrlBox.ao,
                    $scope.aliasParam.endEff.di, $scope.aliasParam.endEff.do, $scope.aliasParam.endEff.ai, $scope.aliasParam.endEff.ao);
            }
            getIOConfigContent();
            if ($scope.diParam.configRes == 'loading') {
                $scope.diParam.configRes = 'success';
            }
            if ($scope.workHomeParam.signalRes == 'loading') {
                $scope.workHomeParam.signalRes = 'success';
            }
        } else {
            if ($scope.diParam.configRes == 'loading') {
                $scope.diParam.configRes = 'error';
            }
            if ($scope.workHomeParam.signalRes == 'loading') {
                $scope.workHomeParam.signalRes = 'error';
            }
        }
        if ($scope.diParam.configRes) {
            $timeout(function() {
                $scope.diParam.configRes = null;
            }, 5000)
        }
        if ($scope.workHomeParam.signalRes) {
            $timeout(function() {
                $scope.workHomeParam.signalRes = null;
            }, 5000)
        }
    });

    /**
     * È?çÁΩÆDIÂèØÈ?çÁΩÆËæ?Â?•Ôº?CI0~CI7Ôº?Ê??Ê??Á?∂Ê?Å
     * @param {string} di8 ÂèØÈ?çÁΩÆËæ?Â?•CI0È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di9 ÂèØÈ?çÁΩÆËæ?Â?•CI1È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di10 ÂèØÈ?çÁΩÆËæ?Â?•CI2È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di11 ÂèØÈ?çÁΩÆËæ?Â?•CI3È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di12 ÂèØÈ?çÁΩÆËæ?Â?•CI4È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di13 ÂèØÈ?çÁΩÆËæ?Â?•CI5È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di14 ÂèØÈ?çÁΩÆËæ?Â?•CI6È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di15 ÂèØÈ?çÁΩÆËæ?Â?•CI7È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     */
    $scope.setDIValid = function(di8, di9, di10, di11, di12, di13, di14, di15) {
        let setDiCfgLevelCmd = {
            cmd: 335,
            data: {
                content: `SetDIConfigLevel(${di8},${di9},${di10},${di11},${di12},${di13},${di14},${di15})`,
            },
        };
        $scope.diParam.validRes = 'loading';
        dataFactory.setData(setDiCfgLevelCmd).then(() => {}, (status) => {
            $scope.diParam.validRes = 'error';
            $timeout(function() {
                $scope.diParam.validRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('335', (e) => {
        if (e.detail == '1') {
            $scope.diParam.validRes = 'success';
        } else {
            $scope.diParam.validRes = 'error';
        }
        $timeout(function() {
            $scope.diParam.validRes = null;
        }, 5000)
    });

    /**
     * È?çÁΩÆDIÈ??Á?®Ëæ?Â?•Ôº?DI0~DI7Ôº?Ê??Ê??Á?∂Ê?Å
     * @param {string} di0Valid DI0È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di1Valid DI1È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di2Valid DI2È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di3Valid DI3È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di4Valid DI4È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di5Valid DI5È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di6Valid DI6È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     * @param {string} di7Valid DI7È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º
     */
    $scope.setCommonDIValid = function (di0Valid, di1Valid, di2Valid, di3Valid, di4Valid, di5Valid, di6Valid, di7Valid) {
        let setCommonDIValidCmd = {
            cmd: 836,
            data: {
                content: `SetStandardDILevel({${di0Valid},${di1Valid},${di2Valid},${di3Valid},${di4Valid},${di5Valid},${di6Valid},${di7Valid}})`
            }
        }
        $scope.diParam.generalRes = 'loading';
        dataFactory.setData(setCommonDIValidCmd).then(() => {}, (status) => {
            $scope.diParam.generalRes = 'error';
            $timeout(function() {
                $scope.diParam.generalRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('836', (e) => {
        if (e.detail == '1') {
            $scope.diParam.generalRes = 'success';
        } else {
            $scope.diParam.generalRes = 'error';
        }
        $timeout(function() {
            $scope.diParam.generalRes = null;
        }, 5000)
    });

    /** End DI0~End DI1ÂØπÂ∫?Â??Ë?Ωdisable‰∏?Ê??Ê°? */
    $scope.ctrlEndCIOptionsDisabled = function (selectedValue) {
        if (selectedValue == '-1') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * È?çÁΩÆDIÊ?´Á´ØËæ?Â?•Ôº?End DI0~End DI1Ôº?Â??Ë?ΩÂ?ΩÊ?∞
     * @param {String} endDi1 
     * @param {String} endDi2 
     */
    $scope.setEndDICfg = function(endDi1, endDi2) {
        let setEndDiCfgCmd = {
            cmd: 369,
            data: {
                content: `SetToolDIConfig(${endDi1},${endDi2})`,
            },
        };
        if ($scope.showRobotSet.di) {
            $scope.diParam.endInputRes = 'loading';
        }
        dataFactory.setData(setEndDiCfgCmd).then(() => {}, (status) => {
            if ($scope.diParam.endInputRes == 'loading') {
                $scope.diParam.endInputRes = 'error';
                $timeout(function() {
                    $scope.diParam.endInputRes = null;
                }, 5000)
            }
            if ($scope.workHomeParam.endSignalRes == 'loading') {
                $scope.workHomeParam.endSignalRes = 'error';
                $timeout(function() {
                    $scope.workHomeParam.endSignalRes = null;
                }, 5000)
            }
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('369', (e) => {
        if (e.detail == '1') {
            getRobotdata();
            getIOConfigContent();
            if ($scope.diParam.endInputRes == 'loading') {
                $scope.diParam.endInputRes = 'success';
            }
            if ($scope.workHomeParam.endSignalRes == 'loading') {
                $scope.workHomeParam.endSignalRes = 'success';
            }
        } else {
            if ($scope.diParam.endInputRes == 'loading') {
                $scope.diParam.endInputRes = 'error';
            }
            if ($scope.workHomeParam.endSignalRes == 'loading') {
                $scope.workHomeParam.endSignalRes = 'error';
            }
        }
        if ($scope.diParam.endInputRes) {
            $timeout(function() {
                $scope.diParam.endInputRes = null;
            }, 5000)
        }
        if ($scope.workHomeParam.endSignalRes) {
            $timeout(function() {
                $scope.workHomeParam.endSignalRes = null;
            }, 5000)
        }
    });

    /**
     * È?çÁΩÆDIÊ?´Á´ØËæ?Â?•Ôº?End DI0~End DI1Ôº?È´?‰Ω?Á?µÂπ≥Ê??Ê??Á?∂Ê?Å
     * @param {String} endDi1 
     * @param {String} endDi2 
     */
    $scope.setEndDIValid = function(endDi1, endDi2) {
        let setEndDiCfgLevelCmd = {
            cmd: 371,
            data: {
                content: `SetToolDIConfigLevel(${endDi1},${endDi2})`,
            },
        };
        $scope.diParam.endValidRes = 'loading';
        dataFactory.setData(setEndDiCfgLevelCmd).then(() => {}, (status) => {
            $scope.diParam.endValidRes = 'error';
            $timeout(function() {
                $scope.diParam.endValidRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('371', (e) => {
        if (e.detail == '1') {
            $scope.diParam.endValidRes = 'success';
        } else {
            $scope.diParam.endValidRes = 'error';
        }
        $timeout(function() {
            $scope.diParam.endValidRes = null;
        }, 5000)
    });
    /* ./IO--DIÈ?çÁΩÆ */

    /* IO--DOÈ?çÁΩÆ */
    /** COÂØπÂ∫?Â??Ë?Ωdisable‰∏?Ê??Ê°? */
    $scope.ctrlCOOptionsDisabled = function (selectedValue) {
        if (selectedValue == '-1' 
            || (selectedValue == '20' && g_systemFlag)
            || (selectedValue == '21' && g_systemFlag)
            || (selectedValue == '23' && g_systemFlag)
            || (selectedValue == '24' && g_systemFlag)
            || (selectedValue == '25' && g_systemFlag)
            || (selectedValue == '26' && g_systemFlag)
            || (selectedValue == '27' && g_systemFlag)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * È?çÁΩÆDOÂèØÈ?çÁΩÆËæ?Â?∫Ôº?CO0~CO7Ôº?Â??Ë?ΩÂ?ΩÊ?∞
     * @param {String} do8 ÂèØÈ?çÁΩÆËæ?Â?∫CO0Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do9 ÂèØÈ?çÁΩÆËæ?Â?∫CO1Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do10 ÂèØÈ?çÁΩÆËæ?Â?∫CO2Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do11 ÂèØÈ?çÁΩÆËæ?Â?∫CO3Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do12 ÂèØÈ?çÁΩÆËæ?Â?∫CO4Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do13 ÂèØÈ?çÁΩÆËæ?Â?∫CO5Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do14 ÂèØÈ?çÁΩÆËæ?Â?∫CO6Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     * @param {String} do15 ÂèØÈ?çÁΩÆËæ?Â?∫CO7Â??Ë?ΩÂ?ΩÊ?∞valueÂ?º
     */
    $scope.setDOCfg = function(do8, do9, do10, do11, do12, do13, do14, do15) {
        let setDoCfgCmd = {
            cmd: 324,
            data: {
                content: `SetDOConfig(${do8},${do9},${do10},${do11},${do12},${do13},${do14},${do15})`,
            },
        };
        $scope.doParam.configRes = 'loading';
        dataFactory.setData(setDoCfgCmd).then(() => {}, (status) => {
            $scope.doParam.configRes = 'error';
            $timeout(function() {
                $scope.doParam.configRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('324', (e) => {
        if (e.detail == '1') {
            getRobotdata();
            getIOConfigContent();
            $scope.doParam.configRes = 'success';
        } else {
            $scope.doParam.configRes = 'error';
        }
        $timeout(function() {
            $scope.doParam.configRes = null;
        }, 5000)
    });

    /**
     * È?çÁΩÆDOÂèØÈ?çÁΩÆËæ?Â?∫Ôº?CO0~CO7Ôº?Ê??Ê??Á?∂Ê?Å
     * @param {String} do8 ÂèØÈ?çÁΩÆËæ?Â?∫CO0Ê??Ê??Á?∂Ê?Å
     * @param {String} do9 ÂèØÈ?çÁΩÆËæ?Â?∫CO1Ê??Ê??Á?∂Ê?Å
     * @param {String} do10 ÂèØÈ?çÁΩÆËæ?Â?∫CO2Ê??Ê??Á?∂Ê?Å
     * @param {String} do11 ÂèØÈ?çÁΩÆËæ?Â?∫CO3Ê??Ê??Á?∂Ê?Å
     * @param {String} do12 ÂèØÈ?çÁΩÆËæ?Â?∫CO4Ê??Ê??Á?∂Ê?Å
     * @param {String} do13 ÂèØÈ?çÁΩÆËæ?Â?∫CO5Ê??Ê??Á?∂Ê?Å
     * @param {String} do14 ÂèØÈ?çÁΩÆËæ?Â?∫CO6Ê??Ê??Á?∂Ê?Å
     * @param {String} do15 ÂèØÈ?çÁΩÆËæ?Â?∫CO7Ê??Ê??Á?∂Ê?Å
     */
    $scope.setDOValid = function(do8, do9, do10, do11, do12, do13, do14, do15) {
        let setDoCfgLevelCmd = {
            cmd: 336,
            data: {
                content: `SetDOConfigLevel(${do8},${do9},${do10},${do11},${do12},${do13},${do14},${do15})`,
            },
        };
        $scope.doParam.validRes = 'loading';
        dataFactory.setData(setDoCfgLevelCmd).then(() => {}, (status) => {
            $scope.doParam.validRes = 'error';
            $timeout(function() {
                $scope.doParam.validRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('336', (e) => {
        if (e.detail == '1') {
            $scope.doParam.validRes = 'success';
        } else {
            $scope.doParam.validRes = 'error';
        }
        $timeout(function() {
            $scope.doParam.validRes = null;
        }, 5000)
    });

    /**
     * È?çÁΩÆÈ??Á?®DOÊ??Ê??Á?∂Ê?Å
     * @param {string} do0Valid DO0È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do1Valid DO1È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do2Valid DO2È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do3Valid DO3È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do4Valid DO4È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do5Valid DO5È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do6Valid DO6È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     * @param {string} do7Valid DO7È´?‰Ω?Á?µÂπ≥Ê??Ê??Â?º 
     */
    $scope.setCommonDOValid = function (do0Valid, do1Valid, do2Valid, do3Valid, do4Valid, do5Valid, do6Valid, do7Valid) {
        let setCommonDOValidCmd = {
            cmd: 837,
            data: {
                content: `SetStandardDOLevel({${do0Valid},${do1Valid},${do2Valid},${do3Valid},${do4Valid},${do5Valid},${do6Valid},${do7Valid}})`
            }
        }
        $scope.doParam.generalRes = 'loading';
        dataFactory.setData(setCommonDOValidCmd).then(() => {}, (status) => {
            $scope.doParam.generalRes = 'error';
            $timeout(function() {
                $scope.doParam.generalRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('837', (e) => {
        if (e.detail == '1') {
            $scope.doParam.generalRes = 'success';
        } else {
            $scope.doParam.generalRes = 'error';
        }
        $timeout(function() {
            $scope.doParam.generalRes = null;
        }, 5000)
    });

    /**
     * ËÆæÁΩÆ‰∏?Á?µÊ??È?¥Ê?ßÂ?∂ÁÆ±DOËæ?Â?∫
     * @param {string} do0 DO0È´?‰Ω?Á?µÂπ≥
     * @param {string} do1 DO1È´?‰Ω?Á?µÂπ≥
     * @param {string} do2 DO2È´?‰Ω?Á?µÂπ≥ 
     * @param {string} do3 DO3È´?‰Ω?Á?µÂπ≥ 
     * @param {string} do4 DO4È´?‰Ω?Á?µÂπ≥ 
     * @param {string} do5 DO5È´?‰Ω?Á?µÂπ≥ 
     * @param {string} do6 DO6È´?‰Ω?Á?µÂπ≥ 
     * @param {string} do7 DO7È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co0 CO0È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co1 CO1È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co2 CO2È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co3 CO3È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co4 CO4È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co5 CO5È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co6 CO6È´?‰Ω?Á?µÂπ≥ 
     * @param {string} co7 CO7È´?‰Ω?Á?µÂπ≥ 
     */
    $scope.setPowerOnDOLevel = function (do0, do1, do2, do3, do4, do5, do6, do7, co0, co1, co2, co3, co4, co5, co6, co7) {
        let setCmd = {
            cmd: 1109,
            data: {
                content: `SetPowerOnDOLevel({${do0},${do1},${do2},${do3},${do4},${do5},${do6},${do7},${co0},${co1},${co2},${co3},${co4},${co5},${co6},${co7}})`
            }
        }
        $scope.doParam.powerRes = 'loading';
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            $scope.doParam.powerRes = 'error';
            $timeout(function() {
                $scope.doParam.powerRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1109', e => {
        getPowerOnDOLevel();
        if (e.detail == '1') {
            $scope.doParam.powerRes = 'success';
        } else {
            $scope.doParam.powerRes = 'error';
        }
        $timeout(function() {
            $scope.doParam.powerRes = null;
        }, 5000)
    })

    /** Ë?∑Âè?‰∏?Á?µÊ??È?¥Ê?ßÂ?∂ÁÆ±DOËæ?Â?∫Á?∂Ê?Å */
    function getPowerOnDOLevel() {
        let setCmd = {
            cmd: 1110,
            data: {
                content:"GetPowerOnDOLevel()",
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.getElementById('robotSetting').addEventListener('1110', e => {
        let arr = e.detail.split(',');
        $scope.doParam.ctrlPowerValid.do0 = $scope.controlBoxDoData[~~arr[0]];
        $scope.doParam.ctrlPowerValid.do1 = $scope.controlBoxDoData[~~arr[1]];
        $scope.doParam.ctrlPowerValid.do2 = $scope.controlBoxDoData[~~arr[2]];
        $scope.doParam.ctrlPowerValid.do3 = $scope.controlBoxDoData[~~arr[3]];
        $scope.doParam.ctrlPowerValid.do4 = $scope.controlBoxDoData[~~arr[4]];
        $scope.doParam.ctrlPowerValid.do5 = $scope.controlBoxDoData[~~arr[5]];
        $scope.doParam.ctrlPowerValid.do6 = $scope.controlBoxDoData[~~arr[6]];
        $scope.doParam.ctrlPowerValid.do7 = $scope.controlBoxDoData[~~arr[7]];
        $scope.doParam.ctrlPowerValid.co0 = $scope.controlBoxDoData[~~arr[8]];
        $scope.doParam.ctrlPowerValid.co1 = $scope.controlBoxDoData[~~arr[9]];
        $scope.doParam.ctrlPowerValid.co2 = $scope.controlBoxDoData[~~arr[10]];
        $scope.doParam.ctrlPowerValid.co3 = $scope.controlBoxDoData[~~arr[11]];
        $scope.doParam.ctrlPowerValid.co4 = $scope.controlBoxDoData[~~arr[12]];
        $scope.doParam.ctrlPowerValid.co5 = $scope.controlBoxDoData[~~arr[13]];
        $scope.doParam.ctrlPowerValid.co6 = $scope.controlBoxDoData[~~arr[14]];
        $scope.doParam.ctrlPowerValid.co7 = $scope.controlBoxDoData[~~arr[15]];
    })
    /* ./IO--DOÈ?çÁΩÆ */
    
    /*I/OÂ?´ÂêçÈ?çÁΩÆ */
    /*Ë?∑Âè?I/OÂ?´ÂêçÊ?∞ÊçÆ */
    function getIOAliasData() {
        const getAliasCmd = {
            cmd: 'get_IO_alias_cfg'
        };
        dataFactory.getData(getAliasCmd).then(data => {
            $scope.aliasParam.ctrlBox.di = data.CtrlBox.DI;
            $scope.aliasParam.ctrlBox.do = data.CtrlBox.DO;
            $scope.aliasParam.ctrlBox.ai = data.CtrlBox.AI;
            $scope.aliasParam.ctrlBox.ao = data.CtrlBox.AO;
            $scope.aliasParam.endEff.di = data.EndEff.DI;
            $scope.aliasParam.endEff.do = data.EndEff.DO;
            $scope.aliasParam.endEff.ai = data.EndEff.AI;
            $scope.aliasParam.endEff.ao = data.EndEff.AO;
            judgeIOConfigContent();
        }, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[19]);
        });
    };
    /**./Ë?∑Âè?I/OÂ?´ÂêçÊ?∞ÊçÆ */

    /**
     * È?çÁΩÆI/OÂ?´Âêç
     * @param {array} ctrlDIArr Ê?ßÂ?∂ÁÆ±DIÂ?´Âêç
     * @param {array} ctrlDOArr Ê?ßÂ?∂ÁÆ±DOÂ?´Âêç
     * @param {array} ctrlAIArr Ê?ßÂ?∂ÁÆ±AIÂ?´Âêç
     * @param {array} ctrlAOArr Ê?ßÂ?∂ÁÆ±AOÂ?´Âêç
     * @param {array} endDIArr Ê?´Á´ØDIÂ?´Âêç
     * @param {array} endDOArr Ê?´Á´ØDOÂ?´Âêç
     * @param {array} endAIArr Ê?´Á´ØAIÂ?´Âêç
     * @param {array} endAOArr Ê?´Á´ØAOÂ?´Âêç
     */
    $scope.setIOAlias = function(ctrlDIArr, ctrlDOArr, ctrlAIArr, ctrlAOArr, endDIArr, endDOArr, endAIArr, endAOArr) {
        const setAliasParams = {
            cmd: 'set_IO_alias_cfg',
            data: {
                CtrlBox: {
                    DI: ctrlDIArr,
                    DO: ctrlDOArr,
                    AI: ctrlAIArr,
                    AO: ctrlAOArr
                },
                EndEff: {
                    DI: endDIArr,
                    DO: endDOArr,
                    AI: endAIArr,
                    AO: endAOArr
                }
            }
        };
        if ($scope.showRobotSet.alias) {
            $scope.aliasParam.res = 'loading';
        }
        dataFactory.actData(setAliasParams).then(() => {
            document.dispatchEvent(new CustomEvent('setIOAliasData', { bubbles: true, cancelable: true, composed: true }));
            if ($scope.aliasParam.res == 'loading') {
                $scope.aliasParam.res = 'success';
                $timeout(function() {
                    $scope.aliasParam.res = null;
                }, 5000)
            }
        }, (status) => {
            if ($scope.aliasParam.res == 'loading') {
                $scope.aliasParam.res = 'error';
                $timeout(function() {
                    $scope.aliasParam.res = null;
                }, 5000)
            }
            toastFactory.error(status, rsDynamicTags.error_messages[20]);
        });
    };
    /**./È?çÁΩÆI/OÂ?´Âêç */

    /**
     * Ê?ßÂ?∂ÁÆ±Ëæ?Â?•Â∑≤È?çÁΩÆÊ?∂,Á¶ÅÁ?®Â?´ÂêçÈ?çÁΩÆÁ??Èù¢ÂØπÂ∫?Ëæ?Â?•Ê°?Ôº?Âèç‰π?‰∏çÁ¶ÅÁ?®
     * @param {string} aliasDIItem Ê?ßÂ?∂ÁÆ±Ëæ?Â?•ÂêçÁß∞
     * @returns Ê?ØÂê¶Á¶ÅÁ?®
     */
    $scope.setIOCtrlAliasDisabled = function(aliasDIItem) {
        switch (aliasDIItem) {
            case 'CI0':
                return $scope.diParam.configerableInput.di8 != '0';
            case 'CI1':
                return $scope.diParam.configerableInput.di9 != '0';
            case 'CI2':
                return $scope.diParam.configerableInput.di10 != '0';
            case 'CI3':
                return $scope.diParam.configerableInput.di11 != '0';
            case 'CI4':
                return $scope.diParam.configerableInput.di12 != '0';
            case 'CI5':
                return $scope.diParam.configerableInput.di13 != '0';
            case 'CI6':
                return $scope.diParam.configerableInput.di14 != '0';
            case 'CI7':
                return $scope.diParam.configerableInput.di15 != '0';
            case 'CO0':
                return $scope.doParam.configerableOut.do8 != '0';
            case 'CO1':
                return $scope.doParam.configerableOut.do9 != '0';
            case 'CO2':
                return $scope.doParam.configerableOut.do10 != '0';
            case 'CO3':
                return $scope.doParam.configerableOut.do11 != '0';
            case 'CO4':
                return $scope.doParam.configerableOut.do12 != '0';
            case 'CO5':
                return $scope.doParam.configerableOut.do13 != '0';
            case 'CO6':
                return $scope.doParam.configerableOut.do14 != '0';
            case 'CO7':
                return $scope.doParam.configerableOut.do15 != '0';
            default:
                break;
        }
    };
    /**./Ê?ßÂ?∂ÁÆ±Ëæ?Â?•Â∑≤È?çÁΩÆÊ?∂,Á¶ÅÁ?®Â?´ÂêçÈ?çÁΩÆÁ??Èù¢ÂØπÂ∫?Ëæ?Â?•Ê°?Ôº?Âèç‰π?‰∏çÁ¶ÅÁ?® */
    /**
     * Ê?´Á´ØËæ?Â?•Â∑≤È?çÁΩÆÊ?∂,Á¶ÅÁ?®Â?´ÂêçÈ?çÁΩÆÁ??Èù¢ÂØπÂ∫?Ëæ?Â?•Ê°?Ôº?Âèç‰π?‰∏çÁ¶ÅÁ?®
     * @param {string} aliasDIItem Ê?´Á´ØËæ?Â?•ÂêçÁß∞
     * @returns Ê?ØÂê¶Á¶ÅÁ?®
     */
    $scope.setIOEndAliasDisabled = function(aliasDIItem) {
        switch (aliasDIItem) {
            case 'DI0':
                return $scope.diParam.endInput.di1 != '0';
            case 'DI1':
                return $scope.diParam.endInput.di2 != '0';
            default:
                break;
        }
    };
    /**./Ê?´Á´ØËæ?Â?•Â∑≤È?çÁΩÆÊ?∂,Á¶ÅÁ?®Â?´ÂêçÈ?çÁΩÆÁ??Èù¢ÂØπÂ∫?Ëæ?Â?•Ê°?Ôº?Âèç‰π?‰∏çÁ¶ÅÁ?® */

    /* Â?§Ê?≠Ê?∫Â?®‰∫∫È?çÁΩÆIOÂ??ÂÆπÂ??È?çÁΩÆÁ??IOÂ?´ÂêçÊ?ØÂê¶Á?∏Âê?,Âè™Ë¶ÅÂ≠?Â?®‰∏çÂê?Â∞±‰∏?Âè?È?çÁΩÆIOÂ?´Âêç*/
    function judgeIOConfigContent() {
        const robotDIResult = robotDIList.find((item, index) => {
            return $scope.aliasParam.ctrlBox.di[index + 8] != $scope.DICfgData[Number($scope.diParam.configerableInput[item]) + 1].name && $scope.diParam.configerableInput[item] != '0';
        });
        const robotDOResult = robotDOList.find((item, index) => {
            return $scope.aliasParam.ctrlBox.do[index + 8] != $scope.DOCfgData[Number($scope.doParam.configerableOut[item]) + 1].name && $scope.doParam.configerableOut[item] != '0';
        });
        const robotEndDIResult = robotEndDIList.find((item, index) => {
            return $scope.aliasParam.endEff.di[index] != $scope.EndDICfgData[Number($scope.diParam.endInput[item]) + 1].name && $scope.diParam.endInput[item] != '0';
        });
        if (robotDIResult || robotDOResult || robotEndDIResult) {
            getIOConfigContent();
        }
    };

    /* Ë?∑Âè?DI„?ÅDOÈ?çÁΩÆÁ??Ê??Â≠?Â??ÂÆπ*/
    function getIOConfigContent() {
        // CtrlBox‚??‚??‚??‚??CI0-7
        robotDIList.forEach((item, index) => {
            if ($scope.diParam.configerableInput[item] == '0') {
                if ($scope.aliasParam.ctrlBox.di[index + 8]) {
                    if ($scope.DICfgData.find(element => element.name == $scope.aliasParam.ctrlBox.di[index + 8])) {
                        if ($scope.DICfgData[Number($scope.diParam.configerableInput[item]) + 1].name == $scope.DICfgData[1].name) {
                            $scope.aliasParam.ctrlBox.di[index + 8] = '';
                        } else {
                            $scope.aliasParam.ctrlBox.di[index + 8] = $scope.DICfgData[Number($scope.diParam.configerableInput[item]) + 1].name;
                        }
                    } else {
                        $scope.aliasParam.ctrlBox.di[index + 8] = $scope.aliasParam.ctrlBox.di[index + 8];
                    }
                } else {
                    $scope.aliasParam.ctrlBox.di[index + 8] = '';
                }
            } else {
                $scope.aliasParam.ctrlBox.di[index + 8] = $scope.DICfgData[Number($scope.diParam.configerableInput[item]) + 1].name;
            }
        });
        // CtrlBox‚??‚??‚??‚??CO0-7
        robotDOList.forEach((item, index) => {
            if ($scope.doParam.configerableOut[item] == '0') {
                if ($scope.aliasParam.ctrlBox.do[index + 8]) {
                    if ($scope.DOCfgData.find(element => element.name == $scope.aliasParam.ctrlBox.do[index + 8])) {
                        if ($scope.DOCfgData[Number($scope.doParam.configerableOut[item]) + 1].name == $scope.DOCfgData[1].name) {
                            $scope.aliasParam.ctrlBox.do[index + 8] = '';
                        } else {
                            $scope.aliasParam.ctrlBox.do[index + 8] = $scope.DOCfgData[Number($scope.doParam.configerableOut[item]) + 1].name;
                        }
                    } else {
                        $scope.aliasParam.ctrlBox.do[index + 8] = $scope.aliasParam.ctrlBox.do[index + 8];
                    }
                } else {
                    $scope.aliasParam.ctrlBox.do[index + 8] = '';
                }
            } else {
                $scope.aliasParam.ctrlBox.do[index + 8] = $scope.DOCfgData[Number($scope.doParam.configerableOut[item]) + 1].name;
            }
        });
        // EndEff‚??‚??‚??‚??DI
        robotEndDIList.forEach((item, index) => {
            if ($scope.diParam.endInput[item] == '0') {
                if ($scope.aliasParam.endEff.di[index]) {
                    if ($scope.EndDICfgData.find(element => element.name == $scope.aliasParam.endEff.di[index])) {
                        if ($scope.EndDICfgData[Number($scope.diParam.endInput[item]) + 1].name == $scope.EndDICfgData[1].name) {
                            $scope.aliasParam.endEff.di[index] = '';
                        } else {
                            $scope.aliasParam.endEff.di[index] = $scope.EndDICfgData[Number($scope.diParam.endInput[item]) + 1].name;
                        }
                    } else {
                        $scope.aliasParam.endEff.di[index] = $scope.aliasParam.endEff.di[index];
                    }
                } else {
                    $scope.aliasParam.endEff.di[index] = '';
                }
            } else {
                $scope.aliasParam.endEff.di[index] = $scope.EndDICfgData[Number($scope.diParam.endInput[item]) + 1].name;
            }
        });
        $scope.setIOAlias($scope.aliasParam.ctrlBox.di, $scope.aliasParam.ctrlBox.do, $scope.aliasParam.ctrlBox.ai, $scope.aliasParam.ctrlBox.ao,
            $scope.aliasParam.endEff.di, $scope.aliasParam.endEff.do, $scope.aliasParam.endEff.ai, $scope.aliasParam.endEff.ao);
    };
    /**./I/OÂ?´ÂêçÈ?çÁΩÆ */

    /* IOÊª§Ê≥¢ */
    /**
     * Â??Êç¢Âè?Ê?∞ÂêçÁß∞Ê?∂Ôº?Ë?∑Âè?ÂΩ?Â?çÂè?Ê?∞ÂêçÁß∞Â∑≤È?çÁΩÆÁ??Âè?Ê?∞Â?º
     * @param {Object} param Âè?Ê?∞ÂêçÁß∞ÂØπË±°
     */
    $scope.getIOFilterCurParamVal = function(param) {
        $scope.ioFilterParam.value = $scope.ioFilterParam[param.key];
        $scope.ioFilterParam.res = null;
    }

    /**
     * ËÆæÁΩÆIOÊª§Ê≥¢Âè?Ê?∞ÂØπÂ∫?Ê?∞Â?º
     * @param {string} typeId Âè?Ê?∞ÂêçÁß∞ID
     * @param {string} paramValue Âè?Ê?∞Â?º
     */
    $scope.setIOFilterParamValue = function(typeId, paramValue) {
        if (paramValue === "" || paramValue === null || paramValue === undefined) {
            toastFactory.info(rsDynamicTags.info_messages[43]);
        } else {
            $scope.ioFilterParam.res = 'loading';
            switch (typeId) {
                case '0':
                    setControlDi(paramValue);
                    break;
                case '1':
                    setToolDi(paramValue);
                    break;
                case '2':
                    setControlAi(0, paramValue);
                    break;
                case '3':
                    setControlAi(1, paramValue);
                    break;
                case '4':
                    setToolAi0(paramValue);
                    break;
                case '5':
                    setToolBoxDi(paramValue);
                    break;
                case '6':
                    setAuxDIFilter(paramValue);
                    break;
                case '7':
                    setAuxAIFilter(0, paramValue);
                    break;
                case '8':
                    setAuxAIFilter(1, paramValue);
                    break;
                case '9':
                    setAuxAIFilter(2, paramValue);
                    break;
                case '10':
                    setAuxAIFilter(3, paramValue);
                    break;
                case '11':
                    setAxleExtDIFilter(paramValue);
                    break;
                default:
                    break;
            }
        }
    }

    // Ê?ßÂ?∂ÁÆ±DI
    function setControlDi(value) {
        let setControlDiCmd = {
            cmd: 222,
            data: {
                content: `SetDIFilterTime(${~~value})`,
            },
        };
        dataFactory.setData(setControlDiCmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.controlDi = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('222', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Â∑•Â?∑DI
    function setToolDi(value) {
        let settoolDiCmd = {
            cmd: 223,
            data: {
                content: `SetAxleDIFilterTime(${~~value})`,
            },
        };
        dataFactory.setData(settoolDiCmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.toolDi = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('223', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Ê?ßÂ?∂ÁÆ±AI0Â??Ê?ßÂ?∂ÁÆ±AI1
    function setControlAi(aiId, value) { 
        let setControlAi0Cmd = {
            cmd: 224,
            data: {
                content: `SetAIFilterTime(${aiId},${~~value})`,
            },
        };
        dataFactory.setData(setControlAi0Cmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam[`controlAi${aiId}`] = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('224', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Â∑•Â?∑AI0
    function setToolAi0(value) {
        let settoolAi0Cmd = {
            cmd: 225,
            data: {
                content: `SetAxleAIFilterTime(0,${~~value})`,
            },
        };
        dataFactory.setData(settoolAi0Cmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.toolAi0 = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('225', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Ê??È?ÆÁ??DI
    function setToolBoxDi(value) {
        let settoolboxCmd = {
            cmd: 665,
            data: {
                content: `SetToolBoxDIFilterTime(${~~value})`,
            },
        };
        dataFactory.setData(settoolboxCmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.boxDi = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('665', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Ê?©Â±?DI
    function setAuxDIFilter(value) {
        let setAuxDICmd = {
            cmd: 669,
            data: {
                content: `SetAuxDIFilterTime(${~~value})`,
            },
        };
        dataFactory.setData(setAuxDICmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.auxDI = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('669', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Ê?©Â±?AI0„?ÅAI1„?ÅAI2„?ÅAI3
    function setAuxAIFilter(aiId, value) {
        let setAuxAICmd = {
            cmd: 670,
            data: {
                content: `SetAuxAIFilterTime(${aiId},${~~value})`,
            },
        };
        dataFactory.setData(setAuxAICmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam[`auxAi${aiId}`] = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('670', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })

    // Smart Tool DI
    function setAxleExtDIFilter(value) {
        let setAxleExtDICmd = {
            cmd: 679,
            data: {
                content: `SetAxleExtDIFilterTime(${~~value})`,
            },
        };
        dataFactory.setData(setAxleExtDICmd).then(() => {}, (status) => {
            $scope.ioFilterParam.res = 'error';
            $timeout(function() {
                $scope.ioFilterParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioFilterParam.smartDi = value;
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('679', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioFilterParam.res = 'success';
        } else {
            $scope.ioFilterParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioFilterParam.res = null;
        }, 5000)
    })
    /* ./IOÊª§Ê≥¢ */

    /* IOËæ?Â?∫Â§ç‰Ωç */
    /**
     * Âè?Ê?∞ÂêçÁß∞Ê?πÂè?Ê?∂Ôº?Ëæ?Â?∫Á?∂Ê?ÅÂ??ÊÅ¢Â§çË?≥Â§ç‰ΩçÂ?çÁ?∂Ê?ÅÂè?Ê?∞È??Ë¶ÅË∑?È?èÊ?πÂè?
     * @param {Object} value selectÂ??Êç¢Ê?πÂè?Ê?∂Á??Ê?∞ÊçÆ
     * @param {string} parameter selectÂ??Êç¢Ê?πÂè?Á??Á±ªÂ??Ôº?type--Âè?Ê?∞ÂêçÁß∞Ê?πÂè?„?Åreset--Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?ÅÊ?πÂè?
     */
    $scope.getOutputCurState = function(value, parameter) {
        switch (parameter) {
            case 'type':
                $scope.ioOutputParam.type = value;
                $scope.ioOutputParam.value = $scope.ioOutputParam[value.key];
                if ($scope.ioOutputParam.value && $scope.ioOutputParam.value.id == 1) {
                    $scope.ioOutputParam.reload = $scope.ioOutputParam[value.reload];
                } else {
                    $scope.ioOutputParam.reload = $scope.outputWhetherData[0];
                }
                break;
            case 'reset':
                if ($scope.ioOutputParam.value && $scope.ioOutputParam.value.id == 1) {
                    $scope.ioOutputParam.reload = $scope.ioOutputParam[$scope.ioOutputParam.type.reload];
                } else {
                    $scope.ioOutputParam.reload = $scope.outputWhetherData[0];
                }
                break;
            default:
                break;
        }
        $scope.ioOutputParam.res = null;
    }
    /* ËÆæÁΩÆËæ?Â?∫Â§ç‰ΩçÔº?ÂÅ?Ê≠¢/Ê??ÂÅ?Âê?Ëæ?Â?∫Á?∂Ê?ÅÔº? */
    $scope.setOutputParamState = function() {
        if ($scope.ioOutputParam.value) {
            $scope.ioOutputParam.res = 'loading';
            switch ($scope.ioOutputParam.type.id) {
                case '0':
                    setOutputCtrlDOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '1':
                    setOutputCtrlAOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '2':
                    setOutputEndDOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '3':
                    setOutputEndAOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '4':
                    setOutputExtendDOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '5':
                    setOutputExtendAOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                case '6':
                    setOutputSmartDOReset($scope.ioOutputParam.value.id, $scope.ioOutputParam.reload.num);
                    break;
                default:
                    break;
            }
        } else {
            toastFactory.info(rsDynamicTags.info_messages[60]);
        }
    }

    /**
     * È?çÁΩÆÊ?ßÂ?∂ÁÆ±DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?ßÂ?∂ÁÆ±DOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputCtrlDOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 898,
            data: {
                content: `SetOutputResetCtlBoxDO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.controlDo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.controlDoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('898', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?ßÂ?∂ÁÆ±DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */
    
    /**
     * È?çÁΩÆÊ?ßÂ?∂ÁÆ±AOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?ßÂ?∂ÁÆ±AOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputCtrlAOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 899,
            data: {
                content: `SetOutputResetCtlBoxAO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.controlAo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.controlAoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('899', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?ßÂ?∂ÁÆ±AOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */

    /**
     * È?çÁΩÆÊ?´Á´ØÊùøDOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?´Á´ØÊùøDOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputEndDOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 900,
            data: {
                content: `SetOutputResetAxleDO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.endPlateDo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.endPlateDoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('900', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?´Á´ØÊùøDOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */

    /**
     * È?çÁΩÆÊ?´Á´ØÊùøAOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?´Á´ØÊùøAOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputEndAOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 901,
            data: {
                content: `SetOutputResetAxleAO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.endPlateAo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.endPlateAoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('901', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?´Á´ØÊùøAOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */

    /**
     * È?çÁΩÆÊ?©Â±?ËΩ¥DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?©Â±?ËΩ¥DOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputExtendDOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 902,
            data: {
                content: `SetOutputResetExtDO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.auxDo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.auxDoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('902', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?©Â±?ËΩ¥DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */

    /**
     * È?çÁΩÆÊ?©Â±?ËΩ¥AOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?Ê?©Â±?ËΩ¥AOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputExtendAOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 903,
            data: {
                content: `SetOutputResetExtAO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.auxAo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.auxAoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('903', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆÊ?©Â±?ËΩ¥AOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */

    /**
     * È?çÁΩÆSmartTool DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å
     * @param {string} state Ëæ?Â?∫Â§ç‰ΩçÁ?∂Ê?Å
     * @param {string} reload Á®?Â∫èÊ??ÂÅ?SmartTool DOÊÅ¢Â§çÂ§ç‰ΩçÂê?Ê?ØÂê¶È?çËΩΩ
     */
    function setOutputSmartDOReset(state, reload) {
        let setOutputResetCmd = {
            cmd: 904,
            data: {
                content: `SetOutputResetSmartToolDO(${state},${reload})`,
            },
        };
        dataFactory.setData(setOutputResetCmd).then(() => {}, (status) => {
            $scope.ioOutputParam.res = 'error';
            $timeout(function() {
                $scope.ioOutputParam.res = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.ioOutputParam.smartDo = $scope.outputResetData.find(item => item.id == state);
                $scope.ioOutputParam.smartDoReload = $scope.outputWhetherData.find(item => item.num == reload);
            }
            /* ./test */
        });
    }
    document.getElementById('robotSetting').addEventListener('904', e => {
        getRobotdata();
        if (e.detail == 1) {
            $scope.ioOutputParam.res = 'success';
        } else {
            $scope.ioOutputParam.res = 'error';
        }
        $timeout(function() {
            $scope.ioOutputParam.res = null;
        }, 5000)
    })
    /* ./È?çÁΩÆSmartTool DOÂÅ?Ê≠¢/Ê??ÂÅ?Ëæ?Â?∫Á?∂Ê?Å */
    /* ./IOËæ?Â?∫Â§ç‰Ωç */

    /* ‰Ω?‰∏?Â??Á?π */
    let setHomePointFlag = false;
    // ËÆæÁΩÆÊ?∫Â?®‰∫∫‰Ω?‰∏?Â??Á?π
    $scope.setRobotWorkHomePoint = function() {
        let setRobotWorkHomePointCmd = {
            cmd: "save_point",
            data: {
                name: "pHome",
                update_allprogramfile: 0
            },
        };
        $scope.workHomeParam.setRes = 'loading';
        dataFactory.actData(setRobotWorkHomePointCmd).then(() => {
            setHomePointFlag = true;
        }, (status) => {
            $scope.workHomeParam.setRes = 'error';
            $timeout(function() {
                $scope.workHomeParam.setRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.workHomeParam.isSet = 1;
                $scope.workHomeParam.point = {
                    j1: '66.66',
                    j2: '66.66',
                    j3: '66.66',
                    j4: '66.66',
                    j5: '66.66',
                    j6: '66.66',
                }
            }
            /* ./test */
        });
    }
    // Ê?∂Â?∞ËÆæÁΩÆÊ?∫Â?®‰∫∫‰Ω?‰∏?Â??Á?πÊ?êÂ??Âê?Ë?∑Âè?Á?∂Ê?Å
    document.getElementById('robotSetting').addEventListener('428', (e) => {
        if (setHomePointFlag) {
            setHomePointFlag = false;
            if (e.detail == 1) {
                getRobotWorkHomePoint();
                $scope.workHomeParam.setRes = 'success';
            } else {
                $scope.workHomeParam.setRes = 'error';
            }
            $timeout(function() {
                $scope.workHomeParam.setRes = null;
            }, 5000)
        }
    });

    // Ë?∑Âè?Ê?∫Â?®‰∫∫‰Ω?‰∏?Â??Á?π
    function getRobotWorkHomePoint() {
        let getRobotWorkHomePointCmd = {
            cmd: 429,
            data: {
                content: "GetRobotWorkHomePoint()",
            },
        };
        dataFactory.setData(getRobotWorkHomePointCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    // Ê?∂Â?∞ËÆæÁΩÆÊ?∫Â?®‰∫∫‰Ω?‰∏?Â??Á?πÊ?êÂ??Âê?Ë?∑Âè?Á?∂Ê?Å
    document.getElementById('robotSetting').addEventListener('429', function (e) {
        let pointResult = JSON.parse(e.detail);
        $scope.workHomeParam.isSet = ~~pointResult.flag;
        pointResult.joints.j1 = parseFloat(pointResult.joints.j1).toFixed(3);
        pointResult.joints.j2 = parseFloat(pointResult.joints.j2).toFixed(3);
        pointResult.joints.j3 = parseFloat(pointResult.joints.j3).toFixed(3);
        pointResult.joints.j4 = parseFloat(pointResult.joints.j4).toFixed(3);
        pointResult.joints.j5 = parseFloat(pointResult.joints.j5).toFixed(3);
        pointResult.joints.j6 = parseFloat(pointResult.joints.j6).toFixed(3);
        $scope.workHomeParam.point = pointResult.joints;
    });

    // ÁßªË?≥Ê?∫Â?®‰∫∫‰Ω?‰∏?Â??Á?π
    $scope.moveWorkHomePoint = function(){
        let moveWorkHomePointCmd = {
            cmd: "move_to_home_point",
            data: {
                ovl: "30",
            },
        };
        $scope.workHomeParam.moveRes = 'loading';
        dataFactory.actData(moveWorkHomePointCmd).then(() => {
            $scope.workHomeParam.moveRes = 'success';
            $timeout(function() {
                $scope.workHomeParam.moveRes = null;
            }, 5000)
        }, (status) => {
            $scope.workHomeParam.moveRes = 'error';
            $timeout(function() {
                $scope.workHomeParam.moveRes = null;
            }, 5000)
            toastFactory.error(status);
        });
    }

    /**
     * È?çÁΩÆ‰Ω?‰∏?Â??Á?πÊ?ßÂ?∂ÁÆ±DI‰ø°Âè∑
     * @param {String} selectDI DI‰ø°Âè∑8~15
     */
    $scope.setWorkHomePointDI = function(selectDI) {
        if (Number(selectDI) < 1) {
            toastFactory.info(rsDynamicTags.info_messages[60]);
            return;
        }
        $scope.diParam.configerableInput[`di${selectDI}`] = 11;
        $scope.aliasParam.ctrlBox.di[selectDI] = $scope.DICfgData.find(item => item.value == 11).name;
        var diCfgString = "SetDIConfig(" + $scope.diParam.configerableInput.di8 + "," + $scope.diParam.configerableInput.di9 + ","
            + $scope.diParam.configerableInput.di10 + "," + $scope.diParam.configerableInput.di11 + "," + $scope.diParam.configerableInput.di12 + ","
            + $scope.diParam.configerableInput.di13 + "," + $scope.diParam.configerableInput.di14 + "," + $scope.diParam.configerableInput.di15 + ")";
        let setDiCfgCmd = {
            cmd: 323,
            data: {
                content: diCfgString,
            },
        };
        $scope.workHomeParam.signalRes = 'loading';
        dataFactory.setData(setDiCfgCmd).then(() => {}, (status) => {
            $scope.workHomeParam.signalRes = 'error';
            $timeout(function() {
                $scope.workHomeParam.signalRes = null;
            }, 5000)
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.setIOAlias($scope.aliasParam.ctrlBox.di, $scope.aliasParam.ctrlBox.do, $scope.aliasParam.ctrlBox.ai, $scope.aliasParam.ctrlBox.ao,
                    $scope.aliasParam.endEff.di, $scope.aliasParam.endEff.do, $scope.aliasParam.endEff.ai, $scope.aliasParam.endEff.ao);
            }
            /* test */
        });
    }

    /**
     * È?çÁΩÆ‰Ω?‰∏?Â??Á?πÊ?´Á´ØDI‰ø°Âè∑
     * @param {String} selectEndDI DI‰ø°Âè∑0~1
     */
    $scope.setWorkHomePointEndDI = function(selectEndDI) {
        if (selectEndDI != 0 && selectEndDI != 1) {
            toastFactory.info(rsDynamicTags.info_messages[60]);
            return;
        }
        $scope.diParam.endInput[`di${Number(selectEndDI) + 1}`] = 16;
        $scope.aliasParam.endEff.di[selectEndDI] = $scope.EndDICfgData.find(item => item.value == 16).name;
        $scope.workHomeParam.endSignalRes = 'loading';
        $scope.setEndDICfg($scope.diParam.endInput.di1, $scope.diParam.endInput.di2);
    }
    /* ./‰Ω?‰∏?Â??Á?π */

    /* È?çÁΩÆÊ??‰ª∂ */
    // ÂØºÂ?•Ê?ßÂ?∂Â?®Ê?∞ÊçÆÂ∫?Ê??‰ª∂Ê®°Ê??Á?πÂ?ª
    $scope.selectImportCtrSqlData = function() {
        $("#ctrSqlDataImported").click();
    }

    // ÂØºÂ?•Ê?ßÂ?∂Â?®Ê?∞ÊçÆÂ∫?Ê??‰ª∂‰∫?‰ª∂
    $scope.importCtrSqlData = function() {
        var formData = new FormData();
        var file = document.getElementById("ctrSqlDataImported").files[0];
        if (file == null) {
            toastFactory.info(rsDynamicTags.info_messages[44]);
            return;
        }
        formData.append('file', file);
        dataFactory.uploadData(formData).then((data) => {
            if (typeof(data) != "object") {
                clearImportFile('ctrSqlDataImported');
                showPageRestart(rsDynamicTags.success_messages[3]);
            }
        }, (status) => {
            clearImportFile('ctrSqlDataImported');
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                showPageRestart(rsDynamicTags.success_messages[3]);
            }
        });
    }

    // ÂØºÂ?∫Ê?ßÂ?∂Â?®Ê?∞ÊçÆÂ∫?Ê??‰ª∂
    $scope.exportCtrSqlData = function () {
        dataFactory.downloadData("fr_controller_data.db");
    };

    // ÂØºÂ?∫Ê?∫Â?®‰∫∫È?çÁΩÆÊ??‰ª∂
    $scope.exportRobotcfg = function () {
        dataFactory.downloadData("user.config");
    };

    // ÂØºÂ?•Ê?∫Â?®‰∫∫È?çÁΩÆÊ??‰ª∂Ê®°Ê??Á?πÂ?ª
    $scope.selectImportRobotcfg = function() {
        $("#robotcfgImported").click();
    }

    // ÂØºÂ?•Ê?∫Â?®‰∫∫È?çÁΩÆÊ??‰ª∂‰∫?‰ª∂
    $scope.importRobotcfg = function(){
        var formData = new FormData();
        var file = document.getElementById("robotcfgImported").files[0];
        if (file == null) {
            toastFactory.info(rsDynamicTags.info_messages[44]);
            return;
        }
        formData.append('file', file);
        dataFactory.uploadData(formData).then((data) => {
            if (typeof(data) != "object") {
                checkCfgData(1);
                clearImportFile('robotcfgImported');
            }
        }, (status) => {
            clearImportFile('robotcfgImported');
            toastFactory.error(status, rsDynamicTags.error_messages[16]);
            /* test */
            if (g_testCode) {
                showPageRestart(rsDynamicTags.success_messages[3]);
            }
        });
    }

    /* Ê£?Ê?•È?çÁΩÆÊ??‰ª∂Ê?∞ÊçÆ */
    let checkConfigFileFlag = false;
    function checkCfgData(index) {
        let checkCfgCmd = {
            cmd: 345,
            data: {
                content: `CheckCFG(${index})`,
            },
        };
        dataFactory.setData(checkCfgCmd).then(() => {
            checkConfigFileFlag = true;
        }, (status) => {
            toastFactory.error(status, rsDynamicTags.error_messages[17]);
        });
    }
    document.getElementById('robotSetting').addEventListener('345', e => {
        if (checkConfigFileFlag) {
            checkConfigFileFlag = false;
            if (e.detail == 1) {
                showPageRestart(rsDynamicTags.success_messages[3]);
            }
        }
    })
    /* ./È?çÁΩÆÊ??‰ª∂ */
};
