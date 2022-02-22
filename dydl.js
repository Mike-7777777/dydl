import fetch from "node-fetch";
import fs from "fs";
import md5 from "crypto-js/md5.js";
import diy from "./diy.js";
import download from "download";


// const rid = diy.room_id;
// const httpAddress = "http://tx2play1.douyucdn.cn/live/1819564rKlX79tyB.xs";
const args = process.argv.slice(2);
const rid = args[0];
const localAddress = "downloads/";
localAddress = args[1];
const filename = rid + getNowFormatDate() + ".xs";

console.log(filename)

const Url = "https://m.douyu.com/" + rid;
const dl_link = getUv()
dl_link.then(res=> {
  console.log(res)
  dl(res,localAddress,filename)
})

// http://tx2play1.douyucdn.cn/live/1819564rU1KnDSWc.xs

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

async function dl(httpAddress, localAddress, filename) {
  const readable = download(httpAddress);
  const writable = fs.createWriteStream(localAddress + filename);
  readable.pipe(writable);
  setTimeout(() => {
    console.log("Stop writing to 1.xs");
    readable.unpipe(writable);
    console.log("Manually close the file stream.");
    writable.end();
  }, 1000);
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
  var currentdate = seperator1 + year + seperator1 + month + seperator1 + strDate
          + seperator1 +date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
  return currentdate;
}