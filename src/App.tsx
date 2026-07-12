import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Quiz from './components/Quiz'
import Classes from './components/Classes'
import AITutor from './components/AITutor'
import Labs from './components/Labs'
import Videos from './components/Videos'

export type TabId = 'quizzes' | 'classes' | 'tutor' | 'labs' | 'videos'

export interface TabInfo {
  id: TabId
  label: string
  icon: string
}

const TABS: TabInfo[] = [
  { id: 'quizzes', label: 'Quizzes', icon: '📝' },
  { id: 'classes', label: 'Classes', icon: '📚' },
  { id: 'tutor', label: 'AI Tutor', icon: '🤖' },
  { id: 'labs', label: 'Labs', icon: '🔬' },
  { id: 'videos', label: 'Videos', icon: '🎥' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('quizzes')

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'quizzes':
        return <Quiz />
      case 'classes':
        return <Classes />
      case 'tutor':
        return <AITutor />
      case 'labs':
        return <Labs />
      case 'videos':
        return <Videos />
      default:
        return <Quiz />
    }
  }

  return (
    <div className="app-container">
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="bg-glow-2" />
      <Navbar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  )
}
