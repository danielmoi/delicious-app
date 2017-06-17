- if you have a complex query, it's best not to put it in the controller, but put it on the model itself

- virtual is a mongoose method
- but aggregate is a MongoDB method, so we can't use the virtual fields method in our MongoDB method

- $lookup will populate a field that is sort of like our virtual field

- we get 'reviews', because MongoDB will lowercase our model, and add an 's' to the end of it!!


- the : means that we can put it all on one line

```jade
td: a(href=`/stores/${store.slug}`)= store.name
```

is the same as:
```jade
td
 a(href=`/stores/${store.slug}`)= store.name

```

