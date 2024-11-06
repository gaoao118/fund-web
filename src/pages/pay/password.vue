<script setup lang="ts">
import {showFailToast, showSuccessToast} from "vant";
import {captcha, sendSmsUser} from "@/api/csAuth";
import {getUserEmail, setWalletPwd, updateWalletPwd} from "@/api/csUser";
import {Encrypt} from "@/utils/secret";
import {getUserId} from "@/utils/auth";
import router from "@/router";

const setPwd = ref(false);
const value = ref('');
const info = ref('设置支付密码');
const showKeyboard = ref(true);
const errorInfo = ref('');
const password = ref('');
const type = ref(undefined);


const sendCodeStr = ref('发送验证码');
const countDown = ref(null);
const code = ref('');
const email = ref('');

const sendTime = ref(true);
//人机验证弹窗
const verifyShow = ref(false);
//人机验证弹窗
const verifyData = ref(null);
const verifyCode = ref('');

const verify = () => {
  if (!email.value) {
    showFailToast('请输入邮箱地址');
    return;
  }
  verifyCode.value = ''
  captcha().then(res => {
    if (res.code === 200) {
      verifyShow.value = true;
      verifyData.value = res.data
    }
  })
};

const sendCode = () => {
  //发送验证码
  sendSmsUser(verifyData.value.uuid, verifyCode.value).then(res => {
    if (res.code === 200) {
      sendTime.value = false;
      countDown.value.start();
      showSuccessToast('发送成功')
    }
  })
};

const onFinish = () => {
  sendTime.value = true;
  countDown.value.reset();
  sendCodeStr.value = "重新发送"
};

watch(value, (newVal) => {
  if (newVal.length === 6) {
    if (password.value) {
      if (newVal !== password.value) {
        showFailToast('二次输入密码不一致！');
        info.value = '设置支付密码'
        password.value = ''
        value.value = ''
      } else {
        let userId = getUserId();
        let encrypt = Encrypt(password.value, userId);
        console.log(setPwd.value)
        //输入成功
        if (setPwd.value) {
          setWalletPwd(encrypt).then(res => {
            if (res.code === 200) {
              showSuccessToast('设置成功！');
              router.push({name: 'user'})
            } else {
              info.value = '设置支付密码'
              password.value = ''
              value.value = ''
            }
          })
        } else {
          updateWalletPwd(code.value, encrypt).then(res => {
            if (res.code === 200) {
              showSuccessToast('修改成功！');
              router.push({name: 'user'})
            } else {
              type.value = 2
              code.value = ''
              password.value = ''
              value.value = ''
            }
          })
        }
      }
    } else {
      info.value = '确认支付密码'
      password.value = newVal
      value.value = ''
    }
  }
});

function verifyEmail() {
  if (!code.value) {
    showFailToast('请输入验证码');
    return;
  }
  type.value = 1
  info.value = '请输入支付密码'
}

onMounted(() => {
  getUserEmail().then(res => {
    if (res.code === 200) {
      if (res.data) {
        setPwd.value = false
        type.value = 2
        email.value = res.data
      } else {
        setPwd.value = true
        type.value = 1
      }
    }
  })
})

</script>

<template>
  <div class="main">
    <div v-if="type === 1">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20vh">
        <span>{{ info }}</span>
      </div>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        info="密码为 6 位数字"
        :error-info="errorInfo"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        :hide-on-click-outside="false"
        v-model="value"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />
    </div>
    <div v-else-if="type === 2">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20vh">
        <span>修改支付密码</span>
      </div>
      <van-form label-align="top">
        <van-cell-group inset>
          <van-field
            readonly
            v-model="email"
            placeholder="请输入邮箱地址"
          />
          <van-field
            v-model="code"
            type="number"
            center
            clearable
            placeholder="请输入验证码"
          >
            <template #button>
              <van-button @click="verify" size="small" round plain hairline type="primary">
                <span v-show="sendTime">{{ sendCodeStr }}</span>
                <van-count-down v-show="!sendTime" :time="60000" ref="countDown" :auto-start="false"
                                @finish="onFinish" format="ss"/>
              </van-button>
            </template>
          </van-field>
        </van-cell-group>

        <div style="margin: 16px;">
          <van-button @click="verifyEmail" color="linear-gradient(-61deg, #4C93FF, #2964E6)" round block
                      type="primary"
                      native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>

    <van-dialog v-model:show="verifyShow" @confirm="sendCode" title="人机验证" show-cancel-button>
      <div class="verifyBox">
        <img height="50px" :src="'data:image/png;base64,' + verifyData.img" alt="">
        <van-icon @click="verify" class="vReplay" name="replay"/>
      </div>
      <div>
        <van-field style="font-size: 17px;" v-model="verifyCode" type="digit" placeholder="请输入验证码"/>
      </div>
    </van-dialog>
  </div>

</template>

<style scoped lang="less">
.verifyBox {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.vReplay {
  position: absolute;
  right: 50px;
  font-size: 25px;
  top: 19px;
}
</style>
<route lang="json">
{
"name": "payPassword",
"meta": {
"title": "支付密码"
}
}
</route>