import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// For password reset
export const sendPasswordResetEmail = async (to, token) => {
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
    const mailOptions = {
        from: `"UniTransport" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `
            <p>Hi,</p>
            <p>You requested a password reset. Click the link below to reset it:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
        `,
    };

    return transporter.sendMail(mailOptions);
};

// For booking approval
export const sendBookingApprovalEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"UniTransport" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};
