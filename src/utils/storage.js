const STORAGE_KEY = 'cloudAuditFramework';
const STORAGE_VERSION = '1.0';

/**
 * Save data to localStorage
 * @param {Object} data - Data to save
 */
export function saveToLocalStorage(data) {
    try {
        const storageData = {
            version: STORAGE_VERSION,
            lastUpdated: new Date().toISOString(),
            ...data
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 * @returns {Object|null} Stored data or null
 */
export function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            // Check version compatibility
            if (data.version === STORAGE_VERSION) {
                return data;
            }
        }
        return null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Clear all data from localStorage
 */
export function clearLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Check if there's existing audit data
 * @returns {Boolean}
 */
export function hasExistingAudit() {
    const data = loadFromLocalStorage();
    return data !== null && data.responses && Object.keys(data.responses).length > 0;
}

/**
 * Export audit data as JSON file
 * @param {Object} data - Data to export
 */
export function exportAuditData(data) {
    try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `cloud-audit-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
}
