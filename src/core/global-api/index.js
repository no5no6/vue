/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    /**
     *  @author yuanyang
     *  不要替换 Vue.config 对象，可以在 Vue.config 中挂载属性和方法
     */
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }

  /**
   *  @author yuanyang
   *  初始化 Vue.config 对象 
   */
  Object.defineProperty(Vue, 'config', configDef)

  /**
   * @author yuanyang
   * 警告：这些方法不能视为全局方法，可能会发生问题。只是用在 vue 内部
   */

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  /**
   * @author yuanyang
   * observable 讲一个对象改变为响应式对象
   */

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  /**
   * @author yuanyang
   * 创建一个 options 对象并设置原型等于 null ，原型等于 null 可以提高性能。
   * 给 options 对象挂载 components、 directives、 filter 三个成员。作用是存储全局的组件、指令、过滤器
   */
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  /**
   * @author yuanyang
   * 将第二个参数对象，拷贝到第一个参数对象里。
   * 注册了内置组件 keep-alive
   */
  extend(Vue.options.components, builtInComponents)

  /**
   * @author yuanyang
   * 注册插件。
   */
  initUse(Vue)
  /**
   * @author yuanyang
   * 实现混入。
   */
  initMixin(Vue)
  /**
   * @author yuanyang
   * 给予出入的 options 对象，放回一个组件的构造函数。
   */
  initExtend(Vue)
  /**
   * @author yuanyang
   * 注册 Vue.directive()、 Vue.component()、 Vue.filter()
   */
  initAssetRegisters(Vue)
}
