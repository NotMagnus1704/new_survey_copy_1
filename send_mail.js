const nodemailer = require('nodemailer');

const email_address = process.env.EMAIL_ADDRESS;
const email_password = process.env.EMAIL_PASSWORD;

async function sendEmail(clientEmail, formId, dateOfSubmission, timeOfSubmission) {
    // creating transporter using SMTP 
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: email_address,
            pass: email_password
        }
    });

    // defining email options
    const mailOptions = {
        from: email_address,
        to: clientEmail,
        subject: 'VRNC Form Submitted Successfully',
        text: `Dear Client,\nThis is an automated email.\n\nYour form has been successfully submitted!\nBelow are the details of your submission.\n\nPlease note it down for future uses. It is significantly important!\n\n-------------------------------------------\nForm ID: ${formId}\nDate of submission: ${dateOfSubmission}\nTime of submissiom: ${timeOfSubmission}\n-------------------------------------------\n\n\nRegards,\n VRNC`
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent : " + info.response);
    });
}


module.exports = sendEmail;

