<script setup lang="ts">
import {getNewsList, getRollNotice} from '@/api'
import router from '@/router'
import {languageColumns, locale} from '@/utils/i18n'
import type {PickerColumn} from 'vant'

const {t} = useI18n()

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
  location.reload();
}

//新闻数据
const list = ref([]);
//加载标识
const loading = ref(false);
//加载结束标识
const finished = ref(false);
//刷新标识
const refreshing = ref(false);
//滚动消息
const roll = ref(undefined);
//页码
const pageNum = ref(1);
//页容量
const pageSize = ref(10);
//新闻标题搜索
const title = ref("");

const onLoad = () => {
  console.log(refreshing.value)
  if (refreshing.value) {
    console.log('???????????????')
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
  }
  getNewsList(pageNum.value, pageSize.value, title.value).then(res => {
    if (res.code === 200) {
      if (res.data.length <= 0) {
        finished.value = true;
      } else {
        list.value = list.value.concat(res.data)
        loading.value = false;
        pageNum.value = pageNum.value + 1
      }
    }
  })
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

//获取滚动消息
const rollNotice = () => {
  getRollNotice().then(res => {
    if (res.code === 200) {
      roll.value = res.data
    }
  })
};

function gotoNewsInfo(item) {
  router.push({name: 'newsInfo', query: {id: item.id}})
}

//初始化加载
onMounted(() => {
  rollNotice()
})

function onSearch() {
  refreshing.value = true
  onLoad();
}

</script>

<template>
  <div class="main">
    <div class="topBox">
      <div>
        <span class="color-#FFF">inETF</span>
      </div>
      <van-search class="h-50px w-330px" v-model="title" @search="onSearch" background="#4975ea"
                  :placeholder="t('common.searchNews')"/>
      <div @click="showLanguagePicker = true">
        <div style="font-size: 28px; " class="i-carbon:earth-filled"/>
      </div>
    </div>
    <div>
      <van-notice-bar
        v-if="roll"
        background="none"
        color="#000"
        left-icon="volume-o"
        :text="roll"
      />
    </div>
    <div class="listBox">
      <!--      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">-->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="t('common.noMore')"
        @load="onLoad"
      >
        <van-cell @click="gotoNewsInfo(item)" class="newsList" v-for="item in list" :key="item">
          <div class="news">
            <div class="mr-7px">
              <img v-if="item.cover" :src="item.cover" class="h-80px w-80px object-cover border-rd-5px" alt=""/>
            </div>
            <div class="crBox w-100%">
              <div>
                <van-text-ellipsis
                  rows="2"
                  class="text-13px color-#000"
                  :content="item.title"
                />
              </div>
              <div>
                <van-text-ellipsis rows="1" class="text-12px" :content="item.intro"/>
              </div>

              <div class="flex justify-between">
                <div>{{ item.createTime }}</div>
                <!--                  <div class="flex">
                                    <div>
                                      <van-tag style="font-size: 8px; margin-bottom: 5px" plain color="#999999" type="primary">{{item.tag}}</van-tag>
                                    </div>
                                    <div class="flex items-center mr-5px">
                                      <div class="i-carbon:favorite mr-2px"></div>
                                      &lt;!&ndash;                      <div class="i-carbon:favorite-filled"></div>&ndash;&gt;
                                      <div>{{ item.likeNum }}</div>
                                    </div>
                                    <div class="flex items-center">
                                      <div class="i-carbon:view mr-2px"></div>
                                      <span>{{ item.viewNum }}</span>
                                    </div>
                                  </div>-->
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
      <!--      </van-pull-refresh>-->
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
.main {
  width: 100vw;
  background: url("/bj.png") no-repeat;
  //background: none;
  background-size: cover;
  height: 92vh;
}

.topBox {
  display: flex;
  font-size: 17px;
  color: #FFFFFF;
  height: 50px;
  padding: 0 10px;
  //margin: 0 15px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: #4975ea;
}

.listBox {
  height: 99.9vh;
  overflow-y: auto;
  padding-bottom: 50px;

  .newsList {
    height: 100px;
    margin: 10px;
    padding: 10px;
    width: 352px;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .news {
      height: 100px;
      text-align: left;
      display: flex;
    }
  }

  .crBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 85px;
  }
}
</style>

<route lang="json">
{
"name": "news"
}
</route>