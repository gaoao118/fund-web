<script setup lang="ts">
import router from "@/router";
import {Encrypt} from "@/utils/secret";
import {register} from "@/api/csAuth";
import {setToken} from '@/utils/auth'
import {langFormat, OFFICIAL_WEBSITE} from "@/stores/mutation-type";
import {locale} from "@/utils/i18n";

const {t} = useI18n()

const account = ref('');
const password = ref('');
const inviterCode = ref('');
const checked = ref(false);

function retreat() {
  router.back()
}

function userRegister() {
  if (!account.value) {
    showToast(t('user.accountNot'));
    return;
  }
  if (!password.value) {
    showToast(t('user.passwordNot'));
    return;
  }
  if (!checked.value) {
    showToast(t('common.privacy'));
    return;
  }
  let encrypt = Encrypt(password.value, '');
  register(account.value, encrypt, inviterCode.value).then(res => {
    if (res.code === 200) {
      setToken(res.data.token, res.data.userId);
      router.push({name: 'user'})
    }
  })
}

function gotoPrivacy() {
  window.location.href = OFFICIAL_WEBSITE + "/privacy/" + langFormat(locale.value) + ".html"
}

</script>

<template>
  <div class="main">
    <div class="text-#FFFFFF text-26px">
      <div @click="retreat" class="mb-25px">
        <van-icon name="cross"/>
      </div>
      <div class="mb-10px">
        <span>{{ t('user.hello') }}</span>
      </div>
      <div>
        <span>{{ t('user.welcome') }}</span>
      </div>
    </div>
    <div class="logBox mt-20px">
      <div class="titleBox">
        <span>{{ t('user.regis') }}</span>
      </div>
      <van-form label-align="top">
        <van-cell-group inset>
          <van-field
            v-model="account"
            :placeholder="t('user.accHint')"
          />
          <van-field
            v-model="password"
            type="password"
            :placeholder="t('user.passwordNot')"
          />
          <van-field
            v-model="inviterCode"
            type="password"
            :placeholder="t('user.inviteCodeNot')"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button @click="userRegister" color="linear-gradient(-61deg, #4C93FF, #2964E6)" round block type="primary"
                      native-type="submit">
            {{ t('user.regis') }}
          </van-button>
        </div>
      </van-form>
    </div>

    <div class="deal">
      <div style="width: 100vw; display: flex; justify-content: center;">
        <van-checkbox icon-size="16px" shape="square" v-model="checked">
          <span class="text-#FFFFFF text-14px">{{ t('common.readAgree') }}</span>
        </van-checkbox>
        <span @click="gotoPrivacy" class="text-#71E3D6 text-14px">{{ t('user.privacy') }}</span>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">
.main {
  width: 100vw;
  height: 100vh;
  background: url("/bj-login.png") no-repeat 100%;
  background-size: cover;
  padding: 15px;

  .logBox {
    height: 310px;
    background-color: #FFFFFF;
    border-radius: 10px;
    box-shadow: 0 1px 32px 0 rgba(29, 52, 155, 0.4);

  }

  //样式穿透
  :deep(.van-tabs__wrap) {
    border-radius: 10px;
  }

  :deep(.van-field__body) {
    border-radius: 10px;
    background-color: #F6F8FA;
    height: 40px;
    padding: 10px;
  }

  .deal {
    position: absolute;
    bottom: 13px;
    left: 0
  }

  .verifyBox {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .vReplay {
    position: absolute;
    right: 35px;
    font-size: 33px;
    top: 20px;
  }

  .titleBox {
    height: 50px;
    color: #FFFFFF;
    text-align: center;
    font-size: 18px;
    line-height: 50px;
    border-radius: 10px 10px 0 0;
    background-color: #2A73ED;
  }

}

</style>

<route lang="json">
{
"name": "register",
"meta": {
"i18n": "menus.login"
}
}
</route>