export default function AnnotatedParagraph({id,text, claims}) {
  return <div key={"para-"+id} style={{padding:"1em",backgroundColor:  '#eee',marginBottom:10}}>
    <p>
      {text}
    </p>
    {claims.map((claim,i) => <pre key={"claim-"+i} style={{padding:"1em",backgroundColor:  'lightblue',marginBottom:20}}>
        {claim && JSON.stringify(claim, null, 2)}
      </pre>
    )}
  </div>
}
