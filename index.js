#!/usr/bin/env node
const { program } = require('commander')
const { Canvas } = require('./canvas')

let canvas = Canvas(512, 512, 0.5)

for (let i = 0; i < 1; ++i) {
  canvas.Generate(6, 2, 3)
  canvas.Save('train', (i + 1).toString())
}
canvas.SaveMoisture()
