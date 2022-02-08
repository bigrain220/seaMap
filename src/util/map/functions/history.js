
import {ShowDivBoxOrNot} from "@/util/map/functions/common"

function PlayShipHistoryTracks(strType) {
    if (document.getElementById("ShowPlayShipTrackDiv").style.display == "block") {
        alert("当前正在回放轨迹，不能重复演示。");
        return;
    }

    if (strType == "ship") {
        //船舶轨迹回放
        AddSomePlayHistoryTracksShipInfo(10,true); //添加50艘测试数据
    }
    else {
        //根据区域回放轨迹

        var objInfo1 = []; //区域对象
        var arrGeoPo1 = []; //区域的坐标
        objInfo1.showText = "东海捕鱼区";
        arrGeoPo1.push({ x: 1215641489, y: 321263316});
        arrGeoPo1.push({ x: 1220606270, y: 321964861 });
        arrGeoPo1.push({ x: 1223524674, y: 320122236 });
        arrGeoPo1.push({ x: 1217545487, y: 318216709 });

        var pos1 = API_AddPlayArea(objInfo1, arrGeoPo1); //添加一个区域

//        var shipGeoPoX = 1215000000;
//        var shipGeoPoY = 310000000;

        var objInfo2 = []; //区域对象
        var arrGeoPo2 = []; //区域的坐标
        objInfo2.showText = "经济贸易区";

        arrGeoPo2.push({ x: 1221544590, y: 315815287 });
        arrGeoPo2.push({ x: 1222007230, y: 313147030 });
        arrGeoPo2.push({ x: 1219053325, y: 312851630 });
        arrGeoPo2.push({ x: 1215725534, y: 313722645 });
        arrGeoPo2.push({ x: 1214052856, y: 316536207 });
        arrGeoPo2.push({ x: 1215939103, y: 318416236 });

        var pos2 = API_AddPlayArea(objInfo2, arrGeoPo2); //添加一个区域

        AddSomePlayHistoryTracksShipInfo(200,true); //添加50艘测试数据
    }

    ShowDivBoxOrNot("ShowPlayShipTrackDiv", true);
    document.getElementById("StartPlayButton").disabled = ""; //“播放”按钮
    document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
    document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
    document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
    document.getElementById("GoBackPlayButton").disabled = "disabled"; //“后退”按钮
    document.getElementById("RePlayButton").disabled = "disabled"; //“重放”按钮
    document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮

    ShowDivBoxOrNot('ShowPlayShipTrackDiv', true)
}

//添加一些轨迹回放船舶数据
function AddSomePlayHistoryTracksShipInfo(shipCount, bShowTrack) {
    var shipGeoPoX = 1215000000;
    var shipGeoPoY = 310000000;

    var strTrackGeoPo = "1118180373,216955453_1118179944,216937509_1118179085,216919565_1118178656,216901221_1118176939,216881283_1118175652,216862540_1118176081,216845792_1118180373,216811496_1118186381,216785973_1118188956,216749283_1118190672,216715783_1118192389,216685472_1118194106,216651172_1118194106,216620860_1118187239,216555448_1118170073,216459718_1118142607,216316110_1118101408,216150146_1118039610,215965010_1117970946,215767079_1117881682,215492485_1117730620,215000641_1117497160,214476676_1117277434,214054812_1116892912,213479345_1116453459,213018809_1115986540,212558129_1115396025,212186921_1114723113,211866839_1114077666,211559495_1113514616,211213656_1112594511,210726784_1111756804,209957714_1110740569,208880351_1110053923,207956280_1109284880,206826092_1108817961,205952187_1108048918,204254356_1107170012,203327474_1106043913,202400037_1104670622,201884554_1103214934,201523615_1101978972,201291539_1100605681,201111011_1099864104,201111011_1099259856,201188382_1098683073,201549399_1097941496,201961888_1097309782,202683479_1096705534,203018390_1096183684,203533496_1095661833,204331571_1095249846,204820509_1094851592,205412172_1094219878,206106442_1093862822,206774700_1093588164,207314231_1093286040,207981956_1092983916,208572390_1092791655,209136936_1092434599,209598679_1091995146,210137199_1091693022,210367934_1091493895,210457655";
    var arrCurTrackGeoPo = strTrackGeoPo.split("_");
    shipCount = 1;

    for (var i = 0; i < shipCount; i++) {
        var shipId = i;
        var shipMMSI = i; //mmsi
        var shipName = ""; //船名
        var shipLength = 30; //船长度
        var shipWidth = 10; //船宽度
        var iShipState =  i % 2; //船舶的状态，当前演示只设置了2种(状态值0和1),见Test_AddShipStyle方法
        var bOnlineOrNot = true;
        var bShowTrack = bShowTrack; //是否显示轨迹

        var arrExpAttrValue = []; //扩展字段
        if (iShipState == 0) {
            shipName = "远洋渔船" + i;
        }
        else {
            shipName = "华东海运" + i;
        }

        shipName = "YUE ZHANG JIANG 1092";
        shipMMSI = 412479886;
        var curShipInfo = []; //当前船舶的结构体信息
        curShipInfo.shipId = shipId;       //船舶的id
        curShipInfo.shipMMSI = shipMMSI;     //mmsi
        curShipInfo.shipName = shipName;     //船名名称
        curShipInfo.shipWidth = shipWidth;     //宽度
        curShipInfo.shipLength = shipLength;    //长度
        curShipInfo.shipSpeed = shipSpeed;     //速度
        curShipInfo.iShipState = iShipState;   //状态
        curShipInfo.bShowTrack = bShowTrack;//是否显示轨迹

        shipGeoPoX = parseInt(1215000000) + parseInt(Math.random() * 10000000); //经度
        shipGeoPoY = parseInt(310000000) + parseInt(Math.random() * 10000000); //纬度

        var shipCourse = parseInt(Math.random() * 360);    //航向
        var curTrackTime = { date: "2017/10/25", h: 8, m: 21, s: 31 };//当前时间

        var latestGeoPo = [];
        var arrCurShipHistroryTracks = [];//保存轨迹点的数组
        //给每个船舶添加200个轨迹点
        //for (var iTrackPos = 0; iTrackPos < 100; iTrackPos++) {
        for (var iTrackPos = 0; iTrackPos < arrCurTrackGeoPo.length; iTrackPos++) {
            var shipSpeed = (Math.random() * 50).toFixed(1);  //航速
            var iAddGeoLen = Math.random() * 100000;
            var angle = (90 - shipCourse) * Math.PI / 180;
            var shipGeoPoX = parseInt(shipGeoPoX + Math.cos(angle) * iAddGeoLen);
            var shipGeoPoY = parseInt(shipGeoPoY + Math.sin(angle) * iAddGeoLen);
            var iRandom = parseInt(Math.random() * 20);
            if (iRandom % 2 == 0) {
                shipCourse -= iRandom;
            }
            else {
                shipCourse += iRandom;
            }

            if (shipGeoPoX < 119000000 || shipGeoPoX > 12650000000 || shipGeoPoY < 200000000 || shipGeoPoY > 370000000) {
                shipCourse = parseInt(Math.random() * 100);
            }


            var curPoInfo = arrCurTrackGeoPo[iTrackPos].split(",");

            shipGeoPoX = curPoInfo[0];
            shipGeoPoY = curPoInfo[1];

            if (iTrackPos > 0) {
                shipCourse = API_GetDegreesBetwTwoPoint(latestGeoPo.x, latestGeoPo.y, shipGeoPoX, shipGeoPoY);
            }

            latestGeoPo.x = shipGeoPoX;
            latestGeoPo.y = shipGeoPoY;

            var iAddTimeSecond = parseInt(Math.random() * 1000);
            curTrackTime.s += iAddTimeSecond;
            curTrackTime.m += parseInt((curTrackTime.s) / 60);
            curTrackTime.s = parseInt(curTrackTime.s % 60); //秒
            curTrackTime.h += parseInt(curTrackTime.m / 60); //小时
            curTrackTime.m = parseInt(curTrackTime.m % 60); // 分
            var strTime = curTrackTime.date + " " + curTrackTime.h + ":" + curTrackTime.m + ":" + curTrackTime.s;//这里要注意轨迹添加的时间格式必须是"2015/5/31 12:1:3"

            var curHistroyTrack = [];

            curHistroyTrack.trackGeoPoX = shipGeoPoX;//经度，例如1210000000
            curHistroyTrack.trackGeoPoY = shipGeoPoY; //纬度，例如31000000
            curHistroyTrack.trackCourse = parseInt(shipCourse); //航向，单位度
            curHistroyTrack.trackSpeed = shipSpeed; //航速
            curHistroyTrack.trackTime = strTime; //时间，格式例如"2015/5/31 12:1:3"

            arrCurShipHistroryTracks.push(curHistroyTrack);
        }
        // console.log(curShipInfo, arrCurShipHistroryTracks)
        API_AddOnePlayShipInfo(curShipInfo, arrCurShipHistroryTracks);//添加一艘回放船舶
        // API_StartPlayShipHistoryTrack();API_EndPlayHistoryTrack(); //一次性显示轨迹
    }
}

//轨迹回放工具按钮处理
function PlayShipHistoryButton(strType) {

    if (strType == "start") {//开始
        API_SetPlayHistoryTrackTimeStep(3 * 60); //设置播放速度（3分钟/秒）

        var curShipInfo = API_GetPlayHistroyTrackInfoByPos(0, 0);

        API_SetMapViewCenter(curShipInfo.trackGeoPoX / 10000000, curShipInfo.trackGeoPoY / 10000000, null); //切换到有港口的区域，这里切换过去的时候，会刷新海图，所以不用调用API_ReDrawLayer();

        API_StartPlayShipHistoryTrack();

        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = ""; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
    else if (strType == "stop")//暂停
    {
        API_StopPlayHistoryTrackOrNot(true);

        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = ""; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮

    }
    else if (strType == "continue") {//继续
        API_StopPlayHistoryTrackOrNot(false);

        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = ""; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
    else if (strType == "fast") { //快进
        API_FastPlayHistoryTrack(3);
    }
    else if (strType == "back") { //后退
        API_FastPlayHistoryTrack(-3);
    }
    else if (strType == "end") {//结束
        API_EndPlayHistoryTrack();
        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮
    }
    else if (strType == "restart") {//重放
        API_ReStartPlayHistoryTrack();
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
}
//添加一条船舶历史轨迹
function AddShipHistroryTracksTest() {
    var shipCount = 20;
    var shipGeoPoX = 1215000000;
    var shipGeoPoY = 310000000;

    var arrExpAttrValue = []; //扩展字段

    var curShipInfo = []; //当前船舶的结构体信息
    curShipInfo.shipId = 1000;       //船舶的id
    curShipInfo.shipMMSI = 100023;     //mmsi
    curShipInfo.shipName = "渔船188";     //船名名称
    curShipInfo.shipWidth = "15";     //宽度
    curShipInfo.shipLength = "45";    //长度
    curShipInfo.shipSpeed = "5.8";     //速度
    curShipInfo.iShipState = 1;   //状态
    curShipInfo.bShowTrack = true; //是否显示轨迹

//------------------------------------------------------------------------------------------生成模拟的轨迹数据，以下这些数据应该是从数据库中获取
    shipGeoPoX = parseInt(1215000000) + parseInt(Math.random() * 10000000); //经度
    shipGeoPoY = parseInt(310000000) + parseInt(Math.random() * 10000000); //纬度
    var shipCourse = parseInt(Math.random() * 360);    //航向
    var curTrackTime = { date: "2016/5/31", h: 1, m: 1, s: 1 }; //当前时间

    var arrCurShipHistroryTracks = []; //保存轨迹点的数组
    //给船舶添加50个轨迹点
    for (var iTrackPos = 0; iTrackPos < 50; iTrackPos++) {
        var shipSpeed = Math.random() * 50; //航速
        var iAddGeoLen = Math.random() * 100000;
        var angle = (90 - shipCourse) * Math.PI / 180;
        var shipGeoPoX = parseInt(shipGeoPoX + Math.cos(angle) * iAddGeoLen);
        var shipGeoPoY = parseInt(shipGeoPoY + Math.sin(angle) * iAddGeoLen);
        var iRandom = parseInt(Math.random() * 20);
        if (iRandom % 2 == 0) {
            shipCourse -= iRandom;
        }
        else {
            shipCourse += iRandom;
        }

        if (shipGeoPoX < 119000000 || shipGeoPoX > 12650000000 || shipGeoPoY < 200000000 || shipGeoPoY > 370000000) {
            shipCourse = parseInt(Math.random() * 100);
        }

        var iAddTimeSecond = parseInt(Math.random() * 1000);
        curTrackTime.s += iAddTimeSecond;
        curTrackTime.m += parseInt((curTrackTime.s) / 60);
        curTrackTime.s = parseInt(curTrackTime.s % 60); //秒
        curTrackTime.h += parseInt(curTrackTime.m / 60); //小时
        curTrackTime.m = parseInt(curTrackTime.m % 60); // 分
        var strTime = curTrackTime.date + " " + curTrackTime.h + ":" + curTrackTime.m + ":" + curTrackTime.s; //这里要注意轨迹添加的时间格式必须是"2015/5/31 12:1:3"

        var curHistroyTrack = [];

        curHistroyTrack.trackGeoPoX = shipGeoPoX; //经度，例如1210000000
        curHistroyTrack.trackGeoPoY = shipGeoPoY; //纬度，例如31000000
        curHistroyTrack.trackCourse = shipCourse; //航向，单位度(int)
        curHistroyTrack.trackSpeed = shipSpeed; //航速
        curHistroyTrack.trackTime = strTime;   //时间，格式例如"2015/5/31 12:1:3"

        arrCurShipHistroryTracks.push(curHistroyTrack);
    }

    //------------------------------------------------------------------------------------------生成模拟的轨迹数据结束
    API_AddOnePlayShipInfo(curShipInfo, arrCurShipHistroryTracks); //添加到SDK中，进行显示

    if (true) {
        //立即显示完轨迹
        API_StartPlayShipHistoryTrack();
        API_EndPlayHistoryTrack();
    }
    else {
        //使用工具条来回放
        ShowDivBoxOrNot("ShowPlayShipTrackDiv", true);
        document.getElementById("StartPlayButton").disabled = ""; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = "disabled"; //“后退”按钮
        document.getElementById("RePlayButton").disabled = "disabled"; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮
    }

    API_SetMapViewCenter(shipGeoPoX / 10000000, shipGeoPoY / 10000000, null);//定位居中船舶到海图屏幕
}
export {
    PlayShipHistoryTracks,
    PlayShipHistoryButton,
    AddShipHistroryTracksTest
}