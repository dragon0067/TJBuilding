import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed)
    onCollapseChange?.(newCollapsed)
  }

  const menuItems = [
    { name: '首页', icon: '/智慧楼宇图标/左侧菜单/首页.png', path: '/', openInNewTab: false },
    { name: '智慧大屏', icon: '/智慧楼宇图标/左侧菜单/智慧大屏.png', path: '/dashboard', openInNewTab: true },
    { name: '公司用户', icon: '/智慧楼宇图标/左侧菜单/用户.png', path: '/users', openInNewTab: false },
    { name: '场景联动管理', icon: '/智慧楼宇图标/左侧菜单/场景联动.png', path: '/scenes', openInNewTab: false },
    { name: '网点配置', icon: '/智慧楼宇图标/左侧菜单/网点配置.png', path: '/network', openInNewTab: false },
    { name: '用电报告', icon: '/智慧楼宇图标/左侧菜单/用电报告.png', path: '/report', openInNewTab: false }
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.openInNewTab) {
      // 在新标签页中打开
      const url = window.location.origin + item.path
      window.open(url, '_blank')
    } else {
      // 在当前页面跳转
      navigate(item.path)
    }
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <img 
            src={collapsed ? "/智慧楼宇图标/左侧菜单/logo.png" : "/智慧楼宇图标/左侧菜单/首页logo.png"} 
            alt="Logo" 
          />
        </div>

        {/* 菜单项 */}
        <div className="sidebar-menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <div
                key={index}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <img src={item.icon} alt={item.name} className="menu-icon" />
                {!collapsed && <span className="menu-text">{item.name}</span>}
              </div>
            )
          })}
        </div>

      </div>

      {/* 折叠按钮 */}
      <button
        className="sidebar-toggle"
        onClick={() => handleCollapse(!collapsed)}
        title={collapsed ? '展开菜单' : '折叠菜单'}
      >
        {collapsed ? '▶' : '◀'}
      </button>
    </div>
  )
}

export default Sidebar

