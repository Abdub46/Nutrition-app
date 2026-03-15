import nodemailer from "nodemailer";

const submissions = new Map();

export async function POST(req) {

  try {

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // ================= RATE LIMIT =================
    const lastSubmission = submissions.get(ip);

    if (lastSubmission && Date.now() - lastSubmission < 60000) {
      return Response.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    submissions.set(ip, Date.now());

    const { email, website } = await req.json();

    // ================= HONEYPOT =================
    if (website) {
      return Response.json({ success: true });
    }

    // ================= EMAIL VALIDATION =================
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    // ================= MAIL TRANSPORT =================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdubgalgallo46@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "Horizon Newsletter",
      to: "abdubgalgallo46@gmail.com",
      subject: "New Horizon Subscriber",
      text: `New subscriber: ${email}`,
    });

    return Response.json({ success: true });

  } catch (error) {

    console.error("Newsletter error:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}

