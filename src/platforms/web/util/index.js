/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * @author yuanyang
 * 通过 el 参数，获取dom节点。
 * 如果 el 是字符串，通过 querySelector 方法找到 dom返回。
 * 如果是 el 是 dom 节点，直接返回
 */

 /**
 * Query an element selector if it's not an element already.
 */
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
