import React, { useState, useEffect } from 'react'
import StatisticsAIAnalysis from './StatisticsAIAnalysis'
import { getFloorStatistics, getRoomStatistics, RoomStat, TotalHours } from '../services/statisticsService'
import './FloatingAIAnalysis.css'

interface FloatingAIAnalysisProps {
  floor?: string
  room?: string
  days?: number // 统计天数，默认7天
}

const FloatingAIAnalysis: React.FC<FloatingAIAnalysisProps> = ({
  floor,
  room,
  days = 7
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [roomStatistics, setRoomStatistics] = useState<RoomStat[] | undefined>(undefined)
  const [totalHours, setTotalHours] = useState<TotalHours | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      if (!floor && !room) {
        setRoomStatistics(undefined)
        setTotalHours(undefined)
        return
      }

      setLoading(true)
      setError(null)

      try {
        if (floor && !room) {
          // 楼层模式：获取楼层统计数据
          const stats = await getFloorStatistics(floor, days)
          setRoomStatistics(stats)
          setTotalHours(undefined)
        } else if (room) {
          // 房间模式：获取房间统计数据
          const stats = await getRoomStatistics(room, days)
          setTotalHours(stats || undefined)
          setRoomStatistics(undefined)
        }
      } catch (err) {
        console.error('获取统计数据失败:', err)
        setError('获取数据失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [floor, room, days])

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        className={`floating-ai-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="打开AI智能分析"
        title="AI智能分析"
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
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </>
          )}
        </svg>
        <span className="floating-ai-button-text">AI</span>
      </button>

      {/* 悬浮窗口 */}
      {isOpen && (
        <div className="floating-ai-window">
          <div className="floating-ai-header">
            <div className="floating-ai-title">
              <span className="ai-icon-large">🤖</span>
              <span>AI智能分析</span>
            </div>
            <button
              className="floating-ai-close"
              onClick={() => setIsOpen(false)}
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

          <div className="floating-ai-content">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                正在加载数据...
              </div>
            ) : error ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
                {error}
              </div>
            ) : (
              <StatisticsAIAnalysis
                floor={floor}
                room={room}
                roomStatistics={roomStatistics}
                totalHours={totalHours}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingAIAnalysis

