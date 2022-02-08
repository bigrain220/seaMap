<template>
  <div class="c-weather-viewer">
    <div class="cw-main">
      <div class="cw-content">
        <span class="weather-temp"
              :class="{'focus-shadow':Math.abs(temp)>=50}"
              :style="{color:range.temp.color(temp)}">
        {{ tempShow }}°
      </span>
        <div class="cw-tips-all">
          <span class="cw-tips weather-humidity"
                :style="{background:humidity && range.humidity.color(humidity)}"
          >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-w_shidu"></use>
        </svg>
        <span class="value">{{ humidityShow }}</span>
        <span class="unit">%</span>
      </span>
          <span class="cw-tips weather-rain"
                :style="{background: rain && range.rain.color(rain)}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tianqizitiku28"></use>
        </svg>
        <span class="value">{{ rainShow }}</span>
        <span class="unit">mm</span>
        </span>
        </div>
      </div>
    </div>
    <div class="cw-other">
      <div class="cw-content">
        <span class="weather-wind">
          <svg class="icon" aria-hidden="true" :style="{transform: `rotate(${wind.dir + 135}deg)`}">
            <use xlink:href="#icon-tianqi-fengxiang"></use>
          </svg>
          <span class="value">{{ windShow }}</span>
        </span>
        <span class="weather-pressure">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-qiya"></use>
          </svg>
          <span class="value">{{ pressureShow }}</span>
          <span class="unit">hPa</span>
        </span>
        <span class="weather-visibility">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yanjing-tianchong"></use>
          </svg>
          <span class="value">{{ visibilityShow.value }}</span>
          <span class="unit">{{ visibilityShow.unit }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {scaleLinear, scaleThreshold} from "d3-scale";

export default {
  name: "Weather",
  props: {
    temp: {
      type: Number,
    },
    wind: {
      dir: {
        type: Number,
      },
      speed: {
        type: Number,
      }
    },
    humidity: {
      type: Number,
    },
    rain: {
      type: Number,
    },
    pressure: {
      type: Number,
    },
    visibility: {
      type: Number
    }
  },
  data() {
    return {
      range: {
        wind: {
          level: scaleThreshold()
              .domain([0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.4, 28.4, 32.6, 36.9, 41.4, 46.1, 50.9, 56])
              .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
          dir: scaleThreshold()
              .domain([11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25, 348.75, 360])
              .range(['北', '东北', '东', '东南', '南', '西南', '西', '西北', '北']),
        },
        temp: {
          color: scaleLinear()
              .domain([-100, -50, -30, 0, 26, 40, 50])
              .range(['#fb2502', '#ee9709',
                '#66ccff', '#ffffff', '#a3d765',
                '#ee9709', '#fb2502']),
        },
        humidity: {
          color: scaleLinear()
              .domain([0, 20, 40, 60, 80, 100])
              .range(['#fb2502', '#faa644',
                '#a3d765', '#a3d765',
                '#66ccff', '#3714d0']),
        },
        rain: {
          color: scaleLinear()
              .domain([0, 25, 50, 100, 250])
              .range(['#a3d765', '#00e4ff',
                '#ffa700', '#ff7700',
                '#f53527'])
        }
      },
    }
  },
  computed: {
    tempShow() {
      return this.temp?.toFixed() ?? "N";
    },
    humidityShow() {
      return this.humidity?.toFixed() ?? "N";
    },
    windShow() {
      const {speed, dir} = this.wind;
      const {level, dir: dS} = this.range.wind;
      return `${dS(dir ?? undefined)?.concat("风") ?? '风向'}  ${level(speed ?? undefined)?.toString().concat("级") ?? '风速'}`;
    },
    rainShow() {
      return this.rain ?? "N";
    },
    pressureShow() {
      return this.pressure?.toFixed(1) ?? "N";
    },
    visibilityShow() {
      const {visibility} = this;
      const value = visibility ?? "N";
      return {
        value: isNaN(value) ? value : value >= 10 ? value.toFixed(1) : (value * 1000).toFixed(),
        unit: value >= 10 ? 'km' : 'm'
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    }
  }
}
</script>

<style scoped>
.c-weather-viewer {
  height: calc(100% - 2rem);
  padding: 1rem;
  font-size: 2.2vh;
}

.c-weather-viewer span {
  white-space: nowrap;
}

.cw-main {
  height: 70%;
  display: flex;
  align-items: center;
}

.cw-other {
  height: 30%;
  display: flex;
  align-items: center;
}

.cw-content {
  display: flex;
  align-items: baseline;
  flex-flow: row wrap;
}

.cw-other > .cw-content {
  width: 100%;
  justify-content: space-between;
}

.cw-other > span {
  margin-right: 1em;
}

.cw-other > span > span {
  padding-left: .2em;
}

.focus-shadow {
  text-shadow: 0 0 0.05em;
  animation-name: focus-shadow-breath;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes focus-shadow-breath {
  from {
    text-shadow: 0 0 0.01em;
  }
  50% {
    text-shadow: 0 0 0.05em;
  }
  to {
    text-shadow: 0 0 0.01em;
  }
}

.weather-temp {
  color: white;
  line-height: 1;
  font-size: 6em;
}

.unit {
  font-size: .5em;
}

.cw-tips {
  background: #a3d765;
  color: white;
  border-radius: 1em;
  height: 1.3em;
  line-height: 1.3em;
  padding: 0.05em .5em 0.05em .4em;
  margin: 0 5px;
}

.cw-tips .icon {
  padding-right: .2em;
}

.cw-tips-all {
  margin-top: .5em;
}

.cw-tips-all .cw-tips {
  border-radius: 0;
  margin: 0;
}

.cw-tips-all .cw-tips:first-of-type {
  border-radius: 1em 0 0 1em;
}

.cw-tips-all .cw-tips:last-of-type {
  border-radius: 0 1em 1em 0;
}


</style>