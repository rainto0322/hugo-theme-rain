+++
title = 'Archlinux安装指北'
date = 2022-03-07T08:00:00-07:00
categories = "笔记"
tags = ["Archlinux"]
draft = false
img = "../img/mydwm.gif"
+++

> 在window 11更新后，偶尔的卡顿，动画的掉帧，💩 般的界面，繁琐的操作都令我痛苦不堪。在机缘巧合下，看到up主theCW的视频，用的是dwm。自动平铺，键盘流，受此诱惑就成为了众多arch教徒之一。本教程仅适合自己，更多详细请查阅 [✨archlinux简明指南](https://arch.icekylin.online/)

# 连接网络
```bash
# 进入交互式命令行
iwctl
# 列出无线网卡设备名，比如无线网卡看到叫 wlan0
device list

# 扫描网络 | 列出所有 wifi 网络
station wlan0 scan
station wlan0 get-networks
# 进行连接，注意这里无法输入中文。回车后输入密码即可进行连接，注意这里无法输入中文。回车后输入密码即可
station wlan0 connect wifi-name

exit # 连接成功后退出

```

```go {hl_lines=["3-4"],linenostart=199,file="demo.js"}
package main
import "fmt"
func main() {  
    fmt.Println("Hello, World!")fmt.Println("Hello, World!")fmt.Println("Hello, World!")  
}
```