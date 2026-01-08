import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with React state sync
 * @param {String} key - localStorage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
    // Get initial value from localStorage or use initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    const setValue = (value) => {
        try {
            // Allow value to be a function (like useState)
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    return [storedValue, setValue];
}
