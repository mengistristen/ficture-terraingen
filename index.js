#!/usr/bin/env node
const { program } = require('commander')
const { Canvas } = require('./canvas')
const chalk = require('chalk')
const cliProgress = require('cli-progress')

program
  .option('-j, --height <height>', 'height of map')
  .option('-w, --width <width>', 'width of map')
  .option('-n, --num-train <train>', 'number of training samples')
  .option('-t, --num-test <test>', 'number of test samples')
  .option('-d, --dir-train <dirtrain>', 'directory for training samples')
  .option('-e, --dir-test <dirtest>', 'directory for test samples')

program.parse(process.argv)

const opts = program.opts()

// get properly formatted options
const options = {
  height: Number.parseInt(opts.height) || 512,
  width: Number.parseInt(opts.width) || 512,
  numTrain: Number.parseInt(opts.numTrain) || 10,
  numTest: Number.parseInt(opts.numTest) || 1,
  dirTrain: opts.dirTrain || 'train',
  dirTest: opts.dirTest || 'val',
}

let canvas = Canvas(options.height, options.width)

// generate training images
console.log(
  `Generating ${chalk.cyan(options.numTrain)} training images to ${chalk.cyan(
    `./dataset/${options.dirTrain}`
  )}`
)

// training progress bar
let bar = new cliProgress.SingleBar({
  format: `${chalk.greenBright('{bar}')} | {value}/{total} Training Images`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})
bar.start(options.numTrain, 0)

for (let i = 0; i < options.numTrain; ++i) {
  canvas.Generate(6, 2, 3)
  canvas.Save(options.dirTrain, (i + 1).toString())
  bar.increment()
}

bar.stop()

// generate test images
console.log(
  `Generating ${chalk.cyan(options.numTest)} testing images to ${chalk.cyan(
    `./dataset/${options.dirTest}`
  )}`
)

// test progress bar
bar = new cliProgress.SingleBar({
  format: `${chalk.greenBright('{bar}')} | {value}/{total} Test Images`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})
bar.start(options.numTest, 0)

for (let i = 0; i < options.numTest; ++i) {
  canvas.Generate(6, 2, 3)
  canvas.Save(options.dirTest, (i + 1).toString())
  bar.increment()
}

bar.stop()
