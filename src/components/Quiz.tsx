import { useState, useMemo, useCallback } from 'react'
import { quizData, QuizQuestion } from '../data/quizData'

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'
type TopicFilter = 'all' | 'ray-optics' | 'wave-optics'

interface QuizState {
  current: number
  score: number
  answers: (number | null)[]
  finished: boolean
  showResults: boolean
}

const QUESTIONS_PER_QUIZ = 10

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('all')
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([])

  const filteredQuestions = useMemo(() => {
    return topicFilter === 'all'
      ? quizData
      : quizData.filter((q) => q.topic === topicFilter)
  }, [topicFilter])

  const startQuiz = useCallback(() => {
    const shuffled = shuffleArray(filteredQuestions).slice(0, QUESTIONS_PER_QUIZ)
    setSelectedQuestions(shuffled)
    setQuizState({
      current: 0,
      score: 0,
      answers: new Array(shuffled.length).fill(null),
      finished: false,
      showResults: false,
    })
  }, [filteredQuestions])

  const handleAnswer = useCallback(
    (index: number) => {
      if (!quizState || quizState.finished) return

      const newAnswers = [...quizState.answers]
      newAnswers[quizState.current] = index

      const isCorrect =
        index === selectedQuestions[quizState.current].correctIndex

      const newScore = isCorrect ? quizState.score + 1 : quizState.score

      if (quizState.current < selectedQuestions.length - 1) {
        setQuizState({
          ...quizState,
          answers: newAnswers,
          score: newScore,
          current: quizState.current + 1,
        })
      } else {
        setQuizState({
          ...quizState,
          answers: newAnswers,
          score: newScore,
          finished: true,
          showResults: true,
        })
      }
    },
    [quizState, selectedQuestions]
  )

  const goToQuestion = useCallback(
    (index: number) => {
      if (!quizState) return
      setQuizState({ ...quizState, current: index })
    },
    [quizState]
  )

  const resetQuiz = useCallback(() => {
    setQuizState(null)
  }, [])

  const getGradeInfo = (score: number, total: number) => {
    const pct = (score / total) * 100
    if (pct >= 90) return { grade: 'A+', color: 'var(--accent-green)', msg: 'Excellent! Master level.' }
    if (pct >= 80) return { grade: 'A', color: 'var(--accent-green)', msg: 'Great job! Strong understanding.' }
    if (pct >= 70) return { grade: 'B', color: 'var(--accent-cyan)', msg: 'Good work! Keep practicing.' }
    if (pct >= 60) return { grade: 'C', color: 'var(--accent-yellow)', msg: 'Not bad. Review the topics.' }
    return { grade: 'D', color: 'var(--accent-red)', msg: 'Need more practice. Study the material.' }
  }

  if (!quizState) {
    return (
      <div className="quiz-page animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Quizzes</h1>
          <p className="page-desc">Test your knowledge of Ray Optics and Wave Optics</p>
        </div>

        <div className="quiz-setup">
          <div className="setup-card glass-card-static">
            <div className="setup-icon">🎯</div>
            <h2>Choose Your Quiz</h2>
            <p>Select a topic and start the challenge</p>

            <div className="setup-controls">
              <label className="setup-label">Topic</label>
              <div className="topic-tabs">
                {(['all', 'ray-optics', 'wave-optics'] as const).map((t) => (
                  <button
                    key={t}
                    className={`topic-btn${topicFilter === t ? ' active' : ''}`}
                    onClick={() => setTopicFilter(t)}
                  >
                    {t === 'all' ? 'All Topics' : t === 'ray-optics' ? 'Ray Optics' : 'Wave Optics'}
                  </button>
                ))}
              </div>
              <div className="setup-info">
                <span>{filteredQuestions.length} questions available</span>
                <span>•</span>
                <span>{QUESTIONS_PER_QUIZ} per quiz</span>
              </div>
            </div>

            <button className="btn-primary start-btn" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        </div>

        <style>{`
          .quiz-page {
            max-width: 800px;
            margin: 0 auto;
          }
          .page-header {
            text-align: center;
            margin-bottom: 32px;
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
          .quiz-setup {
            display: flex;
            justify-content: center;
          }
          .setup-card {
            width: 100%;
            max-width: 480px;
            padding: 40px;
            text-align: center;
          }
          .setup-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .setup-card h2 {
            font-size: 22px;
            margin-bottom: 8px;
          }
          .setup-card p {
            color: var(--text-secondary);
            font-size: 14px;
            margin-bottom: 24px;
          }
          .setup-controls {
            margin-bottom: 24px;
          }
          .setup-label {
            display: block;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
          }
          .topic-tabs {
            display: flex;
            gap: 4px;
            background: var(--bg-tertiary);
            border-radius: var(--radius-sm);
            padding: 3px;
          }
          .topic-btn {
            flex: 1;
            padding: 8px 12px;
            border-radius: 6px;
            background: transparent;
            color: var(--text-muted);
            font-size: 13px;
            font-weight: 500;
            transition: var(--transition);
          }
          .topic-btn:hover {
            color: var(--text-secondary);
          }
          .topic-btn.active {
            background: var(--accent-blue);
            color: white;
          }
          .setup-info {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 12px;
            font-size: 13px;
            color: var(--text-muted);
          }
          .start-btn {
            width: 100%;
            padding: 14px;
            font-size: 16px;
          }
        `}</style>
      </div>
    )
  }

  if (quizState.showResults) {
    const info = getGradeInfo(quizState.score, selectedQuestions.length)
    return (
      <div className="quiz-page animate-fade-in">
        <div className="results-container">
          <div className="results-card glass-card-static">
            <div className="results-icon">
              {quizState.score >= 7 ? '🎉' : '💪'}
            </div>
            <h2 className="results-title">Quiz Complete!</h2>
            <div className="score-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={info.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(quizState.score / selectedQuestions.length) * 339.292} 339.292`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
                <text x="60" y="56" textAnchor="middle" fill="var(--text-primary)" fontSize="28" fontWeight="700">
                  {quizState.score}
                </text>
                <text x="60" y="74" textAnchor="middle" fill="var(--text-muted)" fontSize="12">
                  / {selectedQuestions.length}
                </text>
              </svg>
            </div>
            <div className="results-grade" style={{ color: info.color }}>{info.grade}</div>
            <p className="results-msg">{info.msg}</p>

            <div className="results-breakdown">
              <h3>Question Review</h3>
              <div className="review-list scroll-container">
                {selectedQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`review-item${quizState.answers[i] === q.correctIndex ? ' correct' : ' wrong'}`}
                    onClick={() => goToQuestion(i)}
                  >
                    <span className="review-num">Q{i + 1}</span>
                    <span className="review-status">
                      {quizState.answers[i] === q.correctIndex ? '✓' : '✗'}
                    </span>
                    <span className="review-topic badge badge-cyan">{q.topic === 'ray-optics' ? 'Ray' : 'Wave'}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary start-btn" onClick={resetQuiz}>
              Try Again
            </button>
          </div>
        </div>

        <style>{`
          .results-container {
            display: flex;
            justify-content: center;
          }
          .results-card {
            width: 100%;
            max-width: 480px;
            padding: 40px;
            text-align: center;
          }
          .results-icon {
            font-size: 48px;
            margin-bottom: 8px;
          }
          .results-title {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .score-ring {
            margin-bottom: 16px;
          }
          .results-grade {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: -0.03em;
          }
          .results-msg {
            color: var(--text-secondary);
            margin: 8px 0 24px;
            font-size: 15px;
          }
          .results-breakdown {
            text-align: left;
            margin-bottom: 24px;
          }
          .results-breakdown h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-secondary);
          }
          .review-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-height: 160px;
            overflow-y: auto;
          }
          .review-item {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            background: var(--bg-tertiary);
            cursor: pointer;
            font-size: 12px;
            transition: var(--transition);
          }
          .review-item:hover {
            background: var(--bg-card-hover);
          }
          .review-item.correct .review-status {
            color: var(--accent-green);
          }
          .review-item.wrong .review-status {
            color: var(--accent-red);
          }
          .review-num {
            color: var(--text-muted);
          }
          .review-status {
            font-weight: 700;
            font-size: 14px;
          }
          .review-topic {
            font-size: 10px;
          }
        `}</style>
      </div>
    )
  }

  const question = selectedQuestions[quizState.current]
  const progress = ((quizState.current) / selectedQuestions.length) * 100

  return (
    <div className="quiz-page animate-fade-in">
      <div className="quiz-active">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="quiz-progress-text">
            {quizState.current + 1} / {selectedQuestions.length}
          </div>
        </div>

        <div className="question-card glass-card-static">
          <div className="question-topic">
            <span className={`badge ${question.topic === 'ray-optics' ? 'badge-blue' : 'badge-cyan'}`}>
              {question.topic === 'ray-optics' ? 'Ray Optics' : 'Wave Optics'}
            </span>
          </div>
          <h2 className="question-text">{question.question}</h2>

          <div className="options-list">
            {question.options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>

          {quizState.answers[quizState.current] !== null && (
            <div className="question-explanation animate-fade-in">
              <div className={`explanation-badge${question.correctIndex === quizState.answers[quizState.current] ? ' correct' : ' wrong'}`}>
                {question.correctIndex === quizState.answers[quizState.current] ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-nav">
          <button className="btn-secondary" onClick={resetQuiz}>
            Quit
          </button>
          <div className="quiz-dots">
            {selectedQuestions.map((_, i) => (
              <button
                key={i}
                className={`quiz-dot${i === quizState.current ? ' current' : ''}${quizState.answers[i] !== null ? ' answered' : ''}`}
                onClick={() => goToQuestion(i)}
              />
            ))}
          </div>
          <div />
        </div>
      </div>

      <style>{`
        .quiz-active {
          max-width: 700px;
          margin: 0 auto;
        }
        .quiz-progress-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .quiz-progress-track {
          flex: 1;
          height: 4px;
          background: var(--bg-elevated);
          border-radius: 2px;
          overflow: hidden;
        }
        .quiz-progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .quiz-progress-text {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          min-width: 48px;
          text-align: right;
        }
        .question-card {
          padding: 32px;
          margin-bottom: 24px;
        }
        .question-topic {
          margin-bottom: 12px;
        }
        .question-text {
          font-size: 20px;
          line-height: 1.4;
          margin-bottom: 24px;
          color: var(--text-primary);
        }
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 15px;
          text-align: left;
          transition: var(--transition);
        }
        .option-btn:hover {
          border-color: var(--accent-blue);
          background: var(--bg-card-hover);
          transform: translateX(4px);
        }
        .option-letter {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--bg-elevated);
          font-weight: 700;
          font-size: 13px;
          color: var(--accent-cyan);
          flex-shrink: 0;
        }
        .option-btn:hover .option-letter {
          background: rgba(59, 130, 246, 0.2);
        }
        .question-explanation {
          margin-top: 20px;
          padding: 16px;
          border-radius: var(--radius-sm);
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        .explanation-badge {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .explanation-badge.correct {
          color: var(--accent-green);
        }
        .explanation-badge.wrong {
          color: var(--accent-red);
        }
        .question-explanation p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }
        .quiz-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .quiz-dots {
          display: flex;
          gap: 6px;
        }
        .quiz-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: none;
          cursor: pointer;
          transition: var(--transition);
          padding: 0;
        }
        .quiz-dot:hover {
          transform: scale(1.3);
        }
        .quiz-dot.current {
          background: var(--accent-blue);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
        }
        .quiz-dot.answered {
          background: var(--accent-cyan);
        }
        @media (max-width: 768px) {
          .question-card {
            padding: 20px;
          }
          .question-text {
            font-size: 17px;
          }
          .option-btn {
            font-size: 14px;
            padding: 12px 14px;
          }
        }
      `}</style>
    </div>
  )
}
