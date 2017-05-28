- now let's make a Tags page

- databases are great for querying - let MongoDB do the heavy lifting
- we use an aggregation = query with multiple steps

- we can set custom methods on our Store model


- pipeline operators always begin with a Dollar Sign $
```js
return this.aggregate(); // takes an array of operators

return this.aggregate([
  // this is our pipeline
])

// this creates a list of stores, but with stores DUPLICATED for each tag in the tags array
return this.aggregate([
    { $unwind: '$tags' },
    { $group: {
      _id: '$tags',
      count: { // create a new property!
        $sum: 1,
      },
    }},
  ]);

  // gives us this:
  [
    {
      _id: "Wifi",
      count: 1
    },
    {
      _id: "Family Friendly",
      count: 1
    },
    {
      _id: "Licensed",
      count: 1
    },
    {
      _id: "Open Late",
      count: 1
    }
  ]
```
