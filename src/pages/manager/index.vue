<script setup lang="ts">
import manageLog from '~/images/m-log.png'

import router from "@/router";
import {getManagerInfo} from "@/api";
import {userOpenManagerApply} from "@/api/csPay";

const {t} = useI18n()

const info = ref({
  openAmount: undefined,
  teamMonth: undefined,
  teamTarget: undefined,
  teamAmount: undefined,
  teamNum: undefined,
  firstRate: undefined,
  firstNum: undefined,
  fundOne: undefined,
  openTwo: undefined,
  manager: undefined,
  openOne: undefined,
});
const payShow = ref(false)
const payToken = ref('')
const payLoading = ref(false)

function payClose() {
  payShow.value = false;
  payLoading.value = false
}

function payApply() {
  if (payLoading.value) {
    return
  }
  payLoading.value = false
  userOpenManagerApply().then(res => {
    if (res.code === 200) {
      payShow.value = true
    }
    payLoading.value = false
  })
}

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

onMounted(() => {
  getManagerInfo().then(res => {
    if (res.code === 200) {
      info.value = res.data
    }
  })
})
</script>

<template>
  <div class="main">
    <div class="topBox">
      <van-icon @click="retreat" style="font-size: 25px; color: #cbc9c9; " name="arrow-left"/>
    </div>
    <div class="text-center">
      <div class="text-25px text-#2063E2"><span>{{ t('manager.apply') }}</span></div>
      <div class="text-16px mt-10px mb-10px">
        <span class="text-#D72E00">{{ t('common.inviteFriends') }}</span>
        <span class="text-#2063E2">&nbsp;{{ t('manager.wealth') }}</span>
      </div>
      <img style="height: 220px" :src="manageLog" alt="">
    </div>

    <div class="cardBox mt-15px">
      <div class="titleBox">
        <span>{{ t('manager.apply') }}</span>
      </div>
      <div class="text-left">
        <span>{{ t('manager.just') }} <span class="text-#F65236"><span class="text-23px">
          {{ info.openAmount }}</span>USD</span>
          {{ t('manager.canApplyAs') }} <span class="text-#F65236">{{ t('manager.managerL') }}</span>
          {{ t('manager.investL') }}
        </span>
      </div>
      <div class="mt-5px mb-5px text-left">
        <span class="text-#F65236">{{ t('common.inviteFriends') }}</span> <span>{{ t('manager.easy') }}</span>
      </div>

      <div @click="payApply" v-if="!info.manager" class="button">
        <van-loading v-if="payLoading"/>
        <span v-else>{{ t('manager.nowApply') }}</span>
      </div>
    </div>

    <div class="cardBox mt-25px">
      <div class="titleBox">
        <span>{{ t('manager.inviteFr') }}</span>
      </div>
      <div>
        <span>
          {{ t('manager.sucInviteFr') }} <span class="text-#F65236">{{
            t('manager.investSuc')
          }}</span> {{ t('manager.or') }}
          <span class="text-#F65236">{{ t('manager.frManger') }}</span> {{ t('manager.getHint') }}
        </span>
      </div>

      <div class="levelBox mt-10px">
        <div class="leTBox">
          <div>{{ t('manager.managerLevel') }}</div>
          <div>{{ t('manager.upgradeCond') }}</div>
          <div>{{ t('manager.extraBonus') }}</div>
        </div>
        <div :class="{leConBox: true, leDarkBox: (index % 2 === 1), leLastBox: index === 5}" v-for="(item, index) in info.levels">
          <div>{{ item.level }}{{ t('manager.levelManger') }}</div>
          <div v-if="item.level <= 1">{{ t('manager.applyManger') }}</div>
          <div v-else>{{ item.validNum }}{{ t('manager.validUserOne') }}/{{ item.investAmount }}{{ t('manager.performance') }}</div>
          <div>{{ t('manager.friendIncomeTotal') }}{{ item.profitRate }}%</div>
        </div>
      </div>

      <div class="mt-10px text-#787878 text-12px">
        <div>{{ t('manager.explain') }}</div>
      </div>

    </div>
    <Pay :type="3" :pay-show="payShow" :payToken="payToken" :amount="info.openAmount" @payClose="payClose"/>
  </div>
</template>

<style scoped lang="less">
.main {
  background: url("/bj-manager.png") no-repeat;
  background-size: cover;
  padding: 12px;
  min-height: 99.9vh;

  .topBox {
    height: 20px;
  }

  .cardBox {
    background: #FFFFFF;
    border-radius: 10px;
    text-align: center;
    padding: 10px;
    font-size: 14px;

    .titleBox {
      color: #FFFFFF;
      font-size: 13px;
      display: inline;
      padding: 7px 12px;
      height: 30px;
      border-radius: 20px;
      background: linear-gradient(180deg, #D38FFF 0%, #3E87F8 100%);
      position: relative;
      top: -17px;
    }

    .titleTwo {
      background: #FFFFFF;
      border-radius: 10px;
      border: #3E87F8 solid 3px;
      margin-top: 20px;
      padding: 10px;

      .titleTwoBox {
        color: #FFFFFF;
        font-size: 13px;
        display: inline;
        padding: 6px 10px;
        height: 30px;
        border-radius: 20px;
        background: #3E87F8;
        position: relative;
        top: -17px;
      }
    }

    .button {
      display: inline-block;
      margin: 20px 0 15px 0;
      color: #FFFFFF;
      width: 230px;
      height: 30px;
      line-height: 30px;
      background: #FE5F49;
      box-shadow: 0px 4px 12px 0px #FE5F49;
      border-radius: 20px;
    }
  }

  .levelBox {
    font-size: 12px;
    border-radius: 10px;
    background: #E3F0FF;

    .leTBox {
      display: flex;
      justify-content: space-around;
      padding: 5px 0;
      color: #FFFFFF;
      background: linear-gradient(180deg, #D38FFF 0%, #D38FFF 0%, #3E87F8 100%);
      border-radius: 10px 10px 0 0;
    }

    .leConBox {
      display: flex;
      justify-content: space-around;
      padding: 5px 0;
      color: #3A76F2;
    }

    .leDarkBox {
      background-color: #C1D6FD;
    }

    .leLastBox {
      border-radius: 0 0 10px 10px;
    }
  }

}
</style>

<route lang="json">
{
"name": "manager"
}
</route>