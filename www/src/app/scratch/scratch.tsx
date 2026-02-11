import _ from 'underscore'

export default function Scratch() {
  const a = {
    pull_quote: ["foo",2]
  }
  _.get(a.pull_quote,1)
}

Scratch()
