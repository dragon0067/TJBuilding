// 后台数据接口服务
// 基于数据接口文档.pdf整理

// API基础URL（根据环境配置）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 通用响应格式
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}

// ==================== 用户相关接口 ====================

// 用户表数据结构
export interface User {
  id: number
  userName: string
  name: string
  password: string
  phone: string
  email: string
  avatarUrl: string
  manager: string // 用户类型 (1普通用户,2管理员)
  state: number // 账户状态
  token: string
  customerId: number
  organId: number
  organIdList: number[]
  areaIdList: number[]
  personalUser: boolean
  loginIp: string
  loginTime: string
  createTime: string
  openid: string
  acceptMail: number
  acceptMailCode: string
  acceptMailHost: string
  userQuota: number
  userQuotaAmount: number
  customer?: Customer
}

// 客户对象数据结构
export interface Customer {
  id: number
  customerName: string
  customerAddress: string
  screenName: string
  centralScreenFlag: boolean // 中控屏入口标识 0-禁止 1-开放 默认0
  expiredTime: string
  createTime: string
  user?: User
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

/**
 * 账号密码登录（不需要验证码）
 * 接口地址: /shake3k/user/entrance/loginByNameNotImgCode
 */
export async function login(params: LoginParams): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/shake3k/user/entrance/loginByNameNotImgCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<User> = await response.json()
    return data
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

/**
 * 获取客户公司列表（当前登录用户）
 * 接口地址: /shike3k/web/customer/getCustomerListByEmployeeId
 */
export async function getCustomerList(token: string): Promise<ApiResponse<Customer[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/shike3k/web/customer/getCustomerListByEmployeeId`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: token
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<Customer[]> = await response.json()
    return data
  } catch (error) {
    console.error('获取客户公司列表失败:', error)
    throw error
  }
}

// ==================== 设备使用日志相关接口 ====================

// 时间参数
export interface TimeParam {
  channelNum?: number // 通道数
  customerId?: number // 客户公司id
  endDate?: string // 结束日期 (YYYY-MM-DD)
  endTime?: string // 结束时间 (ISO 8601)
  eventCodeList?: number[] // 事件类型集合
  id?: number
  ids?: number[] // id集合
  layoutListId?: number // 布局列表Id
  message?: string
  month?: number // 月
  organId?: number // 网点id
  power?: number // 额定功率
  startDate?: string // 开始日期 (YYYY-MM-DD)
  startPower?: number // 开机功率
  startTime?: string // 开始时间 (ISO 8601)
  tableName?: string // 表名
  timeRange?: string // 时间范围：day=按日,week=按周,month=按月
  today?: boolean // 是否包含当天
  year?: number // 年
}

// 设备使用日志表数据结构
export interface DeviceUseLog {
  id: number
  probeId: number // 设备id
  probeGuid: string // 设备guid
  probeChannel: number
  probeChannelName: string
  probeKindName: string // 探头类型
  areaName: string // 区域名称
  startTime: string // 充电开始时间
  endTime: string // 充电结束时间
  time: number // 当次使用时长(秒)
  todayOpen: number // 是否今天开启的
  day: string
  sv: number // 电压
  si: number // 电流
  sp: number // 有功功率
  sr: number // 功率因素
  st: number // 温度
  st1: number // 扩展温度1
  st2: number // 扩展温度2
  sh: number // 湿度
  sl: number // 剩余电流
  ss: number // 探头状态
  sq: number // 累计用电量
  sqv: number // 当次用电量
  avgSv: number // 平均电压
  avgSi: number // 平均电流
  avgSp: number // 平均有功功率
  avgSr: number // 平均功率因数
  avgSt: number // 平均温度
  maxSv: number // 最大电压
  maxSi: number // 最大电流
  maxSp: number // 最大有功功率
  maxSr: number // 最大功率因数
  maxSt: number // 最大温度
  minSv: number // 最小电压
  minSi: number // 最小电流
  minSp: number // 最小有功功率
  minSr: number // 最小功率因数
  minSt: number // 最小温度
  at: number // 空调类型
  electricCharge: string // 电费
  timeRangePrice: string // 平谷峰尖电价
  eleCostRecord: string // 扣费信息
  elePaymentRecord: string // 缴费信息
  userId: number // 使用人-改通道id
  createTime: string // 创建时间
}

/**
 * 指定通道列表每日用电详情
 * 接口地址: /shake3k/user/deviceUseLog/getDeviceUseLogByTime
 */
export async function getDeviceUseLogByTime(
  timeParam: TimeParam,
  token?: string
): Promise<ApiResponse<DeviceUseLog[]>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.token = token
    }

    const response = await fetch(`${API_BASE_URL}/shake3k/user/deviceUseLog/getDeviceUseLogByTime`, {
      method: 'POST',
      headers,
      body: JSON.stringify(timeParam)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<DeviceUseLog[]> = await response.json()
    return data
  } catch (error) {
    console.error('获取设备使用日志失败:', error)
    throw error
  }
}

// ==================== Token管理 ====================

/**
 * 保存Token到本地存储
 */
export function saveToken(token: string): void {
  localStorage.setItem('api_token', token)
}

/**
 * 从本地存储获取Token
 */
export function getToken(): string | null {
  return localStorage.getItem('api_token')
}

/**
 * 清除Token
 */
export function clearToken(): void {
  localStorage.removeItem('api_token')
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return getToken() !== null
}



