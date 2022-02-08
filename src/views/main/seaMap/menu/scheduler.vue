<template>
  <div v-loading="isLoading" class="scheduler-box">
    <div class="top-btn">
      <div>
        <el-badge :value="unusualData.length" :max="99" class="badge-item" style="margin:0 20px;">
          <el-button size="small" @click="unusualClick">排期失败数据</el-button>
        </el-badge>
      </div>
      <el-button size="small" @click="saveClick"  type="primary">保存排期
      </el-button>
      <el-button size="small" @click="autoClick"  type="success">自动排期
      </el-button>
      <el-button size="small" @click="resetClick">重置
      </el-button>
    </div>
    <DayPilotScheduler id="dp" :config="config" ref="scheduler"/>
    <el-dialog :title="dialogConfig.title" :visible.sync="dialog.expired" :close-on-click-modal="false" append-to-body class="expired-dialog">
      <template slot="title">
        <div><span style="font-size: 18px;">{{ dialogConfig.title }}</span> <span style="font-size: 12px;color: #999;">({{ dialogConfig.tips }})</span></div>
      </template>
      <el-table :data="unusualData" border size="small" height="60vh">
        <el-table-column prop="vesselId" label="MMSI" width="100"></el-table-column>
        <el-table-column label="船名">
          <template slot-scope="{row}">
            {{getShipName(row.vesselId) || "" }}
          </template>
        </el-table-column>
        <el-table-column label="航路">
          <template slot-scope="{row}">
            {{pathData.find(x=>x.id===row.wayId) &&pathData.find(x=>x.id===row.wayId).name }}
          </template>
        </el-table-column>
        <el-table-column label="目的地">
          <template slot-scope="{row}">
            {{getDestination(row.dstId) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="140">
          <template slot-scope="{row}">
            <span v-text="getTimeFn(new Date(row.timeEnd), 'yyyy-MM-dd hh:mm:ss')"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{row}">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="unusualUpdateClick(row)" style="margin-right: 6px;">修改</el-button>
            <el-popconfirm @confirm="unusualDelClick(row.id)" title="确定删除该排期吗？">
              <el-button type="text" icon="el-icon-delete" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="靠泊计划" :visible.sync="dialog.create" :close-on-click-modal="false" append-to-body  @close="close"
               class="scheduler-dialog" v-if="dialog.create">
      <el-form :model="selected" label-width="100px" size="small" ref="selectedForm" :rules="rules" label-suffix=":">
        <el-form-item label="船舶" prop="vessel">
          <el-select v-model="selected.vessel" filterable default-first-option
                     placeholder="请选择船舶">
            <el-option v-for="(item,index) in attentionList" :key="index" :label="item.name"
                       :value="item.value"></el-option>
          </el-select>
          <!--<el-button @click="importVessel" style="position: absolute;right: 0;">导入</el-button>-->
        </el-form-item>
        <el-form-item label="目的地" prop="dst">
          <el-cascader v-model="selected.dst" :options="destinationOptions" :props="{ expandTrigger: 'hover' ,emitPath:false}"></el-cascader>
        </el-form-item>
        <el-form-item label="航路" prop="way">
          <el-select v-model="selected.way" placeholder="请选择航路">
            <el-option v-for="(item,index) in pathData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入港-靠泊" prop="time1">
          <el-date-picker
              v-model="selected.time1"
              type="datetimerange"
              value-format="timestamp"
              start-placeholder="入港时间"
              end-placeholder="靠泊时间">
          </el-date-picker>
          <el-button @click="selectTimeClick('time1')" style="margin-left: 10px;">选择</el-button>
        </el-form-item>
        <el-form-item label="离港-结束" prop="time2">
          <el-date-picker
              v-model="selected.time2"
              type="datetimerange"
              value-format="timestamp"
              start-placeholder="离港时间"
              end-placeholder="结束时间">
          </el-date-picker>
          <el-button @click="selectTimeClick('time2')" style="margin-left: 10px;">选择</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="insert('selectedForm')" size="small">确 定</el-button>
      </div>
    </el-dialog  >
    <el-dialog title="常用时间管理" :visible.sync="dialog.time" :close-on-click-modal="false" append-to-body class="time-dialog" @close="timeClose">
        <div class="common-time-box">
          <div class="time-select">
            <el-date-picker
                size="medium"
                v-model="timeForm.timeArr"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
            <el-button size="medium" @click="timeAddClick" style="margin-left: 10px;">添加</el-button>
          </div>
          <div class="time-selection" v-if="timeForm.selectionArr.length>0">
            <el-tag v-for="(tag,index) in timeForm.selectionArr" :key="index" closable class="time-tag" type="info" effect="plain" @close="tagCloseClick(index)" @click="tagClick(tag)">
              {{tag.start}} --> {{tag.end}}
            </el-tag>
          </div>
          <div v-else class="time-selection">
            <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
import {
  getSchedulerResourceApi,
  getSchedulerEventsApi,
  getPathApi,
  saveSchedulerApi,
  autoSchedulerApi,
  getAttentionApi,
} from "@/api/seamap";
import {freeDateFormat} from "@/util/common";

let _this,timer1,timer2;
export default {
  components: {
    DayPilotScheduler
  },
  props: {},
  data() {
    let checkTime1 = (rule, value, callback) =>{
      if (!value || value.length!==2) {
        return callback(new Error('请选择入港和靠泊时间'));
      }
      if(value[0]===value[1]){
        return callback(new Error('入港和靠泊时间不能相同'));
      }
      if(value[0]<_this.nowTime || value[1]<_this.nowTime){
        return callback(new Error('不能小于当前时间点'));
      }
      callback();
    };
    let checkTime2 = (rule, value, callback) => {
      if (!value || value.length!==2) {
        return callback(new Error('请选择离港和结束时间'));
      }
      if(value[0]===value[1]){
        return callback(new Error('离港和结束时间不能相同'));
      }
      if(value[0]<_this.nowTime || value[1]<_this.nowTime){
        return callback(new Error('不能小于当前时间点'));
      }
      let time = this.selected.time1?.[1];
      if(time && value[0]<=time){
        return callback(new Error('离港时间必须大于靠泊时间'));
      }
      callback();
    };
    return {
      // 官网： https://builder.daypilot.org/scheduler,
      // 事件：https://doc.daypilot.org/scheduler/events/
      // 属性：https://api.daypilot.org/daypilot-event-data/
      isLoading: false,
      preData:[],//接口返回原始数据
      unusualData:[],//异常数据
      dialogConfig:{
        title:"",
        tips:"",
        data:[]
      },
      nowTime:Date.now(),
      dp:null,//组件实例
      config: {
        locale: "zh-cn",
        timeHeaders: [
          {groupBy: "Day", format: "yyyy-MM-dd"},
          {groupBy: "Hour"},
        ],
        scale: 'CellDuration',
        cellDuration: 60,
        businessBeginsHour: 0,
        businessEndsHour: 0,
        businessWeekends: true,
        treeEnabled: true,//树形结构
        rowHeaderWidthAutoFit: true,//左侧头部宽度自适应
        crosshairType: "Header", //鼠标hover十字效果 值为 Disabled Full Header 默认 Header
        // treePreventParentUsage:true,//parent行禁止操作
        bubble : null,//设置这个tooltips才有效
        // durationBarVisible: false,//持续时间条可见
        // startDate: DayPilot.Date.today(),
        // days: 7,
        // startDate: DayPilot.Date.today().firstDayOfMonth(),
        // days: DayPilot.Date.today().daysInYear(),//显示多少天
        allowEventOverlap: false,//允许事件重叠
        // eventClickHandling: "Select",
        useEventBoxes:"Never",//默认值为 Always, 决定了在值不为整个格子大小时的events是否换行展示,文档见exact-event-duration
        snapToGrid :true,//resize时是否要以单元格为单位调整大小
        contextMenu: new DayPilot.Menu({
          items: [
            {
              text: "Edit", onClick: (args) => {
                console.log(args, 'edit')
                let {id, kindId,wayId, vesselId, resource } = args.source.data;
                let [startObj,dockObj,leaveObj]=this.config.events.filter(x=>x.kindId===kindId);
                const editStart = new Date(startObj.start).getTime();
                // const dp = args.source.calendar;
                // dp.events.edit(args.source);
                this.selected = {
                  dst: resource,
                  vessel: vesselId,
                  way: wayId,
                  id,
                  kindId,
                  time1: [editStart,editStart + startObj.during],
                  time2:[editStart + startObj.during + dockObj.during, editStart + startObj.during + dockObj.during+leaveObj.during]
                };
                this.dialog.create = true;
              }
            },
            {
              text: "Lock/Unlock", onClick: (args) => {
                // console.log('Lock',args);
                let {kindId,manual}=args.source.data;
                _this.config.events.forEach(item=>{
                  if(item.kindId === kindId){
                    this.$set(item,'manual',!manual);
                    this.$set(item,'areas',item.manual?[{ right: 2, top: 2, width: 24, height: 24, icon: "el-icon-lock" }]:[])
                  }
                })
              }
            },
            {
              text: "Delete", onClick: (args) => {
                // console.log('delete',args)
                this.$confirm('确定删除该条数据吗', '提示',{type: 'warning'
                }).then(()=>{
                  let {kindId}=args.source.data;
                  const dp = args.source.calendar;
                  dp.events.remove(kindId+"_0");
                  dp.events.remove(kindId+"_1");
                  dp.events.remove(kindId+"_2");
                }).catch(()=>{})
              }
            }
          ]
        }),
        onBeforeCellRender:function (args){
          // console.log('CellRender',args)
          let dp=this;
          _this.getDisabled(args, dp);
        },
        //隐藏当前时间前的排期
        // onIncludeTimeCell:function (args){
        //   let {start,end}=args.cell;
        //   if(new Date(end).getTime()<Date.now()){
        //     args.cell.visible = false;
        //   }
        // },
        onBeforeEventRender: function(args){
          // console.log('EventRender',args)
          _this.dp=this;
          const obj = {
            start:'rgba(204, 153, 102,1)',
            dock:'rgba(221, 221, 221,1)',
            leave:'rgba(102, 153, 153,1)'
          }
          args.data.backColor=obj[args.data.type];
          const {manual,start,end} = args.data;
          const now = Date.now();
          const isOld = new Date(start).getTime()<now || new Date(end).getTime()<now
          //锁定时禁止拖动
          if(manual || args.data.status===9 || isOld){
            _this.$set(args.data,'moveVDisabled',true);
            _this.$set(args.data,'moveHDisabled',true);
            _this.$set(args.data,'resizeDisabled',true);
            args.data.fontColor="#fff"
          }
        },
        onEventClick: (args) => {
          // console.log(args)
          let vesselId = args.e.data.vesselId;
          const pos = API_GetShipPosById(vesselId);
          const info = API_GetShipInfoByPos(pos);
          let {shipGeoPoX, shipGeoPoY} = info;
          API_SetShipToMapViewCenterByPos(pos);//居中选择并显示
          API_SetMapLevel(12, {x: shipGeoPoX / 10000000, y: shipGeoPoY / 10000000});//设置当前显示的比例尺级别和中心点
        },
        onTimeRangeSelecting:function (args){
          // console.log('TimeRangeSelecting',args)
          let dp=this;
          const parentId = dp.rows.find(args.resource).parent()?.id;
          if (!parentId) {
            args.allowed = false;
            args.left.enabled = false;
            args.right.enabled = true;
            args.right.html = "当前选中行无法添加数据.";
          }
          const {start,end}=args;
          const now = Date.now();
          const isOld = new Date(start).getTime()<now || new Date(end).getTime()<now
          if (isOld) {
            args.allowed = false;
            args.left.enabled = false;
            args.right.enabled = true;
            args.right.html = "当前选中时间已过期.";
          }
        },
        onTimeRangeSelected: function(args){
          // console.log("selected", args);
          const {resource, start, end} = args;
          _this.selected = {
            dst: resource,
            // start: new Date(start).getTime(),
            // end: new Date(end).getTime(),
            way: null,
            time1:[new Date(start).getTime(),new Date(start).getTime()],
            time2:[new Date(end).getTime(),new Date(end).getTime()]
          };
          _this.dialog.create = true;
        },
        onEventMoving:function (args){
          // console.log('Moving',args);
          //args.e.resource() 原始
          //args.resource 移动至
          let dp =this;
          //判断是否移入了parent行
          const parentId = dp.rows.find(args.resource).parent()?.id;
          if (!parentId) {
            args.left.enabled = false;
            args.right.html = "not permission!";
            args.allowed = false;
            return false;
          }
          // 1 stampObj= 移动中的events,'入港','离港'分别对应的start,end时间点
          // 2.disArr = 获取该父id下所有'入港','离港'的时间段(不包含移动的events本身);
          // 3.最后把移动的'入港','离港'分别的start,end和disArr做比较;
          let {kindId,type}=args.e.data;
          let {start,end}=args;
          start=new Date(start).getTime();
          end=new Date(end).getTime();
          let [startObj,dockObj,leaveObj]=dp.events.list.filter(x=>x.kindId===kindId);
          let [startDuring,dockDuring,leaveDuring]=[startObj.during,dockObj.during,leaveObj.during];
          //拖动中的时间段
          let stampObj ={};
          let commonStart=null;
          if(type==='start') {
            commonStart= start;
          }else if(type==='dock'){
            commonStart= start-startDuring;
          }else if(type==='leave') {
            commonStart= start-dockDuring-startDuring;
          }
          stampObj = {
            startStamp: commonStart,
            dockStamp: commonStart+startDuring,
            leaveStamp: commonStart+startDuring+dockDuring,
            endStamp: commonStart+startDuring+dockDuring+leaveDuring
          }
          //显示字符串时间
          // Object.keys(stampObj).forEach(key=>stampObj[key]=freeDateFormat(new Date(stampObj[key]), "yyyy-MM-ddThh:mm:ss"))
          // console.log('stampObj',stampObj)
          //禁止时间段
          let disArr = dp.events.list.filter(x=>{
            return ['start','leave'].includes(x.type) && x.kindId!==kindId && dp.rows.find(x.resource).parent().id===parentId
          });
          // console.log('disArr',disArr);
          let isLimit=0;
          const {startStamp,dockStamp,leaveStamp,endStamp} =stampObj;
          for (const time of [[startStamp, dockStamp], [leaveStamp, endStamp]]) {
            if(isLimit>0){
              break;
            }
            for (const disArrElement of disArr) {
              let {disStart,disEnd}={disStart:new Date(disArrElement.start).getTime(),disEnd:new Date(disArrElement.end).getTime()};
              let bool=false;
              bool = _this.isIntersect(time,[disStart,disEnd])
              if (bool) {
                isLimit++;
                break;
              }
            }
          }
          // console.log('isLimit',isLimit);
          const isOld=startStamp<=_this.nowTime;//判断是否拖出了边界
          if (isLimit>0 || isOld) {
            args.left.enabled = false;
            args.right.html = "not permission!";
            args.allowed = false;
          }
        },
        onEventMoved:function (args){
          // console.log('moved',args)
          _this.movedHandler(args.e.data);
        },
        onEventResized:function (args){
          // console.log('resized',args)
          _this.resizeHandler(args.e.data);
        },
      },
      pathData: [],
      attentionList: [],
      dialog: {
        create: false,
        expired:false,
        time:false
      },
      //编辑form
      selected: {
        vessel: null,
        dst: null,
        way: null,
        time1:[],
        time2:[]
      },
      //常用时间段form
      timeForm:{
        timeArr:[],
        selectionArr:[],
        type:""
      },
      rules: {
        vessel: [
          { required: true, message: '请选择船舶', trigger: 'change' }
        ],
        dst: [
          { required: true, message: '请选择目的地', trigger: 'change' }
        ],
        way: [
          { required: true, message: '请选择航路', trigger: 'change' }
        ],
        time1: [
          { validator: checkTime1, trigger: 'change' }
        ],
        time2: [
          {  validator: checkTime2,trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    scheduler: function () {
      return this.$refs.scheduler.control;
    },
    destinationOptions:function (){
      let {resources} = this.config;
      let arr=[];
      resources?.forEach(item=>{
        let {id,name,children}=item;
        let obj={
          label:name,
          value:id,
        };
        if(children){
          obj.children= children.map(childItem=>{
            return {
              label:childItem.name,
              value:childItem.id,
            }
          })
        }
        arr.push(obj)
      })
      return arr;
    },
  },
  methods: {
    getTimeFn(val,formatter){
      return freeDateFormat(val,formatter)
    },
    getShipName(id){
      return API_GetShipInfoByPos(API_GetShipPosById(id))?.shipName;
    },
    // 常用时间相关
    selectTimeClick(type){
      const arr = localStorage.getItem('common-time');
      const parseArr = JSON.parse(arr);
      this.timeForm.selectionArr = parseArr.sort((a,b)=>{
        return new Date(a.start).getTime()-new Date(b.start).getTime()
      })
      this.timeForm.type=type;
      this.dialog.time=true;
    },
    timeAddClick(){
      if(this.timeForm.timeArr?.length!==2){
        let dom = document.getElementsByClassName('el-message')[0];
        if(!dom){
          this.$message.warning('请选择开始和结束时间！');
        }
        return false
      }
      const [start,end]=this.timeForm.timeArr;
      const num = this.timeForm.selectionArr.filter(x=>x.start===start && x.end===end ).length;
      if(num>0){
        let dom = document.getElementsByClassName('el-message')[0];
        if(!dom){
          this.$message.warning('该时间段已存在！');
        }
        return false
      }
      this.timeForm.selectionArr.push({start,end});
    },
    tagCloseClick(index){
      this.timeForm.selectionArr.splice(index,1);
    },
    tagClick({start,end}){
      const {type}= this.timeForm;
      this.dialog.time=false;
      this.$set(this.selected,type,[new Date(start).getTime(),new Date(end).getTime()])
    },
    timeClose(){
      const arr = JSON.stringify(this.timeForm.selectionArr)
      localStorage.setItem('common-time',arr);
      this.timeForm.selectionArr=[];
      this.timeForm.timeArr=[];
    },
    getDestination(id){
      let str="";
      this.destinationOptions.forEach(item=>{
        const obj = item.children.find(x=>x.value===id);
        if(obj){
          str=item.label+'/'+obj.label
        }
      })
      return str;
    },
    getDisabled(args, dp) {
      // console.log('getDisabled',args)
      let {isParent,start,end,resource}=args.cell;
      if(isParent) {
        //找出该cell对应所在的events
        let hasEvent = dp.events.list.find(x =>
            // 不包含分秒的占位
            // new Date(start).getTime() >= new Date(x.start).getTime() && new Date(end).getTime() <= new Date(x.end).getTime() && dp.rows.find(x.resource).parent().id === resource
            // 包含分秒的占位
            (this.isIntersect([new Date(start).getTime(),new Date(end).getTime()],[new Date(x.start).getTime(),new Date(x.end).getTime()]))
            && dp.rows.find(x.resource).parent().id === resource
        );
        // console.log('hasEvent',hasEvent,isParent)
        if (isParent && hasEvent) {
          args.cell.properties.disabled = true;
          args.cell.properties.backColor = "#ccc";
        }
      }
    },
    // 判断两个区间是否相交
    isIntersect(arr1,arr2){
      let start = [Math.min(...arr1),Math.min(...arr2)];//区间的两个最小值
      let end = [Math.max(...arr1),Math.max(...arr2)];//区间的两个最大值
      return Math.max(...start) < Math.min(...end);//最大值里的最小值 是否 小于 最大值的最小值
    },
    movedHandler(currentObj){
      let {type,kindId} = currentObj;
      let [startObj,dockObj,leaveObj]=this.config.events.filter(x=>x.kindId===kindId);
      if(type==='start'){
        dockObj.resource=startObj.resource;
        leaveObj.resource=startObj.resource;
        dockObj.start=startObj.end;
        dockObj.end=freeDateFormat(new Date(new Date(dockObj.start).getTime()+dockObj.during), "yyyy-MM-ddThh:mm:ss");
        leaveObj.start=dockObj.end;
        leaveObj.end=freeDateFormat(new Date(new Date(dockObj.end).getTime()+leaveObj.during), "yyyy-MM-ddThh:mm:ss");
      }else if(type ==='dock'){
        startObj.resource=dockObj.resource;
        leaveObj.resource=dockObj.resource;
        startObj.start=freeDateFormat(new Date(new Date(dockObj.start).getTime()-startObj.during), "yyyy-MM-ddThh:mm:ss");
        startObj.end=dockObj.start;
        leaveObj.start=dockObj.end;
        leaveObj.end=freeDateFormat(new Date(new Date(dockObj.end).getTime()+leaveObj.during), "yyyy-MM-ddThh:mm:ss");
      }else if(type === 'leave'){
        startObj.resource=leaveObj.resource;
        dockObj.resource=leaveObj.resource;
        dockObj.end=leaveObj.start;
        dockObj.start=freeDateFormat(new Date(new Date(dockObj.end).getTime()-dockObj.during), "yyyy-MM-ddThh:mm:ss");
        startObj.end= dockObj.start;
        startObj.start=freeDateFormat(new Date(new Date(dockObj.start).getTime()-startObj.during), "yyyy-MM-ddThh:mm:ss");
      }
    },
    resizeHandler(currentObj){
      let {type,kindId,start,end} = currentObj;
      start = new Date(start).getTime();
      end = new Date(end).getTime();
      let currentDuring = end -start;
      // let startObj = this.config.events.find(x=>x.kindId===kindId && x.type==='start');
      // let dockObj = this.config.events.find(x=>x.kindId===kindId && x.type==='dock');
      // let leaveObj = this.config.events.find(x=>x.kindId===kindId && x.type==='leave');
      let [startObj,dockObj,leaveObj]=this.config.events.filter(x=>x.kindId===kindId);
      if(type==='start') {
        startObj.during=currentDuring;
        //右边不连续
        if(end!==new Date(dockObj.start).getTime()){
          dockObj.start=startObj.end;
          dockObj.during= new Date(dockObj.end).getTime()-new Date(dockObj.start).getTime();
        }
      }else if(type==='dock'){
        dockObj.during=currentDuring;
        //左边不连续
        if(start!==new Date(startObj.end).getTime()){
          startObj.end=dockObj.start;
          startObj.during=new Date(startObj.end).getTime()-new Date(startObj.start).getTime();
          //右边不连续
        }else if(end!==new Date(leaveObj.start).getTime()){
          leaveObj.start=dockObj.end;
          leaveObj.during=new Date(leaveObj.end).getTime()-new Date(leaveObj.start).getTime();
        }
      }else if(type==='leave'){
        leaveObj.during=currentDuring;
        //左边不连续
        if(start!==new Date(dockObj.end).getTime()){
          dockObj.end=leaveObj.start;
          dockObj.during= new Date(dockObj.end).getTime()-new Date(dockObj.start).getTime();
        }
      }

    },
    unusualClick(){
      this.dialogConfig= {
        title:'自动排期失败数据列表',
        tips: "无法自动排期的数据",
      };
      this.dialog.expired=true;
    },
    unusualUpdateClick(row){
      let {dstId, id, score, status, timeDock, timeEnd, timeLeave, timeStart, vesselId, wayId}=row;
      this.selected = {
        dst: dstId,
        vessel: vesselId,
        way: wayId,
        id,
        kindId:id,
        time1: [timeStart,timeDock],
        time2:[timeLeave,timeEnd]
      };
      this.dialog.create = true;
    },
    unusualDelClick(id){
      // console.log('delete',id)
      this.config.events=this.config.events.filter(x=>x.kindId!==id);
      this.unusualData=this.unusualData.filter(x=>x.id!==id);
    },
    saveClick(){
      let eventsData= this.handleEventsData() || [];
      saveSchedulerApi(eventsData).then(res => {
        this.$message.success('保存成功');
        this.getInit();
      })
    },
    //转成接口数据格式
    handleEventsData() {
      let {events} = this.config;
      //获取所有id去重
      let kindIdArr = [...new Set(events.map(item=>item.kindId))];
      //遍历得到每个id获取对应的数据
      let data=kindIdArr.map(kindId=>{
        //获取相同id的集合
        let sameIdArr = events.filter(x=>x.kindId===kindId);
        let [startObj,dockObj,leaveObj] = sameIdArr;
        let obj={
          id:kindId.toString().indexOf('-')>-1?null:Number(kindId),
          vesselId:startObj.vesselId,
          wayId:startObj.wayId,
          dstId:startObj.resource,
          timeStart:new Date(startObj.start).getTime(),
          timeDock:new Date(dockObj.start).getTime(),
          timeLeave:new Date(leaveObj.start).getTime(),
          timeEnd:new Date(leaveObj.end).getTime(),
          score:startObj.score,
          status:startObj.status,
          manual: startObj.manual
        }
        let preObj = this.preData.find(x=>x.id+''===kindId+'');
        // console.log('preObj',this.preData,preObj)
        //判断是否新增
        if(obj.id===null){obj.score=0}
        //判断是否改动
        if(preObj){
          for (const key of Object.keys(preObj)) {
            if(preObj[key] !==obj[key] && !['manual'].includes(key)){
              obj.score=0;
              break;
            }
          }
        }
        if(obj.id===null){delete obj.status}
        return obj;
      })
      //判断要删除的events
      let statusEvents=[];
      this.preData.forEach(item=> {
        const obj = data.find(x => x.id === item.id);
        let resObj = Object.assign({},item)
        if (!obj) {
          resObj.status = -1;
          statusEvents.push(resObj);
        }
      })
      // console.log(events,data)
      return [...data,...statusEvents]
    },
    async getAttentionData() {
      const data = await getAttentionApi() || [];
      return data.map(item => {
        const pos = API_GetShipPosById(item.mmsi);
        const info = API_GetShipInfoByPos(pos);
        return {
          name: info?.shipName,
          value: item.mmsi
        }
      })
    },
    cancel() {
      this.close();
      this.scheduler.clearSelection();
    },
    insert(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.insertHandler();
        } else {
          return false;
        }
      });
    },
    insertHandler() {
      const {id,kindId,vessel, dst, way, time1:[timeStart,timeDock], time2:[timeLeave,timeEnd]} = this.selected;
      let [startDuring,dockDuring,leaveDuring]=[timeDock - timeStart,timeLeave - timeDock,timeEnd - timeLeave];
      const text = this.getShipName(vessel) ?? "";
      // console.log(start, new DayPilot.Date(start,true),new DayPilot.Date(start,false))
      let controlType=id?'update':'add';
      let controlId=id?kindId:DayPilot.guid();
      [[timeStart,timeDock],[timeDock,timeLeave],[timeLeave,timeEnd]].forEach((childItem,index)=>{
        this.scheduler.events[controlType]({
          id: controlId+"_"+index,//id必须有且不能重复
          kindId:controlId,//同类id
          resource: dst,
          start: freeDateFormat(new Date(childItem[0]), "yyyy-MM-ddThh:mm:ss"),
          end: freeDateFormat(new Date(childItem[1]), "yyyy-MM-ddThh:mm:ss"),
          text:index===0?`${text}(入港)`:index===1?`${text}(靠泊)`:`${text}(出港)`,
          type:index===0?'start':index===1?'dock':'leave',
          wayId:way,
          vesselId:vessel,
          during:index===0?startDuring:index===1?dockDuring:leaveDuring
        })
      })
      //删除对应的异常数据------
      const index = this.unusualData.findIndex(x=>x.id===id);
      if(index>-1){
        this.unusualData.splice(index,1)
      }
      //------删除对应的异常数据
      this.dialog.create = false;
      this.scheduler.clearSelection();
    },
    close(){
      this.$refs.selectedForm.clearValidate();
      this.dialog.create=false;
      this.scheduler.clearSelection();
    },
    importVessel() {

    },
    resetClick(){
      this.$confirm('重置将刷新数据,请确认', '重置提示',{type: 'warning'
      }).then(()=>{
        this.getInit();
      }).catch(()=>{})
    },
    // 获取自动排期列表
    async autoClick() {
      this.isLoading = true;
      let data= this.handleEventsData() || [];
      let {success,failure} = await autoSchedulerApi(data);
      await this.initHandler(this.config.resources,success);
      // console.log(failure,'failure')
      this.unusualData=failure||[];
      this.isLoading = false;
    },
    //获取排期列表
    async getInit(){
      this.isLoading = true;
      try {
        let resources = await getSchedulerResourceApi() || [];
        let events = await getSchedulerEventsApi() || [];
        await this.initHandler(resources,events);
        this.dp.scrollTo(freeDateFormat(new Date()));//滚动条滚动到当前时间
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
      }
    },
    //拿到接口数据后的操作
    async initHandler(resources,events){
      console.log('events',events)
      resources.map(item => {
        item.expanded = true;
      });
      this.preData=events;
      let eventsRes=[];
      let oldEventsRes=[];
      //设置起始时间
      let tableStartTime=events[0].timeStart;
      let tableEndTime=Math.max(events[events.length-1].timeEnd,Date.now());
      this.$set(this.config,'startDate',freeDateFormat(new Date(tableStartTime), "yyyy-MM-dd hh:mm:ss"));
      this.$set(this.config,'days',parseInt((tableEndTime-tableStartTime)/(3600000*24))+7);
      events.forEach(item => {
        const {id, vesselId, dstId, wayId, score,status,timeStart, timeDock, timeLeave, timeEnd,manual} = item;
        const nowTime = this.nowTime;
        if(timeEnd<nowTime){
          oldEventsRes.push(item)
        }
        // else {
        const text = this.getShipName(vesselId) ?? "";
        let [startDuring,dockDuring,leaveDuring]=[timeDock - timeStart,timeLeave - timeDock,timeEnd - timeLeave];
        [[timeStart,timeDock],[timeDock,timeLeave],[timeLeave,timeEnd]].forEach((childItem,index)=>{
          eventsRes.push({
            id: id+"_"+index,//id必须有且不能重复
            kindId:id,//同类id
            resource: dstId,
            wayId,
            vesselId,
            score,
            status,
            manual,
            start: freeDateFormat(new Date(childItem[0]), "yyyy-MM-ddThh:mm:ss"),
            end: freeDateFormat(new Date(childItem[1]), "yyyy-MM-ddThh:mm:ss"),
            text:index===0?`${text}(入港)`:index===1?`${text}(靠泊)`:`${text}(出港)`,
            type:index===0?'start':index===1?'dock':'leave',
            during:index===0?startDuring:index===1?dockDuring:leaveDuring,
            toolTip: index===0?`${text}(入港)`:index===1?`${text}(靠泊)`:`${text}(出港)`,
            areas : manual?[
              { right: 2, top: 2, width: 24, height: 24, icon: "el-icon-lock" }
            ]:[],
          })
        })
        // }
      })
      this.$set(this.config, 'resources', resources);
      this.$set(this.config, 'events', eventsRes);
      // this.unusualData=oldEventsRes;
      this.pathData = await getPathApi();
      this.attentionList = await this.getAttentionData();
    },
  },
  mounted() {
    _this=this;
    // let event = {
    //   id: null,
    //   vesselId: 1,
    //   wayId: 3,
    //   dstId: 4,
    //   status:9  //9为正在靠泊 不能动
    //   manual:true
    //   timeDock: 1640159336000,
    //   timeEnd: 1640159536000,
    //   timeLeave: 1640159436000,
    //   timeStart: 1640159236000,
    //   score:0, //手动变更则清零，否则保持原样
    // }
    this.getInit();
  },
  beforeDestroy() {
    _this=null;
    clearTimeout(timer1)
    clearInterval(timer2)
  }
}
</script>
<style lang="scss">
.scheduler-box{
  .top-btn{
    position: absolute;
    top: 10px;
    right: 80px;
    display: flex;
  }
}

.expired-dialog{
  .el-table__header thead th.el-table__cell {
    background: #f5f7fa;
  }
}

.menu_default_main {
  z-index: 2222 !important;
}

.scheduler-dialog {
  .el-dialog{
    min-width: 600px;
  }
}

.scheduler_default_corner > div:nth-child(2) {
  display: none !important;
}
.time-dialog .el-dialog{
  min-width: 600px;
  .common-time-box{
    .time-selection{
      border-top: 1px solid #ddd;
      height: 40vh;
      padding: 14px 0;
      overflow-y: auto;
      .time-tag{
        margin: 4px 10px;
        cursor: pointer;
        &:hover{
          color: #409eff;
          border-color:#409eff;
        }
      }
    }
  }
}
</style>
