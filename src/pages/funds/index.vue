<script setup lang="ts">
import chat from '~/svg/chat.svg'
import {carousel, getFundList} from "@/api";
import router from "@/router";
import type {PickerColumn} from 'vant'
import {languageColumns} from "@/utils/i18n";

const {t} = useI18n()

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
  location.reload();
}

//首页轮播图
const carouselList = ref({})

//基金列表
const list = ref([]);
//列表加载
const loading = ref(false);
//加载完成标识
const finished = ref(false);
//清空列表数据标识
const refreshing = ref(false);
//页码
const pageNum = ref(1);
//页容量
const pageSize = ref(10);
//基金周期(0全部，1短期，2中长期，3长期)
const cycle = ref(0);

//基金列表数据加载
const onLoad = () => {
  console.log(list.value)
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
    // cycle.value = 0
  }
  getFundList(pageNum.value, pageSize.value, cycle.value).then(res => {
    if (res.code === 200) {
      if (res.data.length <= 0) {
        finished.value = true;
      } else {
        list.value = list.value.concat(res.data);
        pageNum.value = pageNum.value + 1
      }
      loading.value = false;
    } else {
      loading.value = false;
    }
  })
};

//下拉刷新触发
const onRefresh = () => {
  // 加载完成标识
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

//点击标签触发
const cycleRefresh = () => {
  refreshing.value = true;
  onRefresh();
};

function getCarousel(type: number) {
  carousel(type).then(res => {
    if (res.code === 200) {
      carouselList.value = res.data
    }
  })
}

function gotoFundInfo(item) {
  router.push({name: 'fundInfo', query: {id: item.id}})
}

onMounted(() => {
  getCarousel(2)
})

</script>

<template>
  <div class="main">
    <div class="topBox">
      <div>
        <div @click="showLanguagePicker = true" style="font-size: 25px; " class="i-carbon:earth-filled"/>
      </div>
      <div>{{ t('fund.title') }}</div>
      <div>
        <van-image :src="chat" class="h-25 w-25"/>
      </div>
    </div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in carouselList">
        <img style="height: 100%; width: 100%; object-fit: cover;" :src="item.url" alt=""/>
      </van-swipe-item>
    </van-swipe>

    <div>
      <van-tabs @change="cycleRefresh" v-model:active="cycle">
        <van-tab :title="t('fund.all')"/>
        <van-tab :title="t('fund.short')"/>
        <van-tab :title="t('fund.medium')"/>
        <van-tab :title="t('fund.longTime')"/>
      </van-tabs>
    </div>

    <div class="fundsBox">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          :offset="100"
          v-model:loading="loading"
          :finished="finished"
          :finished-text="t('common.noMore')"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item">
            <div class="fund">
              <div class="fundTitle">
                <div class="flex items-center">
                  <div style="margin-right: 5px; font-weight: 400">{{ item.name }}</div>
                  <div v-if="item.hot" class="fundTag">{{ t('fund.hot') }}</div>
                  <div v-if="item.stable" class="fundTag" style="background-color: #4975ea">{{ t('fund.stable') }}</div>
                </div>
<!--                <div style="color: red; ">
                  <van-image :src="fire" class="h-17 w-17"/>
                  {{ item.readNum }}人看过
                </div>-->
              </div>
              <div class="mid mt-5px">
                <div class="flex items-center">
                  <img :src="item.cover" class="h-50 w-50 mr-8px border-rd-4px" alt=""/>
                  <div style="text-align: center">
                    <div class="text-#EC4236 text-16px font-600">{{ item.profit }}</div>
                    <div class="label">{{ t('fund.monthRate') }}</div>
                  </div>
                </div>
                <div>
                  <div class="text-#4a79e7 ">
                    <van-icon name="clock" />
                    {{ item.cycle + t('common.day') }}</div>
                  <div class="label">{{ t('fund.renewal') }}</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-around; text-align: center">
                <div @click="gotoFundInfo(item)" class="applyBtn">{{ t('fund.invest') }}</div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <!--语言切换-->
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker
        v-model="languageValues"
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>

body {
  color: #FFFFFF;
}

.topBox {
  display: flex;
  font-size: 20px;
  color: #FFF;
  height: 50px;
  margin: 0 15px;
  align-items: center;
  justify-content: space-between;
}

.main {
  background: linear-gradient(rgba(74, 121, 231, 1) 0%, rgba(74, 121, 231, 1) 10%, rgba(255, 255, 255, 1) 25%);
  //background: url("/bj.png") no-repeat 100%;
  background-size: cover;
  height: 92vh;
  min-height: 92vh;
}

.my-swipe {
  margin: 0 15px;
  height: 150px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.my-swipe .van-swipe-item {
  color: #fff;
  //font-size: 20px;
  //line-height: 150px;
  text-align: center;
}

.fundsBox {
  padding: 1px 0 50px 0;
  height: 99.9vh;
  overflow-y: auto;

  .van-cell {
    padding: 0;
  }

  .fund {
    margin: 10px 15px;
    height: 145px;
    border-radius: 10px;
    background-color: #FFFFFF;
    padding: 8px 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .fundTitle {
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid #babec5;
    }

    .fundTag {
      line-height: normal;
      color: #FFFFFF;
      font-size: 13px;
      margin-right: 5px;
      background-color: red;
      padding: 1px 3px 3px 4px;
      border-radius: 5px;
    }

    .label {
      font-size: 12px;
      color: #909399;
    }

    .mid {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .applyBtn {
      height: 30px;
      width: 235px;
      margin-top: 8px;
      background-color: #4975ea;
      color: #FFFFFF;
      border-radius: 15px;
      text-align: center;
      line-height: 30px;
    }
  }
}

</style>

<route lang="json">
{
"name": "funds"
}
</route>