/* @flow */

import { mergeOptions } from '../util/index'
/**
 * @author yuanyang
 * 将传过来的成员，拷贝到 Vue.options 中。
 */

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
