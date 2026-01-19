// import postgres from 'postgres';
// import Link from "next/link";
// import { prisma } from '../lib/prisma'
//
// const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});
//
// export default async function Articles() {
//   const sections = await prisma.sections.findMany()
//
//   return <div>
//     <h1 className="title">Sections</h1>
//     <div>
//       {sections.length === 0 && <div>no sections</div>}
//       {sections.map((section) => {
//         const href = `/sections/${section.id}`
//         return <div style={{marginBottom:8}} key={section.id}>
//           <Link className="button" href={href}>
//             {section.original_title}
//           </Link>
//         </div>
//       })}</div>
//     <br/>
//     <Link className="button is-primary" href="/articles/new">
//       New Article
//     </Link>
//   </div>
// }
