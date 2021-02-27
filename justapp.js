const fetch = require('node-fetch');

setInterval(function() {
  //  I will run for every 15 minutes
 }, 15 * 60 * 1000);

fetch("https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.MD.json?vaccineinfo", {
  method: "get",
  headers: { 
      "Content-Type": "application/json",
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
      'Accept':' /',
      'Accept-Language':' en-GB,en;q=0.5',
      'Referer':' https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine',
      'Connection':' keep-alive'
    },
})
  .then((res) => res.json())
  .then((response) => {
    // console.log(response)
    // console.log(response.responsePayloadData.data)
    // console.log(response.responsePayloadData.data.MD[0])
    response.responsePayloadData.data.MD.forEach(avCheck => {
      //console.log(avCheck)
      if(avCheck.status == "Available"){
        //mailer Goes here
        console.log("That")
      }
    });
  }
  );
  
// const fetch = require('node-fetch');

// fetch('https://google.com')
//     .then(res => res.text())
//     .then(text => console.log(text))

