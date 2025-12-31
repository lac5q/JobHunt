// ============================================
// SUPABASE SYNC MANAGER - Shared Module
// ============================================
// Include this file in any HTML page that needs cloud sync

const SyncManager = {
    supabaseUrl: null,
    supabaseKey: null,
    isSyncing: false,
    lastSync: null,

    init() {
        this.supabaseUrl = localStorage.getItem('supabaseUrl');
        this.supabaseKey = localStorage.getItem('supabaseKey');
        this.lastSync = localStorage.getItem('lastSync');

        if (this.isConfigured()) {
            this.loadFromCloud();
        }
    },

    isConfigured() {
        return this.supabaseUrl && this.supabaseKey;
    },

    async loadFromCloud() {
        if (!this.isConfigured() || this.isSyncing) return;

        this.isSyncing = true;

        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });

            if (!response.ok) throw new Error('Failed to load data');

            const data = await response.json();
            if (data && data.length > 0) {
                const cloudData = data[0];
                const cloudTime = new Date(cloudData.updated_at).getTime();
                const localTime = parseInt(localStorage.getItem('localDataTimestamp') || '0');

                // Cloud is newer, use cloud data
                if (cloudTime > localTime) {
                    if (cloudData.contacts) {
                        localStorage.setItem('jobSearchContacts', JSON.stringify(cloudData.contacts));
                    }
                    if (cloudData.progress) {
                        localStorage.setItem('jobSearchProgress', JSON.stringify(cloudData.progress));
                    }
                    if (cloudData.message_templates) {
                        localStorage.setItem('messageTemplates', JSON.stringify(cloudData.message_templates));
                    }
                    if (cloudData.reviewed_contacts) {
                        localStorage.setItem('reviewedContacts', JSON.stringify(cloudData.reviewed_contacts));
                    }
                    localStorage.setItem('localDataTimestamp', cloudTime.toString());

                    // Trigger page refresh if needed
                    if (typeof window.onSyncComplete === 'function') {
                        window.onSyncComplete();
                    }
                }
            }

            this.lastSync = new Date().toISOString();
            localStorage.setItem('lastSync', this.lastSync);
        } catch (error) {
            console.error('Cloud load error:', error);
        } finally {
            this.isSyncing = false;
        }
    },

    async syncToCloud() {
        if (!this.isConfigured() || this.isSyncing) return;

        this.isSyncing = true;

        try {
            const payload = {
                id: 'main',
                contacts: JSON.parse(localStorage.getItem('jobSearchContacts') || '[]'),
                progress: JSON.parse(localStorage.getItem('jobSearchProgress') || '{}'),
                message_templates: JSON.parse(localStorage.getItem('messageTemplates') || '[]'),
                reviewed_contacts: JSON.parse(localStorage.getItem('reviewedContacts') || '[]')
            };

            const response = await fetch(`${this.supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
                method: 'PATCH',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to sync data');

            this.lastSync = new Date().toISOString();
            localStorage.setItem('lastSync', this.lastSync);
            localStorage.setItem('localDataTimestamp', Date.now().toString());
        } catch (error) {
            console.error('Cloud sync error:', error);
        } finally {
            this.isSyncing = false;
        }
    },

    // Debounced sync - call this after any data change
    triggerSync() {
        if (!this.isConfigured()) return;
        localStorage.setItem('localDataTimestamp', Date.now().toString());
        clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(() => this.syncToCloud(), 1000);
    }
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    SyncManager.init();
});
