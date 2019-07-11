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
import { GlobalHooksProvider, useGlobalHook } from '@devhammed/use-global-hook'

const store = () => {
  const [count, setCount] = React.useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return { count, increment, decrement, reset }
}

function Counter () {
  const { count, increment, decrement, reset } = useGlobalHook('store') /** Name of the store passed in hooks object below **/

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

ReactDOM.render(
  <GlobalHooksProvider hooks={{ store }}>
    <Counter />
    <Counter />
    <Counter />
  </GlobalHooksProvider>,
  document.getElementById('root')
)
```

Notice how we render the `Counter` component three times? clicking on a button in one of the component instance will update others too.

See it running live [here](https://devhammed.github.io/use-global-hook).

### Concepts

use-global-hook is built on top of React Hooks, context
and patterns surrounding those elements.

It was adapted from [Outstated](https://github.com/yamalight/outstated) which is almost similar but I removed the need to import store when needed in a component.

It has three pieces:

##### `Store`

It's a place to store our state and some of the logic for updating it.

A Store is simply a React Hook (which means you can re-use it, use other hooks within it, etc).

You can use anything as a store as far as it is a React Hook.

```js
import { useState } from 'React'

const store = () => {
  const [state, setState] = useState({ test: true })

  const update = val => setState(val)

  return { state, update }
}
```

Note that stores use `useState` hook from React for managing state.
When you call `setState` it triggers components to re-render,
so be careful not to mutate `state` directly or your components won't re-render.

##### `useGlobalHook`

Next we'll need a piece to introduce our state back into the tree so that:

- When state changes, our components re-render.
- We can depend on our store state.
- We can call functions exposed by the store.

For this we have the `useGlobalHook` hook which allows us to get global store instances
by using passing the name of the store used in the hooks object in `<GlobalHooksProvider>`.

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

1. It initializes global instances of given hooks object (this is required because React expects the number of hooks to be consistent across re-renders)
2. It uses context to pass initialized instances of given stores to all the components down the tree.

```jsx
ReactDOM.render(
  <GlobalHooksProvider hooks={{ counterStore }}>
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
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
