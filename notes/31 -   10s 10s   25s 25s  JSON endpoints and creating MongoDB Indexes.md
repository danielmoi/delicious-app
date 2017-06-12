- now let's get our search up and running!

- first, we need to understand the concept of indexes!
- indexes support the efficient execution of queries in MongoDB
- without indexes, MongoDB must perform a COLLECTION SCAN - scan every document in a collection
- if an index exists for a query, MongoDB can use that to limit the number of documents it must inspect


- it's like saying to MongoDB to "do your homework on these fields, so that when I ask you, you already know what's in them!"

- all of the indexing will happen in our Schema
- we will highlight the fields that we anticipate will end up in POPULAR searches (.find)

- by default, our _id is always indexed (it's the fastest way to get a document)
- we can see this in our Compass app
- go to the Indexes tab, and we can see _id there
- in users, email is also already indexed. this is because of that plugin we used (it added that index)

- we will index name and description
- this is a COMPOUND INDEX - 2 fields being indexed as one index


- now to create our API endpoints
- Wes uses '/api/search'
- it's also really useful to VERSION our endpoints:
- '/api/v1/search' so users aren't affected by revisions

- ok, if we use $text, MongoDB will perform a text search on ANY fields INDEXED with a TEXT index!

- at present, the results are coming back in the ORDER in which the stores were CREATED in the DB!
- we need to sort our results on some sort of SCORE
- this is METADATA = kind of like invisible fields, that store information
- $meta will let us PROJECT (add a field)

```
score: 0.5384615384615384,
```


- figure out the keyboard / highlight search results thing

- also prevent cross-scripting attack!!!!
- we will use dompurify

- prevents this being entered in the Name field
```
Cookie Party <img src="http://fillmurray.com/500/500" onload="alert('Hello....!')" />
```

- we can add another pre-save hook to strip HTML from the titl
