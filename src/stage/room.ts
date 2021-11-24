import Stage from "./stage";
import socket from '../socket'
import { HALL_SOCKET_URL, ROOM_SOCKET_URL, STAGE_HEIGHT, STAGE_WIDTH } from "../constant";
import store from "../store";
import { Graphics, TextStyle, utils, Loader } from "pixi.js";
import UIButton from "../sprites/UIButton";
import app from "../app";
import MessageBox from "../sprites/messageBox";
import { COMMON_TEXTURE } from "../COMMON";


export default class RoomStage extends Stage {
  io: any;
  messageBox: MessageBox;

  constructor() {
    super()
    const createRoomBtn = new UIButton("离开房间", 120, 60)
    createRoomBtn.x = STAGE_WIDTH - createRoomBtn.width - 25
    createRoomBtn.y = 22
    createRoomBtn.on('click', this.handleOnLeaveRoom.bind(this))
    this.addChild(createRoomBtn)

    // this.backgroundImage = Loader.shared.resources[COMMON_TEXTURE["hall.png"]].texture
    this.background = 0x1382f6



    const g = new Graphics()
    const fastDrawRoundedRect = (x: number, y: number, width: number, height: number, color: number, fill: number, round: number)=>{
      g.lineStyle({ color: color, width: 1 })
      g.beginFill(fill)
      g.drawRoundedRect(x, y, width, height, round);
      g.endFill()
    }

    fastDrawRoundedRect(5, -10, 455, 40, 0x0d3d7f, 0x0b44b6, 8)
    fastDrawRoundedRect(5, 35, 510, 515, 0x0d3d7f, 0x02c1f5, 8)
    fastDrawRoundedRect(465, 5, 328, 555, 0x0d3d7f, 0x066ac8, 8)
    fastDrawRoundedRect(0, STAGE_HEIGHT - 35, 800, 35, 0x0d3d7f, 0x073d85, 0)
    fastDrawRoundedRect(480, 15, 300, 215, 0x0d3d7f, 0x0050ac, 8)
    fastDrawRoundedRect(20, 55, 430, 30, 0x0d3d7f, 0x0091d4, 8)
    fastDrawRoundedRect(20, 90, 430, 295, 0x3fe0ff, 0x044795, 8)
    // fastDrawRoundedRect(5, -10, 455, 40, 0x0d3d7f, 0x0b44b6, 8)
    // fastDrawRoundedRect(5, -10, 455, 40, 0x0d3d7f, 0x0b44b6, 8)
    // fastDrawRoundedRect(5, -10, 455, 40, 0x0d3d7f, 0x0b44b6, 8)

 
    this.addChild(g)


    this.messageBox = new MessageBox(430, 148)
    this.messageBox.x = 20
    this.messageBox.y = 390
    this.addChild(this.messageBox)

  }

  handleOnLeaveRoom() {
    app.back()
  }

  onEnter() {
    this.io = new socket(ROOM_SOCKET_URL, {
      query: {
        username: store.name,
        roomId: store.roomId,
      },
      transports: ['websocket'],
      forceNew: true
    })

    this.io.on('sync', this.sync.bind(this))
    this.io.on('message', (msg: string) => {
      this.messageBox.push(msg)
    })
    return Stage.prototype.onEnter.call(this)
  }

  sync() {

  }

  onLeave() {
    this.io.close()
    return Stage.prototype.onLeave.call(this)
  }
}