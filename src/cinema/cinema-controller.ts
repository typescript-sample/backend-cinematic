import { Controller, Log } from 'express-ext';
import { Cinema, CinemaFilter, CinemaService, Rate, rateModel } from './cinema';
import { Request, Response } from 'express';
import { createValidator } from 'xvalidators';
import { Search, Validator } from 'onecore';

const nodemailer = require("nodemailer");
export class CinemaController extends Controller<Cinema, string, CinemaFilter> {
  
  //validator: Validator<Rate>;
  constructor(log: Log, userService: CinemaService) {
    super(log, userService);
  }
  async sendEmail(req: Request, res: Response): Promise<any> {
    try {
      let { toEmail, subject, html = "", text = "2" } = req.body;
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.USER_SMTP, // generated ethereal user
          pass: process.env.PASSWORD_SMTP, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"hai 👻" <testsmtp318@gmail.com>', // sender address
        to: toEmail, // list of receivers
        subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      return res.status(500).json({ msg: error }).end();
    }

    return res.status(200).json({ msg: "worked" }).end();
  }
}
