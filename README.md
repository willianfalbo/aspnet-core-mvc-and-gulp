
# 1 - Install Node.js
https://nodejs.org/en/download/

# 2 - Install Gulp
https://gulpjs.com/docs/en/getting-started/quick-start

# 3 - Restore aspnet core dependencies
`dotnet restore`

# 4 - Restore node modules
`npm install`

# 5 - Run or watch for changes in aspnet core mvc
`dotnet run` or `dotnet watch run`

# 6 - Run or watch for changes in './scripts', './styles' and './node_modules'
`gulp build` or `gulp watch`
(after running the above command, all changes will be located in './wwwroot/...')
(to modify it, open the file 'gulpfile.js')
