/* @flow */

import { toArray } from '../util/index'

/**
 * @author yuanyang
 * 当我们调用 Vue.use 的时候，我们可以传递一个或多个参数，如果多个参数，除第一个外都 install 或 plugin 函数传递的参数（args）。
 */
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    /**
     * @author yuanyang
     * 将参数先 toArray， 然后把第一个参数去掉，返回一个数组，然后在把 this 也就是 Vue 对象插入第一位。
     */
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
