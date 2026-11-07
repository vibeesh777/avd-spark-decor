export default function SectionHead({ eyebrow, title, accent, sub, as: Tag = 'h2' }) {
  return (
    <div className="section-head reveal">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="section-title">{title} {accent && <span className="gold-text">{accent}</span>}</Tag>
      <div className="divider" />
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}
