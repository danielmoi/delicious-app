- Multer will allow us to upload files

- Jimp to help us resize the files

- now we need to change the encoding type of our form, so that our form is sent as a multi-part, as images are big, they need to be sent in bits

```
enctype="multipart/form-data"
```

- we need to setup Express to handle multi-part forms

- can't rely on file extension – use the mime-type instead


- Buffer is a representation of that file in MEMORY!
