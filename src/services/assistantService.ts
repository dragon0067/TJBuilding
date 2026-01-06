// 智能助手服务 - 从API获取数据

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// API基础URL（根据环境配置）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// 获取助手回答（从API）
export async function getAssistantResponse(userMessage: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assistant/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: userMessage
      })
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const data = await response.json()
    
    if (data.success) {
      return data.answer
    } else {
      throw new Error(data.error || '获取回答失败')
    }
  } catch (error) {
    console.error('获取助手回答错误:', error)
    // 如果API失败，返回默认回答
    return '抱歉，服务暂时不可用。请稍后重试，或联系管理员。'
  }
}

// 获取推荐问题（从API）
export async function getSuggestedQuestions(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assistant/suggestions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const data = await response.json()
    
    if (data.success) {
      return data.suggestions
    } else {
      throw new Error('获取推荐问题失败')
    }
  } catch (error) {
    console.error('获取推荐问题错误:', error)
    // 如果API失败，返回默认推荐问题
    return [
      '这个系统有什么功能？',
      '如何查看能耗数据？',
      '如何理解用电量数据？',
      '如何节能降耗？',
      '如何查看房间信息？',
      '图表如何理解？',
      '如何切换时间段？'
    ]
  }
}

// 模拟AI思考延迟（可选）
export function simulateThinkingDelay(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 300 + Math.random() * 500) // 300-800ms随机延迟
  })
}

