import express from 'express'
import assistantController from '../controllers/assistantController.js'

const router = express.Router()

// 获取助手回答
router.post('/ask', assistantController.getAnswer)

// 获取推荐问题
router.get('/suggestions', assistantController.getSuggestions)

// 获取所有知识库条目（管理用）
router.get('/knowledge', assistantController.getAllKnowledge)

// 添加知识库条目（管理用）
router.post('/knowledge', assistantController.addKnowledge)

// 更新知识库条目（管理用）
router.put('/knowledge/:id', assistantController.updateKnowledge)

// 删除知识库条目（管理用）
router.delete('/knowledge/:id', assistantController.deleteKnowledge)

export default router


