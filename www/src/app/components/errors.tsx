export default function Errors({ errors }: { errors?: any }) {
  const list = errors?.errors;
  if (!list || list.length == 0) return null;
  return <article className="message is-danger">
    <div className="message-header">
      <p>Errors</p>
    </div>
    <div className="message-body">
      <ul>
    {list.map((error, i) =>
      <li key={i}>{error}</li>
    )}
      </ul>
    </div>
  </article>
}
