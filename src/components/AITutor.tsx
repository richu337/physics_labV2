import { useState, useRef, useEffect, useCallback } from 'react'
import { sendMessage, generateNotes, ChatMessage } from '../utils/openRouter'
import { speakText, stopSpeaking, isSpeaking, startListening, stopListening } from '../utils/speech'

interface SavedNote {
  id: string
  title: string
  content: string
  date: string
}

const SAVED_MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B' },
]

const SUGGESTIONS = [
  'Explain Young\'s double slit experiment',
  'What is the difference between interference and diffraction?',
  'Derive the lens maker\'s formula',
  'Explain total internal reflection with examples',
  'What is polarization and how is it used in 3D movies?',
  'Generate notes on diffraction grating',
]

export default function AITutor() {
  const [apiKey, setApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_OPENROUTER_API_KEY
    return localStorage.getItem('openrouter_key') || (envKey && envKey !== 'sk-or-v1-your-api-key-here' ? envKey : '')
  })
  const [model, setModel] = useState('openai/gpt-4o-mini')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [isSpeakingActive, setIsSpeakingActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showNotesGenerator, setShowNotesGenerator] = useState(false)
  const [notesTopic, setNotesTopic] = useState('')
  const [notesLoading, setNotesLoading] = useState(false)
  const [notesResult, setNotesResult] = useState('')
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_notes') || '[]')
    } catch { return [] }
  })
  const [showSavedNotes, setShowSavedNotes] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  useEffect(() => {
    localStorage.setItem('openrouter_key', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('saved_notes', JSON.stringify(savedNotes))
  }, [savedNotes])

  const handleSend = useCallback(async () => {
    if (!input.trim() || !apiKey || loading) return
    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingContent('')

    try {
      let fullContent = ''
      const assistantMessage: ChatMessage = { role: 'assistant', content: '' }

      await sendMessage(newMessages, apiKey, model, (chunk) => {
        fullContent += chunk
        setStreamingContent(fullContent)
      })

      assistantMessage.content = fullContent
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${err.message}. Please check your API key and try again.` },
        ])
      }
    } finally {
      setLoading(false)
      setStreamingContent('')
    }
  }, [input, apiKey, model, messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setLoading(false)
    setStreamingContent('')
  }

  const handleSpeak = (text: string) => {
    if (isSpeakingActive) {
      stopSpeaking()
      setIsSpeakingActive(false)
    } else {
      setIsSpeakingActive(true)
      speakText(text.replace(/\$.*?\$/g, '').replace(/\$\$.*?\$\$/gs, ''), () => {
        setIsSpeakingActive(false)
      })
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening(recognitionRef.current)
      setIsListening(false)
      return
    }

    setIsListening(true)
    const recognition = startListening(
      (text) => {
        setInput((prev) => prev + text)
        setIsListening(false)
      },
      (error) => {
        console.error('STT error:', error)
        setIsListening(false)
      }
    )
    recognitionRef.current = recognition
  }

  const handleGenerateNotes = async () => {
    if (!notesTopic.trim() || !apiKey) return
    setNotesLoading(true)
    setNotesResult('')
    try {
      const result = await generateNotes(notesTopic, apiKey)
      setNotesResult(result)
    } catch (err: any) {
      setNotesResult(`Error: ${err.message}`)
    } finally {
      setNotesLoading(false)
    }
  }

  const saveNote = () => {
    const note: SavedNote = {
      id: Date.now().toString(),
      title: notesTopic || `Note ${savedNotes.length + 1}`,
      content: notesResult,
      date: new Date().toLocaleDateString(),
    }
    setSavedNotes((prev) => [note, ...prev])
  }

  const deleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadNote = (note: SavedNote) => {
    const blob = new Blob([note.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title.replace(/\s+/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    setMessages([])
    setStreamingContent('')
  }

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/gs)
    return parts.map((part, i) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <div key={i} className="formula-block">{part.slice(2, -2).trim()}</div>
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="formula-inline">{part.slice(1, -1)}</span>
      }
      const lines = part.split('\n')
      return lines.map((line, j) => {
        if (line.startsWith('## ')) {
          return <h3 key={`${i}-${j}`} className="msg-heading">{line.slice(3)}</h3>
        }
        if (line.startsWith('### ')) {
          return <h4 key={`${i}-${j}`} className="msg-subheading">{line.slice(4)}</h4>
        }
        if (line.startsWith('- ')) {
          return <li key={`${i}-${j}`} className="msg-li">{line.slice(2)}</li>
        }
        if (line.match(/^\d+\.\s/)) {
          return <li key={`${i}-${j}`} className="msg-li">{line.replace(/^\d+\.\s/, '')}</li>
        }
        if (line.trim() === '') return null
        return <p key={`${i}-${j}`} className="msg-p">{line}</p>
      })
    })
  }

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant')

  return (
    <div className="tutor-page animate-fade-in">
      <div className="tutor-header">
        <div className="tutor-header-left">
          <h1 className="page-title">AI Tutor</h1>
          <p className="page-desc">Your personal optics tutor — ask anything</p>
        </div>
        <div className="tutor-header-actions">
          <button
            className={`btn-icon${showSavedNotes ? ' active' : ''}`}
            onClick={() => setShowSavedNotes(!showSavedNotes)}
            title="Saved Notes"
          >
            📓
          </button>
          <button
            className="btn-icon"
            onClick={() => setShowNotesGenerator(!showNotesGenerator)}
            title="Generate Notes"
          >
            📝
          </button>
          <button
            className={`btn-icon${showSettings ? ' active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="tutor-settings glass-card-static animate-fade-in">
          <div className="settings-field">
            <label>OpenRouter API Key</label>
            <input
              type="password"
              className="input-field"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
            />
          </div>
          <div className="settings-field">
            <label>Model</label>
            <select className="select-field" value={model} onChange={(e) => setModel(e.target.value)}>
              {SAVED_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showNotesGenerator && (
        <div className="notes-generator glass-card-static animate-fade-in">
          <h3>Generate Study Notes</h3>
          <div className="notes-input-row">
            <input
              className="input-field"
              value={notesTopic}
              onChange={(e) => setNotesTopic(e.target.value)}
              placeholder="e.g., Interference of light, Polarization..."
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateNotes()}
            />
            <button
              className="btn-primary"
              onClick={handleGenerateNotes}
              disabled={notesLoading || !apiKey}
            >
              {notesLoading ? <span className="spinner" /> : 'Generate'}
            </button>
          </div>
          {notesResult && (
            <div className="notes-result">
              <div className="notes-result-header">
                <span className="badge badge-green">Generated</span>
                <div className="notes-result-actions">
                  <button className="btn-outline" onClick={saveNote}>Save</button>
                  <button className="btn-outline" onClick={() => copyToClipboard(notesResult)}>Copy</button>
                </div>
              </div>
              <div className="notes-content">
                {notesResult.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h3 key={i} className="notes-h3">{line.slice(3)}</h3>
                  if (line.startsWith('### ')) return <h4 key={i} className="notes-h4">{line.slice(4)}</h4>
                  if (line.startsWith('- ')) return <li key={i} className="notes-li">{line.slice(2)}</li>
                  if (line.match(/^\d+\.\s/)) return <li key={i} className="notes-li">{line.replace(/^\d+\.\s/, '')}</li>
                  if (line.trim() === '') return null
                  return <p key={i} className="notes-p">{line}</p>
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {showSavedNotes && (
        <div className="saved-notes-panel glass-card-static animate-fade-in">
          <h3>Saved Notes ({savedNotes.length})</h3>
          {savedNotes.length === 0 ? (
            <p className="no-notes">No saved notes yet. Generate and save notes above.</p>
          ) : (
            <div className="saved-notes-list">
              {savedNotes.map((note) => (
                <div key={note.id} className="saved-note-item">
                  <div className="saved-note-info">
                    <strong>{note.title}</strong>
                    <span className="saved-note-date">{note.date}</span>
                  </div>
                  <div className="saved-note-actions">
                    <button className="btn-outline" onClick={() => copyToClipboard(note.content)}>Copy</button>
                    <button className="btn-outline" onClick={() => downloadNote(note)}>Download</button>
                    <button className="btn-outline" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={() => deleteNote(note.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chat-container glass-card-static">
        <div className="chat-header">
          <div className="chat-header-info">
            <span className="chat-avatar">🤖</span>
            <div>
              <strong>Physics Tutor</strong>
              <span className="chat-model">{SAVED_MODELS.find((m) => m.id === model)?.name || model}</span>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="btn-outline" onClick={clearChat}>Clear</button>
          )}
        </div>

        <div className="chat-messages scroll-container">
          {messages.length === 0 && !loading && (
            <div className="chat-welcome">
              <div className="welcome-icon">🔬</div>
              <h2>Ask me anything about optics!</h2>
              <p>I can help you understand ray optics, wave optics, solve problems, and generate notes.</p>
              <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => setInput(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg msg-${msg.role}`}>
              <div className="msg-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
              <div className="msg-content">
                <div className="msg-role-label">
                  {msg.role === 'user' ? 'You' : 'Physics Tutor'}
                </div>
                <div className="msg-text">
                  {renderFormattedText(msg.content)}
                </div>
                {msg.role === 'assistant' && (
                  <div className="msg-actions">
                    <button
                      className={`msg-action-btn${isSpeakingActive && lastAssistantMsg === msg ? ' active' : ''}`}
                      onClick={() => handleSpeak(msg.content)}
                      title="Read aloud"
                    >
                      {isSpeakingActive && lastAssistantMsg === msg ? '🔊' : '🔈'}
                    </button>
                    <button
                      className="msg-action-btn"
                      onClick={() => copyToClipboard(msg.content)}
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && streamingContent && (
            <div className="chat-msg msg-assistant">
              <div className="msg-avatar">🤖</div>
              <div className="msg-content">
                <div className="msg-role-label">Physics Tutor</div>
                <div className="msg-text">{renderFormattedText(streamingContent)}</div>
                <div className="streaming-cursor" />
              </div>
            </div>
          )}

          {loading && !streamingContent && (
            <div className="chat-msg msg-assistant">
              <div className="msg-avatar">🤖</div>
              <div className="msg-content">
                <div className="msg-role-label">Physics Tutor</div>
                <div className="thinking-dots">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <button
            className={`chat-voice-btn${isListening ? ' listening' : ''}`}
            onClick={handleVoiceInput}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? '🎤' : '🎙️'}
          </button>
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about optics..."
            rows={1}
            disabled={loading}
          />
          {loading ? (
            <button className="chat-send-btn stop-btn" onClick={handleStop}>
              ⏹
            </button>
          ) : (
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || !apiKey}
            >
              ➤
            </button>
          )}
        </div>
      </div>

      <style>{`
        .tutor-page {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: calc(100vh - var(--nav-height) - 56px);
          min-height: 600px;
        }
        .tutor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .tutor-header-left .page-title {
          font-size: 28px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .page-desc {
          color: var(--text-secondary);
          font-size: 14px;
          margin-top: 4px;
        }
        .tutor-header-actions {
          display: flex;
          gap: 8px;
        }
        .tutor-settings, .notes-generator, .saved-notes-panel {
          padding: 20px;
        }
        .tutor-settings {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .settings-field {
          flex: 1;
          min-width: 200px;
        }
        .settings-field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .notes-generator h3, .saved-notes-panel h3 {
          font-size: 16px;
          margin-bottom: 12px;
        }
        .notes-input-row {
          display: flex;
          gap: 8px;
        }
        .notes-input-row .input-field {
          flex: 1;
        }
        .notes-result {
          margin-top: 16px;
        }
        .notes-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .notes-result-actions {
          display: flex;
          gap: 8px;
        }
        .notes-content {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-height: 400px;
          overflow-y: auto;
        }
        .notes-h3 { color: var(--accent-cyan); font-size: 16px; margin: 16px 0 8px; }
        .notes-h4 { color: var(--text-primary); font-size: 14px; margin: 12px 0 6px; }
        .notes-li { margin: 2px 0 2px 20px; list-style: disc; }
        .notes-p { margin: 4px 0; }
        .no-notes { color: var(--text-muted); font-size: 14px; padding: 20px 0; text-align: center; }
        .saved-notes-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        .saved-note-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          gap: 12px;
        }
        .saved-note-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .saved-note-info strong {
          font-size: 14px;
        }
        .saved-note-date {
          font-size: 12px;
          color: var(--text-muted);
        }
        .saved-note-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .saved-note-actions .btn-outline {
          font-size: 12px;
          padding: 4px 10px;
        }
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chat-avatar {
          font-size: 28px;
        }
        .chat-header-info strong {
          display: block;
          font-size: 14px;
        }
        .chat-model {
          font-size: 11px;
          color: var(--text-muted);
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-welcome {
          text-align: center;
          padding: 40px 20px;
          max-width: 500px;
          margin: auto;
        }
        .welcome-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }
        .chat-welcome h2 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .chat-welcome p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 20px;
        }
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .suggestion-chip {
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 100px;
          color: var(--text-secondary);
          font-size: 12px;
          transition: var(--transition);
        }
        .suggestion-chip:hover {
          border-color: var(--accent-blue);
          color: var(--text-primary);
          background: var(--bg-card-hover);
        }
        .chat-msg {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }
        .msg-avatar {
          font-size: 24px;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border-radius: 50%;
        }
        .msg-content {
          flex: 1;
          min-width: 0;
        }
        .msg-role-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .msg-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
        }
        .msg-p {
          margin: 4px 0;
        }
        .msg-li {
          margin: 2px 0 2px 18px;
          list-style: disc;
        }
        .msg-heading {
          font-size: 16px;
          color: var(--accent-cyan);
          margin: 16px 0 8px;
        }
        .msg-subheading {
          font-size: 14px;
          color: var(--text-primary);
          margin: 12px 0 6px;
        }
        .formula-block {
          display: block;
          text-align: center;
          padding: 12px;
          margin: 8px 0;
          background: rgba(59, 130, 246, 0.05);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          color: var(--accent-electric);
          font-size: 15px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        .formula-inline {
          font-family: var(--font-mono);
          color: var(--accent-electric);
          font-size: 14px;
          padding: 0 2px;
        }
        .msg-actions {
          display: flex;
          gap: 4px;
          margin-top: 8px;
          opacity: 0;
          transition: var(--transition);
        }
        .chat-msg:hover .msg-actions {
          opacity: 1;
        }
        .msg-action-btn {
          background: transparent;
          color: var(--text-muted);
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: var(--transition);
        }
        .msg-action-btn:hover, .msg-action-btn.active {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .streaming-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent-cyan);
          animation: pulse 1s ease infinite;
          margin-left: 2px;
          vertical-align: middle;
        }
        .thinking-dots {
          display: flex;
          gap: 4px;
          padding: 12px 0;
        }
        .thinking-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-cyan);
          animation: pulse 1s ease infinite;
        }
        .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
        .chat-input-area {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-card);
        }
        .chat-voice-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .chat-voice-btn:hover {
          border-color: var(--accent-blue);
        }
        .chat-voice-btn.listening {
          border-color: var(--accent-red);
          background: rgba(239, 68, 68, 0.1);
          animation: pulse 1s ease infinite;
        }
        .chat-input {
          flex: 1;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 14px;
          resize: none;
          max-height: 120px;
          font-family: var(--font-sans);
          line-height: 1.5;
        }
        .chat-input:focus {
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .chat-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--glow-blue);
        }
        .chat-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }
        .chat-send-btn.stop-btn {
          background: var(--accent-red);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .tutor-page {
            height: calc(100vh - var(--nav-height) - 80px);
          }
          .tutor-header {
            flex-direction: column;
            gap: 8px;
          }
          .chat-messages {
            padding: 12px;
          }
          .chat-input-area {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}
