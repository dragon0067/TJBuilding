<template>
  <div id="user-operation" class="box-border-style" v-loading="loading" element-loading-text="数据刷新中……"
    element-loading-background="rgba(0, 0, 0, 0.5)">

    <div class="operation-content">
      <div class="table-section change_equipment_row">
        <el-scrollbar style="height: 100%">

          <div v-show="Electricalappliances">
            <div class="top-row">
              <el-button v-if='change_btn_probe' class="change_btn" type="primary" size="small" title="切换到充电插座管理"
                @click="Electricalappliances=false"><i><svg t="1623831943639" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4422" width="18" height="18">
                    <path d="M16.275456 782.244864" p-id="4423" fill="#ffffff"></path>
                    <path
                      d="M667.128832 729.61024 667.128832 894.184448 957.792256 631.015424 667.128832 385.526784 667.128832 525.357056 395.318272 525.357056 395.318272 729.61024Z"
                      p-id="4424" fill="#ffffff"></path>
                    <path
                      d="M326.972416 581.523456 326.972416 457.801728 599.568384 457.801728 599.568384 253.546496 326.972416 253.546496 326.972416 126.67904 67.731456 358.812672Z"
                      p-id="4425" fill="#ffffff"></path>
                    <path d="M977.830912 782.244864" p-id="4426" fill="#ffffff"></path>
                  </svg></i>
                <span>充电插座管理</span>
              </el-button>
              <div class="screen-row" :class="screenshow?'screen-hide':'screen-show'">

                <div class="screenshow-btn" @click="screenshow=!screenshow"><i
                    :class="screenshow?'el-icon-search':'el-icon-d-arrow-left'"></i></div>
                <div class="screen-box">
                  <span class="margin-left_10 margin-right_10">探头类型</span>
                  <el-select clearable v-model="probeType" placeholder="请选择类型" size="small" class="probeType-row">
                    <el-option v-for="item in typeselect" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                  <span class="margin-left_10 margin-right_10">开关状态</span>
                  <el-select clearable v-model="probeState" placeholder="请选择状态" size="small" class="probeType-row">
                    <el-option v-for="item in typeStateselect" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                  </el-select>
                  <el-button class="margin-left_10" type="primary" size="small" @click="datalistQuery">查询</el-button>
                </div>
                <div class="tl-corner"></div>
                <div class="tr-corner"></div>
                <div class="bl-corner"></div>
                <div class="br-corner"></div>
              </div>
                <div class="alarmButton"
                        @mouseenter="mouseEnterAlarmButton"
                     @mouseleave="mouseLeaveAlarmButton"
                >
                  <el-button :class="isNewAlarm ? 'openAlarm': ''"
                             @click="handleAlarmButton"
                             style="font-size: 20px;"
                             type="text">
                    <el-badge is-dot
                              :hidden="!isNewAlarm"
                              class="item">
                      <div v-if="alarmList.length > 0" class="el-icon-message-solid" ></div>
                      <div v-else class="el-icon-bell" ></div>
                    </el-badge>
                  </el-button>
                  <div v-if="isAlarmTip" class="alarmTip">
                    告警消息
                  </div>
                </div>
              <!-- [layerPanel == 'seconde'?{layerListIsactive:key == deleteIndex} : '',{layerListIsactive2:layerList.id == current}] -->
              <div class="data-total-row"
                :class="[screenshow?'total-show':'total-hide',change_btn_probe?'':'change_btn_Channel_hide']">
                <div class="data-total-box">
                  <div class="data-total-infos" v-for="(item,index) in typeselect" :key="index"
                    :style="probeTypeTotalop(item.id)?'':'display:none'">
                    <span style="display: flex;align-items: center;width: 24px;"
                      v-html="probeTypeFilterimg(item.id)"></span>
                    <span class="data-total-title">{{item.name}}</span>
                    <div v-html="probeTypeTotal(item.id)"></div>
                  </div>
                </div>
                <div class="tl-corner"></div>
                <div class="tr-corner"></div>
                <div class="bl-corner"></div>
                <div class="br-corner"></div>
              </div>
            </div>
            <div class="datalist-row">

              <div v-for="(item, index) in tableData" :key="item.id" class="datalist-box"  :class="{'monitor_6100_row':[25,42,44].includes(item.targetCategoryId)}">
                <div class="eleNormal" v-if="!item.eleNormal"></div>
                <div v-if="shouldShowSetup(item)" class="datalist-pile-setup" :title="getTitle(item)" @click="handleClick(item)">
                  <svg t="1623394901953"
                      class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10310"
                      width="18" height="18">
                      <path
                        d="M416.536774 33.296516c60.482065-11.230968 123.375484-11.230968 185.244903 0.825807a186.103742 186.103742 0 0 0 93.481291 164.005161 186.103742 186.103742 0 0 0 188.779355-1.024 496.408774 496.408774 0 0 1 93.349161 160.008258 181.644387 181.644387 0 0 0-95.198968 160.933161c0.330323 69.565935 39.506581 130.34529 96.949678 161.957162a486.433032 486.433032 0 0 1-91.796646 158.984258c-56.088774-33.957161-128.29729-37.458581-188.746322-2.972904a181.644387 181.644387 0 0 0-91.763613 162.915097c-60.482065 11.197935-123.375484 11.230968-185.244903-0.858839a186.103742 186.103742 0 0 0-93.481291-164.005161 186.103742 186.103742 0 0 0-188.779354 1.057032 496.408774 496.408774 0 0 1-93.349162-160.008258 181.644387 181.644387 0 0 0 95.198968-160.933161c-0.330323-69.598968-39.506581-130.34529-96.98271-161.957161 9.909677-28.605935 22.693161-56.683355 38.383484-83.868903A486.433032 486.433032 0 0 1 136.026839 193.23871c56.088774 33.957161 128.29729 37.491613 188.746322 3.005935a181.644387 181.644387 0 0 0 91.763613-162.915097z m3.369291 641.816774c88.856774 51.299097 201.992258 21.702194 252.696774-66.097548 50.671484-87.799742 19.75329-200.571871-69.136516-251.904-88.856774-51.299097-201.992258-21.702194-252.696775 66.064516-50.704516 87.832774-19.75329 200.604903 69.136517 251.904z"
                        p-id="10311" fill="#ffffff"></path>
                    </svg>
                </div>
                <div :class="item.probeMoldCode=='27'?'air-setup':''" class="datalist-pile-setup " v-if="item.isTransmission&&(['27','28','29','43'].includes(item.probeMoldCode))" title="设定阈值" @click="throughDatalistSetup(item)" >
                  <svg t="1751250050213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9643" width="18" height="18"><path d="M994.159616 209.0496A29.184 29.184 0 0 0 1024.009216 179.2v-34.1504a29.184 29.184 0 0 0-29.8496-29.8496H908.809216v93.8496h85.3504zM29.858816 110.9504C12.809216 110.9504 0.009216 128 0.009216 145.0496v29.9008C0.009216 192 12.809216 204.8 29.858816 204.8h618.7008V110.9504H29.858816zM874.658816 256V64c0-34.1504-29.8496-64-64-64h-64c-38.4 0-64 29.8496-64 64V256c0 34.1504 29.9008 64 64 64h64c34.1504 0 64-29.8496 64-64z m119.5008 302.9504a29.184 29.184 0 0 0 29.8496-29.9008v-34.0992a29.184 29.184 0 0 0-29.8496-29.9008h-563.2v93.9008h563.2zM29.858816 465.0496A29.184 29.184 0 0 0 0.009216 494.9504v34.0992c0 17.1008 12.8 29.9008 29.8496 29.9008h140.8V465.0496H29.858816z m366.9504 145.1008v-192c0-34.1504-29.8496-64-64-64H268.809216C234.658816 354.1504 204.809216 384 204.809216 418.1504v192c0 34.0992 29.8496 64 64 64H332.809216c38.4 0 64-29.9008 64-64z m597.3504 302.8992A29.184 29.184 0 0 0 1024.009216 883.2v-34.1504a29.184 29.184 0 0 0-29.8496-29.8496h-247.5008v93.8496h247.5008zM29.858816 814.9504A29.184 29.184 0 0 0 0.009216 844.8v34.1504c0 17.0496 12.8 29.8496 29.8496 29.8496H486.409216v-93.8496H29.858816z m682.7008 145.0496V768c0-34.1504-29.9008-64-64-64h-64c-34.1504 0-64 29.8496-64 64v192c0 34.1504 29.8496 64 64 64h64c34.0992 0 64-29.8496 64-64z" p-id="9644" fill="#ffffff"></path></svg>
                </div>

                <div :class="item.probeMoldCode=='149'?'air-setup':''" class="datalist-pile-setup " v-if="(['149'].includes(item.probeMoldCode))" title="设定参数" @click="waterProgramSetup(item)" >
                  <svg t="1751250050213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9643" width="18" height="18"><path d="M994.159616 209.0496A29.184 29.184 0 0 0 1024.009216 179.2v-34.1504a29.184 29.184 0 0 0-29.8496-29.8496H908.809216v93.8496h85.3504zM29.858816 110.9504C12.809216 110.9504 0.009216 128 0.009216 145.0496v29.9008C0.009216 192 12.809216 204.8 29.858816 204.8h618.7008V110.9504H29.858816zM874.658816 256V64c0-34.1504-29.8496-64-64-64h-64c-38.4 0-64 29.8496-64 64V256c0 34.1504 29.9008 64 64 64h64c34.1504 0 64-29.8496 64-64z m119.5008 302.9504a29.184 29.184 0 0 0 29.8496-29.9008v-34.0992a29.184 29.184 0 0 0-29.8496-29.9008h-563.2v93.9008h563.2zM29.858816 465.0496A29.184 29.184 0 0 0 0.009216 494.9504v34.0992c0 17.1008 12.8 29.9008 29.8496 29.9008h140.8V465.0496H29.858816z m366.9504 145.1008v-192c0-34.1504-29.8496-64-64-64H268.809216C234.658816 354.1504 204.809216 384 204.809216 418.1504v192c0 34.0992 29.8496 64 64 64H332.809216c38.4 0 64-29.9008 64-64z m597.3504 302.8992A29.184 29.184 0 0 0 1024.009216 883.2v-34.1504a29.184 29.184 0 0 0-29.8496-29.8496h-247.5008v93.8496h247.5008zM29.858816 814.9504A29.184 29.184 0 0 0 0.009216 844.8v34.1504c0 17.0496 12.8 29.8496 29.8496 29.8496H486.409216v-93.8496H29.858816z m682.7008 145.0496V768c0-34.1504-29.9008-64-64-64h-64c-34.1504 0-64 29.8496-64 64v192c0 34.1504 29.8496 64 64 64h64c34.0992 0 64-29.8496 64-64z" p-id="9644" fill="#ffffff"></path></svg>
                </div>
                <!--按钮组容器-->
                <div class="setBtn-row">
                <!--水表导出-->
                 <div v-if="['149'].includes(item.probeMoldCode)" class="datalist-pile-Refreshsocket" title="数据导出"
                  @click='handleProbeExport(item)'><svg t="1751003936408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5568" width="18" height="18"><path d="M293.632 645.248c91.456-86.784 183.552-220.544 346.88-211.584a20.8 20.8 0 0 1 20.224 20.8v59.392a21.376 21.376 0 0 0 34.432 16.64l211.2-171.2a21.376 21.376 0 0 0 0-33.28l-210.24-192a21.952 21.952 0 0 0-35.648 16.64v60.096a20.8 20.8 0 0 1-17.856 20.8c-280.704 61.76-351.36 391.104-348.992 413.696zM192 960a138.176 138.176 0 0 1-129.984-152.512L64 832V192a116.48 116.48 0 0 1 128-128c-108.8 1.024 256 0 256 0a28.224 28.224 0 0 1 29.76 27.84A35.968 35.968 0 0 1 448 128H192a53.12 53.12 0 0 0-64 64c1.536-37.504 0 640 0 640a52.8 52.8 0 0 0 64 64c49.536-0.448 640 0 640 0a52.48 52.48 0 0 0 64-64c-0.64 105.152 0-256 0-256a36.48 36.48 0 0 1 27.264-38.4A33.216 33.216 0 0 1 960 576v256a116.48 116.48 0 0 1-128 128c-50.56-0.448-640 0-640 0z" fill="#ffffff" p-id="5569"></path></svg>
                </div>
                 <div v-if="[39,50].includes(item.targetCategoryId)" class="datalist-pile-Refreshsocket" title="数据导出"
                  @click='handleDoorExport(item)'><svg t="1751003936408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5568" width="18" height="18"><path d="M293.632 645.248c91.456-86.784 183.552-220.544 346.88-211.584a20.8 20.8 0 0 1 20.224 20.8v59.392a21.376 21.376 0 0 0 34.432 16.64l211.2-171.2a21.376 21.376 0 0 0 0-33.28l-210.24-192a21.952 21.952 0 0 0-35.648 16.64v60.096a20.8 20.8 0 0 1-17.856 20.8c-280.704 61.76-351.36 391.104-348.992 413.696zM192 960a138.176 138.176 0 0 1-129.984-152.512L64 832V192a116.48 116.48 0 0 1 128-128c-108.8 1.024 256 0 256 0a28.224 28.224 0 0 1 29.76 27.84A35.968 35.968 0 0 1 448 128H192a53.12 53.12 0 0 0-64 64c1.536-37.504 0 640 0 640a52.8 52.8 0 0 0 64 64c49.536-0.448 640 0 640 0a52.48 52.48 0 0 0 64-64c-0.64 105.152 0-256 0-256a36.48 36.48 0 0 1 27.264-38.4A33.216 33.216 0 0 1 960 576v256a116.48 116.48 0 0 1-128 128c-50.56-0.448-640 0-640 0z" fill="#ffffff" p-id="5569"></path></svg>
                </div>
                <!--获取设备定时-->
                <div v-if="![12,38,39,40,48,50,53,55].includes(item.targetCategoryId)" class="datalist-pile-timing" title="定时策略"
                  @click='getChannelTiming(item)'><img
                  :src="require('@/assets/icons/Doorlock_list.png')" />
                </div>
                <div v-if="![38,39,40,48,49,50,53,55].includes(item.targetCategoryId)" class="datalist-pile-Refreshsocket" :class="item.refresh ? 'Refreshanimation' : ''" title="重新采集"
                  @click='Refreshsocket(item)'><svg t="1624518605167" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4716" width="18" height="18">
                    <path
                      d="M499.72 872.52c-179.31 0-325.19-143.88-325.19-320.75 0-176.84 145.88-320.72 325.19-320.72 54.31 0 108.12 13.5 155.62 39.03 23.31 12.56 32.06 41.69 19.5 65.03-12.44 23.38-41.56 32.12-65 19.53-33.56-18.06-71.62-27.59-110.12-27.59-126.38 0-229.19 100.81-229.19 224.72 0 123.94 102.81 224.75 229.19 224.75 104.5 0 195.75-69.22 221.87-168.31 6.81-25.62 33.12-40.88 58.69-34.16 25.62 6.78 40.94 33.03 34.19 58.66-37.32 141.18-166.75 239.81-314.75 239.81z"
                      fill="#ffffff" p-id="4717"></path>
                    <path
                      d="M799.24 407.04l-89.26-228.19c-6.2-15.85-27.38-18.78-37.64-5.2l-154.62 204.6c-10.26 13.58-1.67 33.16 15.27 34.8l243.89 23.59c16.15 1.57 28.27-14.48 22.36-29.6z"
                      fill="#ffffff" p-id="4718"></path>
                  </svg></div>
          
                <div :class="usermanager==2&&item.targetCategoryId==12?'Doorlock_btn_grop':''"
                  v-if="usermanager==2&&item.targetCategoryId==12" >
                  <div style="margin-right:5px" title="录卡模式" @click="requestNetLockInput(item)"><img
                      :src="require('@/assets/icons/Doorlock_cop.png')" /></div>
                  <div title="克隆门锁" @click="Doorlock_cop(item.probeId)"><img
                      :src="require('@/assets/icons/Doorlock_cop.png')" /></div>

                </div>
                </div>
                <span v-if="(item.probeState==32768 &&  isLoseContact)||(item.probeState==32769 && isOutage)" style="display: flex;position: absolute;top:0.23rem;right:0.2rem;font-size: 0.1rem;align-items: center;">
                  <svg t="1679455086149" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4778" width="18" height="18"><path d="M31.525 38.985l3.584-4.096a36.571 36.571 0 0 1 47.542-3.438l4.17 3.511 902.07 902.583a36.571 36.571 0 0 1 3.584 47.543l-3.584 4.096a36.571 36.571 0 0 1-47.542 3.584l-4.17-3.584-321.974-322.121L306.98 988.379c-24.869 25.893-67.072 4.243-62.757-29.55l0.878-4.68 86.235-344.65H207.214a36.571 36.571 0 0 1-36.133-41.91l0.951-4.682 75.337-263.899L35.11 86.601a36.571 36.571 0 0 1-3.584-47.543l3.584-4.242-3.584 4.17z m321.974-14.628h341.358a36.571 36.571 0 0 1 35.913 43.446l-1.17 4.608-81.554 244.517h217.453a36.571 36.571 0 0 1 29.696 57.93l-3.364 3.949-175.324 182.71-423.131-423.35 24.869-87.26a36.571 36.571 0 0 1 29.915-26.112l5.413-0.438z" p-id="4779" fill="#d81e06"></path></svg>
                  <font>{{item.probeState==32768?'失联':'断电' }}</font>
                </span>
                <!-- <span v-if="item.probeState==32769" style="display: flex;position: absolute;top:0.23rem;right:0.2rem;font-size: 0.1rem;align-items: center;">
                  <svg t="1679455086149" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4778" width="18" height="18"><path d="M31.525 38.985l3.584-4.096a36.571 36.571 0 0 1 47.542-3.438l4.17 3.511 902.07 902.583a36.571 36.571 0 0 1 3.584 47.543l-3.584 4.096a36.571 36.571 0 0 1-47.542 3.584l-4.17-3.584-321.974-322.121L306.98 988.379c-24.869 25.893-67.072 4.243-62.757-29.55l0.878-4.68 86.235-344.65H207.214a36.571 36.571 0 0 1-36.133-41.91l0.951-4.682 75.337-263.899L35.11 86.601a36.571 36.571 0 0 1-3.584-47.543l3.584-4.242-3.584 4.17z m321.974-14.628h341.358a36.571 36.571 0 0 1 35.913 43.446l-1.17 4.608-81.554 244.517h217.453a36.571 36.571 0 0 1 29.696 57.93l-3.364 3.949-175.324 182.71-423.131-423.35 24.869-87.26a36.571 36.571 0 0 1 29.915-26.112l5.413-0.438z" p-id="4779" fill="#d81e06"></path></svg>
                  <font>断电</font>
                </span> -->
               
                <div class="datalist-title"  @dblclick="handleDebug(item)" v-bind:title="item.channelName" :data-guid='item.probeGuid'>{{ item.channelName
                }}</div>
                <!-- -{{item.userName}}-{{item.useElectricity}} -->
                <div class="datalist-infos">
                  <div class="datalist-img" :class="{'monitor_6100_icon':[25,42,44].includes(item.targetCategoryId)}" v-if="![22,25,42,44,47].includes(item.targetCategoryId)">
                    <span :class="['36','48'].includes(item.probeMoldCode)?'gear_icon gear_'+ item.state +'_'+ item.eleGear:''"
                      v-html="probeTypeFilterimg(item.targetCategoryId,item.lastEventCode,item)"></span>
                  </div>
                  <div class="datalist-6100img"  v-if="[25,42,44].includes(item.targetCategoryId)">
                     <div class="monitor_6100_ele">
                        <div style="padding-bottom:5px"><span>日用电：</span><p style="color: #ffbc27;font-weight: bold;">{{EleVoList(item,'eleDay')}}度</p></div>
                        <div style="padding-bottom:5px"><span>月用电：</span><p style="color: #00d6ff;font-weight: bold;">{{EleVoList(item,'eleMonth')}}度</p></div>
                      </div>
                    <div style="display: flex;justify-content: center;"><img src="@/assets/images/6100icon.png"/></div>
                     
                  </div>
                  <div class="Ceiling-fan-gear-row" v-if="['36','48'].includes(item.probeMoldCode)">
                    <div class="Ceiling-fan-gear-grop" :class="item.state==1?'gear-grop-on':''">
                      <div v-for="value in 5" :key="value" class="cf-gear"
                        :class="[item.eleGear==value ?'gear_on':'',item.eleGear==value&&item.state==1?'gear_on_' + item.state:'','cf-gear'+ value]"
                        @click="switchChange($event, item,value,1)">{{value}}</div>

                      <div class="cf-grar-Pointer"
                        :class="['gearPointer_'+ item.eleGear,'gearPointer_on_'+ item.state]"><svg t="1635985734800"
                          class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                          p-id="3372" width="42" height="42">
                          <path
                            d="M523.264 69.632c-3.584-55.296-10.24-51.2-10.24-51.2s-6.656-4.096-10.24 51.2l-71.68 849.92c0 45.056 36.864 81.92 81.92 81.92s81.92-36.864 81.92-81.92l-71.68-849.92z"
                            p-id="3373" fill="#ffffff"></path>
                        </svg></div>
                    </div>
                    <div class="Ceiling-fan-gear-sw">
                      <div @click="ChangeCeilingfan(item,'down',item.eleGear)" title="降档" class="el-icon-minus"
                        style="border-radius: 3px 0 0 3px;"></div>
                      <div @click="switchChange($event, item)"
                      
                        style="border-left:1px solid #fff;border-right:1px solid #fff;">{{item.state==1?'开':'关'}}</div>
                      <div @click="ChangeCeilingfan(item,'up',item.eleGear)" title="升档" class="el-icon-plus"
                        style="border-radius: 0px 3px 3px 0px;"></div>
                    </div>
                  </div>
                  <div class="datalist-conter" :class="{'monitor_6100_box':[25,42,44].includes(item.targetCategoryId)}" v-if="!(['36','48'].includes(item.probeMoldCode))">
                    <div v-if="[47].includes(parseInt(item.targetCategoryId))" class="infrared_row">
                      <div class="extendTemperatureinfos-row">
                        <div><span>温度：</span><p>{{item?.extendInfo?.deviceTemperature ? (item.extendInfo.deviceTemperature) : '--'}}℃</p></div>
                        <div><span>电压：</span><p> {{item?.extendInfo?.deviceTemperature ? ((item.extendInfo.batteryVoltage/ 1000).toFixed(2)) : '--'}}V</p></div>
                      </div>
                      <div class="extendTemperatureList-row"  v-if="item.extendInfo">
                        <div v-for="(item,index) in item.extendInfo.extendTemperatureList" :key="index">
                          <span>扩展{{index+1}}：</span><p>{{[255,65535].includes(item)?'--':`${item}℃`}}</p>
                        </div>
                      </div>
                    </div>
                    <!--水表-->
                    <template v-if="[48,53,55].includes(parseInt(item.targetCategoryId))">
                    
                      <template v-if="[1,2].includes(item?.extendInfo?.waterMeterType) && [53,55].includes(parseInt(item.targetCategoryId))">
                        <div>{{[1].includes(item?.extendInfo?.waterMeterType)?'水压':'水位'}}：{{item?.extendInfo?.waterPressure ? ((item.extendInfo.waterPressure)/ 10).toFixed(1): '--'}}%</div>
                        <div>{{[1].includes(item?.extendInfo?.waterMeterType)?'压强':'液位'}}：{{waterMeterPressure(item)}}{{[1].includes(item?.extendInfo?.waterMeterType)?'MPa':'米'}}</div>
                      </template>
                      <template v-else>
                        <div>读数：{{ item?.extendInfo?.cumulativeCount ? (item.extendInfo.cumulativeCount / 1000).toFixed(3) : '--'}}吨</div>
                      </template> 
                        <template v-if="![1,2].includes(item?.extendInfo?.waterMeterType) || [48].includes(parseInt(item.targetCategoryId))">
                      <div>设备温度：{{item?.extendInfo?.deviceTemperature ? (item.extendInfo.deviceTemperature) : '--'}}℃</div>
                   
                    
                         <div>电池电压：{{item?.extendInfo?.batteryVoltage ? (item.extendInfo.batteryVoltage / 1000).toFixed(2) : '--'}}V</div>
                      </template>
                    </template>
                    <!--红外设备st-->
                    <div v-if="[19,37,41,49,51].includes(parseInt(item.targetCategoryId))" class="infrared_row">
                      <template v-if="![51].includes(parseInt(item.targetCategoryId))">
                        <div v-if="![41,49].includes(item.targetCategoryId) && !['152'].includes(item.probeMoldCode) ">温度：{{item.realtimeTemperature != null &&item.realtimeTemperature != 255?item.realtimeTemperature:'--'}}°C</div>
                        <div  v-if="item.targetCategoryId==41">状态：{{item.state==1?'开':'关'}}</div>
                        <div>当前：{{item.lastEventCode==48?'有人':'无人'}}</div>
                        <div v-if="item.lastEventCode==48 && item.probeMoldCode=='152'">当前人数：{{item.detectionTimeInfo?.personnelDetectionCount??'--'}}</div>
                        <div>有人：{{Timeduration(item.somebodyTime)}}</div>
                        <div>无人：{{Timeduration(item.nobodyTime)}}</div>
                      </template>
                      <template v-else>
                        <div >
                          亮度：{{ item.brightness }}%
                        </div>
                      </template>
                    </div>
                    <!--红外设备ed-->
                    <div v-if="!([12,22,38,39,40,41,47,48,49,50,51,53,37,55].includes(item.targetCategoryId) || NoControl(item.probeKindCode))">
                     <el-switch :disabled="!controlPermission" v-if="item.targetCategoryId!=22" :active-value="1" :inactive-value="0" :class="'table-switch-text'"
                        v-model="item.state"   @change="switchChange($event, item)" active-color="#13ce66"
                        inactive-color="#ff4949" min-width="60" active-text="开" inactive-text="关">
                      </el-switch>
                    </div>
                  
                    <div v-if="item.targetCategoryId==38"  class="infrared_row">
                      <template v-if="item.groundingAlarm!=null && JSON.parse(item.groundingAlarm).smokeState==1">
                        <div>烟雾报警</div>

                        <div>温度：{{item.probeSensorData.temperature && item.probeSensorData.temperature!=255?item.probeSensorData.temperature:'--'}}°C</div>
                        
                        <div>烟雾浓度：{{item.probeSensorData.smokeConcentration && item.probeSensorData.smokeConcentration!=255?item.probeSensorData.smokeConcentration:'--'}}%</div>
                        
                        <div><el-button @click="setSmokeDetection(item,1)" type="primary" style="padding: 7px 8px;" size="mini" >消音</el-button>
                        <el-button @click="setSmokeDetection(item,2)" type="primary" style="margin-left: 5px;padding: 7px 8px;" size="mini" >暂停报警</el-button>
                      </div>
                      </template>            
                      <template v-else>
                        状态：正常
                      </template>       
                    </div>
                    <div v-if="[39,50].includes(item.targetCategoryId)"  class="infrared_row">
                      <template v-if="item.targetCategoryId==39">
                      <div>状态：{{item.groundingAlarm !=null&&JSON.parse(item.groundingAlarm).doorState == 1?'门开':'门关'}}</div>
                      <div>湿度：{{item.probeSensorData && item.probeSensorData.humidity && item.probeSensorData.humidity!=255?item.probeSensorData.humidity:'--'}}%</div>
                      </template>
                       <template v-if="item.targetCategoryId==50">
                        
                         <div>电池电压：{{item.currVoltage!=null?(item.currVoltage/1000).toFixed(2):'--'}}V</div>
                          
                     
                      </template>
                      <div>温度：{{item.probeSensorData &&item.probeSensorData.temperature && ![255,65535,6553.5].includes(Math.abs(item.probeSensorData.temperature))?item.probeSensorData.temperature:'--'}}°C</div>
                      <template v-if="item.targetCategoryId==50">
                         <div>扩展温度1：{{item.probeSensorData&&item.probeSensorData.temperatureExtend1 && ![255,65535,6553.5,3276.7].includes(Math.abs(item.probeSensorData.temperatureExtend1))?item.probeSensorData.temperatureExtend1:'--'}}°C</div>
                       
                      </template>
                      <!--
                      <div>扩展温度2：{{item.probeSensorData.temperatureExtend2?item.probeSensorData.temperatureExtend2:'--'}}°C</div> -->
                    </div>
                    <div v-if="item.targetCategoryId==40">
                      {{item.groundingAlarm !=null&&JSON.parse(item.groundingAlarm).waterImmersionState == 1?'水浸报警':'状态：正常'}}
                    </div>
                     <!-- :disabled="item.probeState==32769 "&& JSON.parse(item.groundingAlarm).smokeState==0  -->
                    <div v-if="(item.targetCategoryId==38 )||(item.targetCategoryId != 22 && !['39','54','128','42','46','129','143','55','148','150','152'].includes(item.probeMoldCode)) || ( item.probeMoldCode== 39 && item.state == 0)" :style=" item.targetCategoryId==13?'font-size:0.12rem':''">
                      类型：
                         {{ item.targetCategoryId | probeTypeFilter }}
                    </div>
                    <div v-if="item.probeMoldCode== 39 && item.state == 1">
                      亮度：{{ item.brightness }}%</div>
                    <div
                      :style="item.state==1 && ( item.targetCategoryId==1|| item.targetCategoryId==13 || item.targetCategoryId==15) ?'':'display:none'">
                      温度：{{ item.airTemperatureset }}℃</div>
                   
                   <!--接地报警-->
                    <div  v-if="item.probeMoldCode== 43" class="groundingAlarm-43">
                      <div class="datalist-pile-status-box" style="top: 20px;right: 0;left: initial;" v-show="item.eleState > 1">
                        <i><svg t="1623290843113" class="icon" viewBox="0 0 1168 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="57172" width="18" height="18">
                            <path
                              d="M1163.056049 958.807834L622.105947 21.779109a43.461444 43.461444 0 0 0-75.333169 0L5.822676 958.807834a43.461444 43.461444 0 0 0 37.666584 65.192166h1081.900205a43.461444 43.461444 0 0 0 37.666584-21.730722 43.461444 43.461444 0 0 0 0-43.461444zM118.822429 937.077113L584.439363 130.432718l465.761804 806.644395z"
                              p-id="57173" fill="#e60000"></path>
                            <path
                              d="M566.330428 733.967299a49.98066 49.98066 0 0 0-52.733219 52.153733 51.574246 51.574246 0 0 0 14.487148 36.507612 52.588347 52.588347 0 0 0 37.521713 14.487148 49.111431 49.111431 0 0 0 35.20377-14.487148 50.415275 50.415275 0 0 0 14.487148-36.942227 54.037062 54.037062 0 0 0-14.487148-37.666584 48.097331 48.097331 0 0 0-34.479412-14.052534zM521.565141 420.175676a30.857625 30.857625 0 0 0-14.487148 26.801224 260.768662 260.768662 0 0 0 14.487148 71.421639 864.0135 864.0135 0 0 1 21.440979 91.269031 876.907062 876.907062 0 0 1 10.865361 95.03569h24.048665q4.056401-51.719118 11.73459-97.353633a777.090613 777.090613 0 0 1 19.992264-88.951088c4.92563-17.964063 8.547417-32.596083 11.010232-43.461444a131.688174 131.688174 0 0 0 3.621787-27.670453q0-35.928127-57.948591-36.507612A81.417771 81.417771 0 0 0 521.565141 420.175676z"
                              p-id="57174" fill="#e60000"></path>
                          </svg></i>
                        <span style="color:#e60000; padding-left: 5px;width: 50px;">{{batteryStatetext(item.eleState)}}</span>
                      </div>
                       <div v-html="groundingAlarm_43(item.groundingAlarm)"></div>
                    </div>
                    <!--窗帘-->
                    <div v-if="item.targetCategoryId==22" :class=" item.targetCategoryId==22 ? 'curtain-class' : ''">
                      <el-slider v-model="item.state" @change="switchChange($event, item)" show-input></el-slider>
                    </div>
                    <div v-if="item.targetCategoryId==12">
                      <el-button type="primary" round size="mini" @click="switchChange($event,item)" v-if="controlPermission">开锁</el-button>
                    </div>
                    
                    <div v-if="[1,9,10,11,12,13,14,15].includes(Number(item.probeMoldCode)) && item.openingTimeInfo">
                      当日开启：{{Timeduration(item.openingTimeInfo&& item.openingTimeInfo.daySeconds?item.openingTimeInfo.daySeconds:0)}}
                    </div>
                    <!-- <div v-if="[127].includes(Number(item.probeMoldCode)) && item.openingTimeInfo">
                      当月开启：{{Timeduration(item.openingTimeInfo.monthSeconds)}}
                    </div> -->
                    <!--6100A-->
                     <template  v-if="[44].includes(item.targetCategoryId)" >
                    <div class="monitor_6100">
                      <template v-if="item.probeSensorData">
                      <div><span>电压：</span><p>
                      {{EleVoList(item.probeSensorData,'voltage')}}V</p></div>
                      <div><span>温度：</span><p>{{EleVoList(item.probeSensorData,'temperatureExtend1')}}/{{EleVoList(item.probeSensorData,'temperatureExtend2')}}°C</p></div>
                      <div><span>功率：</span><p>{{EleVoList(item.probeSensorData,'activePower')}}W</p></div>
                      <div><span>用电量：</span><p>{{EleVoList(item,'eleDay')}}度</p></div>
                    </template>
                    <template v-else>
                      <div><span>电压：</span><p>--</p></div>
                      <div><span>温度：</span><p>--</p></div>
                      <div><span>功率：</span><p>--</p></div>
                      <div><span>用电量：</span><p>--</p></div>
                    </template>
                    </div>
                    </template>
                    <!--6100C-->
                    <template v-if="[25].includes(item.targetCategoryId)" >
                      <!--  -->
                      <div class="monitor_6100">
                       
                        <template v-if="item.probeEleVoList">
                          <div><span>电压：</span><p>
                          {{EleVoList(item.probeEleVoList[0],'voltage')}}/{{EleVoList(item.probeEleVoList[1],'voltage')}}/{{EleVoList(item.probeEleVoList[2],'voltage')}}V</p></div>
                          <div><span>电流：</span><p>{{EleVoList(item.probeEleVoList[0],'current')}}/{{EleVoList(item.probeEleVoList[1],'current')}}/{{EleVoList(item.probeEleVoList[2],'current')}}A</p></div>                          
                          <div><span>温度：</span><p>{{EleVoList(item.probeEleVoList[0],'temperature')}}/{{EleVoList(item.probeEleVoList[1],'temperature')}}/{{EleVoList(item.probeEleVoList[2],'temperature')}}°C</p></div>
                          <div><span>功率：</span><p>{{EleVoList(item.probeEleVoList[0],'power')}}/{{EleVoList(item.probeEleVoList[1],'power')}}/{{EleVoList(item.probeEleVoList[2],'power')}}kW</p></div>
                        </template>
                        <template v-else>
                          <div><span>电压：</span><p>--/--/--</p></div>
                          <div><span>电流：</span><p>--/--/--</p></div>
                          <div><span>温度：</span><p>--/--/--</p></div>
                          <div><span>功率：</span><p>--/--/--</p></div>
                        </template>
                      </div>
                    </template>
                    <!--红外抄表-->
                     <template  v-if="[42].includes(item.targetCategoryId)">
                    <div class="monitor_6100">
                      <template v-if="item.probeEleVoList">
                        <template v-if="item.programData &&item.programData.phaseType == 1">
                          <div><span>电压：</span><p>
                      {{EleVoList(item.probeEleVoList[0],'voltage')}}/{{EleVoList(item.probeEleVoList[1],'voltage')}}/{{EleVoList(item.probeEleVoList[2],'voltage')}}V</p></div>
                   
                      <div><span>当日：</span><p>{{EleVoList(item.probeEleVoList[0],'eleDay')}}/{{EleVoList(item.probeEleVoList[1],'eleDay')}}/{{EleVoList(item.probeEleVoList[2],'eleDay')}}度</p></div>
                      <div><span>当月：</span><p>{{EleVoList(item.probeEleVoList[0],'eleMonth')}}/{{EleVoList(item.probeEleVoList[1],'eleMonth')}}/{{EleVoList(item.probeEleVoList[2],'eleMonth')}}度</p></div>
                      <div><span>倍率：</span><p>{{EleVoList(item,'transformerCoefficient')}}</p></div>
                        </template>
                        <template v-else>
                          <div><span>电压：</span><p>
                      {{EleVoList(item.probeEleVoList[0],'voltage')}}V</p></div>
                   
                      <div><span>功率：</span><p>{{EleVoList(item.probeEleVoList[0],'power')}}kW</p></div>
                      <div><span>当日：</span><p>{{EleVoList(item.probeEleVoList[0],'eleDay')}}度</p></div>
                      <div><span>当月：</span><p>{{EleVoList(item.probeEleVoList[0],'eleMonth')}}度</p></div>
                      <div><span>倍率：</span><p>{{EleVoList(item,'transformerCoefficient')}}</p></div>
                        </template>
                    </template>
                    <template v-else>
                      <template v-if="item.programData&&item.programData.phaseType == 1">
                      <div><span>电压：</span><p>--/--/--</p></div>
                      <div><span>功率：</span><p>--/--/--</p></div>
                      <div><span>用电量：</span><p>--</p></div>
                      </template>
                       <template v-else>
                        <div><span>电压：</span><p>--</p></div>
                        <div><span>功率：</span><p>--</p></div>
                         <div><span>用电量：</span><p>--</p></div>
                       </template>
                    </template>
                    </div>
                    </template>
                  </div>
                </div>
                <div v-if="![25,44,42].includes(item.targetCategoryId)&&( (item.probeMoldCode== 39 && item.state == 0) || item.probeMoldCode != 39)"  class="datalist-time" :title="'最后控制时间：'+ item.lastOnOffTime"
                  :style="(item.targetCategoryId==1 ||item.targetCategoryId==13 || item.targetCategoryId==15) && item.state==1 ?'display:none':''">
                  {{item.targetCategoryId==19 || item.targetCategoryId==37?'最后上报时间':'最后上报时间'}}：{{ item.lastOnOffTime | probeTypetime }}[{{item.Distancetime}}]
                  <!--  <span>温度:{{ item.airTemperatureset}}℃</span>-->
                </div>
                <div v-if="item.probeMoldCode== 39 && item.state == 1" class="curtain-class curtain39">
                      <el-slider v-model="item.brightness" @change="switchChange($event, item)"></el-slider>
                </div>
                <div class="datalist-aircond"
                  v-if="(item.targetCategoryId==1 ||item.targetCategoryId==13 || item.targetCategoryId==15) &&item.state==1">
                 <span>模式:{{ item.airMode | airModeFilter(item.targetCategoryId) }}</span><span>风速:{{ item.airSpeed | airSpeedFilter(item.targetCategoryId)
                  }}</span><span  :style="item.targetCategoryId!=15?'':'display:none'">风向:{{ item.airWindDirection == 1 ? "手动" : "自动" }}</span>
                </div>
                <div class="datalist-btn-row">
                  
                  <el-button v-if="![44].includes(item.targetCategoryId) " type="primary"  round size="mini" @click="chnnelDetails(item)">详情</el-button>
                  <el-button :style="['36','48'].includes(item.probeMoldCode)?'' : 'display:none'" type="primary" round size="mini"
                    @click="ceilingfanruntimeChange(item)">最长开启时间</el-button>

                  <el-button v-if="item.targetCategoryId == 12 && usermanager!=0  && controlPermission" type="primary"
                    round size="mini" @click="LoraPersonList(item.probeId)">门锁控制</el-button>
                  <el-button v-if="item.targetCategoryId == 12 && usermanager==0  && controlPermission" type="primary"
                    round size="mini" @click="setUserPersonPWlits(item.probeId)">密码管理</el-button>
                  <el-button v-if="[1,13,15,19,25,37,38,39,8,35,23,26,27,41,42,44,48,49,50,51,53,55].includes(item.targetCategoryId) || ([2].includes(item.targetCategoryId) && item.openingTimeInfo) ||['28','38','43','29','34'].includes(item.probeMoldCode)"
                    type="primary" round size="mini" @click="ClickActive(item,index)">状态</el-button>
                  <el-button v-if="item.targetCategoryId == 1  && controlPermission" type="primary" round size="mini"
                    @click="airControl(item)">遥控器</el-button>
                  <el-button  v-if="item.targetCategoryId==13 && controlPermission " type="primary" round size="mini"
                    @click="center_airControl(item)">遥控器</el-button>
                  <el-button v-if="item.targetCategoryId==15 && controlPermission " type="primary" round size="mini"
                    @click="cascade_airControl(item)">遥控器</el-button>
                   <el-button v-if="[49,51].includes(item.targetCategoryId)" type="primary" round size="mini"
                    @click="handleMicrowaveSound(item)">语音列表</el-button>
                    <el-button type="primary" v-if="dataStatisticsShow(item.targetCategoryId) || ['54'].includes(item.probeMoldCode)"  round size="mini" @click="getProbeSensorDataByTime(item)">{{['54'].includes(item.probeMoldCode)?'用电监测':'数据监测'}}</el-button>
                </div>
                 <!--水表-->
                  <div v-if="[48,53,55].includes(item.targetCategoryId)"
                  class="detali-state-row waterstate-row"
                  :class="item.active ? 'detailstateshow' : ''">
                  <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row">
                  
                     <template v-if="[1,2].includes(item?.extendInfo?.waterMeterType) && [55,53].includes(item.targetCategoryId)">
                    <div class="detailstate-box" style="width:100%">
                   
                    <span>满量程({{ item?.extendProperty?.maxWaterPressure ? item.extendProperty.maxWaterPressure + ([1].includes(item?.extendInfo?.waterMeterType)?'MPa':'米'): '--' }})：</span>
                      <div>
                        <span class="detailstate-text">{{item?.extendInfo?.waterPressure ? ((item.extendInfo.waterPressure)/ 10).toFixed(1): '--'}}%</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%">
                   
                    <span>{{[1].includes(item?.extendInfo?.waterMeterType)?'压强':'液位'}}：</span>
                      <div>
                        <span class="detailstate-text">{{waterMeterPressure(item)}}{{[1].includes(item?.extendInfo?.waterMeterType)?'MPa':'米'}}</span>
                      </div>
                    </div>
                      
                      </template>
                       <template v-else>
                          <div class="detailstate-box" style="width:100%">
                      
                    <span>水表读数：</span>
                      <div>
                        <span class="detailstate-text">{{ item?.extendInfo?.cumulativeCount ? (item.extendInfo.cumulativeCount / 1000).toFixed(3) : '--'}}吨</span>
                      </div>
                    </div>
                      </template> 
                      <div class="detailstate-box" style="width:100%">
                   
                    <span>设备温度：</span>
                      <div>
                        <span class="detailstate-text">{{item?.extendInfo?.deviceTemperature ? (item.extendInfo.deviceTemperature) : '--'}}℃</span>
                      </div>
                    </div>
                     <div class="detailstate-box" style="width:100%">
                      
                    <span>电池电压：</span>
                      <div>
                        <span class="detailstate-text">{{item?.extendInfo?.batteryVoltage ? (item.extendInfo.batteryVoltage / 1000).toFixed(2) : '--'}}V</span>
                      </div>
                    </div>
                       <template v-if="![1,2].includes(item?.extendInfo?.waterMeterType)|| item.targetCategoryId==48">
                    <div class="detailstate-box" style="width:100%">
                      
                    <span>当日用水量：</span>
                      <div>
                          <span class="detailstate-text">{{ (Number(item.eleDay) / 1000).toFixed(3)}}吨</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%">
                      
                    <span>当月用水量：</span>
                      <div>
                          <span class="detailstate-text">{{ (Number(item.eleMonth) / 1000).toFixed(3)}}吨</span>
                      </div>
                    </div>
                    </template>
                  </div>
                  </div>
                  <!--烟感-->
                  <div v-if="item.targetCategoryId==38"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row infrared-box">
                    
                      <div class="detailstate-box">
                        <span>当前：</span>
                        <div>
                          <p>{{item.groundingAlarm !=null && JSON.parse(item.groundingAlarm).smokeState==1?'烟雾报警':'正常'}}</p>
                        </div>
                      </div>
                      <div class="detailstate-box ">
                        <span>电压：</span>
                        <div>
                          <p>{{item.currVoltage!=null?item.currVoltage:'--'}}mV</p>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>烟雾浓度：</span>
                        <div>
                          <p>{{item.probeSensorData!=null && item.probeSensorData.smokeConcentration && item.probeSensorData.smokeConcentration!=255?item.probeSensorData.smokeConcentration:'--'}}%</p>
                        </div>
                      </div>
                     
                      <div class="detailstate-box">
                        <span>温度：</span>
                        <div>
                          <p>{{item.probeSensorData!=null && item.probeSensorData.temperature && item.probeSensorData.temperature!=255?item.probeSensorData.temperature:'--'}}°C</p>
                        </div>
                      </div>
                    
                     
                       
                     
                      
                       <div class="detailstate-box" style="width:100%"  >
                        <span>最后上报时间：</span>
                        <div>
                          <p>{{ item.lastOnOffTime| probeTypetime }}</p>
                        </div>
                      </div>
                    </div>
                </div>
                 <!--门磁-->
                 <div v-if="[39,50].includes(item.targetCategoryId)"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row infrared-box">
                    <template v-if="[39].includes(item.targetCategoryId)">
                      <div class="detailstate-box">
                        <span>当前：</span>
                        <div>
                          <p>{{item.groundingAlarm !=null && JSON.parse(item.groundingAlarm).doorState==1?'门开':'门关'}}</p>
                        </div>
                      </div>
                    </template>
                      <div class="detailstate-box ">
                        <span>电压：</span>
                        <div>
                          <p>{{item.lockBattery!=null?(item.lockBattery/1000).toFixed(2):'--'}}V</p>
                        </div>
                      </div>
                       <template v-if="[39].includes(item.targetCategoryId)">
                      <div class="detailstate-box">
                        <span>湿度：</span>
                        <div>
                          <p>{{item.probeSensorData!=null && item.probeSensorData.humidity&&item.probeSensorData.humidity != 255 ? item.probeSensorData.humidity + '%' : '--'}}</p>
                        </div>
                      </div>
                      </template>
                      <div class="detailstate-box"  style="width:100%">
                        <span>本机温度：</span>
                        <div>
                          <p>{{item.probeSensorData!=null && item.probeSensorData.temperature != null &&item.probeSensorData.temperature != 255?item.probeSensorData.temperature:'--'}}°C</p>
                        </div>
                      </div>
                    
                      <div class="detailstate-box" style="width:100%">
                        <span>扩展温度1：</span>
                        <div>
                          <p>{{item.probeSensorData!=null && item.probeSensorData.temperatureExtend1 != null && ![3276.7,255,65535].includes(Math.abs(item.probeSensorData.temperatureExtend1)) ?Math.abs(item.probeSensorData.temperatureExtend1):'--'}}°C</p>
                        </div>
                      </div>
                      <!-- <div class="detailstate-box" style="width:100%">
                        <span>扩展温度2：</span>
                        <div>
                          <p>{{item.probeSensorData.temperatureExtend2 != null &&item.probeSensorData.temperatureExtend2 != 255?item.probeSensorData.temperatureExtend2:'--'}}°C</p>
                        </div>
                      </div> -->
                       
                     
                      
                       <div class="detailstate-box" style="width:100%"  >
                        <span>最后上报时间：</span>
                        <div>
                          <p>{{ item.lastOnOffTime| probeTypetime }}</p>
                        </div>
                      </div>
                    </div>
                </div>
                 <!--红外状态-->
                <div v-if="[19,37,41,49,51].includes(parseInt(item.targetCategoryId)) "
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row infrared-box">
                      <!--<div class="detailstate-box ">
                        <span>电压：</span>
                        <div>
                          <p>{{item.currVoltage!=null?(parseInt(item.currVoltage)/ 1000).toFixed(2):'--'}}V</p>
                        </div>
                      </div>-->
                      <div class="detailstate-box" v-if="[19,37].includes(parseInt(item.targetCategoryId))">
                        <span>温度：</span>
                        <div>
                          <p>{{item.realtimeTemperature != null &&item.realtimeTemperature != 255?item.realtimeTemperature:'--'}}°C</p>
                        </div>
                      </div>
                        <div class="detailstate-box " v-if="item.targetCategoryId==37">
                        <span>湿度：</span>
                        <div>
                          <p>{{item.humidity&& ![255,-1].includes(Number(item.humidity)) ? item.humidity + '%' : '--'}}</p>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%"  v-if="[41].includes(parseInt(item.targetCategoryId))">
                        <span>环境亮度：</span>
                        <div>
                          <p>{{item.probeSensorData !=null&&item.probeSensorData.brightness!=null?item.probeSensorData.brightness:'--'}}%</p>
                        </div>
                      </div>
                       <div class="detailstate-box " v-if="[37,51].includes(item.targetCategoryId)">
                        <span>亮度：</span>
                        <div>
                          <p>{{item.brightness&&item.brightness != 255 ? item.brightness + '%' : '--'}}</p>
                        </div>
                      </div>
                      <div class="detailstate-box" v-if="[19,37].includes(parseInt(item.targetCategoryId))">
                        <span>信号：</span>
                        <div>
                          <p>{{item.intensity != null?item.intensity :'--'}}%</p>
                        </div>
                      </div>
                     <template v-if="![51].includes(parseInt(item.targetCategoryId))">
                      <div class="detailstate-box">
                        <span>有人次数：</span>
                        <div>
                          <p>{{item.accessTimes == undefined || item.accessTimes == null ? '--' : item.accessTimes}}</p>
                        </div>
                      </div>
                       <div class="detailstate-box" :style="[41].includes(parseInt(item.targetCategoryId))?'width:100%':''">
                        <span>当前：</span>
                        <div>
                          <p>{{item.lastEventCode==48?'有人':'无人'}}({{item.Distancetime}})</p>
                        </div>
                      </div>
                      <div  class="detailstate-box" style="width:100%" v-if="item.probeMoldCode=='152'">
                        <span>当前人数：</span>
                        <div>
                          <p>{{item.detectionTimeInfo?.personnelDetectionCount??'--'}}</p>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%">
                        <span>有人：</span>
                        <div>
                          <p>{{Timeduration(item.somebodyTime)}}({{Tiemproportionf(item.somebodyTime,item.nobodyTime)}}%)</p>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%">
                        <span>无人：</span>
                        <div>
                          <p>{{Timeduration(item.nobodyTime)}}({{Tiemproportionf(item.nobodyTime,item.somebodyTime)}}%)</p>
                        </div>
                      </div>
                     </template>
                       <div class="detailstate-box" style="width:100%">
                        <span>最后上报时间：</span>
                        <div>
                          <p>{{ item.lastOnOffTime| probeTypetime }}</p>
                        </div>
                      </div>
                    </div>
                </div>
                <!--灯光状态-->
                <div v-if="[2].includes(item.targetCategoryId) && item.openingTimeInfo"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                  <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                  <div class="detailstate-row">
                   
                    

                    <div class="detailstate-box" style="width:100%">
                      <span>当日开启：</span>
                      <div>
                        <span class="detailstate-text">{{Timeduration(item.openingTimeInfo && item.openingTimeInfo.daySeconds?item.openingTimeInfo.daySeconds:0)}}</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%">
                      <span>当月开启：</span>
                      <div>
                        <span class="detailstate-text">{{Timedurationday(item.openingTimeInfo && item.openingTimeInfo.monthSeconds ?item.openingTimeInfo.monthSeconds:0)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                  <!--计量设备状态-->
                <div v-if="['28','38','43','29'].includes(item.probeMoldCode)"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                  <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                  <div class="detailstate-row">
                   
                    

                    <div class="detailstate-box">
                      <span>电压：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{item.currVoltage | tofixeUpperCase()}}V</span>
                      </div>
                    </div>
                    <div class="detailstate-box">
                      <span>电流：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{item.currCurrent?(parseFloat(item.currCurrent)/ 1000).toFixed(3):'--'}}A</span>
                      </div>
                    </div>
                    <div class="detailstate-box" v-if="![52].includes(item.targetCategoryId)">
                      <span>温度：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{item.realtimeTemperature?parseFloat(item.realtimeTemperature).toFixed(0):'--'}}℃</span>
                      </div>
                    </div>
                    <div class="detailstate-box">
                      <span>功率：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{item.currPower?parseFloat(item.currPower).toFixed(0):'--'}}W</span>
                      </div>
                    </div>
                 
                    <div class="detailstate-box"  style="width:100%">
                      <span>当日用电量：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{ (Number(item.eleDay) / 1000).toFixed(2) }} 度 </span>
                      </div>
                    </div>
                    <div class="detailstate-box"  style="width:100%">
                      <span>当月用电量：</span>
                      <div>
                        <!-- <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span> -->
                        <span class="detailstate-text">{{ (Number(item.eleMonth) / 1000).toFixed(2) }} 度 </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.targetCategoryId==42 "
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row detailstate-monitor-row">
                      <div class="detailstate-box"  style="width:100%">
                        <span>{{item.programData&&item.programData.phaseType==1?'三':'单'}}相电 数据{{item.programData&& item.programData.isEncrypted?'加密':'未加密' }}</span>
                      </div>
                      <div class="detailstate-box">
                        <span>电压：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                            <p>{{EleVoList(item.probeEleVoList[0],'voltage')}}/{{EleVoList(item.probeEleVoList[1],'voltage')}}/{{EleVoList(item.probeEleVoList[2],'voltage')}}V</p>
                          </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                       <div class="detailstate-box">
                        <span>电流：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'current')}}/{{EleVoList(item.probeEleVoList[1],'current')}}/{{EleVoList(item.probeEleVoList[2],'current')}}A</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                     
                       <!-- <div class="detailstate-box">
                        <span>功率因数：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'powerFactor')}}/{{EleVoList(item.probeEleVoList[1],'powerFactor')}}/{{EleVoList(item.probeEleVoList[2],'powerFactor')}}%</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div> -->
                       <div class="detailstate-box">
                        <span>功率：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'power')}}/{{EleVoList(item.probeEleVoList[1],'power')}}/{{EleVoList(item.probeEleVoList[2],'power')}}kW</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                     
            
                      <div class="detailstate-box">
                        <span>当日：</span>
                        <div><template v-if="item.probeEleVoList">
                        
                     
                          <p>{{EleVoList(item.probeEleVoList[0],'eleDay')}}/{{EleVoList(item.probeEleVoList[1],'eleDay')}}/{{EleVoList(item.probeEleVoList[2],'eleDay')}}度</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>当月：</span>
                        <div><template v-if="item.probeEleVoList">
                        
                     
                          <p>{{EleVoList(item.probeEleVoList[0],'eleMonth')}}/{{EleVoList(item.probeEleVoList[1],'eleMonth')}}/{{EleVoList(item.probeEleVoList[2],'eleMonth')}}度</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>读数：</span>
                        <div><template v-if="item.probeEleVoList">
                        
                     
                          <p>{{EleVoList(item.probeEleVoList[0],'electricity',item)}}/{{EleVoList(item.probeEleVoList[1],'electricity',item)}}/{{EleVoList(item.probeEleVoList[2],'electricity',item)}}度</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box"  style="width:100%">
                        <span>倍率：</span>
                        <div>{{EleVoList(item,'transformerCoefficient')}}</div>
                      </div>
                      
                      <div class="detailstate-box"  style="width:100%">
                        <span>电表表号：</span>
                        <div>{{item.programData?item.programData.meterNumber:'--'}}</div>
                      </div>
                    </div>
                </div>
                <!--6100A状态-->
                <div v-if="[44].includes(item.targetCategoryId)"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row detailstate-monitor-row">
                      <div class="detailstate-box">
                        <span>电压：</span>
                        <div>
                          <template v-if="item.probeSensorData">
                            <p>{{EleVoList(item.probeSensorData,'voltage')}}V</p>
                          </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                       <div class="detailstate-box">
                        <span>电流：</span>
                        <div>
                          <template v-if="item.probeSensorData">
                          <p>{{EleVoList(item.probeSensorData,'current')}}A</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                    
                       
                       <div class="detailstate-box">
                        <span>功率：</span>
                        <div><template v-if="item.probeSensorData">
                          <p>{{EleVoList(item.probeSensorData,'activePower')}}W</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>功率因数：</span>
                        <div>
                          <template v-if="item.probeSensorData">
                            <p>{{EleVoList(item.probeSensorData,'powerFactor')}}%</p>
                          </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
            
                      <div class="detailstate-box">
                        <span>当日：</span>
                        <div><template v-if="item">
                          <p>{{EleVoList(item,'eleDay')}}度</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>当月：</span>
                        <div><template v-if="item">
                          <p>{{EleVoList(item,'eleMonth')}}度</p>
                        </template>
                          <template v-else>
                             <p>--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" >
                        <span>火线温度：</span>
                        <div><template v-if="item.probeSensorData">
                          <p>{{EleVoList(item.probeSensorData,'temperatureExtend1')}}/{{EleVoList(item.probeSensorData,'temperatureExtend3')}}°C</p>
                        </template>
                          <template v-else>
                             <p>--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>零线温度：</span>
                        <div><template v-if="item.probeSensorData">
                          <p>{{EleVoList(item.probeSensorData,'temperatureExtend2')}}/{{EleVoList(item.probeSensorData,'temperatureExtend4')}}°C</p>
                        </template>
                          <template v-else>
                            <p>--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%"  v-if="item.probeMoldCode==34">
                        <span>本次开启：</span>
                        <div>
                          <span class="detailstate-text">{{TimedurationOne_Probe(item.openingTimeInfo?item.openingTimeInfo.oneTimeOpenSeconds:0,item)}}</span>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%"  v-if="item.probeMoldCode==34">
                        <span>当日开启：</span>
                        <div>
                          <span class="detailstate-text">{{Timeduration_Probe(item.openingTimeInfo&&item.openingTimeInfo.daySeconds?item.openingTimeInfo.daySeconds:0,item)}}</span>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%" v-if="item.probeMoldCode==34" >
                        <span>当月开启：</span>
                        <div>
                          <span class="detailstate-text">{{Timedurationday_Probe(item.openingTimeInfo && item.openingTimeInfo.monthSeconds?item.openingTimeInfo.monthSeconds:0,item)}}</span>
                        </div>
                      </div>
                      
                    </div>
                </div>
                <!--6100C状态-->
                <div v-if="[25,20].includes(item.targetCategoryId)"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                    <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                    <div class="detailstate-row detailstate-monitor-row">
                      <div class="detailstate-box">
                        <span>电压：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                            <p>{{EleVoList(item.probeEleVoList[0],'voltage')}}/{{EleVoList(item.probeEleVoList[1],'voltage')}}/{{EleVoList(item.probeEleVoList[2],'voltage')}}V</p>
                          </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                       <div class="detailstate-box">
                        <span>电流：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'current')}}/{{EleVoList(item.probeEleVoList[1],'current')}}/{{EleVoList(item.probeEleVoList[2],'current')}}A</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" v-if="item.probeMoldCode!='34'">
                        <span>剩余电流：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[5],'residualCurrent')}}/{{EleVoList(item.probeEleVoList[6],'residualCurrent')}}A</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                       <div class="detailstate-box">
                        <span>功率因数：</span>
                        <div>
                          <template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'powerFactor')}}/{{EleVoList(item.probeEleVoList[1],'powerFactor')}}/{{EleVoList(item.probeEleVoList[2],'powerFactor')}}%</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                       <div class="detailstate-box">
                        <span>功率：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'power')}}/{{EleVoList(item.probeEleVoList[1],'power')}}/{{EleVoList(item.probeEleVoList[2],'power')}}<template v-if="[25].includes(item.targetCategoryId)">/{{EleVoList(item.probeEleVoList[3],'power')}}</template>kW</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>温度：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'temperature')}}/{{EleVoList(item.probeEleVoList[1],'temperature')}}/{{EleVoList(item.probeEleVoList[2],'temperature')}}°C</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
            
                      <div class="detailstate-box">
                        <span>当日：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'eleDay')}}/{{EleVoList(item.probeEleVoList[1],'eleDay')}}/{{EleVoList(item.probeEleVoList[2],'eleDay')}}度</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box">
                        <span>当月：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[0],'eleMonth')}}/{{EleVoList(item.probeEleVoList[1],'eleMonth')}}/{{EleVoList(item.probeEleVoList[2],'eleMonth')}}度</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:50%"  v-if="item.probeMoldCode!='34'">
                        <span>本机温度：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[3],'temperature')}}°C</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:50%"  v-if="item.probeMoldCode!='34'">
                        <span>零线温度：</span>
                        <div><template v-if="item.probeEleVoList">
                          <p>{{EleVoList(item.probeEleVoList[4],'temperature')}}°C</p>
                        </template>
                          <template v-else>
                             <p>--/--/--</p>
                          </template>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%" v-if="item.probeMoldCode==34" >
                        <span>本次开启：</span>
                        <div>
                          <span class="detailstate-text">{{TimedurationOne_Probe(item.openingTimeInfo?item.openingTimeInfo.oneTimeOpenSeconds:0,item)}}</span>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%"  v-if="item.probeMoldCode==34">
                        <span>当日开启：</span>
                        <div>
                          <span class="detailstate-text">{{Timeduration_Probe(item.openingTimeInfo && item.openingTimeInfo.daySeconds?item.openingTimeInfo.daySeconds:0,item)}}</span>
                        </div>
                      </div>
                      <div class="detailstate-box" style="width:100%" v-if="item.probeMoldCode==34">
                        <span>当月开启：</span>
                        <div>
                          <span class="detailstate-text">{{Timedurationday_Probe(item.openingTimeInfo && item.openingTimeInfo.monthSeconds?item.openingTimeInfo.monthSeconds:0,item)}}</span>
                        </div>
                      </div>
                    </div>
                </div>
                <!--空调状态-->
                <div v-if="item.targetCategoryId==13 || item.targetCategoryId== 15|| item.targetCategoryId == 1"
                  class="detali-state-row"
                  :class="item.active ? 'detailstateshow' : ''">
                  <div @click="ClickActive(item,index)" class="detali-state-close"><i class="el-icon-close"></i></div>
                  <div class="detailstate-row">
                    <div class="detailstate-box" style="width:100%;justify-content:center">
                    
                      <div >
                        <span class="detailstate-text" style="display: flex;align-items: flex-start;"><font style="font-size:0.3rem">{{item.airTemperatureset}}</font><font>℃</font></span>
                      </div>
                    </div>
                    

                    <div class="detailstate-box">
                      <span>模式：</span>
                      <div>
                        <span style="display: flex;align-items: center;"
                          v-html="airModeFilterimg(item.airMode,item.targetCategoryId)"></span>
                        <span class="detailstate-text">{{ item.airMode | airModeFilter(item.targetCategoryId) }}</span>
                      </div>
                    </div>
                    <!-- <div class="detailstate-box"
                      :style="item.targetCategoryId==13 || item.targetCategoryId==15 ?'':'display:none'"> -->
                      <div class="detailstate-box">
                      <span>室温：</span>
                      <div>
                        <span class="detailstate-text">{{item.probeMoldCode ==127?
                        item.airIndoortemperature:
                        item.probeMoldCode==32?
                        item.airIndoortemperature==1 ||item.airIndoortemperature== null ?'--':item.airIndoortemperature:
                        item.isTransmission && item.probeSensorData ?Math.abs(item.probeSensorData.temperatureExtend2) < 100?item.probeSensorData.temperatureExtend2:'--':
                        [1,255].includes(Number(item.realtimeTemperature)) ||item.realtimeTemperature== null ?'--':item.realtimeTemperature}}℃</span>
                      </div>
                    </div>
                    <div class="detailstate-box">
                      <span>风速：</span>
                      <div>
                        <span style="display: flex;align-items: center;"
                          v-html="airSpeedFilterimg(item.airSpeed,item.targetCategoryId)"></span>
                        <span class="detailstate-text">{{ item.airSpeed | airSpeedFilter(item.targetCategoryId)
                        }}</span>
                      </div>
                    </div>
                    <div class="detailstate-box" v-if="item.isTransmission && item.probeSensorData">
                      <span>本机：</span>
                      <div>
                        <span class="detailstate-text">{{item.probeSensorData.temperatureExtend1}}℃</span>
                      </div>
                    </div>
                    <div class="detailstate-box" :style="item.targetCategoryId != 15? '' : 'display:none'">
                      <span>风向：</span>
                      <div>
                        <span style="display: flex;align-items: center;"
                          v-html="airSpeeddirectionimg(item.airWindDirection)"></span>
                        <span class="detailstate-text">{{ item.airWindDirection === 1 ? "手动" : "自动" }}</span>
                      </div>
                    </div>
                    <div class="detailstate-box" :style="item.targetCategoryId === 1? '' : 'display:none'">
                      <span>功率：</span>
                      <div><svg t="1662450330864" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3159" width="22" height="22"><path d="M800 544h-102.4L640 313.6c-6.4-12.8-19.2-25.6-32-25.6s-25.6 6.4-32 19.2L486.4 588.8 448 441.6c-6.4-12.8-19.2-25.6-32-25.6s-25.6 6.4-32 19.2l-51.2 108.8H224c-19.2 0-32 19.2-32 32 0 19.2 12.8 32 32 32h128c12.8 0 25.6-6.4 25.6-19.2l25.6-51.2 44.8 172.8c6.4 12.8 12.8 25.6 32 25.6 12.8 0 25.6-6.4 32-19.2l89.6-281.6 38.4 147.2c6.4 12.8 19.2 25.6 32 25.6h128c19.2 0 32-19.2 32-32 0-19.2-12.8-32-32-32z" p-id="3160" fill="#ffffff"></path><path d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512c108.8 0 211.2 32 300.8 96 12.8 12.8 19.2 32 6.4 44.8s-32 19.2-44.8 6.4C697.6 89.6 608 64 512 64 262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448c0-76.8-19.2-153.6-57.6-224-6.4-12.8-6.4-32 12.8-44.8 12.8-6.4 32-6.4 44.8 12.8 38.4 76.8 64 166.4 64 256 0 281.6-230.4 512-512 512z" p-id="3161" fill="#ffffff"></path></svg>
                        <span class="detailstate-text">{{item.currPower?item.currPower:'--'}}W</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%;justify-content:center"
                      :style="item.targetCategoryId==13?'':'display:none'">
                      <span>键盘：</span>
                      <div>
                        <span style="display: flex;align-items: center;"><svg t="1624927664867" class="icon"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5698"
                            width="24" height="24">
                            <path
                              d="M928.67 206.44H95.33A83.42 83.42 0 0 0 12 289.78v444.44a83.42 83.42 0 0 0 83.33 83.33h833.34a83.42 83.42 0 0 0 83.33-83.33V289.78a83.42 83.42 0 0 0-83.33-83.34z m27.78 527.78A27.8 27.8 0 0 1 928.67 762H95.33a27.8 27.8 0 0 1-27.78-27.78V289.78A27.8 27.8 0 0 1 95.33 262h833.34a27.8 27.8 0 0 1 27.78 27.78z"
                              p-id="5699" fill="#ffffff"></path>
                            <path
                              d="M845.33 623.11H178.67a27.78 27.78 0 0 0 0 55.56h666.66a27.78 27.78 0 0 0 0-55.56z m-666.66-83.33H262a27.78 27.78 0 1 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m194.44 0h83.33a27.78 27.78 0 0 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m194.45 0h83.33a27.78 27.78 0 0 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m277.77-55.56H762a27.78 27.78 0 1 0 0 55.56h83.33a27.78 27.78 0 0 0 0-55.56z m-666.66-83.33H262a27.78 27.78 0 1 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m194.44 0h83.33a27.78 27.78 0 0 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m194.45 0h83.33a27.78 27.78 0 0 0 0-55.56h-83.33a27.78 27.78 0 0 0 0 55.56z m277.77-55.56H762a27.78 27.78 0 1 0 0 55.56h83.33a27.78 27.78 0 0 0 0-55.56z"
                              p-id="5700" fill="#ffffff"></path>
                          </svg></span>
                        <span class="detailstate-text">{{ item.airKeyboard | airKeyFilter(item.targetCategoryId) }}</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%"  v-if="item.targetCategoryId==15">
                      <span>当日开启：</span>
                      <div>
                        <span class="detailstate-text">{{Timeduration_Probe(item.openingTimeInfo&&item.openingTimeInfo.daySeconds?item.openingTimeInfo.daySeconds:0,item)}}</span>
                      </div>
                    </div>
                    <div class="detailstate-box" style="width:100%" v-if="item.targetCategoryId==15">
                      <span>当月开启：</span>
                      <div>
                        <span class="detailstate-text">{{Timedurationday_Probe(item.openingTimeInfo&&item.openingTimeInfo.monthSeconds?item.openingTimeInfo.monthSeconds:0,item)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-pagination :style="searching?'display:none':''" @size-change="handleSizeChange"
              @current-change="handlePageChange" :current-page="currentPage" :page-sizes="[10, 20, 30]"
              :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
              style="text-align: right">
            </el-pagination>
          </div>

          <div v-show="!Electricalappliances">
            <div class="top-row" style="margin-bottom: 20px;">
              <el-button class="change_btn" type="primary" size="small" v-if="change_btn_Channel" title="切换到用电设备管理"
                @click="Electricalappliances=true"><i><svg t="1623831943639" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4422" width="18" height="18">
                    <path d="M16.275456 782.244864" p-id="4423" fill="#ffffff"></path>
                    <path
                      d="M667.128832 729.61024 667.128832 894.184448 957.792256 631.015424 667.128832 385.526784 667.128832 525.357056 395.318272 525.357056 395.318272 729.61024Z"
                      p-id="4424" fill="#ffffff"></path>
                    <path
                      d="M326.972416 581.523456 326.972416 457.801728 599.568384 457.801728 599.568384 253.546496 326.972416 253.546496 326.972416 126.67904 67.731456 358.812672Z"
                      p-id="4425" fill="#ffffff"></path>
                    <path d="M977.830912 782.244864" p-id="4426" fill="#ffffff"></path>
                  </svg></i>
                <span>用电设备管理</span>
              </el-button>
              <div class="data-total-row2" style="margin-bottom: 0px;"
                :style="change_btn_Channel?'width:calc(100% - 170px)':'width:calc(100% - 30px)'">
                <div class="data-total-box">
                  <div class="data-total-infos">当前区域：{{this.$store.getters.areatitle}}</div>
                  <div class="data-total-infos" v-for="(item,index) in chargetypeselect" :key="index"
                    :style="chargeprobeTypeTotalop(item.id)?'':'display:none'">
                    <span style="display: flex;align-items: center;width: 24px;"
                      v-html="chargeprobeTypeFilterimg(item.id)"></span>
                    <span class="data-total-title">{{item.name}}</span>
                    <div v-html="chargeprobeTypeTotal(item.id)"></div>
                  </div>
               
                  <div class="data-total-infos">
                    温度范围：<font class="inuseClass">{{minst}}℃</font> ~ <font class="inuseClass">{{maxst}}℃</font>
                  </div>
                  <div class="data-total-infos">
                    功率(kW)：<font class="inuseClass">{{(probeDataAllpower / 1000) | tofixeUpperCase()}}</font>
                  </div>
                </div>
                <div class="tl-corner"></div>
                <div class="tr-corner"></div>
                <div class="bl-corner"></div>
                <div class="br-corner"></div>
              </div>

            </div>
            <div class="datalist-row">
              <div class="datalist-pile-box" v-for="(item, index) in probe_tableData" :key="item.probe_id">
                <div :class="usermanager==2?'polling_btn':'polling_hide'" style="width:10px;height:10px"
                  @click.stop="OldChargingsocketSWpolling(item,batteryNameCode(item.channelName))"></div>
                <div class="datalist-pile-setup" title="设定阈值" @click='datalistsetup(item)' v-show="usermanager>0"><svg
                    t="1623394901953" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="10310" width="18" height="18">
                    <path
                      d="M416.536774 33.296516c60.482065-11.230968 123.375484-11.230968 185.244903 0.825807a186.103742 186.103742 0 0 0 93.481291 164.005161 186.103742 186.103742 0 0 0 188.779355-1.024 496.408774 496.408774 0 0 1 93.349161 160.008258 181.644387 181.644387 0 0 0-95.198968 160.933161c0.330323 69.565935 39.506581 130.34529 96.949678 161.957162a486.433032 486.433032 0 0 1-91.796646 158.984258c-56.088774-33.957161-128.29729-37.458581-188.746322-2.972904a181.644387 181.644387 0 0 0-91.763613 162.915097c-60.482065 11.197935-123.375484 11.230968-185.244903-0.858839a186.103742 186.103742 0 0 0-93.481291-164.005161 186.103742 186.103742 0 0 0-188.779354 1.057032 496.408774 496.408774 0 0 1-93.349162-160.008258 181.644387 181.644387 0 0 0 95.198968-160.933161c-0.330323-69.598968-39.506581-130.34529-96.98271-161.957161 9.909677-28.605935 22.693161-56.683355 38.383484-83.868903A486.433032 486.433032 0 0 1 136.026839 193.23871c56.088774 33.957161 128.29729 37.491613 188.746322 3.005935a181.644387 181.644387 0 0 0 91.763613-162.915097z m3.369291 641.816774c88.856774 51.299097 201.992258 21.702194 252.696774-66.097548 50.671484-87.799742 19.75329-200.571871-69.136516-251.904-88.856774-51.299097-201.992258-21.702194-252.696775 66.064516-50.704516 87.832774-19.75329 200.604903 69.136517 251.904z"
                      p-id="10311" fill="#ffffff"></path>
                  </svg></div>
                  <div class="setBtn-row">
                <div class="datalist-pile-event" title="查看事件" @click='getBatteryEvent(item)'><svg t="1624587717048"
                    class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11059"
                    width="18" height="18">
                    <path
                      d="M926 164H94c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V196c0-17.7-14.3-32-32-32z m-40 632H134V236h752v560z m-658.9-82.3c3.1 3.1 8.2 3.1 11.3 0l172.5-172.5 114.4 114.5c3.1 3.1 8.2 3.1 11.3 0l297-297.2c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8c-3.1-3.1-8.2-3.1-11.3 0L531 565 416.6 450.5c-3.1-3.1-8.2-3.1-11.3 0l-214.9 215c-3.1 3.1-3.1 8.2 0 11.3l36.7 36.9z"
                      p-id="11060" fill="#ffffff"></path>
                  </svg></div>
                
                <div  class="datalist-pile-Refreshsocket" :class="item.refresh ? 'Refreshanimation' : ''" title="重新采集"
                  @click='Refreshsocket(item)'><svg t="1624518605167" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4716" width="18" height="18">
                    <path
                      d="M499.72 872.52c-179.31 0-325.19-143.88-325.19-320.75 0-176.84 145.88-320.72 325.19-320.72 54.31 0 108.12 13.5 155.62 39.03 23.31 12.56 32.06 41.69 19.5 65.03-12.44 23.38-41.56 32.12-65 19.53-33.56-18.06-71.62-27.59-110.12-27.59-126.38 0-229.19 100.81-229.19 224.72 0 123.94 102.81 224.75 229.19 224.75 104.5 0 195.75-69.22 221.87-168.31 6.81-25.62 33.12-40.88 58.69-34.16 25.62 6.78 40.94 33.03 34.19 58.66-37.32 141.18-166.75 239.81-314.75 239.81z"
                      fill="#ffffff" p-id="4717"></path>
                    <path
                      d="M799.24 407.04l-89.26-228.19c-6.2-15.85-27.38-18.78-37.64-5.2l-154.62 204.6c-10.26 13.58-1.67 33.16 15.27 34.8l243.89 23.59c16.15 1.57 28.27-14.48 22.36-29.6z"
                      fill="#ffffff" p-id="4718"></path>
                  </svg>
              </div>
                <div class="datalist-pile-status-box" v-show="item.eleState > 1">
                  <i><svg t="1623290843113" class="icon" viewBox="0 0 1168 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="57172" width="18" height="18">
                      <path
                        d="M1163.056049 958.807834L622.105947 21.779109a43.461444 43.461444 0 0 0-75.333169 0L5.822676 958.807834a43.461444 43.461444 0 0 0 37.666584 65.192166h1081.900205a43.461444 43.461444 0 0 0 37.666584-21.730722 43.461444 43.461444 0 0 0 0-43.461444zM118.822429 937.077113L584.439363 130.432718l465.761804 806.644395z"
                        p-id="57173" fill="#e60000"></path>
                      <path
                        d="M566.330428 733.967299a49.98066 49.98066 0 0 0-52.733219 52.153733 51.574246 51.574246 0 0 0 14.487148 36.507612 52.588347 52.588347 0 0 0 37.521713 14.487148 49.111431 49.111431 0 0 0 35.20377-14.487148 50.415275 50.415275 0 0 0 14.487148-36.942227 54.037062 54.037062 0 0 0-14.487148-37.666584 48.097331 48.097331 0 0 0-34.479412-14.052534zM521.565141 420.175676a30.857625 30.857625 0 0 0-14.487148 26.801224 260.768662 260.768662 0 0 0 14.487148 71.421639 864.0135 864.0135 0 0 1 21.440979 91.269031 876.907062 876.907062 0 0 1 10.865361 95.03569h24.048665q4.056401-51.719118 11.73459-97.353633a777.090613 777.090613 0 0 1 19.992264-88.951088c4.92563-17.964063 8.547417-32.596083 11.010232-43.461444a131.688174 131.688174 0 0 0 3.621787-27.670453q0-35.928127-57.948591-36.507612A81.417771 81.417771 0 0 0 521.565141 420.175676z"
                        p-id="57174" fill="#e60000"></path>
                    </svg></i>
                  <span style="color:#e60000; padding-left: 5px;width: 50px;">{{batteryStatetext(item.eleState)}}</span>
                </div>
                </div>
                <div class="datalist-pile-dosage">
                  <i>
                    <svg t="1624590710628" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="24666" width="15" height="15">
                      <path
                        d="M469.333333 365.738667a42.666667 42.666667 0 1 0 85.333334 0V259.982222a42.666667 42.666667 0 1 0-85.333334 0V365.795556zM395.889778 395.889778a42.666667 42.666667 0 0 1-60.302222 0L260.778667 321.194667a42.666667 42.666667 0 0 1 60.302222-60.359111L395.946667 335.530667a42.666667 42.666667 0 0 1 0 60.302222zM688.469333 395.889778a42.666667 42.666667 0 1 1-60.302222-60.302222l74.638222-74.752a42.666667 42.666667 0 1 1 60.302223 60.302222L688.526222 395.946667z"
                        p-id="24667" fill="#ffffff"></path>
                      <path
                        d="M67.072 268.174222A201.159111 201.159111 0 0 1 268.174222 67.128889h487.651556a201.159111 201.159111 0 0 1 201.102222 201.102222v487.651556a201.159111 201.159111 0 0 1-201.102222 201.102222H268.174222a201.159111 201.159111 0 0 1-201.102222-201.102222V268.174222zM268.174222 152.462222A115.825778 115.825778 0 0 0 152.462222 268.174222v420.579556h286.72a72.817778 72.817778 0 0 1 18.261334-42.552889L512 455.111111l54.613333 191.032889c10.24 11.548444 16.952889 26.339556 18.261334 42.666667h286.72V268.117333a115.825778 115.825778 0 0 0-115.768889-115.768889H268.174222z m0 719.189334h487.651556a115.825778 115.825778 0 0 0 114.346666-97.507556H153.827556a115.825778 115.825778 0 0 0 114.346666 97.507556z"
                        p-id="24668" fill="#ffffff"></path>
                    </svg>
                  </i>
                  <span :class="batteryClass(item)">{{batteryAt(item)}}度</span>
                </div>
                <div class="datalist-pile-last_online_time"  @dblclick="handleDebug(item)">最后通讯时刻:{{item.lastOnOffTime| probeTypetime}} </div>
                <div class="datalist-pile-number" style="cursor: pointer;"
                  @click='datalistswsetup(item,batteryNameCode(item.channelName))' title="开关控制"
                  :class="batteryClass(item)">
                  <svg v-show="item.state== 1 || item.state==1" class="pile-num" width="100%" height="40"><text
                      :style="batteryNameCode(item.channelName) > 100 ?'font-size: 17px;':''" text-anchor="middle"
                      x="50%" y="80%" class="text">{{batteryNameCode(item.channelName)}}</text></svg>
                  <div v-show="item.state== 0 && item.state!=1"
                    :style="batteryNameCode(item.channelName) > 100 ?'font-size: 17px;':''">
                    {{batteryNameCode(item.channelName)}}</div>
                  <div v-show="item.state > 1" style="color:#e60000"
                    :style="batteryNameCode(item.channelName) > 100 ?'font-size: 17px;':''">
                    {{batteryNameCode(item.channelName)}}</div>
                </div>

                <div class="datalist-pile-infos">
                  <div class="datalist-pile-user">
                    <div :title="'使用人：'+ batteryUserName(item)">
                      <i><svg t="1623285546774" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="9726" width="15" height="15">
                          <path
                            d="M621.248 1024H402.688C215.616 1024 64 1024 64 949.312V928a334.72 334.72 0 0 1 338.688-330.688h218.56A334.72 334.72 0 0 1 960 928v21.312C960 1021.248 808.32 1024 621.248 1024zM501.056 512a256 256 0 1 1 262.4-256 259.136 259.136 0 0 1-262.4 256z"
                            p-id="9727" fill="#ffffff"></path>
                        </svg></i>
                      <span class="datalist-pile-user-name"
                        :class="batteryClass(item)">{{item.oldstate==1?'老化测试中':batteryUserName(item)}}</span>
                    </div>

                    <div>
                      <!-- <i>
                      <svg data-v-be036172="" t="1622602949463" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10657" width="15" height="15" class="icon"><path data-v-be036172="" d="M559.75936 1023.67232c-120.29952 0-218.07104-95.15008-218.07104-212.00896 0-68.97664 34.07872-132.79232 91.7504-172.6464V120.09472C433.43872 53.8624 488.81664 0 556.93312 0h5.61152c68.11648 0 123.53536 53.8624 123.53536 120.09472v518.9632c57.67168 39.81312 91.7504 103.6288 91.7504 172.60544 0 116.85888-97.8944 212.00896-218.07104 212.00896zM556.93312 35.10272c-48.16896 0-87.28576 38.17472-87.28576 84.91008v537.8048l-8.31488 5.20192c-52.26496 32.80896-83.43552 88.35072-83.43552 148.64384 0 97.56672 81.59232 176.9472 181.94432 176.9472s181.98528-79.38048 181.98528-176.9472c0-60.29312-31.17056-115.712-83.43552-148.64384l-8.31488-5.24288V120.0128c0-46.81728-39.23968-84.86912-87.32672-84.86912h-5.81632z" fill="#ffffff" p-id="10658"></path><path data-v-be036172="" d="M454.2464 817.84832c0 56.64768 47.22688 102.6048 105.51296 102.6048s105.51296-45.95712 105.51296-102.6048c0-56.68864-47.22688-102.6048-105.51296-102.6048s-105.55392 45.91616-105.55392 102.6048z" fill="#ffffff" p-id="10659"></path><path data-v-be036172="" d="M598.87616 733.5936a38.58432 38.58432 0 0 1-39.1168 38.01088 38.58432 38.58432 0 0 1-39.1168-38.05184V322.7648c0-21.0944 17.53088-38.0928 39.1168-38.0928 21.66784 0 39.1168 17.12128 39.1168 38.0928v410.8288zM359.79264 143.89248H258.048a11.8784 11.8784 0 0 1-12.0832-11.71456A11.8784 11.8784 0 0 1 258.048 120.4224h101.74464a11.8784 11.8784 0 0 1 12.0832 11.75552 12.04224 12.04224 0 0 1-12.0832 11.71456zM359.79264 223.0272H291.26656a11.8784 11.8784 0 0 1-12.0832-11.71456 11.8784 11.8784 0 0 1 12.0832-11.75552h68.52608a11.8784 11.8784 0 0 1 12.0832 11.75552 12.04224 12.04224 0 0 1-12.0832 11.71456zM359.79264 302.08H258.048a11.8784 11.8784 0 0 1-12.0832-11.75552 11.8784 11.8784 0 0 1 12.0832-11.75552h101.74464a11.8784 11.8784 0 0 1 12.0832 11.75552 11.96032 11.96032 0 0 1-12.0832 11.75552zM359.79264 381.21472H291.26656a11.8784 11.8784 0 0 1-12.0832-11.75552 11.8784 11.8784 0 0 1 12.0832-11.75552h68.52608a11.8784 11.8784 0 0 1 12.0832 11.75552 12.04224 12.04224 0 0 1-12.0832 11.75552zM359.79264 460.30848H258.048a11.8784 11.8784 0 0 1-12.0832-11.71456 11.8784 11.8784 0 0 1 12.0832-11.75552h101.74464a11.8784 11.8784 0 0 1 12.0832 11.75552 11.96032 11.96032 0 0 1-12.0832 11.71456z" fill="#ffffff" p-id="10660"></path></svg>
                    </i> -->
                      <span :class="batteryClass(item)">{{item.realtimeTemperature}}℃</span>
                    </div>
                  </div>
                  <div class="datalist-pile-state">
                    <div class="datalist-pile-state-infos" title='电压'><i><svg t="1623286914586"
                          :class="item.eleState > 1?'warningicon':''" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="24162" width="15" height="15">
                          <path
                            d="M512 0A511.568842 511.568842 0 0 0 0 512C0 795.109053 228.890947 1024 512 1024S1024 795.109053 1024 512 795.109053 0 512 0z m54.218105 784.545684H457.781895L263.545263 239.454316h97.872842l150.581895 445.709473h3.018105l150.581895-445.709473h97.872842l-197.254737 545.091368z"
                            fill="#ffffff" p-id="24163"></path>
                        </svg></i><span :class="batteryClass(item)">{{item.currVoltage | tofixeUpperCase()}}V</span>
                    </div>
                    <div class="datalist-pile-state-infos" title='功率'><i><svg t="1623286665079" class="icon"
                          viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20215"
                          width="15" height="15">
                          <path
                            d="M511.10538334 10.90284029c-276.5483767 0-500.76167846 224.21330176-500.76167847 500.76167846 0 138.55375606 56.36084992 264.02374338 147.27626854 354.71550784 90.57993737 90.24445613 215.49078928 146.04617063 353.48540993 146.04617062 138.77741021 0 264.24739754-56.36084992 354.93916199-147.49992271C956.17717438 774.34633713 1011.86706179 649.5473123 1011.86706179 511.77634584c0-276.66020377-224.21330176-500.87350553-500.76167845-500.87350555z m171.76639976 515.7465076c-40.03409579 31.64706454-96.95408112 47.75016452-169.19437685 47.75016452h-85.32406447c-4.47308334 0-8.05154999 3.57846665-8.05154999 8.05154999v205.31452472c0 22.92455206-18.67512289 41.59967494-41.59967494 41.59967494s-41.59967494-18.67512289-41.59967495-41.59967494V233.77421706c0-22.92455206 18.67512289-41.59967494 41.59967495-41.59967494h131.6204769c75.93058948 0 131.84413107 13.41924998 170.98361017 41.04053952 43.83621659 30.86427496 65.97797907 79.84453739 65.97797908 145.48703521 0.11182709 64.30057282-21.58262706 114.06362484-64.4123999 147.94723104z"
                            p-id="20216" fill="#ffffff"></path>
                          <path
                            d="M626.06362484 291.92430031c-25.38474788-16.88588956-65.30701657-24.71378538-125.5818144-24.71378538h-72.01664157c-4.47308334 0-8.05154999 3.57846665-8.05155 8.05154999v216.0499247c0 4.47308334 3.57846665 8.05154999 8.05155 8.05154999h75.37145406c57.03181242 0 97.17773527-9.50530206 122.67431024-28.96321455 24.82561246-18.89877706 36.90293745-48.86843534 36.90293745-91.69820821-0.11182709-42.27063744-11.96549789-69.89192699-37.35024578-86.77781654z"
                            p-id="20217" fill="#ffffff"></path>
                        </svg></i><span :class="batteryClass(item)">{{item.currPower | tofixeUpperCase()}}W</span></div>
                    <div class="datalist-pile-state-infos" title='功率因数'><i><svg t="1623286511622" class="icon"
                          viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19299"
                          width="15" height="15">
                          <path
                            d="M509.269333 10.453333c273.664 0 496.64 222.933333 496.64 496.597334s-222.976 496.597333-496.64 496.597333C235.648 1003.648 12.672 780.714667 12.672 507.050667S235.648 10.453333 509.312 10.453333z m55.04 192c-67.754667 0-101.589333 35.541333-101.589333 106.666667v239.957333h-10.24c-36.48 0-65.450667-13.013333-86.784-38.997333-21.333333-26.026667-32-60.672-32-104.149333 0-76.16 27.690667-141.013333 82.858667-194.432H341.632c-48.682667 49.92-72.96 114.474667-72.96 193.408 0 60.373333 16.64 109.226667 49.834667 146.346666 33.194667 37.12 78.08 55.466667 134.613333 54.741334 1.109333 1.194667 4.309333 1.194667 9.6 0v172.373333h58.368V605.866667c6.570667 1.194667 10.410667 1.194667 11.52 0 55.04 0.896 99.498667-17.237333 133.333333-54.698667 33.834667-37.333333 50.773333-84.906667 50.773334-142.506667 0-60.16-13.482667-109.482667-40.448-148.224-26.88-38.613333-64.213333-57.984-111.957334-57.984z m4.138667 64c26.624 0 47.317333 15.786667 62.08 47.488 14.762667 31.658667 22.186667 69.589333 22.186667 113.664 0 46.72-10.538667 84.864-31.573334 114.474667-21.077333 29.568-49.365333 44.373333-84.821333 44.373333h-11.648V320c0-35.626667 14.592-53.504 43.776-53.504z"
                            p-id="19300" fill="#ffffff"></path>
                        </svg></i><span :class="batteryClass(item)">{{item.powerFactor | tofixeUpperCase()}}%</span>
                    </div>
                  </div>
                  <div class="datalist-pile-progressbar-row" title='当前充电时长'>
                    <i><svg t="1623289334562" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="46688" width="15" height="15">
                        <path
                          d="M512 0c282.788 0 512 229.212 512 512s-229.212 512-512 512S0 794.788 0 512 229.212 0 512 0z m-20.48 215.04a30.72 30.72 0 0 0-30.72 30.72v286.72a30.72 30.72 0 0 0 9.83 22.528L680.387 750.1a30.72 30.72 0 0 0 41.86-45.015L522.24 519.127V245.76a30.72 30.72 0 0 0-30.72-30.72z"
                          p-id="46689" fill="#ffffff"></path>
                      </svg></i>
                    <div class="datalist-pile-progressbar">
                      <div :style="{ width: batteryProgressBar(item)}"></div>
                    </div>
                    <div class="datalist-pile-progressbar-load" :class="batteryClass(item)">{{batteryTime(item)}}</div>
                  </div>
                </div>
              </div>

            </div>
            <el-pagination :style="probetotal<20?'display:none':''" @size-change="probehandleSizeChange"
              @current-change="probehandlePageChange" :current-page="probecurrentPage" :page-sizes="[10, 20, 30]"
              :page-size="probepageSize" layout="total, sizes, prev, pager, next, jumper" :total="probetotal"
              style="text-align: right">
            </el-pagination>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- 空调最低温度设置 -->
    <div class="air-conditioner-section">
      <el-dialog title="空调最低温度设置" :visible.sync="ProbeAirMaxshow" width="330px" :close-on-click-modal="false" @close="closeProbeAirMax">
        <div class="setting-item">
          <span>最低温度：</span>
          <el-input-number v-model="ProbeAirMax.value" :min="0" :step="1" :max="27"></el-input-number>

        </div>
        <div class="Plugsetup-btn">       
          <el-button @click="ProbeAirMaxSubmit" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div >
      <el-dialog :title="transformerCoefficientForm.channelName+'系数'" :visible.sync="dialogTransformerCoefficientVisible" width="330px" :close-on-click-modal="false" @close="closeProbeAirMax">
        <div class="setting-item">
          <span style="color:#fff;margin-right:5px;" >电量系数：</span>
          <el-input-number v-model="transformerCoefficientForm.extendProperty.transformerCoefficient" label="电量系数"></el-input-number>
        </div>
        <div class="setting-item" style="margin-top:10px">
          <span style="color:#fff;margin-right:5px;" >电压系数：</span>
          <el-input-number v-model="transformerCoefficientForm.extendProperty.voltageCoefficient" label="电量系数"></el-input-number>
        </div>
        <div class="setting-item" style="margin-top:10px">
          <span style="color:#fff;margin-right:5px;" >电流系数：</span>
          <el-input-number v-model="transformerCoefficientForm.extendProperty.currentCoefficient" label="电量系数"></el-input-number>
        </div>
        <div class="Plugsetup-btn">       
          <el-button @click="transformerCoefficientSubmit" type="primary" style="margin-top: 10px;">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 空调遥控器弹框 -->
    <div class="air-conditioner-section">
      <el-dialog title="空调设置" :visible.sync="dialogVisible" width="450px" :close-on-click-modal="false" @close="closeairconditioner">
        <div class="temperature-item">
          <el-button icon="el-icon-minus" @click="handleTemperatureChange('reduce')" round></el-button>
          <span class="temperature-txt">{{ pojoAirConditionerData ? pojoAirConditionerData.T : "" }}℃</span>
          <el-button icon="el-icon-plus" @click="handleTemperatureChange('add')" round></el-button>
        </div>
        <div class="setting-item">
          <span>模式：</span>
          <el-radio-group v-model="modeValue" @change="handleModeChange">
            <el-radio-button  v-for="item in modeOptions" :key="item.M" :label="item.M">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="setting-item">
          <span>风速：</span>
          <el-radio-group v-model="speedValue" @change="handleSpeedChange">
            <el-radio-button  v-for="item in speedOptions" :key="item.W" :label="item.W">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="setting-item">
          <span>风向：</span>
          <el-radio-group v-model="directionValue" @change="handleDirectionChange">
            <el-radio-button  v-for="item in directionOptions" :key="item.D" :label="item.D">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="setting-item">
          <span>读取控制码：</span>
          <el-button type="primary" @click="handAirControlCode(pojoAirConditionerData.channelId)">获取
          </el-button>
         
        </div>
        <div class="setting-item">
          <span>控制码：</span>
          <el-input v-model="getAirControl" placeholder="请输入控制码" style="width:120px;margin-right:10px"></el-input>
          <el-button type="primary"  @click="setAirControl(pojoAirConditionerData.channelId)">设置
          </el-button>
         
        </div>
        <div class="setting-item">
          <span>自定义控制码：</span>
          <el-checkbox v-model="customcontrolbool"></el-checkbox>
        </div>
        <!--@change="handleDirectionChange"-->
        <div class="setting-item" v-show="customcontrolbool">
          <span>空调品牌：</span>
          <el-select v-model="airListvalue" @change="handleAirBrandChange" placeholder="请选择">
            <el-option v-for="item in airListData" :key="item.id" :label="item.airName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="setting-item" v-show="airListvalue!=null && customcontrolbool">
          <span>空调控制码：</span>
          <el-select v-model="airCodevalue" placeholder="请选择" filterable
    allow-create
    default-first-option>
            <el-option v-for="item in airCodeListdata" :key="item.id" :label="item.airControlCode"
              :value="item.airControlCode" >
            </el-option>
          </el-select>
        </div>
      </el-dialog>
    </div>
    <div class="centerair-conditioner-section air-conditioner-section">
      <el-dialog title="中央空调设置" :visible.sync="dialogVisible_center" width="400px" :close-on-click-modal="false">
        <div class="temperature-item">
          <el-button icon="el-icon-minus" @click="center_handleTemperatureChange('reduce')" round></el-button>
          <span class="temperature-txt">{{ center_pojoAirConditionerData ? center_pojoAirConditionerData.T : ""
          }}℃</span>
          <el-button icon="el-icon-plus" @click="center_handleTemperatureChange('add')" round></el-button>
        </div>
        <div class="setting-item">
          <span>室温：</span>
          <span class="temperature-txt">{{center_pojoAirConditionerData ? center_pojoAirConditionerData.IT : ""
          }}℃</span>

        </div>
        <div class="setting-item">
          <span>模式：</span>
          <el-radio-group v-model="center_modeValue" @change="center_handleModeChange">
            <el-radio-button  v-for="item in center_modeOptions" :key="item.M" :label="item.M">{{item.name}}</el-radio-button>
          </el-radio-group>
          <!-- <el-select v-model="center_modeValue" @change="center_handleModeChange" placeholder="请选择">
            <el-option v-for="item in center_modeOptions" :key="item.M" :label="item.name" :value="item.M">
            </el-option>
          </el-select> -->
        </div>
        <div class="setting-item">
          <span>风速：</span>
          <el-radio-group  v-model="center_speedValue" @change="center_handleSpeedChange">
            <el-radio-button  v-for="item in center_speedOptions" :key="item.W" :label="item.W">{{item.name}}</el-radio-button>
          </el-radio-group>
          <!-- <el-select v-model="center_speedValue" @change="center_handleSpeedChange" placeholder="请选择">
            <el-option v-for="item in center_speedOptions" :key="item.W" :label="item.name" :value="item.W">
            </el-option>
          </el-select> -->
        </div>
        <div class="setting-item">
          <span>键盘：</span>
          <!-- <el-radio-group size="mini" v-model="center_keyboardValue"  @change="center_handleKeyboardChange">
            <el-radio-button  v-for="item in center_keyboardOptions" :key="item.K" :label="item.K">{{item.name}}</el-radio-button>
          </el-radio-group> -->
          <el-select v-model="center_keyboardValue" @change="center_handleKeyboardChange" placeholder="请选择">
            <el-option v-for="item in center_keyboardOptions" :key="item.K" :label="item.name" :value="item.K">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: center;">
          <el-button type="primary" @click="addcenterAirConditioningOperation()">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--级联空调-->
    <div class="air-cascade-conditioner-section  air-conditioner-section">
      <el-dialog title="空调设置" :visible.sync="dialogCascadeVisible" width="500px" :close-on-click-modal="false">
        <div class="temperature-item">
          <el-button icon="el-icon-minus" @click="handleCascadeTemperatureChange('reduce')" round></el-button>
          <span class="temperature-txt">{{ pojoAirConditionerData ? pojoAirConditionerData.T : "" }}℃</span>
          <el-button icon="el-icon-plus" @click="handleCascadeTemperatureChange('add')" round></el-button>
        </div>
        <div class="setting-item">
          <span>模式：</span>
          <el-radio-group v-model="modeValue"  @change="handleCascadeModeChange">
            <el-radio-button  v-for="item in cascademodeOptions" :key="item.M" :label="item.M">{{item.name}}</el-radio-button>
          </el-radio-group>
          <!-- <el-select v-model="modeValue" @change="handleCascadeModeChange" placeholder="请选择">
            <el-option v-for="item in cascademodeOptions" :key="item.M" :label="item.name" :value="item.M">
            </el-option>
          </el-select> -->
        </div>
        <div class="setting-item">
          <span>风速：</span>
          <el-radio-group v-model="speedValue" @change="handleCascadeSpeedChange">
            <el-radio-button  v-for="item in cascadespeedOptions" :key="item.W" :label="item.W">{{item.name}}</el-radio-button>
          </el-radio-group>
          <!-- <el-select v-model="speedValue" @change="handleCascadeSpeedChange" placeholder="请选择">
            <el-option v-for="item in cascadespeedOptions" :key="item.W" :label="item.name" :value="item.W">
            </el-option>
          </el-select> -->
        </div>

      </el-dialog>
    </div>
    <!-- 充电插头弹框 -->
    <div class="Plugpop-section">
      <el-dialog :title="`${pojoGrouptitle}阈值设置`" :visible.sync="Plugsetupshow" :width="probeKindCode202 && !probeKindCode110?'1100px':'850px'"
        :close-on-click-modal="false">

        <el-form ref="pojoForm" :rules="rules" :model="pojoGroup" :hide-required-asterisk="true" class="Plugsetup-row">
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过压保护(V)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box" v-if="!probeKindCode110">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ov_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ov_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box" v-if="probeKindCode202">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="pojoGroup.ov_buzzer"></el-checkbox>
            </div>
            <el-form-item label="过压阈值：" prop="ov_alarm_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.ov_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="ov_restore_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.ov_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">欠压保护(V)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box" v-if="!probeKindCode110">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.uv_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.uv_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.uv_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box" v-if="probeKindCode202">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="pojoGroup.uv_buzzer"></el-checkbox>
            </div>
            <el-form-item label="欠压阈值：" prop="uv_alarm_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.uv_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="uv_restore_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.uv_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过载保护(W)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box" v-if="!probeKindCode110">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ol_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ol_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.ol_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box" v-if="probeKindCode202">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="pojoGroup.ol_buzzer"></el-checkbox>
            </div>
            <el-form-item label="过载阈值：" prop="ol_alarm_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.ol_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="ol_restore_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.ol_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">温度保护(℃)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box" v-if="!probeKindCode110">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.tem_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.tem_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.tem_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box" v-if="probeKindCode202">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="pojoGroup.tem_buzzer"></el-checkbox>
            </div>
            <el-form-item label="超温阈值：" prop="tem_alarm_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.tem_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="tem_restore_value" class="Plugsetup-box">
              <el-input v-model="pojoGroup.tem_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list" v-if="probeKindCode202 && !probeKindCode110">
            <div class="Plugsetup-title">低功率保护(W)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.lp_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.lp_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="pojoGroup.lp_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>


            <div class="Plugsetup-box">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="pojoGroup.lp_buzzer"></el-checkbox>
            </div>
            <el-form-item label="低功率运行时间：" prop="lp_run_time" class="Plugsetup-box">
              <el-input v-model="pojoGroup.lp_run_time"></el-input>
              <span>h</span>
            </el-form-item>
            <div class="Plugsetup-box">
              <span>功率小于2W时为低功率运行</span>
            </div>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">其他设置</div>

            <div class="Plugsetup-box">
              <span>本地开关是否启用：</span>
              <el-checkbox v-model="pojoGroup.switch_enable"></el-checkbox>
            </div>

            <div class="Plugsetup-box" v-if="!probeKindCode110" >
              <span>超时关闭是否启用：</span>
              <el-checkbox v-model="pojoGroup.switchdurationEnable"></el-checkbox>
            </div>
            <el-form-item v-if="pojoGroup.switchdurationEnable && !probeKindCode110" label="超时时长：" prop="duration" class="Plugsetup-box">
              <el-input v-model="pojoGroup.duration"></el-input>
              <span>h</span>
            </el-form-item>
          </div>
        </el-form>


        <div class="Plugsetup-btn">
          <el-button type="primary" @click="thresholdReset()">设为推荐值</el-button>
          <el-button @click="thresholdSubmit('pojoForm')" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="Plugswpop-section">
      <el-dialog title="电源设置" :visible.sync="Plugswsetupshow" width="330px" :close-on-click-modal="false">
        <div class="Plugswsetup-row">

          <div class="Plugswsetup-box">
            <span>充电插座名称：</span>
            <div>{{swsetupgrop.name}}</div>
          </div>
          <div class="Plugswsetup-box">
            <span>当前状态：</span>
            <div>{{swsetupgrop.state==1?'开':'关'}}</div>
          </div>
        </div>
        <div class="Plugswsetup-btn">
          <!-- <el-button type="primary" :disabled="swsetupgrop.state==1" @click="ChargingsocketSW()">开</el-button> -->
          <el-button type="primary" :disabled="swsetupgrop.state==1" v-if="this.$store.getters.payconfig.enabled!=1"
            @click="ChargingsocketSW(1)">开</el-button>
          <el-button type="danger" :disabled="swsetupgrop.state==0" @click="ChargingsocketSW(0)"
            style="margin-left: 17px;">关</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- lora门锁 -->
    <div class="Plugpop-section">
      <el-dialog title="门锁设置" :visible.sync="loralockGroupshow" width="300px" :close-on-click-modal="false">

        <el-form ref="pojoForm" :model="loralockGroup" :hide-required-asterisk="true" class="Plugsetup-row"
          style="justify-content: center;">
          <div class="Plugsetup-list" style="text-align:center">

            <el-form-item label="门锁静音：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="'1'" :inactive-value="'0'"
                v-model="loralockGroup.mute" active-color="#13ce66" inactive-color="#ff4949"
                @change="Lora_mute_Change()">
              </el-switch>
            </el-form-item>
            <el-form-item label="上班模式：" class="Plugsetup-box">
              <span>{{loralockGroup.normallyOpen==1?'开启':'关闭'}}</span>
            </el-form-item>
            <el-form-item label="禁止本地开门：" class="Plugsetup-box">
              <span>{{loralockGroup.isopen==1?'开启':'关闭'}}</span>
            </el-form-item>
            <el-button type="primary" @click="LoraPersonList()" v-if="usermanager!=0">人员管理</el-button>
          </div>
        </el-form>



      </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog title="门锁人员列表" :visible.sync="LoraPersonListshow" width="600px" :close-on-click-modal="false">

        <el-button type="primary" class="" @click="addPersonbox()">增加用户
        </el-button>
        <el-button type="primary" class="" @click="addPersonPWbox(999)">修改临时密码
        </el-button>
        <el-button type="primary" class="" @click="setUserPersonPWlits(loralockGroup.id)">管理密码
        </el-button>
        <div class="LoraPersonList-row">
          <el-table :data="LoraPersonListData" stripe style="width: 100%" max-height="300">
            <el-table-column prop="userName" label="姓名">
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" width="180">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="100">
              <template slot-scope="scope">
                <!-- <el-button
                    
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      @click="setPersonPWlits(scope.row.id)"
                      >设定密码</el-button
                    > -->
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  @click="delPerson(scope.row.userId,scope.row.probeId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog title="添加人员" :visible.sync="addLoraPersonListshow" width="300px" :close-on-click-modal="false">
        <div style="text-align: center;">
          <el-form style="margin-botton:10px;color:#fff" :model="LoraPresonForm" :rules="LoraPresonrules"
            ref="LoraPresonForm" label-width="100px">
            <el-form-item label="人员姓名" prop="id">
              <el-select v-model="LoraPresonForm.id" clearable placeholder="请选择">
                <el-option v-for="item in lockpersondata" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>

            </el-form-item>
            <el-button type="primary" class="" @click="addPerson('LoraPresonForm')">添加
            </el-button>


          </el-form>
        </div>
      </el-dialog>
    </div>

    <div class="Plugpop-section">
      <el-dialog title="人员密码列表" :visible.sync="LoraPersonPWListshow" width="600px" :close-on-click-modal="false">

        <el-button type="primary" class="" @click="addPersonPWbox()">增加密码
        </el-button>
        <div class="LoraPersonList-row">
          <el-table :data="LoraPersonPWListData" stripe style="width: 100%" max-height="300">
            <el-table-column prop="idcardPassword" label="卡号/密码">
              <template slot-scope="scope">
                <span>{{scope.row.idcardPassword|desensitization}}</span>
                <!-- <span v-if="scope.row.type=='1'">NFC卡</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="localDateTime" label="有效日期" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.valid==2?'永久有效':scope.row.expireValue>0?scope.row.expireTime:'失效'}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="address" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  @click="delPersonPW(scope.row.id,scope.row.probeId)">删除</el-button>
                <el-button v-if="scope.row.confirm == 0" size="mini" icon="el-icon-delete"
                  @click="ResendPersonPW(scope.row.id,scope.row.probeId)">重发</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog :title="PersonPWtitle" :visible.sync="addLoraPersonPWshow" width="450px" :close-on-click-modal="false">
        <div>
          <el-form :model="LoraPresonPWForm" :rules="LoraPresonPWrules" ref="LoraPresonPWForm" label-width="100px">
            <el-form-item label="密码" prop="content">
              <el-input type="password" placeholder="请输入4-8位数字密码" v-model="LoraPresonPWForm.content" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" placeholder="请再次确定密码" v-model="LoraPresonPWForm.checkPass" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="管理员密码" prop="admin" v-show="(usermanager==2 && !valid2)">
              <el-switch v-model="LoraPresonPWForm.admin" :active-value="1" :inactive-value="0"
                active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="永久有效" prop="valid" v-show="LoraPresonPWForm.valid==3">
              <el-switch v-model="LoraPresonPWForm.valid" :active-value="'2'" :inactive-value="'1'"
                active-color="#13ce66" inactive-color="#ff4949" disabled @change="LoraPresonPW_valid_Change()">
              </el-switch>
            </el-form-item>
           
            <el-form-item label="到期时间" prop="localDateTime" v-if="valid2">
              <el-date-picker v-model="LoraPresonPWForm.localDateTime" type="datetime" placeholder="选择日期时间"
                default-time="23:59:59" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>

          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" class="" @click="addPersonPW('LoraPresonPWForm')">添加
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog title="克隆门锁" :visible.sync="Doorlock_copshow" width="350px" :close-on-click-modal="false">
        <div>
          <div style="padding-bottom:10px">
            <span class="margin-left_10 margin-right_10" style="color:#fff">克隆对象</span>
            <el-select clearable v-model="Doorlock_copobjectid" placeholder="请选择要克隆的对象" size="small"
              class="Doorlock_copid-row">
              <el-option
                v-for="item in tableDataAll.filter(data=>data.targetCategoryId ==12 && data.probeId != Doorlock_copid)"
                :key="item.probeId" :label="item.name" :value="item.probeId">
              </el-option>
            </el-select>
          </div>
          <div style="text-align: center;">
            <el-button type="primary" class="" @click="SubmitDoorlockcop()">克隆
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog title="指令列表" :visible.sync="Doorlock_instructshow" width="850px" :close-on-click-modal="false">
        <div class="LoraPersonList-row">
          <el-table :data="Doorlock_instructlist" stripe style="width: 100%" max-height="300">
            <el-table-column prop="userName" label="姓名">
              <template slot-scope="scope">
                <div>{{
                scope.row.description=='下发卡密'?scope.row.userName==null?'-':scope.row.userName:scope.row.description}}
                </div>

              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="密码" width="100">
              <template slot-scope="scope">
                <div>{{ scope.row.data | passwod() }}</div>

              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" width="180">
            </el-table-column>
            <el-table-column prop="updateTime" label="最后发送日期" width="180">
            </el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <div>{{ scope.row.process==1?'成功':scope.row.retry==5?'失败':'下发中'}}</div>

              </template>
            </el-table-column>
            <el-table-column prop="retry" label="重发次数">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="100">
              <template slot-scope="scope">

                <el-button v-show="scope.row.process==0&&scope.row.retry==5" type="primary" size="mini"
                  icon="el-icon-refresh-right" @click="instructrepeat(scope.row.id)">重发</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <div class="ceiling-section">
      <el-dialog title="吊扇最长开启时间" :visible.sync="ceilingVisible" width="400px" :close-on-click-modal="false">
        <div style="margin-bottom:10px;color:#fff">最长开启时间：<el-input-number size="medium" style="margin-right:5px"
            @change="maxichanger" v-model="runTime" controls-position="right" :min="0" :step="10" :max="2550"
            step-strictly></el-input-number>分钟</div>


        <div class="Plugsetup-btn">
          <el-button type="danger" @click="ceilingVisible=false">取消</el-button>
          <el-button @click="ceilingfanruntime()" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>

    </div>
    <!-- NB插座弹窗 -->
    <div class="Plugpop-section">
      <el-dialog :title="`${pojoGrouptitle}阈值设置`" :visible.sync="NBPlugsetupshow" width="1200px" :close-on-click-modal="false">

        <el-form ref="NBpojoForm" :rules="NBrules" :model="NBpojoGroup" :hide-required-asterisk="true"
          class="Plugsetup-row">
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过压报警(V)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverVoltage.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverVoltage.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverVoltage.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="OverVoltage.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.OverVoltage.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="OverVoltage.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.OverVoltage.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">欠压报警(V)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.UnderVoltage.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.UnderVoltage.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.UnderVoltage.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="UnderVoltage.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.UnderVoltage.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="UnderVoltage.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.UnderVoltage.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过载报警(W)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverLoad.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverLoad.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.OverLoad.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="OverLoad.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.OverLoad.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="OverLoad.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.OverLoad.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">低功率报警(W)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPower.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPower.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPower.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="LowPower.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowPower.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="LowPower.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowPower.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">低功率因素报警(%)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPowerFactor.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPowerFactor.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowPowerFactor.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="LowPowerFactor.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowPowerFactor.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="LowPowerFactor.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowPowerFactor.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list" >
            <div class="Plugsetup-title">过流报警(A)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.HighCurrent.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.HighCurrent.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.HighCurrent.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="HighCurrent.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.HighCurrent.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="HighCurrent.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.HighCurrent.ResumeValue"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">低电流报警(A)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowCurrent.AutoOff" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowCurrent.AlarmPush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="true" :inactive-value="false"
                v-model="NBpojoGroup.LowCurrent.ResumePush" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>

            <el-form-item label="报警阈值：" prop="LowCurrent.AlarmValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowCurrent.AlarmValue"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="LowCurrent.ResumeValue" class="Plugsetup-box">
              <el-input v-model="NBpojoGroup.LowCurrent.ResumeValue"></el-input>
            </el-form-item>
          </div>

        </el-form>


        <div class="Plugsetup-btn">
          <el-button type="primary" @click="NBthresholdReset()">设为推荐值</el-button>
          <el-button @click="NBthresholdSubmit('NBpojoForm')" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 微波检查 -->
    <div class="Plugpop-section">
      <el-dialog :title="`阈值设置`" :visible.sync="dialogMicrowaveVisible" :width="microwaveSeniorSet?'640px':microwaveForm.probeKindCode=='1401'?'510px':'740px'" :close-on-click-modal="false">

        <el-form ref="microwaveForm" class="microwave-form" :model="microwaveForm" :hide-required-asterisk="true" >
          <div class="microwave1-row" >
            <div  v-if="!microwaveSeniorSet">
          <el-form-item label="联动时间(关闭)"  class="Plugsetup-box">
            <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousNobodyCloseSeconds.hour" controls-position="right" :min="0" :step="1"  @change="handleMicrowaveChange($event,'hour',microwaveForm.continuousNobodyCloseSeconds)"></el-input-number>
              <span>小时</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousNobodyCloseSeconds.minute" controls-position="right" :min="0" :max="60" :step="1" @change="handleMicrowaveChange($event,'minute',microwaveForm.continuousNobodyCloseSeconds)"></el-input-number>
              <span>分钟</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousNobodyCloseSeconds.second" controls-position="right" :min="0" :max="60" :step="1" step-strictly @change="handleMicrowaveChange($event,'second',microwaveForm.continuousNobodyCloseSeconds)"></el-input-number>
              <span>秒</span>
            </el-form-item>
            <el-form-item label="联动时间(开启)"  class="Plugsetup-box">
            <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousSomebodyOpenSeconds.hour" controls-position="right" :min="0" :step="1"  @change="handleMicrowaveChange($event,'hour',microwaveForm.continuousSomebodyOpenSeconds)"></el-input-number>
              <span>小时</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousSomebodyOpenSeconds.minute" controls-position="right" :min="0" :max="60" :step="1" @change="handleMicrowaveChange($event,'minute',microwaveForm.continuousSomebodyOpenSeconds)"></el-input-number>
              <span>分钟</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.continuousSomebodyOpenSeconds.second" controls-position="right" :min="0" :max="60" :step="1" step-strictly @change="handleMicrowaveChange($event,'second',microwaveForm.continuousSomebodyOpenSeconds)"></el-input-number>
              <span>秒</span>
            </el-form-item>
            <el-form-item label="无人检查时间"  class="Plugsetup-box">
            <el-input-number size="mini" style="width:85px" v-model="microwaveForm.nobodyDetectionTime.hour" controls-position="right" :min="0" :step="1"  @change="handleMicrowaveChange($event,'hour',microwaveForm.nobodyDetectionTime)"></el-input-number>
              <span>小时</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.nobodyDetectionTime.minute" controls-position="right" :min="0" :max="60" :step="1" @change="handleMicrowaveChange($event,'minute',microwaveForm.nobodyDetectionTime)"></el-input-number>
              <span>分钟</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.nobodyDetectionTime.second" controls-position="right" :min="0" :max="60" :step="1" step-strictly @change="handleMicrowaveChange($event,'second',microwaveForm.nobodyDetectionTime)"></el-input-number>
              <span>秒</span>
            </el-form-item>
            <el-form-item label="心跳间隔"  class="Plugsetup-box">
            <el-input-number size="mini" style="width:85px" v-model="microwaveForm.heartbeatInterval.hour" controls-position="right" :min="0" :step="1"  @change="handleMicrowaveChange($event,'hour',microwaveForm.heartbeatInterval)"></el-input-number>
              <span>小时</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.heartbeatInterval.minute" controls-position="right" :min="0" :max="60" :step="1" @change="handleMicrowaveChange($event,'minute',microwaveForm.heartbeatInterval)"></el-input-number>
              <span>分钟</span>
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.heartbeatInterval.second" controls-position="right" :min="0" :max="60" :step="1" step-strictly @change="handleMicrowaveChange($event,'second',microwaveForm.heartbeatInterval)"></el-input-number>
              <span>秒</span>
            </el-form-item>
          </div>

          <div  v-if="!microwaveSeniorSet &&  microwaveForm.probeKindCode=='2201'">
            <el-form-item label="亮度电压正常阈值(%)"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.brightnessVoltageNormalPercentage" controls-position="right" :min="0" :step="1" :max="100" ></el-input-number>
            
            </el-form-item>
          <el-form-item label="微波检测距离(1-600)"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.microwaveDetectionDistance" controls-position="right" :min="1" :step="1" :max="600" ></el-input-number>
            
            </el-form-item>
          </div>
          <div v-if="microwaveSeniorSet">
            <div style="
    display: flex;
    align-items: center;
    color: #fff;
"> <el-form-item label="检测能力(0-1000)"  class="Plugsetup-box test-input">
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.microwaveDetectionCapability" controls-position="right" :min="0" :step="1" :max="1000" ></el-input-number>
          
            </el-form-item>
            <span style="margin-left:0.1rem">注:数值越大,杂波的抑制能力越强,但弱目标的漏检概率也会变大</span>
          </div>
            <div style="
    display: flex;
    align-items: center;
    color: #fff;
">
            <el-form-item label="抗干扰(0-5)"  class="Plugsetup-box test-input">
              <el-input-number size="mini" style="width:85px" v-model="microwaveForm.microwaveAntiInterferenceValue" controls-position="right" :min="0" :step="1" :max="5" ></el-input-number>
             
            </el-form-item>
            <span style="margin-left:0.1rem">注:运动目标触发报警的灵敏度,数值越小灵敏度越高</span>
          </div></div>
          </div>
     <div class="microwaveModuleProgram-text"  v-if="microwaveSeniorSet">运动目标检查</div>
            <div class="microwaveModuleProgram" v-if="microwaveSeniorSet">
          <div class="microwave-row " v-for="(item,index) in microwaveForm.microwaveModuleProgramList" :key="item.moduleAreaCode">
          
            <el-form-item :label="`距离${index+1}(1-600cm)`"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="item.movementDistance" controls-position="right" :min="0" :step="1" :max="600" ></el-input-number>
            </el-form-item>
            <el-form-item :label="`灵敏度${index+1}(1-64)`"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="item.movementSensitivity" controls-position="right" :min="1" :step="1" :max="64" ></el-input-number>
            </el-form-item>
            <i v-if="index!=2" class="el-icon-arrow-left microwave-icon"></i>
          </div>
         
        </div>
        <div class="microwaveModuleProgram-text"  v-if="microwaveSeniorSet">静止目标检查</div>
        <div class="microwaveModuleProgram" v-if="microwaveSeniorSet">
         
          <div class="microwave-row " v-for="(item,index) in microwaveForm.microwaveModuleProgramList" :key="item.moduleAreaCode">
          
           
            <el-form-item :label="`距离${index+1}(1-600cm)`"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="item.stationaryDistance" controls-position="right" :min="1" :step="1" :max="600" ></el-input-number>
            </el-form-item>
            <el-form-item :label="`灵敏度${index+1}(1-60)`"  class="Plugsetup-box">
              <el-input-number size="mini" style="width:85px" v-model="item.stationarySensitivity" controls-position="right" :min="1" :step="1" :max="60" ></el-input-number>
            </el-form-item>
            <i v-if="index!=2" class="el-icon-arrow-left microwave-icon"></i>
          </div>
        </div>
        </el-form>
        <div class="Plugsetup-btn" style="margin-top:0.1rem">
          <el-button v-if="microwaveForm.probeKindCode=='2201'"  type="primary" style="margin-right: 17px;" @click="microwaveSeniorSet=!microwaveSeniorSet">{{microwaveSeniorSet?"基础设置":'高级设置'}}</el-button>
          <el-button @click="microwaveReset()" type="primary" style="margin-right: 17px;">设为推荐值</el-button>
          <el-button @click="microwaveSubmit()" type="primary" style="margin-right: 17px;">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--三相-->
    <!-- 充电插头弹框 -->
    <div class="Plugpop-section">
      <el-dialog   @close="closeThreepojoForm" :title="`${pojoGrouptitle}阈值设置`" :visible.sync="ThreePlugsetupshow" width="850px"
        :close-on-click-modal="false">
        <div style="margin-bottom:10px" v-show="probeKindCode!='2301'">
          <span style="color: #fff;">相位选择：</span>
          <el-radio-group  v-model="ThreePlugsetupchannel" @change="Threechannelchannge" size="small" >
            <el-radio-button :label="1">A相</el-radio-button>
            <el-radio-button :label="2">B相</el-radio-button>
            <el-radio-button :label="3">C相</el-radio-button>
          </el-radio-group>
        </div>
        <el-form ref="ThreepojoForm" :rules="Threerules" :model="ThreepojoGroup" :hide-required-asterisk="true" class="Plugsetup-row">
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过压保护(V)</div>
            <!-- <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item> -->
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="过压报警：" class="Plugsetup-box" v-if="probeKindCode=='2301'">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.overVoltageAlarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box"  v-if="probeKindCode!='2301'">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.ov_buzzer"></el-checkbox>
            </div>
            <el-form-item label="过压阈值：" prop="ov_alarm_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.ov_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="ov_restore_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.ov_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">欠压保护(V)</div>
            <!-- <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item> -->
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.uv_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.uv_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="欠压报警：" class="Plugsetup-box" v-if="probeKindCode=='2301'">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.lowVoltageAlarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box"  v-if="probeKindCode!='2301'">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.uv_buzzer"></el-checkbox>
            </div>
            <el-form-item label="欠压阈值：" prop="uv_alarm_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.uv_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="uv_restore_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.uv_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">过载保护(W)</div>
            <!-- <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item> -->
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ol_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ol_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="过载报警：" class="Plugsetup-box" v-if="probeKindCode=='2301'">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.overloadAlarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box"  v-if="probeKindCode!='2301'">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.ol_buzzer"></el-checkbox>
            </div>
            <el-form-item label="过载阈值：" prop="ol_alarm_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.ol_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="ol_restore_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.ol_restore_value"></el-input>
            </el-form-item>
          </div>
          <div class="Plugsetup-list">
            <div class="Plugsetup-title">温度保护(℃)</div>
          <!-- <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item> -->
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.tem_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.tem_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="超温报警：" class="Plugsetup-box" v-if="probeKindCode=='2301'">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.overTemperatureAlarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div class="Plugsetup-box"  v-if="probeKindCode!='2301'">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.tem_buzzer"></el-checkbox>
            </div>
            <el-form-item label="超温阈值：" prop="tem_alarm_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.tem_alarm_value"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="tem_restore_value" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.tem_restore_value"></el-input>
            </el-form-item>
          </div>
          <!-- <div class="Plugsetup-list">
            <div class="Plugsetup-title">低功率保护(W)</div>
            <el-form-item label="自动断电：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.lp_electricity" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="报警推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.lp_alarm" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="恢复推送：" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="ThreepojoGroup.lp_restore" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>


            <div class="Plugsetup-box">
              <span>蜂鸣器是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.lp_buzzer"></el-checkbox>
            </div>
            <el-form-item label="低功率运行时间：" prop="lp_run_time" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.lp_run_time"></el-input>
              <span>h</span>
            </el-form-item>
            <div class="Plugsetup-box">
              <span>功率小于2W时为低功率运行</span>
            </div>
          </div> -->
          <div class="Plugsetup-list" v-if="probeKindCode!='2301'">
            <div class="Plugsetup-title">其他设置</div>
            <div class="Plugsetup-box">
              <span>本地按钮是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.switch_enable"></el-checkbox>
            </div>
            <!-- <div class="Plugsetup-box">
              <span>来电蜂鸣是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.ele_func_buzzer"></el-checkbox>
            </div> -->

            <!-- <div class="Plugsetup-box">
              <span>超时关闭是否启用：</span>
              <el-checkbox v-model="ThreepojoGroup.ele_timeout_shutdown"></el-checkbox>
            </div>
            <el-form-item v-if="ThreepojoGroup.ele_timeout_shutdown" label="超时时长：" prop="duration" class="Plugsetup-box">
              <el-input v-model="ThreepojoGroup.ele_charging_timeout"></el-input>
              <span>h</span>
            </el-form-item> -->
          </div>
        </el-form>


        <div class="Plugsetup-btn">
          <el-button type="primary" @click="ThreethresholdReset()">设为推荐值</el-button>
          <el-button @click="ThreethresholdSubmit('ThreepojoForm')" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>

    </div>
    <div class="Plugpop-section">
      <el-dialog :title="doorContactForm.name+`阈值设置`"  class="doorContact-row" :visible.sync="dialogDoorContactVisible" width="1220px" :close-on-click-modal="false">
        <div>
          <el-form :model="delayCloseform" class="Plugsetup-row">
            
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">超温报警(℃)</div>
            

              <el-form-item label="报警阈值：" prop="tem_alarm_value" class="Plugsetup-box">
                <el-input v-model="doorContactForm.tem_alarm_value"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="tem_restore_value" class="Plugsetup-box">
                <el-input v-model="doorContactForm.tem_restore_value"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">低温报警(℃)</div>
            

              <el-form-item label="报警阈值：" prop="lowTemperatureThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.lowTemperatureThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="lowTemperatureRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.lowTemperatureRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">湿度过高报警(%)</div>
            

              <el-form-item label="报警阈值：" prop="overHumidityThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.overHumidityThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="overHumidityRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.overHumidityRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">湿度过低报警(%)</div>
            

              <el-form-item label="报警阈值：" prop="lowHumidityThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.lowHumidityThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="lowHumidityRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.lowHumidityRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">扩展超温报警(℃)</div>
            

              <el-form-item label="报警阈值：" prop="thermistorOverTemperatureThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.thermistorOverTemperatureThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="thermistorOverTemperatureRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.thermistorOverTemperatureRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">扩展低温报警(℃)</div>
            

              <el-form-item label="报警阈值：" prop="thermistorLowTemperatureThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.thermistorLowTemperatureThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="thermistorLowTemperatureRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="doorContactForm.thermistorLowTemperatureRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">开启时长报警(分钟)</div>
                <el-form-item label="报警阈值：" prop="" class="Plugsetup-box">
                  <el-input v-model="doorContactForm.eleOpenAlarmValue"></el-input>
                </el-form-item>
                <el-form-item label="报警间隔：" prop="" class="Plugsetup-box">
                  <el-input v-model="doorContactForm.eleOpenAlarmSpace"></el-input>
                </el-form-item>
            </div>
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" class="" @click="setDoorContact()">确定
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="Plugpop-section">
    <el-dialog :title="delayCloseform.name+`延迟设置`" class="delayClose-row" :visible.sync="dialogDelayCloseVisible" width="540px" :close-on-click-modal="false">
        <div>
          <el-form :model="delayCloseform" label-width="100px">
            <el-form-item label="延迟功能" prop="content">
              <el-switch v-model="delayCloseform.isDelayClose"
                  active-color="#13ce66" active-text="开启" inactive-text="关闭"
                  inactive-color="#ff4949">
                </el-switch>
                 <el-tooltip
              class="item"
              effect="dark"
              content="延时时间为0秒将不开启延迟功能
"
              placement="right"
            >
              <i
                class="el-icon-warning-outline"
                style="color: #fff; font-size: 20px; margin-left: 10px"
              ></i>
            </el-tooltip>
            </el-form-item>
            <el-form-item label="延迟关闭时间" prop="content"  v-if="delayCloseform.isDelayClose">
              <el-input-number size="mini" style="width:85px" v-model="delayCloseform.hour" controls-position="right" :min="0" :step="1"  @change="handleDelayCloseChange($event,'hour')"></el-input-number>
              <span>小时</span>
              <el-input-number size="mini" style="width:85px" v-model="delayCloseform.minute" controls-position="right" :min="0" :max="60" :step="1" @change="handleDelayCloseChange($event,'minute')"></el-input-number>
              <span>分钟</span>
              <el-input-number size="mini" style="width:85px" v-model="delayCloseform.second" controls-position="right" :min="0" :max="60" :step="10" step-strictly @change="handleDelayCloseChange($event,'second')"></el-input-number>
              <span>秒</span>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            
            <el-button type="primary" class="" @click="setDelayClose()">确定
            </el-button>
          </div>
        </div>
      </el-dialog>
    
    </div>
    <!--透传编程-->
    <div class="Plugpop-section">
      <el-dialog   :title="`${pojoGrouptitle}阈值设置`" :visible.sync="throughPlugsetupshow" :width="throughSetupWidth()"
        :close-on-click-modal="false">
     
        <el-form ref="throughPojoForm" :rules="throughRules" :model="throughPojoGroup" :hide-required-asterisk="true" class="">
          <div class="Plugsetup-row">
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">过压保护(V)</div>
              <el-form-item v-if="throughMoldCode==28" label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ov_alarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ov_restore" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="过压报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overVoltageAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box"  v-if="!isAirthrough" >
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.ov_buzzer"></el-checkbox>
              </div>
              <el-form-item label="过压阈值：" prop="ov_alarm_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.ov_alarm_value"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="ov_restore_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.ov_restore_value"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">欠压保护(V)</div>
              <el-form-item v-if="throughMoldCode==28" label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.uv_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.uv_alarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.uv_restore" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="欠压报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowVoltageAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box" v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.uv_buzzer"></el-checkbox>
              </div>
              <el-form-item label="欠压阈值：" prop="uv_alarm_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.uv_alarm_value"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="uv_restore_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.uv_restore_value"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list" v-if="throughPojoGroup.targetCategoryId==33 && throughPojoGroup.probeVersion >= 251121.1">
              <div class="Plugsetup-title">过流保护(A)</div>
              
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overCurrentAllowAlarmPush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overCurrentAllowResumePush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="过流报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overCurrentAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box" v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.overCurrentAllowBuzzerPrompt"></el-checkbox>
              </div>
              <el-form-item label="过流阈值：" prop="overCurrentThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overCurrentThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="overCurrentThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overCurrentRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">过载保护(W)</div>
              <el-form-item v-if="throughMoldCode==28" label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ol_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ol_alarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ol_restore" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="过载报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overloadAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box" v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.ol_buzzer"></el-checkbox>
              </div>
              <el-form-item label="过载阈值：" prop="ol_alarm_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.ol_alarm_value"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="ol_restore_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.ol_restore_value"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list"  v-if="[27].includes(Number(throughMoldCode))">
              <div class="Plugsetup-title">低功率保护(W)</div>
              <el-form-item v-if="throughMoldCode==28" label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lp_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lp_alarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lp_restore" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="低功率报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowPowerAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box"  v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.lp_buzzer"></el-checkbox>
              </div>
              <el-form-item label="报警阈值：" v-if="isAirthrough" prop="lowPowerThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowPowerThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" v-if="isAirthrough" prop="lowPowerRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowPowerRecoveryThreshold"></el-input>
              </el-form-item>
              <el-form-item v-if="throughMoldCode==28" label="低功率运行时间：" prop="lp_run_time" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lp_run_time"></el-input>
                <span>h</span>
              </el-form-item>
              <div class="Plugsetup-box">
                <span>功率小于2W时为低功率运行</span>
              </div>
            </div>
            <div class="Plugsetup-list" v-if="![52].includes(throughPojoGroup.targetCategoryId)">
              <div class="Plugsetup-title">超温保护(℃)</div>
              <el-form-item v-if="throughMoldCode==28" label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.tem_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.tem_alarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.tem_restore" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="超温报警：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overTemperatureAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box"  v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.tem_buzzer"></el-checkbox>
              </div>
              <el-form-item label="超温阈值：" prop="tem_alarm_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.tem_alarm_value"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="tem_restore_value" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.tem_restore_value"></el-input>
              </el-form-item>
            </div>
        
            <div class="Plugsetup-list" v-if="isAirthrough">
              <div class="Plugsetup-title">低温保护(℃)</div>
          
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowTemAllowAlarmPush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowTemAllowResumePush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="低温报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowTemAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box" v-if="!isAirthrough" >
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.lowTemAllowBuzzerPrompt"></el-checkbox>
              </div>
              <el-form-item label="低温阈值：" prop="lowTemperatureThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowTemperatureThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="lowTemperatureRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowTemperatureRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
        
            <div class="Plugsetup-list"  v-if="isAirthrough">
              <div class="Plugsetup-title">室温超温保护(℃)</div>
          
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomOverTemAllowAlarmPush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomOverTemAllowResumePush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="超温报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomOverTemAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box"  v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.roomOverTemAllowBuzzerPrompt"></el-checkbox>
              </div>
              <el-form-item label="报警阈值：" prop="roomOverTemThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.roomOverTemThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="roomOverTemRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.roomOverTemRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list"  v-if="isAirthrough">
              <div class="Plugsetup-title">室温低温保护(℃)</div>
          
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomLowTemAllowAlarmPush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomLowTemAllowResumePush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="低温报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.roomLowTemAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box"  v-if="!isAirthrough">
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.roomLowTemAllowBuzzerPrompt"></el-checkbox>
              </div>
              <el-form-item label="报警阈值：" prop="roomLowTemThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.roomLowTemThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="roomLowTemRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.roomLowTemRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list"  v-if="[].includes(throughMoldCode)">
              <div class="Plugsetup-title">剩余电流(mA)</div>
          
              <el-form-item label="报警推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overResidualCurrentAllowAlarmPush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="恢复推送：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overResidualCurrentAllowResumePush" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="剩余电流报警：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overResidualCurrentAlarm" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <div class="Plugsetup-box" >
                <span>蜂鸣器是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.overResidualCurrentAllowBuzzerPrompt"></el-checkbox>
              </div>
              <el-form-item label="报警阈值：" prop="residualCurrentOverThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.residualCurrentOverThreshold"></el-input>
              </el-form-item>
              <el-form-item label="恢复阈值：" prop="residualCurrentRecoveryThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.residualCurrentRecoveryThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list"  v-if="!isAirthrough " >
              <div class="Plugsetup-title">其他设置</div>
              <div class="Plugsetup-box">
                <span>本地按钮是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.switch_enable"></el-checkbox>
              </div>
              <!-- <div class="Plugsetup-box">
                <span>来电蜂鸣是否启用：</span>
                <el-checkbox v-model="throughPojoGroup.ele_func_buzzer"></el-checkbox>
              </div> -->

              <!-- <div class="Plugsetup-box">
                <span>超时关闭是否启用：</span>
                <el-checkbox v-model="ThreepojoGroup.ele_timeout_shutdown"></el-checkbox>
              </div>
              <el-form-item v-if="ThreepojoGroup.ele_timeout_shutdown" label="超时时长：" prop="duration" class="Plugsetup-box">
                <el-input v-model="ThreepojoGroup.ele_charging_timeout"></el-input>
                <span>h</span>
              </el-form-item> -->
            </div>
          </div>
           <div class="Plugsetup-row" v-if="throughPojoGroup.targetCategoryId==33 && throughPojoGroup.probeVersion >= 251121.1">
             <div class="Plugsetup-list">
              <div class="Plugsetup-title">过压断电(V)</div>
              <el-form-item label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ov_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="自动合闸：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overVoltageAutomaticPowerOn" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
             
             
              <el-form-item label="断电阈值：" prop="overVoltageCloseThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overVoltageCloseThreshold"></el-input>
              </el-form-item>
              <el-form-item label="合闸阈值：" prop="overVoltageRecoveryOpenThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overVoltageRecoveryOpenThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">欠压断电(V)</div>
              <el-form-item label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.uv_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="自动合闸：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.lowVoltageAutomaticPowerOn" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
             
             
              <el-form-item label="断电阈值：" prop="lowVoltageCloseThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowVoltageCloseThreshold"></el-input>
              </el-form-item>
              <el-form-item label="合闸阈值：" prop="lowVoltageRecoveryOpenThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.lowVoltageRecoveryOpenThreshold"></el-input>
              </el-form-item>
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">过流断电(A)</div>
              <el-form-item label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overCurrentAutomaticPowerOutage" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="自动合闸：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overCurrentAutomaticPowerOn" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
             
             
              <el-form-item label="断电阈值：" prop="overCurrentCloseThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overCurrentCloseThreshold"></el-input>
              </el-form-item>
             
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">过载断电(W)</div>
              <el-form-item label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.ol_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="自动合闸：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overloadAutomaticPowerOn" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
             
             
              <el-form-item label="断电阈值：" prop="overloadCloseThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overloadCloseThreshold"></el-input>
              </el-form-item>
             
            </div>
            <div class="Plugsetup-list">
              <div class="Plugsetup-title">过温断电(℃)</div>
              <el-form-item label="自动断电：" class="Plugsetup-box" >
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.tem_electricity" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
          
              <el-form-item label="自动合闸：" class="Plugsetup-box">
                <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                  v-model="throughPojoGroup.overTemperatureAutomaticPowerOn" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
                <el-form-item label="断电阈值：" prop="overTemperatureCloseThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overTemperatureCloseThreshold"></el-input>
              </el-form-item>
             
              <el-form-item label="合闸阈值：" prop="overTemperatureRecoveryOpenThreshold" class="Plugsetup-box">
                <el-input v-model="throughPojoGroup.overTemperatureRecoveryOpenThreshold"></el-input>
              </el-form-item>
             
            </div>
            <div class="Plugsetup-list" >
              <div class="Plugsetup-title">合闸控制</div>
               <el-form-item  label="合闸间隔：" prop="autoPowerOnInterval" class="Plugsetup-box autoPowerOnInterval-row">
                <el-input-number :min="5" :max="1200" step-strictly :step="5"  v-model="throughPojoGroup.autoPowerOnInterval"></el-input-number>
                <span>秒</span>
              </el-form-item> 
             <el-form-item  label="合闸次数：" prop="autoPowerOnMaxTimes" class="Plugsetup-box">
                <el-input  v-model="throughPojoGroup.autoPowerOnMaxTimes"></el-input>
              <span>次</span>
              </el-form-item> 
            </div>
           </div>
        </el-form>


        <div class="Plugsetup-btn">
          <!-- v-if="!isAirthrough"  -->
          <el-button type="primary" @click="throughInitDatalistSetup()">设为推荐值</el-button>
          <el-button @click="throughPhresholdSubmit('throughPojoForm')" type="primary" style="margin-right: 17px;">保存</el-button>
        </div>
      </el-dialog>

    </div>

    <!--扩展温度-->
    <div class="Plugpop-section">
      <el-dialog :title="alarmTemperatureProgramForm.channelName+`阈值设置`"  class="alarmTemperature-row" :visible.sync="dialogAlarmTemperatureProgramVisible" width="1220px" :close-on-click-modal="false">
        <div >
         <div class="alarmTemperature-list"> 
            <div class="alarmTemperature-box" v-for="(item,index) in alarmTemperatureProgramForm.alarmTemperatureProgramList" :key="index">
               <el-form :model="item" :rules="alarmTemperatureProgramrules" class="Plugsetup-row">
              <div class="Plugsetup-list">
                <div class="Plugsetup-title">
                  
                  {{index ==0?'本机':`${index}路`}}温度参数设定
                </div>
              

                <el-form-item label="高温报警：" prop="overTemperatureAlarm" class="Plugsetup-box">
                  <el-input v-model="item.overTemperatureAlarm"></el-input>
                </el-form-item>
                <el-form-item label="高温预警：" prop="overTemperatureWarning" class="Plugsetup-box">
                  <el-input v-model="item.overTemperatureWarning"></el-input>
                </el-form-item>
                <el-form-item label="高温恢复：" prop="overTemperatureAlarmRecovery" class="Plugsetup-box">
                  <el-input v-model="item.overTemperatureAlarmRecovery"></el-input>
                </el-form-item>
                
                <el-form-item label="低温报警：" prop="lowTemperatureAlarm" class="Plugsetup-box">
                  <el-input v-model="item.lowTemperatureAlarm"></el-input>
                </el-form-item>
                <el-form-item label="低温预警：" prop="lowTemperatureWarning" class="Plugsetup-box">
                  <el-input v-model="item.lowTemperatureWarning"></el-input>
                </el-form-item>
                <el-form-item label="低温恢复：" prop="lowTemperatureAlarmRecovery" class="Plugsetup-box">
                  <el-input v-model="item.lowTemperatureAlarmRecovery"></el-input>
                </el-form-item>
              </div>
              </el-form>
            </div>
              
          </div>
          
          <div style="text-align: center;">
            <el-button type="primary" @click="alarmTemperatureReset()">设为推荐值</el-button>
            <el-button type="primary" class="" @click="setAlarmTemperature()">确定
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--水表编程-->
    <div class="Plugpop-section">
      <el-dialog :title="waterForm.name+`阈值设置`"  class="water-row" :visible.sync="waterForm.dialogVisible" :width="[1,2].includes(waterForm.waterMeterType)?'480px':'300px'" :close-on-click-modal="false">
        <div>
          <el-form ref="waterForm" :model="waterForm" :rules="waterrules" class="Plugsetup-row">
            
          
           <template v-if="[1,2].includes(waterForm.waterMeterType) && [53,55].includes(waterForm.targetCategoryId)">
            <div class="Plugsetup-list">
            <div class="Plugsetup-title">{{[1].includes(waterForm.waterMeterType)?'水压高压':'高水位'}}(%)</div>
         
            <el-form-item label="报警阈值：" prop="waterHighPressureThreshold" class="Plugsetup-box">
              <el-input v-model="waterForm.waterHighPressureThreshold"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="waterHighPressureRecoveryThreshold" class="Plugsetup-box">
              <el-input v-model="waterForm.waterHighPressureRecoveryThreshold"></el-input>
            </el-form-item>
             <div class="Plugsetup-title">{{[1].includes(waterForm.waterMeterType)?'水压低压':'低水位'}}(%)</div>
            <el-form-item label="报警阈值：" prop="waterLowPressureThreshold" class="Plugsetup-box">
              <el-input v-model="waterForm.waterLowPressureThreshold"></el-input>
            </el-form-item>
            <el-form-item label="恢复阈值：" prop="waterLowPressureRecoveryThreshold " class="Plugsetup-box">
              <el-input v-model="waterForm.waterLowPressureRecoveryThreshold "></el-input>
            </el-form-item>
          </div>
           
          </template>
           <div class="Plugsetup-list">
             
 <template v-if="waterForm.waterMeterType == 0 || waterForm.targetCategoryId==48">
              <el-form-item label="水表计数上报阈值(升)：" prop="waterMeterReportThreshold" class="Plugsetup-box">
                <el-input v-model.number="waterForm.waterMeterReportThreshold"></el-input>
              </el-form-item>
            </template>
            <template v-if="[1,2].includes(waterForm.waterMeterType) &&  [53,55].includes(waterForm.targetCategoryId)">
              <el-form-item :label="`${[1].includes(waterForm.waterMeterType)?'水压':'水位'}采样间隔(分钟)：`" prop="waterPressureSamplingInterval" class="Plugsetup-box">
                <el-input v-model.number="waterForm.waterPressureSamplingInterval"></el-input>
              </el-form-item>
                <el-form-item :label="`${[1].includes(waterForm.waterMeterType)?'水压':'水位'}跳变阈值(%)：`" prop="waterPressureChangeThreshold" class="Plugsetup-box">
                <el-input v-model.number="waterForm.waterPressureChangeThreshold"></el-input>
              </el-form-item>
             </template>
                 <el-form-item label="心跳间隔(分钟)：" prop="heartbeatInterval" class="Plugsetup-box">
                <el-input v-model.number="waterForm.heartbeatInterval"></el-input>
              </el-form-item>
                <template v-if="[1,2].includes(waterForm.waterMeterType) &&  [53,55].includes(waterForm.targetCategoryId)">
               <el-form-item :label="`${[1].includes(waterForm.waterMeterType)?'压力':'水位'}校准(%)：`" prop="waterPressure" class="Plugsetup-box">
                  <el-input v-model="waterForm.waterPressure"></el-input>
                </el-form-item>
             <!-- <el-form-item label="最大压力校准电阻：" prop="highResistance" class="Plugsetup-box">
              <el-input :disabled="true" v-model="waterForm.highResistance"></el-input>
            </el-form-item> -->
              </template>
            </div>
        
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" class="" @click="setWaterProgram()">确定
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <div class="Plugpop-section">
      <el-dialog :title="waterParameter.channelName+`参数设置`"  class="water-row" :visible.sync="waterParameter.dialogVisible" :width="waterParameter.waterMeterType==0 || waterParameter.targetCategoryId==48?'470px':'320px'" :close-on-click-modal="false">
        <div>
          <el-form ref="waterParameter" :model="waterParameter" :rules="waterrules" class="Plugsetup-row">
            
          
       
            <div class="Plugsetup-list" :style="[1,2].includes(waterForm.waterMeterType) &&  [53,55].includes(waterForm.targetCategoryId)?'flex: 1;':''">
              <div class="Plugsetup-title">{{waterParameter.waterMeterType==0 || waterParameter.targetCategoryId==48?'历史读数与单位设置':"量程设置"}}</div>
         <template  v-if="waterParameter.waterMeterType==0 || waterParameter.targetCategoryId==48">
              <el-form-item label="历史读数(升)：" prop="historyValue">
                <el-input v-model.Number="waterParameter.historyValue"></el-input>
              </el-form-item>
              <el-form-item label="系数单位" prop="transformerCoefficient">
              <el-select v-model.Number="waterParameter.transformerCoefficient" placeholder="请选择水表跳变系数">
                  <el-option  v-for="item in waterCoefficientList" :key="item.value"  :value="item.value" :label="item.label"></el-option>
                 
                </el-select>
              </el-form-item>
              </template>
               <el-form-item :label="`满量程(${[1].includes(waterForm.waterMeterType)?'MPa':'米'})：`" prop="maxWaterPressure" v-if="[1,2].includes(waterForm.waterMeterType) &&  [53,55].includes(waterForm.targetCategoryId)">
                <el-input v-model.Number="waterParameter.maxWaterPressure"></el-input>
              </el-form-item>
              <div style="text-align: center;">
              <el-button type="primary" class="" @click="setWaterHistoryValue()">设置
              </el-button>
              </div>
           </div>
           
            <div class="Plugsetup-list"  v-if="waterParameter.waterMeterType==0 || waterParameter.targetCategoryId==48">
           
             <div class="Plugsetup-title">读数同步设置</div>
              <el-form-item :label="`读数(${waterCoefficientList.filter(item=>item.value==waterParameter.transformerCoefficient)[0].label})`" prop="cumulativeCount">
                <el-input v-model.Number="waterParameter.cumulativeCount"></el-input>
              </el-form-item>
              <div style="text-align: center;">
              <el-button type="primary" class="" @click="setWaterCumulativeCount()">设置
              </el-button>
          
            </div>
          </div>
           
        
          </el-form>
          
        </div>
      </el-dialog>
    </div>
    <!--水表数据导出-->
    <div class="Plugpop-section">
      <el-dialog
      class="Excel-dia"
      title="导出水表数据"
      :visible.sync="probeExportObj.dialogVisible"
      width="350px"
    
      :close-on-click-modal="false"
      >
      <div class="Excel-row">
       
        <div class="Excel-box" >
          <div class="Excel-title">导出类型</div>
          <div style="flex: 1">
             <el-select v-model="probeExportObj.type"  placeholder="请选择">
                          <el-option
                            label="指定月每日用水数据"
                            :value="1"
                          >
                          </el-option>
                          <el-option
                            label="指定年每月用水数据"
                            :value="2"
                          >
                          </el-option>
                        </el-select>
          </div>
        </div>
        <div class="Excel-box">
          <div class="Excel-title">导出时间</div>
          <div>
          
            <el-date-picker
              v-model="probeExportObj.time"
              :type="probeExportObj.type==1?'month':'year'"
              value-format="yyyy-MM-[01]"
              :format="probeExportObj.type==1?'M月':'yyyy年'"
          
              :placeholder="probeExportObj.type==1?'选择月':'选择年'"
            >
            </el-date-picker>
          </div>
        </div>
        <div>
     
      </div>

        <div class="Plugsetup-btn">
          <el-button type="primary" @click="probeExportSubmit()"> 确定 </el-button>
        </div>
      </div>
    </el-dialog>
    </div>
    <div class="Plugpop-section">
      <el-dialog
      class="Excel-dia"
      title="导出数据"
      :visible.sync="DoorExportObj.dialogVisible"
      width="490px"
    
      :close-on-click-modal="false"
      >
      <div class="Excel-row">
        <div class="Excel-box">
          <div class="Excel-title">导出时间</div>
          <div>
          
           <el-date-picker
           
              v-model="DoorExportObj.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
        <div>
     
      </div>

        <div class="Plugsetup-btn">
          <el-button type="primary" @click="DoorExportSubmit()"> 确定 </el-button>
        </div>
      </div>
    </el-dialog>
    </div>
    <!--语音播报-->
     <div class="Plugpop-section">
      <el-dialog :title="microwaveSoundObj.audioDialog.channelName+`语音播报`" :visible.sync="microwaveSoundObj.audioDialog.dialog" width="350px" :close-on-click-modal="false">
        <div class="">
          <div class="audioRecognitionList-input"><span style="white-space: nowrap;">播放次数：</span>
              <el-input-number v-model="microwaveSoundObj.audioDialog.repeatTimes" controls-position="right" :min="1" :max="5"></el-input-number>
           
          </div>
          <div style="margin-top: 0.1rem;color:#fff;border-bottom: 1px solid #fff;padding-bottom: 0.1rem">播报内容</div>
          <div class="audioRecognitionList-row">
        
          <div class="audioRecognition-row" v-for="item in audioRecognitionList" :key="item.id">
            <span>{{item.audioContent}}</span>
                <el-button type="primary" size="mini" class="" @click="setMicrowaveSoundAudioPlay(item.recognitionId)">播报
            </el-button>
            </div>
          </div>
        </div>
      </el-dialog>
       <!--语音编程-->
      <el-dialog :title="microwaveSoundObj.programmingDialog.channelName+`阈值设置`"  class="microwaveSound-row" :visible.sync="microwaveSoundObj.programmingDialog.dialog" width="280px" :close-on-click-modal="false">
        <div>
          <el-form ref="programmingForm" :model="microwaveSoundObj.programmingDialog" class="Plugsetup-row">
            
           <div class="Plugsetup-list">
              <el-form-item label="是否使能语音识别：" prop="voiceVolume" class="Plugsetup-box">
              <el-switch class="Plugsetup-switch" style="display: block" :active-value="1" :inactive-value="0"
                v-model="microwaveSoundObj.programmingDialog.enableSpeechRecognition" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
              </el-form-item>
              <el-form-item label="语音播放音量：" prop="voiceVolume" class="Plugsetup-box">
                <el-input v-model.number="microwaveSoundObj.programmingDialog.voiceVolume"></el-input>
              </el-form-item>
            
            
              <el-form-item label="语音识别灵敏度：" prop="speechRecognitionThreshold " class="Plugsetup-box">
                <el-input v-model.number="microwaveSoundObj.programmingDialog.speechRecognitionThreshold "></el-input>
              </el-form-item>
            </div>
        
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" class="" @click="setMicrowaveSoundProgram()">确定
            </el-button>
          </div>
        </div>
      </el-dialog>
    
    </div>
    <div >
      <el-dialog :title="statisticstitle+statistics_title" :visible.sync="dialogStatisticsVisible" top="3vh" :width="dialogWidth" :close-on-click-modal="false">
        <div class="statistics-tab-title-row">
          <div @click="statisticsType=1" :class="statisticsType==1?'tab_on':''">数据曲线</div>
          <!--v-if="![48,53].includes(this.dialogdeviceData.targetCategoryId)"-->
          <div @click="statisticsType=2"  :class="statisticsType==2?'tab_on':''" v-if="![53,55].includes(this.dialogdeviceData.targetCategoryId)">用{{[48].includes(this.dialogdeviceData.targetCategoryId)?'水':'电'}}报表</div>
        </div>
        <div v-if="statisticsType==1">
        <div class="dialog-check-day">
          <!-- <el-checkbox-group v-model="dialogCheckDayList" @change="changeDay">
            <el-checkbox label="1">当日</el-checkbox>
            <el-checkbox label="2">近七日</el-checkbox>
          </el-checkbox-group> -->
       
          <el-radio-group
            v-model="dialogCheckDay"
            @input="changeDay"
            size="mini"
          >
            <el-radio-button label="1">当日</el-radio-button>
            <el-radio-button label="2" v-if="!['34','143','148','149','142','132'].includes(dialogdeviceData.probeMoldCode)">近七日</el-radio-button>
            <el-radio-button label="3">自定义</el-radio-button>
          
          </el-radio-group>
          <el-date-picker
              v-model="CheckDayTime[0]"
              type="date"
                 style="margin-left:0.1rem"
               v-if="dialogCheckDay == 3 && ['34','143','148','149','142','132'].includes(dialogdeviceData.probeMoldCode)"
                format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
              placeholder="选择日期"
                 size="small"
                @change="DayTimeCustom"
                :pickerOptions="pickerOptions2"
              class="CheckDayTime-row">
            </el-date-picker>
             <el-date-picker
             style="margin-left:0.1rem"
            v-if="dialogCheckDay == 3 && !['34','143','148','149','142','132'].includes(dialogdeviceData.probeMoldCode)"
            v-model="CheckDayTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="DayTimeCustom"
            ref="scanTextbox"
            size="small"
            :editable="false"
            class="CheckDayTime-row"
          >
          </el-date-picker>
        </div>
        <DataStatistics :dialogCheckDay="dialogCheckDay2" :statisticsEchartsData="statisticsEchartsData" :statisticsprobeid="statisticsprobeid" v-if="dialogStatisticsVisible" />
        </div>
        <div v-if="statisticsType==2">
           <ProbeEleInfos :probe="dialogdeviceData" />
        </div>
      </el-dialog>
    </div>
    <div >
      <el-dialog :title="channelTimingTitle+`定时管理`" :visible.sync="dialogChannelTimingVisible" top="3vh" width="13.1rem" :close-on-click-modal="false">
        <ProbeTiming :probeTargetCategory="channelTimingTargetCategory" :probeMoldCode="channelTimingMoldCode"  :channelId="channelTimingId" v-if="dialogChannelTimingVisible" />
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="probeItem.channelName + `-设备调试`" :visible.sync="dialogDebugWindowVisible"  :close-on-click-modal="false">
        <DebugWindow :probeItem="probeItem"  v-if="dialogDebugWindowVisible" />
      </el-dialog>
    </div>
    <!-- <el-tooltip effect="dark" content="切换到平面图" placement="top-start">
      <div class="change-icon" @click="changeShowPlan">
        <img :src="require('@/assets/icons/icon-change.png')" />
      </div>
    </el-tooltip> -->
    <div>
    <el-drawer
            :visible.sync="alarmShow"
            direction="rtl"
            :with-header="false"
            size="500px">
      <el-table class="alarm-list-table"
                :data="alarmList"
                :border="false"
      >
        <el-table-column show-overflow-tooltip property="msg" align="left" label="告警信息">
        </el-table-column>
        <el-table-column show-overflow-tooltip property="time" align="left" label="告警时间" >
        </el-table-column>
      </el-table>
    </el-drawer>
    </div>
  </div>
</template>

<script>
import ajax from "@/utils/ajax";
import { sendWebsocket, closeWebsocket } from "@/utils/websocket.js";
import DataStatistics from "@/pages/admin/components/DataStatistics/DataStatistics.vue"
import ProbeTiming from "@/pages/admin/components/ProbeTiming/ProbeTiming.vue"
import DebugWindow from "@/pages/admin/components/DebugWindow/DebugWindow.vue"
import moment from "moment";
import axios from "axios";
import date from '@/utils/date.js'
import ProbeEleInfos from "@/pages/admin/components/ProbeEleInfos/ProbeEleInfos.vue";
let optimeout;
let targetCategoryData = [];
let chargetargetCategoryData = [];
let oldPWtime = null;
let pollingtime = null
let socketpollingtime = null
let offontiem=null
let temperatureChange=null
const NoControl =[1301,1401,1601,1801,2101,2001,2201,2301,2901,3101]
//无线报警按钮1301 红外传感器1401 燃气探测器1601 物联报警计量插座1801 地插2101 6100C 2001 ,接地告警插座 2301

const airMode_F = [
  { type: 0, name: "自动" },
  { type: 1, name: "制冷" },
  { type: 2, name: "除湿" },
  { type: 3, name: "送风" },
  { type: 4, name: "制暖" },
];
const cascadeairMode_F = [
  { type:0, name: "错误" },
  { type: 1, name: "制冷" },
  { type: 2, name: "除湿" },
  { type: 4, name: "送风" },
  { type: 8, name: "制暖" },
];
const airSpeed_F = [
  { type: 0, name: "自动" },
  { type: 1, name: "1档" },
  { type: 2, name: "2档" },
  { type: 3, name: "3档" },
];

const cascadeairSpeed_F = [
{ type: 0, name: "自动档" },
  { type: 1, name: "高速" },
  { type: 2, name: "中速" },
  { type: 3, name: "中高速" },
  { type: 4, name: "低速" },
  { type: 5, name: "中低速" },
  { type: 6, name: "自动档" },
];
//中央空调
const cairMode_F = [
  { type: 0, name: "冷风" },
  { type: 1, name: "暖风" },
  { type: 2, name: "送风" }
];
const cairSpeed_F = [
  { type: 0, name: "自动" },
  { type: 1, name: "弱风" },
  { type: 2, name: "中风" },
  { type: 3, name: "强风" },
];
const cairkeyboar_K = [
  { type: 0, name: "所有键盘打开" },
  { type: 1, name: "模式锁定" },
  { type: 2, name: "风扇和模式锁定" },
  { type: 3, name: "仅开关机按键打开" },
  { type: 4, name: "锁定所有按键" },
];
const probeState = [
  { type: 0, name: "关" },
  { type: 1, name: "开" },
];

export default {
  props: {
    organId: {
      type: Number,
    },
    isShowPlan: {
      type: Boolean,
      require: true,
    },
    areaId: {
      type: Number,
      require: true,
    },
    areaType: {
      type: String,
      require: true,
    },
    audioRecognitionList:{
      type: Array,
      default: () => [],
    }
  }, 
  components: {
    DataStatistics,
    ProbeTiming,
    DebugWindow,
    ProbeEleInfos
  },
  data() {
    let validatePass = (rule, value, callback) => {

      let chekpw = /^[0-9]{4,8}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value == '123456') {
        callback(new Error('密码不能为123456!'));
      }
      else if (!value.match(chekpw)) {
        callback(new Error('请输入4-8位数字密码'));
      }
      else {
        if (this.LoraPresonPWForm.checkPass !== '') {
          this.$refs.LoraPresonPWForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.LoraPresonPWForm.content) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let expiretime = (rule, value, callback) => {
      if (this.LoraPresonPWForm.valid == '2') {
        callback();
      }
      else if (value == '') {
        callback(new Error('请选择密码有效日期!'));
      }
      else {
        callback();
      }
    };
    let validateAlarmValue = (minValue, maxValue,decimal=true) => (rule, value, callback) => {
      
      if (value === '') {
      callback(new Error('不能为空'));
      }
      else if(value<0){
        callback(new Error('不能填写为负数'));
      }
      else if (!/^\d+$/.test(value) && decimal) {
          callback(new Error('不能填写为小数'));
      } else if (value < minValue) {
      callback(new Error(`建议不小于${minValue}`));
      } else if (value > maxValue) {
      callback(new Error(`建议不大于${maxValue}`));
      } else {
      callback();
      }
    };
    let durationrule = validateAlarmValue(0, 255)
    let lp_run_timerule = validateAlarmValue(0, 255)
    //过压阈值
    let ov_alarm_value = validateAlarmValue(242, 266)
    //过压恢复阈值
    let ov_restore_value = validateAlarmValue(242, 255)
    //欠压阈值
    let uv_alarm_value = validateAlarmValue(176, 198)
    //欠压恢复阈值
    let uv_restore_value = validateAlarmValue(187, 198)
   
    //超温阈值
    let tem_alarm_value = validateAlarmValue(60, 80)
    //超温恢复阈值
    let tem_restore_value = validateAlarmValue(50, 75)
    //过载阈值
    let Three_ol_alarm_value = validateAlarmValue(0, 9240)
    let ol_alarm_value = validateAlarmValue(0, 4000)
    //过载恢复阈值
    let Three_ol_restore_value = validateAlarmValue(50, 8800)
    let ol_restore_value = validateAlarmValue(50, 1800)
    let LowPowerFactorValuerule = validateAlarmValue(0, 100)
    // 低功率
    let lowPowerThreshold = validateAlarmValue(50, 8800)
    let lowPowerRecoveryThreshold = validateAlarmValue(50, 1800)

    //低温
    let lowTemperatureThreshold = validateAlarmValue(0, 100)
    let lowTemperatureRecoveryThreshold = validateAlarmValue(0, 100)
 
    //室内高温
    let roomOverTemThreshold = validateAlarmValue(0, 100)
    let roomOverTemRecoveryThreshold = validateAlarmValue(0, 100)

    //室内低温
    let roomLowTemThreshold = validateAlarmValue(0, 100)
    let roomLowTemRecoveryThreshold = validateAlarmValue(0, 100)
    
    //剩余电流
    let residualCurrentOverThreshold = validateAlarmValue(0, 10000)
    let residualCurrentRecoveryThreshold = validateAlarmValue(0, 10000)


    
    //高温
    let alarmOverTemperatureAlarm = validateAlarmValue(60, 80)
    let alarmOverTemperatureWarning = validateAlarmValue(60, 70)
    let alarmOverTemperatureRecovery = validateAlarmValue(50, 75)
    //低温
    let alarmLowTemperatureAlarm = validateAlarmValue(0, 100)
    let alarmLowTemperatureWarning = validateAlarmValue(0, 100)
    let alarmLowTemperatureRecovery = validateAlarmValue(0, 100)
    //水压
    let waterMeterReportThreshold = validateAlarmValue(10, 100)
    let waterPressureSamplingInterval = validateAlarmValue(1, 60)
    let waterPressureChangeThreshold = validateAlarmValue(1, 50)
    let heartbeatInterval = validateAlarmValue(1, 60)
    let waterHighPressureThreshold = validateAlarmValue(0, 100)
    let waterHighPressureRecoveryThreshold = validateAlarmValue(0, 100)
    let waterLowPressureThreshold = validateAlarmValue(0, 100)
    let waterLowPressureRecoveryThreshold = validateAlarmValue(0, 100)
    let waterPressure = validateAlarmValue(0, 100)
    //电流报警
    let overCurrentThreshold = validateAlarmValue(0, 10000,false)
    let overCurrentRecoveryThreshold = validateAlarmValue(0, 10000,false)
    // 电流断电
    let overCurrentCloseThreshold = validateAlarmValue(0, 10000,false)
    // 电压断电
    let overVoltageCloseThreshold = validateAlarmValue(0, 10000)
    let overVoltageRecoveryOpenThreshold = validateAlarmValue(0, 10000)
    // 低电压断电
    let lowVoltageCloseThreshold = validateAlarmValue(0, 10000)
    let lowVoltageRecoveryOpenThreshold = validateAlarmValue(0, 10000)
    // 过载断电
    let overloadCloseThreshold = validateAlarmValue(0, 10000)
    // 低电压断电
    let overTemperatureCloseThreshold = validateAlarmValue(0, 10000)
    let overTemperatureRecoveryOpenThreshold = validateAlarmValue(0, 10000)
     // 合闸间隔
    let autoPowerOnInterval = validateAlarmValue(5, 1200)
    // 合闸次数
    let autoPowerOnMaxTimes = validateAlarmValue(0, 10)
    return {
      typeselect: [],
      chargetypeselect: [],
      typeStateselect: [
        { type: 0, name: "关" },
        { type: 1, name: "开" }
      ],
      //告警通知
      alarmList: [],
      alarmShow: false,
      isNewAlarm: false,
      isAlarmTip: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - (24 * 60 * 60 * 1000));
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      areatype: "",
      //lora门锁
      loralockGroupshow: false,
      LoraPersonListshow: false,
      addLoraPersonListshow: false,
      LoraPersonPWListshow: false,
      LoraPresonForm: {
        id: ''
      },
      LoraPresonrules: {
        id: [{ required: true, message: '请选择人员', trigger: 'change' }
        ],
      },
      loralockGroup: {
        mute: -1,
        normallyOpen: -1,
        isopen: -1,
        id: -1
      },
      LoraPersonListData: [],
      LoraPersonPWListData: [],
      addLoraPersonPWshow: false,
      LoraPresonPWForm: {
        content: '',
        checkPass: '',
        type: 1,
        localDateTime: '',
        valid: '1',
        personId: -1,
        probeId: -1,
        id: -1,
        addtype: -1,//添加:0 修改:1
        admin:0
      },

      LoraPresonPWrules: {
        content: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        localDateTime: [{ validator: expiretime, trigger: 'blur' }],
      },
      Doorlock_copshow: false,
      Doorlock_copobjectid: null,
      Doorlock_copid: -1,
      Doorlock_instructshow: false,
      Doorlock_instructlist: [
      ],
      valid2: true,
      PersonPWtitle: '',
      //默认状态
      mopojoGroup: {
        ov_electricity: 1,
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 255,
        ov_restore_value: 245,
        ov_buzzer: true, //过压蜂鸣器
        uv_electricity: 1,
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 180,
        uv_restore_value: 198,
        uv_buzzer: true,//欠压蜂鸣器
        ol_electricity: 1,
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value: 600,
        ol_restore_value: 500,
        ol_buzzer: true, //过载蜂鸣器
        tem_electricity: 1,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 65,
        tem_restore_value: 55,
        tem_buzzer: true,//超温蜂鸣器
        switch_enable: true,
        duration: 10,
        lp_buzzer: true,
        lp_alarm: 1,
        lp_electricity: 1,
        lp_restore: 1,
        lp_run_time: 2,
        switchdurationEnable: true
      },
      pojoGroup: {
        ov_electricity: 1,
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 255,
        ov_restore_value: 245,
        ov_buzzer: false, //过压蜂鸣器
        uv_electricity: 1,
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 185,
        uv_restore_value: 195,
        uv_buzzer: false,//欠压蜂鸣器
        ol_electricity: 1,
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value: 600,
        ol_restore_value: 500,
        ol_buzzer: false, //过载蜂鸣器
        tem_electricity: 1,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 80,
        tem_restore_value: 60,
        tem_buzzer: false,//超温蜂鸣器
        switch_enable: false,
        duration: 10,
        lp_buzzer: false,
        lp_alarm: 1,
        lp_electricity: 1,
        lp_restore: 1,
        lp_run_time: 2,
        switchdurationEnable: true
      },
      pojoid: -1,
      rules: {
        ov_alarm_value: [{  validator: ov_alarm_value , trigger: 'blur' }],
        ov_restore_value: [{  validator: ov_restore_value , trigger: 'blur' }],
        uv_alarm_value:[{  validator: uv_alarm_value , trigger: 'blur' }],
        uv_restore_value:[{  validator: uv_restore_value , trigger: 'blur' }],
        ol_alarm_value: [{   validator: (rule, value, callback) => {
          if (this.probeKindCode110) {
            return Three_ol_alarm_value(rule, value, callback);
          } else {
            return ol_alarm_value(rule, value, callback);
          }
        }, trigger: 'blur' }],
        ol_restore_value: [{   validator: (rule, value, callback) => {
          if (this.probeKindCode110) {
            return Three_ol_restore_value(rule, value, callback);
          } else {
            return ol_restore_value(rule, value, callback);
          }
        }, trigger: 'blur' }],
        tem_alarm_value: [{  validator: tem_alarm_value , trigger: 'blur' }],
        tem_restore_value: [{  validator: tem_restore_value , trigger: 'blur' }],
        duration: [{ validator: durationrule, trigger: 'blur' }],
        lp_run_time: [{ validator: lp_run_timerule, trigger: 'blur' }],
      },
      searching: false,
      screenshow: true,
      probeState: "",
      probeType: "",
      treeData: [],
      tableDataAll: [],
      chargetableDataAll: [],
      tableData: [],
      tableDataCache: [],
      defaultProps: {
        children: "areas",
        label: "name",
      },
      datalistindex: -1,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //充电桩翻页
      probetotal: 0,
      probecurrentPage: 1,
      probepageSize: 20,
      //充电插座数据
      probeDataAllpower: 0,
      probe_tableDataAll: [],
      probe_tableData: [],
      probe_tableDataCache: [],
      //温度范围
      minst: 0,
      maxst: 0,
      //总电流
      totalsi: 0,
      //功率因数
      minsr: 0,
      maxsr: 0,
      dialogVisible: false,
      dialogVisible_center: false,
      pojoAirConditionerData: {

      },
      modeOptions: [
        // {
        //   name: "自动",
        //   M: "0",
        // },
        {
          name: "制冷",
          M: "1",
        },
        {
          name: "除湿",
          M: "2",
        },
        {
          name: "送风",
          M: "3",
        },
        {
          name: "制暖",
          M: "4",
        },
      ],
      //级联空调模式
      cascademodeOptions: [
        {
          name: "制冷",
          M: "1",
        },
        // {
        //   name: "除湿",
        //   M: "2",
        // },
        // {
        //   name: "送风",
        //   M: "4",
        // },
        {
          name: "制暖",
          M: "8",
        },
      ],
      modeValue: 0,
      speedOptions: [
        {
          name: "自动",
          W: "0",
        },
        {
          name: "1档",
          W: "1",
        },
        {
          name: "2档",
          W: "2",
        },
        {
          name: "3档",
          W: "3",
        },
      ],
      //级联空调控制器风速
      cascadespeedOptions: [
        {
          name: "高速",
          W: "1",
        },
        {
          name: "中高速",
          W: "3",
        },
        {
          name: "中速",
          W: "2",
        },
        
        {
          name: "中低速",
          W: "5",
        },
        {
          name: "低速",
          W: "4",
        },
        
      ],
      speedValue: 0,
      directionOptions: [
        {
          name: "自动",
          D: "0",
        },
        {
          name: "手动",
          D: "1",
        },
      ],
      dialogCascadeVisible: false,
      //中央空调
      center_pojoAirConditionerData: {},
      center_temperatureSetValue: 0,
      center_modeOptions: [

        {
          name: "冷风",
          M: "0",
        },
        {
          name: "暖风",
          M: "1",
        },
        {
          name: "送风",
          M: "2",
        },

      ],
      center_open: 0,
      center_modeValue: 0,
      center_speedOptions: [
        {
          name: "自动",
          W: "0",
        },
        {
          name: "弱风",
          W: "1",
        },
        {
          name: "中风",
          W: "2",
        },
        {
          name: "强风",
          W: "3",
        },
      ],
      center_speedValue: 0,
      center_keyboardValue: 0,
      center_keyboardOptions: [
        {
          name: "所有键盘打开",
          K: "0",
        },
        {
          name: "模式按键锁定",
          K: "1",
        },
        {
          name: "风扇和模式按键锁定",
          K: "2",
        },
        {
          name: "仅开关机按键打开",
          K: "3",
        },
        {
          name: "锁定所有按键",
          K: "4",
        },
      ],
      directionValue: 0,
      Electricalappliances: true,
      refreshInterval: 0,
      optionStartTime: "",
      pojoProbeControlCode: null,

      pojoGrouptitle:'',
      Plugsetupshow: false,
      Plugswsetupshow: false,
      value2: 1,
      swsetupgrop: {
        state: -1,
        name: "",
        number: -1,
        id: -1,
        channel: -1,
        key: -1
      },
      loading: false,
      change_btn_probe: false,
      change_btn_Channel: true,
      oldPWnum: -1,
      newPWnum: -1,
      newpwupdate: false,
      usermanager: this.$store.getters.user.manager,

      lockpersondata: [],
      probeEdition: 0, //探头版本
      probeKindCode202: true, //探头类型判断
      probeKindCode110: true, //探头类型判断
      probeKindCode:null,
      ceilingVisible: false,
      runTime: 0,
      ceilingfanid: 0,
      fanObj:{
        channelNum:'',
        isTransmission:false
      },
      //nb编程项目
      NBrules: {
        OverVoltage: {
          AlarmValue: [{  validator: ov_alarm_value , trigger: 'blur' }],
          ResumeValue: [{  validator: ov_restore_value , trigger: 'blur' }],
        },
        UnderVoltage: {
          AlarmValue: [{  validator: uv_alarm_value , trigger: 'blur' }],
          ResumeValue: [{  validator: uv_restore_value , trigger: 'blur' }],
        },
        OverLoad: {
          AlarmValue: [{  validator: ol_alarm_value , trigger: 'blur' }],
          ResumeValue: [{  validator: ol_restore_value , trigger: 'blur' }],
        },
        LowPower: {
          AlarmValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
          ResumeValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        },
        LowPowerFactor: {
          AlarmValue: [{ validator: LowPowerFactorValuerule, trigger: 'blur' }],
          ResumeValue: [{ validator: LowPowerFactorValuerule, trigger: 'blur' }],
        },
        HighCurrent: {
          AlarmValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
          ResumeValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        },
        LowCurrent: {
          AlarmValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
          ResumeValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        },
      },
      NBPlugsetupshow: false,
      NBmopojoGroup: {
        HighCurrent: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowCurrent: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowPower: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowPowerFactor: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        OverLoad: {
          AlarmPush: true,
          AlarmValue: null,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: null,
        },
        OverVoltage: {
          AlarmPush: true,
          AlarmValue: 260,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: 255,
        },
        UnderVoltage: {
          AlarmPush: true,
          AlarmValue:180,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: 198,
        }
      },
      NBpojoGroup: {
        HighCurrent: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowCurrent: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowPower: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        LowPowerFactor: {
          AlarmPush: false,
          AlarmValue: 0,
          AutoOff: false,
          ResumePush: false,
          ResumeValue: 0,
        },
        OverLoad: {
          AlarmPush: true,
          AlarmValue: null,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: null,
        },
        OverVoltage: {
          AlarmPush: true,
          AlarmValue: 260,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: 255,
        },
        UnderVoltage: {
          AlarmPush: true,
          AlarmValue:180,
          AutoOff: false,
          ResumePush: true,
          ResumeValue: 198,
        }
      },
      NBprodid: null,
      customcontrolbool: false,
      airListvalue: null,
      airListData: [],
      airCodevalue: null,
      airCodeListdata: [],
      //读取空调控制码相关
      getAirControlbool: false,
      getAirControlloading: {},
      getAirControlinterval: {},
      getAirControlResultCount: 0,
      getAirControl:null,
      ProbeAirMaxshow:false,
      ProbeAirMax:{
        key:null,
        value:'',
      },
       //默认状态
       ThreemopojoGroup: {
        ov_electricity: 0,
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 265,
        ov_restore_value: 255,
        ov_buzzer: true, //过压蜂鸣器
        uv_electricity: 0,
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 180,
        uv_restore_value: 198,
        uv_buzzer: true,//欠压蜂鸣器
        ol_electricity: 0,
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value: '',
        ol_restore_value: '',
        ol_buzzer: true, //过载蜂鸣器
        tem_electricity: 0,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 80,
        tem_restore_value: 75,
        tem_buzzer: true,//超温蜂鸣器
       
        lp_buzzer: false,
        lp_alarm: 0,
        lp_electricity: 0,
        lp_restore: 0,
        lp_run_time: 0,
        ele_timeout_shutdown: false,
        ele_func_buzzer: false,
        ele_charging_timeout: 0,
        switch_enable: true,
        
       //接地报警
       overVoltageAlarm:0,
        lowVoltageAlarm:0,
        overloadAlarm:0,
        overTemperatureAlarm:0,
        lowPowerAlarm:0,
      },
      ThreepojoGroup: {
        ov_electricity: 0,
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 266,
        ov_restore_value: 255,
        ov_buzzer: false, //过压蜂鸣器
        uv_electricity: 0,
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 187,
        uv_restore_value: 198,
        uv_buzzer: false,//欠压蜂鸣器
        ol_electricity: 0,
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value: 9240,
        ol_restore_value: 8000,
        ol_buzzer: false, //过载蜂鸣器
        tem_electricity: 0,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 85,
        tem_restore_value: 75,
        tem_buzzer: false,//超温蜂鸣器
        
        lp_buzzer: false,
        lp_alarm: 0,
        lp_electricity:0,
        lp_restore: 0,
        lp_run_time: 0,
        ele_timeout_shutdown: false,
        ele_func_buzzer: false,
        ele_charging_timeout: 0,
        switch_enable: true,
        //接地报警
        overVoltageAlarm:0,
        lowVoltageAlarm:0,
        overloadAlarm:0,
        overTemperatureAlarm:0,
        lowPowerAlarm:0,
      },
      Threepojoid: -1,
      Threerules: {
        ov_alarm_value: [{  validator: ov_alarm_value , trigger: 'blur' }],
        ov_restore_value: [{  validator: ov_restore_value , trigger: 'blur' }],
        uv_alarm_value:[{  validator: uv_alarm_value , trigger: 'blur' }],
        uv_restore_value:[{  validator: uv_restore_value , trigger: 'blur' }],
        ol_alarm_value: [{  validator: Three_ol_alarm_value , trigger: 'blur' }],
        ol_restore_value: [{  validator: Three_ol_restore_value , trigger: 'blur' }],
        tem_alarm_value: [{  validator: tem_alarm_value , trigger: 'blur' }],
        tem_restore_value: [{  validator: tem_restore_value , trigger: 'blur' }],
        duration: [{ validator: durationrule, trigger: 'blur' }],
        lp_run_time: [{ validator: lp_run_timerule, trigger: 'blur' }],
      },
      ThreePlugsetupshow:false,
      ThreePlugsetupchannel:1,
      ThreePlugsetupOldchannel:1,
      //延迟开关
      dialogDelayCloseVisible:false,
      delayCloseform:{
        id:'',
        hour:null,
        minute:null,
        second:null,
        delayClose:null,
        isDelayClose:false
      },
      // 透传编程
      throughPlugsetupshow:false,
      isAirthrough:false,
      throughMoldCode:0,
      throughRules: {
        ov_alarm_value: [{  validator: ov_alarm_value , trigger: 'blur' }],
        ov_restore_value: [{  validator: ov_restore_value , trigger: 'blur' }],
        uv_alarm_value:[{  validator: uv_alarm_value , trigger: 'blur' }],
        uv_restore_value:[{  validator: uv_restore_value , trigger: 'blur' }],
        ol_alarm_value: [{  validator: Three_ol_alarm_value , trigger: 'blur' }],
        ol_restore_value: [{  validator: Three_ol_restore_value , trigger: 'blur' }],
        tem_alarm_value: [{  validator: tem_alarm_value , trigger: 'blur' }],
        tem_restore_value: [{  validator: tem_restore_value , trigger: 'blur' }],
       
        lowPowerThreshold: [{  validator: lowPowerThreshold , trigger: 'blur' }],
        lowPowerRecoveryThreshold: [{  validator: lowPowerRecoveryThreshold , trigger: 'blur' }],
        lp_run_time: [{ validator: lp_run_timerule, trigger: 'blur' }],
        
        lowTemperatureThreshold: [{  validator: lowTemperatureThreshold , trigger: 'blur' }],
        lowTemperatureRecoveryThreshold: [{  validator: lowTemperatureRecoveryThreshold , trigger: 'blur' }],
       
        roomOverTemThreshold: [{  validator: roomOverTemThreshold , trigger: 'blur' }],
        roomOverTemRecoveryThreshold: [{  validator: roomOverTemRecoveryThreshold , trigger: 'blur' }],

        roomLowTemThreshold: [{  validator: roomLowTemThreshold , trigger: 'blur' }],
        roomLowTemRecoveryThreshold: [{  validator: roomLowTemRecoveryThreshold , trigger: 'blur' }],
        // 电流报警
        overCurrentThreshold: [{  validator: overCurrentThreshold , trigger: 'blur' }],
        overCurrentRecoveryThreshold: [{  validator: overCurrentRecoveryThreshold , trigger: 'blur' }],
        
        // 电流断电
        overCurrentCloseThreshold: [{  validator: overCurrentCloseThreshold , trigger: 'blur' }],
        // 电压断电
        overVoltageCloseThreshold: [{  validator: overVoltageCloseThreshold , trigger: 'blur' }],
        overVoltageRecoveryOpenThreshold: [{  validator: overVoltageRecoveryOpenThreshold , trigger: 'blur' }],
        // 低压断电
        lowVoltageCloseThreshold: [{  validator: lowVoltageCloseThreshold , trigger: 'blur' }],
        lowVoltageRecoveryOpenThreshold: [{  validator: lowVoltageRecoveryOpenThreshold , trigger: 'blur' }],
        // 过载断电
        overloadCloseThreshold: [{  validator: overloadCloseThreshold , trigger: 'blur' }],
        // 过温断电
        overTemperatureCloseThreshold: [{  validator: overTemperatureCloseThreshold , trigger: 'blur' }],
        overTemperatureRecoveryOpenThreshold: [{  validator: overTemperatureRecoveryOpenThreshold , trigger: 'blur' }],
        
        // 合闸间隔
        autoPowerOnInterval: [{  validator: autoPowerOnInterval , trigger: 'blur' }],
        // 合闸次数
        autoPowerOnMaxTimes: [{  validator: autoPowerOnMaxTimes , trigger: 'blur' }],
        
      },
      throughInitPojoGroup: {
     
    
        // 过压
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 265,
        ov_restore_value: 255,
        ov_buzzer: true, //过压蜂鸣器
        overVoltageAlarm:1,

        // 低压
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 180,
        uv_restore_value: 198,
        uv_buzzer: true,//欠压蜂鸣器
        lowVoltageAlarm:1,
        // 过载
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value:'',
        ol_restore_value: '',
        ol_buzzer: true, //过载蜂鸣器
        overloadAlarm:1,
        //低功率
        lp_electricity:0,
        lowPowerAlarm:0,
        lp_buzzer: false,
        lp_alarm: 0,
        lp_restore: 0,
        lowPowerThreshold:'100',
        lowPowerRecoveryThreshold:'120',
        lp_run_time:0,
        //超温
        overTemperatureAlarm:1,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 65,
        tem_restore_value: 55,
        tem_buzzer: true,//超温蜂鸣器
        //低温
        lowTemAlarm:1,
        lowTemAllowAlarmPush:1,
        lowTemAllowResumePush:1,
        lowTemAllowBuzzerPrompt:1,
        lowTemperatureThreshold:'10',
        lowTemperatureRecoveryThreshold:'15',
        // 室温超温
        roomOverTemAlarm:1,
        roomOverTemAllowAlarmPush:1,
        roomOverTemAllowResumePush:1,
        roomOverTemAllowBuzzerPrompt:1,
        roomOverTemThreshold:'40',
        roomOverTemRecoveryThreshold:'35',
        // 室温低温
        roomLowTemAlarm:1,
        roomLowTemAllowAlarmPush:1,
        roomLowTemAllowResumePush:1,
        roomLowTemAllowBuzzerPrompt:1,
        roomLowTemThreshold:'5',
        roomLowTemRecoveryThreshold:'10',
        // 其他
        // 超时关闭
        ele_timeout_shutdown: false,
        // 允许来电蜂鸣提示
        ele_func_buzzer: false,
        // 充电超时
        ele_charging_timeout: 0,
        // 本地开关是否启用
        switch_enable: true,

         //电流报警
        overCurrentAlarm:1,
        overCurrentAllowAlarmPush:1,
        overCurrentAllowResumePush:1,
        overCurrentAllowBuzzerPrompt:false,
        overCurrentThreshold:'',
        overCurrentRecoveryThreshold:'',

        //1P2P导轨断电
        //电流断电
        overCurrentAutomaticPowerOutage:1,
        overCurrentAutomaticPowerOn:1,
        overCurrentCloseThreshold:'',
        //超压断电
        overVoltageAutomaticPowerOn:1,
        ov_electricity:1,
        overVoltageCloseThreshold:'',
        overVoltageRecoveryOpenThreshold:'',
        //低压
        lowVoltageAutomaticPowerOn:1,
        uv_electricity:1,
        lowVoltageCloseThreshold:'',
        lowVoltageRecoveryOpenThreshold:'',
        //过载断电
        overloadAutomaticPowerOn:1,
        ol_electricity:1,
        overloadCloseThreshold:'',
        //过温
        overTemperatureAutomaticPowerOn:1,
        tem_electricity:1,
        overTemperatureCloseThreshold:'',
        overTemperatureRecoveryOpenThreshold:'',
        //合闸间隔
        autoPowerOnInterval:60,
        //合闸次数
        autoPowerOnMaxTimes:3,
      },
      throughPojoGroup: {
     
        id:'',
        probeId:'',
        targetCategoryId:'',
        probeVersion:'',
        // 过压
        ov_alarm: 1,
        ov_restore: 1,
        ov_alarm_value: 266,
        ov_restore_value: 255,
        ov_buzzer: false, //过压蜂鸣器
        overVoltageAlarm:1,

        // 低压
        uv_alarm: 1,
        uv_restore: 1,
        uv_alarm_value: 187,
        uv_restore_value: 198,
        uv_buzzer: false,//欠压蜂鸣器
        lowVoltageAlarm:1,
        // 过载
        ol_alarm: 1,
        ol_restore: 1,
        ol_alarm_value: 9240,
        ol_restore_value: 8000,
        ol_buzzer: false, //过载蜂鸣器
        overloadAlarm:1,
        //低功率
        lp_electricity:1,
        lowPowerAlarm:1,
        lp_buzzer: false,
        lp_alarm: 0,
        lp_restore: 0,
        lowPowerThreshold:'',
        lowPowerRecoveryThreshold:'',
        lp_run_time:0,
        //超温
        overTemperatureAlarm:1,
        tem_alarm: 1,
        tem_restore: 1,
        tem_alarm_value: 85,
        tem_restore_value: 75,
        tem_buzzer: false,//超温蜂鸣器
        //低温
        lowTemAlarm:1,
        lowTemAllowAlarmPush:1,
        lowTemAllowResumePush:1,
        lowTemAllowBuzzerPrompt:1,
        lowTemperatureThreshold:'',
        lowTemperatureRecoveryThreshold:'',
        // 室温超温
        roomOverTemAlarm:1,
        roomOverTemAllowAlarmPush:1,
        roomOverTemAllowResumePush:1,
        roomOverTemAllowBuzzerPrompt:1,
        roomOverTemThreshold:'',
        roomOverTemRecoveryThreshold:'',
        // 室温低温
        roomLowTemAlarm:1,
        roomLowTemAllowAlarmPush:1,
        roomLowTemAllowResumePush:1,
        roomLowTemAllowBuzzerPrompt:1,
        roomLowTemThreshold:'',
        roomLowTemRecoveryThreshold:'',

        //剩余电流
        overResidualCurrentAlarm:1,
        overResidualCurrentAllowAlarmPush:1,
        overResidualCurrentAllowResumePush:1,
        overResidualCurrentAllowBuzzerPrompt:false,
        residualCurrentOverThreshold:'',
        residualCurrentRecoveryThreshold:'',
        // 其他
        // 超时关闭
        ele_timeout_shutdown: false,
        // 允许来电蜂鸣提示
        ele_func_buzzer: false,
        // 充电超时
        ele_charging_timeout: 0,
        // 本地开关是否启用
        switch_enable: true,

        //电流报警
        overCurrentAlarm:1,
        overCurrentAllowAlarmPush:1,
        overCurrentAllowResumePush:1,
        overCurrentAllowBuzzerPrompt:false,
        overCurrentThreshold:'',
        overCurrentRecoveryThreshold:'',

        //1P2P导轨断电
        //电流断电
        overCurrentAutomaticPowerOutage:1,
        overCurrentAutomaticPowerOn:1,
        overCurrentCloseThreshold:'',
        //超压断电
        overVoltageAutomaticPowerOn:1,
        ov_electricity:1,
        overVoltageCloseThreshold:'',
        overVoltageRecoveryOpenThreshold:'',
        //低压
        lowVoltageAutomaticPowerOn:1,
        uv_electricity:1,
        lowVoltageCloseThreshold:'',
        lowVoltageRecoveryOpenThreshold:'',
        //过载断电
        overloadAutomaticPowerOn:1,
        ol_electricity:1,
        overloadCloseThreshold:'',
        //过温
        overTemperatureAutomaticPowerOn:1,
        tem_electricity:1,
        overTemperatureCloseThreshold:'',
        overTemperatureRecoveryOpenThreshold:'',
        //合闸间隔
        autoPowerOnInterval:60,
        //合闸次数
        autoPowerOnMaxTimes:3,
      },
      // 温湿度门磁
      dialogDoorContactVisible:false,
      doorContactForm:{
        id:'',
        probeId:'',
        channel:'',
        name:'',
        // 超温阈值
        tem_alarm_value:'',
        // 超温恢复
        tem_restore_value:'',
        // 低温阈值
        lowTemperatureThreshold:'',
        // 低温恢复
        lowTemperatureRecoveryThreshold:'',
        // 超湿阈值
        overHumidityThreshold:'',
        // 超湿恢复
        overHumidityRecoveryThreshold:'',
        // 低湿度阈值
        lowHumidityThreshold:'',
        // 低湿度恢复
        lowHumidityRecoveryThreshold:'',
        // 扩展温度超温阈值
        thermistorOverTemperatureThreshold:'',
        // 扩展温度超温恢复
        thermistorOverTemperatureRecoveryThreshold:'',
        // 扩展温度低温阈值
        thermistorLowTemperatureThreshold:'',
        // 扩展温度低温恢复
        thermistorLowTemperatureRecoveryThreshold:'',
        // 开启时长阈值
        eleOpenAlarmValue:'',
        // 开启时长告警间隔
        eleOpenAlarmSpace:'',
      },
      statisticsEchartsData: {
        listSensorData:[],
        electricQuantityList: {
          value: [],
          time: []
        },
        temperatureList: {
          value: [],
          time: []
        },
        activePowerList: {
          value: [],
          time: []
        },
        voltageList: {
          value: [],
          time: []
        },
        currentList: {
          value: [],
          time: []
        },
        powerFactorList: {
          value: [],
          time: []
        },
        temperatureExtend1: {
          value: [],
          time: []
        },
      },
      dialogStatisticsVisible:false,
      statisticstitle:'',
      statisticsprobeid:'',
      //设备定时
      dialogChannelTimingVisible:false,
      channelTimingId:'',
      channelTimingTitle:'',
      channelTimingMoldCode:'',
      channelTimingTargetCategory:'',
      //开关控制
      controlPermission:false,
      //阈值权限
      thresholdPermission:false,
      //微波监测
      dialogMicrowaveVisible:false,
      microwaveSeniorSet:false,
      microwaveForm:{
        id:'',
        probeId:'',
        channel:'',
        name:'',
        continuousNobodyCloseSeconds:{
          hour:'',
          minute:'',
          second:'',
        },
        continuousSomebodyOpenSeconds:{
          hour:'',
          minute:'',
          second:'',
        },
        nobodyDetectionTime:{
          hour:'',
          minute:'',
          second:'',
        },
        heartbeatInterval:{
          hour:'',
          minute:'',
          second:'',
        },
        brightnessVoltageNormalPercentage:'',
     
        microwaveDetectionDistance:600,

        microwaveAntiInterferenceValue:0,
        microwaveDetectionCapability: 0,
        microwaveModuleProgramList: [
        {
            moduleAreaCode: 0,
            movementDistance: 0,
            movementSensitivity: 1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        },
        {
            moduleAreaCode: 1,
            movementDistance: 0,
            movementSensitivity: 1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        },
        {
            moduleAreaCode: 2,
            movementDistance: 0,
            movementSensitivity: 1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        }
      ]
      },
      CheckDayTime: [],
      dialogCheckDay: '1',
      dialogCheckDay2:'1',
      dialogdeviceData:{},

      //系数
      dialogTransformerCoefficientVisible: false,
      transformerCoefficientForm:{
        id:'',
        probeId:'',
        channelName:'',
        extendProperty:{
          transformerCoefficient:1,
          voltageCoefficient:1,
          currentCoefficient:1,
        },
      },
      //所有通道
      allchannleList:[],
      //设备调试
      probeItem:{},
      dialogDebugWindowVisible:false,
      alarmTemperatureProgramrules: {
        overTemperatureAlarm: [{  validator: alarmOverTemperatureAlarm , trigger: 'blur' }],
        overTemperatureAlarmRecovery: [{  validator: alarmOverTemperatureRecovery , trigger: 'blur' }],
        lowTemperatureAlarm:[{  validator: alarmLowTemperatureAlarm , trigger: 'blur' }],
        lowTemperatureAlarmRecovery:[{  validator: alarmLowTemperatureRecovery , trigger: 'blur' }],
        overTemperatureWarning: [{  validator: alarmOverTemperatureWarning , trigger: 'blur' }],
        lowTemperatureWarning: [{  validator: alarmLowTemperatureWarning , trigger: 'blur' }],
       
      },
      dialogAlarmTemperatureProgramVisible:false,
      alarmTemperatureProgramForm: {
        id:'',
        probeId:'',
        channel:'',
        
        channelName:'',
        alarmTemperatureProgramList: [
          {
            overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: '',
          },
          {
            overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: '',
          },
          {
            overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: '',
          },
          {
           overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: ''
          },
          {
           overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: ''
          },
          {
           overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: ''
          },
          {
            overTemperatureAlarm: '',
            overTemperatureAlarmRecovery: '',
            lowTemperatureAlarm: '',
            lowTemperatureAlarmRecovery: '',
            overTemperatureWarning: '',
            lowTemperatureWarning: ''
          },
        ],
      },
      //设备数据导出
      DoorExportObj:{
        time:[],
        id:'',
        dialogVisible:false
      },
      //设备数据导出
      probeExportObj:{
        time:'',
        type:1,
        probeId:'',
        channelNum:'',
        dialogVisible:false
      },
      //水表阈值
      waterForm:{
        dialogVisible:false,
        id:'',
        probeId:'',
        channel:'',
        name:'',
        heartbeatInterval:'',
        waterPressureChangeThreshold:'',
        waterPressureSamplingInterval:'',
        waterMeterReportThreshold:'',
        //水压
        waterMeterType:'',
        waterHighPressureThreshold:'',
        waterHighPressureRecoveryThreshold:'',
        waterLowPressureThreshold:'',
        waterLowPressureRecoveryThreshold:'',
        lowResistance:'',
        highResistance:'',
      },
      waterrules: {
        waterMeterReportThreshold: [{  validator: waterMeterReportThreshold , trigger: 'blur' }],
        waterPressureSamplingInterval: [{  validator: waterPressureSamplingInterval , trigger: 'blur' }],
        waterPressureChangeThreshold: [{  validator: waterPressureChangeThreshold , trigger: 'blur' }],
        heartbeatInterval: [{  validator: heartbeatInterval , trigger: 'blur' }],
        waterHighPressureThreshold: [{  validator: waterHighPressureThreshold , trigger: 'blur' }],
        waterHighPressureRecoveryThreshold: [{  validator: waterHighPressureRecoveryThreshold , trigger: 'blur' }],
        waterLowPressureThreshold:[{  validator: waterLowPressureThreshold , trigger: 'blur' }],
        waterLowPressureRecoveryThreshold:[{  validator: waterLowPressureRecoveryThreshold , trigger: 'blur' }],
      },
       //水表参数
      waterParameter: {
        dialogVisible: false,
        probeId: "",
        channelName:"",
        historyValue: 0,
        transformerCoefficient: 10,
        cumulativeCount:0,
        waterMeterType:0,
        maxWaterPressure:0,
      },
      waterCoefficientList:[
        {value:1,label:'0.001立方米'},
        {value:10,label:'0.01立方米'},
        {value:100,label:'0.1立方米'}
      ],
      // 语音微波
      microwaveSoundObj:{
        audioDialog:{
          channelNum:'',
          dialog:false,
          probeId:'',
          repeatTimes:1,
          channelName:'',
        },
        programmingDialog:{
          voiceVolume:'',
          probeId:'',
          dialog:false,
          enableSpeechRecognition:0,
          speechRecognitionThreshold:'',
          channelName:'',
        },
      },
      //数据曲线调整
      statisticsType:1,
    };

  },
  created() {
  //  this.pageSize=window.innerHeight>1100?20:10
  
    this.getTargetCategoryData();
    // this.getAreaData()
    this.getChannelData();
    this.setPermission()

  },
  mounted() {
    window.addEventListener('onmessageWS', this.wsMessage)
    window.switchChangepolling = this.switchChangepolling

    this.resetStartTime();
    this.refreshData()
    this.getairList()
    //this.requstWs()
    // console.log(this.usermanager)
  },
  beforeDestroy() {
    //closeWebsocket();
    window.removeEventListener("onmessageWS", this.wsMessage);
    //console.log('清除定时器')
    clearInterval(this.refreshInterval);
    clearInterval(offontiem)
  },
  computed: {
     statistics_title(){
      return this.statisticsType==1?'数据曲线':'用电报表'
    },
     dialogWidth() {
      const isSpecialProbe = ['148', '149'].includes(this.dialogdeviceData.probeMoldCode);
      const isLongList = this.statisticsEchartsData.listSensorData.length > 4;
      if(this.statisticsType==2){
        return '13.4rem';
      }else{
        if (isSpecialProbe) {
          return isLongList ? '16.94rem' : '8.69rem';
        }
        return '13.4rem';
      }
    },
    isOutage() {
      return  JSON.parse(localStorage.getItem("isOutage") || "true")
    },
    isLoseContact() {
      return JSON.parse(localStorage.getItem("isLoseContact") || "true")
    },
    isContainSub() {
      return this.$store.getters.isContainSub
    },
    dataStatisticsShow() {
      return function (targetCategoryId) {
        const excludedCategories = [2,31, 12, 22, 13, 15, 18, 17, 24, 41, 19, 38, 40,998,25,49,51];
        return !excludedCategories.includes(targetCategoryId);

      }
    },
    //是否需要控制
    NoControl() {
      return function (probeKindCode) {
         return NoControl.includes(parseInt(probeKindCode))
      }
    },
    //空调模式
    airModeFilterimg() {
      return function (index, id) {
        //console.log(index, id)
        if (index != "null") {
          if (id == 13) {
            const modeObj = cairMode_F.find((obj) => obj.type == index);
            switch (modeObj?modeObj.type:0) {

              case 0:
                return `<svg t="1622603792633" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4319" width="24" height="24"><path d="M897.22368 446.446592C895.0272 446.446592 892.786688 446.160896 890.564608 445.553664L746.604544 406.71744C741.357568 405.302272 736.939008 402.33984 733.677568 398.45888L546.226176 507.445248 740.31616 620.291072C742.247424 619.15648 744.34048 618.235904 746.604544 617.6256L890.564608 578.78016C904.249344 575.062016 918.336512 583.26528 921.99424 597.055488 925.663232 610.844672 917.541888 625.012736 903.84896 628.706304L802.039808 656.178176 893.188096 709.172224C901.376 713.934848 904.173568 724.467712 899.452928 732.71296 896.279552 738.240512 890.53184 741.327872 884.617216 741.327872 881.716224 741.327872 878.777344 740.589568 876.077056 739.022848L777.892864 681.93792 808.14592 795.629568C811.813888 809.419776 803.693568 823.58784 789.999616 827.280384 787.777536 827.886592 785.537024 828.173312 783.340544 828.173312 772.011008 828.173312 761.63584 820.558848 758.569984 809.007104L719.995904 664.04352C718.590976 658.761728 718.927872 653.428736 720.631808 648.645632L529.61792 537.587712 529.61792 763.502592C532.95104 764.758016 536.08448 766.712832 538.766336 769.41312L644.151296 875.532288C654.17728 885.620736 654.17728 901.984256 644.151296 912.079872 639.138816 917.128192 632.571904 919.653376 626.004992 919.653376 619.437056 919.653376 612.871168 917.128192 607.859712 912.079872L529.61792 833.294336 529.61792 943.024128C529.61792 952.539136 521.834496 960.256 512.236544 960.256 502.637568 960.256 494.854144 952.539136 494.854144 943.024128L494.854144 833.1264 416.451584 912.079872C411.440128 917.128192 404.873216 919.653376 398.306304 919.653376 391.739392 919.653376 385.17248 917.128192 380.158976 912.079872 370.134016 901.993472 370.134016 885.620736 380.158976 875.532288L485.536768 769.41312C488.26368 766.666752 491.457536 764.695552 494.854144 763.4432L494.854144 537.31328 303.369216 648.644608C305.074176 653.428736 305.412096 658.760704 304.007168 664.04352L265.44128 809.007104C262.376448 820.550656 251.998208 828.173312 240.669696 828.173312 238.472192 828.173312 236.232704 827.886592 234.0096 827.280384 220.316672 823.58784 212.195328 809.419776 215.86432 795.629568L246.111232 681.935872 148.225024 738.847744C145.533952 740.411392 142.584832 741.152768 139.684864 741.152768 133.77024 741.152768 128.023552 738.064384 124.849152 732.536832 120.127488 724.292608 122.92608 713.757696 131.115008 708.996096L221.961216 656.177152 120.16128 628.706304C106.467328 625.012736 98.347008 610.844672 102.014976 597.055488 105.68192 583.26528 119.77728 575.062016 133.445632 578.78016L277.397504 617.6256C279.660544 618.235904 281.754624 619.15648 283.684864 620.291072L477.773824 507.445248 290.323456 398.45888C287.06304 402.33984 282.64448 405.302272 277.397504 406.71744L133.445632 445.553664C131.222528 446.160896 128.985088 446.446592 126.78656 446.446592 115.457024 446.446592 105.081856 438.832128 102.014976 427.281408 98.347008 413.4912 106.467328 399.322112 120.16128 395.628544L233.064448 365.167616 135.175168 308.25472C126.988288 303.49312 124.188672 292.958208 128.909312 284.713984 133.63712 276.476928 144.072704 273.642496 152.285184 278.404096L243.13856 331.227136 215.86432 228.70528C212.195328 214.91712 220.316672 200.748032 234.0096 197.054464 247.712768 193.327104 261.782528 201.53856 265.44128 215.328768L304.007168 360.292352C304.613376 362.5728 304.868352 364.859392 304.858112 367.111168L494.854144 477.577216 494.854144 260.723712C491.457536 259.47136 488.26368 257.50016 485.536768 254.754816L380.158976 148.627456C370.134016 138.529792 370.134016 122.166272 380.158976 112.078848 390.18496 101.983232 406.426624 101.983232 416.451584 112.078848L494.854144 191.038464 494.854144 81.486848C494.854144 71.972864 502.637568 64.256 512.236544 64.256 521.834496 64.256 529.61792 71.972864 529.61792 81.486848L529.61792 190.870528 607.859712 112.078848C617.883648 101.983232 634.125312 101.983232 644.151296 112.078848 654.17728 122.166272 654.17728 138.539008 644.151296 148.627456L538.766336 254.754816C536.08448 257.45408 532.95104 259.407872 529.61792 260.66432L529.61792 477.302784 719.143936 367.110144C719.13472 364.858368 719.389696 362.5728 719.995904 360.292352L758.569984 215.328768C762.227712 201.53856 776.31488 193.327104 789.999616 197.054464 803.693568 200.748032 811.813888 214.91712 808.14592 228.70528L780.86656 331.224064 872.016896 278.227968C880.188416 273.456128 890.665984 276.301824 895.392768 284.537856 900.114432 292.783104 897.314816 303.315968 889.127936 308.078592L790.936576 365.167616 903.84896 395.628544C917.541888 399.322112 925.663232 413.4912 921.99424 427.281408 918.928384 438.823936 908.553216 446.446592 897.22368 446.446592Z" p-id="4320" fill="#7dc5eb"></path></svg>`
              case 1:
                return `<svg t="1622603725777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3884" width="24" height="24"><path d="M944.641024 529.486848 803.562496 529.486848C794.938368 529.486848 787.948544 522.496 787.948544 513.871872L787.948544 510.640128C787.948544 502.016 794.938368 495.025152 803.562496 495.025152L944.641024 495.025152C953.265152 495.025152 960.254976 502.016 960.254976 510.640128L960.254976 513.871872C960.254976 522.496 953.265152 529.486848 944.641024 529.486848ZM730.42432 318.454784C724.3264 324.552704 714.43968 324.552704 708.343808 318.454784L706.057216 316.168192C699.959296 310.07232 699.959296 300.1856 706.057216 294.08768L805.814272 194.3296C811.912192 188.23168 821.797888 188.23168 827.895808 194.3296L830.1824 196.616192C836.28032 202.713088 836.28032 212.599808 830.1824 218.696704L730.42432 318.454784ZM512.510976 702.101504C398.317568 702.101504 305.742848 609.526784 305.742848 495.332352 305.742848 381.135872 398.317568 288.5632 512.510976 288.5632 626.705408 288.5632 719.280128 381.135872 719.280128 495.332352 719.280128 609.526784 626.705408 702.101504 512.510976 702.101504ZM513.871872 236.563456 510.640128 236.563456C502.016 236.563456 495.025152 229.573632 495.025152 220.950528L495.025152 79.870976C495.025152 71.246848 502.016 64.256 510.640128 64.256L513.871872 64.256C522.496 64.256 529.486848 71.246848 529.486848 79.870976L529.486848 220.950528C529.486848 229.573632 522.496 236.563456 513.871872 236.563456ZM316.168192 318.454784C310.07232 324.552704 300.184576 324.552704 294.08768 318.454784L194.3296 218.696704C188.23168 212.599808 188.23168 202.713088 194.3296 196.616192L196.616192 194.3296C202.714112 188.23168 212.599808 188.23168 218.696704 194.3296L318.454784 294.08768C324.552704 300.1856 324.552704 310.07232 318.454784 316.168192L316.168192 318.454784ZM236.56448 510.640128 236.56448 513.871872C236.56448 522.496 229.573632 529.486848 220.949504 529.486848L79.869952 529.486848C71.246848 529.486848 64.257024 522.496 64.257024 513.871872L64.257024 510.640128C64.257024 502.016 71.246848 495.025152 79.869952 495.025152L220.949504 495.025152C229.573632 495.025152 236.56448 502.016 236.56448 510.640128ZM294.08768 706.057216C300.184576 699.959296 310.07232 699.959296 316.168192 706.057216L318.454784 708.343808C324.552704 714.43968 324.552704 724.327424 318.454784 730.42432L218.696704 830.1824C212.599808 836.28032 202.714112 836.28032 196.616192 830.1824L194.3296 827.895808C188.23168 821.797888 188.23168 811.912192 194.3296 805.814272L294.08768 706.057216ZM510.640128 787.948544 513.871872 787.948544C522.496 787.948544 529.486848 794.938368 529.486848 803.562496L529.486848 944.641024C529.486848 953.265152 522.496 960.256 513.871872 960.256L510.640128 960.256C502.016 960.256 495.025152 953.265152 495.025152 944.641024L495.025152 803.562496C495.025152 794.938368 502.016 787.948544 510.640128 787.948544ZM708.343808 706.057216C714.43968 699.959296 724.3264 699.959296 730.42432 706.057216L830.1824 805.814272C836.28032 811.912192 836.28032 821.797888 830.1824 827.895808L827.895808 830.1824C821.797888 836.28032 811.912192 836.28032 805.814272 830.1824L706.057216 730.42432C699.959296 724.327424 699.959296 714.43968 706.057216 708.343808L708.343808 706.057216Z" p-id="3885" fill="#f6061e"></path></svg>`
              case 2:
                return `<svg t="1622603693544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3593" width="24" height="24"><path d="M454.347776 717.176832C539.651072 630.44608 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 619.024384 603.081728 539.134976 713.043968 510.442496 752.546816 467.27168 784.032768 446.332928 835.406848 427.20768 880.83456 439.349248 940.215296 449.688576 960.091136 449.688576 960.091136 461.580288 961.893376 503.729152 948.734976 559.822848 931.177472 712.86272 840.05888 662.71232 664.26368 629.361664 548.10112 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 644.875264 466.27328 701.492224 589.659136 721.649664 633.547776 728.37632 686.460928 761.97888 729.833472 792.741888 769.071104 850.655232 788.6848 873.665536 789.716992 873.665536 789.716992 881.152 780.42624 890.720256 737.836032 903.392256 681.2928 900.023296 504.476672 720.613376 459.557888 602.22464 429.873152 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 538.10176 375.40864 674.337792 388.831232 723.467264 393.736192 772.834304 414.645248 827.908096 407.409664 877.277184 400.705536 923.55072 360.94976 935.706624 342.107136 935.706624 342.107136 931.567616 331.003904 898.736128 301.319168 856.083456 262.083584 698.903552 176.63488 570.162176 307.508224 484.855808 394.252288 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 405.231616 421.614592 485.10976 311.643136 513.283072 272.151552 556.983296 240.402432 577.912832 189.290496 596.784128 144.114688 584.891392 84.48512 574.555136 64.342016 574.555136 64.342016 562.664448 62.541824 520.262656 75.44832 464.434176 93.25568 311.391232 184.641536 361.544704 360.170496 394.630144 476.597248 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 379.378688 558.424064 322.767872 435.29216 302.342144 391.15264 296.131584 338.226176 262.012928 294.59968 231.502848 255.629312 173.60384 236.003328 150.843392 234.970112 150.843392 234.970112 143.355904 244.272128 133.52448 286.860288 120.600576 343.656448 124.222464 520.220672 303.629312 565.13024 422.03136 594.827264 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 486.142976 649.024512 349.906944 635.865088 301.04064 630.964224 251.409408 610.304 196.083712 617.275392 146.714624 624.244736 100.691968 663.747584 88.285184 682.84416 88.285184 682.84416 92.678144 693.946368 125.25568 723.381248 168.42752 762.870784 325.341184 848.0512 454.347776 717.176832Z" p-id="3594" fill="#ffffff"></path></svg>`

            }
          }
          else  if (id == 15) {

          const modeObj = cascadeairMode_F.find((obj) => obj.type == index);

          switch (modeObj?modeObj.type:1) {
            case 1:
              return `<svg t="1622603792633" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4319" width="24" height="24"><path d="M897.22368 446.446592C895.0272 446.446592 892.786688 446.160896 890.564608 445.553664L746.604544 406.71744C741.357568 405.302272 736.939008 402.33984 733.677568 398.45888L546.226176 507.445248 740.31616 620.291072C742.247424 619.15648 744.34048 618.235904 746.604544 617.6256L890.564608 578.78016C904.249344 575.062016 918.336512 583.26528 921.99424 597.055488 925.663232 610.844672 917.541888 625.012736 903.84896 628.706304L802.039808 656.178176 893.188096 709.172224C901.376 713.934848 904.173568 724.467712 899.452928 732.71296 896.279552 738.240512 890.53184 741.327872 884.617216 741.327872 881.716224 741.327872 878.777344 740.589568 876.077056 739.022848L777.892864 681.93792 808.14592 795.629568C811.813888 809.419776 803.693568 823.58784 789.999616 827.280384 787.777536 827.886592 785.537024 828.173312 783.340544 828.173312 772.011008 828.173312 761.63584 820.558848 758.569984 809.007104L719.995904 664.04352C718.590976 658.761728 718.927872 653.428736 720.631808 648.645632L529.61792 537.587712 529.61792 763.502592C532.95104 764.758016 536.08448 766.712832 538.766336 769.41312L644.151296 875.532288C654.17728 885.620736 654.17728 901.984256 644.151296 912.079872 639.138816 917.128192 632.571904 919.653376 626.004992 919.653376 619.437056 919.653376 612.871168 917.128192 607.859712 912.079872L529.61792 833.294336 529.61792 943.024128C529.61792 952.539136 521.834496 960.256 512.236544 960.256 502.637568 960.256 494.854144 952.539136 494.854144 943.024128L494.854144 833.1264 416.451584 912.079872C411.440128 917.128192 404.873216 919.653376 398.306304 919.653376 391.739392 919.653376 385.17248 917.128192 380.158976 912.079872 370.134016 901.993472 370.134016 885.620736 380.158976 875.532288L485.536768 769.41312C488.26368 766.666752 491.457536 764.695552 494.854144 763.4432L494.854144 537.31328 303.369216 648.644608C305.074176 653.428736 305.412096 658.760704 304.007168 664.04352L265.44128 809.007104C262.376448 820.550656 251.998208 828.173312 240.669696 828.173312 238.472192 828.173312 236.232704 827.886592 234.0096 827.280384 220.316672 823.58784 212.195328 809.419776 215.86432 795.629568L246.111232 681.935872 148.225024 738.847744C145.533952 740.411392 142.584832 741.152768 139.684864 741.152768 133.77024 741.152768 128.023552 738.064384 124.849152 732.536832 120.127488 724.292608 122.92608 713.757696 131.115008 708.996096L221.961216 656.177152 120.16128 628.706304C106.467328 625.012736 98.347008 610.844672 102.014976 597.055488 105.68192 583.26528 119.77728 575.062016 133.445632 578.78016L277.397504 617.6256C279.660544 618.235904 281.754624 619.15648 283.684864 620.291072L477.773824 507.445248 290.323456 398.45888C287.06304 402.33984 282.64448 405.302272 277.397504 406.71744L133.445632 445.553664C131.222528 446.160896 128.985088 446.446592 126.78656 446.446592 115.457024 446.446592 105.081856 438.832128 102.014976 427.281408 98.347008 413.4912 106.467328 399.322112 120.16128 395.628544L233.064448 365.167616 135.175168 308.25472C126.988288 303.49312 124.188672 292.958208 128.909312 284.713984 133.63712 276.476928 144.072704 273.642496 152.285184 278.404096L243.13856 331.227136 215.86432 228.70528C212.195328 214.91712 220.316672 200.748032 234.0096 197.054464 247.712768 193.327104 261.782528 201.53856 265.44128 215.328768L304.007168 360.292352C304.613376 362.5728 304.868352 364.859392 304.858112 367.111168L494.854144 477.577216 494.854144 260.723712C491.457536 259.47136 488.26368 257.50016 485.536768 254.754816L380.158976 148.627456C370.134016 138.529792 370.134016 122.166272 380.158976 112.078848 390.18496 101.983232 406.426624 101.983232 416.451584 112.078848L494.854144 191.038464 494.854144 81.486848C494.854144 71.972864 502.637568 64.256 512.236544 64.256 521.834496 64.256 529.61792 71.972864 529.61792 81.486848L529.61792 190.870528 607.859712 112.078848C617.883648 101.983232 634.125312 101.983232 644.151296 112.078848 654.17728 122.166272 654.17728 138.539008 644.151296 148.627456L538.766336 254.754816C536.08448 257.45408 532.95104 259.407872 529.61792 260.66432L529.61792 477.302784 719.143936 367.110144C719.13472 364.858368 719.389696 362.5728 719.995904 360.292352L758.569984 215.328768C762.227712 201.53856 776.31488 193.327104 789.999616 197.054464 803.693568 200.748032 811.813888 214.91712 808.14592 228.70528L780.86656 331.224064 872.016896 278.227968C880.188416 273.456128 890.665984 276.301824 895.392768 284.537856 900.114432 292.783104 897.314816 303.315968 889.127936 308.078592L790.936576 365.167616 903.84896 395.628544C917.541888 399.322112 925.663232 413.4912 921.99424 427.281408 918.928384 438.823936 908.553216 446.446592 897.22368 446.446592Z" p-id="4320" fill="#7dc5eb"></path></svg>`
            case 2:
              return `<svg t="1622603647104" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2818" width="24" height="24"><path d="M839.519232 650.0864c-0.003072 0.050176-0.006144 0.129024-0.006144 0.27136 0 179.54304-153.786368 327.384064-332.007424 327.384064-178.214912 0-323.206144-146.064384-323.206144-325.607424 0-15.645696 1.412096-32.283648 4.310016-50.868224C219.052032 343.892992 483.930112 64.331776 495.186944 52.557824c3.181568-3.332096 7.56736-5.228544 12.16-5.275648 5.102592 0.07168 9.001984 1.779712 12.25216 5.046272C532.647936 65.468416 848.070656 377.945088 839.519232 650.0864zM805.051392 598.66624C783.500288 381.221888 561.45408 147.18464 507.730944 89.631744c-52.59776 58.397696-262.970368 293.0432-288.526336 509.034496 0.61952 15.398912 2.746368 103.001088 83.373056 103.619584 44.770304 0 87.817216-26.307584 87.350272-86.380544 0 0 0.216064-5.595136 0.216064-8.624128 0-14.272512 12.946432-25.839616 27.215872-25.839616 14.272512 0 25.839616 11.568128 25.839616 25.839616 0 3.028992 0.006144 8.624128 0.006144 8.624128 2.747392 23.405568-2.697216 86.380544 61.002752 86.380544 79.634432 0 72.04864-58.359808 76.84096-86.380544 0 0 0.007168-5.595136 0.007168-8.624128 0-14.272512 11.568128-25.839616 25.839616-25.839616 14.270464 0 25.838592 11.568128 25.838592 25.839616 0 3.028992 0.007168 8.624128 0.007168 8.624128 0.693248 16.779264 12.317696 86.380544 71.274496 86.380544C814.861312 709.429248 805.051392 598.66624 805.051392 598.66624zM839.513088 650.35776c0.003072-0.090112 0.004096-0.181248 0.006144-0.27136C839.540736 649.790464 839.607296 650.848256 839.513088 650.35776z" p-id="2819" fill="#4ff7f1"></path></svg>`
            case 4:
              return `<svg t="1622603693544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3593" width="24" height="24"><path d="M454.347776 717.176832C539.651072 630.44608 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 619.024384 603.081728 539.134976 713.043968 510.442496 752.546816 467.27168 784.032768 446.332928 835.406848 427.20768 880.83456 439.349248 940.215296 449.688576 960.091136 449.688576 960.091136 461.580288 961.893376 503.729152 948.734976 559.822848 931.177472 712.86272 840.05888 662.71232 664.26368 629.361664 548.10112 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 644.875264 466.27328 701.492224 589.659136 721.649664 633.547776 728.37632 686.460928 761.97888 729.833472 792.741888 769.071104 850.655232 788.6848 873.665536 789.716992 873.665536 789.716992 881.152 780.42624 890.720256 737.836032 903.392256 681.2928 900.023296 504.476672 720.613376 459.557888 602.22464 429.873152 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 538.10176 375.40864 674.337792 388.831232 723.467264 393.736192 772.834304 414.645248 827.908096 407.409664 877.277184 400.705536 923.55072 360.94976 935.706624 342.107136 935.706624 342.107136 931.567616 331.003904 898.736128 301.319168 856.083456 262.083584 698.903552 176.63488 570.162176 307.508224 484.855808 394.252288 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 405.231616 421.614592 485.10976 311.643136 513.283072 272.151552 556.983296 240.402432 577.912832 189.290496 596.784128 144.114688 584.891392 84.48512 574.555136 64.342016 574.555136 64.342016 562.664448 62.541824 520.262656 75.44832 464.434176 93.25568 311.391232 184.641536 361.544704 360.170496 394.630144 476.597248 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 379.378688 558.424064 322.767872 435.29216 302.342144 391.15264 296.131584 338.226176 262.012928 294.59968 231.502848 255.629312 173.60384 236.003328 150.843392 234.970112 150.843392 234.970112 143.355904 244.272128 133.52448 286.860288 120.600576 343.656448 124.222464 520.220672 303.629312 565.13024 422.03136 594.827264 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 486.142976 649.024512 349.906944 635.865088 301.04064 630.964224 251.409408 610.304 196.083712 617.275392 146.714624 624.244736 100.691968 663.747584 88.285184 682.84416 88.285184 682.84416 92.678144 693.946368 125.25568 723.381248 168.42752 762.870784 325.341184 848.0512 454.347776 717.176832Z" p-id="3594" fill="#ffffff"></path></svg>`
            case 8:
              return `<svg t="1622603725777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3884" width="24" height="24"><path d="M944.641024 529.486848 803.562496 529.486848C794.938368 529.486848 787.948544 522.496 787.948544 513.871872L787.948544 510.640128C787.948544 502.016 794.938368 495.025152 803.562496 495.025152L944.641024 495.025152C953.265152 495.025152 960.254976 502.016 960.254976 510.640128L960.254976 513.871872C960.254976 522.496 953.265152 529.486848 944.641024 529.486848ZM730.42432 318.454784C724.3264 324.552704 714.43968 324.552704 708.343808 318.454784L706.057216 316.168192C699.959296 310.07232 699.959296 300.1856 706.057216 294.08768L805.814272 194.3296C811.912192 188.23168 821.797888 188.23168 827.895808 194.3296L830.1824 196.616192C836.28032 202.713088 836.28032 212.599808 830.1824 218.696704L730.42432 318.454784ZM512.510976 702.101504C398.317568 702.101504 305.742848 609.526784 305.742848 495.332352 305.742848 381.135872 398.317568 288.5632 512.510976 288.5632 626.705408 288.5632 719.280128 381.135872 719.280128 495.332352 719.280128 609.526784 626.705408 702.101504 512.510976 702.101504ZM513.871872 236.563456 510.640128 236.563456C502.016 236.563456 495.025152 229.573632 495.025152 220.950528L495.025152 79.870976C495.025152 71.246848 502.016 64.256 510.640128 64.256L513.871872 64.256C522.496 64.256 529.486848 71.246848 529.486848 79.870976L529.486848 220.950528C529.486848 229.573632 522.496 236.563456 513.871872 236.563456ZM316.168192 318.454784C310.07232 324.552704 300.184576 324.552704 294.08768 318.454784L194.3296 218.696704C188.23168 212.599808 188.23168 202.713088 194.3296 196.616192L196.616192 194.3296C202.714112 188.23168 212.599808 188.23168 218.696704 194.3296L318.454784 294.08768C324.552704 300.1856 324.552704 310.07232 318.454784 316.168192L316.168192 318.454784ZM236.56448 510.640128 236.56448 513.871872C236.56448 522.496 229.573632 529.486848 220.949504 529.486848L79.869952 529.486848C71.246848 529.486848 64.257024 522.496 64.257024 513.871872L64.257024 510.640128C64.257024 502.016 71.246848 495.025152 79.869952 495.025152L220.949504 495.025152C229.573632 495.025152 236.56448 502.016 236.56448 510.640128ZM294.08768 706.057216C300.184576 699.959296 310.07232 699.959296 316.168192 706.057216L318.454784 708.343808C324.552704 714.43968 324.552704 724.327424 318.454784 730.42432L218.696704 830.1824C212.599808 836.28032 202.714112 836.28032 196.616192 830.1824L194.3296 827.895808C188.23168 821.797888 188.23168 811.912192 194.3296 805.814272L294.08768 706.057216ZM510.640128 787.948544 513.871872 787.948544C522.496 787.948544 529.486848 794.938368 529.486848 803.562496L529.486848 944.641024C529.486848 953.265152 522.496 960.256 513.871872 960.256L510.640128 960.256C502.016 960.256 495.025152 953.265152 495.025152 944.641024L495.025152 803.562496C495.025152 794.938368 502.016 787.948544 510.640128 787.948544ZM708.343808 706.057216C714.43968 699.959296 724.3264 699.959296 730.42432 706.057216L830.1824 805.814272C836.28032 811.912192 836.28032 821.797888 830.1824 827.895808L827.895808 830.1824C821.797888 836.28032 811.912192 836.28032 805.814272 830.1824L706.057216 730.42432C699.959296 724.327424 699.959296 714.43968 706.057216 708.343808L708.343808 706.057216Z" p-id="3885" fill="#f6061e"></path></svg>`
          }
          }
          else {

            const modeObj = airMode_F.find((obj) => obj.type == index);

            switch (modeObj?modeObj.type:0) {
              case 0:
                return `<svg t="1622603597536" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2593" width="24" height="24"><path d="M867.74784 904.19712C864.555008 905.872384 861.133824 906.668032 857.761792 906.668032 849.979392 906.668032 842.457088 902.426624 838.600704 895.025152L708.160512 613.594112C707.196928 613.740544 706.221056 613.842944 705.222656 613.842944L319.125504 613.842944C318.014464 613.842944 316.932096 613.718016 315.865088 613.536768L185.399296 895.025152C181.542912 902.426624 174.020608 906.668032 166.238208 906.668032 162.866176 906.668032 159.444992 905.872384 156.251136 904.19712 145.680384 898.649088 141.587456 885.552128 147.108864 874.94144L492.075008 130.664448C492.166144 130.443264 492.27776 130.231296 492.376064 130.013184L492.854272 128.982016C492.878848 128.933888 492.909568 128.891904 492.935168 128.8448 493.13792 128.459776 493.369344 128.089088 493.595648 127.716352 493.743104 127.475712 493.878272 127.223808 494.032896 126.990336 494.251008 126.661632 494.495744 126.350336 494.732288 126.032896 494.9248 125.775872 495.105024 125.50656 495.306752 125.259776 495.47776 125.05088 495.671296 124.857344 495.850496 124.653568 496.14336 124.321792 496.43008 123.983872 496.740352 123.672576 496.840704 123.572224 496.954368 123.482112 497.056768 123.383808 497.468416 122.98752 497.88416 122.5984 498.322432 122.24 498.42176 122.15808 498.533376 122.0864 498.634752 122.006528 499.093504 121.644032 499.5584 121.291776 500.042752 120.969216 500.197376 120.865792 500.366336 120.776704 500.525056 120.677376 500.969472 120.397824 501.41696 120.122368 501.878784 119.876608 501.919744 119.855104 501.956608 119.82848 501.997568 119.806976 502.212608 119.694336 502.434816 119.610368 502.651904 119.50592 503.027712 119.324672 503.402496 119.140352 503.788544 118.981632 504.133632 118.838272 504.482816 118.721536 504.830976 118.597632 505.136128 118.490112 505.438208 118.377472 505.747456 118.283264 506.144768 118.162432 506.544128 118.066176 506.944512 117.968896 507.219968 117.902336 507.493376 117.830656 507.771904 117.774336 508.178432 117.69344 508.58496 117.634048 508.992512 117.576704 509.282304 117.535744 509.571072 117.491712 509.862912 117.462016 510.242816 117.424128 510.621696 117.405696 511.000576 117.388288 511.332352 117.372928 511.664128 117.356544 511.996928 117.35552 512.330752 117.356544 512.661504 117.372928 512.99328 117.388288 513.373184 117.405696 513.753088 117.424128 514.132992 117.462016 514.42176 117.490688 514.70848 117.53472 514.9952 117.57568 515.407872 117.633024 515.818496 117.69344 516.228096 117.77536 516.498432 117.829632 516.763648 117.899264 517.030912 117.963776 517.441536 118.063104 517.851136 118.162432 518.259712 118.286336 518.54848 118.3744 518.831104 118.480896 519.115776 118.580224 519.487488 118.711296 519.858176 118.836224 520.225792 118.9888 520.568832 119.130112 520.900608 119.294976 521.23648 119.45472 521.491456 119.575552 521.750528 119.67488 522.002432 119.806976 522.05056 119.832576 522.094592 119.86432 522.14272 119.88992 522.532864 120.097792 522.907648 120.333312 523.28448 120.564736 523.51488 120.706048 523.75552 120.836096 523.978752 120.984576 524.358656 121.238528 524.720128 121.521152 525.085696 121.79968 525.287424 121.954304 525.50144 122.09664 525.696 122.256384 526.006272 122.51136 526.297088 122.795008 526.594048 123.068416 526.820352 123.276288 527.058944 123.47392 527.275008 123.689984 527.481856 123.897856 527.669248 124.127232 527.868928 124.34432 528.151552 124.652544 528.442368 124.9536 528.704512 125.275136 528.852992 125.457408 528.984064 125.657088 529.1264 125.84448 529.417216 126.225408 529.711104 126.604288 529.974272 127.002624 530.108416 127.205376 530.224128 127.423488 530.352128 127.63136 530.599936 128.033792 530.847744 128.4352 531.067904 128.851968 531.09248 128.897024 531.121152 128.93696 531.144704 128.982016L531.59936 129.964032C531.707904 130.200576 531.827712 130.430976 531.928064 130.671616L876.891136 874.94144C882.41152 885.552128 878.319616 898.649088 867.74784 904.19712ZM512 190.364672 339.586048 562.357248 684.412928 562.357248 512 190.364672Z" p-id="2594" fill="#ffffff"></path></svg>`
              case 1:
                return `<svg t="1622603792633" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4319" width="24" height="24"><path d="M897.22368 446.446592C895.0272 446.446592 892.786688 446.160896 890.564608 445.553664L746.604544 406.71744C741.357568 405.302272 736.939008 402.33984 733.677568 398.45888L546.226176 507.445248 740.31616 620.291072C742.247424 619.15648 744.34048 618.235904 746.604544 617.6256L890.564608 578.78016C904.249344 575.062016 918.336512 583.26528 921.99424 597.055488 925.663232 610.844672 917.541888 625.012736 903.84896 628.706304L802.039808 656.178176 893.188096 709.172224C901.376 713.934848 904.173568 724.467712 899.452928 732.71296 896.279552 738.240512 890.53184 741.327872 884.617216 741.327872 881.716224 741.327872 878.777344 740.589568 876.077056 739.022848L777.892864 681.93792 808.14592 795.629568C811.813888 809.419776 803.693568 823.58784 789.999616 827.280384 787.777536 827.886592 785.537024 828.173312 783.340544 828.173312 772.011008 828.173312 761.63584 820.558848 758.569984 809.007104L719.995904 664.04352C718.590976 658.761728 718.927872 653.428736 720.631808 648.645632L529.61792 537.587712 529.61792 763.502592C532.95104 764.758016 536.08448 766.712832 538.766336 769.41312L644.151296 875.532288C654.17728 885.620736 654.17728 901.984256 644.151296 912.079872 639.138816 917.128192 632.571904 919.653376 626.004992 919.653376 619.437056 919.653376 612.871168 917.128192 607.859712 912.079872L529.61792 833.294336 529.61792 943.024128C529.61792 952.539136 521.834496 960.256 512.236544 960.256 502.637568 960.256 494.854144 952.539136 494.854144 943.024128L494.854144 833.1264 416.451584 912.079872C411.440128 917.128192 404.873216 919.653376 398.306304 919.653376 391.739392 919.653376 385.17248 917.128192 380.158976 912.079872 370.134016 901.993472 370.134016 885.620736 380.158976 875.532288L485.536768 769.41312C488.26368 766.666752 491.457536 764.695552 494.854144 763.4432L494.854144 537.31328 303.369216 648.644608C305.074176 653.428736 305.412096 658.760704 304.007168 664.04352L265.44128 809.007104C262.376448 820.550656 251.998208 828.173312 240.669696 828.173312 238.472192 828.173312 236.232704 827.886592 234.0096 827.280384 220.316672 823.58784 212.195328 809.419776 215.86432 795.629568L246.111232 681.935872 148.225024 738.847744C145.533952 740.411392 142.584832 741.152768 139.684864 741.152768 133.77024 741.152768 128.023552 738.064384 124.849152 732.536832 120.127488 724.292608 122.92608 713.757696 131.115008 708.996096L221.961216 656.177152 120.16128 628.706304C106.467328 625.012736 98.347008 610.844672 102.014976 597.055488 105.68192 583.26528 119.77728 575.062016 133.445632 578.78016L277.397504 617.6256C279.660544 618.235904 281.754624 619.15648 283.684864 620.291072L477.773824 507.445248 290.323456 398.45888C287.06304 402.33984 282.64448 405.302272 277.397504 406.71744L133.445632 445.553664C131.222528 446.160896 128.985088 446.446592 126.78656 446.446592 115.457024 446.446592 105.081856 438.832128 102.014976 427.281408 98.347008 413.4912 106.467328 399.322112 120.16128 395.628544L233.064448 365.167616 135.175168 308.25472C126.988288 303.49312 124.188672 292.958208 128.909312 284.713984 133.63712 276.476928 144.072704 273.642496 152.285184 278.404096L243.13856 331.227136 215.86432 228.70528C212.195328 214.91712 220.316672 200.748032 234.0096 197.054464 247.712768 193.327104 261.782528 201.53856 265.44128 215.328768L304.007168 360.292352C304.613376 362.5728 304.868352 364.859392 304.858112 367.111168L494.854144 477.577216 494.854144 260.723712C491.457536 259.47136 488.26368 257.50016 485.536768 254.754816L380.158976 148.627456C370.134016 138.529792 370.134016 122.166272 380.158976 112.078848 390.18496 101.983232 406.426624 101.983232 416.451584 112.078848L494.854144 191.038464 494.854144 81.486848C494.854144 71.972864 502.637568 64.256 512.236544 64.256 521.834496 64.256 529.61792 71.972864 529.61792 81.486848L529.61792 190.870528 607.859712 112.078848C617.883648 101.983232 634.125312 101.983232 644.151296 112.078848 654.17728 122.166272 654.17728 138.539008 644.151296 148.627456L538.766336 254.754816C536.08448 257.45408 532.95104 259.407872 529.61792 260.66432L529.61792 477.302784 719.143936 367.110144C719.13472 364.858368 719.389696 362.5728 719.995904 360.292352L758.569984 215.328768C762.227712 201.53856 776.31488 193.327104 789.999616 197.054464 803.693568 200.748032 811.813888 214.91712 808.14592 228.70528L780.86656 331.224064 872.016896 278.227968C880.188416 273.456128 890.665984 276.301824 895.392768 284.537856 900.114432 292.783104 897.314816 303.315968 889.127936 308.078592L790.936576 365.167616 903.84896 395.628544C917.541888 399.322112 925.663232 413.4912 921.99424 427.281408 918.928384 438.823936 908.553216 446.446592 897.22368 446.446592Z" p-id="4320" fill="#7dc5eb"></path></svg>`
              case 2:
                return `<svg t="1622603647104" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2818" width="24" height="24"><path d="M839.519232 650.0864c-0.003072 0.050176-0.006144 0.129024-0.006144 0.27136 0 179.54304-153.786368 327.384064-332.007424 327.384064-178.214912 0-323.206144-146.064384-323.206144-325.607424 0-15.645696 1.412096-32.283648 4.310016-50.868224C219.052032 343.892992 483.930112 64.331776 495.186944 52.557824c3.181568-3.332096 7.56736-5.228544 12.16-5.275648 5.102592 0.07168 9.001984 1.779712 12.25216 5.046272C532.647936 65.468416 848.070656 377.945088 839.519232 650.0864zM805.051392 598.66624C783.500288 381.221888 561.45408 147.18464 507.730944 89.631744c-52.59776 58.397696-262.970368 293.0432-288.526336 509.034496 0.61952 15.398912 2.746368 103.001088 83.373056 103.619584 44.770304 0 87.817216-26.307584 87.350272-86.380544 0 0 0.216064-5.595136 0.216064-8.624128 0-14.272512 12.946432-25.839616 27.215872-25.839616 14.272512 0 25.839616 11.568128 25.839616 25.839616 0 3.028992 0.006144 8.624128 0.006144 8.624128 2.747392 23.405568-2.697216 86.380544 61.002752 86.380544 79.634432 0 72.04864-58.359808 76.84096-86.380544 0 0 0.007168-5.595136 0.007168-8.624128 0-14.272512 11.568128-25.839616 25.839616-25.839616 14.270464 0 25.838592 11.568128 25.838592 25.839616 0 3.028992 0.007168 8.624128 0.007168 8.624128 0.693248 16.779264 12.317696 86.380544 71.274496 86.380544C814.861312 709.429248 805.051392 598.66624 805.051392 598.66624zM839.513088 650.35776c0.003072-0.090112 0.004096-0.181248 0.006144-0.27136C839.540736 649.790464 839.607296 650.848256 839.513088 650.35776z" p-id="2819" fill="#4ff7f1"></path></svg>`
              case 3:
                return `<svg t="1622603693544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3593" width="24" height="24"><path d="M454.347776 717.176832C539.651072 630.44608 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 619.024384 603.081728 539.134976 713.043968 510.442496 752.546816 467.27168 784.032768 446.332928 835.406848 427.20768 880.83456 439.349248 940.215296 449.688576 960.091136 449.688576 960.091136 461.580288 961.893376 503.729152 948.734976 559.822848 931.177472 712.86272 840.05888 662.71232 664.26368 629.361664 548.10112 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 644.875264 466.27328 701.492224 589.659136 721.649664 633.547776 728.37632 686.460928 761.97888 729.833472 792.741888 769.071104 850.655232 788.6848 873.665536 789.716992 873.665536 789.716992 881.152 780.42624 890.720256 737.836032 903.392256 681.2928 900.023296 504.476672 720.613376 459.557888 602.22464 429.873152 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 538.10176 375.40864 674.337792 388.831232 723.467264 393.736192 772.834304 414.645248 827.908096 407.409664 877.277184 400.705536 923.55072 360.94976 935.706624 342.107136 935.706624 342.107136 931.567616 331.003904 898.736128 301.319168 856.083456 262.083584 698.903552 176.63488 570.162176 307.508224 484.855808 394.252288 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 405.231616 421.614592 485.10976 311.643136 513.283072 272.151552 556.983296 240.402432 577.912832 189.290496 596.784128 144.114688 584.891392 84.48512 574.555136 64.342016 574.555136 64.342016 562.664448 62.541824 520.262656 75.44832 464.434176 93.25568 311.391232 184.641536 361.544704 360.170496 394.630144 476.597248 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 379.378688 558.424064 322.767872 435.29216 302.342144 391.15264 296.131584 338.226176 262.012928 294.59968 231.502848 255.629312 173.60384 236.003328 150.843392 234.970112 150.843392 234.970112 143.355904 244.272128 133.52448 286.860288 120.600576 343.656448 124.222464 520.220672 303.629312 565.13024 422.03136 594.827264 511.995904 512.470016 511.995904 512.470016 511.995904 512.470016 486.142976 649.024512 349.906944 635.865088 301.04064 630.964224 251.409408 610.304 196.083712 617.275392 146.714624 624.244736 100.691968 663.747584 88.285184 682.84416 88.285184 682.84416 92.678144 693.946368 125.25568 723.381248 168.42752 762.870784 325.341184 848.0512 454.347776 717.176832Z" p-id="3594" fill="#ffffff"></path></svg>`
              case 4:
                return `<svg t="1622603725777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3884" width="24" height="24"><path d="M944.641024 529.486848 803.562496 529.486848C794.938368 529.486848 787.948544 522.496 787.948544 513.871872L787.948544 510.640128C787.948544 502.016 794.938368 495.025152 803.562496 495.025152L944.641024 495.025152C953.265152 495.025152 960.254976 502.016 960.254976 510.640128L960.254976 513.871872C960.254976 522.496 953.265152 529.486848 944.641024 529.486848ZM730.42432 318.454784C724.3264 324.552704 714.43968 324.552704 708.343808 318.454784L706.057216 316.168192C699.959296 310.07232 699.959296 300.1856 706.057216 294.08768L805.814272 194.3296C811.912192 188.23168 821.797888 188.23168 827.895808 194.3296L830.1824 196.616192C836.28032 202.713088 836.28032 212.599808 830.1824 218.696704L730.42432 318.454784ZM512.510976 702.101504C398.317568 702.101504 305.742848 609.526784 305.742848 495.332352 305.742848 381.135872 398.317568 288.5632 512.510976 288.5632 626.705408 288.5632 719.280128 381.135872 719.280128 495.332352 719.280128 609.526784 626.705408 702.101504 512.510976 702.101504ZM513.871872 236.563456 510.640128 236.563456C502.016 236.563456 495.025152 229.573632 495.025152 220.950528L495.025152 79.870976C495.025152 71.246848 502.016 64.256 510.640128 64.256L513.871872 64.256C522.496 64.256 529.486848 71.246848 529.486848 79.870976L529.486848 220.950528C529.486848 229.573632 522.496 236.563456 513.871872 236.563456ZM316.168192 318.454784C310.07232 324.552704 300.184576 324.552704 294.08768 318.454784L194.3296 218.696704C188.23168 212.599808 188.23168 202.713088 194.3296 196.616192L196.616192 194.3296C202.714112 188.23168 212.599808 188.23168 218.696704 194.3296L318.454784 294.08768C324.552704 300.1856 324.552704 310.07232 318.454784 316.168192L316.168192 318.454784ZM236.56448 510.640128 236.56448 513.871872C236.56448 522.496 229.573632 529.486848 220.949504 529.486848L79.869952 529.486848C71.246848 529.486848 64.257024 522.496 64.257024 513.871872L64.257024 510.640128C64.257024 502.016 71.246848 495.025152 79.869952 495.025152L220.949504 495.025152C229.573632 495.025152 236.56448 502.016 236.56448 510.640128ZM294.08768 706.057216C300.184576 699.959296 310.07232 699.959296 316.168192 706.057216L318.454784 708.343808C324.552704 714.43968 324.552704 724.327424 318.454784 730.42432L218.696704 830.1824C212.599808 836.28032 202.714112 836.28032 196.616192 830.1824L194.3296 827.895808C188.23168 821.797888 188.23168 811.912192 194.3296 805.814272L294.08768 706.057216ZM510.640128 787.948544 513.871872 787.948544C522.496 787.948544 529.486848 794.938368 529.486848 803.562496L529.486848 944.641024C529.486848 953.265152 522.496 960.256 513.871872 960.256L510.640128 960.256C502.016 960.256 495.025152 953.265152 495.025152 944.641024L495.025152 803.562496C495.025152 794.938368 502.016 787.948544 510.640128 787.948544ZM708.343808 706.057216C714.43968 699.959296 724.3264 699.959296 730.42432 706.057216L830.1824 805.814272C836.28032 811.912192 836.28032 821.797888 830.1824 827.895808L827.895808 830.1824C821.797888 836.28032 811.912192 836.28032 805.814272 830.1824L706.057216 730.42432C699.959296 724.327424 699.959296 714.43968 706.057216 708.343808L708.343808 706.057216Z" p-id="3885" fill="#f6061e"></path></svg>`
            }
          }
        }

      }
    },
    //空调风向
    airSpeeddirectionimg() {
      return function (index) {

        switch (index) {
          case "0":
            return `<svg t="1622604735928" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5884" width="24" height="24"><path d="M946.827363 530.062378c0-58.700937-11.501962-115.659183-34.187637-169.292708-21.904892-51.791573-53.260018-98.299817-93.192495-138.231271-39.932478-39.932478-86.440721-71.287603-138.232295-93.193519-53.633524-22.685675-110.591771-34.187637-169.292708-34.187637s-115.65816 11.501962-169.292708 34.187637c-51.791573 21.905916-98.299817 53.260018-138.231271 93.193519-39.932478 39.932478-71.287603 86.440721-93.193519 138.231271-22.684652 53.633524-34.187637 110.591771-34.187637 169.292708 0 58.699913 11.501962 115.65816 34.187637 169.292708 21.905916 51.791573 53.261041 98.299817 93.193519 138.232295s86.440721 71.287603 138.231271 93.192495c53.633524 22.685675 110.591771 34.187637 169.292708 34.187637s115.65816-11.501962 169.292708-34.187637c51.791573-21.904892 98.299817-53.260018 138.232295-93.192495s71.287603-86.440721 93.192495-138.232295C935.324378 645.721561 946.827363 588.763314 946.827363 530.062378zM783.267217 801.408389c-72.478731 72.478731-168.844499 112.394836-271.344988 112.394836s-198.865233-39.916105-271.344988-112.394836S128.182404 632.562866 128.182404 530.062378s39.916105-198.866257 112.394836-271.346011c72.478731-72.478731 168.844499-112.394836 271.344988-112.394836s198.866257 39.916105 271.344988 112.394836 112.394836 168.845523 112.394836 271.346011S855.745948 728.928634 783.267217 801.408389zM541.009707 257.07703c-0.014326-0.029676-0.029676-0.057305-0.044002-0.086981-0.14224-0.295735-0.292666-0.588401-0.447185-0.87902-0.045025-0.084934-0.086981-0.170892-0.13303-0.254803-0.168846-0.310062-0.345877-0.615007-0.527003-0.917906-0.037862-0.063445-0.072655-0.127913-0.11154-0.191358-0.191358-0.313132-0.390903-0.621147-0.596588-0.927115-0.031722-0.048095-0.062422-0.098237-0.095167-0.146333-0.209778-0.308015-0.428765-0.610914-0.652869-0.910743-0.029676-0.039909-0.058328-0.082888-0.088004-0.122797-0.214894-0.283456-0.437975-0.560772-0.665149-0.836041-0.041956-0.051165-0.081864-0.104377-0.12382-0.155543-0.150426-0.179079-0.309038-0.352017-0.464581-0.527003-1.25662-1.418302-2.650363-2.681062-4.157693-3.767813 0 0-0.001023-0.001023-0.002047-0.001023-0.344854-0.248663-0.694825-0.487094-1.050935-0.717338-0.033769-0.022513-0.069585-0.042979-0.104377-0.064468-0.324388-0.207731-0.652869-0.409322-0.985444-0.601704-0.066515-0.037862-0.134053-0.073678-0.201591-0.11154-0.300852-0.170892-0.603751-0.337691-0.911766-0.49528-0.027629-0.014326-0.053212-0.029676-0.080841-0.044002-0.086981-0.045025-0.176009-0.082888-0.26299-0.125867-0.25685-0.127913-0.514723-0.252757-0.774643-0.37146-0.170892-0.077771-0.342808-0.150426-0.514723-0.224104-0.200568-0.085958-0.400113-0.171915-0.602727-0.252757-0.225127-0.090051-0.451278-0.174985-0.677429-0.257873-0.148379-0.054235-0.296759-0.109494-0.446162-0.160659-0.270153-0.094144-0.541329-0.182149-0.813528-0.26606-0.109494-0.033769-0.217964-0.067538-0.327458-0.100284-0.301875-0.089028-0.604774-0.171915-0.907673-0.249687-0.085958-0.022513-0.172939-0.044002-0.258896-0.065492-0.319272-0.077771-0.639566-0.150426-0.959861-0.215918-0.079818-0.016373-0.160659-0.031722-0.240477-0.048095-0.319272-0.062422-0.639566-0.11768-0.959861-0.167822-0.094144-0.014326-0.189312-0.028653-0.284479-0.041956-0.301875-0.042979-0.604774-0.081864-0.907673-0.113587-0.124843-0.013303-0.249687-0.024559-0.37453-0.036839-0.26913-0.024559-0.538259-0.046049-0.807389-0.062422-0.168846-0.010233-0.337691-0.017396-0.506537-0.024559-0.225127-0.00921-0.450255-0.016373-0.675382-0.01842-0.215918-0.00307-0.430812-0.002047-0.64673 0-0.178055 0.002047-0.356111 0.005117-0.535189 0.011256-0.260943 0.008186-0.520863 0.022513-0.781806 0.038886-0.134053 0.008186-0.268106 0.017396-0.402159 0.027629-0.295735 0.023536-0.590448 0.053212-0.886183 0.086981-0.103354 0.01228-0.205685 0.023536-0.309038 0.036839-0.314155 0.039909-0.627287 0.085958-0.941442 0.138146-0.089028 0.014326-0.177032 0.029676-0.265036 0.045025-0.316202 0.055259-0.63138 0.11768-0.947582 0.185218-0.092098 0.019443-0.183172 0.039909-0.275269 0.061398-0.301875 0.068562-0.602727 0.14224-0.903579 0.222057-0.112564 0.029676-0.224104 0.061398-0.336668 0.093121-0.273223 0.076748-0.545422 0.156566-0.817622 0.242524-0.149403 0.047072-0.297782 0.097214-0.447185 0.147356-0.231267 0.077771-0.461511 0.156566-0.690732 0.2415-0.199545 0.073678-0.397043 0.151449-0.594541 0.230244-0.180102 0.071631-0.360204 0.14224-0.538259 0.217964-0.25378 0.107447-0.50449 0.221034-0.754177 0.336668-0.097214 0.045025-0.195451 0.083911-0.292666 0.130983-0.030699 0.014326-0.059352 0.030699-0.089028 0.045025-0.293689 0.141216-0.584308 0.290619-0.87288 0.444115-0.085958 0.045025-0.173962 0.088004-0.258896 0.135076-0.313132 0.169869-0.621147 0.348947-0.927115 0.532119-0.059352 0.035816-0.12075 0.068562-0.179079 0.104377-0.328481 0.200568-0.651846 0.409322-0.971118 0.62524-0.032746 0.021489-0.066515 0.041956-0.098237 0.064468-0.344854 0.234337-0.684592 0.477884-1.01819 0.730641-0.004093 0.00307-0.00921 0.00614-0.014326 0.010233-0.89744 0.679475-1.750877 1.425466-2.560312 2.226714-0.694825 0.688685-1.349741 1.409093-1.954515 2.164293-0.01842 0.023536-0.035816 0.048095-0.054235 0.071631-0.245593 0.309038-0.484024 0.62217-0.714268 0.940418-0.029676 0.040932-0.057305 0.083911-0.086981 0.125867-0.216941 0.304945-0.429789 0.61296-0.632403 0.927115-0.039909 0.061398-0.077771 0.12689-0.11768 0.189312-0.188288 0.295735-0.372483 0.594541-0.548492 0.89744-0.052189 0.091074-0.102331 0.184195-0.153496 0.276293-0.155543 0.277316-0.309038 0.554632-0.455371 0.837064-0.016373 0.031722-0.034792 0.062422-0.051165 0.094144L254.435876 727.170594c-6.432503 12.579503-1.450025 27.991518 11.129478 34.425044 3.729951 1.906419 7.706519 2.809999 11.626805 2.809999 9.30083 0 18.273179-5.090948 22.798239-13.9405l74.933643-146.537448 274.933723 0 69.639057 145.910161c4.387937 9.195429 13.551644 14.56881 23.105231 14.56881 3.692089 0 7.445576-0.804319 11.001565-2.50096 12.750395-6.084579 18.153452-21.355377 12.06785-34.106796L541.009707 257.07703zM401.088958 552.761356l116.042923-226.928383 108.306728 226.928383L401.088958 552.761356z" p-id="5885" fill="#ffffff"></path></svg>`
          case "1":
            return `<svg t="1622604696092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4856" width="24" height="24"><path d="M911.367757 342.360392c-21.904892-51.79055-53.260018-98.298793-93.192495-138.231271-39.932478-39.932478-86.440721-71.287603-138.231271-93.193519C626.310466 88.249927 569.352219 76.747965 510.651282 76.747965s-115.65816 11.501962-169.292708 34.187637c-51.79055 21.905916-98.298793 53.261041-138.231271 93.193519-39.932478 39.932478-71.287603 86.440721-93.193519 138.231271C87.24811 395.993916 75.746148 452.952162 75.746148 511.653099c0 58.699913 11.501962 115.65816 34.187637 169.292708 21.905916 51.791573 53.261041 98.299817 93.193519 138.232295 39.932478 39.932478 86.440721 71.287603 138.231271 93.192495C394.993123 935.056272 451.950346 946.558234 510.651282 946.558234s115.659183-11.501962 169.292708-34.187637c51.79055-21.904892 98.298793-53.260018 138.231271-93.192495s71.287603-86.440721 93.192495-138.232295C934.053432 627.312282 945.556417 570.353013 945.556417 511.653099 945.556417 452.952162 934.053432 395.993916 911.367757 342.360392zM781.996271 782.998087C709.517539 855.476819 613.151771 895.392924 510.651282 895.392924c-102.500489 0-198.866257-39.916105-271.344988-112.394836S126.911458 614.153588 126.911458 511.653099s39.916105-198.866257 112.394836-271.344988S408.150794 127.913275 510.651282 127.913275c102.500489 0 198.865233 39.916105 271.344988 112.394836S894.391107 409.152611 894.391107 511.653099 854.475002 710.519356 781.996271 782.998087z" p-id="4857" fill="#ffffff"></path><path d="M753.143129 295.637254c0.924045-9.258874-3.246951-18.693758-11.609409-24.074302-11.881608-7.644097-27.712155-4.210905-35.356252 7.670703L526.848173 557.935192 324.110749 287.98497c-3.716648-9.547447-12.991895-16.308431-23.839965-16.308431-0.035816 0-0.072655 0-0.107447 0-14.128789 0.058328-25.535583 11.558244-25.477254 25.688055l0.005117 1.245364c-0.002047 0.218988-0.001023 0.436952 0.00307 0.655939l1.749854 424.420339c0.058328 14.092973 11.499915 25.477254 25.580608 25.477254 0.034792 0 0.071631 0 0.107447 0 14.128789-0.059352 25.535583-11.559267 25.477254-25.689079l-1.432629-347.540368 181.703365 241.944378c0.035816 0.048095 0.204661 0.088004 0.480954 0.122797 4.747117 6.166443 12.198833 10.143011 20.581758 10.143011 10.986215 0 20.37198-6.826476 24.165376-16.464997l149.755746-232.740762 3.239787 345.800747C706.235796 738.78819 717.663056 750.083443 731.680305 750.083443c0.080841 0 0.163729 0 0.24457-0.001023 14.128789-0.13303 25.474185-11.69332 25.342178-25.821085l-3.993964-426.322665C753.264902 297.16198 753.21783 296.395524 753.143129 295.637254z" p-id="4858" fill="#ffffff"></path></svg>`
        }

      }
    },
    //空调风量
    airSpeedFilterimg() {
      return function (index, id) {
        if (index != "null") {


          if (id == 13) {
            const speedObj = cairSpeed_F.find((obj) => obj.type == index);
            switch (speedObj?speedObj.type:0) {
              case 0:
                return `<svg t="1622604735928" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5884" width="24" height="24"><path d="M946.827363 530.062378c0-58.700937-11.501962-115.659183-34.187637-169.292708-21.904892-51.791573-53.260018-98.299817-93.192495-138.231271-39.932478-39.932478-86.440721-71.287603-138.232295-93.193519-53.633524-22.685675-110.591771-34.187637-169.292708-34.187637s-115.65816 11.501962-169.292708 34.187637c-51.791573 21.905916-98.299817 53.260018-138.231271 93.193519-39.932478 39.932478-71.287603 86.440721-93.193519 138.231271-22.684652 53.633524-34.187637 110.591771-34.187637 169.292708 0 58.699913 11.501962 115.65816 34.187637 169.292708 21.905916 51.791573 53.261041 98.299817 93.193519 138.232295s86.440721 71.287603 138.231271 93.192495c53.633524 22.685675 110.591771 34.187637 169.292708 34.187637s115.65816-11.501962 169.292708-34.187637c51.791573-21.904892 98.299817-53.260018 138.232295-93.192495s71.287603-86.440721 93.192495-138.232295C935.324378 645.721561 946.827363 588.763314 946.827363 530.062378zM783.267217 801.408389c-72.478731 72.478731-168.844499 112.394836-271.344988 112.394836s-198.865233-39.916105-271.344988-112.394836S128.182404 632.562866 128.182404 530.062378s39.916105-198.866257 112.394836-271.346011c72.478731-72.478731 168.844499-112.394836 271.344988-112.394836s198.866257 39.916105 271.344988 112.394836 112.394836 168.845523 112.394836 271.346011S855.745948 728.928634 783.267217 801.408389zM541.009707 257.07703c-0.014326-0.029676-0.029676-0.057305-0.044002-0.086981-0.14224-0.295735-0.292666-0.588401-0.447185-0.87902-0.045025-0.084934-0.086981-0.170892-0.13303-0.254803-0.168846-0.310062-0.345877-0.615007-0.527003-0.917906-0.037862-0.063445-0.072655-0.127913-0.11154-0.191358-0.191358-0.313132-0.390903-0.621147-0.596588-0.927115-0.031722-0.048095-0.062422-0.098237-0.095167-0.146333-0.209778-0.308015-0.428765-0.610914-0.652869-0.910743-0.029676-0.039909-0.058328-0.082888-0.088004-0.122797-0.214894-0.283456-0.437975-0.560772-0.665149-0.836041-0.041956-0.051165-0.081864-0.104377-0.12382-0.155543-0.150426-0.179079-0.309038-0.352017-0.464581-0.527003-1.25662-1.418302-2.650363-2.681062-4.157693-3.767813 0 0-0.001023-0.001023-0.002047-0.001023-0.344854-0.248663-0.694825-0.487094-1.050935-0.717338-0.033769-0.022513-0.069585-0.042979-0.104377-0.064468-0.324388-0.207731-0.652869-0.409322-0.985444-0.601704-0.066515-0.037862-0.134053-0.073678-0.201591-0.11154-0.300852-0.170892-0.603751-0.337691-0.911766-0.49528-0.027629-0.014326-0.053212-0.029676-0.080841-0.044002-0.086981-0.045025-0.176009-0.082888-0.26299-0.125867-0.25685-0.127913-0.514723-0.252757-0.774643-0.37146-0.170892-0.077771-0.342808-0.150426-0.514723-0.224104-0.200568-0.085958-0.400113-0.171915-0.602727-0.252757-0.225127-0.090051-0.451278-0.174985-0.677429-0.257873-0.148379-0.054235-0.296759-0.109494-0.446162-0.160659-0.270153-0.094144-0.541329-0.182149-0.813528-0.26606-0.109494-0.033769-0.217964-0.067538-0.327458-0.100284-0.301875-0.089028-0.604774-0.171915-0.907673-0.249687-0.085958-0.022513-0.172939-0.044002-0.258896-0.065492-0.319272-0.077771-0.639566-0.150426-0.959861-0.215918-0.079818-0.016373-0.160659-0.031722-0.240477-0.048095-0.319272-0.062422-0.639566-0.11768-0.959861-0.167822-0.094144-0.014326-0.189312-0.028653-0.284479-0.041956-0.301875-0.042979-0.604774-0.081864-0.907673-0.113587-0.124843-0.013303-0.249687-0.024559-0.37453-0.036839-0.26913-0.024559-0.538259-0.046049-0.807389-0.062422-0.168846-0.010233-0.337691-0.017396-0.506537-0.024559-0.225127-0.00921-0.450255-0.016373-0.675382-0.01842-0.215918-0.00307-0.430812-0.002047-0.64673 0-0.178055 0.002047-0.356111 0.005117-0.535189 0.011256-0.260943 0.008186-0.520863 0.022513-0.781806 0.038886-0.134053 0.008186-0.268106 0.017396-0.402159 0.027629-0.295735 0.023536-0.590448 0.053212-0.886183 0.086981-0.103354 0.01228-0.205685 0.023536-0.309038 0.036839-0.314155 0.039909-0.627287 0.085958-0.941442 0.138146-0.089028 0.014326-0.177032 0.029676-0.265036 0.045025-0.316202 0.055259-0.63138 0.11768-0.947582 0.185218-0.092098 0.019443-0.183172 0.039909-0.275269 0.061398-0.301875 0.068562-0.602727 0.14224-0.903579 0.222057-0.112564 0.029676-0.224104 0.061398-0.336668 0.093121-0.273223 0.076748-0.545422 0.156566-0.817622 0.242524-0.149403 0.047072-0.297782 0.097214-0.447185 0.147356-0.231267 0.077771-0.461511 0.156566-0.690732 0.2415-0.199545 0.073678-0.397043 0.151449-0.594541 0.230244-0.180102 0.071631-0.360204 0.14224-0.538259 0.217964-0.25378 0.107447-0.50449 0.221034-0.754177 0.336668-0.097214 0.045025-0.195451 0.083911-0.292666 0.130983-0.030699 0.014326-0.059352 0.030699-0.089028 0.045025-0.293689 0.141216-0.584308 0.290619-0.87288 0.444115-0.085958 0.045025-0.173962 0.088004-0.258896 0.135076-0.313132 0.169869-0.621147 0.348947-0.927115 0.532119-0.059352 0.035816-0.12075 0.068562-0.179079 0.104377-0.328481 0.200568-0.651846 0.409322-0.971118 0.62524-0.032746 0.021489-0.066515 0.041956-0.098237 0.064468-0.344854 0.234337-0.684592 0.477884-1.01819 0.730641-0.004093 0.00307-0.00921 0.00614-0.014326 0.010233-0.89744 0.679475-1.750877 1.425466-2.560312 2.226714-0.694825 0.688685-1.349741 1.409093-1.954515 2.164293-0.01842 0.023536-0.035816 0.048095-0.054235 0.071631-0.245593 0.309038-0.484024 0.62217-0.714268 0.940418-0.029676 0.040932-0.057305 0.083911-0.086981 0.125867-0.216941 0.304945-0.429789 0.61296-0.632403 0.927115-0.039909 0.061398-0.077771 0.12689-0.11768 0.189312-0.188288 0.295735-0.372483 0.594541-0.548492 0.89744-0.052189 0.091074-0.102331 0.184195-0.153496 0.276293-0.155543 0.277316-0.309038 0.554632-0.455371 0.837064-0.016373 0.031722-0.034792 0.062422-0.051165 0.094144L254.435876 727.170594c-6.432503 12.579503-1.450025 27.991518 11.129478 34.425044 3.729951 1.906419 7.706519 2.809999 11.626805 2.809999 9.30083 0 18.273179-5.090948 22.798239-13.9405l74.933643-146.537448 274.933723 0 69.639057 145.910161c4.387937 9.195429 13.551644 14.56881 23.105231 14.56881 3.692089 0 7.445576-0.804319 11.001565-2.50096 12.750395-6.084579 18.153452-21.355377 12.06785-34.106796L541.009707 257.07703zM401.088958 552.761356l116.042923-226.928383 108.306728 226.928383L401.088958 552.761356z" p-id="5885" fill="#ffffff"></path></svg>`
              case 1:
                return `<svg t="1622604306219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4757" width="24" height="24"><path d="M329.64608 606.29504C257.974272 606.29504 191.29344 572.845056 146.700288 514.516992 138.03008 503.164928 140.163072 486.91712 151.472128 478.211072 162.771968 469.522432 178.985984 471.646208 187.664384 482.998272 222.403584 528.448512 274.15552 554.515456 329.64608 554.515456 378.018816 554.515456 423.554048 534.828032 457.86624 499.068928 459.285504 497.595392 460.83072 496.321536 462.477312 495.259648 512.607232 445.19936 578.254848 417.709056 648.018944 417.709056 742.71744 417.709056 831.315968 470.46656 879.254528 555.392 886.278144 567.830528 881.90976 583.631872 869.50912 590.6688 857.124864 597.707776 841.347072 593.36704 834.32448 580.893696 795.543552 512.175104 724.16768 469.48864 648.018944 469.48864 590.470144 469.48864 536.291328 492.908544 495.47776 535.442432 494.050304 536.927232 492.486656 538.208256 490.82368 539.278336 447.203328 582.545408 390.20032 606.29504 329.64608 606.29504Z" p-id="4758" fill="#ffffff"></path></svg>`
              case 2:
                return `<svg t="1622604322679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000" width="24" height="24"><path d="M834.32448 461.303808C795.543552 392.585216 724.16768 349.899776 648.018944 349.899776 590.470144 349.899776 536.291328 373.31968 495.47776 415.853568 494.050304 417.337344 492.486656 418.618368 490.82368 419.688448 447.203328 462.95552 390.20032 486.705152 329.64608 486.705152 257.974272 486.705152 191.29344 453.255168 146.700288 394.928128 138.03008 383.576064 140.163072 367.327232 151.472128 358.621184 162.771968 349.932544 178.985984 352.057344 187.664384 363.409408 222.403584 408.859648 274.15552 434.925568 329.64608 434.925568 378.018816 434.925568 423.554048 415.239168 457.86624 379.480064 459.285504 378.005504 460.83072 376.731648 462.477312 375.670784 512.607232 325.610496 578.254848 298.119168 648.018944 298.119168 742.71744 298.119168 831.315968 350.876672 879.254528 435.802112 886.278144 448.241664 881.90976 464.043008 869.50912 471.079936 857.124864 478.118912 841.347072 473.778176 834.32448 461.303808ZM187.664384 602.612736C222.411776 648.070144 274.163712 674.128896 329.64608 674.128896 378.028032 674.128896 423.563264 654.442496 457.86624 618.691584 459.276288 617.209856 460.83072 615.936 462.477312 614.874112 512.607232 564.813824 578.254848 537.330688 648.018944 537.330688 742.71744 537.330688 831.315968 590.08 879.254528 674.989056 886.278144 687.427584 881.90976 703.23712 869.50912 710.283264 857.124864 717.295616 841.347072 712.963072 834.32448 700.507136 795.543552 631.79776 724.16768 589.110272 648.018944 589.110272 590.45376 589.110272 536.291328 612.532224 495.47776 655.04768 494.050304 656.549888 492.486656 657.813504 490.832896 658.891776 447.21152 702.158848 390.209536 725.90848 329.64608 725.90848 257.983488 725.90848 191.301632 692.450304 146.70848 634.131456 138.03008 622.787584 140.163072 606.53056 151.472128 597.832704 162.78016 589.12768 178.985984 591.26784 187.664384 602.612736Z" p-id="5001" fill="#ffffff"></path></svg>`
              case 3:
                return `<svg t="1622604335845" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5243" width="24" height="24"><path d="M869.50912 588.368896C857.124864 595.381248 841.347072 591.048704 834.32448 578.592768 795.543552 509.882368 724.16768 467.195904 648.018944 467.195904 590.45376 467.195904 536.291328 490.616832 495.47776 533.133312 494.050304 534.634496 492.486656 535.899136 490.832896 536.977408 447.21152 580.24448 390.209536 603.994112 329.64608 603.994112 257.983488 603.994112 191.301632 570.535936 146.70848 512.216064 138.03008 500.873216 140.163072 484.616192 151.472128 475.918336 162.78016 467.212288 178.985984 469.353472 187.664384 480.698368 222.411776 526.154752 274.163712 552.214528 329.64608 552.214528 378.028032 552.214528 423.563264 532.527104 457.86624 496.777216 459.276288 495.294464 460.83072 494.020608 462.477312 492.959744 512.607232 442.898432 578.254848 415.415296 648.018944 415.415296 742.71744 415.415296 831.315968 468.165632 879.254528 553.073664 886.278144 565.513216 881.90976 581.322752 869.50912 588.368896ZM869.50912 349.165568C857.124864 356.20352 841.347072 351.862784 834.32448 339.38944 795.543552 270.670848 724.16768 227.985408 648.018944 227.985408 590.470144 227.985408 536.291328 251.405312 495.47776 293.9392 494.050304 295.422976 492.486656 296.704 490.82368 297.77408 447.203328 341.041152 390.20032 364.790784 329.64608 364.790784 257.974272 364.790784 191.29344 331.3408 146.700288 273.012736 138.03008 261.660672 140.163072 245.412864 151.472128 236.706816 162.771968 228.018176 178.985984 230.142976 187.664384 241.494016 222.403584 286.94528 274.15552 313.0112 329.64608 313.0112 378.018816 313.0112 423.554048 293.323776 457.86624 257.565696 459.285504 256.091136 460.83072 254.81728 462.477312 253.755392 512.607232 203.696128 578.254848 176.2048 648.018944 176.2048 742.71744 176.2048 831.315968 228.962304 879.254528 313.887744 886.278144 326.327296 881.90976 342.12864 869.50912 349.165568ZM151.472128 719.69792C162.78016 711.000064 178.985984 713.142272 187.664384 724.48512 222.411776 769.944576 274.163712 796.002304 329.64608 796.002304 378.010624 796.002304 423.545856 776.31488 457.86624 740.564992 459.285504 739.08224 460.83072 737.8176 462.477312 736.738304 512.59904 686.695424 578.254848 659.20512 648.018944 659.20512 742.71744 659.20512 831.315968 711.9616 879.254528 796.86144 886.278144 809.300992 881.90976 825.112576 869.50912 832.15872 857.124864 839.169024 841.347072 834.83648 834.32448 822.382592 795.543552 753.661952 724.16768 710.984704 648.018944 710.984704 590.45376 710.984704 536.282112 734.396416 495.47776 776.923136 494.050304 778.423296 492.486656 779.703296 490.82368 780.765184 447.195136 824.034304 390.194176 847.781888 329.64608 847.781888 257.983488 847.781888 191.301632 814.32576 146.70848 756.005888 138.03008 744.660992 140.163072 728.41216 151.472128 719.69792Z" p-id="5244" fill="#ffffff"></path></svg>`
            }
          }
          else if (id == 15){
            const speedObj = cascadeairSpeed_F.find((obj) => obj.type == index);
            switch (speedObj?speedObj.type:1) {
              case 1:
                 return `<svg t="1622604335845" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5243" width="24" height="24"><path d="M869.50912 588.368896C857.124864 595.381248 841.347072 591.048704 834.32448 578.592768 795.543552 509.882368 724.16768 467.195904 648.018944 467.195904 590.45376 467.195904 536.291328 490.616832 495.47776 533.133312 494.050304 534.634496 492.486656 535.899136 490.832896 536.977408 447.21152 580.24448 390.209536 603.994112 329.64608 603.994112 257.983488 603.994112 191.301632 570.535936 146.70848 512.216064 138.03008 500.873216 140.163072 484.616192 151.472128 475.918336 162.78016 467.212288 178.985984 469.353472 187.664384 480.698368 222.411776 526.154752 274.163712 552.214528 329.64608 552.214528 378.028032 552.214528 423.563264 532.527104 457.86624 496.777216 459.276288 495.294464 460.83072 494.020608 462.477312 492.959744 512.607232 442.898432 578.254848 415.415296 648.018944 415.415296 742.71744 415.415296 831.315968 468.165632 879.254528 553.073664 886.278144 565.513216 881.90976 581.322752 869.50912 588.368896ZM869.50912 349.165568C857.124864 356.20352 841.347072 351.862784 834.32448 339.38944 795.543552 270.670848 724.16768 227.985408 648.018944 227.985408 590.470144 227.985408 536.291328 251.405312 495.47776 293.9392 494.050304 295.422976 492.486656 296.704 490.82368 297.77408 447.203328 341.041152 390.20032 364.790784 329.64608 364.790784 257.974272 364.790784 191.29344 331.3408 146.700288 273.012736 138.03008 261.660672 140.163072 245.412864 151.472128 236.706816 162.771968 228.018176 178.985984 230.142976 187.664384 241.494016 222.403584 286.94528 274.15552 313.0112 329.64608 313.0112 378.018816 313.0112 423.554048 293.323776 457.86624 257.565696 459.285504 256.091136 460.83072 254.81728 462.477312 253.755392 512.607232 203.696128 578.254848 176.2048 648.018944 176.2048 742.71744 176.2048 831.315968 228.962304 879.254528 313.887744 886.278144 326.327296 881.90976 342.12864 869.50912 349.165568ZM151.472128 719.69792C162.78016 711.000064 178.985984 713.142272 187.664384 724.48512 222.411776 769.944576 274.163712 796.002304 329.64608 796.002304 378.010624 796.002304 423.545856 776.31488 457.86624 740.564992 459.285504 739.08224 460.83072 737.8176 462.477312 736.738304 512.59904 686.695424 578.254848 659.20512 648.018944 659.20512 742.71744 659.20512 831.315968 711.9616 879.254528 796.86144 886.278144 809.300992 881.90976 825.112576 869.50912 832.15872 857.124864 839.169024 841.347072 834.83648 834.32448 822.382592 795.543552 753.661952 724.16768 710.984704 648.018944 710.984704 590.45376 710.984704 536.282112 734.396416 495.47776 776.923136 494.050304 778.423296 492.486656 779.703296 490.82368 780.765184 447.195136 824.034304 390.194176 847.781888 329.64608 847.781888 257.983488 847.781888 191.301632 814.32576 146.70848 756.005888 138.03008 744.660992 140.163072 728.41216 151.472128 719.69792Z" p-id="5244" fill="#ffffff"></path></svg>`
              case 3:
                 return `<svg t="1622604335845" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5243" width="24" height="24"><path d="M869.50912 588.368896C857.124864 595.381248 841.347072 591.048704 834.32448 578.592768 795.543552 509.882368 724.16768 467.195904 648.018944 467.195904 590.45376 467.195904 536.291328 490.616832 495.47776 533.133312 494.050304 534.634496 492.486656 535.899136 490.832896 536.977408 447.21152 580.24448 390.209536 603.994112 329.64608 603.994112 257.983488 603.994112 191.301632 570.535936 146.70848 512.216064 138.03008 500.873216 140.163072 484.616192 151.472128 475.918336 162.78016 467.212288 178.985984 469.353472 187.664384 480.698368 222.411776 526.154752 274.163712 552.214528 329.64608 552.214528 378.028032 552.214528 423.563264 532.527104 457.86624 496.777216 459.276288 495.294464 460.83072 494.020608 462.477312 492.959744 512.607232 442.898432 578.254848 415.415296 648.018944 415.415296 742.71744 415.415296 831.315968 468.165632 879.254528 553.073664 886.278144 565.513216 881.90976 581.322752 869.50912 588.368896ZM869.50912 349.165568C857.124864 356.20352 841.347072 351.862784 834.32448 339.38944 795.543552 270.670848 724.16768 227.985408 648.018944 227.985408 590.470144 227.985408 536.291328 251.405312 495.47776 293.9392 494.050304 295.422976 492.486656 296.704 490.82368 297.77408 447.203328 341.041152 390.20032 364.790784 329.64608 364.790784 257.974272 364.790784 191.29344 331.3408 146.700288 273.012736 138.03008 261.660672 140.163072 245.412864 151.472128 236.706816 162.771968 228.018176 178.985984 230.142976 187.664384 241.494016 222.403584 286.94528 274.15552 313.0112 329.64608 313.0112 378.018816 313.0112 423.554048 293.323776 457.86624 257.565696 459.285504 256.091136 460.83072 254.81728 462.477312 253.755392 512.607232 203.696128 578.254848 176.2048 648.018944 176.2048 742.71744 176.2048 831.315968 228.962304 879.254528 313.887744 886.278144 326.327296 881.90976 342.12864 869.50912 349.165568ZM151.472128 719.69792C162.78016 711.000064 178.985984 713.142272 187.664384 724.48512 222.411776 769.944576 274.163712 796.002304 329.64608 796.002304 378.010624 796.002304 423.545856 776.31488 457.86624 740.564992 459.285504 739.08224 460.83072 737.8176 462.477312 736.738304 512.59904 686.695424 578.254848 659.20512 648.018944 659.20512 742.71744 659.20512 831.315968 711.9616 879.254528 796.86144 886.278144 809.300992 881.90976 825.112576 869.50912 832.15872 857.124864 839.169024 841.347072 834.83648 834.32448 822.382592 795.543552 753.661952 724.16768 710.984704 648.018944 710.984704 590.45376 710.984704 536.282112 734.396416 495.47776 776.923136 494.050304 778.423296 492.486656 779.703296 490.82368 780.765184 447.195136 824.034304 390.194176 847.781888 329.64608 847.781888 257.983488 847.781888 191.301632 814.32576 146.70848 756.005888 138.03008 744.660992 140.163072 728.41216 151.472128 719.69792Z" p-id="5244" fill="#ffffff"></path></svg>`
              case 2:
                return `<svg t="1622604322679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000" width="24" height="24"><path d="M834.32448 461.303808C795.543552 392.585216 724.16768 349.899776 648.018944 349.899776 590.470144 349.899776 536.291328 373.31968 495.47776 415.853568 494.050304 417.337344 492.486656 418.618368 490.82368 419.688448 447.203328 462.95552 390.20032 486.705152 329.64608 486.705152 257.974272 486.705152 191.29344 453.255168 146.700288 394.928128 138.03008 383.576064 140.163072 367.327232 151.472128 358.621184 162.771968 349.932544 178.985984 352.057344 187.664384 363.409408 222.403584 408.859648 274.15552 434.925568 329.64608 434.925568 378.018816 434.925568 423.554048 415.239168 457.86624 379.480064 459.285504 378.005504 460.83072 376.731648 462.477312 375.670784 512.607232 325.610496 578.254848 298.119168 648.018944 298.119168 742.71744 298.119168 831.315968 350.876672 879.254528 435.802112 886.278144 448.241664 881.90976 464.043008 869.50912 471.079936 857.124864 478.118912 841.347072 473.778176 834.32448 461.303808ZM187.664384 602.612736C222.411776 648.070144 274.163712 674.128896 329.64608 674.128896 378.028032 674.128896 423.563264 654.442496 457.86624 618.691584 459.276288 617.209856 460.83072 615.936 462.477312 614.874112 512.607232 564.813824 578.254848 537.330688 648.018944 537.330688 742.71744 537.330688 831.315968 590.08 879.254528 674.989056 886.278144 687.427584 881.90976 703.23712 869.50912 710.283264 857.124864 717.295616 841.347072 712.963072 834.32448 700.507136 795.543552 631.79776 724.16768 589.110272 648.018944 589.110272 590.45376 589.110272 536.291328 612.532224 495.47776 655.04768 494.050304 656.549888 492.486656 657.813504 490.832896 658.891776 447.21152 702.158848 390.209536 725.90848 329.64608 725.90848 257.983488 725.90848 191.301632 692.450304 146.70848 634.131456 138.03008 622.787584 140.163072 606.53056 151.472128 597.832704 162.78016 589.12768 178.985984 591.26784 187.664384 602.612736Z" p-id="5001" fill="#ffffff"></path></svg>`
              case 5:
                return `<svg t="1622604322679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000" width="24" height="24"><path d="M834.32448 461.303808C795.543552 392.585216 724.16768 349.899776 648.018944 349.899776 590.470144 349.899776 536.291328 373.31968 495.47776 415.853568 494.050304 417.337344 492.486656 418.618368 490.82368 419.688448 447.203328 462.95552 390.20032 486.705152 329.64608 486.705152 257.974272 486.705152 191.29344 453.255168 146.700288 394.928128 138.03008 383.576064 140.163072 367.327232 151.472128 358.621184 162.771968 349.932544 178.985984 352.057344 187.664384 363.409408 222.403584 408.859648 274.15552 434.925568 329.64608 434.925568 378.018816 434.925568 423.554048 415.239168 457.86624 379.480064 459.285504 378.005504 460.83072 376.731648 462.477312 375.670784 512.607232 325.610496 578.254848 298.119168 648.018944 298.119168 742.71744 298.119168 831.315968 350.876672 879.254528 435.802112 886.278144 448.241664 881.90976 464.043008 869.50912 471.079936 857.124864 478.118912 841.347072 473.778176 834.32448 461.303808ZM187.664384 602.612736C222.411776 648.070144 274.163712 674.128896 329.64608 674.128896 378.028032 674.128896 423.563264 654.442496 457.86624 618.691584 459.276288 617.209856 460.83072 615.936 462.477312 614.874112 512.607232 564.813824 578.254848 537.330688 648.018944 537.330688 742.71744 537.330688 831.315968 590.08 879.254528 674.989056 886.278144 687.427584 881.90976 703.23712 869.50912 710.283264 857.124864 717.295616 841.347072 712.963072 834.32448 700.507136 795.543552 631.79776 724.16768 589.110272 648.018944 589.110272 590.45376 589.110272 536.291328 612.532224 495.47776 655.04768 494.050304 656.549888 492.486656 657.813504 490.832896 658.891776 447.21152 702.158848 390.209536 725.90848 329.64608 725.90848 257.983488 725.90848 191.301632 692.450304 146.70848 634.131456 138.03008 622.787584 140.163072 606.53056 151.472128 597.832704 162.78016 589.12768 178.985984 591.26784 187.664384 602.612736Z" p-id="5001" fill="#ffffff"></path></svg>`
              case 4:
                return `<svg t="1622604306219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4757" width="24" height="24"><path d="M329.64608 606.29504C257.974272 606.29504 191.29344 572.845056 146.700288 514.516992 138.03008 503.164928 140.163072 486.91712 151.472128 478.211072 162.771968 469.522432 178.985984 471.646208 187.664384 482.998272 222.403584 528.448512 274.15552 554.515456 329.64608 554.515456 378.018816 554.515456 423.554048 534.828032 457.86624 499.068928 459.285504 497.595392 460.83072 496.321536 462.477312 495.259648 512.607232 445.19936 578.254848 417.709056 648.018944 417.709056 742.71744 417.709056 831.315968 470.46656 879.254528 555.392 886.278144 567.830528 881.90976 583.631872 869.50912 590.6688 857.124864 597.707776 841.347072 593.36704 834.32448 580.893696 795.543552 512.175104 724.16768 469.48864 648.018944 469.48864 590.470144 469.48864 536.291328 492.908544 495.47776 535.442432 494.050304 536.927232 492.486656 538.208256 490.82368 539.278336 447.203328 582.545408 390.20032 606.29504 329.64608 606.29504Z" p-id="4758" fill="#ffffff"></path></svg>`
            }
          }
          else{
            const speedObj = airSpeed_F.find((obj) => obj.type == index);
            switch (speedObj?speedObj.type:0) {
              case 0:
                return `<svg t="1622604735928" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5884" width="24" height="24"><path d="M946.827363 530.062378c0-58.700937-11.501962-115.659183-34.187637-169.292708-21.904892-51.791573-53.260018-98.299817-93.192495-138.231271-39.932478-39.932478-86.440721-71.287603-138.232295-93.193519-53.633524-22.685675-110.591771-34.187637-169.292708-34.187637s-115.65816 11.501962-169.292708 34.187637c-51.791573 21.905916-98.299817 53.260018-138.231271 93.193519-39.932478 39.932478-71.287603 86.440721-93.193519 138.231271-22.684652 53.633524-34.187637 110.591771-34.187637 169.292708 0 58.699913 11.501962 115.65816 34.187637 169.292708 21.905916 51.791573 53.261041 98.299817 93.193519 138.232295s86.440721 71.287603 138.231271 93.192495c53.633524 22.685675 110.591771 34.187637 169.292708 34.187637s115.65816-11.501962 169.292708-34.187637c51.791573-21.904892 98.299817-53.260018 138.232295-93.192495s71.287603-86.440721 93.192495-138.232295C935.324378 645.721561 946.827363 588.763314 946.827363 530.062378zM783.267217 801.408389c-72.478731 72.478731-168.844499 112.394836-271.344988 112.394836s-198.865233-39.916105-271.344988-112.394836S128.182404 632.562866 128.182404 530.062378s39.916105-198.866257 112.394836-271.346011c72.478731-72.478731 168.844499-112.394836 271.344988-112.394836s198.866257 39.916105 271.344988 112.394836 112.394836 168.845523 112.394836 271.346011S855.745948 728.928634 783.267217 801.408389zM541.009707 257.07703c-0.014326-0.029676-0.029676-0.057305-0.044002-0.086981-0.14224-0.295735-0.292666-0.588401-0.447185-0.87902-0.045025-0.084934-0.086981-0.170892-0.13303-0.254803-0.168846-0.310062-0.345877-0.615007-0.527003-0.917906-0.037862-0.063445-0.072655-0.127913-0.11154-0.191358-0.191358-0.313132-0.390903-0.621147-0.596588-0.927115-0.031722-0.048095-0.062422-0.098237-0.095167-0.146333-0.209778-0.308015-0.428765-0.610914-0.652869-0.910743-0.029676-0.039909-0.058328-0.082888-0.088004-0.122797-0.214894-0.283456-0.437975-0.560772-0.665149-0.836041-0.041956-0.051165-0.081864-0.104377-0.12382-0.155543-0.150426-0.179079-0.309038-0.352017-0.464581-0.527003-1.25662-1.418302-2.650363-2.681062-4.157693-3.767813 0 0-0.001023-0.001023-0.002047-0.001023-0.344854-0.248663-0.694825-0.487094-1.050935-0.717338-0.033769-0.022513-0.069585-0.042979-0.104377-0.064468-0.324388-0.207731-0.652869-0.409322-0.985444-0.601704-0.066515-0.037862-0.134053-0.073678-0.201591-0.11154-0.300852-0.170892-0.603751-0.337691-0.911766-0.49528-0.027629-0.014326-0.053212-0.029676-0.080841-0.044002-0.086981-0.045025-0.176009-0.082888-0.26299-0.125867-0.25685-0.127913-0.514723-0.252757-0.774643-0.37146-0.170892-0.077771-0.342808-0.150426-0.514723-0.224104-0.200568-0.085958-0.400113-0.171915-0.602727-0.252757-0.225127-0.090051-0.451278-0.174985-0.677429-0.257873-0.148379-0.054235-0.296759-0.109494-0.446162-0.160659-0.270153-0.094144-0.541329-0.182149-0.813528-0.26606-0.109494-0.033769-0.217964-0.067538-0.327458-0.100284-0.301875-0.089028-0.604774-0.171915-0.907673-0.249687-0.085958-0.022513-0.172939-0.044002-0.258896-0.065492-0.319272-0.077771-0.639566-0.150426-0.959861-0.215918-0.079818-0.016373-0.160659-0.031722-0.240477-0.048095-0.319272-0.062422-0.639566-0.11768-0.959861-0.167822-0.094144-0.014326-0.189312-0.028653-0.284479-0.041956-0.301875-0.042979-0.604774-0.081864-0.907673-0.113587-0.124843-0.013303-0.249687-0.024559-0.37453-0.036839-0.26913-0.024559-0.538259-0.046049-0.807389-0.062422-0.168846-0.010233-0.337691-0.017396-0.506537-0.024559-0.225127-0.00921-0.450255-0.016373-0.675382-0.01842-0.215918-0.00307-0.430812-0.002047-0.64673 0-0.178055 0.002047-0.356111 0.005117-0.535189 0.011256-0.260943 0.008186-0.520863 0.022513-0.781806 0.038886-0.134053 0.008186-0.268106 0.017396-0.402159 0.027629-0.295735 0.023536-0.590448 0.053212-0.886183 0.086981-0.103354 0.01228-0.205685 0.023536-0.309038 0.036839-0.314155 0.039909-0.627287 0.085958-0.941442 0.138146-0.089028 0.014326-0.177032 0.029676-0.265036 0.045025-0.316202 0.055259-0.63138 0.11768-0.947582 0.185218-0.092098 0.019443-0.183172 0.039909-0.275269 0.061398-0.301875 0.068562-0.602727 0.14224-0.903579 0.222057-0.112564 0.029676-0.224104 0.061398-0.336668 0.093121-0.273223 0.076748-0.545422 0.156566-0.817622 0.242524-0.149403 0.047072-0.297782 0.097214-0.447185 0.147356-0.231267 0.077771-0.461511 0.156566-0.690732 0.2415-0.199545 0.073678-0.397043 0.151449-0.594541 0.230244-0.180102 0.071631-0.360204 0.14224-0.538259 0.217964-0.25378 0.107447-0.50449 0.221034-0.754177 0.336668-0.097214 0.045025-0.195451 0.083911-0.292666 0.130983-0.030699 0.014326-0.059352 0.030699-0.089028 0.045025-0.293689 0.141216-0.584308 0.290619-0.87288 0.444115-0.085958 0.045025-0.173962 0.088004-0.258896 0.135076-0.313132 0.169869-0.621147 0.348947-0.927115 0.532119-0.059352 0.035816-0.12075 0.068562-0.179079 0.104377-0.328481 0.200568-0.651846 0.409322-0.971118 0.62524-0.032746 0.021489-0.066515 0.041956-0.098237 0.064468-0.344854 0.234337-0.684592 0.477884-1.01819 0.730641-0.004093 0.00307-0.00921 0.00614-0.014326 0.010233-0.89744 0.679475-1.750877 1.425466-2.560312 2.226714-0.694825 0.688685-1.349741 1.409093-1.954515 2.164293-0.01842 0.023536-0.035816 0.048095-0.054235 0.071631-0.245593 0.309038-0.484024 0.62217-0.714268 0.940418-0.029676 0.040932-0.057305 0.083911-0.086981 0.125867-0.216941 0.304945-0.429789 0.61296-0.632403 0.927115-0.039909 0.061398-0.077771 0.12689-0.11768 0.189312-0.188288 0.295735-0.372483 0.594541-0.548492 0.89744-0.052189 0.091074-0.102331 0.184195-0.153496 0.276293-0.155543 0.277316-0.309038 0.554632-0.455371 0.837064-0.016373 0.031722-0.034792 0.062422-0.051165 0.094144L254.435876 727.170594c-6.432503 12.579503-1.450025 27.991518 11.129478 34.425044 3.729951 1.906419 7.706519 2.809999 11.626805 2.809999 9.30083 0 18.273179-5.090948 22.798239-13.9405l74.933643-146.537448 274.933723 0 69.639057 145.910161c4.387937 9.195429 13.551644 14.56881 23.105231 14.56881 3.692089 0 7.445576-0.804319 11.001565-2.50096 12.750395-6.084579 18.153452-21.355377 12.06785-34.106796L541.009707 257.07703zM401.088958 552.761356l116.042923-226.928383 108.306728 226.928383L401.088958 552.761356z" p-id="5885" fill="#ffffff"></path></svg>`
              case 1:
                return `<svg t="1622604306219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4757" width="24" height="24"><path d="M329.64608 606.29504C257.974272 606.29504 191.29344 572.845056 146.700288 514.516992 138.03008 503.164928 140.163072 486.91712 151.472128 478.211072 162.771968 469.522432 178.985984 471.646208 187.664384 482.998272 222.403584 528.448512 274.15552 554.515456 329.64608 554.515456 378.018816 554.515456 423.554048 534.828032 457.86624 499.068928 459.285504 497.595392 460.83072 496.321536 462.477312 495.259648 512.607232 445.19936 578.254848 417.709056 648.018944 417.709056 742.71744 417.709056 831.315968 470.46656 879.254528 555.392 886.278144 567.830528 881.90976 583.631872 869.50912 590.6688 857.124864 597.707776 841.347072 593.36704 834.32448 580.893696 795.543552 512.175104 724.16768 469.48864 648.018944 469.48864 590.470144 469.48864 536.291328 492.908544 495.47776 535.442432 494.050304 536.927232 492.486656 538.208256 490.82368 539.278336 447.203328 582.545408 390.20032 606.29504 329.64608 606.29504Z" p-id="4758" fill="#ffffff"></path></svg>`
              case 2:
                return `<svg t="1622604322679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000" width="24" height="24"><path d="M834.32448 461.303808C795.543552 392.585216 724.16768 349.899776 648.018944 349.899776 590.470144 349.899776 536.291328 373.31968 495.47776 415.853568 494.050304 417.337344 492.486656 418.618368 490.82368 419.688448 447.203328 462.95552 390.20032 486.705152 329.64608 486.705152 257.974272 486.705152 191.29344 453.255168 146.700288 394.928128 138.03008 383.576064 140.163072 367.327232 151.472128 358.621184 162.771968 349.932544 178.985984 352.057344 187.664384 363.409408 222.403584 408.859648 274.15552 434.925568 329.64608 434.925568 378.018816 434.925568 423.554048 415.239168 457.86624 379.480064 459.285504 378.005504 460.83072 376.731648 462.477312 375.670784 512.607232 325.610496 578.254848 298.119168 648.018944 298.119168 742.71744 298.119168 831.315968 350.876672 879.254528 435.802112 886.278144 448.241664 881.90976 464.043008 869.50912 471.079936 857.124864 478.118912 841.347072 473.778176 834.32448 461.303808ZM187.664384 602.612736C222.411776 648.070144 274.163712 674.128896 329.64608 674.128896 378.028032 674.128896 423.563264 654.442496 457.86624 618.691584 459.276288 617.209856 460.83072 615.936 462.477312 614.874112 512.607232 564.813824 578.254848 537.330688 648.018944 537.330688 742.71744 537.330688 831.315968 590.08 879.254528 674.989056 886.278144 687.427584 881.90976 703.23712 869.50912 710.283264 857.124864 717.295616 841.347072 712.963072 834.32448 700.507136 795.543552 631.79776 724.16768 589.110272 648.018944 589.110272 590.45376 589.110272 536.291328 612.532224 495.47776 655.04768 494.050304 656.549888 492.486656 657.813504 490.832896 658.891776 447.21152 702.158848 390.209536 725.90848 329.64608 725.90848 257.983488 725.90848 191.301632 692.450304 146.70848 634.131456 138.03008 622.787584 140.163072 606.53056 151.472128 597.832704 162.78016 589.12768 178.985984 591.26784 187.664384 602.612736Z" p-id="5001" fill="#ffffff"></path></svg>`
              case 3:
                return `<svg t="1622604335845" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5243" width="24" height="24"><path d="M869.50912 588.368896C857.124864 595.381248 841.347072 591.048704 834.32448 578.592768 795.543552 509.882368 724.16768 467.195904 648.018944 467.195904 590.45376 467.195904 536.291328 490.616832 495.47776 533.133312 494.050304 534.634496 492.486656 535.899136 490.832896 536.977408 447.21152 580.24448 390.209536 603.994112 329.64608 603.994112 257.983488 603.994112 191.301632 570.535936 146.70848 512.216064 138.03008 500.873216 140.163072 484.616192 151.472128 475.918336 162.78016 467.212288 178.985984 469.353472 187.664384 480.698368 222.411776 526.154752 274.163712 552.214528 329.64608 552.214528 378.028032 552.214528 423.563264 532.527104 457.86624 496.777216 459.276288 495.294464 460.83072 494.020608 462.477312 492.959744 512.607232 442.898432 578.254848 415.415296 648.018944 415.415296 742.71744 415.415296 831.315968 468.165632 879.254528 553.073664 886.278144 565.513216 881.90976 581.322752 869.50912 588.368896ZM869.50912 349.165568C857.124864 356.20352 841.347072 351.862784 834.32448 339.38944 795.543552 270.670848 724.16768 227.985408 648.018944 227.985408 590.470144 227.985408 536.291328 251.405312 495.47776 293.9392 494.050304 295.422976 492.486656 296.704 490.82368 297.77408 447.203328 341.041152 390.20032 364.790784 329.64608 364.790784 257.974272 364.790784 191.29344 331.3408 146.700288 273.012736 138.03008 261.660672 140.163072 245.412864 151.472128 236.706816 162.771968 228.018176 178.985984 230.142976 187.664384 241.494016 222.403584 286.94528 274.15552 313.0112 329.64608 313.0112 378.018816 313.0112 423.554048 293.323776 457.86624 257.565696 459.285504 256.091136 460.83072 254.81728 462.477312 253.755392 512.607232 203.696128 578.254848 176.2048 648.018944 176.2048 742.71744 176.2048 831.315968 228.962304 879.254528 313.887744 886.278144 326.327296 881.90976 342.12864 869.50912 349.165568ZM151.472128 719.69792C162.78016 711.000064 178.985984 713.142272 187.664384 724.48512 222.411776 769.944576 274.163712 796.002304 329.64608 796.002304 378.010624 796.002304 423.545856 776.31488 457.86624 740.564992 459.285504 739.08224 460.83072 737.8176 462.477312 736.738304 512.59904 686.695424 578.254848 659.20512 648.018944 659.20512 742.71744 659.20512 831.315968 711.9616 879.254528 796.86144 886.278144 809.300992 881.90976 825.112576 869.50912 832.15872 857.124864 839.169024 841.347072 834.83648 834.32448 822.382592 795.543552 753.661952 724.16768 710.984704 648.018944 710.984704 590.45376 710.984704 536.282112 734.396416 495.47776 776.923136 494.050304 778.423296 492.486656 779.703296 490.82368 780.765184 447.195136 824.034304 390.194176 847.781888 329.64608 847.781888 257.983488 847.781888 191.301632 814.32576 146.70848 756.005888 138.03008 744.660992 140.163072 728.41216 151.472128 719.69792Z" p-id="5244" fill="#ffffff"></path></svg>`
            }
          }
        }
      }
    },
    //探头统计
    probeTypeTotal() {
      return function (index) {
        let typeAll = this.tableDataAll.filter(data => data.targetCategoryId == index).length
        let typeOp = this.tableDataAll.filter(data => data.targetCategoryId == index && data.state == 1).length
        return `<span><font style="color:#03ff73">${typeOp}</font>/${typeAll}</span>`
      }
    },

    //探头统计
    probeTypeTotalop() {
      return function (index) {

        let typeOp = this.tableDataAll.filter(data => data.targetCategoryId == index).length
        return typeOp > 0 ? true : false
      }
    },
    //充电探头统计
    chargeprobeTypeTotal() {
      return function (index) {
        let typeAll = this.chargetableDataAll.filter(data => data.targetCategoryId == index).length
        let typeOp = this.chargetableDataAll.filter(data => data.targetCategoryId == index && data.state == 1).length
        return `<span><font style="color:#fff952">${typeOp}</font>/${typeAll}</span>`
      }
    },

    //充电探头统计
    chargeprobeTypeTotalop() {
      return function (index) {

        let typeOp = this.chargetableDataAll.filter(data => data.targetCategoryId == index).length
        return typeOp > 0 ? true : false
      }
    },

    //大图标
    probeTypeFilterimg() {
      return function (index,lastEventCode,row) {    
        const typeObj = targetCategoryData.find((obj) => obj.id === index);
        switch (typeObj?typeObj.id:99) {
          case 1:
            return `<svg t="1622600037464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3902" width="64" height="64"><path d="M383.2 941.6c-4 0-6.4-0.8-9.6-2.4-14.4-9.6-82.4-60-25.6-160 15.2-27.2 19.2-48.8 13.6-66.4-6.4-20-27.2-28-27.2-28-9.6-4-14.4-15.2-10.4-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 3.2 0 36.8 14.4 50.4 50.4 10.4 28.8 4.8 62.4-16.8 100-40 70.4 2.4 101.6 11.2 107.2 8.8 4.8 12 16.8 7.2 26.4-4.8 6.4-12 8.8-17.6 8.8z m129.6-42.4c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16 47.2 48 9.6 27.2 4.8 58.4-15.2 92.8-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4.8 6.4-12 8.8-17.6 8.8z m-265.6 0c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16.8 47.2 48 9.6 27.2 4 58.4-15.2 93.6-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4 5.6-12 8-17.6 8z m487.2-71.2c-6.4 0-11.2-2.4-15.2-6.4s-6.4-9.6-6.4-15.2c0-8.8 5.6-16.8 13.6-20.8h0.8v-43.2l-40.8 23.2v0.8c0 6.4-2.4 14.4-10.4 18.4-3.2 2.4-7.2 3.2-11.2 3.2-8 0-15.2-4-18.4-10.4-3.2-5.6-4-11.2-2.4-16.8 1.6-5.6 4.8-10.4 10.4-12.8 3.2-2.4 7.2-3.2 10.4-3.2 4 0 8 0.8 11.2 3.2l36.8-20.8-36-20.8c-4.8 1.6-8.8 2.4-12 2.4-4 0-7.2-0.8-10.4-2.4-9.6-6.4-13.6-20-8-29.6 4-6.4 11.2-10.4 19.2-10.4 4 0 8 0.8 11.2 3.2 6.4 4 10.4 10.4 10.4 18.4v0.8L728 712v-43.2h-0.8c-8-4-13.6-12-13.6-20.8 0-12 9.6-21.6 21.6-21.6 6.4 0 12 2.4 16 6.4s6.4 9.6 6.4 15.2c0 7.2-4 14.4-11.2 18.4H744v41.6l35.2-20v-0.8c0-6.4 2.4-14.4 10.4-18.4 3.2-2.4 7.2-3.2 11.2-3.2 8 0 15.2 4 18.4 10.4 3.2 5.6 4 11.2 2.4 16.8-1.6 5.6-4.8 10.4-10.4 12.8-3.2 2.4-7.2 3.2-10.4 3.2-4 0-8-0.8-11.2-3.2l-36.8 20.8 36 20.8c4.8-1.6 8.8-2.4 12-2.4 4 0 7.2 0.8 10.4 2.4 9.6 6.4 13.6 20 8 29.6-4 6.4-11.2 10.4-19.2 10.4-4 0-8-0.8-11.2-3.2-6.4-4-10.4-10.4-10.4-18.4v-0.8L744 745.6v41.6h0.8c7.2 3.2 11.2 10.4 11.2 18.4 0 12.8-9.6 22.4-21.6 22.4zM152 575.2c-60.8 0-109.6-48.8-109.6-109.6V204.8c0-60.8 48.8-109.6 109.6-109.6h721.6c60.8 0 109.6 48.8 109.6 109.6v260.8c0 60.8-48.8 109.6-109.6 109.6H152z m-11.2-432c-28.8 0-52 24-52 54.4v278.4c0 29.6 23.2 54.4 52 54.4h743.2c28.8 0 52-24 52-54.4V197.6c0-29.6-23.2-54.4-52-54.4H140.8z m21.6 312c-10.4 0-19.2-8.8-19.2-19.2 0-10.4 8.8-19.2 19.2-19.2h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z m0-80.8c-10.4 0-19.2-8.8-19.2-19.2S152 336 162.4 336h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z" fill="#ffffff" p-id="3903"></path></svg>`
          case 2:
          case 41:
            return `<svg t="1622600610514" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="843" width="64" height="64"><path d="M872 582H152c-11 0-20-9-20-20 0-51.3 10-101.1 29.9-147.9 19.1-45.3 46.5-85.9 81.4-120.8 34.9-34.9 75.5-62.3 120.8-81.4C410.9 192 460.7 182 512 182s101.1 10 147.9 29.9c45.3 19.1 85.9 46.5 120.8 81.4 34.9 34.9 62.3 75.5 81.4 120.8C882 460.9 892 510.7 892 562c0 5.3-2.1 10.4-5.9 14.1-3.7 3.8-8.8 5.9-14.1 5.9z m-699.4-40h678.9c-4.8-83.3-39.5-160.9-99-220.4C688.2 257.4 602.8 222 512 222c-90.8 0-176.2 35.4-240.4 99.6-59.5 59.5-94.2 137.1-99 220.4z" fill="#ffffff" p-id="844"></path><path d="M512 762c-110.3 0-200-89.7-200-200h40c0 88.2 71.8 160 160 160s160-71.8 160-160h40c0 110.3-89.7 200-200 200zM512 82c11 0 20 9 20 20v80c0 11-9 20-20 20s-20-9-20-20v-80c0-11 9-20 20-20zM841.8 699.5l-1.8 5.7c-3.4 10.5-14.7 16.3-25.2 12.8l-71.2-23.1c-10.5-3.4-16.3-14.7-12.8-25.2l1.8-5.7c3.4-10.5 14.7-16.3 25.2-12.8l71.2 23.1c10.5 3.5 16.2 14.8 12.8 25.2z m-124.1 174l-4.8 3.5c-8.9 6.5-21.4 4.5-27.9-4.4L641 812c-6.5-8.9-4.5-21.4 4.4-27.9l4.8-3.5c8.9-6.5 21.4-4.5 27.9 4.4l44 60.6c6.5 8.9 4.5 21.4-4.4 27.9zM515 941.3h-6c-11 0-20-9-20-20v-74.9c0-11 9-20 20-20h6c11 0 20 9 20 20v74.9c0 11.1-9 20-20 20zM311.2 877l-4.8-3.5c-8.9-6.5-10.9-19-4.4-27.9l44-60.6c6.5-8.9 19-10.9 27.9-4.4l4.8 3.5c8.9 6.5 10.9 19 4.4 27.9l-44 60.6c-6.5 8.9-19 10.9-27.9 4.4zM184.1 705.2l-1.8-5.7c-3.4-10.5 2.3-21.8 12.8-25.2l71.2-23.1c10.5-3.4 21.8 2.3 25.2 12.8l1.8 5.7c3.4 10.5-2.3 21.8-12.8 25.2L209.3 718c-10.6 3.5-21.8-2.3-25.2-12.8z" fill="#ffffff" p-id="845"></path></svg>`
          case 3:
            return `<svg t="1622601011192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="906" width="64" height="64"><path d="M551.2 655.2c20-41.6 25.6-92.8 16.8-148 19.2 19.2 33.6 41.6 28 78.4-3.2 28 7.2 45.6 16.8 56 16.8 17.6 40 23.2 56 23.2h3.2c64.8-3.2 114.4-120.8 123.2-143.2 18.4-46.4 27.2-140-12-192.8-19.2-25.6-45.6-38.4-80-36-44 3.2-89.6 23.2-132.8 56.8-0.8-0.8-1.6-1.6-3.2-1.6 6.4-22.4 19.2-44 52-57.6 25.6-11.2 36.8-28.8 40-42.4 7.2-24.8-0.8-48.8-8.8-62.4-36-55.2-160.8-39.2-185.6-36-48.8 7.2-136 45.6-160.8 105.6-12.8 28.8-8.8 59.2 8.8 86.4 25.6 38.4 66.4 67.2 120.8 88-26.4 6.4-52 7.2-81.6-15.2-22.4-16.8-43.2-16.8-56.8-13.6-24.8 5.6-42.4 24.8-48.8 40-30.4 58.4 46.4 159.2 62.4 178.4 30.4 37.6 98.4 86.4 160 86.4 4 0 8 0 12.8-0.8 30.4-0.8 55.2-19.2 69.6-49.6z m-73.6-229.6c0-26.4 21.6-48 48-48s48 21.6 48 48-21.6 48-48 48c-27.2 0-48-20.8-48-48z m229.6-92c19.2-1.6 33.6 4 44 19.2 25.6 34.4 24 108 5.6 152.8-24.8 63.2-63.2 116.8-87.2 117.6-6.4 0-19.2-2.4-27.2-11.2-4.8-5.6-7.2-13.6-5.6-23.2 6.4-55.2-18.4-90.4-40-112 11.2-15.2 17.6-33.6 17.6-52.8 0-17.6-4.8-33.6-13.6-46.4C636.8 352 672 336 707.2 333.6z m-359.2-15.2c-11.2-16-12.8-32-5.6-46.4C360 232.8 424 197.6 472 190.4c67.2-10.4 132.8-2.4 144.8 16.8 3.2 5.6 7.2 18.4 4.8 28.8-2.4 7.2-7.2 12.8-16.8 16.8-45.6 20-64.8 52.8-75.2 84.8h-4c-36.8 0-67.2 22.4-81.6 53.6-44-19.2-76-43.2-96-72.8z m165.6 319.2c-8 17.6-20.8 26.4-38.4 28.8-42.4 4.8-105.6-34.4-136-71.2-43.2-51.2-68-112-56.8-132.8 3.2-5.6 12-16 22.4-18.4 7.2-1.6 15.2 0 23.2 6.4 45.6 35.2 88 30.4 119.2 20.8 16 27.2 44.8 45.6 78.4 45.6h1.6c8 45.6 2.4 88-13.6 120.8z" fill="#ffffff" p-id="907"></path><path d="M524 823.2C305.6 823.2 128 645.6 128 426.4S305.6 30.4 524 30.4s396.8 177.6 396.8 396.8-177.6 396-396.8 396z m0-743.2c-191.2 0-345.6 155.2-345.6 345.6s156 346.4 346.4 346.4S872 616.8 872 426.4 716 80 524 80z" fill="#ffffff" p-id="908"></path><path d="M501.6 789.6h45.6v161.6h-45.6V789.6z" fill="#ffffff" p-id="909"></path><path d="M674.4 989.6H374.4c-14.4 0-25.6-12-25.6-25.6v-7.2c0-14.4 12-25.6 25.6-25.6h299.2c14.4 0 25.6 12 25.6 25.6v7.2c0 15.2-11.2 25.6-24.8 25.6z" fill="#ffffff" p-id="910"></path></svg>`
          case 4:
            return `<svg t="1622602454492" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22717" width="64" height="64"><path d="M531.446 594.317c-32.316 0-58.607-26.291-58.607-58.606 0-20.872 11.229-40.318 29.306-50.75 18.071-10.435 40.528-10.436 58.605 0.001 18.075 10.433 29.304 29.879 29.304 50.749 0 32.315-26.291 58.606-58.608 58.606z m-0.001-92.193a33.6 33.6 0 0 0-16.803 4.488c-10.365 5.982-16.804 17.132-16.804 29.099 0 18.53 15.076 33.606 33.607 33.606s33.607-15.076 33.607-33.606c0-11.966-6.438-23.115-16.803-29.098a33.599 33.599 0 0 0-16.804-4.489z" fill="#ffffff" p-id="22718"></path><path d="M492.83 516.891l-8.693-11.176c-40.418-51.962-101.492-130.486-82.302-194.517 0.453-1.528 8.355-27.394 30.393-53.231 20.649-24.21 58.064-53.07 119.04-53.07l0.692 0.019c46.254 2.566 80.509 16.288 101.813 40.785 14.476 16.646 17.858 32.776 18.594 37.842 2.582 9.521 2.151 28.255-14.216 45.097-6.2 8.354-68.896 93.549-95.329 157.018l-3.204 7.694h-25.522c-12.923 0-21.394 3.666-31.254 13.526l-10.012 10.013z m58.092-286.994c-41.141 0.083-74.675 14.985-99.674 44.293-18.814 22.058-25.376 43.88-25.439 44.098l-0.02 0.066c-14.437 48.089 33.325 114.126 70.062 161.677 11.307-8.097 23.326-11.679 38.245-11.679h8.969c30.403-68.148 92.837-151.718 95.577-155.372l0.535-0.712 0.63-0.629c10.525-10.517 8.8-19.998 8.384-21.682l-0.651-1.668 0.105-1.019c-0.453-3.501-8.374-52.346-96.723-57.373z m-137.106 84.864h0.01-0.01z m234.42-24.684zM330.515 689.426c-5.739 0-11.251-0.522-16.516-1.576l-0.412-0.089c-1.101-0.26-27.28-6.585-54.168-27.328-24.935-19.237-55.332-54.964-58.544-115.922l-0.018-0.658c0-57.534 19.121-88.731 35.162-104.771 16.405-16.404 32.905-20.941 37.208-21.89 9.276-2.731 28.229-2.632 45.314 13.739 10.589 6.764 99.531 62.985 162.225 83.876l8.549 2.849v14.745c0 10.82 6.651 23.069 11.997 32.912 1.394 2.566 2.71 4.99 3.868 7.303l3.758 7.508-5.527 6.318c-23.532 26.902-55.361 54.026-85.142 72.558-32.285 20.087-62.245 30.426-87.754 30.426z m-11.366-26.041c49.502 9.66 121.471-45.835 159.706-87.04-5.891-10.857-13.501-25.246-14.443-40.775-68.488-25.014-156.618-81.811-160.487-84.314l-1.114-0.721-0.938-0.939c-10.516-10.525-19.996-8.8-21.678-8.383l-1.134 0.443-0.458-0.048c-3.486 0.763-52.624 13.132-52.746 101.916 2.247 41.178 18.676 73.85 48.833 97.116 21.617 16.675 42.412 22.227 44.459 22.745z m-38.834-222.22zM527.941 868.554c-34.944 0.002-57.086-11.328-70.316-22.257-18.975-15.673-24.316-33.694-24.863-35.698a54.585 54.585 0 0 1 7.422-44.622c5.523-8.216 55.666-105.569 72.645-179.102l2.237-9.688h9.942c12.003 0 20.918-8.915 31.24-19.237l7.803-7.803 8.726 6.759c18.477 14.369 53.56 43.711 80.927 78.778 28.36 36.342 41.274 69.459 38.382 98.431l-0.015 0.138c-0.129 1.161-3.362 28.779-20.986 58.661-16.381 27.772-48.699 62.891-109.657 72.537-12.286 2.162-23.419 3.103-33.487 3.103z m-71.075-64.592c0.858 2.844 16.905 51.573 100.329 36.85l0.227-0.038c40.919-6.45 71.753-26.553 91.646-59.749 14.828-24.744 17.983-48.172 18.152-49.507 4.416-45.212-47.914-104.827-101.271-148.109-8.52 7.915-18.252 15.182-30.883 17.774-18.962 73.695-65.977 166.607-74.136 178.743a29.564 29.564 0 0 0-4.064 24.036z m222.78-71.089h0.01-0.01zM798.349 665.247l-1.461-0.078a80.775 80.775 0 0 1-40.652-13.551c-0.885-0.594-91.784-60.528-169.361-90.365l-8.013-3.082V532.4c0-7.965-4.55-16.55-13.523-25.518l-8.845-8.839 8.842-8.842c33.281-33.281 118.296-109.166 188.843-95.058 31.508 6.302 57.255 12.769 77.973 33.484 22.233 22.232 35.211 58.767 40.839 114.979l0.063 0.621v0.624c0 54.725-19.233 84.573-35.368 99.977-17.941 17.128-35.905 20.794-37.896 21.156l-1.441 0.263zM603.861 541.084c78.159 31.652 165.416 89.179 166.292 89.767a55.768 55.768 0 0 0 26.365 9.237c8.336-2.281 51.305-17.821 51.532-95.616-5.048-49.794-15.723-81.313-33.577-99.166-15.792-15.79-36.984-21.005-65.198-26.648-54.562-10.917-126.969 50.618-157.897 80.064 8.293 10.92 12.483 22.207 12.483 33.677v8.685z" fill="#ffffff" p-id="22719"></path><path d="M811.955 919.5h-550c-62.033 0-112.5-50.468-112.5-112.5V271.389c0-62.033 50.467-112.5 112.5-112.5h550c62.033 0 112.5 50.467 112.5 112.5V807c0 62.032-50.467 112.5-112.5 112.5z m-550-735.611c-48.248 0-87.5 39.252-87.5 87.5V807c0 48.248 39.252 87.5 87.5 87.5h550c48.248 0 87.5-39.252 87.5-87.5V271.389c0-48.248-39.252-87.5-87.5-87.5h-550z" fill="#ffffff" p-id="22720"></path></svg>`
          case 5:
            return `<svg t="1622602549017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12021" width="64" height="64"><path d="M578.264 0c66.432 0 120.48 53.832 120.48 120v536c0 66.168-54.048 120-120.48 120h-72.16v101.664c0 58.64 47.888 106.336 106.76 106.336h50.528c58.872 0 106.76-47.704 106.76-106.336V677.472c-22.744-7.16-39.28-28.376-39.28-53.376V335.264c0-81.632 61.216-151 142.4-161.36a36.536 36.536 0 0 1 28.672 8.752 36.136 36.136 0 0 1 12.336 27.168v32.136l0.648-0.024h10.04c11.088 0 20.08 8.952 20.08 20 0 11.04-8.992 20-20.08 20h-10.04c-0.216 0-0.432-0.032-0.648-0.04v33.4c0.216-0.008 0.432-0.04 0.656-0.04h10.04c11.088 0 20.08 8.96 20.08 20 0 11.048-8.992 20-20.08 20h-10.04c-0.224 0-0.44-0.024-0.656-0.032v33.408c0.216-0.008 0.432-0.032 0.656-0.032h10.04c11.088 0 20.08 8.952 20.08 20 0 11.04-8.992 20-20.08 20h-10.04c-0.224 0-0.44-0.032-0.656-0.04v32.144a36.16 36.16 0 0 1-12.336 27.168 36.504 36.504 0 0 1-28.68 8.744 162.912 162.912 0 0 1-30.032-6.768v134.248c0 22.6-13.52 42.096-32.92 50.928v202.64c0 80.688-65.904 146.336-146.92 146.336h-50.528c-81.016 0-146.92-65.648-146.92-146.336V776H128.48C62.048 776 8 722.168 8 656V120C8 53.832 62.048 0 128.48 0z m0 40H413.6v277c0 43.56-35.576 79-79.312 79H195.744c-43.736 0-79.312-35.44-79.312-79V40.904C77.84 46.712 48.16 79.968 48.16 120v536c0 44.112 36.032 80 80.32 80h449.784c44.288 0 80.32-35.888 80.32-80V120c0-44.112-36.032-80-80.32-80zM265.016 428.112a111.92 111.92 0 0 1 79.52 32.8 111.04 111.04 0 0 1 32.928 79.2 111.04 111.04 0 0 1-32.936 79.2 113.256 113.256 0 0 1-96.256 31.56 20.016 20.016 0 0 1-16.88-22.744 20.08 20.08 0 0 1 22.832-16.816 71.888 71.888 0 0 0 61.912-20.288 71.384 71.384 0 0 0 21.168-50.912c0-19.232-7.52-37.312-21.168-50.912a71.96 71.96 0 0 0-51.12-21.088 71.96 71.96 0 0 0-51.12 21.088 71.392 71.392 0 0 0-20.56 60.256 20.016 20.016 0 0 1-17.328 22.416 20.08 20.08 0 0 1-22.496-17.256 111.04 111.04 0 0 1 32-93.704 111.944 111.944 0 0 1 79.504-32.8z m506.008 13.848v182.136c0 8.808 7.2 15.968 16.032 15.968a16.008 16.008 0 0 0 16.016-15.968V470.224a164.064 164.064 0 0 1-32.048-28.264z m-585.704 148.88a20.144 20.144 0 0 1 28.4 0l0.184 0.184c7.84 7.816 7.84 20.48 0 28.288a20.064 20.064 0 0 1-14.2 5.856 20.064 20.064 0 0 1-14.2-5.856l-0.184-0.184a19.944 19.944 0 0 1 0-28.288z m404.992-75.776c5.28 0 10.464 2.136 14.192 5.856 3.736 3.72 5.888 8.88 5.888 14.144a20.08 20.08 0 0 1-5.888 14.136 20.256 20.256 0 0 1-14.192 5.864c-5.28 0-10.464-2.144-14.2-5.864a20.096 20.096 0 0 1-5.88-14.136c0-5.264 2.144-10.4 5.88-14.144a20.264 20.264 0 0 1 14.2-5.856z m0-294.128c11.088 0 20.08 8.952 20.08 20v217.984c0 11.04-8.992 20-20.08 20a20.04 20.04 0 0 1-20.08-20V240.936c0-11.048 8.992-20 20.08-20z m283.808-6.728c-59.072 9.624-103.096 60.928-103.096 121.056 0 60.136 44.024 111.44 103.096 121.064z m121.128 174.392c11.088 0 20.08 8.952 20.08 20 0 11.04-8.992 20-20.08 20h-10.04a20.04 20.04 0 0 1-20.08-20c0-11.048 8.992-20 20.08-20zM373.448 40H156.592v277c0 21.504 17.56 39 39.152 39h138.552c21.592 0 39.152-17.496 39.152-39V40z m621.8 275.264c11.088 0 20.08 8.96 20.08 20s-8.992 20-20.08 20h-10.04a20.04 20.04 0 0 1-20.08-20c0-11.04 8.992-20 20.08-20z m-730.232-123.2c37.648 0 68.272 30.512 68.272 68 0 37.504-30.624 68-68.272 68-37.64 0-68.264-30.496-68.264-68 0-37.488 30.624-68 68.264-68z m0 40a28.08 28.08 0 0 0-28.104 28 28.08 28.08 0 0 0 28.104 28 28.08 28.08 0 0 0 28.112-28 28.08 28.08 0 0 0-28.112-28z m730.24 9.872c11.08 0 20.08 8.952 20.08 20 0 11.04-9 20-20.08 20h-10.048a20.04 20.04 0 0 1-20.08-20c0-11.048 8.992-20 20.08-20zM265.008 80c26.576 0 48.192 21.536 48.192 48s-21.616 48-48.192 48c-26.56 0-48.184-21.536-48.184-48s21.616-48 48.184-48z m0 40c-4.424 0-8.024 3.584-8.024 8a8.024 8.024 0 0 0 16.056 0c0-4.416-3.6-8-8.032-8z" fill="#ffffff" p-id="12022"></path></svg>`
          case 6:
            return `<svg t="1631952768039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19162" width="64" height="64"><path d="M917 357.2H759.5V213.8c0-30.3-24.7-55-55-55H117c-30.3 0-55 24.7-55 55v425.1c0 30.3 24.7 55 55 55h278.7v141.4H185.2c-8.3 0-15 6.7-15 15s6.7 15 15 15h451c8.3 0 15-6.7 15-15s-6.7-15-15-15H425.7V693.9h278.7c30.3 0 55-24.7 55-55V387.2H917c8.3 0 15 6.7 15 15v418c0 8.3-6.7 15-15 15H748.5c-8.3 0-15 6.7-15 15s6.7 15 15 15H917c24.8 0 45-20.2 45-45v-418c0-24.8-20.2-45-45-45zM729.5 638.9c0 13.8-11.2 25-25 25H117c-13.8 0-25-11.2-25-25V213.8c0-13.8 11.2-25 25-25h587.5c13.8 0 25 11.2 25 25v425.1z" fill="#ffffff" p-id="19164"></path></svg>`
          case 7:
            return `<svg t="1631952734152" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16149" width="64" height="64"><path d="M901.12 143.36H122.88c-34.816 0-61.44 26.624-61.44 61.44v532.48c0 34.816 26.624 61.44 61.44 61.44h81.92l-36.864 49.152c-6.144 8.192-4.096 22.528 4.096 28.672 4.096 2.048 8.192 4.096 12.288 4.096 6.144 0 12.288-2.048 16.384-8.192l55.296-73.728h512l55.296 73.728c4.096 6.144 10.24 8.192 16.384 8.192 4.096 0 8.192-2.048 12.288-4.096 8.192-6.144 10.24-20.48 4.096-28.672L819.2 798.72h81.92c34.816 0 61.44-26.624 61.44-61.44V204.8c0-34.816-26.624-61.44-61.44-61.44zM122.88 184.32h778.24c12.288 0 20.48 8.192 20.48 20.48v471.04H102.4V204.8c0-12.288 8.192-20.48 20.48-20.48z m778.24 573.44H122.88c-12.288 0-20.48-8.192-20.48-20.48v-20.48h819.2v20.48c0 12.288-8.192 20.48-20.48 20.48z" fill="#ffffff" p-id="16150"></path><path d="M330.0352 376.832c4.096 6.144 10.24 12.288 18.47296 12.288 8.192 0 14.336-4.096 18.45248-12.288l41.02144-81.92c4.096-10.24 0-22.528-8.192-26.624-10.26048-4.096-22.56896 0-26.66496 8.192l-24.61696 47.104-22.56896-45.056c-4.096-10.24-16.42496-14.336-26.66496-8.192-10.26048 4.096-14.37696 16.384-8.21248 26.624l38.97344 79.872zM163.88096 307.2h20.50048v61.44c0 12.288 8.21248 20.48 20.52096 20.48s20.52096-8.192 20.52096-20.48v-61.44h20.50048c12.30848 0 20.52096-8.192 20.52096-20.48s-8.192-20.48-20.52096-20.48H163.88096C151.552 266.24 143.36 274.432 143.36 286.72s8.192 20.48 20.52096 20.48z" fill="#ffffff" p-id="16151"></path></svg>`
          case 8:
            return '<svg t="1622601366977" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4085" width="64" height="64"><path d="M512 64C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64z m0 832C300.256 896 128 723.744 128 512S300.256 128 512 128s384 172.256 384 384-172.256 384-384 384z" p-id="4086" fill="#ffffff"></path><path d="M519.552 256a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32zM348.384 520.32a32 32 0 1 0-56.768 29.568l72.32 136.896a32 32 0 1 0 56.768-29.568l-72.32-136.896zM727.104 506.72a32 32 0 0 0-43.168 13.6l-72.32 136.896a32 32 0 1 0 56.768 29.568l72.32-136.896a32 32 0 0 0-13.6-43.168z" p-id="4087" fill="#ffffff"></path></svg>'
          case 9:
            return `<svg t="1622602648826" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6592" width="64" height="64"><path d="M917 696.3H519.2c-11 0-20-9-20-20s9-20 20-20H897v-460H137v460h310.9c11 0 20 9 20 20s-9 20-20 20H117c-11 0-20-9-20-20v-500c0-11 9-20 20-20h800c11 0 20 9 20 20v500c0 11.1-9 20-20 20z" fill="#ffffff" p-id="6593"></path><path d="M517 875.1c-11 0-20-9-20-20v-180c0-11 9-20 20-20s20 9 20 20v180c0 11.1-9 20-20 20z" fill="#ffffff" p-id="6594"></path><path d="M719 876.6H315c-11 0-20-9-20-20s9-20 20-20h404c11 0 20 9 20 20s-9 20-20 20zM214.6 336.8c-5.1 0-10.2-2-14.1-5.9-7.8-7.8-7.8-20.5 0-28.3l76-76c7.8-7.8 20.5-7.8 28.3 0s7.8 20.5 0 28.3l-76 76c-4 4-9.1 5.9-14.2 5.9zM216.1 457.3c-5.1 0-10.2-2-14.1-5.9-7.8-7.8-7.8-20.5 0-28.3l184-184c7.8-7.8 20.5-7.8 28.3 0s7.8 20.5 0 28.3l-184 184c-4 4-9.1 5.9-14.2 5.9z" fill="#ffffff" p-id="6595"></path></svg>`
          case 10:
            return `<svg t="1622601619746" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4341" width="64" height="64"><path d="M308.757333 256C235.797333 370.88 192 546.090667 192 736c0 10.709333 0.128 21.376 0.426667 32h635.370666c0.277333-10.624 0.426667-21.290667 0.426667-32 0-190.122667-43.946667-365.525333-117.034667-480.405333-2.346667 0.277333-4.757333 0.405333-7.189333 0.405333H308.757333z m-45.909333-6.677333a64 64 0 0 1-14.442667-9.856L189.824 186.496A58.069333 58.069333 0 0 1 228.8 85.333333H704c18.986667 0 36.053333 8.277333 47.765333 21.397334A192 192 0 0 1 938.666667 298.666667v256a21.333333 21.333333 0 0 1-42.666667 0V298.666667a149.376 149.376 0 0 0-128-147.84V192a63.786667 63.786667 0 0 1-18.24 44.757333c76.245333 122.261333 121.109333 303.68 121.109333 499.242667 0 10.709333-0.128 21.376-0.384 32H874.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v42.666667a42.666667 42.666667 0 0 1-42.666667 42.666667H106.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-42.666667a85.333333 85.333333 0 0 1 85.333333-85.333333h0.405334A1278.549333 1278.549333 0 0 1 149.333333 736c0-188.970667 41.898667-364.736 113.514667-486.677333zM149.333333 810.666667a42.666667 42.666667 0 0 0-42.666666 42.666666v42.666667h810.666666v-42.666667a42.666667 42.666667 0 0 0-42.666666-42.666666H149.333333z m68.032-677.589334a15.402667 15.402667 0 0 0 1.066667 21.76l58.602667 52.992a21.333333 21.333333 0 0 0 14.293333 5.504H704a21.333333 21.333333 0 0 0 21.333333-21.333333V149.333333a21.333333 21.333333 0 0 0-21.333333-21.333333H228.8a15.402667 15.402667 0 0 0-11.434667 5.077333z" fill="#ffffff" p-id="4342"></path></svg>`
          case 11:
            return `<svg t="1622602718884" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8011" width="64" height="64"><path d="M865.92009 115.378765c0-36.621571-13.285992-50.609087-50.423813-51.567837-20.885839-0.540034-41.797461-0.097934-63.711604-0.097934l-542.290527 0.02998c-40.439382 0.657954-54.012779 13.681724-54.053152 53.405191-0.273215 263.326265-0.366152 526.653129-0.348764 789.985989 0.004997 36.369142 15.998553 51.652779 53.797325 51.692752 163.129998 0.130911 434.803603 0.070952 597.925606 0.019986 46.497475-0.019986 59.118718-12.621443 59.11472-58.430184C865.910097 638.73453 865.888112 377.055149 865.92009 115.378765zM201.393439 163.02726c0.10333-38.3484 17.765955-54.128101 55.474189-54.18866 128.361571-0.195867 381.001681-0.225847 509.36525 0.040572 36.38633 0.077947 54.751678 17.941835 54.931556 55.518758 0.63357 124.30732 0.713516 248.615838 0.120918 372.918761-0.180877 38.432743-17.261297 55.327288-54.659741 55.704033-65.133639 0.647561-130.283268 0.175881-195.431098 0.175881 0-0.140904 0-0.286806 0-0.431707-63.201949 0-250.687434 0.26582-313.89338-0.089939-40.363434-0.230843-53.681004-11.878946-54.20305-53.807319C201.538741 413.598372 201.047074 288.30652 201.393439 163.02726zM390.629137 324.219571l19.198983 0c0 0 9.434004-49.827617 10.697147-56.493098 1.259546-6.664881 11.009935-9.873306 11.009935-22.216337 0-12.338634 0-49.637146 0-49.637146l-62.570377 0c0 0 0 39.30675 0 49.637146 0 10.329996 9.506555 15.448526 10.969962 22.216337C381.395798 274.492086 390.629137 324.219571 390.629137 324.219571zM611.148625 324.219571l19.204979 0c0 0 9.438601-49.827617 10.699746-56.493098 1.259146-6.664881 11.004539-9.873306 11.004539-22.216337 0-12.338634 0-49.637146 0-49.637146l-62.568379 0c0 0 0 39.30675 0 49.637146 0 10.329996 9.509553 15.448526 10.970562 22.216337C601.920882 274.492086 611.148625 324.219571 611.148625 324.219571zM200.341552 664.786867c0.10293-22.497747 17.793936-31.756269 55.566726-31.791246 128.580422-0.114922 381.649242-0.134909 510.234861 0.024983 36.44609 0.04497 54.845615 10.523865 55.027491 32.574914 0.631572 72.92036 0.711518 145.844717 0.114922 218.775071-0.180877 22.542716-17.287279 32.453996-54.755676 32.673847-65.239568 0.381741-130.498122 0.110925-195.756877 0.110925 0-0.090938 0-0.169885 0-0.260823-63.310875 0-251.114145 0.159892-314.428018-0.049966-40.433986-0.130911-53.774341-6.969275-54.295987-31.570595C200.485055 811.790798 199.992789 738.284835 200.341552 664.786867zM587.385736 600.85841c33.312414 1.355081 66.705574 0.662551 102.417361 0.662551 7.12417-65.611316 13.858604-127.616076 20.694969-190.553205l-160.239957 0c6.964278 60.255547 13.239024 118.135104 20.976778 175.818395C571.978183 592.3182 581.607654 600.627567 587.385736 600.85841zM594.153148 480.933519c28.784484 1.25315 57.663704 0.333774 88.339906 0.333774-2.485315 30.204921-4.814736 55.882512-6.6365 81.593879-1.175203 16.618732-9.4396 23.828844-26.118292 22.573695-19.681656-1.485992-39.413078-2.229488-59.013789-3.283774-4.950643-28.748509-9.559519-54.108115-13.574796-79.558459C575.130046 489.865863 576.270273 480.153048 594.153148 480.933519z" p-id="8012" fill="#ffffff"></path></svg>`
          case 12:
            return '<svg t="1622601797256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9956" width="64" height="64"><path d="M609.066667 1023.982933V1024H64c-35.346133 0-64-28.653867-64-64V64C0 28.653867 28.653867 0 64 0h512c35.346133 0 64 28.653867 64 64v720-176c0 17.6736-14.3264 32-32 32-17.6736 0-32-14.3264-32-32V96c0-17.6736-14.3264-32-32-32H96c-17.6736 0-32 14.3264-32 32v832c0 17.6736 14.3264 32 32 32h510.933333v0.017067c0.354133-0.010667 0.709333-0.017067 1.066667-0.017067 17.6736 0 32 14.3264 32 32 0 17.316267-13.7536 31.419733-30.933333 31.982933zM192 384c-35.346133 0-64-28.653867-64-64s28.653867-64 64-64 64 28.653867 64 64-28.653867 64-64 64z m256 0c-35.346133 0-64-28.653867-64-64s28.653867-64 64-64 64 28.653867 64 64-28.653867 64-64 64zM192 576c-35.346133 0-64-28.653867-64-64s28.653867-64 64-64 64 28.653867 64 64-28.653867 64-64 64z m256 0c-35.346133 0-64-28.653867-64-64s28.653867-64 64-64 64 28.653867 64 64-28.653867 64-64 64zM160 128h320c17.6736 0 32 14.3264 32 32 0 17.6736-14.3264 32-32 32H160c-17.6736 0-32-14.3264-32-32 0-17.6736 14.3264-32 32-32z" fill="#ffffff" p-id="9957"></path><path d="M415.994667 704.005333h512.010666C981.021867 704.005333 1024 746.983467 1024 800s-42.978133 95.994667-95.994667 95.994667h-512.010666C362.978133 895.994667 320 853.016533 320 800s42.978133-95.994667 95.994667-95.994667z m0.0032 63.9968C398.3264 768.002133 384 782.327467 384 800s14.325333 31.997867 31.997867 31.997867h512.004266c17.671467 0 31.997867-14.325333 31.997867-31.997867s-14.325333-31.997867-31.997867-31.997867H415.997867z" fill="#ffffff" p-id="9958"></path></svg>'
          case 13:
            return '<svg t="1622601490854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="64" height="64"><path d="M874.4 905.6H165.6c-21.6 0-39.2-17.6-39.2-39.2V157.6c0-21.6 17.6-39.2 39.2-39.2h708.8c21.6 0 39.2 17.6 39.2 39.2v708.8c0 21.6-17.6 39.2-39.2 39.2zM165.6 140c-9.6 0-17.6 8-17.6 17.6v708.8c0 9.6 8 17.6 17.6 17.6h708.8c9.6 0 17.6-8 17.6-17.6V157.6c0-9.6-8-17.6-17.6-17.6H165.6z" p-id="2167" fill="#ffffff"></path><path d="M874.4 912H165.6c-24.8 0-45.6-20.8-45.6-45.6V157.6c0-24.8 20.8-45.6 45.6-45.6h708.8c24.8 0 45.6 20.8 45.6 45.6v708.8c0 24.8-20.8 45.6-45.6 45.6zM165.6 124.8c-17.6 0-32.8 14.4-32.8 32.8v708.8c0 17.6 14.4 32.8 32.8 32.8h708.8c17.6 0 32.8-14.4 32.8-32.8V157.6c0-17.6-14.4-32.8-32.8-32.8H165.6z m708.8 765.6H165.6c-13.6 0-24-11.2-24-24V157.6c0-13.6 11.2-24 24-24h708.8c13.6 0 24 11.2 24 24v708.8c0 13.6-10.4 24-24 24z m-708.8-744c-6.4 0-11.2 4.8-11.2 11.2v708.8c0 6.4 4.8 11.2 11.2 11.2h708.8c6.4 0 11.2-4.8 11.2-11.2V157.6c0-6.4-4.8-11.2-11.2-11.2H165.6z" p-id="2168" fill="#ffffff"></path><path d="M803.2 608H236.8c-21.6 0-39.2-17.6-39.2-39.2V228.8c0-21.6 17.6-39.2 39.2-39.2h567.2c21.6 0 39.2 17.6 39.2 39.2v340c-0.8 21.6-18.4 39.2-40 39.2zM236.8 210.4c-9.6 0-17.6 8-17.6 17.6V568c0 9.6 8 17.6 17.6 17.6h567.2c9.6 0 17.6-8 17.6-17.6V228.8c0-9.6-8-17.6-17.6-17.6H236.8z" p-id="2169" fill="#ffffff"></path><path d="M803.2 614.4H236.8c-24.8 0-45.6-20.8-45.6-45.6V228.8c0-24.8 20.8-45.6 45.6-45.6h567.2c24.8 0 45.6 20.8 45.6 45.6v340c-0.8 24.8-20.8 45.6-46.4 45.6zM236.8 196c-17.6 0-32.8 14.4-32.8 32.8v340c0 17.6 14.4 32.8 32.8 32.8h567.2c17.6 0 32.8-14.4 32.8-32.8V228.8c0-17.6-14.4-32.8-32.8-32.8H236.8z m566.4 396.8H236.8c-13.6 0-24-11.2-24-24V228.8c0-13.6 11.2-24 24-24h567.2c13.6 0 24 11.2 24 24v340c0 13.6-11.2 24-24.8 24zM236.8 217.6c-6.4 0-11.2 4.8-11.2 11.2v340c0 6.4 4.8 11.2 11.2 11.2h567.2c6.4 0 11.2-4.8 11.2-11.2V228.8c0-6.4-4.8-11.2-11.2-11.2H236.8z m528.8 519.2c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2zM624.8 736.8c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z m-140 0c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z" p-id="2170" fill="#ffffff"></path><path d="M461.6 316l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8z m0 73.6h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m0 92h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m129.6-165.6l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8zM520 387.2v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m71.2 2.4h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m11.2 11.2l-9.6 9.6v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6z m-11.2 80.8h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6zM464 318.4v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6-9.6 9.6z m-73.6 160.8v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m129.6 0v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z" p-id="2171" fill="#ffffff"></path><path d="M592 502.4h-71.2L499.2 480v-71.2l10.4-10.4-10.4-10.4v-71.2l11.2-12 10.4-10.4H592l11.2 12-11.2 12h-69.6v68.8H592l11.2 11.2 10.4 10.4V480L592 502.4z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m92 0l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72.8 0.8h68.8v-68.8h-68.8v68.8z m0.8-73.6h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-60.8 188.8h-71.2L369.6 480v-71.2l10.4-10.4 11.2-11.2h69.6v-68.8h-69.6l-11.2-12 11.2-12h71.2l10.4 10.4 11.2 12v71.2L472.8 400l-10.4 10.4h-69.6v68.8h69.6l11.2 11.2-11.2 12z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m72-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2zM648 296.8c4.8 0 8 3.2 9.6 8v4c-1.6 4-4 6.4-8 7.2h-3.2c-4.8-0.8-8-4-8-9.6 0-4.8 3.2-8 9.6-9.6z m-0.8 3.2c-4 0.8-5.6 3.2-5.6 6.4s1.6 5.6 4.8 6.4l2.4 0.8c4-1.6 6.4-4 5.6-7.2v-0.8c-0.8-2.4-2.4-4.8-4.8-5.6h-2.4z m48 7.2c14.4 0.8 23.2 6.4 27.2 17.6l0.8 0.8-7.2 3.2c-3.2-8.8-8.8-12.8-16-13.6l-5.6-0.8c-15.2 0.8-23.2 11.2-23.2 30.4 0.8 13.6 6.4 21.6 16 25.6 2.4 0.8 5.6 1.6 10.4 1.6 8.8-0.8 16-7.2 20-17.6v-0.8l8 1.6v0.8c-6.4 15.2-16 23.2-28.8 23.2h-5.6c-14.4-2.4-22.4-9.6-25.6-20.8-1.6-4.8-2.4-9.6-2.4-14.4 0.8-15.2 6.4-26.4 16-32 4.8-3.2 9.6-4.8 15.2-4.8h0.8z" p-id="2172" fill="#ffffff"></path><path d="M690.4 381.6c-15.2-2.4-24.8-9.6-28-22.4-1.6-4.8-2.4-10.4-2.4-15.2 0.8-16 6.4-27.2 16.8-34.4 4.8-3.2 10.4-4.8 15.2-4.8h2.4c15.2 0.8 24.8 7.2 29.6 19.2l1.6 2.4-12 4.8-0.8-2.4c-3.2-8-7.2-12-14.4-12l-5.6-0.8c-13.6 0.8-20.8 9.6-20.8 28 0.8 12 5.6 20 15.2 23.2 1.6 0.8 4 1.6 9.6 0.8 8-0.8 13.6-6.4 18.4-16h2.4l9.6 1.6v3.2c-6.4 16-16.8 24-31.2 24.8h-5.6z m3.2-72c-4.8 0-9.6 1.6-13.6 4-9.6 5.6-14.4 16-15.2 30.4 0 4.8 0.8 9.6 1.6 13.6 3.2 10.4 11.2 16.8 24 19.2h5.6c12-0.8 20-7.2 26.4-20l-3.2-0.8c-4.8 10.4-12 16.8-21.6 17.6-5.6 0-8.8 0-11.2-1.6-10.4-4-16.8-13.6-17.6-27.2 0.8-20.8 8.8-32 25.6-32.8l6.4 0.8c8 0.8 13.6 4.8 16.8 12.8l3.2-1.6c-4-9.6-12-14.4-24-15.2l-3.2 0.8z m-46.4 8.8c-4.8-0.8-9.6-3.2-10.4-12 0-4.8 2.4-9.6 11.2-12 4 0 8.8 2.4 12 9.6v4.8c-0.8 4.8-4.8 8-9.6 8.8l-3.2 0.8z m0.8-16c-3.2 0.8-4 3.2-4 4 0 2.4 1.6 4 3.2 4.8h1.6c4-1.6 4-3.2 4-4.8-0.8-1.6-1.6-3.2-3.2-4H648z" p-id="2173" fill="#ffffff"></path></svg>'
          case 14:
            return '<svg t="1622601490854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="64" height="64"><path d="M874.4 905.6H165.6c-21.6 0-39.2-17.6-39.2-39.2V157.6c0-21.6 17.6-39.2 39.2-39.2h708.8c21.6 0 39.2 17.6 39.2 39.2v708.8c0 21.6-17.6 39.2-39.2 39.2zM165.6 140c-9.6 0-17.6 8-17.6 17.6v708.8c0 9.6 8 17.6 17.6 17.6h708.8c9.6 0 17.6-8 17.6-17.6V157.6c0-9.6-8-17.6-17.6-17.6H165.6z" p-id="2167" fill="#ffffff"></path><path d="M874.4 912H165.6c-24.8 0-45.6-20.8-45.6-45.6V157.6c0-24.8 20.8-45.6 45.6-45.6h708.8c24.8 0 45.6 20.8 45.6 45.6v708.8c0 24.8-20.8 45.6-45.6 45.6zM165.6 124.8c-17.6 0-32.8 14.4-32.8 32.8v708.8c0 17.6 14.4 32.8 32.8 32.8h708.8c17.6 0 32.8-14.4 32.8-32.8V157.6c0-17.6-14.4-32.8-32.8-32.8H165.6z m708.8 765.6H165.6c-13.6 0-24-11.2-24-24V157.6c0-13.6 11.2-24 24-24h708.8c13.6 0 24 11.2 24 24v708.8c0 13.6-10.4 24-24 24z m-708.8-744c-6.4 0-11.2 4.8-11.2 11.2v708.8c0 6.4 4.8 11.2 11.2 11.2h708.8c6.4 0 11.2-4.8 11.2-11.2V157.6c0-6.4-4.8-11.2-11.2-11.2H165.6z" p-id="2168" fill="#ffffff"></path><path d="M803.2 608H236.8c-21.6 0-39.2-17.6-39.2-39.2V228.8c0-21.6 17.6-39.2 39.2-39.2h567.2c21.6 0 39.2 17.6 39.2 39.2v340c-0.8 21.6-18.4 39.2-40 39.2zM236.8 210.4c-9.6 0-17.6 8-17.6 17.6V568c0 9.6 8 17.6 17.6 17.6h567.2c9.6 0 17.6-8 17.6-17.6V228.8c0-9.6-8-17.6-17.6-17.6H236.8z" p-id="2169" fill="#ffffff"></path><path d="M803.2 614.4H236.8c-24.8 0-45.6-20.8-45.6-45.6V228.8c0-24.8 20.8-45.6 45.6-45.6h567.2c24.8 0 45.6 20.8 45.6 45.6v340c-0.8 24.8-20.8 45.6-46.4 45.6zM236.8 196c-17.6 0-32.8 14.4-32.8 32.8v340c0 17.6 14.4 32.8 32.8 32.8h567.2c17.6 0 32.8-14.4 32.8-32.8V228.8c0-17.6-14.4-32.8-32.8-32.8H236.8z m566.4 396.8H236.8c-13.6 0-24-11.2-24-24V228.8c0-13.6 11.2-24 24-24h567.2c13.6 0 24 11.2 24 24v340c0 13.6-11.2 24-24.8 24zM236.8 217.6c-6.4 0-11.2 4.8-11.2 11.2v340c0 6.4 4.8 11.2 11.2 11.2h567.2c6.4 0 11.2-4.8 11.2-11.2V228.8c0-6.4-4.8-11.2-11.2-11.2H236.8z m528.8 519.2c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2zM624.8 736.8c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z m-140 0c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z" p-id="2170" fill="#ffffff"></path><path d="M461.6 316l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8z m0 73.6h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m0 92h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m129.6-165.6l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8zM520 387.2v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m71.2 2.4h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m11.2 11.2l-9.6 9.6v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6z m-11.2 80.8h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6zM464 318.4v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6-9.6 9.6z m-73.6 160.8v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m129.6 0v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z" p-id="2171" fill="#ffffff"></path><path d="M592 502.4h-71.2L499.2 480v-71.2l10.4-10.4-10.4-10.4v-71.2l11.2-12 10.4-10.4H592l11.2 12-11.2 12h-69.6v68.8H592l11.2 11.2 10.4 10.4V480L592 502.4z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m92 0l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72.8 0.8h68.8v-68.8h-68.8v68.8z m0.8-73.6h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-60.8 188.8h-71.2L369.6 480v-71.2l10.4-10.4 11.2-11.2h69.6v-68.8h-69.6l-11.2-12 11.2-12h71.2l10.4 10.4 11.2 12v71.2L472.8 400l-10.4 10.4h-69.6v68.8h69.6l11.2 11.2-11.2 12z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m72-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2zM648 296.8c4.8 0 8 3.2 9.6 8v4c-1.6 4-4 6.4-8 7.2h-3.2c-4.8-0.8-8-4-8-9.6 0-4.8 3.2-8 9.6-9.6z m-0.8 3.2c-4 0.8-5.6 3.2-5.6 6.4s1.6 5.6 4.8 6.4l2.4 0.8c4-1.6 6.4-4 5.6-7.2v-0.8c-0.8-2.4-2.4-4.8-4.8-5.6h-2.4z m48 7.2c14.4 0.8 23.2 6.4 27.2 17.6l0.8 0.8-7.2 3.2c-3.2-8.8-8.8-12.8-16-13.6l-5.6-0.8c-15.2 0.8-23.2 11.2-23.2 30.4 0.8 13.6 6.4 21.6 16 25.6 2.4 0.8 5.6 1.6 10.4 1.6 8.8-0.8 16-7.2 20-17.6v-0.8l8 1.6v0.8c-6.4 15.2-16 23.2-28.8 23.2h-5.6c-14.4-2.4-22.4-9.6-25.6-20.8-1.6-4.8-2.4-9.6-2.4-14.4 0.8-15.2 6.4-26.4 16-32 4.8-3.2 9.6-4.8 15.2-4.8h0.8z" p-id="2172" fill="#ffffff"></path><path d="M690.4 381.6c-15.2-2.4-24.8-9.6-28-22.4-1.6-4.8-2.4-10.4-2.4-15.2 0.8-16 6.4-27.2 16.8-34.4 4.8-3.2 10.4-4.8 15.2-4.8h2.4c15.2 0.8 24.8 7.2 29.6 19.2l1.6 2.4-12 4.8-0.8-2.4c-3.2-8-7.2-12-14.4-12l-5.6-0.8c-13.6 0.8-20.8 9.6-20.8 28 0.8 12 5.6 20 15.2 23.2 1.6 0.8 4 1.6 9.6 0.8 8-0.8 13.6-6.4 18.4-16h2.4l9.6 1.6v3.2c-6.4 16-16.8 24-31.2 24.8h-5.6z m3.2-72c-4.8 0-9.6 1.6-13.6 4-9.6 5.6-14.4 16-15.2 30.4 0 4.8 0.8 9.6 1.6 13.6 3.2 10.4 11.2 16.8 24 19.2h5.6c12-0.8 20-7.2 26.4-20l-3.2-0.8c-4.8 10.4-12 16.8-21.6 17.6-5.6 0-8.8 0-11.2-1.6-10.4-4-16.8-13.6-17.6-27.2 0.8-20.8 8.8-32 25.6-32.8l6.4 0.8c8 0.8 13.6 4.8 16.8 12.8l3.2-1.6c-4-9.6-12-14.4-24-15.2l-3.2 0.8z m-46.4 8.8c-4.8-0.8-9.6-3.2-10.4-12 0-4.8 2.4-9.6 11.2-12 4 0 8.8 2.4 12 9.6v4.8c-0.8 4.8-4.8 8-9.6 8.8l-3.2 0.8z m0.8-16c-3.2 0.8-4 3.2-4 4 0 2.4 1.6 4 3.2 4.8h1.6c4-1.6 4-3.2 4-4.8-0.8-1.6-1.6-3.2-3.2-4H648z" p-id="2173" fill="#ffffff"></path></svg>'
          //微波
          case 15:
            return '<svg t="1622601490854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="64" height="64"><path d="M874.4 905.6H165.6c-21.6 0-39.2-17.6-39.2-39.2V157.6c0-21.6 17.6-39.2 39.2-39.2h708.8c21.6 0 39.2 17.6 39.2 39.2v708.8c0 21.6-17.6 39.2-39.2 39.2zM165.6 140c-9.6 0-17.6 8-17.6 17.6v708.8c0 9.6 8 17.6 17.6 17.6h708.8c9.6 0 17.6-8 17.6-17.6V157.6c0-9.6-8-17.6-17.6-17.6H165.6z" p-id="2167" fill="#ffffff"></path><path d="M874.4 912H165.6c-24.8 0-45.6-20.8-45.6-45.6V157.6c0-24.8 20.8-45.6 45.6-45.6h708.8c24.8 0 45.6 20.8 45.6 45.6v708.8c0 24.8-20.8 45.6-45.6 45.6zM165.6 124.8c-17.6 0-32.8 14.4-32.8 32.8v708.8c0 17.6 14.4 32.8 32.8 32.8h708.8c17.6 0 32.8-14.4 32.8-32.8V157.6c0-17.6-14.4-32.8-32.8-32.8H165.6z m708.8 765.6H165.6c-13.6 0-24-11.2-24-24V157.6c0-13.6 11.2-24 24-24h708.8c13.6 0 24 11.2 24 24v708.8c0 13.6-10.4 24-24 24z m-708.8-744c-6.4 0-11.2 4.8-11.2 11.2v708.8c0 6.4 4.8 11.2 11.2 11.2h708.8c6.4 0 11.2-4.8 11.2-11.2V157.6c0-6.4-4.8-11.2-11.2-11.2H165.6z" p-id="2168" fill="#ffffff"></path><path d="M803.2 608H236.8c-21.6 0-39.2-17.6-39.2-39.2V228.8c0-21.6 17.6-39.2 39.2-39.2h567.2c21.6 0 39.2 17.6 39.2 39.2v340c-0.8 21.6-18.4 39.2-40 39.2zM236.8 210.4c-9.6 0-17.6 8-17.6 17.6V568c0 9.6 8 17.6 17.6 17.6h567.2c9.6 0 17.6-8 17.6-17.6V228.8c0-9.6-8-17.6-17.6-17.6H236.8z" p-id="2169" fill="#ffffff"></path><path d="M803.2 614.4H236.8c-24.8 0-45.6-20.8-45.6-45.6V228.8c0-24.8 20.8-45.6 45.6-45.6h567.2c24.8 0 45.6 20.8 45.6 45.6v340c-0.8 24.8-20.8 45.6-46.4 45.6zM236.8 196c-17.6 0-32.8 14.4-32.8 32.8v340c0 17.6 14.4 32.8 32.8 32.8h567.2c17.6 0 32.8-14.4 32.8-32.8V228.8c0-17.6-14.4-32.8-32.8-32.8H236.8z m566.4 396.8H236.8c-13.6 0-24-11.2-24-24V228.8c0-13.6 11.2-24 24-24h567.2c13.6 0 24 11.2 24 24v340c0 13.6-11.2 24-24.8 24zM236.8 217.6c-6.4 0-11.2 4.8-11.2 11.2v340c0 6.4 4.8 11.2 11.2 11.2h567.2c6.4 0 11.2-4.8 11.2-11.2V228.8c0-6.4-4.8-11.2-11.2-11.2H236.8z m528.8 519.2c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2zM624.8 736.8c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z m-140 0c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z" p-id="2170" fill="#ffffff"></path><path d="M461.6 316l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8z m0 73.6h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m0 92h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m129.6-165.6l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8zM520 387.2v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m71.2 2.4h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m11.2 11.2l-9.6 9.6v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6z m-11.2 80.8h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6zM464 318.4v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6-9.6 9.6z m-73.6 160.8v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m129.6 0v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z" p-id="2171" fill="#ffffff"></path><path d="M592 502.4h-71.2L499.2 480v-71.2l10.4-10.4-10.4-10.4v-71.2l11.2-12 10.4-10.4H592l11.2 12-11.2 12h-69.6v68.8H592l11.2 11.2 10.4 10.4V480L592 502.4z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m92 0l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72.8 0.8h68.8v-68.8h-68.8v68.8z m0.8-73.6h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-60.8 188.8h-71.2L369.6 480v-71.2l10.4-10.4 11.2-11.2h69.6v-68.8h-69.6l-11.2-12 11.2-12h71.2l10.4 10.4 11.2 12v71.2L472.8 400l-10.4 10.4h-69.6v68.8h69.6l11.2 11.2-11.2 12z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m72-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2zM648 296.8c4.8 0 8 3.2 9.6 8v4c-1.6 4-4 6.4-8 7.2h-3.2c-4.8-0.8-8-4-8-9.6 0-4.8 3.2-8 9.6-9.6z m-0.8 3.2c-4 0.8-5.6 3.2-5.6 6.4s1.6 5.6 4.8 6.4l2.4 0.8c4-1.6 6.4-4 5.6-7.2v-0.8c-0.8-2.4-2.4-4.8-4.8-5.6h-2.4z m48 7.2c14.4 0.8 23.2 6.4 27.2 17.6l0.8 0.8-7.2 3.2c-3.2-8.8-8.8-12.8-16-13.6l-5.6-0.8c-15.2 0.8-23.2 11.2-23.2 30.4 0.8 13.6 6.4 21.6 16 25.6 2.4 0.8 5.6 1.6 10.4 1.6 8.8-0.8 16-7.2 20-17.6v-0.8l8 1.6v0.8c-6.4 15.2-16 23.2-28.8 23.2h-5.6c-14.4-2.4-22.4-9.6-25.6-20.8-1.6-4.8-2.4-9.6-2.4-14.4 0.8-15.2 6.4-26.4 16-32 4.8-3.2 9.6-4.8 15.2-4.8h0.8z" p-id="2172" fill="#ffffff"></path><path d="M690.4 381.6c-15.2-2.4-24.8-9.6-28-22.4-1.6-4.8-2.4-10.4-2.4-15.2 0.8-16 6.4-27.2 16.8-34.4 4.8-3.2 10.4-4.8 15.2-4.8h2.4c15.2 0.8 24.8 7.2 29.6 19.2l1.6 2.4-12 4.8-0.8-2.4c-3.2-8-7.2-12-14.4-12l-5.6-0.8c-13.6 0.8-20.8 9.6-20.8 28 0.8 12 5.6 20 15.2 23.2 1.6 0.8 4 1.6 9.6 0.8 8-0.8 13.6-6.4 18.4-16h2.4l9.6 1.6v3.2c-6.4 16-16.8 24-31.2 24.8h-5.6z m3.2-72c-4.8 0-9.6 1.6-13.6 4-9.6 5.6-14.4 16-15.2 30.4 0 4.8 0.8 9.6 1.6 13.6 3.2 10.4 11.2 16.8 24 19.2h5.6c12-0.8 20-7.2 26.4-20l-3.2-0.8c-4.8 10.4-12 16.8-21.6 17.6-5.6 0-8.8 0-11.2-1.6-10.4-4-16.8-13.6-17.6-27.2 0.8-20.8 8.8-32 25.6-32.8l6.4 0.8c8 0.8 13.6 4.8 16.8 12.8l3.2-1.6c-4-9.6-12-14.4-24-15.2l-3.2 0.8z m-46.4 8.8c-4.8-0.8-9.6-3.2-10.4-12 0-4.8 2.4-9.6 11.2-12 4 0 8.8 2.4 12 9.6v4.8c-0.8 4.8-4.8 8-9.6 8.8l-3.2 0.8z m0.8-16c-3.2 0.8-4 3.2-4 4 0 2.4 1.6 4 3.2 4.8h1.6c4-1.6 4-3.2 4-4.8-0.8-1.6-1.6-3.2-3.2-4H648z" p-id="2173" fill="#ffffff"></path></svg>'
          case 19:
          case 37:
          case 49:
            if(lastEventCode==48){
              return `<svg width="42" height="42" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" p-id="13927" version="1.1" class="icon" t="1676082759326"><image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEIyODQ3MjQwMDYwMTFFRUJCMkJBQzA5NzQyOUZDQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEIyODQ3MjUwMDYwMTFFRUJCMkJBQzA5NzQyOUZDQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjI4NDcyMjAwNjAxMUVFQkIyQkFDMDk3NDI5RkNCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjI4NDcyMzAwNjAxMUVFQkIyQkFDMDk3NDI5RkNCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgAlB8kAABB4SURBVHja7FsJlBTFGa6/e2ZnQW4U5BAUDBGiBjEcIgHjARrEW6MmapREwYuEZyLeL+pTn0k0kOhTY9RookHFI64RAQNEBZHLRFQOFQGX+1xYlp2d7j/fX/XPTM/sLiyGXZmX7bf/dndNdXXVV/9d1cTMpvGo/fAaIWgEqBGg+jxi/4+Dpt/NcWd3m8BFJ9AGXG8Pr+/fyEF6+DBP3XB+AOBMBP0E110LgoNovM4wk04zhiLWlqiaikBpESomcL1N7olNaPSRmg4p1ma+zUS3oOB7oNag9Wz4lSyXvVfQIhY3AowxPclQbwy6nJhX4H4NaHkdnv8mILgfYPbB9SLAdgi7NvvlP1+IALUD9QWdYphOxLkZBloOTtuI6+dBf8TgU5bznI8naiTMZVHqC44ZgAoP426au6aRuC8qZCXdWumnoB+CDlEQQgy4EldHgraCZoCWgVJpOCLAONDYHIa7xSjYiespuD4OP7XBT58XIkDSx46gi0AjQMe7UdPnGOpSXKxg4l2iSzD8IfjpTNAzAKJUAQlU6Vg4icjH+UtQC1B7lAqHDUFEsdjeFxhALZy+MNdhkOfjXAxQSnF+C2MF0Uco/4QMt7H6h/lnuL8C1+/hvMbqZCK2ptxxVKC0HtQddB+oA+hD0FBQ20IBSGa7Jej7GOIo3H0XlirA/M9E2UsOILNS/BZbOzQ7YYGmiZnGg6NxPg20CvSZtlcZaVu4DPrGzFFFL79tA2d1VS4qDIAgFT3AERcCHChQAxEKSwz5j8JaLcTPmzJG2/6JP2A+Av0Vz5yFp0XM1oLGq4JuohbqcNAvQT30PfNAotyPBYn+aVUYfpCojpA6QjoOFpMOAF5H0R0Y/Meqc5sBlTguoV9MGfQRqkAPickmmqLiIvQvUBVoEGiMcuYqtXY3KkDCqWvBPe1U3PZ/gDhpHcQqjnElBl+Bm9+APlYXT7xd8V/EC/4PGGgd6i5GvUoMUpzFlwHWgWDBwbgeCxKL1Rsk4vkUaK4qe9FRvlrGVah/MZ5fWSAiBtPNZhn4AhwhzqDoCq+VKtYLlSMEKBG1d41wl7GxFJ7jd9QanQQ6D1SOgV8OAOaqGA1UHVWlwD0JOgq0Ot9fEjmP7bc62uel4I7JuDoZBUeAJIo8zrj7psJhIhIAsTnO/xbOwYBEVAS0t0FThVNw/xrK31Tx+gHo19aHcscnoObWm2JeGykXcGj/5SAJI611Nh+h4y+SU7rDdNarVLcgJCCID38H1xeoc7hWW1iJ50ScuuNZ4bqrVNTOUD3zkrWQLn4TzlyoOmtbXiAf7J8AUSbSXAd6VbmHVW9IQDlRr6X8BtVJAtRCALIJ4FSIK4Droep1j1VOEfG7X817B3U6X7ExHdEO5aL0ERRCukP8nA9Ar6Pzn1mlzPw4zrOA4heqf/6p4xihPk6x6BIMuAzn6codYqH+BrrbxWrWP+qJNqp0NtqiXWnvG4WYUdyFzs/G+U2cm2HgnWyaw6428Brr+wA4VbgX2+AV4QS7YxboOQW6o9VdUNoKWEsHIHvQQCX2dxKL2cBWzBs/pz2L3mDenLYMGVtFdW5mkYgCnr1ExAqDFuW6wkbtxiwBvaEKdoharxmouw71VqmCvkjF8RL1wmPOB+LR6Jc4kaejHvwt80WeN88NwUG98Kax6MCQfOzA3JchjroWEtHcWdiwWmYiImrwg8xsDLqLmnovoivEOZxsHUhn2kVUfJ0MyRO9jOe2qAfdC+N+EZ7lLNChmLHbQaeivBS1O38NIkZgaxLzeiGcuSKX6ZN/DCeNu4ONLkM3BriueLV1SR7YoZbpAAxcZryzrulVudSFVbZfquIdqoGu2O8AJBxWos7l5eycz+lE3nKA09OGMsbs1CA2+s76Bwhv2QJRSqEj3cAzbSNvTIkziHMbMl7vOjQlSncKgJFQoScGPSQSGpRZD5l5JqiDJtS6q7USsf4UNE0dy5HglNNIAGM+H3QehOkGkDibc6ASRC00JAcxZpUlrdmEw7AZJ+HsBixvZgC2xpCHQfDhcJ6LxYG2VPuxWblhAQY8HHRy9jW804oi2WziEcpJRSJmeCYFWqCWTFIfJyg3icJ+Cb89hN7MzIv6GwYg6Jk1Jgw/gGppSalwI64jCXX+lI38FhxpgqBZJluz+2MJBvSo6pNBWtYHwFyK82BVwM108EEm+vX9tex5zzIRJkv8Iyv2xayd4Vqy/PXPQeyniH3MLLcFyxSRF7NJPGaZWYgLmzcxgEPV7NblWKeWqEJjrttBt4FuQTt9dLQSasxPcwRlM4rtiG1yDXFciP7wAVmTRV8TQDJ9nrcWb0qR5w1nisN2ktp4wgwTTDZBSfpnON29xwbFtEvkLqJRpTlqCSHaqFP4AOhetXqhcAZAaQ8a4YV8hwPHuhw7QEkyVCs4DQMQccgUfgA8YDG8c0Ca8CF3JloGzlpEHl1tUgwxq9NuE+GeF8AZMzVNKsn6P2vOR9KoCyyIwqokyppPB90KsAarpUJw602WFMke/bh6lzDPKt1VFNJbhsK+5KUG5FVZi0E8B6DagbnGmeJYXd3HlephS05IQg74NVa0NjhxkkCWoIy968FDd+H6GM0934PrH2mYkqzLikH9py4Y4YKhEqJwLKTqXCju99JcDe6RTk5m8iaSbyTh/jS4bBmsGdeh5VK08DzaO9aII0r0LhRbe/WqB0GsBuO9ot9KNZz4k+ai90IA6nkDFY2fl74shrQ9hjeezE4pJ7PumD0Ohtp+B0B9jsGMIuLlwIhry+jrkYDYdIGo3AQLdSLKF6GN5vAU2ls/iKyeeUcD1L9Xb2HPY2+QYJVcegeKmB5B38SRG02qkMFV6WrrrbfN4UmoLMr0UKLqi/EUMTtsrZRE9TQPNxJKDIduG2yXipx+uhl0bS44e9v3yCTRCx9X7430cV057AyMhwxGHC/yBuE//Agarqa2qbr8knB6Fy0+h6cmcihrdk4pc7sDDK3bmcAbwUXmdDRyPOottgBxDpanYuyvqlMnCncx+hjmzzkJQNZEyRxTV7Q5EOBeplG7BKh/0UzjbniQ9zVAjI7QA6Bz6gD+AjiFNxuJphUgk/ANrSrrgXbg9tNC+EGXAqBt0oe0qbXGjW3Ufo8qVQFpPuqUV1v6MJTZqoGB4AXcW0V37h61174HqOoE43uvqZe6F2aMb8Pw7zbtHUBixmn19vOdMja/QoUH0YdKHWYaIAkPoIdotHrDwk0zMJ6lyqWcHmM4pn+9qodcKxb3agDIikgPdGl63rMwsYiu2cyDDwMuMIilWGT/Ak2Op4+7JIYyMe9hEwdAzuwj8qYJAp7uynjGeb0c1TKPACRJoQq3jlKaBHpfE2TLasuN7Fv9GeWgx+bXwIkk4rXKBGHnNDuzc8gmkK5sAiC300Q3OeH/CTg9j4uDMoxUHDsKwekiqUMVNkSC7mLJD5+CeOxOcpnB7Wnbke4XSdrC8ztBXH+OmyHKO+/jv6Re54CDKhqOg8oqa5LWX2D2OxuPHDSeJwmpSZQTdEYPlPveDADV26RCWeyzMRbtSD4Bs93PDi8eS8dUEkcdBIcX57AJfKLHyITlJow5g2AZhMuAVhnaG2uzgsSX4yxJs8NRaYF61Q3EQRPm52ccfeIU3HiEAHKf8h7BBI5O2xvyg1wOkpsQsx946ZWJkygWTsumWP2BQHg22owqSVgdQpgQHoMWHwZAvzdhHLGSH7C0D5AoMhFQTwfibUfgQlZBS8Mx/YL6BMirfhslPiMDDkaFgY8zldAjQoFXgwoIjTXISd9Rlf8Wiuam1QpmY2QN+Z7ViNXAFfQP6JurgLb4LOfaZRrO+tsRiDaq87eyTsmRfQkQ8fYIbQUlB9oqlj28qejyNtMafRISo+oXZ3ZtOX5LwCMCMK0BQiu2CQyO+U85SZEXhP0oXqNe/RINXAXuuxoWrAim/yHUvcPlj62PFdc0rXV+GvLI0UGcEyd6ogaa2zlyO02XUSrMS9lSRBpt4A4xpNw6siMjW3QgB/IWStUSob/swArBaebHeE4WA19UbvlCA9GN1imlrwEgk0rk6aAw4RSA5RIYm1RuJKQOmyS/rEcQBtUVN5lURFKKALgvuaGasvLkZPZ9lqwhonMAfg1KhUQPiqf+iVs0tEvPK9LZ/4YTsaAiSynEeZza4lx5+2vrTC4nQunByzm0jl4uoaxTBILV5Mcqaww7c7HaioefwpT0hc4604Q8FaUBaCAeuQUzMg7Uq+E5iJvm/hqYJRETIlG4yZEpq3BzRYrTIUCmJo9wc4yygD41wmXxvXLFl1p3gOVzAR4gwah43upMc8PqoBYbc0Nw9kuooqU13bjviKIr0K0nshPNNYUWUcaEo8gXa+YMir3sNY6BO3e0qxbtc2YiqLbwqRSvm4TKssIaNNR3brFqa3zRXhsqxWBft2kExw0PAi1Zdllj72oNBYNMdBcZcQWbxLMipvBd/pc+B6YBj1w/aGMiSxuaGLMpYTiZHGso8/lDCxeDmcPqMH/PGrdW7qANK280W71Ks76pKaQj15N+aHZ1fUli7r2bEDbcE/mYZCfblYMQ8ZO/nNQGwczJMsrZsGnjcP5WRhI9eptj4WC42NXmhK85br8GKFfEEsW5SljOEkZUVt4Lw9yK3BZaOZqSjdK9O1FPoutNEo4CmKPF18l7x3T2eJhJJHSpp7C+kc0FqLw8YmklYPQ15SFBKt1oQtqM6/vynKXdJWQmo8ZpjueSDiBr+VIFA1Auv0uEnkOiEkOrFkm2uhGfs5ft97JpkQAmOtD28t9RUADlOYGaUexO8u0D292hNZmfzerhyjbaXXm/SVriOiO74Mk7K5OhjFJBAVT96E8ue9c/R6qYX0F4cQUUbzcTC7tQSL2Mx4dxPOgCP0k2I/0BtCXSTktycdZYQwWlgnYLkHDOLI2mNV/MJaA+MHxnA6UnDdmv89KKK6nBpOwlvA4+dXfUvT8v+fZb/L+ykBR1ng6CpQllu05RjMifmtmi58ZzM3TQCNwsNHVjA8RxLN9DDMPzW00mYqNHiYt62/eEiQIDKCabLGQzGE0wbuO1O3wzEiO79yu+YwqeP1Z3xisreSXGC9z7CgqgiiJJq3YzPo+OxFaPQ1ye+MqJBbu6x7KcfGb2rdwJ8nqlqYgXmg4SRzF+awYM2X0ep1FWL8vnAZJQ8+u4Wu15tj7HVa/HzBvwpaZmRS12p/uMq5AcxSa7WmMsl1qHTjzoqtRdpiII3IpGxIeUwcd3szFE3JtkUkMVynISeddSUWyJbd8P2pumwVnG7U4tDA4ipkGy9JCZZZ+eNjFf9vdlKeY5olrTErJD2dhFQr/as/IR7oeueajrkIYVFgfZL2c8TYaZubLxkWrazyQBrt3cxpnFRcda4h0HdhnIgljTc8yTUP8oLTm6sADyizqbVKXRHROLOKBaMz5WTOzHQuy2GsrHe5SwLdaqy+3exPBDCqrSaaKuhcZBHSJpjl32E/PaMnd2WUwB8qpcfi1ldu8iueXp9ZFKnQoLoFRyYyZJHwSzjayA7sknZGeT2H5fW7XHutBdS60+cgU7CgogTnljYGUww6kNnAqfAUh7EVBSHd0kXg/GHA53YShX2Z2phZNRbDz2PppvBKgRgt0f/xVgACZLquJ4QtZkAAAAAElFTkSuQmCC" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEIyODQ3MjQwMDYwMTFFRUJCMkJBQzA5NzQyOUZDQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEIyODQ3MjUwMDYwMTFFRUJCMkJBQzA5NzQyOUZDQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjI4NDcyMjAwNjAxMUVFQkIyQkFDMDk3NDI5RkNCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjI4NDcyMzAwNjAxMUVFQkIyQkFDMDk3NDI5RkNCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgAlB8kAABB4SURBVHja7FsJlBTFGa6/e2ZnQW4U5BAUDBGiBjEcIgHjARrEW6MmapREwYuEZyLeL+pTn0k0kOhTY9RookHFI64RAQNEBZHLRFQOFQGX+1xYlp2d7j/fX/XPTM/sLiyGXZmX7bf/dndNdXXVV/9d1cTMpvGo/fAaIWgEqBGg+jxi/4+Dpt/NcWd3m8BFJ9AGXG8Pr+/fyEF6+DBP3XB+AOBMBP0E110LgoNovM4wk04zhiLWlqiaikBpESomcL1N7olNaPSRmg4p1ma+zUS3oOB7oNag9Wz4lSyXvVfQIhY3AowxPclQbwy6nJhX4H4NaHkdnv8mILgfYPbB9SLAdgi7NvvlP1+IALUD9QWdYphOxLkZBloOTtuI6+dBf8TgU5bznI8naiTMZVHqC44ZgAoP426au6aRuC8qZCXdWumnoB+CDlEQQgy4EldHgraCZoCWgVJpOCLAONDYHIa7xSjYiespuD4OP7XBT58XIkDSx46gi0AjQMe7UdPnGOpSXKxg4l2iSzD8IfjpTNAzAKJUAQlU6Vg4icjH+UtQC1B7lAqHDUFEsdjeFxhALZy+MNdhkOfjXAxQSnF+C2MF0Uco/4QMt7H6h/lnuL8C1+/hvMbqZCK2ptxxVKC0HtQddB+oA+hD0FBQ20IBSGa7Jej7GOIo3H0XlirA/M9E2UsOILNS/BZbOzQ7YYGmiZnGg6NxPg20CvSZtlcZaVu4DPrGzFFFL79tA2d1VS4qDIAgFT3AERcCHChQAxEKSwz5j8JaLcTPmzJG2/6JP2A+Av0Vz5yFp0XM1oLGq4JuohbqcNAvQT30PfNAotyPBYn+aVUYfpCojpA6QjoOFpMOAF5H0R0Y/Meqc5sBlTguoV9MGfQRqkAPickmmqLiIvQvUBVoEGiMcuYqtXY3KkDCqWvBPe1U3PZ/gDhpHcQqjnElBl+Bm9+APlYXT7xd8V/EC/4PGGgd6i5GvUoMUpzFlwHWgWDBwbgeCxKL1Rsk4vkUaK4qe9FRvlrGVah/MZ5fWSAiBtPNZhn4AhwhzqDoCq+VKtYLlSMEKBG1d41wl7GxFJ7jd9QanQQ6D1SOgV8OAOaqGA1UHVWlwD0JOgq0Ot9fEjmP7bc62uel4I7JuDoZBUeAJIo8zrj7psJhIhIAsTnO/xbOwYBEVAS0t0FThVNw/xrK31Tx+gHo19aHcscnoObWm2JeGykXcGj/5SAJI611Nh+h4y+SU7rDdNarVLcgJCCID38H1xeoc7hWW1iJ50ScuuNZ4bqrVNTOUD3zkrWQLn4TzlyoOmtbXiAf7J8AUSbSXAd6VbmHVW9IQDlRr6X8BtVJAtRCALIJ4FSIK4Droep1j1VOEfG7X817B3U6X7ExHdEO5aL0ERRCukP8nA9Ar6Pzn1mlzPw4zrOA4heqf/6p4xihPk6x6BIMuAzn6codYqH+BrrbxWrWP+qJNqp0NtqiXWnvG4WYUdyFzs/G+U2cm2HgnWyaw6428Brr+wA4VbgX2+AV4QS7YxboOQW6o9VdUNoKWEsHIHvQQCX2dxKL2cBWzBs/pz2L3mDenLYMGVtFdW5mkYgCnr1ExAqDFuW6wkbtxiwBvaEKdoharxmouw71VqmCvkjF8RL1wmPOB+LR6Jc4kaejHvwt80WeN88NwUG98Kax6MCQfOzA3JchjroWEtHcWdiwWmYiImrwg8xsDLqLmnovoivEOZxsHUhn2kVUfJ0MyRO9jOe2qAfdC+N+EZ7lLNChmLHbQaeivBS1O38NIkZgaxLzeiGcuSKX6ZN/DCeNu4ONLkM3BriueLV1SR7YoZbpAAxcZryzrulVudSFVbZfquIdqoGu2O8AJBxWos7l5eycz+lE3nKA09OGMsbs1CA2+s76Bwhv2QJRSqEj3cAzbSNvTIkziHMbMl7vOjQlSncKgJFQoScGPSQSGpRZD5l5JqiDJtS6q7USsf4UNE0dy5HglNNIAGM+H3QehOkGkDibc6ASRC00JAcxZpUlrdmEw7AZJ+HsBixvZgC2xpCHQfDhcJ6LxYG2VPuxWblhAQY8HHRy9jW804oi2WziEcpJRSJmeCYFWqCWTFIfJyg3icJ+Cb89hN7MzIv6GwYg6Jk1Jgw/gGppSalwI64jCXX+lI38FhxpgqBZJluz+2MJBvSo6pNBWtYHwFyK82BVwM108EEm+vX9tex5zzIRJkv8Iyv2xayd4Vqy/PXPQeyniH3MLLcFyxSRF7NJPGaZWYgLmzcxgEPV7NblWKeWqEJjrttBt4FuQTt9dLQSasxPcwRlM4rtiG1yDXFciP7wAVmTRV8TQDJ9nrcWb0qR5w1nisN2ktp4wgwTTDZBSfpnON29xwbFtEvkLqJRpTlqCSHaqFP4AOhetXqhcAZAaQ8a4YV8hwPHuhw7QEkyVCs4DQMQccgUfgA8YDG8c0Ca8CF3JloGzlpEHl1tUgwxq9NuE+GeF8AZMzVNKsn6P2vOR9KoCyyIwqokyppPB90KsAarpUJw602WFMke/bh6lzDPKt1VFNJbhsK+5KUG5FVZi0E8B6DagbnGmeJYXd3HlephS05IQg74NVa0NjhxkkCWoIy968FDd+H6GM0934PrH2mYkqzLikH9py4Y4YKhEqJwLKTqXCju99JcDe6RTk5m8iaSbyTh/jS4bBmsGdeh5VK08DzaO9aII0r0LhRbe/WqB0GsBuO9ot9KNZz4k+ai90IA6nkDFY2fl74shrQ9hjeezE4pJ7PumD0Ohtp+B0B9jsGMIuLlwIhry+jrkYDYdIGo3AQLdSLKF6GN5vAU2ls/iKyeeUcD1L9Xb2HPY2+QYJVcegeKmB5B38SRG02qkMFV6WrrrbfN4UmoLMr0UKLqi/EUMTtsrZRE9TQPNxJKDIduG2yXipx+uhl0bS44e9v3yCTRCx9X7430cV057AyMhwxGHC/yBuE//Agarqa2qbr8knB6Fy0+h6cmcihrdk4pc7sDDK3bmcAbwUXmdDRyPOottgBxDpanYuyvqlMnCncx+hjmzzkJQNZEyRxTV7Q5EOBeplG7BKh/0UzjbniQ9zVAjI7QA6Bz6gD+AjiFNxuJphUgk/ANrSrrgXbg9tNC+EGXAqBt0oe0qbXGjW3Ufo8qVQFpPuqUV1v6MJTZqoGB4AXcW0V37h61174HqOoE43uvqZe6F2aMb8Pw7zbtHUBixmn19vOdMja/QoUH0YdKHWYaIAkPoIdotHrDwk0zMJ6lyqWcHmM4pn+9qodcKxb3agDIikgPdGl63rMwsYiu2cyDDwMuMIilWGT/Ak2Op4+7JIYyMe9hEwdAzuwj8qYJAp7uynjGeb0c1TKPACRJoQq3jlKaBHpfE2TLasuN7Fv9GeWgx+bXwIkk4rXKBGHnNDuzc8gmkK5sAiC300Q3OeH/CTg9j4uDMoxUHDsKwekiqUMVNkSC7mLJD5+CeOxOcpnB7Wnbke4XSdrC8ztBXH+OmyHKO+/jv6Re54CDKhqOg8oqa5LWX2D2OxuPHDSeJwmpSZQTdEYPlPveDADV26RCWeyzMRbtSD4Bs93PDi8eS8dUEkcdBIcX57AJfKLHyITlJow5g2AZhMuAVhnaG2uzgsSX4yxJs8NRaYF61Q3EQRPm52ccfeIU3HiEAHKf8h7BBI5O2xvyg1wOkpsQsx946ZWJkygWTsumWP2BQHg22owqSVgdQpgQHoMWHwZAvzdhHLGSH7C0D5AoMhFQTwfibUfgQlZBS8Mx/YL6BMirfhslPiMDDkaFgY8zldAjQoFXgwoIjTXISd9Rlf8Wiuam1QpmY2QN+Z7ViNXAFfQP6JurgLb4LOfaZRrO+tsRiDaq87eyTsmRfQkQ8fYIbQUlB9oqlj28qejyNtMafRISo+oXZ3ZtOX5LwCMCMK0BQiu2CQyO+U85SZEXhP0oXqNe/RINXAXuuxoWrAim/yHUvcPlj62PFdc0rXV+GvLI0UGcEyd6ogaa2zlyO02XUSrMS9lSRBpt4A4xpNw6siMjW3QgB/IWStUSob/swArBaebHeE4WA19UbvlCA9GN1imlrwEgk0rk6aAw4RSA5RIYm1RuJKQOmyS/rEcQBtUVN5lURFKKALgvuaGasvLkZPZ9lqwhonMAfg1KhUQPiqf+iVs0tEvPK9LZ/4YTsaAiSynEeZza4lx5+2vrTC4nQunByzm0jl4uoaxTBILV5Mcqaww7c7HaioefwpT0hc4604Q8FaUBaCAeuQUzMg7Uq+E5iJvm/hqYJRETIlG4yZEpq3BzRYrTIUCmJo9wc4yygD41wmXxvXLFl1p3gOVzAR4gwah43upMc8PqoBYbc0Nw9kuooqU13bjviKIr0K0nshPNNYUWUcaEo8gXa+YMir3sNY6BO3e0qxbtc2YiqLbwqRSvm4TKssIaNNR3brFqa3zRXhsqxWBft2kExw0PAi1Zdllj72oNBYNMdBcZcQWbxLMipvBd/pc+B6YBj1w/aGMiSxuaGLMpYTiZHGso8/lDCxeDmcPqMH/PGrdW7qANK280W71Ks76pKaQj15N+aHZ1fUli7r2bEDbcE/mYZCfblYMQ8ZO/nNQGwczJMsrZsGnjcP5WRhI9eptj4WC42NXmhK85br8GKFfEEsW5SljOEkZUVt4Lw9yK3BZaOZqSjdK9O1FPoutNEo4CmKPF18l7x3T2eJhJJHSpp7C+kc0FqLw8YmklYPQ15SFBKt1oQtqM6/vynKXdJWQmo8ZpjueSDiBr+VIFA1Auv0uEnkOiEkOrFkm2uhGfs5ft97JpkQAmOtD28t9RUADlOYGaUexO8u0D292hNZmfzerhyjbaXXm/SVriOiO74Mk7K5OhjFJBAVT96E8ue9c/R6qYX0F4cQUUbzcTC7tQSL2Mx4dxPOgCP0k2I/0BtCXSTktycdZYQwWlgnYLkHDOLI2mNV/MJaA+MHxnA6UnDdmv89KKK6nBpOwlvA4+dXfUvT8v+fZb/L+ykBR1ng6CpQllu05RjMifmtmi58ZzM3TQCNwsNHVjA8RxLN9DDMPzW00mYqNHiYt62/eEiQIDKCabLGQzGE0wbuO1O3wzEiO79yu+YwqeP1Z3xisreSXGC9z7CgqgiiJJq3YzPo+OxFaPQ1ye+MqJBbu6x7KcfGb2rdwJ8nqlqYgXmg4SRzF+awYM2X0ep1FWL8vnAZJQ8+u4Wu15tj7HVa/HzBvwpaZmRS12p/uMq5AcxSa7WmMsl1qHTjzoqtRdpiII3IpGxIeUwcd3szFE3JtkUkMVynISeddSUWyJbd8P2pumwVnG7U4tDA4ipkGy9JCZZZ+eNjFf9vdlKeY5olrTErJD2dhFQr/as/IR7oeueajrkIYVFgfZL2c8TYaZubLxkWrazyQBrt3cxpnFRcda4h0HdhnIgljTc8yTUP8oLTm6sADyizqbVKXRHROLOKBaMz5WTOzHQuy2GsrHe5SwLdaqy+3exPBDCqrSaaKuhcZBHSJpjl32E/PaMnd2WUwB8qpcfi1ldu8iueXp9ZFKnQoLoFRyYyZJHwSzjayA7sknZGeT2H5fW7XHutBdS60+cgU7CgogTnljYGUww6kNnAqfAUh7EVBSHd0kXg/GHA53YShX2Z2phZNRbDz2PppvBKgRgt0f/xVgACZLquJ4QtZkAAAAAElFTkSuQmCC" id="svg_3" height="64" width="64" y="0" x="0" style="filter: grayscale(200%) brightness(300%);fill: #fff;"></image></svg>`
            }
            else{
              return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" p-id="13927" version="1.1" class="icon" t="1676082759326"><image x="0" y="0" width="64" height="64" id="svg_1" style="filter: grayscale(200%) brightness(300%);fill: #fff;width: 100%;height: 100%;" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODAwMTlDRDIwMDYwMTFFRUE0QjRFQzg5N0UyMEM3MzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODAwMTlDRDMwMDYwMTFFRUE0QjRFQzg5N0UyMEM3MzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MDAxOUNEMDAwNjAxMUVFQTRCNEVDODk3RTIwQzczNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MDAxOUNEMTAwNjAxMUVFQTRCNEVDODk3RTIwQzczNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq1ouG4AAAfASURBVHja7JsHcBR1GMXvIgpCQgkMEQTpdXSMNFERVARFBceCooiIolJsII5YgLEzWMaxouCAMqgoTSw00QEBpQnSpUiAQCCUSBBSj/N9k985682FO0TucmH/M29I9nb3dt++731lg9fv93vcVfzyugS5BLkElWqC+vTpE2sOygrnCvvGjRt3OPjDhNNYHGcI9YU3hElCXz2sOsE7lYnzm7QHfBYqOMTvxyI89kLhGeFKoYqQKUwvLQSdCTHNhFThiLBdyBC2RXB8E2GU0EJYK9TmnG2Cj49HgqoLrYVOwlVCIgTtF74QxgiFQSoLVpUd31Z4T/ien++D9Lj1oCp4xiDhfeFR4QLBfKOBcIXQWWgU9OC9Ic5VT9goHJUxz2GfZOGPeAwxu8aawh1CV+EyttvNbCK0cvGSDsKNwgRhF/v5HET5Med0oaKQImNO4DgjLCXeCKqIXzwsdBfKcePzwDphA0/f/Ocx4V7hF373g7KEnQ9korqRQg1hDeqrGi8E2dOuJFwn9BMu58bmC1MhZ4cQqFuO4iUWbv2FLsJOYSuf5znO3QG/WYLn5JEB66CiuPAgI6ix0AMDtRCaJrwoTEQ5h4P2X8dnGYRZN8f9ne0g5kPhJuESobk8yMy9JSFbOZ5CzHznHNLvt8IIYT2fJbLdVJVNGOWSsucQLoYFQoHQDlP3oizLdk8Ky+VBptQ9ZMca8URQAfLPEV6DHC+h0IKMtlrYS2gEQsWUVk1oLwwmY6USnuOFZZh9BoZdBdLuJGzjIsSsbtmMIo7iFZUhZqDwBDf/Op5T2XEvC4UZKOxWoam1fBw3CVV24QGkKsTSKBd2h6rCS7KCLIXPEq7mJi/GN+z38tyghUSS8BvKsVA5IPwkzEUpXwuzUd/twqtUzrY2KMSSCNE9ju3WRHvjIc2b8U7GdK+BlAK8ZRvh00q4DcXt4bgdhFMD8CD7doPUqWTIQ6hvJZ51yBldUpevpBNk/vIV6vHjG9MJlQy2DyH0WnGjB/Ctedx0T8IxifAbRcjWoOicTk/3l4Ngj5ETD62GpfJVZLGtmPJYYbFg3rFI+IH76EoqL4eXWHb7EdIsQ31OmTCGczVDjX4KxDTalLjrxSx9/4yPJDLcSnAoaiLEpZKJEslOfoj8DKJr4l1HIKwSBNq5vuHznKgTJLOzfif5JE+zllBoQVgFzNTah9+FmYSWKagjad5D+p6NCu24XmQ3s5blZEBT3g1sTws26WgoqLl5gL6wQxBxCUJv/fgQ/hAu1NajpPOosBMczegcMl4iqb0RKvLQzFqGy6I6b47xm7rqCsOFa+nxasUixMqTXnuIkLOCRp6WYXrTThxv+TFRy0wVeOK1HAXlRhSWjvF2ptENEDiTMKpPTZRDeG3Di3KptzIdJu2PFkFZhEL9oG65kNScjH+EW9koZSc31cHRGmRTIc9nW2vIDzyQLTSzB+jHukBYdxQ3hFZmSSwKxXQ8JIUQ+OcJSVEZ3ERDsk9umHMdRA02T76ebRMcHf1hiG+KkkxZ+Wz7lUw2lOGaedBmXcfUcEPvU70yMMlKjEWdawufne8kL8wyU/4AP2nHNjPvu+m/yjjGsD7HcVbjfMrD6kzYlwv3ZdEgqJAnWzXEzDeQZepCYKTF4zx8JAWTHeYpekPRgn2s1VgRNAfykt6TaXir4mcxJ8jL0yt0hIWzWt1AaHU7AcLzaBfMoO/n2GSKQnvP9QpZL9B8ppDOR0DOQUw/P+YEiYRjhJFljJtD7BLo2gecQJiZer7ElE0JfwofM/MZid/kcX8NyHrPEoKZNLezghQWMwUFQsnCorWMOTil76HarY6BeiM85w7qotW0HIsJrX2cox5m/IjwgnARs+eXhbs4JqyCotWs5pJWrWm8haF6YOXzNK0BtYH7J6gqkj8a2MV0sCVpfxHhVBsDb4+/7eL7PwqVymOuIIqujVxkz6CC0UOIDCdVv8PTj0RJWcx78pgTvUWIPU8bUQdVPSU8cKLkRLVZFUmmotEUcv1D7JJJC9ERM60bhiQvxKRR02SRBEw1TfCnp2llZvzX6452N7+CEBouFTUNMWZdgaHaS8LnqJjDXWMB45BRlAxrmGE/7il6A7v9pFJwtP8+SMQ0puxfSXF3KMRuvTDTNYTMCgq/460KtCz5tB2RKrtEKcguaBNPtzOhVjbEbtY+vMTs501P0cC9DePR4sLuCCa97P+83liNXKdjqMNoPyaEqElGozKrnfqBKcJSUvtmT+R/CxQ/IeYcpOEbncg6Ez3/flsaWBVR0iBSuReSxpKVck5S0SUrxBwXtpfUvop/+xbTG2XTjgym2l7K0KwhU8DSqSCHkmrSJlila3/Q9Da9kq+YQ6oxzthBAegrlQpyrN1M+b7zFL2/mkG1nVSMIZtnLYQg36m+uJLyViMdcgYwEnmXYtHmx+WjEUolLYsV16FPgywbi97jKXoZOBm1pNGI7qc4PO0IClTTS5kaLqb+GUivVoBZ2/YFVMj+CJvauA8x5/JDyHhP0fDd3svPxW8uZXI4lPA77RQUam2iDLBaqC3NaJ6DzNOeIOfsZwpVuC9aX+r+bx+XIJcglyCXIJcglyCXIJcgd7kEuQS5BLkEuQS5BLkEuQS5yyXIJcglyCXIJcglqFSsvwUYALtgi/vSEEgkAAAAAElFTkSuQmCC" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODAwMTlDRDIwMDYwMTFFRUE0QjRFQzg5N0UyMEM3MzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODAwMTlDRDMwMDYwMTFFRUE0QjRFQzg5N0UyMEM3MzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MDAxOUNEMDAwNjAxMUVFQTRCNEVDODk3RTIwQzczNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MDAxOUNEMTAwNjAxMUVFQTRCNEVDODk3RTIwQzczNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq1ouG4AAAfASURBVHja7JsHcBR1GMXvIgpCQgkMEQTpdXSMNFERVARFBceCooiIolJsII5YgLEzWMaxouCAMqgoTSw00QEBpQnSpUiAQCCUSBBSj/N9k985682FO0TucmH/M29I9nb3dt++731lg9fv93vcVfzyugS5BLkElWqC+vTpE2sOygrnCvvGjRt3OPjDhNNYHGcI9YU3hElCXz2sOsE7lYnzm7QHfBYqOMTvxyI89kLhGeFKoYqQKUwvLQSdCTHNhFThiLBdyBC2RXB8E2GU0EJYK9TmnG2Cj49HgqoLrYVOwlVCIgTtF74QxgiFQSoLVpUd31Z4T/ien++D9Lj1oCp4xiDhfeFR4QLBfKOBcIXQWWgU9OC9Ic5VT9goHJUxz2GfZOGPeAwxu8aawh1CV+EyttvNbCK0cvGSDsKNwgRhF/v5HET5Med0oaKQImNO4DgjLCXeCKqIXzwsdBfKcePzwDphA0/f/Ocx4V7hF373g7KEnQ9korqRQg1hDeqrGi8E2dOuJFwn9BMu58bmC1MhZ4cQqFuO4iUWbv2FLsJOYSuf5znO3QG/WYLn5JEB66CiuPAgI6ix0AMDtRCaJrwoTEQ5h4P2X8dnGYRZN8f9ne0g5kPhJuESobk8yMy9JSFbOZ5CzHznHNLvt8IIYT2fJbLdVJVNGOWSsucQLoYFQoHQDlP3oizLdk8Ky+VBptQ9ZMca8URQAfLPEV6DHC+h0IKMtlrYS2gEQsWUVk1oLwwmY6USnuOFZZh9BoZdBdLuJGzjIsSsbtmMIo7iFZUhZqDwBDf/Op5T2XEvC4UZKOxWoam1fBw3CVV24QGkKsTSKBd2h6rCS7KCLIXPEq7mJi/GN+z38tyghUSS8BvKsVA5IPwkzEUpXwuzUd/twqtUzrY2KMSSCNE9ju3WRHvjIc2b8U7GdK+BlAK8ZRvh00q4DcXt4bgdhFMD8CD7doPUqWTIQ6hvJZ51yBldUpevpBNk/vIV6vHjG9MJlQy2DyH0WnGjB/Ctedx0T8IxifAbRcjWoOicTk/3l4Ngj5ETD62GpfJVZLGtmPJYYbFg3rFI+IH76EoqL4eXWHb7EdIsQ31OmTCGczVDjX4KxDTalLjrxSx9/4yPJDLcSnAoaiLEpZKJEslOfoj8DKJr4l1HIKwSBNq5vuHznKgTJLOzfif5JE+zllBoQVgFzNTah9+FmYSWKagjad5D+p6NCu24XmQ3s5blZEBT3g1sTws26WgoqLl5gL6wQxBxCUJv/fgQ/hAu1NajpPOosBMczegcMl4iqb0RKvLQzFqGy6I6b47xm7rqCsOFa+nxasUixMqTXnuIkLOCRp6WYXrTThxv+TFRy0wVeOK1HAXlRhSWjvF2ptENEDiTMKpPTZRDeG3Di3KptzIdJu2PFkFZhEL9oG65kNScjH+EW9koZSc31cHRGmRTIc9nW2vIDzyQLTSzB+jHukBYdxQ3hFZmSSwKxXQ8JIUQ+OcJSVEZ3ERDsk9umHMdRA02T76ebRMcHf1hiG+KkkxZ+Wz7lUw2lOGaedBmXcfUcEPvU70yMMlKjEWdawufne8kL8wyU/4AP2nHNjPvu+m/yjjGsD7HcVbjfMrD6kzYlwv3ZdEgqJAnWzXEzDeQZepCYKTF4zx8JAWTHeYpekPRgn2s1VgRNAfykt6TaXir4mcxJ8jL0yt0hIWzWt1AaHU7AcLzaBfMoO/n2GSKQnvP9QpZL9B8ppDOR0DOQUw/P+YEiYRjhJFljJtD7BLo2gecQJiZer7ElE0JfwofM/MZid/kcX8NyHrPEoKZNLezghQWMwUFQsnCorWMOTil76HarY6BeiM85w7qotW0HIsJrX2cox5m/IjwgnARs+eXhbs4JqyCotWs5pJWrWm8haF6YOXzNK0BtYH7J6gqkj8a2MV0sCVpfxHhVBsDb4+/7eL7PwqVymOuIIqujVxkz6CC0UOIDCdVv8PTj0RJWcx78pgTvUWIPU8bUQdVPSU8cKLkRLVZFUmmotEUcv1D7JJJC9ERM60bhiQvxKRR02SRBEw1TfCnp2llZvzX6452N7+CEBouFTUNMWZdgaHaS8LnqJjDXWMB45BRlAxrmGE/7il6A7v9pFJwtP8+SMQ0puxfSXF3KMRuvTDTNYTMCgq/460KtCz5tB2RKrtEKcguaBNPtzOhVjbEbtY+vMTs501P0cC9DePR4sLuCCa97P+83liNXKdjqMNoPyaEqElGozKrnfqBKcJSUvtmT+R/CxQ/IeYcpOEbncg6Ez3/flsaWBVR0iBSuReSxpKVck5S0SUrxBwXtpfUvop/+xbTG2XTjgym2l7K0KwhU8DSqSCHkmrSJlila3/Q9Da9kq+YQ6oxzthBAegrlQpyrN1M+b7zFL2/mkG1nVSMIZtnLYQg36m+uJLyViMdcgYwEnmXYtHmx+WjEUolLYsV16FPgywbi97jKXoZOBm1pNGI7qc4PO0IClTTS5kaLqb+GUivVoBZ2/YFVMj+CJvauA8x5/JDyHhP0fDd3svPxW8uZXI4lPA77RQUam2iDLBaqC3NaJ6DzNOeIOfsZwpVuC9aX+r+bx+XIJcglyCXIJcglyCXIJcgd7kEuQS5BLkEuQS5BLkEuQS5yyXIJcglyCXIJcglqFSsvwUYALtgi/vSEEgkAAAAAElFTkSuQmCC"/></svg>`
            }
          case 20:
          case 25:
            return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">  <image id="image0" width="64" height="64" x="0" y="0"    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnAQ0ALAevyo76AAACOnpUWHRSYXcgcHJvZmlsZSB0eXBlIHhtcAAAOI2VVVuS4zAI/OcUewQZEEjHsSPrb6vmc46/jTTO08nW2BXbQohuGqTQ998v+hOXFyW5SPfiyRYT2yy7cjK2bG7VdmnMe9+2rTPDXk3Dkl2yNknaPKnAt1glLb46FmbxVfeshjcCimARs3TZOcnFi6xeDAutBZgtnGJsF9tdYo4CAWzUevCQdU5c3QeTWxjYtlih1xWcctGWE3GQ6z5MknkX4wY+i6iExaXCtghMsFSMLrCyJNgKd7zjuYgQt+G2wi3hyQIGTzf/pMdgAc/MqmpPqTGNyUivuOJGMKTTfVy8O7x4H4x9INfBKpgwngHbJgAYuTjqE4p4QVpAiPlHFqCAUqEQbHUoVaEQPI55WwiCdYewwWoKe1+LEPiV7wDbbyXCtxA+G1Ip4JOCPKRNR62eQ2pD97wJS49xz8MiYDsJLq45WndoTP8nfR48mtuhF3x6hCOXoRFjQZ7xQ+qJHeE1BM4IolG7HADdLi9NmcAIDuEk4ytFg6pcm66ij0oe+y6WoSeE6w1oqLYqZikyRSqRQtaqo3rTCWnVsU1XZGGaNZ4YAqLihw0BoAVWVbAj4IoUGG24L9FqCCcYvyJHKuI5dmJ03j0wDWQ9RZYz5HfANJGPw+IBPY8+NqBjgO+oXror+hrKHdLQL7RJnxjSW23ukT9oc0hDJ8jLb7T5Ae401eH+eZ8/e80z6WrFCUqPJ/GcOvk7yNGQIx2eJzn9A+3ubei5um0tAAADGElEQVRo3u2Zv07bUBTGf5dUCLUDdUECpE6uEAhG1CoPkJaFCTXiDdKOSAw8ASpiaQcmHgHIiJAgQ7tVKswoLcnSDkwJ/4oYEF+HWJAY+zo4DhSUcxbfv993z/187Gsbcb/WFdGepYha8J+8j0Cwjn+rS7Vql3pnw7AT+CppQSZ2AIwWJH2z9TFWDfzlKS+otrDFDhXOeBbewU5AgGlRZRFzhIkwzRYn0SJpwgFO2CIdSjDAp3XRsvj8dqHp5kVYlLSk/lYXf+X9WpJUbF6ElxhSXLa4+/WW4gIFbXgwgXrh+EXUWG6+NUSMUZmw7dYh0CHQIRCdB5Kyh5IHhslz5DFO1gGOyDPcCNi4BSN853mbl3xImmJduYFmXtKmhpJe/JUPaVNSPvxxfCS1Eb5GQToJfxy3Q/1+82GE3AUGcrgGA1lcAzmDaY5btjbuekzEyIYASfKuXEk7ACopJ1eSe6N3sK9qFUDzKgXiXGOg4HeUK3M1HyPEa2TkAFlWAOTYZ7ERWGG+tu5bWQHIKIPLGgAOufgEdlm8Lb6pskaWDLumDNpmG0clSxQsGnDlqqLK7TQAyqiiirLeBkyoJFdOHA1gyqzgeIVtlWqTRsagQJWqWfPiUaZsyib0eBeSBwzKmZqIchRMWTlvf8uR8IAmwOz6I+3HsBJoozWXiO7OHh2BKdY5QBywzlRTI0Juwzg+oIL2NKsxORrTrPZU0MCNXj6M5Aj0qqhlddfVdGtZRfXaCSR3F6xyGJB0V+hlxhdy/3E2kQi80R/1BNT36Lde2zAaRXgMDMVa/wc+cx5Qf84XPtaVB4HTcBHmJW1oMEYE9jUe0jJe92XkpTbs74Sjqib+bchvVY2GE0Ajyuu4beDHymukEfHujmYl4NXN6gdwNhSylG/XGmCP7mHUIdAh8PAIPAmsFYYu72u5P3kYSym8NQXBOSE4Ar+ARfoSW2Yfn7xZgxYb4Pf+xwSltaXTxMBPtaV0MNJ/+9esZmdwdTiNZ443S0wCP4A5UrHhU8wBOxERsvhkIv+OJ20YUS+bMyq1BL+vGTvCP15267uGdkSwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTAxLTEzVDAwOjQ0OjA3KzAwOjAwMP3ZLQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wMS0xM1QwMDo0NDowNyswMDowMEGgYZEAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDEtMTNUMDA6NDQ6MDcrMDA6MDAWtUBOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==" /></svg>'  
          case 31:
            return '<svg t="1635904907700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7520" width="64" height="64"><path d="M512.5 176c42.25 0 76.5 34.25 76.5 76.5l0.002 251.82c22.876 18.34 38.89 44.884 43.58 75.171L850.394 705.25c36.59 21.125 49.126 67.912 28 104.501-21.124 36.59-67.91 49.126-104.5 28L554.402 711.03C541.778 715.542 528.176 718 514 718c-14.865 0-29.099-2.703-42.237-7.644L251.105 837.75c-36.59 21.125-83.376 8.588-104.5-28.001-21.126-36.59-8.59-83.376 28-104.5l221.126-127.67c4.827-28.158 19.464-52.964 40.269-70.775V252.5c0-42.25 34.25-76.5 76.5-76.5zM389.894 627.139l-195.29 112.75c-17.282 9.979-23.317 31.958-13.656 49.336l0.297 0.525c10.08 17.458 32.403 23.44 49.86 13.36l195.29-112.75-36.5-63.221z m245.213 0.001l-11.791 20.43a119.87 119.87 0 0 1-11.631 20.143l-13.078 22.647 195.288 112.75c17.283 9.978 39.335 4.216 49.554-12.84l0.306-0.52c10.079-17.458 4.098-39.781-13.36-49.86L635.107 627.14zM514 518c-44.183 0-80 35.817-80 80s35.817 80 80 80c26.24 0 49.531-12.634 64.12-32.151l9.445-16.36C591.707 619.825 594 609.18 594 598c0-44.183-35.817-80-80-80z m-1.5-302c-20.158 0-36.5 16.342-36.5 36.5V478h73V252.5c0-19.957-16.016-36.173-35.896-36.495z" p-id="7521" fill="#ffffff"></path></svg>'
          case 33:
          case 52:
           return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" p-id="13927" version="1.1" class="icon" t="1676082759326"><image x="0" y="0" width="64" height="64" id="svg_1" style="width:100%"  xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3MTk0ODc5My1jNmMwLTJkNDItOTIyMi04OGFmZDA5YWRhNjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEVCMTRFRjlCNDBFMTFFRUJDQkZGNTQwQzY1MURCMUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEVCMTRFRjhCNDBFMTFFRUJDQkZGNTQwQzY1MURCMUEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDNjYjEzZTAtNDhlMi1kZDQ3LThjZDEtMTNhMWJmYmIyNjYxIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YjVkNjVmMWItN2Y2My1iYzQ1LTk3MzAtZGNkZGJmYTYxZTkxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ybqwMQAAAvxJREFUeNrsmz9MFEEUxufggiZgFLTBxoYCEzsSMZFLjAUJBUdnZ2Gg0AY6KqmkIFbYWGFlo6Ul1RVLI0ppoZWNYEhEjVIgyvJN7tvkvCx3q/vmH7sv+WX3ZnKzb9++eTNvdrYSx7EqsvQItdMHnoAvIDbIHq/TJ2YB7QECrMZ2ZUVIb1UR6gL6yQ+BGtgw6LETIKInXJRoUMoASSMVC91W9Fo9hpWdAttkSqhOVEx7gL6BYZ7vgMsCdUF5wF/GNlDnvQHmwGfwCcwK1QXVBQofBL2XqkAbwylPp1BT4SVHup/xwQAjDFi/wVX2S5MMgA+89iMfcoEXnJuvSc3NMzAODsEfcMtlLnAdvHbchX/QC3ddDIMfwRUP4tg7cM1FDDjHY81C30+jljIKWfUAm5MfYzpUDSjjOq8oZ4KuPMBG9haHYIBExtp+b+UsCzId3kpRPk9ZcAbwXiSHwdhiDBC7ZuE9wKQBxlLO85SVMSCUeYDq8vTylJVBUPqaVYNKFj4IFi4GVEI0gM8eEJHgDBCp7js9Ot3YJLigmnsBNJdA/bR5wEndZQWsq+ZSeyL3wSvWGQjZ/7+knIjUcned7R2Aey3tz7JMy4y0Dj4ZoMH2Fvg7Ahs8X2BdQ1oHE4uiEftuJ9H7iGptZT9BP/v/97a68+Ab2FfNt0PddAgyBhzx2JtS12tqkmXCAFneE6R5yFse76bUJUHxzWkOgtMtQXAeDJL5liA4HUIQjDJsdIxOaHO5w3+WTTwE3+YBD8EMaDDg7fO8zjqv02EX4nQU2ONxwtHN32zTw3o2qN/ND9lIWLrIjqth8I4HGaN+CLddGWATvOT5M2VvX8AN1dyTdMTguJsviuQbu0fAL+7ZGbWwP6gfvOfQ99iX7wWeggcO3P8sOHA5DCait6hsezSXsG4A23OCcq9wSEti5RcjqvxiJFPQKr8Y+Ye6oLpAYUYBW5mhSAZowgDPeczyVigPyVepa1IGkHo5ukiX1AuagwY94CuNveRbDAhWjgUYAAY5k0C+0kFrAAAAAElFTkSuQmCC"/></svg>`
            // 烟感
          case 38:
          
          if(row == undefined){ return}
          else if(row.groundingAlarm&&JSON.parse(row.groundingAlarm).smokeState==1){
            return '<svg t="1701478319313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5090" width="64" height="64"><path d="M972.288 47.616H54.272c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04h67.072v171.008c0 4.608-1.024 9.216 2.048 13.312l90.624 128c4.096 6.144 9.728 9.216 17.408 9.216h9.728v78.336c0 46.592 37.888 86.528 84.48 86.528H701.44c46.592 0 81.408-40.448 81.408-86.528V414.72h12.8c7.168 0 14.336-3.072 18.432-9.216l92.16-128c2.56-4.096 4.608-8.192 4.608-13.312V93.184h61.44c12.8 0 23.04-10.24 23.04-23.04s-10.24-22.528-23.04-22.528z m-235.52 445.44c0 20.992-14.336 40.96-35.328 40.96H325.632c-20.992 0-38.4-19.456-38.4-40.96V414.72H737.28v78.336zM865.28 256.512L783.872 368.64H243.2L167.424 256.512V93.184H865.28v163.328z" p-id="5091" fill="#ff0000"></path><path d="M251.904 230.912h91.648c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04H251.904c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04z m212.48 0h91.648c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04H464.384c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04z m211.968 0H768c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04h-91.648c-12.8 0-23.04 10.24-23.04 23.04s10.752 23.04 23.04 23.04z m-395.264 400.896c-95.232 74.24-64.512 135.68-41.472 180.736 22.016 44.032 36.864 72.704-33.792 124.416-10.24 7.68-12.288 22.016-5.12 32.256 4.608 6.144 11.776 9.216 18.432 9.216 4.608 0 9.216-1.536 13.312-4.608 101.888-74.24 70.656-136.704 47.616-182.272-22.016-44.032-36.352-72.704 28.672-123.904 9.728-7.68 11.776-22.016 4.096-32.256s-21.504-11.776-31.744-3.584z m264.192 28.672c8.192-9.728 7.168-24.064-2.56-32.256-9.728-8.192-24.064-7.168-32.256 2.56-77.824 92.16-34.816 145.92-3.584 185.344 30.72 38.4 51.2 63.488-7.168 128.512-8.704 9.216-7.68 24.064 1.536 32.256 4.096 4.096 9.728 6.144 15.36 6.144 6.144 0 12.8-2.56 16.896-7.68 84.48-93.696 40.96-147.968 9.216-187.904-30.72-37.888-51.2-63.488 2.56-126.976z m261.632 123.904c-37.376-31.744-62.464-52.224-22.016-124.928 6.144-11.264 2.048-25.088-9.216-31.232-11.264-6.144-25.088-2.048-31.232 9.216-58.368 105.472-5.632 150.016 32.768 182.272 37.888 31.744 62.464 52.736 17.92 127.488-6.656 10.752-3.072 25.088 8.192 31.232 3.584 2.048 7.68 3.072 11.776 3.072 7.68 0 15.36-4.096 19.968-11.264 64-108.032 10.752-153.088-28.16-185.856z" p-id="5092" fill="#FF0000"></path></svg>'
              }
              else{
            return '<svg t="1701478319313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5090" width="64" height="64"><path d="M972.288 47.616H54.272c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04h67.072v171.008c0 4.608-1.024 9.216 2.048 13.312l90.624 128c4.096 6.144 9.728 9.216 17.408 9.216h9.728v78.336c0 46.592 37.888 86.528 84.48 86.528H701.44c46.592 0 81.408-40.448 81.408-86.528V414.72h12.8c7.168 0 14.336-3.072 18.432-9.216l92.16-128c2.56-4.096 4.608-8.192 4.608-13.312V93.184h61.44c12.8 0 23.04-10.24 23.04-23.04s-10.24-22.528-23.04-22.528z m-235.52 445.44c0 20.992-14.336 40.96-35.328 40.96H325.632c-20.992 0-38.4-19.456-38.4-40.96V414.72H737.28v78.336zM865.28 256.512L783.872 368.64H243.2L167.424 256.512V93.184H865.28v163.328z" p-id="5091" fill="#ffffff"></path><path d="M251.904 230.912h91.648c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04H251.904c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04z m212.48 0h91.648c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04H464.384c-12.8 0-23.04 10.24-23.04 23.04s10.24 23.04 23.04 23.04z m211.968 0H768c12.8 0 23.04-10.24 23.04-23.04s-10.24-23.04-23.04-23.04h-91.648c-12.8 0-23.04 10.24-23.04 23.04s10.752 23.04 23.04 23.04z m-395.264 400.896c-95.232 74.24-64.512 135.68-41.472 180.736 22.016 44.032 36.864 72.704-33.792 124.416-10.24 7.68-12.288 22.016-5.12 32.256 4.608 6.144 11.776 9.216 18.432 9.216 4.608 0 9.216-1.536 13.312-4.608 101.888-74.24 70.656-136.704 47.616-182.272-22.016-44.032-36.352-72.704 28.672-123.904 9.728-7.68 11.776-22.016 4.096-32.256s-21.504-11.776-31.744-3.584z m264.192 28.672c8.192-9.728 7.168-24.064-2.56-32.256-9.728-8.192-24.064-7.168-32.256 2.56-77.824 92.16-34.816 145.92-3.584 185.344 30.72 38.4 51.2 63.488-7.168 128.512-8.704 9.216-7.68 24.064 1.536 32.256 4.096 4.096 9.728 6.144 15.36 6.144 6.144 0 12.8-2.56 16.896-7.68 84.48-93.696 40.96-147.968 9.216-187.904-30.72-37.888-51.2-63.488 2.56-126.976z m261.632 123.904c-37.376-31.744-62.464-52.224-22.016-124.928 6.144-11.264 2.048-25.088-9.216-31.232-11.264-6.144-25.088-2.048-31.232 9.216-58.368 105.472-5.632 150.016 32.768 182.272 37.888 31.744 62.464 52.736 17.92 127.488-6.656 10.752-3.072 25.088 8.192 31.232 3.584 2.048 7.68 3.072 11.776 3.072 7.68 0 15.36-4.096 19.968-11.264 64-108.032 10.752-153.088-28.16-185.856z" p-id="5092" fill="#ffffff"></path></svg>'
              }
            
          // 门磁
          case 39:
        
              if(row == undefined){ return}
              else if(row.groundingAlarm&&JSON.parse(row.groundingAlarm).doorState==1){
                return `<svg t="1701657981585" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14957" width="64" height="64"><path d="M274.223729 766.264407h-63.349153c-8.677966 0-16.488136-6.942373-16.488135-16.488136V337.572881c0-8.677966 6.942373-16.488136 16.488135-16.488135h63.349153c8.677966 0 16.488136 6.942373 16.488135 16.488135v412.20339c0 8.677966-6.942373 16.488136-16.488135 16.488136zM719.40339 863.457627H400.054237c-35.579661 0-65.084746-29.505085-65.084745-65.084746V277.694915c0-35.579661 29.505085-65.084746 65.084745-65.084746h319.349153c35.579661 0 65.084746 29.505085 65.084746 65.084746v520.677966c0 35.579661-29.505085 65.084746-65.084746 65.084746z m-319.349153-607.457627c-12.149153 0-21.694915 9.545763-21.694915 21.694915v520.677966c0 12.149153 9.545763 21.694915 21.694915 21.694916h319.349153c12.149153 0 21.694915-9.545763 21.694915-21.694916V277.694915c0-12.149153-9.545763-21.694915-21.694915-21.694915H400.054237z" p-id="14958" fill="#ff0000"></path><path d="M562.332203 432.162712m-103.267796 0a103.267797 103.267797 0 1 0 206.535593 0 103.267797 103.267797 0 1 0-206.535593 0Z" p-id="14959" fill="#ff0000"></path><path d="M840.894915 116.284746l-57.274576 37.315254 29.505085 20.827119-32.108475 39.050847 65.084746-38.183051-32.108475-20.827118zM923.335593 223.023729l-68.555932 3.471186 14.752542 33.844068-46.861017 16.488136h74.630509l-16.488136-33.844068zM715.064407 76.366102L668.20339 126.698305l34.711864 13.016949-21.694915 45.125424 52.935593-52.935593-35.579661-12.149153z" p-id="14960" fill="#ff0000"></path></svg>`
              }
              else{
                return `<svg t="1701657981585" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14957" width="64" height="64"><path d="M274.223729 766.264407h-63.349153c-8.677966 0-16.488136-6.942373-16.488135-16.488136V337.572881c0-8.677966 6.942373-16.488136 16.488135-16.488135h63.349153c8.677966 0 16.488136 6.942373 16.488135 16.488135v412.20339c0 8.677966-6.942373 16.488136-16.488135 16.488136zM719.40339 863.457627H400.054237c-35.579661 0-65.084746-29.505085-65.084745-65.084746V277.694915c0-35.579661 29.505085-65.084746 65.084745-65.084746h319.349153c35.579661 0 65.084746 29.505085 65.084746 65.084746v520.677966c0 35.579661-29.505085 65.084746-65.084746 65.084746z m-319.349153-607.457627c-12.149153 0-21.694915 9.545763-21.694915 21.694915v520.677966c0 12.149153 9.545763 21.694915 21.694915 21.694916h319.349153c12.149153 0 21.694915-9.545763 21.694915-21.694916V277.694915c0-12.149153-9.545763-21.694915-21.694915-21.694915H400.054237z" p-id="14958" fill="#ffffff"></path><path d="M562.332203 432.162712m-103.267796 0a103.267797 103.267797 0 1 0 206.535593 0 103.267797 103.267797 0 1 0-206.535593 0Z" p-id="14959" fill="#ffffff"></path></svg>`
              }
          // 水表
          case 48:
          case 53:
          case 55:
            return `<svg t="1750125816826" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6417" width="64" height="64"><path d="M512 401.92c-11.776 40.96-30.208 122.368-33.28 146.944-2.048 16.384 6.144 39.936 29.696 39.936 26.112 0 34.304-20.992 32.256-40.448-2.048-24.064-18.432-104.96-28.672-146.432z m-80.384 157.184c6.656-52.736 50.176-197.632 53.248-207.872 7.68-27.648 47.616-27.136 54.784 0.512 56.32 217.088 52.736 233.472 28.16 261.12-50.688 56.832-144.384 14.336-136.192-53.76z m358.4 163.328c17.408-23.552 32.256-49.664 43.008-77.312l-65.024-20.992c-26.624-8.704-13.824-49.664 13.312-40.96l65.024 20.992c14.848-56.832 15.36-116.736 1.024-174.08l-65.024 20.992c-27.136 8.704-39.936-31.744-13.312-40.96l65.024-20.992c-21.504-54.784-56.32-103.424-101.376-141.312l-39.936 54.784c-16.384 23.04-51.2-2.048-34.816-25.088l39.936-55.296c-48.64-31.232-104.448-50.176-162.304-54.272V235.52c0 28.16-43.008 28.16-43.008 0V168.448c-60.928 3.072-119.808 22.016-171.008 54.784l43.008 58.88c16.384 23.04-17.92 48.128-34.816 25.088l-42.496-58.88C241.664 285.696 206.848 334.336 185.856 389.12l69.12 22.528c27.136 8.704 13.824 49.664-13.312 40.96L172.544 430.08c-14.336 56.832-14.336 116.736 0.512 173.568l69.12-22.528c27.136-8.704 39.936 31.744 13.312 40.96l-69.12 22.528c10.752 26.624 24.576 51.712 41.472 75.264 16.384 23.04-17.92 48.128-34.816 25.088-60.928-83.456-86.016-188.416-69.632-290.304 54.272-343.552 498.688-448 701.44-168.448 100.352 138.24 99.84 323.584-1.536 461.312-15.872 23.04-50.176-2.56-33.28-25.088z m-93.696 43.008H332.288c-28.16 0-28.16-43.008 0-43.008H696.32c11.776 0.512 20.992 10.24 20.48 22.528-0.512 10.752-9.216 19.968-20.48 20.48z m-117.76 96.256H450.048c-28.16 0-28.16-43.008 0-43.008H578.56c11.776 0 21.504 9.728 21.504 21.504s-9.728 21.504-21.504 21.504zM512 70.656c-243.2 0-441.344 198.144-441.344 441.344s198.144 441.344 441.344 441.344 441.344-198.144 441.344-441.344c-0.512-243.712-198.144-441.344-441.344-441.344z m0 925.184c-266.752 0-483.84-217.088-483.84-483.84S245.248 28.16 512 28.16s483.84 217.088 483.84 483.84-217.088 483.84-483.84 483.84z" fill="#ffffff" p-id="6418"></path><path d="M511.488 593.408c-15.36 0-35.84-5.12-35.84-50.176 9.216-48.64 21.504-95.744 35.84-141.312 14.848 46.08 26.624 93.184 35.84 141.824 2.048 24.576-10.24 47.104-27.648 49.664-2.048 0.512-5.12 0.512-8.192 0z" fill="#ffffff" opacity=".3" p-id="6419"></path></svg>`
          //门磁温度监测
          case 50:
            return `<svg t="1751420694520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6310" width="64" height="64"><path d="M371.500117 1024c-73.619939 0-142.919881-28.789976-195.139838-81.069933S95.420346 821.320168 95.500346 747.700229a275.639771 275.639771 0 0 1 112.999906-222.409815 36.809969 36.809969 0 0 0 14.999987-29.549976V148.000727A147.999877 147.999877 0 0 1 372.000116 0.00085c81.339932 0.28 147.499878 67.249944 147.499878 149.279876V496.000438a36.69997 36.69997 0 0 0 15.149987 29.359976A275.639771 275.639771 0 0 1 647.499888 748.000229a275.999771 275.999771 0 0 1-275.999771 275.999771z m0-963.9992a87.999927 87.999927 0 0 0-87.999927 87.999927v347.749711a96.999919 96.999919 0 0 1-39.569967 77.939936 216.99982 216.99982 0 0 0-88.429927 174.079855A216.42982 216.42982 0 0 0 371.500117 964.00005c119.099901 0 215.999821-96.89992 215.99982-215.999821a216.99982 216.99982 0 0 0-88.349926-174.259855A96.90992 96.90992 0 0 1 459.500044 496.000438V149.280726c0-49.059959-39.339967-89.109926-87.689928-89.279926z" fill="#ffffff" p-id="6311"></path><path d="M371.500117 894.330108c-76.999936 0-139.659884-62.649948-139.659884-139.659884S294.490181 615.00034 371.500117 615.00034a29.999975 29.999975 0 0 1 0 59.99995 79.659934 79.659934 0 1 0 79.659934 79.659934 29.999975 29.999975 0 0 1 59.99995 0c0 77.009936-62.649948 139.669884-139.659884 139.669884zM728.49982 157.00072h-79.999933a29.999975 29.999975 0 1 1 0-59.999951h79.999933a29.999975 29.999975 0 1 1 0 59.999951zM898.499679 445.000481h-249.999792a29.999975 29.999975 0 0 1 0-59.999951h249.999792a29.999975 29.999975 0 0 1 0 59.999951zM788.49977 301.0006h-139.999883a29.999975 29.999975 0 0 1 0-59.99995h139.999883a29.999975 29.999975 0 1 1 0 59.99995z" fill="#ffffff" p-id="6312"></path></svg>`
          case 51:
            return `<svg t="1754528341511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4154" width="200" height="200"><path d="M393.707231 292.571429L343.13933 487.619048l46.955908 234.779541-97.523809-45.149912-66.82187-108.359788-21.671958-86.687831 66.82187-113.777778z" fill="#ffffff" p-id="4155"></path><path d="M451.499118 509.291005a104.747795 61.40388 90 1 0 122.80776 0 104.747795 61.40388 90 1 0-122.80776 0Z" fill="#ffffff" p-id="4156"></path><path d="M426.215168 781.996473c-3.611993 0-7.223986-1.805996-10.835979-3.611993l-117.389771-86.687831c-36.119929-23.477954-65.015873-57.791887-83.075838-99.329806-10.835979-25.283951-16.253968-52.373898-16.253968-81.269841s5.417989-55.985891 16.253968-81.269842c16.253968-41.537919 45.149912-74.045855 83.075838-97.523809l110.165785-77.657848c9.029982-5.417989 19.865961-3.611993 25.28395 3.611993 5.417989 9.029982 3.611993 19.865961-3.611993 25.28395L319.661376 361.199295c-32.507937 19.865961-55.985891 48.761905-70.433863 81.269841-9.029982 21.671958-14.447972 45.149912-14.447972 68.627866 0 23.477954 3.611993 45.149912 12.641976 66.821869 14.447972 34.313933 37.925926 63.209877 68.627866 83.075838l117.38977 86.687831c7.223986 5.417989 9.029982 18.059965 3.611993 25.28395 0 5.417989-5.417989 9.029982-10.835978 9.029983z" fill="#ffffff" p-id="4157"></path><path d="M523.738977 830.758377c-108.359788 0-193.241623-140.867725-193.241623-317.855379S415.379189 193.241623 523.738977 193.241623c25.283951 0 50.567901 7.223986 74.045855 23.477954 9.029982 5.417989 10.835979 16.253968 5.41799 25.28395s-16.253968 10.835979-25.283951 5.41799c-18.059965-10.835979-34.313933-18.059965-54.179894-18.059965-84.881834 0-157.121693 130.031746-157.121693 281.73545S438.857143 794.638448 523.738977 794.638448s157.121693-130.031746 157.121693-281.73545c0-74.045855-16.253968-146.285714-46.955908-198.659612-5.417989-9.029982-1.805996-19.865961 7.223986-25.28395 9.029982-5.417989 19.865961-1.805996 25.28395 7.223986 32.507937 59.597884 50.567901 135.449735 50.567902 216.719576C718.786596 689.890653 633.904762 830.758377 523.738977 830.758377z" fill="#ffffff" p-id="4158"></path><path d="M523.738977 646.546737c-48.761905 0-86.687831-59.597884-86.687831-133.643739S474.977072 379.259259 523.738977 379.259259s86.687831 59.597884 86.687831 133.643739-37.925926 133.643739-86.687831 133.643739z m0-232.973545c-23.477954 0-50.567901 39.731922-50.567901 97.52381s27.089947 97.52381 50.567901 97.523809 50.567901-39.731922 50.567901-97.523809-27.089947-97.52381-50.567901-97.52381z" fill="#ffffff" p-id="4159"></path><path d="M523.738977 413.573192h-1.805996l-92.105821-10.835979c-9.029982-1.805996-16.253968-10.835979-16.253968-19.865961 1.805996-9.029982 10.835979-16.253968 19.865961-16.253968l92.105821 10.835979c9.029982 1.805996 16.253968 10.835979 16.253968 19.865961 0 9.029982-9.029982 16.253968-18.059965 16.253968zM372.035273 662.800705c-9.029982 0-16.253968-7.223986-18.059964-16.253968-1.805996-9.029982 5.417989-18.059965 16.253968-19.865961l153.5097-16.253968c9.029982-1.805996 18.059965 5.417989 19.865961 16.253968 1.805996 9.029982-5.417989 18.059965-16.253968 19.865961l-153.5097 16.253968h-1.805997z" fill="#ffffff" p-id="4160"></path><path d="M763.936508 364.811287c-5.417989 0-9.029982-1.805996-12.641975-5.417989-7.223986-7.223986-7.223986-18.059965 0-25.283951l25.28395-25.28395c7.223986-7.223986 18.059965-7.223986 25.283951 0s7.223986 18.059965 0 25.28395L776.578483 359.393298c-3.611993 3.611993-9.029982 5.417989-12.641975 5.417989zM771.160494 720.592593c-5.417989 0-9.029982-1.805996-12.641975-5.41799l-25.283951-25.28395c-7.223986-7.223986-7.223986-18.059965 0-25.283951s18.059965-7.223986 25.283951 0l25.28395 25.283951c7.223986 7.223986 7.223986 18.059965 0 25.28395-3.611993 3.611993-7.223986 5.417989-12.641975 5.41799zM819.922399 529.156966h-54.179895c-10.835979 0-18.059965-7.223986-18.059964-18.059964s7.223986-18.059965 18.059964-18.059965h54.179895c10.835979 0 18.059965 7.223986 18.059964 18.059965s-9.029982 18.059965-18.059964 18.059964z" fill="#ffffff" p-id="4161"></path></svg>`
          
            // 水浸
          case 40:
          if(row == undefined){ return}
          else if(row.groundingAlarm&&JSON.parse(row.groundingAlarm).waterImmersionState==1){
                return '<svg t="1701652697274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18751" width="64" height="64"><path d="M512 926.09C283.67 926.09 97.91 740.33 97.91 512S283.67 97.91 512 97.91 926.09 283.67 926.09 512 740.33 926.09 512 926.09z m0-792.94c-208.9 0-378.85 169.95-378.85 378.85S303.1 890.85 512 890.85 890.85 720.9 890.85 512 720.9 133.15 512 133.15z" fill="#ff0000" p-id="18752"></path><path d="M512 667.25a114.55 114.55 0 0 1-82.61-193.9L489.11 370A26.52 26.52 0 0 1 512 356.75 26.5 26.5 0 0 1 534.89 370l59.72 103.38A114.55 114.55 0 0 1 512 667.25z m-56.09-170.63a79.3 79.3 0 1 0 112.14 0l12.63-12.65-12.9 12.37-1.45-1.52-1.14-1.91L512 400.8l-54.36 94.1zM752.44 640a17.62 17.62 0 0 1-12.64-29.89 138.53 138.53 0 0 0-2.88-195.93 17.62 17.62 0 1 1 24.55-25.29 173.76 173.76 0 0 1 3.62 245.77 17.58 17.58 0 0 1-12.65 5.34z" fill="#ff0000" p-id="18753"></path><path d="M703.18 582.45a17.62 17.62 0 0 1-12.46-30.08 57.53 57.53 0 0 0 0-81.41A17.62 17.62 0 0 1 715.64 446a92.76 92.76 0 0 1 0 131.24 17.56 17.56 0 0 1-12.46 5.21zM271.56 640a17.56 17.56 0 0 1-12.64-5.35 173.76 173.76 0 0 1 3.63-245.77 17.62 17.62 0 0 1 24.55 25.29 138.53 138.53 0 0 0-2.89 195.93 17.62 17.62 0 0 1-12.65 29.9z" fill="#ff0000" p-id="18754"></path><path d="M320.82 582.45a17.56 17.56 0 0 1-12.46-5.16 92.75 92.75 0 0 1 0-131.24A17.62 17.62 0 0 1 333.28 471a57.52 57.52 0 0 0 0 81.41 17.62 17.62 0 0 1-12.46 30.08z" fill="#ff0000" p-id="18755"></path></svg>'
              }
              else{
                return '<svg t="1701652697274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18751" width="64" height="64"><path d="M512 926.09C283.67 926.09 97.91 740.33 97.91 512S283.67 97.91 512 97.91 926.09 283.67 926.09 512 740.33 926.09 512 926.09z m0-792.94c-208.9 0-378.85 169.95-378.85 378.85S303.1 890.85 512 890.85 890.85 720.9 890.85 512 720.9 133.15 512 133.15z" fill="#ffffff" p-id="18752"></path><path d="M512 667.25a114.55 114.55 0 0 1-82.61-193.9L489.11 370A26.52 26.52 0 0 1 512 356.75 26.5 26.5 0 0 1 534.89 370l59.72 103.38A114.55 114.55 0 0 1 512 667.25z m-56.09-170.63a79.3 79.3 0 1 0 112.14 0l12.63-12.65-12.9 12.37-1.45-1.52-1.14-1.91L512 400.8l-54.36 94.1zM752.44 640a17.62 17.62 0 0 1-12.64-29.89 138.53 138.53 0 0 0-2.88-195.93 17.62 17.62 0 1 1 24.55-25.29 173.76 173.76 0 0 1 3.62 245.77 17.58 17.58 0 0 1-12.65 5.34z" fill="#ffffff" p-id="18753"></path><path d="M703.18 582.45a17.62 17.62 0 0 1-12.46-30.08 57.53 57.53 0 0 0 0-81.41A17.62 17.62 0 0 1 715.64 446a92.76 92.76 0 0 1 0 131.24 17.56 17.56 0 0 1-12.46 5.21zM271.56 640a17.56 17.56 0 0 1-12.64-5.35 173.76 173.76 0 0 1 3.63-245.77 17.62 17.62 0 0 1 24.55 25.29 138.53 138.53 0 0 0-2.89 195.93 17.62 17.62 0 0 1-12.65 29.9z" fill="#ffffff" p-id="18754"></path><path d="M320.82 582.45a17.56 17.56 0 0 1-12.46-5.16 92.75 92.75 0 0 1 0-131.24A17.62 17.62 0 0 1 333.28 471a57.52 57.52 0 0 0 0 81.41 17.62 17.62 0 0 1-12.46 30.08z" fill="#ffffff" p-id="18755"></path></svg>'
              }
            
          default:
            return '<svg t="1622601366977" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4085" width="64" height="64"><path d="M512 64C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64z m0 832C300.256 896 128 723.744 128 512S300.256 128 512 128s384 172.256 384 384-172.256 384-384 384z" p-id="4086" fill="#ffffff"></path><path d="M519.552 256a32 32 0 0 0-32 32v128a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32zM348.384 520.32a32 32 0 1 0-56.768 29.568l72.32 136.896a32 32 0 1 0 56.768-29.568l-72.32-136.896zM727.104 506.72a32 32 0 0 0-43.168 13.6l-72.32 136.896a32 32 0 1 0 56.768 29.568l72.32-136.896a32 32 0 0 0-13.6-43.168z" p-id="4087" fill="#ffffff"></path></svg>'

        }
        
        // return `<svg t="1622600037464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3902" width="64" height="64"><path d="M383.2 941.6c-4 0-6.4-0.8-9.6-2.4-14.4-9.6-82.4-60-25.6-160 15.2-27.2 19.2-48.8 13.6-66.4-6.4-20-27.2-28-27.2-28-9.6-4-14.4-15.2-10.4-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 3.2 0 36.8 14.4 50.4 50.4 10.4 28.8 4.8 62.4-16.8 100-40 70.4 2.4 101.6 11.2 107.2 8.8 4.8 12 16.8 7.2 26.4-4.8 6.4-12 8.8-17.6 8.8z m129.6-42.4c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16 47.2 48 9.6 27.2 4.8 58.4-15.2 92.8-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4.8 6.4-12 8.8-17.6 8.8z m-265.6 0c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16.8 47.2 48 9.6 27.2 4 58.4-15.2 93.6-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4 5.6-12 8-17.6 8z m487.2-71.2c-6.4 0-11.2-2.4-15.2-6.4s-6.4-9.6-6.4-15.2c0-8.8 5.6-16.8 13.6-20.8h0.8v-43.2l-40.8 23.2v0.8c0 6.4-2.4 14.4-10.4 18.4-3.2 2.4-7.2 3.2-11.2 3.2-8 0-15.2-4-18.4-10.4-3.2-5.6-4-11.2-2.4-16.8 1.6-5.6 4.8-10.4 10.4-12.8 3.2-2.4 7.2-3.2 10.4-3.2 4 0 8 0.8 11.2 3.2l36.8-20.8-36-20.8c-4.8 1.6-8.8 2.4-12 2.4-4 0-7.2-0.8-10.4-2.4-9.6-6.4-13.6-20-8-29.6 4-6.4 11.2-10.4 19.2-10.4 4 0 8 0.8 11.2 3.2 6.4 4 10.4 10.4 10.4 18.4v0.8L728 712v-43.2h-0.8c-8-4-13.6-12-13.6-20.8 0-12 9.6-21.6 21.6-21.6 6.4 0 12 2.4 16 6.4s6.4 9.6 6.4 15.2c0 7.2-4 14.4-11.2 18.4H744v41.6l35.2-20v-0.8c0-6.4 2.4-14.4 10.4-18.4 3.2-2.4 7.2-3.2 11.2-3.2 8 0 15.2 4 18.4 10.4 3.2 5.6 4 11.2 2.4 16.8-1.6 5.6-4.8 10.4-10.4 12.8-3.2 2.4-7.2 3.2-10.4 3.2-4 0-8-0.8-11.2-3.2l-36.8 20.8 36 20.8c4.8-1.6 8.8-2.4 12-2.4 4 0 7.2 0.8 10.4 2.4 9.6 6.4 13.6 20 8 29.6-4 6.4-11.2 10.4-19.2 10.4-4 0-8-0.8-11.2-3.2-6.4-4-10.4-10.4-10.4-18.4v-0.8L744 745.6v41.6h0.8c7.2 3.2 11.2 10.4 11.2 18.4 0 12.8-9.6 22.4-21.6 22.4zM152 575.2c-60.8 0-109.6-48.8-109.6-109.6V204.8c0-60.8 48.8-109.6 109.6-109.6h721.6c60.8 0 109.6 48.8 109.6 109.6v260.8c0 60.8-48.8 109.6-109.6 109.6H152z m-11.2-432c-28.8 0-52 24-52 54.4v278.4c0 29.6 23.2 54.4 52 54.4h743.2c28.8 0 52-24 52-54.4V197.6c0-29.6-23.2-54.4-52-54.4H140.8z m21.6 312c-10.4 0-19.2-8.8-19.2-19.2 0-10.4 8.8-19.2 19.2-19.2h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z m0-80.8c-10.4 0-19.2-8.8-19.2-19.2S152 336 162.4 336h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z" fill="#ffffff" p-id="3903"></path></svg>`
      }
    },
    chargeprobeTypeFilterimg() {
      return function (index) {
        const typeObj = chargetargetCategoryData.find((obj) => obj.id === index);
        switch (typeObj?typeObj.id:0) {

          case 14:
            return '<svg t="1622601490854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="24" height="24"><path d="M874.4 905.6H165.6c-21.6 0-39.2-17.6-39.2-39.2V157.6c0-21.6 17.6-39.2 39.2-39.2h708.8c21.6 0 39.2 17.6 39.2 39.2v708.8c0 21.6-17.6 39.2-39.2 39.2zM165.6 140c-9.6 0-17.6 8-17.6 17.6v708.8c0 9.6 8 17.6 17.6 17.6h708.8c9.6 0 17.6-8 17.6-17.6V157.6c0-9.6-8-17.6-17.6-17.6H165.6z" p-id="2167" fill="#ffffff"></path><path d="M874.4 912H165.6c-24.8 0-45.6-20.8-45.6-45.6V157.6c0-24.8 20.8-45.6 45.6-45.6h708.8c24.8 0 45.6 20.8 45.6 45.6v708.8c0 24.8-20.8 45.6-45.6 45.6zM165.6 124.8c-17.6 0-32.8 14.4-32.8 32.8v708.8c0 17.6 14.4 32.8 32.8 32.8h708.8c17.6 0 32.8-14.4 32.8-32.8V157.6c0-17.6-14.4-32.8-32.8-32.8H165.6z m708.8 765.6H165.6c-13.6 0-24-11.2-24-24V157.6c0-13.6 11.2-24 24-24h708.8c13.6 0 24 11.2 24 24v708.8c0 13.6-10.4 24-24 24z m-708.8-744c-6.4 0-11.2 4.8-11.2 11.2v708.8c0 6.4 4.8 11.2 11.2 11.2h708.8c6.4 0 11.2-4.8 11.2-11.2V157.6c0-6.4-4.8-11.2-11.2-11.2H165.6z" p-id="2168" fill="#ffffff"></path><path d="M803.2 608H236.8c-21.6 0-39.2-17.6-39.2-39.2V228.8c0-21.6 17.6-39.2 39.2-39.2h567.2c21.6 0 39.2 17.6 39.2 39.2v340c-0.8 21.6-18.4 39.2-40 39.2zM236.8 210.4c-9.6 0-17.6 8-17.6 17.6V568c0 9.6 8 17.6 17.6 17.6h567.2c9.6 0 17.6-8 17.6-17.6V228.8c0-9.6-8-17.6-17.6-17.6H236.8z" p-id="2169" fill="#ffffff"></path><path d="M803.2 614.4H236.8c-24.8 0-45.6-20.8-45.6-45.6V228.8c0-24.8 20.8-45.6 45.6-45.6h567.2c24.8 0 45.6 20.8 45.6 45.6v340c-0.8 24.8-20.8 45.6-46.4 45.6zM236.8 196c-17.6 0-32.8 14.4-32.8 32.8v340c0 17.6 14.4 32.8 32.8 32.8h567.2c17.6 0 32.8-14.4 32.8-32.8V228.8c0-17.6-14.4-32.8-32.8-32.8H236.8z m566.4 396.8H236.8c-13.6 0-24-11.2-24-24V228.8c0-13.6 11.2-24 24-24h567.2c13.6 0 24 11.2 24 24v340c0 13.6-11.2 24-24.8 24zM236.8 217.6c-6.4 0-11.2 4.8-11.2 11.2v340c0 6.4 4.8 11.2 11.2 11.2h567.2c6.4 0 11.2-4.8 11.2-11.2V228.8c0-6.4-4.8-11.2-11.2-11.2H236.8z m528.8 519.2c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2zM624.8 736.8c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z m-140 0c0 19.2 16 35.2 35.2 35.2 19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2-19.2-0.8-35.2 15.2-35.2 35.2z" p-id="2170" fill="#ffffff"></path><path d="M461.6 316l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8z m0 73.6h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m0 92h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m129.6-165.6l9.6-9.6-9.6-9.6h-68.8l-9.6 9.6 9.6 9.6h68.8zM520 387.2v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m71.2 2.4h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6z m11.2 11.2l-9.6 9.6v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6z m-11.2 80.8h-68.8l-9.6 9.6 9.6 9.6h68.8l9.6-9.6-9.6-9.6zM464 318.4v68.8l9.6 9.6 9.6-9.6v-68.8l-9.6-9.6-9.6 9.6z m-73.6 160.8v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z m129.6 0v-68.8l-9.6-9.6-9.6 9.6v68.8l9.6 9.6 9.6-9.6z" p-id="2171" fill="#ffffff"></path><path d="M592 502.4h-71.2L499.2 480v-71.2l10.4-10.4-10.4-10.4v-71.2l11.2-12 10.4-10.4H592l11.2 12-11.2 12h-69.6v68.8H592l11.2 11.2 10.4 10.4V480L592 502.4z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m92 0l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72.8 0.8h68.8v-68.8h-68.8v68.8z m0.8-73.6h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-60.8 188.8h-71.2L369.6 480v-71.2l10.4-10.4 11.2-11.2h69.6v-68.8h-69.6l-11.2-12 11.2-12h71.2l10.4 10.4 11.2 12v71.2L472.8 400l-10.4 10.4h-69.6v68.8h69.6l11.2 11.2-11.2 12z m-68.8-4.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m-20-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m20-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2z m72-19.2l7.2 7.2 7.2-7.2v-67.2l-7.2-7.2-7.2 7.2v67.2z m-72-72.8h67.2l7.2-7.2-7.2-7.2h-67.2l-7.2 7.2 7.2 7.2zM648 296.8c4.8 0 8 3.2 9.6 8v4c-1.6 4-4 6.4-8 7.2h-3.2c-4.8-0.8-8-4-8-9.6 0-4.8 3.2-8 9.6-9.6z m-0.8 3.2c-4 0.8-5.6 3.2-5.6 6.4s1.6 5.6 4.8 6.4l2.4 0.8c4-1.6 6.4-4 5.6-7.2v-0.8c-0.8-2.4-2.4-4.8-4.8-5.6h-2.4z m48 7.2c14.4 0.8 23.2 6.4 27.2 17.6l0.8 0.8-7.2 3.2c-3.2-8.8-8.8-12.8-16-13.6l-5.6-0.8c-15.2 0.8-23.2 11.2-23.2 30.4 0.8 13.6 6.4 21.6 16 25.6 2.4 0.8 5.6 1.6 10.4 1.6 8.8-0.8 16-7.2 20-17.6v-0.8l8 1.6v0.8c-6.4 15.2-16 23.2-28.8 23.2h-5.6c-14.4-2.4-22.4-9.6-25.6-20.8-1.6-4.8-2.4-9.6-2.4-14.4 0.8-15.2 6.4-26.4 16-32 4.8-3.2 9.6-4.8 15.2-4.8h0.8z" p-id="2172" fill="#ffffff"></path><path d="M690.4 381.6c-15.2-2.4-24.8-9.6-28-22.4-1.6-4.8-2.4-10.4-2.4-15.2 0.8-16 6.4-27.2 16.8-34.4 4.8-3.2 10.4-4.8 15.2-4.8h2.4c15.2 0.8 24.8 7.2 29.6 19.2l1.6 2.4-12 4.8-0.8-2.4c-3.2-8-7.2-12-14.4-12l-5.6-0.8c-13.6 0.8-20.8 9.6-20.8 28 0.8 12 5.6 20 15.2 23.2 1.6 0.8 4 1.6 9.6 0.8 8-0.8 13.6-6.4 18.4-16h2.4l9.6 1.6v3.2c-6.4 16-16.8 24-31.2 24.8h-5.6z m3.2-72c-4.8 0-9.6 1.6-13.6 4-9.6 5.6-14.4 16-15.2 30.4 0 4.8 0.8 9.6 1.6 13.6 3.2 10.4 11.2 16.8 24 19.2h5.6c12-0.8 20-7.2 26.4-20l-3.2-0.8c-4.8 10.4-12 16.8-21.6 17.6-5.6 0-8.8 0-11.2-1.6-10.4-4-16.8-13.6-17.6-27.2 0.8-20.8 8.8-32 25.6-32.8l6.4 0.8c8 0.8 13.6 4.8 16.8 12.8l3.2-1.6c-4-9.6-12-14.4-24-15.2l-3.2 0.8z m-46.4 8.8c-4.8-0.8-9.6-3.2-10.4-12 0-4.8 2.4-9.6 11.2-12 4 0 8.8 2.4 12 9.6v4.8c-0.8 4.8-4.8 8-9.6 8.8l-3.2 0.8z m0.8-16c-3.2 0.8-4 3.2-4 4 0 2.4 1.6 4 3.2 4.8h1.6c4-1.6 4-3.2 4-4.8-0.8-1.6-1.6-3.2-3.2-4H648z" p-id="2173" fill="#ffffff"></path></svg>'
        }
        // return `<svg t="1622600037464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3902" width="64" height="64"><path d="M383.2 941.6c-4 0-6.4-0.8-9.6-2.4-14.4-9.6-82.4-60-25.6-160 15.2-27.2 19.2-48.8 13.6-66.4-6.4-20-27.2-28-27.2-28-9.6-4-14.4-15.2-10.4-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 3.2 0 36.8 14.4 50.4 50.4 10.4 28.8 4.8 62.4-16.8 100-40 70.4 2.4 101.6 11.2 107.2 8.8 4.8 12 16.8 7.2 26.4-4.8 6.4-12 8.8-17.6 8.8z m129.6-42.4c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16 47.2 48 9.6 27.2 4.8 58.4-15.2 92.8-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4.8 6.4-12 8.8-17.6 8.8z m-265.6 0c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16.8 47.2 48 9.6 27.2 4 58.4-15.2 93.6-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4 5.6-12 8-17.6 8z m487.2-71.2c-6.4 0-11.2-2.4-15.2-6.4s-6.4-9.6-6.4-15.2c0-8.8 5.6-16.8 13.6-20.8h0.8v-43.2l-40.8 23.2v0.8c0 6.4-2.4 14.4-10.4 18.4-3.2 2.4-7.2 3.2-11.2 3.2-8 0-15.2-4-18.4-10.4-3.2-5.6-4-11.2-2.4-16.8 1.6-5.6 4.8-10.4 10.4-12.8 3.2-2.4 7.2-3.2 10.4-3.2 4 0 8 0.8 11.2 3.2l36.8-20.8-36-20.8c-4.8 1.6-8.8 2.4-12 2.4-4 0-7.2-0.8-10.4-2.4-9.6-6.4-13.6-20-8-29.6 4-6.4 11.2-10.4 19.2-10.4 4 0 8 0.8 11.2 3.2 6.4 4 10.4 10.4 10.4 18.4v0.8L728 712v-43.2h-0.8c-8-4-13.6-12-13.6-20.8 0-12 9.6-21.6 21.6-21.6 6.4 0 12 2.4 16 6.4s6.4 9.6 6.4 15.2c0 7.2-4 14.4-11.2 18.4H744v41.6l35.2-20v-0.8c0-6.4 2.4-14.4 10.4-18.4 3.2-2.4 7.2-3.2 11.2-3.2 8 0 15.2 4 18.4 10.4 3.2 5.6 4 11.2 2.4 16.8-1.6 5.6-4.8 10.4-10.4 12.8-3.2 2.4-7.2 3.2-10.4 3.2-4 0-8-0.8-11.2-3.2l-36.8 20.8 36 20.8c4.8-1.6 8.8-2.4 12-2.4 4 0 7.2 0.8 10.4 2.4 9.6 6.4 13.6 20 8 29.6-4 6.4-11.2 10.4-19.2 10.4-4 0-8-0.8-11.2-3.2-6.4-4-10.4-10.4-10.4-18.4v-0.8L744 745.6v41.6h0.8c7.2 3.2 11.2 10.4 11.2 18.4 0 12.8-9.6 22.4-21.6 22.4zM152 575.2c-60.8 0-109.6-48.8-109.6-109.6V204.8c0-60.8 48.8-109.6 109.6-109.6h721.6c60.8 0 109.6 48.8 109.6 109.6v260.8c0 60.8-48.8 109.6-109.6 109.6H152z m-11.2-432c-28.8 0-52 24-52 54.4v278.4c0 29.6 23.2 54.4 52 54.4h743.2c28.8 0 52-24 52-54.4V197.6c0-29.6-23.2-54.4-52-54.4H140.8z m21.6 312c-10.4 0-19.2-8.8-19.2-19.2 0-10.4 8.8-19.2 19.2-19.2h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z m0-80.8c-10.4 0-19.2-8.8-19.2-19.2S152 336 162.4 336h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z" fill="#ffffff" p-id="3903"></path></svg>`
      }
    },
    //拆分状态值
    batteryStateSplit() {
      return function (index) {
        // let batteryState = index.split("")
        // let batstr=batteryState[4]
        // return batstr
        return 0
      }
    },
    batteryStatetext() {
      return function (index) {
        if (index >= 10000) {
          if (index >= 10110) {
            return '欠压过载超温'
          }
          else if (index >= 10100) {
            return '欠压过载'
          }
          else {
            return '欠压'
          }

        }
        else if (index >= 1000) {
          if (index >= 1110) {
            return '过压过载超温'
          }
          else if (index >= 1100) {
            return '过压过载'
          }
          else if (index >= 1010) {
            return '过压超温'
          }
          else {
            return '过压'
          }

        }
        else if (index >= 100) {
          if (index >= 110) {
            return '过载超温'
          }
          else {
            return '过载'
          }
        }
        else if (index >= 10) { return '超温' }
      }
    },
    //充电插座编码
    batteryNameCode() {
      return function (index) {

        let Code = index.split("-")
        return Code.slice(-1)[0].replace(/[^0-9]/ig, "") > 9 ? Code.slice(-1)[0].replace(/[^0-9]/ig, "") : "0" + Code.slice(-1)[0].replace(/[^1-9]/ig, "")
      }
    },

    //使用人
    batteryUserName() {
      return function (index) {
        return index.state == 1 ? index.userName=='本地开启'?index.userName:hideCodename(index.userName,1,1)  : '--'
      }
    },
    batteryClass() {
      return function (index) {
        return index.state == 1 ? 'inuseClass' : ''
      }
    },
    //用电量
    batteryAt() {
      return function (index) {

        // return ((index.eleState > 0 &&  index.state ==1  &&this.batteryStateSplit(index.eleState))|| index.state ==1) !=0 && index.opat!=undefined?index.sq=='-'?0:(index.sq)/1000:'--'
        return ((index.eleState > 0 && index.state == 1 && this.batteryStateSplit(index.eleState)) || index.state == 1) != 0 ? index.useElectricity == '-' ? 0 : (index.useElectricity) / 1000 : '--'
      }
    },
    //充电时长
    batteryTime() {
      return function (index) {
        if ((index.eleState == 0 || this.batteryStateSplit(index.eleState) == 0) && index.state == 0) {
          return '--'
        }
        else {
          let time = index.duration == -1 ? 10 : index.duration
          if (twoTimeInterval(index.startTime) > time * 60 || index.state == 0) {
            //   if(twoTimeInterval(index.on_off_time) > time * 60  || index.state==0){
            let key = this.probe_tableData.findIndex(data => data.probe_id == index.probe_id)
            this.probe_tableData[key].eleState = 0
            this.probe_tableData[key].state = 0
            return '--'
          }
          else {
            let time = twoTimeInterval(index.startTime)
            // let time = twoTimeInterval(index.on_off_time)
            if (time < 60) {
              return (time % 60) + "分"
            } else {
              return Math.floor(time / 60) + "时" + (time % 60) + "分"
            }
          }

        }

      }
    },
    //充电进度条
    batteryProgressBar() {
      return function (index) {

        if (index.state == 0) {
          return '100%'
        }
        else {
          let maxtime = index.eleDuration == null || index.eleDuration ==-1 ? 10 * 60 : index.eleDuration * 60
          let nowtime = twoTimeInterval(index.startTime)
          //  let nowtime = twoTimeInterval(index.on_off_time)
          let surplus = 1 - (nowtime / maxtime)
          surplus = surplus < 100 ? (surplus * 100).toFixed(0) + '%' : '100%'
          return surplus
        }

      }
    },
    //时间差
    Timediff() {
      return function (time) {
        return twoTimeIntervals(time)
      }
    },
    //时长
    Timeduration() {
      return function (time) {
 
        return duration(time)
      }
    },
    //本次开启时长
    TimedurationOne_Probe() {
   
      return function (time,row) {
        let openTime
        if(row.state==0){
          openTime = duration(time)
        }else{
          let newTime = moment();
          let lastTime = row.openingTimeInfo?.timeStr ?moment(row.openingTimeInfo.timeStr):moment();

          let diffTime = Number(newTime.diff(lastTime, 'seconds'))  + Number(time)
          openTime = duration(diffTime)

        }
      
        return openTime
      }
    },
    //开启时长
    Timeduration_Probe() {
      return function (time,row) {
        let openTime
        if(row.state==0){
          openTime = duration(time)
        }else{
         
          let newTime = moment();
          let lastTime =row.openingTimeInfo?.lastCalcTime ?moment(row.openingTimeInfo.lastCalcTime):moment();
          let diffTime = Number(newTime.diff(lastTime, 'seconds'))  + Number(time)
          
          openTime = duration(diffTime)
        }
    
        return openTime
      }
    },
    //开启时长月
    Timedurationday_Probe() {
      return function (time,row) {
        let openTime
        if(row.state==0){
          openTime = durationday(time)
        }else{
          let newTime = moment();
          let lastTime = row.openingTimeInfo?.lastCalcTime ?moment(row.openingTimeInfo.lastCalcTime):moment();
          let diffTime = Number(newTime.diff(lastTime, 'seconds'))  + Number(time)
          openTime = durationday(diffTime)
       
        }
      
        return openTime
      
      }
    },
    //时长
    Timedurationday() {
      return function (time) {
        return durationday(time)
      }
    },
    Tiemproportionf(){
      return function (time1,time2) {
        return tiemproportion(time1,time2)
      }
    },
    groundingAlarm_43(){
      return function (groundingAlarm) {
      if(groundingAlarm){
        const {groundWireDisconnected,poorGrounding,insufficientZeroLine,zeroFireOpposite,phaseAnomaly } =JSON.parse(groundingAlarm)
        let event =''
        if(groundWireDisconnected){
          event+='<span>地线断开</span>'
        }
        if(poorGrounding){
          event+='<span>接地不良</span>'
        }
        if(insufficientZeroLine){
          event+='<span>零线不足</span>'
        }
        if(zeroFireOpposite){
          event+='<span>零火相反</span>'
        }
        if(phaseAnomaly){
          event+='<span>相位异常</span>'
        }
        return event
      }
      else{
        return ''
      }
      }
    },
    waterMeterPressure() {
    return (item) => {
      
      const waterPressure = Number(item?.extendInfo?.waterPressure);
      const maxWaterPressure = Number(item?.extendProperty?.maxWaterPressure);
      
    
      return !isNaN(waterPressure) && !isNaN(maxWaterPressure) 
        ? (((waterPressure) * maxWaterPressure )/ 1000).toFixed(3)
        : '--';
    };
}
  },

  methods: {
    // ws推送设置
    settingSocketSubmit(){
      ajax.post({
        url: this.$API.settingSocket,
        data: { 
          channelIdList: this.allchannleList,
          cover: true,
          program: false,
          enable: true,
          userId:  this.$store.getters.user.id},
        success: () => {
          return true        
        },
      });
    },
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(data) {
      let selt = this
      const dataJson = data.detail.data;

      if(dataJson.cmd == 13){
        if (this.areaId == dataJson.msg.area && this.organId == dataJson.msg.organ){
          let alarmMsg = {
            msg: dataJson.msg.msg,
            time: moment(dataJson.msg.time).format('YYYY-MM-DD HH:mm:ss'),
          };
          this.alarmList.unshift(alarmMsg);
          this.isNewAlarm = true;
        }
      }

      if (dataJson.cmd == 1) {
        if (dataJson.msg !== '连接成功') {
          this.$message({
            message: dataJson.msg,
            type: dataJson.msgType,
          });
        }
      }
      if (dataJson.cmd == 9) {
        this.$message({
            message: dataJson.msg,
            type: dataJson.msgType,
          });
      }
      else if (dataJson.cmd == 2 || dataJson.cmd == 5  || dataJson.cmd == 11) {
        let item = dataJson.msg
        let index = this.tableData.findIndex(data => data.id == item.id && data.channel == item.channel)
        let pile = this.probe_tableData.findIndex(data => data.id == item.id && data.channel == item.channel)
        let allindex = this.tableDataAll.findIndex(data => data.id == item.id && data.channel == item.channel)
        let allpile = this.probe_tableDataAll.findIndex(data => data.id == item.id && data.channel == item.channel)
        if (allindex != -1) {
          let dava = dataJson.msg
          let keys = Object.keys(dava);
          selt.$nextTick(() => {
            if (index != -1) {
              for (let item of keys) {
                this.tableData[index][item] = dava[item]
              }
             
              let time = [37,19,41].includes(parseInt(item.targetCategoryId))?twoTimeIntervals(this.tableData[index].eventChangeTime):twoTimeIntervals(this.tableData[index].lastOnOffTime)
              this.tableData[index].Distancetime = time
              this.tableData[index].programData=JSON.parse(this.tableData[index].programData)
     
            }
            for (let item of keys) {
              this.tableDataAll[allindex][item] = dava[item]
            }
            let time = [37,19,41].includes(parseInt(item.targetCategoryId))?twoTimeIntervals(this.tableDataAll[allindex].eventChangeTime):twoTimeIntervals(this.tableDataAll[allindex].lastOnOffTime)
            this.tableDataAll[allindex].Distancetime = time
            this.tableDataAll[allindex].programData=JSON.parse(this.tableDataAll[allindex].programData)
          })

        }
        if (allpile != -1) {
          let dava = dataJson.msg
          let keys = Object.keys(dava);
          selt.$nextTick(() => {
            if (pile != -1) {
              for (let item of keys) {
                this.probe_tableData[pile][item] = dava[item]
              }
              
            }
            for (let item of keys) {

              this.probe_tableDataAll[allpile][item] = dava[item]
            }
          })

        }
        if(this.dialogVisible && !this.getAirControlbool){
          let dava = dataJson.msg
          this.getAirControlbool=true
          this.getAirControl = dava.airControlCode

        }
      }
      //console.log(dataJson);
      // 这里写拿到数据后的业务代码
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // 比如取消页面的loading
    },
    // requstWs() {
    //   // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
    //   closeWebsocket();
    //   // 跟后端协商，需要什么参数数据给后台
    //   // const obj = {
    //   //   monitorUrl: "xxxxxxxxxxxxx",
    //   //   userName: "xxxxxxxxxx",
    //   // };
    //   // 发起ws请求
    //   sendWebsocket(`ws://${window.document.location.host}${this.$API.websocket}${this.$store.getters.user.id}`,'', this.wsMessage, this.wsError);
    // },

    setPermission() {
      let role_permissions = this.$store.getters.rolePermissions;

     if(role_permissions){
      for (let item of role_permissions) {
        switch (item.action) {
              case "control":
                this.controlPermission = true;
                break;
              case "threshold":
                this.thresholdPermission = true;
                break
              default:
                break;
            }
      }
    }
    },
    // 修改父组件的值
    changeShowPlan() {
      this.$emit("changeShowPlan", true);
    },
   
    // 获取区域数据
    getAreaData() {
      let id = this.organId;
      //console.log(id)
      ajax.post({
        url: this.$API.getArea,
        data: { organId: id },
        success: (response) => {
          // console.log(response)
          const resp = response.data;
          this.treeData = resp;
          if (resp.length > 0) {
            this.areaId = resp[0].id;
            this.areatype = resp[0].type

            this.getChannelData();
          }
        },
      });
    },
    datalistsetup(row) {
      console.log(row)
      this.Plugsetupshow = true
      this.pojoGrouptitle=row.channelName
      let prob110 = row.probeKindCode == 110
      this.probeKindCode110=prob110
      this.probeKindCode202 = [202,110,401,1801,2101].includes(Number(row.probeKindCode))
     
      this.pojoGroup.ov_electricity = row.eleOvElectricity == null || row.eleOvElectricity == -1 ? 0 : parseInt(row.eleOvElectricity)
      this.pojoGroup.ov_alarm = row.eleOvAlarm == null||row.eleOvAlarm == -1 ? 0 : parseInt(row.eleOvAlarm)
      this.pojoGroup.ov_restore = row.eleOvRestore == null||row.eleOvRestore == -1 ? 0 : parseInt(row.eleOvRestore)
      this.pojoGroup.ov_alarm_value = row.eleOvAlarmValue == null || row.eleOvElectricity == -1 ? '' : row.eleOvAlarmValue
      this.pojoGroup.ov_restore_value = row.eleOvRestoreValue == null || row.eleOvRestoreValue == -1 ? '': row.eleOvRestoreValue
      this.pojoGroup.ov_buzzer = row.eleOvBuzzer == 0 ||row.eleOvBuzzer== null||row.eleOvBuzzer == -1 ? false : true //过压蜂鸣器
      this.pojoGroup.uv_electricity = row.eleUvElectricity == null ? 0 : parseInt(row.eleUvElectricity)
      this.pojoGroup.uv_alarm = row.eleUvAlarm == null||row.eleUvAlarm == -1 ? 0 : parseInt(row.eleUvAlarm)
      this.pojoGroup.uv_restore = row.eleUvRestore == null ||row.eleUvRestore == -1 ? 0 : parseInt(row.eleUvRestore)
      this.pojoGroup.uv_alarm_value = row.eleUvAlarmValue == null || row.eleUvAlarmValue == -1 ? '' : row.eleUvAlarmValue
      this.pojoGroup.uv_restore_value = row.eleUvRestoreValue == null || row.eleUvRestoreValue == -1? '' : row.eleUvRestoreValue
      this.pojoGroup.uv_buzzer = row.eleUvBuzzer == 0||row.eleUvBuzzer== null ||row.eleUvBuzzer== -1 ? false : true //欠压蜂鸣器
      this.pojoGroup.ol_electricity = row.eleOlElectricity == null ? 0 : parseInt(row.eleOlElectricity)
      this.pojoGroup.ol_alarm = row.eleOlAlarm == null||row.eleOlAlarm == -1 ? 0 : parseInt(row.eleOlAlarm)
      this.pojoGroup.ol_restore = row.eleOlRestore == null||row.eleOlRestore == -1 ? 0 : parseInt(row.eleOlRestore)
      this.pojoGroup.ol_alarm_value = row.eleOlAlarmValue == null || row.eleOlAlarmValue == -1 ? '' : row.eleOlAlarmValue
      this.pojoGroup.ol_restore_value = row.eleOlRestoreValue == null || row.eleOlRestoreValue == -1 ? '': row.eleOlRestoreValue
      this.pojoGroup.ol_buzzer = row.eleOlBuzzer == 0||row.eleOlBuzzer== null||row.eleOlBuzzer== -1 ? false: true //欠压蜂鸣器
      this.pojoGroup.tem_electricity = row.eleTemElectricity == null ? 0 : parseInt(row.eleTemElectricity)
      this.pojoGroup.tem_alarm = row.eleTemAlarm == null ||row.eleTemAlarm == -1? 0 : parseInt(row.eleTemAlarm)
      this.pojoGroup.tem_restore = row.eleTemRestore == null|| row.eleTemRestore == -1 ? 0 : parseInt(row.eleTemRestore)
      this.pojoGroup.tem_alarm_value = row.eleTemAlarmValue == null || row.eleTemAlarmValue==-1 ?'' : row.eleTemAlarmValue
      this.pojoGroup.tem_restore_value = row.eleTemRestoreValue == null || row.eleTemRestoreValue==-1? '' : row.eleTemRestoreValue
      this.pojoGroup.tem_buzzer = row.eleTemBuzzer == 0|| row.eleTemBuzzer == null|| row.eleTemBuzzer == -1 ? false :true
      this.pojoGroup.switch_enable = row.eleSwitchEnable == null ? true : row.eleSwitchEnable == 0 ? false : true
      this.pojoGroup.duration = row.eleDuration == null||row.eleDuration == -1 ? '' : row.eleDuration
      this.pojoGroup.lp_alarm = parseInt(row.eleLpAlarm)
      this.pojoGroup.lp_buzzer = row.eleLpBuzzer == 1 ? true : false
      this.pojoGroup.lp_restore = parseInt(row.eleLpRestore)
      this.pojoGroup.lp_run_time = row.eleLpRunTime == null|| row.eleLpRunTime == -1 ? '' : row.eleLpRunTime
      this.pojoGroup.lp_electricity = parseInt(row.eleLpElectricity)
      this.pojoid = this.probeKindCode202 ? row.probeId : row.probeId
      this.pojoGroup.switchdurationEnable = row.eleDuration == 0 ||row.eleDuration == null ||row.eleDuration == -1 ? false : true
    },
    //设定透传面板延迟关闭时间 
    delayCloseSetup(row) {
      let delayClose=row.programData&&row.programData.hasOwnProperty('delayClose')?row.programData.delayClose:0
      this.dialogDelayCloseVisible=true
      let [hours, minutes, remainingSeconds] = secondsToHMS(delayClose);
      this.delayCloseform={
        id:row.id,
        probeId:row.probeId,
        channel:row.channel,
        name:row.channelName,
        delayClose:delayClose,
        isDelayClose:delayClose!=0?true:false,
        hour:delayClose!=0?hours:0,
        minute:delayClose!=0?minutes:0,
        second:delayClose!=0?remainingSeconds:0,
      }
    },
    handleDelayCloseChange(value,type){
       setTimeout(() => {
             this.$nextTick(() => {
      if(value==undefined ){
        switch (type) {
          case 'hour':
           this.delayCloseform.hour = 0
           break
          case 'minute':
            this.delayCloseform.minute =0
            break
          case 'second':
            this.delayCloseform.second =0
            break
        }
      }
      this.delayCloseform.delayClose = 
      this.delayCloseform.hour * 3600 +
      this.delayCloseform.minute * 60 +
      this.delayCloseform.second
      let [hours, minutes, remainingSeconds] = secondsToHMS(this.delayCloseform.delayClose );
   
     
      this.delayCloseform.hour =hours
      this.delayCloseform.minute =minutes
      this.delayCloseform.second =remainingSeconds})
      },100)
    
  
    },
    setDelayClose(){
         this.$confirm(`确定设置${this.delayCloseform.name}延时关闭?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data={
              probeId:this.delayCloseform.probeId,
              channel:this.delayCloseform.channel,
              delayClose:this.delayCloseform.isDelayClose?this.delayCloseform.delayClose:0,
            }
            ajax.post({
              url: this.$API.setTransmissionProbeProgram + data.probeId,
              data: data,
              success: (response) => {
                 this.$message({
                  message: '设置成功',
                  type: "success",
                });
                let allindex = this.tableDataAll.findIndex(data => data.id == this.delayCloseform.id )
                let index = this.tableData.findIndex(data => data.id == this.delayCloseform.id)
                if(this.tableDataAll[allindex].programData){
                    this.tableDataAll[allindex].programData.delayClose =data.delayClose
                    this.tableData[index].programData.delayClose =data.delayClose
                }
                else{
                  this.tableDataAll[allindex].programData={
                    delayClose:data.delayClose
                  }
                  this.tableData[index].programData={
                    delayClose:data.delayClose
                  }
                }
              

                this.dialogDelayCloseVisible=false
              },
            });
        }).catch(() => {
         
        });
     
    },
    datalistswsetup(row, numer) {
      console.log(row)
      this.Plugswsetupshow = true

      this.swsetupgrop.state = row.state
      this.swsetupgrop.name = row.channelName
      this.swsetupgrop.number = numer
      this.swsetupgrop.id = row.probeId
      this.swsetupgrop.channel = row.channel
      this.swsetupgrop.key = this.probe_tableData.findIndex(data => data.probeId == row.probeId)

    },
    //设定温湿度门磁设置 
    doorContactSetup(data) {
      let doorContastProgramData=data.programData
    
      this.doorContactForm={
        id:data.id,
        probeId:data.probeId,
        channel:data.channel,
        name:data.channelName,
        tem_alarm_value:data.eleTemAlarmValue ?? '',
        tem_restore_value:data.eleTemRestoreValue??'',
        lowTemperatureThreshold:doorContastProgramData == null? '' : doorContastProgramData.lowTemperatureThreshold==undefined||doorContastProgramData.lowTemperatureThreshold==255?'':doorContastProgramData.lowTemperatureThreshold,
        lowTemperatureRecoveryThreshold:doorContastProgramData == null? '' : doorContastProgramData.lowTemperatureRecoveryThreshold==undefined||doorContastProgramData.lowTemperatureRecoveryThreshold==255?'':doorContastProgramData.lowTemperatureRecoveryThreshold,
        overHumidityThreshold:doorContastProgramData?.overHumidityThreshold??'',
        overHumidityRecoveryThreshold:doorContastProgramData?.overHumidityRecoveryThreshold??'',
        lowHumidityThreshold:doorContastProgramData?.lowHumidityThreshold??'',
        lowHumidityRecoveryThreshold:doorContastProgramData?.lowHumidityRecoveryThreshold??'',
        thermistorOverTemperatureThreshold:doorContastProgramData?.thermistorOverTemperatureThreshold??'',
        thermistorOverTemperatureRecoveryThreshold:doorContastProgramData?.thermistorOverTemperatureRecoveryThreshold??'',
        thermistorLowTemperatureThreshold:doorContastProgramData?.thermistorLowTemperatureThreshold??'',
        thermistorLowTemperatureRecoveryThreshold:doorContastProgramData?.thermistorLowTemperatureRecoveryThreshold??'',
        eleOpenAlarmValue: data.eleOpenAlarmValue??'',
        eleOpenAlarmSpace: data.eleOpenAlarmSpace??'',
      }
        this.dialogDoorContactVisible=true
    },
    
    setDoorContact(){
         this.$confirm(`确定设置${this.doorContactForm.name}阈值?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data={
             ...this.doorContactForm
            }
            ajax.post({
              url: this.$API.setTransmissionProbeProgram + data.probeId,
              data: data,
              success: (response) => {
                 this.$message({
                  message: '阈值编程命令下发成功',
                  type: "success",
                });
                
              

                this.dialogDelayCloseVisible=false
              },
            });
        }).catch(() => {
         
        });
     
    },
    //水表编程
    waterFormSetup(item){
     const { 
        programData: { 
          heartbeatInterval = 1,
          waterPressureChangeThreshold = 1,
          waterPressureSamplingInterval =30,
          waterMeterReportThreshold = 1,
          waterMeterType=0,
          waterHighPressureThreshold = '',
          waterHighPressureRecoveryThreshold = '',
          waterLowPressureThreshold = '',
          waterLowPressureRecoveryThreshold ='',
          waterPressure=null,
          // lowResistance = '',
          // highResistance ='',
        }={},
        id,
        probeId,
        channel,
        channelName,
        targetCategoryId,
      } = item || {};
      this.waterForm = {
      ...this.waterForm, // 保留原有属性
      id,
      probeId,
      channel,
      channelName,
      name: channelName,
      heartbeatInterval,
      waterPressureChangeThreshold,
      waterPressureSamplingInterval,
      waterMeterReportThreshold,
      dialogVisible: true,
      targetCategoryId,
      waterMeterType,
      // 条件属性展开
      ...([1,2].includes(waterMeterType) && {
        waterHighPressureThreshold,
        waterHighPressureRecoveryThreshold,
        waterLowPressureThreshold,
        waterLowPressureRecoveryThreshold,
        waterPressure
        //lowResistance,
        //highResistance
      })

    };
    },
    setWaterProgram(){
      let isExistnull=hasEmptyOrNullValues(this.waterForm,'',this.waterForm.targetCategoryId)
      
      if(isExistnull){
      this.setTransmissionProbeProgramSubmit(this.waterForm, () => {
        this.waterForm.dialogVisible = false; // 关闭弹窗的回调函数
      });
      }
    },

    //水表参数
    waterProgramSetup(item){
      const { 
        extendInfo: { 
          cumulativeCount = 0,
          waterMeterType=0
        }={},
        itemHistoryValue=0,
        itemTransformerCoefficient = 1,
        probeId,
        channelName,
        itemMaxWaterPressure= 0,
        targetCategoryId
      } = item || {};
      ajax.get({
            url: this.$API.getProbeById + probeId,
            success: (response) => {
              //console.log(response)
              
              let extendProperty = JSON.parse(response.data.extendProperty || '{}');
              const { maxWaterPressure=itemMaxWaterPressure,historyValue=itemHistoryValue,transformerCoefficient = itemTransformerCoefficient} = extendProperty
             this.waterForm.waterMeterType=waterMeterType
             this.waterForm.targetCategoryId=targetCategoryId
              this.waterParameter = {
                ...this.waterParameter,
                waterMeterType,
                cumulativeCount,
                historyValue,
                transformerCoefficient,
                probeId,
                channelName,
                maxWaterPressure,
                targetCategoryId,
                dialogVisible:true
              }
            },
          });
    },
    //历史读数与单位设置
    setWaterHistoryValue(){
      const {
        historyValue,
        transformerCoefficient,
        maxWaterPressure,
        channelName,
        probeId,
      } = this.waterParameter;

      // 对需要取绝对值的属性单独处理
      const processedData = {
        historyValue: Math.abs(historyValue || 0),
        transformerCoefficient: Math.abs(transformerCoefficient || 0),
        maxWaterPressure: Math.abs(maxWaterPressure || 0),
        channelName,
        probeId,
      };
       this.$confirm(`确定设置${channelName}参数?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.post({
              url: this.$API.updateProbeCoefficient + probeId,
              data: processedData,
              success: (response) => {
                 this.$message({
                  message: '设置参数命令下发成功',
                  type: "success",
                });
                
              

                this.dialogDelayCloseVisible=false
              },
            });
        })
        .catch(() => {
         
        });
      
    },
    //读数同步设置
    setWaterCumulativeCount(){
      const {
        cumulativeCount,
        transformerCoefficient,
        channelName,
        probeId
      } = this.waterParameter
      if(cumulativeCount==''){
         this.$message({
          message: '读数不能为空',
          type: "warning",
        });
        return
      }
       this.$confirm(`确定设置${channelName}读数?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.post({
              url: this.$API.setTransmissionProbeProgram + probeId,
              data: {cumulativeCount:(Number(cumulativeCount)/transformerCoefficient),channel: 1,probeId},
              success: (response) => {
                 this.$message({
                  message: '设置读数命令下发',
                  type: "success",
                });
                
              

                this.dialogDelayCloseVisible=false
              },
            });
        })
        .catch(() => {
         
        });
    },
    //多路温度
    alarmTemperatureProgramSetup(data) {
      const { programData: { alarmTemperatureProgramList }, id, probeId, channel,channelName } = data;

      this.alarmTemperatureProgramForm = {
        ...this.alarmTemperatureProgramForm,
        id,
        channelName,
        probeId,
        channel,
        
      };
      if (alarmTemperatureProgramList) {
        this.alarmTemperatureProgramForm.alarmTemperatureProgramList = 
          this.alarmTemperatureProgramForm.alarmTemperatureProgramList?.map((item, index) => 
            alarmTemperatureProgramList[index] ?? item
          ) ?? [...alarmTemperatureProgramList];
      }
      this.dialogAlarmTemperatureProgramVisible=true
      
    },
    alarmTemperatureReset(){
      const defaultValues = {
          overTemperatureAlarm: 65,
          overTemperatureAlarmRecovery: 55,
          lowTemperatureAlarm: -20,
          lowTemperatureAlarmRecovery: -10,
          overTemperatureWarning: 60,
          lowTemperatureWarning: -15,
        };

        this.alarmTemperatureProgramForm.alarmTemperatureProgramList.forEach(item => {
          Object.assign(item, defaultValues);
        });
    },
    setAlarmTemperature(){
         this.$confirm(`确定设置${this.alarmTemperatureProgramForm.channelName}阈值?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data={
             ...this.alarmTemperatureProgramForm
            }
            ajax.post({
              url: this.$API.setTransmissionProbeProgram + data.probeId,
              data: data,
              success: (response) => {
                 this.$message({
                  message: '阈值编程命令下发成功',
                  type: "success",
                });
                
              

                this.dialogDelayCloseVisible=false
              },
            });
        }).catch(() => {
         
        });
     
    },
    //NB配置
    NBdatalistsetup(row) {
      this.NBPlugsetupshow = true
      this.pojoGrouptitle=row.channelName
      this.NBpojoGroup.HighCurrent = eval('(' + row.nbHighCurrent + ')')
      
      this.NBpojoGroup.LowCurrent = eval('(' + row.nbLowCurrent + ')')
      this.NBpojoGroup.LowPower = eval('(' + row.nbLowPower + ')')
      this.NBpojoGroup.LowPowerFactor = eval('(' + row.nbLowPowerFactor + ')')
      this.NBpojoGroup.OverLoad = eval('(' + row.nbOverLoad + ')')
      this.NBpojoGroup.OverVoltage = eval('(' + row.nbOverVoltage + ')')
      this.NBpojoGroup.UnderVoltage = eval('(' + row.nbUnderVoltage + ')')
      this.NBprodid = row.probeId
    },
    //提交阈值设置
    NBthresholdSubmit(formName) {
      let self = this

      this.$refs[formName].validate((valid) => {
        if (valid) {
          ajax.post({
            url: this.$API.nbConfig + self.NBprodid,
            data: self.NBpojoGroup,
            success: (response) => {
              //console.log(response)
              if (response.success) {
                this.$message({
                  message: '编程下发中',
                  type: "success",
                });
                // self.resetStartTime();
                // self.getProbeData();
              }
            },
          });
        }
      })
    },
    //重置阈值设置
    NBthresholdReset() {
      // console.log(JSON.parse(JSON.stringify(this.mopojoGroup)))
      // console.log(JSON.stringify(this.mopojoGroup))
      this.resetStartTime();
      this.NBpojoGroup = JSON.parse(JSON.stringify(this.NBmopojoGroup));
    },
    //三项
    Threedatalistsetup(row) {
      this.ThreePlugsetupchannel = 1
      this.ThreePlugsetupOldchannel=1
      this.ThreePlugsetupshow = true
      this.pojoGrouptitle=row.channelName
      this.probeKindCode = row.probeKindCode
      this.getChannelByProbeIdAndChannel(row.probeId)
    },
    closeThreepojoForm(){
      this.ThreePlugsetupshow = false
      this.ThreePlugsetupchannel = 1
      this.ThreePlugsetupOldchannel=1
    },
    Threechannelchannge(val){
       let channel =['A','B','C']
    
        this.$confirm(`即将离开<font style="color:red">${channel[this.ThreePlugsetupOldchannel -1]}相</font>,请确保当前阈值已经保存提交?`, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '切换',
          cancelButtonText: '取消',
          type: 'warning',
          
        }).then(() => {
          this.ThreePlugsetupOldchannel=val
          this.getChannelByProbeIdAndChannel(this.Threepojoid)
        }).catch(() => {
         this.ThreePlugsetupchannel=this.ThreePlugsetupOldchannel
        });
      //
    },
    getChannelByProbeIdAndChannel(probeId){
      ajax.post({
        url: this.$API.getChannelByProbeIdAndChannel +`${probeId}/${this.ThreePlugsetupchannel}`,
        success: (response) => {
          // console.log(response)
            let row = response.data;
            this.ThreepojoGroup.ov_electricity = row.eleOvElectricity == null || row.eleOvElectricity == -1 ? 0 : parseInt(row.eleOvElectricity)
            this.ThreepojoGroup.ov_alarm = row.eleOvAlarm == null||row.eleOvAlarm == -1 ? 0 : parseInt(row.eleOvAlarm)
            this.ThreepojoGroup.ov_restore = row.eleOvRestore == null ||row.eleOvRestore == -1 ? 0 : parseInt(row.eleOvRestore)
            this.ThreepojoGroup.ov_alarm_value = row.eleOvAlarmValue == null  || row.eleOvAlarmValue==-1? '' : row.eleOvAlarmValue
            this.ThreepojoGroup.ov_restore_value = row.eleOvRestoreValue == null  || row.eleOvRestoreValue==-1? '' : row.eleOvRestoreValue
            this.ThreepojoGroup.ov_buzzer = row.eleOvBuzzer == 1 ? true : false //过压蜂鸣器
            this.ThreepojoGroup.uv_electricity = row.eleUvElectricity == null || row.eleUvElectricity == -1 ? 0 : parseInt(row.eleUvElectricity)
            this.ThreepojoGroup.uv_alarm = row.eleUvAlarm == null ||row.eleUvAlarm == -1 ? 0 : parseInt(row.eleUvAlarm)
            this.ThreepojoGroup.uv_restore = row.eleUvRestore == null|| row.eleUvRestore == -1 ? 0 : parseInt(row.eleUvRestore)
            this.ThreepojoGroup.uv_alarm_value = row.eleUvAlarmValue == null || row.eleUvAlarmValue==-1? '' : row.eleUvAlarmValue
            this.ThreepojoGroup.uv_restore_value = row.eleUvRestoreValue == null  || row.eleUvRestoreValue==-1? '': row.eleUvRestoreValue
            this.ThreepojoGroup.uv_buzzer = row.eleUvBuzzer == 1 ? true : false //欠压蜂鸣器
            this.ThreepojoGroup.ol_electricity = row.eleOlElectricity == null ||row.eleOlElectricity == -1 ? 0 : parseInt(row.eleOlElectricity)
            this.ThreepojoGroup.ol_alarm = row.eleOlAlarm == null ||row.eleOlAlarm == -1 ? 0 : parseInt(row.eleOlAlarm)
            this.ThreepojoGroup.ol_restore = row.eleOlRestore == null ||row.eleOlRestore == -1 ? 0 : parseInt(row.eleOlRestore)
            this.ThreepojoGroup.ol_alarm_value = row.eleOlAlarmValue == null || row.eleOlAlarmValue==-1? '' : row.eleOlAlarmValue
            this.ThreepojoGroup.ol_restore_value = row.eleOlRestoreValue == null  || row.eleOlRestoreValue==-1? '' : row.eleOlRestoreValue
            this.ThreepojoGroup.ol_buzzer = row.eleOlBuzzer == 1 ? true : false //欠压蜂鸣器
            this.ThreepojoGroup.tem_electricity = row.eleTemElectricity == null || row.eleTemElectricity == -1 ? 0 : parseInt(row.eleTemElectricity)
            this.ThreepojoGroup.tem_alarm = row.eleTemAlarm == null|| row.eleTemAlarm == -1 ? 0 : parseInt(row.eleTemAlarm)
            this.ThreepojoGroup.tem_restore = row.eleTemRestore == null||row.eleTemRestore ==-1  ? 0 : parseInt(row.eleTemRestore)
            this.ThreepojoGroup.tem_alarm_value = row.eleTemAlarmValue == null  || row.eleTemAlarmValue==-1? '' : row.eleTemAlarmValue
            this.ThreepojoGroup.tem_restore_value = row.eleTemRestoreValue == null || row.eleTemRestoreValue==-1? '' : row.eleTemRestoreValue
            this.ThreepojoGroup.tem_buzzer = row.eleTemBuzzer == 1 ? true : false
            this.ThreepojoGroup.switch_enable = row.eleSwitchEnable == null ? false : row.eleSwitchEnable == "1" ?  true: false
            this.ThreepojoGroup.lp_alarm = row.eleLpAlarm== null ? 1 : parseInt(row.eleLpAlarm)
            this.ThreepojoGroup.lp_buzzer = row.eleLpBuzzer == 1 ? true : false
            this.ThreepojoGroup.lp_restore = row.eleLpRestore== null ? 1 : parseInt(row.eleTemAlarm)
            this.ThreepojoGroup.lp_run_time = row.eleLpRunTime==null?2:row.eleLpRunTime
            this.ThreepojoGroup.lp_electricity = row.eleLpElectricity== null ? 1 : parseInt(row.eleLpElectricity)
            this.Threepojoid = row.probeId
            this.ThreepojoGroup.ele_charging_timeout = row.eleChargingTimeout == null ? 10 : row.eleChargingTimeout
            this.ThreepojoGroup.ele_func_buzzer = row.eleFuncBuzzer == "1" ? true : false
            this.ThreepojoGroup.ele_timeout_shutdown = row.eleTimeoutShutdown == null ? false :  row.eleTimeoutShutdown == "1" ?  true: false
            this.ThreepojoGroup.channel =this.ThreePlugsetupchannel
            
            //接地报警
            if(row.programData && this.probeKindCode=='2301'){
              
              const {overVoltageAlarm,lowVoltageAlarm,overloadAlarm,overTemperatureAlarm,lowPowerAlarm } =JSON.parse(row.programData)
            
              let keys = ['overVoltageAlarm', 'lowVoltageAlarm', 'overloadAlarm', 'overTemperatureAlarm', 'lowPowerAlarm'];

              keys.forEach((key) => {
                  this.ThreepojoGroup[key] = Number(eval(key));
              });
            }
        },
      });
    
    },
      //提交阈值设置
    thresholdSubmit(formName) {
      let self = this
      //判断
       
      let isExistnull=hasEmptyOrNullValues(self.pojoGroup,self.throughMoldCode)
    
      this.$refs[formName].validate((valid) => {
         if (isExistnull) {
          let keys = ['switch_enable', 'lp_buzzer', 'ol_buzzer', 'ov_buzzer', 'uv_buzzer','tem_buzzer'];
        
          keys.forEach((key) => {
             self.pojoGroup[key] = Number(self.pojoGroup[key]);
          });
          
          self.pojoGroup.duration = self.pojoGroup.switchdurationEnable ? self.pojoGroup.duration : 0
          self.pojoGroup.probeId = self.pojoid
         
          ajax.post({
            url: this.$API.setSocketProgram + self.pojoid,
            data: self.pojoGroup,
            success: (response) => {
              //console.log(response)
              if (response.success) {
                this.$message({
                  message: '编程下发中',
                  type: "success",
                });
               
                keys.forEach((key) => {
                    self.pojoGroup[key] = Boolean(self.pojoGroup[key]);
                });
                
                self.resetStartTime();
                self.getProbeData();
              }
            },
          });
        }
      })
    },
    //重置阈值设置
    thresholdReset() {
      // console.log(JSON.parse(JSON.stringify(this.mopojoGroup)))
      // console.log(JSON.stringify(this.mopojoGroup))
      this.resetStartTime();
      if (this.probeKindCode202) {
        this.mopojoGroup.switchdurationEnable = false
        this.mopojoGroup.duration = 0
        this.mopojoGroup.lp_alarm = 0
        this.mopojoGroup.lp_electricity = 0
        this.mopojoGroup.lp_restore = 0
        this.mopojoGroup.lp_buzzer = false
        this.mopojoGroup.lp_run_time = 0
        this.mopojoGroup.ov_electricity = 0
        this.mopojoGroup.ov_alarm_value = this.probeKindCode110 ? 265:265
        this.mopojoGroup.ov_restore_value = this.probeKindCode110 ? 255:255
        this.mopojoGroup.uv_electricity = 0
        this.mopojoGroup.ol_electricity = 0
        this.mopojoGroup.ol_alarm_value = '' //this.probeKindCode110 ? 9240:2000
        this.mopojoGroup.ol_restore_value = '' //this.probeKindCode110 ? 8800:1800
        this.mopojoGroup.tem_electricity = 0
        this.mopojoGroup.tem_alarm_value = 65
        this.mopojoGroup.tem_restore_value = 55
      }
      this.pojoGroup = JSON.parse(JSON.stringify(this.mopojoGroup));
    },
    // 获取区域通道信息
    getChannelData(showLoadingst) {
      let areaId = this.areaId;
      let showLoadingzd = showLoadingst == 'false' ? false : true

      if (areaId) {
        let self = this
          let url =  [1087,187,3849].includes(this.$store.getters.user.id) ? this.$API.getProbeChannelInfoByAreaId :this.isContainSub?this.$API.getProbeChannelByAreaIdAndSubAreaId:this.$API.getProbeChannelByAreaId
        ajax.get({
          url:url+ areaId,
           //url: this.$API.getProbeChannelByAreaId + areaId,
          //url: this.$API.getProbeChannelByAreaIdAndSubAreaId + areaId,
          // data: { id: areaId },
          showLoading: showLoadingzd,
          success: (response) => {
            if (response.success &&response.data) {
              let resp = response.data;
              for(let item of resp){
                item.Distancetime=''
              }
              this.allchannleList = resp.map(data=> data.id)
            this.settingSocketSubmit()
              this.getProbeData(resp)
              if (resp != undefined) {

                self.chargetableDataAll = resp.filter(data => data.targetCategoryId == 14);
                if (resp.filter(data => data.targetCategoryId != 14).length > 0) {
                  resp = resp.filter(data => data.targetCategoryId != 14);
                  for (let item of resp) {
                    item.programData=JSON.parse(item.programData)
                    item.extendProperty=item.extendProperty?JSON.parse(item.extendProperty):{}
                    item.channelat = item.channelName.split("_")
                    item.index = item.channelat[0].replace(/[^0-9]/ig, "")
                    if(item.index=='')
                    {
                      item.index = 9999
                    }
                  }
                   const targetCategoryId = [44,25,42]
                  // console.log(resp)
                  self.tableDataAll = resp.sort((n1, n2) => {
                    
                    if(targetCategoryId.includes(n1.targetCategoryId) && targetCategoryId.includes(n2.targetCategoryId))
                    { 
                      return n1.index - n2.index;
                    }
                    if(targetCategoryId.includes(n1.targetCategoryId)){
                      return 1
                    }
                    if(targetCategoryId.includes(n2.targetCategoryId)){
                      return 1
                    }
                    return n1.index - n2.index;
                  });
                  let num_6100 =  self.tableDataAll.filter(item => targetCategoryId.includes(item.targetCategoryId)).length
                  if(num_6100 == self.tableDataAll.length){
                    self.pageSize= 12
                  }
                  self.total = self.tableDataAll.length;
                 //console.log(self.tableDataAll)
                  self.initTableData();
                
                } else {
                  self.tableData = [];
                  self.tableDataCache = []
                  self.Electricalappliances = false
                  self.change_btn_Channel = false
                }
              } else {
                self.Electricalappliances = false
                self.change_btn_Channel = false
                self.tableData = [];
                self.tableDataCache = []
              }
            }else{
              self.tableData = [];
              self.tableDataCache = []
              self.chargetableDataAll=[]
              self.tableDataAll=[]
              self.total = 0
            }
          },
        });
      }
    },
    // 获取充电插座信息
    getProbeData(data) {
      let areaId = this.areaId;
      let areaType = this.areaType

      if (data) {
        const resp = data.filter(data => data.targetCategoryId == 14)

        if (resp != undefined) {

          if (resp.length > 0) {
            let probeall = resp.filter(data => data.state == 1)
            if (probeall.length > 0) {
              this.maxsr = Math.max.apply(null, probeall.map(item => item.currPower))
              this.minsr = Math.min.apply(null, probeall.map(item => item.currPower))
              this.maxst = Math.max.apply(null, probeall.map(item => item.realtimeTemperature))
              this.minst = Math.min.apply(null, probeall.map(item => item.realtimeTemperature))
            }

            for (let item of resp) {
              item.index = item.channelName.replace(/[^0-9]/ig, "")
            }
            this.probe_tableDataAll = resp.sort((n1, n2) => {
              return n1.index - n2.index;
            });
            this.probetotal = resp.length;
            this.probeinitTableData();
            this.probeDataAllpower = 0
            let numtoal = 0
            for (let item in this.probe_tableDataAll) {

              let num = parseFloat(this.probe_tableDataAll[item].currPower)
              // console.log(parseFloat(this.probe_tableDataAll[item].sp))
              if (num && this.probe_tableDataAll[item].state != "0") {

                numtoal += num

              }
            }
            this.probeinitTableData();
            setTimeout(() => {
              this.probeinitTableData();
              this.resetStartTime();
            }, 3000)
            this.probeDataAllpower = numtoal
            this.change_btn_probe = true
          } else {
            this.probe_tableData = [];
            this.probe_tableDataCache = []
            this.Electricalappliances = true
            this.change_btn_probe = false
          }
        } else {

          this.Electricalappliances = true
          this.change_btn_probe = false
          this.probe_tableData = [];
          this.probe_tableDataCache = []
        }
      }
    },
    initTableData() {
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      let start = (currentPage - 1) * pageSize;
      let end = start + pageSize;
      // //console.log(this.tableDataAll)
      this.tableData = this.tableDataAll.slice(start, end)
      this.tableDataCache = this.tableDataAll.slice(start, end)
      // //console.log(this.tableData)
      this.DistanceTime()
    },
    probeinitTableData() {

      let pageSize = this.probepageSize;
      let currentPage = this.probecurrentPage;
      let start = (currentPage - 1) * pageSize;
      let end = start + pageSize;
      // //console.log(this.tableDataAll)
      this.probe_tableData = this.probe_tableDataAll.slice(start, end);
    
      this.probe_tableDataCache = this.probe_tableDataAll.slice(start, end)
    },
    // 获取通道类型数据
    getTargetCategoryData() {

      ajax.get({
        url: this.$API.getDictTargetCategoryList,
        data: {},
        success: (response) => {
          // console.log(response)
          const resp = response.data;
          targetCategoryData = resp.filter(data => data.id != 14);
          this.typeselect = targetCategoryData
          chargetargetCategoryData = resp.filter(data => data.id == 14);
          this.chargetypeselect = chargetargetCategoryData

        },
        error: (res) => {
          this.$message({
            message: res.message,
            type: "error",
          });
        },
      });
    },
    getBatteryEvent(rowData) {
      console.log(rowData)
      var v = { probeId: rowData.probeId, channel: rowData.channel, electricalappliancesshow: false, probename: rowData.channelName };
      // console.log(v)
      this.$parent.showBatteryEvent(v);
    },

    handleNodeClick(data, node) {
      //console.log(data)
      console.log(node)
      this.areaId = data.id;
      this.getChannelData();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.initTableData();
    },
    handlePageChange(value) {
      this.currentPage = value;
      this.initTableData();
    },
    probehandleSizeChange(value) {
      this.probepageSize = value;
      this.probeinitTableData();
    },
    probehandlePageChange(value) {
      this.probecurrentPage = value;
      this.probeinitTableData();
    },
    //老化功能
    switchChangeageing(rowData) {
      // console.log(value, rowData)

      let probeId = rowData.probeId;
      let channel = rowData.channel;
      //lora门锁
      if (rowData.targetCategoryId === 12) {

        ajax.post({
          url: this.$API.getOpenLock,
          data: { id: rowData.probeId },
          showLoading: false,
          success: (res) => {
          },
        });
        return;
      }
      // 操作请求
      //console.log('控制码：channel', channel)
      ajax.post({
        url: this.$API.probeOperation,
        showLoading: false,
        data: { id: probeId, channel: channel },
        success: (response) => {
        },
      });
    },
    switchChangepolling(rowData) {

      if (rowData.targetCategoryId === 1 || rowData.targetCategoryId === 13) {
        this.$message({
          message: '不支持老化',
          type: 'warning',
        })
      }
      else {

        this.$confirm('即将进行每30秒一次的老化测试,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.switchChangeageing(rowData)
          clearInterval(pollingtime)
          pollingtime = setInterval(() => {
            this.switchChangeageing(rowData)
          }, 30000)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });


      }
    },
    //吊扇升降档
    ChangeCeilingfan(rowData, type, gear) {
      let message = parseInt(gear)
if(!this.controlPermission)
{
  this.$message({

message: '无权限控制',
type: "error",
});
  return 
}
      if (type == 'up') {
        message = gear == 5 ? 1 : message + 1
      }
      if (type == 'down') {
        message = gear == 1 ? 5 : message - 1
      }
      rowData.state = 1
      rowData.eleGear = message
      ajax.post({
        url: rowData.isTransmission?this.$API.requestProbeStateChange:this.$API.requestProbeFanChange,
        data: { state: rowData.state, probeId: rowData.probeId, channel: rowData.channel, gear: parseInt(message) },
        success: (response) => {
          //console.log(response)
          if (response.success) {
            clearTimeout(optimeout)
            optimeout = setTimeout(() => {
              // this.getChannelData('false');
            }, 5000)

            this.resetStartTime();
          }
        },
      });

    },
    // 通道开关操作
    switchChange(value, rowData, gear, statev) {
      // console.log(value, rowData)
      if(!this.controlPermission)
{
  this.$message({

message: '无权限控制',
type: "error",
});
  return 
}
      let probeId = rowData.probeId;
      let channel = rowData.channel;
      if(rowData.probeState==32769){
        return
      }
      //空调
      if (rowData.targetCategoryId === 1) {

        // 操作请求
        this.pojoAirConditionerData.isTransmission= rowData.isTransmission
        this.pojoAirConditionerData.C = rowData.airControlCode
        this.pojoAirConditionerData.open = value
        this.pojoAirConditionerData.M = rowData.airMode
        this.pojoAirConditionerData.D = rowData.airWindDirection
        this.pojoAirConditionerData.T = rowData.airTemperatureset
        this.pojoAirConditionerData.S = value
        this.pojoAirConditionerData.W = rowData.airSpeed
        this.pojoAirConditionerData.id = rowData.probeId
        this.pojoAirConditionerData.channel = rowData.channel
        this.pojoAirConditionerData.indoorTemperature= rowData.indoorTemperature=="null"?rowData.indoorTemperature:26
        this.pojoAirConditionerData.heating= rowData.airHeating
        this.addAirConditioningOperation(1)
        return;
      }
      //中央空调
      if (rowData.targetCategoryId === 13) {
        let self = this
        self.center_pojoAirConditionerData.S = value
        self.center_initAirControlData(rowData)
        this.addcenterAirConditioningOperation(1)
        // self.center_pojoAirConditionerData.S = value?
        return;
      }
      //lora门锁
      if (rowData.targetCategoryId === 12) {

        ajax.post({
          url: this.$API.requestNetLockOpen,
          data: { probeId: rowData.probeId, channel: rowData.channel },
          showLoading: true,
          success: (res) => {
            //console.log(res)
            if (res.success) {
              this.$message({
                message: res.message,
                type: "success",
              });
            }
          },
        });
        return;
      }
      //吊扇
      if (  ['36','48'].includes(rowData.probeMoldCode)) {

        let state = statev == null ? rowData.state == 1 ? 0 : 1 : statev
        let message = gear == null ? rowData.eleGear : gear
        rowData.state = state
        rowData.eleGear = message

        ajax.post({
          url: this.$API.requestProbeStateChange,
          data: { state: state, probeId: rowData.probeId, channel: rowData.channel, gear: parseInt(message) },
          success: (response) => {
            //console.log(response)
            if (response.success) {
              clearTimeout(optimeout)
              optimeout = setTimeout(() => {
                // this.getChannelData('false');
              }, 5000)

              this.resetStartTime();
            }
          },
        });
        return;
      }

      //级联空调
      if (rowData.targetCategoryId === 15) {
        // 操作请求
        ajax.post({
          url: this.$API.requestProbeStateChange,
          data: { state: value, probeId: rowData.probeId, channel: rowData.channel, operatType: 1 },
          success: (response) => {
            //console.log(response)
            if (response.success) {


              this.resetStartTime();
            }
          },
        });
        return;
      }
      //窗帘
      if (rowData.targetCategoryId === 22) {
        let state = rowData.state

        ajax.post({
        url: this.$API.requestProbeStateChange,
        data: { probeId: probeId, channel: channel,state:state},
        success: (response) => {
          //console.log(response)
          if (response.success) {
           return
          }
        },
      });
        return;
      }
      //调光
      if (rowData.probeMoldCode == 39) {
        let state = rowData.state
        let brightness = rowData.brightness
        ajax.post({
        url: this.$API.requestProbeStateChange,
        data: { probeId: probeId, channel: channel,state:state,brightness:brightness},
        success: (response) => {
          //console.log(response)
          if (response.success) {
           return
            //this.resetStartTime();
          }
        },
      });
        return;
      }
      // 操作请求
      ajax.post({
        url: this.$API.requestProbeStateChange,
        data: { state: value, probeId: rowData.probeId, channel: rowData.channel },
        success: (response) => {
          //console.log(response)
          if (response.success) {
            clearTimeout(optimeout)
            optimeout = setTimeout(() => {
              // console.log("1")
              // this.getChannelData('false');
            }, 5000)

            this.resetStartTime();
          }
        },
      });
    },
    // 烟感指令下发 
    setSmokeDetection(rowData,action){
      ajax.post({
        url: `${this.$API.setSmokeDetectionAction}/${rowData.probeId}/${action}`,
        success: (response) => {
          if(action==1){
            this.$message({
              message: '消音成功',
              type: "success",
            });
          }else{
           
            this.$message({
              message: '暂停报警成功',
              type: "success",
            });
          }
         
        },
      });
    },
    // 点击遥控器，显示遥控器设置弹框
    airControl(rowData) {
      this.initAirControlData(rowData);
      this.dialogVisible = true;
      //console.log(this.pojoAirConditionerData)
      this.customcontrolbool = false;
      this.airListvalue = null;
      this.airCodevalue = null;
      this.getAirControl=rowData.airControlCode
    },
    center_airControl(rowData) {
      this.center_initAirControlData(rowData);
      //console.log(this.pojoAirConditionerData)
      this.dialogVisible_center = true;
    },
    // 点击遥控器，显示遥控器设置弹框
    cascade_airControl(rowData) {
      this.initAirControlData(rowData);
      //console.log(this.pojoAirConditionerData)
      this.dialogCascadeVisible = true;
    },
    //Lora门锁
    LoraLockControl(rowData) {
      //mute 静音
      //normallyOpen 上班模式
      //isopen 禁止本地开门 
      let self = this
      self.loralockGroupshow = true
      self.loralockGroup.id = rowData.probeId
      ajax.post({
        url: this.$API.getLockState,
        data: { id: rowData.probeId },
        success: (response) => {

          self.$nextTick(() => {
            self.loralockGroup.id = rowData.probeId
            self.loralockGroup.mute = response.data.mute
            self.loralockGroup.normallyOpen = response.data.normallyOpen
            self.loralockGroup.isopen = response.data.isopen

          })
          self.loralockGroupshow = true
          this.resetStartTime();
        },
      });
    },
    Lora_mute_Change() {
      let self = this
      ajax.post({
        url: this.$API.setLockMute,
        data: { id: self.loralockGroup.id, operational: self.loralockGroup.mute },
        success: (response) => {
          if (response.success) {
            this.$message({
              message: response.message,
              type: "success",
            });
            this.resetStartTime();
          }
        },
      });
    },
    Lora_normallyOpen_Change() {
      let self = this
      if (self.loralockGroup.isopen != 1) {
        ajax.post({
          url: this.$API.setLockOpenMode,
          data: { id: self.loralockGroup.id, operational: self.loralockGroup.normallyOpen },
          success: (response) => {
            if (response.success) {
              this.$message({
                message: '设置成功',
                type: "success",
              });
            }
            this.resetStartTime();
          },
        });
      }
      else {
        self.loralockGroup.normallyOpen = '0'
        this.$message({

          message: '请先取消禁止本地开门',
          type: "error",
        });
      }
    },
    Lora_isopen_Change() {
      let self = this
      if (self.loralockGroup.normallyOpen != 1) {
        ajax.post({
          url: this.$API.setLockEnable,
          data: { id: self.loralockGroup.id, operational: self.loralockGroup.isopen },
          success: (response) => {
            if (response.success) {
              this.$message({
                message: '设置成功',
                type: "success",
              });
              this.resetStartTime();
            }
          },
        });
      } else {
        self.loralockGroup.isopen = '0'
        this.$message({
          message: '请先取消上班模式',
          type: "error",
        });
      }
    },
    LoraPersonList(probeId) {
      let self = this
      self.loralockGroup.id = probeId
      ajax.get({
        url: this.$API.getLockUserList + probeId,
        success: (response) => {
          if (response.success) {
            self.LoraPersonListData = response.data
            self.LoraPersonListshow = true
            this.resetStartTime();
          }
        },
      });
    },
    addPersonbox() {
      let self = this
      this.LoraPresonForm.id = ''

      ajax.get({
        url: this.$API.getUserListByCustomerId + this.$store.getters.customerId,
        success: (response) => {
          if (response.success) {

            let attr = []
            self.LoraPersonListData.forEach(data => {
              attr.push(data.userId)
            });
            attr = new Set(attr)
            self.lockpersondata = new Set([...response.data].filter(item => !attr.has(item.id)))

            self.addLoraPersonListshow = true
          }
        },
      });
    },
    delPerson(id, probeId) {
      let self = this
      let ids = ''


      this.$confirm('此操作将用户删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post(this.$API.requestNetLockUnBindUser + probeId + "/" + id)
          .then(function (res) {
            if (res.data.success) {
              self.$message({
                message: "删除成功",
                type: "success",
              });
              self.LoraPersonList(self.loralockGroup.id)
              this.resetStartTime();
            }
          });

      }).catch(() => {

        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    addPerson(formName) {
      let self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          axios
            .post(this.$API.requestNetLockBindUser + self.loralockGroup.id, [self.LoraPresonForm.id])
            .then(function (res) {
              if (res.data.success) {
                self.$message({
                  message: "添加成功",
                  type: "success",
                });
                self.LoraPersonList(self.loralockGroup.id)
                this.resetStartTime();
              }
            });

        }
      })

    },
    setUserPersonPWlits(probeId) {
      let self = this
      ajax.get({
        url: this.$API.getnetLockUserAuthList + `${probeId}/${this.$store.getters.user.id}`,

        success: (response) => {
          if (response.success) {

            self.loralockGroup.id = probeId
            self.LoraPersonPWListData = response.data
            self.LoraPersonPWListshow = true
          }
        },
      });

    },
    shouldShowSetup(item) {
      const usermanagerCodes = [202, 110, 1801, 2101, 901,2301,];
      const thresholdCodes = [101, 102, 103, 104, 2501,1401, 1501,2201,2901,3501,3601,3701];
      const thresholdCategories = [15, 13, 1];
    
      return (usermanagerCodes.includes(parseInt(item.probeKindCode)) && this.usermanager > 0 && !item.isTransmission) ||
             (thresholdCodes.includes(parseInt(item.probeKindCode)) && this.thresholdPermission) ||
             (thresholdCategories.includes(parseInt(item.targetCategoryId)) && this.thresholdPermission);
    },
    getTitle(item) {
      const titles = {
        202: '设定阈值',
        110: '设定阈值',
        1801: '设定阈值',
        2101: '设定阈值',
        2201: '设定红外阈值',
        101: '设定延迟关闭时间',
        102: '设定延迟关闭时间',
        103: '设定延迟关闭时间',
        104: '设定延迟关闭时间',
        2501: '设定温湿度阈值',
        1501: '设定阈值',
        2301: '设定阈值',
        901: '设定阈值',
        15: '设定最低温度',
        13: '设定最低温度',
        1: '设定最低温度',
        2901:'设定系数',
        3501:'设定阈值',
        3601:'设定阈值',
        3701:'设定阈值',

      };
      return titles[parseInt(item.probeKindCode)] || titles[parseInt(item.targetCategoryId)] || '';
    },
    handleClick(item) {
      const actions = {
        202: this.datalistsetup,
        110: this.datalistsetup,
        1801: this.datalistsetup,
        2101: this.datalistsetup,
        2201: this.microwaveSetup,
        1401: this.microwaveSetup,
        101: this.delayCloseSetup,
        102: this.delayCloseSetup,
        103: this.delayCloseSetup,
        104: this.delayCloseSetup,
        2501: this.doorContactSetup,
        1501: this.Threedatalistsetup,
        2301: this.Threedatalistsetup,
        901: this.NBdatalistsetup,
        15: this.ProbeAirsetup,
        13: this.ProbeAirsetup,
        1: this.ProbeAirsetup,
        2901:this.transformerCoefficientSetup,
        3501:this.alarmTemperatureProgramSetup,
        3601:this.waterFormSetup,
        3701:this.microwaveSoundProgramSetup,
      };
      const action = actions[parseInt(item.probeKindCode)] || actions[parseInt(item.targetCategoryId)];
console.log(item)
      if (action) {
        action(item);
      }
    },
    setPersonPWlits(id) {

      let self = this
      self.LoraPresonPWForm.personId = id
      ajax.post({
        url: this.$API.getLockPersonAuthList,
        data: { personId: id, },
        success: (response) => {
          if (response.success) {
            self.LoraPersonPWListData = response.data
            if (!self.newpwupdate) {

              self.oldPWnum = response.data.length
            }
            if (self.newpwupdate) {

              self.newPWnum = response.data.length
              if (self.oldPWnum == self.newPWnum) {
                clearInterval(oldPWtime)
                oldPWtime = setInterval(() => {
                  this.setPersonPWlits(id)
                }, 5000)
              } else {
                this.$message({
                  type: 'success',
                  message: '添加成功!'

                });
                self.oldPWnum = response.data.length
                self.newpwupdate = false
                clearInterval(oldPWtime)
              }
            }

            self.LoraPersonPWListshow = true
            this.resetStartTime();
          }
        },
      });
    },
    addPersonPWbox(personnelid) {
      this.PersonPWtitle = '添加密码'


      this.LoraPresonPWForm.addtype = 0
      this.LoraPresonPWForm.content = ''
      this.LoraPresonPWForm.checkPass = ''
      this.LoraPresonPWForm.localDateTime = ''
      this.LoraPresonPWForm.valid = '2'

      this.valid2 = false
      this.addLoraPersonPWshow = true
      if (personnelid == 999) {
        this.LoraPresonPWForm.valid = '1'
        this.valid2 = true
        this.LoraPresonPWForm.personId = 999
      }
    },

    LoraPresonPW_valid_Change() {
      this.valid2 = this.LoraPresonPWForm.valid == '2' ? false : true
    },
    editPersonPW(id, valid) {
      this.PersonPWtitle = '修改密码'
      this.LoraPresonPWForm.id = id
      this.LoraPresonPWForm.addtype = 1
      this.LoraPresonPWForm.content = ''
      this.LoraPresonPWForm.checkPass = ''
      this.LoraPresonPWForm.localDateTime = ''
      this.LoraPresonPWForm.valid = valid.toString()
      this.valid2 = this.LoraPresonPWForm.valid == '2' ? false : true

      this.addLoraPersonPWshow = true

    },
    addPersonPW(formName) {
      let self = this


      let postFore = {}
      self.LoraPresonPWForm.probeId = self.loralockGroup.id

      postFore.content = self.LoraPresonPWForm.content
      postFore.type = self.LoraPresonPWForm.type
      // postFore.type= 2
      // postFore.content= '8AAC09E0'
      postFore.localDateTime = self.LoraPresonPWForm.localDateTime
      postFore.valid = parseInt(self.LoraPresonPWForm.valid)
      postFore.admin = self.LoraPresonPWForm.admin
      postFore.userId = this.$store.getters.user.id
      if (self.LoraPresonPWForm.addtype == 1) {
        postFore.id = self.LoraPresonPWForm.id
        console.log(self.LoraPresonPWForm.id)
      }
      if (self.LoraPresonPWForm.addtype == 0) {
        postFore.probeId = self.LoraPresonPWForm.probeId
        postFore.personId = self.LoraPresonPWForm.personId

      }
      self.$refs[formName].validate((valid) => {
        if (valid) {

          ajax.post({
            url: self.LoraPresonPWForm.addtype == 0 ? self.$API.setNetLockProgram : self.$API.editLockPersonAuth,
            data: postFore,
            success: (response) => {
              if (response.success) {
                self.LoraPresonPWForm.admin = 0
                if (self.LoraPresonPWForm.personId != 999) {
                  
                  if (self.LoraPresonPWForm.addtype == 0) {

                    self.$nextTick(() => {
                      self.newpwupdate = true
                    })
                  }
                  //this.setPersonPWlits(self.LoraPresonPWForm.personId)
                  setTimeout(() => {
                    // console.log("1")
                    this.setUserPersonPWlits(postFore.probeId)
                  }, 3000)


                }
                self.addLoraPersonListshow = false
                if (self.LoraPresonPWForm.personId != 999) {
                  this.$message({

                    message: '添加中!'
                  });
                }
                else {
                  this.$message({
                    type: 'success',
                    message: '添加中!'
                  });
                }
                self.addLoraPersonPWshow = false
                this.resetStartTime();
              }
            },
          });
        }
      });
    },
    ResendPersonPW(id, probeId) {
      ajax.post({
        url: this.$API.requestResendNetLockPassWord + id,

        success: (response) => {
          if (response.success) {
            this.$message({
              message: '密码重发中，请稍等'
            });
            setTimeout(() => {
              // console.log("1")
              this.setUserPersonPWlits(probeId)
            }, 4000)
          }
        },
      });
    },
    delPersonPW(id, probeId) {
      let self = this
      this.$confirm('此操作将该密码删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
          .post(this.$API.deleteNetLockCardProgram + probeId, [id])
          .then(function (res) {
            if (res.data.success) {
              self.$message({
                message: "密码删除中,请稍等",

              });
              setTimeout(() => {
                // console.log("1")
                self.setUserPersonPWlits(probeId)
              }, 4000)

            }
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击遥控器，显示遥控器设置弹框
    chnnelDetails(rowData) {
          var v = { targetCategoryId: rowData.targetCategoryId, probeId: rowData.probeId, channel: rowData.channel, probename: rowData.channelName, electricalappliancesshow: true, probeKindCode: rowData.probeKindCode };
        this.$parent.showChnnelInfo(v);
      // if(['54'].includes(rowData.probeMoldCode)){
      //   this.$store.dispatch("actions/setProbeId6100Action", rowData);
      //   this.$router.push({ path: '/sk6100line' })
      // }else{
      //   var v = { targetCategoryId: rowData.targetCategoryId, probeId: rowData.probeId, channel: rowData.channel, probename: rowData.channelName, electricalappliancesshow: true, probeKindCode: rowData.probeKindCode };
      //   this.$parent.showChnnelInfo(v);
      
      // }
    },
    // 初始化空调状态值
    initAirControlData(rowData) {
     
      let obj = {};
      obj.id = rowData.probeId;
      obj.type = "";
      obj.L = 1;
      obj.channelId =rowData.id
      obj.channel = rowData.channel
      obj.open = rowData.open
      obj.C = rowData.airControlCode;
      obj.S = rowData.state == 1 ? 1 : 0;
      obj.M = rowData.airMode=='null'?0:rowData.airMode;
      obj.T = rowData.airTemperatureset=='null'?26:rowData.airTemperatureset;
      obj.W = rowData.airSpeed=='null'?0:rowData.airSpeed;
      obj.D = rowData.airWindDirection=='null'?0:rowData.airWindDirection;
      
      obj.heating = rowData.airHeating=="null" || rowData.airHeating==0?32:rowData.airHeating;
      obj.indoorTemperature= rowData.airIndoortemperature =="null"?26:rowData.airIndoortemperature;
      obj.Keyboard = rowData.airKeyboard =="null"?0:rowData.airKeyboard;
      obj.Refrigeration = parseInt(rowData.airTempMax)!=0?parseInt(rowData.airTempMax): rowData.airRefrigeration =="null"|| rowData.airRefrigeration==0?16:rowData.airRefrigeration;
      obj.SystemType = rowData.airSystemType =="null"||rowData.airSystemType ==null?2:rowData.airSystemType;
      obj.Temperatureadjustment = rowData.airTemperatureadjustment =="null" ||rowData.airTemperatureadjustment ==null  ?0:rowData.airTemperatureadjustment;
      obj.isTransmission=rowData.isTransmission
      this.pojoAirConditionerData = obj;
      console.log(rowData,obj,this.pojoAirConditionerData)
      this.modeValue = rowData.airMode;
      this.speedValue = rowData.airSpeed;
      this.directionValue = rowData.airWindDirection;
    },
    // 初始化中央空调状态值
    center_initAirControlData(rowData) {
      //console.log(rowData)
      let self = this

      let obj = {};
      obj.id = rowData.probeId;


      obj.S = rowData.state
      obj.M = rowData.airMode;
      obj.T = rowData.airTemperatureset;
      obj.W = rowData.airSpeed;
      obj.K = rowData.airKeyboard;
      obj.IT = rowData.airIndoortemperature;
      obj.op = rowData.state
      self.center_pojoAirConditionerData = obj;
      self.center_modeValue = rowData.airMode;
      self.center_speedValue = rowData.airSpeed;
      self.center_keyboardValue = rowData.airKeyboard;
      self.center_pojoAirConditionerData.channel = rowData.channel;
      self.center_temperatureSetValue = rowData.airTemperatureset;
      self.center_pojoAirConditionerData.heating = rowData.airHeating
      self.center_pojoAirConditionerData.refrigeration = parseInt(rowData.airTempMax)!=0?parseInt(rowData.airTempMax):rowData.airRefrigeration
      self.center_pojoAirConditionerData.systemType = rowData.airSystemType
      self.center_pojoAirConditionerData.temperatureAdjustment = rowData.airTemperatureadjustment
      self.center_pojoAirConditionerData.indoorTemperature=rowData.airIndoortemperature =="null"?26:rowData.airIndoortemperature

    },
    //读取空调的控制码(通道id 返回sn)
    handAirControlCode(id) {
      let url = this.pojoAirConditionerData.isTransmission?this.$API.queryControlCode + this.pojoAirConditionerData.id:this.$API.getAirControlCode + id
      //点击开始学习
      if(this.pojoAirConditionerData.isTransmission){
        ajax.get(
          {
            url: url,
            success: () => {
              this.getAirControlbool = false
              this.getAirControlloading = this.$loading({
                lock: true,
                text: "获取控制码中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
              });
              setTimeout(() => {
                this.getAirControlloading.close();
              }, 5000)
            
          }
        });
      }else{
        this.getAirControlResultCount = 0;
        this.getAirControlloading = this.$loading({
          lock: true,
          text: "获取控制码中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        ajax.get(
          {
            url: url,
            success: (response) => {
              const id = response.data;
              this.getAirControlCode(id);
            },
          },
          true
        );
        }
      
    },
    closeairconditioner(){
      this.getAirControlbool = false
      this.getAirControl=''
    },
    setAirControl(id){
      if(this.getAirControl==''){
        this.$message.error('控制码不能为空');
      }
      else{
        this.$confirm('此操作将永久修改该空调控制码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.pojoAirConditionerData.isTransmission?this.$API.setControlCode + this.pojoAirConditionerData.id:this.$API.setProbeControlCode + id
          ajax.post({
          url: url +"/" +this.getAirControl,
          success: (response) => {
            //console.log(response)
            if (response.success) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          },
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        
      }
    },
    getAirControlCode(id) {
      this.getAirControlinterval = setInterval(() => {
        this.getAirControlResultCount++;
        if (this.getAirControlResultCount > 8) {
          this.getAirControlloading.close();
          clearInterval(this.getAirControlinterval);
         
          this.getAirControlbool = false
          this.$alert("获取控制码", "获取失败", {
            confirmButtonText: "确定",
            callback: () => {
             
            },
          });
        } else {
          ajax.get(
            {
              url: this.$API.getProbeLearningResult + id,
              success: (res) => {
                if (res.data !== -1) {
                  this.getAirControlloading.close();
                  clearInterval(this.getAirControlinterval);
                  //this.airconditionerchanner=res.data
                  
                    this.$alert("获取控制码成功", "获取成功", {
                      confirmButtonText: "确定",
                      callback: () => {
                        this.getAirControlbool = true
                        this.getAirControl=res.data.controlCode
                      },
                    });
                }
              },
            },
            true
          );
        }
      }, 4000);
    },
    //系数设置
    transformerCoefficientSetup(data){
      this.dialogTransformerCoefficientVisible=true
      let {id,probeId,channelName,extendProperty} = {...data,extendProperty: data.extendProperty || { transformerCoefficient: 1 } ,}

      Object.assign(this.transformerCoefficientForm, {
        id,probeId,channelName,
        extendProperty,
      })
    },
    transformerCoefficientSubmit(){
      let submitForm={
        ...this.transformerCoefficientForm,
        extendProperty:JSON.stringify(this.transformerCoefficientForm.extendProperty)
      }
      ajax.post({
          url: this.$API.modifyProbe + submitForm.probeId,
          data:submitForm,
          success: (response) => {
            //console.log(response)
            if (response.success) {
              this.getChannelData()
              this.dialogTransformerCoefficientVisible=false
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          },
        })
    },
    //打开设置最低
    ProbeAirsetup(data){
      this.ProbeAirMaxshow=true
      this.ProbeAirMax.value=data.airTempMax
      this.ProbeAirMax.key=data.id
    },
   
    //关闭设置最低
    closeProbeAirMax(){
      this.ProbeAirMax.value=""
      this.ProbeAirMax.key=null
    },
    ProbeAirMaxSubmit(){
      let self = this
      if(this.ProbeAirMax.value==0 || this.ProbeAirMax.value>=16){
      axios
      .post(this.$API.setProbeAirMaxTemp, [this.ProbeAirMax])
      .then(function (res) {
            if (res.data.success) {
              let obj = self.tableData.find(data=>data.id==self.ProbeAirMax.key)
              obj.airTempMax=self.ProbeAirMax.value
              self.$message({
                message: "设置成功",
                type: "success",
              });
            }
          });
        }
        else{
          self.$message({
                message: "空调温度不能低于16",
                type: "warning",
              });
        }
    },
    //
    // 温度加减
    handleTemperatureChange(changeType) {
      let temperatureNumber = parseInt(this.pojoAirConditionerData.T);
      if (changeType == "add") {
        temperatureNumber = temperatureNumber + 1;
      } else {
        temperatureNumber = temperatureNumber - 1;
      }
      // 判断温度范围
      if (temperatureNumber > this.pojoAirConditionerData.heating) {
        this.$message({
          message: "空调温度已经达到最高",
          type: "warning",
        });
      } else if (temperatureNumber < this.pojoAirConditionerData.Refrigeration) {
        this.$message({
          message: "空调温度已经达到最低",
          type: "warning",
        });
      
        temperatureNumber=this.pojoAirConditionerData.Refrigeration
        this.pojoAirConditionerData.T = temperatureNumber;
        
      } else {
        this.pojoAirConditionerData.T = temperatureNumber;
        this.addAirConditioningOperation();
      }
    },

    // 模式切换
    handleModeChange(value) {
      //console.log(value)
      this.pojoAirConditionerData.M = value;
      this.pojoAirConditionerData.type = "M";
      this.modeValue = value;
      //console.log('模式切换：', this.pojoAirConditionerData)
      this.addAirConditioningOperation();
    },
    // 风速切换
    handleSpeedChange(value) {
      //console.log(value)
      this.pojoAirConditionerData.W = value;
      this.pojoAirConditionerData.type = "W";
      this.speedValue = value;
      //console.log('风速切换：', this.pojoAirConditionerData)
      this.addAirConditioningOperation();
    },
    // 方向切换
    handleDirectionChange(value) {
      //console.log(value)
      this.pojoAirConditionerData.D = value;
      this.pojoAirConditionerData.type = "D";
      this.directionValue = value;
      //console.log('方向切换：', this.pojoAirConditionerData)
      this.addAirConditioningOperation();
    },
    // 空调操作请求
    addAirConditioningOperation(type) {
      console.log(type,123)
      this.resetStartTime();
      let AirConditioning = {}
      console.log(this.pojoAirConditionerData,)
      
      AirConditioning.controlCode =this.pojoAirConditionerData.isTransmission?'':this.customcontrolbool ? this.airCodevalue : this.pojoAirConditionerData.C
     
      AirConditioning.open = parseInt(this.pojoAirConditionerData.S??0)
      AirConditioning.mode = parseInt(this.pojoAirConditionerData.M??0)
      AirConditioning.windDirection = parseInt(this.pojoAirConditionerData.D??0)
      AirConditioning.temperatureSet = parseInt(this.pojoAirConditionerData.T??26)
      AirConditioning.state = parseInt(this.pojoAirConditionerData.S)
      AirConditioning.speed = parseInt(this.pojoAirConditionerData.W)
      AirConditioning.probeId = parseInt(this.pojoAirConditionerData.id)
      AirConditioning.channel = this.pojoAirConditionerData.channel
      AirConditioning.indoorTemperature = this.pojoAirConditionerData.indoorTemperature
      AirConditioning.heating=this.pojoAirConditionerData.heating
      
      AirConditioning.keyboard=this.pojoAirConditionerData.Keyboard
      AirConditioning.refrigeration=this.pojoAirConditionerData.Refrigeration
      AirConditioning.systemType=this.pojoAirConditionerData.SystemType
      AirConditioning.temperatureAdjustment=this.pojoAirConditionerData.Temperatureadjustment
      if (type == 1) {
        ajax.post({
          url: this.$API.requestProbeStateChange,
          data: AirConditioning,
          success: (response) => {
            //console.log(response)
            if (response.success) {
              clearTimeout(optimeout)
              optimeout = setTimeout(() => {
                // console.log("1")
                // this.getChannelData('false');
              }, 5000)

              this.resetStartTime();
            }
          },
        })
      }
      else {
        console.log()
        ajax.post({
          url: this.$API.requestProbeAirChange,
          data: AirConditioning,
          success: (response) => {
            //console.log(response)
            if (response.success) {
              clearTimeout(optimeout)
              optimeout = setTimeout(() => {
                // console.log("1")
                // this.getChannelData('false');
              }, 5000)

              this.resetStartTime();
            }
          },
        })
      }
    },
    addcenterAirConditioningOperation(type) {
      let obj = {};
      obj.probeId = this.center_pojoAirConditionerData.id
      obj.state = parseInt(this.center_pojoAirConditionerData.S??0)
      obj.mode = parseInt(this.center_pojoAirConditionerData.M??0)
      obj.temperatureSet = parseInt(this.center_pojoAirConditionerData.T??26)
      obj.speed = parseInt(this.center_pojoAirConditionerData.W??0)
      obj.keyboard = parseInt(this.center_pojoAirConditionerData.K)
      obj.open = parseInt(this.center_pojoAirConditionerData.op)
      obj.temperatureAdjustment = parseInt(this.center_pojoAirConditionerData.temperatureAdjustment)
      obj.systemType = parseInt(this.center_pojoAirConditionerData.systemType)
      obj.heating = parseInt(this.center_pojoAirConditionerData.heating)
      obj.refrigeration = parseInt(this.center_pojoAirConditionerData.refrigeration)
      obj.channel = parseInt(this.center_pojoAirConditionerData.channel)
      obj.indoorTemperature= parseInt(this.center_pojoAirConditionerData.indoorTemperature)
      obj.controlCode =1
      obj.windDirection =1
      if (type == 1) {
        ajax.post({
          url: this.$API.requestProbeStateChange,
          data: obj,
          success: (res) => {
            //console.log(res)
            if (res.success) {
              //this.getChannelData(false)
            }
          },
        });
      } else {
        ajax.post({
          url: this.$API.requestProbeAirChange,
          data: obj,
          success: (res) => {
            //console.log(res)
            if (res.success) {
              // this.getChannelData(false)
            }
          },
        });
      }
    },
    //中央空调
    // 温度加减
    center_handleTemperatureChange(changeType) {
      let temperatureNumber = parseInt(this.center_pojoAirConditionerData.T);
      console.log(this.center_pojoAirConditionerData)
      if (changeType == "add") {
        temperatureNumber = temperatureNumber + 1;
      } else {
        temperatureNumber = temperatureNumber - 1;
      }
      let min = this.center_pojoAirConditionerData.refrigeration==0?18:this.center_pojoAirConditionerData.refrigeration
      let max = this.center_pojoAirConditionerData.heating==0?28:this.center_pojoAirConditionerData.heating
      // 判断温度范围
      if(this.center_modeValue == 0){
      if (temperatureNumber > 32) {
        this.$message({
          message: "空调温度已经达到最高",
          type: "warning",
        });
      } else if (temperatureNumber < min) {
        this.$message({
          message: "空调温度已经达到最低",
          type: "warning",
        });
      } else {

        this.center_pojoAirConditionerData.T = temperatureNumber;


      }
      }
      else{
        if (temperatureNumber > max) {
        this.$message({
          message: "空调温度已经达到最高",
          type: "warning",
        });
      } else if (temperatureNumber < 10) {
        this.$message({
          message: "空调温度已经达到最低",
          type: "warning",
        });
      } else {

        this.center_pojoAirConditionerData.T = temperatureNumber;


      }
      }
    },
    center_handleModeChange(value) {
      //console.log(value)
      this.center_pojoAirConditionerData.M = value;
      this.center_pojoAirConditionerData.type = "M";
      this.center_modeValue = value;
      if(value == 0 && this.center_pojoAirConditionerData.T > 32){
        this.center_pojoAirConditionerData.T = 32
      }
      if(value == 0 && this.center_pojoAirConditionerData.T < 18){
        this.center_pojoAirConditionerData.T = 18
      }
      if(value == 1 && this.center_pojoAirConditionerData.T > 28){
        this.center_pojoAirConditionerData.T = 28
      }
      if(value == 1 && this.center_pojoAirConditionerData.T <10){
        this.center_pojoAirConditionerData.T = 10
      }
      //console.log('模式切换：', this.pojoAirConditionerData)

    },
    // 风速切换
    center_handleSpeedChange(value) {
      //console.log(value)
      this.center_pojoAirConditionerData.W = value;
      this.center_pojoAirConditionerData.type = "W";
      this.center_speedValue = value;
      //console.log('风速切换：', this.pojoAirConditionerData)

    },

    center_handleKeyboardChange(value) {
      //console.log(value)
      this.center_pojoAirConditionerData.K = value;
      this.center_pojoAirConditionerData.type = "K";
      this.center_keyboardValue = value;

    },
    //级联空调
    // 温度加减
    handleCascadeTemperatureChange(changeType) {
      let temperatureNumber = parseInt(this.pojoAirConditionerData.T);
      if (changeType == "add") {
        temperatureNumber = temperatureNumber + 1;
      } else {
        temperatureNumber = temperatureNumber - 1;
      }
      // 判断温度范围
      if (temperatureNumber > this.pojoAirConditionerData.heating) {
        this.$message({
          message: "空调温度已经达到最高",
          type: "warning",
        });
      } else if (temperatureNumber < this.pojoAirConditionerData.Refrigeration) {
        this.$message({
          message: "空调温度已经达到最低",
          type: "warning",
        });
    
        temperatureNumber = this.pojoAirConditionerData.Refrigeration
        this.pojoAirConditionerData.T = temperatureNumber;
        clearTimeout(temperatureChange)
        temperatureChange=null
        temperatureChange = setTimeout(() => {
          this.CascadeAirConditioningOperation(2, temperatureNumber);
            }, 1000)
      } else {
        this.pojoAirConditionerData.T = temperatureNumber;
        clearTimeout(temperatureChange)
        temperatureChange=null
        temperatureChange = setTimeout(() => {
          this.CascadeAirConditioningOperation(2, temperatureNumber);
            }, 1000)
     
      }
    },

    // 模式切换
    handleCascadeModeChange(value) {
      //console.log(value)
      this.pojoAirConditionerData.M = value;

      this.modeValue = value;
      //console.log('模式切换：', this.pojoAirConditionerData)
      this.CascadeAirConditioningOperation(3, value);
    },
    // 风速切换
    handleCascadeSpeedChange(value) {
      //console.log(value)
      this.pojoAirConditionerData.W = value;
      this.speedValue = value;
      //console.log('风速切换：', this.pojoAirConditionerData)
      this.CascadeAirConditioningOperation(4, value);
    },
    //级联空调控制
    CascadeAirConditioningOperation(operatType, state) {
      let CascadeAirConditioning = {}
      CascadeAirConditioning.probeId = parseInt(this.pojoAirConditionerData.id)
      CascadeAirConditioning.channel = this.pojoAirConditionerData.channel
      CascadeAirConditioning.operatType = operatType
      CascadeAirConditioning.state = state
      CascadeAirConditioning.heating=this.pojoAirConditionerData.heating?this.pojoAirConditionerData.heating:32
      CascadeAirConditioning.indoorTemperature=this.pojoAirConditionerData.indoorTemperature
      CascadeAirConditioning.keyboard=this.pojoAirConditionerData.Keyboard?this.pojoAirConditionerData.Keyboard:16
      CascadeAirConditioning.refrigeration=this.pojoAirConditionerData.Refrigeration
      CascadeAirConditioning.systemType=this.pojoAirConditionerData.SystemType
      CascadeAirConditioning.temperatureAdjustment=this.pojoAirConditionerData.Temperatureadjustment
      CascadeAirConditioning.open = parseInt(this.pojoAirConditionerData.S)
      CascadeAirConditioning.mode = parseInt(this.pojoAirConditionerData.M)
      CascadeAirConditioning.windDirection = parseInt(this.pojoAirConditionerData.D)
      CascadeAirConditioning.temperatureSet = parseInt(this.pojoAirConditionerData.T)
      CascadeAirConditioning.speed = parseInt(this.pojoAirConditionerData.W)
      CascadeAirConditioning.controlCode =1
      console.log(CascadeAirConditioning)
      ajax.post({
        url: this.$API.requestProbeAirChange,
        data: CascadeAirConditioning,
        success: (res) => {
          //console.log(res)
          if (res.success) {
            // this.getChannelData(false)
          }
        }
      });
    },
    //详细面板显示隐藏
    ClickActive(item, index) {
      console.log(item)
      if (item.active) {
        this.$set(item, 'active', false)  //为item添加不存在的属性，需要使用vue提供的Vue.set/this.$set( object, key, value )方法
      } else {
        this.$set(item, 'active', true)
      }
    },
    // 每次点击操作，重置开始时间
    resetStartTime() {
      let startTime = new Date();
      this.optionStartTime = startTime;
    },
    // 每15s取数据
    refreshData() {
      this.refreshInterval = setInterval(() => {
        let startTime = this.optionStartTime;
        let endTime = new Date();
        let timeDiff = endTime - startTime;
      }, 5000);
    },
    datalistQuery() {
      let self = this
      let tableDataAtransfer = []

      tableDataAtransfer = self.tableDataAll
      if (self.probeState !== '') {
        tableDataAtransfer = tableDataAtransfer.filter(data => data.state == self.probeState)

      }
      if (self.probeType) {
        tableDataAtransfer = tableDataAtransfer.filter(data => data.targetCategoryId == self.probeType)

      }
      self.searching = true
      self.tableData = tableDataAtransfer

      if (self.probeState === "" && self.probeType === "") {
        self.searching = false
        self.initTableData()
      }
    },
    //提交阈值设置
    ThreethresholdSubmit(formName) {
      let self = this
      let isExistnull=hasEmptyOrNullValues(self.ThreepojoGroup,self.throughMoldCode)
      this.$refs[formName].validate((valid) => {
        
        if (isExistnull) {
          let keys = ['switch_enable','ele_timeout_shutdown', 'lp_buzzer','ele_func_buzzer', 'ol_buzzer', 'ov_buzzer', 'uv_buzzer','tem_buzzer'];
          let keys2301 = ['overVoltageAlarm', 'lowVoltageAlarm', 'overloadAlarm', 'overTemperatureAlarm', 'lowPowerAlarm'];
          keys.forEach((key) => {
             self.ThreepojoGroup[key] = Number(self.ThreepojoGroup[key]);
          });
          
      
          if(this.probeKindCode=='2301'){
            keys2301.forEach((key) => {
             self.ThreepojoGroup[key] = Number(self.ThreepojoGroup[key]);
            });
          }
     
      self.ThreepojoGroup.ele_charging_timeout = self.ThreepojoGroup.ele_timeout_shutdown ? self.ThreepojoGroup.ele_charging_timeout : 0
      self.ThreepojoGroup.probeId = self.Threepojoid

          ajax.post({
            url: this.$API.setThreePhaseRailSwitchProgram + self.Threepojoid,
            data: self.ThreepojoGroup,
            success: (response) => {
              //console.log(response)
              if (response.success) {
                this.$message({
                  message: response.message,
                  type: "success",
                });
                keys.forEach((key) => {
                    self.ThreepojoGroup[key] = Boolean(self.ThreepojoGroup[key]);
                  });
                  
              
                  if(this.probeKindCode=='2301'){
                    keys2301.forEach((key) => {
                    self.ThreepojoGroup[key] = Boolean(self.ThreepojoGroup[key]);
                    });
                }
                self.resetStartTime();
                self.getProbeData();
              }
            },
          });
        }
      })
    },
    //重置阈值设置
    ThreethresholdReset() {
      // console.log(JSON.parse(JSON.stringify(this.mopojoGroup)))
      // console.log(JSON.stringify(this.mopojoGroup))
      this.resetStartTime();
      let channel =this.ThreepojoGroup.channel 
      this.ThreepojoGroup = JSON.parse(JSON.stringify(this.ThreemopojoGroup));
      this.ThreepojoGroup.channel = channel
    },
    //插座开关开启关闭
    ChargingsocketSW(val) {
      if(!this.controlPermission)
{
  this.$message({

message: '无权限控制',
type: "error",
});
  return 
}
      let self = this
      ajax.post({
        url: this.$API.requestProbeStateChange,
        data: { state: val, probeId: self.swsetupgrop.id, channel: self.swsetupgrop.channel },
        success: (response) => {
          //console.log(response)
          if (response.success) {
            self.swsetupgrop.state = self.swsetupgrop.state == 1 ? 0 : 1

            self.probe_tableData[self.swsetupgrop.key].state = self.swsetupgrop.state == 1 ? 1 : 0
            self.probe_tableData[self.swsetupgrop.key].eleState = self.swsetupgrop.state == 1 ? "00001" : "00000"



            this.resetStartTime();
          } else {
            this.$message({
              message: response.message,
              type: 'warning'
            });
          }
        },
      });
      // if(self.$store.getters.payconfig.enabled == 0 ||self.$store.getters.user.manager!=2){

      // ajax.post({
      //   url: this.$API.requestProbeStateChange,
      //   data: {state: val,probeId: self.swsetupgrop.id, channel: self.swsetupgrop.channel },
      //   success: (response) => {
      //     //console.log(response)
      //     if (response.success) {
      //       self.swsetupgrop.state=self.swsetupgrop.state==1?0:1

      //       self.probe_tableData[self.swsetupgrop.key].state=self.swsetupgrop.state==1?1:0
      //       self.probe_tableData[self.swsetupgrop.key].eleState=self.swsetupgrop.state==1?"00001":"00000"



      //       this.resetStartTime();
      //     }else{
      //         this.$message({
      //           message: response.message,
      //           type: 'warning'
      //         });
      //     }
      //   },
      //  });
      // }else{
      //   this.$message({
      //           message:'您为计费系统无法直接开启充电插座。',
      //           type: 'error'
      //         });
      // }
    },
    OldChargingsocketSWpolling(rowData, numer) {



      this.swsetupgrop.state = rowData.state
      this.swsetupgrop.name = rowData.name
      this.swsetupgrop.number = numer
      this.swsetupgrop.id = rowData.probe_id
      this.swsetupgrop.channel = rowData.channel
      this.swsetupgrop.key = this.probe_tableData.findIndex(data => data.probe_id == rowData.probe_id)

      this.$confirm('即将进行每30秒一次的老化测试,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.OldChargingsocketSW()
        clearInterval(socketpollingtime)
        socketpollingtime = setInterval(() => {
          this.OldChargingsocketSW()
        }, 30000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    //插座老化关闭
    OldChargingsocketSW() {
      let self = this
      // if(self.$store.getters.payconfig.enabled == 0 ||self.$store.getters.user.manager!=2){

      ajax.post({
        url: this.$API.probeOperation,
        data: { id: self.swsetupgrop.id, channel: self.swsetupgrop.channel },
        success: (response) => {
          //console.log(response)
          if (response.success) {
            self.swsetupgrop.state = self.swsetupgrop.state == 1 ? 0 : 1
            self.probe_tableData[self.swsetupgrop.key].state = self.swsetupgrop.state == 1 ? 1 : 0
            self.probe_tableData[self.swsetupgrop.key].eleState = self.swsetupgrop.state == 1 ? "00001" : "00000"
            self.probe_tableData[self.swsetupgrop.key].oldstate = 1


            this.resetStartTime();
          } else {
            this.$message({
              message: response.message,
              type: 'warning'
            });
          }
        },
      });
    },


    //刷新充电插座数据
    Refreshsocket(showLoadingst) {
      // let showLoadingzd =showLoadingst=='false'?false:true
      let self = this
      // self.loading = showLoadingzd
      let Refreshtiem = null
      clearTimeout(Refreshtiem)
      // let probe_tadalen =self.probe_tableData.length-1
      this.$set(showLoadingst, 'refresh', true)

      Refreshtiem = setTimeout(() => {
        this.$set(showLoadingst, 'refresh', false)
      }, 3000)
      if(showLoadingst.probeKindCode!='2201'){
      ajax.post({
        url: this.$API.getProbeState + showLoadingst.probeId,

        showLoading: false,
        success: (response) => {
          setTimeout(() => {
             ajax.post({
              url: this.$API.getProbeSensorData + showLoadingst.probeId,

              showLoading: false,
              success: (response) => {
                for (const prop in response.data) {
                    if (showLoadingst.hasOwnProperty(prop)) {
                        showLoadingst[prop] = response.data[prop];
                    }
                }
              },
            });
          }, 5000)
        },
      });
    }else{
      ajax.get({
              url: this.$API.getProbeRealStateByDs + showLoadingst.id,
              showLoading: false,
              success: (response) => {
                for (const prop in response.data) {
                    if (showLoadingst.hasOwnProperty(prop)) {
                        showLoadingst[prop] = response.data[prop];
                    }
                }
              },
            });
    }
    },
    Doorlock_cop(probeid) {
      this.Doorlock_copshow = true
      this.Doorlock_copobjectid = ''
      this.Doorlock_copid = probeid
    },
    requestNetLockInput(row) {
      this.$confirm('确定进入录卡模式?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.post({
          url: this.$API.requestNetLockInput,
          data: { channel: row.channel, probeId: row.probeId },
          showLoading: false,
          success: (response) => {
            row.lockReadCard = 1
            this.$message({
              message: '正在进入录卡模式，请稍等',
            });
          }
      });
        }).catch(() => {
               
        });
    
    },
    SubmitDoorlockcop() {
      this.$confirm("确定将复制对象的用户和密码复制到操作锁? 此操作不可逆", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ajax.post({
            url: this.$API.addClonedoorlock,
            data: { newProbeId: this.Doorlock_copid, oldProbeId: this.Doorlock_copobjectid },
            success: (response) => {
              if (response.success) {
                this.$message({
                  message: response.message,
                  type: "success",
                });
              }
            },
          });
        })
        .catch(() => {

        });
    },
    Doorlock_instruct(probeId) {
      let self = this
      this.Doorlock_instructshow = true
      this.Doorlock_copid = probeId
      ajax.post({
        url: this.$API.getMessagelist,
        data: { id: probeId },
        success: (response) => {

          self.Doorlock_instructlist = response.data
        },
      });

    },
    instructrepeat(id) {
      let self = this
      ajax.post({
        url: this.$API.modifymessage,
        data: { id: id },
        success: (response) => {
          if (response.success) {
            this.$message({
              duration: 5000,
              message: "重发成功",
              type: "success",
            })
          }
          self.Doorlock_instruct(self.Doorlock_copid)

        }
      });
    },
    //吊扇运行时长
    ceilingfanruntimeChange(item) {
      let {channel,isTransmission,eleRunTime,probeId,programData} = item
      this.fanObj={
        channelNum:channel,
        isTransmission:isTransmission
      }
    
      if(isTransmission){
        
        let runTime = programData?.delayClose??0

        this.runTime = parseInt(runTime) == (2550 * 60) ? 2550 : parseInt(runTime / 6)
      }else
      {
        this.runTime = parseInt(eleRunTime) == 2550 ? 0 : parseInt(eleRunTime)
      }
      
      this.ceilingfanid = probeId
      this.ceilingVisible = true
    },
    maxichanger(value) {
      if (value > 2550) {
        this.runTime = 2550
      }
    },
    ceilingfanruntime() {
      let {channelNum,isTransmission} = this.fanObj
      if(isTransmission){
        this.runTime = this.runTime == 0 ? 0: this.runTime *6
        ajax.post({
        url: this.$API.setDelayClose + `${this.ceilingfanid}/${channelNum}/${this.runTime}`,
      
        success: (response) => {
          //console.log(response)
          if (response.success) {
            this.$message({
              duration: 5000,
              message: "设置成功",
              type: "success",
            })
            clearTimeout(optimeout)
            this.ceilingVisible = false
            optimeout = setTimeout(() => {
              // this.getChannelData('false');
            }, 5000)
  this.runTime = this.runTime / 6
            this.resetStartTime();
          }
        },
      });
      }
      else{
      this.runTime = this.runTime == 0 ? 2550 : this.runTime
      ajax.post({
        url: this.$API.setFanProgram + this.ceilingfanid,
        data: { runTime: this.runTime },
        success: (response) => {
          //console.log(response)
          if (response.success) {
            this.$message({
              duration: 5000,
              message: "设置成功",
              type: "success",
            })
            clearTimeout(optimeout)

            optimeout = setTimeout(() => {
              // this.getChannelData('false');
            }, 5000)

            this.resetStartTime();
          }
        },
      });
      }
    },
    //获取空调品牌列表
    getairList() {
      ajax.get({
        url: this.$API.airList,
        success: (response) => {
          //console.log(response)
          if (response.success) {
            this.airListData = response.data
          }
        },
      });
    },
    DistanceTime(){
      for(let item of this.tableData){
        let time = [37,19,41].includes(parseInt(item.targetCategoryId))?twoTimeInterval(item.eventChangeTime):twoTimeInterval(item.lastOnOffTime)
      
        if (time < 60) {
            item.Distancetime = (time % 60) + "分"
            } else {
              item.Distancetime = Math.floor(time / 60) + "时" + (time % 60) + "分"
            }
        
          //console.log(time)
      }
      clearInterval(offontiem)
      offontiem = setInterval(() => {
        for(let item of this.tableData){
          let time = twoTimeInterval(item.lastOnOffTime)
          if (time < 60) {
            item.Distancetime = (time % 60) + "分"
            } else {
              item.Distancetime = Math.floor(time / 60) + "时" + (time % 60) + "分"
            }
          //console.log(time)
        }
       
        },60000)
    },
    handleAirBrandChange() {
      this.airCodevalue = null;
      if (this.airListvalue != null) {
        ajax.get({
          url: this.$API.airCodeList + this.airListvalue,
          success: (response) => {
            //console.log(response)
            if (response.success) {
              this.airCodeListdata = response.data
            }
          },
        });
      }
    },

     // 根据预警返回阈值
    EleVoList(row,type,data) {
   
    if(type=='electricity'){
      let extendProperty =data.extendProperty
      let transformerCoefficient = extendProperty?.transformerCoefficient??1
      
      return (row.electricity/transformerCoefficient) /1000
    }
    if(type=='transformerCoefficient'){
      
      let extendProperty =row.extendProperty
      return extendProperty?.transformerCoefficient??'--'
    }
    else{
   let value;
const rawValue = row?.[type];

if (['residualCurrent', 'eleDay', 'eleMonth', 'power', 'current', 'electricity'].includes(type)) {
    // 这些特殊类型需要除以1000
    if (rawValue === undefined || rawValue === null) {
        value = '--';
    } else {
        const numValue = rawValue / 1000;
        // 判断是否大于等于100
        if (numValue >= 100) {
            value = Math.floor(numValue).toString(); // 取整数
        } else {
            value = numValue.toFixed(2); // 保留两位小数
        }
    }
} else {
    // 其他类型直接使用原值或'--'
    value = rawValue !== undefined && rawValue !== null ? rawValue : '--';
}
     return [3276.7,255,32767].includes(Math.abs(value))?'--':value
    }
    },
    DayTimeCustom() {
      // console.log(this.CheckDayTime)
      if (this.CheckDayTime != null && this.CheckDayTime.length > 0) {
        this.getProbeSensorDataByTime(this.dialogdeviceData)
      } else {
        this.$message.warning('请选择日期')
        return
      }
    },
    changeDay(value) {
      if (value == 3) {
        if (this.CheckDayTime == null || this.CheckDayTime.length == 0) {
          // dateTemp = get7dayTime()
          this.CheckDayTime = []
          let dateTemp = get7days()
          let startTime = dateTemp[0]
          let endTime = dateTemp[6]
          this.CheckDayTime.push(startTime)
          this.CheckDayTime.push(endTime)
        }
        if(['34','143','148','149','142','132'].includes(this.dialogdeviceData.probeMoldCode)){
          const myDate = new Date()

          this.CheckDayTime[0]=date.formatDate(myDate)
        }
      }

      
      this.getProbeSensorDataByTime(this.dialogdeviceData)
    },
    getProbeSensorDataByTime(item) {
      let self =this
    this.dialogdeviceData={...item}
    let row ={...this.dialogdeviceData}
      if(['54'].includes(row.probeMoldCode)){
               this.$store.dispatch("actions/setProbeId6100Action", row);
        this.$router.push({ path: '/sk6100line' })
      }
      else{
      this.statisticstitle=row.channelName
   
      this.statisticsprobeid=row.probeId
      this.statisticsEchartsData.probeMoldCode = row.probeMoldCode
      this.statisticsEchartsData.targetCategoryId= row.targetCategoryId
      this.statisticsEchartsData.electricQuantityList.value = []
      this.statisticsEchartsData.electricQuantityList.time = []
      this.statisticsEchartsData.temperatureList.value = []
      this.statisticsEchartsData.temperatureList.time = []
      this.statisticsEchartsData.activePowerList.value = []
      this.statisticsEchartsData.activePowerList.time = []
      this.statisticsEchartsData.voltageList.value = []
      this.statisticsEchartsData.voltageList.time = []
      this.statisticsEchartsData.currentList.value = []
      this.statisticsEchartsData.currentList.time = []
      this.statisticsEchartsData.powerFactorList.value = []
      this.statisticsEchartsData.powerFactorList.time = []
        this.statisticsEchartsData.temperatureExtend1.value = []
      this.statisticsEchartsData.temperatureExtend1.time = []
      let dateTemp = ''
      let startTime = ''
      let endTime = ''
      let is7Days = false
      if (this.dialogCheckDay == 1) {
        // 当天
        is7Days = false
        const myDate = new Date()
        dateTemp = date.formatDate(myDate)
        startTime = dateTemp + ' 00:00:00'
        endTime = dateTemp + ' 23:59:59'
         this.dialogCheckDay2='1'
      }
      if (this.dialogCheckDay == 2) {
        // 近七天
        is7Days = true
        // dateTemp = get7dayTime()
        dateTemp = get7dayTime()
        startTime = dateTemp[0]
        endTime = dateTemp[6]
        this.dialogCheckDay2='2'
      }
      if (this.dialogCheckDay == 3) {
        // 近七天
        is7Days = true
        startTime = this.CheckDayTime[0] + ' 00:00:00'
        endTime = this.CheckDayTime[1] + ' 23:59:59'
         this.dialogCheckDay2='3'
      }
      
      let data
      let url
      if(['34','143','148','149','132','142','141'].includes(row.probeMoldCode)){
        data = {
        probeId: row.probeId,
        time:moment(startTime).format("YYYY-MM-DD")
        }
        const apiMap = {
          '148': this.$API.getTransmissionProbeDataByTime,
          '149': this.$API.getPropertySensorData,
          '132': this.$API.getProbeSensorDataByTime,
          '141': this.$API.getProbeSensorDataByTime,
          '142': this.$API.getProbeSensorDataByTime,
          'default': this.$API.getThreePhaseRailSwitchDataByTime,
        };
        url = apiMap[row.probeMoldCode] || apiMap.default

      }else{
        data = {
          probeId: row.probeId,
          startTime,
          endTime,
          }
          url =this.$API.getProbeSensorDataByTimeRange
      }
      // axios.post(this.$API.getProbeSensorDataByTime, {
      axios.post(url, data).then(response => {
        // 累计用电量 electricQuantity
        // 温度 temperature
        // 功率 activePower
        // 电压 voltage
        // 电流 current
        // 功率因素 powerFactor
         const createSensorObject = ({ ref, name, listData, valueMapper }) => {
          return {
            ref,
            name,
            time: listData.map(item => item.time),
            value: listData.map(valueMapper)
          };
        }
        if(['34','143'].includes(row.probeMoldCode)){
     
          const sensorData = response.data.data
       
          this.statisticsEchartsData.electricQuantityList.value.push(...sensorData.electricQuantity)
          this.statisticsEchartsData.electricQuantityList.time=this.sensorDataCollationTime(sensorData.electricQuantity[0])
          this.statisticsEchartsData.temperatureList.value.push(...sensorData.temperature)
          this.statisticsEchartsData.temperatureList.time=this.sensorDataCollationTime(sensorData.temperature[0])
          this.statisticsEchartsData.activePowerList.value.push(...sensorData.activePower)
          this.statisticsEchartsData.activePowerList.time=this.sensorDataCollationTime(sensorData.activePower[0])
          this.statisticsEchartsData.voltageList.value.push(...sensorData.voltage)
          this.statisticsEchartsData.voltageList.time=this.sensorDataCollationTime(sensorData.voltage[0])
          this.statisticsEchartsData.currentList.value.push(...sensorData.current)
          this.statisticsEchartsData.currentList.time=this.sensorDataCollationTime(sensorData.current[0])
          this.statisticsEchartsData.powerFactorList.value.push(...sensorData.powerFactor)
          this.statisticsEchartsData.powerFactorList.time=this.sensorDataCollationTime(sensorData.powerFactor[0])
        }
        else if(['148','149'].includes(row.probeMoldCode)){
         
        
           
          const listSensorData = [];
          if(row.probeMoldCode == '148'){
          const { data: { data: sensorData } } = response; // 解构赋值
          // 处理电压数据（只取第一个）
          const [firstVoltage] = sensorData.voltage || [];
          if (firstVoltage) {
            listSensorData.push(createSensorObject({
              ref: "voltage",
              name: firstVoltage.name + '(V)',
              listData: firstVoltage.listSensorData,
              valueMapper: item => (item.value / 1000).toFixed(2)
            }));
          }

          // 处理温度数据（过滤掉无效值并转换）
          (sensorData.temperature || []).forEach((tempItem, index) => {
            if (tempItem.minValue !== 65535) {
              listSensorData.push(createSensorObject({
                ref: `temp${index}`,
                name: tempItem.name+'(℃)',
                listData: tempItem.listSensorData,
                valueMapper: item => item.value==65535?'--':item.value // 温度值不需要转换
              }));
            }
          });
          }
          if(row.probeMoldCode == '149'){
           const { batteryVoltage,temperature,waterSum,hourWaterSum,waterPressure} = response.data.data; // 解构赋值
                if(((row.extendInfo && row.extendInfo.waterMeterType == 0) || row.targetCategoryId==48) && hourWaterSum){
                  const today = moment().startOf('day');
                  const startDate = moment(startTime).startOf('day');
                
                  let listSensorDataObj = Object.entries(hourWaterSum).map(([key, value]) => {
                    return {
                      time:moment(startTime).set('hour', key).format("YYYY-MM-DD HH:mm:ss"),
                      value:value
                    }
                  })
                   if (today.isSame(startDate)) {
                    const currentHour = moment().hour();
                    listSensorDataObj = listSensorDataObj.slice(0, currentHour);
                  }
                   listSensorData.push(createSensorObject({
                    ref: "hourWaterSum",
                    name: '24小时用水(吨)',
                    listData: listSensorDataObj,
                    valueMapper: item => (item.value / 1000).toFixed(3)
                  }));
                }
                if (((row.extendInfo && row.extendInfo.waterMeterType == 0)|| row.targetCategoryId==48) && waterSum) {
                  listSensorData.push(createSensorObject({
                    ref: "waterSum",
                    name: waterSum.name + '(吨)',
                    listData: waterSum.listSensorData,
                    valueMapper: item => (item.value / 1000).toFixed(3)
                  }));
                }
                if(((row.extendInfo && ([1,2].includes(row.extendInfo.waterMeterType))) && [53,55].includes(row.targetCategoryId)) && waterPressure ){
                  this.statisticsEchartsData.waterMeterType = row.extendInfo.waterMeterType
                  listSensorData.push(createSensorObject({
                    ref: "waterPressure",
                    name: [1].includes(row.extendInfo.waterMeterType)?waterPressure.name:'液位' + `(${[1].includes(row.extendInfo.waterMeterType)?'MPa':'米'})`,
                    listData: waterPressure.listSensorData,
                    valueMapper: item => {
                      const waterPressure = Number(item.value);
                      const maxWaterPressure = Number(row.extendProperty?.maxWaterPressure);
                      return !isNaN(waterPressure) && !isNaN(maxWaterPressure) ? ((waterPressure * maxWaterPressure )/ 1000).toFixed(3): '--';
                      
                    }
                  }));
                }
                if (batteryVoltage) {
                  listSensorData.push(createSensorObject({
                    ref: "voltage",
                    name: batteryVoltage.name + '(V)',
                    listData: batteryVoltage.listSensorData,
                    valueMapper: item => (item.value / 1000).toFixed(2)
                  }));
                }
          
                if (temperature) {
                  listSensorData.push(createSensorObject({
                    ref: "temperature",
                    name: temperature.name + '(℃)',
                    listData: temperature.listSensorData,
                    valueMapper: item =>item.value
                  }));
                }
          
              
          }
         
          this.statisticsEchartsData.listSensorData=listSensorData
          
        }
       
        else{
          const sensorData = response.data.data.reverse()
        sensorData.forEach(item => {
          let time = ''
          time =  item.localDateTime.slice(11, 16)
          if (!is7Days || (self.CheckDayTime[0] == self.CheckDayTime[1]) ) {
            time = item.localDateTime
            this.dialogCheckDay2='1'
            // time = parseInt(item.localDateTime.slice(11, 14)) + '时'
          }
          else {
this.dialogCheckDay2='2'
          //  time = `${item.localDateTime.slice(5, 10)} ${weekDay(item.localDateTime)} ${item.localDateTime.slice(11, 16)}`
          time = item.localDateTime
          }
          this.statisticsEchartsData.temperatureList.value.push(row.isTransmission && [13,15,1].includes(row.targetCategoryId)?item.temperatureExtend1:[255,65535,3276.7,3276].includes(Math.abs(item.temperature))?'--':item.temperature)
          this.statisticsEchartsData.temperatureList.time.push(time)
          this.statisticsEchartsData.voltageList.value.push(['132', '142', '141'].includes(row.probeMoldCode)?(item.voltage/1000).toFixed(2):item.voltage)
          this.statisticsEchartsData.voltageList.time.push(time)
          if([50].includes(row.targetCategoryId)){
            this.statisticsEchartsData.temperatureExtend1.value.push([255,65535,6553.5,3276.7,32767].includes(Math.abs(item.temperatureExtend1))?'--':item.temperatureExtend1)
            this.statisticsEchartsData.temperatureExtend1.time.push(time)
          }else{
            this.statisticsEchartsData.electricQuantityList.value.push(item.electricQuantity)
            this.statisticsEchartsData.electricQuantityList.time.push(time)
          
            this.statisticsEchartsData.activePowerList.value.push(item.activePower)
            this.statisticsEchartsData.activePowerList.time.push(time)
        
            this.statisticsEchartsData.currentList.value.push(item.current / 1000)
            this.statisticsEchartsData.currentList.time.push(time)
            this.statisticsEchartsData.powerFactorList.value.push((item.powerFactor / 100))
            this.statisticsEchartsData.powerFactorList.time.push(time)
          }
        })
        }
        this.statisticsType=1
        this.dialogStatisticsVisible=true
        //console.log(this.statisticsEchartsData);
      })
    }
    },
    sensorDataCollationTime(data){
      let time =[]
      data.listSensorData.forEach(item=>{
        time.push(item.localDateTime.slice(11, 16))
      }) 
      return time
    },
    //红外
    //设定透传面板延迟关闭时间 
    microwaveSetup(row) {
      let init =[
        {
            moduleAreaCode: 0,
            movementDistance: 0,
            movementSensitivity: 1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        },
        {
            moduleAreaCode: 1,
            movementDistance: 0,
            movementSensitivity:1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        },
        {
            moduleAreaCode: 2,
            movementDistance: 0,
            movementSensitivity: 1,
            stationaryDistance: 0,
            stationarySensitivity: 1
        }
      ]
let continuousNobodyCloseSeconds = row.programData?.continuousNobodyCloseSeconds ?? 0;
let continuousSomebodyOpenSeconds = row.programData?.continuousSomebodyOpenSeconds ?? 0;
let nobodyDetectionTime = row.programData?.nobodyDetectionTime ?? 0;
let heartbeatInterval = row.programData?.heartbeatInterval ?? 0;
let brightnessVoltageNormalPercentage = row.programData?.brightnessVoltageNormalPercentage ?? 0;
let microwaveDetectionCapability = row.programData?.microwaveDetectionCapability ?? 0;
let microwaveAntiInterferenceValue = row.programData?.microwaveAntiInterferenceValue ?? 0;
let microwaveModuleProgramList = row.programData?.microwaveModuleProgramList ?? init;
let microwaveDetectionDistance = row.programData?.microwaveDetectionDistance ?? 1;
this.microwaveForm={
        id:row.id,
        probeKindCode:row.probeKindCode,
        probeId:row.probeId,
        channel:row.channel,
        name:row.channelName,
        continuousNobodyCloseSeconds:{
          hour:secondsToHMS(continuousNobodyCloseSeconds)[0],
          minute:secondsToHMS(continuousNobodyCloseSeconds)[1],
          second:secondsToHMS(continuousNobodyCloseSeconds)[2],
        },
        continuousSomebodyOpenSeconds:{
          hour:secondsToHMS(continuousSomebodyOpenSeconds)[0],
          minute:secondsToHMS(continuousSomebodyOpenSeconds)[1],
          second:secondsToHMS(continuousSomebodyOpenSeconds)[2],
        },
        nobodyDetectionTime:{
          hour:secondsToHMS(nobodyDetectionTime)[0],
          minute:secondsToHMS(nobodyDetectionTime)[1],
          second:secondsToHMS(nobodyDetectionTime)[2],
        },
        heartbeatInterval:{
          hour:secondsToHMS(heartbeatInterval)[0],
          minute:secondsToHMS(heartbeatInterval)[1],
          second:secondsToHMS(heartbeatInterval)[2],
        },
        brightnessVoltageNormalPercentage:brightnessVoltageNormalPercentage,
        microwaveModuleProgramList:microwaveModuleProgramList,
        microwaveDetectionCapability:microwaveDetectionCapability,
        microwaveAntiInterferenceValue:microwaveAntiInterferenceValue,
        microwaveDetectionDistance:microwaveDetectionDistance
      }
      this.dialogMicrowaveVisible=true
   
  
    },
    handleMicrowaveChange(value,type,item){
       setTimeout(() => {
             this.$nextTick(() => {
      if(value==undefined ){
        switch (type) {
          case 'hour':
           item.hour = 0
           break
          case 'minute':
            item.minute =0
            break
          case 'second':
            item.second =0
            break
        }
      }
      let time = 
      item.hour * 3600 +
      item.minute * 60 +
      item.second
      let [hours, minutes, second] = secondsToHMS(time);
   
     
      item.hour =hours
      item.minute =minutes
      item.second =second})
      },100)
    
  
    },

    getTimeSecond(tiem){
      return  tiem.hour * 3600 +
      tiem.minute * 60 +
      tiem.second
    },
    microwaveReset(){
      this.microwaveForm.continuousNobodyCloseSeconds={
        hour:0,
          minute:1,
          second:0,
      }
      this.microwaveForm.continuousSomebodyOpenSeconds={
          hour:0,
          minute:0,
          second:1,
        },
        this.microwaveForm.nobodyDetectionTime={
          hour:0,
          minute:5,
          second:0,
        },
        this.microwaveForm.heartbeatInterval={
          hour:0,
          minute:2,
          second:0,
        },
        this.microwaveForm.brightnessVoltageNormalPercentage=20
        this.microwaveForm.microwaveAntiInterferenceValue=2,
        this.microwaveForm.microwaveDetectionCapability=15,
        
        this.microwaveForm.microwaveForm=600,
        this.microwaveForm.microwaveModuleProgramList=[
        {
            moduleAreaCode: 0,
            movementDistance: 200,
            movementSensitivity: 16,
            stationaryDistance: 200,
            stationarySensitivity: 8,
          },
          {
            moduleAreaCode: 1,
            movementDistance: 400,
            movementSensitivity: 10,
            stationaryDistance: 400,
            stationarySensitivity: 8,
          },
          {
            moduleAreaCode: 2,
            movementDistance: 600,
            movementSensitivity: 8,
            stationaryDistance: 600,
            stationarySensitivity: 8,
          },
      ]
    },
    //
    microwaveSubmit(){
      let data={...this.microwaveForm}
      data.continuousNobodyCloseSeconds=this.getTimeSecond(data.continuousNobodyCloseSeconds)
      data.continuousSomebodyOpenSeconds=this.getTimeSecond(data.continuousSomebodyOpenSeconds)
      data.nobodyDetectionTime=this.getTimeSecond(data.nobodyDetectionTime)
      data.heartbeatInterval=this.getTimeSecond(data.heartbeatInterval)
      if(this.microwaveSeniorSet){
        delete data.microwaveDetectionDistance;
       

      }else{
        delete data.microwaveModuleProgramList;
        delete data.microwaveDetectionCapability;
        delete data.microwaveAntiInterferenceValue;
       
      }
      this.setTransmissionProbeProgramSubmit(data, () => {
        this.dialogMicrowaveVisible = false; // 关闭弹窗的回调函数
        this.microwaveSeniorSet = false; 
      });
      
    },
    //编程阈值
    setTransmissionProbeProgramSubmit(data,callback){
         this.$confirm(`确定设置阈值?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let submitdata={
             ...data,
             channel:1,
            }
         
            ajax.post({
              url: this.$API.setTransmissionProbeProgram + submitdata.probeId,
              data: submitdata,
              success: (response) => {
                 this.$message({
                  message: '编程命令下发成功',
                  type: "success",
                });
                if (callback && typeof callback === 'function') {
        callback(); // 调用回调函数来关闭弹窗
      }
               
              },
            });
        }).catch(() => {
         
        });
       
    },
    //温度编程
    //获取设备定时
    getChannelTiming(item){
      this.channelTimingId=item.id
      this.channelTimingMoldCode=parseInt(item.probeMoldCode)
      this.channelTimingTargetCategory=parseInt(item.targetCategoryId)
      this.channelTimingTitle=item.channelName
      this.dialogChannelTimingVisible=true
    },

    //透传编程
    //重置阈值设置
    throughInitDatalistSetup() {
      // console.log(JSON.parse(JSON.stringify(this.mopojoGroup)))
      // console.log(JSON.stringify(this.mopojoGroup))
      this.resetStartTime();

     
      this.throughPojoGroup = {...this.throughPojoGroup,...JSON.parse(JSON.stringify(this.throughInitPojoGroup))};
      
      let targetCategoryId = this.throughPojoGroup.targetCategoryId
      if([52].includes(targetCategoryId)){
        this.throughPojoGroup.ov_alarm_value=72
        this.throughPojoGroup.ov_restore_value=70
        this.throughPojoGroup.uv_alarm_value=36
        this.throughPojoGroup.uv_restore_value=38
      }
    },
    throughSetupWidth(){
      if(this.throughPojoGroup.targetCategoryId==33 && this.throughPojoGroup.probeVersion >= 251121.1){
        return  '1140px';
      }
      if(this.throughPojoGroup.targetCategoryId == 52){
        return '780px';
      }else{
        const width={
          27:'1500px',
          // 43:'1190px'
        }
        return width[this.throughMoldCode] || '1100px';
      }
    },
    throughDatalistSetup(data) {

    
      this.pojoGrouptitle=data.channelName
      this.isAirthrough = ['27'].includes(data.probeMoldCode)
      let throughProgramData=data.programData
      this.throughMoldCode=data.probeMoldCode
      const getThresholdValue = (programData, key, defaultValue = '') => {
        return programData && programData[key] !== undefined && programData[key] !== 255 ? programData[key] : defaultValue;
      };
      const parseValue = (value, defaultValue = 0) => {
        return value == null || value == -1 ? defaultValue : parseInt(value);
      };

      const parseStringValue = (value, defaultValue = '') => {
        return value == null || value == -1 ? defaultValue : value;
      };

      const parseBooleanValue = (value) => {
        return value == 0 || value == null || value == -1 ? false : true;
      };
     
      this.throughPojoGroup = {
        id: data.id,
        targetCategoryId:data.targetCategoryId,
        probeId: data.probeId,
        probeVersion: Number(data.probeVersion),
        //过压
      
        ov_alarm: parseValue(data.eleOvAlarm,1),
        ov_restore: parseValue(data.eleOvRestore,1),
        ov_alarm_value: parseStringValue(data.eleOvAlarmValue,265),
        ov_restore_value: parseStringValue(data.eleOvRestoreValue,255),
        ov_buzzer: parseBooleanValue(data.eleOvBuzzer), // 过压蜂鸣器
        overVoltageAlarm: getThresholdValue(throughProgramData, 'overVoltageAlarm',1),
        //低压
        uv_alarm: parseValue(data.eleUvAlarm,1),
        uv_restore: parseValue(data.eleUvRestore,1),
        uv_alarm_value: parseStringValue(data.eleUvAlarmValue,180),
        uv_restore_value: parseStringValue(data.eleUvRestoreValue,198),
        uv_buzzer: parseBooleanValue(data.eleUvBuzzer), // 欠压蜂鸣器
        lowVoltageAlarm: getThresholdValue(throughProgramData, 'lowVoltageAlarm',1),
       
        //过载
        ol_alarm: parseValue(data.eleOlAlarm,1),
        ol_restore: parseValue(data.eleOlRestore,1),
        ol_alarm_value: parseStringValue(data.eleOlAlarmValue),
        ol_restore_value: parseStringValue(data.eleOlRestoreValue),
        ol_buzzer: parseBooleanValue(data.eleOlBuzzer), // 过载蜂鸣器
        overloadAlarm: getThresholdValue(throughProgramData, 'overloadAlarm',1),
         
        //低功率  
        lowPowerAlarm: parseValue(getThresholdValue(throughProgramData, 'lowPowerAlarm'),1),
        lp_alarm: parseValue(data.eleLpAlarm),
        lp_buzzer: parseBooleanValue(data.eleLpBuzzer),
        lp_restore: parseValue(data.eleLpRestore),
        lowPowerThreshold: getThresholdValue(throughProgramData, 'lowPowerThreshold',80),
        lowPowerRecoveryThreshold: getThresholdValue(throughProgramData, 'lowPowerRecoveryThreshold',90),
       
        lp_electricity:parseValue(data.eleLpElectricity),
        lp_run_time:parseStringValue(data.eleLpRunTime,0),
        //超温
        overTemperatureAlarm: getThresholdValue(throughProgramData, 'overTemperatureAlarm',1),
        tem_alarm: parseValue(data.eleTemAlarm,1),
        tem_restore: parseValue(data.eleTemRestore,1),
        tem_alarm_value: parseStringValue(data.eleTemAlarmValue,65),
        tem_restore_value: parseStringValue(data.eleTemRestoreValue,55),
        tem_buzzer: parseBooleanValue(data.eleTemBuzzer), // 温度蜂鸣器
        
        //低温
        lowTemAlarm: getThresholdValue(throughProgramData, 'lowTemAlarm',0),
        lowTemAllowAlarmPush: getThresholdValue(throughProgramData, 'lowTemAllowAlarmPush',0),
        lowTemAllowResumePush: getThresholdValue(throughProgramData, 'lowTemAllowResumePush',0),
        lowTemAllowBuzzerPrompt: parseBooleanValue(getThresholdValue(throughProgramData, 'lowTemAllowBuzzerPrompt',0)),
        lowTemperatureThreshold: getThresholdValue(throughProgramData, 'lowTemperatureThreshold',10),
        lowTemperatureRecoveryThreshold: getThresholdValue(throughProgramData, 'lowTemperatureRecoveryThreshold',15),
      
        //室温超温
        roomOverTemAlarm: getThresholdValue(throughProgramData, 'roomOverTemAlarm',0),
        roomOverTemAllowAlarmPush: getThresholdValue(throughProgramData, 'roomOverTemAllowAlarmPush',0),
        roomOverTemAllowResumePush: getThresholdValue(throughProgramData, 'roomOverTemAllowResumePush',0),
        roomOverTemAllowBuzzerPrompt: parseBooleanValue(getThresholdValue(throughProgramData, 'roomOverTemAllowBuzzerPrompt',0)),
        roomOverTemThreshold: getThresholdValue(throughProgramData, 'roomOverTemThreshold',65),
        roomOverTemRecoveryThreshold: getThresholdValue(throughProgramData, 'roomOverTemRecoveryThreshold',55),
        
        //室温低温
        roomLowTemAlarm: getThresholdValue(throughProgramData, 'roomLowTemAlarm',0),
        roomLowTemAllowAlarmPush: getThresholdValue(throughProgramData, 'roomLowTemAllowAlarmPush',0),
        roomLowTemAllowResumePush: getThresholdValue(throughProgramData, 'roomLowTemAllowResumePush',0),
        roomLowTemAllowBuzzerPrompt: parseBooleanValue(getThresholdValue(throughProgramData, 'roomLowTemAllowBuzzerPrompt',0)),
        roomLowTemThreshold: getThresholdValue(throughProgramData, 'roomLowTemThreshold',5),
        roomLowTemRecoveryThreshold: getThresholdValue(throughProgramData, 'roomLowTemRecoveryThreshold',10),
        
        //剩余电流
        overResidualCurrentAlarm: getThresholdValue(throughProgramData, 'overResidualCurrentAlarm',0),
        overResidualCurrentAllowAlarmPush: getThresholdValue(throughProgramData, 'overResidualCurrentAllowAlarmPush',0),
        overResidualCurrentAllowResumePush: getThresholdValue(throughProgramData, 'overResidualCurrentAllowResumePush',0),
        overResidualCurrentAllowBuzzerPrompt: parseBooleanValue(getThresholdValue(throughProgramData, 'overResidualCurrentAllowBuzzerPrompt',0)),
        residualCurrentOverThreshold: getThresholdValue(throughProgramData, 'residualCurrentOverThreshold',5000),
        residualCurrentRecoveryThreshold: getThresholdValue(throughProgramData, 'residualCurrentRecoveryThreshold',1000),
        //
        ele_timeout_shutdown: parseStringValue(data.eleTimeoutShutdown,0), // 超时关闭
        ele_func_buzzer: parseBooleanValue(data.eleFuncBuzzer), // 允许来电蜂鸣提示
        switch_enable: parseBooleanValue(data.eleSwitchEnable), // 本地开关是否启用
        
        //电流报警
        overCurrentAlarm: getThresholdValue(throughProgramData, 'overCurrentAlarm',1),
        overCurrentAllowAlarmPush: getThresholdValue(throughProgramData, 'overCurrentAllowAlarmPush',1),
        overCurrentAllowResumePush:getThresholdValue(throughProgramData, 'overCurrentAllowResumePush',1),
        overCurrentAllowBuzzerPrompt:parseBooleanValue(getThresholdValue(throughProgramData, 'overCurrentAllowBuzzerPrompt',1)),
        overCurrentThreshold:getThresholdValue(throughProgramData, 'overCurrentThreshold',0)  / 1000,
        overCurrentRecoveryThreshold:getThresholdValue(throughProgramData, 'overCurrentRecoveryThreshold',0)  / 1000,

        //1P2P导轨断电
        //电流断电
        overCurrentAutomaticPowerOutage: getThresholdValue(throughProgramData, 'overCurrentAutomaticPowerOutage',0),
        overCurrentAutomaticPowerOn:getThresholdValue(throughProgramData, 'overCurrentAutomaticPowerOn',0),
        overCurrentCloseThreshold:getThresholdValue(throughProgramData, 'overCurrentCloseThreshold',0) / 1000,
        //超压断电
        overVoltageAutomaticPowerOn: getThresholdValue(throughProgramData, 'overVoltageAutomaticPowerOn',0),
        ov_electricity:parseValue(data.eleOvElectricity),
        overVoltageCloseThreshold:getThresholdValue(throughProgramData, 'overVoltageCloseThreshold'),
        overVoltageRecoveryOpenThreshold:getThresholdValue(throughProgramData, 'overVoltageRecoveryOpenThreshold'),
        //低压断电
        lowVoltageAutomaticPowerOn:getThresholdValue(throughProgramData, 'lowVoltageAutomaticPowerOn',0),
        uv_electricity:parseValue(data.eleUvElectricity),
        lowVoltageCloseThreshold:getThresholdValue(throughProgramData, 'lowVoltageCloseThreshold'),
        lowVoltageRecoveryOpenThreshold:getThresholdValue(throughProgramData, 'lowVoltageRecoveryOpenThreshold'),
        //过载断电
        overloadAutomaticPowerOn:getThresholdValue(throughProgramData, 'overloadAutomaticPowerOn',0),
        ol_electricity:parseValue(data.eleOlElectricity),
        overloadCloseThreshold:getThresholdValue(throughProgramData, 'overloadCloseThreshold'),
        //过温
        overTemperatureAutomaticPowerOn:getThresholdValue(throughProgramData, 'overTemperatureAutomaticPowerOn',0),
        tem_electricity:parseValue(data.eleTemElectricity),
        overTemperatureCloseThreshold:getThresholdValue(throughProgramData, 'overTemperatureCloseThreshold'),
        overTemperatureRecoveryOpenThreshold:getThresholdValue(throughProgramData, 'overTemperatureRecoveryOpenThreshold'),
        
         //合闸间隔
        autoPowerOnInterval:getThresholdValue(throughProgramData, 'autoPowerOnInterval'),
        //合闸次数
        autoPowerOnMaxTimes:getThresholdValue(throughProgramData, 'autoPowerOnMaxTimes'),
       
      };
      this.throughPlugsetupshow = true
    },

    throughPhresholdSubmit(formName) {
      let self = this
      //判断
      let isExistnull=hasEmptyOrNullValues(self.throughPojoGroup,self.throughMoldCode)
      //console.log(isExistnull,self.throughPojoGroup)
      this.$refs[formName].validate((valid) => {
      
         if (isExistnull) {
          //蜂鸣器修改
          let keys = ['tem_electricity','lp_electricity','lowPowerAlarm','uv_electricity','ov_electricity','ol_electricity','ov_buzzer', 'uv_buzzer', 'ol_buzzer', 'lp_buzzer','tem_buzzer','lowTemAllowBuzzerPrompt','roomOverTemAllowBuzzerPrompt','roomLowTemAllowBuzzerPrompt','ele_timeout_shutdown','ele_func_buzzer','switch_enable','overResidualCurrentAllowBuzzerPrompt','overCurrentAllowBuzzerPrompt'];
          let inkeys = [ 'ol_alarm_value', 'ol_restore_value', 
          'ov_alarm_value', 'ov_restore_value',
          'tem_alarm_value', 'tem_restore_value',
          'uv_alarm_value', 'uv_restore_value',
        ];
        self.throughPojoGroup.overCurrentThreshold=self.throughPojoGroup.overCurrentThreshold?self.throughPojoGroup.overCurrentThreshold*1000:0  
        self.throughPojoGroup.overCurrentRecoveryThreshold=self.throughPojoGroup.overCurrentRecoveryThreshold?self.throughPojoGroup.overCurrentRecoveryThreshold*1000:0  
        self.throughPojoGroup.overCurrentCloseThreshold=self.throughPojoGroup.overCurrentCloseThreshold?self.throughPojoGroup.overCurrentCloseThreshold*1000:0
          keys.forEach((key) => {
             self.throughPojoGroup[key] = Number(self.throughPojoGroup[key]);
          });
          
          inkeys.forEach((key) => {
             self.throughPojoGroup[key] = Number(self.throughPojoGroup[key]);
          });
          
         
         
          self.setTransmissionProbeProgramSubmit(self.throughPojoGroup, () => {
            keys.forEach((key) => {
                    self.throughPojoGroup[key] = Boolean(self.throughPojoGroup[key]);
                  });
            self.throughPlugsetupshow = false; // 关闭弹窗的回调函数
          });
        }
      })
    },
     //微波语音播报
    handleMicrowaveSound(row){
     const { 
        channel:channelNum,
        probeId,
        channelName
      } = row;
      this.microwaveSoundObj.audioDialog = {
        ...this.microwaveSoundObj.audioDialog,
        channelNum,
        probeId,
        channelName,
        dialog: true
      }
      
    },
    setMicrowaveSoundAudioPlay(audioNumber){
      let {probeId,channelNum,repeatTimes} = this.microwaveSoundObj.audioDialog
      ajax.post({
        url: this.$API.setMicrowaveSoundAudioNumber+`${probeId}/${channelNum}/${audioNumber}/${repeatTimes}`,
        success: (response) => {
          this.$message({
            message: '成功',
            type: "success",
          });
        },
        error: (res) => {
          this.$message({
            message: res.message,
            type: "error",
          });
        },
      });
    },
    // 语音设置阈值
    microwaveSoundProgramSetup(row){
      const { 
        probeId,
        channelName,
        programData:{
          voiceVolume=0,
          enableSpeechRecognition=0,
          speechRecognitionThreshold=50,
        } = {},
      } = row;
      this.microwaveSoundObj.programmingDialog={...this.microwaveSoundObjprogrammingDialog,
        probeId,
        channelName,
        voiceVolume,
        enableSpeechRecognition,
        speechRecognitionThreshold,
        dialog:true
      }
    },
    setMicrowaveSoundProgram(){
      let obj = {...this.microwaveSoundObj.programmingDialog}
      ajax.post({
        url: this.$API.setMicrowaveSoundConfig+`${obj.probeId}`,
        data:obj,
        success: (response) => {
          this.$message({
            message: '成功',
            type: "success",
          });
          this.microwaveSoundObj.programmingDialog.dialog=false
        },
        error: (res) => {
          this.$message({
            message: res.message,
            type: "error",
          });
        },
      });
    },

    //调试窗口
    handleDebug(item){
      this.probeItem=item;
      this.dialogDebugWindowVisible=true;
    },

    handleAlarmButton() {
      this.alarmShow = true;
      this.isNewAlarm = false;
    },

    mouseEnterAlarmButton() {
      this.isAlarmTip = true;
    },

    mouseLeaveAlarmButton() {
      this.isAlarmTip = false;
    },
    //数据导出
    handleProbeExport(item){
      this.probeExportObj={
        time:moment().format("YYYY-MM-01"),
        type:1,
        probeId:item.probeId,
        channelNum:item.channel,
        dialogVisible:true
      }
    },
    probeExportSubmit(){
      let {time,type,probeId,channelNum } = this.probeExportObj
     
     if(time){
      let url = type==1?this.$API.getDeviceUseLogReport:this.$API.getDeviceUseLogMonthReport
      const momentTime = moment(time);  // 避免重复创建moment对象
      const year = momentTime.year();
      const month = momentTime.month() + 1;
      const timeUrl = type === 1 ? `/${year}/${month}` : `/${year}`;
    
      window.open(
          `${url}${probeId}/${channelNum}${timeUrl}`,
          "_blank"
        );
     
     }else{
       this.$message.warning('请选择日期')
      }
    },
    handleDoorExport(item){
      this.DoorExportObj={
        time:[],
      
        id:item.id,
  
        dialogVisible:true
      }
    },
     DoorExportSubmit(){
      let {time,id } = this.DoorExportObj
     
     if(time){
      let startTime = moment(time[0]);
      let endTime = moment(time[1]);
      if (endTime.diff(startTime, "days") > 31) {
        this.$message({
          message: "时间范围不能超过31天",
          type: "warning",
        });
        return;
      }
      let url = this.$API.getDoorMagnetData
    
    
      window.open(
          `${url}${id}/${time[0]}/${time[1]}`,
          "_blank"
        );
     
     }else{
       this.$message.warning('请选择日期')
      }
    }
  },
  filters: {
    probeTypeFilter(typeValue) {
      const typeObj = targetCategoryData.find((obj) => obj.id === typeValue);
      return typeObj ? typeObj.name : null;
    },
    probeTypetime(typeValue) {
      if (typeValue > 0) {
        return getFormatDate(typeValue).slice(5, 16)
      } else {
        return typeValue ? typeValue.slice(5, 16) : ''
      }
      
    },
    probeTypeFilterimg(typeValue) {
      const typeObj = targetCategoryData.find((obj) => obj.id === typeValue);
      return typeObj ? typeObj.name : null;
    },
    probeStateFilter(stateValue) {
      const stateObj = probeState.find((obj) => obj.type == stateValue);
      return stateObj ? stateObj.name : null;
    },
    airModeFilter(modeValue, id) {
      let modeObj
      if (id == 13) {
        modeObj = cairMode_F.find((obj) => obj.type == modeValue);
      }
      else if (id == 15) {
        modeObj = cascadeairMode_F.find((obj) => obj.type == modeValue);
      }
      else {
        modeObj = airMode_F.find((obj) => obj.type == modeValue);
      }
      return modeObj ? modeObj.name : null;
    },
    airSpeedFilter(speedValue, id) {
      let speedObj
      if (id == 13) {
        speedObj = cairSpeed_F.find((obj) => obj.type == speedValue);
      }
      else if(id == 15){
        speedObj = cascadeairSpeed_F.find((obj) => obj.type == speedValue);
      }
      else {
        speedObj = airSpeed_F.find((obj) => obj.type == speedValue);
      }
      return speedObj ? speedObj.name : null;
    },
    //密码
    passwod(index) {

      let jsondata = JSON.parse(index)
      if (jsondata.content == undefined) {
        return '-'
      }
      else {
        return hideCode(jsondata.content, 1, 1)
      }

    },
    airKeyFilter(keyboardValue, id) {
      let speedObj
      if (id == 13) {
        speedObj = cairkeyboar_K.find((obj) => obj.type == keyboardValue);
      }

      return speedObj ? speedObj.name : null;
    },
    desensitization(value) {


      return hideCode(value, 1, 1)
    },
    tofixeUpperCase(number) {
      if (number != null) {
        number = parseFloat(number)
        if (number >= 100) {
          number = number.toFixed(0);
        } else if (number >= 10) {
          number = number.toFixed(1);
        } else if (number > 0) {
          number = number.toFixed(2);
        } else if (number === 0) {
          number = number.toFixed(2);
        }
        return number;
      } else {
        return '-'
      }
    },

  },
  watch: {
    LoraPersonPWListshow(val) {
      if (!val) {
        this.LoraPersonPWListshow = false
        this.newpwupdate = false
        clearInterval(oldPWtime)
      }
    },
    isContainSub(val){
     this.getChannelData()
    }
  },
};

function twoTimeInterval(startTime) {

  let date1 = new Date(startTime);
  // 开始时间
  // let d1 = startTime.replace(/\-/g, "/");
  if (startTime == null) {
    date1 = new Date();
  }
  // 结束时间
  let date2 = new Date();
  // 时间相差秒数
  let dateDiff = date2.getTime() - date1.getTime()
  
  let minutes = Math.floor(dateDiff / (60 * 1000))
  return minutes;
}
function twoTimeIntervals(startTime) {

let date1 = new Date(startTime);
// 开始时间
// let d1 = startTime.replace(/\-/g, "/");
if (startTime == null) {
  date1 = new Date();
}
// 结束时间
let date2 = new Date();
// 时间相差秒数
let dateDiff = date2.getTime() - date1.getTime()

let minutes = Math.floor(dateDiff / (60 * 1000))

minutes= minutes<0?0:minutes
if (minutes < 60) {
  return (minutes % 60) + "分"
 } else {
return Math.floor(minutes / 60) + "时" + (minutes % 60) + "分"
}


}
function duration(startTime) {

  let time =parseInt(startTime!=null&&startTime!=''?startTime:0)
  let minutes = Math.floor(time / (60))
  minutes= minutes<0?0:minutes
  if (minutes < 60) {
    return (minutes % 60) + "分"
  } else {
  
  return Math.floor(minutes / 60) + "时" + (minutes % 60) + "分"
  }
}
function durationday(startTime) {

let time =parseInt(startTime!=null&&startTime!=''?startTime:0)

let minutes = Math.floor(time / (60))
minutes= minutes<0?0:minutes
if (minutes < 60) {
  return (minutes % 60) + "分"
} else {
if((minutes / 60) > 24){
  let day = Math.floor((minutes / 60) / 24)
  return day + "天" + Math.floor(Math.floor(minutes / 60) % 24) + "时"
}
else{
  return Math.floor(minutes / 60) + "时" + (minutes % 60) + "分"
}

}
}
function hideCode(str, frontLen, endLen) {
  let len = str.length - frontLen - endLen;
  let xing = '';
  for (var i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);

}
function hideCodename(str, frontLen, endLen) {
 
 return str?str.substring(0, str.length - 2) + '*' +str.substring(str.length,str.length -1):''

}
function hasEmptyOrNullValues(obj,moldCode,targetCategoryId) {
  if (moldCode === '27') {
      delete obj.lp_run_time;
    }
    if(targetCategoryId==48){
      delete obj.highResistance;
      delete obj.lowResistance;
      delete obj.waterHighPressureRecoveryThreshold;
      delete obj.waterHighPressureThreshold;
      delete obj.waterLowPressureRecoveryThreshold;
      delete obj.waterLowPressureThreshold;
    }
    if([53,55].includes(targetCategoryId)){
      delete obj.waterMeterReportThreshold;
      delete obj.highResistance;
      delete obj.lowResistance;
    
    }
    let probeVersion = obj.probeVersion || 0
    if(![33].includes(obj.targetCategoryId) || probeVersion < 251121.1){
      delete obj.overCurrentAlarm;
      delete obj.overCurrentAllowAlarmPush;
      delete obj.overCurrentAllowResumePush;
      delete obj.overCurrentAllowBuzzerPrompt;
      delete obj.overCurrentThreshold;
      delete obj.overCurrentRecoveryThreshold;
      delete obj.overCurrentAutomaticPowerOutage;
      delete obj.overCurrentAutomaticPowerOn;
      delete obj.overCurrentCloseThreshold;
      delete obj.overVoltageAutomaticPowerOn;
      delete obj.overVoltageCloseThreshold;
      delete obj.overVoltageRecoveryOpenThreshold;
      delete obj.lowVoltageCloseThreshold;
      delete obj.lowVoltageAutomaticPowerOn;
      delete obj.lowVoltageRecoveryOpenThreshold;
      delete obj.overloadAutomaticPowerOn;
      delete obj.overloadCloseThreshold;
      delete obj.overTemperatureAutomaticPowerOn;
      delete obj.overTemperatureCloseThreshold;
      delete obj.overTemperatureRecoveryOpenThreshold;
      delete obj.autoPowerOnInterval;
      delete obj.autoPowerOnMaxTimes;

    
    }
    return !Object.entries(obj).some(
      ([key, value]) => 
 
         value < 0 ||
        (value == null && !['waterPressure'].includes(key)) || // 检查 null 和 undefined
        (value === '' && !['waterPressure','duration'].includes(key)) || // 空字符串排除 duration
        (!/^\d+$/.test(value) && key === 'lp_run_time') // lp_run_time 只能是整数
      

    );
}
function getFormatDate(nowDate) {
  let date = new Date(nowDate)
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate < 10) {
    strDate = '0' + strDate
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  let currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + hours + ':' + minutes + ':' + seconds
  // console.log(currentDate)
  return currentDate
}
//占比
function tiemproportion(val1,val2){
  //console.log("val" ,val1,val2,val1*1+val2*1,val1*1/(val1*1+val2*1))
  if(val1 == "" || val1 == undefined || val1 == null || (val1 == '0'  && val2 == '0')){
    return 0
  }
  if(val2 == "" || val2 == undefined || val2 == null || (val1 == '0'  && val2 == '0')){
    return 0
  }
  var floatTime = (val1*1/(val1*1+val2*1)*100).toFixed(1)
  
  return floatTime
}
function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds];
}
function weekDay(time)  {
  let datelist = ['周日','周一','周二','周三','周四','周五','周六',]
  return datelist[new Date(time).getDay()];
}
 function get7dayTime(){
    // 获取近7天日期
    let myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 6);
    let dateArray = [];
    let dateTemp;
    let flag = 1;
    for (let i = 0; i < 7; i++) {
      dateTemp = `${myDate.getFullYear()}-${formatNumber(myDate.getMonth() + 1)}-${formatNumber(myDate.getDate())} ${i===0?'00:00:00':'23:59:59'}`;
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray
}
function get7days(){
    // 获取近7天日期
    let myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 6);
    let dateArray = [];
    let dateTemp;
    let flag = 1;
    for (let i = 0; i < 7; i++) {
      dateTemp = `${myDate.getFullYear()}-${formatNumber(myDate.getMonth() + 1)}-${formatNumber(myDate.getDate())}`;
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray
}
function formatNumber(formatValue) {
	if (formatValue < 10) {
		formatValue = '0' + formatValue
	}
	return formatValue
}
</script>
<style lang="stylus" src="../components/styl/UserOperation.styl" scoped></style>
