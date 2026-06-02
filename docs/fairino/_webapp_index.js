ï»¿"use strict";

let frapp = angular
    .module("frApp", ['ngRoute', 'ngDragDrop', 'ngFileUpload', 'ngWebSocket', 'pascalprecht.translate', 'ui.bootstrap', 'ui.uploader'/*'ui.ng-uploader'*/])
    .config(['$routeProvider', routeConfigFn])
    .config(['$translateProvider', translateConfigFn])
    .controller("indexCtrl", ['$scope', '$location', '$window', 'dataFactory', 'toastFactory', '$websocket', '$route', '$timeout', 'testDataService', 'constantService', indexCtrlFn])
    .run(['$document', touchHarmonyHyperFn])
    .factory("dataFactory", ["$http", "$q", "$window", dataFactoryFn])
    .factory("toastFactory", ["$window", toastFactoryFn])
    .directive("ngTouchstart", ngTouchstartFn)
    .directive("ngTouchend", ngTouchendFn)
    .directive("limitInput", limitInputFn)
    .directive("touchSelect", touchSelectFn)
    .directive("touchInput", touchInputFn)


/** WebAppæ£æµåç¦ç¨ç­é»è¾ */
// ç¦ç¨ç½é¡µå³é®
document.oncontextmenu = function () {
    return false;
};

// æ£æµæµè§å¨æ¯å¦æ¯ævisibility API
if (typeof document.addEventListener === undefined || typeof document[hidden] === undefined) {
    console.log("å½åé¡µé¢ä¸æ¯ævisibility API");
}

// é¡µé¢æ¯å¦å¯è§ï¼å½æµè§å¨æå°åæèå¨æµè§å¨tabä¹é´åæ¢ï¼
var hidden, visibilityChange;
if (typeof document.hidden !== undefined) {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mshidden !== undefined) {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== undefined) {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}
/* ./WebAppæ£æµåç¦ç¨ç­é»è¾ */


/* èªå®ä¹æä»¤ */
/**
 * è§¦æ§å±é¿æå¼å§èªå®ä¹æä»¤
 * @returns 
 */
function ngTouchstartFn() {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                var locals = {
                    $event: event
                };
                // å¨è§¦æ¸å±ä¸é»æ­¢äºä»¶åæ³¡ï¼ä¸åè§¦åclickäºä»¶
                event.stopImmediatePropagation();
                event.preventDefault();
                $scope.$apply(function() {
                    $scope.$eval(method, locals);
                });
            }

        }]
    }
};

/**
 * è§¦æ§å±é¿æç»æèªå®ä¹æä»¤
 * @returns 
 */
function ngTouchendFn() {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchend", onTouchEnd);
            function onTouchEnd(event) {
                var method = $element.attr("ng-touchend");
                var locals = {
                    $event: event
                };
                // å¨è§¦æ¸å±ä¸é»æ­¢äºä»¶åæ³¡ï¼ä¸åè§¦åclickäºä»¶
                event.stopImmediatePropagation();
                event.preventDefault();
                $scope.$apply(function() {
                    $scope.$eval(method, locals);
                });
            }

        }]
    }
};

/**
 * èªå®ä¹é®çselectéæ©ééè§¦æ¸å±
 * @returns 
 */
function touchSelectFn() {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {
            var isOpen = false;
            $element.on('touchstart', function(e) {
                e.stopPropagation();
                if (!isOpen) {
                    isOpen = true;
                    $element.click();
                }
            })

            $element.on('change', function(e) {
                isOpen = false;
            })
        }]
    }
};

/**
 * èªå®ä¹é®çinputè¾å¥ééè§¦æ¸å±
 * @returns 
 */
function touchInputFn() {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {
            var isTouch = false;
            $element.on('touchstart', function(e) {
                e.stopPropagation();
                if (!isOpen) {
                    isTouch = true;
                    $element.click();
                }
            })

            $element.on('change', function(e) {
                isTouch = false;
            })
        }]
    }
};

/**
 * éå¶è¾å¥æ¹æ³èªå®ä¹æä»¤ï¼ç®åä»å¨ç»ä»¶åä½¿ç¨ï¼
 * @returns 
 */
function limitInputFn() {
    return function (scope, elem, attrs) {
        scope.$watch(attrs.limitInput, function (newValue) {
            if (newValue != undefined) {
                switch (scope.$ctrl.typeof) {
                    case 'int':
                        // éå¶è¾å¥å°æ°ç¹
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/[^\d-]/g, '');
                        // éå¶å¼å§å¤ä¸ª0çè¾å¥
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/((?<=^0)0+)/g, '');
                        // åªåè®¸è¾å¥ä¸ä¸ªè´å·ä¸è´å·ä¸åè®¸åºç°å¨æ°å­ä¹é´
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/\-{2,}/g, '-').replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-').replace(/(?<=\d)-$|(?<=\.)-$/g, '');
                        break;
                    case 'float':
                        // åªåè®¸è¾å¥æ°å­åå°æ°ç¹
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/[^\d\.-]/g, '');
                        // åªåè®¸è¾å¥ä¸ä¸ªå°æ°ç¹
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                        // éå¶å¼å§å¤ä¸ª0çè¾å¥
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/((?<=^0)0+)/g, '');
                        // åªåè®¸è¾å¥ä¸ä¸ªè´å·ä¸è´å·ä¸åè®¸åºç°å¨æ°å­ä¹é´
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/\-{2,}/g, '-').replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-').replace(/(?<=\d)-$|(?<=\.)-$/g, '');
                        switch (scope.$ctrl.decimal) {
                            case 2:
                                // åªåè®¸è¾å¥æå¤äºä½å°æ°
                                scope.$ctrl.val = String(scope.$ctrl.val).replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                                break;
                            case 3:
                                // åªåè®¸è¾å¥æå¤ä¸ä½å°æ°
                                scope.$ctrl.val = String(scope.$ctrl.val).replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'double':

                        break;
                    case 'special':
                        // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5]|[\^\_]/g, '');
                        break;
                    case 'special_title':
                        // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦,åªåè®¸è¾å¥ä¸åçº¿â_â
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5\_]/g, '');
                        break;
                    case 'special_point':
                        // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦,åªåè®¸è¾å¥å°æ°ç¹â.â
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/ig, '');
                        // åªåè®¸è¾å¥ä¸ä¸ªå°æ°ç¹
                        scope.$ctrl.val = String(scope.$ctrl.val).replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                        break;
                
                    default:
                        break;
                }
            }
        })
    }
}
/* ./èªå®ä¹æä»¤ */


/* é¡µé¢æ¾ç¤ºåºåæ§å¶ */
/**
 * è°æ´æºå¨äººå®è£æ¹å¼é¡µé¢å®½åº¦
 * @param {Boolean} collapseValue true:èåæ æ¶èµ·ï¼false:èåæ å±å¼ï¼
 */
var changeMountingWidth = function (collapseValue) {
    $("#vRobot-view").removeClass("vRobot-55");
    // ä¸ç»´èææºå¨äººå®½åº¦æ ¹æ®èåæ æ¯å¦æ¶èµ·æ·»å className
    if (collapseValue) {
        $("#vRobot-view").addClass("vRobot-collapse");
    } else {
        $("#vRobot-view").addClass("vRobot-col-calc");
    }
}

/**
 * è°æ´ä¸ç»´èææºå¨äººé¡µé¢å®½åº¦
 */
var changeVRobotWidth = function () {
    $("#vRobot-view").removeClass("vRobot-col-calc");
    $("#vRobot-view").removeClass("vRobot-collapse");
    $("#vRobot-view").addClass("vRobot-55");
}

/**
 * ç¹å»èåæ æ¶èµ·æé®ï¼é¡µé¢ä¸ºèªç±å®è£æ¶ï¼è°æ´ä¸ç»´èææºå¨äººé¡µé¢å®½åº¦
 */
var changeVRobotWidthCollapse = function () {
    var mainSidebar = document.getElementById("main-sidebar");
    if (mainSidebar) {
        if (mainSidebar.style.display == "none") {
            $("#vRobot-view").removeClass("vRobot-col-calc");
            $("#vRobot-view").addClass("vRobot-collapse");
        } else {
            $("#vRobot-view").removeClass("vRobot-collapse");
            $("#vRobot-view").addClass("vRobot-col-calc");
        }
    }
}

/**
 * æ¾ç¤ºç¶ææ¥è¯¢ä¸­çæºå¨äººTCPãåè½´ç¹å¨ãå¤è½´èå¨åç¹ä½ç§»å¨ï¼åæ¶æ´æ°å¤è½´èå¨çåç´ åå®¹
 */
 var showRobotSettingFixed = function () {
    document.getElementById('robot-setting-fixed').style.display = 'block';
    document.getElementById('robot-setting-info-fixed').style.display = 'block';
    if (!document.querySelector('#slider-list-fixed ul.slider-list')) {
        document.querySelector('#slider-list-fixed').appendChild(document.querySelector('#robot-setting-info ul.slider-list'));
    }
}

/**
 * éèç¶ææ¥è¯¢ä¸­çæºå¨äººTCPãåè½´ç¹å¨ãå¤è½´èå¨åç¹ä½ç§»å¨ï¼åæ¶æ´æ°å¤è½´èå¨çåç´ åå®¹
 */
var hideRobotSettingFixed = function () {
    document.getElementById('robot-setting-fixed').style.display = 'none';
    document.getElementById('robot-setting-info-fixed').style.display = 'none';
    if (document.querySelector('#slider-list-fixed ul')) {
        document.querySelector('#slider-list').appendChild(document.querySelector('#slider-list-fixed ul'));
    }
}

var addHoverIn = function() {
    document.querySelector('.box-body-left').addEventListener('mouseenter', function() {
        document.querySelector('.box-body-left').classList.add('hover-in');
    })
    document.querySelector('.box-body-left').addEventListener('mouseleave', function() {
        document.querySelector('.box-body-left').classList.remove('hover-in');
    })
}
/* ./é¡µé¢æ¾ç¤ºåºåæ§å¶ */


/* è¾å¥æ§ä»¶èå´éå¶ãæ ¼å¼å¤çç­ */
/**
 * é¡µé¢è¾å¥æ¡è¾å¥æµ®ç¹æ°éå¶
 * @param {object} element DOMåç´ 
 */
var limitInput_float = function (element, decimal) {
    // åªåè®¸è¾å¥æ°å­åå°æ°ç¹
    element.value = element.value.replace(/[^\d\.-]/g, '');
    // åªåè®¸è¾å¥ä¸ä¸ªå°æ°ç¹
    element.value = element.value.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // åªåè®¸è¾å¥ä¸ä¸ªè´å·ä¸è´å·ä¸åè®¸åºç°å¨æ°å­ä¹é´
    element.value = element.value.replace(/\-{2,}/g, '-').replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-').replace(/(?<=\d)-$|(?<=\.)-$/g, '');
    // åªåè®¸è¾å¥æå¤ä¸ä½å°æ°
    // element.value = element.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
    switch (decimal) {
        case 2:
            // åªåè®¸è¾å¥æå¤äºä½å°æ°
            element.value = element.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            break;
        case 3:
            // åªåè®¸è¾å¥æå¤ä¸ä½å°æ°
            element.value = element.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
            break;
        default:
            break;
    }
    // è¾å¥æ¡è¾å¥æ°å¼æå°èå´éå¶
    if (element.value != "") {
        if (element.min != "" && Number(element.value) < Number(element.min)) {
            element.value = element.min;
        }
        // è¾å¥æ¡è¾å¥æ°å¼æå¤§èå´éå¶
        if (element.max != "" && Number(element.value) > Number(element.max)) {
            element.value = element.max;
        }
        if (element.value == '-0') {
            element.value = 0
        }
    }
}

/**
 * é¡µé¢è¾å¥æ¡è¾å¥doubleç±»åéå¶
 * @param {object} element DOMåç´ 
 * @param {int} controlScopeFlag èå´ç±»å 0-å·¦å³å¼åºé´, 1-å·¦é­å³å¼ï¼2-å·¦å¼å³é­
 */
var limitInput_double = function (element, controlScopeFlag) {
    // åªåè®¸è¾å¥æ°å­åå°æ°ç¹
    element.value = element.value.replace(/[^\d\.-]/g, '');
    // åªåè®¸è¾å¥ä¸ä¸ªå°æ°ç¹
    element.value = element.value.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // åªåè®¸è¾å¥ä¸ä¸ªè´å·ä¸è´å·ä¸åè®¸åºç°å¨æ°å­ä¹é´
    element.value = element.value.replace(/\-{2,}/g, '-').replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-').replace(/(?<=\d)-$|(?<=\.)-$/g, '');

    // è¾å¥æ¡è¾å¥æ°å¼æå°èå´éå¶
    if (element.value != "") {
        if (element.min != "" && Number(element.value) <= Number(element.min)) {
            if (controlScopeFlag == 1) {
                element.value = element.min;
            } else {
                element.value = parseInt(element.min) + 1;
            }
        }
        // è¾å¥æ¡è¾å¥æ°å¼æå¤§èå´éå¶
        if (element.max != "" && Number(element.value) >= Number(element.max)) {
            if (controlScopeFlag == 2) {
                element.value = element.max;
            } else {
                element.value = parseInt(element.max) - 1;
            }
        }
    }
}

/**
 * é¡µé¢è¾å¥æ¡è¾å¥æ´æ°éå¶
 * @param {object} element DOMåç´ 
 */
var limitInput_int = function (element) {
    // éå¶è¾å¥å°æ°ç¹
    element.value = element.value.replace(/[^\d-]/g, '');
    // éå¶å¼å§å¤ä¸ª0çè¾å¥
    element.value = element.value.replace(/((?<=^0)0+)/g, '');
    // åªåè®¸è¾å¥ä¸ä¸ªè´å·ä¸è´å·ä¸åè®¸åºç°å¨æ°å­ä¹é´
    element.value = element.value.replace(/\-{2,}/g, '-').replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-').replace(/(?<=\d)-$|(?<=\.)-$/g, '');

    // è¾å¥æ¡è¾å¥æ°å¼æå°èå´éå¶
    if (element.value != "") {
        if (element.min != "" && Number(element.value) < Number(element.min)) {
            element.value = element.min;
        }
        // è¾å¥æ¡è¾å¥æ°å¼æå¤§èå´éå¶
        if (element.max != "" && Number(element.value) > Number(element.max)) {
            element.value = element.max;
        }
        if (element.value == '-0' && Number(element.min) == 0) {
            element.value = 0
        }
    }
}

/**
 * é¡µé¢è¾å¥æ¡ç¦æ­¢è¾å¥ç¹æ®å­ç¬¦
 * @param {object} element DOMåç´ 
 */
var limitInput_special = function (element) {
    // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦
    element.value = element.value.replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5]|[\^\_]/g, '');
}

/**
 * é¡µé¢è¾å¥æ¡ç¦æ­¢è¾å¥ç¹æ®å­ç¬¦,åªåè®¸è¾å¥ä¸åçº¿â_â
 * @param {object} element DOMåç´ 
 */
var limitInput_special_title = function (element) {
    // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦
    element.value = element.value.replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5\_]/g, '');
}

/**
 * é¡µé¢è¾å¥æ¡ç¦æ­¢è¾å¥ç¹æ®å­ç¬¦,åªåè®¸è¾å¥ä¸åçº¿â_âåâ-â
 * @param {object} element DOMåç´ 
 */
var limitInput_special_point = function (element) {
    // ä¸åè®¸è¾å¥ç¹æ®å­ç¬¦
    element.value = element.value.replace(/[^'\a-\z\A-\Z0-9\u4E00-\u9FA5\_\-]/g, '');
}

/**
 * ä¸ä¼ æä»¶åæ¸ç©ºæä»¶
 * @param {string} id DOMåç´ id
 */
var clearImportFile = function(id) {
    document.getElementById(id).outerHTML = document.getElementById(id).outerHTML;
}

/**
 * æ¥ææ ¼å¼
 * @param {object} date æ åçæ¥æå¯¹è±¡
 * @param {string} format æ¥ææ ¼å¼ï¼2024-04-09çformatä¸ºâ-âï¼2024/04/09çformatä¸ºâ/âï¼
 * @returns 
 */
var getFormatDate = function(date, format) {
    const dateYear = new Date(date).getFullYear();
    const dateMonth = new Date(date).getMonth() > 8 ? new Date(date).getMonth() + 1 : `0${new Date(date).getMonth() + 1}`;
    const dateDate = new Date(date).getDate() > 9 ? new Date(date).getDate() : `0${new Date(date).getDate()}`;
    return `${dateYear}${format}${dateMonth}${format}${dateDate}`
}

/**
 * é¶ç¹æ¶é´å¤æ­
 * @param {object} date æ åçæ¥æå¯¹è±¡
 * @returns 
 */
var isMidNight = function(date) {
    const dateHours = new Date(date).getHours();
    const dateMinutes = new Date(date).getMinutes();
    const dateSeconds = new Date(date).getSeconds();
    const dateMilliseconds = new Date(date).getMilliseconds();
    return dateHours === 0 && dateMinutes === 0 && dateSeconds === 0 && dateMilliseconds === 0;
}
/* ./è¾å¥æ§ä»¶èå´éå¶ãæ ¼å¼å¤çç­ */

/**
 * æ©å±è½´ç¼å·éè¦å¤çä¸ºå¯¹åºçæ°æ®åè¿è¡ä¸å
 * @param {string} exAxisId æ©å±è½´ç¼å·1~4
 * @returns 
 */
var handleExAxisId = function(exAxisId) {
    let tempExAxisId = 0;
    if (exAxisId == 1) {
        tempExAxisId = 1;
    } else if (exAxisId == 2) {
        tempExAxisId = 2;
    } else if (exAxisId == 3) {
        tempExAxisId = 4;
    } else if (exAxisId == 4) {
        tempExAxisId = 8;
    }
    return tempExAxisId;
}
/* ./æ©å±è½´ç¼å·éè¦å¤çä¸ºå¯¹åºçæ°æ®åè¿è¡ä¸å */

/* å è½½èæ¿æ§å¶ */
// æ¹æ³å¼ç¨ï¼ææ¶ä¿ç
var showPageLoading = function () {
    return; 
    if (g_teachPendantEnableFlg) {
        let pageLoading = document.getElementById("pageLoading");
        pageLoading.style.display = "block";
    }
}

// æ¹æ³å¼ç¨ï¼ææ¶ä¿ç
var hidePageLoading = function () {
    return;
    if (g_teachPendantEnableFlg) {
        let pageLoading = document.getElementById("pageLoading");
        pageLoading.style.display = "none";
    }
}
/* ./å è½½èæ¿æ§å¶ */


/* ä¸»é¡µé¢å¯¼èªæ ç¸å³ */
/**
 * æºå¨äººéåºç¶æé¡µé¢æ¶ï¼å¯¼èªæ æ´æ°
 * @param {string} type peripheral-éåºç åç¶æçæ§é¡µé¢
 */
function refreshSidebarMenu(type) {
    $('.sidebar-menu').tree();
    $('.sidebar-menu').find('.menu-open').removeClass('menu-open');
    $('.sidebar-menu').find('.active').removeClass('active');
    $('.sidebar-menu').find('ul').css('display', 'none');
    let openMenu;
    $('.sidebar-menu a').each(function() {
        if ($(this).attr('href') && $(this).attr('href').endsWith(type)) {
            openMenu = $(this);
        }
    });
    openMenu.parent().addClass('active');
    openMenu.parent().parent().css('display', 'block');
    openMenu.parent().parent().parent().addClass('menu-open');
}

/**
 * å¯¼èªæ è¿åå­é¡µé¢
 * @param {string} itemUrl å¯¼èªæ è·¯ç±
 */
function gobackItemNavbar(itemUrl) {
    $('.sidebar-menu').tree();
    $('.sidebar-menu').find('.active').removeClass('active');
    if (itemUrl) {
        let openMenu;
        $('.sidebar-menu a').each(function() {
            if ($(this).attr('href') && $(this).attr('href').endsWith(itemUrl)) {
                openMenu = $(this);
                openMenu.parent().addClass('active');
                openMenu.parent().parent().parent().addClass('active');
            }
        });
    }
}
/* ./ä¸»é¡µé¢å¯¼èªæ ç¸å³ */


/**
 * WebAppè·¯ç±éç½®
 */
function routeConfigFn($routeProvider) {
    // å¯¼èªæ è·¯ç±ï¼å¤çindex.htmlä¸­çng-viewçè§å¾å¯¼å¥ã
    $routeProvider
        .when('/nodeeditor', {
            templateUrl: './pages/node_editor.html',
            controller: 'nodeeditorCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/safeset', {
            templateUrl: './pages/safeset.html',
            controller: 'safesetCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/process', {
            templateUrl: './pages/process.html',
            controller: 'processCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/monitor', {
            templateUrl: './pages/monitor.html',
            controller: 'monitorCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    showRobotSettingFixed();
                }
            }
        })
        .when('/programteach', {
            templateUrl: './pages/program_teach.html',
            controller: 'programteachCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/teachingmanagement', {
            templateUrl: './pages/teaching_management.html',
            controller: 'teachingmanagementCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    showRobotSettingFixed();
                }
            }
        })
        .when('/graphicalprogramming', {
            templateUrl: './pages/graphical_programming.html',
            controller: 'graphicalprogrammingCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/log', {
            templateUrl: './pages/log.html',
            controller: 'logCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/robotsetting', {
            templateUrl: './pages/robot_setting.html',
            controller: 'settingCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/systemsetting', {
            templateUrl: './pages/system_setting.html',
            controller: 'systemCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/auxiliary', {
            templateUrl: './pages/auxiliary_application.html',
            controller: 'auxCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }
            }
        })
        .when('/peripheral', {
            templateUrl: './pages/peripheral_setting.html',
            controller: 'perCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                    hideRobotSettingFixed();
                }   
            }
        })
        .when('/frcap', {
            templateUrl: './pages/frcap.html',
            controller: 'frcapCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                }
            }
        })
        .when('/frcap-app/:id', {
            templateUrl: './pages/frcap_app.html',
            controller: 'frcapAppCtrl',
            resolve: {
                resolved: function () {
                    showPageLoading();
                }
            }
        })
        .otherwise({
            redirectTo: '',
            resolve: {
                resolved: function () {}
            }
        });
};


/**
 * WebAppé¡µé¢ç¿»è¯éç½®
 */
function translateConfigFn($translateProvider) {
    let storage = window.sessionStorage;
    let langCode = storage.getItem("langCode");
    let language = JSON.parse(storage.getItem("langJsonData"));
    $translateProvider.translations(langCode, language);
    $translateProvider.preferredLanguage(langCode);
    // åå§åé¡µé¢æ¶ï¼å¾å½¢åç¼ç¨è¯­æ³åå¼å¥
    var script = document.createElement('script');
    if (langCode == 'zh') {
        langCode = 'zh-hans';
    } else if (langCode == 'tc') {
        langCode = 'zh-hant';
    }
    script.src =  `./plugins/blockly/msg/js/${langCode}.js?v=${new Date().getTime()}`
    document.head.appendChild(script);
    
    //æ´æ¹ç³»ç»è¯­è¨å­ä½
    if (langCode == 'ja') {
        $("body").css("font-family","'MS Gothic', '-apple-system', BlinkMacSystemFont, 'Yu Gothic', 'æ¸¸ã´ã·ãã¯', YuGothic, 'æ¸¸ã´ã·ãã¯ä½', 'Noto Sans Japanese', 'ãã©ã®ãè§ã´ Pro W3', 'ã¡ã¤ãªãª', 'Hiragino Kaku Gothic ProN', 'MS PGothic', Osaka, sans-serif");
    } else if (langCode == 'en') {
        $("body").css("font-family","'Verdana', 'Geneva', sans-serif");
    } else {
        $("body").css("font-family","'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif");
    }
};


/* ç³»ç»å¨å±åé */
/**
 * ç³»ç»è¯­è¨åå¨å±åé
 * å­å¨è¯­è¨åkeyå¼frontendä¸å¨é¨åå®¹
 */
let langJsonData;

/**
 * ç³»ç»è¯­è¨å¨å±åé
 */
let g_lang_code;

/**
 * ç³»ç»è¯­è¨ä»£ç å­å¸
 */
let g_lang_dict = {
    "zh": {
        lang_name: "ä¸­æï¼ç®ä½ï¼",
        lang_code: "zh"
    },
    "en": {
        lang_name: "English",
        lang_code: "en"
    },
    "ja": {
        lang_name: "æ¥æ¬èª",
        lang_code: "ja"
    },
    "fr": {
        lang_name: "franÃ§ais",
        lang_code: "fr"
    }
};

/**
 * ç³»ç»è¯­è¨åèä»£ç å­å¸
 */
let g_ref_lang_dict = {
    "zh": {
        lang_name: "ä¸­æï¼ç®ä½ï¼",
        lang_code: "zh"
    },
    "tc": {
        lang_name: "ä¸­æï¼ç¹é«ï¼",
        lang_code: "tc"
    },
    "en": {
        lang_name: "English",
        lang_code: "en"
    },
    "ja": {
        lang_name: "æ¥æ¬èª",
        lang_code: "ja"
    },
    "fr": {
        lang_name: "franÃ§ais",  // æ³è¯­
        lang_code: "fr"
    },
    "es": {
        lang_name: "EspaÃ±ol",   // è¥¿ç­çè¯­
        lang_code: "es"
    },
    "ru": {
        lang_name: "Ð ÑÑÑÐºÐ¸Ð¹",   // ä¿è¯­
        lang_code: "ru"
    },
    "ar": {
        lang_name: "Ø§ÙØ¹Ø±Ø¨ÙØ©",   // é¿æä¼¯è¯­
        lang_code: "ar"
    },
    "de": {
        lang_name: "Deutsch",   // å¾·è¯­
        lang_code: "de"
    },
    "pt": {
        lang_name: "PortuguÃªs",     // è¡èçè¯­
        lang_code: "pt"
    },
    "hi": {
        lang_name: "à¤¹à¤¿à¤à¤¦à¥",    // å°åº¦è¯­
        lang_code: "hi"
    },
    "it": {
        lang_name: "Italiano",  // æå¤§å©è¯­
        lang_code: "it"
    },
    "ko": {
        lang_name: "íêµ­ì´",    // é©è¯­
        lang_code: "ko"
    },
    "bn": {
        lang_name: "à¦¬à¦¾à¦à¦²à¦¾",    // å­å æè¯­
        lang_code: "bn"
    },
    "tr": {
        lang_name: "TÃ¼rkÃ§e",    // åè³å¶è¯­
        lang_code: "tr"
    }
};

/**
 * åå§è®¾ç½®å·¥å·åæ ç³»éå½åæ å¿
 * 0-æªéå½å/éå½åæåï¼ç¶ææ è·ånameç»æ 1-éå½åæå
 */
let g_renameToolCoordFlag;

/**
 * åå§è®¾ç½®å¤é¨å·¥å·åæ ç³»éå½åæ å¿
 * 0-æªéå½å/éå½åæåï¼ç¶ææ è·ånameç»æ 1-éå½åæå
 */
let g_renameExToolCoordFlag;

/**
 * åå§è®¾ç½®è´è½½éå½åæ å¿
 * 0-æªéå½å/éå½åæåï¼ç¶ææ è·ånameç»æ 1-éå½åæå
 */
let g_renameLoadFlag;

/**
 * åå§è®¾ç½®è´è½½ç®åè¾¨è¯æ å¿
 * 0-æªè¾¨è¯ï¼ 1-ç©ºè½½/æ»¡è½½è¾¨è¯è¿è¡ä¸­ï¼
 */
let g_loadIdentFlag;

/**
 * ç¨åºè¿è¡çæ å¿
 * 0-æªè¿è¡/è¿è¡å®æï¼ 1-è¿è¡ä¸­ï¼
 */
let g_runProgramFlag;

/**
 * åå§è®¾ç½®è´è½½è¾¨è¯ç¨åºè¿è¡çæ å¿
 * 0-æªè¿è¡/è¿è¡å®æï¼ 1-è¿è¡ä¸­ï¼
 */
let g_forceSensorAutoZeroFlag;

/**
 * ç¨åºæªä¿å­è¿è¡ç¨åºæ å¿
 * 1-ç¤ºæç¨åºé¡µé¢ 2-å¾å½¢åç¼ç¨é¡µé¢ 3-æ­£å¸¸è¿è¡ç¨åº
 */
let g_programChangeFlag;

/**
 * ç¨åºè¿è¡éè¯¯æ å¿
 * 1-é»æ­¢è¿è¡ 0-æ­£å¸¸è¿è¡
 */
let g_programErrorFlag;

/**
 * ç¤ºæç¹åç¼å¨å±åé
 */
let g_tpPrefix = "";

/**
 * æºå¨äººæ§å¶å¨å¨å±åé
 * 0ï¼æºå¨äººæ¬ä½ï¼QNX/Linuxï¼
 * 1ï¼æºå¨äººæ§å¶å¨èææºSimMachine
 */
let g_simmachineFlag = 1;

/**
 * æºå¨äººæ§å¶ç®±ç³»ç»åºåå¨å±åé
 * 0ï¼qnxç³»ç»
 * 1ï¼linuxç³»ç»
 */
let g_systemFlag = 1;

/**
 * åº·å»è¿å¨ç»æ°å¨å±åé
 */
let g_kangYangCycleIndex = [];

/**
 * æºå¨äººåå·å¨å±åé
 * type=1ï¼ä»£è¡¨FR3
 * type=2ï¼ä»£è¡¨FR5
 * type=3ï¼ä»£è¡¨FR10
 */
let g_robotType = {
    type: 0,
    major_ver: 0,
    minor_ver: 0,
    load_range_max: 0
};

/**
 * æºå¨äººç±»åä»£ç å¨å±åé
 * ä»£ç ç´æ¥æä»£æºå¨äººçå·ä½åå·
 */
let g_robotTypeCode = 0;

/**
 * ç¤ºæå¨å¯ç¨æ å¿
 * 0-å³é­ï¼1-å¯ç¨ï¼é»è®¤å³é­
 */
let g_teachPendantEnableFlg = 0;

// æ¶åwebSocketå¨å±åéå½åè§èï¼âg_socket_åéåâ
/**
 * webSocketå¨å±åé
 */
let g_socketStream;

/**
 * webSocketè¿æ¥ç¶æå¨å±åé
 * 0-æ­å¼è¿æ¥ï¼1-è¿æ¥æåï¼é»è®¤æ­å¼è¿æ¥
 */
let g_socketStatus = 0;

/**
 * ç»åºå¨å±åé
 */
let g_socketLogoutFlag = 0;

/**
 * å·²åºç¨ç¹ä½è¡¨åç§°å¨å±åé
 */
let g_appliedPointTableName;

/**
 * æµè¯ä»£ç æ§å¶å¨å±åé
 * 0-å³ 1-å¼ï¼é»è®¤0
 */
let g_testCode = 0;

/**
 * DIOåè½å®å¨æ°ç»å¨å±åé
 */
let g_safetyCIFuncArr = [20, 21, 22, 23, 24];
let g_safetyCOFuncArr = [20, 21, 23, 24, 25, 26, 27];

/**
 * å½åéæ©ç¨åºåç§°
 */
let g_fileNameForUpload;

/**
 * å½åéæ©ç¨åºçluaç¨åºåå®¹
 */
let g_fileDataForUpload;

/**
 * å½åéæ©ç¨åºçluaç¨åºåå®¹
 */
let soFlg = 0;

/**
 * ç¨åºç¼ç¨ââNewDofileå­ç¨åºæ¯å¦å­å¨æ¥éï¼0-ä¸å­å¨æ¥éï¼1-å­å¨æ¥é
 */
let g_programErr = 0;

/**
 * ç¨åºç¼ç¨ââNewDofileå­ç¨åºéªè¯çæ¥éä¿¡æ¯
 */
let g_programErrString = "";

/**
 * æ¯å¦ä¸ºåæ­¥æ§è¡æ å¿ä½ï¼0-ç¨åºè¿è¡ï¼1-åæ­¥æ§è¡
 */
let g_isRunStepOver = 0;

/**
 * å¾å½¢åç¼ç¨ââNewDofileå­ç¨åºæ¯å¦å­å¨æ¥éï¼false-ä¸å­å¨æ¥éï¼true-å­å¨æ¥é
 */
let g_graphicalErr = false;

/**
 * å¾å½¢åç¼ç¨ââNewDofileå­ç¨åºéªè¯çæ¥éä¿¡æ¯
 */
let g_graphicalErrString = '';

/**
 * èç¹å¾ç¼ç¨æ¥éæç¤ºå¨å±åé
 * false-å³ true-å¼ï¼é»è®¤false
 */
let g_nodeLuaError = false;

/**
 * èç¹å¾ç¼ç¨æ¥éèç¹ç±»ååç§°å¨å±åé
 * é»è®¤ä¸ºç©º
 */
let g_nodeLuaErrorType = '';

/**
 * èç¹å¾ç¼ç¨æ¥éä¿¡æ¯å¨å±åé
 * é»è®¤ä¸ºç©º
 */
let g_nodeLuaErrorString = '';

/**
 * èç¹å¾ç¼ç¨èç¹ç±»åæ¯å¦ä¸ºGetç±»åå¨å±åé
 * false-å¦ true-æ¯ï¼é»è®¤false
 */
let g_isGetNodeGraph = false;

/**
 * èç¹å¾ç¼ç¨å½åNewDofileåå®¹æ¯å¦å¯ä»¥ä¿å­å¨å±åé
 * false-å¦ true-æ¯ï¼é»è®¤false
 */
let g_nodeEditorErr = false;

/**
 * èç¹å¾ç¼ç¨NewDofileæä»¤æ¥éä¿¡æ¯å¨å±åé
 * é»è®¤ä¸ºç©º
 */
let g_nodeEditorErrString = '';

/**
 * èç¹å¾ç¼ç¨ä¸­å·¥å·åæ ç³»å¨å±åé
 */
let g_nodeToolCoorde = [];

/**
 * èç¹å¾ç¼ç¨ä¸­å·¥å·+å¤é¨å·¥å·åæ ç³»å¨å±åé
 */
let g_nodeToolCoordeTotal = [];

/**
 * èç¹å¾ç¼ç¨ä¸­å·¥ä»¶åæ ç³»å¨å±åé
 */
let g_nodeWobjToolCoorde = [];

/**
 * ä¿®æ¹ç¤ºæç¹åè·åè®¡ç®æ°æ®å¨å±åé
 */
let g_modifyPointFlag;

/**
 * æ¯æ¬¡ä¿®æ¹ç¤ºæç¹åå·æ°æ°æ®å¨å±åé
 */
let g_refreshTableFlag;

/**
 * ç¢°æç­çº§å¨å±åéï¼ç¨äºnodes.jsåVisualScriptToLua.jsæä»¶
 */
let g_collisionLevelData = [];

/**
 * bootæ¨¡å¼æ å¿ä½ï¼0-ébootæ¨¡å¼ï¼1-bootæ¨¡å¼
 */
let g_bootModeFlag = 0;

/**
 * ç¶ææ¥è¯¢æ°æ®å¨å±åé
 */
let g_queryValue;

/**
 * ç¶ææ¥è¯¢æ³¢å½¢æ¶é´å¨å±åé
 */
let g_queryWaveTime;

/**
 * å±å¹ä¼¸ç¼©å¨å±æ å¿ä½
 */
let g_resizeFlg = 0;

/**
 * è¾å©åºç¨ââæå¨éå®ââå³èæ­ç©ä¼ æå¨é¶ç¹æ å®è®°å½çç¹ä½åºå·ï¼é»è®¤åæ å®å®æç½®ä¸º0ï¼ç¹ä½1ä¸º1ï¼ç¹ä½2ä¸º2
 */
let g_torqueMovePointFlag = 0;

/**
 * è¾å©åºç¨ââæå¨éå®ââå³èæ­ç©ä¼ æå¨é¶ç¹æ å®è®°å½æå¨åæ­¢ï¼é»è®¤ä¸ºfalseï¼æå¨åæ­¢è§¦åä¸ºtrue
 */
let g_torqueMovePointStop = false;

/* ./ç³»ç»å¨å±åé */


/* WebAppåå§ååéç¨æ¹æ³ */
/**
 * è·åurlåæ°ï¼å³æ¶å½æ°ï¼
 * åè½ï¼å­å¨debugåæ°ä¸å¼ä¸º1ï¼åä¸ºdevç¯å¢ã
 */
(function getUrlParam() {
    let timestampUrl = "";
    let paramStr = window.location.search.substring(1);
    let paramArr = paramStr.split('?');
    let debugParamIndex = paramArr.indexOf('debug=1');
    if (paramArr.length && debugParamIndex > -1) { // å­å¨åæ°ä¸å­å¨debug=1ï¼å¶ä½åæ°èªå¨è¿æ»¤
        g_testCode = 1;
        timestampUrl = `${window.location.pathname}?v=${new Date().getTime()}?${paramArr[debugParamIndex]}`;
    } else {
        g_testCode = 0;
        timestampUrl = `${window.location.pathname}?v=${new Date().getTime()}`;
    }
    window.history.pushState(null, null, timestampUrl);
})();

/**
 * è·åç¨æ·æé
 * @returns æåè¿åæéå¯¹è±¡ï¼å¤±è´¥éå®åç»å½é¡µé¢
 */
var getUserAuthority = function() {
    if (sessionStorage.getItem('userAuthority')) {
        return JSON.parse(sessionStorage.getItem('userAuthority'));
    } else {
        location = './login.html';
    }
}

/**
 * æä½äºä»¶æç¤ºè¯­
 * @param {string} restarTtext ä¾å¦ï¼ä¸ä¼ å¤ä»½åå®æãåçº§å®æãå¯¼å¥DHéç½®æä»¶æå
 */
var showPageRestart = function(restarTtext) {
    $("#restartText").text(restarTtext);
    $('#restartPage').css("display", "block");
}

/**
 * ç¤ºæç¹åç¼è¾å¥æ å¤ç-è®¾ç½®
 * @param {string} prefix åç¼å­ç¬¦ä¸²
 */
function setTPPrefix(prefix) {
    g_tpPrefix = prefix;
    $("#tpPrefix").val(prefix);
}
/**
 * ç¤ºæç¹åç¼è¾å¥æ å¤ç-è¾å¥
 */
function entryPrefix() {
    g_tpPrefix = $("#tpPrefix").val();
}

// æºå¨äººåå·ç®å½
const g_robotModelArr = [
    {
        id: 1,
        name: 'FR3 V5.0'
    },
    {
        id: 2,
        name: 'FR3 V6.0'
    },
    {
        id: 3,
        name: 'FR3 V6.0(Mirror)'
    },
    {
        id: 101,
        name: 'FR5 V4.0'
    },
    {
        id: 102,
        name: 'FR5 V5.0'
    },
    {
        id: 103,
        name: 'FR5 V6.0'
    },
    {
        id: 201,
        name: 'FR10 V5.0'
    },
    {
        id: 202,
        name: 'FR10 V6.0'
    },
    {
        id: 301,
        name: 'FR16 V5.0'
    },
    {
        id: 302,
        name: 'FR16 V6.0'
    },
    {
        id: 401,
        name: 'FR20 V5.0'
    },
    {
        id: 402,
        name: 'FR20 V6.0'
    },
    {
        id: 501,
        name: 'ART3'
    },
    {
        id: 601,
        name: 'ART5'
    },
    {
        id: 702,
        name: 'FR3-WML'
    },
    {
        id: 703,
        name: 'FR3-WMS'
    },
    {
        id: 802,
        name: 'FR5WM'
    },
    {
        id: 803,
        name: 'FR5-WML'
    },
    {
        id: 804,
        name: 'FR5-C'
    },
    {
        id: 901,
        name: 'FR3MT'
    },
    {
        id: 902,
        name: 'FR10YD'
    },
    {
        id: 904,
        name: 'FR3-C'
    },
    {
        id: 905,
        name: 'FR30L'
    },
    {
        id: 906,
        name: 'FR3(C)'
    },
    {
        id: 907,
        name: 'ART3-R6-XM'
    },
    {
        id: 908,
        name: 'FC3-R6-B'
    },
    {
        id: 1001,
        name: 'FR30 V6.0'
    }
];
/**
 * è·åæºå¨äººåå·ææ¬
 * @param {int} robotId æºå¨äººåå·
 * @returns 
 */
function getRobotTypeText (robotId) {
    return g_robotModelArr.find(item => item.id == robotId).name;
}
/* ./WebAppåå§ååéç¨æ¹æ³ */


/**
 * é¦é¡µæ§å¶å¨å½æ°
 */
function indexCtrlFn($scope, $location, $window, dataFactory, toastFactory, $websocket, $route, $timeout, testDataService, constantService) {
    $scope.fullFlag = 1;
    $scope.setFeedError = false;
    // 100%çåå®¹æ¾ç¤ºåº
    $scope.fullContentView = function () {
        $scope.fullFlag = 1;
        $("#content-view").removeClass("content-45");
        $("#content-view").addClass("col-md-12");
        document.getElementById("vRobot-view").style.zIndex = -1;
    }

    // 45%çåå®¹æ¾ç¤ºåºï¼55%çä¸ç»´æ¨¡åæä½æ¾ç¤ºåº
    $scope.halfBothView = function () {
        $("#content-view").removeClass("col-md-12");
        $("#content-view").addClass("content-45");
        $("#vRobot-view").removeClass("col-md-12");
        $("#vRobot-view").removeClass("vRobot-col-calc");
        $("#vRobot-view").addClass("vRobot-55");
        if ($scope.fullFlag) {
            $scope.fullFlag = 0;
            $("#robot-setting").removeAttr('style');
            $("#robot-object").removeAttr('style');
            $("#robot-status").removeAttr('style');
            $("#robot-support").removeAttr('style');
            $scope.clickRobotSetting();
            $scope.toggleDataDisplay();
            $scope.clickRobotSupport();
        }
        document.getElementById("vRobot-view").style.zIndex = 0;
    }

    $scope.setProgramUrdf = function(value) {
        $scope.programUrdf = value;
        document.getElementById('robot-object').style.top = $scope.programUrdf ? '58px' : '10px';
    }

    /* ä¾æ®ç³»ç»è¯­è¨è·åå¯¹åºçè¯­è¨ååå½åé¡µé¢åå§å */
    let indexDynamicTags;
    let setErrorDict;
    let tpd_record_state;
    let programStatusDict;
    let referenceCoord;
    let storage = $window.sessionStorage;
    // å¦æè¯­è¨åä¸ºç©ºï¼éå®åè³loginé¡µé¢
    if ($.isEmptyObject(JSON.parse(storage.getItem("langJsonData")))) {
        if (g_testCode) {
            location = './login.html?debug=1';
        } else {
            location = './login.html';
        }
    }
    langJsonData = JSON.parse(storage.getItem("langJsonData")).frontend;
    g_lang_code = storage.getItem("langCode");
    indexDynamicTags = langJsonData.index;
    setErrorDict = langJsonData.setErrorDict;
    $scope.errorDictData = setErrorDict["500"];
    /* åå§åIOåè¡¨ */
    $scope.clDOArr = langJsonData.IOlists.clDO;
    $scope.clDIArr = langJsonData.IOlists.clDI;
    $scope.boardCtrlDIArr = constantService.ctrlDIArr;
    $scope.boardDIArr = constantService.diArr;
    $scope.boardDOArr = constantService.doArr;
    $scope.boardExDIArr = constantService.exdiArr;
    $scope.boardExDOArr = constantService.exdoArr;
    $scope.boardAIArr = constantService.aiArr;
    $scope.boardAOArr = constantService.aoArr;
    $scope.palletizingDOArr = [
        {
            name: "CO0",
            "num": 8
        },
        {
            name: "CO1",
            "num": 9
        }
    ];
    $scope.palletizingDIArr = [
        {
            name: "CI0",
        }
    ];
    $scope.palletizingAuxDOArr = [
        {
            id: "0",
            name: "DO0"
        },
        {
            id: "1",
            name: "DO1"
        },
        {
            id: "2",
            name: "DO2"
        },
        {
            id: "3",
            name: "DO3"
        },
        {
            id: "4",
            name: "DO4"
        },
        {
            id: "5",
            name: "DO5"
        },
        {
            id: "5",
            name: "DO5"
        },
        {
            id: "6",
            name: "DO6"
        },
        {
            id: "7",
            name: "DO7"
        }
    ];
    $scope.palletizingAuxDIArr = [
        {
            id: "0",
            name: "DI0"
        },
        {
            id: "1",
            name: "DI1"
        },
        {
            id: "2",
            name: "DI2"
        },
        {
            id: "3",
            name: "DI3"
        },
        {
            id: "4",
            name: "DI4"
        },
        {
            id: "5",
            name: "DI5"
        },
        {
            id: "5",
            name: "DI5"
        },
        {
            id: "6",
            name: "DI6"
        },
        {
            id: "7",
            name: "DI7"
        }
    ];
    $scope.toolDOArr = langJsonData.IOlists.toolDO;
    $scope.toolDIArr = langJsonData.IOlists.toolDI;
    $scope.AuxclDOArr = constantService.AuxclDOArr;
    $scope.AuxclDIArr = constantService.AuxclDIArr;
    $scope.clDOSelected = $scope.clDOArr[0];
    $scope.toolDOSelected = $scope.toolDOArr[0];
    // è·åå¯¼èªæ å¯¹è±¡é¡µé¢æ¾ç¤º
    let tempnNavbar = indexDynamicTags.navbar;
    let frcapConfigCategoryCount = 0;
    $scope.createFRCapsNavList = function () {
        // æ¯æ¬¡è¿å¥ç´æ¥æ·±æ·è´åå§çå¯¼èªæ æ°æ®ï¼é¿åæ¹å¨å½±ååå§æ°æ®ã
        $scope.navbarObjects = JSON.parse(JSON.stringify(tempnNavbar));
        // æ¯æ¬¡è¿å¥åæ¸ç©ºéç½®ç±»FRCapè®¡æ°
        frcapConfigCategoryCount = 0;
        // Linuxç³»ç»è·åFRCapå¯¼èªæ (èææºä¸ä¸å)  ï¼2025.05.15 å é¤ç³»ç»çæ¬å¤æ­é»è¾ zjqï¼
        // if (g_systemFlag && !g_simmachineFlag) {
        if (!g_simmachineFlag) {
            let getPluginCmd = {
                cmd: "get_plugin_nav",
            };
            dataFactory.getData(getPluginCmd)
                .then((data) => {
                    data.forEach(element => {
                        // ä»å¨å½åæä»¶ä¸ºåºç¨ç±»æ¶æåè®¸æå¥è¾å©åºç¨å¯¼èªæ ï¼0-éç½®ï¼1-åºç¨
                        if (element.category == "1") {
                            if ($scope.navbarObjects[3].children.every(item => item.url != element.url)) {
                                let tempNavItem = {
                                    id: "frcap_plugin",
                                    name: "",
                                    icon: "",
                                    url: ""
                                };
                                tempNavItem.name = element.name;
                                tempNavItem.url = `#/frcap-app/${element.url.split('/')[4]}`;
                                $scope.navbarObjects[3].children.push(tempNavItem);
                            }
                        } else if (element.category == "0") {
                            frcapConfigCategoryCount += 1;
                        }
                    });
                    getAccountInfo();
                },(status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[64]);
                    getAccountInfo();
                });
        // QNXç³»ç»æ²¡æFRCapåè½
        } else {
            getAccountInfo();
        }
    };
    // è·ååéå¯¹è±¡
    $scope.consArray = indexDynamicTags.var_object.consArray;
    $scope.modeArray = indexDynamicTags.var_object.modeArray;
    $scope.setTPDLocation = indexDynamicTags.var_object.setTPDLocation;
    $scope.FTReferenceCoordData = indexDynamicTags.var_object.FTReferenceCoordData;
    $scope.selectedFTCoord = {
        x: null,
        y: null,
        z: null,
        rx: null,
        ry: null,
        rz: null
    };
    $scope.TPDCfgDI = indexDynamicTags.var_object.TPDCfgDI;
    $scope.TPDCfgDO = indexDynamicTags.var_object.TPDCfgDO;
    referenceCoord = indexDynamicTags.var_object.referenceCoord;
    $scope.torqueIOList = indexDynamicTags.var_object.torqueIOList;
    $scope.ZeroModeData = indexDynamicTags.var_object.ZeroModeData;
    $scope.polishModeData = indexDynamicTags.var_object.polishMode; //æç£¨è®¾å¤æ§å¶æ¨¡å¼
    $scope.shoulderModeData = indexDynamicTags.var_object.shoulderModeData; //æºå¨äººè©éç½®
    $scope.elbowModeData = indexDynamicTags.var_object.elbowModeData; //æºå¨äººèéç½®
    $scope.wristModeData = indexDynamicTags.var_object.wristModeData; //æºå¨äººèéç½®
    $scope.controllerProtocolModeData = indexDynamicTags.var_object.controllerProtocolModeData; //æ§å¶å¨ä»ç«åè®®
    $scope.toolTypeData = langJsonData.robot_setting.var_object.toolTypeData;
    $scope.mountingLocationData = langJsonData.robot_setting.var_object.mountingLocationData;
    $scope.DOCfgData = langJsonData.robot_setting.var_object.DOCfgData;
    $scope.DICfgData = langJsonData.robot_setting.var_object.DICfgData;
    $scope.EndDICfgData = langJsonData.robot_setting.var_object.EndDICfgData;
    // CNCç¶æåæ°å¹é
    $scope.CNCCompany = indexDynamicTags.var_object.CNCCompany;
    $scope.CNCTypeData = [
        {
            id: 0,
            name: 'Series 0i'
        },
        {
            id: 15,
            name: 'Series 150/150i'
        },
        {
            id: 16,
            name: 'Series 160/160i'
        },
        {
            id: 18,
            name: 'Series 180/180i'
        },
        {
            id: 21,
            name: 'Series 210/210i'
        },
        {
            id: 30,
            name: 'Series 300i'
        },
        {
            id: 31,
            name: 'Series 310i'
        },
        {
            id: 32,
            name: 'Series 320i'
        },
        {
            id: 'PD',
            name: 'Power Mate i-D'
        },
        {
            id: 'PH',
            name: 'Power Mate i-H'
        }
    ];
    $scope.CNCFocasStatus = indexDynamicTags.var_object.CNCFocasStatus;
    $scope.CNCRunStatus = indexDynamicTags.var_object.CNCRunStatus;
    $scope.CNCEmergencyStatus = indexDynamicTags.var_object.CNCEmergencyStatus;
    $scope.CNCAlarmStatus = indexDynamicTags.var_object.CNCAlarmStatus;
    $scope.CNCDoorStatus = indexDynamicTags.var_object.CNCDoorStatus;
    $scope.CNCChuckStatus = indexDynamicTags.var_object.CNCChuckStatus;
    $scope.CNCStatusData = {
        company: null,
        type: null,
        focas: null,
        run: null,
        emergency: null,
        alarm: null,
        door: null,
        chuck: null,
    };
    // smarttoolå¤è®¾å¼æ¾åè®®æä½ç¶æ
    $scope.smartToolPro = {
        program_name: null,
        record_point_flag: 0,
    };
    //ç¢°æç­çº§è®¾ç½®åéåå§å
    $scope.collisionLevelData = [];
    /* åå§å */
    // æºå¨äººåå·ä¿¡æ¯
    $scope.pwdForRTS = '';
    $scope.selectedRobotType = '';
    $scope.selectedMajorVer = '';
    $scope.selectedMinorVer = '';
    // æºå¨äººååº¦
    $scope.stiffnessList = indexDynamicTags.var_object.stiffnessList;
    $scope.selectedStiffness = $scope.stiffnessList[0];
    // æºå¨äººéä½æ¨¡å¼
    $scope.limitList = indexDynamicTags.var_object.limitList;
    $scope.selectedLimit = $scope.limitList[0];
    // å¤¹çªç±»å 0-æ°´å¹³ 1-æè½¬
    $scope.gripperTypeData = indexDynamicTags.var_object.gripperTypeData;
    // dfcè¿æ¥ç¶æ 0-æ­å¼è¿æ¥ 1-å»ºç«è¿æ¥
    $scope.dfcConnectData = indexDynamicTags.var_object.dfcConnectData;
    // dfcè­¦åç¶æ 0-æ­£å¸¸ 1-å¼å¸¸
    $scope.dfcAlarmStateData = indexDynamicTags.var_object.dfcAlarmStateData;
    // æºå¨äººåå·URDFè·¯å¾è¡¨
    $scope.robotModelUrlDict = {
        "1": "./data/cobots/urdf/fr3_robot.urdf",    // FR3 V5.0
        "2": "./data/cobots/urdf/fr3v6.urdf",        // FR3 V6.0
        "3": "./data/cobots/urdf/fr3v6mirror.urdf",  // FR3 V6.0(Mirror)

        "101": "./data/cobots/urdf/fr5_robot.urdf",  // FR5 V4.0
        "102": "./data/cobots/urdf/fr5_robot.urdf",  // FR5 V5.0
        "103": "./data/cobots/urdf/fr5v6.urdf",      // FR5 V6.0

        "201": "./data/cobots/urdf/fr10_robot.urdf", // FR10 V5.0
        "202": "./data/cobots/urdf/fr10v6.urdf",     // FR10 V6.0

        "301": "./data/cobots/urdf/fr16_robot.urdf", // FR16 V5.0
        "302": "./data/cobots/urdf/fr16v6.urdf",     // FR16 V6.0

        "401": "./data/cobots/urdf/fr20_robot.urdf", // FR20 V5.0
        "402": "./data/cobots/urdf/fr20v6.urdf",     // FR20 V6.0

        "501": "./data/cobots/urdf/fr3v6.urdf",      // ææ æ¨¡åï¼FR3 V6.0æ¿ä»£

        "601": "./data/cobots/urdf/fr5v6.urdf",      // ææ æ¨¡åï¼FR3 V6.0æ¿ä»£
        
        "702": "./data/cobots/urdf/FR3WML.urdf",     // FR3WML
        "703": "./data/cobots/urdf/FR3WMS.urdf",     // FR3WMS

        "802": "./data/cobots/urdf/FR5WM.urdf",      // çæ¥é²æ¤å¢å¼ºç³»åæºå¨äººFR5WM-V6.0
        "803": "./data/cobots/urdf/fr5l.urdf",      // é¿èå±çæ¥ç³»åæºå¨äººFR5Låæ´ä¸ºFR5WML
        "804": "./data/cobots/urdf/fr5c.urdf",      // FR5-C

        "901": "./data/cobots/urdf/FR3MT.urdf",      // FRå®å¶æºå¨äºº
        "902": "./data/cobots/urdf/FR10YD.urdf",     // FRå®å¶æºå¨äºº
        "904": "./data/cobots/urdf/fr3c.urdf",       // FR3C
        "905": "./data/cobots/urdf/fr30l.urdf",      // FR30L
        "906": "./data/cobots/urdf/fr3cnew.urdf",       // FR3(C)--éç¨FR3Cæ¨¡åå¤è§ï¼è½¯éä½æ°æ®åFR3 V6.0ä¸è´
        "907": "./data/cobots/urdf/art3r6xm.urdf",     // ART3-R6-XM
        "908": "./data/cobots/urdf/fc3r6b.urdf",     // FC3-R6-B

        "1001": "./data/cobots/urdf/fr30v6.urdf",    // FR30 V6.0
    }
    // æ¯æå³èéä½ç¯çæºå¨äººåå·ååå³èåç¯åå¾
    let robotRingsRadius = {
        "1": [0.045, 0.045, 0.045, 0.04, 0.04, 0.04],             // FR3 V5.0
        "2": [0.045, 0.045, 0.045, 0.04, 0.04, 0.04],             // FR3 V6.0

        "102": [0.0575, 0.0575, 0.0575, 0.04, 0.04, 0.04],        // FR5 V5.0
        "103": [0.0575, 0.0575, 0.0575, 0.04, 0.04, 0.04],        // FR5 V6.0

        "201": [0.075, 0.075, 0.0575, 0.045, 0.045, 0.045],       // FR10 V5.0
        "202": [0.075, 0.075, 0.0575, 0.045, 0.045, 0.045],       // FR10 V6.0

        "301": [0.075, 0.075, 0.0575, 0.045, 0.045, 0.045],       // FR16 V5.0
        "302": [0.075, 0.075, 0.0575, 0.045, 0.045, 0.045],       // FR16 V6.0

        "401": [0.095, 0.095, 0.075, 0.0575, 0.0575, 0.0575],     // FR20 V5.0
        "402": [0.095, 0.095, 0.075, 0.0575, 0.0575, 0.0575],     // FR20 V6.0

        "1001": [0.095, 0.095, 0.075, 0.0575, 0.0575, 0.0575],    // FR30 V6.0
    };
    let ringOuterRadiusDiff = 0.02;
    // æºå¨äººåå·éç½®æ°æ®ââæ¯æ°å¢ä¸ä¸ªæºå¨äººåå·æ¶ï¼åç«¯éè¦æ ¸å®ç¸å³åè½æ°æ®æ¯å¦åç¡®ï¼è´è½½ãå³èè½¯éä½ãç¢°æç­çº§ãæ©å±éä½ï¼Â±360Â°ï¼ãæºå¨äººæåå§¿æãéä½ç¯ãæ°å­I/O
    $scope.robotModelDict = [
        {
            rt_index: 1,
            robot_type: "FR3",
            load_range_max: 3,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000(V5.0)"
                },
                {
                    mi_index: 1,
                    mi_name: "001(V6.0)"
                },
                {
                    mi_index: 2,
                    mi_name: "002(V6.0-Mirror)"
                }
            ]
        },
        {
            rt_index: 2,
            robot_type: "FR5",
            load_range_max: 5,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000"
                },
                {
                    mi_index: 1,
                    mi_name: "001(V5.0)"
                },
                {
                    mi_index: 2,
                    mi_name: "002(V6.0)"
                }
            ]
        },
        {
            rt_index: 3,
            robot_type: "FR10",
            load_range_max: 10,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000(V5.0)"
                },
                {
                    mi_index: 1,
                    mi_name: "001(V6.0)"
                }
            ]
        },
        {
            rt_index: 4,
            robot_type: "FR16",
            load_range_max: 16,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000(V5.0)"
                },
                {
                    mi_index: 1,
                    mi_name: "001(V6.0)"
                }
            ]
        },
        {
            rt_index: 5,
            robot_type: "FR20",
            load_range_max: 20,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000(V5.0)"
                },
                {
                    mi_index: 1,
                    mi_name: "001(V6.0)"
                }
            ]
        },
        {
            rt_index: 6,
            robot_type: "ART3",
            load_range_max: 3,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000"
                }
            ]
        },
        {
            rt_index: 7,
            robot_type: "ART5",
            load_range_max: 5,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "000"
                }
            ]
        },
        {
            rt_index: 8,
            robot_type: "FRCustom(7)",
            load_range_max: 5,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 1,
                    mi_name: "001(FR3-WML)"
                },
                {
                    mi_index: 2,
                    mi_name: "002(FR3-WMS)"
                }
            ]
        },
        {
            rt_index: 9,
            robot_type: "FRCustom(8)",
            load_range_max: 5,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                },
            ],
            minor_ver: [
                {
                    mi_index: 1,
                    mi_name: "001(FR5WM)"
                },
                {
                    mi_index: 2,
                    mi_name: "002(FR5-WML)"
                },
                {
                    mi_index: 3,
                    mi_name: "003(FR5-C)"
                }
            ]
        },
        {
            rt_index: 10,
            robot_type: "FRCustom(9)",
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                }
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "001(FR3MT)",
                    load_range_max: 5
                },
                {
                    mi_index: 1,
                    mi_name: "001(FR10YD)",
                    load_range_max: 10
                },
                {
                    mi_index: 3,
                    mi_name: "001(FR3-C)",
                    load_range_max: 5
                },
                {
                    mi_index: 4,
                    mi_name: "001(FR30L)",
                    load_range_max: 35
                },
                {
                    mi_index: 5,
                    mi_name: "001(FR3(C))",
                    load_range_max: 3
                },
                {
                    mi_index: 6,
                    mi_name: "001(ART3-R6-XM)",
                    load_range_max: 3
                },
                {
                    mi_index: 7,
                    mi_name: "001(FC3-R6-B)",
                    load_range_max: 3
                },
            ]
        },
        {
            rt_index: 11,
            robot_type: "FR30",
            load_range_max: 30,
            major_ver: [
                {
                    ma_index: 1,
                    ma_name: "V01"
                }
            ],
            minor_ver: [
                {
                    mi_index: 0,
                    mi_name: "001(V6.0)"
                }
            ]
        }
    ];
    // æ§å¶å¨å½åè®°å½çluaç¨åº
    $scope.curRunProgram = {
        name: '',
        url: null,
        mainName: null,
        clickLuaType: null
    };
    // æºå¨äººç¶ææ¥è¯¢ç¶æ:0--æªæ¥è¯¢ï¼1--æ¥è¯¢ä¸­ï¼
    $scope.queryState = 0;
    // æ§å¶ç®±ç±»å:0--çªçµåï¼1--å®½çµå
    $scope.controlBoxType = 0;
    // æºå¨äººæ¨¡å¼åè¿æ¥ç¶æ
    $scope.controlMode = 1;
    $scope.modeName = $scope.modeArray[$scope.controlMode].mode_name;
    $scope.connectionStatus = 0;
    $scope.connectionText = $scope.consArray[$scope.connectionStatus];
    // æºå¨äººæå¨åä¸ºèªå¨æ¶ï¼å¨å±éåº¦ç¾åæ¯èªå¨è°æ´ä¸º1%åè½æ¯å¦å¼å¯
    $scope.vitesseGlobale = '0';
    $scope.globalSpeed = 1;
    // ç¤ºæç¹
    $scope.recordPointsMode = 0;
    $scope.quickRecordPointsName = '';
    $scope.quickRecordPointsState = -1;
    // TPD option
    tpd_record_state = 0;
    // TPDä½å§¿ç±»å
    $scope.selectedTPDLocation = $scope.setTPDLocation[0];
    $scope.selectedTPDDI = $scope.TPDCfgDI[0];
    $scope.selectedTPDDO  = $scope.TPDCfgDO[0];
    // åå§åç¨åºç¶æ
    programStatusDict = {
        0: "Stopped",
        1: "Stopped",
        2: "Running",
        3: "Pause",
        4: "Drag"
    };
    $scope.safetyStopFlag = 0;
    $scope.pointErrorNew = 0;
    $scope.forceDragCollision = 0;
    $scope.reWeldEnableOpen = 0; //çæ¥ä¸­æ­åæ¢å¤ä½¿è½
    $scope.protmpstate = 0;//æºå¨äººä¸´æ¶è¿è¡ç¶æ
    $scope.programStatus = programStatusDict[1];
    $scope.currentCoordDis = "Tool1";
    $scope.showApplyTool = false;
    $scope.currentWobjCoordDis = "Wobj1";
    $scope.showApplyWobj = false;
    $scope.currentSpeed = "100";
    $scope.speed = $scope.currentSpeed;
    $("#index_speed")[0].value = $scope.speed;
    $scope.currentEAxisCoordDis = "ExAxis1";
    $scope.exaxisNum = 0;
    $scope.checkGlobalCoverPoint = 1;
    // åå§åIOç¶æ
    $scope.clDO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.clDI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.toolDO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.toolDI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.analog_output = [0, 0, 0, 0, 0, 0];
    $scope.analog_input = [0, 0, 0, 0, 0, 0];
    $scope.vir_clDI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.vir_toolDI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.vir_analog_input = [0, 0, 0];
    $scope.dragMode = 0;
    $scope.dragModeName = indexDynamicTags.info_messages[20];
    $scope.AuxclDO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.AuxclDI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.aux_analog_output = [0, 0, 0, 0];
    $scope.aux_analog_input = [0, 0, 0, 0];
    // è¿ç¨æ§å¶æ¨¡å¼
    $scope.remoteControlMode = 0;
    $scope.profinetErrorData = langJsonData.IOlists.profinetErrorData;
    $scope.fciModeList = indexDynamicTags.var_object.fciModeData;
    $scope.whetherData = langJsonData.commandlist.searchPosWhether;
    $scope.slaveProtocolParam = {
        protocol: null,
        auto: null,
        disabled: null,
    };
    $scope.currentLoad = {
        id: 0,
        name: null,
        weight: 0,
        coord: [0,0,0]
    };
    // ç³»ç»æ å¿ä½ 0-QNXï¼1-Linux
    $scope.gSystemFlag = g_systemFlag;
    // Bootæ å¿ä½ 0-éBoot 1-Boot
    $scope.gBootModeFlag = g_bootModeFlag;
    $scope.bootModeParams = {
        entry: false,
        password: null,
    };
    // åå°ç¨åºæ¨¡å¼å¯ç¨æ å¿ä½ false-æªå¯ç¨(default)ï¼true-å¯ç¨
    $scope.gBackgroundProgramEnableFlag = false;
    // å®å¨åæ­¢æ¨¡å¼åå§å
    $scope.indexSafeStopMode = 0;
    // DOéç½®åå§å
    $scope.indexDOcfgArr = [];
    // ç¼ç å¨ç±»å
    $scope.encoderParam = {
        flag: null,
        data: []
    };
    // æ­ç©ç¶æé¡µæ°æ®
    $scope.torqueStatusData = {
        leftModel: null,
        leftYield: null,
        leftNGCount: null,
        leftWorkingTime: null,
        leftClearRes: null,
        rightModel: null,
        rightYield: null,
        rightNGCount: null,
        rightWorkingTime: null,
        rightClearRes: null,
    };
    // å¯¼å¥å·¥å·æ¨¡ååæ°
    $scope.exportTool = {
        file: null,
    };
    // ç¤ºæå¨é¥åæè³èªå®ä¹äºæ¬¡ç¡®è®¤åæ°
    $scope.indexTeachPendantData = {
        loadList: [],
        selectLoad: null,
        keyValue: 0,
        reset: '0',
        isManual: false,
        isDragSwitch: null,
    };
    // åå§å
    $scope.createFRCapsNavList();
    getTeachDevice();
    getStatusPageFlag();
    getIOAlias();
    getWObjCoordData();     // åå§åå·¥ä»¶åæ ç³»æ°æ®
    getEAxisCoordData();    // åå§åå¤é¨è½´åæ ç³»æ°æ®
    index_getToolCoordData();
    getUserFiles();
    getMainProgramData();
    getSysCfg();
    getSmartToolCfg();
    getRobotLock();
    getWebVersion();
    getSlaveProtocol();
    getRobotSpeedMaxValue();
    getAllExDeviceCfg('init');
    /* ./åå§å */

    // è·¯ç±çæ§ï¼è·³è½¬æåæåµä¸ï¼
    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
        if (previous != undefined) {
            if (previous.originalPath == "/programteach") { // å¤æ­æ¯å¦ä»ç¨åºç¼ç¨åæ¢å°å¶ä»é¡µé¢
                $scope.gBackgroundProgramEnableFlag = false; // åå°ç¨åºæ¨¡å¼éåºï¼æ å¿ä½èµå¼false
            }
        }
    });

    /**ç¦»å¼å½åé¡µé¢ï¼è·¯ç±åçæ¹åæ¶è§¦å */
    let navigateUrl; //è·³è½¬é¡µé¢çè·¯å¾
    $scope.$on('$routeChangeStart', function(event, current, previous) {
        if ($scope.freeMountModifyFlag) {
            event.preventDefault(); //æ¦æªè·¯ç±è·³è½¬
            $("#robot-mounting-confirm").modal('show');
            navigateUrl = '#' + current.originalPath; //è·³è½¬æå­çè·¯å¾
        }
    })

    // è·åç¨æ·ä¿¡æ¯
    function getAccountInfo() {
        // ç»å½æååï¼è¿å¥index.htmlé¡µé¢è·åç»å½çç¨æ·ä¿¡æ¯
        dataFactory.getData({ cmd: "get_account_info" })
            .then((data) => {
                $scope.userID = data.user_id;
                $scope.userName = data.user_name;
                $scope.authorityID = data.auth_id;
                $scope.authorityName = data.auth_name;
                // g_authFlg = data.auth_id;
                getUserAuthData();
                if ($scope.authorityID == '0') {
                    getRobotParamsRange('0');
                } else {
                    getRobotParamsRange('1'); //å¨å±å®å¨åæ°èå´è®¾ç½®è·å --å¦æéç®¡çååè¶çº§ç®¡çååä½¿ç¨ç®¡çç®¡çåè®¾å®çèå´
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[0]);
                /* test */
                if (g_testCode) {
                    $scope.authorityID = '0';
                    getUserAuthData();
                    sessionStorage.setItem('controlMode', 1);
                    if ($scope.authorityID == '0') {
                        getRobotParamsRange('0');
                    } else {
                        getRobotParamsRange('1');
                    }
                }
                /* ./test */
            });
    }

    // æ ¹æ®ç¨æ·çèè½ä»£å·è·åå¯¹åºçèè½
    function getUserAuthData() {
        const getAuthorityConfigParams = {
            cmd: "get_auth_config",
            data: {
                auth_id: $scope.authorityID
            }
        };
        dataFactory.getData(getAuthorityConfigParams).then((data) => {
            $scope.userAuthData = data;
            /* ç­åç«¯ä¿®æ¹æéæ¥å£åå é¤è¯¥é¨åä»£ç  */
            // åºç¡æ¨¡åå°å·¥å·åºç¨çä½ä¸åç¹ç§»å¥ãå¤é¨è½´åæ ç§»å°å¤è®¾çæ©å±è½´
            $scope.userAuthData.funcs.robot_setting['starting_point'] = '1';
            // å®å¨æ¨¡åæ°å¢åä¸ªå¹²æ¶åºãå¤ä¸ªå¹²æ¶åºãç¼©åæ¨¡å¼
            $scope.userAuthData.funcs.security_setting['multi_inter_zone'] = '1';
            $scope.userAuthData.funcs.security_setting['inter_zone'] = '1';
            $scope.userAuthData.funcs.security_setting['safe_reduce'] = '1';
            $scope.userAuthData.funcs.security_setting['kinematics'] = '1';
            // å¤è®¾æ¨¡åæ°å¢å¤¹çªãåä¼ æå¨ãçæ¥ææãCNCãè¾å©ä¼ æå¨ãç»åè®¾å¤
            $scope.userAuthData.funcs.peripheral_setting['gripper'] = '1';
            $scope.userAuthData.funcs.peripheral_setting['force_sensor'] = '1';
            $scope.userAuthData.funcs.peripheral_setting['smart_tool'] = '1';
            $scope.userAuthData.funcs.peripheral_setting['cnc'] = '1';
            $scope.userAuthData.funcs.peripheral_setting['auxilliary_sensor'] = '1';
            $scope.userAuthData.funcs.peripheral_setting['combination_device'] = '1';
            // å·¥å·åºç¨æ°å¢äº¤ç¹çæ
            $scope.userAuthData.funcs.peripheral_setting['intersection_generation'] = '1';
            /* ./ç­åç«¯ä¿®æ¹æéæ¥å£åå é¤è¯¥é¨åä»£ç  */
            $scope.judgeAuth();
            sessionStorage.setItem('userAuthority', JSON.stringify(data));
            // å·æ°æµè§å¨åï¼æ´æ°å¯¼èªæ ççé¢
            if ($window.location.href.split('#/')[1]) {
                refreshSidebarMenu($window.location.href.split('#/')[1]);
                if ($window.location.href.split('#/')[1] == 'programteach') {
                    $scope.setProgramUrdf(true);
                } else {
                    $scope.setProgramUrdf(false);
                }
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[0]);
            /* test */
            if (g_testCode) {
                $scope.userAuthData = testDataService.testAuthConfigData;
                $scope.judgeAuth();	
                sessionStorage.setItem('userAuthority', JSON.stringify(testDataService.testAuthConfigData));
                // å·æ°æµè§å¨åï¼æ´æ°å¯¼èªæ ççé¢
                if ($window.location.href.split('#/')[1]) {
                    refreshSidebarMenu($window.location.href.split('#/')[1]);
                    if ($window.location.href.split('#/')[1] == 'programteach') {
                        $scope.setProgramUrdf(true)
                    } else {
                        $scope.setProgramUrdf(false)
                    }
                }
                $scope.modbusRtuStateData = testDataService.testModbusRtuStateData;
                $scope.suckerData = testDataService.testSuckerData;
            }
            /* ./test */
        });
    }

    /**
     * å¯¼èªæ éé¡¹ä¾æ®æéå±ç¤º
     * @param {strubg} type å¯¼èªæ ç±»å
     * @param {object} nav å¯¼èªæ éé¡¹å¯¹è±¡
     * @returns True || False
     */
    $scope.navAuthShow = function (type, nav) {
        let authShow;

        if ($scope.userAuthData != undefined) {
            if (nav.hasOwnProperty('children')) {
                if (nav.children.length == 0) {
                    authShow = (nav.id && $scope.userAuthData.funcs[type][nav.id] == '1') || !nav.id;
                } else {
                    authShow = false;
                    for (let i = 0; i < nav.children.length; i++) {
                        if ($scope.userAuthData.funcs[type][nav.children[i].id] == '1') {
                            authShow = true;
                        }
                    }
                }
            } else {
                authShow = (nav.id && $scope.userAuthData.funcs[type][nav.id] == '1') || !nav.id;
            }
    
            return authShow;
        }
    }

    // æºå¨äººä¸ç»´æä½çæékey
    $scope.robotObjectKey = ['base', 'tool', 'wobj', 'joint', 'move'];
    $scope.robotObjectIndex = [];
    // æºå¨äººéå¥åè½çæékey
    $scope.robotSupportKey = ['tp_record ', 'sp_record ', 'io', 'tpd', 'eaxis', 'ft', 'rcm'];
    $scope.robotSupportIndex = [];
    // å¤æ­æ¯å¦ææé
    $scope.judgeAuth = function() {
        $scope.navbarObjects.forEach(item => {
            // item.children = item.children.filter(element => element.id == "frcap_plugin" || (element.id == "frcap" && frcapConfigCategoryCount && g_systemFlag) || $scope.userAuthData.views[element.id] == '1');  // 2025.05.15å é¤frcapç³»ç»çæ¬åºå
            item.children = item.children.filter(element => element.id == "frcap_plugin" || (element.id == "frcap" && frcapConfigCategoryCount) || $scope.userAuthData.views[element.id] == '1');
        })
        $scope.stateSwitchAuth = $scope.userAuthData.funcs.state_switch;
        $scope.robotOperationAuth = $scope.userAuthData.funcs.robot_operation;
        $scope.robotObjectKey.forEach((item, index) => {
            if ($scope.userAuthData.funcs.robot_operation[item] == '1') {
                $scope.robotObjectIndex.push(index);
            }
        })
        $scope.robotSupportKey.forEach((item, index) => {
            if ($scope.userAuthData.funcs.robot_operation[item] == '1') {
                $scope.robotSupportIndex.push(index);
            }
        })
    }

    // é¡µé¢è·¯ç±å·æ°å®æ
    $scope.$on('$locationChangeSuccess', function() {
        // å¯¼èªæ å³é­åæå¼ï¼é«äº®å½åé¡µé¢èæ¯è²
        gobackItemNavbar($location.path().split('/')[1]);
    })

    /* å¯¼èªæ å³é­åæå¼ï¼é«äº®å½åé¡µé¢èæ¯è² */
    $scope.openNavbar = function(item) {
        if (item && item.url !== '#' && document.querySelector('.sidebar-mini').offsetWidth < 1025) {
            $('body').toggleClass('sidebar-collapse');
        }
        gobackItemNavbar($window.location.href.split('#/')[1]);
    }

    $scope.openChildNavbar = function(childItem) {
        if (childItem && childItem.url !== '#' && document.querySelector('.sidebar-mini').offsetWidth < 1025) {
            $('body').toggleClass('sidebar-collapse');
        }
    }

    /**
     * è·åç¤ºæå¨æ¯å¦å¯ç¨
     */
    function getTeachDevice() {
        let cmdContent = {
            cmd: "get_PI_cfg"
        };
        dataFactory.getData(cmdContent)
            .then((data) => {
                if (data.enable == 1) {
                    g_teachPendantEnableFlg = 1;
                } else {
                    g_teachPendantEnableFlg = 0;
                }
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /* å è½½é¡µé¢è½½å¥è¿åº¦ */
    document.addEventListener("load-percentage", e => {
        if (e.detail != -1) {
            document.getElementById('loadPercentage').value = Number(e.detail.split('%')[0]);
        } else {
            $scope.initRobotSet = false;
            $("#robotTypeSetting").modal('show');
        }
    });

    /* åå®æ­ç©ç³»ç»ç¶æå±ç¤ºé¡µ */
    let time;
    /* å±ç¤ºç³»ç»æ¶é´ */
    function displayTime() {
        time = new Date();
        $("#tsTime").text(time.toLocaleString());
        $("#kysTime").text(time.toLocaleString());
        $("#psTime").text(time.toLocaleString());
        $("#rcTime").text(time.toLocaleString());
    }
    setInterval(displayTime, 1000);

    /* åå®ç¶æé¡µé¢è¿å¥æ­ç©è®¾ç½® */
    $scope.entryWebAPP = function () {
        refreshSidebarMenu('process');
        // ç®¡çååç¨åºåå¯ä»¥è¿å¥æ­ç©éç½®
        $("#torqueStatusPage").hide();
        // æ­ç©ç³»ç»ç¶æå±ç¤ºé¡µé¢ä¸é®ç´è¾¾è®¾ç½®
        let id = setTimeout(() => {
            if (document.getElementById('process') != null) {
                document.getElementById('process').dispatchEvent(new CustomEvent('open_torque_setting', { bubbles: true, cancelable: true, composed: true }));
            }
            clearTimeout(id);
        }, 1000);
    }

    /* åº·å»ç¶æé¡µé¢è¿å¥åº·å»è®¾ç½® */
    $scope.kangyangEntryWebAPP = function () {
        refreshSidebarMenu('process');
        $("#kangyangStatusPage").hide();
        let id = setTimeout(() => {
            if (document.getElementById('process') != null) {
                document.getElementById('process').dispatchEvent(new CustomEvent('open_kangyang_setting', { bubbles: true, cancelable: true, composed: true }));
            }
            clearTimeout(id);
        }, 1000);
    }

    /* ç åç¶æé¡µé¢è¿å¥ç åè®¾ç½® */
    $scope.palletizingEntryWebAPP = function () {
        refreshSidebarMenu('process');
        $("#palletizingStatusPage").hide();
        let id = setTimeout(() => {
            if (document.getElementById('process') != null) {
                document.getElementById('process').dispatchEvent(new CustomEvent('open_palletizing_setting', { bubbles: true, cancelable: true, composed: true }));
            }
            clearTimeout(id);
        }, 1000);
        clearTimeout(layer_time);
        $scope.selectedPalletizingProgram = {};
    }

    /* ç åçæ§é¡µçå¬ */
    document.addEventListener('open-palletizing-monitor', () => {
        // éåææuserDataéåºç åç¤ºæç¨åº
        let getCmd = {
            cmd: "get_user_data",
            data: {
                type: '1'
            }
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                let programNameList = Object.keys(data);
                $scope.palletizingProgramList = [];
                for (let i = 0; i < programNameList.length; i++) {
                    if (programNameList[i].indexOf("palletizing_") != -1) {
                        $scope.palletizingProgramList.push(data[programNameList[i]]);
                    }
                }
            }, (status) => {
                toastFactory.error(status);
            });
    });

    /* ç åç¶æçæ§é¡µé¢éæ©ç åç¤ºæç¨åº */
    $scope.selectPalletizingProgram = function (selectedProgram) {
        g_fileNameForUpload = selectedProgram.name;
        g_fileDataForUpload = selectedProgram.pgvalue;
        $scope.loadPalletizingFormula();
        clearTimeout(layer_time);
    }

    /* æ¸ç©ºç åçäº§æ°æ® */
    $scope.clearPalletizingProductionInfo = function () {
        let cmdContent = {
            cmd: "clear_palletizing_info",
            data: {}
        };
        dataFactory.actData(cmdContent)
            .then(() => {
                
                let patternCanvasMarch = document.getElementById('canvas');
                let patternCanvasMarchCtx = patternCanvasMarch.getContext('2d');
                patternCanvasMarchCtx.clearRect(0, 0, patternCanvasMarch.clientWidth, patternCanvasMarch.clientHeight);
                patternCanvasMarchCtx.restore();
                let patternCanvas = document.getElementById('palletCanvas');
                let patternCanvasCtx = patternCanvas.getContext('2d');
                patternCanvasCtx.clearRect(0, 0, patternCanvas.clientWidth, patternCanvas.clientHeight);
                patternCanvasCtx.restore();
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /* æ¸ç©ºç åçäº§æ°æ® */
    $scope.clearPalletizingWarningInfo = function () {
        $scope.palletizingCurrentErrorList = [];
    }

    /* åå»ºç åç¶æé¡µé¢éè¯¯åè¡¨ */
    function createPalletizingErrorList(time, errordata) {
        let errorList = [];
        errordata.forEach(errorInfo => {
            let item = {
                time: time,
                error: errorInfo
            };
            errorList.push(item);
        });
        $scope.palletizingCurrentErrorList = errorList;
    }

    /**
     * æ¸ç©ºæ­ç©å·¦/å³å·¥ä½æ°æ®
     * @param {Number} station 0-å·¦å·¥ä½ã1-å³å·¥ä½
     */
    $scope.clearJiabaoTorqueStatusInfo = function(station) {
        let cmdContent = {
            cmd: "clear_product_info",
            data: {
                station: station
            }
        };
        switch (station) {
            case 0:
                $scope.torqueStatusData.leftClearRes = 'loading';
                break;
            case 1:
                $scope.torqueStatusData.rightClearRes = 'loading';
                break;
            default:
                break;
        }
        dataFactory.actData(cmdContent).then(() => {
            switch (station) {
                case 0:
                    $scope.torqueStatusData.leftClearRes = 'success';
                    break;
                case 1:
                    $scope.torqueStatusData.rightClearRes = 'success';
                    break;
                default:
                    break;
            }
        }, (status) => {
            switch (station) {
                case 0:
                    $scope.torqueStatusData.leftClearRes = 'error';
                    break;
                case 1:
                    $scope.torqueStatusData.rightClearRes = 'error';
                    break;
                default:
                    break;
            }
            $timeout(function() {
                switch (station) {
                    case 0:
                        $scope.torqueStatusData.leftClearRes = null;
                        break;
                    case 1:
                        $scope.torqueStatusData.rightClearRes = null;
                        break;
                    default:
                        break;
                }
            }, 5000)
            toastFactory.error(status);
        });
    }
    /**ç åçæ§é¡µé¢Canvaså¨æå±ç¤º */
    /** å è½½ç åéæ¹*/
    let originPattern;
    let originPatternA;
    let originPatternB;
    let patternSequence;
    let monitorLayer;
    let monitorLayerArea;
    let palletPosition; // ç åä½ç½® 1-å·¦å·¥ä½ 2-å³å·¥ä½
    $scope.loadPalletizingFormula = function() {
        let loadFormulaCmd = {
            cmd: "get_palletizing_formula",
            data: {
                name: $scope.selectedPalletizingProgram.name.split('.lua')[0]
            }
        }
        dataFactory.getData(loadFormulaCmd)
            .then((data) => {
                //ç åéæ¹åå§ä½ç½®
                originPatternA = JSON.parse(data.pattern_config.origin_pattern_a);
                originPatternB = JSON.parse(data.pattern_config.origin_pattern_b);
                patternSequence = data.pattern_config.sequence.split(',');
                monitorLayer = data.pattern_config.layers;
                monitorLayerArea = data.pallet_config;
                march();
            
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**ç åå±çº§å±ç¤º */
    var canvas = document.getElementById("canvas");
    let layerLength;
    function drawLevel() {
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff";
            layerLength = 158 / monitorLayer;
            
            for(let i=0; i<monitorLayer; i++) {
                ctx.save();
                ctx.beginPath();
                if (i >= monitorLayer - $scope.palletizingLayerIndex + 1){
                    ctx.fillStyle = "#91C028";
                }
                ctx.strokeStyle = "#c5c0c0"
                ctx.strokeRect(6, 6 + layerLength * i, canvas.clientWidth - 12, layerLength);
                ctx.fillRect(6, 6 + layerLength * i, canvas.clientWidth - 12, layerLength);
                ctx.font = `${24-monitorLayer}px Arial`
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText(monitorLayer - i, (canvas.clientWidth - 12) / 2, 12 + 0.5 * layerLength + layerLength * i);
                ctx.restore();
            }

            let currentLevel = monitorLayer - $scope.palletizingLayerIndex;
            setTimeout(() => {
                ctx.fillStyle = "#91C028";
                ctx.strokeStyle = "#c5c0c0"
                ctx.strokeRect(6, 6 + layerLength * currentLevel, canvas.clientWidth - 12, layerLength);
                ctx.fillRect(6, 6 + layerLength * currentLevel, canvas.clientWidth - 12, layerLength);
                ctx.font = `${24-monitorLayer}px Arial`
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText(monitorLayer - currentLevel, (canvas.clientWidth - 12) / 2, 12 + 0.5 * layerLength + layerLength * currentLevel);
                ctx.restore();
            }, 800);
        }
    }
    
    let layer_time;
    function march() {
        drawLevel();
        drawMonitorBox();
        layer_time = setTimeout(march, 1500);
    }

    /**ç åæ¾ç½®ä½å±ç¤º */
    class monitorPalletPosition {
        /**
         * ç åæ¨¡å¼éç½®æé å½æ°
         * @param {object} originPattern åå§ä½ç½®æ°æ®
         * @param {object} monitorLayerArea åå§æçæ°æ®
         * @param {object} ctx canvas contextï¼å¯éï¼
         */
        constructor(originPattern, monitorLayerArea, ctx) {
            // ç»å¸é»è®¤å®½ä¸º400ï¼é«ä¸º350
            this.canvasWidth = 400;
            this.canvasHeight = 350;
            this.coe = 0.25;
            this.canvasCoe = 1;
            let canvasDiv = document.getElementById('monitor-pallet').clientWidth;
            if (canvasDiv > 400) {
                this.canvasWidth = 400
                this.canvasHeight = 350;
                this.coe = 0.25;
                this.canvasCoe = 1;
            } else {
                this.canvasWidth = canvasDiv;
                this.canvasCoe = this.canvasWidth / 400;
                this.canvasHeight = 350 * this.canvasCoe;
                this.coe = 0.25 * this.canvasCoe;
            }
            this.originPattern = originPattern;
            this.monitorLayerArea = monitorLayerArea;
            this.layerCanvas = document.getElementById('canvas');
            this.patternCanvas = document.getElementById('palletCanvas');
            this.ctx = ctx || this.patternCanvas.getContext('2d');
            this.palletColor = "#ffff";
            this.boxColor = "#66ccff";
            this.originPoint = {x: 0, y: 0};
            this.layerCanvas.setAttribute('width', this.canvasWidth);
            this.patternCanvas.setAttribute('width', this.canvasWidth);
            this.patternCanvas.setAttribute('height', this.canvasHeight);
        }

        /** æçæ¨¡å¼åºååå§å */
        init() {
            this.originPoint.x = (this.canvasWidth - this.monitorLayerArea.front * this.coe) / 2;
            this.originPoint.y = (this.canvasHeight - this.monitorLayerArea.side * this.coe) / 2;
            this.drawPallet(this.originPoint.x, this.originPoint.y, this.monitorLayerArea.front * this.coe, this.monitorLayerArea.side * this.coe);       //ç»å¶ç åæç
        }

        /**
         * ç»å¶æç
         * @param {int} x æçç»å¶ç¹xï¼åä½px
         * @param {int} y æçç»å¶ç¹yï¼åä½px
         * @param {int} f æçåè¾¹é¿åº¦ï¼åä½px
         * @param {int} s æçä¾§è¾¹é¿åº¦ï¼åä½px
         */
        drawPallet(x, y, f, s) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#c5c0c0";
            this.ctx.fillStyle = this.palletColor;
            this.ctx.strokeRect(x, y, f, s);
            this.ctx.fillRect(x, y, f, s);
            this.ctx.restore();
        }

        /**
         * ç»å¶å·¥ä»¶æ¹å
         * @param {object} boxx å·¥ä»¶æ¹åç»å¶ç¹xï¼åä½px
         * @param {int} x å·¥ä»¶æ¹åç»å¶ç¹xï¼åä½px
         * @param {int} y å·¥ä»¶æ¹åç»å¶ç¹yï¼åä½px
         * @param {int} fl å·¥ä»¶æ¹åå¹³è¡æçåè¾¹é¿åº¦ï¼åä½px
         * @param {int} sw å·¥ä»¶æ¹åå¹³è¡æçä¾§è¾¹å®½åº¦ï¼åä½px
         */
        drawBox(box, color) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#c5c0c0";
            this.ctx.fillStyle = color || this.boxColor;
            this.ctx.strokeRect(box.x, box.y, box.fl, box.sw);
            this.ctx.fillRect(box.x, box.y, box.fl, box.sw);
            this.ctx.restore();
        }

        /** BoxsGroupç¶ææ¹åæ¶éæ°ç»å¶ */
        redraw() {
            // æ¸ç©ºç»å¸
            this.ctx.save();
            this.ctx.clearRect(0, 0, 400, 350);
            this.ctx.restore();
        }

        /**
         * æ ¹æ®å³å·¥ä½canvaséåè®¡ç®å·¦å·¥ä½æ¹åçåå§ç¹ä½æ°æ®
         * @param {array} rightArray å³å·¥ä½åå§ç¹ä½æ°æ®
         * @returns 
         */
        createPatternLeftPoint(rightArray) {
            let leftArray = [];
            rightArray.forEach(item => {
                leftArray.push({
                    fl: item.fl * this.canvasCoe,
                    index: item.index,
                    isRotated: item.isRotated,
                    sw: item.sw * this.canvasCoe,
                    type: item.type,
                    x: palletPosition == 1 ? (this.canvasWidth/2 + (this.canvasWidth/2 - item.x) -item.fl) * this.canvasCoe : item.x * this.canvasCoe,
                    y: item.y * this.canvasCoe
                })
            });
            return leftArray;
        }
    }

    /**ç åæ¯å±ç åæ¾ç½®ä½ç½®å±ç¤º */
    function drawMonitorBox() {
        if ($scope.palletizingLayerIndex == 0) return;
        if (patternSequence[$scope.palletizingLayerIndex - 1] == 'A') {
            originPattern = originPatternA
        } else {
            originPattern = originPatternB
        }
        let patternEditCanvas = new monitorPalletPosition(
            originPattern,
            monitorLayerArea
        );
        //ç»å¶ç åæç
        patternEditCanvas.init();
        // å¤çåå§ç¹ä½æ°æ®ï¼å·¦å·¥ä½æ¶ï¼palletPosition == 1ï¼ï¼ç¹ä½æ°æ®xéè¦æ¹åï¼å³å·¥ä½ä¸éè¦æ¹åã
        originPattern = patternEditCanvas.createPatternLeftPoint(originPattern);
        
        originPattern.forEach((item, i) => {
            if (i < $scope.palletizingBoxIndex - 1) {
                patternEditCanvas.drawBox(item, "#91C028");     
            } else {
                patternEditCanvas.drawBox(item, "#fff");
            }
            if (i == $scope.palletizingBoxIndex - 1) {
                setTimeout(() => {
                    patternEditCanvas.drawBox(item, "#91C028");
                }, 800);
            }
        })
    }
    /** ./ ç åçæ§é¡µé¢Canvaså¨æå±ç¤º */

    // éåºè¿ç¨æ¨¡å¼
    $scope.remoteControlEntryWebAPP = function () {
        $scope.resizeRobotView();
        $scope.remoteControlSwitch(0);
    }

    /* åå®ç¶æé¡µé¢éè¯¯åè¡¨ */
    function createJiabaoErrorList(time, errordata) {
        let jiabaoErrorList = [];
        errordata.forEach(errorInfo => {
            let item = {
                time: time,
                error: errorInfo
            };
            jiabaoErrorList.push(item);
        });
        $scope.tsCurrentErrorList = jiabaoErrorList;
    }

    /* è·åIOå«å */
    function getIOAlias() {
        let cmdContent = {
            cmd: "get_DIO_cfg",
        };
        dataFactory.getData(cmdContent).then((data) => {
            $scope.DIAliasListForDisplay = data.DI;
            $scope.DOAliasListForDisplay = data.DO;
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /* è·åç³»ç»ç¶æé¡µé¢æ å¿ä½ */
    function getStatusPageFlag() {
        let cmdContent = {
            cmd: "get_status_flag",
        };
        dataFactory.getData(cmdContent)
            .then((data) => {
                if (data.page_flag == 3) {
                    $("#palletizingStatusPage").show();
                    document.dispatchEvent(new CustomEvent('open-palletizing-monitor', { bubbles: true, cancelable: true, composed: true}));
                } else if (data.page_flag == 2) {
                    $("#kangyangStatusPage").show();
                } else if (data.page_flag == 1) {
                    $("#torqueStatusPage").show();
                } else {
                    $("#torqueStatusPage").hide();
                    $("#kangyangStatusPage").hide();
                    $("#palletizingStatusPage").hide();
                }
            }, (status) => {
                toastFactory.error(status);
            });
    }

    // ä½¿ç¨stopPropagationæ¹æ³æ¥é»æ­¢clickäºä»¶çåä¸ä¼ æ­ï¼é»æ­¢dropdown-menuç¹å»åæ¶å¤±
    $('[data-stopPropagation]').on('click', function (e) {
        e.stopPropagation();
    });

    /* æºå¨äººåå·åºåéç½® */
    // å»ä½¿è½
    $scope.enableRobot = function() {
        let enableCmd = {
            cmd: 302,
            data: {
                content: "RobotEnable(0)",
            },
        };
        dataFactory.setData(enableCmd).then(() => {
            $('#enableRobotModal').modal('hide');
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * è·åå½åæºå¨äººåå·æ°æ®
     * @param {int} rotType éä½æ¨¡å¼ 0-åºå®éä½ 1-æ©å±éä½Â±360
     */
    function getCurrentRobotType(rotType) {
        let cmdContent = {
            cmd: "get_robot_type"
        };
        dataFactory.getData(cmdContent)
            .then((data) => {
                // å¤æ­robot_typeåæ°å¼å³å®æ¯è¿è¡åºåè®¾ç½®è¿æ¯å¼å§å è½½æ¨¡å
                if (data.type == 0) {
                    // éèä¸»é¡µæºå¨äººä¸ç»´æ¨¡åå è½½å¨ç»
                    removeIndexLoading();
                    // æ¾ç¤ºæºå¨äººåå·åºåéç½®å¯¹è¯æ¡
                    $scope.initRobotSet = true;
                    $("#robotTypeSetting").modal('show');
                } else {
                    // æ¾ç¤ºä¸»é¡µæºå¨äººä¸ç»´æ¨¡åå è½½å¨ç»
                    loadIndexLoading();
                    // éèæºå¨äººåå·åºåéç½®å¯¹è¯æ¡
                    $("#robotTypeSetting").modal('hide');
                    // æºå¨äººæ¨¡ååå§å
                    g_robotType = data;
                    g_robotTypeCode = 100 * (data.type - 1) + 10 * (data.major_ver - 1) + (data.minor_ver + 1);
                    if (rotType == 1) {
                        if (g_robotTypeCode == 2) {
                            viewer.real = "./data/cobots/urdf/fr3v6-360.urdf";
                        } else if (g_robotTypeCode == 103) {
                            viewer.real = "./data/cobots/urdf/fr5v6-360.urdf";
                        } else if (g_robotTypeCode == 202) {
                            viewer.real = "./data/cobots/urdf/fr10v6-360.urdf";
                        } else if (g_robotTypeCode == 302) {
                            viewer.real = "./data/cobots/urdf/fr16v6-360.urdf";
                        } else if (g_robotTypeCode == 402) {
                            viewer.real = "./data/cobots/urdf/fr20v6-360.urdf";
                        } else {
                            viewer.real = $scope.robotModelUrlDict[g_robotTypeCode];
                        }
                    } else {
                        viewer.real = $scope.robotModelUrlDict[g_robotTypeCode];
                    }
                    // å¤æ­æºå¨äººåå·æ¯å¦å¨å¯æ¾ç¤ºéä½ç¯çåå·æ°ç»ä¸­
                    if (Object.keys(robotRingsRadius).indexOf(String(g_robotTypeCode)) != -1) {
                        $scope.show_jointRings = true;  // æ¾ç¤ºåç¯æ§å¶æé®
                    } else {
                        $scope.show_jointRings = false; // éèåç¯æ§å¶æé®
                    }
                    // æºå¨äººè´è½½èå´åå§å
                    switch (g_robotTypeCode) {
                        case 1:
                        case 2:
                        case 3:
                        case 501:
                        case 702:
                        case 703:
                        case 906:
                        case 907:
                        case 908:
                            // FR3 & ART3 & FR3WML & FR3WMS & FR3(C) & ART3-R6-XM & FC3-R6-B
                            $scope.robotPayloadRangeMax = 3;
                            break;
                        case 101:
                        case 102:
                        case 103:
                        case 601:
                        case 802:
                        case 804:
                        case 901:
                        case 904:
                            // FR5 || FR5C || ART5 || FR3MT || FR3C(FR3å¤è§æºåä½è´è½½è¦æ±ä¸º5KG)
                            $scope.robotPayloadRangeMax = 5;
                            break;
                        case 201:
                        case 202:
                        case 902:
                            // FR10 & FRå®å¶æºå¨äººï¼902ï¼
                            $scope.robotPayloadRangeMax = 10;
                            break;
                        case 301:
                        case 302:
                            // FR16
                            $scope.robotPayloadRangeMax = 16;
                            break;
                        case 401:
                        case 402:
                            // FR20
                            $scope.robotPayloadRangeMax = 20;
                            break;
                        case 1001:
                            // FR30
                            $scope.robotPayloadRangeMax = 30;
                            break;
                        default:
                            break;
                    }
                }
                // æºå¨äººåºåæ ç³»åå§å
                viewer.displayCoordinateSystem(0);
                // æºå¨äººç¢°æç­çº§åå§å
                switch (g_robotTypeCode) {
                    case 1:
                    case 2:
                    case 3:
                    case 702:
                    case 703:
                    case 804:
                    case 901:
                    case 904:
                    case 906:
                    case 907:
                    case 908:
                        // FR3ãART3ãFR3MTãFR3WMLãFR3WMSãFR5CãFR3CãFR3(C)ãART3-R6-XM
                        $scope.collisionLevelData = constantService.fr3CollideGradeData;
                        g_collisionLevelData = constantService.fr3CollideGradeData;
                        break;
                    case 101:
                    case 102:
                    case 103:
                    case 601:
                    case 802:
                        // FR5ãART5ãFR5WM
                        $scope.collisionLevelData = constantService.fr5CollideGradeData;
                        g_collisionLevelData = constantService.fr5CollideGradeData;
                        break;
                    case 201:
                    case 202:
                    case 301:
                    case 302:
                    case 803:
                    case 902:
                        // FR10ãFR16ãFR5LãFR10YD
                        $scope.collisionLevelData = constantService.fr10CollideGradeData;
                        g_collisionLevelData = constantService.fr10CollideGradeData;
                        break;
                    case 401:
                    case 402:
                    case 1001:
                        // FR20ãFR30
                        $scope.collisionLevelData = constantService.fr20CollideGradeData;
                        g_collisionLevelData = constantService.fr20CollideGradeData;
                        break;
                    case 905:
                        // FR30L
                        $scope.collisionLevelData = constantService.fr30lCollideGradeData;
                        g_collisionLevelData = constantService.fr30lCollideGradeData;
                        break;
                    default:
                        $scope.collisionLevelData = constantService.fr10CollideGradeData;
                        g_collisionLevelData = constantService.fr10CollideGradeData;
                        break;
                }
                // ç¨åºç¼ç¨æ°å­I/Oæä»¤DOéæ©é¡¹æ¯å¦æ¯æçæ å¿ä½
                if ((g_robotTypeCode == 804 || g_robotTypeCode == 901 || g_robotTypeCode == 904 || g_robotTypeCode == 906) && $scope.gSystemFlag) {
                    $scope.supportRobotFlag = 1;
                } else {
                    $scope.supportRobotFlag = 0;
                }
            }, (status) => {
                toastFactory.error(status);
                /* test */
                if (g_testCode) {
                    let data = {
                        type: 10,
                        major_ver: 1,
                        minor_ver: 5
                    };
                    // å¤æ­robot_typeåæ°å¼å³å®æ¯è¿è¡åºåè®¾ç½®è¿æ¯å¼å§å è½½æ¨¡å
                    if (data.type == 0) {
                        // éèä¸»é¡µæºå¨äººä¸ç»´æ¨¡åå è½½å¨ç»
                        removeIndexLoading();
                        // æ¾ç¤ºæºå¨äººåå·åºåéç½®å¯¹è¯æ¡
                        $scope.initRobotSet = true;
                        $("#robotTypeSetting").modal('show');
                    } else {
                        // æ¾ç¤ºä¸»é¡µæºå¨äººä¸ç»´æ¨¡åå è½½å¨ç»
                        loadIndexLoading();
                        // éèæºå¨äººåå·åºåéç½®å¯¹è¯æ¡
                        $("#robotTypeSetting").modal('hide');
                        // æºå¨äººæ¨¡ååå§å
                        g_robotType = data;
                        g_robotTypeCode = 100 * (data.type - 1) + 10 * (data.major_ver - 1) + (data.minor_ver + 1);
                        if (rotType == 1) {
                            if (g_robotTypeCode == 2) {
                                viewer.real = "./data/cobots/urdf/fr3v6-360.urdf";
                            } else if (g_robotTypeCode == 103) {
                                viewer.real = "./data/cobots/urdf/fr5v6-360.urdf";
                            } else if (g_robotTypeCode == 202) {
                                viewer.real = "./data/cobots/urdf/fr10v6-360.urdf";
                            } else if (g_robotTypeCode == 302) {
                                viewer.real = "./data/cobots/urdf/fr16v6-360.urdf";
                            } else if (g_robotTypeCode == 402) {
                                viewer.real = "./data/cobots/urdf/fr20v6-360.urdf";
                            } else {
                                viewer.real = $scope.robotModelUrlDict[g_robotTypeCode];
                            }
                        } else {
                            viewer.real = $scope.robotModelUrlDict[g_robotTypeCode];
                        }
                        // å¤æ­æºå¨äººåå·æ¯å¦å¨å¯æ¾ç¤ºéä½ç¯çåå·æ°ç»ä¸­
                        if (Object.keys(robotRingsRadius).indexOf(String(g_robotTypeCode)) != -1) {
                            $scope.show_jointRings = true;  // æ¾ç¤ºåç¯æ§å¶æé®
                        } else {
                            $scope.show_jointRings = false; // éèåç¯æ§å¶æé®
                        }
                        // viewer.virtual = $scope.robotModelUrlDict[g_robotTypeCode];
                        // æºå¨äººè´è½½èå´åå§å
                        switch (g_robotTypeCode) {
                            case 1:
                            case 2:
                            case 3:
                            case 501:
                            case 702:
                            case 703:
                            case 906:
                                // FR3 & ART3 & FR3WML & FR3WMS & FR3(C)(FR3Cå¤è§æºåä½è´è½½è¦æ±ä¸º3KG)
                                $scope.robotPayloadRangeMax = 3;
                                break;
                            case 101:
                            case 102:
                            case 103:
                            case 601:
                            case 802:
                            case 804:
                            case 901:
                            case 904:
                                // FR5 || FR5C || ART5 || FR3MT || FR3C(FR3å¤è§æºåä½è´è½½è¦æ±ä¸º5KG)
                                $scope.robotPayloadRangeMax = 5;
                                break;
                            case 201:
                            case 202:
                            case 902:
                                // FR10 & FRå®å¶æºå¨äººï¼902ï¼
                                $scope.robotPayloadRangeMax = 10;
                                break;
                            case 301:
                            case 302:
                                // FR16
                                $scope.robotPayloadRangeMax = 16;
                                break;
                            case 401:
                            case 402:
                                // FR20
                                $scope.robotPayloadRangeMax = 20;
                                break;
                            case 1001:
                                // FR30
                                $scope.robotPayloadRangeMax = 30;
                                break;
                            default:
                                break;
                        }
                    }
                    viewer.displayCoordinateSystem(0);      // æºå¨äººåºåæ ç³»åå§å
                    // æºå¨äººç¢°æç­çº§åå§å
                    switch (g_robotTypeCode) {
                        case 1:
                        case 2:
                        case 3:
                        case 702:
                        case 703:
                        case 804:
                        case 901:
                        case 904:
                        case 906:
                        case 907:
                        case 908:
                            // FR3ãART3ãFR3MTãFR3WMLãFR3WMSãFR5CãFR3CãFR3(C)ãART3-R6-XM
                            $scope.collisionLevelData = constantService.fr3CollideGradeData;
                            g_collisionLevelData = constantService.fr3CollideGradeData;
                            break;
                        case 101:
                        case 102:
                        case 103:
                        case 601:
                        case 802:
                            // FR5ãART5ãFR5WM
                            $scope.collisionLevelData = constantService.fr5CollideGradeData;
                            g_collisionLevelData = constantService.fr5CollideGradeData;
                            break;
                        case 201:
                        case 202:
                        case 301:
                        case 302:
                        case 803:
                        case 902:
                            // FR10ãFR16ãFR5LãFR10YD
                            $scope.collisionLevelData = constantService.fr10CollideGradeData;
                            g_collisionLevelData = constantService.fr10CollideGradeData;
                            break;
                        case 401:
                        case 402:
                        case 1001:
                            // FR20ãFR30
                            $scope.collisionLevelData = constantService.fr20CollideGradeData;
                            g_collisionLevelData = constantService.fr20CollideGradeData;
                            break;
                        case 905:
                            // FR30L
                            $scope.collisionLevelData = constantService.fr30lCollideGradeData;
                            g_collisionLevelData = constantService.fr30lCollideGradeData;
                            break;
                        default:
                            $scope.collisionLevelData = constantService.fr10CollideGradeData;
                            g_collisionLevelData = constantService.fr10CollideGradeData;
                            break;
                    }
                    $scope.curRunProgram = {
                        status: 0,
                        name: 'program1.lua',
                        url: '#/programteach',
                        mainName: 'program1.lua',
                    };
                    $scope.indexTeachPendantData.loadList = testDataService.testEndLoadList;
                    $scope.modbusStateData = testDataService.testModbusStateData;
                }
                /* ./test */
            });
    }

    /**
     * è®¾ç½®æºå¨äººååº¦åæè½¬è§åº¦
     * @param {int} stiffnessValue 0-æ®éååº¦ 1-é«ååº¦
     * @param {int} limitValue 0-åºå®éä½ 1-æ©å±éä½(æ­£è´360)
     */
    function setRobotStiffness(stiffnessValue,limitValue) {
        let stiffnessCmd = {
            cmd: 822,
            data: {
                content: "SetJointStiffnessType(" + stiffnessValue + ',' + limitValue + ")"
            }
        };
        dataFactory.setData(stiffnessCmd).then(() => {
            $scope.pwdForRTS = '';
            if (!initRobotSet) {
                $timeout(function() {
                    $('#pageLoading').css("display", "none");
                    $("#robotTypeSetting").modal('hide');
                    alert(indexDynamicTags.success_messages[0]);
                    $scope.logout();
                }, 5000)
            }
        }, (status) => {
            toastFactory.error(status);
        });
    }
    document.addEventListener('822', e => {
        $('#pageLoading').css("display", "none");
        $("#robotTypeSetting").modal('hide');
        alert(indexDynamicTags.success_messages[0]);
    });

    /* è®¾ç½®æºå¨äººåå·æ°æ® */
    $scope.robotEnableState = 0;
    $scope.setRobotType = function() {
        if ($scope.robotEnableState == 1) {
            toastFactory.info(indexDynamicTags.info_messages[0]);
        } else if ($scope.pwdForRTS == undefined || $scope.pwdForRTS == "") {
            toastFactory.info(indexDynamicTags.info_messages[1]);
        } else if ($scope.selectedRobotType == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[2]);
        } else if ($scope.selectedMajorVer == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[3]);
        } else if ($scope.selectedMinorVer == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[4]);
        } else {
            let cmdContent = {
                cmd: 425,
                data: {
                    pwd: $scope.pwdForRTS,
                    content: {
                        type: $scope.selectedRobotType.rt_index,
                        major_ver: $scope.selectedMajorVer.ma_index,
                        minor_ver: $scope.selectedMinorVer.mi_index,
                    }
                }
            };
            dataFactory.setData(cmdContent).then((data) => {
                if (data == "success") {
                    $('#pageLoading').css("display", "block");
                    saveRobotType();
                    // è®¾ç½®æºå¨äººååº¦ç­çº§åå³èéä½æ¨¡å¼
                    if (($scope.selectedRobotType.rt_index == 1 && $scope.selectedMinorVer.mi_index == 1) ||
                        ($scope.selectedRobotType.rt_index == 2 && $scope.selectedMinorVer.mi_index == 2) ||
                        ($scope.selectedRobotType.rt_index == 3 && $scope.selectedMinorVer.mi_index == 1) ||
                        ($scope.selectedRobotType.rt_index == 4 && $scope.selectedMinorVer.mi_index == 1) ||
                        ($scope.selectedRobotType.rt_index == 5 && $scope.selectedMinorVer.mi_index == 1))
                    {
                        setRobotStiffness($scope.selectedStiffness.id, $scope.selectedLimit.id); //FR3-FR16
                    } else if ($scope.selectedRobotType.rt_index == 8 || ($scope.selectedRobotType.rt_index == 9 && ($scope.selectedMinorVer.mi_index == 2 || $scope.selectedMinorVer.mi_index == 3))) {
                        setRobotStiffness($scope.selectedStiffness.id, 1); //FRWMS-FRWMS
                    } else {
                        setRobotStiffness($scope.selectedStiffness.id, 0); //å¶ä»åå·
                    }
                } else if (data == "pwd_error") {
                    toastFactory.error(403, indexDynamicTags.error_messages[2]);
                }
            }, (status) => {
                toastFactory.error(status);
            });
        }
    }

    /* ä¿å­æºå¨äººåå·æ°æ®è³WebAPPåå° */
    function saveRobotType() {
        $scope.showConfiguringInfo = true;
        let loadRangeMax = 0;
        if ($scope.selectedRobotType.rt_index == 10) {
            loadRangeMax = $scope.selectedMinorVer.load_range_max;
        } else {
            loadRangeMax = $scope.selectedRobotType.load_range_max;
        }
        let cmdContent = {
            cmd: "save_robot_type",
            data: {
                type: $scope.selectedRobotType.rt_index,
                major_ver: $scope.selectedMajorVer.ma_index,
                minor_ver: $scope.selectedMinorVer.mi_index,
                load_range_max: loadRangeMax
            }
        };
        dataFactory.actData(cmdContent).then((data) => {
            $scope.showConfiguringInfo = false;
        }, (status) => {
            $('#pageLoading').css("display", "none");
            $scope.showConfiguringInfo = false;
            toastFactory.error(status);
        });
    }
    /* ./æºå¨äººåå·åºåéç½® */

    // è·åå½åæ¶é´
    function getTimeNow() {
        let now = new Date();
        return now.getTime();
    }

    let refreshTimeStart;
    $window.onbeforeunload = function () {
        // è·åonbeforeunloadæ¶é´æ³ï¼ä½ä¸ºå·æ°åå³é­é¡µé¢çå¼å§æ¶é´
        refreshTimeStart = getTimeNow();
    }

    // å·æ°æ¶ååå°åéå·æ°å½ä»¤é»æ­¢åå°æ¸é¤session
    $window.onunload = function () {
        // è·åonunloadæ¶é´æ³ï¼ä½ä¸ºå·æ°æèå³é­é¡µé¢çç»ææ¶é´
        let refreshTimeEnd = getTimeNow();
        // å½å¼å§æ¶é´åç»ææ¶é´å·®å¤§äº5msæ¶ï¼åè®¤ä¸ºæµè§å¨å¨æ§è¡å·æ°æä½
        // è®¤ä¸ºå·æ°æä½æ¶ååå°åérefreshæä»¤ä½¿å¾åå°æ¸é¤è¶æ¶å®æ¶å¨ï¼ä»¥é²æ­¢æ¸é¤sessionID
        if (refreshTimeEnd - refreshTimeStart > 5) {
            let refreshCmd = {
                cmd: "refresh"
            };
            $.ajax({
                url: 'action/sta',
                type: 'POST',
                data: JSON.stringify(refreshCmd),
                async: true,
                contentType: 'application/json',
                dataType: 'json'
            })
        }
    };

    // æ³¨åurdf-viewerèªå®ä¹åç´ 
    if (customElements.get('urdf-viewer') !== undefined) {
        console.log("customElements:urdf-viewer already exists!");
    } else {
        customElements.define('urdf-viewer', URDFManipulator);
        console.log("customElements:urdf-viewer is created!");
    }

    // ä¸ç»´èææºå¨äººç¸å³æ°æ®åå§å
    var viewer = document.querySelector('urdf-viewer');
    // const limitsToggle = document.getElementById('ignore-joint-limits');
    // const upSelect = document.getElementById('up-select');
    const sliderList = document.querySelector('#robot-setting-info ul.slider-list');
    // const controlsel = document.getElementById('controls');
    // const controlsToggle = document.getElementById('toggle-controls');
    const DEG2RAD = Math.PI / 180;
    const RAD2DEG = 1 / DEG2RAD;
    let sliders = {};
    let joints = {};
    let moveJ_data = {};
    $scope.controlBase = true;               // åºåæ ç³»
    $scope.controlTool = true;               // å·¥å·åæ ç³»
    $scope.controlWorkpiece = false;         // å·¥ä»¶åæ ç³»
    $scope.controlExAxis = false;            // æ©å±è½´åæ ç³»
    $scope.submitTool = false;               // å¯¼å¥å·¥å·æ¨¡å
    $scope.controlExAxisCSOnorOff = "ON";
    $scope.controlTrack = false;             // è½¨è¿¹æ¾ç¤ºæ§å¶
    $scope.currCubeInterfereONOFF = false;   // ç«æ¹ä½å¹²æ¶åºæ¾ç¤ºå¼å³
    $scope.currJointRingONOFF = false;       // å³èéä½ç¯æ¾ç¤ºå¼å³ï¼å½åç¶æï¼
    $scope.currSafetyPlaneONOFF = false;     // å®å¨å¢æ¾ç¤ºå¼å³ï¼å½åç¶æï¼
    let enableExAxisControl = 0;
    let enableWorkpieceControl = 0;
    let forceRenderingExAxisCS = 0;
    let forceRenderingWorkpieceCS = 0;
    let DrawTrackFlg = false;                // è½¨è¿¹ç»å¶æ å¿
    // å®å¨å¢å¹²æ¶åºåæ°(8ä¸ª)
    let interferePlaneSetFlag = 0;
    let planesParams = [{
        enable: 0,                           // å®å¨å¢å¯ç¨æ å¿
        A: 0,                                // å¹³é¢æ¹ç¨Aåæ°
        B: 0,                                // å¹³é¢æ¹ç¨Båæ°
        C: 0,                                // å¹³é¢æ¹ç¨Cåæ°
        D: 0,                                // å¹³é¢æ¹ç¨Dåæ°
        safeDis: 0,                          // å®å¨è·ç¦»
        planeSize: 3                         // å®å¨å¢å¤§å°
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    },{
        enable: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        safeDis: 0,
        planeSize: 3
    }];
    // ç«æ¹ä½å¹²æ¶åºåæ° ââââ é»è®¤åè½æªå¯ç¨ãèå´åå¹²æ¶()
    let interfereCubeData = [
        {
            id: 1,
            status: 0,
            mode: 0,
            cubeParams: {},
            cubeRefCoord: {},
            entry: false,
        },
        {
            id: 2,
            status: 0,
            mode: 0,
            cubeParams: {},
            cubeRefCoord: {},
            entry: false,
        },
        {
            id: 3,
            status: 0,
            mode: 0,
            cubeParams: {},
            cubeRefCoord: {},
            entry: false,
        },
        {
            id: 4,
            status: 0,
            mode: 0,
            cubeParams: {},
            cubeRefCoord: {},
            entry: false,
        }
    ];
    // è½´å¹²æ¶åºåæ°
    let interfereJointSetFlag = 0;     // é»è®¤åè½æªå¯ç¨
    let interfereJointMode = 1;        // é»è®¤èå´å¤å¹²æ¶
    let jointRingsParams = [{
        innerRadius: 0,                // åç¯åå¾
        outerRadius: 0,                // åç¯å¤å¾
        pointerAngle: 0,               // æç¤ºéè§åº¦
        yellow1Start: 0,
        yellow1End: 0,                 // é»è²åºå1ï¼å¹²æ¶åºï¼
        greenStart: 0,
        greenEnd: 0,                   // ç»¿è²åºåï¼å®éè½¯éä½ï¼
        yellow2Start: 0,
        yellow2End: 0,                 // é»è²åºå2ï¼å¹²æ¶åºï¼
        enable: 0                      // è½´å¹²æ¶åºå¯ç¨æ å¿ä½
    }, {
        innerRadius: 0,
        outerRadius: 0,
        pointerAngle: 0,
        yellow1Start: 0,
        yellow1End: 0,
        greenStart: 0,
        greenEnd: 0,
        yellow2Start: 0,
        yellow2End: 0,
        enable: 0
    }, {
        innerRadius: 0,
        outerRadius: 0,
        pointerAngle: 0,
        yellow1Start: 0,
        yellow1End: 0,
        greenStart: 0,
        greenEnd: 0,
        yellow2Start: 0,
        yellow2End: 0,
        enable: 0
    }, {
        innerRadius: 0,
        outerRadius: 0,
        pointerAngle: 0,
        yellow1Start: 0,
        yellow1End: 0,
        greenStart: 0,
        greenEnd: 0,
        yellow2Start: 0,
        yellow2End: 0,
        enable: 0
    }, {
        innerRadius: 0,
        outerRadius: 0,
        pointerAngle: 0,
        yellow1Start: 0,
        yellow1End: 0,
        greenStart: 0,
        greenEnd: 0,
        yellow2Start: 0,
        yellow2End: 0,
        enable: 0
    }, {
        innerRadius: 0,
        outerRadius: 0,
        pointerAngle: 0,
        yellow1Start: 0,
        yellow1End: 0,
        greenStart: 0,
        greenEnd: 0,
        yellow2Start: 0,
        yellow2End: 0,
        enable: 0
    }];

    /**è·åç½ç»çæºå¨äººæ å¿(åå§å) */
    function getRobotOnlineEdition() {
        let getCmd = {
            cmd: 1192,
            data: {
                content: "GetNetRobotConfig()",
            },
        };
        dataFactory.setData(getCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.addEventListener('1192', e => {
        let data = JSON.parse(e.detail);
        $scope.controlBoxType = data.wide_type;
        if (data.type == 1) {
            $scope.indexRobotType = $scope.indexRobotType + indexDynamicTags.info_messages[48];
        }
    });

    /**
     * è·åODMä¸­çæºå¨äººåå·
     * @param {string} value æºå¨äººåå·åç§°
     */
    function getOdmRobotType(value) {
        const getOdmRobotTypeCmd = {
            cmd: "get_ODM_cfg",
        };
        dataFactory.getData(getOdmRobotTypeCmd).then((data) => {
            if (data.contact_us) {
                $scope.contactUsData = data.contact_us[g_lang_code];
            }
            if (data.robot_model) {
                $scope.indexRobotType = data.robot_model;
                $scope.sysRobotType = data.robot_model;
            } else {
                $scope.indexRobotType = value;
            }
            getRobotOnlineEdition();
        }, (status) => {
            $scope.selectedLogCount = 0;
            toastFactory.error(status, indexDynamicTags.error_messages[67]);
            /* test */
            if (g_testCode) {
                const data = {
                    robot_model: 'FR5 V6.0'
                };
                if (data.robot_model) {
                    $scope.indexRobotType = data.robot_model;
                    $scope.sysRobotType = data.robot_model;
                } else {
                    $scope.indexRobotType = value;
                }
            }
            /* ./test */
        });
    }

    /**
     * è®¾ç½®ODMæºå¨äººåå·
     * @param {string} value æºå¨äººåå·åç§°
     * @returns 
     */
    $scope.importsysRobotType = function (value) {
        if (value == "" || value == undefined || value == null) {
            toastFactory.info(indexDynamicTags.info_messages[41]);
            return;
        }
        if ((value.trim().startsWith('FR') || value.trim().startsWith('ART')) && g_robotModelArr.every(item => item.name != value.trim())) {
            toastFactory.info(indexDynamicTags.info_messages[42]);
            return;
        }
        let saveCmd = {
            cmd: "set_ODM_cfg",
            data: {
                "robot_model": value.trim() + ""
            },
        };
        dataFactory.actData(saveCmd).then(() => {
            $scope.sysRobotType = value;
            $scope.indexRobotType = value;
            getRobotOnlineEdition();
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[68]);
        });
    }

    $scope.J1Slider = {
        min: -10,
        max: 10
    };
    $scope.J2Slider = {
        min: -10,
        max: 10
    };
    $scope.J3Slider = {
        min: -10,
        max: 10
    };
    $scope.J4Slider = {
        min: -10,
        max: 10
    };
    $scope.J5Slider = {
        min: -10,
        max: 10
    };
    $scope.J6Slider = {
        min: -10,
        max: 10
    };
    /**
     * è·åæºå¨äººéç½®æä»¶
     * @param {string} dataType éè¦è·åçæ°æ®ç±»å
     */
    $scope.getRobotCfg = function(dataType) {
        let getRobotCfgCmd = {
            cmd: "get_robot_cfg"
        };
        dataFactory.getData(getRobotCfgCmd).then((data) => {
            // åå§åæ´æ°urdfæ¨¡å
            if (dataType == 'rot360') {
                getCurrentRobotType(~~data.rot360_joint6rottype);
            }
            // åå§ååæ´æ°èææºå¨äººå®è£æ¹å¼åå³èè½¯éä½
            if (dataType == 'init' || dataType == 'jointLimit') {
                document.dispatchEvent(new CustomEvent('mounting-changed', { bubbles: true, cancelable: true, composed: true, detail: data.install_pos }));
                let j1Slider = document.querySelector('input[name="j1"]');
                let j2Slider = document.querySelector('input[name="j2"]');
                let j3Slider = document.querySelector('input[name="j3"]');
                let j4Slider = document.querySelector('input[name="j4"]');
                let j5Slider = document.querySelector('input[name="j5"]');
                let j6Slider = document.querySelector('input[name="j6"]');
                // æºå¨äººæä½(MoveJ) joints slideræ°å¼èå´
                if (j1Slider != null && j2Slider != null && j3Slider != null && j4Slider != null && j5Slider != null && j6Slider != null) {
                    if (g_robotTypeCode == 1 || g_robotTypeCode == 2 || g_robotTypeCode == 906) {
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr3_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr3_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 3) {    // FR3 V6.0(Mirror)
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.fr3_left_j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.fr3_left_j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr3_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr3_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.fr3_left_j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.fr3_left_j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotType.type == 6) {
                        j1Slider.max = ~~data.art_j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.art_j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr3_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr3_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.art_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.art_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.art_j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.art_j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotType.type == 7) {
                        j1Slider.max = ~~data.art_j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.art_j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.art_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.art_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.art_j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.art_j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 702) { // FR3WML
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.fr3wml_j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.fr3wml_j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 703) { // FR3WMS
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr3_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr3_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.fr3wml_j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.fr3wml_j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 802) {
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.wm_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.wm_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.wm_j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.wm_j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.wm_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.wm_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 803) { // FR5L
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr5l_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr5l_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904) {
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fr3_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fr3_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.mt3_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.mt3_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 902) {
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.yd10_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.yd10_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 905) {            // FR30L
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.fr30l_j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.fr30l_j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 907) {            // ART3-R6-XM
                        j1Slider.max = ~~data.m001_j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.m001_j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.m001_j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.m001_j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.m001_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.m001_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.wm_j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.wm_j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.m001_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.m001_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    } else if (g_robotTypeCode == 908) {            // FC3-R6-B
                        j1Slider.max = ~~data.fc3b_j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.fc3b_j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.fc3b_j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.fc3b_j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.fc3b_j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.fc3b_j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.fc3b_j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.fc3b_j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.fc3b_j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.fc3b_j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.fc3b_j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.fc3b_j6_min_joint_limit * DEG2RAD;
                    } else {
                        j1Slider.max = ~~data.j1_max_joint_limit * DEG2RAD;
                        j1Slider.min = ~~data.j1_min_joint_limit * DEG2RAD;
                        j2Slider.max = ~~data.j2_max_joint_limit * DEG2RAD;
                        j2Slider.min = ~~data.j2_min_joint_limit * DEG2RAD;
                        j3Slider.max = ~~data.j3_max_joint_limit * DEG2RAD;
                        j3Slider.min = ~~data.j3_min_joint_limit * DEG2RAD;
                        j4Slider.max = ~~data.j4_max_joint_limit * DEG2RAD;
                        j4Slider.min = ~~data.j4_min_joint_limit * DEG2RAD;
                        j5Slider.max = ~~data.j5_max_joint_limit * DEG2RAD;
                        j5Slider.min = ~~data.j5_min_joint_limit * DEG2RAD;
                        j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                        j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                    }
                    // æ ¹æ®éä½æ¨¡å¼æ¹åjoint6è½¯éä½ 0-åºå®éä½ 1-æ©å±éä½Â±360
                    switch (g_robotTypeCode) {
                        case 2:
                        case 103:
                        case 202:
                        case 302:
                        case 803:
                        case 804:
                            // FR3 V6.0ãFR5 V6.0ãFR10 V6.0ãFR16 V6.0ãFR5-WMLãFR5-C
                            if (~~data.rot360_joint6rottype == 1) {
                                j6Slider.max  = ~~data.j6_rot360_max_joint_limit * DEG2RAD;
                                j6Slider.min  = ~~data.j6_rot360_min_joint_limit * DEG2RAD;
                            } else {
                                j6Slider.max = ~~data.j6_max_joint_limit * DEG2RAD;
                                j6Slider.min = ~~data.j6_min_joint_limit * DEG2RAD;
                            }
                            break;
                        default:
                            break;
                    }
                }
                // æºå¨äººæä½(ç¹å¨) joints slideræ°å¼èå´
                if ($scope.J1Slider != null && $scope.J2Slider != null && $scope.J3Slider != null && $scope.J4Slider != null && $scope.J5Slider != null && $scope.J6Slider != null) {
                    if (g_robotTypeCode == 1 || g_robotTypeCode == 2 || g_robotTypeCode == 906) {
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fr3_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fr3_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 3) {    // FR3 V6.0(Mirror)
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.fr3_left_j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.fr3_left_j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fr3_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fr3_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.fr3_left_j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.fr3_left_j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotType.type == 6) {
                        $scope.J1Slider.max = ~~data.art_j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.art_j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fr3_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fr3_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.art_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.art_j5_min_Jjoint_limit;
                        $scope.J6Slider.max = ~~data.art_j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.art_j6_min_joint_limit;
                    } else if (g_robotType.type == 7) {
                        $scope.J1Slider.max = ~~data.art_j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.art_j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.art_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.art_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.art_j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.art_j6_min_joint_limit;
                    } else if (g_robotTypeCode == 702) { // FR3WML
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.fr3wml_j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.fr3wml_j6_min_joint_limit;
                    } else if (g_robotTypeCode == 703) { // FR3WMS
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fr3_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fr3_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.fr3wml_j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.fr3wml_j6_min_joint_limit;
                    } else if (g_robotTypeCode == 802) {
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.wm_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.wm_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.wm_j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.wm_j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.wm_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.wm_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 803) { // FR5l
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904) {
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fr3_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fr3_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.mt3_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.mt3_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 902) {
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.yd10_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.yd10_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 905) {                     // FR30L
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.fr30l_j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.fr30l_j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 907) {                     // ART3-R6-XM
                        $scope.J1Slider.max = ~~data.m001_j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.m001_j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.m001_j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.m001_j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.m001_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.m001_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.wm_j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.wm_j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.m001_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.m001_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    } else if (g_robotTypeCode == 908) {                     // FC3-R6-B
                        $scope.J1Slider.max = ~~data.fc3b_j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.fc3b_j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.fc3b_j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.fc3b_j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.fc3b_j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.fc3b_j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.fc3b_j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.fc3b_j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.fc3b_j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.fc3b_j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.fc3b_j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.fc3b_j6_min_joint_limit;
                    } else {
                        $scope.J1Slider.max = ~~data.j1_max_joint_limit;
                        $scope.J1Slider.min = ~~data.j1_min_joint_limit;
                        $scope.J2Slider.max = ~~data.j2_max_joint_limit;
                        $scope.J2Slider.min = ~~data.j2_min_joint_limit;
                        $scope.J3Slider.max = ~~data.j3_max_joint_limit;
                        $scope.J3Slider.min = ~~data.j3_min_joint_limit;
                        $scope.J4Slider.max = ~~data.j4_max_joint_limit;
                        $scope.J4Slider.min = ~~data.j4_min_joint_limit;
                        $scope.J5Slider.max = ~~data.j5_max_joint_limit;
                        $scope.J5Slider.min = ~~data.j5_min_joint_limit;
                        $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                        $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                    }
                    // æ ¹æ®éä½æ¨¡å¼æ¹åjoint6è½¯éä½ 0-åºå®éä½ 1-æ©å±éä½Â±360
                    switch (g_robotTypeCode) {
                        case 2:
                        case 103:
                        case 202:
                        case 302:
                        case 402:
                        case 803:
                        case 804:
                            // FR3 V6.0ãFR5 V6.0ãFR10 V6.0ãFR16 V6.0ãFR20 V6.0ãFR5-WMLãFR5-C
                            if (~~data.rot360_joint6rottype == 1) {
                                $scope.J6Slider.max  = ~~data.j6_rot360_max_joint_limit;
                                $scope.J6Slider.min  = ~~data.j6_rot360_min_joint_limit;
                            } else {
                                $scope.J6Slider.max = ~~data.j6_max_joint_limit;
                                $scope.J6Slider.min = ~~data.j6_min_joint_limit;
                            }
                            break;
                        default:
                            break;
                    }
                }
                $scope.getRobotInterfereCfg('init');
            }
            // åå§ååæ´æ°å®å¨åæ­¢æ¨¡å¼
            if (dataType == 'init' || dataType == 'safety') {
                $scope.indexSafeStopMode = ~~data.safetystop_enable;
            }
            // åå§ååæ´æ°DOåæ°
            if (dataType == 'init' || dataType == 'DO') {
                $scope.indexDOcfgArr[0] = (~~data.ctl_do8_config);
                $scope.indexDOcfgArr[1] = (~~data.ctl_do9_config);
                $scope.indexDOcfgArr[2] = (~~data.ctl_do10_config);
                $scope.indexDOcfgArr[3] = (~~data.ctl_do11_config);
                $scope.indexDOcfgArr[4] = (~~data.ctl_do12_config);
                $scope.indexDOcfgArr[5] = (~~data.ctl_do13_config);
                $scope.indexDOcfgArr[6] = (~~data.ctl_do14_config);
                $scope.indexDOcfgArr[7] = (~~data.ctl_do15_config);
            }
            // åå§ååæ´æ°å®å¨å¢åæ°
            if (dataType == 'init' || dataType == 'update_plane_interference') {
                interferePlaneSetFlag = 0;
                planesParams.forEach((plane, index) => {
                    plane.enable = ~~data[`safetyplane${index}_enable`];
                    plane.A = parseFloat(data[`safetyplane${index}_plane_a`]);
                    plane.B = parseFloat(data[`safetyplane${index}_plane_b`]);
                    plane.C = parseFloat(data[`safetyplane${index}_plane_c`]);
                    plane.D = parseFloat(data[`safetyplane${index}_plane_d`]) / 1000;
                    plane.safeDis = parseFloat(data[`safetyplane${index}_safe_dis`]);
                    if (plane.enable) {
                        interferePlaneSetFlag = 1;
                    }
                });
                if (interferePlaneSetFlag) { // åªè¦å­å¨ä¸ä¸ªå®å¨å¢æ¯å¯ç¨ç¶æï¼åèªå¨å¼å¯å®å¨å¢æ¾ç¤ºåè½
                    $scope.currSafetyPlaneONOFF = true;
                    viewer.createAllPlanes(planesParams);
                } else { // å¦åå¦æææå®å¨å¢é½æ¯å³é­ï¼åå³é­æ¾ç¤º
                    $scope.currSafetyPlaneONOFF = false;
                    viewer.destroyPlaneInterference();
                }
            }
            if (dataType == 'init' || dataType == 'update_speed') {
                // æºå¨äººèªå¨æ¨¡å¼ä¸éåº¦
                $scope.speedScaleAuto = parseFloat(data.speedscale_auto).toFixed(2);
                $scope.speedScaleManual = parseFloat(data.speedscale_manual).toFixed(2);
            }
            // åå§åå¶ä½åå®¹
            if (dataType == 'init') {
                // æºå¨äººåå·æå­å±ç¤º
                $scope.stiffnessText = langJsonData.index.var_object.stiffnessList[~~data.fric_jointstiffnesstype].name;
                getOdmRobotType(getRobotTypeText(data.robot_type));
                // init RCMï¼è¿å¿ä¸å¨ç¹ï¼
                $scope.RCMEnableStatus = ~~data.rcm_enable;
                if ($scope.RCMEnableStatus == 1) {
                    $scope.RCMEnable = true;
                } else {
                    $scope.RCMEnable = false;
                }
                $scope.RCMCoordX = data.rcm_coord_x;
                $scope.RCMCoordY = data.rcm_coord_y;
                $scope.RCMCoordZ = data.rcm_coord_z;
                // æºå¨äººIOéç½®é¡¹
                $scope.DOCfgArr = [~~data.ctl_do8_config, ~~data.ctl_do9_config, ~~data.ctl_do10_config, ~~data.ctl_do11_config,
                    ~~data.ctl_do12_config, ~~data.ctl_do13_config, ~~data.ctl_do14_config, ~~data.ctl_do15_config];
                $scope.DICfgArr = [~~data.ctl_di8_config, ~~data.ctl_di9_config, ~~data.ctl_di10_config, ~~data.ctl_di11_config,
                    ~~data.ctl_di12_config, ~~data.ctl_di13_config, ~~data.ctl_di14_config, ~~data.ctl_di15_config];
                $scope.endDICfgArr = [~~data.tool_di1_config, ~~data.tool_di2_config];
                getTempIOAliasData();
            }
        }, (status) => {
            $scope.stiffnessText = '';
            getOdmRobotType();
            toastFactory.error(status, indexDynamicTags.error_messages[3]);
            /* test */
            if (g_testCode) {
                const data = {
                    robot_type: '1001.0000000000',
                    fric_jointstiffnesstype: '1.00000'
                }
                $scope.stiffnessText = langJsonData.index.var_object.stiffnessList[~~data.fric_jointstiffnesstype].name;
                getOdmRobotType(getRobotTypeText(data.robot_type));
                // åå§åæ´æ°urdfæ¨¡å
                if (dataType == 'rot360') {
                    getCurrentRobotType(1);
                }
                $scope.speedScaleAuto = 0.3;
                $scope.speedScaleManual = 0.3;
            }
            /* ./test */
        });
    }

    /**
     * è·åæºå¨äººåæ§éç½®æ°æ®
     * @param {string} dynamicType 'init'--åå§åï¼'ft'--FTåæ ç³»
     */
    function getDynamicData(dynamicType) {
        let getDynamicCfgCmd = {
            cmd: "get_dynamic_cfg",
        };
        dataFactory.getData(getDynamicCfgCmd).then((data) => {
            if (dynamicType == 'init' || dynamicType == 'ft') {
                // FTåæ ç³»éç½®
                $scope.indexSelectedFTCoord = $scope.FTReferenceCoordData[~~data.forcesensor_refcoord];
                if (~~data.forcesensor_refcoord == 0) {
                    $scope.currentFTCoord = "Tool";
                } else if (~~data.forcesensor_refcoord == 1) {
                    $scope.currentFTCoord = "Base";
                } else {
                    $scope.currentFTCoord = "Custom";
                }
            }
            if (dynamicType == 'init' || dynamicType == 'ftCoord') {
                // FTåæ ç³»æ°æ®
                $scope.selectedFTCoord.x = parseFloat(data.forcesensor_coord_x).toFixed(3);
                $scope.selectedFTCoord.y = parseFloat(data.forcesensor_coord_y).toFixed(3);
                $scope.selectedFTCoord.z = parseFloat(data.forcesensor_coord_z).toFixed(3);
                $scope.selectedFTCoord.rx = parseFloat(data.forcesensor_coord_a).toFixed(3);
                $scope.selectedFTCoord.ry = parseFloat(data.forcesensor_coord_b).toFixed(3);
                $scope.selectedFTCoord.rz = parseFloat(data.forcesensor_coord_c).toFixed(3);
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[69]);
        });
    }

    /**
     * è·åæºå¨äººå¹²æ¶åºéç½®æä»¶
     * @param {string} interfereType éè¦è·åçæ°æ®ç±»å
     */
    $scope.getRobotInterfereCfg = function(interfereType) {
        let getRobotCfgCmd = {
            cmd: "get_interfere_cfg"
        };
        dataFactory.getData(getRobotCfgCmd).then((data) => {
            // åå§ååæ´æ°ç«æ¹ä½å¹²æ¶åº
            if (interfereType == 'init' || interfereType == 'update_cube_interference') {
                // interfereCubeSetFlag = ~~data.interfere_cube_setflag;
                interfereCubeData.forEach(item => {
                    item.status = ~~data[`interfere_cube${item.id}_setflag`];
                    item.mode = ~~data[`interfere_cube${item.id}_mode`];
                    if (item.status == 1) {
                        if (~~data[`interfere_cube${item.id}_method`] == 1) { //1-ä¸­å¿ç¹+è¾¹é¿
                            item.cubeParams = {
                                Method: ~~data[`interfere_cube${item.id}_method`], 
                                param1: parseFloat(data[`interfere_${item.id}x_center`]).toFixed(3) / 1000,
                                param2: parseFloat(data[`interfere_${item.id}y_center`]).toFixed(3) / 1000,
                                param3: parseFloat(data[`interfere_${item.id}z_center`]).toFixed(3) / 1000,
                                param4: parseFloat(data[`interfere_${item.id}x_length`]).toFixed(3) / 1000,
                                param5: parseFloat(data[`interfere_${item.id}y_length`]).toFixed(3) / 1000,
                                param6: parseFloat(data[`interfere_${item.id}z_length`]).toFixed(3) / 1000,
                            };
                        } else { // 0-ä¸¤ç¹æ³
                            item.cubeParams = {
                                Method: ~~data[`interfere_cube${item.id}_method`], 
                                param1: parseFloat(data[`interfere_${item.id}x_min`]).toFixed(3) / 1000,
                                param2: parseFloat(data[`interfere_${item.id}y_min`]).toFixed(3) / 1000,
                                param3: parseFloat(data[`interfere_${item.id}z_min`]).toFixed(3) / 1000,
                                param4: parseFloat(data[`interfere_${item.id}x_max`]).toFixed(3) / 1000,
                                param5: parseFloat(data[`interfere_${item.id}y_max`]).toFixed(3) / 1000,
                                param6: parseFloat(data[`interfere_${item.id}z_max`]).toFixed(3) / 1000,
                            };
                        }
                        if (~~data[`interfere_cube${item.id}_refcoord`] == 1) { // 1-å·¥ä»¶åæ ç³»
                            item.cubeRefCoord = {
                                refcoord: ~~data[`interfere_cube${item.id}_refcoord`],
                                coordx: parseFloat(data[`interfere_cube${item.id}_coord_x`]).toFixed(3) / 1000,
                                coordy: parseFloat(data[`interfere_cube${item.id}_coord_y`]).toFixed(3) / 1000,
                                coordz: parseFloat(data[`interfere_cube${item.id}_coord_z`]).toFixed(3) / 1000,
                                coorda: parseFloat(data[`interfere_cube${item.id}_coord_a`]).toFixed(3),
                                coordb: parseFloat(data[`interfere_cube${item.id}_coord_b`]).toFixed(3),
                                coordc: parseFloat(data[`interfere_cube${item.id}_coord_c`]).toFixed(3),
                            }
                        } else { // 0-åºåæ ç³»
                            item.cubeRefCoord = {
                                refcoord: ~~data[`interfere_cube${item.id}_refcoord`],
                                coordx: 0,
                                coordy: 0,
                                coordz: 0,
                                coorda: 0,
                                coordb: 0,
                                coordc: 0,
                            }
                        }
                    } else {
                        item.cubeParams = {};
                        item.cubeRefCoord = {};
                    }
                })
                if (interfereCubeData.some(item => item.status)) {
                    // ç«æ¹ä½å¹²æ¶åºåè½å­å¨å¯ç¨æ¶ï¼èªå¨æå¼æé®æ¾ç¤º
                    $scope.currCubeInterfereONOFF = true;
                    viewer.createCubeInterference(interfereCubeData);
                } else {
                    // ç«æ¹ä½å¹²æ¶åºå¨é¨å³é­
                    $scope.currCubeInterfereONOFF = false;
                    viewer.removeCubeInterference();
                    
                }
            }
            // åå§ååæ´æ°è½´å¹²æ¶åºåæ°
            if (interfereType == 'init' || interfereType == 'update_axis_interference') {
                if ($scope.show_jointRings) { // å¯æ¾ç¤ºå³èéä½ç¯çæºå¨äººåå·
                    interfereJointSetFlag = ~~data.interfere_joint_setflag;
                    if (interfereJointSetFlag == 1) { // è½´å¹²æ¶åºå¯ç¨
                        // å¹²æ¶åºæ¨¡å¼ï¼0-èå´åï¼1-èå´å¤ï¼
                        interfereJointMode = ~~data.interfere_joint_mode;
                        jointRingsParams[0].enable = ~~data.interfere_j1_enable;
                        jointRingsParams[1].enable = ~~data.interfere_j2_enable;
                        jointRingsParams[2].enable = ~~data.interfere_j3_enable;
                        jointRingsParams[3].enable = ~~data.interfere_j4_enable;
                        jointRingsParams[4].enable = ~~data.interfere_j5_enable;
                        jointRingsParams[5].enable = ~~data.interfere_j6_enable;
                        // J1 Params
                        if (~~data.interfere_j1_enable == 1 && 
                            parseFloat(data.interfere_j1_min) >= $scope.J1Slider.min &&
                            parseFloat(data.interfere_j1_max) <= $scope.J1Slider.max && 
                            parseFloat(data.interfere_j1_max) > parseFloat(data.interfere_j1_min)
                        ) {
                            jointRingsParams[0].yellow1Start = $scope.J1Slider.min;
                            jointRingsParams[0].yellow1End = parseFloat(data.interfere_j1_min);
                            jointRingsParams[0].greenStart = parseFloat(data.interfere_j1_min);
                            jointRingsParams[0].greenEnd = parseFloat(data.interfere_j1_max);
                            jointRingsParams[0].yellow2Start = parseFloat(data.interfere_j1_max);
                            jointRingsParams[0].yellow2End = $scope.J1Slider.max;
                        } else {
                            jointRingsParams[0].yellow1Start = 0;
                            jointRingsParams[0].yellow1End = 0;
                            jointRingsParams[0].greenStart = $scope.J1Slider.min;
                            jointRingsParams[0].greenEnd = $scope.J1Slider.max;
                            jointRingsParams[0].yellow2Start = 0;
                            jointRingsParams[0].yellow2End = 0;
                        }
                        // J2 Params
                        if (~~data.interfere_j2_enable == 1 &&
                            parseFloat(data.interfere_j2_min) >= $scope.J2Slider.min &&
                            parseFloat(data.interfere_j2_max) <= $scope.J2Slider.max && 
                            parseFloat(data.interfere_j2_max) > parseFloat(data.interfere_j2_min)
                        ) {
                            jointRingsParams[1].yellow1Start = $scope.J2Slider.min;
                            jointRingsParams[1].yellow1End = parseFloat(data.interfere_j2_min);
                            jointRingsParams[1].greenStart = parseFloat(data.interfere_j2_min);
                            jointRingsParams[1].greenEnd = parseFloat(data.interfere_j2_max);
                            jointRingsParams[1].yellow2Start = parseFloat(data.interfere_j2_max);
                            jointRingsParams[1].yellow2End = $scope.J2Slider.max;
                        } else {
                            jointRingsParams[1].yellow1Start = 0;
                            jointRingsParams[1].yellow1End = 0;
                            jointRingsParams[1].greenStart = $scope.J2Slider.min;
                            jointRingsParams[1].greenEnd = $scope.J2Slider.max;
                            jointRingsParams[1].yellow2Start = 0;
                            jointRingsParams[1].yellow2End = 0;
                        }
                        // J3 Params
                        if (~~data.interfere_j3_enable == 1 &&
                            parseFloat(data.interfere_j3_min) >= $scope.J3Slider.min &&
                            parseFloat(data.interfere_j3_max) <= $scope.J3Slider.max && 
                            parseFloat(data.interfere_j3_max) > parseFloat(data.interfere_j3_min)
                        ) {
                            jointRingsParams[2].yellow1Start = $scope.J3Slider.min;
                            jointRingsParams[2].yellow1End = parseFloat(data.interfere_j3_min);
                            jointRingsParams[2].greenStart = parseFloat(data.interfere_j3_min);
                            jointRingsParams[2].greenEnd = parseFloat(data.interfere_j3_max);
                            jointRingsParams[2].yellow2Start = parseFloat(data.interfere_j3_max);
                            jointRingsParams[2].yellow2End = $scope.J3Slider.max;
                        } else {
                            jointRingsParams[2].yellow1Start = 0;
                            jointRingsParams[2].yellow1End = 0;
                            jointRingsParams[2].greenStart = $scope.J3Slider.min;
                            jointRingsParams[2].greenEnd = $scope.J3Slider.max;
                            jointRingsParams[2].yellow2Start = 0;
                            jointRingsParams[2].yellow2End = 0;
                        }
                        // J4 Params
                        if (~~data.interfere_j4_enable == 1 &&
                            parseFloat(data.interfere_j4_min) >= $scope.J4Slider.min &&
                            parseFloat(data.interfere_j4_max) <= $scope.J4Slider.max && 
                            parseFloat(data.interfere_j4_max) > parseFloat(data.interfere_j4_min)
                        ) {
                            jointRingsParams[3].yellow1Start = $scope.J4Slider.min;
                            jointRingsParams[3].yellow1End = parseFloat(data.interfere_j4_min);
                            jointRingsParams[3].greenStart = parseFloat(data.interfere_j4_min);
                            jointRingsParams[3].greenEnd = parseFloat(data.interfere_j4_max);
                            jointRingsParams[3].yellow2Start = parseFloat(data.interfere_j4_max);
                            jointRingsParams[3].yellow2End = $scope.J4Slider.max;
                        } else {
                            jointRingsParams[3].yellow1Start = 0;
                            jointRingsParams[3].yellow1End = 0;
                            jointRingsParams[3].greenStart = $scope.J4Slider.min;
                            jointRingsParams[3].greenEnd = $scope.J4Slider.max;
                            jointRingsParams[3].yellow2Start = 0;
                            jointRingsParams[3].yellow2End = 0;
                        }
                        // J5 Params
                        if (~~data.interfere_j5_enable == 1 && 
                            parseFloat(data.interfere_j5_min) >= $scope.J5Slider.min &&
                            parseFloat(data.interfere_j5_max) <= $scope.J5Slider.max && 
                            parseFloat(data.interfere_j5_max) > parseFloat(data.interfere_j5_min)
                        ) {
                            jointRingsParams[4].yellow1Start = $scope.J5Slider.min;
                            jointRingsParams[4].yellow1End = parseFloat(data.interfere_j5_min);
                            jointRingsParams[4].greenStart = parseFloat(data.interfere_j5_min);
                            jointRingsParams[4].greenEnd = parseFloat(data.interfere_j5_max);
                            jointRingsParams[4].yellow2Start = parseFloat(data.interfere_j5_max);
                            jointRingsParams[4].yellow2End = $scope.J5Slider.max;
                        } else {
                            jointRingsParams[4].yellow1Start = 0;
                            jointRingsParams[4].yellow1End = 0;
                            jointRingsParams[4].greenStart = $scope.J5Slider.min;
                            jointRingsParams[4].greenEnd = $scope.J5Slider.max;
                            jointRingsParams[4].yellow2Start = 0;
                            jointRingsParams[4].yellow2End = 0;
                        }
                        // J6 Params
                        if (~~data.interfere_j6_enable == 1 &&
                            parseFloat(data.interfere_j6_min) >= $scope.J6Slider.min &&
                            parseFloat(data.interfere_j6_max) <= $scope.J6Slider.max && 
                            parseFloat(data.interfere_j6_max) > parseFloat(data.interfere_j6_min)
                        ) {
                            jointRingsParams[5].yellow1Start = $scope.J6Slider.min;
                            jointRingsParams[5].yellow1End = parseFloat(data.interfere_j6_min);
                            jointRingsParams[5].greenStart = parseFloat(data.interfere_j6_min);
                            jointRingsParams[5].greenEnd = parseFloat(data.interfere_j6_max);
                            jointRingsParams[5].yellow2Start = parseFloat(data.interfere_j6_max);
                            jointRingsParams[5].yellow2End = $scope.J6Slider.max;
                        } else {
                            jointRingsParams[5].yellow1Start = 0;
                            jointRingsParams[5].yellow1End = 0;
                            jointRingsParams[5].greenStart = $scope.J6Slider.min;
                            jointRingsParams[5].greenEnd = $scope.J6Slider.max;
                            jointRingsParams[5].yellow2Start = 0;
                            jointRingsParams[5].yellow2End = 0;
                        }
                    } else {
                        jointRingsParams[0].yellow1Start = 0;
                        jointRingsParams[0].yellow1End = 0;
                        jointRingsParams[0].greenStart = $scope.J1Slider.min;
                        jointRingsParams[0].greenEnd = $scope.J1Slider.max;
                        jointRingsParams[0].yellow2Start = 0;
                        jointRingsParams[0].yellow2End = 0;
                        jointRingsParams[1].yellow1Start = 0;
                        jointRingsParams[1].yellow1End = 0;
                        jointRingsParams[1].greenStart = $scope.J2Slider.min;
                        jointRingsParams[1].greenEnd = $scope.J2Slider.max;
                        jointRingsParams[1].yellow2Start = 0;
                        jointRingsParams[1].yellow2End = 0;
                        jointRingsParams[2].yellow1Start = 0;
                        jointRingsParams[2].yellow1End = 0;
                        jointRingsParams[2].greenStart = $scope.J3Slider.min;
                        jointRingsParams[2].greenEnd = $scope.J3Slider.max;
                        jointRingsParams[2].yellow2Start = 0;
                        jointRingsParams[2].yellow2End = 0;
                        jointRingsParams[3].yellow1Start = 0;
                        jointRingsParams[3].yellow1End = 0;
                        jointRingsParams[3].greenStart = $scope.J4Slider.min;
                        jointRingsParams[3].greenEnd = $scope.J4Slider.max;
                        jointRingsParams[3].yellow2Start = 0;
                        jointRingsParams[3].yellow2End = 0;
                        jointRingsParams[4].yellow1Start = 0;
                        jointRingsParams[4].yellow1End = 0;
                        jointRingsParams[4].greenStart = $scope.J5Slider.min;
                        jointRingsParams[4].greenEnd = $scope.J5Slider.max;
                        jointRingsParams[4].yellow2Start = 0;
                        jointRingsParams[4].yellow2End = 0;
                        jointRingsParams[5].yellow1Start = 0;
                        jointRingsParams[5].yellow1End = 0;
                        jointRingsParams[5].greenStart = $scope.J6Slider.min;
                        jointRingsParams[5].greenEnd = $scope.J6Slider.max;
                        jointRingsParams[5].yellow2Start = 0;
                        jointRingsParams[5].yellow2End = 0;
                    }
                    // åå³èåç¯åå¤åå¾
                    if ($scope.show_jointRings && robotRingsRadius[g_robotTypeCode]) {
                        jointRingsParams[0].innerRadius = robotRingsRadius[g_robotTypeCode][0];
                        jointRingsParams[0].outerRadius = robotRingsRadius[g_robotTypeCode][0] + ringOuterRadiusDiff;
                        jointRingsParams[1].innerRadius = robotRingsRadius[g_robotTypeCode][1];
                        jointRingsParams[1].outerRadius = robotRingsRadius[g_robotTypeCode][1] + ringOuterRadiusDiff;
                        jointRingsParams[2].innerRadius = robotRingsRadius[g_robotTypeCode][2];
                        jointRingsParams[2].outerRadius = robotRingsRadius[g_robotTypeCode][2] + ringOuterRadiusDiff;
                        jointRingsParams[3].innerRadius = robotRingsRadius[g_robotTypeCode][3];
                        jointRingsParams[3].outerRadius = robotRingsRadius[g_robotTypeCode][3] + ringOuterRadiusDiff;
                        jointRingsParams[4].innerRadius = robotRingsRadius[g_robotTypeCode][4];
                        jointRingsParams[4].outerRadius = robotRingsRadius[g_robotTypeCode][4] + ringOuterRadiusDiff;
                        jointRingsParams[5].innerRadius = robotRingsRadius[g_robotTypeCode][5];
                        jointRingsParams[5].outerRadius = robotRingsRadius[g_robotTypeCode][5] + ringOuterRadiusDiff;
                    }
                }
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[3]);
        });
    }

    // è·åå½åæºå¨äººå®è£æ¹å¼è§åº¦(åå§å)
    function getFreeMountingAngle() {
        let getCmd = {
            cmd: 639,
            data: {
                content: "GetRobotInstallAngle()",
            },
        };
        dataFactory.setData(getCmd).then(() => {}, (status) => {
            $scope.applyMountRes = 'error';
            $timeout(function() {
                $scope.applyMountRes = '';
            }, 5000)
            toastFactory.error(status);
        });
    }

    document.addEventListener('639', e => {
        $scope.curYAngle = parseFloat(JSON.parse(e.detail).yangle);
        $scope.curZAngle = parseFloat(JSON.parse(e.detail).zangle);
        lastYAngle = $scope.curYAngle;
        lastZAngle = $scope.curZAngle;
        $scope.yAngle = $scope.curYAngle;
        $scope.zAngle = $scope.curZAngle;
        if (!$scope.freeMountModifyFlag) {
            viewer.changeFreeMounting($scope.curYAngle, $scope.curZAngle);
        }
        $scope.freeMountModifyFlag = 0;
        if (navigateUrl) {
            location = navigateUrl; 
            navigateUrl = '';
        }
        // å½èªç±å®è£åºåº§è§åº¦åçæ¹ååè§¦å
        if ($scope.freeMountModifyFlag) {
            changeVRobotWidth();
            $scope.switchVirtualFunc(0);
        }
        if ($scope.applyMountRes == 'loading') {
            $scope.applyMountRes = 'success';
            $timeout(function() {
                $scope.applyMountRes = '';
            }, 5000)
        }
    });

    // ä¿®æ¹ä¸ç»´æ¨¡åæºå¨äººå®è£æ¹å¼
    document.addEventListener('mounting-changed', e => {
        getFreeMountingAngle();
    });

    // Global Functions
    $window.setColor = color => {

        document.body.style.backgroundColor = color;
        viewer.highlightColor = '#' + (new THREE.Color(0xffffff)).lerp(new THREE.Color(color), 0.35).getHexString();

    };

    // Events
    // controlsToggle.addEventListener('click', () => controlsel.classList.toggle('hidden'));

    // viewer.addEventListener('angle-change', e => {

    //     if (sliders[e.detail]) sliders[e.detail].update();

    // });

    viewer.addEventListener('virtual-angle-change', e => {

        if (sliders[e.detail]) sliders[e.detail].update();

    });

    viewer.addEventListener('joint-mouseover', e => {

        const j = document.querySelector(`li[joint-name="${e.detail}"]`);
        if (j) j.setAttribute('robot-hovered', true);

    });

    viewer.addEventListener('joint-mouseout', e => {

        const j = document.querySelector(`li[joint-name="${e.detail}"]`);
        if (j) j.removeAttribute('robot-hovered');

    });

    let originalNoAutoRecenter;
    viewer.addEventListener('manipulate-start', e => {

        const j = document.querySelector(`li[joint-name="${e.detail}"]`);
        if (j) {
            j.scrollIntoView({ block: 'nearest' });
            $window.scrollTo(0, 0);
        }

        originalNoAutoRecenter = viewer.noAutoRecenter;
        viewer.noAutoRecenter = true;

    });

    viewer.addEventListener('manipulate-end', e => {

        viewer.noAutoRecenter = originalNoAutoRecenter;

    });
    // create the sliders
    viewer.addEventListener('urdf-processed', () => {

        // æ¨¡åå è½½å®æ¯ä¹åç§»é¤å è½½å¨ç»
        removeIndexLoading();
        // åå§åæºå¨äººéç½®
        $scope.getRobotCfg('init');

        const vr = viewer.virtualRobot;

        Object
            .keys(vr.joints)

            .sort((a, b) => {
                const da = a.split(/[^\d]+/g).filter(v => !!v).pop();
                const db = b.split(/[^\d]+/g).filter(v => !!v).pop();

                if (da !== undefined && db !== undefined) {
                    const delta = parseFloat(da) - parseFloat(db);
                    if (delta !== 0) return delta;
                }

                if (a > b) return 1;
                if (b > a) return -1;
                return 0;

            })
            .map(key => vr.joints[key])
            .forEach(joint => {

                /* create li element for each joint */
                const li = document.createElement('li');
                li.style.height = "30px";
                li.innerHTML =
                    `
				<span name="joint-title" title="${joint.name}" style="display: inline-block;">${joint.name}</span>
				<input name="${joint.name}" type="range" class="custom-range multi-move" value="0" step="0.01"/>
				<input type="text" class="form-control" name="jointNum"/>
				`;

                li.setAttribute('joint-type', joint.jointType);
                li.setAttribute('joint-name', joint.name);

                sliderList.appendChild(li);
                /* end */


                // update the joint display
                const jointTitle = li.querySelector('span[name="joint-title"]');
                const slider = li.querySelector('input[type="range"]');
                const input = li.querySelector('input[name="jointNum"]');
                li.update = () => {

                    let degVal = joint.angle;

                    if (joint.jointType === 'revolute' || joint.jointType === 'continuous') {
                        degVal *= RAD2DEG;
                        degVal = degVal.toFixed(3);
                    }

                    // if (Math.abs(degVal) > 1) {
                    // 	degVal = degVal.toFixed(3);
                    // } else {
                    // 	degVal = degVal.toPrecision(2);
                    // }

                    input.value = parseFloat(degVal);
                    joints[joint.name] = input.value;
                    // directly input the value
                    slider.value = joint.angle;


                    // if (viewer.ignoreLimits || joint.jointType === 'continuous') {
                    // 	slider.min = -6.28;
                    // 	slider.max = 6.28;

                    // 	input.min = -6.28 * RAD2DEG;
                    // 	input.max = 6.28 * RAD2DEG;
                    // } else {
                    // 	// slider.min = joint.limit.lower;
                    // 	// slider.max = joint.limit.upper;

                    // 	input.min = -joint.limit.lower * RAD2DEG;
                    // 	input.max = joint.limit.lower * RAD2DEG;
                    // }
                };

                switch (joint.jointType) {

                    case 'continuous':
                    case 'prismatic':
                    case 'revolute':
                        break;
                    default:
                        li.update = () => { };
                        jointTitle.remove();
                        input.remove();
                        slider.remove();
                        li.remove();

                }

                slider.addEventListener('input', () => {
                    viewer.setVirtualAngle(joint.name, slider.value);
                    li.update();
                });

                input.addEventListener('change', () => {
                    viewer.setVirtualAngle(joint.name, input.value * DEG2RAD);
                    li.update();
                });

                li.update();

                sliders[joint.name] = li;

            });
    });

    document.addEventListener('WebComponentsReady', () => {

        viewer.loadMeshFunc = (path, manager, done) => {

            new THREE.ModelLoader(manager).load(path, res => done(res.model), null, err => done(null, err));

        };

    });

    // èææºå¨äººåæ°
    let virtualFlg = 1;       // èææºå¨äººæ¯å¦è·éå®éä½ç½®è¿è¡ï¼0-ä¸è·éï¼1-è·é
    let virtualJoints = {};   // ç®æ å³èä½ç½®ï¼èææºå¨äººä½ç½®ï¼
    let deviation = 1;        // ç®æ å³èä½ç½®åå®éå³èä½ç½®åå·®å¼

    /* é¡µé¢å è½½æ¨¡ååæ° */
    const color = "#ffffff";
    // const urdf = "./data/cobots/urdf/fr5_robot.urdf";
    $scope.getRobotCfg('rot360');
    viewer.up = "+Z";
    // viewer.urdf = urdf;
    setColor(color);
    /* é¡µé¢å è½½æ¨¡ååæ° */

    // å¨å±å è½½å¨ç»ç§»é¤
    function removeIndexLoading() {
        $("#indexLoading").addClass('ng-hide');
    }
    // å¨å±å è½½å¨ç»å è½½
    function loadIndexLoading() {
        $("#indexLoading").removeClass('ng-hide');
    }
    // æ¥åå¨ç»ç§»é¤
    $("#carshstop").click(function () {
        var mychar = document.getElementById("carshstop");
        mychar.style.display = "none";
    });

    // æ§å¶åºé¨ååæ°
    $scope.velocity = "100";
    $scope.acceleration = "180"
    $scope.pointName = "";
    $scope.bindpointName = "";
    $window.entireQueryStatus = 0;

    var apply_joint_flag = 0;
    $scope.applyJoints = function () {
        if ("1" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else if (joints.j5 <= 0.01 && joints.j5 >= -0.01) {
            toastFactory.warning(indexDynamicTags.warning_messages[1]);
        } else {
            let clacTCFCmd = {
                "cmd": 320,
                "data": joints,
            }
            dataFactory.setData(clacTCFCmd)
                .then(() => {
                    virtualFlg = 0;
                    virtualJoints = joints;
                    apply_joint_flag = 1;
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[4]);
                })
        }
    }
    document.addEventListener('320', e => {
        if (!$.isEmptyObject(JSON.parse(e.detail))) {
            let JointsCmd = {
                cmd: 201,
                data: {
                    joints: apply_joint_flag == 1 ? joints : robotJoints,
                    tcf: JSON.parse(e.detail),
                    speed: $scope.speed.toString(),
                    acc: $scope.acceleration,
                    ovl: "50"
                }
            };
            dataFactory.setData(JointsCmd).then(() => {
                if (apply_joint_flag) {
                    apply_joint_flag = 0;
                }
                if (moveToPackFlag) {
                    moveToPackFlag = 0;
                }
            }, (status) => {
                toastFactory.error(status);
            })
        }
    })


    /* ç¬å¡å°ç¹ä½ç§»å¨ */
    // ç§»å¨è¿å
    var updatedescartesFlg;
    $scope.restoreDescartesJoints = function () {
        updatedescartesFlg = 1;
    };

    // ç¬å¡å°è®¡ç®å³è
    $scope.computeJoint = function () {
        if ("1" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            let clacJointCmd = {
                "cmd": 325,
                "data": {
                    content: "TCFToJoint(" + $scope.moveDescartesJoint.j1 + "," + $scope.moveDescartesJoint.j2 + "," + $scope.moveDescartesJoint.j3 + "," + $scope.moveDescartesJoint.j4
                        + "," + $scope.moveDescartesJoint.j5 + "," + $scope.moveDescartesJoint.j6 + "," + $scope.moveDescartesTcp.x + "," + $scope.moveDescartesTcp.y
                        + "," + $scope.moveDescartesTcp.z + "," + $scope.moveDescartesTcp.rx + "," + $scope.moveDescartesTcp.ry
                        + "," + $scope.moveDescartesTcp.rz + "," + $scope.currentCoord + "," + $scope.currentWobjCoord + "," + $scope.exAxisPos[0]
                        + "," + $scope.exAxisPos[1] + "," + $scope.exAxisPos[2] + "," + $scope.exAxisPos[3] + ")",
                }
            }
            dataFactory.setData(clacJointCmd)
                .then(() => {
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[4]);
                })
        }
    }

    document.addEventListener('325', e => {
        $scope.moveDescartesJoint = JSON.parse(e.detail);
        $scope.moveDescartesJoint = {
            "j1": parseFloat($scope.moveDescartesJoint.j1).toFixed(3),
            "j2": parseFloat($scope.moveDescartesJoint.j2).toFixed(3),
            "j3": parseFloat($scope.moveDescartesJoint.j3).toFixed(3),
            "j4": parseFloat($scope.moveDescartesJoint.j4).toFixed(3),
            "j5": parseFloat($scope.moveDescartesJoint.j5).toFixed(3),
            "j6": parseFloat($scope.moveDescartesJoint.j6).toFixed(3)
        }
        for (const name in $scope.moveDescartesJoint) {
            viewer.setVirtualAngle(name, $scope.moveDescartesJoint[name] * DEG2RAD);
        }
    })

    // ç§»å¨è³è¯¥ç¹
    $scope.moveToDescartesPoint = function () {
        if ("1" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            moveJ_data["joints"] = {
                "j1": $scope.moveDescartesJoint.j1 + "",
                "j2": $scope.moveDescartesJoint.j2 + "",
                "j3": $scope.moveDescartesJoint.j3 + "",
                "j4": $scope.moveDescartesJoint.j4 + "",
                "j5": $scope.moveDescartesJoint.j5 + "",
                "j6": $scope.moveDescartesJoint.j6 + "",
            }
            moveJ_data["tcf"] = {
                "x": $scope.moveDescartesTcp.x + "",
                "y": $scope.moveDescartesTcp.y + "",
                "z": $scope.moveDescartesTcp.z + "",
                "rx": $scope.moveDescartesTcp.rx + "",
                "ry": $scope.moveDescartesTcp.ry + "",
                "rz": $scope.moveDescartesTcp.rz + ""
            };
            moveJ_data["speed"] = $scope.speed.toString();
            moveJ_data["acc"] = $scope.acceleration;
            moveJ_data["ovl"] = "50"; // 50-150
            let JointsCmd = {
                cmd: 201,
                data: moveJ_data
            };
            dataFactory.setData(JointsCmd)
                .then(() => {
                    virtualFlg = 0;
                    virtualJoints = moveJ_data["joints"];
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[5]);
                })
        }
    }
    /** ç¬å¡å°ç¹ä½ç§»å¨ */

    //åéæ¾ç¤ºå½æ°
    $scope.variableValueArr1 = ["n","m","k"];
    $scope.variableValueArr2 = [1,2,5];
    $scope.variableValueArr3 = ["str1","str2"];
    $scope.variableValueArr4 = ["socket1","socket2"];
    $scope.variableValueJson = [];

    function queryKangyangIndex(){
        if ((sessionStorage.getItem("g_kangYangCycleIndex") != null) && (sessionStorage.getItem("g_kangYangCycleIndex") != "")) {
            g_kangYangCycleIndex = JSON.parse(sessionStorage.getItem("g_kangYangCycleIndex"));
        } 
    }
    queryKangyangIndex();
    // åéæ¥è¯¢å¤çå½æ°
    function combineVar(length1, var1, var2, length2, var3, var4) {
        $scope.variableValueJson = [];
        $scope.kangyangVariableValueJson = [];
        if (length1 > 0 || length2 > 0) {
            $scope.show_Var_State = true;
            for (let i = 0; i < length1; i++) {
                $scope.variableValueJson.push({
                    name: var1[i],
                    value: parseFloat(var2[i]).toFixed(3)
                });
                if (g_kangYangCycleIndex.length > 0 && i <= g_kangYangCycleIndex.length) {
                    $scope.kangyangVariableValueJson.push({
                        name: var1[i],
                        value: parseFloat(var2[i]).toFixed(3),
                        limit: g_kangYangCycleIndex[i]
                    });
                }
            }
            for (let i = 0; i < length2; i++) {
                let varCharArr = {
                    name: var3[i],
                    value: var4[i]
                };
                $scope.variableValueJson.push(varCharArr);
            }
        }
    }

    $scope.kangyangVariableValueJson = [
        {
            name: 1,
            value: 100,
            limit: 5
        }
    ]

    // ä½¿è½/å»ä½¿è½æºå¨äººæ¨¡æçªæå¼
    $scope.openEnableRobot = function(index) {
        // è¿ç¨æ¨¡å¼ä¸æ æ³æä½ä½¿è½æé®
        if ($scope.remoteControlMode) return;
        if (index == 0) { // å»ä½¿è½æé®
            if ($scope.indexSafeStopMode == 1 && "0" != $scope.controlMode) { // å®å¨åæ­¢æ¨¡å¼ä¸ºCRè®¤è¯ï¼å¹¶ä¸æ§å¶æ¨¡å¼ä¸ä¸ºèªå¨
                toastFactory.info(indexDynamicTags.info_messages[5]); // æç¤ºä½¿è½æé®ç¦ç¨
                return;
            }
            $('#enableRobotModal').modal('show'); // è¿å¥ä½¿è½æ¨¡æçª
        } else { // ä½¿è½æé®
            $('#enableRobotModal').modal('show'); // è¿å¥å»ä½¿è½æ¨¡æçª
            // if (g_systemFlag) { // Linuxç³»ç»
            //     $('#enableRobotModal').modal('show'); // è¿å¥å»ä½¿è½æ¨¡æçª
            // } else { // QNXç³»ç»
            //     toastFactory.info(indexDynamicTags.info_messages[6]); // æç¤ºå·²ä½¿è½
            // }
        }
    };

    /** ä½¿è½æºå¨äººæä»¤ */
    $scope.indexEnableRobot = function() {
        let enableCmd = {
            cmd: 301,
            data: {
                content: "RobotEnable",
            },
        };
        dataFactory.setData(enableCmd).then(() => {
            $('#enableRobotModal').modal('hide');
        }, (status) => {
            toastFactory.error(status);
        });
    }

    //è¿è¡ç¨åº
    $scope.startProgram = function () {
        if ("0" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[2]);
        } else {
            if ("Stopped" == $scope.programStatus) {
                if ($scope.runptnboxflag) {
                    $scope.runptnboxflag = 0;
                    $scope.runProgram();
                } else {
                    //è¿è¡ç¨åºåç¨åºåçæ¹å¨,èªå¨è§¦åå¯¹åºé¡µé¢ä¿å­æé®  g_programChangeFlag  1-ç¤ºæç¨åºé¡µé¢ 2-å¾å½¢åç¼ç¨é¡µé¢
                    if (g_programChangeFlag == 1) {
                        if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('save-teach-program'));
                        }
                    } else if (g_programChangeFlag == 2) {
                        if (g_graphicalErr){
                            toastFactory.warning(indexDynamicTags.warning_messages[4] + g_graphicalErrString);
                            return;
                         }
                        if (document.getElementById('graphicalProgramming') != null && document.getElementById('graphicalProgramming') != undefined) {
                            document.getElementById('graphicalProgramming').dispatchEvent(new CustomEvent('save-graphical-program'));
                        }
                    }
                    //ç¨åºä¿å­åéè¯¯,é»æ­¢ç¨åºè¿è¡
                    if (g_programErrorFlag == 1) return;
                    $('#startProgramModal').modal('show');
                }
            } else {
                toastFactory.info(indexDynamicTags.info_messages[7]);
            };
        };
    };

    //ä¸»é¡µé¢ä¸ä¼ æä»¶åå®¹
    $scope.index_uploadProgName = function () {
        // åå°ç¨åºæ¨¡å¼ä¸æ æ³æä½è¿è¡æé®
        if ($scope.gBackgroundProgramEnableFlag) {
            toastFactory.warning(indexDynamicTags.warning_messages[27]);
            return;
        }
        // è¿ç¨æ¨¡å¼ä¸æ æ³æä½è¿è¡æé®
        if ($scope.remoteControlMode) return;
        if ($scope.stateSwitchAuth.start_stop_pause == '0') {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
            return;
        }
        if (g_programErr == 1){
            toastFactory.warning(indexDynamicTags.warning_messages[4] + g_programErrString);
            return;
        }
        if (g_graphicalErr){
            toastFactory.warning(indexDynamicTags.warning_messages[4] + g_graphicalErrString);
            return;
        }
        if (g_nodeEditorErr){
            toastFactory.warning(indexDynamicTags.warning_messages[4] + g_nodeEditorErrString);
            return;
        }
        if ("Stopped" != $scope.programStatus) {
            toastFactory.info(indexDynamicTags.info_messages[7]);
            return;
        }
        if (g_fileNameForUpload != undefined && g_fileNameForUpload != '' && g_fileNameForUpload != null) {
            // å¤æ­å½åç¨åºæ¯å¦ä¸­æ­
            if ($scope.programRunStatus.status == 1 && $scope.programRunStatus.name == g_fileNameForUpload) {
                $('#continueProgramModal').modal('show');
            } else {
                g_isRunStepOver = 0;       // 0-ç¨åºè¿è¡ï¼ç¨äº105æä»¤ç¶æåé¦å¤æ­
                $scope.sendProgramName();
            }
        } else {
            toastFactory.info(indexDynamicTags.info_messages[8]);
        };
    }

    /**
     * æå¼ç¨åºæ¶ï¼å°ç¨åºåç§°åç¨åºåå®¹åéè³åå°
     * @param {string} luaName ç¨åºåç§°
     * @param {string} luaContent ç¨åºåå®¹
     * @param {string} luaType ç¨åºç±»å
     */
    function sendLuaInfo(luaName, luaContent, luaType) {
        let sendCmd = {
            cmd: 'open_lua_file',
            data: {
                name: luaName,
                pgvalue: luaContent,
                type: $scope.gBackgroundProgramEnableFlag ? undefined : luaType
            },
        };
        dataFactory.actData(sendCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        })
    }

    /** è¿è¡æºå¨äººç¤ºæç¨åºï¼åéç¨åºåç§°ï¼ */
    $scope.sendProgramName = function() {
        let sendFileNameCmd = {
            cmd: 105,
            data: {
                name: g_fileNameForUpload
            }
        };
        dataFactory.setData(sendFileNameCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[6]);
            });
    }
    document.addEventListener('105', e => {
        if (e.detail == "1") {
            // ç¤ºæç¨åºåç§°ä¸ä¼ æååä¸ä¼ ç¨åºåå®¹
            if (g_fileDataForUpload == "") {
                toastFactory.warning(g_fileNameForUpload + indexDynamicTags.warning_messages[5]);
            } else {
                $scope.startProgram();
            };
            //è¿è¡ç¨åºåï¼æ¸é¤åæ­¥è¿è¡é«äº®ç¶æ
            soFlg = 0;
        } else {
            toastFactory.error(403, indexDynamicTags.error_messages[8]);
        };
    });

    /*ç¨åºæ¥ç»­/éæ°å¼å§(0-éæ°å¼å§ï¼1-æ¥ç»­æ§è¡) */
    $scope.isRestartProgram = function(isRestart) {
        let isRestartCmd = {
            cmd: 'program_interrupt_execute',
            data: {
                flag: isRestart,
            },
        };
        dataFactory.actData(isRestartCmd).then(() => {
            $scope.sendProgramName();
            $('#continueProgramModal').modal('hide');
            }, (status) => {
                if (isRestart == 1) {
                    toastFactory.error(status, indexDynamicTags.error_messages[61]);
                } else {
                    toastFactory.error(status, indexDynamicTags.error_messages[62]);
                }
            });
    }
    /**ç¨åºæ¥ç»­/éæ°å¼å§ */

    /** ç¤ºæç¨åºè¿è¡æä»¤ï¼101ï¼ */
    $scope.runptnboxflag = 0;
    $scope.runProgram = function () {
        // ç³»ç»å­å¨æ¥éç¦æ­¢è¿è¡ç¨åº
        if (!$scope.errorMessageTotal) {
            $('#startProgramModal').modal('hide');
            let startCmd = {
                cmd: 101,
                data: {},
            };
            dataFactory.setData(startCmd)
                .then(() => {
                    // æ¸é¤ä¸ä¸æ¬¡ç¨åºè¿è¡è½¨è¿¹
                    // if (DrawTrackFlg) {
                        clearTrack();
                    // };
                    // è¿è¡å½åç¨åºè½¨è¿¹ç»å¶
                    DrawTrackFlg = true;
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[9]);
                });
        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[26]);
        }
    }
    document.addEventListener('101', e => {
        if (e.detail == '1') {
            g_runProgramFlag = 1;
        }
    })

    /**
     * æåæ¢å¤æé®åè½
     * @param {int} type 511-æåæä»¤å¼¹çªåè½æéè±å
     * @returns 
     */
    $scope.pauseResumeProgram = function (type) {
        // åå°ç¨åºæ¨¡å¼ä¸æ æ³æä½è¿è¡æé®
        if ($scope.gBackgroundProgramEnableFlag) {
            toastFactory.warning(indexDynamicTags.warning_messages[27]);
            return;
        }
        // è¿ç¨æ¨¡å¼ä¸æ æ³æä½æåæ¢å¤æé®
        if ($scope.remoteControlMode) return;

        if ($scope.stateSwitchAuth.start_stop_pause == '0' && type != '511') {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
            return;
        }
        // ç¤ºæç¨åºï¼æºå¨äººï¼æåç¶ææ§è¡æ¢å¤ || å¤é¨è½´ï¼å¼æ­¥æ¨¡å¼ï¼3-æåå®æç¶ææ§è¡æ¢å¤
        if (("Pause" == $scope.programStatus) || ($scope.exAxisMotionStatus == 3)) {
            let resumeCmd = {
                cmd: 104,
                data: {},
            };
            dataFactory.setData(resumeCmd)
                .then(() => {
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[10]);
                });
        // ç¤ºæç¨åºï¼æºå¨äººï¼è¿å¨ç¶ææ§è¡æå || å¤é¨è½´ï¼å¼æ­¥æ¨¡å¼ï¼1-è¿å¨ä¸­ç¶ææ§è¡æå
        } else if (("Running" == $scope.programStatus) || ($scope.exAxisMotionStatus == 1)) {
            let pauseCmd = {
                cmd: 103,
                data: {},
            };
            dataFactory.setData(pauseCmd).then(() => {
                if (g_torqueMovePointFlag) {
                    g_torqueMovePointStop = true;
                }
            }, (status) => {
                g_torqueMovePointStop = false;
                toastFactory.error(status, indexDynamicTags.error_messages[11]);
            });
        }
    };

    /** åæ­¢ç¤ºæç¨åºè¿è¡åè½ */
    $scope.stopProgram = function () {
        // åå°ç¨åºæ¨¡å¼ä¸æ æ³æä½è¿è¡æé®
        if ($scope.gBackgroundProgramEnableFlag) {
            toastFactory.warning(indexDynamicTags.warning_messages[27]);
            return;
        }
        // è¿ç¨æ¨¡å¼ä¸æ æ³æä½åæ­¢è¿è¡æé®
        if ($scope.remoteControlMode) return;

        if ($scope.stateSwitchAuth.start_stop_pause == '0') {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
            return;
        }
        let stopCmd = {
            cmd: 102,
            data: {},
        };
        dataFactory.setData(stopCmd).then(() => {
            if (g_torqueMovePointFlag) {
                g_torqueMovePointStop = true;
            }
        }, (status) => {
            g_torqueMovePointStop = false;
            toastFactory.error(status, indexDynamicTags.error_messages[12]);
        });
    };

    /**éåºæ°ç¼¸æ¢å¤ */
    $scope.closeCylinderModal = function() {
        $("#PauseFunction2Modal").modal('hide');
    }

    /**çæ¥ä¸­æ­åæ¢å¤ */
    $scope.setWeldingStartReWeld= function(e) {
        e.stopPropagation();
        let weldingStartReWeldCmd = {
            cmd: 806,
            data: {
                content: "WeldingStartReWeldAfterBreakOff()"
            }
        }
        dataFactory.setData(weldingStartReWeldCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    /**çæ¥ä¸­æ­åéåºçæ¥ç¨åº */
    $scope.setWeldingAbortWeld= function() {
        let weldingAbortWeldCmd = {
            cmd: 807,
            data: {
                content: "WeldingAbortWeldAfterBreakOff()"
            }
        }
        dataFactory.setData(weldingAbortWeldCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /**UDPå¼å¸¸æ­å¼åå³é­éè®¯ */
    $scope.unloadExtAxisModbusUDPDriver = function () {
        let setExtAxisUnloadModbusUDPDriverCmd = {
            cmd: 908,
            data: {
                content: "ExtDevUDPClientComClose()",
            }
        };
        dataFactory.setData(setExtAxisUnloadModbusUDPDriverCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /**UDPå¼å¸¸æ­å¼åæ¢å¤è¿æ¥ */
    $scope.restoreCommunicateConnect = function () {
        let setExtAxisUnloadModbusTCPDriverCmd = {
            cmd: 907,
            data: {
                content: "ExtDevUDPClientComReset()",
            }
        };
        dataFactory.setData(setExtAxisUnloadModbusTCPDriverCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /**
     * æ«ç«¯LUAæä»¶å¼å¸¸éè¯¯æ¢å¤
     * @param {int} enable 0-ä¸æ¢å¤ 1-æ¢å¤
     */
    $scope.setRecoverAxleLuaErr = function (enable) {
        let setCmd = {
            cmd: 949,
            data: {
                content: "SetRecoverAxleLuaErr(" + enable + ")",
            }
        };
        dataFactory.setData(setCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /**
     * è®¾ç½®æºå¨äººå®å¨åæ­¢ç¡®è®¤å®å¨éåº¦ç§»å¨
     */
    $scope.setSafetyStopMoveAscertain = function () {
        let setCmd = {
            cmd: 1324,
            data: {
                content: "SetSafetyStopMoveAscertain()",
            }
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    //åæ­¥æ§è¡å¦ä¸æ¡æä»¤æ¸é¤ä¸ä¸æ¡æä»¤è½¨è¿¹
    document.addEventListener('clearTrack_1001', e => {
        clearTrack();
    })

    /**
     * ç¢°æåæ¢å¤åä¼ æå¨è¾å©æå¨
     * @param {int} enable 0-å³é­ 1-æ¢å¤
     */
    $scope.enableForceDargCollision = function(enable) {
        let setEnableCmd = {
            cmd: 1216,
            data: {
                content: `ForceSensorRestartStop(${enable})`
            }
        };
        dataFactory.setData(setEnableCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
        });
    };
    document.addEventListener('1216', () => {
        $scope.resetAllError();
        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('collisionDetectionChanged', {bubbles: true, cancelable: true, composed: true }));
    })

    /* è½¨è¿¹ç»å¶ */
    // å¼å§è¿è¡è½¨è¿¹ç»å¶
    function startDrawTrack(x, y, z) {
        viewer.drawTrack(x, y, z);
    };

    // åæ­¢è¿è¡è½¨è¿¹ç»å¶
    function clearTrack() {
        viewer.clearTrack();
    };

    // è½¨è¿¹ç»å¶å¼å³
    $scope.controlTrackCS = function () {
        $scope.controlTrack = !$scope.controlTrack;
        if ($scope.controlTrack) {
            DrawTrackFlg = true;
        } else {
            DrawTrackFlg = false;
            clearTrack()
        };
    };
    /* ./è½¨è¿¹ç»å¶ */

    // å³èéä½ç¯æ¾ç¤ºæ§å¶å¼å³
    $scope.controlJointRing = function () {
        let setCmd = {
            cmd: 1215,
            data: {
                content: `SetLimitRingVisible(${1^$scope.currJointRingONOFF})`,
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    };

    // ç«æ¹ä½å¹²æ¶åºæ¾ç¤ºæ§å¶å¼å³
    $scope.controlCubeInterference = function () {
        /* test */
        if (g_testCode) {
            interfereCubeData = testDataService.testInterfereCubeData;
        }
        /* ./test */
        if (interfereCubeData.some(item => item.status)) { // åè½å¯ç¨ï¼æ­£å¸¸æ¾ç¤ºåæ¸é¤
            $scope.currCubeInterfereONOFF = !$scope.currCubeInterfereONOFF;
            if ($scope.currCubeInterfereONOFF) {
                viewer.createCubeInterference(interfereCubeData);
            } else {
                viewer.removeCubeInterference();
            }
        } else { // åè½å³é­ï¼æç¤ºåå¯ç¨ç«æ¹ä½å¹²æ¶åºåè½
            toastFactory.info(indexDynamicTags.info_messages[43]);
        }
    };

    // å®å¨å¢å¹²æ¶åºæ¾ç¤ºæ§å¶å¼å³
    $scope.controlSafetyPlane = function () {
        if (interferePlaneSetFlag) {
            $scope.currSafetyPlaneONOFF = !$scope.currSafetyPlaneONOFF;
            if ($scope.currSafetyPlaneONOFF) {
                viewer.createAllPlanes(planesParams);
            } else {
                viewer.destroyPlaneInterference();
            }
        } else {
            toastFactory.info(indexDynamicTags.info_messages[44]);
        }
        // test
        if (g_testCode) {
            let planeParams = [{
                enable: 1,
                A: 0,
                B: 0.1,
                C: 0,
                D: -0.5,
                planeSize: 3
            },{
                enable: 1,
                A: 0.1,
                B: 0,
                C: 0,
                D: -0.5,
                planeSize: 3
            }];
            $scope.currSafetyPlaneONOFF = !$scope.currSafetyPlaneONOFF;
            if ($scope.currSafetyPlaneONOFF) {
                viewer.createAllPlanes(planeParams);
            } else {
                viewer.destroyPlaneInterference();
            };
        }
    };

    // åºåæ ç³»ä¸ç»´å±ç¤ºæ§å¶å¼å³
    $scope.controlBaseCS = function () {
        $scope.controlBase = !$scope.controlBase;
        if ($scope.controlBase) {
            viewer.displayCoordinateSystem(0);
        } else {
            viewer.clearCoordinateSystem(0);
        };
    };

    // æ«ç«¯/å·¥å·åæ ç³»ä¸ç»´å±ç¤ºæ§å¶å¼å³
    $scope.controlToolCS = function () {
        $scope.controlTool = !$scope.controlTool;
        if ($scope.controlTool) {
            // å¨ç¶æåé¦ä¸­è¿è¡åå»º
        } else {
            viewer.clearCoordinateSystem(1);
        };
    };

    //å®æ¶å¨è·åå·¥å·/å·¥ä»¶/è´è½½ç¸å³ä¿¡æ¯
    function repeatRefreshData() {
        index_getToolCoordData();
    }

    //è·åå·¥ä»¶åæ ç³»æ°æ®
    function getWObjCoordData() {
        let getCmd = {
            cmd: "get_wobj_tool_cdsystem",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                $scope.wobjCoordeDataDisplay = JSON.parse(JSON.stringify(data));
                let wobjCoordeData = JSON.parse(JSON.stringify(data));
                let wobjCoordeKeys = Object.keys(wobjCoordeData);
                let wobjArray = [];
                wobjCoordeKeys.forEach(item => {
                    wobjArray.push(wobjCoordeData[item]);
                });
                $scope.wobjCoordeNewData = wobjArray;
                //æ´æ°å·¥å·åæ ç³»æ°æ®
                if ($scope.selectWobjCoordeDataDisplay) {
                    $scope.selectWobjCoordeDataDisplay = $scope.wobjCoordeNewData[$scope.selectWobjCoordeDataDisplay.id];
                }
                enableWorkpieceControl = 1;
                $scope.controlWorkpieceCSOnorOff = "";
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[13]);
                $scope.controlWorkpieceCSOnorOff = "N/A";
            });
    };
    // å¨è®¾ç½®æ°çå·¥ä»¶åæ ç³»åæ´æ°æ°æ®
    document.addEventListener("update_wobjCoord_data", e => {
        getWObjCoordData();
    })

    // æ¾ç¤ºå·¥ä»¶åè¡¨ï¼åæ¢åºç¨
    $scope.openApplyWobj = function() {
        $scope.showApplyWobj = !$scope.showApplyWobj;
        $(document).ready(function () {
            $('#apply-wobj').focus();
        })
    }

    // åæ¢åºç¨å½åå·¥ä»¶åæ ç³»æ°æ®
    $scope.applyCurrentWobj = function(selectWobj) {
        if (selectWobj) {
            const setWObjCoordCmd = {
                cmd: 251,
                data: {
                    content: "SetWObjCoord(" + selectWobj.id + "," + selectWobj.x + "," + selectWobj.y + ","
                        + selectWobj.z + "," + selectWobj.rx + "," + selectWobj.ry + "," + selectWobj.rz + ","
                        + selectWobj.reference + ")",
                },
            };
            dataFactory.setData(setWObjCoordCmd).then(() => {}, (status) => {
                toastFactory.error(status);
            });
        }
    }

    // å·¥ä»¶åæ ç³»ä¸ç»´å±ç¤ºæ§å¶å¼å³
    $scope.controlWorkpieceCS = function () {
        if (enableWorkpieceControl) {
            $scope.controlWorkpiece = !$scope.controlWorkpiece;
            if ($scope.controlWorkpiece) {
                // å¨ç¶æåé¦ä¸­è¿è¡åå»º
                forceRenderingWorkpieceCS = 1;
            } else {
                viewer.clearCoordinateSystem(2);
            };
            
        }
    };

    // è·åå¤é¨è½´å·¥å·åæ ç³»æ°æ®
    function getEAxisCoordData() {
        let getCmd = {
            cmd: "get_exaxis_cdsystem",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                $scope.EAxisCoordeData_Display = JSON.parse(JSON.stringify(data));
                enableExAxisControl = 1;
                $scope.controlExAxisCSOnorOff = "";
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[14]);
                $scope.controlExAxisCSOnorOff = "N/A";
            });
    };
    // å¨è®¾ç½®äºæ°çæ©å±è½´åæ ç³»åæ´æ°æ°æ®
    document.addEventListener("update_eaxisCoord_data", e => {
        getEAxisCoordData();
    })

    /**
     * è·åå½ååºç¨æ«ç«¯è´è½½åç§°ï¼nameï¼
     * @param {string} loadId å½ååºç¨æ«ç«¯è´è½½Id
     */
    function getCurrEndLoadName(loadId) {
        let getLoadCmd = {
            cmd: 'get_load'
        }
        dataFactory.getData(getLoadCmd).then((data) => {
            $scope.indexTeachPendantData.loadList = data;
            if (data.find(item => item.id == loadId)) {
                $scope.currentLoad.name = data.find(item => item.id == loadId).name;
                $scope.indexTeachPendantData.selectLoad = data.find(item => item.id == loadId);
            }
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * åºç¨æ«ç«¯è´è½½
     * @param {Object} selectLoad æ«ç«¯è´è½½ä¿¡æ¯ï¼id--è´è½½ç¼å·ãname--åç§°ãweight--è´è½½ééãx--è´¨å¿åæ Xãy--è´¨å¿åæ Yãz--è´¨å¿åæ Z
     */
    $scope.applyEndLoad = function(selectLoad) {
        if (selectLoad == "" || selectLoad == null || selectLoad == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[50]);
        } else if (selectLoad.weight == "" || selectLoad.weight == null || selectLoad.weight == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[51]);
        } else if (selectLoad.x == "" || selectLoad.x == null || selectLoad.x == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[52]);
        } else if (selectLoad.y == "" || selectLoad.y == null || selectLoad.y == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[53]);
        } else if (selectLoad.z == "" || selectLoad.z == null || selectLoad.z == undefined) {
            toastFactory.info(indexDynamicTags.info_messages[54]);
        } else {
            let setLoadWeightCmd = {
                cmd: 'modify_load',
                data: selectLoad
            };
            dataFactory.actData(setLoadWeightCmd).then(() => {}, (status) => {
                toastFactory.error(status);
            });
        }
    }

    // æ©å±è½´åæ ç³»ä¸ç»´å±ç¤ºæ§å¶å¼å³
    $scope.controlExAxisCS = function () {
        if (enableExAxisControl) {
            $scope.controlExAxis = !$scope.controlExAxis;
            if ($scope.controlExAxis) {
                // å¨ç¶æåé¦ä¸­è¿è¡åå»º
                forceRenderingExAxisCS = 1;
            } else {
                viewer.clearCoordinateSystem(3);
            };
        }
    };

    // å¯¼å¥æºå¨äººå·¥å·æ¨¡å
    $scope.importToolModel = function() {
        // æå¼æ¨¡æçª
        $('#importToolModal').modal('show');
    };

    // ä¸ä¼ å·¥å·æ¨¡åæä»¶
    $scope.submitToolModel = function(fileData) {
        let formData = new FormData();
        if (fileData) {
            formData.append('file', fileData);
            dataFactory.uploadData(formData).then((data) => {
                if (typeof(data) != "object") {
                    toastFactory.success(indexDynamicTags.success_messages[1] + fileData.name);
                    $("#importToolModal").modal('hide');
                    viewer.tool = data;
                }
                $scope.submitTool = true;
            }, (status) => {
                $scope.submitTool = false;
                toastFactory.error(status, indexDynamicTags.error_messages[15]);
            });
        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[7]);
        }
    };

    /**è·åæ§å¶å¨ä»ç«åè®®*/
    function getSlaveProtocol() {
        let cmdContent = {
            cmd: "get_slave_protocol"
        };
        dataFactory.getData(cmdContent).then((data) => {
            $scope.slaveProtocolParam.disabled = ~~data.slave_protocol;
            if ($scope.slaveProtocolParam.disabled) {
                $scope.slaveProtocolParam.protocol = $scope.controllerProtocolModeData.filter(item => item.id == $scope.slaveProtocolParam.disabled)[0];
            }
            $scope.slaveProtocolParam.auto = $scope.whetherData.filter(item => item.id == ~~data.auto_start_flag)[0];
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * å¯å¨æ§å¶å¨ä»ç«åè®®åºç¨
     * @param {int} protocolId  // 1-profinetè¥¿é¨å­ã2-cc-linkæ³å¥¥èªå®ä¹ã3-ethercatæ³å¥¥èªå®ä¹ã4-ethernet/IPæ³å¥¥èªå®ä¹
     * @param {int} startMode  // æ¯å¦èªå¯å¨ï¼0-å¦ã1-æ¯
     */
    $scope.startSlaveProtocol = function(protocolId, startMode) {
        let startSlaveCmd = {
            cmd: "start_slave_protocol",
            data: {
                slave_protocol: protocolId,
                auto_start_flag: Number(startMode)
            }
        };
        dataFactory.actData(startSlaveCmd).then(() => {
            toastFactory.info(indexDynamicTags.info_messages[40]);
            getSlaveProtocol();
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * å¸è½½æ§å¶å¨ä»ç«åè®®åºç¨
     * @param {int} protocolId  // 1-profinetè¥¿é¨å­ã2-cc-linkæ³å¥¥èªå®ä¹ã3-ethercatæ³å¥¥èªå®ä¹ã4-ethernet/IPæ³å¥¥èªå®ä¹
     */
    $scope.unloadSlaveProtocol = function(protocolId) {
        let unloadSlaveCmd = {
            cmd: "uninstall_slave_protocol",
            data: {
                slave_protocol: protocolId
            }
        };
        dataFactory.actData(unloadSlaveCmd).then(() => {
            getSlaveProtocol();
        }, (status) => {
            toastFactory.error(status);
        });
    };

    /**å¯¼åºæ§å¶å¨ä»ç«åè®®æ¥å¿ */
    $scope.exportControllerSlaveLog = function () {
        dataFactory.downloadData("interpret_log.tar.gz");
    };

    /* æ¸ç©ºéè¯¯ä¿¡æ¯åè¡¨ */
    $scope.clearErrorWarningInfo = function () {
        $scope.errorWarningInfoList = [];
    }
    /**
     * éè¯¯æ¥æ¶æ°æ®
     * @param {*} errordata éè¯¯æ°æ®
     * @param {*} infodata æç¤ºä¿¡æ¯
     * @param {*} time éè¯¯æ¶é´
     */
    $scope.showTotalTip = false;
    function creatErrorList(errordata, infodata, time) {
        $scope.errorPrefix = indexDynamicTags.info_messages[9];
        $scope.alarmPrefix = indexDynamicTags.info_messages[10];
        if (errordata != null) {
            $scope.errorMessageArray = errordata;
            for (let i = 0; i < $scope.errorMessageArray.length; i++) {
                $scope.errorMessageArray[i] = $scope.errorPrefix + $scope.errorMessageArray[i]
            }
        }
        if (infodata != null) {
            $scope.infoMessageArray = infodata;
            for (let j = 0; j < $scope.infoMessageArray.length; j++) {
                $scope.infoMessageArray[j] = $scope.alarmPrefix + $scope.infoMessageArray[j]
            }
        }
        $scope.errorMessageTotal = $scope.errorMessageArray.length + $scope.infoMessageArray.length;
        if ($scope.errorMessageTotal != 0) {
            $scope.showTotalTip = true;
            $(".frbaojingtishi").addClass('frfont-danger');
            new bootstrap.Dropdown(document.getElementById('errorlist')).show();
        } else {
            $scope.showTotalTip = false;
            $(".frbaojingtishi").removeClass('frfont-danger');
            new bootstrap.Dropdown(document.getElementById('errorlist')).hide();
        }
        
        // åå»ºè¿ç¨æ¨¡å¼ç¶æé¡µé¢éè¯¯åè¡¨
        let errorList = [];
        if (errordata != null) {
            errordata.forEach(errorInfo => {
                let item = {
                    time: time,
                    error: errorInfo
                };
                errorList.push(item);
            });
        }
        if (infodata != null) {
            infodata.forEach(errorInfo => {
                let item2 = {
                    time: time,
                    error: errorInfo
                };
                errorList.push(item2);
            });
        }
        $scope.errorWarningInfoList = errorList;
    }

    document.addEventListener('changeGlobalSpeed', () => {
        $scope.setRobotSpeed(40);
    });

    /**
     * éåº¦è®¾ç½®åºç¨ä¸åæä»¤å½æ°
     * @param {string} speed æºå¨äººå¨å±éåº¦ç¾åæ¯
     * @returns 
     */
    $scope.setRobotSpeed = function (speed) {
        if (typeof speed == 'number') {
            speed = String(speed);
        }
        if (!speed) {
            speed = $("#index_speed")[0].value;
            $scope.speed = Number(speed);
        }
        if ($scope.stateSwitchAuth.speed_scaling_config !='1') {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
            return;
        }
        if ("1" == $scope.controlMode && $scope.indexSafeStopMode == 1) {
            if (speed > 8) {
                //æå¨é«éæç¤º
                $('#amnuslhighspeed').modal('show');
                return;
            }
        }
        if (speed == "" || speed == null) {
            toastFactory.info(indexDynamicTags.info_messages[11]);
        } else {
            var speedString = "SetSpeed(" + speed + ")";
            let setSpeedCmd = {
                cmd: 206,
                data: {
                    content: speedString,
                },
            };
            dataFactory.setData(setSpeedCmd)
                .then(() => {
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[16]);
                });
        }
    }

    /** æ»åæ¹åå¨å±éåº¦ */
    $scope.rangeChangeSpeed = function () {
        $("#index_speed")[0].value = $scope.speed;
    }

    /**
     * å¨å±éåº¦æä½
     * @param {int} type 0-åï¼1-å¢
     */
    $scope.actSpeed = function (type) {
        $scope.speed = Number($scope.speed);
        switch (type) {
            case 0:
                if ($scope.speed > 0) {
                    $scope.speed -= 1;
                }
                break;
            case 1:
                if ($scope.speed < 100) {
                    $scope.speed += 1;
                }
                break;
            default:
                break;
        }
        $("#index_speed")[0].value = $scope.speed;
    }
    // é»æ­¢speedActåºååç¹å»äºä»¶ç»§ç»­ä¼ æ­
    document.getElementById('speedAct').addEventListener('click', e => {
        e.stopPropagation();
    })

    /**è·å"æå¨åèªå¨åéåº¦èªå¨ä¸º1%"åè½æ¯å¦å¼å¯ */
    function getModeSwitchSpeedConfig() {
        const getSpeedCmd = {
            cmd: 751,
            data: {
                content: `GetCustSpeedManualToAuto()`
            }
        }
        dataFactory.setData(getSpeedCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
        });
    }
    document.addEventListener('751', e => {
        if (e && e.detail) {
            $scope.vitesseGlobale = JSON.parse(e.detail).status;
            $scope.globalSpeed = JSON.parse(e.detail).speed.split('.')[0];
        } else {
            toastFactory.error(403, indexDynamicTags.error_messages[56]);
        }
    });
    
    /**
     * è·ååæ°èå´éç½®
     * @param {string} type authorityIDç±»å
     */
    function getRobotParamsRange(type) { 
        let getRobotParamsRangeCmd = {
            cmd: "get_robot_params_range",
            data: {
                auth_id: type
            }
        };
        dataFactory.getData(getRobotParamsRangeCmd)
            .then((data) => {
                //å¦æåæ°èå´éç½®ä¸­ç®¡çååæ°èå´éç½®ä¸ºç©ºæé¨åä¸ºç©ºåä½¿ç¨ä¸ä¸çº§è¶çº§ç®¡çåéç½®
                if (!$.isEmptyObject(data)) {
                    $scope.robotParamsRangeData = data;
                } else {
                    getRobotParamsRange('0');
                }  
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[57]);
                /* test */
                if (g_testCode) {
                    $scope.robotParamsRangeData = {
                        io_filtering_ctrl_di: [0, 200],
                        io_filtering_tool_di: [0, 199],
                        io_filtering_ctrl_ai0: [0, 198],
                        io_filtering_ctrl_ai1: [0, 197],
                        io_filtering_tool_ai: [0, 196],
                        io_filtering_box_di: [0, 195],
                        io_filtering_extended_di: [0, 194],
                        io_filtering_extended_ai0: [0, 193],
                        io_filtering_extended_ai1: [0, 192],
                        io_filtering_extended_ai2: [0, 191],
                        io_filtering_extended_ai3: [0, 190],
                        io_filtering_smart_di: [0, 189],
                    }
                }
                /* ./test */
            });
    }

    /**éç½®"æå¨åèªå¨åéåº¦èªå¨ä¸º1%"åè½æ¯å¦å¼å¯ */
    $scope.setModeSwitchSpeed = function() {
        if ($scope.stateSwitchAuth.manual_auto_switch !='1') {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
            return;
        }
        $scope.globalSpeed = $('#global-speed')[0].value;
        if (!$scope.globalSpeed) {
            toastFactory.info(indexDynamicTags.info_messages[33]);
            return;
        }
        const setSpeedParams = {
            cmd: 750,
            data: {
                content: `SetCustSpeedManualToAuto(${Number($scope.vitesseGlobale)},${Number($scope.globalSpeed)})`
            }
        }
        dataFactory.setData(setSpeedParams).then(() => {
        }, (status) => {
            toastFactory.error(status);
        });
    }
    document.addEventListener('750', e => {
        if (e.detail == '1') {
            if ($scope.vitesseGlobale == '1') {
                toastFactory.success(indexDynamicTags.success_messages[13]);
            } else {
                toastFactory.success(indexDynamicTags.success_messages[14]);
            }
        } else {
            if ($scope.vitesseGlobale == '1') {
                toastFactory.error(403, indexDynamicTags.error_messages[55]);
            } else {
                toastFactory.error(403, indexDynamicTags.error_messages[58]);
            }
            getModeSwitchSpeedConfig();
        }
    });

    //åæ¢æºå¨äººæ¨¡å¼
    function setMode(modecode) {
        let modeCmd = {};
        modeCmd.cmd = 303;
        modeCmd.data = { mode: modecode }
        dataFactory.setData(modeCmd)
            .then(() => {
                if (modecode == '0' && $scope.vitesseGlobale == '1') {
                    $scope.setRobotSpeed($scope.globalSpeed);
                }
                sessionStorage.setItem('controlMode', JSON.stringify($scope.controlMode));
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[18]);
                /* test */
                if (g_testCode) {
                    if ($scope.controlMode == 0) {
                        $scope.controlMode = 1;
                    } else {
                        $scope.controlMode = 0;
                    }
                    sessionStorage.setItem('controlMode', JSON.stringify($scope.controlMode));
                }
                /* ./test */
            })
    }

    /**
     * ç´æ¥åæ¢æºå¨äººæ¨¡å¼
     * @param {int} modeCode æ¨¡å¼ä»£ç [0-èªå¨,1-æå¨,2-æå¨]
     */
    $scope.switchRobotModeDirectly = function (modeCode) {
        switch (modeCode) {
            case 0:
                setMode($scope.modeArray[0].mode_code);
                break;
            case 1:
                setMode($scope.modeArray[1].mode_code);
                break;
            case 2:
                setMode($scope.modeArray[2].mode_code);
                break;
            default:
                break;
        }
    }

    //åæ¢æºå¨äººæ¨¡å¼
    $scope.modeSwitch = function () {
        if ($scope.stateSwitchAuth.manual_auto_switch =='1') {
            if ($scope.controlMode) {
                setMode($scope.modeArray[0].mode_code);
            } else {
                setMode($scope.modeArray[1].mode_code);
            }
        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
        }
    }

    /**
     * è®¾ç½®ç³»ç»ç¶æé¡µé¢æ å¿ä½
     * @param {number} statusFlag 0-ä¸è¿å¥ç¶æé¡µé¢ï¼1-æ­ç©ç¶æé¡µé¢ï¼2-åº·å»ç³»ç»ç¶æé¡µé¢ï¼3-ç åç¶æé¡µé¢ï¼
     */
    function setStatusPageFlag(statusFlag) {
        let cmdContent = {
            cmd: "set_status_flag",
            data: {
                page_flag: statusFlag
            }
        };
        dataFactory.actData(cmdContent).then(() => {
            getStatusPageFlag();
            
        }, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * åæ¢æºå¨äººæ¬å°/è¿ç¨æ¨¡å¼
     * @param {int} modeValue 0-æ¬å°æ¨¡å¼ï¼1âè¿ç¨æ¨¡å¼
     */
    let repeatFlag; // è¿ç¨æ¨¡å¼å®æ¶å¨æ å¿
    $scope.remoteControlSwitch = function(modeValue) {
        /* test */
        if (g_testCode) {
            $scope.halfBothView();
            $('#vRobot-view').css('z-index', 1048);
            $('#remoteControlStatusPage').show();
            $scope.remoteControlMode = modeValue;
        }
        /* ./test */
        if ("Drag" === $scope.programStatus) {
            toastFactory.info(indexDynamicTags.info_messages[38]);
            return;
        }
        if ($scope.stateSwitchAuth.remote_control_switch =='1') {
            let setRemoteCmd = {
                cmd: 813,
                data: {
                    content: "SetRobotFCIMode(" + modeValue + ")",
                },
            };
            dataFactory.setData(setRemoteCmd).then(() => {
                $scope.remoteControlMode = modeValue;
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[60]);
            })
        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
        }
    }
    document.addEventListener("813", e => {
        if (e.detail == '1') {
            // åæ¢è¿ç¨æ¨¡å¼æ¶ï¼è®¾ç½®è¿ç¨æ¨¡å¼ä¸æ«ç«¯ç¯è²ãéåºè¿ç¨æ¨¡å¼ï¼ä¸åæå¨åæ¢æé®ï¼åæ¢ææèªå¨æ¨¡å¼ä¸æ«ç«¯ç¯è²ã
            if ($scope.remoteControlMode) {
                setStatusPageFlag(0);
                setRciAxleLedColour();
                getSlaveProtocol();
            } else {
                $scope.modeSwitch();
            }
        }
    });

    /** è®¾ç½®è¿ç¨æ¨¡å¼ä¸æ«ç«¯ç¯è²ï¼é»è®¤é»è²å¸¸äº® */
    function setRciAxleLedColour() {
        let cmdContent = {
            cmd: 930,
            data: {
                content: "RCISetAxleLEDColour()"
            }
        };
        dataFactory.setData(cmdContent).then(() => {
            
        }, (status) => {
            toastFactory.error(status);
        });
    }

    //åæ¢æå¨æ¨¡å¼
    $scope.dragModeSwitch = function () {
        if ($scope.stateSwitchAuth.drag_switch =='1') {
            if ($scope.controlMode == "0") {
                toastFactory.warning(indexDynamicTags.warning_messages[0]);
                return;
            }
            if ($scope.programStatus === "Drag") {
                $scope.setDragMode(0);
            } else {
                $scope.setDragMode(1);
            }
        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[6]);
        }
    }

    /**
     * åæ¢æå¨æ¨¡å¼
     * @param {*} dragcode 0-ä¸å¯æå¨ã1-æå¨æ¨¡å¼
     */
    $scope.setDragMode = function(dragcode) {
        let setDragCmd = {
            cmd: 333,
            data: {
                content: "DragTeachSwitch(" + dragcode + ")",
            },
        };
        dataFactory.setData(setDragCmd).then(() => {
            $('#teachPendantDragModal').modal('hide');
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[19]);
        })
    }


    $scope.confirmTeachPendantDrag = function() {
        if ($scope.controlMode == 1) {
            // å¦ææ¯æå¨æ¨¡å¼ç´æ¥ä¸ååæ¢æå¨çæä»¤
            $scope.setDragMode(1);
        } else {
            // å¦ææ¯èªå¨æ¨¡å¼ååæ¢ä¸ºæå¨åä¸ååæ¢æå¨çæä»¤
            const modeCmd = {
                cmd: 303,
                data: { 
                    mode: '1'
                }
            };
            dataFactory.setData(modeCmd).then(() => {
                $scope.indexTeachPendantData.isManual = true;
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[18]);
            })
        }
    }

    //æ¸é¤æ§å¶å¨æ¥é
    $scope.resetAllError = function () {
        let resetAllErrorCmd = {
            cmd: 107,
            data: {
                content: "ResetAllError()",
            },
        };
        dataFactory.setData(resetAllErrorCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[20]);
            })
    }

    function dispatchSavePoints() {
        if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('savepoints', { bubbles: true, cancelable: true, composed: true }));
        } else if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
            document.getElementById('process').dispatchEvent(new CustomEvent('savepoints', { bubbles: true, cancelable: true, composed: true }));
        } else if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
            document.getElementById('programTeach').dispatchEvent(new CustomEvent('savepoints', { bubbles: true, cancelable: true, composed: true }));
        } else if (document.getElementById('blocklyDiv') != null && document.getElementById('blocklyDiv') != undefined) {
            document.getElementById('blocklyDiv').dispatchEvent(new CustomEvent('savepoints', { bubbles: true, cancelable: true, composed: true }));
        }
    }

    //æ£æ¥ç¤ºæç¹æ¯å¦å·²å­å¨
    $scope.checkPoint = function () {
        if ($scope.recordPointsMode == '1') {
            // å½åè®°å½ç¹
            $scope.pointName = document.getElementById("savePoint").value;
            if (g_tpPrefix != "") {
                $scope.bindpointName = g_tpPrefix + $scope.pointName;
            } else {
                $scope.bindpointName = $scope.pointName;
            }
            // ç³»ç»ç¹ä½ä¸æ¯æç¹ä½è¦ç
            if ($scope.bindpointName == 'seamPos' || $scope.bindpointName == 'CurrentPos') {
                toastFactory.info($scope.bindpointName + indexDynamicTags.info_messages[49]);
                return;
            }
        } else {
            // å¿«éè®°å½ç¹
            $scope.bindpointName = '';
        }
        let checkPointCmd = {
            cmd: "get_checkpoint",
            data: {
                name: $scope.bindpointName
            }
        }
        dataFactory.getData(checkPointCmd)
            .then((data) => {
                if ($scope.recordPointsMode == '1') {
                    if (~~data.result) {
                        $scope.checkGlobalCoverPoint = 1;
                        $('#pointExitedModal').modal('show');
                    } else {
                        $scope.checkGlobalCoverPoint = 0;
                        $scope.savePoint();
                    }
                } else {
                    $scope.quickRecordPointsName = data.name;
                    $scope.savePoint($scope.quickRecordPointsName);
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[21]);
            })
    }

    /**
     * ä¿å­ç¤ºæç¹
     * @param {string} name ç¤ºæç¹åç§°
     */
    $scope.savePoint = function (name) {
        if (name != undefined) {
            $scope.bindpointName = name;
        }
        if ($scope.bindpointName.trim().length == 0 && $scope.recordPointsMode == '1') {
            toastFactory.info(indexDynamicTags.info_messages[12]);
        } else if (($scope.controlMode != "1")) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            // æ´æ°ç¤ºæç¨åºæ¶å¼¹åºLoading
            $('#pageLoading').css("display", "block");
            dataFactory.savePoint($scope.bindpointName, $scope.checkGlobalCoverPoint).then(() => {
                    if ($scope.recordPointsMode == '1') {
                        $scope.pointName = "";
                        $('#pointExitedModal').modal('hide');
                        toastFactory.success(indexDynamicTags.success_messages[2]);
                    } else {
                        $scope.quickRecordPointsState = 1;
                    }
                    dispatchSavePoints();
                    $('#pageLoading').css("display", "none");
                }, (status) => {
                    if ($scope.recordPointsMode == '0') {
                        $scope.quickRecordPointsState = 0;
                    }
                    $('#pageLoading').css("display", "none");
                    toastFactory.error(status, indexDynamicTags.error_messages[22]);
                });
        }
    }

    /** ç åè®¾ç½®å·¥ä»¶æåç¹äºä»¶çå¬ */
    document.addEventListener("set-palletizing-grip-point", e => {
        document.getElementById("savePoint").value = e.detail;
        $scope.checkPoint();
    });

    /** ç åè®¾ç½®å·¥ä½è¿æ¸¡ç¹äºä»¶çå¬ */
    document.addEventListener("set-palletizing-transition-point", e => {
        document.getElementById("savePoint").value = e.detail;
        $scope.checkPoint();
    });


    //ä¼ æå¨æ£æ¥ç¤ºæç¹æ¯å¦å·²å­å¨
    $scope.checkLaserPoint = function (index) {
        $scope.pointLaserName = document.getElementById("laserPoint").value;
        if (0 == $scope.pointLaserName.trim().length) {
            toastFactory.info(indexDynamicTags.info_messages[12]);
            return;
        }else if (null == $scope.index_selectedSensorCoorde) {
            toastFactory.info(indexDynamicTags.info_messages[13]);
            return;
        }
        let checkPointCmd = {
            cmd: "get_checkpoint",
            data: {
                name: $scope.pointLaserName
            }
        }
        dataFactory.getData(checkPointCmd)
            .then((data) => {
                if (~~data.result) {
                    $('#LpointExitedModal').modal('show');
                } else {
                    $scope.setLaserRecord();
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[23]);
            })
    }

    //åæ ç³»æ°æ®ä¿çä¸ä½å°æ°
    function index_Screen_Sensor(data) {
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

    // è·åå·¥å·åæ ç³»æ°æ®
    function index_getToolCoordData() {
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.index_ToolCoordeData = JSON.parse(JSON.stringify(data));
            $scope.indexToolCoordeTotal = JSON.parse(JSON.stringify(data)).length;
            index_Screen_Sensor(data);
            $scope.index_SensorCoordeData = JSON.parse(JSON.stringify(data));
            $scope.index_selectedSensorCoorde = $scope.index_SensorCoordeData[0];
            if ($scope.selectIndexToolCoorde) {
                $scope.selectIndexToolCoorde = $scope.index_ToolCoordeData.filter(item => item.id == $scope.selectIndexToolCoorde.id)[0];
            }
            // å¤çè´è½½ç¼å·çæ°æ®
            let getLoadCmd = {
                cmd: 'get_load'
            }
            dataFactory.getData(getLoadCmd).then((data) => {
                $scope.indexEndLoadData = data;
                if ($scope.selectIndexToolCoorde) {
                    $scope.selectedindexEndLoad = $scope.indexEndLoadData[$scope.selectIndexToolCoorde.load_id];
                }
                getWObjCoordData();
            }, () => {
                $scope.indexEndLoadData = [];
            });
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[24]);
        });
    };
    //ä¿®æ¹å·¥å·æ°æ®åºæ°æ®åæ´æ°æ°æ®
    document.addEventListener('saveToolCoordData', e => {
        index_getToolCoordData();
    })

    /**
     * è·åå½ååºç¨å·¥å·åæ ç³»åç§°
     * @param {String} toolId å½ååºç¨å·¥å·åæ ç³»Id
     */
    function getCurrToolCoordName(toolId) {
        let getCmd = {
            cmd: "get_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            if (data.find(item => item.id == toolId)) {
                $scope.currentCoordName = data.find(item => item.id == toolId).name;
                $scope.toolCoordList = JSON.parse(JSON.stringify(data));
                $scope.selectApplyCoord = $scope.toolCoordList.find(item => item.id == toolId);
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[24]);
        });
    };
    $scope.toolCoordList = JSON.parse(JSON.stringify(testDataService.testToolCoordeData));

    // æ¾ç¤ºå·¥å·åè¡¨ï¼åæ¢åºç¨
    $scope.openApplyTool = function() {
        $scope.showApplyTool = !$scope.showApplyTool;
        $(document).ready(function () {
            $('#apply-coord').focus();
        })
    }

    // åºç¨å½åå·¥å·åæ ç³»
    function applyToolCoord(selectToolCoord) {
        const toolCoordString = "SetToolCoord(" + selectToolCoord.id + "," + selectToolCoord.x + "," + selectToolCoord.y + ","
            + selectToolCoord.z + "," + selectToolCoord.rx + "," + selectToolCoord.ry + "," + selectToolCoord.rz + ","
            + selectToolCoord.type + "," + selectToolCoord.installation_site + "," + selectToolCoord.tool_id_no + ","
            + selectToolCoord.load_id + ")";
        const setToolCoordCmd = {
            cmd: 316,
            data: {
                content: toolCoordString,
            },
        };
        dataFactory.setData(setToolCoordCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    /**
     * è·åå½ååºç¨å¤é¨å·¥å·åæ ç³»åç§°
     * @param {String} toolId å½ååºç¨å¤é¨å·¥å·åæ ç³»Id
     */
    function getCurrExToolCoordName(toolId) {
        let getCmd = {
            cmd: "get_ex_tool_cdsystem",
        };
        dataFactory.getData(getCmd).then((data) => {
            let exToolCoordeData = JSON.parse(JSON.stringify(data));
            let exToolCoordeKeys = Object.keys(exToolCoordeData);
            const tempCurrentExToolCoord = exToolCoordeKeys.find(item => exToolCoordeData[item].id == toolId);
            if (tempCurrentExToolCoord) {
                $scope.currentCoordName = exToolCoordeData[tempCurrentExToolCoord].user_name;
                $scope.toolCoordList = JSON.parse(JSON.stringify(data));
                $scope.selectApplyCoord = $scope.toolCoordList[tempCurrentExToolCoord];
            }
        }, (status) => {
            toastFactory.error(status);
        });
    };

    // åºç¨å¤é¨å·¥å·åæ ç³»
    function applyExToolCoord(selectExToolCoord) {
        const extoolCoordString = "SetExToolCoord(" + (~~(selectExToolCoord.id) + $scope.indexToolCoordeTotal) + "," + selectExToolCoord.ex + ","
            + selectExToolCoord.ey + "," + selectExToolCoord.ez + "," + selectExToolCoord.erx + "," + selectExToolCoord.ery + ","
            + selectExToolCoord.erz + "," + selectExToolCoord.tx + "," + selectExToolCoord.ty + "," + selectExToolCoord.tz + ","
            + selectExToolCoord.trx + "," + selectExToolCoord.try + "," + selectExToolCoord.trz + ")";
        const setExToolCoordCmd = {
            cmd: 330,
            data: {
                content: extoolCoordString,
            },
        };
        dataFactory.setData(setExToolCoordCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }

    // ç¶æé¡µåºç¨å½åå·¥å·/å¤é¨å·¥å·åæ ç³»
    $scope.applyCurrentTool = function(selectValue) {
        if ($scope.currentCoord < $scope.indexToolCoordeTotal) {
            applyToolCoord(selectValue)
        } else {
            applyExToolCoord(selectValue)
        }
    }

    //ä¸åä¼ æå¨è®°å½æä»¤
    $scope.btn_LTRecord = 0;
    $scope.setLaserRecord = function () {
        $scope.btn_LTRecord = 1;
        let LaserRecordCmd = {
            cmd: 278,
            data: {
                content: "PosSensorPointRecord(" + $scope.index_selectedSensorCoorde.id + "," + $scope.index_selectedSensorCoorde.installation_site + "," + $scope.index_selectedSensorCoorde.x + "," + $scope.index_selectedSensorCoorde.y + "," +
                    $scope.index_selectedSensorCoorde.z + "," + $scope.index_selectedSensorCoorde.rx + "," + $scope.index_selectedSensorCoorde.ry + "," + $scope.index_selectedSensorCoorde.rz + ")",
            },
        };
        dataFactory.setData(LaserRecordCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[25]);
            });
    }

    //è·åä¼ æå¨ç¤ºæç¹æ°æ®
    document.addEventListener('278', e => {
        $scope.saveLaserPoint(JSON.parse(e.detail));
    });

    //ä¿å­ä¼ æå¨ç¤ºæç¹
    $scope.saveLaserPoint = function (lpointdata) {
        if (("1" != $scope.controlMode)) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
            return;
        }
        //è®¡ç®åºçç»æä¿çä¸ä½å°æ°
        let temparr = Object.keys(lpointdata);
        var templength = temparr.length;
        for (let i = 0; i < templength; i++) {
            lpointdata[temparr[i]] = parseFloat(lpointdata[temparr[i]]).toFixed(3);
        }
        if ($scope.btn_LTRecord) {
            $scope.btn_LTRecord = 0;
            if (0 == $scope.pointLaserName.trim().length) {
                toastFactory.info(indexDynamicTags.info_messages[12]);
                return;
            } else {
                let savePointCmd = {
                    cmd: "save_laser_point",
                    data: {
                        name: $scope.pointLaserName,
                        speed: "100",
                        elbow_speed: "100",
                        acc: $scope.acceleration,
                        elbow_acc: $scope.acceleration,
                        toolnum: $scope.currentCoord + "",
                        workpiecenum: $scope.currentWobjCoord + "",
                        j1: lpointdata.j1,
                        j2: lpointdata.j2,
                        j3: lpointdata.j3,
                        j4: lpointdata.j4,
                        j5: lpointdata.j5,
                        j6: lpointdata.j6,
                        x: lpointdata.x,
                        y: lpointdata.y,
                        z: lpointdata.z,
                        rx: lpointdata.rx,
                        ry: lpointdata.ry,
                        rz: lpointdata.rz,
                        E1: lpointdata.E1,
                        E2: lpointdata.E2,
                        E3: lpointdata.E3,
                        E4: lpointdata.E4
                    },
                };
                dataFactory.actData(savePointCmd)
                    .then(() => {
                        $scope.pointLaserName = "";
                        $('#LpointExitedModal').modal('hide');
                        toastFactory.success(indexDynamicTags.success_messages[3] + $scope.pointLaserName + indexDynamicTags.success_messages[4]);
                        dispatchSavePoints();
                    }, (status) => {
                        toastFactory.error(status, indexDynamicTags.success_messages[3] + $scope.pointLaserName + indexDynamicTags.error_messages[26]);
                    });
            }
        } else {
            let savePointCmd = {
                cmd: "save_laser_point",
                data: {
                    name: $scope.ptnboxPointName,
                    speed: "100",
                    elbow_speed: "100",
                    acc: $scope.acceleration,
                    elbow_acc: $scope.acceleration,
                    toolnum: $scope.currentCoord + "",
                    workpiecenum: $scope.currentWobjCoord + "",
                    j1: lpointdata.j1,
                    j2: lpointdata.j2,
                    j3: lpointdata.j3,
                    j4: lpointdata.j4,
                    j5: lpointdata.j5,
                    j6: lpointdata.j6,
                    x: lpointdata.x,
                    y: lpointdata.y,
                    z: lpointdata.z,
                    rx: lpointdata.rx,
                    ry: lpointdata.ry,
                    rz: lpointdata.rz,
                    E1: lpointdata.E1,
                    E2: lpointdata.E2,
                    E3: lpointdata.E3,
                    E4: lpointdata.E4
                },
            };
            dataFactory.actData(savePointCmd)
                .then(() => {
                    toastFactory.success(indexDynamicTags.success_messages[3] + $scope.ptnboxPointName + indexDynamicTags.success_messages[4]);
                    dispatchSavePoints();
                    if (($scope.ptnboxPointsFlag + 1) > $scope.limitNumber) {
                        toastFactory.info(indexDynamicTags.info_messages[14]);
                    }
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.success_messages[3] + $scope.ptnboxPointName + indexDynamicTags.error_messages[26]);
                });
        }
    }

    //æ¾ç¤ºæéèIOç¶ææ§ä»¶
    $scope.iomenu_up = false;
    $scope.iomenu_down = true;
    $scope.rmenu_up = false;
    $scope.rmenu_down = true;
    $scope.show_robotMenu = true;

    $scope.auxiomenu_up = true;
    $scope.auxiomenu_down = false;
    $scope.show_Aux_IOMenu = false;
    $scope.showRobotMenu = function () {
        $scope.rmenu_up = !$scope.rmenu_up;
        $scope.rmenu_down = !$scope.rmenu_down;
        $scope.show_robotMenu = !$scope.show_robotMenu;
    }

    $scope.showAuxIOMenu = function () {
        $scope.auxiomenu_up = !$scope.auxiomenu_up;
        $scope.auxiomenu_down = !$scope.auxiomenu_down;
        $scope.show_Aux_IOMenu = !$scope.show_Aux_IOMenu;
    }

    /* å¤æ­æ¾ç¤ºå³èä½ç½®åTCPå§¿æ */
    function checkCoord() {
        if ((1 == $scope.selectedCoordSys.value) || (2 == $scope.selectedCoordSys.value)) {
            $scope.pointMove1 = "X";
            $scope.pointMove2 = "Y";
            $scope.pointMove3 = "Z";
            $scope.pointMove4 = "RX";
            $scope.pointMove5 = "RY";
            $scope.pointMove6 = "RZ";
            $scope.pointMove1Data = $scope.currentBaseTCP.x;
            $scope.pointMove2Data = $scope.currentBaseTCP.y;
            $scope.pointMove3Data = $scope.currentBaseTCP.z;
            $scope.pointMove4Data = $scope.currentBaseTCP.rx;
            $scope.pointMove5Data = $scope.currentBaseTCP.ry;
            $scope.pointMove6Data = $scope.currentBaseTCP.rz;
        } else if (0 == $scope.selectedCoordSys.value) {
            $scope.pointMove1 = "J1";
            $scope.pointMove2 = "J2";
            $scope.pointMove3 = "J3";
            $scope.pointMove4 = "J4";
            $scope.pointMove5 = "J5";
            $scope.pointMove6 = "J6";
            $scope.pointMove1Data = $scope.jointsData.j1;
            $scope.pointMove2Data = $scope.jointsData.j2;
            $scope.pointMove3Data = $scope.jointsData.j3;
            $scope.pointMove4Data = $scope.jointsData.j4;
            $scope.pointMove5Data = $scope.jointsData.j5;
            $scope.pointMove6Data = $scope.jointsData.j6;
        } else if (3 == $scope.selectedCoordSys.value) {
            $scope.pointMove1 = "X";
            $scope.pointMove2 = "Y";
            $scope.pointMove3 = "Z";
            $scope.pointMove4 = "RX";
            $scope.pointMove5 = "RY";
            $scope.pointMove6 = "RZ";
            $scope.pointMove1Data = $scope.currentTCP.x;
            $scope.pointMove2Data = $scope.currentTCP.y;
            $scope.pointMove3Data = $scope.currentTCP.z;
            $scope.pointMove4Data = $scope.currentTCP.rx;
            $scope.pointMove5Data = $scope.currentTCP.ry;
            $scope.pointMove6Data = $scope.currentTCP.rz;
        }
    }

    /* IOè®¾ç½®åè½åº */
    // CtrlBox AOArray
    $scope.clAOArr = [
        {
            name: "Aout0",
            num: 0
        },
        {
            name: "Aout1",
            num: 1
        }
    ];
    $scope.clAOSelected = $scope.clAOArr[0];

    // EndEff AOArray
    $scope.toolAOArr = [
        {
            name: "Aout0",
            num: 0
        }
    ];
    $scope.toolAOSelected = $scope.toolAOArr[0];

    // è®¾ç½®æ§å¶ç®±DOç¶æ
    $scope.setCtrlBoxDO = function(DONum) {
        if (DONum == null) {
            toastFactory.warning(indexDynamicTags.warning_messages[8]);
            return;
        };
        if (DONum > 7) {
            if (0 != $scope.indexDOcfgArr[DONum - 8]) {
                toastFactory.warning("DO" + DONum + indexDynamicTags.warning_messages[9]);
                return;
            }
        }
        let setDOString = "SetDO(" + DONum + "," + $scope.clDO[DONum] + "," + 0 + ")";
        let setDOCmd = {
            cmd: 204,
            data: {
                content: setDOString
            }
        };
        dataFactory.setData(setDOCmd).then(() => {}, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[28]);
        });
    }

    // è®¾ç½®æ§å¶ç®±AOç¶æ
    $scope.setCtrlBoxAO = function(AONum) {
        if (AONum == null) {
            toastFactory.warning(indexDynamicTags.warning_messages[10]);
            return;
        };
        if ($scope.clAOValue == undefined || $scope.clAOValue == "") {
            toastFactory.warning(indexDynamicTags.warning_messages[11]);
            return;
        };
        let setAOString = "SetAO(" + AONum + "," + $scope.clAOValue * 40.95 + ")";
        let setAOCmd = {
            cmd: 209,
            data: {
                content: setAOString
            }
        };
        dataFactory.setData(setAOCmd).then(() => {}, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[29]);
        });
    }
    // è®¾ç½®æ«ç«¯å·¥å·DOç¶æ
    $scope.setEndEffDO = function (toolDONum) {
        if (toolDONum == null) {
            toastFactory.warning(indexDynamicTags.warning_messages[12]);
            return;
        };
        let setToolDOString = "SetToolDO(" + toolDONum + "," + $scope.toolDO[toolDONum] + "," + 0 + ")";
        let setToolDOCmd = {
            cmd: 210,
            data: {
                content: setToolDOString
            }
        };

        dataFactory.setData(setToolDOCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[30]);
            });
    }
    // è®¾ç½®æ«ç«¯å·¥å·AOç¶æ
    $scope.setEndEffAO = function (toolAONum) {
        if (toolAONum == null) {
            toastFactory.warning(indexDynamicTags.warning_messages[13]);
            return;
        };
        if ($scope.toolAOValue == undefined || $scope.toolAOValue == "") {
            toastFactory.warning(indexDynamicTags.warning_messages[14]);
            return;
        };
        let setToolAOString = "SetToolAO(" + toolAONum + "," + $scope.toolAOValue * 40.95 + ")";
        let setToolAOCmd = {
            cmd: 211,
            data: {
                content: setToolAOString
            }
        };

        dataFactory.setData(setToolAOCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[31]);
            });
    }

    /* TPDåè½åº */
    //TPDå¨æ
    $scope.setTPDPeriod = [
        {
            num: "2",
        },
        {
            num: "4",
        },
        {
            num: "8",
        }
    ]
    $scope.selectedTPDPeriod = $scope.setTPDPeriod[0];

    //å¼å§è®°å½TPDè½¨è¿¹æä»¤
    $scope.startTPDRecord = function () {
        if (null == $scope.writeTPDName) {
            toastFactory.warning(indexDynamicTags.warning_messages[15]);
        } else if ($scope.writeTPDName.length >= 20) {
            toastFactory.warning(indexDynamicTags.warning_messages[16]);
        } else if (1 == tpd_record_state) {
            toastFactory.warning(indexDynamicTags.warning_messages[18]);
        } else {
            var startTPDString = "SetTPDStart(" + $scope.selectedTPDLocation.num + ",\"" + $scope.writeTPDName + "\"," + $scope.selectedTPDPeriod.num + "," + $scope.selectedTPDDI.id + "," + $scope.selectedTPDDO.id + ")";
            let startTPDRecordCmd = {
                cmd: 315,
                data: {
                    content: startTPDString,
                },
            };
            dataFactory.setData(startTPDRecordCmd)
                .then(() => {
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[32]);
                });
        }
    }

    //åæ°è®¾ç½®
    $scope.SetTPDParam = function () {
        if (null == $scope.writeTPDName) {
            toastFactory.warning(indexDynamicTags.warning_messages[15]);
        } else if ($scope.writeTPDName.length >= 20) {
            toastFactory.warning(indexDynamicTags.warning_messages[16]);
        } else if (1 == tpd_record_state) {
            toastFactory.warning(indexDynamicTags.warning_messages[18]);
        } else {
            var setTPDParamString = "SetTPDParam(" + $scope.selectedTPDLocation.num + ",\"" + $scope.writeTPDName + "\"," + $scope.selectedTPDPeriod.num + "," + $scope.selectedTPDDI.id + "," + $scope.selectedTPDDO.id + ")";
            let setTPDParamCmd = {
                cmd: 1248,
                data: {
                    content: setTPDParamString,
                },
            };
            dataFactory.setData(setTPDParamCmd)
                .then(() => {
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[33]);
                });
        }
    }

    //åæ­¢è®°å½TPDè½¨è¿¹æä»¤
    $scope.stopTPDRecord = function () {
        if (null == $scope.writeTPDName) {
            toastFactory.warning(indexDynamicTags.warning_messages[19]);
        } else if (0 == tpd_record_state) {
            toastFactory.warning(indexDynamicTags.warning_messages[21]);
        } else {
            var stopTPDString = "SetWebTPDStop(" + $scope.selectedTPDLocation.num + ",\"" + $scope.writeTPDName + "\"," + $scope.selectedTPDPeriod.num + "," + $scope.selectedTPDDI.id + "," + $scope.selectedTPDDO.id + ")";
            let stopTPDRecordCmd = {
                cmd: 317,
                data: {
                    content: stopTPDString,
                },
            };
            dataFactory.setData(stopTPDRecordCmd).then(() => {}, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[34]);
            });
        }
    }
    document.addEventListener('317', e => {
        getTPDName();
        if (e.detail == 1) {
            $scope.writeTPDName = null;
            $scope.tpdState = indexDynamicTags.info_messages[22];
        } else {
            toastFactory.error(403, indexDynamicTags.error_messages[34]);
        }
    });

    //è·åTPDè½¨è¿¹æä»¤
    function getTPDName() {
        let getTPDNameCmd = {
            cmd: "get_tpd_name",
        };
        dataFactory.getData(getTPDNameCmd)
            .then((data) => {
                $scope.GetTPDName = data;
                $scope.selectedTPDName = $scope.GetTPDName[0];
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[35]);
            });
    }

    document.addEventListener('tpdget', e => {
        toastFactory.success(indexDynamicTags.success_messages[6]);
        getTPDName();
    });

    //å é¤TPDè½¨è¿¹
    $scope.deleteTPDRecord = function () {
        if (null == $scope.selectedTPDName) {
            toastFactory.warning(indexDynamicTags.warning_messages[22]);
        }
        else {
            var deleteTPDString = "SetTPDDelete(\"" + $scope.selectedTPDName + "\")";
            let deleteTPDRecordCmd = {
                cmd: 318,
                data: {
                    content: deleteTPDString,
                },
            };
            dataFactory.setData(deleteTPDRecordCmd)
                .then(() => {
                    getTPDName();
                }, (status) => {
                    toastFactory.error(status, indexDynamicTags.error_messages[36]);
                });
        }
    }

    /* TPDå¯è§åç¼è¾åè½ */
    // è·åè½¨è¿¹ç¹
    let samplingPeriod = 100;
	let tpdPointsArrayLastIndex = 0;
    $scope.getTPDPoints = function () {
        if ($scope.selectedTPDNameForEdit) {
            let getCmd = {
                cmd: "get_TPD_points",
                data: {
                    name: $scope.selectedTPDNameForEdit + ".txt"
                }
            };
            toastFactory.info(indexDynamicTags.info_messages[15]);
            let pageLoading = document.getElementById("pageLoading");
            pageLoading.style.display = "block";
            
            dataFactory.getData(getCmd)
                .then((data) => {
    
                    viewer.clearTrack();
                    $scope.tpdPointsArray = data;
                    $scope.tpdPointsArrayForTrack = [];
                    let tpdPointsArrayLen = data.length;
                    tpdPointsArrayLastIndex = tpdPointsArrayLen - 1;
                    let samplingPointsNum = ~~(tpdPointsArrayLen / samplingPeriod);
    
                    // è½¨è¿¹ç¹éæ ·
                    for (let i = 0; i < samplingPointsNum; i++) {
                        
                        $scope.tpdPointsArrayForTrack.push($scope.tpdPointsArray[tpdPointsArrayLastIndex - (i * samplingPeriod)]);
                        
                    }
                    $scope.tempTPDPointsArray = $scope.tpdPointsArrayForTrack;
    
                    //  éæ ·ç¹æ¸²æè½¨è¿¹
                    $scope.tpdPointsArrayForTrack.forEach(element => {
                        viewer.drawTrack(element.x / 1000, element.y / 1000, element.z / 1000);
                    });
    
                    // è®¾ç½®è½¨è¿¹èµ·æ­¢ç¹æ»åæå¤§å¼ååºå·
                    let tpdstart = document.querySelector('input[name="tpdstart"]');
                    let tpdend = document.querySelector('input[name="tpdend"]');
                    tpdstart.max = tpdPointsArrayLastIndex;
                    tpdend.max = tpdPointsArrayLastIndex;
                    $scope.tpdStartIndex = 0;
                    $scope.tpdEndIndex = tpdPointsArrayLastIndex;
    
                    let pageLoading = document.getElementById("pageLoading");
                    pageLoading.style.display = "none";
                    toastFactory.success(indexDynamicTags.success_messages[7]);
                }, (status) => {
                    toastFactory.error(status);
                    let pageLoading = document.getElementById("pageLoading");
                    pageLoading.style.display = "none";
                });
        } else {
            toastFactory.info(indexDynamicTags.info_messages[37]);
        }
    }

    $scope.changeTPDStartEndPoint = function (sp, ep) {
        if (~~ep > ~~sp) {
			let tempsp = ~~(sp / samplingPeriod);
			let tempep = ~~(ep / samplingPeriod);
			let periodNum = ~~($scope.tpdPointsArray.length / samplingPeriod);
			if (tempep !=  periodNum) {
				tempep += 1;
			}
            
            $scope.tempTPDPointsArray = $scope.tpdPointsArrayForTrack.slice(tempsp, tempep);
            viewer.clearTrack();
            $scope.tempTPDPointsArray.forEach(element => {
                viewer.drawTrack(element.x / 1000, element.y / 1000, element.z / 1000);
            });

        } else {
            toastFactory.warning(indexDynamicTags.warning_messages[23]);
        }
    }

    // æ¨¡æå¤ç°TPDè½¨è¿¹
	let stid = 0;
    $scope.simulationTPD = function () {
        let count = 0;
        if ($scope.tempTPDPointsArray && $scope.tempTPDPointsArray.length > 0) {
            let len = $scope.tempTPDPointsArray.length;
            toastFactory.info(indexDynamicTags.info_messages[16]);
            if (stid == 0) {
                stid = setInterval(() => {
                    //viewer.clearPoints();
                    let element = $scope.tempTPDPointsArray[count];
                    //viewer.drawPoints(element.x / 1000, element.y / 1000, element.z / 1000);
                    viewer.setVirtualAngle("j1", element["j1"] * DEG2RAD);
                    viewer.setVirtualAngle("j2", element["j2"] * DEG2RAD);
                    viewer.setVirtualAngle("j3", element["j3"] * DEG2RAD);
                    viewer.setVirtualAngle("j4", element["j4"] * DEG2RAD);
                    viewer.setVirtualAngle("j5", element["j5"] * DEG2RAD);
                    viewer.setVirtualAngle("j6", element["j6"] * DEG2RAD);
                    count++;
                    if (count == len) {
                        //viewer.clearPoints();
                        clearInterval(stid);
                        stid = 0;
                        toastFactory.success(indexDynamicTags.success_messages[8]);
                    }
                }, 60);
            } else {
                toastFactory.warning(indexDynamicTags.warning_messages[24]);
            }
        } else {
            toastFactory.info(indexDynamicTags.info_messages[37]);
        }
    }

    // å®æTPDè½¨è¿¹ç¼è¾
    $scope.completeTPDEditing = function () {
        let cmd = {
            cmd: "cfg_TPD_start_end",
            data: {
                tpd_name: $scope.selectedTPDNameForEdit + ".txt",
                start_point: ~~($scope.tpdStartIndex),
                end_point: ~~($scope.tpdEndIndex)
            }
        };
        dataFactory.actData(cmd)
            .then(() => {
                let savePointCmd = {
                    cmd: "save_TPD_point",
                    data: {
                        name: $scope.selectedTPDNameForEdit + "start",
                        speed: "100",
                        elbow_speed: "100",
                        acc: $scope.acceleration + "",
                        elbow_acc: $scope.acceleration + "",
                        toolnum: $scope.currentCoord + "",
                        workpiecenum: $scope.currentWobjCoord + "",
                        j1: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j1 + "",
                        j2: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j2 + "",
                        j3: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j3 + "",
                        j4: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j4 + "",
                        j5: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j5 + "",
                        j6: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].j6 + "",
                        x: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].x + "",
                        y: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].y + "",
                        z: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].z + "",
                        rx: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].rx + "",
                        ry: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].ry + "",
                        rz: $scope.tpdPointsArray[tpdPointsArrayLastIndex - ~~($scope.tpdStartIndex)].rz + ""
                    },
                };
                dataFactory.actData(savePointCmd)
                    .then(() => {
                        toastFactory.success(indexDynamicTags.success_messages[9]);
                        dispatchSavePoints();
                    }, (status) => {
                        toastFactory.error(status, indexDynamicTags.error_messages[37]);
                    });

                // clear
                viewer.clearTrack();
                $scope.tpdPointsArray = [];
                $scope.tempTPDPointsArray = [];
                $scope.tpdPointsArrayForTrack = [];
                $scope.selectedTPDNameForEdit = null;
                toastFactory.success(indexDynamicTags.success_messages[10]);
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /* ./TPDå¯è§åç¼è¾åè½ */

    /**å¤¹çªæ¾ç¤º */
    $scope.gripperidArr = [
        {
            name: "ID1"
        },
        {
            name: "ID2"
        },
        {
            name: "ID3"
        },
        {
            name: "ID4"
        },
        {
            name: "ID5"
        },
        {
            name: "ID6"
        },
        {
            name: "ID7"
        },
        {
            name: "ID8"
        }
    ],


    /* EAxisåè½åº */
    // EAxis option
    $scope.Index_EAxisSpeed = 100;
    $scope.Index_EAxisDistance = 10;
    $scope.Index_EAxisacc = 100;
    $scope.Index_ExternaAxisIdData = [
        {
            id: "1"
        },
        {
            id: "2"
        },
        {
            id: "3"
        },
        {
            id: "4"
        }
    ];
    $scope.selectedExAxis = $scope.Index_ExternaAxisIdData[0];
    $scope.selectedEAxisZeroMode = $scope.ZeroModeData[0];
    $scope.homeSearchVel = 5;
    $scope.homeLatchVel = 1;

    // æ©å±è½´é¶ç¹éç½®çªå£
    $("#IConveyorZero").click(function () {
        $('#IConverZeroModal').modal('show');
    });

    /**
     * è®¾å®å¤é¨è½´é¶ç¹
     * @param {string} exAxisId æ©å±è½´ç¼å·
     * @param {string} zeroMode åé¶æ¹å¼
     * @param {string} searchVel å¯»é¶éåº¦
     * @param {string} latchVel é¶ç¹ç®ä½éåº¦
     * @param {string} zeroFlag 0-æºå¨äººä¸ç»´æ¨¡åæä½æ©å±è½´åé¶ã1-æ©å±è½´åæ ç³»è®¾ç½®æ©å±è½´ç¼å·å¯¹åºèªç±åº¦æä½æ©å±è½´åé¶ã2-UDPæ©å±è½´æä½æ©å±è½´åé¶
     * @returns 
     */
    $scope.setExAxisZero = function(exAxisId, zeroMode, searchVel, latchVel, zeroFlag) {
        // if ($scope.EAxisRDY[exAxisId - 1] != 1) {
        //     toastFactory.info(indexDynamicTags.info_messages[32]);
        //     $('#IConverZeroModal').modal('hide');
        //     return;
        // };
        let SetEAxisZeroCmd = {
            cmd: 290,
            data: {
                content: `ExtAxisSetHoming(${handleExAxisId(exAxisId)},${zeroMode},${searchVel},${latchVel})`,
            },
        };
        dataFactory.setData(SetEAxisZeroCmd).then(() => {
            $scope.exAxisZeroSetFlag = zeroFlag;
            $scope.exAxisZeroSetId = exAxisId;
        }, (status) => {
            toastFactory.error(status);
        });
    }
    $scope.zeroStateText = "";
    document.addEventListener('EAxisZero', function (e) {
        let zeroState = e.detail;
        if (zeroState[$scope.selectedExAxis.id - 1] == 0) {
            $scope.zeroStateText = "";
        } else if (zeroState[$scope.selectedExAxis.id - 1] == 1) {
            $scope.zeroStateText = indexDynamicTags.info_messages[28];
        } else if (zeroState[$scope.selectedExAxis.id - 1] == 2) {
            $scope.zeroStateText = indexDynamicTags.info_messages[29];
        } else if (zeroState[$scope.selectedExAxis.id - 1] == 3) {
            $scope.zeroStateText = indexDynamicTags.info_messages[30];
        } else if (zeroState[$scope.selectedExAxis.id - 1] == 4) {
            $scope.zeroStateText = indexDynamicTags.info_messages[31];
        }
    });

    /**
     * å¤é¨è½´ä¼ºæä½¿è½
     * @param {*} exAxisId æ©å±è½´ç¼å·
     * @param {*} index 0-å»ä½¿è½ã1-ä½¿è½
     */
    $scope.setExAxisServoOn = function(exAxisId, index) {
        let EAxisServoOnCmd = {
            cmd: 296,
            data: {
                content: `ExtAxisServoOn(${handleExAxisId(exAxisId)},${index})`,
            },
        };
        dataFactory.setData(EAxisServoOnCmd).then(() => {}, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[38]);
        });
    }

    /**
     * å¤é¨è½´ç¹å¨
     * @param {*} exAxisId æ©å±è½´ç¼å·
     * @param {*} index 0-ååè¿å¨ã1-æ­£åè¿å¨
     */
    $scope.startExAxisJog = function (exAxisId, index, speed, acc, distance) {
        if ($scope.EAxisRDY[exAxisId - 1] === 0) {
            toastFactory.info(indexDynamicTags.info_messages[17]);
            return;
        };
        let StartEAxisJogCmd = {
            cmd: 292,
            data: {
                content: `ExtAxisStartJog(6,${handleExAxisId(exAxisId)},${index},${speed},${acc},${distance})`,
            },
        };
        dataFactory.setData(StartEAxisJogCmd).then(() => {}, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[39]);
        });
    }

    // å¤é¨è½´åæ­¢ç¹å¨
    $scope.stopExAxisJog = function() {
        let StopEAxisJogCmd = {
            cmd: 240,
            data: {
                content: "StopExtAxisJog",
            },
        };
        dataFactory.setData(StopEAxisJogCmd).then(() => {}, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[40]);
        });
    }

    /* FTåè½åº */
    $scope.FT_gain = 10;
    $scope.FT_Control_Fx = 0;
    $scope.FT_Control_Fy = 0;
    $scope.FT_Control_Fz = 0;
    $scope.FT_Control_Tx = 0;
    $scope.FT_Control_Ty = 0;
    $scope.FT_Control_Tz = 0;

    /** éæ©èªå®ä¹åæ ç³»æ¶ï¼è¯»åä¸æ¬¡éç½®çFTåæ ç³»éç½®æä»¶ */
    $scope.getFTCoord = function() {
        locateContent($scope.ftEvent, "#robot-support-info");
        getDynamicData('ftCoord');
    }

    /** è®¾ç½®å¤é¨è½´åæ ç³» */
    $scope.setFTRCS = function() {
        let setRCSContent;
        let tempFTCoord;
        if (Object.keys($scope.selectedFTCoord).some(item => $scope.selectedFTCoord[item] == null || $scope.selectedFTCoord[item] == undefined || $scope.selectedFTCoord[item] == '')) {
            toastFactory.info(indexDynamicTags.info_messages[39]);
            return;
        }
        setRCSContent = `FT_SetRCS(${$scope.indexSelectedFTCoord.id},{${$scope.selectedFTCoord.x},${$scope.selectedFTCoord.y},${$scope.selectedFTCoord.z},${$scope.selectedFTCoord.rx},${$scope.selectedFTCoord.ry},${$scope.selectedFTCoord.rz}})`;
        switch ($scope.indexSelectedFTCoord.id) {
            case '0':
                tempFTCoord = 'Tool';
                break;
            case '1':
                tempFTCoord = 'Base';
                break;
            case '2':
                tempFTCoord = 'Custom';
                break;
            default:
                break;
        }
        let setFTRCSCmd = {
            cmd: 525,
            data: {
                content: setRCSContent,
            }
        };
        dataFactory.setData(setFTRCSCmd).then(() => {
            $scope.currentFTCoord = tempFTCoord;
        }, (status) => {
            toastFactory.error(status);
        });
    }

    //çµå¼ç¤ºæ
    $scope.currentFT = [0, 0, 0, 0, 0, 0];
    $scope.FT_Jog = function (index) {
        let FT_JogCmd = {
            cmd: 523,
            data: {
                content: "FT_Jog(" + index + "," + $scope.index_selectedFTSensorCoorde.id + "," + $scope.FT_Control_Fx + "," + $scope.FT_Control_Fy + "," + $scope.FT_Control_Fz
                    + "," + $scope.FT_Control_Tx + "," + $scope.FT_Control_Ty + "," + $scope.FT_Control_Tz + "," + $scope.FT_gain + ")",
            },
        };
        dataFactory.setData(FT_JogCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }


    /**è·åå½åæ­£å¨è¿è¡çç¨åºæä»¶å¹¶æ¾ç¤º */
    $scope.getlastprog_flag = 1;
    //è·åç¨æ·æä»¶
    function getUserFiles() {
        if ($scope.getlastprog_flag) {
            let getCmd = {
                cmd: "get_user_data",
                data: {
                    type: '1'
                }
            };
            dataFactory.getData(getCmd).then((data) => {
                $scope.lasetproguserData = data;
                getExDeviceCfg();
            }, (status) => {
                toastFactory.error(status);
            });
        }
    };

    /**
     * ç¹å»é¡¶é¨ç¨åºåç§°è·³è½¬é»è¾
     * @param {string} programName 
     */
    function jumpProgramPage(programName) {
        let checkCmd = {
            cmd: "check_lua_file",
            data: {
                name: programName
            },
        };
        dataFactory.getData(checkCmd).then((data) => {
            switch (data.same_name) {
                case '0':
                    $scope.curRunProgram.name = null;
                    $scope.curRunProgram.url = null;
                    break;
                case '1':
                    localStorage.setItem('fileselected', programName);
                    localStorage.removeItem('graphFileName');
                    localStorage.removeItem('lastLoadFileName');
                    $scope.curRunProgram.url = '#/programteach';
                    break;
                case '2':
                    localStorage.removeItem('fileselected');
                    localStorage.removeItem('lastLoadFileName');
                    localStorage.setItem('graphFileName', programName.split('.lua')[0] + '.json');
                    $scope.curRunProgram.url = '#/graphicalprogramming';
                    break;
                case '3':
                    localStorage.removeItem('fileselected');
                    localStorage.removeItem('graphFileName');
                    localStorage.setItem('lastLoadFileName', programName.split('.lua')[0]);
                    $scope.curRunProgram.url = '#/nodeeditor';
                    break;
                default:
                    break;
            }
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                switch ('1') {
                    case '0':
                        $scope.curRunProgram.url = null;
                        break;
                    case '1':
                        localStorage.setItem('fileselected', programName);
                        localStorage.removeItem('graphFileName');
                        localStorage.removeItem('lastLoadFileName');
                        $scope.curRunProgram.url = '#/programteach';
                        break;
                    case '2':
                        localStorage.removeItem('fileselected');
                        localStorage.removeItem('lastLoadFileName');
                        localStorage.setItem('graphFileName', programName.split('.lua')[0] + '.json');
                        $scope.curRunProgram.url = '#/graphicalprogramming';
                        break;
                    case '3':
                        localStorage.removeItem('fileselected');
                        localStorage.removeItem('graphFileName');
                        localStorage.setItem('lastLoadFileName', programName.split('.lua')[0]);
                        $scope.curRunProgram.url = '#/nodeeditor';
                        break;
                    default:
                        break;
                }
            }
            /* ./test */
        });
    }

    /**
     * è·åå¯¹åºç¨åºåè¡¨
     * @param {string} programType 1-ç¨åºç¼ç¨ã2-å¾å½¢åç¼ç¨ã3-èç¹å¾ç¼ç¨
     */
    $scope.getLuaList =  function(programType) {
        $('.nav-lua').removeClass('active');
        switch (programType) {
            case '1':
                $('#nav-program').addClass('active');
                break;
            case '2':
                $('#nav-graph').addClass('active');
                break;
            case '3':
                $('#nav-node').addClass('active');
                break;
            default:
                break;
        }
        $scope.curRunProgram.clickLuaType = programType;
        let getCmd = {
            cmd: "get_user_data",
            data: {
                type: programType
            }
        };
        dataFactory.getData(getCmd).then((data) => {
            $scope.luaList = Object.keys(data);
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.luaList = Object.keys(testDataService.testUserData);
            }
            /* ./test */
        });
    };

    /**
     * æå¼ç¤ºæç¨åºæ¨¡æçªï¼æ ¹æ®å½åç¨åºè·åå¯¹åºæ°æ®
     * @param {string} pageUrl å½åç¨åºç±»å programteach-ç¨åºç¼ç¨ãgraphicalprogramming-å¾å½¢åç¼ç¨ãnodeeditor-èç¹å¾ç¼ç¨
     */
    $scope.openProgramList = function(pageUrl) {
        if ($scope.controlMode != 1) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            switch (pageUrl) {
                case '#/programteach':
                    $scope.getLuaList('1');
                    break;
                case '#/graphicalprogramming':
                    $scope.getLuaList('2');
                    break;
                case '#/nodeeditor':
                    $scope.getLuaList('3');
                    break;
                default:
                    break;
            }
            $('#luaFileModal').modal('show')
        }
    }

    /**
     * å¨ç¤ºæç¨åºæ¨¡æçªï¼éæ©ç¨åºæå¼
     * @param {string} programName ç¨åºåç§°
     * @param {string} programType 1-ç¨åºç¼ç¨ã2-å¾å½¢åç¼ç¨ã3-èç¹å¾ç¼ç¨
     */
    $scope.locationLua = function(programName, programType) {
        switch (programType) {
            case '1':
                localStorage.setItem('fileselected', programName);
                localStorage.removeItem('graphFileName');
                localStorage.removeItem('lastLoadFileName');
                if ($window.location.href.split('#/')[1] == 'programteach') {
                    $route.reload();
                } else {
                    $location.path('/programteach');
                }
                break;
            case '2':
                localStorage.removeItem('fileselected');
                localStorage.removeItem('lastLoadFileName');
                localStorage.setItem('graphFileName', programName.split('.lua')[0] + '.json');
                if ($window.location.href.split('#/')[1] == 'graphicalprogramming') {
                    $route.reload();
                } else {
                    $location.path('/graphicalprogramming');
                }
                break;
            case '3':
                localStorage.removeItem('fileselected');
                localStorage.removeItem('graphFileName');
                localStorage.setItem('lastLoadFileName', programName.split('.lua')[0]);
                if ($window.location.href.split('#/')[1] == 'nodeeditor') {
                    $route.reload();
                } else {
                    $location.path('/nodeeditor');
                }
                break;
            default:
                break;
        }
        $('#luaFileModal').modal('hide')
    }

    //è·åå¯å¨é¡¹éç½®æä»¶
    function getExDeviceCfg() {
        $scope.getlastprog_flag = 0;
        let getCmd = {
            cmd: "get_ex_device_cfg",
        };
        dataFactory.getData(getCmd)
            .then((data) => {
                if (data.tm_last_prog_name != undefined) {
                    let lastprogname = (data.tm_last_prog_name).substring(8);
                    if (lastprogname in $scope.lasetproguserData) {
                        let lastprogpgvalue = $scope.lasetproguserData[lastprogname].pgvalue;
                        sessionStorage.setItem('lastprogname', lastprogname);
                        sessionStorage.setItem('lastprogpgvalue', lastprogpgvalue);
                    }
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[41]);
            });

    };

    // è·åä¸»ç¨åºéç½®æä»¶
    function getMainProgramData() {
        $scope.getlastprog_flag = 0;
        let getCmd = {
            cmd: "get_ex_device_cfg",
        };
        dataFactory.getData(getCmd).then((data) => {
            if (~~data.tm_auto_load_prog_flag == 1 && data.tm_auto_load_prog_name) {
                const programNameSplit = data.tm_auto_load_prog_name.split('/');
                $scope.curRunProgram.mainName = programNameSplit[programNameSplit.length - 1];
            } else {
                $scope.curRunProgram.mainName = null;
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[41]);
            /* test */
            if (g_testCode) {
                const data = {
                    tm_auto_load_prog_flag: '1.00000',
                    tm_auto_load_prog_name: '/usr/local/etc/controller/lua/program1.lua'
                }
                if (data.tm_auto_load_prog_name) {
                    const programNameSplit = data.tm_auto_load_prog_name.split('/');
                    $scope.curRunProgram.mainName = programNameSplit[programNameSplit.length - 1];
                }
            }
            /* ./test */
        });
    };

    document.addEventListener('setMainProgram', e => {
        getMainProgramData();
    })

    //è·åex_deviceéç½®æä»¶
    function getAllExDeviceCfg(getType) {
        let getCmd = {
            cmd: "get_ex_device_cfg",
        };
        dataFactory.getData(getCmd).then((data) => {
            // æç£¨è®¾ééç½®ç±»å 101-èµå¨å¾· 102-å¤§ådfc
            if (getType == 'init' || getType == 'polishType') {
                $scope.polishConfigType = Number(~~data.polishing_dev_protocol)-101;
            }
        }, (status) => {
            toastFactory.error(status);
        });
    };
    document.addEventListener('updatePolishCfg', e => {
        getAllExDeviceCfg('polishType');
    })

    /* è¿å¿ä¸å¨ç¹ï¼RCMï¼ */
    // [580] è®¾ç½®åèç¹
    $scope.setRCMRefPoint = function (pointIndex) {
        let setCmd = {
            cmd: 580,
            data: {
                content: "RCMSetRefPoint("+ pointIndex +")"
            }
        };
        dataFactory.setData(setCmd)
            .then((data) => {
                if (pointIndex == 1) {
                    $scope.show_RCM_Edit1 = false;
                    $scope.show_RCM_Edit2 = true;
                    $scope.show_RCM_Edit3 = false;
                    $scope.show_RCM_Edit4 = false;
                } else if (pointIndex == 2) {
                    $scope.show_RCM_Edit1 = false;
                    $scope.show_RCM_Edit2 = false;
                    $scope.show_RCM_Edit3 = true;
                    $scope.show_RCM_Edit4 = false;
                } else if (pointIndex == 3) {
                    $scope.show_RCM_Edit1 = false;
                    $scope.show_RCM_Edit2 = false;
                    $scope.show_RCM_Edit3 = false;
                    $scope.show_RCM_Edit4 = true;
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[42]);
            });
    }

    // [581] è¿å¿ä¸å¨ç¹è®¡ç®
    $scope.calculateRCMCoord = function () {
        let setCmd = {
            cmd: 581,
            data: {
                content: "RCMCoordCalculate()"
            }
        };
        dataFactory.setData(setCmd)
            .then((data) => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[43]);
            });
    }

    document.addEventListener('581', e => {
        $scope.RCMCoordX = JSON.parse(e.detail).x;
        $scope.RCMCoordY = JSON.parse(e.detail).y;
        $scope.RCMCoordZ = JSON.parse(e.detail).z;
        $scope.show_RCM_Edit = false;
        $scope.show_RCM_Edit1 = false;
        $scope.show_RCM_Edit2 = false;
        $scope.show_RCM_Edit3 = false;
        $scope.show_RCM_Edit4 = false;
        locateContent($scope.rcmEvent, "#robot-support-info");
    });

    // [582] è¿å¿ä¸å¨ç¹æ¸é¤
    $scope.clearRCMCoord = function () {
        let setCmd = {
            cmd: 582,
            data: {
                content: "RCMCoordClear()"
            }
        };
        dataFactory.setData(setCmd)
            .then((data) => {
                $scope.RCMCoordX = "";
                $scope.RCMCoordY = "";
                $scope.RCMCoordZ = "";
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[44]);
            });
    }

    // [583] è¿å¿ä¸å¨ç¹åè½å¼å³
    $scope.enableRCMCoord = function () {
        let tempStatus = 1 ^ $scope.RCMEnableStatus;
        let setCmd = {
            cmd: 583,
            data: {
                content: "RCMEnable(" + tempStatus + ")"
            }
        };
        dataFactory.setData(setCmd)
            .then(() => {
                $scope.RCMEnableStatus = 1 ^ $scope.RCMEnableStatus;
                if ($scope.RCMEnableStatus) {
                    $scope.RCMEnable = true;
                } else {
                    $scope.RCMEnable = false;
                }
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[45]);
            });

    }

    // å¼å§ç¼è¾è¿å¿ä¸å¨ç¹æµç¨
    $scope.editRCMCoord = function () {
        $scope.show_RCM_Edit = true;
        $scope.show_RCM_Edit1 = true;
        locateContent($scope.rcmEvent, "#robot-support-info");
    }

    // è¿å¿ä¸å¨ç¹ä¸ä¸æ­¥åè½
    $scope.backEditRCMCoord = function (stepIndex) {
        if (stepIndex == 1) {
            $scope.show_RCM_Edit1 = true;
            $scope.show_RCM_Edit2 = false;
            $scope.show_RCM_Edit3 = false;
        } else if (stepIndex == 2) {
            $scope.show_RCM_Edit1 = false;
            $scope.show_RCM_Edit2 = true;
            $scope.show_RCM_Edit3 = false;
        } else if (stepIndex == 3) {
            $scope.show_RCM_Edit1 = false;
            $scope.show_RCM_Edit2 = false;
            $scope.show_RCM_Edit3 = true;
        }
    }


    /* è§¦æ¸ç¹æé¿æç¹å¨ */
    let t_actFlag = -1;
    let mouseDownTime;
    let mouseUpTime;
    let touchStartTime;
    var t_timeID;
    var timeID;
    let mouseupFlag = -1;

    $scope.actTouchStart = function (jointNum, direction) {
        if ("1" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            touchStartTime = getTimeNow();
            if (t_timeID != null) {
                clearInterval(t_timeID);
                t_timeID = null;
            }
            t_timeID = setInterval(() => {

                let t_timeEnd = getTimeNow();
                if (t_timeEnd - touchStartTime > 400) {
                    startJOG(jointNum, direction);
                    clearInterval(t_timeID);
                }
            }, 100);
        }
    }

    $scope.actTouchEnd = function () {
        stopJOG();
        clearInterval(t_timeID);
    }

    $scope.actMouseDown = function (jointNum, direction) {
        if ("1" != $scope.controlMode) {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            $scope.jointNum = jointNum;
            $scope.direction = direction;
            mouseupFlag = 0;
            mouseDownTime = getTimeNow();
            if (timeID != null) {
                clearInterval(timeID);
                timeID = null;
            }
            timeID = setInterval(() => {
                let timeEnd = getTimeNow();
                if (timeEnd - mouseDownTime >= 400) {
                    startJOG(jointNum, direction);
                    clearInterval(timeID);
                    timeID = null;
                }
            }, 100);
        }
    }

    document.addEventListener("mouseup", function () {

        switch (mouseupFlag) {
            case 0:
                if (timeID != null) {
                    clearInterval(timeID);
                    timeID = null;
                }
                if (2 == $scope.selectedCoordSys.value) {
                    stopTool();
                } else {
                    stopJOG();
                };
                mouseupFlag = -1;
                break;
            default:
                break;
        }
    }, false);

    function startJOG(jointNum, direction) {
        if ($("#maxDistance")[0].value == null || $("#maxDistance")[0].value == undefined || $("#maxDistance")[0].value == '') {
            toastFactory.info(indexDynamicTags.info_messages[34]);
            return;
        }
        if ($scope.maxDistance == null || $scope.maxDistance == '' || $scope.maxDistance == undefined) {
            $scope.maxDistance = $("#maxDistance")[0].value;
        }
        let startJOGString;
        if (1 == $scope.selectedCoordSys.value) {
            startJOGString = "StartJOG(" + 2 + "," + jointNum + "," + direction + "," + $scope.speed + "," + $scope.acceleration + "," + $scope.maxDistance + ")";
        } else if (0 == $scope.selectedCoordSys.value) {
            startJOGString = "StartJOG(" + 0 + "," + jointNum + "," + direction + "," + $scope.speed + "," + $scope.acceleration + "," + $scope.maxDistance + ")";
        } else if (2 == $scope.selectedCoordSys.value) {
            startJOGString = "StartJOG(" + 4 + "," + jointNum + "," + direction + "," + $scope.speed + "," + $scope.acceleration + "," + $scope.maxDistance + ")";
        } else if (3 == $scope.selectedCoordSys.value) {
            startJOGString = "StartJOG(" + 8 + "," + jointNum + "," + direction + "," + $scope.speed + "," + $scope.acceleration + "," + $scope.maxDistance + ")";
        }
        let startJOGCmd = {
            cmd: 232,
            data: {
                content: startJOGString
            }
        };

        dataFactory.setData(startJOGCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[46]);
            });
    }

    function stopTool() {
        let stopToolString = "stopTool";
        let stopToolCmd = {
            cmd: 235,
            data: {
                content: stopToolString
            }
        };

        dataFactory.setData(stopToolCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[47]);
            });
    }

    function stopJOG() {
        let stopJOGString = "StopJOG";
        let stopJOGCmd = {
            cmd: 233,
            data: {
                content: stopJOGString
            }
        };

        dataFactory.setData(stopJOGCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[48]);
            });
    }

    let jointsData;
    let lastJointsData;
    $scope.moveDescartesTcp;
    $scope.moveDescartesJoint;
    var reconnectID;
    var reconnectTimeID;
    let temp_handlej;
    let temp_updatej;
    let temp_handletcp;
    let temp_updatetcp;
    let temp_handlebasetcp;
    let temp_updatebasetcp;
    $scope.conveyor_encoder_pos = 0;
    // æ©å±è½´ä½¿è½ç¶æ
    $scope.EAxisRDY = [0, 0, 0, 0];
    // æ©å±è½´ä¼ºæå°ä½ç¶æ
    $scope.EAxisINPOS = [0, 0, 0, 0];
    // æ©å±è½´ä½¿è½ç¶æ
    $scope.exAxisHome = [0, 0, 0, 0];
    $scope.connectUDPFlag = false;
    $scope.exAxisPos = [1, 0, 0, 0];
    $scope.exAxisSpeed = [1, 0, 0, 0];
    $scope.weldTrackSpeed = 7.132;
    $scope.moveDescartesJoint = {
        "j1": "0",
        "j2": "0",
        "j3": "0",
        "j4": "0",
        "j5": "0",
        "j6": "0"
    }
    $scope.updateJointsData = {
        "j1": "0",
        "j2": "0",
        "j3": "0",
        "j4": "0",
        "j5": "0",
        "j6": "0"
    }
    $scope.jointsData = {
        "j1": "0",
        "j2": "0",
        "j3": "0",
        "j4": "0",
        "j5": "0",
        "j6": "0"
    }

    $scope.updateTCPData = {
        "x": "0",
        "y": "0",
        "z": "0",
        "rx": "0",
        "ry": "0",
        "rz": "0"
    }
    $scope.currentTCP = {
        "x": "0",
        "y": "0",
        "z": "0",
        "rx": "0",
        "ry": "0",
        "rz": "0"
    }
    $scope.updateBaseTCPData = {
        "x": "0",
        "y": "0",
        "z": "0",
        "rx": "0",
        "ry": "0",
        "rz": "0"
    }
    $scope.currentBaseTCP = {
        "x": "0",
        "y": "0",
        "z": "0",
        "rx": "0",
        "ry": "0",
        "rz": "0"
    }

    /*å°æ°ä½ç¹åä¸ä½åçååæ¶æ´æ°é¡µé¢æ¾ç¤ºæ°æ®*/
    //å¤çç¨äºå¤æ­æ´æ°æ°æ®ï¼ä¿çä¸ä½å°æ°
    function handleJointData() {
        //jointsæ°æ®å¤ç
        $scope.updateJointsData.j1 = parseInt(temp_handlej.j1 * 100) / 100;
        $scope.updateJointsData.j2 = parseInt(temp_handlej.j2 * 100) / 100;
        $scope.updateJointsData.j3 = parseInt(temp_handlej.j3 * 100) / 100;
        $scope.updateJointsData.j4 = parseInt(temp_handlej.j4 * 100) / 100;
        $scope.updateJointsData.j5 = parseInt(temp_handlej.j5 * 100) / 100;
        $scope.updateJointsData.j6 = parseInt(temp_handlej.j6 * 100) / 100;
        //å·¥ä»¶tcpæ°æ®å¤ç
        $scope.updateTCPData.x = parseInt(temp_handletcp.x * 100) / 100;
        $scope.updateTCPData.y = parseInt(temp_handletcp.y * 100) / 100;
        $scope.updateTCPData.z = parseInt(temp_handletcp.z * 100) / 100;
        $scope.updateTCPData.rx = parseInt(temp_handletcp.rx * 100) / 100;
        $scope.updateTCPData.ry = parseInt(temp_handletcp.ry * 100) / 100;
        $scope.updateTCPData.rz = parseInt(temp_handletcp.rz * 100) / 100;
        //å·¥å·TCPæ°æ®å¤ç
        $scope.updateBaseTCPData.x = parseInt(temp_handlebasetcp[0] * 100) / 100;
        $scope.updateBaseTCPData.y = parseInt(temp_handlebasetcp[1] * 100) / 100;
        $scope.updateBaseTCPData.z = parseInt(temp_handlebasetcp[2] * 100) / 100;
        $scope.updateBaseTCPData.rx = parseInt(temp_handlebasetcp[3] * 100) / 100;
        $scope.updateBaseTCPData.ry = parseInt(temp_handlebasetcp[4] * 100) / 100;
        $scope.updateBaseTCPData.rz = parseInt(temp_handlebasetcp[5] * 100) / 100;
    }

    //å¤æ­æ¯å¦æ´æ°æ°æ®
    function updateJointData() {
        //jointsæ°æ®å¤ç
        if (($scope.updateJointsData.j1 != parseFloat(temp_updatej.j1).toFixed(2)) || ($scope.updateJointsData.j1 != parseFloat($scope.jointsData.j1).toFixed(2))) {
            $scope.jointsData.j1 = temp_updatej.j1;
        }
        if (($scope.updateJointsData.j2 != parseFloat(temp_updatej.j2).toFixed(2)) || ($scope.updateJointsData.j2 != parseFloat($scope.jointsData.j2).toFixed(2))) {
            $scope.jointsData.j2 = temp_updatej.j2;
        }
        if (($scope.updateJointsData.j3 != parseFloat(temp_updatej.j3).toFixed(2)) || ($scope.updateJointsData.j3 != parseFloat($scope.jointsData.j3).toFixed(2))) {
            $scope.jointsData.j3 = temp_updatej.j3;
        }
        if (($scope.updateJointsData.j4 != parseFloat(temp_updatej.j4).toFixed(2)) || ($scope.updateJointsData.j4 != parseFloat($scope.jointsData.j4).toFixed(2))) {
            $scope.jointsData.j4 = temp_updatej.j4;
        }
        if (($scope.updateJointsData.j5 != parseFloat(temp_updatej.j5).toFixed(2)) || ($scope.updateJointsData.j5 != parseFloat($scope.jointsData.j5).toFixed(2))) {
            $scope.jointsData.j5 = temp_updatej.j5;
        }
        if (($scope.updateJointsData.j6 != parseFloat(temp_updatej.j6).toFixed(2)) || ($scope.updateJointsData.j6 != parseFloat($scope.jointsData.j6).toFixed(2))) {
            $scope.jointsData.j6 = temp_updatej.j6;
        }

        //tcpæ°æ®å¤ç
        if (($scope.updateTCPData.x != parseFloat(temp_updatetcp.x).toFixed(2)) || ($scope.updateTCPData.x != parseFloat($scope.currentTCP.x).toFixed(2))) {
            $scope.currentTCP.x = temp_updatetcp.x;
        }
        if (($scope.updateTCPData.y != parseFloat(temp_updatetcp.y).toFixed(2)) || ($scope.updateTCPData.y != parseFloat($scope.currentTCP.y).toFixed(2))) {
            $scope.currentTCP.y = temp_updatetcp.y;
        }
        if (($scope.updateTCPData.z != parseFloat(temp_updatetcp.z).toFixed(2)) || ($scope.updateTCPData.z != parseFloat($scope.currentTCP.z).toFixed(2))) {
            $scope.currentTCP.z = temp_updatetcp.z;
        }
        if (($scope.updateTCPData.rx != parseFloat(temp_updatetcp.rx).toFixed(2)) || ($scope.updateTCPData.rx != parseFloat($scope.currentTCP.rx).toFixed(2))) {
            $scope.currentTCP.rx = temp_updatetcp.rx;
        }
        if (($scope.updateTCPData.ry != parseFloat(temp_updatetcp.ry).toFixed(2)) || ($scope.updateTCPData.ry != parseFloat($scope.currentTCP.ry).toFixed(2))) {
            $scope.currentTCP.ry = temp_updatetcp.ry;
        }
        if (($scope.updateTCPData.rz != parseFloat(temp_updatetcp.rz).toFixed(2)) || ($scope.updateTCPData.rz != parseFloat($scope.currentTCP.rz).toFixed(2))) {
            $scope.currentTCP.rz = temp_updatetcp.rz;
        }

        //tcpæ°æ®å¤ç
        if (($scope.updateBaseTCPData.x != parseFloat(temp_updatebasetcp[0]).toFixed(2)) || ($scope.updateBaseTCPData.x != parseFloat($scope.currentBaseTCP.x).toFixed(2))) {
            $scope.currentBaseTCP.x = temp_updatebasetcp[0];
        }
        if (($scope.updateBaseTCPData.y != parseFloat(temp_updatebasetcp[1]).toFixed(2)) || ($scope.updateBaseTCPData.y != parseFloat($scope.currentBaseTCP.y).toFixed(2))) {
            $scope.currentBaseTCP.y = temp_updatebasetcp[1];
        }
        if (($scope.updateBaseTCPData.z != parseFloat(temp_updatebasetcp[2]).toFixed(2)) || ($scope.updateBaseTCPData.z != parseFloat($scope.currentBaseTCP.z).toFixed(2))) {
            $scope.currentBaseTCP.z = temp_updatebasetcp[2];
        }
        if (($scope.updateBaseTCPData.rx != parseFloat(temp_updatebasetcp[3]).toFixed(2)) || ($scope.updateBaseTCPData.rx != parseFloat($scope.currentBaseTCP.rx).toFixed(2))) {
            $scope.currentBaseTCP.rx = temp_updatebasetcp[3];
        }
        if (($scope.updateBaseTCPData.ry != parseFloat(temp_updatebasetcp[4]).toFixed(2)) || ($scope.updateBaseTCPData.ry != parseFloat($scope.currentBaseTCP.ry).toFixed(2))) {
            $scope.currentBaseTCP.ry = temp_updatebasetcp[4];
        }
        if (($scope.updateBaseTCPData.rz != parseFloat(temp_updatebasetcp[5]).toFixed(2)) || ($scope.updateBaseTCPData.rz != parseFloat($scope.currentBaseTCP.rz).toFixed(2))) {
            $scope.currentBaseTCP.rz = temp_updatebasetcp[5];
        }
    }

    /*æ¨¡æéæ°æ®æ¾ç¤ºå¤ç*/
    //å¤çAOæ¨¡æéæ°æ®
    function handleAoData(Aodata) {
        let length = Aodata.length;
        for (let i = 0; i < length; i++) {
            $scope.analog_output[i] = Aodata[i].toFixed(1);
        }
        $scope.clAOValue = $scope.analog_output[$scope.clAOSelected.num];
        $scope.toolAOValue = $scope.analog_output[4];
    }

    $scope.selectedCtrlAO = function() {
        $scope.clAOValue = $scope.analog_output[$scope.clAOSelected.num];
    }

    //å¤çAIæ¨¡æéæ°æ®
    function handleAiData(Aidata) {
        let length = Aidata.length;
        for (let i = 0; i < length; i++) {
            $scope.analog_input[i] = Aidata[i].toFixed(1);
        }
    }

    //éç½®æä»¶æ£æ¥æç¤º
    $scope.index_cfg_check_tips = "";

    /* ååç«¯è¿æ¥ç¶æå¿è·³ç¡®è®¤ï¼æ­çº¿éè¿ï¼ */
    let consCount = 1;
    function checkCons() {
        $("#consLoading").text(indexDynamicTags.info_messages[18] + consCount);
        let cmdContent = {
            cmd: "cons"
        };
        dataFactory.staData(cmdContent)
            .then(() => {
                viewer.dispatchEvent(new CustomEvent('geometry-loaded', { bubbles: true, cancelable: true, composed: true }));
                let consLoadingPage = document.getElementById("consLoadingPage");
                consLoadingPage.style.display = "none";
                consCount = 0;
                $("#loadPercentage").text("");
            }, () => {
                consCount++;
                checkCons();
            });
    }

    /** webçé¢éå±ä¿¡æ¯è·å */
    function getRobotLock() {
        let getRobotLockCmd = {
            cmd: "get_lock_cfg"
        };
        dataFactory.getData(getRobotLockCmd).then((data) => {
            if (data.day == -1) {
                $scope.isSetLock = false;
            } else if (data.day == 0) {
                $scope.logout();
            } else if (data.day > 0) {
                $scope.isSetLock = true;
                $scope.usageDays = data.day;
                if (data.day < 6) {
                    $('#lockRemindModal').modal('show');
                } else {
                    $('#lockRemindModal').modal('hide');
                }
            }
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[65]);
            /* test */
            // const data = {
            //     day: 6,
            //     date: '2024-04-30'
            // };
            // if (data.day == -1) {
            //     $scope.isSetLock = false;
            // } else if (data.day == 0) {
            //     $scope.logout();
            // } else if (data.day > 0) {
            //     $scope.isSetLock = true;
            //     $scope.usageDays = data.day;
            //     if (data.day < 6) {
            //         $('#lockRemindModal').modal('show');
            //     } else {
            //         $('#lockRemindModal').modal('hide');
            //     }
            // }
            /* ./test */
        });
    }
    $scope.backgroundRunStatus = {
        1: 0,
        2: 1,
        3: 2,
        4: 1,
        5: 2,
        6: 0,
        7: 0,
        8: 0
    }

    /* After model loaded, updata jointsData */
    viewer.addEventListener('geometry-loaded', () => {
        let setFBJson;
        let PositiveLimitFlg;
        let NegativeLimitFlg;
        let lastProgramState = 0;
        let lastPauseParameter;
        let currPauseParameter;
        let jiabaoLeftStationInfo;
        let jiabaoRightStationInfo;
        let piStatusData;
        let lastKeySwitchArr;
        let currKeySwitchArr;
        let lastStartBtn;
        let currStartBtn;
        let lastStopBtn;       // é»è®¤1-æªæä¸
        let currStopBtn;
        let lastPlusBtnsArr;   // é»è®¤1-æªæä¸
        let currPlusBtnsArr;
        let lastMinusBtnsArr;  // é»è®¤1-æªæä¸
        let currMinusBtnsArr;
        let lastWorkpieceCSIndex;  // å·¥ä»¶åæ ç³»åºå·
        let currWorkpieceCSIndex;
        let lastExAxisCSIndex;  // æ©å±è½´åæ ç³»åºå·
        let currExAxisCSIndex;
        let lastCons = 0;
        let socketError = 0;
        let lastPointTableName; //ä¸æ¬¡ç¹ä½è¡¨åç§°
        let currPointTableName; //å½åç¹ä½è¡¨åç§°
        let lastToolName; //ä¸æ¬¡å·¥å·åæ ç³»åç§°
        let currToolName; //å½åå·¥å·åæ ç³»åç§°
        let lastWobjName; //ä¸æ¬¡å·¥ä»¶åæ ç³»åç§°
        let currWobjName; //å½åå·¥ä»¶åæ ç³»åç§°
        let pointErrorFlag; //è®°å½æä»¤ç¹å³èä½ç½®ä¸æ«ç«¯ä½å§¿ä¸ç¬¦éè¯¯
        let lastRobotCtrlMode; // è®°å½æºå¨äººä¸æ¬¡æ¨¡å¼ï¼æ¬å°/è¿ç¨ï¼ï¼ç¨äºå¤æ­å½åæºå¨äººæ¨¡å¼ä¸ä¸æ¬¡æ¨¡å¼ä¸ä¸æ ·æ¶ï¼å¤çä¸å¡çåºæ¯
        let setTimeFlag;//è¿ç¨æ¨¡å¼å®æ¶å¨å¼/å³ç¶æ
        $scope.ptData = {
            line_number: 0,
            ndf_layer: 0,
            ndf_id: 0,
            ndf_row: 0,
            currentRunningProgram: ''
        };
        $scope.recordState = 0; //è®°å½çæ¥ä¸­æ­ç¶æåé¦ breakoff
        $scope.upgradeProcess = 0; // ç³»ç»åçº§è¿åº¦
        let updateInterval;
        let reweldFlag = false;
        function getBasic(socketData) {
            if (!$.isEmptyObject(socketData)) {
                /* basicæ°æ®å¤ç */
                const data = socketData;
                /* å®æ¶æ°æ®ââç¬å¡å°åæ ï¼
                    tcpï¼å³èè§åº¦ï¼jointsï¼
                    ç³»ç»æ¶é´ï¼time_now; 
                    åå°ç¨åºï¼run_statusï¼
                    ç¨æ·åéï¼user_varï¼
                    å³èç¬å¡å°åæ ï¼joints_posï¼
                    å³èåç¯ç¬å¡å°åæ ï¼rings_posï¼
                    */
                jointsData = data.joints;
                temp_handlej = data.joints;
                temp_updatej = data.joints;
                temp_handletcp = data.tcp;
                temp_updatetcp = data.tcp;
                $scope.qnxSysTime = data.time_now;
                $scope.backgroundRunStatus = data.run_status; // {0:0,1:1,2:1,â¦â¦,8:1}
                $scope.userVarValus = data.user_var; // {0:0,1:1,2:1,â¦â¦,127:1}
                if (isMidNight($scope.qnxSysTime)) {
                    getRobotLock();
                }
                // å³èéä½ç¯
                if (~~data.limit_ring_flag) { // å¼å¯åè½
                    viewer.createRingSegments(data.joints_pos, data.rings_pos, jointRingsParams, jointsData, interfereJointMode, interfereJointSetFlag);
                    $scope.currJointRingONOFF = true;
                } else { // å³é­åè½
                    viewer.destroyRingSegments();
                    $scope.currJointRingONOFF = false;
                }
                /* ä»¥ä¸éå®æ¶æ°æ® */
                // è½´å¹²æ¶åºè§¦å
                // if (data['entry_axis_interference'] != undefined && data['entry_axis_interference'] != null) {

                // }
                // ç«æ¹ä½å¹²æ¶åºè§¦å
                if (data['entry_cube_interference'] != undefined && data['entry_cube_interference'] != null) {
                    data.entry_cube_interference.forEach((item, index) => {
                        interfereCubeData[index].entry = item == 1;
                    });
                    if ($scope.currCubeInterfereONOFF) {
                        viewer.updateCubeInterference(data['entry_cube_interference']);
                    }
                }
                // å®å¨å¢è§¦å
                if (data['entry_safety_planes'] != undefined && data['entry_safety_planes'] != null) {
                    if ($scope.currSafetyPlaneONOFF) {
                        viewer.updatePlaneInterference(data['entry_safety_planes']);
                    }
                }
                // ç³»ç»åçº§è¿åº¦
                if (data['upgrade_info'] != undefined && data['upgrade_info'] != null) {
                    if (!$.isEmptyObject(data['upgrade_info'])) {
                        $scope.upgradeProcess = data.upgrade_info.upgrade_process;
                        $scope.upgradeError = data.upgrade_info.upgrade_error;
                        if (updateInterval) {
                            clearInterval(updateInterval);
                        }
                        updateInterval = setInterval(() => {
                            if (document.getElementById('update').value < 60 && $scope.upgradeProcess < 60) {
                                document.getElementById('update').value = Number(document.getElementById('update').value) + Number(1);
                            } else {
                                clearInterval(updateInterval);
                            }
                        }, 1000);
                    }
                }
                if ($scope.upgradeProcess > 0 && $scope.upgradeProcess < 100) {
                    // åçº§ä¸­
                    $("#softwareUpdateModal").modal('hide');
                    $('#updatePage').css("display", "block");
                    $('#updateLog').css("display", "block");
                    $('#updateText').css("display", "none");
                    $('#updateError').css("display", "none");
                    $('#updateClose').css("display", "none");
                    if (Number(document.getElementById('update').value) < $scope.upgradeProcess) {
                        document.getElementById('update').value = $scope.upgradeProcess;
                    }
                } else if ($scope.upgradeProcess == 100) {
                    // åçº§æå
                    $('#updatePage').css("display", "block");
                    $('#updateLog').css("display", "none");
                    $('#updateText').css("display", "block");
                    $('#updateError').css("display", "none");
                    $('#updateClose').css("display", "none");
                } else if ($scope.upgradeProcess == 0) {
                    // æªåçº§
                    $('#updatePage').css("display", "none");
                    $('#updateLog').css("display", "none");
                    $('#updateText').css("display", "none");
                    $('#updateError').css("display", "none");
                    $('#updateClose').css("display", "none");
                } else {
                    // åçº§å¤±è´¥
                    $('#updatePage').css("display", "block");
                    $('#updateLog').css("display", "none");
                    $('#updateText').css("display", "none");
                    $scope.updateError = $scope.upgradeError;
                    $('#updateError').css("display", "block");
                    $('#updateClose').css("display", "block");
                }
                if (data['tl_cur_pos_base'] != undefined && data['tl_cur_pos_base'] != null) {
                    temp_handlebasetcp = data.tl_cur_pos_base;
                    temp_updatebasetcp = data.tl_cur_pos_base;
                    handleJointData();
                    updateJointData();
                }
                // éå®æ¶æ°æ®
                // ç¨åºè¿è¡åç§°
                if (data['cur_program'] != undefined && data['cur_program'] != null) {
                    if (data.cur_program.indexOf('reweld/reweld') == -1 && data.cur_program.indexOf('reweld/reWeld') == -1) {
                        $scope.curRunProgram.name = data.cur_program;
                        g_fileNameForUpload = $scope.curRunProgram.name;
                        if ($scope.curRunProgram.name) {
                            jumpProgramPage($scope.curRunProgram.name);
                        } else {
                            $scope.curRunProgram.url = null;
                        }
                        reweldFlag = false;
                    } else {
                        reweldFlag = true;
                    }
                }
                // ç¨åºè¿è¡ç¶æ
                if (data['pre_program'] != undefined && data['pre_program'] != null) {
                    $scope.programRunStatus = data.pre_program;
                }
                // å½ååºç¨çç¹ä½è¡¨åç§°
                if (data['point_table'] != undefined && data['point_table'] != null) {
                    g_appliedPointTableName = data.point_table;
                    $scope.curPointTable = data.point_table;
                }
                // æ§å¶ç®±æ°å­è¾åº
                if (data['cl_do'] != undefined && data['cl_do'] != null) {
                    $scope.clDO = data.cl_do;
                }
                // æ§å¶ç®±æ°å­è¾å¥
                if (data['cl_di'] != undefined && data['cl_di'] != null) {
                    $scope.clDI = data.cl_di;
                }
                // æ«ç«¯å·¥å·æ°å­è¾åº
                if (data['tl_do'] != undefined && data['tl_do'] != null) {
                    $scope.toolDO = data.tl_do;
                }
                // æ«ç«¯å·¥å·æ°å­è¾å¥
                if (data['tl_di'] != undefined && data['tl_di'] != null) {
                    $scope.toolDI = data.tl_di;
                }
                // æ§å¶ç®±æ¨¡æ DI è¾å¥
                if (data['vir_cl_di'] != undefined && data['vir_cl_di'] != null) {
                    $scope.vir_clDI = data.vir_cl_di;
                }
                // æ«ç«¯å·¥å·æ¨¡æ DI è¾å¥
                if (data['vir_tl_di'] != undefined && data['vir_tl_di'] != null) {
                    $scope.vir_toolDI = data.vir_tl_di;
                }
                // æ¨¡æ AI è¾å¥ï¼2ä¸ªæ§å¶ç®±ï¼ 1ä¸ªæ«ç«¯å·¥å·
                if (data['vir_ai'] != undefined && data['vir_ai'] != null) {
                    $scope.vir_analog_input = data.vir_ai;
                }
                // å¤é¨æ§å¶ç®±æ°å­è¾åº
                if (data['ext_do'] != undefined && data['ext_do'] != null) {
                    $scope.AuxclDO = data.ext_do;
                }
                // å¤é¨æ§å¶ç®±æ°å­è¾å¥
                if (data['ext_di'] != undefined && data['ext_di'] != null) {
                    $scope.AuxclDI = data.ext_di;
                }
                // å¤é¨æ¨¡æè¾åº
                if (data['ext_ao'] != undefined && data['ext_ao'] != null) {
                    $scope.aux_analog_output = data.ext_ao;
                }
                // å¤é¨æ¨¡æè¾å¥
                if (data['ext_ai'] != undefined && data['ext_ai'] != null) {
                    $scope.aux_analog_input = data.ext_ai;
                }
                // æ¨¡æè¾åºï¼4ä¸ªæ§å¶ç®±ï¼2ä¸ªæ«ç«¯å·¥å·
                if (data['ao'] != undefined && data['ao'] != null) {
                    handleAoData(data.ao);
                }
                // æ¨¡æè¾å¥ï¼4ä¸ªæ§å¶ç®±ï¼2ä¸ªæ«ç«¯å·¥å·
                if (data['ai'] != undefined && data['ai'] != null) {
                    handleAiData(data.ai);
                }
                // å½åæºå¨äººæ¨¡å¼
                if (data['mode'] != undefined && data['mode'] != null) {
                    $scope.controlMode = data.mode;
                    $scope.modeName = $scope.modeArray[data.mode].mode_name;
                    sessionStorage.setItem('controlMode', JSON.stringify($scope.controlMode));
                    if (document.getElementById("editor") != null || document.getElementById("editor") != undefined) {
                        var editor = ace.edit("editor");
                        if ($scope.controlMode != 1) {
                            editor.setReadOnly(true);
                        } else {
                            editor.setReadOnly(false);
                        }
                    }
                    if ($scope.indexTeachPendantData.isManual && $scope.controlMode == 1) {
                        $scope.setDragMode(1);
                        $scope.indexTeachPendantData.isManual = false;
                    }
                }
                // å½åå·¥å·å·
                if (data['toolnum'] != undefined && data['toolnum'] != null) {
                    $scope.currentCoord = data.toolnum;
                    $scope.showApplyTool = false;
                    // ç¶ææ åç¤ºæç®¡çä¸­å·¥å·åæ ç³»åç§°å¤ç
                    if ($scope.currentCoord < $scope.indexToolCoordeTotal) {
                        $scope.currentCoordDis = "Tool" + $scope.currentCoord;
                        getCurrToolCoordName($scope.currentCoord);
                    } else {
                        $scope.currentCoordDis = "Etool" + ($scope.currentCoord - $scope.indexToolCoordeTotal);
                        getCurrExToolCoordName($scope.currentCoord - $scope.indexToolCoordeTotal);
                    }
                }
                if (g_renameToolCoordFlag) {
                    getCurrToolCoordName($scope.currentCoord);
                    g_renameToolCoordFlag = 0;
                }
                if (g_renameExToolCoordFlag) {
                    getCurrExToolCoordName($scope.currentCoord - $scope.indexToolCoordeTotal);
                    g_renameExToolCoordFlag = 0;
                }
                // è¿ç¨æ¨¡å¼æºå¨äººéç½®ä¿¡æ¯æ°æ®å¤çââââå·¥å·åæ ç³»åæ° ä¸æ¬¡åå½åå·¥å·åæ ç³»ï¼è¥ä¸ååè§¦å
                if (lastToolName == undefined) {
                    lastToolName = $scope.currentCoord;
                    currToolName = $scope.currentCoord;
                    $scope.selectIndexToolCoorde = $scope.index_ToolCoordeData.filter(item => item.id == lastToolName)[0];
                    $scope.selectedindexEndLoad = $scope.indexEndLoadData[$scope.selectIndexToolCoorde.load_id];
                } else {
                    lastToolName = currToolName;
                    currToolName = $scope.currentCoord;
                    if (currToolName != lastToolName) {
                        $scope.selectIndexToolCoorde = $scope.index_ToolCoordeData.filter(item => item.id == currToolName)[0];
                        //è´è½½åæ ç³»åæ°
                        $scope.selectedindexEndLoad = $scope.indexEndLoadData[$scope.selectIndexToolCoorde.load_id];
                    }
                }
                // å½åå·¥ä»¶å·
                if (data['workpiecenum'] != undefined && data['workpiecenum'] != null) {
                    $scope.currentWobjCoord = data.workpiecenum;
                    // ç¤ºæç®¡çä¸­å·¥ä»¶åæ ç³»åç§°
                    $scope.currentWobjCoordDis = "Wobj" + data.workpiecenum;
                    $scope.showApplyWobj = false;
                }
                // å½åè´è½½ï¼ç¼å·ãééãè´¨å¿åæ ï¼
                if (data['load_status'] != undefined && data['load_status'] != null) {
                    $scope.currentLoad.id = data.load_status.loadNum;
                    $scope.currentLoad.weight = data.load_status.loadWeight;
                    $scope.currentLoad.coord = data.load_status.loadCoord;
                    getCurrEndLoadName($scope.currentLoad.id);
                }
                if (g_renameLoadFlag) {
                    getCurrEndLoadName($scope.currentLoad.id);
                    g_renameLoadFlag = 0;
                }
                // è¿ç¨æ¨¡å¼æºå¨äººéç½®ä¿¡æ¯æ°æ®å¤çââââå·¥ä»¶åæ ç³»åæ° ä¸æ¬¡åå½åå·¥å·åæ ç³»ï¼è¥ä¸ååè§¦å
                if (lastWobjName == undefined) {
                    lastWobjName = $scope.currentWobjCoord;
                    currWobjName = $scope.currentWobjCoord;
                    $scope.selectWobjCoordeDataDisplay = $scope.wobjCoordeNewData[lastWobjName];
                    $scope.selectApplyWobj = $scope.wobjCoordeNewData[lastWobjName];
                } else {
                    lastWobjName = currWobjName;
                    currWobjName = $scope.currentWobjCoord;
                    if (currWobjName != lastWobjName) {
                        $scope.selectWobjCoordeDataDisplay = $scope.wobjCoordeNewData[currWobjName];
                    }
                    $scope.selectApplyWobj = $scope.wobjCoordeNewData[currWobjName];
                } 
                if ($scope.controlWorkpiece) {
                    if (forceRenderingWorkpieceCS) {
                        viewer.displayCoordinateSystem(2,
                            (($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['x']) / 1000).toFixed(4),
                            (($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['y']) / 1000).toFixed(4),
                            (($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['z']) / 1000).toFixed(4),
                            (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['rx'])).toFixed(1),
                            (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['ry'])).toFixed(1),
                            (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + $scope.currentWobjCoord]['rz'])).toFixed(1),
                            0.3
                        );
                        forceRenderingWorkpieceCS = 0;
                        if (lastWorkpieceCSIndex == undefined) {
                            lastWorkpieceCSIndex = $scope.currentWobjCoord;
                            currWorkpieceCSIndex = $scope.currentWobjCoord;
                        }
                    } else {
                        if (lastWorkpieceCSIndex == undefined) {
                            lastWorkpieceCSIndex = $scope.currentWobjCoord;
                            currWorkpieceCSIndex = $scope.currentWobjCoord;
                            // åå§åå·¥ä»¶åæ ç³»ä¸ç»´æ¨¡å
                            viewer.displayCoordinateSystem(2,
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['x']) / 1000).toFixed(4),
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['y']) / 1000).toFixed(4),
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['z']) / 1000).toFixed(4),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['rx'])).toFixed(1),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['ry'])).toFixed(1),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['rz'])).toFixed(1),
                                0.3
                            );
                        } else {
                            lastWorkpieceCSIndex = currWorkpieceCSIndex;
                            currWorkpieceCSIndex = $scope.currentWobjCoord;
                            // æ´æ°å·¥ä»¶åæ ç³»ä¸ç»´æ¨¡å
                            viewer.clearCoordinateSystem(2);
                            viewer.displayCoordinateSystem(2,
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['x']) / 1000).toFixed(4),
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['y']) / 1000).toFixed(4),
                                (($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['z']) / 1000).toFixed(4),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['rx'])).toFixed(1),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['ry'])).toFixed(1),
                                (parseInt($scope.wobjCoordeDataDisplay["wobjcoord" + currWorkpieceCSIndex]['rz'])).toFixed(1),
                                0.3
                            );
                        }
                    }
                }
                // å½åTCPåæ æ°æ®
                if (data['tl_cur_pos_base'] != undefined && data['tl_cur_pos_base'] != null) {
                    // ä¸ç»´æ¨¡ææºå¨äºº--ç»å¶è½¨è¿¹
                    if (DrawTrackFlg && $scope.controlTrack) {
                        startDrawTrack((data.tl_cur_pos_base[0]).toFixed(1) / 1000, (data.tl_cur_pos_base[1]).toFixed(1) / 1000, (data.tl_cur_pos_base[2]).toFixed(1) / 1000);
                    }
                    // ä¸ç»´æ¨¡ææºå¨äºº--å·¥å·åæ ç³»çåæ ç»å¶
                    if ($scope.controlTool) {
                        viewer.clearCoordinateSystem(1);
                        viewer.displayCoordinateSystem(1,
                            (data.tl_cur_pos_base[0]).toFixed(1) / 1000,
                            (data.tl_cur_pos_base[1]).toFixed(1) / 1000,
                            (data.tl_cur_pos_base[2]).toFixed(1) / 1000,
                            (data.tl_cur_pos_base[3]).toFixed(1),
                            (data.tl_cur_pos_base[4]).toFixed(1),
                            (data.tl_cur_pos_base[5]).toFixed(1),
                            0.2
                        );
                    }
                }
                // $scope.robotTypeCode = data.robot_type;
                // $scope.robotType = $scope.robotTypeDict[data.robot_type].typename;
                // è®¾å®åæ£æ¥é¶ç¹æ¯å¦è®¾å®æå
                if (data['flag_zero_set'] != undefined && data['flag_zero_set'] != null) {
                    $scope.zeroFlag = ~~(data.flag_zero_set);
                }
                if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                    document.getElementById('systemSetting').dispatchEvent(new CustomEvent('zeroset', { bubbles: true, cancelable: true, composed: true, detail: $scope.zeroFlag }));
                }
                // å¤é¨è½´ä½ç½®
                if (data['exAxisPos'] != undefined && data['exAxisPos'] != null) {
                    $scope.exAxisPos = data.exAxisPos;
                    document.dispatchEvent(new CustomEvent('exaxisstate', { bubbles: true, cancelable: true, composed: true, detail: data.exAxisPos }));
                }
                // å¤é¨è½´éåº¦
                if (data['exAxisSpeedBack'] != undefined && data['exAxisSpeedBack'] != null) {
                    $scope.exAxisSpeed = data.exAxisSpeedBack;
                }
                // å¤é¨è½´ä¼ºæä½¿è½
                if (data['exAxisRDY'] != undefined && data['exAxisRDY'] != null) {
                    $scope.EAxisRDY = data.exAxisRDY;
                }
                // å¤é¨è½´ä¼ºæå°ä½
                if (data['exAxisINPOS'] != undefined && data['exAxisINPOS'] != null) {
                    $scope.EAxisINPOS = data.exAxisINPOS;
                }
                // UDPéè®¯å è½½æå
                if (data['UDPConnState'] != undefined && data['UDPConnState'] != null) {
                    $scope.connectUDPFlag = data.UDPConnState == '1' ? true : false;
                }
                // å¤é¨è½´åé¶ç¶æ
                if (data['exAxisHomeStatus'] != undefined && data['exAxisHomeStatus'] != null) {
                    $scope.exAxisHome = data.exAxisHomeStatus;
                    if ($scope.exAxisZeroSetFlag == 0) {
                        document.dispatchEvent(new CustomEvent('EAxisZero', { bubbles: true, cancelable: true, composed: true, detail: data.exAxisHomeStatus }));
                    } else {
                        if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('EAxisZero', { bubbles: true, cancelable: true, composed: true, detail: data.exAxisHomeStatus }));
                        }
                    }
                }
                // å½åå¤é¨è½´è¿å¨ç¶æï¼0-å®æï¼1-è¿å¨ä¸­ï¼2-æåä¸­ï¼3-æåå®æ
                if (data['exAxisMotionStatus'] != undefined && data['exAxisMotionStatus'] != null) {
                    $scope.exAxisMotionStatus = data.exAxisMotionStatus;
                }
                // Register var
                if (data['var'] != undefined && data['var'] != null) {
                    combineVar(data.var.num_total,data.var.num_name,data.var.num_value,data.var.str_total,data.var.str_name,data.var.str_value)
                }
                // æååè½
                if (data['pause_parameter'] != undefined && data['pause_parameter'] != null) {
                    $scope.pauseParameter = data.pause_parameter;
                    if (lastPauseParameter == undefined) {
                        lastPauseParameter = $scope.pauseParameter;
                        currPauseParameter = $scope.pauseParameter;
                    } else {
                        lastPauseParameter = currPauseParameter;
                        currPauseParameter = $scope.pauseParameter;
                    }
                    if (lastPauseParameter != currPauseParameter) {
                        document.dispatchEvent(new CustomEvent('pauseFunc', { bubbles: true, cancelable: true, composed: true, detail: currPauseParameter }));
                    }
                }
                // modbus tcp æ°æ®ç¶æ
                if (data['modbus'] != undefined && data['modbus'] != null) {
                    if (!$.isEmptyObject(data.modbus)) {
                        $scope.modbusStateData = data.modbus;
                    } else {
                        $scope.modbusStateData = {
                            slaveDI: [],
                            slaveDO: [],
                            slaveAI: [],
                            slaveAO: [],
                            masterstate: [],
                            mastervalue: [],
                            slaveFuncDIState: [],//ä»ç«åè½DIè¾å¥ç¶æ
                            slaveDOCtrlDIState: [],//ä»ç«æ§å¶DOè¾åºåè½çDIè¾å¥ç¶æ
                            slaveConnect: 0,//modbusä»ç«è¿æ¥ç¶æ
                        }
                    }
                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('updateModbus', { bubbles: true, cancelable: true, composed: true }));
                    }
                }
                // modbus rtuæ°æ®ç¶æ
                if (data['modbusRTU'] != undefined && data['modbusRTU'] != null) {
                    if (!$.isEmptyObject(data.modbusRTU)) {
                        $scope.modbusRtuStateData = data.modbusRTU;
                    } else {
                        $scope.modbusRtuStateData = {
                            modbusRTUSlaveDI: [],
                            modbusRTUSlaveDO: [],
                            modbusRTUSlaveAI: [],
                            modbusRTUSlaveAO: [],
                            mdbsRTUSlaveCtrlValue: [],
                            mdbsRTUSlavectrlRobotState: [],
                        }
                    }
                }
                // æ©å±è½´ä¼ºæé©±å¨å¨ç¶æåé¦
                if (data['aux_servo_state'] != undefined && data['aux_servo_state'] != null) {
                    $scope.auxServoData = data.aux_servo_state;
                }
                // å¸çéç½®ä¿¡æ¯ç¶æåé¦
                if (data['sucker_ctrl_data'] != undefined && data['sucker_ctrl_data'] != null) {
                    $scope.suckerData = data.sucker_ctrl_data;
                }
                // æç£¨è®¾å¤ç¶æåé¦
                if (data['polishing_state'] != undefined && data['polishing_state'] != null) {
                    $scope.polishData = data.polishing_state;
                    $scope.polishPosInfo = ($scope.polishData.pos).toFixed(2);
                    if ($scope.polishData.operationmode != 0) {
                        $scope.polishModeInfo = $scope.polishModeData.filter(item => item.id == $scope.polishData.operationmode)[0].name;
                    }
                }
                // DFCæç£¨å¤´ç¶æåé¦
                if (data['DFC_state'] != undefined && data['DFC_state'] != null) {
                    $scope.dfcPolishData = data.DFC_state;
                }
                // å¤¹çªç¶æåé¦
                if (data['gripper_status'] != undefined && data['gripper_status'] != null) {
                    $scope.gripperStateData = data.gripper_status;
                }
                // CNCæºåºç¶æåé¦
                if (data['cnc_sys_state'] != undefined && data['cnc_sys_state'] != null) {
                    if ($scope.CNCCompany.find(item => item.id == Number(data.cnc_sys_state.device_manucfactor))) {
                        $scope.CNCStatusData.company = $scope.CNCCompany.find(item => item.id == Number(data.cnc_sys_state.device_manucfactor));
                    }
                    if ($scope.CNCTypeData.find(item => item.id == Number(data.cnc_sys_state.cnc_type))) {
                        $scope.CNCStatusData.type = $scope.CNCTypeData.find(item => item.id == Number(data.cnc_sys_state.cnc_type));
                    }
                    if ($scope.CNCFocasStatus.find(item => item.id == Number(data.cnc_sys_state.com_state))) {
                        $scope.CNCStatusData.focas = $scope.CNCFocasStatus.find(item => item.id == Number(data.cnc_sys_state.com_state));
                    } else {
                        $scope.CNCStatusData.focas = $scope.CNCFocasStatus[1];
                    }
                    if ($scope.CNCRunStatus.find(item => item.id == Number(data.cnc_sys_state.run_state))) {
                        $scope.CNCStatusData.run = $scope.CNCRunStatus.find(item => item.id == Number(data.cnc_sys_state.run_state));
                    }
                    if ($scope.CNCEmergencyStatus.find(item => item.id == Number(data.cnc_sys_state.emergency_state))) {
                        $scope.CNCStatusData.emergency = $scope.CNCEmergencyStatus.find(item => item.id == Number(data.cnc_sys_state.emergency_state));
                    }
                    if ($scope.CNCAlarmStatus.find(item => item.id == Number(data.cnc_sys_state.alarm_state))) {
                        $scope.CNCStatusData.alarm = $scope.CNCAlarmStatus.find(item => item.id == Number(data.cnc_sys_state.alarm_state));
                    }
                    if ($scope.CNCDoorStatus.find(item => item.id == Number(data.cnc_sys_state.door_state))) {
                        $scope.CNCStatusData.door = $scope.CNCDoorStatus.find(item => item.id == Number(data.cnc_sys_state.door_state));
                    }
                    if ($scope.CNCChuckStatus.find(item => item.id == Number(data.cnc_sys_state.axis4_state))) {
                        $scope.CNCStatusData.chuck = $scope.CNCChuckStatus.find(item => item.id == Number(data.cnc_sys_state.axis4_state));
                    }
                }
                // æ§å¶å¨å¼æ¾åè®®è¿è¡ç¶æ
                if (data['ctrl_openlua'] != undefined && data['ctrl_openlua'] != null) {
                    $scope.ctrlOpenluaData = data.ctrl_openlua;
                    //bit0-bit3å¯¹åºåè®®ç¼å·0-3çè¿è¡ç¶æï¼0-æªè¿è¡ï¼1-è¿è¡ä¸­
                    $scope.ctrlOpenLuaRunningData = $scope.ctrlOpenluaData.ctrlOpenLuaRunningState;
                    //4ä¸ªæ§å¶å¨å¤è®¾åè®®éè¯¯ç 
                    $scope.ctrlOpenLuaErrCodeData = $scope.ctrlOpenluaData.ctrlOpenLuaErrCode.split(",");
                }
                //å®å¨æ¿éä¿¡å¥åº·æ£æµæ°æ®
                if (data['safetyBoardComSendCount'] != undefined && data['safetyBoardComSendCount'] != null) {
                    $scope.safetyBoardCount = data.safetyBoardComSendCount;
                }
                if (data['safetyBoardComRecvCount'] != undefined && data['safetyBoardComRecvCount'] != null) {
                    $scope.safetyBoardRecvCount = data.safetyBoardComRecvCount;
                }
                // æºå¨äººè¿ç¨æ¨¡å¼ç¶æåé¦
                if (data['remote_ctrl_interface'] != undefined && data['remote_ctrl_interface'] != null) {
                    $scope.robotControlMode = data.remote_ctrl_interface;
                    $scope.remoteControlMode = data.remote_ctrl_interface.robot_ctrl_mode;
                    $scope.robotControlModeName = data.remote_ctrl_interface.robot_ctrl_mode == 0 ? indexDynamicTags.info_messages[35] : indexDynamicTags.info_messages[36];
                    // æºå¨äººè©ç¶æ
                    $scope.shoulderConfigData = $scope.shoulderModeData[~~data.remote_ctrl_interface.shoulderconfig].name;
                    // æºå¨äººèç¶æ
                    $scope.elbowConfigData = $scope.elbowModeData[~~data.remote_ctrl_interface.elbowconfig].name;
                    // æºå¨äººèç¶æ
                    $scope.wristConfigData = $scope.wristModeData[~~data.remote_ctrl_interface.wristconfig].name;
                    // æºå¨äººæ¬å°/è¿ç¨æ¨¡å¼ç¶æ
                    if (lastRobotCtrlMode != $scope.robotControlMode.robot_ctrl_mode) {
                        if ($scope.robotControlMode.robot_ctrl_mode == 1) {
                            $scope.halfBothView();
                            $('#vRobot-view').css('z-index', 1048);
                            $('#remoteControlStatusPage').show();
                        } else {
                            $('#remoteControlStatusPage').hide();
                        }
                        lastRobotCtrlMode = $scope.robotControlMode.robot_ctrl_mode;
                    }
                }
                if ($scope.remoteControlMode) {
                    // å¦æå¨è¿ç¨æ¨¡å¼,å¼å¯å®æ¶å¨
                    if (setTimeFlag != 1) {
                        clearInterval(repeatFlag);
                        repeatFlag = setInterval(repeatRefreshData, 10000);
                        setTimeFlag = 1;
                    }
                } else {
                    clearInterval(repeatFlag); //éåºè¿ç¨æ¨¡å¼ï¼å³é­å®æ¶å¨
                    setTimeFlag = 0;
                }
                // çæºè®¾å¤ç¶æåé¦
                if (data['weld_state'] != undefined && data['weld_state'] != null) {
                    $scope.weldStatusData = data.weld_state;
                }
                // çæ¥ä¸­æ­ç¶æåé¦
                if (data['reweld_break_off_state'] != undefined && data['reweld_break_off_state'] != null) {
                    $scope.reweldBreakData = data.reweld_break_off_state;
                    if ($scope.reweldBreakData.breakoff == 0) {
                        if ($scope.recordState != 0) {
                            $scope.recordState = 0;
                        }
                    } else {
                        if ($scope.recordState == 0 && $scope.reWeldEnableOpen == 1) {
                            $scope.recordState = 1;
                        }
                    }
                }

                // éè®¯
                if (data['cmdpointerror'] != undefined && data['cmdpointerror'] != null) {
                    $scope.pointError = data.cmdpointerror; // 0-æ­£å¸¸ 83ï¼UDPéè®¯å¼å¸¸ 84:éè®¯ä¸¢åå¼å¸¸
                    if ($scope.pointError == 83 || $scope.pointError == 84 || $scope.pointError == 89 || $scope.pointError == 90) {
                        if (pointErrorFlag != true) {
                            $("#errorlist").click();
                            pointErrorFlag = true;
                        }
                    } else {
                        pointErrorFlag = false;
                    }
                }

                // æ«ç«¯Luaæä»¶å¼å¸¸
                if (data['endLuaErrCode'] != undefined && data['endLuaErrCode'] != null) {
                    $scope.pointErrorNew = data.endLuaErrCode; // 0-æ­£å¸¸ï¼1-å¼å¸¸
                    if ($scope.pointErrorNew == 1) {
                        if (pointErrorFlag != true) {
                            $("#errorlist").click();
                            pointErrorFlag = true;
                        }
                    } else {
                        pointErrorFlag = false;
                    }
                }

                // å®å¨åæ­¢å·²è§¦å
                if (data['safety_stop'] != undefined && data['safety_stop'] != null) {
                    $scope.safetyStopFlag = data.safety_stop; // 0-æ­£å¸¸ï¼1-å®å¨åæ­¢è§¦å 2-å·²è¿å¥å®å¨ç§»å¨
                    if ($scope.safetyStopFlag >= 1) {
                        if (pointErrorFlag != true) {
                            $("#errorlist").click();
                            pointErrorFlag = true;
                        }
                    } else {
                        pointErrorFlag = false;
                    }
                }

                // ç¢°ææ£æµç¶æ
                if (data['force_drag_collision'] != undefined && data['force_drag_collision'] != null) {
                    $scope.forceDragCollision = data.force_drag_collision; // 0-å³é­ï¼1-å¼å¯
                    if ($scope.forceDragCollision == 1) {
                        if (pointErrorFlag != true) {
                            $("#errorlist").click();
                            pointErrorFlag = true;
                        }
                    } else {
                        pointErrorFlag = false;
                    }
                }

                // å¤æ­æé®çç¶æ
                if (data['pushBtnBoxState'] != undefined && data['pushBtnBoxState'] != null) {
                    $scope.pushBtnBoxState = ~~data.pushBtnBoxState;
                }
                if ($scope.indexSafeStopMode == 1) {
                    if ($scope.pushBtnBoxState == 1) {
                        var mainbody_mychar = document.getElementById("indexmainbody");
                        if (mainbody_mychar) {
                            mainbody_mychar.style.display = "none";
                        }
                        var mainbodytips_mychar = document.getElementById("indexmaintips");
                        if (mainbodytips_mychar) {
                            mainbodytips_mychar.style.display = "";
                        }
                    } else {
                        var mainbody_mychar = document.getElementById("indexmainbody");
                        if (mainbody_mychar) {
                            mainbody_mychar.style.display = "";
                        }
                        var mainbodytips_mychar = document.getElementById("indexmaintips");
                        if (mainbodytips_mychar) {
                            mainbodytips_mychar.style.display = "none";
                        }
                    }
                } else {
                    var mainbody_mychar = document.getElementById("indexmainbody");
                    if (mainbody_mychar) {
                        mainbody_mychar.style.display = "";
                    }
                    var mainbodytips_mychar = document.getElementById("indexmaintips");
                    if (mainbodytips_mychar) {
                        mainbodytips_mychar.style.display = "none";
                    }
                }
                // æºå¨äººä½¿è½ç¶æ
                if (data['rbtEnableState'] != undefined && data['rbtEnableState'] != null) {
                    $scope.robotEnableState = ~~data.rbtEnableState;
                }
                // æ«ç«¯è®°å½é¶çID
                if (data['axle_btn_sensor_id'] != undefined && data['axle_btn_sensor_id'] != null) {
                    $scope.recordBtnSensorId = ~~data.axle_btn_sensor_id;
                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('recordBtnSensorId', { bubbles: true, cancelable: true, composed: true, detail: $scope.recordBtnSensorId }));
                    }
                }
                // çç¼è·è¸ªéåº¦
                if (data['weldTrackSpeed'] != undefined && data['weldTrackSpeed'] != null) {
                    $scope.weldTrackSpeed = data.weldTrackSpeed.toFixed(3);
                }
                // ä¼ éå¸¦éåº¦
                if (data['conveyor_speed'] != undefined && data['conveyor_speed'] != null) {
                    $scope.conveyorSpeed = data.conveyor_speed.toFixed(3);
                }
                // ä¼ éå¸¦å·¥ä»¶å½åä½ç½®
                if (data['conveyorWorkPiecePos'] != undefined && data['conveyorWorkPiecePos'] != null) {
                    $scope.conveyorWorkPiecePos = data.conveyorWorkPiecePos.toFixed(3);
                }
                // ä¼ éå¸¦ç¼ç å¨ä½ç½®
                if (data['conveyor_encoder_pos'] != undefined && data['conveyor_encoder_pos'] != null) {
                    $scope.conveyor_encoder_pos = data.conveyor_encoder_pos;
                }
                // å®½çµåæ§å¶ç®±ç¶ææ°æ®
                if (data['wide_ctrl_box_status'] != undefined && data['wide_ctrl_box_status'] != null) {
                    $scope.wideCtrlBoxStatus = data.wide_ctrl_box_status;
                    $scope.wideCtrlBoxStatus.wide_box_temp = $scope.wideCtrlBoxStatus.wide_box_temp.toFixed(1);
                }
                // ä»ç«æ»çº¿åè®®åæ°
                if (data['field_bus_board'] != undefined && data['field_bus_board'] != null) {
                    $scope.fieldBusData = data.field_bus_board;
                }
                // è´è½½è¾¨è¯ç»æ
                if (data['loadidentifydata'] != undefined && data['loadidentifydata'] != null && data['loadidentifydata'].length) {
                    $scope.IDentWeight = data.loadidentifydata[0];
                    $scope.IDentX = data.loadidentifydata[1];
                    $scope.IDentY = data.loadidentifydata[2];
                    $scope.IDentZ = data.loadidentifydata[3];
                }
                // æ©å±è½´åæ ç³»
                if (data['exaxisnum'] != undefined && data['exaxisnum'] != null) {
                    $scope.currentEAxisCoordDis = "ExAxis" + data.exaxisnum;
                    $scope.exaxisNum = data.exaxisnum;
                }
                if ($scope.controlExAxis) {
                    if (forceRenderingExAxisCS) {
                        viewer.displayCoordinateSystem(3,
                            (($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['x']) / 1000).toFixed(4),
                            (($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['y']) / 1000).toFixed(4),
                            (($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['z']) / 1000).toFixed(4),
                            (parseInt($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['rx'])).toFixed(1),
                            (parseInt($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['ry'])).toFixed(1),
                            (parseInt($scope.EAxisCoordeData_Display["exaxis" + $scope.exaxisNum]['rz'])).toFixed(1),
                            0.3
                        );
                        forceRenderingExAxisCS = 0;
                        if (lastExAxisCSIndex == undefined) {
                            lastExAxisCSIndex = $scope.exaxisNum;
                            currExAxisCSIndex = $scope.exaxisNum;
                        }
                    } else {
                        if (lastExAxisCSIndex == undefined) {
                            lastExAxisCSIndex = $scope.exaxisNum;
                            currExAxisCSIndex = $scope.exaxisNum;
                            viewer.displayCoordinateSystem(3,
                                (($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['x']) / 1000).toFixed(4),
                                (($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['y']) / 1000).toFixed(4),
                                (($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['z']) / 1000).toFixed(4),
                                (parseInt($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['rx'])).toFixed(1),
                                (parseInt($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['ry'])).toFixed(1),
                                (parseInt($scope.EAxisCoordeData_Display["exaxis" + currExAxisCSIndex]['rz'])).toFixed(1),
                                0.3
                            );
                        } else {
                            lastExAxisCSIndex = currExAxisCSIndex;
                            currExAxisCSIndex = $scope.exaxisNum;
                            if (currExAxisCSIndex != lastExAxisCSIndex) {
                                viewer.clearCoordinateSystem(3);
                                viewer.displayCoordinateSystem(3,
                                    (($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['x']) / 1000).toFixed(4),
                                    (($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['y']) / 1000).toFixed(4),
                                    (($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['z']) / 1000).toFixed(4),
                                    (parseInt($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['rx'])).toFixed(1),
                                    (parseInt($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['ry'])).toFixed(1),
                                    (parseInt($scope.EAxisCoordeData_Display["exaxis"+currExAxisCSIndex]['rz'])).toFixed(1),
                                    0.3
                                );
                            }
                        }
                    }
                }
                // ç¼ç å¨ç±»ååæ¢å®ææ å¿
                if (data['encoder_type_flag'] != undefined && data['encoder_type_flag'] != null) {
                    $scope.encoderParam.flag = parseInt(data.encoder_type_flag);
                }
                // å½ååè½´ç¼ç å¨ç±»å
                if (data['curencodertype'] != undefined && data['curencodertype'] != null) {
                    $scope.encoderParam.data = [
                        parseInt(data.curencodertype.curencodertype1),
                        parseInt(data.curencodertype.curencodertype2),
                        parseInt(data.curencodertype.curencodertype3),
                        parseInt(data.curencodertype.curencodertype4),
                        parseInt(data.curencodertype.curencodertype5),
                        parseInt(data.curencodertype.curencodertype6),
                    ];
                }
                // æºå¨äººè¿è¡éåº¦æ¯ä¾
                if (data['vel_radio'] != undefined && data['vel_radio'] != null) {
                    $scope.currentSpeed = parseInt(data.vel_radio * 100);
                    $scope.speed = $scope.currentSpeed;
                    $("#index_speed")[0].value = $scope.speed;
                    $scope.getRobotCfg("update_speed");
                }
                // å½åç¨åºè¿è¡ç¶æ
                if (data['program_state'] != undefined && data['program_state'] != null) {
                    $scope.programStatus = programStatusDict[data.program_state];
                    if (g_runProgramFlag && $scope.programStatus == "Stopped") {
                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                            if (g_loadIdentFlag) {
                                document.getElementById('robotSetting').dispatchEvent(new CustomEvent('loadIdentRunning', { bubbles: true, cancelable: true, composed: true }));
                                g_loadIdentFlag = 0;
                            }
                            if (g_forceSensorAutoZeroFlag) {
                                document.getElementById('robotSetting').dispatchEvent(new CustomEvent('forceSensorAutoZeroRunning', { bubbles: true, cancelable: true, composed: true }));
                                g_forceSensorAutoZeroFlag = 0;
                            }
                        }
                        g_runProgramFlag = 0;
                        // çæ¥ä¸­æ­æ¢å¤åæ­¢åå°ä¸­æ­åçç¨åºæ´æ°å°æ§å¶å¨
                        if (reweldFlag) {
                            sendLuaInfo($scope.programRunStatus.name, localStorage.getItem('fileDataforUpload'), '1')
                        }
                    }
                    // çµæåº¦æ å®è¿å¨å®æåè§¦åè·åæ¥å£
                    if ((g_fileNameForUpload == "JointSensitivityCalibration.lua" || g_fileNameForUpload == 'SideInstallJointSensitivityCalibration.lua') && "Stopped" == $scope.programStatus) {
                        if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('updateSensitivityCalibration', { bubbles: true, cancelable: true, composed: true }));
                        }
                    }
                    if ("Drag" === $scope.programStatus) {
                        $scope.dragModeName = indexDynamicTags.info_messages[19];
                        $scope.dragMode = 1;
                    } else {
                        $scope.dragModeName = indexDynamicTags.info_messages[20];
                        $scope.dragMode = 0;
                        if ($scope.indexTeachPendantData.isDragSwitch) {
                            // ç¤ºæå¨é¥åä»èªå®ä¹æè³èªå¨æ¨¡å¼ä¸éåºæå¨æ¨¡å¼åï¼ä¸ååæ¢æå¨/èªå¨æ¨¡å¼æä»¤
                            setMode($scope.indexTeachPendantData.isDragSwitch);
                            $scope.indexTeachPendantData.isDragSwitch = null;
                        }
                    }
                }
                // ç¶ææ¹åæ¶ï¼èªå¨æ´æ°Smart Toolç¨åºæ å¿
                if (data['custom_smarttool'] != undefined && data['custom_smarttool'] != null) {
                    $scope.smartToolPro = data.custom_smarttool;

                    // éç¨åºç¼ç¨çé¢æä½çæ¥æææ¶å¼¹åºæ¡
                    if (document.getElementById('programTeach') == null || document.getElementById('programTeach') == undefined) {
                        $("#smartToolAutoProgramModal").modal('show');
                    }
                    // ç¨åºç¼ç¨çé¢æä½çæ¥ææèªå¨æ´æ°ç¨åº
                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('autoUpdateSmartTool', { bubbles: true, cancelable: true, composed: true, detail: $scope.smartToolPro }));
                    }
                }
                // TPDè®°å½ç¶æ
                if (data['tpd_record_state'] != undefined && data['tpd_record_state'] != null) {
                    tpd_record_state = ~~data.tpd_record_state;
                    if (0 == tpd_record_state) {
                        $scope.tpdState = indexDynamicTags.info_messages[22];
                    }
                }
                // TPDè®°å½è¿åº¦ç¾åæ¯
                if (data['tpd_record_scale'] != undefined && data['tpd_record_scale'] != null) {
                    if (1 == tpd_record_state) {
                        $scope.tpdState = indexDynamicTags.info_messages[21] + data.tpd_record_scale.toFixed(3) + "%";
                    }
                }
                // å/æ­ç©ä¼ æå¨æ°æ®
                if (data['FT_data'] != undefined && data['FT_data'] != null) {
                    for (let i = 0; i < data.FT_data.length; i++) {
                        if (null == data.FT_data[i]) {
                        } else {
                            $scope.currentFT[i] = data.FT_data[i].toFixed(3);
                        }
                    }
                }
                // æ£æ¥Socketè¿æ¥ç¶æ
                if (data['socket_connect_enable'] != undefined && data['socket_connect_enable'] != null) {
                    $scope.socketConnectData = data.socket_connect_enable;
                }
                // æ£æ¥æºå¨äººè¿æ¥ç¶æ
                if (data['cons'] != undefined && data['cons'] != null) {
                    $scope.connectionStatus = data.cons;
                    $scope.connectionText = $scope.consArray[data.cons];
                }
                if (!lastCons && $scope.connectionStatus) {
                    getModeSwitchSpeedConfig();
                }
                if (lastCons != $scope.connectionStatus) {
                    lastCons = $scope.connectionStatus;
                }
                // åæ­¥æ§è¡æ¶ï¼å½è¿è¡ç¶ææ¯2æ¶ï¼è®¾ç½®lastProgramStateä¸º2
                if (soFlg == 1) {
                    if (data.program_state == 2) {
                        DrawTrackFlg = true;
                        if (lastProgramState != 2) {
                            lastProgramState = 2;
                        }
                    }
                }
                // dofileå¯¹åºå±æ°
                if (data['ndf_layer'] != undefined && data['ndf_layer'] != null) {
                    $scope.ptData.ndf_layer = ~~data.ndf_layer;
                }
                // NewDofile æå¨æä»¶å±ç¼å·
                if (data['ndf_id'] != undefined && data['ndf_id'] != null) {
                    $scope.ptData.ndf_id = ~~data.ndf_id;
                }
                // NewDofile æå¨æä»¶ç¨åºè¡è¡å·
                if (data['ndf_row'] != undefined && data['ndf_row'] != null) {
                    $scope.ptData.ndf_row = ~~data.ndf_row;
                }
                // æºå¨äººç¨åºè¿è¡è¡
                if (data['line_number'] != undefined && data['line_number'] != null) {
                    $scope.ptData.line_number = ~~data.line_number;
                }
                //æºå¨äººåæ­¢ç¶æä¸æåä¸è¡è¡å·åæ¶åéè¿æ¥éè¦å¤ç
                if (data.program_state == 2) {
                    $scope.protmpstate = 1;
                }
                // æ ¹æ®æºå¨äººæ¯å¦æ¯è¿è¡ç¶æä¸åæ­¥æ§è¡soFlgæ å¿ä¸º0æ´æ°å½ä»¤è¡é«äº®
                if ($scope.protmpstate == 1 && soFlg == 0) {
                    // if ($scope.trackNumber !== data.line_number) {
                    //     $scope.trackNumber = data.line_number;
                    //     clearTrack();
                    //   DrawTrackFlg = true;
                    // }
                    $scope.ptData.currentRunningProgram = g_fileNameForUpload;
                    if (document.getElementById('programTeach') && g_runProgramFlag) {
                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('RL_Highlight', { bubbles: true, cancelable: true, composed: true, detail: $scope.ptData }));   
                    }
                    lastProgramState = 2;
                }
                // å¦æä¸æ¬¡æ¯ç¨åºè¿è¡ç¶æå¹¶ä¸å½åæ¯ç¨åºåæ­¢ç¶æï¼åæ¸é¤ææç¨åºå½ä»¤è¡é«äº®ç¶æ
                if (lastProgramState == 2 && data.program_state == 1) {
                    //ä¸æ¸é¤å½ä»¤è¡é«äº®ç¶æ
                    //document.dispatchEvent(new CustomEvent('No_Highlight', { bubbles: true, cancelable: true, composed: true }));
                    lastProgramState = 0;
                    $scope.protmpstate = 0;
                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('program-completion', { bubbles: true, cancelable: true, composed: true, detail: data.program_state }));   
                    }
                }
                // æé®çæ¥åä¿¡å·
                if (data['btn_box_stop_signal'] != undefined && data['btn_box_stop_signal'] != null) {
                    if (data.btn_box_stop_signal == 1) {
                        if ($scope.btn_gif_flag) {
                            $scope.btn_gif_flag = 0;
                            var mychar = document.getElementById("carshstop");
                            if (mychar) {
                                mychar.style.display = "block";
                            }
                        }
                    } else if (data.btn_box_stop_signal == 0) {
                        $scope.btn_gif_flag = 1;
                    }
                }
                // å¤¹çªæ¿æ´»ç¶æ
                if (data['gripper_state'] != undefined && data['gripper_state'] != null) {
                    $scope.gripper_state =  data.gripper_state;
                }
                if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                    document.getElementById('peripheral').dispatchEvent(new CustomEvent('gripperstate', { bubbles: true, cancelable: true, composed: true, detail: $scope.gripper_state }));   
                }
                // å/æ­ç©ä¼ æå¨æ¿æ´»ç¶æ
                if (data['FT_ActStatus'] != undefined && data['FT_ActStatus'] != null) {
                    $scope.FT_ActStatus = ~~data.FT_ActStatus;
                    //document.dispatchEvent(new CustomEvent('FTstate', { bubbles: true, cancelable: true, composed: true, detail: data.FT_ActStatus }));
                }
                // ç¶ææ¥è¯¢æ å¿ï¼0-æªæ¥è¯¢ï¼1-æ¥è¯¢ä¸­
                if (data['state'] != undefined && data['state'] != null) {
                    $scope.queryState = data['state'];
                }
                if (data['set_feedback'] != undefined && data['set_feedback'] != null) {
                    $scope.setFeedError = false;
                    setFBJson = data.set_feedback;
                    if (!$.isEmptyObject(setFBJson)) {
                        for (const name in setFBJson) {
                            // æä»¤å¤±è´¥æç¤ºåå¤ç
                            if (setFBJson[name] == "0") {
                                if (setErrorDict[name] != undefined && setErrorDict[name] != null) {
                                    if (setErrorDict[name] == "500" || setErrorDict[name] == "503") {
                                        toastr.error(setErrorDict[name].description + setErrorDict[name][~~setFBJson[name]]);
                                    } else {
                                        toastr.error(setErrorDict[name] + setErrorDict[~~setFBJson[name]]);
                                    }
                                }
                                switch (name) {
                                    case '708':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('708', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '740':
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('740', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '742':
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('742', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '750':
                                        document.dispatchEvent(new CustomEvent('750', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    default:
                                        break;
                                }
                            // æä»¤æåå¤ç
                            } else if ((setFBJson[name] == "1") && (name != "105") && (name != "345")) {
                                switch (name) {
                                    case '102':
                                        if (g_torqueMovePointStop) {
                                            g_torqueMovePointStop = false;
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('torque-sensor-zero-stop', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('102', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '103':
                                        if (g_torqueMovePointStop) {
                                            g_torqueMovePointStop = false;
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('torque-sensor-zero-stop', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '206':
                                        if (document.getElementById("programTeach") != null && document.getElementById("programTeach") != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('206', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '230':
                                        if (document.getElementById("monitor") != null && document.getElementById("monitor") != undefined) {
                                            document.getElementById('monitor').dispatchEvent(new CustomEvent('230', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('230', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '231':
                                        if (document.getElementById("monitor") != null && document.getElementById("monitor") != undefined) {
                                            document.getElementById('monitor').dispatchEvent(new CustomEvent('231', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('231', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '261':
                                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                            document.getElementById("robotSetting").dispatchEvent(new CustomEvent('261', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '265':
                                        if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                            document.getElementById('peripheral').dispatchEvent(new CustomEvent('265', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '267':
                                        if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                            document.getElementById('peripheral').dispatchEvent(new CustomEvent('267', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '273':
                                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                            document.getElementById("robotSetting").dispatchEvent(new CustomEvent('273', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '276':
                                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                            document.getElementById("robotSetting").dispatchEvent(new CustomEvent('276', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '303':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('303', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '313':
                                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                            document.getElementById("robotSetting").dispatchEvent(new CustomEvent('313', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '332':
                                        document.dispatchEvent(new CustomEvent('332', { bubbles: true, cancelable: true, composed: true }));
                                        if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                            document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('332', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('332', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('332', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '337':
                                        document.dispatchEvent(new CustomEvent('337', { bubbles: true, cancelable: true, composed: true }));
                                        break;
                                    case '357':
                                        if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                            document.getElementById('robotSetting').dispatchEvent(new CustomEvent('357', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '384':
                                        if (document.getElementById("programTeach") != null && document.getElementById("programTeach") != undefined) {
                                            document.getElementById("programTeach").dispatchEvent(new CustomEvent('384', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '391':
                                        if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('391', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '422':
                                        if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                            document.getElementById('peripheral').dispatchEvent(new CustomEvent('422', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '430':
                                        if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                            document.getElementById("safeSet").dispatchEvent(new CustomEvent('430', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        $scope.getRobotInterfereCfg('update_axis_interference'); // ä¸ç»´èæåºæ´æ°è½´å¹²æ¶åºåæ°
                                        break;
                                    case '431':
                                        $scope.getRobotInterfereCfg('update_axis_interference'); // ä¸ç»´èæåºæ´æ°è½´å¹²æ¶åºåæ°
                                        break;
                                    case '432':
                                        if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                            document.getElementById("safeSet").dispatchEvent(new CustomEvent('432', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        $scope.getRobotInterfereCfg('update_cube_interference'); // ä¸ç»´èæåºæ´æ°ç«æ¹ä½å¹²æ¶åºåæ°
                                        break;
                                    case '433':
                                        $scope.getRobotInterfereCfg('update_cube_interference'); // ä¸ç»´èæåºæ´æ°ç«æ¹ä½å¹²æ¶åºåæ°
                                        break;
                                    case '434':
                                        $scope.getRobotInterfereCfg('update_cube_interference'); // ä¸ç»´èæåºæ´æ°ç«æ¹ä½å¹²æ¶åºåæ°
                                        break;
                                    case '435':
                                        $scope.getRobotInterfereCfg('update_cube_interference'); // ä¸ç»´èæåºæ´æ°ç«æ¹ä½å¹²æ¶åºåæ°
                                        break;
                                    case '511':
                                        document.dispatchEvent(new CustomEvent('511', { bubbles: true, cancelable: true, composed: true }));
                                        break;
                                    case '556':
                                        if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                            document.getElementById("robotSetting").dispatchEvent(new CustomEvent('556', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '567':
                                        document.dispatchEvent(new CustomEvent('567', { bubbles: true, cancelable: true, composed: true }));
                                        break;
                                    case '631':
                                        document.dispatchEvent(new CustomEvent('631', { bubbles: true, cancelable: true, composed: true }));
                                        break;
                                    case '651':
                                        if (document.getElementById("robotSetting") != null || document.getElementById("robotSetting") != undefined) {
                                            document.getElementById('robotSetting').dispatchEvent(new CustomEvent('651', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '702':
                                        if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('702', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '708':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('708', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '728':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('728', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '740':
                                        $scope.getRobotCfg('update_plane_interference');
                                        break;
                                    case '741':
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('741', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '742':
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('742', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '743':
                                        $scope.getRobotCfg('update_plane_interference');
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('743', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '748':
                                        if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                            document.getElementById('safeSet').dispatchEvent(new CustomEvent('748', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '750':
                                        document.dispatchEvent(new CustomEvent('750', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case '752':
                                        if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('752', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '754':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('754', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '782':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('782', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '783':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('783', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '784':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('784', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '786':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('786', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    // case '787':
                                    //     if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                    //         document.getElementById("peripheral").dispatchEvent(new CustomEvent('787', { bubbles: true, cancelable: true, composed: true }));
                                    //     }
                                    //     break;
                                    case '788':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('788', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '789':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('789', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '790':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('790', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '801':
                                        if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('801', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '813':
                                        document.dispatchEvent(new CustomEvent('813', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case '814':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('814', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '822':
                                        document.dispatchEvent(new CustomEvent('822', { bubbles: true, cancelable: true, composed: true }));
                                        break;
                                    case '834':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('834', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '947':
                                        document.dispatchEvent(new CustomEvent('947', { bubbles: true, cancelable: true, composed: true }));
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('947', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        if (document.getElementById("auxiliaryApplication") != null || document.getElementById("auxiliaryApplication") != undefined) {
                                            document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('947', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '954':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('954', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '955':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('955', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '966':
                                        if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                            document.getElementById("systemSetting").dispatchEvent(new CustomEvent('966', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1021':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1021', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1022':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1022', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1024':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1024', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1025':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1025', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1026':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1026', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1038':
                                        if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                            document.getElementById("peripheral").dispatchEvent(new CustomEvent('1038', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        break;
                                    case '1044':
                                        if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('1044', { bubbles: true, cancelable: true, composed: true  }));
                                        }
                                        break;
                                    case '1134':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1134', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1137':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1137', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                        }
                                        break;
                                    case '1145':
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1145', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1150':
                                        if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('1150', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1163':
                                        if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('1163', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1170':
                                        if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('1170', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        break;
                                    case '1216':
                                        document.dispatchEvent(new CustomEvent('1216', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    default:
                                        break;
                                }
                            }
                            // æä»¤æ°æ®æå¤çï¼ä¸è®ºæåå¤±è´¥ï¼
                            switch (name) {
                                case '101': 
                                    document.dispatchEvent(new CustomEvent('101', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '105':
                                    if (!g_isRunStepOver) {
                                        document.dispatchEvent(new CustomEvent('105', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    } else {
                                        if (document.getElementById("programTeach") != null && document.getElementById("programTeach") != undefined) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('105', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                    }
                                    break;
                                case '201':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('201', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '206':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('206', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '222':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('222', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '223':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('223', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '224':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('224', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '225':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('225', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '226':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('226', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '227':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('227', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '229':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('229', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('229', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '236':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('236', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '237':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('237', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '238':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('238', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '239':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('239', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '249':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('249', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '250':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('250', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '252':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('252', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '262':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('262', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '264':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('264', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '266':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('266', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '274':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('274', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '277':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('277', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '278':
                                    document.dispatchEvent(new CustomEvent('278', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '279':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('279', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '283':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('283', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '288':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('288', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '289':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('289', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '291':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('291', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '293':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('293', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '294':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('294', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '298':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('298', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '305':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('305', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '308':
                                    if (document.getElementById("robotSetting") != null || document.getElementById("robotSetting") != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('308', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '309':
                                    if (document.getElementById("robotSetting") != null || document.getElementById("robotSetting") != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('309', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '314':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('314', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '316':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('316', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '317':
                                    document.dispatchEvent(new CustomEvent('317', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '320':
                                    if (apply_joint_flag || moveToPackFlag) {
                                        document.dispatchEvent(new CustomEvent('320', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    } else {
                                        if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                            document.getElementById('process').dispatchEvent(new CustomEvent('320', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                            document.getElementById('robotSetting').dispatchEvent(new CustomEvent('320', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                            document.getElementById('systemSetting').dispatchEvent(new CustomEvent('320', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                        if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                            document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('320', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        }
                                    }
                                    break;
                                case '323':
                                    document.dispatchEvent(new CustomEvent('323', { bubbles: true, cancelable: true, composed: true }));
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('323', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('323', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name]}));
                                    }
                                    if (document.getElementById("programTeach") != null && document.getElementById("programTeach") != undefined) {
                                        document.getElementById("programTeach").dispatchEvent(new CustomEvent('323', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name]}));
                                    }
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('323', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('323', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '324':
                                    document.dispatchEvent(new CustomEvent('324', { bubbles: true, cancelable: true, composed: true }));
                                    if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('324', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('324', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('324', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name]}));
                                    }
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('324', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '325':
                                    document.dispatchEvent(new CustomEvent('325', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '326':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('326', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '327':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('327', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '328':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('328', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '329':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('329', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '330':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('330', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '345':
                                    // æºå¨äººè®¾ç½®äºä»¶
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('345', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    // æºå¨äººæ¬ä½
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('345', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    // ç³»ç»è®¾ç½®äºä»¶
                                    if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("systemSetting").dispatchEvent(new CustomEvent('345', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '335':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('335', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '336':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('336', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '359':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('359', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '360':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('360', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '361':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('361', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '362':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('362', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '367':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('367', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '368':
                                    if (document.getElementById('process') != null && document.getElementById('process') != undefined) {
                                        document.getElementById('process').dispatchEvent(new CustomEvent('368', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '369':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('369', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('369', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '371':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('371', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '380':
                                    if (document.getElementById('teachingManagement') != null && document.getElementById('teachingManagement') != undefined) {
                                        g_modifyPointFlag = 1;
                                        g_refreshTableFlag = 1;
                                        document.getElementById('teachingManagement').dispatchEvent(new CustomEvent('380', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '386':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('386', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '387':
                                    if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('387', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '388':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('388', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '389':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('389', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '390':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('390', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '393':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('393', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '400':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('400', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '423':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('423', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '424':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('424', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '428':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('428', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '429':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('429', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '431':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('431', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '433':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('433', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '434':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('434', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '435':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('435', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '436':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('436', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '500':
                                    $scope.setFeedError = true;
                                    const feedErrorTimeout = $timeout(function() {
                                        $scope.setFeedError = false;
                                        // åæ¶$timeout
                                        $timeout.cancel(feedErrorTimeout);
                                    }, 5000);
                                    var error_500_index = setFBJson[name].indexOf(":");//å¤æ­æ¯å¦æ¯æ´æ¡éè¯¯
                                    let record_500_error;
                                    if (error_500_index != -1) {//ä¸æ¯æ´æ¡éè¯¯
                                        let errorCodeArr = setFBJson[name].split(':');//å¤æ­è½åå²æå æ®µ
                                        if (errorCodeArr.length == 4) {
                                            if (errorCodeArr[3] == 88 || errorCodeArr[3] == 90 || errorCodeArr[3] == 91 || errorCodeArr[3] == 160 || errorCodeArr[3] == 161) {
                                                $scope.index_cfg_check_tips = indexDynamicTags.error_messages[49];
                                            }
                                            if (errorCodeArr[3] == 171) {
                                                document.getElementById('robotSetting').dispatchEvent(new CustomEvent('setSoftLimitProtectError', { bubbles: true, cancelable: true, composed: true }));
                                            }
                                            if (errorCodeArr[3] == 206) {
                                                if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                                    document.getElementById('peripheral').dispatchEvent(new CustomEvent('948', { bubbles: true, cancelable: true, composed: true }));
                                                }
                                            }
                                            var luafileindex = errorCodeArr[0].indexOf("fruser");
                                            if (luafileindex != -1) {
                                                //å¤æ­æ¯ä¸æ¯luaæ¥éæ¯å¦éè¦æä¾è¡å·
                                                //æ¥å¿è®°å½500éè¯¯
                                                record_500_error = {
                                                    cmd: "record_500_error",
                                                    data: {
                                                        "error_info": setErrorDict[name].description + setErrorDict[name][~~errorCodeArr[3]] + indexDynamicTags.error_messages[54] + errorCodeArr[1],
                                                    }
                                                };
                                                toastr.error(setErrorDict[name].description + setErrorDict[name][~~errorCodeArr[3]] + indexDynamicTags.error_messages[54] + errorCodeArr[1]);
                                            } else {
                                                record_500_error = {
                                                    cmd: "record_500_error",
                                                    data: {
                                                        "error_info": setErrorDict[name].description + setErrorDict[name][~~errorCodeArr[3]],
                                                    }
                                                };
                                                toastr.error(setErrorDict[name].description + setErrorDict[name][~~errorCodeArr[3]]);
                                            }
                                        } else if (errorCodeArr.length == 3) {
                                            var luafileindex = errorCodeArr[0].indexOf("fruser");
                                            if (luafileindex != -1) {//å¤æ­æ¯ä¸æ¯luaæ¥éæ¯å¦éè¦æä¾è¡å·
                                                //æ¥å¿è®°å½500éè¯¯
                                                record_500_error = {
                                                    cmd: "record_500_error",
                                                    data: {
                                                        "error_info": setErrorDict[name].description + errorCodeArr[2] + indexDynamicTags.error_messages[54] + errorCodeArr[1],
                                                    }
                                                };
                                                toastr.error(setErrorDict[name].description + errorCodeArr[2] + indexDynamicTags.error_messages[54] + errorCodeArr[1]);
                                            } else {
                                                record_500_error = {
                                                    cmd: "record_500_error",
                                                    data: {
                                                        "error_info": setErrorDict[name].description + errorCodeArr[2],
                                                    }
                                                };
                                                toastr.error(setErrorDict[name].description + errorCodeArr[2]);
                                            }
                                        }
                                    } else {//æ´æ¡éè¯¯
                                        record_500_error = {
                                            cmd: "record_500_error",
                                            data: {
                                                "error_info": setErrorDict[name].description + setFBJson[name],
                                            }
                                        };
                                        toastr.error(setErrorDict[name].description + setFBJson[name]);
                                    }
                                    //æ¥å¿è®°å½500éè¯¯
                                    dataFactory.actData(record_500_error);
                                    break;
                                case '501':
                                    if (setFBJson[name] == "2") {
                                        toastr.warning(setErrorDict[name]);
                                    }
                                    break;
                                case '502':
                                    if (setFBJson[name] == "3") {
                                        $scope.runptnboxflag = 1;
                                        $scope.index_uploadProgName();
                                    } else if (setFBJson[name] == "4") {
                                        if (document.getElementById('programTeach')) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('No_Highlight', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                    } else if (setFBJson[name] == "5") {
                                        toastFactory.warning(indexDynamicTags.warning_messages[25]);
                                    } else if (setFBJson[name] == "11") {
                                        document.dispatchEvent(new CustomEvent('tpdget', { bubbles: true, cancelable: true, composed: true }));
                                    }  else if (setFBJson[name] == "21") {//æ¤éé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: 10, speed: 0, index: $scope.index_smartArr_count }}));
                                        }
                                    } else if (setFBJson[name] == "22") {//æ¸ç©ºé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: 11, speed: 0, index: $scope.index_smartArr_count }}));
                                        }
                                    } else if (setFBJson[name] == "23") {//Aé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            if($scope.index_smartArr[0][0] < 3){
                                                document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                            } else {
                                                handleSmartToolSingle(setFBJson[name]);
                                            }
                                        }
                                    } else if (setFBJson[name] == "24") {//Bé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            if($scope.index_smartArr[1][0] < 3){
                                                document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                            } else {
                                                handleSmartToolSingle(setFBJson[name]);
                                            }
                                        }
                                    } else if (setFBJson[name] == "25") {//Cé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            if($scope.index_smartArr[2][0] < 3){
                                                document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                            } else {
                                                handleSmartToolSingle(setFBJson[name]);
                                            }
                                        }
                                    } else if (setFBJson[name] == "26") {//Dé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            if($scope.index_smartArr[3][0] < 3){
                                                document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                            } else {
                                                handleSmartToolSingle(setFBJson[name]);
                                            }
                                        }
                                    } else if (setFBJson[name] == "27") {//Eé®æä¸
                                        if (document.getElementById('programTeach')) {
                                            if($scope.index_smartArr[4][0] < 3){
                                                document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                            } else {
                                                handleSmartToolSingle(setFBJson[name]);
                                            }
                                        }
                                    } else if (setFBJson[name] == "28") {//IOé®æä¸
                                        if($scope.index_smartArr[5][2] == 1 || $scope.index_smartArr[5][2] == 2){
                                            document.dispatchEvent(new CustomEvent('smarttoolpoint', { bubbles: true, cancelable: true, composed: true, detail: { type: setFBJson[name] } }));
                                        } else {
                                            handleSmartToolSingle(setFBJson[name]);
                                        }
                                    } else if (setFBJson[name] == "29") {
                                        $scope.modeSwitch();//åæ¢æºå¨äººæ¨¡å¼
                                    } else if (setFBJson[name] == "30") {
                                        $scope.runptnboxflag = 1;
                                        $scope.index_uploadProgName();//è¿è¡ç¨åº
                                    }
                                    break;
                                case '524':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('524', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '526':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('526', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '527':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('527', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '528':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('528', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '529':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('529', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '530':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('530', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '531':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('531', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '532':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('532', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '544':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('544', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '545':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('545', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '546':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('546', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]}));
                                    }
                                    break;
                                case '547':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('547', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '557':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('557', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '567':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('567', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '568':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('568', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '569':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('569', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '571':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('571', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '572':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('572', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '575':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('575', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('575', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '579':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('579', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '581':
                                    document.dispatchEvent(new CustomEvent('581', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '584':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('584', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '618':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('618', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '620':
                                    if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("systemSetting").dispatchEvent(new CustomEvent('620', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('620', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '633':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('633', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '637':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('637', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '638':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('638', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '639':
                                    document.dispatchEvent(new CustomEvent('639', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '646':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('646', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '647':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('647', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '652':
                                    if (document.getElementById("robotSetting") != null || document.getElementById("robotSetting") != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('652', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '654':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('654', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '657':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('657', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '658':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('658', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '659':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('659', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '663':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('663', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '664':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('664', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '665':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('665', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '666':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('666', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '669':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('669', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '670':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('670', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '675':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('675', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '676':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('676', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '679':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('679', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '681':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('681', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '682':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('682', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '685':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('685', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '692':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('692', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '693':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('693', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '703':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('703', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '709':
                                    if (document.getElementById("systemSetting") != null || document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("systemSetting").dispatchEvent(new CustomEvent('709', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '729':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('729', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '730':
                                    // æºå¨äººä»ç«å¥åº·ç¶ææ°æ®åé¦
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('730', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '744':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('744', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '745':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('745', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '746':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('746', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '747':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('747', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '751':
                                    document.dispatchEvent(new CustomEvent('751', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '753':
                                    if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("systemSetting").dispatchEvent(new CustomEvent('753', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '760':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('760', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '761':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('761', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '762':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('762', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '763':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('763', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '767':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('767', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '768':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('768', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '769':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('769', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '770':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('770', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '780':
                                    if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('780', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '781':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('781', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '802':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('802', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '803':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('803', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '804':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('804', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '805':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('805', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    document.dispatchEvent(new CustomEvent('805', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '814':
                                    document.dispatchEvent(new CustomEvent('814', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                case '815':
                                    document.dispatchEvent(new CustomEvent('815', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('815', { bubbles: false, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '827':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('827', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '828':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('828', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '829':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('829', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '830':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('830', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '833':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('833', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '840':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('840', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '836':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('836', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '837':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('837', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '838':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('838', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '839':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('839', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '840':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('840', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '841':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('841', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '852':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('852', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '853':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('853', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '854':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('854', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '873':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('873', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '884':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('884', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '886':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('886', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('nodeEditor') != null && document.getElementById('nodeEditor') != undefined) {
                                        document.getElementById('nodeEditor').dispatchEvent(new CustomEvent('886', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('graphicalProgramming') != null && document.getElementById('graphicalProgramming') != undefined) {
                                        document.getElementById('graphicalProgramming').dispatchEvent(new CustomEvent('886', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '887':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('887', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '889':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('889', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('nodeEditor') != null && document.getElementById('nodeEditor') != undefined) {
                                        document.getElementById('nodeEditor').dispatchEvent(new CustomEvent('889', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('graphicalProgramming') != null && document.getElementById('graphicalProgramming') != undefined) {
                                        document.getElementById('graphicalProgramming').dispatchEvent(new CustomEvent('889', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '898':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('898', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '899':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('899', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '900':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('900', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '901':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('901', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '902':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('902', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '903':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('903', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '904':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('904', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '912':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('912', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '913':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('913', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '914':
                                    if (document.getElementById("safeSet") != null && document.getElementById("safeSet") != undefined) {
                                        document.getElementById("safeSet").dispatchEvent(new CustomEvent('914', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '924':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('924', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '928':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('928', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '929':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('929', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '934':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('934', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '935':
                                    document.dispatchEvent(new CustomEvent('935', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('935', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('935', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '939':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('939', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '943':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('943', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '944':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('944', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '945':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('945', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '946':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('946', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '948':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('948', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '956':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('956', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                case '960':
                                    if (document.getElementById("robotSetting") != null || document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('960', { bubbles: true, cancelable: true, composed: true }));
                                    }
                                    break;
                                case '961':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('961', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '965':
                                    if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('965', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById("programTeach") != null || document.getElementById("programTeach") != undefined) {
                                        document.getElementById("programTeach").dispatchEvent(new CustomEvent('965', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '967':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('967', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '968':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('968', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '977':
                                    if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('977', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '978':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('978', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('978', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '979':
                                    if (document.getElementById("peripheral") != null || document.getElementById("peripheral") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('979', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '981':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('981', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '982':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('982', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('982', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '985':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('985', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '989':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('989', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '990':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('990', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '992':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('992', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '993':
                                    if (document.getElementById("peripheral") != null || document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('993', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '994':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('994', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1010':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1010', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1011':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1011', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1012':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1012', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1019':
                                    if (document.getElementById("peripheral") != null || document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('1019', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1020':
                                    if (document.getElementById("peripheral") != null || document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("peripheral").dispatchEvent(new CustomEvent('1020', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1023':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1023', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1027':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1027', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1031':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1031', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1032':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1032', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1040':
                                    if (document.getElementById("robotSetting") != null && document.getElementById("robotSetting") != undefined) {
                                        document.getElementById("robotSetting").dispatchEvent(new CustomEvent('1040', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1045':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1045', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1091':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1091', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1092':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1092', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1093':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1093', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1093', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1094':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1094', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1095':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1095', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1109':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1109', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1110':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1110', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1126':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1126', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1128':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1128', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1132':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1132', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1133':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1133', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1140':
                                case '1272':
                                case '1276':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1140', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1143':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1143', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1146':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1146', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1147':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1147', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1151':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1151', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1162':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1162', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1164':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1164', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1166':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1166', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1169':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1169', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1176':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1176', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1177':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1177', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1178':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1178', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1179':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1179', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1189':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1189', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1190':
                                    document.dispatchEvent(new CustomEvent('1190', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '1191':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1191', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1192':
                                    document.dispatchEvent(new CustomEvent('1192', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '1195':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1195', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1196':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1196', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1202':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1202', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1203':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1203', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1204':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1204', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1206':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1206', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1207':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1207', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1217':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1217', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1218':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1218', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1219':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1219', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1220':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1220', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1221':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1221', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1227':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1227', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1228':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1228', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1230':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1230', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1231':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1231', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('graphicalProgramming') != null && document.getElementById('graphicalProgramming') != undefined) {
                                        document.getElementById('graphicalProgramming').dispatchEvent(new CustomEvent('1231', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    if (document.getElementById('nodeEditor') != null && document.getElementById('nodeEditor') != undefined) {
                                        document.getElementById('nodeEditor').dispatchEvent(new CustomEvent('1231', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1232':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1232', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1234':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1234', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1246':
                                    if (document.getElementById("auxiliaryApplication") != null && document.getElementById("auxiliaryApplication") != undefined) {
                                        document.getElementById("auxiliaryApplication").dispatchEvent(new CustomEvent('1246', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1247':
                                    if (document.getElementById("systemSetting") != null && document.getElementById("systemSetting") != undefined) {
                                        document.getElementById("systemSetting").dispatchEvent(new CustomEvent('1247', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1249':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1249', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1250':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1250', { bubbles: true, cancelable: true, composed: true }));
                                    }
                                    break;
                                case '1252':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1252', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1256':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1256', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1256', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1265':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1265', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1266':
                                    if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                                        document.getElementById('programTeach').dispatchEvent(new CustomEvent('1266', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1267':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1267', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1268':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1268', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1270':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1270', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1271':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1271', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1272':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1272', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1275':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1275', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1279':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1279', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1282':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1282', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1284':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1284', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1287':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1287', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1288':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1288', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1289':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1289', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1291':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1291', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1292':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1292', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1293':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1293', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1294':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1294', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1295':
                                    if (document.getElementById('robotSetting') != null && document.getElementById('robotSetting') != undefined) {
                                        document.getElementById('robotSetting').dispatchEvent(new CustomEvent('1295', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1300':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1300', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name]  }));
                                    }
                                    break;
                                case '1301':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1301', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1302':
                                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('1302', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1305':
                                    if (document.getElementById('peripheral') != null && document.getElementById('peripheral') != undefined) {
                                        document.getElementById('peripheral').dispatchEvent(new CustomEvent('1305', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1308':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1308', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1310':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1310', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1313':
                                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('1313', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1323':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1323', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1324':
                                    document.dispatchEvent(new CustomEvent('1324', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    break;
                                case '1325':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1325', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1326':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1326', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                case '1327':
                                    if (document.getElementById('safeSet') != null && document.getElementById('safeSet') != undefined) {
                                        document.getElementById('safeSet').dispatchEvent(new CustomEvent('1327', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                    }
                                    break;
                                default:
                                    break;
                            }
                            // å½é¡µé¢å­å¨æ¶ä¸æä»¤æ§è¡æåï¼åå¸äºä»¶
                            if (document.getElementById("torqueSystem") != null) {
                                switch (name) {
                                    case "401":
                                        // è·åèµ·å­ç¨åºåæ°ç»
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('401', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "402":
                                        // è·åèµ·å­ç¨åºåå®¹
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('402', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "403":
                                        // ä¿å­èµ·å­ç¨åº
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('403', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "411":
                                        // è®¾ç½®æ­ç©ç³»ç»å¼å³
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('411', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "412":
                                        // è·åæ­ç©ç³»ç»å¼å³ç¶æ
                                        if (JSON.parse(setFBJson[name]).enable == 1) {
                                            $scope.show_TorqueState = true;
                                            $scope.showRobotStatus.torque = true;
                                        } else if (JSON.parse(setFBJson[name]).enable == 0) {
                                            $scope.show_TorqueState = false;
                                            $scope.showRobotStatus.torque = false;
                                        }
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('412', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "413":
                                        // è·åå½åæ­ç©åå·åæ°èå´
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('413', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    case "414":
                                        // è·åå½åæ­ç©åå·
                                        document.getElementById("torqueSystem").dispatchEvent(new CustomEvent('414', { bubbles: true, cancelable: true, composed: true, detail: setFBJson[name] }));
                                        break;
                                    default:
                                        break;
                                }
                            }
        
                            // è½¯éä½è®¾ç½®æååæ´æ°é¡µé¢joints sliderèå´
                            if (name == "308" && setFBJson[name] == "1") {
                                PositiveLimitFlg = true;
                            }
                            if (name == "309" && setFBJson[name] == "1") {
                                NegativeLimitFlg = true;
                            }
                            if (PositiveLimitFlg && NegativeLimitFlg) {
                                $scope.getRobotCfg('jointLimit');
                                $scope.getRobotInterfereCfg('update_axis_interference');
                                PositiveLimitFlg = false;
                                NegativeLimitFlg = false;
                            }
                        }
                    }
                }
                // åå³èæ¨¡åè¾¨è¯å¾è¡¨æ°æ®
                if (data['joint_identify_data'] != undefined && data['joint_identify_data'] != null) {
                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('sji-data', { bubbles: true, cancelable: true, composed: true, detail: data.joint_identify_data }));
                    }
                }
                //ä»ç«å¥åº·çæµæ°æ®ï¼æ¹æ³å¼ç¨ï¼ææ¶ä¿çï¼
                // document.dispatchEvent(new CustomEvent('hal_slave_count', { bubbles: true, cancelable: true, composed: true, detail: {slave_INErr: data.slave_INErr, slave_OUTErr: data.slave_OUTErr} }));
                // åå®æ­ç©ç³»ç»ç¶æåé¦
                if (data['jiabao_torque_sys_state'] != undefined && data['jiabao_torque_sys_state'] != null) {
                    if (!$.isEmptyObject(data.jiabao_torque_sys_state)) {
                        jiabaoLeftStationInfo = data.jiabao_torque_sys_state.left_station;
                        jiabaoRightStationInfo = data.jiabao_torque_sys_state.right_station;
                        // å·¦å·¥ä½
                        $scope.torqueStatusData.leftModel = jiabaoLeftStationInfo.workpiece_id;
                        $scope.torqueStatusData.leftYield = jiabaoLeftStationInfo.product_count;
                        $scope.torqueStatusData.leftNGCount = jiabaoLeftStationInfo.NG_count;
                        $scope.torqueStatusData.leftWorkingTime = jiabaoLeftStationInfo.work_time;
                        // å³å·¥ä½
                        $scope.torqueStatusData.rightModel = jiabaoRightStationInfo.workpiece_id;
                        $scope.torqueStatusData.rightYield = jiabaoRightStationInfo.product_count;
                        $scope.torqueStatusData.rightNGCount = jiabaoRightStationInfo.NG_count;
                        $scope.torqueStatusData.rightWorkingTime = jiabaoRightStationInfo.work_time;
                    }
                }
                /** ç åç³»ç»ç¶æåé¦ */
                if (data['palletizing_sys_state'] != undefined && data['palletizing_sys_state'] != null) {
                    if (!$.isEmptyObject(data.palletizing_sys_state)) {
                        $scope.palletizingProductionTimes = data.palletizing_sys_state.times;
                        $scope.palletizingProductionTime = data.palletizing_sys_state.total_time;
                        $scope.palletizingSingleProductionTime = data.palletizing_sys_state.single_time;
                        $scope.palletizingLayerIndex = data.palletizing_sys_state.layer_index;
                        $scope.palletizingBoxIndex = data.palletizing_sys_state.box_index;
                        palletPosition = data.palletizing_sys_state.pallet;
                    }
                }
                /* ç¤ºæå¨IOç¶æåé¦ï¼èèæé®ç­ï¼ */
                if (data['PI_IO'] != undefined && data['PI_IO'] != null) {
                    if (!$.isEmptyObject(data.PI_IO)) {
                        $scope.show_robotModeSwitchBtn = true;
                        piStatusData = data.PI_IO;
                        if (piStatusData.switch) {
                            // é¥åå¼å³ï¼èªå¨æ¨¡å¼ï¼[0, 0]ï¼æå¨æ¨¡å¼ï¼[0, 1]ï¼èªå®ä¹ä¿¡å·ï¼[1, 0]
                            if (piStatusData.switch[0] == 0 && piStatusData.switch[1] == 0) {
                                $('#teachPendantDragModal').modal('hide')
                                if ($scope.programStatus == "Drag") {
                                    // å½åä¸ºæå¨æ¨¡å¼æ¶éåºæå¨
                                    $scope.setDragMode(0);
                                    $scope.indexTeachPendantData.isDragSwitch = '0';
                                } else {
                                    // èªå¨æ¨¡å¼
                                    setMode('0');
                                }
                            } else if (piStatusData.switch[0] == 0 && piStatusData.switch[1] == 1) {
                                $('#teachPendantDragModal').modal('hide')
                                if ($scope.programStatus == "Drag") {
                                    // å½åä¸ºæå¨æ¨¡å¼æ¶éåºæå¨
                                    $scope.setDragMode(0);
                                    $scope.indexTeachPendantData.isDragSwitch = '1';
                                } else {
                                    // æå¨æ¨¡å¼
                                    setMode('1');
                                }
                            }
                        }
                        // å¼å§æé®ï¼1:æä¸ï¼é»è®¤ä¸º0
                        if (lastStartBtn == undefined) {
                            lastStartBtn = piStatusData.start;
                            currStartBtn = piStatusData.start;
                        } else {
                            lastStartBtn = currStartBtn;
                            currStartBtn = piStatusData.start;
                            if (lastStartBtn == 0 && currStartBtn == 1) {
                                $scope.index_uploadProgName();
                            }
                        }
                        // åæ­¢æé®ï¼0:æä¸ï¼é»è®¤ä¸º1
                        if (lastStopBtn == undefined) {
                            lastStopBtn = piStatusData.stop;
                            currStopBtn = piStatusData.stop;
                        } else {
                            lastStopBtn = currStopBtn;
                            currStopBtn = piStatusData.stop;
                            if (lastStopBtn == 1 && currStopBtn == 0) {
                                $scope.stopProgram();
                            }
                        }
                        // è½´å¢ï¼0:æä¸ï¼é»è®¤é½ä¸º1
                        if (lastPlusBtnsArr == undefined) {
                            lastPlusBtnsArr = piStatusData.axis_plus;
                            currPlusBtnsArr = piStatusData.axis_plus;
                        } else {
                            lastPlusBtnsArr = currPlusBtnsArr;
                            currPlusBtnsArr = piStatusData.axis_plus;
                            for (let i = 0; i < lastPlusBtnsArr.length; i++) {
                                if (currPlusBtnsArr[i] == 0 && lastPlusBtnsArr[i] == 1) {
                                    document.dispatchEvent(new CustomEvent('pi_plus', { bubbles: true, cancelable: true, composed: true, detail: i }));
                                }
                                if (currPlusBtnsArr[i] == 1 && lastPlusBtnsArr[i] == 0) {
                                    document.dispatchEvent(new CustomEvent('pi_stop', { bubbles: true, cancelable: true, composed: true }));
                                }
                            }
                        }

                        // è½´åï¼0:æä¸ï¼é»è®¤é½ä¸º1
                        if (lastMinusBtnsArr == undefined) {
                            lastMinusBtnsArr = piStatusData.axis_minus;
                            currMinusBtnsArr = piStatusData.axis_minus;
                        } else {
                            lastMinusBtnsArr = currMinusBtnsArr;
                            currMinusBtnsArr = piStatusData.axis_minus;
                            for (let i = 0; i < lastMinusBtnsArr.length; i++) {
                                if (currMinusBtnsArr[i] == 0 && lastMinusBtnsArr[i] == 1) {
                                    // startJOG
                                    // startJOG(i + 1, 0);
                                    document.dispatchEvent(new CustomEvent('pi_minus', { bubbles: true, cancelable: true, composed: true, detail: i }));
                                }
                                if (currMinusBtnsArr[i] == 1 && lastMinusBtnsArr[i] == 0) {
                                    // stopJOG
                                    document.dispatchEvent(new CustomEvent('pi_stop', { bubbles: true, cancelable: true, composed: true }));
                                }
                            }
                        }
                    } else {
                        $scope.show_robotModeSwitchBtn = false;
                    }
                }
                // ç¤ºæå¨é¥åèªå®ä¹åæ¢åæé®F1~F4çä¿¡å·ï¼dragï¼0ââæ ã1ââæå¨æ¨¡å¼ï¼resetipï¼0ââæ ã1ââéç½®ipï¼
                if (data['PI_custom_sign_inform'] != undefined && data['PI_custom_sign_inform'] != null) {
                    $scope.indexTeachPendantData.keyValue = data.PI_custom_sign_inform.drag;
                    $scope.indexTeachPendantData.reset = data.PI_custom_sign_inform.resetip;
                    if ($scope.indexTeachPendantData.keyValue == 1) {
                        $('#teachPendantDragModal').modal('show')
                    } else {
                        $('#teachPendantDragModal').modal('hide')
                    }
                    if ($scope.indexTeachPendantData.reset == 1) {
                        showPageRestart(indexDynamicTags.info_messages[55]);
                    }
                }
                // è®°å½ç¹ä½è¡¨åç§°ï¼ä¸æ¬¡åå½åç¹ä½è¡¨ï¼è¥ä¸ååè§¦å
                if (lastPointTableName == undefined) {
                    lastPointTableName = g_appliedPointTableName;
                    currPointTableName = g_appliedPointTableName;
                } else {
                    lastPointTableName = currPointTableName;
                    currPointTableName = g_appliedPointTableName;
                    if (currPointTableName != lastPointTableName) {
                        if (document.getElementById('teachingManagement') != null && document.getElementById('teachingManagement') != undefined) {
                            document.getElementById("teachingManagement").dispatchEvent(new CustomEvent('table_name', { bubbles: true, cancelable: true, composed: true, detail: { last: lastPointTableName, current: currPointTableName} }));
                        }
                    }
                }
                // å¤è½´èå¨
                if (lastJointsData == undefined) {
                    lastJointsData = jointsData;
                    document.dispatchEvent(new CustomEvent('joints-update', { bubbles: true, cancelable: true, composed: true, detail: { last: 0, now: jointsData } }));
                } else if (updateJointsFlg == 1) {
                    document.dispatchEvent(new CustomEvent('joints-update', { bubbles: true, cancelable: true, composed: true, detail: { last: -1, now: jointsData } }));
                    updateJointsFlg = 0;
                } else {
                    for (const name in jointsData) {
                        let jointDiff = Math.abs(jointsData[name] - lastJointsData[name]);
                        if (jointDiff > 0.1) {
                            lastJointsData = jointsData;
                            document.dispatchEvent(new CustomEvent('joints-update', { bubbles: true, cancelable: true, composed: true, detail: { last: lastJointsData, now: jointsData } }));
                            break;
                        }
                    }
                }
                // ç¬å¡å°ç§»å¨
                if ($scope.moveDescartesTcp == undefined) {
                    $scope.moveDescartesJoint = data.joints;
                    $scope.moveDescartesTcp = data.tcp;
                    document.dispatchEvent(new CustomEvent('joints-update', { bubbles: true, cancelable: true, composed: true, detail: { last: 0, now: $scope.moveDescartesJoint, tcp: $scope.moveDescartesTcp } }));
                } else if (updatedescartesFlg == 1) {
                    $scope.moveDescartesJoint = data.joints;
                    $scope.moveDescartesTcp = data.tcp;
                    document.dispatchEvent(new CustomEvent('joints-update', { bubbles: true, cancelable: true, composed: true, detail: { last: -1, now: $scope.moveDescartesJoint, tcp: $scope.moveDescartesTcp } }));
                    updatedescartesFlg = 0;
                }
                // æ ¹æ®æéæ§å¶æºå¨äººä¸ç»´æä½ä¸­çTCPãåè½´ç¹å¨åå¤è½´èå¨çåæ°åç§°æ¾ç¤º
                if ($scope.robotObjectIndex.length) {
                    checkCoord();
                }
                // error_infoï¼éè¯¯ä¿¡æ¯ï¼alarm_infoï¼è­¦åä¿¡æ¯
                if (data['error_info'] != undefined && data['error_info'] != null && data['alarm_info'] != undefined && data['alarm_info'] != null) {
                    creatErrorList(data.error_info, data.alarm_info, data.time_now);
                } else if (data['error_info'] != undefined && data['error_info'] != null && (data['alarm_info'] == undefined || data['alarm_info'] == null)) {
                    creatErrorList(data.error_info, null, data.time_now);
                } else if ((data['error_info'] == undefined && data['error_info'] == null) && data['alarm_info'] != undefined && data['alarm_info'] != null) {
                    creatErrorList(null, data.alarm_info, data.time_now);
                }
                if (data['error_info'] != undefined && data['error_info'] != null) {
                    createJiabaoErrorList(data.time_now, data.error_info);
                    createPalletizingErrorList(data.time_now, data.error_info);
                }
                // æ«ç«¯è®°ç¹æç¤ºä¿¡æ¯
                if (data['end_record_point'] != undefined && data['end_record_point'] != null) {
                    if (data['end_record_point'].flag == 0) { // è®°ç¹æå
                        dispatchSavePoints();
                        toastFactory.success(indexDynamicTags.success_messages[11] + data['end_record_point'].point_name);
                    } else { // è®°ç¹å¤±è´¥
                        toastFactory.error(indexDynamicTags.error_messages[53] + data['end_record_point'].point_name);
                    }
                }
                // bootæ¨¡å¼æ å¿ä½
                if (data['boot_mode_state'] != undefined && data['boot_mode_state'] != null) {
                    g_bootModeFlag = data['boot_mode_state'];
                    $scope.gBootModeFlag = g_bootModeFlag;
                }
                // æ¿å¡éè®¯I/Oä¿¡å·
                if (data['slave_io'] != undefined && data['slave_io'] != null) {
                    $scope.slaveIO = data['slave_io'];
                }
            }
        };
        // websocketåèµ·è¿æ¥
        if (g_socketStatus == 0) {
            const host = $window.location.hostname;
            g_socketStream = $websocket(`ws://${host}:9999`);   
        }
        // websocketè¿æ¥æå
        g_socketStream.onOpen(function() {
            socketError = 0;
            if (reconnectID) {
                clearTimeout(reconnectID);
                reconnectID = null;
            }
            if (reconnectTimeID) {
                clearInterval(reconnectTimeID);
                reconnectTimeID = null;
            }
        })
        // websocketè¿æ¥æååæ¥ååé¦
        g_socketStream.onMessage(function(message) {
            if (message.data == 'websocket close') {
                location = '/login.html';
                g_socketLogoutFlag = 1;
                g_socketStatus = 0;
            } else {
                // è¿æ¥æååï¼ç»åºæ å¿æ¢å¤åå§åï¼ç½®0ï¼
                g_socketLogoutFlag = 0;
                let consLoadingPage = document.getElementById("consLoadingPage");
                if (consLoadingPage) {
                    consCount = 0;
                    consLoadingPage.style.display = "none";
                    $("#consLoading").text('');
                }
                // è¿æ¥æååï¼è¿åæ°æ®ä¸æ¯å¯¹è±¡æ ¼å¼ï¼è·³è½¬å°ç»å½çé¢
                if (typeof (JSON.parse(message.data)) != "object") {
                    location = '/login.html';
                    g_socketLogoutFlag = 1;
                    g_socketStatus = 0;
                } else {
                    getBasic(JSON.parse(message.data));
                    g_socketStatus = 1;
                }
            }
        })
        // websocketè¿æ¥å¤±è´¥
        g_socketStream.onError(function() {
            socketError = 1;
        })
        // websocketæ­å¼è¿æ¥
        g_socketStream.onClose(function() {
            $('#restartPage').css("display", "none");
            g_socketStatus = 0;
            if (reconnectID) {
                clearTimeout(reconnectID);
                reconnectID = null;
            }
            if (reconnectTimeID) {
                clearInterval(reconnectTimeID);
                reconnectTimeID = null;
            }
            if (!g_socketLogoutFlag) {
                let consLoadingPage = document.getElementById("consLoadingPage");
                if (consLoadingPage && !socketError) {
                    consLoadingPage.style.display = "block";
                }
                // æ­å¼è¿æ¥åè¯»ç§
                if (g_socketStatus == 0 && !reconnectTimeID && !socketError) {
                    reconnectTimeID = setInterval(() => {
                        consCount++;
                        $("#consLoading").text(indexDynamicTags.info_messages[18] + consCount);
                    }, 1000);
                }
                // æ­å¼è¿æ¥ååèµ·éè¿
                reconnectID = setTimeout(() => {
                    viewer.dispatchEvent(new CustomEvent('geometry-loaded', { bubbles: true, cancelable: true, composed: true }));
                }, 500);
            }
        })
    });

    /* BOOTæ¨¡å¼ */
    // BOOTæ¨¡å¼å¯ç ç¡®è®¤
    $scope.confirmBootPassword = function (bootPassword) {
        if (!bootPassword) {
            toastFactory.info(langJsonData.system_setting.info_messages[9]);
        } else {
            let saveCmd = {
                cmd: "robottype_password",
                data: {
                    password: bootPassword + "",
                },
            };
            dataFactory.getData(saveCmd).then((data) => {
                if (data.mode_type == 1) {
                    $scope.setEndFileType(1)
                }
            }, (status) => {
                toastFactory.error(status);
                /* test */
                if (g_testCode) {
                    $scope.setEndFileType(1);
                }
                /* ./test */
            });
        }
        $scope.bootModeParams.password = '';
    }

    /**
     * è®¾ç½®æ«ç«¯æä»¶ä¼ è¾ç±»å
     * @param {Number} endType 1-MCUåºä»¶åçº§;2-æ«ç«¯Luaæä»¶åçº§;
     */
    let endLuaType;
    $scope.setEndFileType = function(endType) {
        if ($scope.robotEnableState == 1) {
            toastFactory.info(indexDynamicTags.info_messages[0]);
            return;
        }
        if (endType == null || endType == undefined) {
            endType = 2;
        }
        endLuaType = endType;

        let setCmd = {
            cmd: 947,
            data: {
                content: `SetAxleFileType(${endType})`
            },
        }
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                entryBoot();
            }
            /* ./test */
        })
    };
    
    document.addEventListener('updateLuaProtocol', (e) => {
        $scope.setEndFileType()
    })

    document.addEventListener('947', () => {
        entryBoot();
    });

    // è¿å¥BOOTæ¨¡å¼
    function entryBoot() {
        let inBootCmd = {
            cmd: 332,
            data: {
                content: "SetSysServoBootMode()",
            },
        }
        dataFactory.setData(inBootCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.gBootModeFlag = 1;
            }
            /* ./test */
        })
    };
    document.addEventListener('332', () => {
        toastFactory.success(`${langJsonData.setErrorDict['332']}${langJsonData.setErrorDict['1']}`);
        if (document.getElementById("peripheral") != null && document.getElementById("peripheral") != undefined && endLuaType == 2) {
            setTimeout(() => {
                document.getElementById('peripheral').dispatchEvent(new CustomEvent('touchLuaProtocol', { bubbles: true, cancelable: true, composed: true }));   
            }, 2000);
        }
    });
    /* ./BOOTæ¨¡å¼ */

    document.addEventListener('getReweld', () => {
        getWeldingReWeldAfterBreakOffParam();
    })

    /**çæ¥ä¸­æ­åæ¢å¤åæ°è·å*/
    getWeldingReWeldAfterBreakOffParam();
    function getWeldingReWeldAfterBreakOffParam() {
        let getWeldAfterBreakCmd = {
            cmd: 805,
            data: {
                content: "WeldingGetReWeldAfterBreakOffParam()"
            }
        };
        dataFactory.setData(getWeldAfterBreakCmd)
            .then(() => {
            }, (status) => {
                toastFactory.error(status);
            });
    }
    document.addEventListener('805', e => {
        let reWeldAfterBreakParam = JSON.parse(e.detail);
        $scope.reWeldEnableOpen = reWeldAfterBreakParam.enable;
    })

    /* ç¤ºæå¨è½´å¢ */
    document.addEventListener("pi_plus", (e) => {
        $scope.actMouseDown(e.detail + 1, 1);
    });

    /* ç¤ºæå¨è½´å¢ */
    document.addEventListener("pi_minus", (e) => {
        $scope.actMouseDown(e.detail + 1, 0);
    });

    /* ç¤ºæå¨è½´åæ­¢ */
    document.addEventListener("pi_stop", () => {
        switch (mouseupFlag) {
            case 0:
                if (timeID != null) {
                    clearInterval(timeID);
                    timeID = null;
                }
                if (2 == $scope.selectedCoordSys.value) {
                    stopTool();
                } else {
                    stopJOG();
                };
                mouseupFlag = -1;
                break;
            default:
                break;
        }
    });

    document.addEventListener('joints-update', e => {
        let joints = e.detail;
        if (joints != null) {
            if (joints['last'] == 0 || joints['last'] == -1) {
                for (const name in joints['now']) {
                    viewer.setAngle(name, joints['now'][name] * DEG2RAD);
                    viewer.setVirtualAngle(name, joints['now'][name] * DEG2RAD);
                }
                virtualFlg = 1;
            } else {
                viewer.ExecuteSmoothMotion(virtualFlg, joints['last'], joints['now'], 15);
                if (virtualFlg == 0) {
                    let isOver = 0;
                    for (const name in joints['now']) {
                        let diff = Math.abs(parseFloat(joints['now'][name]) - parseFloat(virtualJoints[name]));
                        if (diff > deviation) {
                            isOver = 1;
                        }
                    }
                    if (isOver == 0) {
                        virtualFlg = 1;
                        updateJointsFlg = 1;
                    }
                }
            }
        }
    });

    /* æååè½ */
    document.addEventListener('pauseFunc', (e) => {
        let currentPauseParameter = e.detail;
        if (currentPauseParameter != 0) {
            //å³é­callæ¾ç¤ºçmodal
            $('#singalCallModal').modal('hide');
            switch (currentPauseParameter) {
                case 1:
                    $scope.customPauseFuncDialogTitle1 = $scope.customPausesArr["1"]["modal_title"];
                    $scope.customPauseTips1 = $scope.customPausesArr["1"]["modal_content"];
                    $("#PauseFunction1Modal").modal('show');
                    break;
                case 2:
                    $scope.pauseFuncDialogTitle = indexDynamicTags.info_messages[23];
                    $("#PauseFunction2Modal").modal('show');
                    break;
                case 3:
                    $scope.pauseFuncDialogTitle = indexDynamicTags.info_messages[24];
                    $("#PauseFunction3Modal").modal('show');
                    break;
                case 4:
                    $scope.pauseFuncDialogTitle = indexDynamicTags.info_messages[25];
                    $("#PauseFunction4Modal").modal('show');
                    break;
                case 5:
                    $scope.pauseFuncDialogTitle = indexDynamicTags.info_messages[26];
                    $("#PauseFunction5Modal").modal('show');
                    break;
                case 10:
                    $scope.customPauseFuncDialogTitle10 = $scope.customPausesArr["10"]["modal_title"];
                    $scope.customPauseTips10 = $scope.customPausesArr["10"]["modal_content"];
                    $("#PauseFunction10Modal").modal('show');
                    break;
                case 11:
                    $scope.customPauseFuncDialogTitle11 = $scope.customPausesArr["11"]["modal_title"];
                    $scope.customPauseTips11 = $scope.customPausesArr["11"]["modal_content"];
                    $("#PauseFunction11Modal").modal('show');
                    break;
                case 12:
                    $scope.customPauseFuncDialogTitle12 = $scope.customPausesArr["12"]["modal_title"];
                    $scope.customPauseTips12 = $scope.customPausesArr["12"]["modal_content"];
                    $("#PauseFunction12Modal").modal('show');
                    break;
                case 13:
                    $scope.customPauseFuncDialogTitle13 = $scope.customPausesArr["13"]["modal_title"];
                    $scope.customPauseTips13 = $scope.customPausesArr["13"]["modal_content"];
                    $("#PauseFunction13Modal").modal('show');
                    break;
                case 14:
                    $scope.customPauseFuncDialogTitle14 = $scope.customPausesArr["14"]["modal_title"];
                    $scope.customPauseTips14 = $scope.customPausesArr["14"]["modal_content"];
                    $("#PauseFunction14Modal").modal('show');
                    break;
                default:
                    break;
            }
        } else if (currentPauseParameter == 0) {
            $("#PauseFunction1Modal").modal('hide');
            $("#PauseFunction2Modal").modal('hide');
            $("#PauseFunction3Modal").modal('hide');
            $("#PauseFunction4Modal").modal('hide');
            $("#PauseFunction5Modal").modal('hide');
            $("#PauseFunction10Modal").modal('hide');
            $("#PauseFunction11Modal").modal('hide');
            $("#PauseFunction12Modal").modal('hide');
            $("#PauseFunction13Modal").modal('hide');
            $("#PauseFunction14Modal").modal('hide');
        }
    });


    /* è·åææèªå®ä¹æå */
    function getAllCustomPause() {
        let cmdContent = {
            cmd: "torque_get_all_custom_pause",
        };
        dataFactory.getData(cmdContent)
            .then((data) => {
                $scope.customPausesArr = data;
            }, (status) => {
                toastFactory.error(status);
            });
    }
    getAllCustomPause();

    document.addEventListener('updatePauseData', () => {
        getAllCustomPause();
    });

    /* setSysVarValue */
    $scope.setSysVarValue = function (varID, varValue) {
        let cmdContent = {
            cmd: 511,
            data: {
                content: "SetSysVarValue(" + varID + "," + varValue + ")"
            }
        };
        dataFactory.setData(cmdContent)
            .then((data) => {
            }, (status) => {
                toastFactory.error(status);
            });
    }

    /* 511åé¦ */
    document.addEventListener('511', () => {
        $scope.pauseResumeProgram('511');
    });

    /* ./æååè½ */

    /*è·åæºå¨äººæå¤§éåº¦åæå¤§å éåº¦ */
    function getRobotSpeedMaxValue() {
        let getSpeedCmd = {
            cmd: 935,
            data: {
                content: "GetCartMaxVelAcc()"
            }
        }
        dataFactory.setData(getSpeedCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $scope.runMaxVel = 1000;
                $scope.runMaxAcc = 2000;
            }
            /* ./test */
        })
    }
    document.addEventListener('935', function (e) {
        $scope.runMaxVel = e.detail.split(',')[0];
        $scope.runMaxAcc = e.detail.split(',')[1];
    });

    /**å¤è®¾ç¸å³è®°å½ç¤ºæç¹åè½ */
    //è·åç¤ºæç¹éç½®æä»¶
    function getSysCfg() {
        let getSysCfgCmd = {
            cmd: "get_ptn_cfg",
        };
        dataFactory.getData(getSysCfgCmd)
            .then((data) => {
                $scope.prefixName = data.name;
                $scope.limitNumber = data.number;
                $scope.LTRecord_flag = data.laser;
                $scope.luaname_flag = data.flag;
            }, (status) => {
                $scope.prefixName = "P";
                $scope.limitNumber = 3;
                $scope.LTRecord_flag = 0;
                $scope.luaname_flag = 0;
                toastFactory.error(status, indexDynamicTags.error_messages[51]);
            });
    }

    document.addEventListener('updataptnboxcfg', e => {
        $scope.prefixName = e.detail['name'];
        $scope.limitNumber = e.detail['number'];
        $scope.LTRecord_flag = parseInt(e.detail['laser']);
        $scope.luaname_flag = e.detail['flag'];
        $scope.ptnboxPointsFlag = 0;
    });

    //Smart Toolä¿¡å·è®°å½ç¹
    document.addEventListener('smarttoolpoint', e => {
        $scope.smartPointName = "smartPointP"+$scope.index_smartArr_count;
        let savePointCmd = {
            cmd: "save_point",
            data: {
                name: $scope.smartPointName,
                update_allprogramfile: 0
            },
        };
        dataFactory.actData(savePointCmd)
            .then(() => {
                // Smart Toolä¿¡å·è®°å½ç¹æååï¼æ·»å ç¤ºæç¨åº(å¿é¡»æ¾å¨$scope.index_smartArr_count += 1è¿ä¸æ­¥ä¹åï¼å¦åç¹ä½åç§°ä¼è§£ææ¥é)
                handleSmartToolSingle(e.detail.type);
                dispatchSavePoints();
                $scope.index_smartArr_count += 1;
                // ä¿®æ¹éç½®æä»¶
                setSmartToolcfg($scope.index_smartArr,$scope.index_smartArr_count);
                toastFactory.success(indexDynamicTags.success_messages[11] + $scope.smartPointName);
            }, (status) => {
                toastFactory.error(status, indexDynamicTags.error_messages[53] + $scope.smartPointName);
            });
    });

    /**
     * Smart Toolä¿¡å·è®°å½ç¹æååï¼æ·»å ç¤ºæç¨åº
     * @param {string} type 23:Aé®ï¼24ï¼Bé®ï¼25ï¼Cé®ï¼26ï¼Dé®ï¼27ï¼Eé®ï¼28ï¼IOé®ï¼
     */
    function handleSmartToolSingle(type) {
        switch (type) {
            case 23:
            case '23':
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[0][0], speed: $scope.index_smartArr[0][1], index: $scope.index_smartArr_count, mode: $scope.index_smartArr[0][2], physicalSpeed: $scope.index_smartArr[0][3], physicalAcc: $scope.index_smartArr[0][4] }}));
                break;
            case 24:
            case '24':
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[1][0], speed: $scope.index_smartArr[1][1], index: $scope.index_smartArr_count, mode: $scope.index_smartArr[1][2], physicalSpeed: $scope.index_smartArr[1][3], physicalAcc: $scope.index_smartArr[1][4] }}));
                break;
            case 25:
            case '25':
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[2][0], speed: $scope.index_smartArr[2][1], index: $scope.index_smartArr_count, mode: $scope.index_smartArr[2][2], physicalSpeed: $scope.index_smartArr[2][3], physicalAcc: $scope.index_smartArr[2][4] }}));
                break;
            case 26:
            case '26':
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[3][0], speed: $scope.index_smartArr[3][1], index: $scope.index_smartArr_count, mode: $scope.index_smartArr[3][2], physicalSpeed: $scope.index_smartArr[3][3], physicalAcc: $scope.index_smartArr[3][4] }}));
                break;
            case 27:
            case '27':
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[4][0], speed: $scope.index_smartArr[4][1], index: $scope.index_smartArr_count, mode: $scope.index_smartArr[4][2], physicalSpeed: $scope.index_smartArr[4][3], physicalAcc: $scope.index_smartArr[4][4] }}));
                break;
            case 28:
            case '28':
                if (document.getElementById('programTeach')) {
                    document.getElementById('programTeach').dispatchEvent(new CustomEvent('smarttoolsingle', { bubbles: true, cancelable: true, composed: true, detail: {function: $scope.index_smartArr[5][0], speed: $scope.index_smartArr[5][3], index: $scope.index_smartArr_count, auxId: $scope.index_smartArr[5][1], type: $scope.index_smartArr[5][2], mode: $scope.index_smartArr[5][4], physicalSpeed: $scope.index_smartArr[5][5], physicalAcc: $scope.index_smartArr[5][6] }}));
                }
                break;
            default:
                break;
        }
    }

    // è·åSmart Tooléç½®æä»¶
    function getSmartToolCfg() {
        let getSmartToolCfgCmd = {
            cmd: "get_Smart_Tool_function",
        };
        dataFactory.getData(getSmartToolCfgCmd).then((data) => {
            var smartArr = eval(data.smart_tool_cfg.cfg);
            $scope.index_smartArr = smartArr;
            $scope.index_smartArr_count = parseInt(data.smart_tool_cfg.p_index);
        }, (status) => {
            toastFactory.error(status)
        });
    }

    // è®¾ç½®Smart Tooléç½®
    function setSmartToolcfg(arr,index) {
        let setSmartToolCmd = {
            cmd: "set_Smart_Tool_function",
            data: {
                cfg: JSON.stringify(arr),
                p_index: index + ""
            }
        };
        dataFactory.actData(setSmartToolCmd).then(() => {}, (status) => {
            toastFactory.error(status);
        });
    }
    document.addEventListener('updatasmartcfg', e => {
        getSmartToolCfg();
    })

    /* ç¡®è®¤è¿å¥ç¨åºç¼ç¨çé¢ */
    $scope.navigateToProgramTeach = function() {
        $location.path('/programteach');
        $("#smartToolAutoProgramModal").modal('hide');
        setTimeout(() => {
            if (document.getElementById('programTeach') != null && document.getElementById('programTeach') != undefined) {
                document.getElementById('programTeach').dispatchEvent(new CustomEvent('autoUpdateSmartTool', { bubbles: true, cancelable: true, composed: true, detail: $scope.smartToolPro }));
            }
        }, 200);

    }

    //å¤è½´èå¨è¿å
    var updateJointsFlg;
    $scope.restoreJoints = function () {
        updateJointsFlg = 1;
    };

    // ç¨æ·ç»åº
    $scope.logout = function () {
        dataFactory.logout();
    };

    /* å­çé¢åå¸äºä»¶å¤ç */

    // åæ­¥å®å¨éç½®ä¿¡æ¯
    document.addEventListener('567', () => {
        $scope.getRobotCfg('safety');
    });

    // åæ­¥DOéç½®ä¿¡æ¯
    document.addEventListener('324', e => {
        $scope.getRobotCfg('DO');
    });

    /* ./å­çé¢åå¸äºä»¶å¤ç */

    /* åæ¢æ°æ®æ¾ç¤ºåºå */
    $scope.showRobotInfo = false;
    $scope.showRobotStatus = {
        pose: false,
        program: false,
        io: false,
        exaxis: false,
        gripper: false,
        servo: false,
        polish: false,
        ft: false,
        convery: false,
        weld: false,
        cnc: false,
        boardIO: false,
    };

    /**
     * åæ¢æ¾ç¤ºç¶ææ°æ®
     * @param {Object} event è§¦æ¸ç¹å»çæ´»å¨
     * @param {string} showType æ¾ç¤ºç¶æåå®¹çç±»å
     */
    $scope.toggleDataDisplay = function (event, showType) {
        locateContent(event, "#robot-status-info");
        $scope.dataDisplayEvent = event ? event : $scope.dataDisplayEvent;
        // å°åä¸ªç¶æçé¢çå¼ååï¼åå¯ä»¥åæ¶æ¾ç¤ºå¤ä¸ªçé¢
        if (showType) {
            $scope.showRobotStatus[showType] = !$scope.showRobotStatus[showType];
        } else {
            $scope.showRobotStatus = {
                pose: false,
                program: false,
                io: false,
                exaxis: false,
                gripper: false,
                servo: false,
                polish: false,
                ft: false,
                convery: false,
                weld: false,
                cnc: false,
                boardIO: false,
            };
        }
        // å½æºå¨äººåç±»ç¶æå­å¨æ¾ç¤ºæ¶ï¼åæ¾ç¤ºrobot-status-infoï¼åä¹ä¸æ¾ç¤º
        let robotStatusKeyArr  = Object.keys($scope.showRobotStatus);
        $scope.showRobotInfo = robotStatusKeyArr.some(item => $scope.showRobotStatus[item]);
    }

    document.querySelectorAll("#robot-object > ul > li").forEach(item => {
        item.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        })
    })

    document.querySelectorAll("#robot-setting > ul > li").forEach(item => {
        item.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        })
    })

    document.querySelectorAll("#robot-support > ul > li").forEach(item => {
        item.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        })
    })

    document.querySelectorAll("#robot-status > ul > li").forEach(item => {
        item.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        })
    })

    document.addEventListener('vc-dragging', e => {
        viewer.disableDragging = e.detail;
    });

    document.addEventListener('calc-move', e => {
        let mesh = e.detail;
        let p = mesh.position;
        let r = mesh.rotation;
        $scope.moveDescartesTcp.x = (p.x * 1000).toFixed(2);
        $scope.moveDescartesTcp.y = (p.y * 1000).toFixed(2);
        $scope.moveDescartesTcp.z = (p.z * 1000).toFixed(2);
        $scope.moveDescartesTcp.rx = (r._x * RAD2DEG).toFixed(2);
        $scope.moveDescartesTcp.ry = (r._y * RAD2DEG).toFixed(2);
        $scope.moveDescartesTcp.rz = (r._z * RAD2DEG).toFixed(2);
        $scope.computeJoint();
    });

    /* åæ¢æºå¨äººèææ§å¶åè½ */
    $scope.mountShow = false;
    $scope.switchVirtualFunc = function (funcFlg) {
        switch (funcFlg) {
            case 0:
                $scope.mountShow = false;
                break;
            case 1:
                $scope.mountShow = true;
                break;
            default:
                break;
        }
    }
    /* ./åæ¢æºå¨äººèææ§å¶åè½ */

    /* ä¸ç»´çé¢æ¬æµ®åè½æ æå¨åè½ */
    $scope.robotObjectFlag = true;
    $scope.robotSettingFlag = true;
    $scope.robotSupportFlag = true;
    $scope.robotStatusFlag = true;
    // æå¼ä¸ç»´çé¢æµ®çª
    $scope.openRobotContent = function(dragId) {
        switch (dragId) {
            case 0:
                $scope.robotObjectFlag = true;
                document.getElementById('robot-object').style.top = $scope.programUrdf ? '58px' : '10px';
                document.getElementById('robot-object').style.left = 'calc(50% - 150px)';
                break;
            case 1:
                $scope.robotSettingFlag = true;
                document.getElementById('robot-setting').style.top = '55px';
                document.getElementById('robot-setting').style.left = '10px';
                break;
            case 2:
                $scope.robotSupportFlag = true;
                document.getElementById('robot-support').style.top = 'calc(100% - 60px)';
                document.getElementById('robot-support').style.left = 'calc(50% - 126px)';
                break;
            case 3:
                $scope.robotStatusFlag = true;
                document.getElementById('robot-status').style.top = '55px';
                document.getElementById('robot-status').style.left = 'calc(100% - 60px)';
                break;
            default:
                break;
        }
    }
    // å¼å§æå¨ä¸ç»´æµ®çª
    $scope.startCallback = function (event, ui) {
        $scope.limitTopVal = ui.position.top;
        $scope.limitLeftVal = ui.position.left;
        $scope.$apply();
    }
    // ç»ææå¨ä¸ç»´æµ®çª
    $scope.dragCallback = function (event, ui, offsetEnable, dragId) {
        // ui.position drag uiå·¦ä¸è§ç¸å¯¹äºç¶åç´ ä½ç½®
        // ui.offset drag uiå·¦ä¸è§ç¸å¯¹äºdocumentä½ç½®
        // ui.originalPosition drag uiæå¨ä¹åå·¦ä¸è§ç¸å¯¹äºç¶åç´ ä½ç½®ï¼å¨æå¨è¿ç¨ä¸­ä¸ä¼æ¹å
        let top = ui.position.top;
        let left = ui.position.left;
        let selfWidth = ui.helper[0].offsetWidth;
        let selfHeight = ui.helper[0].offsetHeight;
        let parentWidth = ui.helper[0].parentElement.offsetWidth;
        let parentHeight = ui.helper[0].parentElement.offsetHeight;
        let offsetLeftX, offsetRightX, offsetTopY, offsetButtomY, limitTop, limitLeft;
        if (offsetEnable) {
            if (dragId == 0) {
                offsetLeftX = (selfWidth / parentWidth) < 0.8 ? parentWidth * 0.1 : parentWidth * ((1 - (selfWidth / parentWidth)) / 2);
                offsetRightX = offsetLeftX;
                offsetTopY = 0;
                offsetButtomY = parentHeight * 0.5;
            } else if (dragId == 1) {
                offsetLeftX = 0;
                offsetRightX = parentHeight * 0.6;
                offsetTopY = 55;
                offsetButtomY = parentHeight * 0.55;
            } else if (dragId == 2) {
                offsetLeftX = (selfWidth / parentWidth) < 0.8 ? parentWidth * 0.24 : parentWidth * ((1 - (selfWidth / parentWidth)) / 2);
                offsetRightX = offsetLeftX;
                if (((selfHeight + 370) / parentHeight) < 0.8) {
                    offsetTopY = selfHeight + 370;
                } else {
                    limitTop = true;
                }
                offsetButtomY = 0;
            } else if (dragId == 3) {
                offsetLeftX = parentHeight * 0.6;
                offsetRightX = 0;
                offsetTopY = 55;
                if ((540 / parentHeight) < 0.8) {
                    offsetButtomY = parentHeight * 0.3;
                } else {
                    limitTop = true;
                }
            }
            if (!limitLeft) {
                ui.position.left = left < 10 + offsetLeftX ? offsetLeftX : left + selfWidth + 10 > parentWidth - offsetRightX ? parentWidth - selfWidth - offsetRightX : left;
            } else {
                ui.position.left = $scope.limitLeftVal;
            }
            if (!limitTop) {
                ui.position.top = top < 10 + offsetTopY ? offsetTopY : top + selfHeight + 10 > parentHeight - offsetButtomY ? parentHeight - selfHeight - offsetButtomY : top;
            } else {
                ui.position.top = $scope.limitTopVal;
            }
        } else {
            ui.position.top = top < 10 ? 0 : top + selfHeight + 10 > parentHeight ? parentHeight - selfHeight : top;
            ui.position.left = left < 10 ? 0 : left + selfWidth + 10 > parentWidth ? parentWidth - selfWidth : left;
        }
        // ä¸ç»´åè½æ è´´è¾¹éèåinfoçªå£æå¨è·é
        switch (dragId) {
            case 0:
                if (top <= ($scope.programUrdf ? 48 : 0)) {
                    $scope.robotObjectFlag = false;
                }
                break;
            case 1:
                if (left <= 0) {
                    $scope.robotSettingFlag = false;
                    $scope.clickRobotSetting();
                } else {
                    locateContent($scope.robotSettingEvent, "#robot-setting-info");
                }
                break;
            case 2:
                if (top + selfHeight >= parentHeight - offsetButtomY) {
                    $scope.robotSupportFlag = false;
                    $scope.clickRobotSupport();
                } else {
                    locateContent($scope.robotSupportEvent, "#robot-support-info");
                }
                break;
            case 3:
                if (left + selfWidth >= parentWidth - offsetRightX) {
                    $scope.robotStatusFlag = false;
                    $scope.toggleDataDisplay();
                } else {
                    locateContent($scope.dataDisplayEvent, "#robot-status-info");
                }
                break;
            default:
                break;
        }
        $scope.$apply();
    }
    /* ./ä¸ç»´çé¢æ¬æµ®åè½æ æå¨åè½ */

    /* æºå¨äºº360åº¦å®è£åè½ */
    let lastYAngle = 0;
    let lastZAngle = 0;
    $scope.freeMountModifyFlag = 0; // èªç±å®è£åºåº§è§åº¦ä¿®æ¹æ å¿ 0-æªä¿®æ¹ 1-ä¿®æ¹
    $scope.curYAngle = 0;
    $scope.curZAngle = 0;
    $scope.yAngle = 0;
    $scope.zAngle = 0;
    // å¿«æ·å®è£
    $scope.quickRobotMounting = function (index) {
        $scope.freeMountModifyFlag = 1;
        switch (index) {
            case 0:
                $scope.yAngle = 0;
                $scope.zAngle = 0;
                viewer.resetFreeMounting(lastYAngle, lastZAngle);
                viewer.changeFreeMounting($scope.yAngle, $scope.zAngle);
                lastYAngle = $scope.yAngle;
                lastZAngle = $scope.zAngle;
                break;
            case 1:
                $scope.yAngle = 90;
                $scope.zAngle = 0;
                viewer.resetFreeMounting(lastYAngle, lastZAngle);
                viewer.changeFreeMounting($scope.yAngle, $scope.zAngle);
                lastYAngle = $scope.yAngle;
                lastZAngle = $scope.zAngle;
                break;
            case 2:
                $scope.yAngle = 180;
                $scope.zAngle = 0;
                viewer.resetFreeMounting(lastYAngle, lastZAngle);
                viewer.changeFreeMounting($scope.yAngle, $scope.zAngle);
                lastYAngle = $scope.yAngle;
                lastZAngle = $scope.zAngle;
                break;
            default:
                break;
        }
    }

    // æºå¨äººåºåº§å¾æè§åº¦
    $scope.tiltRobotBaseMounting = function (angle) {
        $scope.freeMountModifyFlag = 1;
        if ($scope.yAngle + angle > 180) {
            $scope.yAngle = 180;
        } else if ($scope.yAngle + angle < -180) {
            $scope.yAngle = -180;
        } else {
            $scope.yAngle = parseFloat(($scope.yAngle + angle).toFixed(1));
            $("#tiltVar").val($scope.yAngle).trigger('change');
        }
        viewer.resetFreeMounting(lastYAngle, lastZAngle);
        viewer.changeFreeMounting($scope.yAngle, $scope.zAngle);
        lastYAngle = $scope.yAngle;
    }

    // æºå¨äººåºåº§æè½¬è§åº¦
    $scope.rotateRobotBaseMounting = function (angle) {
        $scope.freeMountModifyFlag = 1;
        if ($scope.zAngle + angle > 180) {
            $scope.zAngle = 180;
        } else if ($scope.zAngle + angle < -180) {
            $scope.zAngle = -180;
        } else {
            $scope.zAngle = parseFloat(($scope.zAngle + angle).toFixed(1));
            $("#rotationVar").val($scope.zAngle).trigger('change');
        }
        viewer.resetFreeMounting(lastYAngle, lastZAngle);
        viewer.changeFreeMounting($scope.yAngle, $scope.zAngle);
        lastZAngle = $scope.zAngle;
    }


    // å¾æè§é¿æ
    let longPressTimeout = 200;
    let tiltTimeoutID;
    let tiltIntervalID;
    $scope.longPressTilt = function (angle) {
        tiltTimeoutID = setTimeout(() => {
            $scope.freeMountModifyFlag = 1;
            tiltIntervalID = setInterval(() => {
                $scope.tiltRobotBaseMounting(angle);
            }, 10);
        }, longPressTimeout); 
    }
    // æ¸é¤é¿æ
    $scope.clearBtnTilt = function () {
        clearTimeout(tiltTimeoutID);
        clearInterval(tiltIntervalID);
    }

    // æè½¬è§é¿æ
    let rotateTimeoutID;
    let rotateIntervalID;
    $scope.longPressRotate = function (angle) {
        rotateTimeoutID = setTimeout(() => {
            $scope.freeMountModifyFlag = 1;
            rotateIntervalID = setInterval(() => {
                $scope.rotateRobotBaseMounting(angle);
            }, 10);
        }, longPressTimeout);
    }
    // æ¸é¤é¿æ
    $scope.clearBtnRotate = function () {
        clearTimeout(rotateTimeoutID);
        clearInterval(rotateIntervalID);
    }

    // åºç¨å®è£è®¾ç½®
    $scope.applyMountRes = '';
    $scope.applyMounting = function () {
        if ($scope.applyMountRes == 'loading') return;
        let robotMountCmd = {
            cmd: 337,
            data: {
                content: "SetRobotInstallPos(3)",
            },
        };
        $scope.applyMountRes = 'loading';
        dataFactory.setData(robotMountCmd).then(() => {}, (status) => {
            $scope.applyMountRes = 'error';
            $timeout(function() {
                $scope.applyMountRes = '';
            }, 5000)
            toastFactory.error(status);
        });
    }
    document.addEventListener('337', () => {
        // èªç±å®è£ç»§ç»­ä¸åå®è£è§åº¦
        let setCmd = {
            cmd: 631,
            data: {
                content: "SetRobotInstallAngle(" + $scope.yAngle + "," + $scope.zAngle + ")",
            },
        };
        dataFactory.setData(setCmd).then(() => {}, (status) => {
            $scope.applyMountRes = 'error';
            $timeout(function() {
                $scope.applyMountRes = '';
            }, 5000)
            toastFactory.error(status);
        });
    })
    document.addEventListener('631', () => {
        $scope.freeMountModifyFlag = 1;
        document.dispatchEvent(new CustomEvent('mounting-changed', {bubbles: true, cancelable: true, composed: true, detail: 3}));
        $("#robot-mounting-confirm").modal('hide');
    })
    
    // åæ¶å®è£è®¾ç½®
    $scope.cancelMounting = function () {
        $scope.applyMountRes = '';
        if ($scope.freeMountModifyFlag) {
            $("#robot-mounting-confirm").modal('show');
        } else {
            $scope.switchVirtualFunc(0);
        }
    }
    
    // ç´æ¥éåºæºå¨äººå®è£æ¹å¼è®¾ç½®
    $scope.quitSetMounting = function () {
        $scope.freeMountModifyFlag = 0;
        viewer.resetFreeMounting(lastYAngle, lastZAngle);
        viewer.changeFreeMounting($scope.curYAngle, $scope.curZAngle);
        lastYAngle = $scope.curYAngle;
        lastZAngle = $scope.curZAngle;
        $scope.cancelMounting();
        $("#robot-mounting-confirm").modal('hide');
        $scope.initRobotViewFlag();
        if (navigateUrl) {
            location = navigateUrl; //åæ¢è·¯å¾æ¶ï¼è·³è½¬å°æå­è·¯å¾
            navigateUrl = ''; // æ¸é¤æå­è·¯å¾
        }
        // è°æ´æºå¨äººå®è£æ¹å¼é¡µé¢å®½åº¦
        changeVRobotWidth();
    }
    /* ./æºå¨äºº360åº¦èªç±å®è£è®¾ç½® */
    
    /* resize workspace */
    $scope.resizeBlocklyWorkspace = function () {
        g_resizeFlg = !g_resizeFlg;
        if ($window.innerWidth > 1024) {
            // èåæ ç¼©è¿æ¶è°æ´
            if (!$scope.fullFlag) {
                if (g_resizeFlg) {
                    $(".block-code-container").css('right',`calc(55% - 35rem + 18rem)`);
                } else {
                    $(".block-code-container").css('right',`calc(55% - 35rem + 12rem)`);
                }
            }
            if (g_resizeFlg) {
                document.documentElement.style.setProperty('--live-code-right',`calc(55% - 35rem + 2.5rem)`)
            } else {
                document.documentElement.style.setProperty('--live-code-right',`calc(55% - 35rem - 6rem)`)
            }
        }
        if ($scope.mountShow) {
            changeVRobotWidthCollapse();
        }
        $('body').toggleClass('sidebar-collapse');
        let id = setTimeout(() => {
            if (document.getElementById("graphicalProgramming") != null) {
                document.getElementById("graphicalProgramming").dispatchEvent(new CustomEvent('resize-workspace', { bubbles: true, cancelable: true, composed: true }));
            }
            clearTimeout(id);
        }, 1200);
    }
    
    /*è·åIOå«åéç½®æ°æ® */
    function getTempIOAliasData() {
        const getAliasCmd = {
            cmd: 'get_IO_alias_cfg'
        };
        dataFactory.getData(getAliasCmd).then(data => {
            $scope.tempCtrlDIAliasList = data.CtrlBox.DI;
            $scope.tempCtrlDOAliasList = data.CtrlBox.DO;
            $scope.tempCtrlAIAliasList = data.CtrlBox.AI;
            $scope.tempCtrlAOAliasList = data.CtrlBox.AO;
            $scope.tempEndDIAliasList = data.EndEff.DI;
            $scope.tempEndDOAliasList = data.EndEff.DO;
            $scope.tempEndAIAliasList = data.EndEff.AI;
            $scope.tempEndAOAliasList = data.EndEff.AO;
            getIOConfigContent();
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[59]);
        });
    }

    /* è·åDIãDOéç½®çæå­åå®¹*/
    function getIOConfigContent() {
        // CtrlBoxââââCI0-7
        $scope.DICfgArr.forEach((item, index) => {
            if (item > 0) {
                $scope.tempCtrlDIAliasList[index + 8] = $scope.DICfgData.find(ele => ele.value == Number(item)).name;
            }
        });
        // CtrlBoxââââCO0-7
        $scope.DOCfgArr.forEach((item, index) => {
            if (item > 0) {
                $scope.tempCtrlDOAliasList[index + 8] = $scope.DOCfgData.find(ele => ele.value == Number(item)).name;
            }
        });
        // EndEffââââDI
        $scope.endDICfgArr.forEach((item, index) => {
            if (item > 0) {
                $scope.tempEndDIAliasList[index] = $scope.EndDICfgData.find(ele => ele.value == Number(item)).name;
            }
        });
        $scope.setIOAliasCfg($scope.tempCtrlDIAliasList, $scope.tempCtrlDOAliasList, $scope.tempCtrlAIAliasList, $scope.tempCtrlAOAliasList, $scope.tempEndDIAliasList, $scope.tempEndDOAliasList, $scope.tempEndAIAliasList, $scope.tempEndAOAliasList);
    };

    /**
     * éç½®I/Oå«å
     * @param {array} ctrlDIArr æ§å¶ç®±DIå«å
     * @param {array} ctrlDOArr æ§å¶ç®±DOå«å
     * @param {array} ctrlAIArr æ§å¶ç®±AIå«å
     * @param {array} ctrlAOArr æ§å¶ç®±AOå«å
     * @param {array} endDIArr æ«ç«¯DIå«å
     * @param {array} endDOArr æ«ç«¯DOå«å
     * @param {array} endAIArr æ«ç«¯AIå«å
     * @param {array} endAOArr æ«ç«¯AOå«å
     */
    $scope.setIOAliasCfg = function(ctrlDIArr, ctrlDOArr, ctrlAIArr, ctrlAOArr, endDIArr, endDOArr, endAIArr, endAOArr) {
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
        dataFactory.actData(setAliasParams).then(() => {
            getIOAliasData();
        }, (status) => {
            toastFactory.error(status);
        });
    };
    /**./éç½®I/Oå«å */
    let recordSupportFlag;
    function getIOAliasData() {
        const getAliasCmd = {
            cmd: 'get_IO_alias_cfg'
        };
        dataFactory.getData(getAliasCmd).then(data => {
            $scope.ctrlDIAliasList = data.CtrlBox.DI;
            $scope.ctrlDOAliasList = data.CtrlBox.DO;
            $scope.ctrlAIAliasList = data.CtrlBox.AI;
            $scope.ctrlAOAliasList = data.CtrlBox.AO;
            $scope.endDIAliasList = data.EndEff.DI;
            $scope.endDOAliasList = data.EndEff.DO;
            $scope.endAIAliasList = data.EndEff.AI;
            $scope.endAOAliasList = data.EndEff.AO;

            // å½æºå¨äººåå·ä¸ºfr3c/mtæ¶åªå±ç¤ºäºè·¯åè½
            if ($scope.supportRobotFlag && !recordSupportFlag) {
                let newArr = $scope.clDIArr.slice(8,13);
                $scope.clDIArr = newArr;
                let newArr2 = $scope.clDOArr.slice(8,13);
                $scope.clDOArr = newArr2;
                recordSupportFlag = 1;
            }
            if ($scope.supportRobotFlag) {
                let newArr = $scope.ctrlDIAliasList.slice(8,13);
                $scope.ctrlDIAliasList = newArr;
                let newArr2 = $scope.ctrlDOAliasList.slice(8,13);
                $scope.ctrlDOAliasList = newArr2;
            }

            // æä½åºIO
            $scope.clDIArr.forEach((item, index) => {
                if ($scope.ctrlDIAliasList[index]) {
                    item['aliasName'] = `(${$scope.ctrlDIAliasList[index]})`;
                } else {
                    item['aliasName'] = '';
                }
            });
            $scope.clDOArr.forEach((item, index) => {
                if ($scope.ctrlDOAliasList[index]) {
                    item['aliasName'] = `(${$scope.ctrlDOAliasList[index]})`;
                } else {
                    item['aliasName'] = '';
                }
            });
            $scope.clAOArr.forEach((item, index) => {
                if ($scope.ctrlAOAliasList[index]) {
                    item['aliasName'] = `(${$scope.ctrlAOAliasList[index]})`;
                } else {
                    item['aliasName'] = '';
                }
            });
            $scope.toolDIArr.forEach((item, index) => {
                if ($scope.endDIAliasList[index]) {
                    item['aliasName'] = `(${$scope.endDIAliasList[index]})`;
                } else {
                    item['aliasName'] = '';
                }
            });
            $scope.toolDOArr.forEach((item, index) => {
                if ($scope.endDOAliasList[index]) {
                    item['aliasName'] = `(${$scope.endDOAliasList[index]})`;
                } else {
                    item['aliasName'] = '';
                }
            });
            $scope.toolAOArr[0]['aliasName'] = $scope.endAOAliasList[0] ? `(${$scope.endAOAliasList[0]})` : '';
            // æä½åºTPDï¼TPDCfgDIãTPDCfgDOï¼
            $scope.TPDCfgDI.forEach((item, index) => {
                switch (index) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        if ($scope.ctrlDIAliasList[index - 1]) {
                            item['aliasName'] = `(${$scope.ctrlDIAliasList[index - 1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 9:
                        if ($scope.endDIAliasList[0]) {
                            item['aliasName'] = `(${$scope.endDIAliasList[0]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 10:
                        if ($scope.endDIAliasList[1]) {
                            item['aliasName'] = `(${$scope.endDIAliasList[1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    default:
                        break;
                }
            });
            $scope.TPDCfgDO.forEach((item, index) => {
                switch (index) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        if ($scope.ctrlDOAliasList[index - 1]) {
                            item['aliasName'] = `(${$scope.ctrlDOAliasList[index - 1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 9:
                        if ($scope.endDOAliasList[0]) {
                            item['aliasName'] = `(${$scope.endDOAliasList[0]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    case 10:
                        if ($scope.endDOAliasList[1]) {
                            item['aliasName'] = `(${$scope.endDOAliasList[1]})`;
                        } else {
                            item['aliasName'] = '';
                        }
                        break;
                    default:
                        break;
                }
            });
        }, (status) => {
            toastFactory.error(status, indexDynamicTags.error_messages[59]);
        });
    };

    document.addEventListener('setIOAliasData', () => {
        getIOAliasData();
    })

    /**æºå¨äººæ¨¡åéºå¼ */
    // æºå¨äººæ¨¡åéºå¼æé®çåå§åå¤æ­
    if ($window.location.href.split('#/')[1]) {
        $scope.robotViewFlag = true;
    } else {
        $scope.robotViewFlag = false;
    }
    $scope.initRobotViewFlag = function() {
        $scope.robotViewFlag = true;
    }
    $scope.resizeRobotView = function() {
        if ($scope.mountShow) {
            $scope.switchVirtualFunc(0);
            $scope.quitSetMounting();
        }
        $location.path('/');
        $('.sidebar-menu').tree();
        $('.sidebar-menu').find('.menu-open').removeClass('menu-open');
        $('.sidebar-menu').find('.active').removeClass('active');
        $('.sidebar-menu').find('ul').css('display', 'none');
        $("#vRobot-view").addClass("col-md-12");
        $("#vRobot-view").removeClass("vRobot-55");
        $("#robot-setting").removeAttr('style');
        $("#robot-object").removeAttr('style');
        $("#robot-status").removeAttr('style');
        $("#robot-support").removeAttr('style');
        hideRobotSettingFixed();
        document.getElementById("vRobot-view").style.zIndex = 0;
        $scope.clickRobotSetting();
        $scope.toggleDataDisplay();
        $scope.clickRobotSupport();
        $scope.fullFlag = 1;
        $scope.robotViewFlag = false;
        $scope.setProgramUrdf(false);
    }

    /**è·åå½åçæ¬ */
    function getWebVersion() {
        dataFactory.getData({ cmd: "get_webversion" }).then((data) => {
            $scope.webVersion = data.version;
            $scope.webVersionDate = data.date;
        }, (status) => {
            $scope.webVersion = '';
            $scope.webVersionDate = '';
            toastFactory.error(status, indexDynamicTags.error_messages[66]);
        });
    }

    /* ä¸ç»´æä½æ åå®¹é¡µå®ä½å±ç¤º */
    function locateContent(e, id, isResize) {
        // robot-setting-infoå±ç¤ºä½ç½®
        if (e != undefined) {
            $(document).ready(function () {
                let parentLeft = e.currentTarget.offsetParent.offsetLeft;
                let parentTop = e.currentTarget.offsetParent.offsetTop;
                let parentWidth = e.currentTarget.offsetParent.offsetWidth;
                let leftOffset =  0;
                let topOffset =  0;
                let zIndex =  0;
                if (id == "#robot-setting-info") {
                    leftOffset = parentLeft + parentWidth;  
                    topOffset = parentTop + 25;
                    zIndex = 2;
                } else if (id == "#robot-status-info") {
                    leftOffset = parentLeft - 278;
                    topOffset = parentTop + 25;
                    zIndex = 1;
                }
                if (id == "#robot-support-info") {
                    leftOffset = parentLeft + (parentWidth / 2) - (document.querySelector(id).offsetWidth / 2) - 5;
                    topOffset = parentTop - document.querySelector(id).offsetHeight - 10;
                    document.querySelector(id).style.left = `${leftOffset}px`;
                    document.querySelector(id).style.top = `${topOffset}px`;
                    document.querySelector(id).style.zIndex = 2;
                } else {
                    if (isResize && id == "#robot-status-info") {
                        document.querySelector(id).style.right = `62px`;
                        document.querySelector(id).style.removeProperty('left')
                    } else {
                        document.querySelector(id).style.left = `${leftOffset}px`;
                    }
                    document.querySelector(id).style.top = `${topOffset}px`;
                    document.querySelector(id).style.zIndex = zIndex;
                }
            })
        }
    }

    /**ä¸ç»´å¯¹è±¡çå¾æ åæ¢ */
    $scope.maxDistance = 30;
    $scope.showTcp = false;
    $scope.showJointSingle = false;
    $scope.showJointMult = false;
    $scope.showMove = false;
    $scope.robotSettingTcp = true;
    $scope.clickRobotSetting = function(event, index) {
        updatedescartesFlg = 1;
        $scope.robotSettingEvent = event ? event : $scope.robotSettingEvent;
        // robot-setting-infoå±ç¤ºä½ç½®
        locateContent(event, "#robot-setting-info");
        // robot-setting-infoåå®¹ä¾æ®éé¡¹indexåæ¢
        $scope.showTcp = false;
        $scope.showJointSingle = false;
        $scope.showJointMult = false;
        $scope.showMove = false;
        if ($scope.showRobotSetting && $scope.lastRobotSettingIndex == index) {
            $scope.showRobotSetting = false;
        } else {
            $scope.showRobotSetting = true;
            switch (index) {
                case 0:
                    $scope.selectCoordSys(1);
                    $scope.showTcp = !$scope.showTcp;
                    $scope.maxDistanceUnit = "(mm)(Â°)";
                    updateJointsFlg = 1;
                    $(document).ready(function () {
                        if ($('#robot-setting-info').height() > 500 || $('#urdf-container').width() < 570) {
                            $scope.robotSettingTcp = true;
                        } else {
                            $scope.robotSettingTcp = false;
                        }
                        $scope.$apply();
                    })
                    break;
                case 1:
                    $scope.selectedCoordSys = referenceCoord[0];
                    $scope.showJointSingle = !$scope.showJointSingle;
                    $scope.maxDistanceUnit = "(Â°)";
                    updateJointsFlg = 1;
                    break;
                case 2:
                    $scope.selectedCoordSys = referenceCoord[0];
                    $scope.showJointMult = !$scope.showJointMult;
                    $scope.maxDistanceUnit = "(Â°)";
                    break;
                case 3:
                    $scope.showMove = !$scope.showMove;
                    break;
                default:
                    $scope.showRobotSetting = false;
                    break;
            }
        }
        $scope.lastRobotSettingIndex = index;
        if (index != undefined) {
            if (document.querySelector('#vRobot-view').offsetWidth < 710) {
                $scope.clickRobotSupport();
            }
        }
    }

    /**
     * TCPåæ¢ï¼
     * @param {int} index 1:base, 2:tool, 3:wobj
     */
    $scope.selectedCoordSys = referenceCoord[0];
    $scope.selectCoordSys = function(index) {
        $scope.selectedCoordSys = referenceCoord[index];
        switch (index) {
            case 1:
                document.getElementById("btnBase").checked = true;
                document.getElementById("btnBaseFixed").checked = true;
                break;
            case 2:
                document.getElementById("btnTool").checked = true;
                document.getElementById("btnToolFixed").checked = true;
                break;
            case 3:
                document.getElementById("btnWobj").checked = true;
                document.getElementById("btnWobjFixed").checked = true;
                break;
            default:
                break;
        }
    };

    /**éå¥åè½çå¾æ åæ¢ */
    $scope.showPoint = false;
    $scope.showIO = false;
    $scope.showTPD = false;
    $scope.showEaxis = false;
    $scope.showFT = false;
    $scope.showRCM = false;
    $scope.clickRobotSupport = function(event, index) {
        updatedescartesFlg = 1;
        $scope.robotSupportEvent = event ? event : $scope.robotSupportEvent;
        $scope.showPoint = false;
        $scope.showIO = false;
        $scope.showTPD = false;
        $scope.showEaxis = false;
        $scope.showFT = false;
        $scope.showRCM = false;
        if ($scope.showRobotSupport && $scope.lastRobotSupportIndex == index) {
            $scope.showRobotSupport = false;
        } else {
            $scope.showRobotSupport = true;
            switch (index) {
                case 0:
                    $scope.showPoint = !$scope.showPoint;
                    break;
                case 1:
                    $scope.showIO = !$scope.showIO;
                    break;
                case 2:
                    getTPDName();
                    $scope.showTPD = !$scope.showTPD;
                    break;
                case 3:
                    $scope.showEaxis = !$scope.showEaxis;
                    break;
                case 4:
                    $scope.showFT = !$scope.showFT;
                    if ($scope.showFT) {
                        getDynamicData('init');
                    }
                    $scope.ftEvent = event;
                    break;
                case 5:
                    $scope.showRCM = !$scope.showRCM;
                    $scope.show_RCM_Edit = false;
                    $scope.rcmEvent = event;
                    break;
                default:
                    $scope.showRobotSupport = false;
                    break;
            }
        }
        $scope.lastRobotSupportIndex = index;
        document.querySelector("#robot-support-info").style.zIndex = -1;
        locateContent(event, "#robot-support-info");
        if (index != undefined) {
            if (document.querySelector('#vRobot-view').offsetWidth < 710) {
                $scope.clickRobotSetting();
            }
        }
    }

    /* æ£æµé¡µé¢ç¼©æ¾è°æ´é¡µé¢ */
    $window.addEventListener('resize', function () {
        $scope.robotSettingTcp = true;
        $("#robot-setting").removeAttr('style');
        $("#robot-object").removeAttr('style');
        $("#robot-status").removeAttr('style');
        $("#robot-support").removeAttr('style');
        // robot-setting-infoå±ç¤ºä½ç½®
        if ($scope.showRobotSetting && $scope.robotSettingEvent) {
            locateContent($scope.robotSettingEvent, "#robot-setting-info");
        }
        // robot-status-infoå±ç¤ºä½ç½®
        if ($scope.showRobotInfo && $scope.dataDisplayEvent) {
            locateContent($scope.dataDisplayEvent, "#robot-status-info", true);
        }
        // robot-support-infoå±ç¤ºä½ç½®
        if ($scope.showRobotSupport && $scope.robotSupportEvent) {
            locateContent($scope.robotSupportEvent, "#robot-support-info");
        }
        if (document.getElementById('btn-expand')) {
            document.getElementById('btn-expand').style.width = `${document.getElementById('urdf-container').offsetWidth}px`;
        }
        if ($window.location.href.split('#/')[1] == 'programteach') {
            $scope.setProgramUrdf(true);
        } else {
            $scope.setProgramUrdf(false);
        }
        $scope.$apply();
    });

    /* åçº§å¤±è´¥çå³é­æé® */
    document.getElementById("updateClose").addEventListener("click", (e) => {
        $('#updatePage').css("display", "none");
        $('#updateLog').css("display", "none");
        $('#updateText').css("display", "none");
        $('#updateError').css("display", "none");
        $('#updateClose').css("display", "none");
        $scope.upgradeProcess = 0;
    });

    /* ç¼ç å¨åæ­¢æ ¡é¶ */
    // çå¬ç¼ç å¨å¼å§æ ¡é¶ï¼è·åå³èid
    document.addEventListener('encoderZeroRun', (e) => {
        $scope.encoderZeroRunJoint = e.detail;
    });
    /**
     * ç¼ç å¨åæ­¢æ ¡é¶
     * @param {Number} jointId æºå¨äººå³è1~6
     */
    $scope.stopEnconderZero = function(jointId) {
        let startEnconderZeroCmd = {
            cmd: 1190,
            data: {
                content: `SetSingleEnconderZeroStop(${jointId})`,
            },
        };
        dataFactory.setData(startEnconderZeroCmd).then(() => {
        }, (status) => {
            toastFactory.error(status);
            /* test */
            if (g_testCode) {
                $('#encoderZeroRun').css("display", "none");
                $('#encoderZeroStopSuccess').css("display", "block");
                $('#encoderZeroStopFail').css("display", "none");
            }
            /* ./test */
        });
    }
    document.addEventListener('1190', function (e) {
        $('#encoderZeroRun').css("display", "none");
        if (e.detail == 1) {
            $('#encoderZeroStopSuccess').css("display", "block");
            $('#encoderZeroStopFail').css("display", "none");
        } else {
            $('#encoderZeroStopSuccess').css("display", "none");
            $('#encoderZeroStopFail').css("display", "block");
        }
    });
    /* ç¼ç å¨åæ­¢æ ¡é¶ */

    /* æºå¨äººæå */
    // ç§»è³æºæ¢°é¶ç¹
    let robotJoints; //robotåè½´æ°æ®
    let moveToPackFlag = 0;
    $scope.moveToZero = function() {
        if ($scope.controlMode != "1") {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else {
            robotJoints = {
                j1: "0",
                j2: "0",
                j3: "0",
                j4: "0",
                j5: "0.02",
                j6: "0",
            };
            // è®¡ç®åºtcf
            let tcfJointCmd = {
                cmd: 320,
                data: robotJoints
            };
            dataFactory.setData(tcfJointCmd).then(() => {
                moveToPackFlag = 1;
            }, (status) => {
                toastFactory.error(status);
            })
        }
    }

    // ç§»è³æåç¹
    $scope.moveToPack = function() {
        if ($scope.controlMode != "1") {
            toastFactory.warning(indexDynamicTags.warning_messages[0]);
        } else { 
            if (g_robotTypeCode == 1 || g_robotType.type == 6) {  // FR3-V5.0
                robotJoints = {
                    j1: "172.969",
                    j2: "0.911",
                    j3: "-141.361",
                    j4: "-126.898",
                    j5: "-89.816",
                    j6: "-169.303"
                }
            } else if (g_robotTypeCode == 101 || g_robotTypeCode == 102 || g_robotType.type == 7) {  // FR5-V4.0 || FR5-V5.0 
                robotJoints = {
                    j1: "174.358",
                    j2: "0.265",
                    j3: "-158.169",
                    j4: "-113.687",
                    j5: "-174.564",
                    j6: "-16.422"
                }
            } else if (g_robotTypeCode == 201) {        // FR10 V5.0
                robotJoints = {
                    j1: "174.314",
                    j2: "0.849",
                    j3: "-164.762",
                    j4: "-104.419",
                    j5: "-178.714",
                    j6: "-31.675"
                }
            } else if (g_robotTypeCode == 2 || g_robotTypeCode == 703) {           // FR3 V6.0ãFR3WMS
                robotJoints = {
                    j1: "45",
                    j2: "0",
                    j3: "-148",
                    j4: "-122",
                    j5: "0.02",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 901 || g_robotTypeCode == 904 || g_robotTypeCode == 906) {           // FR3MT || FR3C || FR3(C)
                robotJoints = {
                    j1: "85",
                    j2: "0",
                    j3: "-148",
                    j4: "-122",
                    j5: "0.02",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 3) {           // FR3 V6.0(Mirror)
                robotJoints = {
                    j1: "-125",
                    j2:"178",
                    j3: "-148",
                    j4: "65",
                    j5: "0.02",
                    j6: "0.05"
                }
            } else if (g_robotTypeCode == 103) {        // FR5 V6.0
                robotJoints = {
                    j1: "95",
                    j2: "0",
                    j3: "-158",
                    j4: "-122",
                    j5: "0.02",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 202) {        // FR10 V6.0
                robotJoints = {
                    j1: "-90",
                    j2: "10",
                    j3: "-159",
                    j4: "-120",
                    j5: "0.02",
                    j6: "10"
                }
            } else if (g_robotTypeCode == 302) {        // FR16 V6.0
                robotJoints = {
                    j1: "-125",
                    j2: "10",
                    j3: "-158",
                    j4: "-122",
                    j5: "0.02",
                    j6: "10"
                }
            } else if (g_robotTypeCode == 402 || g_robotTypeCode == 905) {        // FR20 V6.0ãFR30L
                robotJoints = {
                    j1: "-103",
                    j2: "5",
                    j3: "-159",
                    j4: "-120",
                    j5: "0.02",
                    j6: "0",
                }
            } else if (g_robotTypeCode == 702) {        // FR3WML
                robotJoints = {
                    j1: "95",
                    j2: "0",
                    j3: "-162.7",
                    j4: "-122",
                    j5: "0.02",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 804) {        // FR5C
                robotJoints = {
                    j1: "95",
                    j2: "0",
                    j3: "-158",
                    j4: "-122",
                    j5: "0.02",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 803) { // FR5WML
                robotJoints = {
                    j1: "-135",
                    j2: "7",
                    j3: "-167",
                    j4: "-110",
                    j5: "0",
                    j6: "0"
                }
            } else if (g_robotTypeCode == 1001) {        // FR30 V6.0
                robotJoints = {
                    j1: "-80",
                    j2: "5",
                    j3: "-159",
                    j4: "70",
                    j5: "0.02",
                    j6: "0",
                }              
            } else {
                // type=3,4,5,typeCode=902(FR10,FR16,FR20,FR10YD)ææ æåç¹åè½
                return;
            }
            let transitPointCmd = {
                cmd: 320,
                data: robotJoints
            };
            dataFactory.setData(transitPointCmd).then(() => {
                moveToPackFlag = 1;
            }, (status) => {
                toastFactory.error(status);
            })
        }
    };
    /* ./æºå¨äººæå */
	
    document.addEventListener('setHttpStart', () => {
            $scope.setFeedError = false;
        })
    };

/**
 * æ°æ®æ¥å£å°è£
 * @returns 
 */
function dataFactoryFn($http, $q, $window) {
    var service = {};
    service.getData = function (cmdObject) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/get",
            data: cmdObject
        }).success(function (data, status) {
            if (status == 302) {
                location = '/login.html';
            } else {
                deferred.resolve(data);
            }
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    service.setData = function (dataObject) {
	    document.dispatchEvent(new CustomEvent('setHttpStart', { bubbles: true, cancelable: true, composed: true }));
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/set",
            data: dataObject
        }).success(function (data, status) {
            if (data != "success") {
                toastr.error(data);
                return;
            }
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    //act: use to save, delete and rename file. 
    service.actData = function (dataObject) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/act",
            data: dataObject
        }).success(function (data, status) {
            if (data != "success") {
                $('#pageLoading').css("display", "none");
                toastr.error(data);
                return;
            }
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    service.staData = function (dataObject) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/sta",
            data: dataObject
        }).success(function (data, status) {
            // å¦æè¿åçæ°æ®ç±»åä¸æ¯object(ä¾å¦ï¼login.htmlåå®¹)ï¼åè¿è¡è·³è½¬Login.html
            if (typeof (data) != "object") {
                location = '/login.html';
            }
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    // æä»¶ä¸ä¼ æå¡
    service.uploadData = function (dataObject) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/upload",
            data: dataObject,
            headers: { 'Content-type': undefined },
            uploadEventHandlers: {
                progress: function (e) {
                    if (document.getElementById('auxiliaryApplication') != null && document.getElementById('auxiliaryApplication') != undefined) {
                        document.getElementById('auxiliaryApplication').dispatchEvent(new CustomEvent('uploadprogress', { bubbles: true, cancelable: true, composed: true, detail: e.loaded / e.total * 100 }))
                    }
                    if (document.getElementById('systemSetting') != null && document.getElementById('systemSetting') != undefined) {
                        document.getElementById('systemSetting').dispatchEvent(new CustomEvent('uploadprogress', { bubbles: true, cancelable: true, composed: true, detail: e.loaded / e.total * 100 }))
                    }
                }
            }
        }).success(function (data, status) {
            if (typeof(data) == "object") {
                let uploadInfo = JSON.parse(JSON.stringify(data));
                deferred.resolve(uploadInfo);
                if (!$.isEmptyObject(uploadInfo)) {
                    if (uploadInfo.hasOwnProperty("error_info")) {
                        toastr.error(data.error_info);
                    }
                } else {
                    console.error("[Error]: The data returned by upload service does not exist 'error_info' property.");
                }
            } else {
                deferred.resolve(data);
            }
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    // æä»¶ä¸è½½è·¯å¾å­å¸
    let downloadFileUrl = {
        // ç³»ç»è®¾ç½®é¡µé¢
        "system.txt": { // ç³»ç»éç½®æä»¶
            1: "/usr/local/etc/web/cfg/system.txt",
            0: "/root/web/file/cfg/system.txt"
        },
        "FR_SAFE_H7_LOG.tar.gz": { // å®å¨æ¿éç½®æä»¶
            1: "/tmp/FR_SAFE_H7_LOG.tar.gz",
            0: "/tmp/FR_SAFE_H7_LOG.tar.gz"
        },
        "rblog.tar.gz": { // æ§å¶å¨æ¥å¿æä»¶
            1: "/usr/local/etc/controller/rblog.tar.gz",
            0: "/root/robot/rblog.tar.gz"
        },
        "alldatasources.tar.gz": { // ç³»ç»æææ°æ®æºæ°æ®
            1: "/usr/local/etc/alldatasources.tar.gz",
            0: "/alldatasources.tar.gz"
        },
        "account_authority.tar.gz": { // è´¦æ·ç®¡çæ°æ®åº
            1: "/tmp/account_authority.tar.gz",
            0: "/tmp/account_authority.tar.gz"
        },
        "DH_point.txt": { // DHåæ°ééæä»¶
            1: "/usr/local/etc/web/file/points/DH_point.txt",
            0: "/root/web/file/points/DH_point.txt"
        },
        "stiff_point.txt": { // ååº¦åæ°ééæä»¶
            1: "/usr/local/etc/web/file/points/stiff_point.txt",
            0: "/root/web/file/points/stiff/stiff_point.txt"
        },
        "robot_point.txt": { // æºå¨äººDHæ å®ç¹è®°å½æä»¶
            1: "/tmp/robot_point.txt",
            0: "/tmp/robot_point.txt"
        },
        "dhpara.config": { // DHéç½®æä»¶
            1: "/usr/local/etc/controller/dhpara.config",
            0: "/root/robot/dhpara.config"
        },
        "jointallparameters.db": { // å¨å³èåæ°çæ°æ®
            1: "/usr/local/etc/robot/jointallparameters.db",
            0: "/root/robot/jointallparameters.db"
        },
        "systemLanguagePackage": { // ç³»ç»è¯­è¨å
            1: "/tmp/",
            0: "/tmp/"
        },
        "DH_point_all.txt": {  // DHåæ°ä¼å 2.0ââDHåæ°è¡¥å¿-ç¹éç½®æä»¶å¯¼åº
            1: "/usr/local/etc/web/file/points/DH_point_all.txt",
            0: "/root/web/file/points/DH_point_all.txt"
        },
        "robot_point_all.txt": {  // DHåæ°ä¼å 2.0ââDHåæ°è¡¥å¿-è®°å½æ°æ®å¯¼åº
            1: "/usr/local/etc/web/file/points/robot_point_all.txt",
            0: "/root/web/file/points/robot_point_all.txt"
        },
        "DH_coord_all.txt": {  // DHåæ°ä¼å èªå¨å-v2.0ââè®°å½æ°æ®å¯¼åº
            1: "/usr/local/etc/web/file/points/DH_coord_all.txt",
            0: "/root/web/file/points/DH_coord_all.txt"
        },
        "DH_coord.txt": {  // DHåæ°ä¼å èªå¨å-v1.0ââè®°å½æ°æ®å¯¼åº
            1: "/usr/local/etc/web/file/points/DH_coord.txt",
            0: "/root/web/file/points/DH_coord.txt"
        },
        "DH_check_coord_all.txt": {  // DHåæ°ä¼å èªå¨åââè¡¥å¿æ°æ®å¯¼åº
            1: "/usr/local/etc/web/file/points/DH_check_coord_all.txt",
            0: "/root/web/file/points/DH_check_coord_all.txt"
        },
        // ç³»ç»æ¥å¿é¡µé¢
        "log.db": { // æ¥å¿æ°æ®åº
            1: "/usr/local/etc/web/log/log.db",
            0: "/root/web/log/log.db"
        },
        "catl_log.tar.gz": { // catlæ¥å¿æ°æ®åº
            1: "/tmp/catl_log.tar.gz",
            0: "/tmp/catl_log.tar.gz"
        },
        // çæ¥ä¸å®¶åº
        "lineseam.txt": { // ç´çº¿çç¼å·¥èºæä»¶
            1: "/root/web/file/weld/lineseam.txt",
            0: "/root/web/file/weld/lineseam.txt"
        },
        "arcseam.txt": { // åå¼§çç¼å·¥èºæä»¶
            1: "/root/web/file/weld/arcseam.txt",
            0: "/root/web/file/weld/arcseam.txt"
        },
        // ç¤ºæç¹ç®¡ç
        "pointTable": { // ç¹ä½è¡¨æ°æ®åº
            1: "/usr/local/etc/web/file/points/point_table/",
            0: "/root/web/file/points/point_table/"
        },
        "web_point.db": { // ç³»ç»æ¨¡å¼ç¤ºæç¹æ°æ®åº
            1: "/usr/local/etc/web/file/points/web_point.db",
            0: "/root/web/file/points/web_point.db"
        },
        // æºå¨äººåºç¡è®¾ç½®
        "fr_controller_data.db": { // æ§å¶å¨æ°æ®åº
            1: "/usr/local/etc/controller/fr_controller_data.db",
            0: "/root/robot/fr_controller_data.db"
        },
        "user.config": { // æºå¨äººéç½®æä»¶
            1: "/usr/local/etc/controller/user.config",
            0: "/root/robot/user.config"
        },
        // ç¶ææ¥è¯¢é¡µé¢
        "statefb.txt": { // åæ°æ¥è¯¢æ°æ®æä»¶
            1: "/usr/local/etc/web/file/statefb/statefb.txt",
            0: "/root/web/file/statefb/statefb.txt"
        },
        // å¾å½¢åç¼ç¨é¡µé¢
        "blocklyWorkspace": { // Blocklyå·¥ä½åºJSONæä»¶
            1: "/usr/local/etc/web/file/block/",
            0: "/root/web/file/block/"
        },
        // è¾å©åºç¨é¡µé¢
        "fr_user_data.tar.gz": { // ç¨æ·æ°æ®æä»¶
            1: "/usr/local/etc/fr_user_data.tar.gz",
            0: "/fr_user_data.tar.gz"
        },
        "statefb10.txt": { // 10sè®°å½æ°æ®æä»¶
            1: "/usr/local/etc/web/file/statefb/statefb10.txt",
            0: "/root/web/file/statefb/statefb10.txt"
        },
        "RTDEConfig.lua": { // ç¨æ·èªå®ä¹åè®®æä»¶
            1: "/usr/local/etc/controller/RTDEConfig.lua",
            0: "/root/robot/RTDEConfig.lua"
        },
        "CtrlDev_field.tar.gz": { // éè®¯æ¿å¡IOéç½®-ç¹éç½®æä»¶å¯¼åº
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_field.tar.gz",        
            0: "/fruser/ctrlopenlua/CtrlDev_field.tar.gz"
        },
        "CtrlDev_sucker.lua": { // å¸çéç½®æä»¶
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_sucker.lua",        
            0: "/fruser/ctrlopenlua/CtrlDev_sucker.lua"
        },
        "CtrlDev_socket0.lua": { // socketèªå®ä¹Luaæä»¶
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_socket0.lua",        
            0: "/fruser/ctrlopenlua/CtrlDev_socket0.lua"
        },
        "CtrlDev_socket1.lua": { // socketèªå®ä¹Luaæä»¶
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_socket1.lua",        
            0: "/fruser/ctrlopenlua/CtrlDev_socket1.lua"
        },
        "CtrlDev_socket2.lua": { // socketèªå®ä¹Luaæä»¶
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_socket2.lua",        
            0: "/fruser/ctrlopenlua/CtrlDev_socket2.lua"
        },
        "CtrlDev_socket3.lua": { // socketèªå®ä¹Luaæä»¶
            1: "/usr/local/etc/web/file/user/ctrlopenlua/CtrlDev_socket3.lua",        
            0: "/fruser/ctrlopenlua/CtrlDev_socket3.lua"
        },
        "openluaProtocol": { // å¤è®¾å¼æ¾åè®®
            1: "",
            0: ""
        },
        // é¦é¡µç¶æé¡µ
        "interpret_log.tar.gz": { // æ§å¶å¨ä»ç«åè®®æ¥å¿
            1: "/usr/local/etc/slave_station/interpret_log.tar.gz",
            0: "/root/slave_station/interpret_log.tar.gz"
        },
        // èç¹å¾ç¼ç¨
        "nodeGraph": { // èç¹å¾
            1: "/usr/local/etc/web/file/node_graph/",
            0: "/root/web/file/node_graph/"
        },
        // å¤è®¾éç½®é¡µé¢
        "controlProtocol": { // æ§å¶å¨å¼æ¾åè®®
            1: "/usr/local/etc/web/file/user/ctrlopenlua/",
            0: "/fruser/ctrlopenlua/"
        },
        "torqueRecipe": { // æ­ç©å·¥èºåå·¥ä»¶éæ¹
            1: "/usr/local/etc/web/file/torquesys/",
            0: "/tmp/"
        },
        "palletizingFormula": { // ç åå·¥èºåéæ¹
            1: "/usr/local/etc/",
            0: "/"
        },
        // ç¨åºç¼ç¨é¡µé¢
        "robotLuaProgram": { // æºå¨äººç¤ºæLuaç¨åº
            1: "/tmp/",
            0: "/tmp/"
        }
    };
    /**
     * æä»¶ä¸è½½æ¥å£
     * @param {string} fileName ä¸è½½æä»¶åç§°
     * @param {string} fileType ä¸è½½æä»¶ç±»åï¼ä¸è¬ä¸ºæä»¶çéç¨åç§°è±æç¿»è¯ï¼å¨ä¸è½½æä»¶åç§°éè¦èµå¼æ¶å¯ç¨ï¼ä¸è¬ä¸ºç¼ºçï¼
     * @example 
     * dataFactory.downloadData("user.config") // ä¸è½½æä»¶åç§°ä¸ºåºå®å¼
     * dataFactory.downloadData(`${pNamePrefix}${$scope.fileSelected.split('.')[0]}.tar.gz`, "robotLuaProgram") // ä¸è½½æä»¶åç§°éåéèµå¼
     */
    service.downloadData = function (fileName, fileType) {
        if (downloadFileUrl.hasOwnProperty(fileName)) {
            $window.location.href = `/action/download?pathfilename=${downloadFileUrl[fileName][g_systemFlag]}?v=${new Date().getTime()}`;
        } else if (fileType != undefined && downloadFileUrl.hasOwnProperty(fileType)) {
            $window.location.href = `/action/download?pathfilename=${downloadFileUrl[fileType][g_systemFlag]}${fileName}?v=${new Date().getTime()}`;
        }
    }

    // ç»åº
    service.logout = function () {
        $http({
            method: "POST",
            url: "/action/logout",
        }).success(function () {
            location = '/login.html';
            if (g_socketStream) {
                g_socketStream.close();
            }
            g_socketLogoutFlag = 1;
        }).error(function () {
            toastr.error("Failed to logout");
        });
    };

    // ç¹ä½è®°å½
    service.savePoint = function (pointName, pointCover) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/action/act",
            data: {
                cmd: "save_point",
                data: {
                    name: pointName,
                    update_allprogramfile: pointCover
                }
            }
        }).success(function (data, status) {
            if (data != "success") {
                toastr.error(data);
                return;
            }
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(status);
        });
        return deferred.promise;
    }

    return service;
};

/**
 * æä»¤äº¤äºæç¤ºæå¡
 * @returns 
 */
function toastFactoryFn($window) {
    let toastrDynamicTags;
    if (!$.isEmptyObject(JSON.parse($window.sessionStorage.getItem("langJsonData")))) {
        toastrDynamicTags = JSON.parse($window.sessionStorage.getItem("langJsonData")).frontend.toastr;
    }
    var service = {};
    // æç¤ºæ¶æ¯æç¤º
    service.info = function (message) {
        if (message == null || message == undefined || message == "") {
            toastr.info(toastrDynamicTags.default[0]);
        } else {
            toastr.info(message);
        }
    }
    // è­¦åæ¶æ¯æç¤º
    service.warning = function (message) {
        if (message == null || message == undefined || message == "") {
            toastr.warning(toastrDynamicTags.default[1]);
        } else {
            toastr.warning(message);
        }
    }
    // æåæ¶æ¯æç¤º
    service.success = function (message) {
        if (message == null || message == undefined || message == "") {
            toastr.success(toastrDynamicTags.default[2]);
        } else {
            toastr.success(message);
        }
    }
    // å¤±è´¥æ¶æ¯æç¤º
    service.error = function (status, message) {
        if (status == 400) {
            if (message == null || message == undefined || message == "") {
                toastr.error(toastrDynamicTags.default[3]);
            } else {
                toastr.error(message);
            }
        } else if (status == 403) {
            if (message == null || message == undefined || message == "") {
                toastr.error(toastrDynamicTags.default[4]);
            } else {
                toastr.error(message);
            }
        } else if (status == 404) {
            if (message == null || message == undefined || message == "") {
                toastr.error(toastrDynamicTags.default[5]);
            } else {
                toastr.error(message);
            }
        }
    }
    return service;
}

/**
 * æ£æµå°è®¾å¤ä¸ºé¸¿è/æ¾æ¹ç³»ç»æ¶ï¼å°touchäºä»¶å°pointeräºä»¶ï¼é¸¿è/æ¾æ¹æ¯æpointeräºä»¶ï¼
 */
function touchHarmonyHyperFn() {
    // æ£æµé¸¿è/æ¾æ¹ç³»ç»
    const isHarmonyOS = /harmony|huawei/i.test(navigator.userAgent);
    const isHyperOS = /hyperos|xiaomi/i.test(navigator.userAgent);

    if (isHarmonyOS || isHyperOS) {

        // æ©å± jQuery/angular çäºä»¶ç»å®
        if (typeof jQuery !== 'undefined') {
            // ä¿®å¤ touch äºä»¶æ¯æ
            const originalOn = jQuery.fn.on;
            jQuery.fn.on = function () {
                const args = Array.from(arguments);

                // æ å° touch äºä»¶å° pointer äºä»¶
                const eventMap = {
                    'touchstart': 'pointerdown',
                    'touchmove': 'pointermove',
                    'touchend': 'pointerup',
                    'touchcancel': 'pointercancel'
                };

                if (eventMap[args[0]]) {
                    args[0] = eventMap[args[0]];
                }

                return originalOn.apply(this, args);
            };
        }
    }
}

