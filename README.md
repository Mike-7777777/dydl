# DYDL

DYDL是一个用NodeJS实现的，可以获取斗鱼直播间视频流地址并下载特定时间直播流的命令行程序。

逻辑参考了[DouyuEx](https://greasyfork.org/zh-CN/scripts/394497-douyuex-%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6)，使其脱离浏览器环境也可以实现。

## Usage

```
npm install

node dydl.js [视频/截图] [房间号] [保存文件的目录(文件夹)] [需要下载的直播长度(ms)] [cookie中的did]

node dydl.js [video/screenshot] [room id] [dist folder] [length of video(ms)] [did in cookie]
```

例子：

```
node dydl.js 52004 1 downloads 10000 // 下载52004的10000ms直播视频到downloads文件夹，文件名为52004-yyyy-mm-dd-hh.mm.ss.xs 
node dydl.js 52004 0 downloads // 将52004的截图保存在downloads文件夹下
```

Example:

```
node dydl.js 52004 1 downloads 10000 6************// download 10000ms video from room 52004, and save in folder 'downloads'
node dydl.js 52004 0 downloads 6************// download a image from room 52004, and save in folder 'downloads'
```

Windows下如果没有Node环境，可以使用[可执行文件](https://github.com/Mike-7777777/dydl/releases/)。

```
//视频
dydl [房间号] [保存文件的目录(文件夹)] [需要下载的直播长度(ms)]
```

# To-do List

截图
