<script setup lang="ts">

import {showLoadingToast, showSuccessToast} from "vant";
import router from "@/router";

const {t} = useI18n()

function clearCache() {
  showLoadingToast({
    message: t('common.clearing'),
    forbidClick: true,
    loadingType: 'spinner',
  });
  setTimeout(() => {
    showSuccessToast(t('common.clearSuc'));
  }, 500);
}

function gotoInvite() {
  router.push({name: 'invite'})
}

function gotoAbout() {
  router.push({name: 'about'})
}

</script>

<template>
  <div class="main">
    <van-cell @click="clearCache" :title="t('common.clearCache')" is-link/>
    <van-cell @click="gotoAbout" class="mt-8px" :title="t('common.aboutUs')" is-link/>
    <div style="text-align: center" class=" mt-50px">
      <van-button @click="gotoInvite" style="width: 85vw; height: 45px" round type="primary"
                  color="linear-gradient(-61deg, #4C93FF, #2964E6)">
        {{ t('common.inviteFriends') }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  padding: 8px 0;
  height: 94.3vh;
  background-color: #f2f2f2;
}

</style>

<route lang="json">
{
"name": "setting",
"meta": {
"title": "",
"i18n": "menus.settings"
}
}
</route>