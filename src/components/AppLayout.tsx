import { NavLink, Outlet } from 'react-router-dom'
import { BackendStatus } from './BackendStatus'

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar" aria-label="Main navigation">
        <div>
          <p className="eyebrow">AI Engineering Platform</p>
          <h1>AI Studio</h1>
        </div>
        <nav>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/prompt-builder">Prompt Builder</NavLink>
          <NavLink to="/prompt-library">Prompt Library</NavLink>
          <NavLink to="/evaluations">Evaluations</NavLink>
        </nav>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <BackendStatus />
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
