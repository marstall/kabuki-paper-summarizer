import {spawn} from "node:child_process";
import {prisma} from '@/app/lib/prisma'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

const argv = await yargs(hideBin(process.argv))
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: false,
  })
  .option('do-nothing', {
    alias: 'x',
    type: 'boolean',
    demandOption: false,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
const doNothing = argv['do-nothing']
if (!doNothing && !articleId) {
  console.log("--articleId is required.")
  process.exit(1)
}
const llms = await prisma.llms.findMany({where: {active: true}})
const procs = llms.map(({id}) => {
  const regularParams = [
    "--translateAttachmentCaptions",
    "--generate-metadata",
    "--num-drafts","1",
    "--log-levels","minimal",
    "--article-id", String(articleId),
    "--llm-id",  String(id)
  ]
  const doNothingParams = ["--do-nothing"]
  const params = doNothing ? doNothingParams : regularParams;

  return spawn("pnpm", ["tsx", "scripts/translate_article_script.ts", ...params], {
    stdio: "inherit",
  })
});

const results = await Promise.all(
  procs.map(
    (p) =>
      new Promise((resolve) => p.on("exit", (code) => resolve({ code })))
  )
);
await prisma.$disconnect()

