import db from '../config/database.js'

// 智能匹配问题并返回答案
async function findBestMatch(question) {
  const query = question.toLowerCase().trim()
  
  try {
    // 获取所有知识库条目
    const [rows] = await db.execute(
      'SELECT id, question, answer, keywords, category FROM knowledge_base WHERE is_active = 1'
    )
    
    if (rows.length === 0) {
      return {
        answer: '抱歉，知识库暂时没有数据。请联系管理员添加知识库内容。',
        category: '默认'
      }
    }
    
    // 计算匹配分数
    const scores = rows.map(item => {
      let score = 0
      const keywords = item.keywords ? item.keywords.split(',') : []
      
      keywords.forEach(keyword => {
        if (query.includes(keyword.toLowerCase().trim())) {
          score += 1
        }
      })
      
      // 也检查问题内容
      if (item.question && query.includes(item.question.toLowerCase())) {
        score += 2
      }
      
      return { ...item, score }
    })
    
    // 按分数排序
    scores.sort((a, b) => b.score - a.score)
    
    // 如果有匹配，返回最高分的答案
    if (scores[0].score > 0) {
      return {
        answer: scores[0].answer,
        category: scores[0].category,
        id: scores[0].id
      }
    }
    
    // 默认回答
    return {
      answer: '抱歉，我没有完全理解您的问题。您可以尝试询问：\n- 系统功能\n- 如何查看数据\n- 能耗分析\n- 节能建议\n- 图表说明\n\n或者您可以更详细地描述您的问题，我会尽力帮助您！',
      category: '默认'
    }
  } catch (error) {
    console.error('查询知识库错误:', error)
    throw error
  }
}

// 获取助手回答
export const getAnswer = async (req, res) => {
  try {
    const { question } = req.body
    
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: '问题不能为空'
      })
    }
    
    // 模拟思考延迟
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))
    
    const result = await findBestMatch(question)
    
    res.json({
      success: true,
      answer: result.answer,
      category: result.category
    })
  } catch (error) {
    console.error('获取回答错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器错误，请稍后重试'
    })
  }
}

// 获取推荐问题
export const getSuggestions = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT question FROM knowledge_base WHERE is_active = 1 AND is_suggested = 1 ORDER BY sort_order ASC, id ASC LIMIT 7'
    )
    
    const suggestions = rows.map(row => row.question)
    
    res.json({
      success: true,
      suggestions: suggestions.length > 0 ? suggestions : [
        '这个系统有什么功能？',
        '如何查看能耗数据？',
        '如何理解用电量数据？',
        '如何节能降耗？',
        '如何查看房间信息？',
        '图表如何理解？',
        '如何切换时间段？'
      ]
    })
  } catch (error) {
    console.error('获取推荐问题错误:', error)
    res.json({
      success: true,
      suggestions: [
        '这个系统有什么功能？',
        '如何查看能耗数据？',
        '如何理解用电量数据？',
        '如何节能降耗？'
      ]
    })
  }
}

// 获取所有知识库条目
export const getAllKnowledge = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM knowledge_base ORDER BY category, sort_order, id'
    )
    
    res.json({
      success: true,
      data: rows
    })
  } catch (error) {
    console.error('获取知识库错误:', error)
    res.status(500).json({
      success: false,
      error: '获取知识库失败'
    })
  }
}

// 添加知识库条目
export const addKnowledge = async (req, res) => {
  try {
    const { question, answer, keywords, category, is_suggested, sort_order } = req.body
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: '问题和答案不能为空'
      })
    }
    
    const [result] = await db.execute(
      'INSERT INTO knowledge_base (question, answer, keywords, category, is_suggested, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        question,
        answer,
        keywords || '',
        category || '默认',
        is_suggested ? 1 : 0,
        sort_order || 0
      ]
    )
    
    res.json({
      success: true,
      id: result.insertId,
      message: '添加成功'
    })
  } catch (error) {
    console.error('添加知识库错误:', error)
    res.status(500).json({
      success: false,
      error: '添加失败'
    })
  }
}

// 更新知识库条目
export const updateKnowledge = async (req, res) => {
  try {
    const { id } = req.params
    const { question, answer, keywords, category, is_suggested, sort_order, is_active } = req.body
    
    await db.execute(
      'UPDATE knowledge_base SET question = ?, answer = ?, keywords = ?, category = ?, is_suggested = ?, sort_order = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
      [
        question,
        answer,
        keywords || '',
        category || '默认',
        is_suggested ? 1 : 0,
        sort_order || 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        id
      ]
    )
    
    res.json({
      success: true,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新知识库错误:', error)
    res.status(500).json({
      success: false,
      error: '更新失败'
    })
  }
}

// 删除知识库条目
export const deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params
    
    await db.execute('DELETE FROM knowledge_base WHERE id = ?', [id])
    
    res.json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除知识库错误:', error)
    res.status(500).json({
      success: false,
      error: '删除失败'
    })
  }
}

export default {
  getAnswer,
  getSuggestions,
  getAllKnowledge,
  addKnowledge,
  updateKnowledge,
  deleteKnowledge
}


