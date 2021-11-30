import React from 'react'
import { shallow } from 'enzyme'

import ProductItems from '../ProductItems'

describe('ProductItems', () => {
  it('should render self and subcomponents', () => {
    const props = {
      itemsByPackages: [
        {
          firstLogisticsInfo: {
            itemIndex: 1,
            itemId: '1',
          },
          selectedSlaItem: {
            id: 'normal',
            shippingEstimate: '10bd',
          },
          items: [
            {
              name: 'title',
              imageUrl:
                'https://basedevmkp.vteximg.com.br/arquivos/ids/168552-55-55/3413316.jpg',
              uniqueId: '10',
            },
          ],
        },
      ],
    }

    const wrapper = shallow(<ProductItems {...props} />)

    expect(wrapper.find('img').prop('src')).toBe(
      '//basedevmkp.vteximg.com.br/arquivos/ids/168552-50-50'
    )

    expect(wrapper.find('img').prop('alt')).toBe('title')
  })
})
