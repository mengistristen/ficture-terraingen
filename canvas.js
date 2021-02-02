const { createCanvas } = require('canvas')
const SimplexNoise = require('simplex-noise')
const fs = require('fs')
const interpolate = require('color-interpolate')
const { getColor } = require('./colors')

const black = interpolate(['#fff', '#000'])

module.exports.Canvas = (height, width) => {
  const _height = height
  const _width = width
  const _canvas = createCanvas(_width * 2, _height)
  const _context = _canvas.getContext('2d')
  const _heightmap = new ArrayBuffer(4 * height * width)
  const _moisture = new ArrayBuffer(4 * height * width)

  function Generate(octaves, persistance, lacunarity) {
    const heightmapView = new Float32Array(_heightmap)
    const moistureView = new Float32Array(_moisture)

    _generateNoisemap(heightmapView, octaves, persistance, lacunarity)
    _generateNoisemap(moistureView, 10, 3, 7)

    _context.fillStyle = '#fff'
    _context.fillRect(0, 0, _width, _height)

    for (let y = 0; y < _height; y++) {
      for (let x = 0; x < _width; x++) {
        const elevation = heightmapView[_height * y + x]
        _context.fillStyle = getColor(elevation, moistureView[_height * y + x])
        _context.fillRect(x + _width, y, 1, 1)

        if (elevation < 0.15 && elevation > 0.09) {
          _context.fillStyle = '#000'
          _context.fillRect(x, y, 1, 1)
        }
      }
    }
  }

  function Save(directory, name) {
    if (!fs.existsSync('dataset')) fs.mkdirSync('dataset')
    if (!fs.existsSync(`./dataset/${directory}`))
      fs.mkdirSync(`./dataset/${directory}`)

    const buffer = _canvas.toBuffer('image/jpeg')
    fs.writeFileSync(`./dataset/${directory}/${name}.jpeg`, buffer)
  }

  function SaveMoisture() {
    const canvas = createCanvas(_width, _height)
    const context = canvas.getContext('2d')
    const moistureView = new Float32Array(_moisture)

    for (let y = 0; y < _height; y++) {
      for (let x = 0; x < _width; x++) {
        context.fillStyle = black(moistureView[_height * y + x])
        context.fillRect(x, y, 1, 1)
      }
    }

    const buffer = canvas.toBuffer('image/jpeg')
    fs.writeFileSync('./moisture.jpeg', buffer)
  }

  function _generateNoisemap(view, octaves, persistance, lacunarity) {
    const seed = Math.random()
    const noise = new SimplexNoise(seed.toString())

    for (let y = 0; y < _height; y++) {
      for (let x = 0; x < _width; x++) {
        const scaleX = x / _width
        const scaleY = y / _height
        let amplitude = 1
        let noiseHeight = 0
        let frequency

        for (let i = 0; i < octaves; ++i) {
          frequency = Math.pow(lacunarity, i)
          noiseHeight +=
            amplitude * noise.noise2D(frequency * scaleX, frequency * scaleY)

          amplitude /= persistance
        }

        view[_height * y + x] = Math.pow(noiseHeight, 2)
      }
    }

    // normalize the noise map
    const max = view.reduce((a, b) => Math.max(a, b))
    const min = view.reduce((a, b) => Math.min(a, b))

    view.forEach((item, i) => (view[i] = (item - min) / (max - min)))
  }

  return { Generate, Save, SaveMoisture }
}
