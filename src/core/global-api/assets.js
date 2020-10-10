/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {

  /**
   * @author yuanyang
   * 遍历 ASSET_TYPES， 值为 component、directive、filter
   */

  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        
      /**
       * @author yuanyang
       * 如果组件
       * isPlainObject 判断是否是原始 Object 对象，使用 toString 判断是否等于 'Object'。
       * _base 就是 Vue 构造函数。
       */
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
      /**
       * @author yuanyang
       * 如果指令
       * 把 function 设置给 bind 和 update 。
       */
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
