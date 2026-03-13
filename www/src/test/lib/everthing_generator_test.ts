import {generateElement} from "@/app/generation/everything_generator";
import {bold,log} from '@/app/lib/logger'

bold("headlines")
const response = await generateElement(
  "headlines",
    "claude",
  {translationId:255}
)
