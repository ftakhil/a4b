export interface DatabaseProfile {
    id: string; // uuid
    created_at: string;
    owner_name: string;
    owner_role: string;
    owner_photo_url: string;
    linkedin_url: string;
    twitter_url: string;
    instagram_url: string;
    facebook_url: string;
    youtube_url: string;
    tiktok_url: string;
    company_name: string;
    brief_description: string;
    website_url: string;
    qr_link: string;
    qr_scan_count: number;
    extra_documents: string[]; // text[]
    profile_slug: string;
    public_profile_url: string;
    qr_code_image_url: string;
}
