/**
 * 窗口管理器类
 */
import { BrowserWindow } from 'electron'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
const defaultWindowOptions = {
    show: false,
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 400,
    webPreferences: {
        // webSecurity: false, // 取消跨域限制
        nodeIntegration: true
    }
}

const windowOffset = 50

export default class WindowManager {
    constructor() {
        this.windows = new Map()
    }

    // 创建新窗口
    createWindow() {
        console.log('进入createWindow')
        const win = new BrowserWindow(this.windowOptions())
        const id = win.id
        console.log('id:' + id)
        // console.log('WEBPACK_DEV_SERVER_URL', process.env.WEBPACK_DEV_SERVER_URL)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
            if (!process.env.IS_TEST) win.webContents.openDevTools()
        } else {
            console.log('加载app协议')
            createProtocol('app')
            win.loadURL('app://./index.html')
            win.webContents.openDevTools()
        }
        win.webContents.on('did-finish-load', ()=>{
            console.log('进入did-finish-load里面')
            win.setTitle(`${win.getTitle()} #${id}`)
            win.show()
            win.focus()
        })

        win.on('closed', ()=>{
            this.windows.delete(id)
        })

        this.windows.set(id, win)
        return win
    }

    // 动态返回窗口选项，相对位置为上级窗口大小一致，位置偏移50像素
    windowOptions() {
        if (this.isEmpty()) {
            return defaultWindowOptions
        }

        const currentWindow = BrowserWindow.getFocusedWindow()
        const [width, height] = currentWindow.getSize()
        const [x, y] = currentWindow.getPosition()
        const relativeOptions = {
            width,
            height,
            x: x + windowOffset,
            y: y + windowOffset
        }
        return { ...defaultWindowOptions, ...relativeOptions }
    }

    isEmpty() {
        return this.windows.size === 0
    }
}