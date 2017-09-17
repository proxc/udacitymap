# Map
If your browser denies cross origin request from localhost the map will load a local saved version of the request.

## Run Requirements
open index.html in a web browser, all assets should be precompiled already
To run a websever from the root of the site run
Python 3:
`python -m http.server 8080`

or
Python 2:
`python -m SimpleHTTPServer 8080`

## Build Requirements
1. nodejs
2. npm

Do not edit the css files, or js files in src and dist folders, these are all compiled.

In a terminal run `npm install`
when it completes run `gulp`
this will watch sass and js files for changes and compile them to final assets

to generate minified assets run `gulp css-minify`, `gulp js-minify`


