
// 文件:SdkReturnInfo.js,功能：此文件的方法为海图操作的时候，YimaEnc SDK返回来的信息，
// 比如绘制标注返回坐标、测距返回距离、鼠标选中船舶返回船舶信息等

// ReturnSelectObjByMouseLeftDown
//鼠标左击时查询到的对象信息
//鼠标左击时激发该方法
//objInfo:对象的信息结构体，null=没有查询到对象
//objInfo格式例如：
//选中船舶信息{objType:1,po:{x:200,y:300},bSelPlayTrackShip:false}
//选中物标信息{objType:2,po:{x:200,y:300},layerId:1,objId:2}
//objType:对象信息类型，1=船舶信息,2=物标信息
//po:当前鼠标所在的相对海图的屏幕位置，例如{x:200,y:300}
// bSelPlayTrackShip：选择的船舶信息是否为回放轨迹船舶，true=是，false=否，因为当前船舶与轨迹回放船舶的管理接口不一样，所以会有这个属性来判断要哪些接口来获取船舶信息。
// layerId:选中图层的id
// objId:选中物标的id


import {ShowShipDetailInfo} from "@/util/map/demo"



//鼠标左击时查询到的对象信息
function ReturnSelectObjByMouseLeftDown(objInfo) {
    if (objInfo == null) {
        return;
    }

    if (objInfo) {
        switch (objInfo.objType) {
            case 1: //选中了船舶，得到船舶的id,pos
                if(objInfo.bClusterers == true)//聚合
                {
                    if(objInfo.data.type == 0)//聚合
                    {
                        API_SetSelectMarkerClustererById(objInfo.data.type,objInfo.data.id);
                        var shipIdInfo = API_GetClustererShipIdInfoById(objInfo.data.id);
                        console.log(shipIdInfo);
                    }
                    else//单艘船只
                    {
                        API_SetSelectMarkerClustererById(objInfo.data.type,objInfo.data.shipId);

                        var strShowText = "";
                        var clustererOption =  API_GetClustererShowOption();
                        if(clustererOption.bClientcalculate == true)//本地计算聚合
                        {
                            //显示船舶信息标签（本地计算聚合情况下可以这样获取船舶信息）
                            var iShipPos = API_GetShipPosById(objInfo.data.shipId);
                            shipInfoObj = API_GetShipInfoByPos(iShipPos);
                            var strShowText = "名称:" + shipInfoObj.shipName;
                            strShowText += "\n"; //换行
                            strShowText += "MMSI:" + shipInfoObj.shipMMSI;
                            strShowText += "\n"; //换行
                            strShowText += "经度:" + shipInfoObj.shipGeoPoX;
                            strShowText += "\n"; //换行
                            strShowText += "纬度:" + shipInfoObj.shipGeoPoY;
                        }
                        else
                        {
                            shipInfoObj = API_GetClustererInfoById(objInfo.data.shipId);//服务器计算聚合
                            var strShowText = "名称:" + shipInfoObj.shipName;
                            strShowText += "\n"; //换行
                            strShowText += "经度:" + shipInfoObj.lon;
                            strShowText += "\n"; //换行
                            strShowText += "纬度:" + shipInfoObj.lat;
                        }

                        API_SetClustererShowBoxInfoTextById(objInfo.data.shipId,strShowText);
                        API_ReDrawShips();//重绘

                    }
                }
                else
                {
                    var iShipId = objInfo.id;
                    var scrnPo = objInfo.po;
                    var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;
                    ShowShipDetailInfo(iShipId, bSelPlayTrackShip, scrnPo); //显示船舶的详细信息
                    //设置显示船舶对话框信息
                    var iShipPos = API_GetShipPosById(iShipId);
                    var shipInfoObj = API_GetShipInfoByPos(iShipPos);
                    if (shipInfoObj) {
                        var strShowText = "名称:" + shipInfoObj.shipName;
                        strShowText += "\n"; //换行
                        strShowText += "MMSI:" + shipInfoObj.shipMMSI;
                        strShowText += "\n"; //换行
                        strShowText += "经度:" + shipInfoObj.shipGeoPoX;
                        strShowText += "\n"; //换行
                        strShowText += "纬度:" + shipInfoObj.shipGeoPoY;
                        //API_SetShipShowBoxInfoTextByShipPos(iShipPos, strShowText);
                        API_SetShowShipInfo(true, 1, false, true);
                        API_ReDrawShips();//重绘
                    }
                }
                break;
            case 2: //选中了物标，得到物标所属的图层id以及物标id
                var layerId = objInfo.layerId; //图层的id
                var objId = objInfo.objId; //物标的id
                ShowObjDetailInfo(layerId,objId, scrnPo);//显示物标的详细信息
                break;
            case 3:
                break;
        }
    }
    else {
        if (g_showSimpleInfoDiv) {
            g_showSimpleInfoDiv.style.display = "none";
        }
    }
}


window.ReturnSelectObjByMouseLeftDown=ReturnSelectObjByMouseLeftDown;