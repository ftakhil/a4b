import { UserProfile } from '@/context/UserProfileContext';

export const n8nService = {
    async submitOnboardingData(profile: UserProfile): Promise<boolean> {
        try {
            // Call our Next.js API proxy to avoid CORS issues from the browser
            const response = await fetch('/api/webhook/n8n', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                console.error('Failed to submit to n8n proxy:', response.statusText);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error submitting to n8n proxy:', error);
            return false;
        }
    },
};
