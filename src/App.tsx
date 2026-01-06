import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './components/HomePage'
import Dashboard from './components/Dashboard'
import RoomControl from './components/RoomControl'
import './App.css'

const AppContent: React.FC = () => {
  const location = useLocation()

  // 根据路由动态设置浏览器标题
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      document.title = '新智楼宇能耗大屏'
    } else if (location.pathname.startsWith('/room-control')) {
      document.title = '房间控制页面'
    } else {
      document.title = '移通智慧楼宇管理平台'
    }
  }, [location.pathname])

  return (
    <div className="app">
      {location.pathname === '/dashboard' && (
        <Header 
          title="新智楼宇能耗大屏"
        />
      )}
      {location.pathname !== '/' && location.pathname !== '/dashboard' && !location.pathname.startsWith('/room-control') && (
        <Header 
          title="新智楼宇管理系统"
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room-control/:floor/:roomName" element={<HomePage showRoomControl={true} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

