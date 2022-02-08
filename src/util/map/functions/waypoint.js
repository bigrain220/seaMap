
import {ShowDivBoxOrNot} from "@/util/map/functions/common"
import {ClearDrawObjTextInfo} from "@/util/map/functions/manualDraw"
//-----------------------------------------------航点航线功能-----------------------
//绘制航点航线
function DrawWayPoint() {
    ClearDrawObjTextInfo();
    document.getElementById("pointContentSpan").innerHTML = "航点id：";
    setWayPointStyle();
    ShowDivBoxOrNot("drawPointBox", true);
}

function setWayPointStyle() {
    var waypointstyle = new Point_Style();
    waypointstyle.bShowOrNot = true;
    waypointstyle.bShowName = true;
    waypointstyle.waypointTextOff = {x: 10, y: 50};
    waypointstyle.waypointImg = "/static/YimaEncSDK/img/port.png";
    var getStyle1 = API_SetWayPointStyle(waypointstyle);
}

function addWayPoint() {
    var id = document.getElementById("drawPointContent").value;
    var name = document.getElementById("drawPointName").value;
    var geoPo = API_GetCurDrawDynamicPointGeoPo();
    var iNumber = isNumber(id);

    if(iNumber == true){
        console.log(iNumber);
        var pos = API_GetWayPointPosById(id);
        console.log(pos);
        if(pos == -1){
            API_AddWayPoint(id, name);
            API_ReDrawPointOrRoute();
            EndDrawObj();
            CloseDivBox("drawPointBox");
        }
        else{
            alert("航点Id已存在");
        }
    }
    else{
        alert("id应设置为数字");
    }

}

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

function quitRoute() {
    API_QuitAddWayPoint();
    EndDrawObj();
    CloseDivBox("drawPointBox");
}

function addRoute() {
    var objRoute = new Route_Info();
    var wayPointIdArr = new Array();
    wayPointIdArr.push(0, 1, 2);
    var routename = '航线一';
    var routeid = 1;
    var routestyle = new Route_Style();

    routestyle.bShowOrNot = true;
    routestyle.attrValue = null;
    routestyle.strLineColor = "#FFFF00";
    routestyle.iLineSize = 2;

    objRoute.arrWayPointId = wayPointIdArr;
    objRoute.name = routename;
    objRoute.id = routeid;
    objRoute.style = routestyle;

    API_AddNewRoute(objRoute);
    API_ReDrawPointOrRoute();
}

function DrawAlartArea() {
    API_SetAlarmAreaSingle();
}

function ReDrawPointAndRoute() {
    var point = new Point_Style();
    point.bShowOrNot = true;
    point.bShowName = true;
    point.waypointTextOff = {x: 10, y: 50};
    point.waypointImg = "./img/ship.png";
    point.textColor = "#FFFF00";   //航点名称字体颜色
    point.fontSize = "18px 宋体";  //航点名称字体大小
    point.iTextOpacity = 100;     //航点名称的字体透明度

    var pointInfo1 = new Way_Point();
    pointInfo1.id = 100;
    pointInfo1.x = 1214887695;
    pointInfo1.y = 272636515;
    pointInfo1.name = "nameVal1";
    pointInfo1.style = point;
    API_ReDrawPoint(pointInfo1);

    var pointInfo2 = new Way_Point();
    pointInfo2.id = 101;
    pointInfo2.x = 1188887695;
    pointInfo2.y = 278636515;
    pointInfo2.name = "nameVal2";
    pointInfo2.style = point;
    API_ReDrawPoint(pointInfo2);

    var pointInfo3 = new Way_Point();
    pointInfo3.id = 102;
    pointInfo3.x = 1208887695;
    pointInfo3.y = 278636515;
    pointInfo3.name = "nameVal3";
    pointInfo3.style = point;
    API_ReDrawPoint(pointInfo3);

    var objRoute = new Route_Info();
    var wayPointIdArr = new Array();
    wayPointIdArr.push(100, 101, 102);
    var routename = '航线一';
    var routeid = 1;
    var routestyle = new Route_Style();

    routestyle.bShowOrNot = true;
    routestyle.attrValue = null;
    routestyle.strLineColor = "#FFFF00";
    routestyle.iLineSize = 2;

    objRoute.arrWayPointId = wayPointIdArr;
    objRoute.name = routename;
    objRoute.id = routeid;
    objRoute.style = routestyle;

    API_AddNewRoute(objRoute);
    API_SetMapViewCenter(120, 27);
    API_ReDrawPointOrRoute();
}

function getPoint() {
    var result = API_GetRouteWayPointsInfo(1);
}

function delpoint() {
    API_DelAllWayPoint();
    API_ReDrawPointOrRoute();
}

function delroute() {
    API_DelAllRoute();
    API_ReDrawPointOrRoute();
}

export {
    DrawWayPoint,
    ReDrawPointAndRoute,
    addWayPoint,
    quitRoute
}