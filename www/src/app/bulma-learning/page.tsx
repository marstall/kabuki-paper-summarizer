export default function Form() {
  return <section className="section">
    <div className="container">
      <h1 className="title">
        Bulma
      </h1>
      <h2 className="subtitle">
        Examples of Elements
      </h2>
      <div className="block">
        <div className="columns">
          <div className="column">1</div>
          <div className="column">2</div>
          <div className="column">3</div>
          <div className="column">4</div>
          <div className="column">5</div>
          <div className="column">6</div>
        </div>
      </div>
      <div className="box">
        <button className="button is-primary">Button</button>
        <button className="button is-link">Button</button>
        <button className="button is-info">Button</button>
        <button className="button is-success">Button</button>
        <button className="button is-warning">Button</button>
        <button className="button is-danger">Button</button>
      </div>
      <div className="block">
        <button className="button is-small">Button</button>
        <button className="button">Button</button>
        <button className="button is-medium">Button</button>
        <button className="button is-large">Button</button>
      </div>
      <div className="block">
        <button className="button is-primary is-outlined">Button</button>
        <button className="button is-loading">Button</button>
        <button className="button" disabled>Button</button>
      </div>
      <div className="block">
        <button className="button is-primary is-small" disabled>Button</button>
        <button className="button is-info is-loading">Button</button>
        <button className="button is-danger is-outlined is-large">Button</button>
      </div>
    </div>
    <div className="block">
      <p className="buttons">
        <button className="button">
    <span className="icon is-small">
      <i className="fas fa-bold"></i>
    </span>
        </button>
        <button className="button">
    <span className="icon is-small">
      <i className="fas fa-italic"></i>
    </span>
        </button>
        <button className="button">
    <span className="icon is-small">
      <i className="fas fa-underline"></i>
    </span>
        </button>
      </p>
      <p className="buttons">
        <button className="button">
    <span className="icon">
      <i className="fab fa-github"></i>
    </span>
          <span>GitHub</span>
        </button>
        <button className="button is-primary">
    <span className="icon">
      <i className="fab fa-twitter"></i>
    </span>
          <span>@jgthms</span>
        </button>
        <button className="button is-success">
    <span className="icon is-small">
      <i className="fas fa-check"></i>
    </span>
          <span>Save</span>
        </button>
        <button className="button is-danger is-outlined">
          <span>Delete</span>
          <span className="icon is-small">
      <i className="fas fa-times"></i>
    </span>
        </button>
      </p>
      <p className="buttons">
        <button className="button is-small">
    <span className="icon is-small">
      <i className="fab fa-github"></i>
    </span>
          <span>GitHub</span>
        </button>
        <button className="button">
    <span className="icon">
      <i className="fab fa-github"></i>
    </span>
          <span>GitHub</span>
        </button>
        <button className="button is-medium">
    <span className="icon">
      <i className="fab fa-github"></i>
    </span>
          <span>GitHub</span>
        </button>
        <button className="button is-large">
    <span className="icon is-medium">
      <i className="fab fa-github"></i>
    </span>
          <span>GitHub</span>
        </button>
      </p>
    </div>
    <div className="block">
      <button className="delete is-small"></button>
      <button className="delete"></button>
      <button className="delete is-medium"></button>
      <button className="delete is-large"></button>
    </div>
    <div className="block">
  <span className="tag is-success">
    Hello World
    <button className="delete is-small"></button>
  </span>
    </div>

    <div className="notification is-danger">
      <button className="delete"></button>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit
      amet, consectetur adipiscing elit
    </div>

    <article className="message is-info">
      <div className="message-header">
        Info
        <button className="delete"></button>
      </div>
      <div className="message-body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus
        mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit
        amet fringilla. Nullam gravida purus diam, et dictum felis venenatis
        efficitur. Aenean ac eleifend lacus, in mollis lectus. Donec sodales, arcu
        et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna
        a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
      </div>
    </article>
    <div className="block">
      <span className="icon is-large">
  <span className="fa-stack fa-lg">
    <i className="fas fa-camera fa-stack-1x"></i>
    <i className="fas fa-ban fa-stack-2x has-text-danger"></i>
  </span>
</span>
    </div>
  </section>

}
