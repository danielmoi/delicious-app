- now we need to query stores that have a particular tag!

```js
const results = await Promise.all([tagsPromise, storesPromise]);

res.render('tag', {
  title: 'Tags',
  tags: results[0],
  stores: results[1],
  tag,
});
```

Or, we can do this:
```js
const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

res.render('tag', {
  title: 'Tags',
  tags,
  stores,
  tag,
});
```
