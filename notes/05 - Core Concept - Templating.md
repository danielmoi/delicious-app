- res.render will render out a TEMPLATE for us!
- pug is a popular templating language

- res.render needs 2 things
- 1. name of template to render out
- 2. local variables, passed as ONE object = "locals"

- classes: div.hello
- attributes div(data-tag="what")

- variables = interpolate with `#{}` in TEXT

- passing variables into ATTRIBUTES, need to use JS = template literals with backticks

- use JS = `-`


----
- we want to re-use templates, like a header etc
- we EXTEND templates
- we use LAYOUTS, and leave holes in our layouts for the footer etc


- a BLOCK is something that can be filled in by another TEMPLATE
- after that, we essentially write what will be the "default" for the block, if that block is not passed in
