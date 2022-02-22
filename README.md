# DYDL

DYDL是一个用NodeJS实现的，可以获取斗鱼直播间视频流地址并下载特定时间直播流的命令行程序。

逻辑参考了[DouyuEx](https://greasyfork.org/zh-CN/scripts/394497-douyuex-%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6)，使其脱离浏览器环境也可以实现。

# 使用方法

```
npm install

dydl.js [房间号] [保存文件的目录(文件夹)] [需要下载的直播长度(ms)]
```

例子：

```
node dydl.js 52004 dist 1000// ***.xs 
// 根目录中的dist文件夹内出现 52004-yyyy-mm-dd-hh.mm.ss.xs 
```

# To-do List
