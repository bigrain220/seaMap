
// init
import {routeCompositeLayer,meetFaceLayer} from "@/util/map/layerPos";
import store from '@/store/index'

window.g_showSimpleInfoDiv = null;
window.g_showDrawObjInfoByMouseMoveDiv = null;
var g_showDetailShipInfoDiv = null;
// Test_AddLayer
window.g_iPointLayerId = 100; //点图层的id
window.g_iPointStylePos = 0;//样式pos
window.g_iLineLayerId = 200; //线图层的id
window.g_iLineStylePos = 0;
window.g_iFaceLayerId = 300; //面图层的id
window.g_iFaceStylePos = 0;
window.g_iCompositeLayerId = 400; //综合图层的id
window.g_iCompositeStylePos = 0;
window.g_iAddObjId = 0;
window.g_iSimpleBoxOneLineSize = 20; //信息面板添加一行对应增加了多少高度
window.g_iWeatherLayerId = 1000; //气象图层id
window.g_iPortLayerId = 2000; //港口图层的id
var g_iOceanCirculationLayerId = 3000;//洋流图层




var browser = {
    versions: function () {
        var u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Firefox') > -1, //火狐内核Gecko
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android
            iPhone: u.indexOf('iPhone') > -1, //iPhone
            iPad: u.indexOf('iPad') > -1, //iPad
            webApp: u.indexOf('Safari') > -1 //Safari
        };
    }()
}

function init() {
    var objMapInfo = [];
    var mapObj = document.getElementById("map");
    API_SetMapImgMode(1);//1=使用叠加谷歌地图模式
    API_SetMapMinMaxLevel(1, 18);//设置比例尺级别从1-19
    objMapInfo.div = "map"; //海图容器div的id
    if (browser["versions"].mobile || browser["versions"].iPhone || browser["versions"].iPad || browser["versions"].webApp) {
        objMapInfo.model = "android"; //用于android环境
    } else {
        objMapInfo.model = "pc"; //用于pc环境
    }
    objMapInfo.model = "pc"; //用于pc环境
    API_InitYimaMap(objMapInfo);//初始化SDK

    API_SetShowToolBarOrNot(true, 80, 50); //显示工具条
    // API_SetShowToolBarOrNot(false); //显示工具条
    API_SwitchLanguage(0);////0：中文，1：英文


    // API_SetMapImagesUrl("http://www.yimasoftdemo.cc:800/mapimg/");// 1版本
    // API_SetMapImagesUrl("http://www.yimasoftdemo.cc:800/mapImage/");//2版
    API_SetMapImagesUrl("http://121.40.24.31:800/mapImage/");//3版


    //API_SetIsUseArcgisRule(true);
    API_SetSaveTrackPoCount(1000);//即当前船舶短时间内行驶的轨迹
    API_SetDrawCenterPoToFixedLen(6);
    API_SetMousePoInfoDivPosition(true, 20, 20); //显示鼠标位置
    API_SetScaleInfoDivPosition(true, 20, 20); //显示比例尺位置
    API_SetScaleLenInfoPosition(true, 20, 50); //显示比例尺长度

    g_showSimpleInfoDiv = document.getElementById("ShowSimpleInfoByMouseMoveDiv");
    g_showDrawObjInfoByMouseMoveDiv = document.getElementById("ShowDrawObjInfoByMouseMoveDiv");
    g_showDetailShipInfoDiv = document.getElementById("ShowDetailShipInfoDiv");
    // add
    let { compositeLayerPos,compositeStylePos}=routeCompositeLayer();//添加图层
    store.commit('map/setValToKey', {key:'compositeLayerPos',value:compositeLayerPos});
    store.commit('map/setValToKey',{key:'compositeStylePos',value:compositeStylePos});
    let { faceLayerPos, faceStylePos}=meetFaceLayer();
    store.commit('map/setValToKey', {key:'faceLayerPos',value:faceLayerPos});
    store.commit('map/setValToKey',{key:'faceStylePos',value:faceStylePos});
    // add-end
    Test_AddLayer(); //添加图层
    Test_AddShipStyle(); //添加船舶样式
    API_SetFocusShipShowStyleByMinScale(10240000); //设置选中船舶至少显示的最小比例尺样式

    API_SetMapLevel(7, { x: 121.6763904, y: 31.7241664 });//设置海图的当前比例尺级别(谷歌规则下)

    API_SetSelectAllObjectByMouseMove(50000000, true);//设置鼠标移动时候是否判断选择所有的自定义物标
    API_SetShowShipHistroyTrackScale(5000000);//设置历史轨迹回放时，开始显示轨迹点以及轨迹点信息框的比例尺
    API_SetIsShowShipHistroyTrackInfoBox(false);//是否显示轨迹回放的信息框

    setTimeout(API_ReDrawLayer, 500);

    API_SetIsShowShipHistroyTrackInfoBox(true);//是否显示轨迹回放的信息框

    // API_SteIsShowHistoryTrackDirectionSign(true);

    API_SetSelectShipByScrnPoStartScale(500000000);//设置触发 左键选择船舶 的起始比例尺
    API_SetShowShipHistroyTrackScale(500000000);//设置历史轨迹回放时，开始显示轨迹点以及轨迹点信息框的比例尺
    API_SetStartShowShipScale(50000000);//iShowShipScale:比例尺，比如640000,即1:1~1:640000比例尺之间才显示船舶(640000也显示)

    API_SetWarnShipCircleStyle(2, "#FFFF00", 100);

    var optionClustererStyle = [];
    optionClustererStyle.push({src: "/static/YimaEncSDK/img/clusterers1.png", w: 53, h: 52});//个位
    optionClustererStyle.push({src: "/static/YimaEncSDK/img/clusterers2.png", w: 56, h: 55});//十位
    optionClustererStyle.push({src: "/static/YimaEncSDK/img/clusterers3.png", w: 66, h: 65});//百位
    optionClustererStyle.push({src: "/static/YimaEncSDK/img/clusterers4.png", w: 78, h: 77});//千位
    optionClustererStyle.push({src: "/static/YimaEncSDK/img/clusterers5.png", w: 90, h: 89});//万位
    var bInitClustererStyle = API_InitClustererStyle(optionClustererStyle);//设置聚合底图

    API_SetClustererShowOption(true,2,11,true);//显示聚合，不包含最小级别，包含最大级别 聚合级别会影响轨迹点的信息展示
    API_SetClustererShowOption(true,2,8,true);//显示聚合0～13级  6-7

    // window.onresize = function () {
    //     API_ReSizeMapView();//窗口大小变化时，海图视图跟着变化
    //     console.clear();
    // }
}

//--------------------------添加图层，添加物标前，必须先创建图层，这样才可以把物标添加到图层里面，一般初始化就添加好
function Test_AddLayer() {
    //这里演示添加3个图层，分别是点物标图层、线物标图层、面物标图层、气象图层

    //--------------------------添加点物标图层-----------------------------------
    var pointLayerInfo = [];
    pointLayerInfo.id = g_iPointLayerId;
    pointLayerInfo.type = 1;//类型：1=点图层，2=线图层，3=面图层
    pointLayerInfo.name = "点图层";//图层名称
    pointLayerInfo.bShow = true; //显示

    pointLayerInfo.minShowScale = 1;//最大比例尺
    pointLayerInfo.maxShowScale = 2000000000;//最小比例尺
    pointLayerInfo.bShowTextOrNot = true;//是否显示名称
    pointLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺

    var pointLayerPos = API_AddNewLayer(pointLayerInfo,null); //添加图层，得到图层的pos
    if (pointLayerPos > -1) {
        var pointStyle = [];


        //点图片样式
        pointStyle.strImgSrc = "/static/YimaEncSDK/img/light.png"; //图片地址
        pointStyle.iImgWidth = 20; //图片的宽度
        pointStyle.iImgHeight = 30; //图片的高度
        pointStyle.offsetScrnPo = {x:0,y:-15};//显示的偏移量，(0,0)为图片中心


        /*
        //点矢量符号样式
        var arrSymbolPo = [];//矢量符号坐标
        arrSymbolPo.push({ x: 0, y: 15 });
        arrSymbolPo.push({ x: 15, y: -15 });
        arrSymbolPo.push({ x: -15, y: -15 });
        pointStyle.arrSymbolPo = arrSymbolPo;
        */


        //小圆符号样式
        //pointStyle.iCircleR = 5;//圆半径

        pointStyle.bShowImg = true;
        pointStyle.bShowText = true; //是否显示名称
        pointStyle.textColor = "#FF0000"; //名称颜色
        pointStyle.fontSize = "12px"; //名称字体大小
        pointStyle.iOpacity = 100;
        pointStyle.iTextOpacity = 10; //透明度
        pointStyle.bFilled = true; //是否填充颜色
        pointStyle.fillColor = "#ee5d72"; //填充的颜色
        g_iPointStylePos = API_AddPointLayerStyleByPos(pointLayerPos, pointStyle);
        API_SetLayerTextBackGroundColorByPos(pointLayerPos,true,"#FF0000",50);//设置文字背景颜色
    }

    //---------------------------------添加线物标图层----------------------------

    var lintLayerInfo = [];
    lintLayerInfo.id = g_iLineLayerId;
    lintLayerInfo.type = 2; //类型：1=点图层，2=线图层，3=面图层
    lintLayerInfo.name = "线图层"; //图层名称
    lintLayerInfo.bShow = true; //显示
    var lineLayerPos = API_AddNewLayer(lintLayerInfo, null); //添加图层，得到图层的pos

    if (lineLayerPos > -1) {
        var lineStyle = [];
        lineStyle.borderWith = 1; //线的粗细
        lineStyle.borderColor = "#0000FF"; //线的颜色
        lineStyle.iOpacity = 80; //透明度
        lineStyle.bShowText = true; //是否显示名称
        lineStyle.textColor = "#000000"; //名称颜色
        lineStyle.fontSize = "12px"; //名称字体大小
        lineStyle.iTextOpacity = 80; //透明度

        g_iLineStylePos = API_AddLineLayerStyleByPos(lineLayerPos, lineStyle);
        API_SetLayerTextBackGroundColorByPos(lineLayerPos,true, "#00FF00", 50); //设置文字背景颜色
    }

    //-------------------------------------添加面物标图层---------------------
    var faceLayerInfo = [];
    faceLayerInfo.id = g_iFaceLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "面图层"; //图层名称
    faceLayerInfo.bShow = true; //显示
    var faceLayerPos = API_AddNewLayer(faceLayerInfo,null); //添加图层，得到图层的pos
    if (faceLayerPos > -1) {
        var faceStyle = [];
        faceStyle.borderWith = 1; //线的粗细
        faceStyle.borderColor = "#092ee8"; //线的颜色
        faceStyle.bFilled = true; //是否填充颜色
        faceStyle.fillColor = "#FFFFFF"; //填充的颜色
        faceStyle.iOpacity = 50; //透明度
        faceStyle.bShowText = true; //是否显示名称
        faceStyle.textColor = "#000000"; //名称颜色
        faceStyle.fontSize = "12px"; //名称字体大小
        faceStyle.iTextOpacity = 80; //透明度
        faceStyle.iLineOpacity = 100;

        g_iFaceStylePos = API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle);
        API_SetLayerTextBackGroundColorByPos(faceLayerPos,true, "#0000FF", 50); //设置文字背景颜色
    }

    //-------------------------------------添加综合图层---------------------
    var compositeLayerInfo = [];
    compositeLayerInfo.id = g_iCompositeLayerId;
    compositeLayerInfo.type = 100; //类型：1=点图层，2=线图层，3=面图层 composite = 100 = 综合图层
    compositeLayerInfo.name = "综合图层"; //图层名称
    compositeLayerInfo.bShow = true; //显示
    compositeLayerInfo.minShowScale = 1;//最大比例尺
    compositeLayerInfo.maxShowScale = 2000000000;//最小比例尺
    compositeLayerInfo.bShowTextOrNot = true;//是否显示名称
    compositeLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺
    var compositeLayerPos = API_AddNewLayer(compositeLayerInfo,null); //添加图层，得到图层的pos

    if (compositeLayerPos > -1) {
        /*  var compositeStyle = {
             borderWith: 10, //线的粗细
             orderColor: "#000000", //线的颜色
             bFilled: true, //是否填充颜色
             fillColor: "#FF0000", //填充的颜色
             iOpacity: 50, //透明度
             bShowImg: true,
             strImgSrc: "img/port.png", //图片地址
             iImgWidth: 50, //图片的宽度
             iImgHeight: 50, //图片的高度
             bShowText: true, //是否显示名称
             textColor: "#000000", //名称颜色
             fontSize: "12px", //名称字体大小
             iTextOpacity: 80, //透明度
             //compositeStyle.iCheckDrawMinNearOtherLen = null;
             iLineOpacity: 100,
             offsetScrnPo: {x:0,y:-15},
             // compositeStyle.bDrawPointCircle = null;//是否绘制小圆点
             lineType: 1,//绘制实线、1=虚线
             lineLen: 6,
             dashLen: 4,
         } */
        var compositeStyle = [];
        compositeStyle.borderWith = 3; //线的粗细
        compositeStyle.borderColor = "#FF0000"; //线的颜色
        compositeStyle.bFilled = true; //是否填充颜色
        compositeStyle.fillColor = "#FFFF00"; //填充的颜色
        compositeStyle.iOpacity = 30; //透明度
        compositeStyle.bShowImg = true;
        compositeStyle.strImgSrc = '/static/YimaEncSDK/img/port.png'; //图片地址
        compositeStyle.iImgWidth = 50; //图片的宽度
        compositeStyle.iImgHeight = 50; //图片的高度
        compositeStyle.bShowText = false; //是否显示名称
        compositeStyle.textColor = "#000000"; //名称颜色
        compositeStyle.fontSize = "12px"; //名称字体大小
        compositeStyle.iTextOpacity = 60; //透明度
        //compositeStyle.iCheckDrawMinNearOtherLen = null;
        compositeStyle.iLineOpacity = 50;
        compositeStyle.offsetScrnPo = {x:-10,y:15};
        // compositeStyle.bDrawPointCircle = null;//是否绘制小圆点
        compositeStyle.lineType = 0;//绘制实线、1=虚线
        compositeStyle.lineLen = 6;
        compositeStyle.dashLen = 4;



        g_iCompositeStylePos = API_AddCompositeLayerStyleByPos(compositeLayerPos, compositeStyle);
        var g_iCompositeStyleTextPos = API_SetLayerTextBackGroundColorByPos(compositeLayerPos, true, "#0000FF", 50); //设置文字背景颜色
    }

    //--------------------------------------添加气象图层(也是点物标一种)--------------
    var weatherLayerInfo = [];
    weatherLayerInfo.id = g_iWeatherLayerId;
    weatherLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    weatherLayerInfo.name = "气象图层"; //图层名称
    weatherLayerInfo.bShow = true; //显示
    weatherLayerInfo.bShowImg = true;//显示图片
    weatherLayerInfo.minShowScale = 20000;//最小显示比例尺
    weatherLayerInfo.maxShowScale = 5120000; //最大显示比例尺
    var weatherLayerPos = API_AddNewLayer(weatherLayerInfo,null); //添加图层，得到图层的pos
    if (weatherLayerPos > -1) {
        //这里添加两种气象样式
        var weatherStyle1 = [];
        weatherStyle1.bShowImg = true;
        weatherStyle1.strImgSrc = "img/sunshine1.png"; //图片地址（晴天图片）
        weatherStyle1.iImgWidth = 30; //图片的宽度
        weatherStyle1.iImgHeight = 26; //图片的高度
        weatherStyle1.bShowText = false; //是否显示名称

        var pos1 = API_AddPointLayerStyleByPos(weatherLayerPos, weatherStyle1);//添加第一种气象样式,这里的pos1应该是0

        var weatherStyle2 = [];
        weatherStyle2.bShowImg = true;//显示图片
        weatherStyle2.strImgSrc = "img/raining1.png"; //图片地址（阴天图片）
        weatherStyle2.iImgWidth = 30; //图片的宽度
        weatherStyle2.iImgHeight = 26; //图片的高度
        weatherStyle2.bShowText = false; //是否显示名称
        var pos2 = API_AddPointLayerStyleByPos(weatherLayerPos, weatherStyle2); //添加第一种气象样式,这里的pos1应该是1
    }

    //--------------------------------------添加港口图层(也是点物标一种)--------------
    var portLayerInfo = [];
    portLayerInfo.id = g_iPortLayerId;
    portLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    portLayerInfo.name = "港口图层"; //图层名称
    portLayerInfo.bShow = true; //显示
    portLayerInfo.bShowImg = true;
    var portLayerPos = API_AddNewLayer(portLayerInfo,null); //添加图层，得到图层的pos
    if (portLayerPos > -1) {
        //这里一种样式
        var portStyle = [];
        portStyle.bShowImg = true; //显示图片
        portStyle.strImgSrc = "img/port.png"; //图片地址（晴天图片）
        portStyle.iImgWidth = 25; //图片的宽度
        portStyle.iImgHeight = 25; //图片的高度
        portStyle.bShowText = false; //是否显示名称
        var pos = API_AddPointLayerStyleByPos(portLayerPos, portStyle); //添加第一种港口样式,这里的pos应该是0
    }

    //---------------------------------------添加洋流图层(也是点物标，只是使用矢量符号来显示(箭头))-----------------------------------
    var ocLayerInfo = [];
    ocLayerInfo.id = g_iOceanCirculationLayerId; //洋流图层Id
    ocLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    ocLayerInfo.name = "洋流图层"; //图层名称
    ocLayerInfo.bShow = true; //显示
    var ocLayerPos = API_AddNewLayer(ocLayerInfo, null); //添加图层，得到图层的pos
    if (ocLayerPos > -1) {
        //这里一种样式
        var arrSymbolPo = [];//箭头符号
        arrSymbolPo.push({ x: -1, y: 10 });
        arrSymbolPo.push({ x: 1, y: 10 });
        arrSymbolPo.push({ x: 1, y: -3 });
        arrSymbolPo.push({ x: 3, y: -3 });
        arrSymbolPo.push({ x: 0, y: -10 });
        arrSymbolPo.push({ x: -3, y: -3 });
        arrSymbolPo.push({ x: -1, y: -3 });

        var ocStyle = [];
        ocStyle.bShowImg = false; //不使用图片，使用矢量符号
        ocStyle.arrSymbolPo = arrSymbolPo; //矢量符号顶点
        ocStyle.iImgWidth = 20; //符号的宽度
        ocStyle.iImgHeight = 50; //符号的高度
        ocStyle.bShowText = false; //是否显示名称
        ocStyle.borderWith = 1; //线的粗细
        ocStyle.borderColor = "#FF0000"; //线的颜色
        ocStyle.bFilled = false; //是否填充颜色
        ocStyle.fillColor = "#FF0000"; //填充的颜色
        ocStyle.iOpacity = 50; //透明度
        ocStyle.iCheckDrawMinNearOtherLen = 30;//该图层直接的物标间隙

        var pos = API_AddPointLayerStyleByPos(ocLayerPos, ocStyle); //添加第一种港口样式,这里的pos应该是0
    }
}

//演示：添加船舶样式（一般添加一次就可以了）
//假如不添加船舶样式的话，船舶可能就绘制不出来（样式与船舶状态绑定的）
//以下添加三种船舶样式：三角形、圆形、三角形+圆形
function Test_AddShipStyle() {
    //三角形船舶形状
    var arrThreeSymbolPo = [];
    arrThreeSymbolPo.push({ x: 0, y: -14 });
    arrThreeSymbolPo.push({ x: -6, y: 7 });
    arrThreeSymbolPo.push({ x: 6, y: 7 });

    var threeSymbolStyle = [];
    threeSymbolStyle.arrSymbolPo = arrThreeSymbolPo;     //显示符号
    threeSymbolStyle.minScale = 0;                       //最小显示比例尺
    threeSymbolStyle.maxScale = 1000000000;              //最大显示比例尺
    threeSymbolStyle.borderSize = 2;                     //边线粗细
    threeSymbolStyle.borderColor = "#000000";            //边线颜色
    // threeSymbolStyle.fillColor = "#fff170";              //填充颜色
    threeSymbolStyle.fillColor = "#6a9955";              //填充颜色
    threeSymbolStyle.iOpacity = 90;                      //透明度
    // var iShipStatePos1 = API_AddNewShipState(0);        //添加第一种船舶状态，状态值0
    // var bResult1 = API_AddShipStateStyleByPos(iShipStatePos1, threeSymbolStyle); //船舶的状态0

    // //圆船舶形状
    // var circleStyle = [];
    // circleStyle.bOnlyDrawCircle = true; //仅仅绘制圆
    // circleStyle.bDrawCircle = true;         //绘制圆
    // circleStyle.iCircleR = 7;         //半径(px)
    // circleStyle.bFillCircle = true; //是否填充颜色
    // circleStyle.fillCircleColor = "#0000FF"; //填充颜色
    // circleStyle.minScale = 0;                       //最小显示比例尺
    // circleStyle.maxScale = 1000000000;              //最大显示比例尺
    // circleStyle.borderSize = 2;                     //边线粗细
    // circleStyle.borderColor = "#000000";            //边线颜色
    // circleStyle.iOpacity = 90;                      //透明度
    //
    // var iShipStatePos2 = API_AddNewShipState(1);        //添加第一种船舶状态，状态值1
    // var bResult2 = API_AddShipStateStyleByPos(iShipStatePos2, circleStyle); //船舶的状态1


    // //三角形+圆船舶形状
    // var circleThreeSymbolStyle = [];
    // circleThreeSymbolStyle.arrSymbolPo = arrThreeSymbolPo;     //显示符号
    // circleThreeSymbolStyle.minScale = 0;                       //最小显示比例尺
    // circleThreeSymbolStyle.maxScale = 1000000000;              //最大显示比例尺
    // circleThreeSymbolStyle.borderSize = 2;                     //边线粗细
    // circleThreeSymbolStyle.borderColor = "#000000";            //边线颜色
    // circleThreeSymbolStyle.fillColor = "#fff170";              //填充颜色
    // circleThreeSymbolStyle.iOpacity = 90;                      //透明度
    //
    // circleThreeSymbolStyle.bDrawCircle = true;         //绘制圆
    // circleThreeSymbolStyle.iCircleR = 3;         //半径(px)
    // circleThreeSymbolStyle.bFillCircle = true; //是否填充颜色
    // circleThreeSymbolStyle.fillCircleColor = "#0000FF"; //填充颜色
    //
    // var iShipStatePos3 = API_AddNewShipState(2);        //添加第一种船舶状态，状态值2
    // var bResult3 = API_AddShipStateStyleByPos(iShipStatePos3, circleThreeSymbolStyle); //船舶的状态2
    // API_SetZoomBtnPosition(false);

    let {status} = store.state.map.types;
    status.forEach(item=> {
        let iShipStatePos = API_AddNewShipState(item);        //添加第一种船舶状态，状态值0
        API_AddShipStateStyleByPos(iShipStatePos, threeSymbolStyle); //船舶的状态0})
    })
}


export {init}