import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    const itemsHtml = order.items
      .map(
        (it: { title: string; variant?: string; qty: number; price: number }) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0e8e8;">${it.title}${it.variant ? ` <em>(${it.variant})</em>` : ""}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f0e8e8;text-align:center;">${it.qty}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f0e8e8;text-align:right;">${money(it.price * it.qty)}</td>
          </tr>`
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#fdf6f0;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0e8e8;">
    <div style="background:#7c2d44;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.02em;">🛍 New Order — Sara&apos;s Trading Post</h1>
      <p style="margin:6px 0 0;color:#f5d0da;font-size:14px;">Order ${order.id} &nbsp;·&nbsp; ${new Date(order.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
    </div>

    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#1a1a2e;">Customer</h2>
      <p style="margin:0;font-size:14px;color:#555;">${order.name}<br>${order.email}<br>${order.address}</p>

      <h2 style="margin:24px 0 12px;font-size:16px;color:#1a1a2e;">Items Ordered</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #f0e8e8;">Product</th>
            <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #f0e8e8;">Qty</th>
            <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #f0e8e8;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
        <tr><td style="color:#888;padding:4px 0;">Subtotal</td><td style="text-align:right;">${money(order.totals.subtotal)}</td></tr>
        <tr><td style="color:#888;padding:4px 0;">Shipping</td><td style="text-align:right;">${order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</td></tr>
        <tr><td style="color:#888;padding:4px 0;">Tax</td><td style="text-align:right;">${money(order.totals.tax)}</td></tr>
        <tr style="font-weight:bold;font-size:16px;">
          <td style="padding:10px 0 4px;border-top:2px solid #f0e8e8;">Total Charged</td>
          <td style="text-align:right;padding:10px 0 4px;border-top:2px solid #f0e8e8;color:#7c2d44;">${money(order.totals.total)}</td>
        </tr>
      </table>

      <div style="margin-top:28px;background:#fdf6f0;border-radius:10px;padding:16px;font-size:13px;color:#7c2d44;border:1px solid #f0e8e8;">
        <strong>⚡ Action needed:</strong> Pack and ship this order within 1 business day.<br>
        Remember to include a free beauty sample 🎁 and update tracking once shipped.
      </div>
    </div>

    <div style="padding:16px 32px;background:#fdf6f0;font-size:12px;color:#888;text-align:center;">
      Sara&apos;s Trading Post &nbsp;·&nbsp; <a href="mailto:sarastradingpost@gmail.com" style="color:#7c2d44;">sarastradingpost@gmail.com</a>
    </div>
  </div>
</body>
</html>`;

    // Gmail SMTP — requires EMAIL_PASS env var (Gmail App Password)
    if (!process.env.EMAIL_PASS) {
      console.warn("[send-receipt] EMAIL_PASS not set — skipping email");
      return NextResponse.json({ ok: true, skipped: true });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sarastradingpost@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Sara\'s Trading Post" <sarastradingpost@gmail.com>',
      to: "sarastradingpost@gmail.com",
      subject: `📦 New Order ${order.id} — ${order.name} · ${money(order.totals.total)}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[send-receipt]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
