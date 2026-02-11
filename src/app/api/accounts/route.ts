import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function GET() {
    return NextResponse.json({ accounts: store.accounts });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { platform, action, apiKey } = body;

        if (!platform || !action) {
            return NextResponse.json({ error: 'Missing platform or action' }, { status: 400 });
        }

        const accountIndex = store.accounts.findIndex(a => a.platform === platform);

        if (action === 'connect') {
            if (accountIndex === -1) {
                // Create new account entry if it doesn't exist (though seed data usually has them)
                // For demo, we just simulate connection
            }

            if (accountIndex !== -1) {
                store.accounts[accountIndex].connected = true;
                if (apiKey) store.accounts[accountIndex].apiKey = apiKey;
                store.addActivity('auth', 'Account Connected', `Connected to ${platform.toUpperCase()}`);
            }
        } else if (action === 'disconnect') {
            if (accountIndex !== -1) {
                store.accounts[accountIndex].connected = false;
                store.addActivity('auth', 'Account Disconnected', `Disconnected from ${platform.toUpperCase()}`);
            }
        }

        // Save triggered by adding activity or potentially we need to trigger save explicitly if we modified array in place
        // In store.ts, addActivity calls save. If we modify account directly, we should probably call save.
        // store.ts doesn't expose a generic save, but addActivity does it.
        // Let's rely on addActivity for now, or maybe I should improve store.ts to have updateAccount?
        // Actually, let's look at store.ts again. modifying store.accounts[i] directly updates the memory object.
        // addActivity calls save(), which serializes the WHOLE store object (including our modified accounts).
        // So it should be fine.

        return NextResponse.json({ success: true, accounts: store.accounts });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
}
