```
storeSchema.index({
  location: '2dsphere',
});
```


- we can slim down the data returned:
```js
const stores = await Store
  .find(query)
  .select('slug name description location');
```

