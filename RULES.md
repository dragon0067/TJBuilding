# 项目规则文档 (RULES.md)

## 重要提示

⚠️ **此文件用于记录项目的所有已确定规则和约定**

- 每次新对话开始时，AI助手应该先读取此文件
- 如果项目中没有此文件，应该自动创建
- 所有已确定的规则都应该记录在此文件中
- 修改代码时，如果违反此文件中的规则，应该提醒用户
- **请勿随意修改已确定的规则，除非用户明确要求**

---

## 1. 房间图标显示规则

**文件**: `src/components/MiddleColumn.tsx`

**规则**:
- 有空调开启的图标表示空调开启，否则没有开启
- 有照明图标表示照明开启
- 只有当 `acOn === true` 时才显示空调图标
- 只有当 `lightOn === true` 时才显示照明图标
- 图标显示逻辑：`{roomItem.lightOn && <LightOnIcon />}` 和 `{roomItem.acOn && <PlugIcon />}`

---

## 2. 红框房间规则

**文件**: `src/components/MiddleColumn.tsx`

**规则**:
- 当空调开启(`acOn === true`)或照明开启(`lightOn === true`)时，但检测人员显示当前没有人(`isOccupied === false`)，则框红框
- 红框样式：
  - 边框：`border: 2px solid #FF0000`
  - 背景：`background: rgba(255, 0, 0, 0.1)`
  - 阴影：`box-shadow: 0 0 15px rgba(255, 0, 0, 0.3)`
- 红框房间的 `highlighted` 字段自动计算：`highlighted = (acOn || lightOn) && !isOccupied`
- 在 `generateFloorData` 函数最后，所有房间的 `highlighted` 状态会重新计算以确保符合规则

---

## 3. 房间排序规则（已确定，不要修改）

**文件**: `src/components/MiddleColumn.tsx` (第204-219行)

**规则**:
- **红框房间优先排在左边**
- **红框房间之间按功率由大到小排序（降序）**
- **非红框房间按功率降序排列（从大到小）**

**排序逻辑**:
```typescript
const sortedRooms = [...rooms].sort((a, b) => {
  // 红框房间优先
  if (a.highlighted && !b.highlighted) return -1
  if (!a.highlighted && b.highlighted) return 1
  // 如果都是红框房间，按功率由大到小排序
  if (a.highlighted && b.highlighted) {
    return b.power - a.power
  }
  // 如果都不是红框房间，按功率降序排列
  if (!a.highlighted && !b.highlighted) {
    return b.power - a.power
  }
  return 0
})
```

⚠️ **重要**: 此排序规则已确定，不要随意修改

---

## 4. 统计页面排序规则

**文件**: `src/components/StatusStatistics.tsx`

**规则**:
- **进入统计界面默认按功率降序排序**
  - 初始状态：`sortField = 'power'`，`sortOrder = 'desc'`
- 所有列头都可以点击排序：
  - 房间名称
  - 门开(小时)
  - 有人(小时)
  - 空调开(小时)
  - 照明开(小时)
  - 用电量(度)
  - 总功率(W)
- 排序交互：
  - 首次点击：降序（从大到小）
  - 再次点击：切换为升序（从小到大）
  - 点击其他列：切换到新列，默认降序
- 当前排序列高亮显示（蓝色背景），显示排序箭头（↑ 升序，↓ 降序）

---

## 5. 房间卡片按钮规则

**文件**: `src/components/MiddleColumn.tsx`

**规则**:
- 每个房间卡片有2个按钮："进入房间"和"平面图"
- **按钮与"有人/无人"图标在同一行**（在 `detail-item occupancy` 内）
- 按钮位置：使用 `margin-left: auto` 靠右对齐
- 按钮使用图片图标：
  - 进入房间：`/智慧楼宇图标/首页/进入房间.png`
  - 平面图：`/智慧楼宇图标/首页/平面图.png`
- 如果图标文件不存在，可以使用文字按钮
- 按钮点击事件使用 `e.stopPropagation()` 防止触发房间卡片点击

---

## 6. 日期分隔线规则

**文件**: `src/components/StatusStatistics.tsx`

**规则**:
- 日期分隔线用于清晰区分每一天的数据
- 分隔线样式：
  - 颜色：`#E0E0E0`
  - 宽度：`2px`
  - 类型：`solid`
- 配置位置：`yAxis.splitLine.lineStyle`

---

## 7. 数据生成规则

**文件**: `src/components/MiddleColumn.tsx`

**规则**:
- 每个楼层10个房间
- 楼层范围：-1层到30层（共31层）
- 占用时长格式：统一显示"X时X分"格式（例如："2时15分"）

**随机生成规则**:
- 温度：20-28度（随机整数）
- 用电量：3-40度（保留1位小数）
- 功率：30-50W（随机整数）
- 占用时长：0-4小时（随机小时和分钟）
- 是否有人：70%概率有人（`Math.random() > 0.3`）
- 空调状态：50%概率开启（`Math.random() > 0.5`）
- 照明状态：50%概率开启（`Math.random() > 0.5`）

**现有房间数据**:
- 在 `generateFloorData` 函数中有预定义的房间列表
- 这些房间会优先使用，不足10个的房间会通过 `generateRandomRoom` 补充

---

## 8. 房间卡片选中状态规则

**文件**: `src/components/MiddleColumn.tsx`, `src/components/MiddleColumn.css`

**规则**:
- 房间卡片可以选中，选中时显示蓝色边框
- 如果房间同时有红框（highlighted）和选中（selected）状态：
  - **红框优先级更高**，会覆盖蓝色边框
  - CSS规则：`.room-card.highlighted.selected` 使用红框样式

---

## 9. 图标路径规则

**文件**: `src/components/SmartBuildingIcons.tsx`

**规则**:
- 所有图标路径使用 `/智慧楼宇图标/...` 格式（Vite的public目录访问方式）
- 图标已设置合适的尺寸（width和height）
- 图标使用 `object-fit: contain` 保持比例

---

## 如何更新此文件

1. **添加新规则**：
   - 当确定新的规则或约定时，立即更新此文件
   - 按照现有格式添加新的章节

2. **修改现有规则**：
   - 如果用户明确要求修改规则，更新此文件
   - 在规则旁边标注修改日期和原因（可选）

3. **维护建议**：
   - 每次修改代码时，检查是否影响已确定的规则
   - 如果发现规则冲突，优先询问用户

---

## 注意事项

- ⚠️ **不要随意修改已确定的规则**
- ⚠️ **修改代码前，先检查是否违反此文件中的规则**
- ⚠️ **如果用户要求修改规则，先更新此文件，再修改代码**
- ⚠️ **在新对话开始时，AI助手应该先读取此文件**

---

**最后更新**: 2025年12月20日（创建时）



