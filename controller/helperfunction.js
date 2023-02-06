const UserAgent=require('user-agents');
const ShareList=require('../model/ShareList')
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'noreply.finleafy@gmail.com',
    pass: 'yyzhnwfeamcfskxn',
  },
});
transporter.verify();



sendEmail=(receipient,subject,text)=>{
  transporter.sendMail({
    from: '"Finleafy" <noreply.finleafy@gmail.com>', // sender address
    to: receipient, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  }).then(info => {
    console.log({info});
  }).catch(console.error);
}

const cheerio=require('cheerio')
const request=require('request')
pricetrackeramazon=async()=>{
  url='https://www.amazon.in/Crucial-PC4-25600-SODIMM-260-Pin-Memory/dp/B08C4Z69LN?ref_=ast_sto_dp&th=1'
  request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);

			var price = $('.a-price .a-price-whole').text().split('.')[0].replace('₹', '').replace(',', '');
			var mrp = $('.a-text-price .a-offscreen').text().replace('₹', '').replace(',', '');
      console.log(price)
		}
		else {
			console.log("Uh oh. There was an error.");
		}
	});
}

pricetrackerflipkart=async()=>{
  url='https://www.flipkart.com/tp-link-tl-wr845n-n-300-mbps-wireless-router/p/itm4f35007227b21?pid=RTREK2VG4GBDUKFN&cmpid=product.share.pp'

  request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);

			var price = $('.CEmiEU ._25b18c ._30jeq3').text().replace('₹', '').replace(',', '');
			var mrp = $('.CEmiEU ._25b18c ._3I9_wc').text().replace('₹', '').replace(',', '');

			console.log(price,mrp)
		}
		else {
			console.log("Uh oh. There was an error.");
		}
	});
}






module.exports={sendEmail,pricetrackeramazon,pricetrackerflipkart}