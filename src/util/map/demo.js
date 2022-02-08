import {DelTableTrsByPos, ShowDivBox} from "@/util/map/functions/common"
import {ShowInfoDivBox} from "@/util/map/index.js"

//显示船舶详细信息面板（鼠标点击船舶信息）
function ShowShipDetailInfo(shipId, bSelPlayTrackShip, scrnPo) {
    var iShipPos = -1;
    var shipInfoObj = null;
    var arrExpAttr = null;
    if (bSelPlayTrackShip == true) {
        iShipPos = API_GetPlayShipPosById(shipId); //轨迹回放船舶
        if (iShipPos > -1) {
            shipInfoObj = API_GetPlayShipInfoByPos(iShipPos);
            API_SetSelectPlayShipByPos(iShipPos); //设置选中船舶，即显示船舶边框
        }
    } else {
        iShipPos = API_GetShipPosById(shipId);//当前船舶
        if (iShipPos > -1) {
            shipInfoObj = API_GetShipInfoByPos(iShipPos);
            API_SetSelectShipByPos(iShipPos); //设置选中船舶，即显示船舶边框
            arrExpAttr = API_GetShipAllExpAttrByPos(iShipPos);//扩展字段数组
        }
    }
    console.log(234)
    if (shipInfoObj) {
        var shipName = shipInfoObj.shipName;        //船名名称
        var shipMmsi = shipInfoObj.shipMMSI;        //mmsi
        var shipGeoPoX = shipInfoObj.shipGeoPoX;    //位置
        var shipGeoPoY = shipInfoObj.shipGeoPoY;
        var shipSpeed = shipInfoObj.shipSpeed;      //速度
        var shipCourse = shipInfoObj.shipCourse;    //航向
        var shipWidth = shipInfoObj.shipWidth;      //宽度
        var shipLength = shipInfoObj.shipLength;    //长度
        var iShipState = shipInfoObj.iShipState;    //状态
        var bOnlineOrNot = shipInfoObj.bOnlineOrNot; //是否在线
        var shipTime = shipInfoObj.shipTime;        //时间
        var bShowTrack = shipInfoObj.bShowTrack;    //是否显示轨迹
        var bFollow = shipInfoObj.bFollow; //是否跟踪船舶
        var strShipLon = API_LonLatToString(shipGeoPoX / 10000000, true);
        var strShipLat = API_LonLatToString(shipGeoPoY / 10000000, false);

        DelTableTrsByPos("TableShipInfo", 0, 1000);
        // ShowDivBox("ShowDetailShipInfoDiv", 20, 20);

        //以下计算信息标签弹出的位置
        var objDiv = document.getElementById("ShowDetailShipInfoDiv");//信息标签div的对象，
        var mapViewSize = API_GetPageSize();//海图视图长宽
        var divLeft = parseInt(mapViewSize.x - parseInt(objDiv.style.width));//海图视图宽度减去标签宽度即标签的left位置
        var divTop = 0;    //标签top位置为0
        ShowDivBox("ShowDetailShipInfoDiv", divLeft, divTop);

        var newRow = TableShipInfo.insertRow(-1);
        var newTd = newRow.insertCell(); //船名
        newTd.style.width = "10%";
        newTd.innerHTML = "<nobr><b>船名</b><nobr/>:";
        newTd = newRow.insertCell();
        newTd.style.width = "30%";
        newTd.innerHTML = shipName;
        newTd = newRow.insertCell(); //MMSi
        newTd.style.width = "10%";
        newTd.innerHTML = "<b>MMSI</b>:";
        newTd = newRow.insertCell();
        newTd.style.width = "30%";
        newTd.innerHTML = shipMmsi;

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //呼号
        newTd.innerHTML = "<b>船长</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = "李宇哲";
        newTd = newRow.insertCell(); //船宽
        newTd.innerHTML = "<b>电话</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = "13988277381";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //经度
        newTd.innerHTML = "<b>经度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = strShipLon;
        newTd = newRow.insertCell(); //纬度
        newTd.innerHTML = "<b>纬度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = strShipLat;

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //航速
        newTd.innerHTML = "<b>航速</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipSpeed + ("节");
        newTd = newRow.insertCell(); //航向
        newTd.innerHTML = "<b>航向</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipCourse + "(度)";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //船长
        newTd.innerHTML = "<b>长度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipLength + "(米)";
        newTd = newRow.insertCell(); //船宽
        newTd.innerHTML = "<b>船宽</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipWidth + "(米)";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //类型
        newTd.innerHTML = "<b>状态</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = bOnlineOrNot == true ? "在线" : "离线";
        newTd = newRow.insertCell(); //状态
        newTd.innerHTML = "<b>类型</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = iShipState == 0 ? "渔船" : "货船";

//        newRow = TableShipInfo.insertRow(-1);
//        newTd = newRow.insertCell(); //呼号
//        newTd.innerHTML = "<b>呼号</b>:";
//        newTd = newRow.insertCell();
//        newTd.innerHTML = "OMT" + parseInt(Math.random() * 1000);
//        newTd = newRow.insertCell(); //船宽
//        newTd.innerHTML = "<b>终端</b>:";
//        newTd = newRow.insertCell();
//        newTd.innerHTML = parseInt(Math.random() * 10) > 1 ? "AIS" : "北斗";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //类型
        newTd.innerHTML = "<b>吨位</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = parseInt(Math.random() * 100) * 100 + "吨";
        ;
        newTd = newRow.insertCell(); //状态
        newTd.innerHTML = "<b>吃水</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = parseInt(Math.random() * 100) + "(米)";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //时间
        newTd.innerHTML = "<b>时间</b>:";
        newTd = newRow.insertCell();
        newTd.setAttribute("colspan", 3);
        newTd.innerHTML = "<nobr>" + shipTime + "</nobr>";

        document.getElementById("bSelPlayTrackShip").value = bSelPlayTrackShip == true ? "1" : "0";
        document.getElementById("ShowShipId").value = shipId;
        document.getElementById("ShowShipTrackOrNot").value = bShowTrack == true ? "隐藏轨迹" : "显示轨迹";
        document.getElementById("FollowShip").value = bFollow == true ? "取消跟踪" : "跟踪船舶";
    }

}

//取消选中船舶
function SetNoSelectShip() {
    var iShipId = document.getElementById("ShowShipId").value;
    var bSelPlayTrackShip = document.getElementById("bSelPlayTrackShip").value == "1" ? true : false;
    if (bSelPlayTrackShip)//是回放船舶
    {
        var iShipPos = API_GetPlayShipPosById(iShipId);
        API_SetSelectPlayShipByPos(iShipPos);
    } else {
        var iShipPos = API_GetShipPosById(iShipId);
        API_SetSelectShipByPos(iShipPos);
    }
}

var abc = false;

//是否显示船舶轨迹
function SetCurShowShipInfo(type) {
    var iShipId = document.getElementById("ShowShipId").value;
    var bSelPlayTrackShip = document.getElementById("bSelPlayTrackShip").value == "1" ? true : false;
    if (iShipId == null) {
        return;
    }

    if (type == 1) {//显示/隐藏当前轨迹
        var buttonObj = document.getElementById("ShowShipTrackOrNot");
        var strButtonText = buttonObj.value;
        var bShowOrNot;
        if (strButtonText == "显示轨迹") {
            buttonObj.value = "隐藏轨迹";
            bShowOrNot = true;
        } else {
            buttonObj.value = "显示轨迹";
            bShowOrNot = false;
        }

        if (bSelPlayTrackShip == true) {
            var iShipPos = API_GetPlayShipPosById(iShipId);
            API_SetShowPlayShipTrackOrNotByPos(iShipPos, bShowOrNot);
        } else {
            if (bShowOrNot) {
                abc = !abc;
                if (abc) {
                    API_SetShipTrackStyleById(iShipId, "#00FFFF", 3);//根据船舶id设置船舶当前轨迹的样式
                    API_SetShowTrackPoCount(16);//船舶显示轨迹
                } else {
                    API_SetShipTrackStyleById(iShipId, "#FF0000", 5);
                    API_SetShowTrackPoCount(0);
                }
            }

            var iShipPos = API_GetShipPosById(iShipId);
            API_SetShowShipTrackOrNotByPos(iShipPos, bShowOrNot);
        }

    } else if (type == 2) {//居中船舶
        if (bSelPlayTrackShip == true) {
            var iShipPos = API_GetPlayShipPosById(iShipId);
            API_SetPlayShipToMapViewCenterByPos(iShipPos);
        } else {
            var iShipPos = API_GetShipPosById(iShipId);
            API_SetShipToMapViewCenterByPos(iShipPos);
        }
    } else if (type == 3) {//跟踪/取消跟踪船舶
        var buttonObj = document.getElementById("FollowShip");
        var strButtonText = buttonObj.value;

        var iFollowShipId = -1;
        if (strButtonText == "跟踪船舶") {
            buttonObj.value = "取消跟踪";
            iFollowShipId = iShipId;
        } else {
            buttonObj.value = "跟踪船舶";
        }
        if (bSelPlayTrackShip == true) {
            var iShipPos = -1;
            if (iFollowShipId > -1) {
                iShipPos = API_GetPlayShipPosById(iFollowShipId);
            }
            API_FollowPlayShipByPos(iFollowShipId);
        } else {
            var iShipPos = -1;
            if (iFollowShipId > -1) {
                iShipPos = API_GetShipPosById(iShipId);
            }

            API_FollowShipByPos(iShipPos);
            ;
        }
    }

    //重绘是为了立刻看到效果，否则会等下一次重绘才看到效果
    if (bSelPlayTrackShip == true) {
        API_ReDrawPlayShip(); //重绘回放船舶
    } else {
        API_ReDrawShips(); //重绘船舶
    }

}

function ShowObjDetailInfo(layerId, objId, scrnPo) {
    var iLayerPos = API_GetLayerPosById(layerId);//得到图层的pos
    if (iLayerPos > -1) {
        var iMsgBoxHeight = 20;
        var iMsgBoxWidth = 200;
        var ObjPos = API_GetObjectPosById(objId, iLayerPos);
        var iObjPos = -1;
        if (ObjPos) {
            iObjPos = ObjPos.iObjPos;
        }
        var curObjInfoObj = API_GetObjectInfoByPos(iLayerPos, iObjPos);
        if (curObjInfoObj) {
            var strInnerHTML = "";
            var strName = curObjInfoObj.name;
            var arrExpAttrValue = curObjInfoObj.arrExpAttrValue;
            if (layerId == g_iWeatherLayerId) { //显示气象信息
                //气象信息，这里可以得气象信息，可以根据气象信息去数据库或者其他地方获取信息来显示
            } else if (layerId == g_iPortLayerId)//港口
            {
                //物标信息对象curObjInfoObj有添加时候的id、扩展字段等信息，可以根据这些信息去数据库或者其他地方获取信息来显示
                var portId = curObjInfoObj.id;
                ShowPortInfo(portId, strName);

            } else {
                //只是自定义物标信息
            }

            if (strInnerHTML) {
                g_showSimpleInfoDiv.innerHTML = strInnerHTML;
                g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
                g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";

                ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
            }
        }
    }
}

function setAlera(){
    var arrPointTest = new Array();
    arrPointTest[0] = new Array();
    arrPointTest[0].push({x: 1200000000, y: 320000000});
    arrPointTest[0].push({x: 1220000000, y: 340000000});
    arrPointTest[0].push({x: 1240000000, y: 320000000});
    arrPointTest[0].push({x: 1260000000, y: 340000000});
    // arrPointTest[1] = new Array();
    // arrPointTest[1].push({x: 1200000000, y: 340000000});
    // arrPointTest[1].push({x: 1220000000, y: 320000000});
    // arrPointTest[1].push({x: 1240000000, y: 340000000});
    // arrPointTest[1].push({x: 1260000000, y: 320000000});
    // arrPointTest[2] = new Array();
    // arrPointTest[2].push({x: 1200000000, y: 280000000});
    // arrPointTest[2].push({x: 1230000000, y: 280000000});
    // arrPointTest[2].push({x: 1230000000, y: 380000000});
    // arrPointTest[2].push({x: 1260000000, y: 380000000});
    // arrPointTest[3] = new Array();
    // arrPointTest[3].push({x: 1240000000, y: 280000000});
    // arrPointTest[3].push({x: 1260000000, y: 280000000});
    // arrPointTest[3].push({x: 1260000000, y: 300000000});
    var alertDate = API_GetAlarmArea(arrPointTest, 10, 1);
    console.log(alertDate)
    var objName = "新 物 标\n诶";
    var arrObjPo1 = []; //坐标
    // var arrObjPo2 = []; //坐标
    // var arrObjPo3 = []; //坐标
    // var arrObjPo4 = []; //坐标

    for(var i = 0; i < alertDate[0].length; i++){
        var geoPo = { x: alertDate[0][i].x * 10000000, y: alertDate[0][i].y * 10000000 };
        arrObjPo1.push(geoPo);
    }

    // for(var i = 0; i < alertDate[1].length; i++){
    //     var geoPo = { x: alertDate[1][i].x * 10000000, y: alertDate[1][i].y * 10000000 };
    //     arrObjPo2.push(geoPo);
    // }

    // for(var i = 0; i < alertDate[2].length; i++){
    //     var geoPo = { x: alertDate[2][i].x * 10000000, y: alertDate[2][i].y * 10000000 };
    //     arrObjPo3.push(geoPo);
    // }

    // for(var i = 0; i < alertDate[3].length; i++){
    //     var geoPo = { x: alertDate[3][i].x * 10000000, y: alertDate[3][i].y * 10000000 };
    //     arrObjPo4.push(geoPo);
    // }

    var layerStylePos = 0;
    var layerPos = -1;

    layerPos = API_GetLayerPosById(g_iCompositeLayerId); //获取线图层的pos
    layerStylePos = g_iCompositeStylePos;

    var bAddResult = false;
    var objPos = -1;
    if (layerPos > -1) {

        var g_iAddObjId1 = 0;

        var objInfo1 = [];
        var arrExpAttrValue1 = []; //扩展字段，假如没有可以传入null

        objInfo1.objType = 2;
        objInfo1.layerPos = layerPos; //图层索引
        objInfo1.objId = g_iAddObjId1; //物标id
        objInfo1.name = objName; //物标名称
        objInfo1.showText = objName; //显示内容
        objInfo1.layerStylePos = layerStylePos; //使用样式索引
        arrExpAttrValue1.push("来一个扩展字段"); //扩展字段信息

        objPos = API_AddNewObject(objInfo1, arrObjPo1, arrExpAttrValue1);

        // var g_iAddObjId2 = 1;
        //
        // var objInfo2 = [];
        // var arrExpAttrValue2 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo2.objType = 2;
        // objInfo2.layerPos = layerPos; //图层索引
        // objInfo2.objId = g_iAddObjId2; //物标id
        // objInfo2.name = objName; //物标名称
        // objInfo2.showText = objName; //显示内容
        // objInfo2.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue2.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo2, arrObjPo2, arrExpAttrValue2);

        // var g_iAddObjId3 = 2;
        //
        // var objInfo3 = [];
        // var arrExpAttrValue3 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo3.objType = 2;
        // objInfo3.layerPos = layerPos; //图层索引
        // objInfo3.objId = g_iAddObjId3; //物标id
        // objInfo3.name = objName; //物标名称
        // objInfo3.showText = objName; //显示内容
        // objInfo3.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue3.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo3, arrObjPo3, arrExpAttrValue3);

        // var g_iAddObjId4 = 3;
        //
        // var objInfo4 = [];
        // var arrExpAttrValue4 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo4.objType = 2;
        // objInfo4.layerPos = layerPos; //图层索引
        // objInfo4.objId = g_iAddObjId4; //物标id
        // objInfo4.name = objName; //物标名称
        // objInfo4.showText = objName; //显示内容
        // objInfo4.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue4.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo4, arrObjPo4, arrExpAttrValue4);

        var g_iAddObjId5 = 4;

        var objInfo5 = [];
        var arrExpAttrValue5 = []; //扩展字段，假如没有可以传入null

        objInfo5.objType = 2;
        objInfo5.layerPos = layerPos; //图层索引
        objInfo5.objId = g_iAddObjId5; //物标id
        objInfo5.name = objName; //物标名称
        objInfo5.showText = objName; //显示内容
        objInfo5.layerStylePos = layerStylePos; //使用样式索引
        arrExpAttrValue5.push("来一个扩展字段"); //扩展字段信息

        objPos = API_AddNewObject(objInfo5, arrPointTest[0], arrExpAttrValue5);

        // var g_iAddObjId6 = 5;
        //
        // var objInfo6 = [];
        // var arrExpAttrValue6 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo6.objType = 2;
        // objInfo6.layerPos = layerPos; //图层索引
        // objInfo6.objId = g_iAddObjId6; //物标id
        // objInfo6.name = objName; //物标名称
        // objInfo6.showText = objName; //显示内容
        // objInfo6.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue6.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo6, arrPointTest[1], arrExpAttrValue6);

        // var g_iAddObjId7 = 6;
        //
        // var objInfo7 = [];
        // var arrExpAttrValue7 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo7.objType = 2;
        // objInfo7.layerPos = layerPos; //图层索引
        // objInfo7.objId = g_iAddObjId7; //物标id
        // objInfo7.name = objName; //物标名称
        // objInfo7.showText = objName; //显示内容
        // objInfo7.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue7.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo7, arrPointTest[2], arrExpAttrValue7);

        // var g_iAddObjId8 = 7;
        //
        // var objInfo8 = [];
        // var arrExpAttrValue8 = []; //扩展字段，假如没有可以传入null
        //
        // objInfo8.objType = 2;
        // objInfo8.layerPos = layerPos; //图层索引
        // objInfo8.objId = g_iAddObjId8; //物标id
        // objInfo8.name = objName; //物标名称
        // objInfo8.showText = objName; //显示内容
        // objInfo8.layerStylePos = layerStylePos; //使用样式索引
        // arrExpAttrValue8.push("来一个扩展字段"); //扩展字段信息
        //
        // objPos = API_AddNewObject(objInfo8, arrPointTest[3], arrExpAttrValue8);
    }

    if (objPos > -1) {
        bAddResult = true;
    }

    if (bAddResult == true) {

        API_ReDrawLayer();
        alert("添加成功");

    }
    else {
        alert("添加失败");
    }
}

export {
    ShowShipDetailInfo,
    ShowObjDetailInfo,
    SetNoSelectShip,
    SetCurShowShipInfo,
    setAlera
}