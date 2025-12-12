import { NextResponse } from 'next/server';

// Hardcoded for now per user instruction
const N8N_WEBHOOK_URL = 'https://n8n.srv1168084.hstgr.cloud/webhook-test/Onboarding';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("Forwarding onboarding data to n8n:", N8N_WEBHOOK_URL);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("n8n Webhook Error:", response.status, response.statusText);
            // We still return 200 to the client to not block the flow, but log the error on server
            // Or we can propagate the error. Let's return success false.
            return NextResponse.json({ success: false, error: response.statusText }, { status: response.status });
        }

        const data = await response.text(); // n8n usually returns text or simple JSON
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Internal Server Error in n8n proxy:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
