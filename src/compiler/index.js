/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  /**
   *  @author yuanyang
   *  把模板转换成 ast 抽象语法树
   *  1. 抽象语法书用树形式描述代码结构
   */
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    /**
     *  @author yuanyang
     *  2. 优化抽象语法树。
     */
    optimize(ast, options)
  }
  /**
   *  @author yuanyang
   *  3. options 抽象语法树生成字符串形式的 js 代码
   */
  const code = generate(ast, options)
  return {
    ast,
    /**
     *  @author yuanyang
     *  渲染函数（字符串形式）。
     */
    render: code.render,
    /**
     *  @author yuanyang
     *  静态渲染函数，生成静态 VNode 树
     */
    staticRenderFns: code.staticRenderFns
  }
})
