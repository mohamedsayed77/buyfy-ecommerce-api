/**
 * Generates the HTML content for a password reset email.
 * @param {string} userName - The name of the user to personalize the email.
 * @param {string} resetCode - The reset code to be included in the email.
 * @returns {string} - The HTML content of the email.
 */
const mailContent = (userName, resetCode) => {
  // Create the HTML email content with inline styles for better presentation
  const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #007BFF;">Hi ${userName},</h2>
        <p>We received a request to reset your password on your <strong>Buyfy Account</strong>.</p>
        <p style="font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
          ${resetCode}
        </p>
        <p>Please enter this reset code in the application to proceed.</p>
        <p>Thanks for helping us keep your account secure.</p>
        <br>
        <p>Best regards,</p>
        <p style="color: #007BFF;"><strong>The Buyfy TEAM</strong></p>
      </div>
    `;

  return html; // Return the formatted HTML string
};

export default mailContent;
