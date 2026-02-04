export default function AnnotatedParagraph({text, claims}) {
  console.log({text})
  return <div style={{padding:"1em",backgroundColor:  '#eee',marginBottom:10}}>
    <p>
      {text}
    </p>
{/*    {claims.map((claim) => <div style={{padding:"1em",backgroundColor:  'lightblue',marginBottom:20}}>{claim.reference_id}<br/>*/}
{/*      {claim.claim}*/}
{/*      <pre>*/}
{/*        {JSON.stringify(claim, null, 2)}*/}
{/*</pre>*/}
{/*      </div>*/}
{/*    )}*/}
  </div>
}
