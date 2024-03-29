const pagination = require('../')

let request
let response
const next = () => {}

beforeEach(() => {
  request = {
    query: {}
  }
})

describe('Pagination middleware', () => {
  test('No pagination requested', () => {
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(false)
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })

  test('Default configuration', () => {
    // Min by default: 20
    request.query.limit = '10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // Max by default: 500
    request.query.limit = '10000'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 500, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })

  test('Custom Configuration', () => {
    // Min by default: 20
    request.query.limit = '10'
    pagination({ min: 10 })(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 10, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 10, offset: 0 })

    // Max by default: 500
    request.query.limit = '1000'
    pagination({ max: 1000 })(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 1000, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })

  test('Offset behaviour', () => {
    // Avoid negative values
    request.query.offset = '-10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // Valid transformation
    request.query.offset = '500'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 500 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })

  test('Limit behaviour', () => {
    // Negative value
    request.query.limit = '-10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // low value
    request.query.limit = '10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // high value
    request.query.limit = '1500'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 500, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // Regular value
    request.query.limit = '456'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 456, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })

  test('Page behaviour', () => {
    // Negative value
    request.query.page = '-10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // Valid transformations
    request.query.page = '0'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 0 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    request.query.page = '1'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 20 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    request.query.page = '25'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 500 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })

    // If both page and offset are set, page is ignored
    request.query.page = '1'
    request.query.offset = '10'
    pagination()(request, response, next)
    expect(request.pagination.isEnable).toBe(true)
    expect(request.pagination.current).toStrictEqual({ limit: 20, offset: 10 })
    expect(request.pagination.default).toStrictEqual({ limit: 20, offset: 0 })
  })
})
