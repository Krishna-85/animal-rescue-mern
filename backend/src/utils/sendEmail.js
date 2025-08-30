    import nodemailer from "nodemailer"
    import dotenv from "dotenv"
    dotenv.config()


    const sendEmail = async ({ to, subject, text,html }) => {
        console.log("sending email to: ", to)
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Gmail App Password required
        },
        });

        const info = await transporter.sendMail({
        from: `"Animal Rescue" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: html || `<p>${text}</p>`, 
        });

        console.log(`✅ Mail sent to ${to}: ${info.response}`);
        return info;
    } catch (err) {
        console.error("❌ Email error:", err);
        throw err;
    }
    };

    export default sendEmail;
