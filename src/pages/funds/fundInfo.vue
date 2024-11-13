<script setup lang="ts">
import router from "@/router";
import {useRoute} from "vue-router";
import {getFundInfo, getFundNewWorth, getFundNewWorthHistory, getFundTrend, getTrendHistory} from "@/api/funds";

const {t} = useI18n()

const barOption = {
  grid: {
    x: 45, // 左侧边距
    y: 10, // 顶部边距
    x2: 15, // 右侧边距
    y2: 30 // 底部边距
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['10-31', '11-01', '11-02', '11-03', '11-04', '11-05', '11-06']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [420, 532, 601, 734, 890, 830, 820],
      type: 'line',
      areaStyle: {
        color: '#eaf3fe'
      },
      emphasis: {
        color: '#eaf3fe'
      }
    },
    {
      data: [320, 432, 501, 634, 790, 830, 720],
      type: 'line',
      itemStyle: {
        color: 'red',
        lineStyle: {
          color: 'red' // 线的颜色
        }
      },
      areaStyle: {
        color: '#faeae7'
      },
      emphasis: {
        color: '#faeae7'
      }
    }
  ]
};
const barOptionTwo = {
  grid: {
    x: 45, // 左侧边距
    y: 10, // 顶部边距
    x2: 15, // 右侧边距
    y2: 30 // 底部边距
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['10-31', '11-01', '11-02', '11-03', '11-04', '11-05', '11-06']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [520, 632, 701, 834, 990, 930, 820],
      type: 'line',
      areaStyle: {
        color: '#eaf3fe'
      },
      emphasis: {
        color: '#eaf3fe'
      }
    }
  ]
};

const trendHistList = ref([])
const worthHistList = ref([])

const fundId = ref(undefined)
const trendData = ref({
  average: undefined,
  rate: undefined,
})
const worthData = ref({
  fundRatio: undefined,
  netValue: undefined,
  date: undefined,
})

function gotoBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

function gotoPay() {
  router.push({name: 'subscribe', query: {id: fundId.value}})
}

const active = ref(0);
const activeTwo = ref(0);
const chartsOne = ref(false);
const chartsTwo = ref(false);
const info = ref({
  id: undefined,
  name: undefined,
  cycle: undefined,
  dayRate: undefined,
  profit: undefined,
  stable: undefined,
  hot: undefined,
  info: undefined,
});

function chartsLazyLoad() {
  setTimeout(() => {
    if (active.value === 0) {
      getFundTrend(fundId.value).then(res => {
        if (res.code === 200) {
          trendData.value = res.data;
          let dataList = res.data.dataList;
          let dateArr = [];
          let valueArr = []
          let meanArr = []
          for (let i = 0; i < dataList.length; i++) {
            dateArr.push(dataList[i].date)
            valueArr.push(dataList[i].value)
            meanArr.push(dataList[i].meanRatio)
          }
          barOption.xAxis.data = dateArr
          barOption.series[0].data = valueArr
          barOption.series[1].data = meanArr
          chartsOne.value = true
        }
      })
    } else {
      getFundNewWorth(fundId.value).then(res => {
        if (res.code === 200) {
          worthData.value = res.data
          let dataList = res.data.dataList;
          let dateArr = []
          let valueArr = []
          for (let i = 0; i < dataList.length; i++) {
            dateArr.push(dataList[i].date)
            valueArr.push(dataList[i].value)
          }
          barOptionTwo.xAxis.data = dateArr
          barOptionTwo.series[0].data = valueArr
          chartsTwo.value = true
        }
      })
    }
  }, 100)
}

function chartsLoad() {
  if (activeTwo.value === 0) {
    getTrendHistory(fundId.value).then(res => {
      if (res.code === 200) {
        trendHistList.value = res.data
      }
    })
  } else {
    getFundNewWorthHistory(fundId.value, 1, 10).then(res => {
      if (res.code === 200) {
        worthHistList.value = res.data
      }
    })
  }
}

function fundInfo(id) {
  getFundInfo(id).then(res => {
    if (res.code === 200) {
      info.value = res.data
    }
  })
}

onMounted(() => {
  let route = useRoute();
  fundId.value = route.query.id
  fundInfo(fundId.value)
})

const refBarOption = ref(barOption)
const refBarOptionTwo = ref(barOptionTwo)

function shareCheck() {
  let share = {
    title: 'inETF',
    text: 'Professional ETF',
    url: '',
  }
  navigator.share(share);
}

</script>

<template>
  <div class="main">
    <div class="topBox">
      <van-icon @click="gotoBack" style="font-size: 25px" name="arrow-left"/>
      <div>
        <span>{{ t('fund.product') }}</span>
      </div>
      <van-icon @click="shareCheck" style="font-size: 22px" name="share-o"/>
    </div>

    <div class="cardBox" style="padding: 10px">
      <div><span style="font-size: 18px;">{{ info.name }}</span></div>
      <div class="subhead">
        <div style="color: #666666">{{ info.id }}</div>
        <div v-if="info.hot" class="fundTag">{{ t('fund.hotL') }}</div>
        <div v-if="info.stable" class="fundTag" style="background-color: #4975ea">{{ t('fund.stableL') }}</div>
      </div>
      <div class="flex justify-between mt-10px items-center ">
        <div>
          <div style="font-size: 18px; color: #EC4236; font-weight: 600">+{{ info.profit }}</div>
          <div class="text-13px text-#999999">{{ t('fund.monthRate') }}</div>
        </div>
        <div class="flex items-center">
          <div class="mr-25px">
            <div class="text-#EC4236">+{{ info.dayRate }}%</div>
            <div class="text-13px text-#999999">{{ t('fund.dailyRate') }}</div>
          </div>
          <div>
            <div>{{ info.cycle + t('common.day') }}</div>
            <div class="text-13px text-#999999">{{ t('fund.cycle') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="cardBox" style="padding-bottom: -30px">
      <van-tabs @rendered="chartsLazyLoad" v-model:active="active">
        <van-tab :title="t('fund.trend')">
          <div class="flex mt-13px mb-13px text-14px">
            <div class="flex items-center ml-12px">
              <div class="parent-node"></div>
              <span class="">{{ t('fund.theFund') }}: <span class="text-#EC4236">+{{ trendData.rate }}%</span></span>
            </div>
            <div class="flex items-center ml-20px">
              <div class="parent-node parent-red" style="color: red; "></div>
              <span>{{ t('fund.meanValue') }}: <span class="text-#EC4236">+{{ trendData.average }}%</span></span>
            </div>
          </div>
          <div style="height: 200px">
            <Chart v-if="chartsOne" :option="refBarOption" :style="{ height: '200px' }"/>
          </div>
        </van-tab>
        <van-tab :title="t('fund.nav')">
          <div class="flex justify-around text-center mt-6px mb-5px text-12px">
            <div class="ml-12px">
              <div class="mb-3px"><span>{{ t('common.date') }}</span></div>
              <div><span>{{ worthData.date }}</span></div>
            </div>
            <div class="ml-12px">
              <div class="mb-3px"><span>{{ t('fund.nav') }}</span></div>
              <div><span>{{ worthData.netValue }}</span></div>
            </div>
            <div class="ml-12px">
              <div class="mb-3px"><span>{{ t('fund.dailyIncrease') }}</span></div>
              <div class="text-#EC4236"><span>{{ worthData.fundRatio }}%</span></div>
            </div>
          </div>
          <div style="height: 200px">
            <Chart v-if="chartsTwo" :option="refBarOptionTwo" :style="{ height: '200px' }"/>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="cardBox" style="padding-bottom: 1px">
      <van-tabs @rendered="chartsLoad" v-model:active="activeTwo">
        <van-tab :title="t('fund.historical')">
          <div class="pl-15px pr-15px pt-15px  text-14px  lh-1px text-#999999">
            <div class="flex justify-between ">
              <div>{{ t('common.date') }}</div>
              <div>{{ t('common.rate') }}</div>
              <div>{{ t('common.mean') }}</div>
            </div>
            <van-divider/>
          </div>
          <div v-for="item in trendHistList" class="flex justify-between pl-15px pr-15px mb-15px text-14px">
            <div>{{ item.date }}</div>
            <div v-if="item.value >= 0" class="text-#39A51C w-65px">+{{ item.value }}%</div>
            <div v-else class="text-#EC4236 w-65px">-{{ item.value }}%</div>
            <div v-if="item.meanRatio >= 0" class="text-#39A51C w-65px">+{{ item.meanRatio }}%</div>
            <div v-else class="text-#EC4236 w-65px">-{{ item.meanRatio }}%</div>
          </div>
        </van-tab>
        <van-tab :title="t('fund.histValue')">
          <div class="pl-15px pr-15px pt-15px  text-14px  lh-1px text-#999999">
            <div class="flex justify-between ">
              <div>{{ t('common.date') }}</div>
              <div>{{ t('fund.nav') }}</div>
              <div>{{ t('fund.totalNav') }}</div>
              <div>{{ t('fund.dailyRate') }}</div>
            </div>
            <van-divider/>
          </div>
          <div v-for="item in worthHistList" class="flex justify-between pl-15px pr-15px mb-15px text-14px">
            <div class="w-60px">{{ item.date }}</div>
            <div class="w-60px">{{ item.netWorth }}</div>
            <div class="w-60px">{{ item.total }}</div>
            <div v-if="item.ratio >= 0" class="text-#39A51C w-60px text-right">+{{ item.ratio }}%</div>
            <div v-else class="text-#EC4236 w-60px text-right">{{ item.ratio }}%</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div>
      <content :info="info.info"/>
    </div>
    <div style="height: 60px">
    </div>
    <div class="bottomBox">
      <van-button @click="gotoPay" style="width: 85%; height: 70%;" round block type="primary"
                  color="linear-gradient(-61deg, #4C93FF, #2964E6)" native-type="submit">
        {{ t('fund.invest') }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">

.main {
  padding: 12px;
  background: linear-gradient(180deg, rgba(74, 121, 231, 1) 0%, rgba(74, 121, 231, 1) 10%, rgba(239, 241, 239, 1) 25%);
  height: 100vh;

  .topBox {
    display: flex;
    height: 30px;
    color: #FFFFFF;
    font-size: 17px;
    align-items: center;
    justify-content: space-between;
    //padding: 25px 15px 15px 15px;
  }

  .cardBox {
    background-color: #FFFFFF;
    border-radius: 10px;
    margin-top: 15px;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  //样式穿透
  :deep(.van-tabs__wrap) {
    border-radius: 10px;
    position: relative;
    z-index: 999;
  }

  .subhead {
    margin-top: 5px;
    display: flex;
  }

  .fundTag {
    color: #FFFFFF;
    font-size: 12px;
    margin-left: 5px;
    background-color: red;
    padding: 1px 3px;
    border-radius: 5px;
    align-items: center;
  }

  .parent-node {
    &::before {
      content: '';
      display: block;
      width: 5px;
      height: 5px;
      background: #3A76F2;
      border-radius: 50%;
      margin-right: 6px;
    }
  }

  .parent-red {
    &::before {
      background: red;
    }
  }

  .bottomBox {
    height: 60px;
    width: 100%;
    background-color: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}

</style>
<route lang="json">
{
"name": "fundInfo",
"title": "账户安全"
}
</route>