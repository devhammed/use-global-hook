import React from 'react'

const GlobalHooksContext = React.createContext()

export function GlobalHooksProvider ({ hooks, children }) {
  let globalHooks = {}
  const parentContext = React.useContext(GlobalHooksContext)

  if ({}.toString.call(hooks) !== '[object Array]') {
    throw new TypeError(
      'You must provide a hooks array to initialize <GlobalHooksProvider>.'
    )
  }

  // felt cute, might delete later...
  if (parentContext) {
    globalHooks = { ...parentContext }
  }

  hooks.forEach(hook => {
    if (typeof hook !== 'function') {
      throw new TypeError(
        `Provided global hook value "${hook}" is not a function.`
      )
    }

    const hookName = hook.globalHookName

    if (typeof hookName !== 'string') {
      throw new SyntaxError(
        'One of your Global Hook functions did not initialize correctly, pass it to `createGlobalHook` function with the unique name to fix this error.'
      )
    }

    if (hookName in globalHooks) {
      throw new SyntaxError(
        `Don't duplicate entry in global hooks, a hook with the name ${hookName} already exist.`
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
    throw new TypeError(`Provided hook value for "${name}" is not a function.`)
  }

  const globalHookFunction = (...args) => fn(...args)
  globalHookFunction.globalHookName = name

  return globalHookFunction
}

export function useGlobalHook (name) {
  const context = React.useContext(GlobalHooksContext)

  if (!context) {
    throw new SyntaxError(
      'You must wrap your components with a <GlobalHooksProvider>.'
    )
  }

  const value = context[name]

  if (!value) {
    throw new ReferenceError(
      `Provided store instance for "${name}" did not initialize correctly.`
    )
  }

  return value
}

export function withGlobalHooks (component, hooks) {
  if (!component) {
    throw new TypeError(
      'You cannot pass in empty component to withGlobalHooks.'
    )
  }

  if ({}.toString.call(hooks) !== '[object Array]') {
    throw new TypeError(
      'You must provide a hooks name array to initialize withGlobalHooks.'
    )
  }

  const withGlobalHOC = props => {
    const stores = {}

    hooks.forEach(hook => {
      stores[hook] = useGlobalHook(hook)
    })

    return React.createElement(component, { ...props, ...stores })
  }

  withGlobalHOC.displayName = `withGlobalHooks(${component.name})`

  return withGlobalHOC
}
