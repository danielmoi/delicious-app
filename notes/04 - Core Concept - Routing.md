- routing is a fundamental concept

- the callback when we hit any route gets three arguments
  - request
  - response, and a bunch of methods for sending data back
  - next, for our middleware, when we don't want to be sending the response just yet

- if we try to do:
```
res.send('Hello');
res.json(myObject);
```
- we will get an error: Headers already sent – we can't send using more than 1 method!


 if we do:
 ```
 res.json(req.query);
 ```
 - we echo back whatever is after the "?"
 - localhost:7777?name=Daniel&age=1000

- if we look at app.js, we have:
```
bodyParser.json();
bodyParser.urlencoded({ extended: false });
```

- bodyParser takes the RAW REQUEST, and turns it into usable properties on REQ.BODY

- req.body is for POSTed parameters
- req.params for stuff in the URL
- req.query for stuff in the URL
