<script setup lang="ts">
import manageLog from '~/images/m-log.png'

import router from "@/router";
import {getManagerInfo} from "@/api";
import {userOpenManagerApply} from "@/api/csPay";

const {t} = useI18n()

const info = ref({});
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
  router.back()
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
        <span>{{ t('manager.just') }} <span class="text-#F65236"><span class="text-23px">{{ info.openAmount }}</span>USD</span> {{
            t('manager.canApplyAs')
          }} <span
            class="text-#F65236">{{ t('manager.managerL') }}</span> {{ t('manager.investL') }}</span>
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
          }}</span> {{ t('manager.or') }} <span
          class="text-#F65236">{{ t('manager.frManger') }}</span> {{ t('manager.getHint') }}
        </span>
      </div>

      <div class="titleTwo">
        <div class="titleTwoBox">
          <span>{{ t('manager.recommend') }}</span>
        </div>
        <div class="text-left text-13px">
          <span>
            1.{{ t('manager.directRec') }}
            <span class="text-#F65236 text-16px">
            {{ info.openOne }}USD
          </span>
          </span>
          <div class="mt-5px"></div>
          <span>
            2.{{ t('manager.indirectRec') }}
            <span class="text-#F65236  text-16px">
              {{ info.openTwo }}USD
            </span>
          </span>
        </div>
      </div>

      <div class="titleTwo">
        <div class="titleTwoBox">
          <span>{{ t('manager.usersPur') }}</span>
        </div>
        <div class="text-left text-13px">
          <span>
            1.{{ t('manager.comMonthly') }}
            <span class="text-#F65236">{{ t('manager.grossRevenue') }}
              <span class="text-16px">
                {{ info.fundOne }}%
              </span>
            </span>
            {{ t('manager.toRelevant') }}
          </span>
          <div class="mt-5px"></div>
          <span>
            2.{{ t('manager.newUser') }} <span class="text-#F65236">
            {{ info.firstNum }}{{ t('common.day') }}
          </span> {{ t('manager.andAbove') }} <span
            class="text-#F65236  text-16px">{{ info.firstRate }}%</span> {{ t('manager.toManager') }}
          </span>
        </div>
      </div>

      <div class="titleTwo">
        <div class="titleTwoBox">
          <span>{{ t('manager.teamReward') }}</span>
        </div>
        <div class="text-left text-13px">
          <span>
            1.{{ t('manager.whenScu') }} <span class="text-#F65236">{{ info.teamNum }}</span> {{ t('manager.managers') }} <span
            class="text-#F65236"><span class="text-16px">{{ info.teamAmount }}</span>USD</span> {{ t('manager.subsidy') }}
          </span>
          <div class="mt-5px"></div>
          <span>
            2.{{ t('manager.everyCom') }} <span class="text-#F65236"><span class="text-16px">{{ info.teamTarget }}</span>USD</span> {{ t('manager.sale') }}<span
            class="text-#F65236"><span class="text-16px">{{ info.teamMonth }}</span>USD</span> {{ t('manager.subsidyL') }}
          </span>
        </div>
      </div>
    </div>
    <Pay :type="3" :pay-show="payShow" :payToken="payToken" :amount="info.openAmount" @payClose="payClose"/>
  </div>
</template>

<style scoped lang="less">
.main {
  //width: 100vw;
  //height: 100vh;
  background: url("/bj-manager.png") no-repeat;
  background-size: cover;
  padding: 12px;

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
}
</style>

<route lang="json">
{
"name": "manager"
}
</route>