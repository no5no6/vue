import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/**
 *  @author yuanyang
 *  如果使用 class 方式，下方向原型绑定方法的时候不好处理，所以用了构造方法。
 */
function Vue (options) {
  /**
   *  @author yuanyang
   *  判断 this 是不是 vue 的实例，如果不是，证明不是用 new 方式调用
   */
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

/**
 *  @author yuanyang
 *  往 vue 原型上混入响应方法
 */

/**
 *  @author yuanyang
 *  注册 vm 的 _init() 方法，初始化 vm
 */
initMixin(Vue)
/**
 *  @author yuanyang
 *  注册 vm 的 $data/$props/$set/$delete/$watch
 */
stateMixin(Vue)
/**
 *  @author yuanyang
 *  初始化事件相关方法 $on/$once/$off/$emit
 */
eventsMixin(Vue)
/**
 *  @author yuanyang
 *  初始化生命周期的相关混入方法 _update/$forceUpdate/$destroy
 */
lifecycleMixin(Vue)
/**
 *  @author yuanyang
 *  混入 render 方法 $nextTice/_render
 */
renderMixin(Vue)

export default Vue
