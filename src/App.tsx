import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ChatPage } from './pages/ChatPage'
import { EvaluationPage } from './pages/EvaluationPage'
import { PromptBuilderPage } from './pages/PromptBuilderPage'
import { PromptLibraryPage } from './pages/PromptLibraryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="prompt-builder" element={<PromptBuilderPage />} />
          <Route path="prompt-library" element={<PromptLibraryPage />} />
          <Route path="evaluations" element={<EvaluationPage />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
