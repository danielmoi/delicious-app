- flash is about telling the user something, without redirecting them

- we use `req.flash`
- how is that method available to us?

```
app.use(flash());
```

- it's in our middleware!
- we are using the connect-flash module
- we can have our own categories:

```
req.flash('warning')
req.flash('error')
req.flash('info')
req.flash('success')
```

- these are only available on the NEXT request...?

```
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});
```

- we then take the flashes and put them inside RES.locals
- locals is the variable that is available to our html templates

- bang-equals (!=) tells pug to parse any HTML inside our string
- <strong>hello</strong> will be bold

- this will only work if we use sessions
- the whole idea of sessions is that we can save data between requests, else our application is stateless and there is no real way of passing data from one request to another
