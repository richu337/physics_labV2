import { useState } from 'react'
import { topics, Topic } from '../data/classData'

export default function Classes() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  if (selectedTopic) {
    return (
      <TopicDetail
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    )
  }

  return (
    <div className="classes-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Classes</h1>
        <p className="page-desc">Wave Optics — Diffraction & Interference</p>
      </div>

      <div className="topics-grid">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="topic-card glass-card"
            onClick={() => setSelectedTopic(topic)}
          >
            <div className="topic-card-icon">{topic.icon}</div>
            <h3 className="topic-card-title">{topic.title}</h3>
            <p className="topic-card-desc">{topic.description}</p>
            <div className="badge badge-cyan" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              Wave Optics
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .classes-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        .page-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .page-title {
          font-size: 32px;
          margin-bottom: 8px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .page-desc {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .topic-card {
          display: flex;
          flex-direction: column;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          min-height: 200px;
        }
        .topic-card-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }
        .topic-card-title {
          font-size: 17px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .topic-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .topics-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .topics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function TopicDetail({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  return (
    <div className="topic-detail animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← Back to Classes
      </button>

      <div className="detail-header">
        <span className="detail-icon">{topic.icon}</span>
        <div>
          <h1 className="detail-title">{topic.title}</h1>
          <div className="badge badge-cyan">Wave Optics</div>
        </div>
      </div>

      <div className="detail-content glass-card-static">
        <div className="content-text">
          {topic.content.split('\n').filter(Boolean).map((line, i) => {
            const trimmed = line.trim()
            if (trimmed.startsWith('- ')) {
              return <li key={i} className="content-li">{trimmed.slice(2)}</li>
            }
            if (trimmed.match(/^\d\./)) {
              return <li key={i} className="content-li">{trimmed.replace(/^\d\.\s*/, '')}</li>
            }
            if (trimmed.endsWith(':') && trimmed.length < 40) {
              return <h3 key={i} className="content-subhead">{trimmed}</h3>
            }
            return <p key={i} className="content-p">{trimmed}</p>
          })}
        </div>
      </div>

      {topic.formulas.length > 0 && (
        <div className="formulas-section">
          <h2 className="formulas-title">Key Formulas</h2>
          <div className="formulas-grid">
            {topic.formulas.map((f, i) => (
              <div key={i} className="formula-card glass-card-static">
                <span className="formula-name">{f.name}</span>
                <span className="formula-expr">{f.formula}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .topic-detail {
          max-width: 800px;
          margin: 0 auto;
        }
        .back-btn {
          background: transparent;
          color: var(--accent-cyan);
          font-size: 14px;
          font-weight: 500;
          padding: 8px 0;
          margin-bottom: 20px;
          display: inline-block;
        }
        .back-btn:hover {
          color: var(--accent-electric);
        }
        .detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .detail-icon {
          font-size: 48px;
        }
        .detail-title {
          font-size: 28px;
          margin-bottom: 6px;
        }
        .detail-content {
          padding: 28px;
          margin-bottom: 28px;
        }
        .content-text {
          font-size: 15px;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .content-p {
          margin: 8px 0;
        }
        .content-li {
          margin: 4px 0 4px 20px;
          list-style: disc;
        }
        .content-subhead {
          font-size: 16px;
          color: var(--accent-cyan);
          margin: 20px 0 8px;
        }
        .formulas-section {
          margin-bottom: 28px;
        }
        .formulas-title {
          font-size: 20px;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        .formulas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .formula-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .formula-name {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--accent-cyan);
          font-weight: 600;
        }
        .formula-expr {
          font-family: var(--font-mono);
          font-size: 16px;
          color: var(--accent-electric);
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
