import React from 'react'

const GlobalHooksContext = React.createContext()

export function GlobalHooksProvider ({ hooks, children }) {
  let globalHooks = {}
  let parentContext = React.useContext(GlobalHooksContext)

  if ({}.toString.call(hooks) !== '[object Array]') {
    throw new TypeError(
      'You must provide a hooks array to initialize <GlobalHooksProvider> for initialization!'
    )
  }

  if (parentContext) {
    globalHooks = { ...parentContext }
  }

  hooks.map(hook => {
    if (typeof hook !== 'function') {
      throw new TypeError(`Provided hook value "${hook}" is not a function!`)
    }

    const hookName = hook.globalHookName

    if (typeof hookName !== 'string') {
      throw new SyntaxError(
        'One of your Global Hook functions is not initialized correctly, passed it to `createGlobalHook` function with the unique name to fix this error.'
      )
    }

    if (hookName in globalHooks) {
      throw new SyntaxError(
        `Duplicate entry for global hooks, a hook with name ${hookName} already exist.`
      )
    }

    globalHooks[hookName] = hook()
  })

  return React.createElement(
    GlobalHooksContext.Provider,
    { value: globalHooks },
    children
  )
}

export function createGlobalHook (name, fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(`Provided hook value for "${name}" is not a function!`)
  }

  const globalHookFunction = (...args) => fn(...args)
  globalHookFunction.globalHookName = name

  return globalHookFunction
}

export function useGlobalHook (name) {
  const context = React.useContext(GlobalHooksContext)

  if (!context) {
    throw new SyntaxError(
      'You must wrap your components with a <GlobalHooksProvider>!'
    )
  }

  const value = context[name]

  if (!value) {
    throw new ReferenceError(
      `Provided store instance for "${name}" did not initialized correctly!`
    )
  }

  return value
}
