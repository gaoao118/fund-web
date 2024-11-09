<script setup lang="ts">

import router from "@/router";
import QrcodeVue from "qrcode.vue";
import {getUserManagerInfo} from "@/api/csUser";
import logo from '~/images/logo.jpg'
import {showSuccessToast} from "vant";

const {t} = useI18n()

const qrCodeWidth = ref(165);
const info = ref({avatar: logo, inviteCode: ''});

function retreat() {
  router.back()
}

function gotoInviteMember() {
  router.push({name: 'inviteMember'})
}

function gotoManager() {
  router.push({name: 'manager'})
}

function getInfo() {
  getUserManagerInfo().then(res => {
    if (res.code === 200) {
      info.value = res.data
    }
  })
}

function inviteCodeCopy() {
  navigator.clipboard.writeText(info.value.inviteCode).then(res => {
    showSuccessToast(t('pay.copySuc'));
  });
}

function urlCopy() {
  navigator.clipboard.writeText(info.value.url).then(res => {
    showSuccessToast(t('pay.copySuc'));
  });
}

onMounted(() => {
  qrCodeWidth.value = document.getElementById('qrCode').clientWidth - 30;
  getInfo();
})

</script>

<template>
  <div class="main">
    <div class="topBox">
      <van-icon @click="retreat" style="font-size: 25px; color: #cbc9c9; " name="arrow-left"/>
      <van-icon @click="gotoManager" style="font-size: 20px; color: #3A76F2; " name="question"/>
    </div>
    <div class="countBox">
      <div style="position: relative; display: flex; justify-content: space-evenly;">
        <div style="position: absolute; top: -35px; font-size: 15px">
          <van-image
            style="height: 50px; width: 50px;"
            round
            fit="cover"
            width="10rem"
            height="10rem"
            :src="info.avatar ? info.avatar : logo"
          />
          <div>
            <span>{{ info.nickName }}</span>
          </div>
        </div>
      </div>
      <div class="mt-55px flex justify-around">
        <div>
          <div @click="gotoInviteMember">
            <span>{{ info.number }}</span>
            <van-icon color="#787878" name="question-o"/>
          </div>
          <div class="text-#787878 text-12px"><span>{{ t('manager.invitation') }}</span></div>
        </div>
        <div>
          <div><span>{{ info.teamAmount }}</span></div>
          <div class="text-#787878 text-12px"><span>{{ t('manager.teamRevenue') }}</span></div>
        </div>
        <div>
          <div><span>{{ info.teamAwait }}</span></div>
          <div class="text-#787878 text-12px"><span>{{ t('manager.teamYield') }}</span></div>
        </div>
      </div>
    </div>

    <div class="codeBox">
      <div class="mb-10px">
        <span>{{ t('manager.myCode') }}</span>
      </div>
      <div class="flex justify-center">
        <div class="block" v-for="item in info.inviteCode.split('')">
          {{ item }}
        </div>
        <div @click="inviteCodeCopy" class="block">
          <div class="i-carbon:copy"/>
        </div>
      </div>
      <div id="qrCode" class="qrCodeBox">
        <qrcode-vue :value="info.url" :size="qrCodeWidth"/>
      </div>
      <div class="text-12px text-#3A76F2 mt-10px">
        <span>{{ t('manager.pressSave') }}</span>
      </div>
      <div @click="urlCopy" class="linkBox">
        <van-text-ellipsis style="width: 90%"
                           :content="info.url"/>
        <div style="display: inline-block; color: #3A76F2; font-size: 18px" class="i-carbon:copy"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  height: 100vh;
  background: url("/bj-manager.png") no-repeat;
  background-size: cover;
  padding: 12px;

  .topBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .countBox {
    //height: 100px;
    margin-top: 50px;
    background: #FFFFFF;
    box-shadow: 0px 9px 35px 0px rgba(15, 114, 235, 0.27);
    border-radius: 10px;
    text-align: center;
    padding: 10px;
  }

  .codeBox {
    margin-top: 15px;
    background: #FFFFFF;
    border-radius: 17px;
    box-shadow: 0px 9px 35px 0px rgba(15, 114, 235, 0.27);
    border: 8px solid #B1D5FF;
    padding: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    .block {
      font-size: 19px;
      padding: 6px;
      margin: 5px;
      background: #EFEFEF;
      border-radius: 4px;
    }

    .qrCodeBox {
      margin-top: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 200px;
      background: #FFFFFF;
      border-radius: 25px;
      border: 5px solid #3A76F2;
    }

    .linkBox {
      display: flex;
      padding: 5px 10px;
      margin-top: 10px;
      border-radius: 25px;
      border: 1.5px solid #3A76F2;
      width: 99%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
}
</style>

<route lang="json">
{
"name": "invite"
}
</route>