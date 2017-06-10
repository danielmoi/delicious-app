- we need to create a relationship between our stores, and the USER that created them!


- when we look at _id, we see that it is not a type String, but it is of a type "ObjectID"!


- now, to get the entire author object when we request a store, we need to call the populate method

- now we can stop people from editing stores that they do not OWN!

- in order to compare an ObjectId type with a String type, we need to use the .equals method

- now let's only show the edit icon if the user is the store's owner!

```
if user && store.author.equals(user._id)
```
- we check for user to stop node from evaluating if no one is logged in (eg. in incognito, or someone who isn't logged in)

- we can also add extra permissions
10 - Admin
15 - AdminEditor
20 - Editor

so we can go
- if user && store.author.equals(user._id) || user.level < 10
