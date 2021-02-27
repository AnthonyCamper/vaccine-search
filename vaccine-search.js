const fetch = require('node-fetch');
const dotenv = require('dotenv');
const express = require('express');
const nodemailer = require('nodemailer');
const util = require('util');
// import mjml2html from 'mjml'
// import { mjml2html } from 'mjml'
// const mjml2html = require('mjml')
// const mjml = require('mjml2html')
const mjml2html = require('mjml');

// import mjml2html from 'mjml'
const app = express()
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_AUTH_USERNAME,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
})

const md_recipients = 'youremailhere@gmail.com'
console.log("one");
setInterval(function() {
  //  I will run for every 15 minutes
  console.log('two');
  var sendorNah =  false;
  var locs = [];

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
    console.log(response)
    // console.log(response.responsePayloadData.data)
    // console.log(response.responsePayloadData.data.MD[0])
    response.responsePayloadData.data.MD.forEach(avCheck => {
      if(avCheck.status == "Available"){
        sendorNah = true;
        locs.push(avCheck);
        console.log("> Found Available Location")
      }
    });
  }
  ).then(() => {
      if(sendorNah){
        var options = {}
        const htmlOutput = mjml2html(`
        <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
      
              <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>
      
              <mj-divider border-color="#F45E43"></mj-divider>
      
              <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Vaccine Updates</mj-text>
              
              <mj-text>
                yah boi
				      </mj-text>

              <mj-text font-size="15px">City New: </mj-text>
            
              <mj-text font-size="15px">Location:</mj-text>
              
              <mj-text font-size="15px">State:</mj-text>
              
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
      `, options)


      /*
        Print the responsive HTML generated and MJML errors if any
      */
      console.log(htmlOutput.html)

              //   var insidest = `
              //   <table>
              //   <tr>  
              //     <th>Status</th>
              //     <th>City</th>
              //     <th>State</th>
              //   </tr>
              //   `
              //   locs.forEach(anonymouse => {
              //     //var coolStuff = "\n" + anonymouse.city + " " + anonymouse.state + " " + anonymouse.status
              //   insidest += `
              //   // <tr>
              //   //   <td>` +anonymouse.status + `</td>
              //   //   <td>` +anonymouse.city + `</td>
              //   //   <td>` +anonymouse.state + `</td>
              //   //   </tr>
              //   // `
              //   // console.log(anonymouse)
              //  });
              //  insidest += "</table>"
              //  console.log('---=-=-=-=-=-=-=-----')
              //  console.log(minify + insidest + minify2);
          transporter.sendMail({

            from: process.env.FROM,
            to: md_recipients,
            subject: 'Maryland CVS Vaccine Availability Found',
            text: JSON.stringify(locs),
            // html: htmlOutput.html

          }, function (error, info) {
            if (error) {
        throw error
            } else {
              console.log('Maryland email successfully sent!')
            }
          })
      
        console.log(locs);
      }
    }
  )
 },90000);

//15 * 60 * 1000
// const fetch = require('node-fetch');

// fetch('https://google.com')
//     .then(res => res.text())
//     .then(text => console.log(text))

app.listen(process.env.PORT)
