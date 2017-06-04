- we will implement the global gravatar using a VIRTUAL FIELD in mongoose
- it is a field that can be generated
- eg. storing a person's weight in kg, we don't also want to store the weight in pounds
- that other field can be generated on the fly

- as in, we won't be storing this in the Database

```js
// virtual field for gravatar
userSchema.virtual('gravatar').get(function() {
  return 'http://fillmurray.com/300/300';
});
```

- let's use a gravatar instead
- it uses md5
- which is a hashing algorithm
- takes the user's email address >> hashes it!
- this is so that the user's email address is not visible in the IMG SRC!!!!!!


----
- now, we shouldn't be able to add a store unless we are logged in
- so let's add a piece of middleware that checks if a user is logged in


