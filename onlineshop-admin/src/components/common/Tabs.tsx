import { useState } from 'react'

type TabProps = {
  tabs: { label: string; content: React.ReactNode }[]
}

const Tabs: React.FC<TabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div className='flex space-x-4 border-b'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 md:px-4 focus:outline-none ${activeTab === index ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='mt-4'>{tabs[activeTab].content}</div>
    </div>
  )
}

export default Tabs
