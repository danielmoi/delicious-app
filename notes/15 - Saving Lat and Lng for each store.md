- custom data types

```
input(type="text" id="address" name="location[address]")
```

- this will construct an object:

```
location: {
  address: 'My address',
};
```
- this is what bodyParser({ extended: true }) means!
- nested data



- make sure that LNG comes first > Then LAT
- coordinates must be an Array in the Schema!
- else we will get a cast error


