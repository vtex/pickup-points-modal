const DEFAULT_WIDTH = 50
const DEFAULT_HEIGHT = 50
const DEFAULT_HDF = 1

const baseUrlRegex = new RegExp(/.+ids\/(\d+)(?:-(\d+)-(\d+)|)\//)
const sizeRegex = new RegExp(/-(\d+)-(\d+)/)

function cleanImageUrl(imageUrl) {
  let resizedImageUrl = imageUrl
  const result = baseUrlRegex.exec(imageUrl)
  if (result.length > 0) {
    if (
      result.length === 4 &&
      result[2] !== undefined &&
      result[3] !== undefined
    ) {
      resizedImageUrl = result[0].replace(sizeRegex, '')
    } else {
      resizedImageUrl = result[0]
    }
    return resizedImageUrl
  }
  return undefined
}

function changeImageUrlSize(
  imageUrl,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  highDensityFactor = DEFAULT_HDF
) {
  // imageUrl example http://omniera.vteximg.com.br/arquivos/ids/155401-135-135/CAN-09-04--1-.jpg
  if (!imageUrl || !width || !height) return undefined
  const widthCalc = width * highDensityFactor
  const heightCalc = height * highDensityFactor
  const resizedImageUrl = imageUrl.slice(0, -1) // Remove last "/"
  return `${resizedImageUrl}-${widthCalc}-${heightCalc}`
}

export function replaceHttpToRelativeProtocol(url) {
  if (!url) {
    return undefined
  }
  return url.replace(/https:\/\/|http:\/\//, '//')
}

export function fixImageUrl(imageUrl) {
  return changeImageUrlSize(
    replaceHttpToRelativeProtocol(cleanImageUrl(imageUrl))
  )
}
