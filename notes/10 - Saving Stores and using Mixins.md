- let's pull our Form out
- so it's reusable

- a mixin is sort of like a function in JS

- to IMPORT a mixin from a PUG page, we do:
```
include mixins/_storeForm
```

- and to USE it, we do:
```
+storeForm()
```


- the FORM tag has 2 important things
1. action = where to send the data = which route = WHERE to send the data
2. method = which HTTP verb = HOW to send the data

- GET is actually just sending the information in the URL! (when inside a FORM!!!!!)


----
- sending our data

- got this error:
Resource interpreted as Document but transferred with MIME type application/json: "http://localhost:7777/add".

- this is because of our encoding type (multipart/form-data)
- which uses FormData
- which we NEED when uploading images (they can be big, and need to be streamed / multi-part)
- let's remove that for now

- now we're all set to save our data to our DB!
