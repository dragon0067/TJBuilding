<template>
  <div class="planegraph-row">
    <div class="area-tree-section box-border-style">
      <div class="tl-corner"></div>
      <div class="tr-corner"></div>
      <div class="bl-corner"></div>
      <div class="br-corner"></div>
      <div class="tree-search">
        <div>
          <el-select
            filterable
            @change="organChangeEvent"
            v-model="organId"
            placeholder="请选择"
            value-key="item"
          >
            <el-option
              v-for="item in organOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="scrollbar-box">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
          <el-tree
            :default-expand-all="true"
            :data="FilialeOrganAreaData"
            :props="treeProps"
            :expand-on-click-node="false"
            highlight-current
            node-key="id"
            @node-click="onClickTreeNode"
            ref="filialeOrganAreaTree"
          >
            <span
              class="tree-row"
              slot-scope="{ data }"
              @drop="drop(data, $event)"
              @dragover="dragover_handler($event)"
              style="position: relative"
            >
              <span
                style="
                  vertical-align: middle;
                  margin-right: 0.1rem;
                  cursor: pointer;
                "
                >{{ data.name }}</span
              >
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="planeimg-war">
      <!-- <div class="tab-btn-row">
              <div class="tab-btn swiper-button-prev" slot="button-prev"><img src="@/assets/icons/previous_icon.png" />
              </div>
            </div> -->
      <div ref="map" class="maps-img">
        <div class="swiper" ref="container">
          <div
            v-for="item in planlistdata"
            :key="item.id"
            style="display: flex"
          >
            <img :src="locationorigin + item.picUrl" />
          </div>
        </div>

        <div
          @click="getProbeChannelByPosIddata(item)"
          class="boxDom"
          :title="item.posName"
          :style="{ left: positionLeft(item.x), top: positionTop(item.y) }"
          :key="item.index"
          v-for="item of Dimensionpointdata"
        >
          <img :src="getPointImg(item)" />
        </div>
      </div>
      <!-- <div class="tab-btn-row">
              <div class="tab-btn swiper-button-next" slot="button-next"><img src="@/assets/icons/next_icon.png" /></div>
            </div> -->
    </div>
    <el-dialog
      :title="pointprodTitle + `-设备管理`"
      :visible.sync="pointprodshow"
      width="12rem"
      :close-on-click-modal="false"
    >
      <el-button
        type="primary"
        @click="handleBatchSwitchChange(1)"
        style="margin-left: 0.2rem"
        >一键开启</el-button
      >
      <el-button type="danger" @click="handleBatchSwitchChange(0)"
        >一键关闭</el-button
      >
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 5rem">
        <div class="pointprodlist-box">
          <div
            class="pointprodlist-infos"
            v-for="(item, index) in pointtoproddata"
            :key="item.id"
          >
            <div
              class="pointprodlist-img"
              :class="item.state == 1 ? 'prod-on' : 'prod-off'"
            >
              <span
                :class="
                  item.targetCategoryId == 31
                    ? 'gear_icon gear_' + item.state + '_' + item.eleGear
                    : ''
                "
                v-html="probeTypeFilterimg(item.targetCategoryId)"
              ></span>
            </div>
            <div class="pointprodlist-conter">
              <div class="pointprodlist-click">
                <div
                  class="pointprodlist-name"
                  :style="item.state == 1 ? 'color:#13cd67' : 'color:#fff'"
                >
                  {{ item.channelName }}
                </div>
                <div :style="item.targetCategoryId == 12 ? 'display:none' : ''">
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    :class="'table-switch-text'"
                    v-model="item.state"
                    @change="switchChange($event, item)"
                    active-color="#13ce66"
                    inactive-color="#7d7d7d"
                    min-width="75"
                  >
                  </el-switch>
                </div>
                <div :style="item.targetCategoryId == 12 ? '' : 'display:none'">
                  <el-button
                    type="primary"
                    round
                    size="mini"
                    @click="switchChange($event, item)"
                    >开锁</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script src="./index.js"></script>
<style lang="scss" src="./index.scss" scoped></style>
