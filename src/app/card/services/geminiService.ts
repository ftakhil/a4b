// Update to call real n8n webhook
const WEBHOOK_URL = 'https://n8n.srv1168084.hstgr.cloud/webhook-test/chatbot';

export const getMonolithResponse = async (text: string, history: any[]) => {
    try {
        const payload = {
            message: text,
            currentUrl: window.location.href, // Send full current URL including query params
            history: history // Optional: if n8n workflow uses history
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming n8n returns something like { "output": "AI response text" } or just the text in a field.
        // Adjust based on actual n8n output structure. 
        // Logic: if data is object and has 'output', use it. Else if string, use it. Else stringify.

        return data.output || data.text || data.message || "Received response from Monolith.";

    } catch (error) {
        console.error("Monolith Chat Error:", error);
        return "Thinking process interrupted. Re-establishing link...";
    }
};
