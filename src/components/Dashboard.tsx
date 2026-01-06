import React from 'react'
import LeftColumn from './LeftColumn'
import MiddleColumn from './MiddleColumn'
import RightColumn from './RightColumn'
import ChatAssistant from './ChatAssistant'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <LeftColumn />
        <MiddleColumn showRoomActions={false} showUserTimeInfo={false} />
        <RightColumn />
      </div>
      <ChatAssistant />
    </div>
  )
}

export default Dashboard




