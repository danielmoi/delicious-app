- middleware is core concept
- it's how plugins work in Express
- between our request and our response, some work needs to happen
- maybe like data normalization

- like if we want to handle file uploading, we want to make that available to any page...

- req
  - user signs in with <form> and POSTs to /login
- bodyParser
  - makes the data sent in a POST available as nice properties on the req.body object
  - req.body.email = "daniel@HELLO.com"
- next()
- emailNormalize
  - an email Normalize middleware might prepare/validate data
  - req.body.email = req.body.email.trim().toLowerCase()
  - req.body.email // daniel@hello.com
- next()
- authorizeuser
  - an auth middleware will look up the user and check their password
  - 1. valid >> displayProfile
    - ready to render the template
    - res.render('account', { user: req.user });
  - 2. invalid >> displayLogin
    - req.flash('error', 'Invalid Login')
    - res.redirect('/login')

- we can have route middleware
```
router.get('/', storeController.myRouteMiddleware, storeController.homePage);
```

- or, we can have application-wide middleware, where the middleware is run BEFORE any of the ROUTES are hit
```
app.use() // means we are using this global middleware!
```

- our bodyParser MW
- our session MW will allow us to store data on our visitors - logged in state, how long they've been logged in, stuff that goes on from request to request


- it's all sequential (is it?)
- so we actually place more `app.use()` AFTER our routes, to handle stuff that gets missed by our routes = error handlers

- it's a like a big PLINKO machine, where you put in a REQUEST, and it just goes all the way down, and stuff gets done to it, redirected etc

- stack trace = WHAT led up to this error
