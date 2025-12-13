import { supabase } from '@/lib/supabaseClient';

export interface SavedCardDisplay {
    id: string; // The saved_card id (for deletion)
    profileId: string; // The specific profile id
    company: string;
    owner: string;
    role: string;
    slug: string;
    avatarUrl?: string; // Optional
}

export const walletService = {
    /**
     * Add a profile to the current user's wallet
     */
    addToWallet: async (profileId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Must be logged in");

        const { data, error } = await supabase
            .from('saved_cards')
            .insert({
                user_id: session.user.id,
                saved_profile_id: profileId
            })
            .select()
            .single();

        if (error) {
            // Check for duplicate error (Postgres error code 23505)
            if (error.code === '23505') return { error: 'already_saved' };
            throw error;
        }
        return { data };
    },

    /**
     * Remove a card from the wallet
     */
    removeFromWallet: async (savedCardId: string) => {
        const { error } = await supabase
            .from('saved_cards')
            .delete()
            .eq('id', savedCardId);

        if (error) throw error;
        return true;
    },

    /**
     * Check if a specific profile is already in the wallet
     */
    isSaved: async (profileId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { data, error } = await supabase
            .from('saved_cards')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('saved_profile_id', profileId)
            .maybeSingle();

        return !!data;
    },

    /**
     * Fetch all saved cards for the wallet view
     */
    getWalletCards: async (): Promise<SavedCardDisplay[]> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
            .from('saved_cards')
            .select(`
                id,
                saved_profile:company_profiles (
                    id,
                    owner_name,
                    company_name,
                    owner_role,
                    profile_slug,
                    owner_photo_url
                )
            `)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Wallet fetch error:", error);
            return [];
        }

        // Map the complicated join result to a flat interface
        return data.map((item: any) => ({
            id: item.id, // ID of the SAVED entry (use this to delete)
            profileId: item.saved_profile?.id,
            company: item.saved_profile?.company_name || 'Unknown Company',
            owner: item.saved_profile?.owner_name || 'Unknown Owner',
            role: item.saved_profile?.owner_role || 'Member',
            slug: item.saved_profile?.profile_slug,
            avatarUrl: item.saved_profile?.owner_photo_url
        }));
    }
};
