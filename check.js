const https = require("https")

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT = process.env.TELEGRAM_CHAT

const URL =
"https://new.land.naver.com/complexes/166198?ms=36.6206354,127.4559676,18"

async function run(){

  const puppeteer = require("puppeteer")

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process"
    ]
  })

  const page = await browser.newPage()

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  )

  await page.goto(URL,{
    waitUntil:"domcontentloaded",
    timeout:120000
  })

  await page.waitForSelector(".item_inner",{timeout:60000})

  const data = await page.evaluate(()=>{

    const items = document.querySelectorAll(".item_inner")

    const list = []

    items.forEach(i=>{
      list.push(i.innerText)
    })

    return list
  })

  await browser.close()

  send(data.join("\n\n"))
}

function send(msg){

  const url =
  `https://api.telegram.org/bot${TOKEN}/sendMessage`

  const post = JSON.stringify({
    chat_id:CHAT,
    text:msg.slice(0,4000)
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
