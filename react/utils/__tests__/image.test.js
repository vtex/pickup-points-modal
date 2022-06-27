import { fixImageUrl } from '../Images'

describe('fixImageUrl', () => {
  it('should return the resized image URL', () => {
    const baseUrl = '//omniera.vteximg.com.br/arquivos/ids'

    const cleanedImage = fixImageUrl(
      `http:${baseUrl}/155401-135-135/CAN-09-04--1-.jpg`
    )

    const cleanedImage2 = fixImageUrl(
      `http:${baseUrl}/ahsuh155401as-135-135/CAN-09-04--1-.jpg`
    )

    const cleanedImage3 = fixImageUrl(
      `http:${baseUrl}/155sdsdsd401-135-135/CAN-09-04--1-.jpg`
    )

    expect(cleanedImage).toBe(`${baseUrl}/155401-50-50`)
    expect(cleanedImage2).toBe(`${baseUrl}/ahsuh155401as-50-50`)
    expect(cleanedImage3).toBe(`${baseUrl}/155sdsdsd401-50-50`)
  })
})
