-- 添加房间统计数据表
USE tjbuilding;

-- 创建房间表
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  floor VARCHAR(20) NOT NULL COMMENT '楼层',
  name VARCHAR(100) NOT NULL COMMENT '房间名称',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_floor_name (floor, name),
  INDEX idx_floor (floor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- 创建房间统计数据表
CREATE TABLE IF NOT EXISTS room_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL COMMENT '房间ID',
  date DATE NOT NULL COMMENT '统计日期',
  door_hours DECIMAL(5,1) DEFAULT 0 COMMENT '门开启时长（小时）',
  occupied_hours DECIMAL(5,1) DEFAULT 0 COMMENT '有人时长（小时）',
  ac_hours DECIMAL(5,1) DEFAULT 0 COMMENT '空调开启时长（小时）',
  light_hours DECIMAL(5,1) DEFAULT 0 COMMENT '照明开启时长（小时）',
  energy DECIMAL(8,1) DEFAULT 0 COMMENT '用电量（度）',
  power DECIMAL(6,1) DEFAULT 0 COMMENT '总功率（W）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  UNIQUE KEY uk_room_date (room_id, date),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间统计数据表';

-- 插入示例房间数据
INSERT INTO rooms (floor, name) VALUES
('1层', '101办公室'),
('1层', '102会议室'),
('1层', '103接待室'),
('2层', '201办公室'),
('2层', '202会议室'),
('2层', '203技术室'),
('3层', '301销售副总经理室'),
('3层', '302技术办公室'),
('3层', '303人力资源部'),
('3层', '304财务部'),
('3层', '305综合部办公室')
ON DUPLICATE KEY UPDATE name=name;

-- 插入示例统计数据（近7天的数据）
INSERT INTO room_statistics (room_id, date, door_hours, occupied_hours, ac_hours, light_hours, energy, power) 
SELECT 
  r.id,
  DATE_SUB(CURDATE(), INTERVAL days DAY) as date,
  ROUND(RAND() * 8 + 2, 1) as door_hours,
  ROUND(RAND() * 6 + 1, 1) as occupied_hours,
  ROUND(RAND() * 8 + 2, 1) as ac_hours,
  ROUND(RAND() * 8 + 2, 1) as light_hours,
  ROUND(RAND() * 37 + 3, 1) as energy,
  ROUND(RAND() * 21 + 30, 1) as power
FROM rooms r
CROSS JOIN (
  SELECT 0 as days UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
) d
ON DUPLICATE KEY UPDATE 
  door_hours=VALUES(door_hours),
  occupied_hours=VALUES(occupied_hours),
  ac_hours=VALUES(ac_hours),
  light_hours=VALUES(light_hours),
  energy=VALUES(energy),
  power=VALUES(power);

