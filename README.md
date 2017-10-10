# Challenge: Program without any variables #javascript

The challenge is to create a piece of software (something real, tangible and more than a hello world) without any variables.

The idea came from a tweet. Which I responded (in jest) with try to “code without variables”.

https://twitter.com/javascriptking/status/908258893905534978

https://twitter.com/joelnet/status/908267697246318592

The code I am planning on writing is a Promise library. I was inspired by an article I stumbled across by @treyhuffine, [Learn JavaScript Promises by Building a Promise from Scratch](https://medium.com/gitconnected/understand-javascript-promises-by-building-a-promise-from-scratch-84c0fd855720)

I believe Promises are simple enough to understand the code and also complex enough to be a challenge.

## Warning

If I were to compare writing clean code to riding the Tour de France, _this code is not that_. This code would be better compared to the X-Games BMX Freestyle Big Air. You about to see a couple of double backflips and 360s, but when _you_ get on _your_ bike it's probably best to keep all wheels on the road. Kids, don't try this at home or work.

With that being said (_if you allow yourself_) there is a lot to learn from this code and I encourage you to create your own playground and see how extreme and freaky you can get. It’s at the edges is where you’ll discover the most interesting things.

## Rules

* Keywords not allowed: `var`, `let`, `const`, `import`, `class`, `function`. Bonus points for not using `if` or `switch` keywords.
* Libraries are allowed as long as all rules are followed.
* New libraries can be created, but must follow all rules.
* Libraries must be generic enough to use in any project and cannot be a substitution for the business logic of the code created.
* Tests are excluded from the rules.

##  Let's Start!

### TDD

A Promise library is farily complex and as I make changes to the code, I want to be sure those changes don't break anything that previously was working. So I am going to start by writing out all my tests first. This is made easy because node already includes a Promise library, so I will test that first.

One difference, is I do not plan to create any classes as **I find classes unnecessary in JavaScript**. So instead of the typical code you would use to create a Promise `new Promise((resolve, reject))`, You can just use `XPromise((resolve, reject))`; no `new` keyword is necessary.

[XPromise.tests.js](__tests__/XPromise.tests.js)

### Create the interface

Right away I was presented with a challenging task. Similar to the A+ Promise implementation, I wanted to be able to create a Promise using `XPromise((resolve, reject) => ...)`, `Promise.resolve(...)` and `Promise.reject(...)`. So `XPromise` needs to be a function, but also have 2 properties (`resolve` and `reject`), which are also functions.

Normally this would not require much thought, but because of the rules I am unable to do something like this:

```javascript
// Invalid: Breaks the rules
const XPromise = () => {}
XPromise.resolve = () => {}
XPromise.reject = () => {}

export default XPromise
```

I start with a creative use of `Object.assign` to attach `resolve` and `reject` to the main function.

```javascript
// Good: Follows the rules!
export default Object.assign(
  () => {},
  {
    resolve: () => {},
    reject: () => {},
  }
)
```

That is, until I realize `resolve` and `reject` are just helper functions for the main `XPromise` function, which now there is no reference to.

### Creating a reference without a variable

The next problem becomes more difficult. `XPromise` needs to return an object that contains 2 functions, `then` and `catch`. Those functions must call the original function, which there is no longer a reference to.

```javascript
export default Object.assign(
  () => {
    return {
      // uh oh. can't reference XPromise anymore!
      then: () => XPromise(/* ... */),
      catch: () => XPromise(/* ... */),
    }
  },
  {
    resolve: () => {},
    reject: () => {},
  }
)
```

So I need figure out how to create an asychonous, recursive, anonymous function or this whole thing is gonna be a bust. Crap.

### It's time to learn about Combinators

When talking about anonymous recursive functions, the Y combinator immediately comes to mind. The Y Combinator isn't the only one we can use; I decided to use the much more simple U Combinator.

I like the U Combinator because it's easy to remember.

```javascript
f => f(f)
```

That's it. The U Combinator takes a function and calls the function with the same function. Now the first argument of your function will be your function. If that still sounds confusing, that's because it is. Don't worry about that, it'll be easier to see in code.

```javascript
// typical recursion
const sum = array => 
  array.length === 0
    ? 0
    : array[0] + sum(array.slice(1))

sum([1, 2, 3]) // > 6

// recursion with the U Combinator
const U = f => f(f)

U(sum => array =>
  array.length === 0
    ? 0
    : array[0] + sum(sum)(array.slice(1))
    //           ^-- Notice the change here to call sum(sum).
)([1, 2, 3]) // > 6
```
Perfect! This exactly what we need! Now it's time to jam it the code.

```javascript
export default (({ U }) => U(XPromise => Object.assign(
  (action) => {
    action(
      value = {},
      value = {},
    )

    return {
      then: () => { },
      catch: () => { },
    }
  },
  {
    resolve: value => XPromise(XPromise)(resolve => resolve(value)),
    reject: value => XPromise(XPromise)((_, reject) => reject(value)),
  }
)))({
  U: f => f(f)
})
```

The worst is over! If I haven't lost you and are still following... rest assured, for the remainder of this article we'll be coasting down hill!

### Storing state

This application, like others has to store state. Typically, this would be done with variables. We can also accomplish the same thing using default parameters. This will also give the added benefit of being able to call the function and seed it with a new state.

```javascript
// typical state management
(action) => {
  const state = {}
  state.right = 'success!'
}

// state management with default parameters
(action, state = {}) => {
  state.right = 'success!'
}
```
### Converting blocks to expressions

I prefer expressions over blocks. This is just a preference of mine. `if` statements and `try/catch` contain blocks, so I want an alternative. I also like to use the comma operator to combine multiple expressions, which you will see below.

```javascript
// Typical code blocks
(resolve, reject) => {
  if ('left' in state) {
    reject(state.left)
  } else {
    state.rejectors.push(reject)
  }

  if ('right' in state) {
    resolve(state.right)
  } else {
    state.resolvers.push(resolve)
  } 
}

// The same code as an expression
(resolve, reject) => (
  'left' in state ? reject(state.left) : state.rejectors.push(reject),
  'right' in state ? resolve(state.right) : state.resolvers.push(resolve)
)
```

Next let's upgrade the exceptions

```javascript
const iThrowExceptions = () => {
  throw new Error('oh snap!')
}

// Typical try/catch
try {
  iThrowExceptions()
} catch(err) {
  console.log('ERROR', err)
}

// First create a tryCatch library
const tryCatch = (tryfunc, catchfunc) => {
  try {
    tryfunc()
  } catch (err) {
    catchfunc(err)
  }
}

// Now we can catch errors in expressions
tryCatch(
  () => iThrowExceptions(),
  (err) => console.log('ERROR', err)
)
```

### Fast forward >>

This article is about the code challenge of writing software without using variables. This article is not about how to create a Promise library. So to save time, I'm just gonna fast forward to the completed expression.

https://gist.github.com/joelnet/5824137c813026186cf8c605366bba33

