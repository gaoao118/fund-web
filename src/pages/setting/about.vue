<script setup lang="ts">
import logo from '~/images/logo.jpg'
import {langFormat, OFFICIAL_WEBSITE} from "@/stores/mutation-type";
import {locale} from "@/utils/i18n";

const {t} = useI18n()

function checkVer() {
  showToast(t('common.newVersions'));
}

function gotoPrivacy() {
  window.location.href = OFFICIAL_WEBSITE + "/privacy/" + langFormat(locale.value) + ".html"
}
</script>

<template>
  <div class="main pt-25px">
    <div class="text-center mb-15px">
      <img class="logoImg"
           :src="logo" alt="">
      <div class="text-#1E1E1E text-17px font-600 mt-3px">
        <span>inETF</span>
      </div>
    </div>
    <van-cell @click="checkVer" :title="t('common.versions')" is-link>
      <span>7.10.2</span>
    </van-cell>
    <van-cell @click="gotoPrivacy" :title="t('common.privacyTitle')" is-link/>
  </div>
</template>

<style scoped lang="less">
.main {
  height: 100vh;
  background-color: #f2f2f2;

  .logoImg {
    height: 100px;
    width: 100px;
    object-fit: cover;
    border-radius: 10px;
  }
}
</style>

<route lang="json">
{
"name": "about",
"meta": {
"title": "",
"i18n": "menus.about"
}
}
</route>