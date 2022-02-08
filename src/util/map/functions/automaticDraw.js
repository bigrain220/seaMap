// API_GetLonLatPoByScrnPo
//坐标转换:屏幕坐标转换经纬度坐标
//iScrnPoX:屏幕坐标（int） iScrnPoY:屏幕坐标(int)  scale:比例尺，假如是当前比例尺，可以传null
//返回值:经纬度坐标（度），格式例如：{x:121.02,y:31.2}

// API_GetLayerPosById(iLayerId)
// 根据图层的id获取图层的pos
//返回值：图层的pos,-1=没有该图层

// API_AddNewObject(objInfo, arrGeoPoints, arrExpAttrValue)
//添加一个物标
//objInfo:物标对象结构体
//arrGeoPoints:物标的坐标数组，元素格式例如{ x: 1210000000, y: 350000000}
//arrExpAttrValue:扩展字段数组，没有可以传入null
//返回物标的pos，-1=添加失败



//直接在海图上绘制线
function DrawLineTest(objType, curGeoPo) {
    //var objType = 2;//线物标
    //var objType = 3;//面物标
    var objName = "新物标";
    var arrObjPo = []; //坐标

    var curLonLatPo;
    curLonLatPo = API_GetLonLatPoByScrnPo(300, 200, null);
    var geoPo1 = { x: curLonLatPo.x * 10000000, y: curLonLatPo.y * 10000000 };

    arrObjPo.push(geoPo1);

    curLonLatPo = API_GetLonLatPoByScrnPo(500, 200, null);
    var geoPo2 = { x: curLonLatPo.x * 10000000, y: curLonLatPo.y * 10000000 };
    arrObjPo.push(geoPo2);

    curLonLatPo = API_GetLonLatPoByScrnPo(350, 300, null);
    var geoPo3 = { x: curLonLatPo.x * 10000000, y: curLonLatPo.y * 10000000 };
    arrObjPo.push(geoPo3);

    var layerStylePos = 0;
    var layerPos = -1;
    if (objType == 1) {
        //添加点
        arrObjPo = [];
        curLonLatPo = API_GetLonLatPoByScrnPo(400, 300, null);
        geoPo1 = { x: curLonLatPo.x * 10000000, y: curLonLatPo.y * 10000000 };


        if (curGeoPo != undefined && curGeoPo != null) {
            geoPo1 = curGeoPo;
        }
        arrObjPo.push(geoPo1);

        layerPos = API_GetLayerPosById(g_iPointLayerId); //获取点图层的pos
        layerStylePos = g_iPointStylePos;
    }
    else if (objType == 2) {//添加线
        layerPos = API_GetLayerPosById(g_iLineLayerId); //获取线图层的pos
        layerStylePos = g_iLineStylePos;
    }
    else if (objType == 3) {
        //添加面
        layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        layerStylePos = g_iFaceStylePos;
    }
    else if (objType == 10) {
        //添加扇区
        //扇区(即圆心)只需要一个坐标点
        arrObjPo = [];
        curLonLatPo = API_GetLonLatPoByScrnPo(450, 400, null);
        geoPo1 = { x: curLonLatPo.x * 10000000, y: curLonLatPo.y * 10000000 };
        arrObjPo.push(geoPo1);
        layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        layerStylePos = g_iFaceStylePos;
    }

    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.objType = objType;
        objInfo.layerPos = layerPos; //图层索引
        //objInfo.objId = "aaaaaaaaaaaaaa"; //物标id
        objInfo.objId = g_iAddObjId; //物标id
        objInfo.name = objName; //物标名称
        objInfo.showText = objName; //显示内容
        objInfo.layerStylePos = layerStylePos; //使用样式索引
        arrExpAttrValue.push("来一个扩展字段"); //扩展字段信息
        console.log(objInfo,arrObjPo,arrExpAttrValue)
        var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (objPos > -1) {
            bAddResult = true;
        }

        if (objType == 10)//设置扇区的信息
        {
            var lonLat1 = API_GetLonLatPoByScrnPo(0, 0, null);
            var lonLat2 = API_GetLonLatPoByScrnPo(100, 0, null);
            var lenKm = API_GetDistBetwTwoPoint(lonLat1.x * 10000000, lonLat1.y * 10000000, lonLat2.x * 10000000, lonLat2.y * 10000000);
            var iSmallCircleRM = lenKm;
            var iBigCircleRM = iSmallCircleRM * 2;
            API_SetSectorObjInfoByPos(layerPos, objPos, 0, 350, iSmallCircleRM, iBigCircleRM);

            var objCurStyleInfo = []; //使用个性样式

            objCurStyleInfo.bFilled = true;       //是否填充(布尔)，true=填充，false=不填充
            objCurStyleInfo.fillColor = "#FF0000";     //填充颜色(字符串)，例如"#000000"
            objCurStyleInfo.iOpacity = 80;      //填充透明度(数字)，0~100，100为不透明
            objCurStyleInfo.borderWith = 5;    //线粗细(数字)
            objCurStyleInfo.borderColor = "#000000";   //线颜色(字符串)，例如"#000000"
            objCurStyleInfo.textColor = "#ffffff";     //物标名称字体颜色(字符串)，例如"#000000"
            objCurStyleInfo.fontSize = "12px 宋体";      //物标名称字体(字符串)，格式例如"12px 宋体"
            objCurStyleInfo.bShowText = true;     //是否显示信息(布尔)，true=显示，false=不显示
            objCurStyleInfo.iTextOpacity = 80;  //文本透明度(数字)，0~100，100为不透明
            objCurStyleInfo.iLineOpacity = 100; //线的透明度(数字)，0~100，100为不透明

            API_SetFaceObjStyleByPos(layerPos, objPos, true, objCurStyleInfo);
        }
    }

    if (bAddResult == true) {

        API_ReDrawLayer();
        //alert("添加成功");

    }
    else {
        alert("添加失败");
    }
}

export {
    DrawLineTest
}