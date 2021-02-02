#!/usr/bin/env node
const { program } = require('commander')
const { Canvas } = require('./canvas')

program
  .option('-j, --height <height>', 'height of map')
  .option('-w, --width <width>', 'width of map')
  .option('-n, --num-train <train>', 'number of training samples')
  .option('-t, --num-test <test>', 'number of test samples')
  .option('-d, --dir-train <dirtrain>', 'directory for training samples')
  .option('-e, --dir-test <dirtest>', 'directory for test samples')

program.parse(process.argv)

const { height, width, numTrain, numTest, dirTrain, dirTest } = program.opts()

let canvas = Canvas(
  Number.parseInt(height) || 512,
  Number.parseInt(width) || 512
)

for (let i = 0; i < (Number.parseInt(numTrain) || 10); ++i) {
  canvas.Generate(6, 2, 3)
  canvas.Save(dirTrain || 'train', (i + 1).toString())
}

for (let i = 0; i < (Number.parseInt(numTest) || 1); ++i) {
  canvas.Generate(6, 2, 3)
  canvas.Save(dirTest || 'val', (i + 1).toString())
}
