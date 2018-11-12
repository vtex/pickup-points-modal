let gguid = 1

export default function getGGUID() {
  return (gguid++ * new Date().getTime() * -1).toString()
}
