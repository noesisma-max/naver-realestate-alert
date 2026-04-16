const https = require("https")

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT = process.env.TELEGRAM_CHAT

const URL =
"https://new.land.naver.com/complexes/166198?ms=36.6206354,127.4559676,18"

async function run(){

  const browser = await require("puppeteer").launch({
    args:["--no-sandbox"]
  })

  const page = await browser.newPage()

  await page.goto(URL,{waitUntil:"networkidle2"})

  await page.waitForSelector(".item_inner")

  const data = await page.evaluate(()=>{

    const items = document.querySelectorAll(".item_inner")

    const list = []

    items.forEach(i=>{
      list.push({
        title:i.innerText
      })
    })

    return list
  })

  await browser.close()

  send(JSON.stringify(data,null,2))
}

function send(msg){

  const url =
  `https://api.telegram.org/bot${TOKEN}/sendMessage`

  const post = JSON.stringify({
    chat_id:CHAT,
    text:msg
  })

  const req = https.request(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Content-Length":post.length
    }
  })

  req.write(post)
  req.end()
}

run()
