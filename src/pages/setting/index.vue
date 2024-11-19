<script setup lang="ts">

import {type PickerColumn, showLoadingToast, showSuccessToast} from "vant";
import router from "@/router";
import {languageColumns} from "@/utils/i18n";
import {getUserInfo} from "@/utils/auth";

const {t} = useI18n()

const languages = ref([])
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
  location.reload();
}

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

onMounted(() => {
  let userInfo = getUserInfo();
  if (userInfo && userInfo.auth) {
    languages.value = languageColumns
  } else {
    languages.value = languageColumns.slice(0, 4)
  }
})

</script>

<template>
  <div class="main">
    <van-cell @click="showLanguagePicker = true" :title="t('common.language')" is-link/>
    <van-cell @click="clearCache" class="mt-8px" :title="t('common.clearCache')" is-link/>
    <van-cell @click="gotoAbout" class="mt-8px" :title="t('common.aboutUs')" is-link/>
    <div style="text-align: center" class=" mt-50px">
      <van-button @click="gotoInvite" style="width: 85vw; height: 45px" round type="primary"
                  color="linear-gradient(-61deg, #4C93FF, #2964E6)">
        {{ t('common.inviteFriends') }}
      </van-button>
    </div>

    <!--语言切换-->
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker
        v-model="languageValues"
        :columns="languages"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
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