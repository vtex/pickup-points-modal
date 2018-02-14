import React from 'react'
import { shallow } from 'enzyme'
import Heading from './Heading'

describe('Heading', () => {
  it('should render default h2 with default size, level and text', () => {
    const props = {
      children: 'title',
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h2').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h2').hasClass('f3')).toBe(true)

    expect(wrapper.find('h2').text()).toBe('title')
  })

  it('should render h1 with default size with default text', () => {
    const props = {
      level: '1',
      children: 'title',
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h1').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h1').hasClass('f3')).toBe(true)

    expect(wrapper.find('h1').text()).toBe('title')
  })

  it('should render h3 with size 4 and default text', () => {
    const props = {
      level: '3',
      children: 'title',
      size: '4',
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h3').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h3').hasClass('f4')).toBe(true)

    expect(wrapper.find('h3').text()).toBe('title')
  })

  it('should render h3 with size 4 and default text with variation uppercase', () => {
    const props = {
      level: '3',
      children: 'title',
      size: '4',
      variation: 'uppercase',
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h3').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h3').hasClass('f4')).toBe(true)

    expect(wrapper.find('h3').hasClass('ttu')).toBe(true)

    expect(wrapper.find('h3').text()).toBe('title')
  })

  it('should render h3 with size 5 and default text with variation uppercase', () => {
    const props = {
      level: '3',
      children: 'title',
      size: '5',
      variation: 'uppercase',
      margin: true,
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h3').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h3').hasClass('f5')).toBe(true)

    expect(wrapper.find('h3').hasClass('ttu')).toBe(true)

    expect(wrapper.find('h3').text()).toBe('title')
  })

  it('should render h3 with size 6 and default text with variation bolder without margin', () => {
    const props = {
      level: '4',
      children: 'title',
      size: '6',
      variation: 'bolder',
      margin: false,
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h4').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h4').hasClass('f6')).toBe(true)

    expect(wrapper.find('h4').hasClass('fw7 silvers')).toBe(true)

    expect(wrapper.find('h4').text()).toBe('title')
  })

  it('should render h3 with size 7 and default text with variation bolder without margin', () => {
    const props = {
      level: '4',
      children: 'title',
      size: '7',
      variation: 'bolder',
      margin: false,
    }
    const wrapper = shallow(<Heading {...props} />)

    expect(wrapper.find('h4').hasClass('lh-title')).toBe(true)

    expect(wrapper.find('h4').hasClass('f7')).toBe(true)

    expect(wrapper.find('h4').hasClass('fw7 silvers')).toBe(true)

    expect(wrapper.find('h4').text()).toBe('title')
  })
})
