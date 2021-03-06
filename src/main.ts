import { Loader } from "pixi.js"
import App from "./app"
import { COMMON_TEXTURE_LIST } from "./COMMON"
import { STAGE_HEIGHT, STAGE_WIDTH } from "./constant"
import GameStage from "./stage/game"
import HallStage from "./stage/hall"
import HomeStage from "./stage/home"

document.body.appendChild(App.view)
// App.view.style.borderRadius = "20px"
App.view.style.margin = "auto"
App.view.style.boxShadow = "0 0 30px rgba(0,0,0,.3)"
App.view.style.width = STAGE_WIDTH * 1.3 + 'px';
App.view.style.height = STAGE_HEIGHT * 1.3 + 'px';
document.body.style.background = "#f5f5f5"
document.body.style.margin = "0px"
document.body.style.height = "100%"
document.body.style.display = "flex"
document.body.style.justifyContent = "center"
document.documentElement.style.height = "100%"

// LOADER
COMMON_TEXTURE_LIST.forEach(<any>Loader.shared.add.bind(Loader.shared))
Loader.shared.onComplete.once(()=>{
    App.push(HomeStage)
})
Loader.shared.load()
