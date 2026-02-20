import styles from '/article.module.css'

function Section({section}) {
  return section.paragraphs.map(paragraph =>
    <div key={paragraph.id}>
      <h4>
        {paragraph.title}
      </h4>
      <p style={{marginBottom: 12}}>
        {paragraph.body}
      </p>
    </div>
  )
}

export default function Article({article}) {
  return article.sections.map((section) => {
    return <>
      <h3>{section.title}</h3>
      <Section section={section}/>
    </>
  })
}
