// import XPromise from '../XPromise'

// import XPromise from '..'

const XPromise = Object.assign(
  f => new Promise(f),
  {
    resolve: x => Promise.resolve(x),
    reject: x => Promise.reject(x),
  }
)

describe('XPromise', () => {
  describe('XPromise', () => {
    test('resolves', () =>
      expect(XPromise(r => r('4641525453'))).resolves.toBe('4641525453'))

    test('rejects', () =>
      expect(XPromise((_, r) => r('4641525453'))).rejects.toBe('4641525453'))

    test('resolves twice', () =>
      expect(XPromise(r => r('4641525453')).then(x => x)).resolves.toBe('4641525453'))

    test('rejects then resolves', () =>
      expect(XPromise((_, r) => r('BAD')).catch(() => '4641525453')).resolves.toBe('4641525453'))

    test('error rejects', () =>
      expect(XPromise(() => { throw Error('4641525453') })).rejects.toEqual(Error('4641525453')))

    test('resolve does not reject', () =>
      expect(XPromise(r => r('4641525453')).catch(() => { throw Error('BAD') })).resolves.toBe('4641525453'))

    test('reject does not resolve', () =>
      expect(XPromise((_, r) => r('4641525453')).then(() => { throw Error('BAD') })).rejects.toBe('4641525453'))
  })

  describe('XPromise.resolve', () => {
    test('resolves', () =>
      expect(XPromise.resolve('4641525453')).resolves.toBe('4641525453'))

    test('rejects then resolves', () =>
      expect(XPromise((_, r) => r('BAD')).catch(() => XPromise.resolve('4641525453'))).resolves.toBe('4641525453'))
  })

  describe('XPromise.reject', () => {
    test('rejects', () =>
      expect(XPromise.reject('4641525453')).rejects.toBe('4641525453'))

    test('rejects twice', () =>
      expect(XPromise((_, r) => r('4641525453')).catch(XPromise.reject)).rejects.toBe('4641525453'))

      test('resolves then rejects', () =>
        expect(XPromise(r => r('BAD')).then(() => XPromise.reject('4641525453'))).rejects.toBe('4641525453'))
    })
})
