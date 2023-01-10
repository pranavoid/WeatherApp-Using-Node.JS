
const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",Math.trunc(orgVal.main.temp-273.15));
    temperature = temperature.replace("{%temphum%}", orgVal.main.humidity);
    temperature = temperature.replace("{%tempfeelslike%}", Math.trunc(orgVal.main.feels_like-273.15)); 
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather.main);
    return temperature;
    
}
const server = http.createServer((req,res)=>{ 
  
   if(req.url == "/"){
       requests(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.877719&lon=76.872581&appid=9455d0ffa6e16930b74c9e5d4b4d4599"
        )
        .on("data", (chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData]; 
            //console.log(arrData[0].main.temp-273);
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile, val))
            .join("");
          res.write(realTimeData);
          // console.log(realTimeData);
        })
        .on("end", (err)=>{
            if(err) return console.log("Connection Lost Due To Error", err);
            res.end();
            //console.log("end");
        });
   }
   else{
    res.end("File Not Found");
   }
  
})

server.listen(8000,"127.0.0.1", (err)=>{
    console.log("server started...");
})