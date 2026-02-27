// import Homepage from "@/app/homepage/homepage";
//
// export const dynamic = 'force-dynamic'
//
// export default function Home() {
//   return <Homepage/>
// }
//
import Homepage from "@/app/homepage/homepage";
import {prisma} from '@/app/lib/prisma'
import Diagnostics from "@/app/components/diagnostics/diagnostics";
export const dynamic = 'force-dynamic'

export default async function Page() {
  const rows = await prisma.$queryRaw
    `select
    current_database() as db,
    inet_server_addr()::text as server_addr,
    inet_server_port() as server_port
  ;`;
  const url = process.env.DATABASE_URL!;
  const host = new URL(url).host
  const keyVals = {
    db: rows[0].db,
    server_addr: rows[0].server_addr,
    inet_server_port: rows[0].inet_server_port,
    host
  }
  return <><Diagnostics keyVals={keyVals}/><Homepage /></>
}
