import WalletContainer from '@/components/wallet/WalletContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Wallet | Neumorphic Business Card',
    description: 'Your collected business cards.',
};

export default function WalletPage() {
    return <WalletContainer />;
}
