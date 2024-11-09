<script setup lang="ts">
import fund from '~/images/fund.png'
import manager from '~/images/manager.png'
import recharge from '~/images/recharge.png'
import withdraw from '~/images/withdraw.png'
import safety from '~/images/safety.png'
import website from '~/images/website.png'
import logo from '~/images/logo.jpg'
import android from '~/svg/android.svg'
import ios from '~/svg/ios.svg'

import {getUserInfo} from "@/api/csUser";
import router from "@/router";
import {clearToken} from '@/utils/auth'
import {showConfirmDialog} from "vant";
import {OFFICIAL_WEBSITE} from "@/stores/mutation-type";

const {t} = useI18n()

const userLogin = ref(false);

const userInfo = ref({
  nickName: t('user.notLogin'),
  userId: "********",
  avatar: logo,
  total: "******",
  today: "******",
  await: "******",
  profit: "******",
  manager: Boolean
})

function findUserInfo() {
  getUserInfo().then(res => {
    if (res.code === 200) {
      userInfo.value = res.data
      userLogin.value = true
    }
  })
}

function login() {
  router.push({name: 'login'})
}

function logOut() {
  showConfirmDialog({
    message: t('user.affirmLogOut'),
  }).then(() => {
    clearToken()
    router.push({name: 'login'})
  })
}

function gotoRecharge() {
  router.push({name: 'recharge'})
}

function gotoWithdraw() {
  router.push({name: 'withdraw'})
}

function gotoWallet() {
  router.push({name: 'wallet'})
}

function gotoInvest() {
  router.push({name: 'invest'})
}

function gotoSetting() {
  router.push({name: 'setting'})
}

function gotoSafety() {
  router.push({name: 'safety'})
}

function gotoWebsite() {
  window.open(OFFICIAL_WEBSITE, '_blank')
}

function gotoEditInfo() {
  router.push({name: 'editInfo'})
}

function downloadApp(type) {
  window.location.href = import.meta.env.VITE_APP_API_BASE_URL + "/common/download?type=" + type
}

function gotoManager() {
  if (userInfo.value.manager) {
    router.push({name: 'invite'})
  } else {
    router.push({name: 'manager'})
  }
}

onMounted(() => {
  findUserInfo()
})
</script>

<template>
  <div class="main">
    <div class="topBox">
      <div @click="gotoEditInfo" class="flex items-center">
        <van-image
          round
          fit="cover"
          width="4rem"
          height="4rem"
          :src="userInfo.avatar ? userInfo.avatar : logo"
          style="margin-right: 10px"
        />
        <div>
          <div>
            <span>{{ userInfo.nickName }}</span>
          </div>
          <div style="color: #909399; font-size: 15px; margin-top: 5px">
            <span>ID:{{ userInfo.userId }}</span>
          </div>
        </div>
      </div>
      <div v-if="!userLogin" @click="login" style="color: #787878; font-size: 17px">
        <span>{{ t('user.login') }}</span>
        <van-icon name="arrow"/>
      </div>
      <div v-else>
      </div>
    </div>

    <div class="propertyBox">
      <div>
        <div>
          <span style="font-size: 14px">{{ t('user.totalAssets') }}(USD)</span>
        </div>
        <div>
          <span style="font-size: 18px; font-weight: 600; line-height: 35px">{{ userInfo.total }}</span>
        </div>
      </div>

      <div class="infoBox">
        <div style="">
          <div><span>{{ userInfo.today }}</span></div>
          <div style="font-size: 14px"><span>{{ t('user.todayEarnings') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#FFFFFF', height: '100%', borderWidth: '1px' }"/>
        <div>
          <div><span>{{ userInfo.await }}</span></div>
          <div style="font-size: 14px"><span>{{ t('user.proceeds') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#FFFFFF', height: '100%', borderWidth: '1px' }"/>
        <div>
          <div><span>{{ userInfo.profit }}</span></div>
          <div style="font-size: 14px"><span>{{ t('user.earned') }}</span></div>
        </div>
      </div>
      <div class="tagBox" @click="gotoWallet">
        <span>{{ t('user.gotoWallet') }}</span>
        <van-icon name="arrow"/>
      </div>
    </div>

    <div class="cardBox myBox">
      <div @click="gotoInvest">
        <img :src="fund" alt="">
        <div>
          <span>{{ t('user.investment') }}</span>
        </div>
      </div>
      <div @click="gotoManager">
        <img :src="manager" alt="">
        <div>
          <span>{{ t('user.manager') }}</span>
        </div>
      </div>
      <div @click="gotoRecharge">
        <img :src="recharge" alt="">
        <div>
          <span>{{ t('user.recharge') }}</span>
        </div>
      </div>
      <div @click="gotoWithdraw">
        <img :src="withdraw" alt="">
        <div>
          <span>{{ t('user.withdraw') }}</span>
        </div>
      </div>
    </div>

    <div @click="gotoSafety" class="cardBox listBox">
      <div class="flex items-center">
        <img style="height: 30px; width: 24px; margin-right: 15px" :src="safety" alt="">
        <span>{{ t('user.security') }}</span>
      </div>
      <div>
        <van-icon name="arrow"/>
      </div>
    </div>

    <div @click="gotoSetting" class="cardBox listBox">
      <div class="flex items-center">
        <van-icon style="font-size: 28px; margin-right: 10px; color: #FF8E08" name="setting"/>
        <span>{{ t('user.setting') }}</span>
      </div>
      <div>
        <van-icon name="arrow"/>
      </div>
    </div>

    <div @click="downloadApp(1)" class="cardBox listBox">
      <div class="flex items-center">
        <img style="height: 33px; margin-right: 5px" :src="android" alt="">
        <span>{{ t('common.androidDownload') }}</span>
      </div>
      <div>
        <van-icon name="arrow"/>
      </div>
    </div>

    <div @click="downloadApp(0)" class="cardBox listBox">
      <div class="flex items-center">
        <img style="height: 33px; margin-right: 5px" :src="ios" alt="">
        <span>{{ t('common.iosDownload') }}</span>
      </div>
      <div>
        <van-icon name="arrow"/>
      </div>
    </div>

    <div @click="gotoWebsite" class="cardBox listBox">
      <div class="flex items-center">
        <img style="height: 30px; width: 30px; margin-right: 10px" :src="website" alt="">
        <span>{{ t('user.official') }}</span>
      </div>
      <div>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div @click="logOut" v-if="userLogin" class="cardBox listBox logOut">
      <span>{{ t('user.logout') }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 93.8vh;
  background: url("/bj-user.png") no-repeat 100%;
  background-size: cover;
  padding: 12px;

  .topBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .propertyBox {
    color: #FFFFFF;
    margin-top: 15px;
    background-color: #3A76F2;
    height: 127px;
    border-radius: 11px;
    position: relative;
    padding: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .tagBox {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 14px;
    }

    .infoBox {
      display: flex;
      justify-content: space-evenly;
      margin-top: 10px;
    }

  }

  .cardBox {
    background-color: #FFFFFF;
    border-radius: 10px;
    margin-top: 15px;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .myBox {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    padding: 15px 0;
    align-items: center;

    img {
      height: 28px;
      width: 28px;
      margin-bottom: 5px;
    }
  }

  .listBox {
    height: 55px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logOut {
    height: 47px;
    background-color: #3A76F2;
    color: #FFFFFF;
    justify-content: space-evenly;
  }

}

</style>

<route lang="json">
{
"name": "user"
}
</route>