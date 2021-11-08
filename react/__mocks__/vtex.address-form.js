import {
  addValidation,
  removeValidation,
  AddressRules,
  AddressContainer,
  CountrySelector,
  PostalCodeGetter,
  getAddressByGeolocation,
} from '@vtex/address-form'
import {
  isValidAddress,
  validateAddress,
  validateField,
} from '@vtex/address-form/lib/validateAddress'
import InputError from '@vtex/address-form/lib/inputs/DefaultInput/InputError'
import InputText from '@vtex/address-form/lib/inputs/DefaultInput/InputText'
import DefaultInput from '@vtex/address-form/lib/inputs/DefaultInput'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import AddressSummary from '@vtex/address-form/lib/AddressSummary'
// Added react context for injectRules mock
// eslint-disable-next-line
import React from 'react'

function injectRules(component) {
  return component
}

const shapes = {
  AddressShapeWithValidation,
}

const helpers = {
  addValidation,
  removeValidation,
  validateAddress,
  isValidAddress,
  validateField,
  injectRules,
  getAddressByGeolocation,
}

const countries = {
  defaultRules: {},
}

const inputs = {
  InputError,
  InputText,
  DefaultInput,
}

const components = {
  AddressSummary,
  AddressRules,
  AddressContainer,
  CountrySelector,
  PostalCodeGetter,
}

module.exports = { components, countries, inputs, helpers, shapes }
