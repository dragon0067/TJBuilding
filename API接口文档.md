# 后台数据接口文档

本文档整理了项目后台数据接口的详细信息。

## 基础配置

- **基础URL**: 根据环境配置（建议使用环境变量 `VITE_API_BASE_URL`）
- **认证方式**: Token认证（通过Header传递）

---

## 1. 账号密码登录（不需要验证码）

### 接口信息
- **接口地址**: `/shake3k/user/entrance/loginByNameNotImgCode`
- **请求方式**: `POST`
- **请求数据类型**: `application/json`
- **响应数据类型**: `*/*`
- **接口描述**: 用户端小程序登录（兼容s1登录）

### 请求参数

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 |
|---------|---------|---------|---------|---------|
| username | 用户名 | body | false | string |
| password | 密码 | body | false | string |

### 请求示例

```json
{
  "username": "",
  "password": ""
}
```

### 响应状态

| 状态码 | 说明 |
|-------|------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

### 响应参数

| 参数名称 | 参数说明 | 类型 |
|---------|---------|------|
| code | 响应码 | integer(int32) |
| data | 响应的数据 | 用户表 |
| message | 响应消息 | string |
| success | 逻辑是否成功 | boolean |

### 用户表数据结构

| 字段名 | 说明 | 类型 |
|-------|------|------|
| id | 主键 | integer(int32) |
| userName | 登录名 | string |
| name | 名称 | string |
| password | 密码 | string |
| phone | 手机号 | string |
| email | 邮箱 | string |
| avatarUrl | 头像 | string |
| manager | 用户类型 (1普通用户,2管理员) | string |
| state | 账户状态 | integer(int32) |
| token | token | string |
| customerId | 客户公司id | integer(int32) |
| organId | 用户归属网点id | integer(int32) |
| organIdList | 用户的网点 | array |
| areaIdList | 网点下的区域 | array |
| personalUser | 是否个体用户 默认否 | boolean |
| loginIp | 上一次登录ip | string |
| loginTime | 上一次登录时间 | string(date-time) |
| createTime | 创建时间 | string(date-time) |
| openid | openid | string |
| acceptMail | 是否接收邮件 | integer(int32) |
| acceptMailCode | 邮箱安全码 | string |
| acceptMailHost | 邮箱地址 | string |
| userQuota |  | integer |
| userQuotaAmount |  | integer |
| customer | 客户信息 | 客户对象 |

### 客户对象数据结构

| 字段名 | 说明 | 类型 |
|-------|------|------|
| id | 主键 | integer |
| customerName | 客户 | string |
| customerAddress | 公司地址 | string |
| screenName | 大屏名称 | string |
| centralScreenFlag | 中控屏入口标识 0-禁止 1-开放 默认0 | boolean |
| expiredTime | 过期时间 | string |
| createTime | 创建时间 | string |
| user | user用户 | 用户表 |

### 响应示例

```json
{
  "code": 0,
  "data": {
    "acceptMail": 0,
    "acceptMailCode": "",
    "acceptMailHost": "",
    "areaIdList": [],
    "avatarUrl": "",
    "createTime": "",
    "customer": {
      "centralScreenFlag": true,
      "createTime": "",
      "customerAddress": "",
      "customerName": "",
      "expiredTime": "",
      "id": 0,
      "screenName": "",
      "user": {}
    },
    "customerId": 0,
    "email": "",
    "id": 0,
    "loginIp": "",
    "loginTime": "",
    "manager": "",
    "name": "",
    "openid": "",
    "organId": 0,
    "organIdList": [],
    "password": "",
    "personalUser": true,
    "phone": "",
    "state": 0,
    "token": "",
    "userName": "",
    "userQuota": 0,
    "userQuotaAmount": 0
  },
  "message": "成功",
  "success": true
}
```

---

## 2. 获取客户公司列表（当前登录用户）

### 接口信息
- **接口地址**: `/shike3k/web/customer/getCustomerListByEmployeeId`
- **请求方式**: `GET`
- **请求数据类型**: `application/x-www-form-urlencoded`
- **响应数据类型**: `*/*`
- **接口描述**: 获取当前登录用户的客户公司列表

### 请求参数

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 |
|---------|---------|---------|---------|---------|
| token | token | header | true | string |

### 响应状态

| 状态码 | 说明 |
|-------|------|
| 200 | OK |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

### 响应参数

| 参数名称 | 参数说明 | 类型 |
|---------|---------|------|
| code | 响应码 | integer(int32) |
| data | 响应的数据 | array<客户> |
| message | 响应消息 | string |
| success | 逻辑是否成功 | boolean |

### 客户对象数据结构

| 字段名 | 说明 | 类型 |
|-------|------|------|
| id | 主键 | integer(int32) |
| customerName | 客户 | string |
| customerAddress | 公司地址 | string |
| screenName | 大屏名称 | string |
| centralScreenFlag | 中控屏入口标识 0-禁止 1-开放 默认0 | boolean |
| expiredTime | 过期时间 | string(date-time) |
| createTime | 创建时间 | string(date-time) |
| user | user用户 | 用户表 |

### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "centralScreenFlag": true,
      "createTime": "",
      "customerAddress": "",
      "customerName": "",
      "expiredTime": "",
      "id": 0,
      "screenName": "",
      "user": {}
    }
  ],
  "message": "成功",
  "success": true
}
```

---

## 3. 指定通道列表每日用电详情

### 接口信息
- **接口地址**: `/shake3k/user/deviceUseLog/getDeviceUseLogByTime`
- **请求方式**: `POST`
- **请求数据类型**: `application/json`
- **响应数据类型**: `*/*`
- **接口描述**: 获取指定通道列表的每日用电详情

### 请求参数

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 |
|---------|---------|---------|---------|---------|
| timeParam | 时间参数 | body | true | TimeParam |
| token | token | header | false | string |

### TimeParam 参数说明

| 参数名称 | 参数说明 | 是否必须 | 数据类型 |
|---------|---------|---------|---------|
| channelNum | 通道数 | false | integer(int32) |
| customerId | 客户公司id | false | integer(int32) |
| endDate | 结束日期 | false | string(date) |
| endTime | 结束时间 | false | string(date-time) |
| eventCodeList | 事件类型集合 | false | array<integer> |
| id | id | false | integer(int32) |
| ids | id集合 | false | array<integer> |
| layoutListId | 布局列表Id | false | integer(int32) |
| message | 字符串 | false | string |
| month | 月 | false | integer(int32) |
| organId | 网点id | false | integer(int32) |
| power | 额定功率 | false | integer(int32) |
| startDate | 开始日期 | false | string(date) |
| startPower | 开机功率 | false | integer(int32) |
| startTime | 开始时间 | false | string(date-time) |
| tableName | 表名 | false | string |
| timeRange | 时间范围：day=按日,week=按周,month=按月 | false | string |
| today | 是否包含当天 | false | boolean |
| year | 年 | false | integer(int32) |

### 请求示例

```json
{
  "channelNum": 0,
  "customerId": 0,
  "endDate": "",
  "endTime": "",
  "eventCodeList": [],
  "id": 0,
  "ids": [],
  "layoutListId": 0,
  "message": "",
  "month": 0,
  "organId": 0,
  "power": 0,
  "startDate": "",
  "startPower": 0,
  "startTime": "",
  "tableName": "",
  "timeRange": "",
  "today": true,
  "year": 0
}
```

### 响应状态

| 状态码 | 说明 |
|-------|------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

### 响应参数

| 参数名称 | 参数说明 | 类型 |
|---------|---------|------|
| code | 响应码 | integer(int32) |
| data | 响应的数据 | array<设备使用日志表> |
| message | 响应消息 | string |
| success | 逻辑是否成功 | boolean |

### 设备使用日志表数据结构

| 字段名 | 说明 | 类型 |
|-------|------|------|
| id | 主键 | integer(int32) |
| probeId | 设备id | integer(int32) |
| probeGuid | 设备guid | string |
| probeChannel |  | integer(int32) |
| probeChannelName |  | string |
| probeKindName | 探头类型 | string |
| areaName | 区域名称 | string |
| startTime | 充电开始时间 | string(date-time) |
| endTime | 充电结束时间 | string(date-time) |
| time | 当次使用时长(秒) | integer(int64) |
| todayOpen | 是否今天开启的 | integer(int32) |
| day |  | string(date) |
| sv | 电压 | integer(int32) |
| si | 电流 | integer(int32) |
| sp | 有功功率 | integer(int32) |
| sr | 功率因素 | integer(int32) |
| st | 温度 | integer(int32) |
| st1 | 扩展温度1 | integer(int32) |
| st2 | 扩展温度2 | integer(int32) |
| sh | 湿度 | integer(int32) |
| sl | 剩余电流 | integer(int32) |
| ss | 探头状态 | integer(int32) |
| sq | 累计用电量 | integer(int32) |
| sqv | 当次用电量 | integer(int64) |
| avgSv | 平均电压 | integer(int32) |
| avgSi | 平均电流 | integer(int32) |
| avgSp | 平均有功功率 | integer(int32) |
| avgSr | 平均功率因数 | integer(int32) |
| avgSt | 平均温度 | integer(int32) |
| maxSv | 最大电压 | integer(int32) |
| maxSi | 最大电流 | integer(int32) |
| maxSp | 最大有功功率 | integer(int32) |
| maxSr | 最大功率因数 | integer(int32) |
| maxSt | 最大温度 | integer(int32) |
| minSv | 最小电压 | integer(int32) |
| minSi | 最小电流 | integer(int32) |
| minSp | 最小有功功率 | integer(int32) |
| minSr | 最小功率因数 | integer(int32) |
| minSt | 最小温度 | integer(int32) |
| at | 空调类型 | integer(int32) |
| electricCharge | 电费 | string |
| timeRangePrice | 平谷峰尖电价 | string |
| eleCostRecord | 扣费信息 | string |
| elePaymentRecord | 缴费信息 | string |
| userId | 使用人-改通道id | integer(int32) |
| createTime | 创建时间 | string(date-time) |

### 响应示例

```json
{
  "code": 0,
  "data": [
    {
      "areaName": "",
      "at": 0,
      "avgSi": 0,
      "avgSp": 0,
      "avgSr": 0,
      "avgSt": 0,
      "avgSv": 0,
      "createTime": "",
      "day": "",
      "eleCostRecord": "",
      "elePaymentRecord": "",
      "electricCharge": "",
      "endTime": "",
      "id": 0,
      "maxSi": 0,
      "maxSp": 0,
      "maxSr": 0,
      "maxSt": 0,
      "maxSv": 0,
      "minSi": 0,
      "minSp": 0,
      "minSr": 0,
      "minSt": 0,
      "minSv": 0,
      "probeChannel": 0,
      "probeChannelName": "",
      "probeGuid": "",
      "probeId": 0,
      "probeKindName": "",
      "sh": 0,
      "si": 0,
      "sl": 0,
      "sp": 0,
      "sq": 0,
      "sqv": 0,
      "sr": 0,
      "ss": 0,
      "st": 0,
      "st1": 0,
      "st2": 0,
      "startTime": "",
      "sv": 0,
      "time": 0,
      "timeRangePrice": "",
      "todayOpen": 0,
      "userId": 0
    }
  ],
  "message": "成功",
  "success": true
}
```

---

## 通用响应格式

所有接口的响应都遵循以下格式：

```typescript
interface ApiResponse<T> {
  code: number        // 响应码，0表示成功
  data: T            // 响应数据
  message: string    // 响应消息
  success: boolean   // 逻辑是否成功
}
```

## 错误处理

- **401 Unauthorized**: Token无效或已过期，需要重新登录
- **403 Forbidden**: 没有权限访问该资源
- **404 Not Found**: 请求的资源不存在
- **500 Internal Server Error**: 服务器内部错误

## 注意事项

1. 所有需要认证的接口都需要在Header中传递`token`参数
2. 登录接口返回的`token`需要保存，用于后续接口调用
3. 日期格式统一使用 `YYYY-MM-DD` 格式
4. 时间格式统一使用 ISO 8601 格式（`YYYY-MM-DDTHH:mm:ss`）
5. 数组类型的参数需要以JSON数组格式传递



