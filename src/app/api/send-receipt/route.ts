import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { isRateLimited } from "@/lib/rateLimit";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bwipjs = require("bwip-js") as { toBuffer: (opts: Record<string, unknown>) => Promise<Buffer> };

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

async function generateBarcode(text: string): Promise<string> {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text,
      scale: 3,
      height: 14,
      includetext: true,
      textxalign: "center",
      textsize: 11,
    });
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  if (isRateLimited(req, "send-receipt", 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
  }
  try {
    const order = await req.json();

    // Only email receipts for verified paid orders — this endpoint is public,
    // and Sara's Gmail must not be a free spam relay.
    const piId = String(order.paymentIntentId ?? "");
    if (!piId.startsWith("pi_") || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payment verification required" }, { status: 403 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const pi = await stripe.paymentIntents.retrieve(piId);
    if (
      pi.status !== "succeeded" ||
      pi.metadata.store !== "sarastradingpost" ||
      Math.round(Number(order.totals?.total) * 100) !== pi.amount ||
      String(order.email).toLowerCase() !== String(pi.receipt_email ?? "").toLowerCase()
    ) {
      return NextResponse.json({ error: "Payment not verified" }, { status: 403 });
    }

    // Parse combined address string: "123 Main St[, Apt X], City, ST ZIP"
    const addrParts = (order.address as string).split(",").map((s: string) => s.trim());
    const labelCityStateZip = addrParts.slice(-2).join(", ");
    const labelStreet = addrParts.slice(0, -2).join(", ");

    // Generate Code 128 barcode for order ID (embedded as base64 — no external request)
    const barcodeUri = await generateBarcode(order.id);

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
<head>
  <meta charset="utf-8">
  <style>
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; }
    }
  </style>
</head>
<body style="font-family:Georgia,serif;background:#fdf6f0;margin:0;padding:24px;">
  <div style="max-width:620px;margin:0 auto;">

    <!-- ══════════════════ SHIPPING LABEL (print & cut) ══════════════════ -->
    <div style="background:#fff;border:3px dashed #333;border-radius:4px;margin-bottom:28px;position:relative;">

      <!-- Scissors corner hints -->
      <div style="position:absolute;top:-1px;left:-1px;width:18px;height:18px;font-size:14px;line-height:1;color:#555;">✂</div>
      <div style="position:absolute;top:-1px;right:-1px;width:18px;height:18px;font-size:14px;line-height:1;color:#555;text-align:right;">✂</div>
      <div style="position:absolute;bottom:-1px;left:-1px;width:18px;height:18px;font-size:14px;line-height:1;color:#555;">✂</div>
      <div style="position:absolute;bottom:-1px;right:-1px;width:18px;height:18px;font-size:14px;line-height:1;color:#555;text-align:right;">✂</div>

      <!-- Label header bar -->
      <div style="background:#1a1a1a;padding:8px 20px;">
        <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Shipping Label</span>
        <span style="color:#aaa;font-size:11px;float:right;">${new Date(order.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
      </div>

      <div style="padding:18px 20px 0;">

        <!-- FROM section -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
          <tr>
            <td style="width:50px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#999;text-transform:uppercase;vertical-align:top;padding-top:3px;">From:</td>
            <td style="font-size:13px;color:#333;line-height:1.5;">
              <strong style="color:#111;font-size:14px;">Sara&apos;s Trading Post</strong><br>
              sarastradingpost@gmail.com
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:2px solid #111;margin:0 0 12px;">

        <!-- SHIP TO section — largest element, most important -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="width:50px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#999;text-transform:uppercase;vertical-align:top;padding-top:6px;">To:</td>
            <td>
              <div style="font-size:26px;font-weight:900;color:#000;line-height:1.2;letter-spacing:-0.01em;">${order.name}</div>
              <div style="font-size:17px;font-weight:700;color:#111;margin-top:4px;">${labelStreet}</div>
              <div style="font-size:17px;font-weight:700;color:#111;">${labelCityStateZip}</div>
              <div style="font-size:12px;color:#666;margin-top:3px;">${order.email}</div>
            </td>
          </tr>
        </table>

      </div>

      <!-- Barcode strip -->
      <div style="background:#f7f7f7;border-top:1px solid #ddd;padding:14px 20px;text-align:center;">
        ${barcodeUri
          ? `<img src="${barcodeUri}" alt="Barcode: ${order.id}" style="max-width:280px;width:100%;height:auto;display:block;margin:0 auto;">`
          : `<div style="font-family:monospace;font-size:20px;font-weight:900;letter-spacing:0.14em;color:#111;">${order.id}</div>`
        }
        <div style="margin-top:6px;font-size:11px;color:#888;letter-spacing:0.06em;">
          ORDER <strong style="color:#333;">${order.id}</strong> &nbsp;·&nbsp; ${money(order.totals.total)}
        </div>
      </div>

    </div>
    <!-- ════════════════════════════════════════════════════════════════════ -->

    <!-- Order summary card -->
    <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0e8e8;">
      <div style="background:#7c2d44;padding:22px 28px;">
        <h1 style="margin:0;color:#fff;font-size:20px;letter-spacing:0.02em;">🛍 New Order — Sara&apos;s Trading Post</h1>
        <p style="margin:5px 0 0;color:#f5d0da;font-size:13px;">Order ${order.id} &nbsp;·&nbsp; ${new Date(order.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
      </div>

      <div style="padding:24px 28px;">
        <h2 style="margin:0 0 10px;font-size:15px;color:#1a1a2e;">Customer</h2>
        <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">${order.name}<br>${order.email}<br>${order.address}</p>

        <h2 style="margin:22px 0 10px;font-size:15px;color:#1a1a2e;">Items Ordered</h2>
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

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:14px;">
          <tr><td style="color:#888;padding:4px 0;">Subtotal</td><td style="text-align:right;">${money(order.totals.subtotal)}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">Shipping</td><td style="text-align:right;">${order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">Tax</td><td style="text-align:right;">${money(order.totals.tax)}</td></tr>
          <tr style="font-weight:bold;font-size:16px;">
            <td style="padding:10px 0 4px;border-top:2px solid #f0e8e8;">Total Charged</td>
            <td style="text-align:right;padding:10px 0 4px;border-top:2px solid #f0e8e8;color:#7c2d44;">${money(order.totals.total)}</td>
          </tr>
        </table>

        <div style="margin-top:24px;background:#fdf6f0;border-radius:10px;padding:14px 16px;font-size:13px;color:#7c2d44;border:1px solid #f0e8e8;">
          <strong>⚡ Action needed:</strong> Cut out the shipping label above, tape it to the package, and ship within 1 business day.<br>
          Remember to include a free beauty sample 🎁 and add tracking once shipped.
        </div>
      </div>

      <div style="padding:14px 28px;background:#fdf6f0;font-size:12px;color:#888;text-align:center;">
        Sara&apos;s Trading Post &nbsp;·&nbsp; <a href="mailto:sarastradingpost@gmail.com" style="color:#7c2d44;">sarastradingpost@gmail.com</a>
      </div>
    </div>

  </div>
</body>
</html>`;

    // Gmail SMTP — EMAIL_PASS must be an App Password generated by the
    // EMAIL_USER account (they must match, or Gmail rejects the login).
    if (!process.env.EMAIL_PASS) {
      console.warn("[send-receipt] EMAIL_PASS not set — skipping email");
      return NextResponse.json({ ok: true, skipped: true });
    }
    const account = process.env.EMAIL_USER?.trim() || "sarastradingpost@gmail.com";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: account, pass: process.env.EMAIL_PASS },
    });

    // Order alert to Sara (shipping label + barcode)
    await transporter.sendMail({
      from: `"Sara's Trading Post" <${account}>`,
      to: account,
      subject: `📦 New Order ${order.id} — ${order.name} · ${money(order.totals.total)}`,
      html,
    });

    // Confirmation to the customer
    const customerHtml = `
<body style="font-family:Georgia,serif;background:#fdf6f0;margin:0;padding:24px;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #eee2d8;">
    <div style="background:#7a2f43;padding:26px 28px;text-align:center;">
      <p style="color:#fff;font-size:22px;font-weight:700;margin:0;">Sara's Trading Post</p>
      <p style="color:#e7c4cb;font-size:13px;margin:6px 0 0;">Thank you for your order, ${String(order.name).split(" ")[0]}! ✨</p>
    </div>
    <div style="padding:26px 28px;">
      <p style="font-size:14px;color:#444;margin:0 0 6px;">Order <strong>${order.id}</strong> · ${new Date(order.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
      <p style="font-size:13px;color:#777;margin:0 0 18px;">We're hand-checking and packing your order now — tracking will follow by email. A free beauty sample is tucked inside. 🎁</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;color:#333;">
        <tr><th style="text-align:left;padding:6px 0;border-bottom:2px solid #7a2f43;">Item</th><th style="text-align:center;padding:6px 0;border-bottom:2px solid #7a2f43;">Qty</th><th style="text-align:right;padding:6px 0;border-bottom:2px solid #7a2f43;">Total</th></tr>
        ${itemsHtml}
        <tr><td colspan="2" style="padding:10px 0 2px;text-align:right;color:#777;">Subtotal</td><td style="padding:10px 0 2px;text-align:right;">${money(order.totals.subtotal)}</td></tr>
        <tr><td colspan="2" style="padding:2px 0;text-align:right;color:#777;">Shipping</td><td style="padding:2px 0;text-align:right;">${order.totals.shipping === 0 ? "FREE" : money(order.totals.shipping)}</td></tr>
        <tr><td colspan="2" style="padding:2px 0;text-align:right;color:#777;">Tax</td><td style="padding:2px 0;text-align:right;">${money(order.totals.tax)}</td></tr>
        <tr><td colspan="2" style="padding:8px 0;text-align:right;font-weight:700;font-size:15px;">Total</td><td style="padding:8px 0;text-align:right;font-weight:700;font-size:15px;color:#7a2f43;">${money(order.totals.total)}</td></tr>
      </table>
      <p style="font-size:13px;color:#777;margin:18px 0 0;">Shipping to: ${order.address}</p>
    </div>
    <div style="padding:14px 28px;background:#fdf6f0;font-size:12px;color:#888;text-align:center;">
      Questions? Just reply to this email — Sara reads every message. · <a href="mailto:${account}" style="color:#7c2d44;">${account}</a>
    </div>
  </div>
</body>`;
    await transporter.sendMail({
      from: `"Sara's Trading Post" <${account}>`,
      to: order.email,
      subject: `Your order ${order.id} is confirmed ✨ — Sara's Trading Post`,
      html: customerHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[send-receipt]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
