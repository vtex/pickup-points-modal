const queryString = require('query-string')

export default function mockCheckout() {
  return getOrderForm()
    .then(addToCart)
    .then(enableShipping)
}

function getOrderForm() {
  return window.vtexjs.checkout.getOrderForm()
}

function enableShipping() {
  window.$('#shipping-data').trigger('enable.vtex')
  return Promise.resolve()
}

function addToCart() {
  const ADD_URL = '/checkout/cart/add'
  const isAdd = window.location.pathname.indexOf(ADD_URL) === 0

  if (isAdd) {
    const search = queryString.parse(window.location.search)

    return window.vtexjs.checkout
      .addToCart(
        transformSearchToItems(search),
        null,
        Array.isArray(search.sc) ? search.sc[0] : search.sc
      )
      .then(setLocale)
      .then(setUserEmail)
  }

  return Promise.resolve()
}

const transformSearchToItems = search => {
  if (Array.isArray(search.qty)) {
    return search.qty.map((_, index) => ({
      id: search.sku[index],
      quantity: search.qty[index],
      seller: search.seller[index],
    }))
  }

  return [
    {
      id: search.sku,
      quantity: search.qty,
      seller: search.seller,
    },
  ]
}

function setLocale() {
  return window.vtexjs.checkout.sendAttachment('clientPreferencesData', {
    locale: 'pt-BR',
  })
}

function setUserEmail() {
  if (Cypress.env('isLogged')) {
    window.$(window).on('authenticatedUser.vtexid', () => {
      setTimeout(() => {
        window.vtexjs.checkout.getOrderForm()
      }, 2000)
    })

    return window.vtexjs.checkout.sendAttachment('clientProfileData', {
      email: 'nando@mailinator.com',
    })
  }
}
