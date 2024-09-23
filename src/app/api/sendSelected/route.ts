import { compileSendSelectedTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, fullName } = await req.json();
  const response = await sendMail({
    to: email,
    name: fullName,
    subject: "Thanks for applying",
    body: compileSendSelectedTemplate(fullName),
  });

  if (response && response.messageId) {
    return NextResponse.json({ message: "Mail Delivered" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Mail not sent" }, { status: 500 });
  }
};
