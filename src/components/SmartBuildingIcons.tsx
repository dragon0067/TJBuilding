// 智慧楼宇图标组件
import React from 'react'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

// 温度图标
export const TemperatureIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/数据大屏/温度.png" 
    alt="温度" 
    className={className}
    style={{ width: '28px', height: '28px', objectFit: 'contain', ...style }}
  />
)

// 设备数量图标
export const DeviceCountIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/数据大屏/设备数量.png" 
    alt="设备数量" 
    className={className}
    style={{ width: '28px', height: '28px', objectFit: 'contain', ...style }}
  />
)

// 湿度图标
export const HumidityIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/数据大屏/湿度.png" 
    alt="湿度" 
    className={className}
    style={{ width: '28px', height: '28px', objectFit: 'contain', ...style }}
  />
)

// 用电量图标
export const EnergyIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/首页/用电量.png" 
    alt="用电量" 
    className={className}
    style={{ width: '18px', height: '18px', objectFit: 'contain', ...style }}
  />
)

// 总功率图标
export const PowerIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/首页/总功率.png" 
    alt="总功率" 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

// 照明灯图标（开）
export const LightOnIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/首页/灯开.png" 
    alt="照明" 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

// 插座图标（开）- 实际使用空调开图标
export const PlugIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/首页/空调开.png" 
    alt="插座" 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

// 人员图标（有人）
export const PersonIcon: React.FC<IconProps & { isOccupied?: boolean }> = ({ 
  className, 
  style, 
  isOccupied = true 
}) => (
  <img 
    src={isOccupied ? "/智慧楼宇图标/首页/有人.png" : "/智慧楼宇图标/首页/无人.png"} 
    alt={isOccupied ? "有人" : "无人"} 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

// 用户图标
export const UserIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/左侧菜单/用户.png" 
    alt="用户" 
    className={className}
    style={{ width: '18px', height: '18px', objectFit: 'contain', ...style }}
  />
)

// 空调图标（开）
export const AirConditionerIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/首页/空调开.png" 
    alt="空调" 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

// 空调图标（关）
export const AirConditionerOffIcon: React.FC<IconProps> = ({ className, style }) => (
  <img 
    src="/智慧楼宇图标/设备列表/空调关.png" 
    alt="空调关" 
    className={className}
    style={{ width: '16px', height: '16px', objectFit: 'contain', ...style }}
  />
)

