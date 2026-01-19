export default function Errors({errors}) {
  console.log({errors})
  if (!errors?.errors || errors.length == 0) return;
  return <article className="message is-danger">

    <div className="message-header">
      <p>Errors</p>
    </div>
    <div className="message-body">
      <ul>
    {errors?.errors?.map((error, i) =>
      <li key={i}>{error}</li>
    )}
      </ul>
    </div>
  </article>
}
