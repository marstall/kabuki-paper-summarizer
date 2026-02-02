import chalk from 'chalk'
import {base} from "next/dist/build/webpack/config/blocks/base";

export default class Log {
  static log_levels = ["info","error","always"]

  static init(settings = {}) {
    if (settings) {
      if (settings.log_levels) {
        Log.log_levels = settings.log_levels
      };
    }
  }
  static suppress(level) {
    return !Log.log_levels.includes(level)
  }
}


export function log(s) {
  console.log(s)
}

export function error(e) {
  console.log(chalk.red.bold("FATAL EXCEPTION"))
  console.log(e)
}

export function bold(s,level="info") {
  if (Log.suppress(level)) return;
  console.log(chalk.bold(s))
}

export function pad(s, basedOnString = null) {
  if (basedOnString) {
    return " " + s.padEnd(basedOnString.length + 1)
  } else return " " + s + " "
}

export function block(s,headline=null,level="info") {
  if (Log.suppress(level)) return;
  headline && bold(headline)
  console.log(s)
  console.log("")
}

export function header(s, label = null,level="info") {
  if (Log.suppress(level)) return;
  console.log("")
  const bgColor = "#cff"
  console.log(chalk.bgHex(bgColor).black.bold(pad("", s)));
  label && console.log(chalk.bgHex(bgColor).magenta.dim(pad(label.toUpperCase(), s)))
  console.log(chalk.bgHex(bgColor).black.bold(pad(s)));
  console.log(chalk.bgHex(bgColor).black.bold(pad("", s)));
}

export function subheader(s, label = null,level="info") {
  if (Log.suppress(level)) return;
  console.log("")
  const bgColor = "#ffc"
  label && console.log(chalk.bgHex(bgColor).black.dim(pad(label.toUpperCase(), s)))
  console.log(chalk.bgHex(bgColor).black.bold(pad(s)));
}

export function subheader2(s, label = null,level="info") {
  if (Log.suppress(level)) return;
  console.log("")
  label && console.log(chalk.black.dim("" + label));
  console.log(chalk.black.bold(s));
}

export function divider(level="info") {
  if (Log.suppress(level)) return;
  console.log(chalk.bgHex('ffc').black(" ".padEnd(78,'_'), " "))
  console.log(chalk.bgHex('ffc').black("".padEnd(80)))
}

