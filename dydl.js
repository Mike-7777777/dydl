import fetch from "node-fetch";
import fs from "fs";
import md5 from "crypto-js/md5.js";
import download from "download";
import ffmpeg from "js-ffmpeg";
// const rid = diy.room_id;

// when doing multiple dydl, the msTime will not work well. Need to solve.
export function dydl(ifVideo, room, dist, msTime, did) {
  const video = ifVideo;
  const rid = room;
  const url = "https://m.douyu.com/" + rid;
  const localAddress = dist;
  const dydid = did;
  const filename = rid + getNowFormatDate();
  let video_length = 0;

  if (video == 0) {
    video_length = 1000;
  } else {
    video_length = msTime;
  }
  if (!fs.existsSync(localAddress)) {
    fs.mkdirSync(localAddress);
  }

  console.log(
    "The local file stored path: " + localAddress + "/" + filename + ".xs"
  );

  getUv(rid, url, dydid).then((res) => {
    console.log("The stream: " + res);
    dl(res, localAddress, filename, video_length, function () {
      if (video == 0) {
        let from = localAddress + "/" + filename + ".xs";
        let opts = "-ss 00:00:00 -r 1 -vframes 1 -an -f mjpeg";
        let dist = localAddress + "/" + filename + ".jpg";
        // const stats = fs.statSync(localAddress + "/" + filename + ".xs")
        // console.log(stats.size);
        // 可以设置一个假while循环 每次i+1 顺便等待下载
        ffmpeg
          .ffmpeg(from, opts, dist, function (progress) {
            console.log(progress);
          })
          .success(function () {
            // not good
            // process.exit();
          })
          .error(function (error) {
            console.log(error);
          });
      }
      return;
    });
  });
}
async function getUv(rid, url, dydid) {
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    let page = await response.text();
    let a = page.match(/(function ub9.*)[\s\S](var.*)/i);
    let ubf = String(a[1]); //ub98484234的函数内容
    let ubv = String(a[2]); //ub98484234的所需常量
    let ubn = ubf.replace("{", "{" + ubv); //将所需常量放入函数内部 避免出现未初始化报错
    ubn = ubn.replace(
      "return",
      `strc = strc.replace("CryptoJS.MD5", "md5");return`
    );
    ubn = ubn.replace("function ub98484234", "(function ");
    ubn = ubn + ")";
    let tt = Math.round(new Date().getTime() / 1000).toString();
    return getUrl(rid, getParam(rid, tt, ubn, dydid));
  } catch (error) {
    console.log(error);
  }
}

function getParam(r, tt, ubn, dydid) {
  return eval(ubn)(r, dydid, tt);
}

async function getUrl(r, param) {
  let postData;
  postData = param + "&ver=219032101&rid=" + r + "&rate=1";

  const response = await fetch("https://m.douyu.com/api/room/ratestream", {
    method: "POST",
    body: postData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  let body = await response.json();
  let result = "";
  if (body.code == "0") {
    let url = body.data.url;
    if (String(url).indexOf("mix=1") != -1) {
      result = "PKing";
    } else {
      let p = /^[0-9a-zA-Z]*/;
      let tmpArr = String(body.data.url).split("/");
      result = String(tmpArr[tmpArr.length - 1]).match(p)[0];
    }
  } else {
    result = "0";
  }
  let realLive = "";
  if (result == "0") {
    realLive = "None";
  } else {
    realLive = "http://tx2play1.douyucdn.cn/live/" + result + ".xs";
  }
  return realLive;
}

function dl(httpAddress, localAddress, filename, time, callback) {
  const readable = download(httpAddress)
  const writable = fs.createWriteStream(localAddress + "/" + filename + ".xs");
  readable.pipe(writable);
  setTimeout(() => {
    console.log("Stop writing");
    readable.unpipe(writable);
    console.log("Manually close the file stream.");
    writable.end();
    callback();
  }, time);
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ".";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate =
    seperator1 +
    year +
    seperator1 +
    month +
    seperator1 +
    strDate +
    seperator1 +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
}
