-- 为现有表添加用电量和总功率字段（如果字段不存在）
USE tjbuilding;

-- 检查并添加energy字段
SET @dbname = DATABASE();
SET @tablename = 'room_statistics';
SET @columnname = 'energy';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(8,1) DEFAULT 0 COMMENT ''用电量（度）''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 检查并添加power字段
SET @columnname = 'power';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(6,1) DEFAULT 0 COMMENT ''总功率（W）''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 更新现有数据（如果字段值为0，则填充示例数据）
UPDATE room_statistics 
SET 
  energy = ROUND(RAND() * 37 + 3, 1),
  power = ROUND(RAND() * 21 + 30, 1)
WHERE (energy = 0 OR energy IS NULL) OR (power = 0 OR power IS NULL);




