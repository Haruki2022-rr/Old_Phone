// reference: https://www.mailersend.com/blog/send-email-nodejs
// Sending emails with an mailersend email API
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

//insert your email and name
const sentFrom = new Sender( process.env.SENDER_EMAIL,  process.env.SENDER_NAME);

// for veificatin mail on signup
const sendVerificationEmail = async (user, verificationUrl) => {
  const recipients = [
    new Recipient(user.email, user.name)
];

  const htmlContent = `
    <p>Hi ${user.name},</p>
    <p>please verify your email by clicking this link:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link will expire in 60 minutes.</p>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Verify your email address")
    .setHtml(htmlContent)
    .setText(`Hi ${user.name}, please verify your email by clicking this link: ${verificationUrl}. This link will expire in 60 minutes.`);

  try {
    const response = await mailerSend.email.send(emailParams);
    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};


// for resseting password
const sendResetPasswordEmail = async (user, verificationUrl) => {
  const recipients = [
    new Recipient(user.email, user.name)
];

  const htmlContent = `
    <p>Hi ${user.name},</p>
    <p>please reset your password from this link:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link will expire in 60 minutes.</p>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Reset your password")
    .setHtml(htmlContent)
    .setText(`Hi ${user.name},please reset your password from this link: ${verificationUrl}. This link will expire in 60 minutes.`);

  try {
    const response = await mailerSend.email.send(emailParams);
    console.log("reset-password email sent successfully:", response);
  } catch (error) {
    console.error("Error sending reset-password email:", error);
  }
};

const sendConfirmationEmail = async (user) => {
  const recipients = [
    new Recipient(user.email, user.name)
];

  const htmlContent = `
    <p>Hi ${user.name},</p>
    <p>Your password has been updated!</p>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Password updated")
    .setHtml(htmlContent)
    .setText(`Hi ${user.name}, Your password has been updated!`);

  try {
    const response = await mailerSend.email.send(emailParams);
    console.log("Confirmation email sent successfully:", response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};


module.exports = {sendVerificationEmail, sendResetPasswordEmail, sendConfirmationEmail};
