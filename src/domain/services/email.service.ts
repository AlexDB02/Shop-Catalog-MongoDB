import nodemailer from 'nodemailer'; 

interface MailOptions{
    to: string
    subject: string
    htmlBody: string
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "bitfox666@gmail.com",
            pass: "dlhwynsroahkyweb"
        }
    });

    async sendEmail(options:MailOptions){
        try{
            const sentInformation = await this.transporter.sendMail({
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