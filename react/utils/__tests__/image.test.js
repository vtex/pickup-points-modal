import { fixImageUrl, replaceHttpToRelativeProtocol } from '../Images'

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

describe('fixImageUrl edge cases', () => {
  const baseUrl = '//omniera.vteximg.com.br/arquivos/ids'

  it('keeps the id of a URL that carries no size segment', () => {
    // The regex alternation `(?:-(\d+)-(\d+)|)` has an EMPTY branch, so capture
    // groups 2 and 3 really are undefined for an unsized URL. This is why the
    // `result[2] !== undefined` checks in cleanImageUrl are meaningful — Sonar
    // flags them as always-true (javascript:S3403) because it types exec's
    // result as string[], but at runtime they are not. This test is the
    // evidence that the finding is a false positive.
    expect(fixImageUrl(`http:${baseUrl}/155401/CAN-09-04.jpg`)).toBe(
      `${baseUrl}/155401-50-50`
    )
  })

  it('strips the existing size segment before applying the new one', () => {
    expect(fixImageUrl(`http:${baseUrl}/155401-999-999/CAN.jpg`)).toBe(
      `${baseUrl}/155401-50-50`
    )
  })

  it('ignores any extra arguments and always resizes to the default 50x50', () => {
    // fixImageUrl forwards only the URL to changeImageUrlSize, so that
    // function's width / height / highDensityFactor parameters are dead
    // configuration: nothing can reach them through the public API.
    expect(
      fixImageUrl(`http:${baseUrl}/155401-135-135/CAN.jpg`, 100, 200)
    ).toBe(`${baseUrl}/155401-50-50`)
  })

  it('rewrites an https URL to a protocol-relative one', () => {
    expect(fixImageUrl(`https:${baseUrl}/155401-135-135/CAN.jpg`)).toBe(
      `${baseUrl}/155401-50-50`
    )
  })

  it('returns undefined for a URL that does not match the ids pattern', () => {
    expect(fixImageUrl('http://example.com/not-an-image-path')).toBeUndefined()
  })

  it('returns undefined when no URL is given', () => {
    expect(fixImageUrl(undefined)).toBeUndefined()
    expect(fixImageUrl('')).toBeUndefined()
  })

  it('leaves an already protocol-relative URL alone', () => {
    expect(replaceHttpToRelativeProtocol(`${baseUrl}/155401`)).toBe(
      `${baseUrl}/155401`
    )
  })

  it('rewrites only the leading protocol of a URL', () => {
    expect(replaceHttpToRelativeProtocol('https://a.com/x')).toBe('//a.com/x')
    expect(replaceHttpToRelativeProtocol('http://a.com/x')).toBe('//a.com/x')
  })

  it('returns undefined when no URL is given to the protocol rewriter', () => {
    expect(replaceHttpToRelativeProtocol(undefined)).toBeUndefined()
    expect(replaceHttpToRelativeProtocol('')).toBeUndefined()
  })
})
