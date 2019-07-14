/**
 * use-global-hook is built on top of React hooks, context and patterns surrounding those elements.
 *
 * It has four pieces:
 * - hooks
 * - createGlobalHook
 * - useGlobalHook
 * - `<GlobalHooksProvider />`
 */

import React, { FC } from 'react'

/**
 * A hook store is a place to store state and some of the logic for updating it.
 *
 * Store is a very simple React hook (which means you can re-use it, use other
 * hooks within it, use your existing custom or third-party hooks, etc).
 *
 * You should wrap the hook function in `createGlobalHook` function with the first parameter which is the unique identifier for the hook.
 *
 * Wrapping the function means, in case of when creating dynamic hook function, any argument you intend to pass to your hook when will be applied automatically, you still have your function the way you declare it --- cheers! e.g  something like `counterStore(props.dynamicValue)` though this can only happen when registering the hook function in `<GlobalHooksProvider />`.
 *
 * ```tsx
 * import { useState } from 'react'
 * import { createGlobalHook } from '@devhammed/use-global-hook'
 *
 * const counterStore = createGlobalHook('counterStore', () => {
 *   const [count, setCount] = useState(0)
 *   const increment = () => setCount(count + 1)
 *   const decrement = () => setCount(count - 1)
 *
 *   return { count, increment, decrement }
 * })
 * ```
 *
 * Note that hooks prop use useState hook from React for managing state
 * When you call setState it triggers components to re-render, so be careful not
 * to mutate state directly or your components won't re-render.
 */
export declare type StoreHook = () => any

/**
 * Hook store function wrapper, this function apply some internally used property to a function that calls your original function. A wrapper function is best for this case as it is not a good idea to mutate your original function with properties that may conflict and third-party hooks is always taking into consideration where it is not good to add properties to the library core function and this method also allows creating clone of same hook function without conflicting names.
 */
export declare function createGlobalHook(
  name: string,
  fn: (...args) => any
): (...args) => any

/**
 * Collection of Store Hooks
 */
export declare type StoreHooks = {
  [key: string]: StoreHook
}

/**
 * Global Store Hooks context container
 */
export declare const GlobalHooksContext: React.Context<StoreHooks>

export interface GlobalHooksProviderProps {
  /**
   * An object of hooks that will be available to retrieve with useGlobalHook
   */
  hooks: StoreHooks

  /**
   * An array of React element children
   */
  children: React.ReactChild[]
}

/**
 * The `<GlobalHooksProvider>` component has two roles:
 *
 * - It initializes global instances of given hooks array (an Array is required because React expects the number of hooks to be consistent across re-renders and Objects are not guaranteed to return in same order)
 * - It uses context to pass initialized instances of given hooks to all the components
 * down the tree
 *
 * ```tsx
 * ReactDOM.render(
 *   <GlobalHooksProvider hooks={[ counterStore ]}>
 *     <Counter />
 *     <Counter />
 *   </GlobalHooksProvider>
 * )
 * ```
 */
export declare function GlobalHooksProvider(props: GlobalHooksProviderProps): FC

/**
 * Next we'll need a piece to introduce our state back into the tree so that:
 *
 * - When state changes, our components re-render.
 * - We can depend on our store state.
 * - We can call functions exposed by the store.
 *
 * For this we have the `useGlobalHook` hook which allows us to get global store instances by using passing the value we used when creating the global hook with `createGlobalHook` function.
 *
 * ```tsx
 * function Counter() {
 *   const { count, decrement, increment } = useGlobalHook('counterStore')
 *
 *   return (
 *     <div>
 *       <span>{count}</span>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={increment}>+</button>
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useGlobalHook(key: string): StoreHook

/**
 * Class components can benefit from hooks too!
 *
 * You heard that right, who says class component cannot use and benefit from the awesomeness of React hooks?
use-global-hooks provides a function component HOC wrapper `withGlobalHooks` which allows class components to use hooks state(s) by passing them props. cool right? let's look at how above Counter component will look when using a class.
 * It is as easy as using function component too, just pass in your component variable as the first parameter and second parameter is an array that contains names of the global hooks you want to use and you will be able access the state from `this.props.[globalHookName]`.
 * The HOC wrapper pass down props so any other prop you are using in your component still works fine except if there is prop conflict which is why it is recommended you add `Store` suffix to your store names when creating them.
 * So with support for class component, you can start using this library even when you are not ready to switch to function components.
 * NOTE: You can also use `withGlobalHooks` with function components but why not just use the hook? :wink:
 */
export declare function withGlobalHooks(
  component: React.ReactElement,
  hooks: string[]
): React.FunctionComponent
