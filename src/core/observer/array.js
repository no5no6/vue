/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
/**
 * @author yuanyang
 * 创建一个新的对象，将其原型替换成原生数组的原型
 */  
export const arrayMethods = Object.create(arrayProto)
/**
 * @author yuanyang
 * 修改数组元素的方法
 */  
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  /**
   * @author yuanyang
   * 保存数组原始方法
   */  
  const original = arrayProto[method]
  /**
   * @author yuanyang
   * 改变数组方法
   * 调用 Object.defineProperty() 重新定义修改数组的方法
   */  
  def(arrayMethods, method, function mutator (...args) {
    /**
     * @author yuanyang
     * 执行数组的原始方法
     * args 这些参数就是调用数组方法（如： push 、 sort 等等）传递的值
     */  
    const result = original.apply(this, args)
    /**
     * @author yuanyang
     * 获取数组的 __ob__ 对象
     */  
    const ob = this.__ob__
    /**
     * @author yuanyang
     * 用来存储数组中新增的元素
     */ 
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        /**
         * @author yuanyang
         * 因为 splice 第三个参数是新增元素，所以获取到第三个参数
         */ 
        inserted = args.slice(2)
        break
    }
    /**
     * @author yuanyang
     * 如果有新增元素，陈红新遍历数组元素，设置为响应式数据。
     */ 
    if (inserted) ob.observeArray(inserted)
    // notify change
    /**
     * @author yuanyang
     * 调用了修改数组的方法，调用数组的 ob 对象发送通知。
     */ 
    ob.dep.notify()
    return result
  })
})
