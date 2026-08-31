let gguid = 1

export default function getGGUID() {
  return (gguid++ * Date.now() * -1).toString()
}
