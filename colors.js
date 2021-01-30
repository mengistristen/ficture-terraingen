const interpolate = require('color-interpolate')

const ocean = interpolate(['#0a46ad', '#35d6f2'])
const scorched = interpolate(['#3b3b3b', '#6e6e6e'])
const bare = interpolate(['#7a7a7a', '#a8a8a8'])
const tundra = interpolate(['#adad9c', '#d1cfba'])
const snow = interpolate(['#ceced6', '#e6e6f0'])
const temperate_desert = interpolate(['#bcc491', '#d4dea2'])
const shrubland = interpolate(['#7d8c6d', '#9aad86'])
const taiga = interpolate(['#8a996b', '#a1b37d'])
const grassland = interpolate(['#81a150', '#99bf5e'])
const temperate_deciduous_forest = interpolate(['#5e8751', '#73a663'])
const temperate_rain_forest = interpolate(['#3b784b', '#47915b'])
const subtropical_desert = interpolate(['#827356', '#a6926c'])
const tropical_seasonal_forest = interpolate(['#4d873d', '#5a9e47'])
const tropical_rain_forest = interpolate(['#2c694a', '#348059'])

const beach = '#01C7DD'

const normalize = (value, min, max) => (value - min) / (max - min)

module.exports.getColor = getColor = (e, m) => {
  let value = normalize(e, 0, 0.1)
  if (e < 0.1) return ocean(value)
  if (e < 0.12) return beach

  if (e < 0.3) {
    value = normalize(e, 0.12, 0.3)

    if (m < 0.16) return subtropical_desert(value)
    if (m < 0.33) return grassland(value)
    if (m < 0.83) return tropical_seasonal_forest(value)
    return tropical_rain_forest(value)
  }

  if (e < 0.6) {
    value = normalize(e, 0.3, 0.6)

    if (m < 0.16) return temperate_desert(value)
    if (m < 0.5) return grassland(value)
    if (m < 0.83) return temperate_deciduous_forest(value)
    return temperate_rain_forest(value)
  }

  if (e < 0.8) {
    value = normalize(e, 0.6, 0.8)

    if (m < 0.33) return temperate_desert(value)
    if (m < 0.66) return shrubland(value)
    return taiga(value)
  }

  value = normalize(e, 0.8, 1)
  if (m < 0.1) return scorched(value)
  if (m < 0.2) return bare(value)
  if (m < 0.5) return tundra(value)
  return snow(value)
}
