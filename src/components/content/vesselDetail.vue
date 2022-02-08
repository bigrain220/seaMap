<template>
  <div>
    <el-row>
      <!--船舶属性展示区域-->
      <el-col :span="8">
        <!--id属于后台自动生成的 新增则不显示该项-->
        <el-input v-if="confirmButtonType!=='add'" v-model="vesselId" :disabled="true">
          <template slot="prepend">id</template>
        </el-input>
        <el-input v-model="vesselImoNumber" :disabled="isUpdate">
          <template slot="prepend">船舶编号</template>
        </el-input>
        <el-input v-model="vesselName" :disabled="isUpdate">
          <template slot="prepend">船舶名称</template>
        </el-input>
        <el-input v-model="vesselLength" :disabled="isUpdate">
          <template slot="prepend">船舶长度</template>
        </el-input>
        <el-input v-model="vesselWidth" :disabled="isUpdate">
          <template slot="prepend">船舶宽度</template>
        </el-input>
        <el-input v-model="vesselColor" :disabled="isUpdate" type="color">
          <template slot="prepend">船舶颜色</template>
        </el-input>
        <el-input v-model="remark" :disabled="isUpdate">
          <template slot="prepend">备注</template>
        </el-input>

        <el-select v-model="vesselsType" :disabled="isUpdate" @change="changeVesselImg">
          <el-option
              v-for="item in vesselTypes"
              :key="item.value"
              :label="item.text"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-col>


      <!--船舶视图区域-->
      <el-col :span="16" style="position: relative;height: 320px">
        <img style="position: absolute;bottom: 0" :src="vesselImgPath"/>
      </el-col>
    </el-row>

    <div class="footer" v-if="isDisplayButton">
      <el-button @click="hiddenDialog">取 消</el-button>
      <el-button type="primary" @click="ensureUpdateVesselInfo">{{ confirmButtonText }}</el-button>
    </div>
  </div>
</template>

<script>
import {createVessel, getVesselsType, updateVessel} from "@/network/request-api";
import {deleteObj, getVesselFileByType, getVesselTypeStrByType} from "@/util/content";
import vesselsSvg from "@/assets/img";


export default {
  name: "vesselDetail",
  props: {
    //对象{imoNumber:'',name:'',vesselsType:'',vesselsTypeStr:'',color:'',remark:'',width:'',length:''}
    vesselObj: {
      type: Object,
      required: true
    },
    //是否显示确定按钮
    isDisplayButton: {
      type: Boolean,
      required: true
    },
    //确认按钮的描述
    confirmButtonType: {
      type: String,
      default: 'update'
    }
  },
  data() {
    return {
      // vessel: {
      //   id: this.vesselObj.id,
      //   imoNumber: this.vesselObj.imoNumber,
      //   name: this.vesselObj.name,
      //   length: this.vesselObj.length,
      //   width: this.vesselObj.width,
      //   vesselsTypeStr: this.vesselObj.vesselsTypeStr,
      //   vesselsType: this.vesselObj.vesselsType,
      //   color: this.vesselObj.color,
      //   remark: this.vesselObj.remark
      // },
      vesselId: this.vesselObj.id,
      vesselImoNumber: this.vesselObj.imoNumber,
      vesselName: this.vesselObj.name,
      vesselLength: this.vesselObj.length,
      vesselWidth: this.vesselObj.width,
      vesselsTypeStr: this.vesselObj.vesselsTypeStr,
      vesselsType: this.vesselObj.vesselsType,
      vesselColor: this.vesselObj.color,
      remark: this.vesselObj.remark,
      vesselTypes: null,
      vesselImg: 'OIL'
    }
  },
  computed: {
    //输入框是否无效
    isUpdate() {
      return !this.isDisplayButton;
    },
    // vesselsTypeStr: function () {
    //   let type = this.vesselsType;
    //   let types = this.vesselTypes;
    //   if (types) {
    //     types.forEach((item, index) => {
    //       if (item.value + "" === type + "") {
    //         return item.text;
    //       }
    //     })
    //   }
    //   return "";
    // },
    vesselImgPath() {
      return vesselsSvg[this.vesselImg];
    },
    confirmButtonText() {
      switch (this.confirmButtonType) {
        case 'add':
          return '新增';
        case 'update':
          return '确认修改';
        default:
          return '确认修改';
      }
    },
  },
  watch: {
    vesselObj(newValue) {
      this.assignment(newValue);
    },
    vesselsType(newValue) {
      this.vesselsTypeStr = getVesselTypeStrByType(newValue);
      this.changeVesselImg(newValue);
    },
  },
  beforeMount() {
    this.getTypes();
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    getTypes() {
      //0:邮轮,1:天然气船,2:集装箱船,3:散货船

      // this.vesselTypes = [
      //   {text: '集装箱', value: '2'},
      //   {text: '天然气', value: '1'},
      //   {text: '货船', value: '3'},
      //   {text: '邮轮', value: '0'},
      // ]

      getVesselsType().then(data => {
        this.vesselTypes = data;
      })
    },
    /**
     * 隐藏对话框
     */
    hiddenDialog() {
      this.$emit('hidden');
    },
    /**
     * 确认修改船舶信息
     */
    ensureUpdateVesselInfo() {
      const vessel = {
        id: this.vesselId,
        imoNumber: this.vesselImoNumber,
        name: this.vesselName,
        length: this.vesselLength,
        width: this.vesselWidth,
        vesselsTypeStr: this.vesselsTypeStr,
        vesselsType: this.vesselsType,
        color: this.vesselColor,
        remark: this.remark
      }
      let _this = this;
      let type = this.confirmButtonType;
      switch (type) {
        case 'update':
          updateVessel(vessel).then(() => {
            //新增成功后改变表格中显示的信息
            _this.emitVesselInfoChanged();
          });
          break;
        case 'add':
          createVessel(vessel).then(() => {
            //新增成功后改变表格中显示的信息
            _this.emitVesselInfoChanged();
          });
          break;
      }
      this.hiddenDialog();
    },
    /**
     * 改变船舶的img
     * @param vesselTypeValue{number} 0:邮轮,1:天然气船,2:集装箱船,3:散货船
     */
    changeVesselImg(vesselTypeValue) {
      this.vesselImg = getVesselFileByType(vesselTypeValue);
    },
    /**
     * 发射船舶信息改变事件
     */
    emitVesselInfoChanged() {
      this.$emit('vesselInfoChanged')
    },
    /**
     * 赋值
     * @param vesselObj
     */
    assignment(vesselObj) {
      this.vesselId = vesselObj.id;
      this.vesselName = vesselObj.name;
      this.vesselLength = vesselObj.length;
      this.vesselWidth = vesselObj.width;
      this.vesselsTypeStr = vesselObj.vesselsTypeStr;
      this.vesselsType = vesselObj.vesselsType;
      this.vesselImoNumber = vesselObj.imoNumber;
      this.vesselColor = vesselObj.color;
      this.remark = vesselObj.remark;
    }
  }
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: right;
}

</style>
