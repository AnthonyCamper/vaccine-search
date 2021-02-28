const fetch = require('node-fetch');
const dotenv = require('dotenv');
const express = require('express');
const nodemailer = require('nodemailer');
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

function sleep(milliseconds) { 
  let timeStart = new Date().getTime(); 
  while (true) { 
      let elapsedTime = new Date().getTime() - timeStart; 
      if (elapsedTime > milliseconds) { 
          break; 
      } 
  } 
} 

const state_recipients = 'putyouremailhere@gmail.com'
const state_bcc = 'putbccemailshere@gmail.com'

console.log("Starting");
setInterval(function() {
  //  I will run for every 15 minutes
  console.log('Searching');
  var vaccineavail =  false;
  var locs = [];
  var obj;
// Replace the state in the fetch
  fetch("https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.NY.json?vaccineinfo", {
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
  .then(data => obj = data)
  .then((response) => {
    // console.log(response.responsePayloadData.data)
    // console.log(response.responsePayloadData.data.MD[0])
    // Check if vaccine is available at any locations
    response.responsePayloadData.data.NY.forEach(avCheck => {
      if(avCheck.status == "Available"){
        vaccineavail = true;
        locs.push(avCheck);
        // You can push/check for attributes
        // cities.push(avCheck.city) 
        // console.log(test)   
        console.log("> Found Available Location")
      }
    });
  }
  ).then(() => {
      if(vaccineavail){
                var htmltable = `
                <table>
                <tr>  
                  <th>City</th>
                  <th>State</th>
                  <th>Status</th>
                </tr>
                `
                locs.forEach(appointment => {
                htmltable += `
                <tr>
                  <td style ="padding: 0 15px 0 0;">` +appointment.city + `</td>
                  <td style ="padding: 0 15px 0 0;">` +appointment.state + `</td>
                  <td style ="padding: 0 15px 0 0;">` +appointment.status + `</td>
                  </tr>
                `
                console.log(appointment)
               });
               htmltable += "</table>"
               console.log('---=-=-=-=-=-=-=-----')
               console.log(htmltable);
               test = (htmltable);
            // Send Email                  
            transporter.sendMail({
            from: process.env.FROM,
            to: state_recipients,
            bcc: state_bcc,
            subject: 'CVS Vaccine Availability Found',
            html: test
          }, function (error, info) {
            if (error) {
            throw error
            } else {
              console.log('Emails successfully sent!')
              console.log('An Email was sent to ' + state_recipients + state_bcc)
              console.log("Sleeping for 10 Minutes")
              sleep(600000)
            }
          })
        console.log(" Found Vaccine Locations")
        console.log(locs);
      }
    }
  )
 },90000); // set to time interval in milliseconds 

app.listen(process.env.PORT)
