//航迹线图层和航点图层
function routeLayer() {
    //航线
    let lineLayerPos = -1;
    let lineStylePos = -1;
    let lineLayerInfo = [];
    lineLayerInfo.id = 'route-layer';
    lineLayerInfo.type = 2; //类型：1=点图层，2=线图层，3=面图层
    lineLayerInfo.name = "航线线图层"; //图层名称
    lineLayerInfo.bShow = true; //显示
    lineLayerPos = API_AddNewLayer(lineLayerInfo, null); //添加图层，得到图层的pos
    if (lineLayerPos > -1) {
        let lineStyle = [];
        lineStyle.borderWith = 1; //线的粗细
        lineStyle.borderColor = "#0000FF"; //线的颜色
        lineStyle.iOpacity = 80; //透明度
        lineStyle.bShowText = true; //是否显示名称
        lineStyle.textColor = "#000000"; //名称颜色
        lineStyle.fontSize = "12px"; //名称字体大小
        lineStyle.iTextOpacity = 80; //透明度

        lineStylePos = API_AddLineLayerStyleByPos(lineLayerPos, lineStyle);
        API_SetLayerTextBackGroundColorByPos(lineLayerPos, true, "#00FF00", 50); //设置文字背景颜色
    }
    //航点
    let pointLayerPos = -1;
    let pointStylePos = -1;

    let pointLayerInfo = [];
    pointLayerInfo.id = 'route-point';
    pointLayerInfo.type = 1;//类型：1=点图层，2=线图层，3=面图层
    pointLayerInfo.name = "点图层";//图层名称
    pointLayerInfo.bShow = true; //显示

    pointLayerInfo.minShowScale = 1;//最大比例尺
    pointLayerInfo.maxShowScale = 2000000000;//最小比例尺
    pointLayerInfo.bShowTextOrNot = true;//是否显示名称
    pointLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺

    pointLayerPos = API_AddNewLayer(pointLayerInfo, null); //添加图层，得到图层的pos
    if (pointLayerPos > -1) {
        let pointStyle = [];
        pointStyle.bShowImg = false;//是否用图片显示
        pointStyle.bShowText = false;//是否显示信息(布尔)
        pointStyle.iCircleScrnR = 1;//使用圆表示时候，圆的半径
        pointStyle.arrSymbolPo = null;//矢量符号坐标
        pointStyle.textColor = "#FF0000"; //名称颜色
        pointStyle.fontSize = "12px"; //名称字体大小
        pointStyle.iOpacity = 100;
        pointStyle.iTextOpacity = 100; //透明度
        pointStyle.borderWith = 1;
        pointStyle.borderColor = "#0000FF";
        pointStyle.bFilled = true; //是否填充颜色
        pointStyle.fillColor = "#fff"; //填充的颜色
        pointStylePos = API_AddPointLayerStyleByPos(pointLayerPos, pointStyle);
        API_SetLayerTextBackGroundColorByPos(pointLayerPos, true, "#FF0000", 50);//设置文字背景颜色
    }
    return {
        lineLayerPos,
        lineStylePos,
        pointLayerPos,
        pointStylePos
    }
}

//航迹线综合图层
function routeCompositeLayer() {

    let compositeLayerPos = -1;
    let compositeStylePos = -1;

    let compositeLayerInfo = [];
    compositeLayerInfo.id = 'route-composite';
    compositeLayerInfo.type = 100; //类型：1=点图层，2=线图层，3=面图层 composite = 100 = 综合图层
    compositeLayerInfo.name = "综合图层"; //图层名称
    compositeLayerInfo.bShow = true; //显示
    // compositeLayerInfo.minShowScale = 1;//最小比例尺
    // compositeLayerInfo.maxShowScale = 2000000000;//最大比例尺
    compositeLayerInfo.minShowScale = 20000;//最小比例尺
    compositeLayerInfo.maxShowScale = 950000;//最大比例尺
    compositeLayerInfo.bShowTextOrNot = true;//是否显示名称
    compositeLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺
    compositeLayerPos = API_AddNewLayer(compositeLayerInfo, null); //添加图层，得到图层的pos

    if (compositeLayerPos > -1) {
        let compositeStyle = [];
        compositeStyle.borderWith = 2; //线的粗细
        compositeStyle.borderColor = "#666"; //线的颜色
        compositeStyle.bFilled = true; //是否填充颜色
        compositeStyle.fillColor = "#FFFFFF"; //填充的颜色
        compositeStyle.iOpacity = 80; //透明度
        compositeStyle.bShowImg = true;//是否用图片显示--点物标
        // compositeStyle.strImgSrc = '/static/YimaEncSDK/img/port.png'; //图片地址
        // compositeStyle.iImgWidth = 50; //图片的宽度
        // compositeStyle.iImgHeight = 50; //图片的高度
        compositeStyle.bShowText = false; //是否显示名称
        compositeStyle.textColor = "#000000"; //名称颜色
        compositeStyle.fontSize = "12px"; //名称字体大小
        compositeStyle.iTextOpacity = 60; //透明度
        // compositeStyle.iCheckDrawMinNearOtherLen = null; //过滤绘制点物标的判距(防止点物标绘制过密)
        compositeStyle.iLineOpacity = 50;
        // compositeStyle.offsetScrnPo = {x: -10, y: 15};//屏幕偏移量，格式{x:100,y:100},像素单位
        // compositeStyle.bDrawPointCircle = null;//是否绘制小圆点
        compositeStyle.lineType = 1;//绘制实线、1=虚线
        compositeStyle.lineLen = 6;//虚线长度
        compositeStyle.dashLen = 4;//虚线空长度

        compositeStylePos = API_AddCompositeLayerStyleByPos(compositeLayerPos, compositeStyle);
        API_SetLayerTextBackGroundColorByPos(compositeLayerPos, true, "#0000FF", 50); //设置文字背景颜色
    }
    return {
        compositeLayerPos,
        compositeStylePos
    }
}

//避碰圈面图层
function meetFaceLayer(){
    let faceLayerPos = -1;
    let faceStylePos = -1;

    let faceLayerInfo = [];
    faceLayerInfo.id = 'meet-face';
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层 composite = 100 = 综合图层
    faceLayerInfo.name = "面图层"; //图层名称
    faceLayerInfo.bShow = true; //显示
    // compositeLayerInfo.minShowScale = 1;//最小比例尺
    // compositeLayerInfo.maxShowScale = 2000000000;//最大比例尺
    faceLayerInfo.minShowScale = 2000;//最小比例尺
    faceLayerInfo.maxShowScale = 230000;//最大比例尺
    faceLayerInfo.bShowTextOrNot = false;//是否显示名称
    faceLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺
    faceLayerPos = API_AddNewLayer(faceLayerInfo, null); //添加图层，得到图层的pos
    if(faceLayerPos>-1){
        let faceStyle = [];
        faceStyle.borderWith = 2; //线的粗细
        faceStyle.borderColor = "#666"; //线的颜色
        faceStyle.bFilled = true; //是否填充颜色
        faceStyle.fillColor = "#eee"; //填充的颜色
        faceStyle.iOpacity = 80; //透明度
        faceStyle.bShowImg = true;//是否用图片显示--点物标
        faceStyle.bShowText = false; //是否显示名称
        faceStyle.textColor = "#000000"; //名称颜色
        faceStyle.fontSize = "12px"; //名称字体大小
        faceStyle.iTextOpacity = 20; //透明度
        // compositeStyle.iCheckDrawMinNearOtherLen = null; //过滤绘制点物标的判距(防止点物标绘制过密)
        faceStyle.iLineOpacity = 50;
        // compositeStyle.offsetScrnPo = {x: -10, y: 15};//屏幕偏移量，格式{x:100,y:100},像素单位
        // compositeStyle.bDrawPointCircle = null;//是否绘制小圆点
        faceStyle.lineType = 1;//绘制实线、1=虚线
        faceStyle.lineLen = 6;//虚线长度
        faceStyle.dashLen = 4;//虚线空长度
        faceStylePos = API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle);
    }
    return {
        faceLayerPos,
        faceStylePos
    }
}


export {
    routeLayer,
    routeCompositeLayer,
    meetFaceLayer
}