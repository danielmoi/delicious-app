- use mlab

- let's install locally
```
brew update
```
- this gets the latest DEFINITIONS

```
brew install mongodb
```
```
mongo --version
```

- let's use mongo > 3.4


- get Mongo up and running
```
mongod
```

- i get an error about /data/db not being found
- exception in initAndListen: 29 Data directory /data/db not found., terminating

- create data and db in Finder (don't use sudo because that restricts users to root....?)
- then connect Atlas to the local DB!
