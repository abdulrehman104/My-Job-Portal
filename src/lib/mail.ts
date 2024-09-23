import nodemailer from "nodemailer";
import handlebars from "handlebars";
import toast from "react-hot-toast";
import { text } from "stream/consumers";
import { ThankYouTemplate } from "./designs/thank-you";
import { sendSelectedTemplate } from "./designs/send-selected";
import { sendRejectedTemplate } from "./designs/send-rejected";

interface SendMailProps {
  to: string;
  name: string;
  subject: string;
  body: string;
}

export const sendMail = async ({ to, name, subject, body }: SendMailProps) => {
  const { SMTP_PASSOWARD, SMTP_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSOWARD,
    },
  });

  try {
    const textResule = await transport.verify();
    console.log(textResule);
    console.log(text);
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
  }
};

export const compileThankYouEmailTemplate = (name: string) => {
  const template = handlebars.compile(ThankYouTemplate);
  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendSelectedTemplate = (name: string) => {
  const template = handlebars.compile(sendSelectedTemplate);
  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendRejectedTemplate = (name: string) => {
  const template = handlebars.compile(sendRejectedTemplate);
  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};
