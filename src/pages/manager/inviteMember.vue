<script setup lang="ts">

import router from "@/router";
import {getManagerCount, getManagerList} from "@/api/csUser";

const {t} = useI18n()

const count = ref({
  todayNum: undefined,
  await: undefined,
  today: undefined,
  total: undefined,
});

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);

const onLoad = () => {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
  }
  getManagerList(pageNum.value, pageSize.value).then(res => {
    if (res.code === 200) {
      if (res.data.length <= 0) {
        finished.value = true;
      } else {
        list.value = list.value.concat(res.data);
        pageNum.value = pageNum.value + 1
      }
    }
    loading.value = false;
  })
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

function getCountInfo() {
  getManagerCount().then(res => {
    if (res.code === 200) {
      count.value = res.data
    }
  })
}

onMounted(() => {
  getCountInfo();
})
</script>

<template>
  <div class="main">
    <div class="topBox">
      <van-icon @click="retreat" style="font-size: 25px; position: absolute; top: 14px; left: 10px" name="arrow-left"/>
      <div><span>{{ t('manager.invitation') }}</span></div>
      <div></div>
    </div>

    <div class="flex flex-col items-center mt-25px text-#FFFFFF">
      <div class="text-14px">
        <span>{{ t('manager.totalRevenue') }}(USD)</span>
      </div>
      <div class="text-20px mt-10px">
        <span>{{ count.total }}</span>
      </div>
      <div class="infoBox">
        <div style="">
          <div><span>{{ count.today }}</span></div>
          <div style="font-size: 14px"><span>{{ t('user.todayEarnings') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#FFFFFF', height: '37px', borderWidth: '1px' }"/>
        <div>
          <div><span>{{ count.await }}</span></div>
          <div style="font-size: 14px"><span>{{ t('user.proceeds') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#FFFFFF', height: '37px', borderWidth: '1px' }"/>
        <div>
          <div><span>{{ count.todayNum }}</span></div>
          <div style="font-size: 14px"><span>{{ t('manager.newToday') }}</span></div>
        </div>
      </div>
    </div>

    <div class="memberBox">
      <div>
        <span>{{ t('manager.teamDetail') }}</span>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="t('common.noMore')"
          @load="onLoad"
        >
          <van-cell style="text-align: left; padding: 10px 0" v-for="item in list">
            <div style="text-align: left">
              <div class="flex justify-between">
                <div class="flex">
                  <van-image
                    style="margin-right: 5px"
                    round
                    fit="cover"
                    width="50px"
                    height="50px"
                    :src="item.avatar"
                  />
                  <div>
                    <div class="text-#1E1E1E">
                      <span>{{ item.nickName }}</span>
                    </div>
                    <div>
                      <span>{{ item.userId }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span>{{ t('manager.invited') }} <span class="text-#3A76F2">{{
                      item.inviteNum
                    }}</span>{{ t('manager.person') }}</span>
                </div>
              </div>
              <div class="infoBoxTwo">
                <div>
                  <div class="text-#1E1E1E"><span>{{ item.total }}</span></div>
                  <div style="font-size: 13px"><span>{{ t('manager.contribution') }}</span></div>
                </div>
                <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '28px', borderWidth: '1px' }"/>
                <div>
                  <div class="text-#1E1E1E"><span>{{ item.await }}</span></div>
                  <div style="font-size: 13px"><span>{{ t('user.proceeds') }}</span></div>
                </div>
                <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '28px', borderWidth: '1px' }"/>
                <div>
                  <div class="text-#1E1E1E"><span>{{ item.inviteToday }}</span></div>
                  <div style="font-size: 13px"><span>{{ t('manager.todayInvitation') }}</span></div>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  padding: 12px;
  min-height: 100vh;
  background: #3A76F2;

  .topBox {
    font-size: 17px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
  }

  .infoBox {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    text-align: center;
    width: 70vw;
  }


  .infoBoxTwo {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
    text-align: center;
    align-items: center;
  }

  .memberBox {
    margin-top: 20px;

    background: #FFFFFF;
    box-shadow: 0px 5px 8px 0px rgba(180, 180, 180, 0.33);
    border-radius: 10px;
    padding: 10px;
    font-size: 14px;

  }

}
</style>

<route lang="json">
{
"name": "inviteMember"
}
</route>