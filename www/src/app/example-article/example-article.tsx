import '../article.css'

export default function ExampleArticle() {
  return <article>
    <header className="article-header">
      <h1>Diet, Enhancers, and the Kabuki Brain</h1>
      <p className="dek">Why metabolism keeps showing up in learning and memory.</p>
    </header>

    <section className="article-body">

      <p>lorem imspum</p>
      <p className="claim">KMT2D regulates enhancer priming in neurons.</p>

      <aside className="margin-note">
        Enhancers are regulatory DNA regions that amplify gene expression.
      </aside>

      <figure className="breakout">
        <img src="figure1.png"/>
        <figcaption>CREB-dependent transcription in hippocampal neurons.</figcaption>
      </figure>

      <aside className="pull-quote">
        “Kabuki is less about broken genes and more about broken regulation.”
      </aside>
    </section>
  </article>
}
