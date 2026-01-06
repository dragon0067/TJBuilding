import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './FloorPlan.module.css'

// 设备类型枚举
export type DeviceType = 'airConditioner' | 'light' | 'socket' | 'computer' | 'projector'

// 设备状态
export type DeviceStatus = 'on' | 'off'

// 设备数据结构
export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  position: {
    x: number // 相对于图片的百分比位置 (0-100)
    y: number // 相对于图片的百分比位置 (0-100)
  }
  room?: string // 所属房间
  power?: number // 功率（瓦）
  temperature?: number // 温度（摄氏度）
  description?: string // 设备描述
}

interface FloorPlanProps {
  isOpen: boolean
  onClose: () => void
  floorName?: string // 楼层名称
  floorPlanImage?: string // 平面图图片路径，如果不提供则使用默认占位图
  devices?: Device[] // 设备列表
}

// 设备图标映射
const getDeviceIcon = (type: DeviceType, status: DeviceStatus): string => {
  const iconMap: Record<DeviceType, Record<DeviceStatus, string>> = {
    airConditioner: {
      on: '/智慧楼宇图标/设备列表/空调 开.png',
      off: '/智慧楼宇图标/设备列表/空调关.png'
    },
    light: {
      on: '/智慧楼宇图标/设备列表/照明灯开.png',
      off: '/智慧楼宇图标/设备列表/照明灯关.png'
    },
    socket: {
      on: '/智慧楼宇图标/设备列表/插座开.png',
      off: '/智慧楼宇图标/设备列表/插座关.png'
    },
    computer: {
      on: '/智慧楼宇图标/设备列表/电脑开.png',
      off: '/智慧楼宇图标/设备列表/电脑关.png'
    },
    projector: {
      on: '/智慧楼宇图标/设备列表/投影仪开.png',
      off: '/智慧楼宇图标/设备列表/投影仪关.png'
    }
  }
  return iconMap[type]?.[status] || iconMap.airConditioner.off
}

// 设备类型中文名称
const getDeviceTypeName = (type: DeviceType): string => {
  const nameMap: Record<DeviceType, string> = {
    airConditioner: '空调',
    light: '照明灯',
    socket: '插座',
    computer: '电脑',
    projector: '投影仪'
  }
  return nameMap[type] || '设备'
}

const FloorPlan: React.FC<FloorPlanProps> = ({
  isOpen,
  onClose,
  floorName = '平面图',
  floorPlanImage,
  devices = []
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 默认平面图（如果没有提供）
  const defaultImage = '/智慧楼宇图标/数据大屏/logo.png' // 可以替换为实际的平面图
  const imageSrc = floorPlanImage || defaultImage

  // 监听图片加载
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad()
    }
  }, [isOpen])

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current
      setImageSize({
        width: img.offsetWidth,
        height: img.offsetHeight
      })
      setImageLoaded(true)
    }
  }

  // 点击设备图标
  const handleDeviceClick = (device: Device, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedDevice(device)
  }

  // 关闭设备详情
  const handleCloseDeviceDetail = () => {
    setSelectedDevice(null)
  }

  // 点击背景关闭
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // 阻止ESC键关闭（可选，如果需要可以添加）
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (selectedDevice) {
          setSelectedDevice(null)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, selectedDevice, onClose])

  // 阻止背景滚动 - 只在打开时执行
  useEffect(() => {
    if (!isOpen) {
      // 确保关闭时恢复 body 样式
      document.body.style.overflow = ''
      return
    }
    
    // 保存原始 overflow 值
    const originalOverflow = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
    
    return () => {
      // 恢复原始 overflow 值
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])
  
  // 关闭时强制清理，避免样式残留
  useEffect(() => {
    if (!isOpen) {
      // 确保所有可能的样式都被清理
      document.body.style.overflow = ''
      // 强制重新计算样式
      if (document.body) {
        document.body.offsetHeight
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // 使用 Portal 渲染到 body 下，避免样式影响
  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {floorName} - 设备分布图
          </h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="关闭"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className={styles.content} ref={containerRef}>
          {/* 平面图容器 */}
          <div className={styles.imageContainer}>
            <img
              ref={imageRef}
              src={imageSrc}
              alt={floorName}
              className={styles.image}
              onLoad={handleImageLoad}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
            
            {/* 设备图标层 */}
            {imageLoaded && devices.map((device) => {
              const iconSrc = getDeviceIcon(device.type, device.status)
              return (
                <div
                  key={device.id}
                  className={`${styles.deviceMarker} ${device.status === 'on' ? styles.deviceMarkerOn : ''} ${selectedDevice?.id === device.id ? styles.selected : ''}`}
                  style={{
                    left: `${device.position.x}%`,
                    top: `${device.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => handleDeviceClick(device, e)}
                  title={`${device.name} (${getDeviceTypeName(device.type)})`}
                >
                  <img
                    src={iconSrc}
                    alt={device.name}
                    className={styles.deviceIcon}
                  />
                  {device.status === 'on' && (
                    <span className={styles.statusIndicator}></span>
                  )}
                </div>
              )
            })}

            {/* 加载提示 */}
            {!imageLoaded && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>加载平面图中...</p>
              </div>
            )}
          </div>

          {/* 设备列表侧边栏 */}
          <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>设备列表</h3>
            <div className={styles.deviceList}>
              {devices.length === 0 ? (
                <div className={styles.deviceListEmpty}>
                  <p>暂无设备</p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className={`${styles.deviceListItem} ${selectedDevice?.id === device.id ? styles.active : ''} ${device.status === 'on' ? styles.deviceListItemOn : styles.deviceListItemOff}`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <img
                      src={getDeviceIcon(device.type, device.status)}
                      alt={device.name}
                      className={styles.deviceListIcon}
                    />
                    <div className={styles.deviceListInfo}>
                      <div className={styles.deviceListName}>{device.name}</div>
                      <div className={styles.deviceListType}>
                        {getDeviceTypeName(device.type)}
                        {device.room && ` · ${device.room}`}
                      </div>
                    </div>
                    <div className={`${styles.deviceListStatus} ${device.status === 'on' ? styles.deviceListStatusOn : styles.deviceListStatusOff}`}>
                      {device.status === 'on' ? '运行中' : '已关闭'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 设备详情弹窗 */}
        {selectedDevice && (
          <div className={styles.detailOverlay} onClick={handleCloseDeviceDetail}>
            <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.detailHeader}>
                <h3>{selectedDevice.name}</h3>
                <button
                  className={styles.detailClose}
                  onClick={handleCloseDeviceDetail}
                  aria-label="关闭"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailIcon}>
                  <img
                    src={getDeviceIcon(selectedDevice.type, selectedDevice.status)}
                    alt={selectedDevice.name}
                  />
                </div>
                <div className={styles.detailInfo}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>设备类型：</span>
                    <span className={styles.detailValue}>{getDeviceTypeName(selectedDevice.type)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>运行状态：</span>
                    <span className={`${styles.detailValue} ${selectedDevice.status === 'on' ? styles.statusOn : styles.statusOff}`}>
                      {selectedDevice.status === 'on' ? '运行中' : '已关闭'}
                    </span>
                  </div>
                  {selectedDevice.room && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>所属房间：</span>
                      <span className={styles.detailValue}>{selectedDevice.room}</span>
                    </div>
                  )}
                  {selectedDevice.power !== undefined && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>功率：</span>
                      <span className={styles.detailValue}>{selectedDevice.power}W</span>
                    </div>
                  )}
                  {selectedDevice.temperature !== undefined && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>温度：</span>
                      <span className={styles.detailValue}>{selectedDevice.temperature}°C</span>
                    </div>
                  )}
                  {selectedDevice.description && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>描述：</span>
                      <span className={styles.detailValue}>{selectedDevice.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default FloorPlan

