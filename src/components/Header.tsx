import React, { useState, useEffect } from 'react'
import { FaExpand, FaCompress } from 'react-icons/fa'
import { UserIcon } from './SmartBuildingIcons'
import './Header.css'

interface HeaderProps {
  activeTab?: 'overview' | 'floorplan'
  onTabChange?: (tab: 'overview' | 'floorplan') => void
  showTabs?: boolean
  title?: string
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'overview', onTabChange, showTabs = false, title }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen()
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="/智慧楼宇图标/数据大屏/logo.png" 
          alt="中国移动" 
          className="header-logo"
        />
        <h1 className="header-title">{title || '新智楼宇能耗大屏'}</h1>
      </div>
      <div className="header-right">
        <button className="fullscreen-btn" onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏显示'}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
        <div className="user-info">
          <UserIcon className="user-icon" />
          <span className="user-name">张三</span>
        </div>
        <div className="time-info">
          <span className="time">{formatTime(currentTime)}</span>
          <span className="date">{formatDate(currentTime)}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
