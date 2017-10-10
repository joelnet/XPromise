export default (({ U, tryCatch }) => U(XPromise => Object.assign(
  (action, state = { resolvers: [], rejectors: [] }) => (
    tryCatch(
      () =>
        action(
          value =>
            !state.left && !state.right &&
            (
              state.right = typeof state.then === 'function' ? state.then(value) : value,
              state.resolvers.map(resolver => resolver(state.right)),
              state.resolvers.splice(0)
            ),
          value =>
            !state.left && !state.right &&
            (
              typeof state.catch === 'function'
                ? state.right = state.catch(value)
                : state.left = value,
              state.rejectors.map(resolver => resolver(state.left)),
              state.rejectors.splice(0)
            ),
        ),
      (err) => (
        delete state.right,
        state.left = err,
        state.rejectors.map(f => f(state.left))
      )
    ),
    {
      then: (f, g) => (
        XPromise(XPromise)(
          (resolve, reject) => (
            'left' in state ? reject(state.left) : state.rejectors.push(reject),
            'right' in state ? resolve(state.right) : state.resolvers.push(resolve)
          ),
          { then: f, catch: g, resolvers: [], rejectors: [] },
        )
      ),
      catch: f => (
        XPromise(XPromise)(
          (resolve, reject) => (
            'left' in state ? reject(state.left) : state.rejectors.push(reject),
            'right' in state ? resolve(state.right) : state.resolvers.push(resolve)
          ),
          { catch: f, resolvers: [], rejectors: [] },
        )
      ),
    }
  ),
  {
    resolve: value => XPromise(XPromise)(resolve => resolve(value)),
    reject: value => XPromise(XPromise)((_, reject) => reject(value)),
  }
)))({
  U: f => f(f),
  tryCatch: (tryfunc, catchfunc) => {
    try {
      tryfunc()
    } catch (err) {
      catchfunc(err)
    }
  },
})
