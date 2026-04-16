const https = require("https")

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT = process.env.TELEGRAM_CHAT

const URL =
"https://new.land.naver.com/api/articles/complex/166198" +
"?realEstateType=APT" +
"&tradeType=B1" +
"&tag=::::::::" +
"&rentPriceMin=0" +
"&rentPriceMax=900000000" +
"&priceMin=0" +
"&priceMax=900000000" +
"&areaMin=0" +
"&areaMax=900000000" +
"&showArticle=false" +
"&sameAddressGroup=false" +
"&priceType=RETAIL" +
"&page=1" +
"&complexNo=166198" +
"&type=list" +
"&order=rank";

function run(){

  const req = https.request(URL,{
    method:"GET",
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Referer":"https://new.land.naver.com/complexes/166198",
      "Accept":"application/json"
    }
  },res=>{

    let data=""

    res.on("data",chunk=>data+=chunk)

    res.on("end",()=>{

      try{

        const json = JSON.parse(data)

        const list = json.articleList.map(a=>
          `${a.buildingName} ${a.floorInfo} ${a.areaName}\n${a.dealOrWarrantPrc}`
        )

        send(list.join("\n\n"))

      }catch(e){
        send("파싱 실패\n"+data.slice(0,500))
      }
    })
  })

  req.on("error",e=>{
    send("요청 실패: "+e.message)
  })

  req.end()
}

function send(msg){

  const post = JSON.stringify({
    chat_id:CHAT,
    text:msg.slice(0,4000)
  })

  const req = https.request(
    `https://api.telegram.org/bot${TOKEN}/sendMessage`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Content-Length":post.length
      }
    }
  )

  req.write(post)
  req.end()
}

run()
