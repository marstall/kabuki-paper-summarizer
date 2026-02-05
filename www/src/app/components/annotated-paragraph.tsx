export default function AnnotatedParagraph({text, claims}) {
  console.log({text})
  return <div style={{padding:"1em",backgroundColor:  '#eee',marginBottom:10}}>
    <p>
      {text}
    </p>
    {claims.map((claim) => <pre style={{padding:"1em",backgroundColor:  'lightblue',marginBottom:20}}>
        {claim && JSON.stringify(claim, null, 2)}
\      </pre>
    )}
  </div>
}
