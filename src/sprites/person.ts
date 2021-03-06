import { AnimatedSprite, Container, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { COMMON_TEXTURE } from "../COMMON";
import { GRID_HEIGHT, GRID_WIDTH } from "../constant";
import { TBubbleStyle, TGamePlayerMoveTarget } from "../global.d";
import game from "../stage/game";
import commonFactory from "../textureFactory/commonFactory";
import roleInGameFactory from "../textureFactory/roleInGameFactory";
import { TGameRole } from "../textureFactory/roleSelectFactory";


export default class Person extends Container {

  hasChange: boolean = false
  keyEvent: string[] = []

  // 
  gridX: number = 0
  gridY: number = 0
  sprite: AnimatedSprite;
  textureMap
  booms: any;

  speed: number = 2
  speedLimit: number = 10
  power: number = 1
  powerLimit: number = 10
  popCount: number = 2
  popCountLimit: number = 1

  // style setting
  bubbleStyle: TBubbleStyle = "RANBOW"
  _moveTarget: TGamePlayerMoveTarget = TGamePlayerMoveTarget.None;
  isMe: boolean;

  constructor(gridX: number, gridY: number, name: string, role: TGameRole, isMe: boolean = false) {
    super()

    this.zIndex = 2
    this.isMe = isMe

    this.gridX = gridX
    this.gridY = gridY
    this.x = gridX * GRID_WIDTH + GRID_WIDTH / 2
    this.y = gridY * GRID_HEIGHT + GRID_HEIGHT / 2

    this.textureMap = roleInGameFactory()[role]

    // shadow
    const shadow = new Sprite(commonFactory().shadow)
    shadow.anchor.set(.5, -0.2)
    // shadow.alpha = 0.7
    this.addChild(shadow)

    this.sprite = new AnimatedSprite([
      this.textureMap.down_1,
      this.textureMap.down_2,
      this.textureMap.down_3,
      this.textureMap.down_4,
      this.textureMap.down_5,
    ], true)

    this.sprite.loop = true
    this.sprite.animationSpeed = 0.17
    this.sprite.anchor.set(0.5, 0.75)
    this.sprite.gotoAndStop(4)
    this.addChild(this.sprite)


    if(isMe){
      const tag = new Sprite(Loader.shared.resources[COMMON_TEXTURE.common_gate].texture)
      tag.scale.set(.3, .3)
      tag.anchor.set(.5, .5)
      tag.x = 0
      tag.y = - tag.height - 20
      this.addChild(tag)
    }else{
      const text = new Text(name, new TextStyle({
        fontSize: 14,
        wordWrap: true,
        breakWords: true,
        fill: 0xffffff,
        strokeThickness: 3,
      }))
  
      text.anchor.set(.5, .5)
      text.y = - this.sprite.height * 0.75 - 15
      this.addChild(text)
  
    }
  }

  showTag(){

  }

  set moveTarget(val: TGamePlayerMoveTarget) {
    if (this._moveTarget == val) {
      return
    }
    this.hasChange = true
    this._moveTarget = val
    switch (this.moveTarget) {
      case TGamePlayerMoveTarget.Left:
        this.sprite.textures = [
          this.textureMap.right_1,
          this.textureMap.right_2,
          this.textureMap.right_3,
          this.textureMap.right_4,
          this.textureMap.right_5,
        ]
        this.sprite.scale.set(-1, 1);
        break;
      case TGamePlayerMoveTarget.Right:
        this.sprite.textures = [
          this.textureMap.right_1,
          this.textureMap.right_2,
          this.textureMap.right_3,
          this.textureMap.right_4,
          this.textureMap.right_5,
        ]
        this.sprite.scale.set(1, 1);
        break;
      case TGamePlayerMoveTarget.Up:
        this.sprite.textures = [
          this.textureMap.up_1,
          this.textureMap.up_2,
          this.textureMap.up_3,
          this.textureMap.up_4,
          this.textureMap.up_5,
        ]
        this.sprite.scale.set(1, 1);
        break;
      case TGamePlayerMoveTarget.Down:
        this.sprite.textures = [
          this.textureMap.down_1,
          this.textureMap.down_2,
          this.textureMap.down_3,
          this.textureMap.down_4,
          this.textureMap.down_5,
        ]
        this.sprite.scale.set(1, 1);
        break;
    }
  }

  get moveTarget(): TGamePlayerMoveTarget {
    return this._moveTarget
  }

  handleKeydown(e: KeyboardEvent) {
    if (this.keyEvent.some(item => item == e.code)) {
      return
    }

    if ([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ].includes(e.code)) {
      this.moveTarget = <any>{
        "ArrowLeft": "Left",
        "ArrowRight": "Right",
        "ArrowUp": "Up",
        "ArrowDown": 'Down'
      }[e.code]
      this.keyEvent.push(e.code)
    } else if (e.code == 'Space') {
      (this.parent.parent as game).onCreateBubble(
        this.gridX,
        this.gridY,
        this.bubbleStyle,
        this.power
      )
    }
  }
  handleKeyup(e: KeyboardEvent) {
    if ([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ].includes(e.code)) {
      this.sprite.stop()
      this.keyEvent = this.keyEvent.filter(item => item != e.code)
      switch (this.keyEvent[this.keyEvent.length - 1]) {
        case "ArrowLeft": this.moveTarget = TGamePlayerMoveTarget.Left; break;
        case "ArrowRight": this.moveTarget = TGamePlayerMoveTarget.Right; break;
        case "ArrowUp": this.moveTarget = TGamePlayerMoveTarget.Up; break;
        case "ArrowDown": this.moveTarget = TGamePlayerMoveTarget.Down; break;
        default:
          this.moveTarget = TGamePlayerMoveTarget.None
      }
    }
  }

  onUpdate() {
    if (this.moveTarget == 'None') {
      this.sprite.gotoAndStop(4)
      return;
    } else if (!this.sprite.playing) {
      this.sprite.play()
    }

    let x = this.x;
    let y = this.y;
    switch (this.moveTarget) {
      case 'Left': x -= this.speed; break;
      case 'Right': x += this.speed; break;
      case 'Up': y -= this.speed; break;
      case 'Down': y += this.speed; break;
    }

    let gridX = Math.floor(x / GRID_WIDTH)
    let gridY = Math.floor(y / GRID_HEIGHT)

    const parent = this.parent.parent as game
    if(parent.me == this){
      parent.iCanGo(gridX, gridY, x, y)
    }


  }


}