import XPromise from '../XPromise'
import promisesAplusTests from 'promises-aplus-tests'

describe('Promises/A+ Tests', () => {
  test('passes', (done) => {
    const adapter = {
      deferred() {
        const deferred = {}
        deferred.promise = XPromise((resolve, reject) => {
          deferred.resolve = resolve
          deferred.reject = reject
        })
        return deferred
      }
    }
    promisesAplusTests(adapter, {bail: true}, () => {
      done()
    })
  }, 1000000)
})

describe('XPromise', () => {
  describe('XPromise', () => {
    test('resolves', () =>
      expect(XPromise(r => r('4641525453'))).resolves.toBe('4641525453'))

    test('resolves with timeout', () =>
      expect(XPromise(r => setTimeout(() => r('4641525453'), 100))).resolves.toBe('4641525453'))

    test('rejects', () =>
      expect(XPromise((_, r) => r('4641525453'))).rejects.toBe('4641525453'))

    test('rejects with timeout', () =>
      expect(XPromise((_, r) => setTimeout(() => r('4641525453'), 100))).rejects.toBe('4641525453'))

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

    test('only resolves', () =>
      XPromise((resolve, reject) => (resolve(123), reject(456)))
        .then(x => expect(x).toBe(123))
        .catch(x => { throw new Error('BAD') }))

    test('only rejects', () =>
      XPromise((resolve, reject) => (reject(123), resolve(456)))
        .then(x => { throw new Error('BAD') })
        .catch(x => expect(x).toBe(123)))
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
