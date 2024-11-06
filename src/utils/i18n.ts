import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import zhTW from 'vant/es/locale/lang/zh-TW'
import arSA from 'vant/es/locale/lang/ar-SA'
import jaJP from 'vant/es/locale/lang/ja-JP'
import koKR from 'vant/es/locale/lang/ko-KR'
import ruRU from 'vant/es/locale/lang/ru-RU'
import esES from 'vant/es/locale/lang/es-ES'
import frFR from 'vant/es/locale/lang/fr-FR'

/**
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'
import { Locale, type PickerColumn } from 'vant'

/** 默认语言包名称 */
const FALLBACK_LOCALE = 'zh-CN'

/** 多语言 picker columns */
export const languageColumns: PickerColumn = [
  { text: 'English', value: 'en-US' },
  { text: 'عربي', value: 'ar-SA' },
  { text: '日本語', value: 'ja-JP' },
  { text: '한국인', value: 'ko-KR' },
  { text: 'Русский', value: 'ru-RU' },
  { text: 'español', value: 'es-ES' },
  { text: 'Français', value: 'fr-FR' },
  { text: '简体中文', value: 'zh-CN' },
  { text: '繁體中文', value: 'zh-TW' },
]

/** 获取当前语言对应的语言包名称 */
function getI18nLocale() {
  const storedLocale = localStorage.getItem('language') || navigator.language

  const langs = languageColumns.map(v => v.value as string)
  const foundLocale = langs.find(v => v === storedLocale || v.indexOf(storedLocale) === 0) // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const locale = foundLocale || FALLBACK_LOCALE // 若未找到，则使用 默认语言包

  document.querySelector('html').setAttribute('lang', locale)
  return locale
}

export const i18n = createI18n({
  locale: getI18nLocale(),
  legacy: false,
  messages,
})

/** 当前语言 */
export const locale = computed({
  get() {
    return i18n.global.locale.value
  },
  set(language: string) {
    document.querySelector('html').setAttribute('lang', language)
    localStorage.setItem('language', language)
    i18n.global.locale.value = language
    Locale.use(language)
  },
})

// 载入 vant 语言包
Locale.use('zh-CN', zhCN)
Locale.use('en-US', enUS)
Locale.use('zh-TW', zhTW)
Locale.use('ar-SA', arSA)
Locale.use('ja-JP', jaJP)
Locale.use('ko-KR', koKR)
Locale.use('ru-RU', ruRU)
Locale.use('es-ES', esES)
Locale.use('fr-FR', frFR)

// 根据当前语言切换 vant 语言包
Locale.use(locale.value)
