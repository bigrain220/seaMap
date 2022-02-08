import {freeDateFormat} from "@/util/common";
import {ShowInfoDivBox} from "@/util/map/index";


// 添加历史轨迹
function AddShipHistoryTracks(info,points){
    // console.log(info,points)
    let { shipId,shipMMSI,shipName,shipGeoPoX,shipGeoPoY,shipWidth,shipLength,shipSpeed,shipCourse,shipTime,iShipState,bShowTrack,arrExpAttrValue}=info;
    const shipInfo={
        shipId,
        shipMMSI,
        shipName,
        shipGeoPoX,
        shipGeoPoY,
        shipWidth,
        shipLength,
        shipSpeed,
        shipCourse,
        shipTime,
        iShipState,
        bShowTrack,
        arrExpAttrValue
    };
    let curHistoryTrack = points.map(item=>{
        const {cog,from,lat,lon,sog,status,time}= item;
        //trackGeoPoX 经度，例如1210000000
        //trackGeoPoY 纬度，例如31000000
        //trackCourse 航向，单位度(int)
        //trackSpeed 航速
        //trackTime 时间，格式例如"2015/5/31 12:1:3"
        //这里要注意轨迹添加的时间格式必须是"2015/5/31 12:1:3"
        return {
            trackGeoPoX:lon,
            trackGeoPoY:lat,
            trackCourse:cog,
            trackSpeed:sog,
            trackTime: freeDateFormat(new Date(time),'yyyy/MM/dd h:m:s')
        }
    })
    // console.log(shipInfo,curHistoryTrack)
    API_SetIfShowTrackPoInfo(false, false, true, null);
    API_AddOnePlayShipInfo(shipInfo,curHistoryTrack);
    // API_SetPlayShipTrackStyleById(shipId, "#6a9955")
    const pos = API_GetPlayShipPosById(shipId);
    //立即显示完轨迹
    API_StartPlayShipHistoryTrack();
    API_EndPlayHistoryTrack();
    API_SetShowPlayShipTrackOrNotByPos(pos, true);
    API_ReDrawPlayShip(); //重绘回放船舶
    //定位居中船舶到海图屏幕
    // API_SetMapViewCenter(shipGeoPoX / 10000000, shipGeoPoY / 10000000, null);
}

//显示简单的船舶信息（鼠标移动到船舶显示）
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
                shipGeoPoX =(shipInfoObj.shipGeoPoX/10000000).toFixed(7);
                shipGeoPoY = (shipInfoObj.shipGeoPoY/10000000).toFixed(7);
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
            var strLon = shipGeoPoX / 10000000;//API_LonLatToString(shipGeoPoX / 10000000, false);
            strInnerHTML += "经度:" + shipGeoPoX + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLat = API_LonLatToString(shipGeoPoY / 10000000, false);
            strInnerHTML += "纬度:" + shipGeoPoY + "<br>";
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
            var iMsgBoxHeight = 20;
            var iMsgBoxWidth = 200;
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var shipName, shipMmsi, shipGeoPoX, shipGeoPoY, shipSpeed, shipCourse, shipTime;
            var strTitle;
            var shipInfoObj = API_GetShipInfoByPos(iShipPos);

            var curShipPos = API_GetShipPosById(shipId);
            var shipInfoObj1 = API_GetShipAllExpAttrByPos(curShipPos);

            if (shipInfoObj) {
                shipName = shipInfoObj.shipName;
                shipMmsi = shipInfoObj.shipMMSI;
                shipGeoPoX =(shipInfoObj.shipGeoPoX/10000000).toFixed(7);
                shipGeoPoY = (shipInfoObj.shipGeoPoY/10000000).toFixed(7);
                shipSpeed = shipInfoObj.shipSpeed;
                shipCourse = shipInfoObj.shipCourse;
                shipTime = shipInfoObj.shipTime;
                strTitle = "船舶信息:" + shipName;
            }
            if (iTrackPos != null) {//选中的是轨迹点
                var shipInfoObj = API_GetHistroyTrackInfoByPos(iShipPos, iTrackPos);
                if (shipInfoObj) {
                    strTitle = "当前船舶轨迹点信息";
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
            strInnerHTML += "经度:" + shipGeoPoX + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLat = API_LonLatToString(shipGeoPoY / 10000000, false);
            strInnerHTML += "纬度:" + shipGeoPoY + "<br>";
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
            // var shipInfoObj = API_GetShipInfoByPos(iShipPos);
            // if (shipInfoObj) {
            //     var shipName = shipInfoObj.shipName;
            //     var shipMmsi = shipInfoObj.shipMMSI;
            //     var shipTime = shipInfoObj.shipTime;

            //     var strInnerHTML = "<nobr>船名: " + shipName + "</nobr><br/><nobr>MMSI: " + shipMmsi + "</nobr>";
            //     g_showSimpleInfoDiv.style.height = "35px"; //只显示两行
            //     g_showSimpleInfoDiv.style.width = "120px";
            //     g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            //     ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
            // }
        }
    }
    //重绘是为了立刻看到效果，否则会等下一次重绘才看到效果
    if (bSelPlayTrackShip == true) {
        API_ReDrawPlayShip(); //重绘回放船舶
    } else {
        API_ReDrawShips(); //重绘船舶
    }

}

export {
    AddShipHistoryTracks,
    ShowShipSimpleInfo
}