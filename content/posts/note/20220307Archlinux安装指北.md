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
```shell
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
> 如果无线网卡无法显示
```shell
# 查看内核是否加载了你的无线网卡驱动
lspci -k | grep Nerwork
# 查看无线连接 是否被禁用(blocked: yes)
rfkill list
rfkill unblock wlan0 # 软解网卡
ip link set wlan0 up #启动网卡
```

# 硬盘分区 + 挂载
> 🙋做好备份，谨慎输入！！！
```shell
fdisk -l # 列出设备
fdisk /dev/<设备名> # 选中硬盘 （如果）
# n 新建
# p 列出
# d 移除
# w 写入
# q 退出
```
按照提示操作即可，分区配置大致如下
- `sda1` ———— `/boot` `efi`分区可跟`windows`共用
- `sda2` ———— `/` 根目录`>=128gb`
- `sda1` ———— swap分区 `>=电脑实际运行内存的60%`

# 格式化分区
```shell
# 如果已有window系统，则不需要，否则会把widnow的启动项删掉
mkfs.fat -F32 /dev/sda1
# 也可以选择ext4
mkfs.btrfs /dev/sda2
# swap
mkfswap /dev/sda3
```

# 挂载分区
> 挂载是有顺序的，需要从根目录开始挂载。
```shell
mount -t btrfs -o subvol=/@,compress=zstd /dev/sda2 /mnt
# 创建 /home 目录 | 挂载
mkdir /mnt/home
mount -t btrfs -o subvol=/@home,compress=zstd /dev/sda2 /mnt/home
# 创建 /boot 目录 | 挂载
mkdir -p /mnt/boot
mount /dev/sda1 /mnt/boot
# 挂载交换分区
swapon /dev/sda3
df -h # 查看挂载情况
free -h # Swap 分区挂载情况
```

# 开始安装
## 更新系统时钟
使用 `timedatectl` 确保系统时间是准确的。不是必须，但对于部分程序来说十分重要。
```shell
# 将系统时间与网络时间进行同步
timedatectl set-ntp true
# 检查服务状态
timedatectl status
```

## 推荐的镜像源如下
```shell
# 中国科学技术大学开源镜像站
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
# 清华大学开源软件镜像站
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
# 华为开源镜像站
Server = https://repo.huaweicloud.com/archlinux/$repo/os/$arch
# 兰州大学开源镜像站
Server = http://mirror.lzu.edu.cn/archlinux/$repo/os/$arch
```
## 更换国内软件仓库镜像源
使用 `vim` 编辑器修改 `/etc/pacman.d` 按 `/` 输入 `mirritlist `找到 `/etc/pacman.d/mirrorlist` （回车后可以用大小写 n 键来上下搜索），按`g` + `d` 进入修改文件。将 `pacman` 软件仓库源更换为国内软件仓库镜像源。
```shell
vim /etc/pacman.d/mirrorlist
```

# 安装系统
## 安装基础内核
```shell
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs
# 如果使用btrfs文件系统，额外安装一个 `btrfs-progs` 包
# 如果提示 GPG证书错误，可能是因为使用的不是最新的镜像，可以通过更新 archlinux-keyring 解决。
pacman -S archlinux-keyring
```

## 生成fstab文件
```shell
genfstab -U /mnt > /mnt/etc/fstab
```

## 切换到新系统下 安装其他功能性软件

```shell
arch-chroot /mnt

# 网络管理 很重要，否则开机没网
pacman -S networkmanager dhcpcd
systemctl enable NetworkManager
# vim 编辑器以及 sudo 权限管理器
pacman -S vim sudo

# 芯片制造商的微码
pacman -S intel-ucode # Intel
pacman -S amd-ucode # AMD
```

## 设置主机名与时区
```shell
# i 键入你想要等等主机名，:wq 保存
vim /etc/hostname

# 加入以下内容
vim /etc/hosts
127.0.0.1 localhost
::1 localhost
127.0.1.1 myarch.localdomain myarch

# 设置时区 （ps： 没有北京）
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc # 把系统时间同步到硬件时间
```
## 设置用户
```shell
passwd root # 给root创建密码
useradd -m -G wheel -s /bin/bash <username>
# -m 创建主目录
# -G 将用户添加到另一个组
# -s 指定默认登陆使用的shell
## wheel 组是一种特殊类型的组，用于控制谁可以访问sudo命令

# 配置访问权限
vim /etc/sudoers
%wheel ALL=(ALL) ALL # 取消注释

# 切换到新用户
su <username>
```


# grub引导双系统
```shell
arch-chroot /mnt
# 设置等待时间，主题
vim /etc/default/grub
grub-install --target=x86_64-efi --efi-directory=/bootgrub-mkconfig > /boot/grub/grub.cfg

```
## 配置archlinuxcn
```shell
vim /etc/pacman.conf
# 取消注释
[multilib]Include = /etc/pacman.d/mirrorlist
# 尾部添加
[archlinuxcn]
SigLevel = Never
Server = https://mirrors.ustc.edu.cn/$repo/$arch
# 安装yay
sudo pacman -Syyu
sudo pacman -S yay
```

# 日用配置及软件安装
```shell

pacman -s nerd-fonts-jetbrains-mono otf-comicshanns-nerd wqy-microhei

git clone https://github.com/lorre0322/dwm
git clone https://github.com/lorre0322/st
cd dwm & sudo make clean install
cd st & sudo make clean install

cp /etc/X11/xinit/xinitrc ~/.xinitrc
vim .xinitrc
# 把最后几行删了添加进去
export DWM=~/Desktop/dwm
mpd &
exec dwm

# 登陆后自动startx
[ $(tty) = "/dev/tty1" ] && cd ~ && startx
```