# 统计数据API使用说明

## 初始化数据库表

在运行API之前，需要先初始化数据库表：

```bash
mysql -u root -p < database/add_statistics_tables.sql
```

或者使用MySQL客户端工具执行 `database/add_statistics_tables.sql` 文件。

## API接口

### 1. 获取楼层统计数据

```bash
GET /api/statistics/floor?floor=3层&days=7
```

**参数：**
- `floor` (必需): 楼层名称，如 "3层"
- `days` (可选): 统计天数，默认7天

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "name": "301销售副总经理室",
      "door": 15.5,
      "occupied": 8.2,
      "ac": 12.3,
      "light": 10.1
    },
    ...
  ]
}
```

### 2. 获取房间统计数据

```bash
GET /api/statistics/room?room=301销售副总经理室&days=7
```

**参数：**
- `room` (必需): 房间名称
- `days` (可选): 统计天数，默认7天

**响应：**
```json
{
  "success": true,
  "data": {
    "door": 15.5,
    "occupied": 8.2,
    "ac": 12.3,
    "light": 10.1
  }
}
```

### 3. 获取所有楼层列表

```bash
GET /api/statistics/floors
```

**响应：**
```json
{
  "success": true,
  "data": ["1层", "2层", "3层", ...]
}
```

### 4. 获取指定楼层的房间列表

```bash
GET /api/statistics/rooms?floor=3层
```

**参数：**
- `floor` (必需): 楼层名称

**响应：**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "301销售副总经理室"},
    {"id": 2, "name": "302技术办公室"},
    ...
  ]
}
```

## 数据更新

统计数据表 `room_statistics` 需要定期更新。可以通过以下方式：

1. **手动插入数据**（用于测试）：
```sql
INSERT INTO room_statistics (room_id, date, door_hours, occupied_hours, ac_hours, light_hours)
VALUES (1, CURDATE(), 8.5, 6.2, 10.3, 9.1);
```

2. **定时任务更新**：可以设置定时任务（如cron）定期从传感器或设备系统同步数据

3. **实时更新**：如果有实时数据源，可以通过API接口实时更新数据

## 注意事项

- 统计数据按日期存储，同一天的数据会覆盖更新
- 房间名称需要与前端使用的名称完全匹配
- 如果API调用失败，前端会显示错误信息，但不会影响页面正常显示




