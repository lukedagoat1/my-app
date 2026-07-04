import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("id")?.trim();
  if (!orderId) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

  try {
    const stripe = getStripe();

    // orderId can be STP-XXXXXX (our format) or a Stripe payment_intent id
    let status = "unknown";
    let amount = 0;
    let customerEmail = "";
    let created = 0;

    if (orderId.startsWith("pi_")) {
      // Direct Stripe PaymentIntent ID
      const pi = await stripe.paymentIntents.retrieve(orderId);
      status = pi.status;
      amount = pi.amount / 100;
      customerEmail = pi.receipt_email ?? "";
      created = pi.created;
    } else {
      // Search by metadata order id or just return a helpful message
      const pis = await stripe.paymentIntents.list({ limit: 100 });
      const match = pis.data.find(
        (pi) => pi.metadata?.order_id === orderId
      );
      if (match) {
        status = match.status;
        amount = match.amount / 100;
        customerEmail = match.receipt_email ?? "";
        created = match.created;
      } else {
        return NextResponse.json({ error: "Order not found. Please check your order ID." }, { status: 404 });
      }
    }

    const statusLabel: Record<string, { label: string; color: string; description: string }> = {
      succeeded: { label: "Payment Confirmed", color: "green", description: "Your payment was successful and your order is being prepared." },
      processing: { label: "Processing", color: "blue", description: "Your payment is being processed." },
      requires_payment_method: { label: "Payment Incomplete", color: "red", description: "Your payment was not completed." },
      requires_confirmation: { label: "Pending", color: "yellow", description: "Your order is pending confirmation." },
      canceled: { label: "Cancelled", color: "red", description: "This order was cancelled." },
      unknown: { label: "Unknown", color: "gray", description: "Unable to determine order status." },
    };

    return NextResponse.json({
      status,
      statusInfo: statusLabel[status] ?? statusLabel.unknown,
      amount,
      customerEmail,
      created,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[track-order]", msg);
    return NextResponse.json({ error: "Could not retrieve order. Please try again." }, { status: 500 });
  }
}
