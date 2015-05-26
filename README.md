# Nice elements

`nice-elements` is an angularJS module that contains all the nice input elements: simple inputs, choice fields, radio buttons,
search, yes-no field, etc.

## How to compile this module?

First, decide which modules you want in the compiled version of nice-elements. This can be configured at Gruntfile.js.

Then run `grunt default` and it should compile all the js and html files into `dist/nice.js`, and all the styles 
into `dist/nice.css`.

## How to test?

Test server is shipped with this project. Then a demo project from `demo` directory is available on `localhost:3030`.

    node server.js


## TODO:

- zaenkrat sem uspešno zrihtal samo nice-input, tako da je treba pogledat še ostale direktive - ne delajo še 
(spremeni v Gruntfile.js, da bo concatu še ostale direktive).

- v demo app je treba skopirat vse iz sandboxa in popravit kar ne dela

- aja, tud bootstrapa še ni v demo projektu, lahko bi se dodal že skompajlan bootstrap-css-only v demo