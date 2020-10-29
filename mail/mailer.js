var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

let myEmail= "alexandercarolineg@gmail.com"
const oauth2Client = new OAuth2(
    "350882604538-37t73jnlieb8iqg8bpa5l748t81g321b.apps.googleusercontent.com", // ClientID
    "8nHTDebOsPuy981hD76Mk1Vi", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04nF2ep5c6oWQCgYIARAAGAQSNwF-L9Ir6_mHWZ_4XrEt281PNS363Lxmsnrv4M2SyvH7MCMgtWgjquQgaVMREYgj18qJIhuiZy0"
});

const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    tls: {
        rejectUnauthorized: false
      },
    auth: {
         type: "OAuth2",
         user: myEmail, 
         clientId: "350882604538-37t73jnlieb8iqg8bpa5l748t81g321b.apps.googleusercontent.com",
         clientSecret: "8nHTDebOsPuy981hD76Mk1Vi",
         refreshToken: "1//04nF2ep5c6oWQCgYIARAAGAQSNwF-L9Ir6_mHWZ_4XrEt281PNS363Lxmsnrv4M2SyvH7MCMgtWgjquQgaVMREYgj18qJIhuiZy0",
         accessToken: accessToken
    }
});



exports.sendMail = async (to,subject,text) =>{
    var mailOptions = {
        from: myEmail,
        to: to,
        subject: subject,
        text: text
      };
      
      return new Promise(resolve =>{
        smtpTransport.sendMail(mailOptions, function(error, info){
            smtpTransport.close();
            if (error) {
              console.log(error);
              resolve(false);
            } else {
              console.log('Email sent: ' + info.response);
              resolve(true)
            }
          });
      })
}