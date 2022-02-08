// API_GetShipInfoByPos(iShipPos)
//根据船舶索引pos获取船舶信息
//iShipPos:船舶的pos
//返回值：null=找不到船舶，船舶结构体

// API_GetShipPosById(iShipId)
//根据船舶的id获取索引pos
//iShipId:船舶的id(int)
//返回值：-1=没有改船舶（int）

// API_UpdateOneShipDynamicInfoByPos(iShipPos, objDynamicInfo)
//更新一个船舶的动态信息
//iShipPos:船舶的pos
//objDynamicInfo:动态信息结构体
//返回值：true=成功，false=失败

// ShipInfo船舶信息结构体
// this.shipId;       //船舶的id
// this.shipMMSI;     //mmsi
// this.shipName;     //船名名称
// this.shipGeoPoX;   //位置X，例如1210000000
// this.shipGeoPoY;   //位置Y，例如310000000
// this.shipWidth;    //宽度(数字)
// this.shipLength;   //长度(数字)
// this.shipSpeed;    //速度(数字)
// this.shipCourse;   //航向(数字)
// this.shipTime;     	//时间(字符串)，格式:2015/6/6 12:5:18
// this.iShipState;   //状态(数字)
// this.bOnlineOrNot; 	//是否在线(布尔)，true=在线，false=离线
// this.bShowTrack; 	//是否显示轨迹(布尔)，该值在结构体中只读，设置无效
// this.bFollow; 		//是否为跟踪船舶(布尔)，该值在结构体中只读，设置无效
// this.colorCode;	//颜色编号

import {Test_SetMapCenterPo} from "@/util/map/functions/common"

// 添加自定义ship
function shipClick() {
    API_DelAllShips();
    // API_SetTrackIdShowOrNot(true);//是否添加轨迹点的id
    //strFont:字体大小，例如"13px"；
    //strColor:字体颜色，例如"#FF0000";
    //iOpacity:透明度，0~100，100为不透明
    // API_SetShowShipInfoStyle("15px 宋体", "#FF0000", 90); //设置显示船舶信息的样式
    // API_SetShowShipInfo(true, 500000, true, false); //设置显示船舶信息
    var shipInfo = getShipInfo(); //这个值可参照“ShipInfo”船舶信息结构体
    API_AddOneShip(shipInfo[0]); //添加船舶
    API_ReDrawShips(); //添加完之后就重绘，这样就立刻显示出来，否则只能等拖动或者缩放激发绘制
    API_AddOneShip(shipInfo[1]); //添加船舶
    API_ReDrawShips(); //添加完之后就重绘，这样就立刻显示出来，否则只能等拖动或者缩放激发绘制
    // API_SetMapViewCenter(121.481099, 31.238688, 320000); //切换到有船舶的区域,调用了这个接口，可以不再调用API_ReDrawShips
    // var timerId = setInterval(() => {
    //     UpdateShipInfo1(timerId)
    // }, 3000); //3秒更新一次船舶信息
    UpdateShipInfo1(1)
}

//数据处理
function getShipInfo() {
    var arr = [];
    arr.shipId = 50; //船舶的id
    arr.shipMMSI = 477991633; //mmsi
    arr.shipName = "SHANGHAI"; //船名名称
    // arr.shipGeoPoX = 1214191521; //位置X，例如1210000000
    // arr.shipGeoPoY = 311030840; //位置Y，例如310000000 纬度
    arr.shipGeoPoX = 121.857293 * 10000000; //靠近上海浦东国际机场
    arr.shipGeoPoY = 31.175517 * 10000000;
    arr.shipGeoPoId =  50;    //位置
    arr.shipWidth = 5; //宽度(数字)
    arr.shipLength = 17; //长度(数字)
    arr.shipSpeed = 10; //速度(数字)
    arr.shipCourse = 300; //航向(数字)
    arr.shipTime = "2017-09-20 09:30:01"; //时间(字符串)，格式=2015/6/6 12=5=18
    arr.iShipState = 2; //状态(数字)
    arr.bOnlineOrNot = true; //是否在线(布尔)，true=在线，false=离线
    arr.bShowTrack = false; //是否显示轨迹(布尔)，该值在结构体中只读，设置无效
    // arr.bFollow= false; //是否为跟踪船舶(布尔)，该值在结构体中只读，设置无效
    arr.arrExpAttrValue = {attention: true}; //扩展字段
    //宝山区的NN1CR50
    var curShipInfo = []; //当前船舶的结构体信息
    curShipInfo.shipId = 51; //船舶的id
    curShipInfo.shipMMSI = 413760095; //mmsi
    curShipInfo.shipName = "宝山区Baoshan"; //船名名称
    curShipInfo.shipGeoPoX = 121.514705 * 10000000; //位置
    curShipInfo.shipGeoPoY = 31.423437 * 10000000; //位置
    arr.shipGeoPoId =  51;    //位置
    curShipInfo.shipWidth = 10; //宽度
    curShipInfo.shipLength = 272; //长度
    curShipInfo.shipSpeed = 8; //速度
    curShipInfo.shipCourse = 118; //航向
    curShipInfo.shipTime = "2017-09-20 10:30:01"; //时间
    curShipInfo.iShipState = 2; //状态
    curShipInfo.bOnlineOrNot = true; //是否在线
    curShipInfo.bShowTrack = false; //是否显示轨迹
    curShipInfo.arrExpAttrValue = {attention: false}; //扩展字段
    return [arr, curShipInfo]
}

function UpdateShipInfo() {
    var shipCount = API_GetShipsCount();

    for (var i = 0; i < shipCount; i++) {
        var shipPos = i;
        var curShipInfo = API_GetShipInfoByPos(shipPos);
        if (curShipInfo) {
            //-----------------生成模拟数据-------------------------------
            var iGeoPoX = curShipInfo.shipGeoPoX;//船舶的位置
            var iGeoPoY = curShipInfo.shipGeoPoY;
            var shipCourse = curShipInfo.shipCourse; //航向
            var iShipState = curShipInfo.iShipState; //状态
            var bOnlineOrNot = curShipInfo.bOnlineOrNot; //是否在线
            var shipSpeed = curShipInfo.shipSpeed; //航速
            var iAddGeoLen = Math.random() * 1000000;
            var angle = (90 - shipCourse) * Math.PI / 180;
            var shipGeoPoX = parseInt(iGeoPoX + Math.cos(angle) * iAddGeoLen);
            var shipGeoPoY = parseInt(iGeoPoY + Math.sin(angle) * iAddGeoLen);
            var iRandom = parseInt(Math.random() * 20);

            if(iRandom % 2 == 0)
            {
                shipCourse -= iRandom;
            }
            else
            {
                shipCourse += iRandom;
            }

            if(iShipState == 1){
                continue;
            }

            if (shipGeoPoX < 120000000 || shipGeoPoX > 1500000000 || shipGeoPoY < 200000000 || shipGeoPoY > 500000000) {
                shipCourse = parseInt(Math.random() * 100);
            }
            var nowTime = new Date();
            var shipTime = nowTime.getFullYear() + "/" + nowTime.getMonth() + "/" + nowTime.getDay() + " " + nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds(); //时间
            //----------------------------------------------------------------

            var curShipDynamicInfo = [];//更新的时候，只要把这些值设置好即可
            curShipDynamicInfo.shipGeoPoX = shipGeoPoX;
            curShipDynamicInfo.shipGeoPoY = shipGeoPoY;
            curShipDynamicInfo.shipSpeed = 12;
            curShipDynamicInfo.shipCourse = shipCourse;
            curShipDynamicInfo.shipTime = shipTime;
            curShipDynamicInfo.iShipState = iShipState;
            curShipDynamicInfo.bOnlineOrNot = bOnlineOrNot;
            API_SetOneShipTrackShowOption(shipPos, true, 50000);

            API_UpdateOneShipDynamicInfoByPos(shipPos, curShipDynamicInfo); //更新一艘船舶动态信息
        }
    }

    API_ReDrawShips();
};

function UpdateShipInfo1(timerId) {
    const shipPos = API_GetShipPosById(50);
    let curShipInfo = API_GetShipInfoByPos(shipPos);
    // console.log('curShipInfo',curShipInfo.GetExpAttrValueByPos(shipPos));
    // 出发点 121.857293 31.175517
    // 目标经纬度
    const targetX = 121.514705 * 10000000;
    const targetY = 31.423437 * 10000000;
    if (!curShipInfo) {
        return false;
    }
    let addX = curShipInfo.shipGeoPoX > targetX;
    let addY = curShipInfo.shipGeoPoY < targetY;
    let curShipDynamicInfo = [];
    curShipDynamicInfo.shipId = curShipInfo.shipId;
    curShipDynamicInfo.shipGeoPoX = addX ? curShipInfo.shipGeoPoX - 100000 : targetX;
    curShipDynamicInfo.shipGeoPoY = addY ? curShipInfo.shipGeoPoY + 100000 : targetY;
    curShipDynamicInfo.shipSpeed = curShipInfo.shipSpeed;
    curShipDynamicInfo.shipCourse = curShipInfo.shipCourse;
    curShipDynamicInfo.shipTime = '2021-10-28 09:30:01';
    curShipDynamicInfo.iShipState = curShipInfo.iShipState;
    curShipDynamicInfo.bOnlineOrNot = curShipInfo.bOnlineOrNot;
    API_UpdateOneShipDynamicInfoByPos(shipPos, curShipDynamicInfo); //更新一艘船舶动态信息
    DrawCircleShip(curShipDynamicInfo) //画圆
    API_ReDrawShips(); //更新完之后要立刻绘制，这样才能实时显示
    // Test_SetMapCenterPo({x:curShipDynamicInfo.shipGeoPoX/10000000,y:curShipDynamicInfo.shipGeoPoY/10000000,level:13})//设置视图中心点
    if (!addX && !addY) {
        clearInterval(timerId)
        // 隐藏标签
        // let curDiv = API_GetShipInfoDivObj(shipPos);
        // if (curDiv) {
        //     curDiv.style.display = "none"; //x隐藏签
        //     API_SetShipInfoDivObj(shipPos, null, true); //解除div与船舶绑定
        // }
    }
}

function DrawCircleShip(obj) {
    if (!obj) {
        return false;
    }
    let layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
    const iObjPosObject = API_GetObjectPosById(obj.shipId) //根据物标的id获取物标的pos(只返回第一个符合条件的物标) 返回格式 {layerPos:2,iObjPos:0}
    let iObjPos=iObjPosObject?.iObjPos;
    if(layerPos>-1 && iObjPos>-1){
        API_DelObjectByPos(layerPos, iObjPos)//先删除之前的
    }
    let objInfo = [];
    objInfo.objId = obj.shipId; 			//物标的id(数字)
    objInfo.objType = 5; 		//物标类型(数字)：1=点、2=线、3=面、4=矩形、5=圆
    objInfo.name = obj.shipName; 		//物标名称(字符串)
    // objInfo.strShowText=; 	//海图上显示的内容（字符串）
    objInfo.bShow = true; 		//是否显示，true=显示，false=不显示
    objInfo.r = 3; 		//圆半径(km)
    objInfo.layerPos = layerPos;
    // objInfo.layerStylePos; //使用图层样式的索引pos（数字），只有使用图层样式，该值才有效
    // objInfo.bGetOwnStyle;  //是否启用自己样式（布尔），true=自己样式，false=图层样式
    // objInfo.rotationAngle = 0; //点物标的旋转角度

    //objInfo:物标对象结构体
    //arrGeoPoints:物标的坐标数组，元素格式例如{ x: 1210000000, y: 350000000}
    //arrExpAttrValue:扩展字段数组，没有可以传入null
    API_AddNewObject(objInfo, [{x: obj.shipGeoPoX, y: obj.shipGeoPoY}], null);
    //设置样式
    setCircleStyle(layerPos, iObjPos,obj,objInfo)
    //重绘
    API_ReDrawLayer();
}

function setCircleStyle(layerPos, iObjPos,shipInfo,objInfo) {
    const targetX = 121.514705 * 10000000;
    const targetY = 31.423437 * 10000000;
    let {shipGeoPoX,shipGeoPoY} = shipInfo;
    let dis = API_GetDistBetwTwoPoint(shipGeoPoX, shipGeoPoY, targetX, targetY);
    // console.log(dis,'dis')
    let objStyleInfo = [];
    objStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
    objStyleInfo.fillColor = '#000000';     //填充颜色(字符串)，例如"#000000"
    objStyleInfo.iOpacity = 50;      //填充透明度(数字)，0~100，100为不透明
    objStyleInfo.borderWith = 2;    //线粗细(数字)
    objStyleInfo.iLineOpacity = 50; //线的透明度(数字)，0~100，100为不透明
    objStyleInfo.borderColor = "#FF0000";   //线颜色(字符串)，例如"#000000"
    objStyleInfo.bShowText = false;     //是否显示信息(布尔)，true=显示，false=不显示
    objStyleInfo.textColor = "#00FF00";     //物标名称字体颜色(字符串)，例如"#000000"
    objStyleInfo.fontSize = "20px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
    objStyleInfo.iTextOpacity = 40;  //文本透明度(数字)，0~100，100为不透明
    objStyleInfo.lineType = 0;  //线类型：0=实线，1=虚线
    objStyleInfo.lineLen = 8;  //虚线时，线段长度
    objStyleInfo.dashLen = 4;  //虚线时，线段的间隔
    if(dis<=objInfo?.r){
        objStyleInfo.fillColor = '#FF0000';
        objStyleInfo.iOpacity = 20;
    }
    //设置样式
    API_SetFaceObjStyleByPos(layerPos, iObjPos, true, objStyleInfo);
}

export {
    shipClick
}