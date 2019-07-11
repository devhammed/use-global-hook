/**
 * @file
 * use-global-hook is built on top of React hooks, context and patterns surrounding those elements.
 *
 * It has three pieces:
 * - hooks
 * - useGlobalHook
 * - `<GlobalHooksProvider />`
 */

import React, { FC } from 'react'

/**
 * A hook store is a place to store state and some of the logic for updating it.
 *
 * Store is a very simple React hook (which means you can re-use it, use other
 * hooks within it, etc).
 *
 * ```tsx
 * import { useState } from 'react'
 *
 * const counterStore = () => {
 *   const [count, setCount] = useState(0)
 *   const increment = () => setCount(count + 1)
 *   const decrement = () => setCount(count - 1)
 *
 *   return { count, increment, decrement }
 * }
 * ```
 *
 * Note that hooks prop use useState hook from React for managing state
 * When you call setState it triggers components to re-render, so be careful not
 * to mutate state directly or your components won't re-render.
 */
export declare type StoreHook = () => any

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
 * The final piece is `<GlobalHooksProvider>` component. It has two roles:
 *
 * - It initializes global instances of given hooks (this is required because React
 * expects the number of hooks to be consistent across re-renders)
 * - It uses context to pass initialized instances of given hooks to all the components
 * down the tree
 *
 * ```tsx
 * ReactDOM.render(
 *   <GlobalHooksProvider hooks={{ counterStore }}>
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
 * When state changes, our components re-render.
 * We can depend on our store state.
 * We can call functions exposed by the store.
 * For this we have the useGlobalHook hook which allows us to get global store instances by using specific store constructor.
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
