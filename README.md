# use-global-hook

> Painless global state management for React using Hooks and Context API in 1KB!

## Installation

```sh
npm install @devhammed/use-global-hook
```

## Quick Example

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHooksProvider, createGlobalHook, useGlobalHook } from '@devhammed/use-global-hook'

const store = createGlobalHook(/** 1 **/ 'counterStore', () => {
  const [count, setCount] = React.useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return { count, increment, decrement, reset }
})

function Counter () {
  const { count, increment, decrement, reset } = useGlobalHook('counterStore') /** 1. This is where you use the name you defined in `createGlobalHook` function, this name should be unique through out your app **/

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

function App () {
  return (
    <GlobalHooksProvider hooks={[ store ]}>
      <Counter />
      <Counter />
      <Counter />
    </GlobalHooksProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Notice how we render the `Counter` component three times? clicking on a button in one of the component instance will update others too.

See it running live [here](https://devhammed.github.io/use-global-hook).

### Concepts

use-global-hook is built on top of React Hooks, context
and patterns surrounding those elements.

It was adapted from [Outstated](https://github.com/yamalight/outstated) which is almost similar but I removed the need to import store when needed in a component.

It has three pieces:

##### `Store`

A hook store is a place to store state and some of the logic for updating it.

Store is a very simple React hook wrapper (which means you can re-use it, use other hooks within it, etc).

`createGlobalHook` is a Hook store function wrapper, this function is used to apply some internally used property to a function that calls your original hook function. A wrapper function is best for this case as it is not a good practice to mutate your original function with properties that may conflict and third-party hooks is taking into consideration where it is not good to add properties to the library core exports and this method also allows creating clone of same hook function without conflicting instances.

Wrapping the function means, in case of when creating dynamic hook function, any argument you intend to pass to your hook when will be applied automatically, you still have your function the way you declare it and the way you intend to use it --- cheers! e.g  something like `store(props.dynamicValue)` though this can only happen when registering the hook function in `<GlobalHooksProvider />`.

```js
import React from 'React'
import { createGlobalHook } from '@devhammed/use-global-hook'

const store = createGlobalHook('counterStore', () => {
  const [count, setCount] = React.useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return { count, increment, decrement, reset }
})
```

This example uses the official React `useState()` hook, but you are not limited to this only, there are other hooks like `useReducer()` if you need something like Redux or any custom or third-party hook as far as it follows the Rules of Hooks, you can read more on Hooks on React official website [here](https://reactjs.org/docs/hooks-intro.html).

##### `useGlobalHook`

Next we'll need a piece to introduce our state back into the tree so that:

- When state changes, our components re-render.
- We can depend on our store state.
- We can call functions exposed by the store.

For this we have the `useGlobalHook` hook which allows us to get global store instances by using passing the value we used when creating the global hook with `createGlobalHook` function.

```jsx
function Counter () {
  const { count, decrement, increment } = useGlobalHook('counterStore')

  return (
    <div>
      <span>{count}</span>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

##### `<GlobalHooksProvider>`
The `<GlobalHooksProvider>` component has two roles:

1. It initializes global instances of given hooks array (an Array is required because React expects the number of hooks to be consistent across re-renders and Objects are not guaranteed to return in same order)
2. It uses context to pass initialized instances of given stores to all the components down the tree.

```jsx
ReactDOM.render(
  <GlobalHooksProvider hooks={[ counterStore ]}>
    <Counter />
  </GlobalHooksProvider>
);
```

### Testing

Because our containers are just hooks, we can construct them in
tests and assert different things about them very easily.

```js
import { renderHook, act } from 'react-hooks-testing-library'

test('counter', async () => {
  let count, increment, decrement
  renderHook(() => ({count, increment, decrement} = counterStore()))

  expect(count).toBe(0)

  act(() => increment())
  expect(count).toBe(1)

  act(() => decrement())
  expect(count).toBe(0)
})
```

## Related

- [Outstated](https://github.com/yamalight/outstated)
- [Unstated](https://github.com/jamiebuilds/unstated)
