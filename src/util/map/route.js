import {ShowInfoDivBox} from "@/util/map/index";

let layerPos=-1;
let layerStylePos=-1;
let pointIdObj={};

//获取两条直接的交点
function getIntersection(arr = []) {
    // arr:[{k:"",b""},{k:"",b""}]
    if (arr.length === 0) {
        return false
    }
    let {k: k1, b: b1} = arr[0];
    let {k: k2, b: b2} = arr[1];
    let x, y;
    x = (b2 - b1) / (k1 - k2);
    y = x * k1 + b1;
    return {x, y}
}

function getLineFn(arr = []) {
    // arr:[{x:"",y:""},{x:"",y:""}]
    if (arr.length === 0) {
        return false
    }
    let {x: x1, y: y1} = arr[0];
    let {x: x2, y: y2} = arr[1];
    let k, b;
    k = (y1 - y2) / (x1 - x2);
    b = y1 - k * x1;
    return {k, b}
}

function getAsideLineData(pointData = [], dis) {
    // pointData:[{x:"",y:""},...,{x:"",y:""}]
    if (pointData.length < 2) {
        return [];
    }
    //换成海里
    dis=dis*0.54;
    let resArr = [];//处理交点前坐标点
    for (let i = 0; i < pointData.length; i++) {
        const item = pointData[i];

        if (i === 0) {//首点
            const angle = API_GetDegreesBetwTwoPoint(item.x, item.y, pointData[i + 1].x, pointData[i + 1].y) - 90;
            const point = API_GetDesPointOfCrsAndDist(item, dis, angle) //1 千米=0.539956803456 海里
            resArr.push(point)
        } else if (i === pointData.length - 1) {//末点
            const angle = API_GetDegreesBetwTwoPoint(pointData[i - 1].x, pointData[i - 1].y, item.x, item.y) - 90;
            const point = API_GetDesPointOfCrsAndDist(item, dis, angle)
            resArr.push(point)
        } else {//中间点
            const angle1 = API_GetDegreesBetwTwoPoint(pointData[i - 1].x, pointData[i - 1].y, item.x, item.y) - 90;
            const angle2 = API_GetDegreesBetwTwoPoint(item.x, item.y, pointData[i + 1].x, pointData[i + 1].y) - 90;
            const point1 = API_GetDesPointOfCrsAndDist(item, dis, angle1)
            const point2 = API_GetDesPointOfCrsAndDist(item, dis, angle2)
            resArr.push(point1);
            resArr.push(point2);
        }

    }
    // console.log(resArr,'resArr')
    let pointArr = [];//处理交点后坐标点
    for (let i = 0; i < resArr.length; i++) {
        const item = resArr[i];
        if (i > 0 && i < resArr.length - 1) {//中间点合并
            if (i % 2 === 1 && (i + 2) < resArr.length) {//奇数
                let line1 = getLineFn([{x: resArr[i - 1].x, y: resArr[i - 1].y}, {x: item.x, y: item.y}]);
                let line2 = getLineFn([{x: resArr[i + 1].x, y: resArr[i + 1].y}, {
                    x: resArr[i + 2].x,
                    y: resArr[i + 2].y
                }]);
                let point = getIntersection([line1, line2]);
                pointArr.push(point);
            }
        } else {
            pointArr.push(item)
        }
    }
    // console.log(pointArr,'pointArr');
    return pointArr;
}

// getAsideLineTest(arrObjPo,2); //测试原始平行线
function getAsideLineTest(pointData = [], dis) {
    if (!pointData.length > 0) {
        return false;
    }
    let [one, two, three, four] = pointData;
    let angle1 = API_GetDegreesBetwTwoPoint(one.x, one.y, two.x, two.y) - 90
    let angle2 = API_GetDegreesBetwTwoPoint(two.x, two.y, three.x, three.y) - 90
    let angle3 = API_GetDegreesBetwTwoPoint(three.x, three.y, four.x, four.y) - 90

    let a = API_GetDesPointOfCrsAndDist(one, dis, angle1);
    let a1 = API_GetDesPointOfCrsAndDist(one, -1 * dis, angle1);
    let b = API_GetDesPointOfCrsAndDist(two, dis, angle1);
    let b1 = API_GetDesPointOfCrsAndDist(two, -1 * dis, angle1);
    let c = API_GetDesPointOfCrsAndDist(two, dis, angle2);
    let c1 = API_GetDesPointOfCrsAndDist(two, -1 * dis, angle2);
    let d = API_GetDesPointOfCrsAndDist(three, dis, angle2);
    let d1 = API_GetDesPointOfCrsAndDist(three, -1 * dis, angle2);
    let e = API_GetDesPointOfCrsAndDist(three, dis, angle3);
    let e1 = API_GetDesPointOfCrsAndDist(three, -1 * dis, angle3);
    let f = API_GetDesPointOfCrsAndDist(four, dis, angle3);
    let f1 = API_GetDesPointOfCrsAndDist(four, -1 * dis, angle3);

    // test 渲染交叉点
    let test1 = getLineFn([c, d])
    let test2 = getLineFn([e, f])
    let test3 = getIntersection([test1, test2])
    let layerPosPoint = API_GetLayerPosById(g_iPointLayerId); //获取点图层的pos
    var layerStylePosPoint = g_iPointStylePos;
    var objInfoPoint = [];
    var arrExpAttrValue = []; //扩展字段，假如没有可以传入null
    objInfoPoint.objType = 1;
    objInfoPoint.layerPos = layerPosPoint; //图层索引
    objInfoPoint.objId = '88'; //物标id
    objInfoPoint.name = '物标名称'; //物标名称
    objInfoPoint.showText = '显示内容'; //显示内容
    objInfoPoint.layerStylePos = layerStylePosPoint; //使用样式索引
    API_AddNewObject(objInfoPoint, [test3], arrExpAttrValue);

    // console.log(res)
    let layerPos = API_GetLayerPosById(g_iLineLayerId); //获取点图层的pos

    if (layerPos > -1) {
        let lineStyle1 = [];
        lineStyle1.borderWith = 2; //线的粗细
        lineStyle1.borderColor = "red"; //线的颜色
        lineStyle1.iOpacity = 80; //透明度
        lineStyle1.bShowText = false; //是否显示名称
        lineStyle1.textColor = "#000000"; //名称颜色
        lineStyle1.fontSize = "12px"; //名称字体大小
        lineStyle1.iTextOpacity = 80; //透明度
        let layerStylePos1 = API_AddLineLayerStyleByPos(layerPos, lineStyle1);

        let lineStyle2 = [];
        lineStyle2.borderWith = 2; //线的粗细
        lineStyle2.borderColor = "green"; //线的颜色
        lineStyle2.iOpacity = 80; //透明度
        lineStyle2.bShowText = false; //是否显示名称
        lineStyle2.textColor = "#000000"; //名称颜色
        lineStyle2.fontSize = "12px"; //名称字体大小
        lineStyle2.iTextOpacity = 80; //透明度
        let layerStylePos2 = API_AddLineLayerStyleByPos(layerPos, lineStyle2);


        let objInfo1 = [];
        objInfo1.objType = 2;
        objInfo1.layerPos = layerPos; //图层索引
        objInfo1.objId = '1'; //物标id
        objInfo1.name = false; //物标名称
        objInfo1.showText = false; //显示内容
        objInfo1.layerStylePos = layerStylePos1; //使用样式索引

        let objInfo2 = [];
        objInfo2.objType = 2;
        objInfo2.layerPos = layerPos; //图层索引
        objInfo2.objId = '2'; //物标id
        objInfo2.name = false; //物标名称
        objInfo2.showText = false; //显示内容
        objInfo2.layerStylePos = layerStylePos2; //使用样式索引

        let objInfo3 = [];
        objInfo3.objType = 2;
        objInfo3.layerPos = layerPos; //图层索引
        objInfo3.objId = '3'; //物标id
        objInfo3.name = false; //物标名称
        objInfo3.showText = false; //显示内容
        objInfo3.layerStylePos = layerStylePos1; //使用样式索引

        let objInfo4 = [];
        objInfo4.objType = 2;
        objInfo4.layerPos = layerPos; //图层索引
        objInfo4.objId = '4'; //物标id
        objInfo4.name = false; //物标名称
        objInfo4.showText = false; //显示内容
        objInfo4.layerStylePos = layerStylePos2; //使用样式索引

        let objInfo5 = [];
        objInfo5.objType = 2;
        objInfo5.layerPos = layerPos; //图层索引
        objInfo5.objId = '5'; //物标id
        objInfo5.name = false; //物标名称
        objInfo5.showText = false; //显示内容
        objInfo5.layerStylePos = layerStylePos1; //使用样式索引

        let objInfo6 = [];
        objInfo6.objType = 2;
        objInfo6.layerPos = layerPos; //图层索引
        objInfo6.objId = '6'; //物标id
        objInfo6.name = false; //物标名称
        objInfo6.showText = false; //显示内容
        objInfo6.layerStylePos = layerStylePos2; //使用样式索引

        let objPos1 = API_AddNewObject(objInfo1, [a, b], null);
        let objPos2 = API_AddNewObject(objInfo2, [a1, b1], null);
        let objPos3 = API_AddNewObject(objInfo3, [c, d], null);
        let objPos4 = API_AddNewObject(objInfo4, [c1, d1], null);
        let objPos5 = API_AddNewObject(objInfo5, [e, f], null);
        let objPos6 = API_AddNewObject(objInfo6, [e1, f1], null);
        API_ReDrawLayer();
    }

}

//鼠标滑过点的显示功能
function handleViewPoint(layerId, objId, scrnPo,domId) {
    console.clear()
    // console.log(...arguments)
    const iLayerPos = API_GetLayerPosById(layerId);
    if (iLayerPos > -1) {
        let iMsgBoxHeight = 80;
        let iMsgBoxWidth = 160;
        let ObjPos = API_GetObjectPosById(objId, iLayerPos);
        let iObjPos = ObjPos?.iObjPos??-1;
        let curObjInfoObj = API_GetObjectInfoByPos(iLayerPos, iObjPos);
        console.log(curObjInfoObj,'curObjInfoObj')
        if (curObjInfoObj) {
            let strInnerHTML = "";
            let {name,minGeoX,minGeoY} = curObjInfoObj;
            let {deep,order} = curObjInfoObj.arrExpAttrValue[0];
            if (name === undefined || name === "") {
                return;
            }
            strInnerHTML=`${name}（${order+1}）<br/>吃水深度：${deep}<br/>经度：${minGeoX/10000000}<br/>纬度：${minGeoY/10000000}<br/>`

            let showPointInfoByMove = document.querySelector(`#${domId}`)
            showPointInfoByMove.innerHTML = strInnerHTML;
            showPointInfoByMove.style.height = iMsgBoxHeight + "px";
            showPointInfoByMove.style.width = iMsgBoxWidth + "px";

            ShowInfoDivBox(showPointInfoByMove, scrnPo);
        }
    }
}

//绘制最终航路
function getPathDraw(arrObjPo=[],id,{compositeLayerPos, compositeStylePos},pathName=""){
    layerPos=compositeLayerPos;
    layerStylePos=compositeStylePos;
    if(arrObjPo.length===0 && id!==999){return false;}
    //格式转换成{x:"",y:""}
    let arr = arrObjPo.map(item=>{
        return {x:item.lon,y:item.lat}
    })
    drawLine(arr,id,pathName);
    getPointDraw(arr,id,pathName);
}
function drawLine(arrObjPo,id) {
    if (layerPos > -1) {
        let objInfo = [];
        let arrExpAttrValue = []; //扩展字段，假如没有可以传入null
        objInfo.objType = 2;
        objInfo.layerPos = layerPos; //图层索引
        objInfo.objId = 'route-line-middle-'+id; //物标id
        objInfo.name = false; //物标名称
        objInfo.showText = false; //显示内容
        objInfo.layerStylePos = layerStylePos; //使用样式索引
        arrExpAttrValue.push("来一个扩展字段"); //扩展字段信息
        // console.log(objInfo,arrObjPo,arrExpAttrValue)
        API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        getAsideLineDraw(arrObjPo,id);//添加两条处理后的平行线
        API_ReDrawLayer();
    }
}
function getAsideLineDraw(arrObjPo,id) {
    //获取处理后的线数据进行渲染
    let leftLineData = getAsideLineData(arrObjPo, -0.5);
    let rightLineData = getAsideLineData(arrObjPo, 0.5);
    if (layerPos > -1) {
        let lineStyle1 = [];
        lineStyle1.borderWith = 2; //线的粗细
        lineStyle1.borderColor = "red"; //线的颜色
        lineStyle1.iOpacity = 60; //透明度
        lineStyle1.bShowText = false; //是否显示名称
        lineStyle1.textColor = "#000000"; //名称颜色
        lineStyle1.fontSize = "12px"; //名称字体大小
        lineStyle1.iTextOpacity = 80; //透明度
        lineStyle1.lineType = 0;//绘制实线、1=虚线
        let layerStylePos1 = API_AddCompositeLayerStyleByPos(layerPos, lineStyle1);

        let lineStyle2 = [];
        lineStyle2.borderWith = 2; //线的粗细
        lineStyle2.borderColor = "green"; //线的颜色
        lineStyle2.iOpacity = 60; //透明度
        lineStyle2.bShowText = false; //是否显示名称
        lineStyle2.textColor = "#000000"; //名称颜色
        lineStyle2.fontSize = "12px"; //名称字体大小
        lineStyle2.iTextOpacity = 80; //透明度
        let layerStylePos2 = API_AddCompositeLayerStyleByPos(layerPos, lineStyle2);

        let objInfo1 = [];
        objInfo1.objType = 2;
        objInfo1.layerPos = layerPos; //图层索引
        objInfo1.objId = 'route-line-left-'+id; //物标id
        objInfo1.name = false; //物标名称
        objInfo1.showText = false; //显示内容
        objInfo1.layerStylePos = layerStylePos1; //使用样式索引

        let objInfo2 = [];
        objInfo2.objType = 2;
        objInfo2.layerPos = layerPos; //图层索引
        objInfo2.objId = 'route-line-right-'+id; //物标id
        objInfo2.name = false; //物标名称
        objInfo2.showText = false; //显示内容
        objInfo2.layerStylePos = layerStylePos2; //使用样式索引

        API_AddNewObject(objInfo1, leftLineData, null);
        API_AddNewObject(objInfo2, rightLineData, null);
        API_ReDrawLayer();
    }
}

function getPointDraw(arrObjPo,id,pathName) {
    // 删除功能实现：
    // 1.把所有生成的点的id放入pointIdObj
    // 2.把当前更新后的点的id放入临时数组arr
    // 3.如果之前存在pointIdObj存在arr中的id,即为更新,如不存在,则删除该点
    // let pointIdObj={};
    let arr = [];
    arrObjPo.map((item, index) => {
        let objInfoPoint = [];
        let arrExpAttrValue = [{deep:item.deep??0,order:index}]; //扩展字段，假如没有可以传入null
        objInfoPoint.objType = 1;
        objInfoPoint.layerPos = layerPos; //图层索引
        objInfoPoint.objId = 'routePoint-'+id+'-'+ index; //物标id //routePoint在鼠标滑过事件有使用
        objInfoPoint.name = pathName; //物标名称
        objInfoPoint.showText = index; //显示内容
        objInfoPoint.layerStylePos = layerStylePos; //使用样式索引
        API_AddNewObject(objInfoPoint, [item], arrExpAttrValue);
        arr.push(objInfoPoint.objId);
        pointIdObj[objInfoPoint.objId]=1;
    })
    // console.log(id,pointIdObj,arr)
    // Object.keys(pointIdObj).forEach(item => {
    //     if (!arr.includes(item)) {
    //         const tem = API_GetObjectPosById(item, layerPos);
    //         if (tem?.iLayerPos > -1 && tem?.iObjPos > -1) {
    //             API_DelObjectByPos(tem.iLayerPos, tem.iObjPos);
    //         }
    //     }
    // })
    let keysArr = Object.keys(pointIdObj).filter(item=>item.split('-')[1]===id.toString());
    keysArr.forEach(item => {
        if (!arr.includes(item)) {
            const tem = API_GetObjectPosById(item, layerPos);
            if (tem?.iLayerPos > -1 && tem?.iObjPos > -1) {
                API_DelObjectByPos(tem.iLayerPos, tem.iObjPos);
                // delete pointIdObj[item];
            }
        }
    })

    API_ReDrawLayer();
}

export {
    getAsideLineData,
    getAsideLineTest,
    handleViewPoint,
    getPathDraw
}