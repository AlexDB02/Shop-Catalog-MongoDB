import nodemailer from 'nodemailer';

interface MailOptions{
    to: string
    subject: string
    htmlBody: string
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    async sendEmail(options:MailOptions){
        try{
            const sentInformation = await this.transporter.sendMail({
                from: '"Barbi Fashionistas" <fogem53550@rustetic.com>',
                to: options.to,
                subject: options.subject,
                html: options.htmlBody
            });
            console.log(sentInformation);
        } catch(error){
            console.error(error);
        }
    }
}
