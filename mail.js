var nodejsmailer  = require('nodemailer'); // use mailer nodejs module
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
} 

var mailOptions ={
    from:'milantak65@gmail.com',
    to:'milantak106@gmail.com',
    subject:"Sending Email to Rajat",
    text:"Welcome to NodeMailer, It's Working",
    html: '<h1>Welcome</h1><p>That was easy!</p>',
}   


var transporter = nodejsmailer.createTransport({
    service:'gmail',
    port:465,
    secure: true,
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
}); 

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

//sends the mail
transporter.sendMail(mailOptions,function(error,info){

     if(error){
         console.log(error);
     }else{
         console.log('Email Send ' + info.response);
     }
});