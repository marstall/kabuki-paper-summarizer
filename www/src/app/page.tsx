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
export const dynamic = 'force-dynamic'

export default async function Page() {
  const rows = await prisma.$queryRaw
    `select
    current_database() as db,
    inet_server_addr()::text as server_addr,
    inet_server_port() as server_port
  ;`;

  console.log("db connect info:");
  console.log("db: "+rows[0].db)
  console.log("server_addr: "+rows[0].server_addr)
  console.log("server_port: "+rows[0].server_port)
  const url = process.env.DATABASE_URL!;
  console.log("db host:", new URL(url).host);
  return <Homepage />
}
