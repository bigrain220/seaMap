
import {ShowDivBoxOrNot,DelTableTrsByPos} from "@/util/map/functions/common"
import {ShowInfoDivBox} from "@/util/map/index.js"

//步骤： 设置绘制物标类型  鼠标在海图选择节点坐标  获取节点坐标  结束绘制

//绘制类型结构体 使用位置：DrawDynamicSymbol
window.DynamicSymbolType =
    {
        none: 0, //无状态
        drawPoint: 1, //绘制点
        drawLine: 2, //绘制线
        drawFace: 3, //绘制面
        drawRect: 4, //绘制矩形
        drawCircle: 5,//绘制圆
        measureDist: 6, //测距
        measureArea: 7, //测面积
        directionLine: 8,//方位线
        drawLineArea: 9,  //绘制线区域
        drawSector: 10  //绘制扇区
    };
// 使用位置：ClearDrawObjTextInfo
var g_iDrawObjPoNum = 0;
// 使用位置: EndDrawObj
window.g_drawObjectInfoBoxGeoPo = null;//动态绘制物标时候，显示物标信息框的经纬度位置

//清除上一次绘制物标的信息
function ClearDrawObjTextInfo() {
    //清空绘制物标的信息
    DelTableTrsByPos('DrawObjInfoTable', 2, 100);
    document.getElementById("drawObjName").value = "";
    g_iDrawObjPoNum = 0;

    //清空航点的信息
    DelTableTrsByPos('DrawPointInfoTable', 2, 100);
    document.getElementById("drawPointName").value = "";
    g_iDrawObjPoNum = 0;

    // //清空测距的信息
    // document.getElementById("allMeasureDist").innerHTML = "0米(0.00海里)";
    // document.getElementById("curDis").innerHTML = "0米(0.00海里)";
    // document.getElementById("curDegrees").innerHTML = "0.00度";
    //
    // //清除矩形信息
    // document.getElementById("curDrawRectGeoPo").innerHTML = "";
    // document.getElementById("curDrawRectWidthDis").innerHTML = "0.000海里";
    // document.getElementById("curDrawRectHeightDis").innerHTML = "0.000海里";
}


//绘制图形
function DrawDynamicSymbol(type) {
    ClearDrawObjTextInfo();

    // var objStyle = []; //物标样式结构体，格式如下：{borderWith:1, borderColor:”#FF0000”, fillColor : ”#FF0000”, textColor: ”#FF0000”, fontSize:”12px 宋体”, iOpacity:80}
    // objStyle.borderWith = "2"; //画笔粗细
    // objStyle.borderColor = "#000000"; //画笔颜色
    // objStyle.fillColor = "#FFFFFF"; //填充颜色
    // objStyle.textColor = "#000000"; //字体颜色(主要是测距、测面积使用)
    // objStyle.fontSize = "12px 宋体"; //字体大小(主要是测距、测面积使用)
    // objStyle.iOpacity = 80; //透明度
    // API_SetDynamicObjStyle(objStyle);
    // var objTextBoxStyle = { lineColor: "yellow", bFill: true, fillColor: "#FFFFFF", iOpacity: 80 }; //文本框样式{线颜色,是否填充,填充颜色,透明度}
    // API_SetDynamicObjTextBoxStyle(objTextBoxStyle);//返回值:true=设置成功，false=设置失败

    document.getElementById("objContentSpan").innerHTML = "物标备注：";
    switch (type) {
        case DynamicSymbolType.drawPoint: //绘制点
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint); 	//设置绘制物标类型
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = DynamicSymbolType.drawPoint;
            break;

        case DynamicSymbolType.drawLine: //绘制线
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawLine);
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = DynamicSymbolType.drawLine;
            break;

        case DynamicSymbolType.drawFace: //绘制面
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawFace);
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = DynamicSymbolType.drawFace;
            break;

        case DynamicSymbolType.drawRect: //绘制矩形
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawRect);
            ShowDivBoxOrNot("DrawRectInfoDiv", true);
            break;

        case DynamicSymbolType.drawCircle: //绘制圆
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawCircle);
            ShowDivBoxOrNot("DrawCircleInfoDiv", true);
            break;

        case DynamicSymbolType.drawEllipse: //绘制椭圆
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawEllipse);
            ShowDivBoxOrNot("DrawEllipseInfoDiv", true);
            break;

        case DynamicSymbolType.measureDist: //测距
            API_SetCurDrawDynamicUseType(DynamicSymbolType.measureDist);
            ShowDivBoxOrNot("ShowMeasureDistDiv", true);
            break;

        case DynamicSymbolType.measureArea: //测面积
            API_SetCurDrawDynamicUseType(DynamicSymbolType.measureArea);
            break;

        case DynamicSymbolType.directionLine: //电子方位线
            API_SetCurDrawDynamicUseType(DynamicSymbolType.directionLine);
            break;
        case DynamicSymbolType.drawLineArea://绘制线区域
            document.getElementById("objContentSpan").innerHTML = "半径(米)：";
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawLine);
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = DynamicSymbolType.drawLineArea;
            break;
        default:
            break;
    }
}

//动态绘制物标时，选中点之后返回的坐标 //objDynamicInfo:格式例如{type:1,po:{x:1210000000,y:10000000},w:20,h:80,r:10};
window.ReturnDrawDynamicObjNewInfo=function(objDynamicInfo,curGeoPoInfo) {
    console.log(objDynamicInfo,'NewInfo')
    // {
    //     curPo: undefined,
    //     po: {x: 1216885783.5776367, y: 300285879.51615804},
    //     type: 2,
    //     uuid: "4bdd409d-d170-0a84-addb-eac527d7e0f4",
    // }
    if (objDynamicInfo) {
        switch (objDynamicInfo.type) {
            case DynamicSymbolType.drawPoint:
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawLine: //绘制线
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawFace: //绘制面
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawRect: //绘制矩形
                GetCurDrawRectInfo(objDynamicInfo.po.x, objDynamicInfo.po.y, objDynamicInfo.w, objDynamicInfo.h, objDynamicInfo.curPo);
                break;
            case DynamicSymbolType.drawCircle: //绘制圆
                GetCurDrawCircleInfo(objDynamicInfo.po.x, objDynamicInfo.po.y, objDynamicInfo.r, objDynamicInfo.curPo);
                break;
            case DynamicSymbolType.drawPoint: //测距
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
            case DynamicSymbolType.drawPoint: //测面积
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
            case DynamicSymbolType.drawPoint: //电子方位线
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
            case DynamicSymbolType.drawLineArea: //绘制线区域
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
        }
    }
    else if (curGeoPoInfo) {//动态绘制信息框(线物标和面物标)
        switch (curGeoPoInfo.type) {
            case DynamicSymbolType.drawLine: //绘制线
                ShowCurDrawLineObjInfoBox(curGeoPoInfo.po, curGeoPoInfo.bEndDraw);
                break;
            case DynamicSymbolType.drawFace: //绘制面
                ShowCurDrawFaceObjInfoBox(curGeoPoInfo.po, curGeoPoInfo.bEndDraw);
                break;
        }
    }
}

// 鼠标移动时，选中对象的信息（手机版本这个方法不会被调用）
// window.ReturnSelectObjByMouseMove=function(objInfo) {
//     //API_SetCurHighLightObjectById(-1, -1);
//     if (objInfo) {
//         console.log(objInfo,'move')
//         //API_SetCurHighLightObjectById(objInfo.layerId, objInfo.objId);
//         var scrnPo = objInfo.po;
//         switch (objInfo.objType) {//{objType,id,po}
//             case 1: //选中了船舶，得到船舶的id,pos
//                 if(objInfo.bClusterers == true)
//                 {
//                     console.log(objInfo.data);//聚合信息
//                 }
//                 else
//                 {
//                     var iShipId = objInfo.id;
//                     var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;//是否选中了轨迹回放的船舶
//                     var iTrackPos = objInfo.iTrackPos; //假如是轨迹回放，则是选中轨迹点pos
//                     ShowShipSimpleInfo(iShipId,bSelPlayTrackShip,iTrackPos, scrnPo);
//                 }
//                 break;
//             case 2: //选中了物标，得到物标所属的图层layerId以及物标objId
//                 var layerId = objInfo.layerId;//图层的id
//                 var objId = objInfo.objId;//物标的id
//                 ShowObjSimpleInfo(layerId, objId, scrnPo);
//                 break;
//             case 3: //选中了台风轨迹信息
//                 var typhoonId = objInfo.typhoonId; //台风id
//                 var iTruePos = objInfo.iTruePos; //台风真实轨迹点pos
//                 var iPredictPos = objInfo.iPredictPos; //真实轨迹点的预测轨迹点pos
//                 var iPredictLinePos = objInfo.iPredictLinePos; //真实轨迹点的预测轨迹点pos
//                 ShowTyphoonTrackSimpleInfo(typhoonId, iTruePos,iPredictLinePos, iPredictPos, scrnPo);
//                 break;
//         }
//     }
//     else {
//         if (g_showSimpleInfoDiv) {
//             g_showSimpleInfoDiv.style.display = "none";
//         }
//     }
// }

//显示绘制当前线的动态信息框
//curGeoPo：当前鼠标点的位置，假如是结束绘制，即bEndDraw=true时候，curGeoPo值为null
//bEndDraw：是否结束了绘制，一般是鼠标右键结束，结束的时候，线是不包括当前鼠标点的
function ShowCurDrawLineObjInfoBox(curGeoPo, bEndDraw) {
    var arrCurDrawDynamicObjGeoPo = API_GetCurDrawDynamicObjGeoPo();//获取已经选取线的点坐标
    var iCurLinePoCount = arrCurDrawDynamicObjGeoPo.length; //已经选取的线节点数量

    if (bEndDraw && iCurLinePoCount < 1) {
        return;//节点不够，则结束
    }

    if (iCurLinePoCount > 0) {
        var fCurAllDisKm = 0;//当前累加的长度（单位千米）
        for (var i = 1; i < iCurLinePoCount; i++) {
            var curDisKm = API_GetDistBetwTwoPoint(arrCurDrawDynamicObjGeoPo[i - 1].x, arrCurDrawDynamicObjGeoPo[i - 1].y,
                arrCurDrawDynamicObjGeoPo[i].x, arrCurDrawDynamicObjGeoPo[i].y);
            fCurAllDisKm += curDisKm;
        }

        var lineLastPo;
        if(bEndDraw) {
            lineLastPo = arrCurDrawDynamicObjGeoPo[iCurLinePoCount - 2];
            curGeoPo = arrCurDrawDynamicObjGeoPo[iCurLinePoCount - 1];
        }
        else {
            lineLastPo = arrCurDrawDynamicObjGeoPo[iCurLinePoCount - 1];
        }

        var curMouseDisKm = API_GetDistBetwTwoPoint(lineLastPo.x, lineLastPo.y, curGeoPo.x, curGeoPo.y); //线最后一个节点到鼠标的距离

        var curDegree = API_GetDegreesBetwTwoPoint(lineLastPo.x, lineLastPo.y, curGeoPo.x, curGeoPo.y); //方位

        if (bEndDraw == false)
        {
            fCurAllDisKm += curMouseDisKm;
        }

        var curMouseHailiRDis = curMouseDisKm * 0.5399568; //转换海里
        var curAllHailiRDis = fCurAllDisKm * 0.5399568; //转换海里

        var strMsg1 = "当前方位:" + curDegree.toFixed(3) + "度";
        var strMsg2 = "当前距离:" + curMouseHailiRDis.toFixed(3) + "海里";
        var strMsg3 = "累积距离:" + curAllHailiRDis.toFixed(3) + "海里";

        g_showDrawObjInfoByMouseMoveDiv.innerHTML = strMsg1 + "<br />" + strMsg2 + "<br />" + strMsg3;
        var iMsgBoxHeight = 50;
        var iMsgBoxWidth = 140;
        g_showDrawObjInfoByMouseMoveDiv.style.height = iMsgBoxHeight + "px";
        g_showDrawObjInfoByMouseMoveDiv.style.width = iMsgBoxWidth + "px";
        g_drawObjectInfoBoxGeoPo = { x: curGeoPo.x / 10000000, y: curGeoPo.y / 10000000 }; //标签的位置
        ShowCurDrawObjInfoBox();
    }
}

//显示绘制当前面的动态信息框
//curGeoPo：当前鼠标点的位置，假如是结束绘制，即bEndDraw=true时候，curGeoPo值为null
//bEndDraw：是否结束了绘制，一般是鼠标右键结束，结束的时候，线是不包括当前鼠标点的
function ShowCurDrawFaceObjInfoBox(curGeoPo, bEndDraw) {
    var arrCurDrawDynamicObjGeoPo = API_GetCurDrawDynamicObjGeoPo(); //获取已经选取线的点坐标
    var iCurLinePoCount = arrCurDrawDynamicObjGeoPo.length; //已经选取的线节点数量

    if (bEndDraw && iCurLinePoCount < 3) {
        return; //节点不够，则结束
    }

    if (iCurLinePoCount > 1) {
        if (bEndDraw == false) {
            arrCurDrawDynamicObjGeoPo.push(curGeoPo);
        }
        else {
            curGeoPo = arrCurDrawDynamicObjGeoPo[iCurLinePoCount - 1];
        }
        var curRegionArea = API_GetAreaOfGeoRegion(arrCurDrawDynamicObjGeoPo); //当前的面积(平方米)
        curRegionArea = curRegionArea / 1000000;//平方公里
        var strMsg1 = "面积:" + curRegionArea.toFixed(3) + "平方公里";


        g_showDrawObjInfoByMouseMoveDiv.innerHTML = strMsg1;
        var iMsgBoxHeight = 25;
        var iMsgBoxWidth = 180;
        g_showDrawObjInfoByMouseMoveDiv.style.height = iMsgBoxHeight + "px";
        g_showDrawObjInfoByMouseMoveDiv.style.width = iMsgBoxWidth + "px";
        g_drawObjectInfoBoxGeoPo = { x: curGeoPo.x / 10000000, y: curGeoPo.y / 10000000 }; //标签的位置
        ShowCurDrawObjInfoBox();
    }
}


//显示绘制物标的信息标签
function ShowCurDrawObjInfoBox() {
    if (g_drawObjectInfoBoxGeoPo) {
        var scrnPo = API_GetScrnPoByLonLatPo(g_drawObjectInfoBoxGeoPo.x, g_drawObjectInfoBoxGeoPo.y, null);
        ShowInfoDivBox(g_showDrawObjInfoByMouseMoveDiv, scrnPo);
    }
}

// function ShowInfoDivBox(objDiv,scrnPo) {
//     // console.log(...arguments,'ShowInfoDivBox')
//     if (objDiv) {
//         //获取海图界面大小
//         var offsetLen = 10;
//         var divLeft = scrnPo.x + offsetLen;
//         var divTop = scrnPo.y + offsetLen;
//         var divSize = { w: objDiv.clientWidth, h: objDiv.clientHeight };
//         var mapDiv = document.getElementById("map");
//         if (mapDiv) {
//             var mapWidth = mapDiv.clientWidth;
//             var mapHeight = mapDiv.clientHeight;
//
//             if (divLeft + divSize.w > mapWidth) {
//                 divLeft = scrnPo.x - divSize.w - offsetLen;
//             }
//
//             if (divTop + divSize.h > mapHeight) {
//                 divTop = scrnPo.y - divSize.h - offsetLen;
//             }
//         }
//         objDiv.style.left = divLeft + "px";
//         objDiv.style.top = divTop + "px";
//         objDiv.style.display = "block";
//     }
// }


//得到动态绘制物标(点、线、一般面)时，最后一个点坐标
function GetCurDrawObjCurPo(geoPoX, geoPoY) {
    // console.log(DrawObjInfoTable);//获取到的是#DrawObjInfoTable的DOM元素
    //添加到table表中
    g_iDrawObjPoNum++;
    var newRow = DrawObjInfoTable.insertRow(-1);
    var newTd0 = newRow.insertCell(); //序号
    var newTd1 = newRow.insertCell(); //经度
    var newTd2 = newRow.insertCell(); //纬度

    newTd0.innerHTML = g_iDrawObjPoNum;
    newTd1.innerHTML = parseInt(geoPoX);
    newTd2.innerHTML = parseInt(geoPoY);
}

//得到动态绘制圆的信息
//geoPoX:圆心
//geoPoY:圆心
//rDis:半径,单位(km)
function GetCurDrawCircleInfo(geoPoX, geoPoY, rDis,curGeoPo) {
    var hailiRDis = rDis * 0.5399568; //半径，转换海里
    var curDrawCircleGeoPoObj = document.getElementById("curDrawCircleGeoPo");
    curDrawCircleGeoPoObj.innerHTML = parseInt(geoPoX) + "," + parseInt(geoPoY);
    document.getElementById("curDrawCircleR").innerHTML = hailiRDis.toFixed(3);
    if (curGeoPo) {

        var curDegree = API_GetDegreesBetwTwoPoint(geoPoX, geoPoY, curGeoPo.x, curGeoPo.y); //方位


        var strMsg1 = "半径:" + hailiRDis.toFixed(3) + "海里";
        var strMsg2 = "方位:" + curDegree.toFixed(3) + "度";
        g_showDrawObjInfoByMouseMoveDiv.innerHTML = strMsg1 + "<br />" + strMsg2;

        var iMsgBoxHeight = 35;
        var iMsgBoxWidth = 100;
        g_showDrawObjInfoByMouseMoveDiv.style.height = iMsgBoxHeight + "px";
        g_showDrawObjInfoByMouseMoveDiv.style.width = iMsgBoxWidth + "px";
        g_drawObjectInfoBoxGeoPo = { x: curGeoPo.x / 10000000, y: curGeoPo.y / 10000000 }; //标签的位置
        ShowCurDrawObjInfoBox();
    }
}

//保存当前的圆
function AddCurDrawCircleObject() {
    var strName = document.getElementById("curDrawCircleName").value;
    var strGeoPos = document.getElementById("curDrawCircleGeoPo").innerHTML;
    var hailiRDis = document.getElementById("curDrawCircleR").innerHTML;

    if (strName == "") {
        alert("请输入圆的名称");
        return false;
    }
    var bResult = false;
    var arrGeoPo = strGeoPos.split(",");
    if (arrGeoPo.length == 2) {
        var po = { x: arrGeoPo[0], y: arrGeoPo[1] }; //圆心的坐标
        var r = hailiRDis / 0.5399568; //半径的海里转换成km(km)

        var arrObjPo = [];
        arrObjPo.push(po);
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        var layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        if (layerPos > -1) {
            objInfo.objType = DynamicSymbolType.drawCircle; //物标类型：圆
            objInfo.r = r; //半径(km)

            objInfo.layerPos = layerPos; //所属图层
            g_iAddObjId++;
            objInfo.objId = g_iAddObjId; //圆id
            objInfo.name = strName; //名称
            objInfo.showText = strName; //显示内容
            objInfo.layerStylePos = g_iFaceStylePos; //使用样式
            arrExpAttrValue.push("来一个扩展字段"); //扩展字段

            var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
            if (objPos > -1) {
                bResult = true;

                var myColor = "#0000FF";
                var objStyleInfo = [];
                objStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
                objStyleInfo.fillColor = myColor;     //填充颜色(字符串)，例如"#000000"
                objStyleInfo.iOpacity = 50;      //填充透明度(数字)，0~100，100为不透明
                objStyleInfo.borderWith = 2;    //线粗细(数字)
                objStyleInfo.iLineOpacity = 50; //线的透明度(数字)，0~100，100为不透明
                objStyleInfo.borderColor = "#FF0000";   //线颜色(字符串)，例如"#000000"
                objStyleInfo.bShowText = false;     //是否显示信息(布尔)，true=显示，false=不显示
                objStyleInfo.textColor = "#00FF00";     //物标名称字体颜色(字符串)，例如"#000000"
                objStyleInfo.fontSize = "20px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
                objStyleInfo.iTextOpacity = 40;  //文本透明度(数字)，0~100，100为不透明
                objStyleInfo.lineType = 1;  //线类型：0=实线，1=虚线
                objStyleInfo.lineLen = 8;  //虚线时，线段长度
                objStyleInfo.dashLen = 4;  //虚线时，线段的间隔

                API_SetFaceObjStyleByPos(layerPos, objPos, true, objStyleInfo);
            }
        }
    }

    if (bResult == true) {
        alert("添加成功");
        API_ReDrawLayer();
        EndDrawObj();
        CloseDivBox("DrawCircleInfoDiv");
    }
    else {
        alert("添加失败");
    }
}

//close点击事件
function EndDrawObj() {
    // console.log(g_showDrawObjInfoByMouseMoveDiv,123)
    ShowDivBoxOrNot("drawObjBox", false);
    API_SetCurDrawDynamicUseType(DynamicSymbolType.none);
    g_drawObjectInfoBoxGeoPo = null;//信息框位置归空
    ShowDivBoxOrNot(g_showDrawObjInfoByMouseMoveDiv.id, false);//信息框隐藏
}

function CloseDivBox(divBoxId) {
    var obj = document.getElementById(divBoxId);
    if (obj) {
        obj.style.display = "none";
    }
}


//显示简单的点对象信息（鼠标移动到对象显示）：气象、点物标
function ShowObjSimpleInfo(layerId, objId,scrnPo) {
    var iLayerPos = API_GetLayerPosById(layerId);
    if (iLayerPos > -1) {
        var iMsgBoxHeight = 20;
        var iMsgBoxWidth = 200;
        var ObjPos = API_GetObjectPosById(objId, iLayerPos);
        var iObjPos = -1;
        if (ObjPos)
        {
            iObjPos = ObjPos.iObjPos;
        }
        var curObjInfoObj = API_GetObjectInfoByPos(iLayerPos, iObjPos);
        if (curObjInfoObj) {
            var strInnerHTML = "";
            var strName = curObjInfoObj.name;
            if (curObjInfoObj.name == undefined || curObjInfoObj.name == "") {
                return;
            }
            var arrExpAttrValue = curObjInfoObj.arrExpAttrValue;
            if (layerId == g_iWeatherLayerId) { //显示气象信息
                var strTitle = "天气预报:" + strName;
                strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
                if (arrExpAttrValue) {
                    var iExpAttrCount = arrExpAttrValue.length;
                    for (var iExpAttrPos = 0; iExpAttrPos < iExpAttrCount; iExpAttrPos++) {
                        strInnerHTML += arrExpAttrValue[iExpAttrPos] + "<br>";
                        iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                    }
                }
            }
            else if (layerId == g_iPortLayerId)//港口
            {
                var strTitle = "港口:" + strName;
                strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
                var arrGeoPo = API_GetObjectGeoInfoByPos(iLayerPos, iObjPos); //获取坐标
                var strLonLat = "--";
                if (arrGeoPo.length > 0) {
                    strLonLat = API_LonLatToString(arrGeoPo[0].x /  10000000, true);
                    var strLat = API_LonLatToString(arrGeoPo[0].y / 10000000, false);
                    strLonLat += "," + strLat;
                }

                strInnerHTML += "坐标:" + strLonLat + "<br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                if (arrExpAttrValue) {
                    var iExpAttrCount = arrExpAttrValue.length;
                    for (var iExpAttrPos = 0; iExpAttrPos < iExpAttrCount; iExpAttrPos++) {
                        strInnerHTML += arrExpAttrValue[iExpAttrPos] + "<br>";
                        iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                    }
                }
            }
            else {
                strInnerHTML = curObjInfoObj.name;
            }

            g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
            g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";

            ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
        }
    }
}

// 显示简单的船舶信息（鼠标移动到船舶显示）
function ShowShipSimpleInfo(shipId, bSelPlayTrackShip, iTrackPos, scrnPo) {

    //选中的是轨迹回放的船舶
    if (bSelPlayTrackShip == true) {
        var iShipPos = API_GetPlayShipPosById(shipId);
        if (iShipPos > -1) {

            var iMsgBoxHeight = 20;
            var iMsgBoxWidth = 200;
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var shipName, shipMmsi, shipGeoPoX, shipGeoPoY, shipSpeed, shipCourse, shipTime;
            var strTitle;
            var shipInfoObj = API_GetPlayShipInfoByPos(iShipPos);

            var curShipPos = API_GetShipPosById(shipId);
            var shipInfoObj1 = API_GetShipAllExpAttrByPos(curShipPos);

            if (shipInfoObj) {
                shipName = shipInfoObj.shipName;
                shipMmsi = shipInfoObj.shipMMSI;
                shipGeoPoX = shipInfoObj.shipGeoPoX;
                shipGeoPoY = shipInfoObj.shipGeoPoY;
                shipSpeed = shipInfoObj.shipSpeed;
                shipCourse = shipInfoObj.shipCourse;
                shipTime = shipInfoObj.shipTime;
                strTitle = "船舶信息:" + shipName;
            }

            if (iTrackPos != null) {//选中的是轨迹点
                var shipInfoObj = API_GetPlayHistroyTrackInfoByPos(iShipPos, iTrackPos);
                if (shipInfoObj) {
                    strTitle = "历史轨迹点信息";
                    shipGeoPoX = shipInfoObj.trackGeoPoX;
                    shipGeoPoY = shipInfoObj.trackGeoPoY;
                    shipSpeed = shipInfoObj.trackSpeed;
                    shipCourse = shipInfoObj.trackCourse;
                    shipTime = shipInfoObj.trackTime;
                }
            }
            if (shipSpeed) {
                shipSpeed = shipSpeed.toFixed(2);
            }

            var strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
            strInnerHTML += "船名:" + shipName + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize; //修改信息面板的高度
            strInnerHTML += "MMSI:" + shipMmsi + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLon = API_LonLatToString(shipGeoPoX / 10000000, false);
            strInnerHTML += "经度:" + strLon + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLat = API_LonLatToString(shipGeoPoY / 10000000, false);
            strInnerHTML += "纬度:" + strLat + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "航速:" + shipSpeed + "(节)<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "航向:" + shipCourse + "(度)<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "时间:" + shipTime + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
            g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";
            ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
        }

    }
    else {//选中的是当前船舶
        var iShipPos = API_GetShipPosById(shipId);
        if (iShipPos > -1) {
            var shipInfoObj = API_GetShipInfoByPos(iShipPos);
            if (shipInfoObj) {
                var shipName = shipInfoObj.shipName;
                var shipMmsi = shipInfoObj.shipMMSI;
                var shipTime = shipInfoObj.shipTime;

                var strInnerHTML = "<nobr>船名: " + shipName + "</nobr><br/><nobr>MMSI: " + shipMmsi + "</nobr>";
                g_showSimpleInfoDiv.style.height = "35px"; //只显示两行
                g_showSimpleInfoDiv.style.width = "120px";
                g_showSimpleInfoDiv.innerHTML = strInnerHTML;
                ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
            }
        }
    }

}
//保存物标信息
function AddCurDrawObject() {
    var objType = document.getElementById("drawObjType").value;
    var objName = document.getElementById("drawObjName").value;
    var objContent = document.getElementById("drawObjContent").value;
    var arrObjPo = API_GetCurDrawDynamicObjGeoPo(); //这里坐标从组件中获取，假如要修改的话，就不能这样获取了，只能从物标信息面板中获取
    var drawObjPoNum = arrObjPo.length;


    var strGeoValue = "";
    for (var i = 0; i < arrObjPo.length; i++) {
        strGeoValue += "_" + parseInt(arrObjPo[i].x) + "," + parseInt(arrObjPo[i].y);
    }


    if (objName == "") {
        alert("请输入标注名称！");
        return;
    }

    if (objType == "3" && drawObjPoNum < parseInt(3)) {
        alert("绘制的点数量不够组成一个面物标，请再添加绘制点。");
        return;
    }
    else if (objType == "2" && drawObjPoNum < parseInt(2)) {
        alert("绘制的点数量不够组成一个线物标，请再添加绘制点。");
        return;
    }

    if (objType == 9 && objContent == "" && isNaN(objContent)) {
        alert("请输入线区域半径。");
        return;
    }

    var layerStylePos = 0;
    var layerPos = -1;
    if (objType == 1) {
        //添加点
        layerPos = API_GetLayerPosById(g_iPointLayerId); //获取点图层的pos
        layerStylePos = g_iPointStylePos;
    }
    else if (objType == 2 || objType == 9) {//添加线
        layerPos = API_GetLayerPosById(g_iLineLayerId); //获取线图层的pos
        layerStylePos = g_iLineStylePos;
    }
    else if (objType == 3) {
        //添加面
        layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        layerStylePos = g_iFaceStylePos;
    }
    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos; //图层索引
        objInfo.objId = g_iAddObjId; //物标id
        objInfo.name = objName;//物标名称
        objInfo.showText = objName;//显示内容
        objInfo.layerStylePos = layerStylePos; //使用样式索引
        objInfo.objType = objType;
        arrExpAttrValue.push("来一个扩展字段");//扩展字段信息

        var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (objPos > -1) {
            bAddResult = true;

            if (objType == 9) {
                var fLineAreaSizeM = parseFloat(objContent);//线区域大小
                API_SetLineObjectAreaSize(layerPos, objPos, fLineAreaSizeM);
            }
            if (objType == 3)//面
            {
                var myColor = "#0000FF";
                var objStyleInfo = [];
                objStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
                objStyleInfo.fillColor = myColor;     //填充颜色(字符串)，例如"#000000"
                objStyleInfo.iOpacity = 50;      //填充透明度(数字)，0~100，100为不透明
                objStyleInfo.borderWith = 1;    //线粗细(数字)
                objStyleInfo.iLineOpacity = 50; //线的透明度(数字)，0~100，100为不透明
                objStyleInfo.borderColor = "#FF0000";   //线颜色(字符串)，例如"#000000"
                objStyleInfo.bShowText = false;     //是否显示信息(布尔)，true=显示，false=不显示
                objStyleInfo.textColor = "#00FF00";     //物标名称字体颜色(字符串)，例如"#000000"
                objStyleInfo.fontSize = "20px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
                objStyleInfo.iTextOpacity = 40;  //文本透明度(数字)，0~100，100为不透明
                objStyleInfo.lineType = 1;  //线类型：0=实线，1=虚线
                objStyleInfo.lineLen = 8;  //虚线时，线段长度
                objStyleInfo.dashLen = 4;  //虚线时，线段的间隔

                API_SetFaceObjStyleByPos(layerPos, objPos, true, objStyleInfo);
            }

            if (objType == 2)//添加线时候，设置线使用个性样式
            {
                var objStyleInfo = [];

                objStyleInfo.iOpacity = 50;      //填充透明度(数字)，0~100，100为不透明
                objStyleInfo.borderWith = 5;    //线粗细(数字)，大于0
                objStyleInfo.borderColor = "#0000FF";   //线颜色(字符串)，例如"#000000"
                objStyleInfo.textColor = "#FF0000";     //物标名称字体颜色(字符串)，例如"#000000"
                objStyleInfo.fontSize = "12px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
                objStyleInfo.bShowText = true;     //是否显示信息(布尔)，true=显示，false=不显示
                objStyleInfo.iTextOpacity = 50;  //文本透明度(数字)，0~100，100为不透明
                API_SetLineObjStyleByPos(layerPos, objPos, true, objStyleInfo);
            }

            if (objType == 1)//添加点时候，设置点使用个性样式
            {

                var objStyleInfo = [];
                objStyleInfo.bShowImg = true;      //是否用图片显示

                objStyleInfo.strImgSrc = "img/point.png";     //图片地址，例如"img/point.png"
                objStyleInfo.iImgWidth = 20;     //图片宽度(数字)
                objStyleInfo.iImgHeight = 20;    //图片高度(数字)
                objStyleInfo.iOpacity = 50;     //填充颜色的透明度(数字)，0~100，100为不透明
                /*
                var arrSymbolPo = []; //矢量符号坐标
                arrSymbolPo.push({ x: 0, y: 15 });
                arrSymbolPo.push({ x: 15, y: -15 });
                arrSymbolPo.push({ x: -15, y: -15 });
                objStyleInfo.arrSymbolPo = arrSymbolPo; //矢量符号坐标
                */
                /*
                objStyleInfo.iCircleScrnR = 8;  //使用圆表示时候，圆的半径

                objStyleInfo.bFilled = true;      //是否填充颜色(矢量符号有效)，true=填充，false=不填充。
                objStyleInfo.fillColor = "#FF0000";    //填充颜色
                objStyleInfo.iOpacity = 80;     //填充颜色的透明度(数字)，0~100，100为不透明
                objStyleInfo.borderWith = 0; //线粗细，0=不显示边
                objStyleInfo.borderColor = "#000000"; //线颜色，例如"#000000"
                objStyleInfo.iLineOpacity = 90; //线透明度(数字)，0~100，100为不透明
                */
                //文字样式
                objStyleInfo.textColor = "#FFFFFF";     //物标名称字体颜色(字符串)，例如"#000000"
                objStyleInfo.fontSize = "12px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
                objStyleInfo.bShowText = false;     //是否显示信息(布尔)，true=显示，false=不显示
                objStyleInfo.iTextOpacity = 100;  //文本透明度(数字)，0~100，100为不透明

                API_SetPointObjStyleByPos(layerPos, objPos, true, objStyleInfo);
            }
        }
    }



//    DelTableTrsByPos("SelectShipInfoTable", 1, 1000); //清除之前显示的数据
//    ShowDivBoxOrNot("SelectShipInfoDiv", true);

//    var retShipInfoObj = API_SelectShipsByGeoPolygon(arrObjPo, -1);

//    if (retShipInfoObj && retShipInfoObj.iShipCount > 0) {

//        for (var i = 0; i < retShipInfoObj.iShipCount; i++) {
//            var newRow = SelectShipInfoTable.insertRow(-1);

//            var newTd = newRow.insertCell();
//            newTd.innerHTML = "<b>" + (i + 1) + "</b>";

//            newTd = newRow.insertCell();
//            newTd.innerHTML = retShipInfoObj.arrShipInfo[i].shipName;

//            newTd = newRow.insertCell();
//            newTd.innerHTML = retShipInfoObj.arrShipInfo[i].shipGeoPoX;

//            newTd = newRow.insertCell();
//            newTd.innerHTML = retShipInfoObj.arrShipInfo[i].shipGeoPoY;

//            if (i > 200) {
//                break;
//            }
//        }
//    }
//    document.getElementById("selectShipShowText").innerHTML = "选中船舶(" + retShipInfoObj.iShipCount + "个)";


    if (bAddResult == true) {
        alert("添加成功");
        API_ReDrawLayer();
        EndDrawObj();
        CloseDivBox("drawObjBox");
    }
    else {
        alert("添加失败");
    }
}

export {
    DrawDynamicSymbol,
    EndDrawObj,
    AddCurDrawObject,
    AddCurDrawCircleObject,
    ClearDrawObjTextInfo,
    ShowShipSimpleInfo
}