// Update to call real n8n webhook
const WEBHOOK_URL = 'https://n8n.srv1168084.hstgr.cloud/webhook-test/chatbot';

export const getMonolithResponse = async (text: string, history: any[], pageUrl: string) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        const payload = {
            message: text,
            currentUrl: pageUrl, // Use passed dynamic URL
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Explicitly handle n8n array format: [{ "output": "..." }]
        if (Array.isArray(data) && data.length > 0 && data[0]?.output) {
            return data[0].output;
        }

        // Fallback checks
        const result = Array.isArray(data) ? data[0] : data;
        return result?.output || result?.text || result?.message || (typeof result === 'string' ? result : JSON.stringify(result));

    } catch (error: any) {
        console.error("Monolith Chat Error:", error);

        if (error.name === 'AbortError') {
            return "Connection timed out. Monolith system unresponsive (30s limit).";
        }

        return `Connection failed: ${error.message}`;
    }
};
