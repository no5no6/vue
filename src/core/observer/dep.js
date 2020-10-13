/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0
/**
 * @author yuanyang
 * dep 是可观察对象，可以有多个指令订阅它
 */

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  /**
   * @author yuanyang
   * watcher 对象
   */
  static target: ?Watcher;
  /**
   * @author yuanyang
   * dep 实例 Id
   */
  id: number;
  /**
   * @author yuanyang
   * dep 实例对应的 watcher 对象/订阅者数组
   */
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  /**
   * @author yuanyang
   * 添加新的订阅者 watcher 对象
   */
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  /**
   * @author yuanyang
   * 移除订阅者
   */
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  /**
   * @author yuanyang
   * 发布通知
   */ 
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      /**
       * @author yuanyang
       * 从小到大排序 watcher id，根据创建时间
       */ 
      subs.sort((a, b) => a.id - b.id)
    }
    /**
     * @author yuanyang
     * 循环调用 watcher 对象的 update 方法
     */ 
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
