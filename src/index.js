import React from 'react'

const GlobalHooksContext = React.createContext()

export function GlobalHooksProvider ({ hooks, children }) {
  let hooksMap = {}

  if ({}.toString.call(hooks) !== '[object Object]') {
    throw new TypeError(
      'You must provide a hooks object to initialize <GlobalHooksProvider> for initialization!'
    )
  }

  for (let hook in hooks) {
    if ({}.hasOwnProperty.call(hooks, hook)) {
      let hookFn = hooks[hook]

      if (typeof hookFn !== 'function') {
        throw new TypeError(
          `Provided hook value for "${hook}" is not a function!`
        )
      }

      hooksMap[hook] = hookFn()
    }
  }

  return (
    <GlobalHooksContext.Provider value={hooksMap}>
      {children}
    </GlobalHooksContext.Provider>
  )
}

export function useGlobalHook (name) {
  var context = React.useContext(GlobalHooksContext)

  if (!context) {
    throw new SyntaxError(
      'You must wrap your components with a <GlobalHooksProvider>!'
    )
  }

  if (!name) {
    return context
  }

  var value = context[name]

  if (!value) {
    throw new ReferenceError(
      `Provided store instance for "${name}" did not initialized correctly!`
    )
  }

  return value
}
