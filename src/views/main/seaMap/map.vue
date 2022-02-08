<template>
  <div>
    <div class="map-page">
      <div id="map" style="
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        z-index: 1;
      " oncontextmenu="return false;"></div>

      <div class="map-search" style="top: 10px;left: 20px;">
        <Search @searchEvent="searchEvent"></Search>
      </div>
      <!-- 其它元素-->
      <div id="ShowSimpleInfoByMouseMoveDiv" class="ShowMouseMoveInfoStyle"></div>
      <div id="ShowDrawObjInfoByMouseMoveDiv" class="ShowMouseMoveInfoStyle"></div>
      <!-- 船舶标签-->
      <!--      <div id="ShipObjInfoDiv0" class="ShowMouseMoveInfoStyle">-->
      <!--      </div>-->
      <nav-menu @navEvent="navEvent"></nav-menu>
      <!-- 航路点-->
      <div id="ShowPointInfoByMove" class="ShowMouseMoveInfoStyle"></div>
    </div>
    <div class="map-info common-card">
      <drag-card :visible="visible.info" :dragAll="false" :autoCenter="false" title="船舶信息" width="430px"
                 :leftInit="dragConfig.leftInit" :zIndex.sync="zIndex"
                 :topInit="dragConfig.topInit" @drag-close="infoCloseClick">
        <table id="tableShipInfo" style=" width:100%">
          <tr>
            <th>船名:</th>
            <td>{{ currentShipInfo.shipName || '-' }}</td>
            <th>MMSI:</th>
            <td>{{ currentShipInfo.shipMMSI || '-' }}</td>
          </tr>
          <tr>
            <th>经度:</th>
            <td>{{ getLonLatStr(currentShipInfo.shipGeoPoX, true) || '-' }}</td>
            <th>纬度:</th>
            <td>{{ getLonLatStr(currentShipInfo.shipGeoPoY, false) || '-' }}</td>
          </tr>
          <tr>
            <th>航速:</th>
            <td>{{ currentShipInfo.shipSpeed || '-' }}<span v-if="currentShipInfo.shipSpeed">节</span></td>
            <th>航向:</th>
            <td>{{ currentShipInfo.shipCourse || '-' }}<span v-if="currentShipInfo.shipCourse">度</span></td>
          </tr>
          <tr>
            <th>船长:</th>
            <td>{{ currentShipInfo.shipLength || '-' }}<span v-if="currentShipInfo.shipLength">米</span></td>
            <th>船宽:</th>
            <td>{{ currentShipInfo.shipWidth || '-' }}<span v-if="currentShipInfo.shipWidth">米</span></td>
          </tr>
          <tr>
            <th>状态:</th>
            <td v-text="dic.status[currentShipInfo.iShipState] || '其它'"></td>
            <th>类型:</th>
            <td v-text="getShipType(currentShipInfo.arrExpAttrValue.shipType)"></td>
          </tr>
          <tr>
            <th>时间:</th>
            <td>{{ currentShipInfo.shipTime || '-' }}</td>
          </tr>
        </table>
        <div class="btn-group">
          <div class="btn" @click="setAttention(currentShipInfo)">
            {{ isAttention ? '取消关注' : '关注' }}
          </div>
          <div class="btn" @click="visible.trackTime=true;">轨迹查询</div>
          <div class="btn" @click="setLocation">船舶定位</div>
          <div class="btn" @click="setShipFollow(currentShipInfo)">
            {{ currentShipInfo.arrExpAttrValue.isShipFollow ? '取消跟踪' : '跟踪船舶' }}
          </div>
          <div class="btn" @click="setCircle(currentShipInfo)">会遇</div>
        </div>
        <transition name="slide-fade">
          <div v-if="visible.trackTime" class="track-time-box">
            <div class="title">轨迹查询</div>
            <el-date-picker
                size="mini"
                v-model="trackTimeArr"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <div class="btn-box">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="trackSearchClick">搜索</el-button>
              <el-button size="mini" @click="trackSearchCancelClick">取消</el-button>
            </div>
          </div>
        </transition>
      </drag-card>
    </div>
    <div class="nav-card common-card">
      <drag-card :visible="visible.menuItem" :dragAll="false" :autoCenter="false" :width="navConfig.width"
                 :title="navConfig.title"
                 rightInit="10px"
                 topInit="84px" @drag-close="cardCloseClick"
                 :zIndex.sync="zIndex">
        <div>
          <Attention ref="attention" v-if="navConfig.menuType==='attention'" @attentionEvent="searchEvent"
                     :attentionData="attentionData"></Attention>
          <keep-alive>
            <ship-filter v-if="navConfig.menuType==='shipFilter'" :statusDic="dic.status" :typeDic="dic.types" ref="shipFilter"></ship-filter>
          </keep-alive>
           <Meet ref="meet" v-if="navConfig.menuType==='meet'" :meetData="currentShipInfo"></Meet>
          <shipPath ref="path" v-if="navConfig.menuType==='path'" :pathData="pathData"
                    @pathEvent="pathEvent"></shipPath>
        </div>
      </drag-card>
    </div>
<!--    <div class="nav-card common-card">-->
<!--      <drag-card :visible="visible.meet" :dragAll="false" :autoCenter="false" width="470px"-->
<!--                 title="会遇列表"-->
<!--                 rightInit="10px"-->
<!--                 topInit="84px" @drag-close="visible.meet=false;"-->
<!--                 :zIndex.sync="zIndex">-->
<!--        <Meet ref="meet" :meetData="currentShipInfo"></Meet>-->
<!--      </drag-card>-->
<!--    </div>-->
  </div>
</template>
<script>
let timer = null;
import {freeDateFormat} from "@/util/common";
import {init} from "@/util/map/functions/init"
import {ShowObjDetailInfo} from "@/util/map/demo"
import {handleViewPoint} from "@/util/map/route"
import {showDomOrNot, toObject} from "@/util/map/index.js"
import {delAttentionApi, getAllShipApi, getAttentionApi, setAttentionApi, getTrackApi} from "@/api/seamap"
import {getPathDraw} from "@/util/map/route"
import {getPathApi} from "@/api/seamap";
import {AddShipHistoryTracks, ShowShipSimpleInfo} from "@/util/map/map"
import Search from "@/views/main/seaMap/search"
import {mapState} from 'vuex'

export default {
  components: {
    Search,//为了获取height没有按需加载
    dragCard: () => import("@/views/main/shipall/dragCard"),
    navMenu: () => import("@/views/main/seaMap/navMenu"),
    Attention: () => import("@/views/main/seaMap/menu/attention"),
    shipFilter: () => import("@/views/main/seaMap/menu/shipFilter"),
    Meet: () => import("@/views/main/seaMap/menu/meet"),
    shipPath: () => import("@/views/main/seaMap/menu/path")
  },
  data() {
    return {
      visible: {
        info: false,
        menuItem: false,
        trackTime: false,
        meet:false
      },
      dragConfig: {
        topInit: "",
        leftInit: "20px"
      },
      navConfig: {
        menuType: "",
        title: "",
        width: "370px"
      },
      currentShipInfo: {
        arrExpAttrValue: {}
      },
      zIndex: 11,//dragCard‘s zIndex,
      shipArrData:[],
      attentionData: [],
      pathData: [],
      trackTimeArr: [new Date(new Date().toLocaleDateString()).getTime() - 60 * 60 * 24 * 7 * 1000, Date.now()],
      dic:{
        status:[
          "在航(主机推动)",
          "锚泊",
          "失控",
          "操作受限",
          "吃水受限",
          "靠泊",
          "搁浅",
          "捕捞作业",
          "靠船帆提供动力"
        ],
        types:['引航船', '搜救船', '拖轮', '港口供应船', '装有防污装置和设备的船舶', '执法艇', '备用-用于当地船舶的任务分配', '备用-用于当地船舶的任务分配', '医疗船',
          '符合18号决议(Mob-83)的船舶', '捕捞', '拖引', '拖引并且船长>200m或船宽>25m', '疏浚或水下作业', '潜水作业', '参与军事行动', '帆船航行', '娱乐船', '地效应船',
          '高速船', '客船', '货船', '油轮', '其他类型的船舶', '集装箱船', '其他'],
        // map2: new Map(Object.entries( {
        //   0: {
        //     label: "在航(主机推动)",
        //     text: "在航(主机推动)",
        //   }
        // }))
        status1:[
          {
            label:"UnderwayUsingEngine ",
            value:0,
            text:'正在使用引擎'
          },
          {
            label:"AtAnchor",
            value:1,
            text:'在锚点'
          },
          {
            label:"NotUnderCommand ",
            value:2,
            text:'不受指挥'
          },
          {
            label:"RestrictedManoeuverability",
            value:3,
            text:'机动性受限'
          },
          {
            label:"ConstrainedByHerDraught",
            value:4,
            text:'启动受限'
          },
          {
            label:"Moored",
            value:5,
            text:'停泊'
          },
          {
            label:"Aground",
            value:6,
            text:'搁浅'
          },
          {
            label:"EngagedInFising",
            value:7,
            text:'从事钓鱼'
          },
          {
            label:"UnderwaySailing",
            value:8,
            text:'正在航行'
          },
          {
            label:"ReservedForFutureUse9",
            value:9,
            text:'留作将来使用9'
          },
          {
            label:"ReservedForFutureUse10",
            value:10,
            text:'留作将来使用10'
          },
          {
            label:"PowerDrivenVesselTowingAstern",
            value:11,
            text:'动力驱动船尾拖'
          },
          {
            label:"PowerDrivenVesselPushingAheadOrTowingAlongside",
            value:12,
            text:'动力驱动推进或拖曳'
          },
          {
            label:"ReservedForFutureUse13",
            value:13,
            text:'留作将来使用'
          },
          {
            label:"SartMobOrEpirb",
            value:14,
            text:'SartMobOrEpirb'
          },
          {
            label:"其它",
            value:15,
            text:'其它'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      compositeLayerPos: state => state.map.compositeLayerPos,
      compositeStylePos: state => state.map.compositeStylePos,
      types: state => state.map.types,
      faceLayerPos: state => state.map.faceLayerPos,
    }),
    isAttention() {
      return !!this.attentionData.find(x => x.mmsi === this.currentShipInfo.shipMMSI);
    },
  },
  methods: {
    navEvent(obj) {
      this.visible.menuItem = true;
      this.navConfig.menuType = obj.key;
      this.navConfig.title = obj.name;
      const widthConfig = {
        path: "420px",
      }
      this.navConfig.width = widthConfig[obj.key] ?? '370px';
    },
    getLonLatStr(val, isX) {
      return API_LonLatToString(val / 10000000, isX);
    },
    searchEvent(res) {
      const shipPos = API_GetShipPosById(res.shipId);
      let curShipInfo = API_GetShipInfoByPos(shipPos);
      this.currentShipInfo = Object.assign({}, curShipInfo);
      this.visible.info = true;
      console.log(this.currentShipInfo);
      // 添加标签
      // const shipPos = API_GetShipPosById(res.shipId);//一般情况下，所有对对象进行操作的接口都是通过索引Pos来实现的，所以在使用操作接口前，就根据id通过接口来获取索引pos后。
      // let objDiv = document.createElement('div');
      // objDiv.setAttribute('id', "test-div")
      // objDiv.setAttribute('class', 'ShowMouseMoveInfoStyle')
      // objDiv.style.display = "block";//显示标签
      // objDiv.innerHTML = res.shipName;//设置标签的信息
      // document.querySelector('.map-page').appendChild(objDiv);
      // API_SetShipInfoDivObj(shipPos, objDiv, true); //绑定div标签跟着船舶移动
      // API_ReDrawShips(); //重绘船舶
      // {
      //   bFollow: false
      //   bOnlineOrNot: true
      //   bShowTrack: true
      //   colorCode: 0
      //   iShipState: 2
      //   shipCourse: 270
      //   shipGeoPoX: 1214181521
      //   shipGeoPoY: 312033470
      //   shipId: 50
      //   shipLength: 272
      //   shipMMSI: 13473
      //   shipName: "文艺复兴号"
      //   shipSpeed: 200
      //   shipTime: "2021-10-28 09:30:01"
      //   shipWidth: 10
      // }
    },
    resetInfoBox() {
      const headerHeight = document.querySelector('.map-main-home .home-head')?.clientHeight;
      const searchDom = document.querySelector('.map-main-home .map-search');
      this.dragConfig.topInit = headerHeight + searchDom.clientHeight + Number(searchDom?.style.top.replace(/[^\d.]/g, "")) + 4 + 'px';
    },
    infoCloseClick() {
      this.visible.info = false;
      this.trackSearchCancelClick();
    },
    cardCloseClick(){
      this.visible.menuItem=false;
      if(this.navConfig.menuType==='meet'){
        let layerPos = this.faceLayerPos; //获取图层的pos
        const iObjPosObject = API_GetObjectPosById('ship-circle') //根据物标的id获取物标的pos(只返回第一个符合条件的物标) 返回格式 {layerPos:2,iObjPos:0}
        let iObjPos=iObjPosObject?.iObjPos;
        if(layerPos>-1 && iObjPos>-1){
          API_DelObjectByPos(layerPos, iObjPos);
          API_ReDrawLayer();
        }
      }
      this.navConfig.menuType='';

    },
    //关注操作
    setAttention(obj) {
      let {shipMMSI} = obj;
      // this.$refs.attention?.getAttention();
      if (this.isAttention) {
        delAttentionApi({userId: "1", mmsi: shipMMSI}).then(res => {
          this.getAttention();
          this.$message.success('取消关注成功!');
        })
      } else {
        console.log(shipMMSI, 'shipMMSI')
        setAttentionApi({mmsi: shipMMSI, customName: "aaa"}).then(() => {
          this.getAttention();
          this.$message.success('关注成功!');
        });
      }
    },
    //船舶定位
    setLocation() {
      let {shipId} = this.currentShipInfo;
      const iShipPos = API_GetShipPosById(shipId);
      API_SetShipToMapViewCenterByPos(iShipPos);
    },
    // 跟踪船舶
    setShipFollow(obj) {
      obj.arrExpAttrValue.isShipFollow = !obj.arrExpAttrValue.isShipFollow;
      API_AddOneShip(obj);
      let {shipId} = obj;
      let iShipPos = obj.arrExpAttrValue.isShipFollow ? API_GetShipPosById(shipId) : -1;
      // if (bSelPlayTrackShip == true) {
      //   var iShipPos = -1;
      //   if (iFollowShipId > -1) {
      //     iShipPos = API_GetPlayShipPosById(iFollowShipId);
      //   }
      //   API_FollowPlayShipByPos(iFollowShipId);
      // } else {
      API_SetMapLevel(12, null);
      API_FollowShipByPos(iShipPos);
      // }
    },
    // 显示轨迹
    trackSearchClick() {
      let params = {
        mmsi: this.currentShipInfo.shipMMSI,
        startTime: parseInt(this.trackTimeArr[0]),
        endTime: parseInt(this.trackTimeArr[1])
      }
      // let params = {
      //   mmsi: 256940000,
      //   startTime: 1640159979000,
      //   endTime: 1640270399000
      // }
      getTrackApi(params).then(res => {
        AddShipHistoryTracks(this.currentShipInfo, res);
        // setInterval(()=>{
        //   res.map(item=>{
        //     item.lat+=10000;
        //     item.lon+=10000;
        //   })
        //   AddShipHistoryTracks(this.currentShipInfo, res);
        // },5000)
      })
    },
    // 隐藏轨迹
    trackSearchCancelClick() {
      this.visible.trackTime = false;
      //退出轨迹回放的时候，务必要调用这个接口来清除数据
      API_ClearPlayHistoryTrackInfo();
    },
    //会遇列表展示
    setCircle(obj) {
      this.navEvent({name: "会遇列表", key: "meet", icon: "", openType: "card"});
      // this.visible.meet=true;
    },
    //鼠标左击时查询到的对象信息
    ReturnSelectObjByMouseLeftDown(objInfo) {
      console.log(objInfo, 222);
      if (objInfo == null) {
        return;
      }
      if (objInfo) {
        switch (objInfo.objType) {
          case 1: //选中了船舶，得到船舶的id,pos
            if (objInfo.bClusterers == true)//聚合
            {
              if (objInfo.data.type == 0)//聚合
              {
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.id);
                var shipIdInfo = API_GetClustererShipIdInfoById(objInfo.data.id);
                //console.log(shipIdInfo);
              } else//单艘船只
              {
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.shipId);

                var strShowText = "";
                var clustererOption = API_GetClustererShowOption();
                if (clustererOption.bClientcalculate == true)//本地计算聚合
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
                } else {
                  shipInfoObj = API_GetClustererInfoById(objInfo.data.shipId);//服务器计算聚合
                  var strShowText = "名称:" + shipInfoObj.shipName;
                  strShowText += "\n"; //换行
                  strShowText += "经度:" + shipInfoObj.lon;
                  strShowText += "\n"; //换行
                  strShowText += "纬度:" + shipInfoObj.lat;
                }

                API_SetClustererShowBoxInfoTextById(objInfo.data.shipId, strShowText);
                API_ReDrawShips();//重绘

              }
            } else {
              var iShipId = objInfo.id;
              var scrnPo = objInfo.po;
              var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;
              ShowShipDetailInfo(iShipId, bSelPlayTrackShip, scrnPo); //显示船舶的详细信息
              var iShipPos = API_GetShipPosById(iShipId);//当前船舶
              API_SetSelectShipTrackByPos(iShipPos, objInfo.iTrackPos);
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
                API_SetShipShowBoxInfoTextByShipPos(iShipPos, strShowText);
                API_ReDrawShips();//重绘
              }
            }
            break;
          case 2: //选中了物标，得到物标所属的图层id以及物标id
            var layerId = objInfo.layerId; //图层的id
            var objId = objInfo.objId; //物标的id
            ShowObjDetailInfo(layerId, objId, scrnPo);//显示物标的详细信息
            break;
          case 3:
            break;
          case 5: //选中了船舶，得到船舶的id,pos
            //聚合
            if (objInfo.bClusterers == true) {
              //聚合
              if (objInfo.data.type == 0) {
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.id);
                const shipIdInfo = API_GetClustererShipIdInfoById(objInfo.data.id);
                //console.log(shipIdInfo);
              } else { //单艘船只
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.shipId);

                let strShowText = "";
                let clustererOption = API_GetClustererShowOption();
                // console.log(clustererOption,'clustererOption')
                //本地计算聚合
                if (clustererOption.bClientcalculate == true) {
                  //显示船舶信息标签（本地计算聚合情况下可以这样获取船舶信息）
                  let iShipPos = API_GetShipPosById(objInfo.data.shipId);
                  let shipInfoObj = API_GetShipInfoByPos(iShipPos);
                  strShowText = "名称:" + shipInfoObj.shipName;
                  strShowText += "\n"; //换行
                  strShowText += "MMSI:" + shipInfoObj.shipMMSI;
                  strShowText += "\n"; //换行
                  strShowText += "经度:" + shipInfoObj.shipGeoPoX;
                  strShowText += "\n"; //换行
                  strShowText += "纬度:" + shipInfoObj.shipGeoPoY;
                } else { //服务器计算聚合
                  strShowText = "";
                  let shipInfoObj = API_GetClustererInfoById(objInfo.data.shipId);
                  strShowText = "名称:" + shipInfoObj.shipName;
                  strShowText += "\n"; //换行
                  strShowText += "经度:" + shipInfoObj.lon;
                  strShowText += "\n"; //换行
                  strShowText += "纬度:" + shipInfoObj.lat;
                }
                //自定义渲染
                // API_SetClustererShowBoxInfoTextById(objInfo.data.shipId, strShowText);
                // API_ReDrawShips();//重绘
                let id = objInfo.data.shipId;
                let iShipPos = API_GetShipPosById(id);
                let shipInfoObj = API_GetShipInfoByPos(iShipPos);
                API_SetSelectShipByPos(iShipPos);
                if (shipInfoObj) {
                  this.currentShipInfo = toObject(shipInfoObj);
                  this.visible.info = true;
                  //API_SetShipShowBoxInfoTextByShipPos(iShipPos, strShowText);
                  // API_SetShowShipInfo(true, 1, false, true);
                  // API_SetShowShipInfo(true, 1, true, true);
                  API_ReDrawShips();//重绘
                }

              }
            } else {  //objInfo.bClusterers !== true的时候
              let {id} = objInfo;
              let iShipPos = API_GetShipPosById(id);
              let shipInfoObj = API_GetShipInfoByPos(iShipPos);
              API_SetSelectShipByPos(iShipPos);
              if (shipInfoObj) {
                this.currentShipInfo = toObject(shipInfoObj);
                this.visible.info = true;
                //API_SetShipShowBoxInfoTextByShipPos(iShipPos, strShowText);
                // API_SetShowShipInfo(true, 1, false, true);
                // API_SetShowShipInfo(true, 1, true, true);
                API_ReDrawShips();//重绘
              }
            }
            break;
          case 6: //选中了船舶，得到船舶的id,pos
            if (objInfo.bClusterers == true)//聚合
            {
              if (objInfo.data.type == 0)//聚合
              {
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.id);
                var shipIdInfo = API_GetClustererShipIdInfoById(objInfo.data.id);
                //console.log(shipIdInfo);
              } else//单艘船只
              {
                API_SetSelectMarkerClustererById(objInfo.data.type, objInfo.data.shipId);

                var strShowText = "";
                var clustererOption = API_GetClustererShowOption();
                if (clustererOption.bClientcalculate == true)//本地计算聚合
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
                } else {
                  shipInfoObj = API_GetClustererInfoById(objInfo.data.shipId);//服务器计算聚合
                  var strShowText = "名称:" + shipInfoObj.shipName;
                  strShowText += "\n"; //换行
                  strShowText += "经度:" + shipInfoObj.lon;
                  strShowText += "\n"; //换行
                  strShowText += "纬度:" + shipInfoObj.lat;
                }

                API_SetClustererShowBoxInfoTextById(objInfo.data.shipId, strShowText);
                API_ReDrawShips();//重绘

              }
            } else {
              var iShipId = objInfo.id;
              var scrnPo = objInfo.po;
              var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;
              ShowShipDetailInfo(iShipId, bSelPlayTrackShip, scrnPo); //显示船舶的详细信息
              //console.log(objInfo);
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
                API_SetShipShowBoxInfoTextByShipPos(iShipPos, strShowText);
                API_ReDrawShips();//重绘
              }
            }
            break;
        }
      } else {
        if (g_showSimpleInfoDiv) {
          g_showSimpleInfoDiv.style.display = "none";
        }
      }
    },
    //鼠标移动时查询到的对象信息
    ReturnSelectObjByMouseMove(objInfo) {
      if (objInfo) {
        // console.log(objInfo, 'move')
        let scrnPo = objInfo.po;
        switch (objInfo.objType) {
          case 1: //选中了船舶，得到船舶的id,pos
            if (objInfo.bClusterers == true) {
              console.log(objInfo.data);//聚合信息
            } else {
              var iShipId = objInfo.id;
              var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;//是否选中了轨迹回放的船舶
              var iTrackPos = objInfo.iTrackPos; //假如是轨迹回放，则是选中轨迹点pos
              ShowShipSimpleInfo(iShipId, bSelPlayTrackShip, iTrackPos, scrnPo);
            }
            break;
          case 2: //选中了物标，得到物标所属的图层ID:layerId以及物标ID:objId
            let {layerId, objId} = objInfo;
            if (objId !== -1 && objId.indexOf('routePoint-') === 0) {
              handleViewPoint(layerId, objId, scrnPo, 'ShowPointInfoByMove');
            } else {
              showDomOrNot('#ShowPointInfoByMove', false);
            }
            // ShowObjSimpleInfo(layerId, objId, scrnPo);
            break;
          case 3: //选中了台风轨迹信息
            var typhoonId = objInfo.typhoonId; //台风id
            var iTruePos = objInfo.iTruePos; //台风真实轨迹点pos
            var iPredictPos = objInfo.iPredictPos; //真实轨迹点的预测轨迹点pos
            var iPredictLinePos = objInfo.iPredictLinePos; //真实轨迹点的预测轨迹点pos
            ShowTyphoonTrackSimpleInfo(typhoonId, iTruePos, iPredictLinePos, iPredictPos, scrnPo);
            break;
          case 5: //选中了船舶，得到船舶的id,pos
            if (objInfo.bClusterers == true) {
              //console.log(objInfo.data);//聚合信息
            } else {
              //console.log(objInfo);
              var iShipId = objInfo.id;
              var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;//是否选中了轨迹回放的船舶
              var iTrackPos = objInfo.iTrackPos; //假如是轨迹回放，则是选中轨迹点pos
              ShowShipSimpleInfo(iShipId, bSelPlayTrackShip, iTrackPos, scrnPo);
            }
            break;
          case 6: //选中了船舶，得到船舶的id,pos
            if (objInfo.bClusterers == true) {
              //console.log(objInfo.data);//聚合信息
            } else {
              var iShipId = objInfo.id;
              var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;//是否选中了轨迹回放的船舶
              var iTrackPos = objInfo.iTrackPos; //假如是轨迹回放，则是选中轨迹点pos
              ShowShipSimpleInfo(iShipId, bSelPlayTrackShip, iTrackPos, scrnPo);
            }
            break;
        }
      } else {
        if (g_showSimpleInfoDiv) {
          g_showSimpleInfoDiv.style.display = "none";
        }
        //隐藏航路点信息框
        showDomOrNot('#ShowPointInfoByMove', false);
      }
    },
    getShipType(code){
      if (code > 100)
        return '其他';
        const p1 = (code / 10) | 0, p2 = code % 10;
        const table = this.dic.types;
        switch (p1) {
          case 2:  return table[18];
          case 3:  return p2 <= 7 ? table[10 + p2] : '其他';
          case 4:  return table[19];
          case 5:  return table[p2];
          case 6:  return table[20];
          case 7:  return table[21];
          case 8:  return table[22];
          case 9:  return table[23];
          case 10: return table[24];
          default: return '其他';
        }
    },
    //shipFilter文件中有使用这个函数
    viewShipData(){
      API_DelAllShips();
      let {status,speed} = this.types;
      this.shipArrData.forEach(item=>{
        let {shipSpeed,iShipState,shipMMSI}=item;
        if(shipMMSI!==this.currentShipInfo.shipMMSI){
          //状态判断
          const isState = status.includes(iShipState);
          const speedVal = shipSpeed>0?1:0;
          const isSpeed = speed.includes(speedVal);
          if(isState && isSpeed){
            API_AddOneShip(item);
          }
        }else{ //更新当前选中船舶数据
          API_AddOneShip(item);
          const shipPos = API_GetShipPosById(shipMMSI);
          let curShipInfo = API_GetShipInfoByPos(shipPos);
          this.currentShipInfo = Object.assign({}, curShipInfo);
        }
        API_ReDrawShips();//重绘船舶
      })
    },
    getShip(val) {
      this.shipArrData=[];
       getAllShipApi().then(({time, content}) => {
        // console.log(content, 'getAllShipApi')
        content.map(item => {
          let {mmsi, name, cog, lat, length, lon, cost, width, sog, status,type} = item;
          const arr = {
            shipId: mmsi,
            shipMMSI: mmsi,
            shipName: name,
            shipGeoPoX: lon,
            shipGeoPoY: lat,
            shipWidth: width,
            shipLength: length,
            shipSpeed: sog ?? 0,
            shipCourse: cog,
            shipTime: freeDateFormat(new Date(time -(cost* 1000))),
            iShipState: status ?? 15, //状态(数字)
            bShowTrack: false,
            arrExpAttrValue: {isShipFollow: false,shipType:type??101}
          };
          // API_AddOneShip(arr); //添加船舶
          this.shipArrData.push(arr)
        })
        // API_ReDrawShips();//重绘船舶
         this.viewShipData();
      })
    },
    //attention文件中有使用这个函数
    async getAttention() {
      this.attentionData = await getAttentionApi() || [];
    },
    //绘制航路
    pathEvent() {
      getPathApi().then(res => {
        const type = Object.prototype.toString.call(res)
        if (res) {
          let list = type === "[object Object]" ? [res] : res;
          list.map(item=>{
            item.path=item.path.map(item=>{
              return {
                "lon": item.loc[1],
                "lat": item.loc[0],
                "deep":item.deep
              }
            })
            let {id, path,name} = item;
            getPathDraw(path, id, {
              compositeLayerPos: this.compositeLayerPos,
              compositeStylePos: this.compositeStylePos
            },name)
          })
          this.pathData=list;
        }
      });
    },
  },
  mounted() {
    init();
    this.pathEvent();
    this.getShip();
    this.getAttention();
    timer = setInterval(() => {
      this.getShip();
    }, 30000)
    this.resetInfoBox();
    //鼠标左击时查询到的对象信息
    window.ReturnSelectObjByMouseLeftDown = this.ReturnSelectObjByMouseLeftDown;
    // 鼠标移动时，选中对象的信息（手机版本这个方法不会被调用）
    window.ReturnSelectObjByMouseMove = this.ReturnSelectObjByMouseMove;
  },
  created() {
    window.onresize = function () {
      API_ReSizeMapView();//窗口大小变化时，海图视图跟着变化
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  }
}

</script>
<style lang="scss" scoped>
//@import url('/static/YimaEncSDK/css/mapcss.css');
.link-list {
  z-index: 1;
  margin-top: 200px;

  & > .aLinkDlg {
    color: #9c27b0 !important;
    position: relative;
    cursor: pointer;
  }

  .line {
    color: green;
    position: relative;
  }
}

.map-page {
  position: absolute;
  top: 4rem;
  height: calc(100vh - 4rem);
  width: 100%;

  ::v-deep .ShowMouseMoveInfoStyle {
    display: none;
    position: absolute;
    z-index: 500;
    font-size: 12px;
    color: White;
    border: 2px solid #379082;
    line-height: 150%;
    border-radius: 5px;
    padding: 5px 5px;
    width: 65px;
    height: 23px;
    background-color: #3628ec;
    -webkit-opacity: 0.7; /* Netscape and Older than Firefox 0.9 */
    -moz-opacity: 0.7; /* Safari 1.x (pre WebKit!) 老式khtml内核的Safari浏览器*/
    -khtml-opacity: 0.7; /* IE9 + etc...modern browsers */
    opacity: .7; /* IE 4-9 */
    filter: alpha(opacity=70); /*This works in IE 8 & 9 too*/
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)"; /*IE4-IE9*/
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=70);

  }
}

.map-search {
  width: 430px;
  border-radius: 2px;
  font-size: 16px;
  //top: 10px;
  //left: 20px;
  z-index: 1;
  position: absolute;
  background: 0 0;
  overflow: hidden;
}

.map-info {

  table#tableShipInfo {
    font-size: 12px;
    color: #333;

    td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .btn-group {
    overflow: hidden;

    .btn {
      float: left;
      display: inline-block;
      text-align: center;
      width: 64px;
      height: 26px;
      line-height: 26px;
      border-radius: 2px;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      background: #2770d4;
      margin: 10px 14px 0 2px;
    }
  }

  .track-time-box {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 58%;
    background: #fff;
    padding: 0 10px 0;
    box-sizing: border-box;
    border-top: 1px solid #ddd;
    box-shadow: #ccc 0 0 6px;

    .title {
      font-size: 12px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }

    .btn-box {
      display: flex;
      justify-content: center;
      margin-top: 6px;
    }
  }
}

.common-card {
  color: #333;

  ::v-deep .drag-card {
    opacity: .9;
    border-radius: 2px;

    .drag-header {
      border-radius: 2px 2px 0 0;
    }

    .drag-content {
      box-sizing: border-box;
      border: 4px solid #2770d4;
      border-top: 0;
      padding: 10px;
      background: #fff;
      position: relative;
      border-radius: 0 0 2px 2px;
    }
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateY(20px);
  opacity: 0;
}

.nav-card {
  ::v-deep .drag-card {
    .drag-content {
      height: 70vh;
      overflow-y: auto;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss" scoped>
body {
  overflow: hidden;
}

.boxBigDivStyle {
  display: none;
  position: absolute;
  z-index: 505;
  width: 270px;
  height: 260px;
  left: 280px;
  top: 100px;
  background-color: White;
  border: 4px solid #7cc7da;
  border-radius: 5px;
  padding: 0px 0px;

  -webkit-opacity: 0.9; /* Netscape and Older than Firefox 0.9 */
  -moz-opacity: 0.9; /* Safari 1.x (pre WebKit!) 老式khtml内核的Safari浏览器*/
  -khtml-opacity: 0.9; /* IE9 + etc...modern browsers */
  opacity: .9; /* IE 4-9 */
  filter: alpha(opacity=0); /*This works in IE 8 & 9 too*/
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=90)"; /*IE4-IE9*/
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=90);
}

.boxTitleDivStyle {
  width: 100%;
  height: 25px;
  background-color: #7cc7da;
  border-bottom: 3px;
  border-bottom-color: #7cc7da;
}

.boxTitleDivStyle span {
  position: relative;
  top: 5px;
  left: 5px;
  font-size: 13px;
  color: #ffffff;
}

.boxCloseImgStyle {
  top: 5px;
}

.boxContentDivStyle {
  position: absolute;
  top: 30px;
  left: 10px;
  line-height: 150%;
  width: 100%;
  height: 180px;
  color: #716c6c;
  font-size: 12px;
  overflow-x: hidden;
  overflow-y: auto;

}

.boxContentTalbeStyle {
}

.boxContentTalbeStyle tr {
  height: 22px;
  line-height: 22px;
}

.tableStyle {
  border: 2px;

}

.tableStyle tr td checkbox {
  width: 10px;
}

.boxBtnDiv {
  position: absolute;
  top: 220px;
  left: 60px;
}

.boxRadioStyle {
  width: 10px;
  height: 10px;
}

.rowStyle {
  height: 20px;
}

.rowStyle a:hover {
  background: #f4f4f4;
  color: #1832a8;
}

.rowStyle li a:hover {
  background: #f4f4f4;
  color: #1832a8;
}

//input[type="text"]
//{
//  width:100px;
//}

input[type="password"] {
  width: 150px;
}

.TitleFont {
  font-size: 20px;
  font-weight: bold;
}

.ShowInfoDiv {
  font-size: 14px;
  color: Black;
  border: 2px solid #379082;
  border-radius: 5px;
  padding: 5px 5px;
  width: 99%;
  height: 14px;
  background-color: White;
  -webkit-opacity: 0.9; /* Netscape and Older than Firefox 0.9 */
  -moz-opacity: 0.9; /* Safari 1.x (pre WebKit!) 老式khtml内核的Safari浏览器*/
  -khtml-opacity: 0.9; /* IE9 + etc...modern browsers */
  opacity: .9; /* IE 4-9 */
  filter: alpha(opacity=90); /*This works in IE 8 & 9 too*/
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=90)"; /*IE4-IE9*/
  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=90);

}

.aLinkDlg {
  font-size: 13px;
  font-weight: bold;
}

.aLinkDlg:link {
  color: rgb(0, 100, 100);
  text-decoration: none;
}

.aLinkDlg:visited {
  color: rgb(0, 100, 100);
  text-decoration: none;
}

.aLinkDlg:hover {
  color: rgb(0, 0, 0);
  text-decoration: none;
}

//.ShowMouseMoveInfoStyle {
//  display: none;
//  position: absolute;
//  z-index: 500;
//  font-size: 12px;
//  color: White;
//  border: 2px solid #379082;
//  line-height: 150%;
//  border-radius: 5px;
//  padding: 5px 5px;
//  width: 65px;
//  height: 23px;
//  background-color: #3628ec;
//  -webkit-opacity: 0.7; /* Netscape and Older than Firefox 0.9 */
//  -moz-opacity: 0.7; /* Safari 1.x (pre WebKit!) 老式khtml内核的Safari浏览器*/
//  -khtml-opacity: 0.7; /* IE9 + etc...modern browsers */
//  opacity: .7; /* IE 4-9 */
//  filter: alpha(opacity=70); /*This works in IE 8 & 9 too*/
//  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)"; /*IE4-IE9*/
//  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=70);
//
//}
</style>