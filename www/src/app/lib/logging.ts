import chalk from 'chalk'
import {base} from "next/dist/build/webpack/config/blocks/base";

function pad(s,basedOnString=null) {
  if (basedOnString) {
    return " "+s.padEnd(basedOnString.length+1)
  }
  else return " "+s+" "
}

export function header(s,label=null) {
  console.log("")
  const bgColor = "#fcf"
  console.log(chalk.bgHex(bgColor).black.bold(pad("",s)));
  label && console.log(chalk.bgHex(bgColor).magenta.dim(pad(label.toUpperCase(),s)))
  console.log(chalk.bgHex(bgColor).black.bold(pad(s)));
  console.log(chalk.bgHex(bgColor).black.bold(pad("",s)));
}

export function subheader(s,label=null) {
  console.log("")
  const bgColor = "#ffc"
  label && console.log(chalk.bgHex(bgColor).black.dim(pad(label.toUpperCase(),s)))
  console.log(chalk.bgHex(bgColor).black.bold(pad(s)));
}

export function subheader2(s,label=null) {
  console.log("")
  label && console.log(chalk.black.dim(""+label));
  console.log(chalk.black.bold(s));
}
