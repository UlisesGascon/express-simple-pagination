<p align="center">
<h1 align="center">
  express-simple-pagination
</h1>

<p align="center">
  Express middleware for simple pagination. Easy way to handle limit and offset
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/express-simple-pagination"><img src="https://badgen.net/npm/v/express-simple-pagination" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/express-simple-pagination"><img src="https://badgen.net/npm/license/express-simple-pagination" alt="license"/></a>
  <a href="https://www.npmjs.org/package/express-simple-pagination"><img src="https://badgen.net/npm/dt/express-simple-pagination" alt="downloads"/></a>
  <a href="https://snyk.io/test/github/ulisesgascon/express-simple-pagination"><img src="https://snyk.io/test/github/ulisesgascon/express-simple-pagination/badge.svg" alt="Known Vulnerabilities"/></a>
</p>

</p>


# About

Express middleware for simple pagination. Easy way to handle limit and offset.

The pagination middleware will add an object `pagination` to `request`. 

By default it includes:

- The default values for pagination.
- The current pagination request.
- If the pagination is active.
- Default values, Range validation, wrong values validation and sanitization.
- By default the offset will be 0 and the limit range between (20-500)
- Full customizable
- Easy to use and 100% test coverage

```txt
req.pagination = {
    isEnable: Boolean(),               // This indicates if the pagination was requested in the url
    default: { limit: 20, offset: 0 }, // default values
    current: { limit: 20, offset: 0 } // In case that the pagination was requested, this estimates the real pagination using ranges and default values.
}
```

This middelware will be triggered by query params `offset` and/or `limit`, like:

- `/route?limit=10`
- `/route?limit=100&offset=500`
- `/route?offset=350`

# Usage

## Install

```bash
npm install express-simple-pagination
```

## Simple Usage (Enable All Pagination Requests)

```js
const express = require('express')
const pagination = require('express-simple-pagination')
const app = express()

app.use(pagination())

app.get('/products', (req, res, next) => {
  res.json({msg: req.pagination})
})

app.listen(3000, () => {
  console.log('web server listening on port 80')
})
```

output:

```txt
/products
└──> msg: {req.isEnable: false, default: { limit: 20, offset: 0 }}
/products?limit=200
└──> msg: {req.isEnable: false, current: { limit: 200, offset: 0 }, default: { limit: 20, offset: 0 }}
/products?limit=200&offset=600
└──> msg: {req.isEnable: false, current: { limit: 200, offset: 600 }, default: { limit: 20, offset: 0 }}
/products?limit=4000
└──> msg: {req.isEnable: false, current: { limit: 200, offset: 0 }, default: { limit: 20, offset: 0 }}
/products?limit=-10
└──> msg: {req.isEnable: false, current: { limit: 20, offset: 0 }, default: { limit: 20, offset: 0 }}
/products?offset=-10
└──> msg: {req.isEnable: false, current: { limit: 20, offset: 0 }, default: { limit: 20, offset: 0 }}
```

## Enable pagination for a Single Route

```js
const express = require('express')
const pagination = require('express-simple-pagination')
const app = express()
  
app.get('/products', pagination(), (req, res, next) => {
  res.json({msg: req.pagination})
})

app.get('/clients', (req, res, next) => {
  res.json({msg: req.pagination})
})

app.listen(3000, () => {
  console.log('web server listening on port 80')
})
```

output:

```txt
/products
└──> msg: {req.isEnable: false, default: { limit: 20, offset: 0 }}

/clients
└──> msg: undefined
```

## Configuring Pagination (items per page)

```js
const express = require('express')
const pagination = require('express-simple-pagination')
const app = express()

const paginationOptions = {
  min: 5,
  max: 1000
}

app.get('/products', pagination(), (req, res, next) => {
  res.json({msg: req.pagination})
})

app.listen(3000, () => {
  console.log('web server listening on port 80')
})
```

output:

```txt
/products
└──> msg: {req.isEnable: false, default: { limit: 5, offset: 0 }}
/products?limit=1
└──> msg: {req.isEnable: false, current: { limit: 5, offset: 0 }, default: { limit: 5, offset: 0 }}
/products?limit=2400000&offset=600
└──> msg: {req.isEnable: false, current: { limit: 1000, offset: 600 }, default: { limit: 5, offset: 0 }}
/products?limit=4000
└──> msg: {req.isEnable: false, current: { limit: 4000, offset: 0 }, default: { limit: 5, offset: 0 }}
```

# Test

You can run them:

```bash
npm run test:coverage
```

# Contributing

Please check [CONTRIBUTING](./CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**express-simple-pagination** © [Ulises Gascón](https://github.com/ulisesgascon), Released under the [MIT](./LICENSE) License.