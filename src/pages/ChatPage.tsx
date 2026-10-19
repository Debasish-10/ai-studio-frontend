import { useState } from 'react'
import { AudioGenerationPanel } from '../components/AudioGenerationPanel'
import { ChatConversationPanel } from '../components/ChatConversationPanel'
import { ImageGenerationPanel } from '../components/ImageGenerationPanel'
import { ToolCallingPanel } from '../components/ToolCallingPanel'

type FeatureTab = 'chat' | 'tools' | 'image' | 'audio'

const featureTabs: { id: FeatureTab; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'tools', label: 'Tool Calling' },
  { id: 'image', label: 'Image Generation' },
  { id: 'audio', label: 'Audio Generation' },
]

export function ChatPage() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('chat')
  const [temperature, setTemperature] = useState(1)

  return (
    <section className="chat-card" aria-labelledby="chat-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Chat</p>
          <h2 id="chat-heading">Chat</h2>
        </div>
        <p>Send a message to the connected chat API.</p>
      </div>

      <div className="feature-tabs" role="tablist" aria-label="AI Studio features">
        {featureTabs.map((tab) => (
          <button
            type="button"
            className={activeTab === tab.id ? 'feature-tab active' : 'feature-tab'}
            id={`${tab.id}-tab`}
            key={tab.id}
            role="tab"
            aria-controls={`${tab.id}-panel`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ChatConversationPanel
        hidden={activeTab !== 'chat'}
        temperature={temperature}
        onTemperatureChange={setTemperature}
      />
      <ToolCallingPanel hidden={activeTab !== 'tools'} temperature={temperature} />
      <ImageGenerationPanel hidden={activeTab !== 'image'} />
      <AudioGenerationPanel hidden={activeTab !== 'audio'} />
    </section>
  )
}
