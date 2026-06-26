/**
 * Takes a string and returns it with the first character capitalized.
 * @param {string} string - The input string to convert.
 * @returns {string} The capitalized string.
 */
export function capitalize(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}