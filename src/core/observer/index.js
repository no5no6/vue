/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  /**
   * @author yuanyang
   * 观测对象
   */  
  value: any;
  /**
   * @author yuanyang
   * 依赖对象
   */  
  dep: Dep;
  /**
   * @author yuanyang
   * 实例计数器
   */  
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    /**
     * @author yuanyang
     * 将实例挂载到观察对象的 __ob__ 属性
     */  
    def(value, '__ob__', this)
    /**
     * @author yuanyang
     * 数据响应式处理
     * 判断 value 是数组还是对象
     */  
    if (Array.isArray(value)) {
      /**
       * @author yuanyang
       * 判断当前浏览器是否支持原型属性 __proto__
       */  
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      /**
       * @author yuanyang
       * 为数组的每一项创建一个 observe 实例
       */ 
      this.observeArray(value)
    } else {
      /**
       * @author yuanyang
       * 遍历对象中的每一个属性，转换成 getter / setter
       */ 
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    /**
     * @author yuanyang
     * 获取 obj 对象上所有属性的键
     */ 
    const keys = Object.keys(obj)
    /**
     * @author yuanyang
     * 遍历每一个属性，转换成 getter / setter
     */ 
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  /**
   * @author yuanyang
   * 判断 value 是否为对象或者 vNode（虚拟dom） 的一个实例
   */
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  /**
   * @author yuanyang
   * 判断 value 是否有 __ob__ 这个属性，且是否是 Observer 的一个实例
   * 如果是的话就说明 value 已经是一个响应式对象，不做任何处理，直接返回（相当做了一个缓存处理）
   */
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
  /**
   * @author yuanyang
   * 创建一个 Observer 对象，将次对象所有属性转换成 get set
   */
    ob = new Observer(value)
  }
  /**
   * @author yuanyang
   * 如果处理的事跟数据，会将 ob 对象的 vmCount 做 ++ 操作
   */
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * @author yuanyang
 * 为一个对象定义一个响应式属性
 */

/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  /**
   * @author yuanyang
   * 创建依赖对象实例，收集当前属性的所有 watcher
   */
  const dep = new Dep()
  /**
   * @author yuanyang
   * 获取 obj 对象的属性描述符
   * 调用 defineProperty 的第三个参数就是描述符
   * 
   */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  /**
   * @author yuanyang
   * 通过获取的描述符，判断该属性是否可以配置（属性是否能能delete， 不能通过 defineProperty 重新定义），如果不可以，直接返回，不操作。
   */
  if (property && property.configurable === false) {
    return
  }

  /**
   * @author yuanyang
   * 将用户定义的 getter / setter 取出缓存
   */
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  /**
   * @author yuanyang
   * 判断是否是深度监听，如果是会递归调用 observe 方法，将 val 对象里的属性就绪设置 getter / setter
   */
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      /**
       * @author yuanyang
       * 首先调用用户设置的 getter 方法， 如果用户没有设置 getter 方法，则直接放回 val 值
       */      
      const value = getter ? getter.call(obj) : val
      /**
       * @author yuanyang
       * 如果存在当前目标依赖，即 watcher 对象，则建立依赖
       */
      if (Dep.target) {
        dep.depend()
        /**
         * @author yuanyang
         * 如果子观察目标存在，建立子对象的依赖关系
         */
        if (childOb) {
          childOb.dep.depend()
          /**
           * @author yuanyang
           * 如果属性是数组，则特殊处理收集数组对象依赖
           */
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      /**
       * @author yuanyang
       * 首先调用用户设置的 getter 方法， 如果用户没有设置 getter 方法，则直接放回 val 值
       */   
      const value = getter ? getter.call(obj) : val

      /**
       * @author yuanyang
       * 如果新值等于旧值，不做任何处理
       * newVal !== newVal && value !== value 判断是否为 NaN ，因为 NaN 不等于 NaN , 所以这样判断
       */  
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      /**
       * @author yuanyang
       * 如果没有 setter 直接返回
       */  
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      
      /**
       * @author yuanyang
       * 如果用户定义了 setter 方法，则调用 setter
       * 如果没有就把新值赋值给 val
       */  
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      /**
       * @author yuanyang
       * 如果是深度监听，再次递归调动 observe 方法，将 newVal 传递过去设置 getter / setter 
       */  
      childOb = !shallow && observe(newVal)
      /**
       * @author yuanyang
       * 派发更新（发布更改通知）
       */ 
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  /**
   * @author yuanyang
   * 判断 target 是否是数组，key 是否是合法索引
   */ 
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  /**
   * @author yuanyang
   * 如果 key 在对象中已经存在直接赋值
   */ 
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  /**
   * @author yuanyang
   * 获取 target 的 observer 对象
   */ 
  const ob = (target: any).__ob__
  /**
   * @author yuanyang
   * 如果 target 是 vue 的实例，或者 $data 直接返回
   */ 
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  /**
   * @author yuanyang
   * 如果 ob 不存在， target 不是响应式对象直接赋值 
   */ 
  if (!ob) {
    target[key] = val
    return val
  }
  /**
   * @author yuanyang
   * 把新增的属性 key 设置为响应式对象
   */ 
  defineReactive(ob.value, key, val)
  /**
   * @author yuanyang
   * 发送通知
   */ 
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  /**
   * @author yuanyang
   * 判断是否是数组，以及 key 是否合法
   */ 
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    /**
     * @author yuanyang
     * 数组通过 splice 删除， splice 做过响应式处理
     */ 
    target.splice(key, 1)
    return
  }
  /**
   * @author yuanyang
   * 获取 target 的 ob 属性
   */ 
  const ob = (target: any).__ob__
  /**
   * @author yuanyang
   * target 如果是 Vue 实例或者 $data 对象，直接返回
   */ 
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  /**
   * @author yuanyang
   * 如果 target 对象没有 key 或者继承属性，属性直接返回
   */ 
  if (!hasOwn(target, key)) {
    return
  }
  /**
   * @author yuanyang
   * 删除属性
   */ 
  delete target[key]
  if (!ob) {
    return
  }
  /**
   * @author yuanyang
   * 发送通知
   */ 
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
