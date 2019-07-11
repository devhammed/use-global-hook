import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHooksProvider, useGlobalHook, createGlobalHook } from '../src'

import './index.css'

const counterStoreHook = createGlobalHook('counterStore', () => {
  const [count, setCount] = React.useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return { count, increment, decrement, reset }
})

function Counter () {
  const { count, increment, decrement, reset } = useGlobalHook('counterStore')

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
    <GlobalHooksProvider hooks={[ counterStoreHook ]}>
      <h1>use-GLOBAL-hook</h1>
      <Counter />
      <Counter />
      <Counter />
      <p>
        <a href='https://github.com/devhammed'>By Hammed Oyedele</a>
        {' | '}
        <a href='https://github.com/devhammed/use-global-hook'>
          View on GitHub
        </a>
        {' | '}
        <a href='https://npmjs.com/package/@devhammed/use-global-hook'>
          View on NPM
        </a>
      </p>
    </GlobalHooksProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
