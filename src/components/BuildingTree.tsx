import React, { useState } from 'react'
import './BuildingTree.css'

interface BuildingNode {
  name: string
  floors?: FloorNode[]
  expanded?: boolean
}

interface FloorNode {
  name: string
  rooms: string[]
}

interface BuildingTreeProps {
  collapsed?: boolean
}

const BuildingTree: React.FC<BuildingTreeProps> = ({ collapsed = false }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('信息中心室')
  const [buildings, setBuildings] = useState<BuildingNode[]>([
    {
      name: '综合楼',
      expanded: true,
      floors: [
        {
          name: '-1层',
          rooms: ['储藏室', '杂物间', '设备机房', '卫生间']
        },
        {
          name: '1层',
          rooms: ['综合管理办公室', '物资管理部', '综合部办公室', '信息中心室']
        },
        {
          name: '2层',
          rooms: ['财务部', '档案管理室', '综合质量管理部门', '信息督察审核']
        },
        {
          name: '3层',
          rooms: ['董事长办公室', '销售副总经理室', '技术部办公室', '人力资源部']
        }
      ]
    },
    {
      name: '办公楼',
      expanded: false,
      floors: []
    },
    {
      name: '生产大楼',
      expanded: false,
      floors: []
    }
  ])

  const toggleBuilding = (index: number) => {
    const newBuildings = [...buildings]
    newBuildings[index].expanded = !newBuildings[index].expanded
    setBuildings(newBuildings)
  }

  if (collapsed) {
    return null
  }

  return (
    <div className="building-tree-panel">
      <div className="building-tree-content">
        {buildings.map((building, buildingIndex) => (
          <div key={buildingIndex} className="building-node">
            <div
              className="building-header"
              onClick={() => toggleBuilding(buildingIndex)}
            >
              <span className={`expand-icon ${building.expanded ? 'expanded' : ''}`}>
                {building.expanded ? '◀' : '▶'}
              </span>
              <span className="building-name">{building.name}</span>
            </div>
            {building.expanded && building.floors && (
              <div className="floors-list">
                {building.floors.map((floor, floorIndex) => (
                  <div key={floorIndex} className="floor-node">
                    <div className="floor-header">
                      <span className="floor-name">{floor.name}</span>
                    </div>
                    <div className="rooms-list">
                      {floor.rooms.map((room, roomIndex) => (
                        <div 
                          key={roomIndex} 
                          className={`room-item ${selectedRoom === room ? 'active' : ''}`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          {room}
                        </div>
                      ))}
                    </div>
                    {floorIndex < building.floors!.length - 1 && (
                      <div className="floor-divider"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuildingTree


