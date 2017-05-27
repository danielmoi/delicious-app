- now we need to write to our DB
- because we've already required our models, they are now available on our mongoose already...
- this is because mongoose uses the singleton pattern

- JS won't wait until the save, because Node is asynchronous
- we used to have to use callbacks, and nest everything
- we would pass a callback with a error, and data params
- this led to christmas tree nesting = callback hell


- now we can use Promises
- they return immediately, but with a Promise, which is like a IOU note = I will eventually come back to you with the information or an error

```
store
.save()
.then(() => {
  // do stuff
})
```
- and we catch errors with a CATCH.

- that made it better, but we ended up in chaining-promise-land!

- NOW, we can use async/await!!
- we mark the function as async, and then we have access to the AWAIT keyword!
- to catch errors,  we have to wrap everything in a TRY

- OR we can use composition, and wrap our function in a higher function that will handle all our errors!

```js
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
```

- composition = wrapping a function in a function
