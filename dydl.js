import fetch from "node-fetch";
import fs from "fs";
import md5 from "crypto-js/md5.js";
import diy from "./diy.js";
import download from "download";
import ffmpeg from "js-ffmpeg";
// testrun: node dydl.js 1819564 "downloads/" 1000
// const rid = diy.room_id;

const args = process.argv.slice(2);
const video = args[0];
const rid = args[1];
const localAddress = args[2];
const filename = rid + getNowFormatDate();
let video_length = 0
if(video == 0){
  video_length = 300;
}else{
  video_length = args[3];
}
if (!fs.existsSync(localAddress)) {
  fs.mkdirSync(localAddress);
}

console.log(localAddress + "/" + filename + ".xs");

const Url = "https://m.douyu.com/" + rid;
getUv().then((res) => {
  console.log(res);
  dl(res, localAddress, filename, video_length).then((res) => {
    console.log(res);
    if (video == 0) {
      let from = localAddress+"/"+filename + ".xs";
    let opts = "-ss 00:00:00 -r 1 -vframes 1 -an -f mjpeg";
    let dist = localAddress+"/"+filename +".jpg";
    ffmpeg
    .ffmpeg(from, opts,dist);
    }
  })
});

async function getUv() {
  try {
    const response = await fetch(Url, {
      method: "GET",
    });
    let page = await response.text();
    let a = page.match(/(function ub9.*)[\s\S](var.*)/i);
    let ub9_ex = String(a[0]).replace("ub98484234", "ub98484234_ex");
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
    return getUrl(rid, getParam(rid, tt, ubn));
  } catch (error) {
    console.log(error);
  }
}

function getDyDid() {
  return "76c262d9fd1fe265974989a000031601";
}

function getParam(r, tt, ubn) {
  return eval(ubn)(r, getDyDid(), tt);
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

async function dl(httpAddress, localAddress, filename, time) {
  const readable = download(httpAddress);
  const writable = fs.createWriteStream(localAddress + "/" + filename + ".xs");
  readable.pipe(writable);
  setTimeout(() => {
    console.log("Stop writing");
    readable.unpipe(writable);
    console.log("Manually close the file stream.");
    writable.end();
    return "download successed";
  }, time);
}
// function write2file(name, content) {
//   try {
//     const filename = "mike/" + name + ".js";
//     const data = fs.writeFileSync(filename, content);
//   } catch (err) {
//     console.error(err);
//   }
// }

// function write2fileitself(name, content) {
//   try {
//     const filename = name + ".js";
//     const data = fs.appendFileSync(filename, content);
//   } catch (err) {
//     console.error(err);
//   }
// }
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
