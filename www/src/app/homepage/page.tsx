import Homepage from "./homepage"
import {prisma} from '@/app/lib/prisma'
import type {Metadata} from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Page() {
  // const rows = await prisma.$queryRaw
  //   `select
  //   current_database() as db,
  //   inet_server_addr()::text as server_addr,
  //   inet_server_port() as server_port
  // ;`;
  //
  // console.log("connected to database on host " + rows[0]);
  return <Homepage />
}
