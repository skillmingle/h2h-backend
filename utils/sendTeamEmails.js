// utils/sendTeamEmails.js
const axios = require("axios");

const sendTeamEmails = async (recipients,data) => {

    const fourDigitNumber=() =>{
        return Math.floor(1000 + Math.random() * 9000);
      }

    const random= await fourDigitNumber()
      
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to:recipients,
        templateId: 1,
        params: {
            RANDOM:`#${random}`
        },
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": data,
          "content-type": "application/json",
          "charset": "iso-8859-1",
        },
      }
    );

    if (response.status === 201) {
      return { success: true };
    } else {
      console.error("Failed to send emails:", response.data);
      return { success: false };
    }
  } catch (error) {
    console.error("Error sending emails via Brevo API:", error);
    return { success: false };
  }
};


module.exports = sendTeamEmails;
