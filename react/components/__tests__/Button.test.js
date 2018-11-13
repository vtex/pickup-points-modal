import React from 'react'
import { mount, shallow } from 'enzyme'
import Button from '../Button'

describe('Button', () => {
  it('should render self and subcomponents', () => {
    const wrapper = mount(<Button title="title" />)

    expect(wrapper.find('button').text()).toBe('title')
  })

  it('should render success mode', () => {
    const props = {
      title: 'title',
      kind: 'success',
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render primary mode', () => {
    const props = {
      title: 'title',
      kind: 'primary',
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render info mode', () => {
    const props = {
      title: 'title',
      kind: 'info',
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render alert mode', () => {
    const props = {
      title: 'title',
      kind: 'alert',
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render danger mode', () => {
    const props = {
      title: 'title',
      kind: 'danger',
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render muted mode with size xs and is not inline', () => {
    const props = {
      title: 'title',
      kind: 'muted',
      size: 'xs',
      inline: true,
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render link mode with size sm and disabled and is not lonely', () => {
    const props = {
      title: 'title',
      kind: 'link',
      size: 'sm',
      disabled: true,
      lonely: true,
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render light-primary mode with size lg and loading', () => {
    const props = {
      title: 'title',
      kind: 'light-primary',
      size: 'lg',
      isLoading: true,
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })

  it('should render light-danger mode with size xl not checked with fixed value', () => {
    const props = {
      title: 'title',
      kind: 'light-danger',
      size: 'xl',
      notChecked: false,
      fixedValue: false,
    }
    const wrapper = shallow(<Button {...props} />)

    expect(wrapper.getElements()[0]).toMatchSnapshot()
  })
})
