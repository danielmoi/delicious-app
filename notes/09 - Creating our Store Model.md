- MongoDB can be used with any language
- we are going to use Mongoose, a JS interface

- Wes = do data normalization as close to the MODEL as possible
- if the model has a built-in method to trim, do that, instead of doing it just before you save it

- import our models
- only have to do this once
- this is the SINGLETON concept, once you do it, you don't have to keep doing it

- we are going to generate our slugs in a PRE-SAVE HOOK
