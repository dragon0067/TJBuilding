let ApiUser2 = `/shike3k/user`;

module.exports = {
  //2022-5-19业主端新接口
  //登陆
  loginByName: ApiUser2 + "/entrance/loginByName",
  //获取登陆用户拥有菜单
  getUserMenu: ApiUser2 + "/menu/getUserMenu/",
  //获取服务器信息
  getServer: ApiUser2 + "/entrance/getServer/",
  //获取验证码
  getCaptcha: ApiUser2 + "/entrance/getCaptcha",

  //菜单相关
  //用户添加角色
  addUserRole: ApiUser2 + "/menu/createUserRole/",
  //获取用户角色下列表
  getUserRole: ApiUser2 + "/menu/getUserRole/",
  //移除用户角色
  deleteUserRole: ApiUser2 + "/menu/deleteUserRole/",
  //角色列表
  getroleList: ApiUser2 + "/menu/roleList",

  //员工相关
  //创建员工
  addUser: ApiUser2 + "/user/createUser",
  //客户公司员工列表
  getUserListByCustomerId: ApiUser2 + "/user/getUserListByCustomerId/",
  //编辑员工
  editUser: ApiUser2 + "/user/editUser/",
  //获取待审核的用户
  getUserListAudit: ApiUser2 + "/user/getUserListAudit",
  //删除
  deleteUser: ApiUser2 + "/user/deleteUser/",
  //获取客户公司下的网点
  //getOrganByCustomId: ApiUser2 + '/organ/getOrganByCustomId/',
  getOrganByCustomId: ApiUser2 + "/organ/getPcOrganByCustomId/",
  //获取网点下的区域
  getAreaTreeByOrganId: ApiUser2 + "/area/getAreaTreeByOrganId/",

  //网点
  //所有网点
  getAllOrgans: ApiUser2 + "/organ/getAllOrgans",
  //获取当前用户下的网点
  //getUserOrgan: ApiUser2 + '/organ/getUserOrganInfo/',
  getUserOrgan: ApiUser2 + "/organ/getPcUserOrganInfo/",
  //用户可管理的区域
  getAreaByUserId: ApiUser2 + "/area/getAreaByUserId/",
  //给用户分配网点
  userBindOrgan: ApiUser2 + "/organ/userBindOrgan/",
  //给用户移除网点
  userUnBindOrgan: ApiUser2 + "/organ/userUnBindOrgan/",

  //区域
  //获取当前用户下的网点
  getUserTarget: ApiUser2 + "/userTarget/getUserTarget/",
  //网点下用户未绑定的区域
  getAreaByOrganIdAndUserUnBind: ApiUser2 + "/area/getAreaByOrganIdAndUserUnBind/",
  //网点下的区域
  getAreaByOrganId: ApiUser2 + "/area/getAreaByOrganId/",
  //用户新增管理区域
  userBindTarget: ApiUser2 + "/userTarget/userBindTarget/",
  //编辑用户可管理的区域
  modifUserTarget: ApiUser2 + "/userTarget/modifUserTarget/",
  //获取电器类型列表
  getDictTargetCategoryList: ApiUser2 + "/dictTargetCategory/getDictTargetCategoryList",
  //用户解绑管理区域
  userUnBindTarget: ApiUser2 + "/userTarget/userUnBindTarget/",
  //用户解绑管理区域
  userUnBindTargetList: ApiUser2 + "/userTarget/userUnBindTargetList",
  //获取用户当前网点下可以管理得区域
  getUserAreaByorgan_Id: ApiUser2 + "/area/getUserAreaByOrganId/",

  //探头相关
  //探头列表
  getProbeChannelByAreaId: ApiUser2 + "/probe/getProbeChannelByAreaId/",
  //区域下的探头通道列表
  getProbeChannelInfoByAreaId: ApiUser2 + "/probe/getProbeChannelInfoByAreaId/",
  //改变开关状态
  requestProbeStateChange: ApiUser2 + "/probe/requestProbeStateChange",
  //编程接口(插座)
  setSocketProgram: ApiUser2 + "/probe/setSocketProgram/",
  //请求改变空调温度
  requestProbeAirChange: ApiUser2 + "/probe/requestProbeAirChange",
  //请求改变吊扇转速
  requestProbeFanChange: ApiUser2 + "/probe/requestProbeFanChange",
  //编程接口(风扇)
  setFanProgram: ApiUser2 + "/probe/setFanProgram/",
  //编程接口新协议(风扇)
  setDelayClose: ApiUser2 + "/probe/setDelayClose/",
  //请求门锁进入录入模式
  requestNetLockInput: ApiUser2 + "/probe/requestNetLockInput",
  //联网锁下的用户的密码列表
  getUserAuthList: ApiUser2 + "/probe/netLockUserAuthList/",
  //联网锁下的用户列表
  getLockUserList: ApiUser2 + "/probe/netLockUserList/",
  //门锁绑定用户
  requestNetLockBindUser: ApiUser2 + "/probe/requestNetLockBindUser/",
  //门锁解绑用户
  requestNetLockUnBindUser: ApiUser2 + "/probe/requestNetLockUnBindUser/",
  //联网锁下的用户的密码列表
  getnetLockUserAuthList: ApiUser2 + "/probe/netLockUserAuthList/",
  //获取联网锁管理员密码
  getLockAdminPwd: ApiUser2 + "/probe/getLockAdminPwd/",
  //编程接口(联网锁下发卡密)
  setNetLockProgram: ApiUser2 + "/probe/requestNetLockPassWord",
  //请求门锁开锁
  requestNetLockOpen: ApiUser2 + "/probe/requestNetLockOpen",
  //获取门锁事件
  getNetLockEvent: ApiUser2 + "/probe/getNetLockEvent/",
  //门锁下发卡密(重发)
  requestResendNetLockPassWord: ApiUser2 + "/probe/requestResendNetLockPassWord/",
  //编程接口(删除卡密)
  deleteNetLockCardProgram: ApiUser2 + "/probe/deleteNetLockCardProgram/",
  //请求探头数据(含探头状态,数据,兼容采集数据,指令下发)
  getProbeState: ApiUser2 + "/probe/getProbeState/",
  //请求探头数据(返回数据,一般采集数据后调用此接口)
  getProbeSensorData: ApiUser2 + "/probe/getProbeSensorData/",
  //请求探头数据(返回数据,一般采集数据后调用此接口)
  getProbeRealStateByDs: ApiUser2 + "/probe/getProbeRealStateByDs/",
  //控制记录
  getProbeControlRecord: ApiUser2 + "/probe/getProbeControlRecord/",
  //电器上报记录
  getProbeReportRecord: ApiUser2 + "/probe/getProbeReportRecord/",
  //获取探头近7天的用电量
  getProbeElectricityById: ApiUser2 + "/probe/getProbeElectricityById/",
  //获取探头近7天的用电量
  getProbeSensorDataList: ApiUser2 + "/probe/getProbeSensorDataList/",
  //获取充电桩事件
  getProbeBatteryEventByProbeId: ApiUser2 + "/probe/getProbeBatteryEventByProbeId/",
  //空调品牌列表
  airList: ApiUser2 + "/air/airList",
  //空调品牌控制码列表
  airCodeList: ApiUser2 + "/air/airCodeList/",
  //读取空调的控制码(通道id 返回sn)
  getAirControlCode: ApiUser2 + "/probe/getAirControlCode/",
  //获取请求学习探头结果
  getProbeLearningResult: ApiUser2 + "/dsCallback/getProbeLearningResult/",
  //设备(空调)的控制码
  setProbeControlCode: ApiUser2 + "/probe/setProbeControlCode/",
  //三相导轨开关透传编程设置
  setThreePhaseRailSwitchProgram: ApiUser2 + "/probe/setThreePhaseRailSwitchProgram/",
  //获取三相导轨开关透传编程设置
  getChannelByProbeIdAndChannel: ApiUser2 + "/probe/getChannelByProbeIdAndChannel/",

  //定时任务 控制策略
  //创建任务
  addJob: ApiUser2 + "/quartz/createJob",
  //删除一个任务
  deleteJob: ApiUser2 + "/quartz/deleteJob/",
  //修改一个任务
  modifJob: ApiUser2 + "/quartz/modifyJob/",
  //网点下的控制策略
  getQuartzJobByOrganId: ApiUser2 + "/quartz/getQuartzJobByOrganId/",
  //更新job是否暂停(1-暂停,0-启用)
  updateJobIsPause: ApiUser2 + "/quartz/updateJobIsPause/",

  //获取包含策略的策略组
  getGroupByJob: ApiUser2 + "/quartzGroup/getGroupByJob/",
  //控制策略绑定分组
  bindJobGroup: ApiUser2 + "/quartzGroup/bindJobGroup/",
  //策略解绑分组
  removeGroupAndJob: ApiUser2 + "/quartzGroup/removeGroupAndJob/",
  //获取用户当前网点下可以管理得区域树形结构
  getUserAreaTreeByOrganId: ApiUser2 + "/area/getUserAreaTreeByOrganId/",

  //用户端控制策略组管理
  //获取控制策略组
  getQuartzGroup: ApiUser2 + "/quartzGroup/getGroupByOrganId/",
  //根据网点id和分组类型获取网点下的控制策略组
  getGroupByOrganIdAndType: ApiUser2 + "/quartzGroup/getGroupByOrganIdAndType/",
  //创建一个控制策略组
  createQuartzGroup: ApiUser2 + "/quartzGroup/createGroup",
  //删除一个控制策略组
  deleteQuartzGroup: ApiUser2 + "/quartzGroup/deleteGroup/",
  //修改一个控制策略组
  modifyQuartzGroup: ApiUser2 + "/quartzGroup/modifyGroup/",
  //绑定控制策略组和多个通道
  bindGroupChannel: ApiUser2 + "/quartzGroup/bindGroupChannel/",
  //解绑策略组和探头
  removeGroupAndProbeChannel: ApiUser2 + "/quartzGroup/removeGroupAndProbeChannel/",
  //获取策略组下的通道
  getChannelByGroup: ApiUser2 + "/quartzGroup/getChannelByGroup/",

  //启动网点下的控制策略
  startJobByOrganId: ApiUser2 + "/quartz/startJobByOrganId/",

  //暂停网点下的控制策略
  pauseJobByOrganId: ApiUser2 + "/quartz/pauseJobByOrganId/",

  //websocket
  websocket: "/shike3k/api/user/pushMessage/",

  //导出用电信息
  //导出网点用电信息
  exportEleByOrganId: ApiUser2 + "/export/exportEleByOrgan",
  //导出区域用电信息
  exportEleByArea: ApiUser2 + "/export/exportEleByArea",

  //用户配额
  //设置用户配额
  addUserQuota: ApiUser2 + "/UserQuota/addUserQuota",
  //获取用户配额
  getUserQuotaByUserId: ApiUser2 + "/UserQuota/getUserQuotaByUserId",

  // 用户视图
  // 获取用户创建的视图
  getObserveList: ApiUser2 + "/userView/getList",
  // 创建视图
  createObserve: ApiUser2 + "/userView/create",
  // 修改视图
  updateObserve: ApiUser2 + "/userView/update",
  // 删除视图
  deleteObserve: ApiUser2 + "/userView/delete/",
  // 获取用户管理的区域
  getUserTargetArea: ApiUser2 + "/userView/getUserTargetArea",
  // 获取视图下的区域
  getViewHasAreaIds: ApiUser2 + "/userView/getViewHasAreaIds/",

  //充电桩视图
  //当前用户可控制的网点
  getOrganList: ApiUser2 + "/battery/organList/",
  //充电桩列表
  getBatteryList: ApiUser2 + "/battery/batteryList/",
  //充电桩日记
  getBatteryLogList: ApiUser2 + "/battery/batteryLogList/",
  //充电桩日统计
  getBatteryProbeDay: ApiUser2 + "/battery/batteryProbeDay/",
  //充电桩周统计
  getBatteryProbeWeek: ApiUser2 + "/battery/batteryProbeWeek/",
  //充电桩月统计
  getBatteryProbeMonth: ApiUser2 + "/battery/batteryProbeMonth/",
  //充电桩年统计
  getBatteryProbeYear: ApiUser2 + "/battery/batteryProbeYear/",
  //充电桩总统计
  getBatteryProbeTotal: ApiUser2 + "/battery/batteryProbeTotal/",
  //充电桩概览
  getBatteryProbeViews: ApiUser2 + "/battery/batteryProbeViews/",

  //用户日统计
  getBatteryUserDay: ApiUser2 + "/battery/batteryUserDay/",
  //用户周统计
  getBatteryUserWeek: ApiUser2 + "/battery/batteryUserWeek/",
  //用户月统计
  getBatteryUserMonth: ApiUser2 + "/battery/batteryUserMonth/",
  //用户年统计
  getBatteryUserYear: ApiUser2 + "/battery/batteryUserYear/",
  //用户总统计
  getBatteryUserTotal: ApiUser2 + "/battery/batteryUserTotal/",
  //用户概览
  getBatteryUserViews: ApiUser2 + "/battery/batteryUserViews/",

  //充电桩总用电量,总时长
  getBatteryProbeStatistics: ApiUser2 + "/battery/batteryProbeStatistics/",
  //充电桩当天用电量,总时长
  getBatteryProbeTimeStatistics: ApiUser2 + "/battery/batteryProbeTimeStatistics/",
  //单个充电桩使用日志列表
  getBatteryLogByProbeId: ApiUser2 + "/battery/batteryLogByProbeId/",
  //单个充电桩使用日志列表
  getBatteryAllProbeViews: ApiUser2 + "/battery/batteryAllProbeViews/",
  //充电日志(时间+用户id)
  getBatteryLogByTimeAndUserId: ApiUser2 + "/battery/batteryLogByTimeAndUserId/",
  //充电日志(时间+探头id)
  getBatteryLogByTimeAndProbeId: ApiUser2 + "/battery/batteryLogByTimeAndProbeId/",

  //工位视图2022-7-29
  //获取视图区域基本信息
  getViewAreaIndexInfo: ApiUser2 + "/userViewData/getViewAreaIndexInfo/",
  //获取区域top排名数据的接口
  getUserViewData: ApiUser2 + "/userViewData/getViewAreaTopInfo",
  //获取用电量
  getSqv: ApiUser2 + "/userViewData/getViewPeriodSqv/",
  //获取用电量
  getViewSqvInfo: ApiUser2 + "/userViewData/getViewSqvInfo/",
  //获取视图底部统计数据
  getViewBottomData: ApiUser2 + "/userViewData/getViewBottomData/",

  //日历设置
  //工作日历表获得日期
  getcalendar: ApiUser2 + "/calendar/getCalendar/",
  //工作日历表提交日期
  modifycalendar: ApiUser2 + "/calendar/modifyCalendar",

  //工作规则

  //工作时段-新建规则
  addWorkingRule: ApiUser2 + "/workingRule/add",
  //工作时段-编辑规则
  modifyWorkingRule: ApiUser2 + "workingRule/modify",
  //工作时段-查询规则分页
  queryWorkingRule: ApiUser2 + "/workingRule/query/",
  //删除时段-查询规则分页
  DeleteWorkingRule: ApiUser2 + "/workingRule/delete/",
  //获取规则下设备
  queryRulehasDevice: ApiUser2 + "/workingRule/queryRuleHasDevice/",
  //规则 网点查区域
  queryArea: ApiUser2 + "/workingRule/queryArea/",
  //规则 添加设备
  addDevicetorule: ApiUser2 + "/workingRule/addDeviceToRule/",

  //设备 有规则的设备
  queryHasruledevice: ApiUser2 + "/workingRule/queryHasRuleDevice/",
  //查询设备已配置的规则
  queryDevicehasrule: ApiUser2 + "/workingRule/queryDeviceHasRule/",
  //查询设备可配置的规则
  queryDevicenothasrule: ApiUser2 + "/workingRule/queryDeviceNotHasRule/",
  //添加规则到指定设备
  addRuletodevice: ApiUser2 + "/workingRule/addRuleToDevice/",
  //规则 删除规则下设备
  deletedevicehasrule: ApiUser2 + "/workingRule/deleteDeviceHasRule/",

  //获取客户查看可用的工作日类型列表
  getCustomerAvailableList: ApiUser2 + "/dayType/getCustomerAvailableList",
  //客户添加工作日类型
  addByCustomer: ApiUser2 + "/dayType/addByCustomer",
  //客户删除工作日类型
  deleteByCustomer: ApiUser2 + "/dayType/deleteByCustomer/",
  //客户修改工作日类型
  modifyByCustomer: ApiUser2 + "/dayType/modifyByCustomer",
  //获取所有节假日
  getHoliDayByYear: ApiUser2 + "/v3.2/electricity/holiday/holiday_by_year/get",

  //获取配额日志byid
  getUserQuotaLogById: ApiUser2 + "/UserQuota/getUserQuotaLogByUserId/",

  //查询网点下的工作时段
  getOrganWorkingTime: ApiUser2 + "/OrganWorkingTimeController/getOrganWorkingTime/",
  //保存网点工作时段
  addOrganWorkingTime: ApiUser2 + "/OrganWorkingTimeController/addOrganWorkingTime/",

  //用户分组
  //网点下的用户分组List
  usergroupList: ApiUser2 + "/userGroup/groupList/",
  //创建用户分组
  createUserGroup: ApiUser2 + "/userGroup/createGroup",
  //编辑用户组
  modifyUserGroup: ApiUser2 + "/userGroup/modifyGroup/",
  //删除用户组
  deleteUserGroup: ApiUser2 + "/userGroup/deleteGroup/",

  //用户组下的用户
  groupUserList: ApiUser2 + "/userGroup/groupUserList/",
  //将用户添加到用户组
  addUserToGroup: ApiUser2 + "/userGroup/addUserToGroup",
  //将用户添加到用户组(批量)
  addUserToGroupBatch: ApiUser2 + "/userGroup/addUserToGroupBatch",
  //将用户移除用户组
  delUserFromGroup: ApiUser2 + "/userGroup/delUserFromGroup/",
  //将用户移除用户组(批量)
  delUserFromGroupBatch: ApiUser2 + "/userGroup/delUserFromGroupBatch",

  //用户组可管理的区域List
  groupTargetList: ApiUser2 + "/userGroup/groupTargetList/",
  //用户组添加可管理的区域
  addGroupTarget: ApiUser2 + "/userGroup/addGroupTarget",
  //用户组删除可管理的区域
  delGroupTarget: ApiUser2 + "/userGroup/delGroupTarget/",
  //用户组添加可管理的区域(批量)
  addGroupTargetBatch: ApiUser2 + "/userGroup/addGroupTargetBatch",
  //用户组删除可管理的区域(批量)
  delGroupTargetBatch: ApiUser2 + "/userGroup/delGroupTargetBatch",
  //用户组未绑定的区域
  getGroupTargetUnBind: ApiUser2 + "/userGroup/getGroupTargetUnBind/",

  //报表文件
  getExcel: ApiUser2 + "/report/reportTask/",

  //跨区用户
  //通过用户名获取唯一用户(过滤相同公司)
  getDifferentCompanyUserByName: ApiUser2 + "/user/getDifferentCompanyUserByName/",
  //保存被分享的用户及分享的公司信息，以及用户与网点区域的关系
  saveOrganShareRecordWithUserTarget: ApiUser2 + "/organShareRecord/saveOrganShareRecordWithUserTarget/",
  //获取登录用户对应的公司跨网点分配地区记录
  getOrganShareRecordList: ApiUser2 + "/organShareRecord/getOrganShareRecordList",
  //删除指定用户区域分享信息及用户关联地区数据
  deleteOrganShareRecordByUserId: ApiUser2 + "/organShareRecord/deleteOrganShareRecordByUserId/",
  //通过用户id和公司id获取用户管理区域
  getUserTargetByUserIdAndCustomerId: ApiUser2 + "/userTarget/getUserTargetByUserIdAndCustomerId/",
  //获取指定用户指定网点下未选择的区域树形结构
  getUnselectedAreaTreeByOrganId: ApiUser2 + "/area/getUnselectedAreaTreeByOrganId/",

  getSharedUserOrganInfo: ApiUser2 + "/organ/getSharedUserOrganInfo/",
  //nb编程设置
  nbConfig: ApiUser2 + "/probe/nbConfig/",

  //报表
  //获取网点下的推送人员
  getOrganReportTaskUserList: ApiUser2 + "/report/getOrganReportTaskUserList/",
  //添加网点下的推送人员
  setOrganReportTaskUserList: ApiUser2 + "/report/setOrganReportTaskUserList",
  //更新网点信息
  upDataOrgan: ApiUser2 + "/organ/upDataOrgan/",
  //删除网点下的推送人员
  deleteReportTaskUser: ApiUser2 + "/report/deleteReportTaskUser",
  //文件列表
  getFileList: ApiUser2 + "/report/getFileList/",
  //文件下载
  getFile: ApiUser2 + "/report/getFile/",
  //按网点导出报表(按月)
  getReportByOrganIdByMonth: ApiUser2 + "/report/getReportByOrganIdByMonth",
  //导出设备和6100用电量
  getExportProbeAnd6100Ele: ApiUser2 + "/export/exportProbeAnd6100Ele",
  //导出NB用电量
  getExportOrganNbProbeEle: ApiUser2 + "/export/exportOrganNbProbeEle",

  //指令列表
  getactionList: ApiUser2 + "/action/actionList/",

  //创建指令
  createAction: ApiUser2 + "/action/createAction",
  //删除指令
  deleteAction: ApiUser2 + "/action/deleteAction/",
  //修改指令
  modifyAction: ApiUser2 + "/action/modifyAction/",
  //指令下的设备
  actionChannelList: ApiUser2 + "/action/actionChannelList/",
  //给指令添加设备
  actionAddChannel: ApiUser2 + "/action/actionAddChannel/",
  //给指令删除设备
  actionDelChannel: ApiUser2 + "/action/actionDelChannel/",
  //网点下的通道
  getProbeChannelByOrganId: ApiUser2 + "/probe/getProbeChannelByOrganId/",
  //执行指令
  exeAction: ApiUser2 + "/action/exeAction/",
  //根据用户id获取绑定的指令
  getAcitonListByUserId: ApiUser2 + "/action/getAcitonListByUserId/",
  //根据指令id获取绑定的用户
  getListByActionId: ApiUser2 + "/action/getListByActionId/",
  //绑定指令和用户
  bindActionUserTarget: ApiUser2 + "/action/bindActionUserTarget/",
  //解绑指令和用户关系
  removeByUserIdListAndActionId: ApiUser2 + "/action/removeByUserIdListAndActionId/",

  //设置空调的最低制冷温度(可批量)
  setProbeAirMaxTemp: ApiUser2 + "/probe/setProbeAirMaxTemp",
  //修改空调的最高温和最低温
  setProbeChannelTemp: ApiUser2 + "/probe/setProbeChannelTemp",

  //获取网点下设备上报日志
  getProbeReportDataByOrganId: ApiUser2 + "/probeReportData/getProbeReportDataByOrganId/",
  //获取区域下设备上报日志
  getProbeReportDataByAreaId: ApiUser2 + "/probeReportData/getProbeReportDataByAreaId",

  //网点下的设备组
  getProbeGroupList: ApiUser2 + "/probeGroup/getGroupList/",
  //创建设备组
  createProbeGroup: ApiUser2 + "/probeGroup/createGroup",
  //删除设备组
  deleteProbeGroup: ApiUser2 + "/probeGroup/deleteGroup/",
  //编辑设备组
  modifyProbeGroup: ApiUser2 + "/probeGroup/modifyGroup/",
  //网点下的设备组
  getgroupProbeList: ApiUser2 + "/probeGroup/groupProbeList/",
  //组添加设备
  ProbeGroupAddProbe: ApiUser2 + "/probeGroup/groupAddProbe/",
  //组删除设备
  ProbeGroupDelProbe: ApiUser2 + "/probeGroup/groupDelProbe",
  //网点下的设备
  getProbeListByOrganId: ApiUser2 + "/probe/getProbeListByOrganId/",
  //获取系统配置(SYSTEM_USER_NAME 是user端内屏标题)
  getVersion: ApiUser2 + "/setting/getValue/",
  //获取系统配置(SYSTEM_USER_NAME 是user端内屏标题)
  updateCustomer: ApiUser2 + "/setting/updateCustomer",
  //获取系统配置(SYSTEM_USER_NAME 是user端内屏标题)
  getCustomerById: ApiUser2 + "/setting/getCustomerById/",

  //通道定时任务
  //获取通道定时任务
  getProbeChannelTask: ApiUser2 + "/probeTask/getProbeChannelTask/",
  //创建通道定时任务
  createProbeChannelTask: ApiUser2 + "/probeTask/createProbeChannelTask",
  //删除通道定时任务
  deleteProbeChannelTask: ApiUser2 + "/probeTask/deleteProbeChannelTask/",
  //修改通道定时任务
  modifyProbeChannelTask: ApiUser2 + "/probeTask/modifyProbeChannelTask/",

  //开始网点下设备定时任务
  startTaskByOrganId: ApiUser2 + "/probeTask/startTaskByOrganId/",
  //暂定网点下设备定时任务
  pauseTaskByOrganId: ApiUser2 + "/probeTask/pauseTaskByOrganId/",

  //获取大屏中间数据
  getCentralData: ApiUser2 + "/dataScreen/getCentralData/",
  //获取设备总数
  getProbeTotal: ApiUser2 + "/dataScreen/getProbeTotal/",
  //获取设备操作次数
  getOperationTotal: ApiUser2 + "/dataScreen/getOperationTotal/",
  //获取用水量统计
  getWaterTotal: ApiUser2 + "/dataScreen/getWaterTotal/",
  //获取总用电周月年
  getEleAll: ApiUser2 + "/dataScreen/getEleAll/",
  //获取用电周月年(按天)
  getEleAllByDay: ApiUser2 + "/dataScreen/getEleAllByDay/",
  //获取用水量统计总和
  getWaterTotalAll: ApiUser2 + "/dataScreen/getWaterTotalAll/",
  //获取非工作时间的用电量
  getNotWorkTimeEle: ApiUser2 + "/dataScreen/getNotWorkTimeEle/",
  //获取指定日期内的工作时间的用电量
  getWorkTimeEleByDate: ApiUser2 + "/dataScreen/getWorkTimeEleByDate/",
  //获取环境温度
  getAmbientTemperature: ApiUser2 + "/dataScreen/getAmbientTemperature/",
  //获取用水量统计排行(昨天的用水量)
  getWaterTotalRanking: ApiUser2 + "/dataScreen/getWaterTotalRanking/",
  //获取当日设备告警统计信息(昨天的用水量)
  getcalcAlarmEventCount: ApiUser2 + "/dataScreen/calcAlarmEventCount/",

  //大屏分屏
  //通过分组id获取绑定的用户信息
  getBindUserListByGroupId: ApiUser2 + "/group/getBindUserListByGroupId/",
  //绑定用户和控制分组
  bindUserQuartzGroupTarget: ApiUser2 + "/group/bindUserQuartzGroupTarget/",
  //解绑用户和控制分组
  unBindUserQuartzGroupTarget: ApiUser2 + "/group/unBindUserQuartzGroupTarget/",
  //用户id和分组id获取分组下的布局(参数可为空)
  getGroupLayoutsByUserIdAndGroupId: ApiUser2 + "/group/getGroupLayoutsByUserIdAndGroupId",
  //通过用户id和控制分组ID获取绑定关系
  getUserQuartzGroupTargetByUserIdAndGroupId: ApiUser2 + "/group/getUserQuartzGroupTargetByUserIdAndGroupId/",
  //更新用户和控制分组绑定信息
  updateUserQuartzGroupTarget: ApiUser2 + "/group/updateUserQuartzGroupTargetLayoutId",

  //用电
  getAlarmSensor: ApiUser2 + "/totalEle/getAlarmDataByEvenId/",
  //获取用电量统计数据
  getElectricQuantity: ApiUser2 + "/totalEle/getElectricQuantity/",
  //获取主机信息
  getHostInfo: ApiUser2 + "/totalEle/getHostInfo/",

  //场景联动相关
  //分组设备
  //通过网点id获取设备组
  getsceneGroupList: ApiUser2 + "/scene/sceneGroupList/",
  //设备组下的设备
  sceneGroupDetailList: ApiUser2 + "/scene/sceneGroupDetailList/",
  //创建设备组
  createSceneGroup: ApiUser2 + "/scene/createSceneGroup",
  //编辑设备组
  editSceneGroup: ApiUser2 + "/scene/editSceneGroup/",
  //删除设备组
  delSceneGroup: ApiUser2 + "/scene/delSceneGroup/",
  //设备组添加设备
  createSceneGroupDetail: ApiUser2 + "/scene/createSceneGroupDetail",
  //设备组批量添加设备
  createSceneGroupDetailBatch: ApiUser2 + "/scene/createSceneGroupDetailBatch",
  //设备组移除设备批量
  delSceneGroupDetailBatch: ApiUser2 + "/scene/delSceneGroupDetailBatch",

  //场景
  //通过网点id获取场景列表
  getsceneList: ApiUser2 + "/scene/sceneList/",
  //创建场景
  createScene: ApiUser2 + "/scene/createScene",
  //编辑场景
  editScene: ApiUser2 + "/scene/editScene/",
  //删除场景
  delScene: ApiUser2 + "/scene/delScene/",
  //场景绑定设备组
  sceneBindGroup: ApiUser2 + "/scene/sceneBindGroup",

  //场景下的触发设备
  sceneTrigger: ApiUser2 + "/scene/sceneTrigger/",
  //添加场景下的触发设备
  addSceneTrigger: ApiUser2 + "/scene/addSceneTrigger",
  //修改场景下的触发设备
  editSceneTrigger: ApiUser2 + "/scene/editSceneTrigger/",
  //删除场景下的触发设备
  delSceneTrigger: ApiUser2 + "/scene/delSceneTrigger/",

  //场景下的目标设备
  sceneTarget: ApiUser2 + "/scene/sceneTarget/",
  //添加场景下的目标设备
  addSceneTarget: ApiUser2 + "/scene/addSceneTarget",
  //修改场景下的目标设备
  editSceneTarget: ApiUser2 + "/scene/editSceneTarget/",
  //删除场景下的目标设备
  delSceneTarget: ApiUser2 + "/scene/delSceneTarget/",
  //复制场景
  sceneCopy: ApiUser2 + "/scene/sceneCopy/",
  //通过场景id获取场景联动记录
  getSceneLinkageRecordBySceneId: ApiUser2 + "/probe/getSceneLinkageRecordBySceneId/",
  //通过通道id获取场景联动记录
  getSceneLinkageRecordByChannelId: ApiUser2 + "/probe/getSceneLinkageRecordByChannelId/",

  //触发设备校验
  triggerDeviceVerification: ApiUser2 + "/scene/triggerDeviceVerification",

  //导出网点下场景联动记录报表
  exportSceneLinkageRecordByOrganId: ApiUser2 + "/scene/exportSceneLinkageRecordByOrganId/",
  //场景联动记录报表
  exportSceneLinkageRecord: ApiUser2 + "/scene/exportSceneLinkageRecord",

  //获取系统更新日志列表
  getSystemUpdateLogList: ApiUser2 + "/log/getSystemUpdateLogList",

  //绑定网点关联推送微信设备告警的用户
  addOrganWechatTarget: ApiUser2 + "/organ/addOrganWechatTarget/",
  //获取指定网点下推送微信设备告警的用户列表
  getUserListWithOrganWechatTarget: ApiUser2 + "/organ/getUserListWithOrganWechatTarget/",
  //解绑网点关联推送微信设备告警的用户
  removeOrganWechatTarget: ApiUser2 + "/organ/removeOrganWechatTarget/",
  //更新网点关联推送微信设备告警的用户关系
  updateOrganWechatTarget: ApiUser2 + "/organ/updateOrganWechatTarget/",
  //获取(刷新)设备最新状态(按区域)
  getProbeRealState: ApiUser2 + "/probe/getProbeRealState/",
  //透传设备编程设置
  setTransmissionProbeProgram: ApiUser2 + "/probe/setTransmissionProbeProgram/",

  // 获取设备组环境温度
  getProbeGroupAmbientTemperature: ApiUser2 + "/dataScreen/getProbeGroupAmbientTemperature/",
  //  获取大屏中间数据
  getProbeGroupCentralData: ApiUser2 + "/dataScreen/getProbeGroupCentralData/",
  //  获取设备组下各类型设备日、月用电量
  getProbeGroupDayAndMonthTotalEle: ApiUser2 + "/dataScreen/getProbeGroupDayAndMonthTotalEle/",
  //  获取设备组下设备类型每日用电量
  getProbeGroupDayEleWithProbeType: ApiUser2 + "/dataScreen/getProbeGroupDayEleWithProbeType/",
  //  获取设备组总用电周月年
  getProbeGroupEleAll: ApiUser2 + "/dataScreen/getProbeGroupEleAll/",

  //获取指定日期设备组总用电周月年
  getProbeGroupEleAllByDate: ApiUser2 + "/dataScreen/getProbeGroupEleAllByDate/",

  //  获取指定设备类型用电量数据
  getProbeGroupEleInfoByMoldCode: ApiUser2 + "/dataScreen/getProbeGroupEleInfoByMoldCode/",
  //  获取设备组非工作时间的用电量
  getProbeGroupNotWorkTimeEle: ApiUser2 + "/dataScreen/getProbeGroupNotWorkTimeEle/",
  //  获取分组设备总数
  getProbeGroupTotal: ApiUser2 + "/dataScreen/getProbeGroupTotal/",

  //获取6100数据
  getSk6100Data: ApiUser2 + "/sk6100/getSk6100Data/",
  //注册
  register: ApiUser2 + "/sk6100/register/",
  //未注册的主机
  getUnNameList: ApiUser2 + "/sk6100/getUnNameList",

  //烟感指令下发
  setSmokeDetectionAction: ApiUser2 + "	/probe/setSmokeDetectionAction",
  // 获取事件列表
  getXMLEventList: ApiUser2 + "	/transmissionInfo/getXMLEventList",

  //
  getSk6100ParseData: ApiUser2 + "/sk6100/getSk6100ParseData/",
  //  获取透传6100数据曲线
  getHost6100DataCurve: ApiUser2 + "/probeSensorData/getHost6100DataCurve/",
  //  获取用户可查看区域下透传6100C设备列表
  getEle6100TerminalList: ApiUser2 + "/probe/getEle6100TerminalList",
  //  获取透传6100C用电量统计数据(右边)
  getPowerStatistic: ApiUser2 + "/probeSensorData/getPowerStatistic/",
  // 获取透传6100C多设备累计用电量统计数据(左边)
  getMultipleElectricQuantity: ApiUser2 + "/probeSensorData/getMultipleElectricQuantity/",
  //  获取透传6100C用电量统计数据(左边)
  getElectricQuantitySenso: ApiUser2 + "/probeSensorData/getElectricQuantity/",

  // 获取透传6100C扩展温度曲线数据
  queryTemperatureData: ApiUser2 + "/probeSensorData/queryTemperatureData/",

  // 获取温度分组
  getTemperatureGroup: ApiUser2 + "/transmissionTemperatureGroup/getTransmissionTemperatureGroup/",
  // 获取扩展温度分组详情
  getTemperatureGroupDetail: ApiUser2 + "/transmissionTemperatureGroup/getTransmissionTemperatureGroupDetailByGroupId/",

  // 获取扩展温度分组详情
  getAvailableTemperatureProbe: ApiUser2 + "/sensorData/getAvailableTemperatureProbe/",
  // 添加扩展温度分组线路
  addTemperatureGroup: ApiUser2 + "/transmissionTemperatureGroup/addTransmissionTemperatureGroup",
  // 修改扩展温度分组组名
  modifyTemperatureGroupName: ApiUser2 + "/transmissionTemperatureGroup/updateTransmissionTemperatureGroup",

  // 删除温度分组
  deleteTemperatureGroup: ApiUser2 + "/transmissionTemperatureGroup/removeGroupByIdList",

  //  获取所有的扩展温度分组探头
  getAllTemperatureRealData: ApiUser2 + "/sensorData/getAllTemperatureProbe/",

  //  添加扩展温度分组线路
  addTemperatureGroupDetail: ApiUser2 + "/transmissionTemperatureGroup/addTransmissionTemperatureGroupDetail",
  //  移除扩展温度分组线路
  deleteTemperatureGroupDetail: ApiUser2 + "/transmissionTemperatureGroup/removeGroupDetailByIdList",

  // 登录记录
  getLoginRecordList: ApiUser2 + "/user/getLoginRecordList",

  //  按设备类型导出设备和指定6100用电量
  exportProbeAnd6100EleByProbeType: ApiUser2 + "/export/exportProbeAnd6100EleByProbeType",

  // 获取网点下的的host6100主机
  getHost6100ByOrganId: ApiUser2 + "/host6100/getHost6100ByOrganId/",

  // 6100C编程设置
  setEle6100CTerminalProgram: ApiUser2 + "/probe/setEle6100CTerminalProgram/",

  // 微波上报记录
  getDetectionRecordList: ApiUser2 + "/probe/getDetectionRecordList/",

  // 获取分组平谷峰尖时间范围价格信息
  getGroupTimeRangePriceByGroupId: ApiUser2 + "/screen/getGroupTimeRangePriceByGroupId/",
  // 添加分组平谷峰尖时间范围价格信息
  addGroupTimeRangePrice: ApiUser2 + "/screen/addGroupTimeRangePrice",
  // 修改分组平谷峰尖时间范围价格信息
  updateGroupTimeRangePrice: ApiUser2 + "/screen/updateGroupTimeRangePrice",
  // 更新通道额定功率和开机功率
  updateChannelStartPower: ApiUser2 + "/probe/updateChannelStartPower",

  // 根据分组id获取能耗管控统计数据
  getEnergyControlData: ApiUser2 + "/screen/getEnergyControlData/",

  // 根据分组id获取能耗管控统计数据根据时间
  getEnergyControlDataByTime: ApiUser2 + "/screen/getEnergyControlDataByTime/",

  //获取指定区域下推送微信设备告警的用户列表
  getUserListWithAreaWechatTarget: ApiUser2 + "	/area/getUserListWithAreaWechatTarget/",
  //解绑区域关联推送微信设备告警的用户
  removeAreaWechatTarget: ApiUser2 + "	/area/removeAreaWechatTarget",
  //绑定区域关联推送微信设备告警的用户
  addAreaWechatTargetList: ApiUser2 + "	/area/addAreaWechatTargetList/",
  //获取指定用户推送微信设备告警的区域列表
  getAreaListWithAreaWechatTarget: ApiUser2 + "	/area/getAreaListWithAreaWechatTarget/",
  // 获取设备传感器数据按时间 参数1:probeId 参数2:time(2022-11-07) 格式json
  getProbeSensorDataByTime: ApiUser2 + "/probeSensorData/getProbeSensorDataByTime",
  // 获取设备传感器数据按时间
  getProbeSensorDataByTimeRange: ApiUser2 + "/probeSensorData/getProbeSensorDataByTimeRange",
  // 获取三相导轨开关数据按时间 参数1:probeId 参数2:time(2022-11-07)
  getThreePhaseRailSwitchDataByTime: ApiUser2 + "/probeSensorData/getThreePhaseRailSwitchDataByTime",

  // 获取时段配置
  getTimeRange: ApiUser2 + "/hostGroup/getTimeRange",
  // 编辑时段配置
  modifyTimeRange: ApiUser2 + "/hostGroup/modifyTimeRange",

  // 修改系统配置
  modifySystemOption: ApiUser2 + "/hostGroup/modifySystemOption",
  // 更新用户的归属网点
  updateOrganId: ApiUser2 + "/user/updateOrganId",
  // 网点下的员工
  getUserListByOrganId: ApiUser2 + "/user/getUserListByOrganId/",
  //  绑定数据大屏分组和多个通道(会绑定同设备下所有通道)
  bindGroupPhaseChannel: ApiUser2 + "/quartzGroup/bindGroupPhaseChannel/",
  //  解绑策略组下的探头(会解绑同设备下所有通道)
  removeQuartzGroupTargetWithPhaseChannel: ApiUser2 + "/quartzGroup/removeQuartzGroupTargetWithPhaseChannel/",
  //  更新定时策略组目标通道)
  updateQuartzGroupTargetByChannleIdAndGroupId: ApiUser2 + "/quartzGroup/updateQuartzGroupTargetByChannleIdAndGroupId",

  // 按区域批量创建分组
  createSceneGroupAndBindChannelByAreaIdList: ApiUser2 + "/scene/createSceneGroupAndBindChannelByAreaIdList",
  // 批量移除分组及分组绑定通道关系
  removeSceneGroupAndDetailByGroupIdList: ApiUser2 + "/scene/removeSceneGroupAndDetailByGroupIdList",
  // 批量创建场景联动
  createSceneByGroupIdList: ApiUser2 + "/scene/createSceneByGroupIdList",
  // 批量删除场景
  delSceneByIdList: ApiUser2 + "/scene/delSceneByIdList/",

  //批量创建场景联动无人关
  createSceneByGroupIdListClose: ApiUser2 + "/scene/createSceneByGroupIdListClose",
  // 批量创建场景联动有人开
  createSceneByGroupIdListOpen: ApiUser2 + "/scene/createSceneByGroupIdListOpen",
  // 批量创建场景联动级联空调温度限制
  createSceneSplitAirTemperatureSet: ApiUser2 + "/scene/createSceneSplitAirTemperatureSet",
  //  批量更新场景联动
  updateSceneBatch: ApiUser2 + "/scene/updateSceneBatch",

  // 网点下用户未绑定的区域(pc)
  getPcAreaByOrganIdAndUserUnBind: ApiUser2 + "	/area/getPcAreaByOrganIdAndUserUnBind/",
  getEnergyControlRealTimeData: ApiUser2 + "/screen/getEnergyControlRealTimeData/",
  // 获取通道关联的场景信息type:0-触发 1-执行
  getSceneInfoByChannelId: ApiUser2 + "/scene/getSceneInfoByChannelId/",
  // 获取通道绑定的定时任务
  getQuartzJobByChannelId: ApiUser2 + "/quartz/getQuartzJobByChannelId/",

  // 区域下(子区域)的探头通道列表(当前用户) 通用
  getProbeChannelByAreaIdAndSubAreaId: ApiUser2 + "/probe/getProbeChannelByAreaIdAndSubAreaId/",

  //平均电压
  getDeviceAbnormalVoltage: "http://8.130.117.19:5000/device_abnormal_voltage/",

  //获取用户绑定的中控屏分组信息
  getUserBindScreenGroupInfo: ApiUser2 + "/group/getUserBindScreenGroupInfo/",

  //更新通道
  updateProbeChannel: ApiUser2 + "/probe/updateProbeChannel/",
  //获取用电量设备流水记录
  getProbeEleCostRecordListByCondition: ApiUser2 + "/eleCostRecord/getProbeEleCostRecordListByCondition",
  //通道余额充值
  probeRecharge: ApiUser2 + "/eleCostRecord/probeRecharge",

  //获取用户可查看客户公司下透传6100C设备列表
  getEmployeeEle6100TerminalList: ApiUser2 + "/probe/getEmployeeEle6100TerminalList",

  //编辑设备
  modifyProbe: ApiUser2 + "/probeManage/modifyProbe/",
  //更新设备告警余额
  updateChannelAlarmBalance: ApiUser2 + "/probe/updateChannelAlarmBalance/",

  //推送修改
  settingSocket: ApiUser2 + "/socketSetting/settingSocket/",

  // 佰行大屏相关
  // 用电统计分析
  getMonthEleCalculateInfo: ApiUser2 + "/bhScreenData/getMonthEleCalculateInfo/",
  // 获取分区实时数据
  getSubAreaRealTimeData: ApiUser2 + "/bhScreenData/getSubAreaRealTimeData/",
  // 获取总组近7日用电详情
  getTotalGroupEleInfo: ApiUser2 + "/bhScreenData/getTotalGroupEleInfo/",

  // 导出空调系数
  exportMonthAirProbeUseData: ApiUser2 + "/export/exportMonthAirProbeUseData",
  // 导出指定通道id非计量空调开启时长
  exportMonthAirProbeUseDataByChannelIdList: ApiUser2 + "/export/exportMonthAirProbeUseDataByChannelIdList",
  // 导出指定通道id非计量空调开启时长(不含系数)
  exportMonthAirProbeUseDataByChannelIdListWithoutCoefficient: ApiUser2 + "/export/exportMonthAirProbeUseDataByChannelIdListWithoutCoefficient",

  // 获取所有通道
  getAllChannels: ApiUser2 + "/probe/getAllChannels",
  // 获取指令执行记录 传-1则参数不生效
  getAcitonExecuteRecord: ApiUser2 + "/action/getAcitonExecuteRecord/",

  // 获取指定设备类型功率排行
  getProbeGroupPowerRankingByMoldCode: ApiUser2 + "/dataScreen/getProbeGroupPowerRankingByMoldCode/",

  // 请求改变空调最小功率
  requestSetAirMinPower: ApiUser2 + "/probe/requestSetAirMinPower/",
  // 设置透传设备最小功率
  setMinimumPower: ApiUser2 + "/probe/setMinimumPower/",

  // 查询透传设备红外控制码
  queryControlCode: ApiUser2 + "/probe/queryControlCode/",
  // 设置透传设备红外控制码
  setControlCode: ApiUser2 + "/probe/setControlCode/",

  //获取探头下发命令列表
  getProbeCmdList: ApiUser2 + "/probe/getProbeCmdList/",

  //获取ds上报列表
  getDsReportByChannelId: ApiUser2 + "/probe/getDsReportByChannelId/",

  //获取ds下行 history=1
  getProbeHostControl: ApiUser2 + "/probe/getProbeHostControl/",

  //获取网关信号强度
  getSignal: ApiUser2 + "/probe/getProbeSignal/",

  //获取设备真实状态(不会发送指令(最后上报时间,guid))
  getProbeRealStateprod: ApiUser2 + "/probe/getProbeRealState/",

  //获取报告网点区域设备数量统计总览
  getOrganProbeCount: ApiUser2 + "/analysisReport/getOrganProbeCount/",
  //获取报告网点区域设备用电量统计信息
  getOrganEleInfo: ApiUser2 + "/analysisReport/getOrganEleInfo/",
  //获取报告网点告警记录统计信息
  getReportRecordCalculateInfo: ApiUser2 + "/analysisReport/getReportRecordCalculateInfo/",
  //获取报告网点历史数据排行信息
  getOrganProbeEleRankingInfo: ApiUser2 + "/analysisReport/getOrganProbeEleRankingInfo/",
  //获取网点所有设备历史数据排行信息
  getOrganAllTypeProbeRinkingInfo: ApiUser2 + "/analysisReport/getOrganAllTypeProbeRinkingInfo/",

  //根据用户id获取当前用户绑定微信推送的区域和网点
  getUserWeChatTarget: ApiUser2 + "/userTarget/getUserWeChatTarget/",

  //根据区域id获取设备
  getProbeByAreaId: ApiUser2 + "/probeManage/getProbeByAreaId/",

  //根据区域id获取设备
  getByProbeId: ApiUser2 + "/probePhoneTarget/getByProbeId/",

  //添加设备关联微信手机号数据
  addProbePhoneTarget: ApiUser2 + "/probePhoneTarget/addProbePhoneTarget",

  //根据设备id和电话号码删除用户推送绑定
  removeByProbeIdAndPhone: ApiUser2 + "/probePhoneTarget/removeByProbeIdAndPhone/",

  //批量删除用户绑定设备微信推送
  removeListByProbeIdAndPhone: ApiUser2 + "/probePhoneTarget/removeListByProbeIdAndPhone/",

  //大屏导出网点设备组用电报表
  exportProbeGroupByOrganId: ApiUser2 + "/dataScreen/exportProbeGroupByOrganId/",

  //按日期获取大屏用电量排行
  getProbeGroupEleRankData: ApiUser2 + "/dataScreen/getProbeGroupEleRankData/",

  //获取透传设备数据按时间 参数1:probeId 参数2:time(2022-11-07)
  getTransmissionProbeDataByTime: ApiUser2 + "/probeSensorData/getTransmissionProbeDataByTime",

  //获取透传属性数据 参数1:probeId 参数2:time(2022-11-07)
  getPropertySensorData: ApiUser2 + "/probeSensorData/getPropertySensorData",

  //获取设备固件版本号(向ds请求设备版本号,会发送指令)
  getProbeVersionByDs: ApiUser2 + "/probe/getProbeVersionByDs/",

  //获取设备固件版本号(向ds请求设备版本号,会发送指令)
  getProbeVersion: ApiUser2 + "/probe/getProbeVersion/",

  //获取设备指定月份每日用电量报表数据
  getDeviceUseLogReport: ApiUser2 + "/report/getDeviceUseLogReport/",

  //获取设备指定年份每月用电量报表数据
  getDeviceUseLogMonthReport: ApiUser2 + "/report/getDeviceUseLogMonthReport/",

  //获取七天内设备组用电量对比数据
  getGroupEleContrast: ApiUser2 + "/dataScreen/getGroupEleContrast",

  //重置网关信号和网关控制记录
  resetHostTarget: ApiUser2 + "/host/resetHostTarget/",

  //批量探头设置为单网关模式
  batchSingleHost: ApiUser2 + "/probeManage/batchSingleHost",

  //根据id获取设备信息
  getProbeById: ApiUser2 + "/probe/getProbeById/",

  //按类型获取语音播报列表
  getAudioRecognitionListByType: ApiUser2 + "/audioRecognition/getAudioRecognitionListByType",
  //设置语音播报
  setMicrowaveSoundAudioNumber: ApiUser2 + "/probe/setMicrowaveSoundAudioNumber/",
  //设置微波语音配置
  setMicrowaveSoundConfig: ApiUser2 + "/probe/setMicrowaveSoundConfig/",

  //获取门磁温湿度数据
  getDoorMagnetData: ApiUser2 + "/report/getDoorMagnetData/",
  //更新设备拓展用电系数
  updateProbeCoefficient: ApiUser2 + "/probe/updateProbeCoefficient/",

  //设备用电量

  //获取设备指定年月下每日用电量
  getProbeDeviceUseLogByMonth: ApiUser2 + "/deviceUseLog/getProbeDeviceUseLogByMonth/",
  //获取设备指定年每月用电量
  getYearDeviceUseLogInfo: ApiUser2 + "/deviceUseLog/getYearDeviceUseLogInfo/",

  //获取设备指定年月下每日用电量
  getProbeThreeMonthDeviceUseLog: ApiUser2 + "/deviceUseLog/getProbeThreeMonthDeviceUseLog/",
  //获取设备指定年每月用电量
  getTwoYearsDeviceUseLogInfo: ApiUser2 + "/deviceUseLog/getTwoYearsDeviceUseLogInfo/",

  //获取网点下的主机
  getHostByOrganId: ApiUser2 + "/host/getHostByOrganId/",

  //上下线记录
  getHostStateByHostId: ApiUser2 + "/host/getHostStateByHostId/",

  //卡信息
  requestNetworkCardInfo: ApiUser2 + "/host/requestNetworkCardInfo/",

  //测试分布式网关485通讯93 结果
  getCommunicationInfoList: ApiUser2 + "/distributedGateway/getCommunicationInfoList/",

  //查询分布式子网关2.4g覆盖94
  checkDistributedGatewayCover: ApiUser2 + "/distributedGateway/checkDistributedGatewayCover/",

  //查询分布式子网关2.4g覆盖94 结果
  getCoverDeviceInfoList: ApiUser2 + "/distributedGateway/getCoverDeviceInfoList/",

  //扫描分布式网关91 结果
  getDistributedGatewayInfoList: ApiUser2 + "/distributedGateway/getDistributedGatewayInfoList/",

  //分布式网关下控测试95 结果
  getTestControlInfoList: ApiUser2 + "/distributedGateway/getTestControlInfoList/",

  //扫描分布式网关91
  scanDistributedGateway: ApiUser2 + "/distributedGateway/scanDistributedGateway/",

  //测试分布式网关485通讯93
  testDistributedGatewayCommunication: ApiUser2 + "/distributedGateway/testDistributedGatewayCommunication/",

  //分布式网关下控测试95
  testDistributedGatewayControl: ApiUser2 + "/distributedGateway/testDistributedGatewayControl/",

  //配置198A 92
  setDistributedGatewayConfigInfo: ApiUser2 + "/distributedGateway/setDistributedGatewayConfigInfo/",

  //配置198A 92 结果
  getDistributedGatewayConfig: ApiUser2 + "/distributedGateway/getDistributedGatewayConfig/",

  //探头细类别
  getProbeMoldList: ApiUser2 + "/probe/getProbeMoldList",

  //获取一级区域指令队列情况
  getAreaGatewayInstructionCount: ApiUser2 + "/gateway/getAreaGatewayInstructionCount/",
  //清空网点队列
  cleanAreaInstruction: ApiUser2 + "/gateway/cleanAreaInstruction/",

  //通过区域ids获取区域平面图信息
  getAreaPlanListByArea: ApiUser2 + "/areaPlan/getAreaPlanListByAreaIds",
  //通过平面图id获取位置点信息
  getPlanPositionListByPlanId: ApiUser2 + "/planPosition/getPlanPositionListByPlanId/",
  //通过位置点信息id获取探头通道列表
  getProbeChannelByPosId: ApiUser2 + "/probePosTarget/getProbeChannelByPosId/",
  //通过区域平面图id获取所有探头通道
  getAllProbeChannelByAreaPlanId: ApiUser2 + "/areaPlan/getAllProbeChannelByAreaPlanId/",
  //更新网关卡联系人
  updateHostContact: ApiUser2 + "/host/updateHostContact/",

  //更新通道统计设备标识
  updateChannelStatisticsFlag: ApiUser2 + "/probe/updateChannelStatisticsFlag/",
  //通过token登录
  loginByToken: ApiUser2 + "/entrance/loginByToken",

  //网点下的区域下的日月用电量
  getAreaEleInfoByOrganId: ApiUser2 + "/probe/getAreaEleInfoByOrganId/",
  //用户所有网点的设备统计(小程序)
  getProbeByOrganIdList: ApiUser2 + "/probe/getProbeByOrganIdList",
  //用户当前网点的设备统计(小程序)
  getProbeStatisticsByOrganId: ApiUser2 + "/probe/getProbeStatisticsByOrganId/",
  //网点下的区域下的探头列表(小程序)
  getProbeByOrganId: ApiUser2 + "/probe/getProbeByOrganId/",

  //
  getAreaListDeviceUseLogReport: ApiUser2 + "/report/getAreaListDeviceUseLogReport",
  getAreaListDeviceUseLogMonthReport: ApiUser2 + "/report/getAreaListDeviceUseLogMonthReport",

  //判断设备是否在黑名单列表
  existProbeBlacklist: ApiUser2 + "/probeBlackList/existProbeBlacklist/",
  //获取所有设备
  getAllProbes: ApiUser2 + "/probe/getAllProbes",

  //获取设备列表指定月份每日用电量报表数据
  getProbeListDeviceUseLogMonthReport: ApiUser2 + "/report/getProbeListDeviceUseLogMonthReport/",

  getProbeListDeviceUseLogReport: ApiUser2 + "/report/getProbeListDeviceUseLogReport/",

  //获取通道拓展温度阈值
  getExtendTemperatureByProbeId: ApiUser2 + "/extendTemperature/getByProbeId/",

  //批量新增拓展温度阈值
  SaveExtendTemperatureList: ApiUser2 + "/extendTemperature/saveList",

  //批量更新拓展温度阈值
  UpdateextendTemperature: ApiUser2 + "/extendTemperature/updateBatchById",

   //获取透传设备曲线数据
  exportHost6100DataCurve: ApiUser2 + "/report/exportHost6100DataCurve/",
};
