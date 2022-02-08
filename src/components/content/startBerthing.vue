<template>
  <div>
    <el-row>
      <!--选择区域-->
      <el-col :span="6">
        泊位名称：
        <!--<el-select v-model="berthName">
            <el-option
                    v-for="name in allBerthName"
                    :value="name.value"
                    :label="name.label"
                    :key="name.value"
            />
&lt;!&ndash;                    <el-option label="测试泊位" value="111111"/>&ndash;&gt;
        </el-select>-->
        <el-input disabled :value="berthName"/>
        船舶名称：
        <el-select v-model="vesselId" @change="vesselsSelectChange">
          <el-option
              v-for="name in allVesselName"
              :value="name.value"
              :label="name.label"
              :key="name.value"
          />
        </el-select>
        靠泊方向：
        <el-select v-model="berthingDir">
          <el-option value="L" label="左舷靠泊"/>
          <el-option value="R" label="右舷靠泊"/>
        </el-select>
      </el-col>
      <!--预览区域-->
      <el-col :span="18">
        <vessel-animation
            id="startBerthing_vessel"
            :vessel-svg-name="vesselSvgName"
            :terminal-show="false"
        />
      </el-col>
    </el-row>
    <div class="footer">
      <!--            <el-button>取 消</el-button>-->
      <el-button type="primary" @click="clickConfirmButton">确认</el-button>
    </div>
  </div>
</template>

<script>
import vesselAnimation from "@/components/content/vesselAnimation";
import {listVessel} from "@/network/request-api";
import {each} from "@/util/common";
import {deleteObj, getVesselFileByType} from "@/util/content";
/*开启靠泊的弹窗*/
export default {
  name: "startBerthing",
  components: {
    vesselAnimation
  },
  props: {
    //[{value,label}]
    //value：泊位id,label:泊位名称
    allBerthName: {
      type: Array
    },
    berthName: {
      type: String,
      default: "Default"
    }
    //[{value,label,vesselType}]
    //value: 船舶id label:船舶名称 vesselType:船舶类型
    // allVesselName: {
    //   type: Array,
    // }
  },
  beforeMount() {
    this.getAllVessels();
  },
  data() {
    return {
      // berthName: '测试泊位',
      allVesselName: [],
      vesselId: '',
      vesselType: 0,
      berthingDir: 'L',

    }
  },
  computed: {
    vesselSvgName() {
      return getVesselFileByType(this.vesselType, this.berthingDir);
    }
  },
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {
    getAllVessels() {
      let _this = this;
      listVessel().then(data => {
        _this.allVesselName = [];
        each(data, (index, vesselsObj) => {
          let id = vesselsObj['id'];
          let imoNumber = vesselsObj['imoNumber'];
          let vesselName = vesselsObj['name'];
          let vesselsType = vesselsObj['vesselsType'];
          let vessel = {value: id, label: vesselName, vesselsType, imoNumber};
          _this.allVesselName.push(vessel);
        });
      })
    },
    /**
     * 船舶选项框改变事件
     * @param vesselId
     */
    vesselsSelectChange(vesselId) {
      let allVesselName = this.allVesselName;
      for (const vessel of allVesselName) {
        if (vessel.value === vesselId) {
          this.vesselType = vessel.vesselsType;
          break;
        }
      }
    },
    /**
     * 点击确定按钮事件
     */
    clickConfirmButton() {
      let vesselId = this.vesselId;
      let allVesselName = this.allVesselName;
      for (const vessel of allVesselName) {
        if (vessel.value === vesselId) {
          let ship = {
            vesselId: vessel.value,
            vesselName: vessel.label,
            vesselSvgName: this.vesselSvgName,
            berthingDir: this.berthingDirToInt(this.berthingDir),
          };
          this.$emit("confirm", ship);
          break;
        }
      }
    },
    /**
     * 把左右靠泊标志转成int
     * @param berthingDir "L" or "R"
     * @return {Number} "L"->1 "R"->0
     */
    berthingDirToInt(berthingDir) {
      return berthingDir === 'L' ? 1 : 0;
    }
  }
}
</script>

<style scoped>
.el-col-18 {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

#startBerthing_vessel {
  height: 100%;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

</style>