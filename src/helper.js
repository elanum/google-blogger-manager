import M from "materialize-css";

/**
 * Notification Pop-Up from materialize-css
 *
 * @param {string} [content] Text inside
 */
function sendToast(content) {
    M.toast({
        html: content
    })
}

/**
 * Format a Date string to a better looking string
 *
 * @param {string} [date] '2020-06-16T10:04:00-07:00'
 *
 * @returns {string} '16. Juni 2020, 19:04:00'
 */
function formatDate(date) {
    date = new Date(date);
    return date.toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

/**
 * Add to all '<a>' tags the attribute '<a target="_blank">'
 *
 * @param {string} [content]
 *
 * @returns {*|void|string}
 */
function addTargetBlank(content) {
    return content.replace('<a ', '<a target="_blank" ');
}

/**
 * Transforms a Set() to an Array()
 *
 * @param {Set} [set]
 *
 * @returns {Array}
 */
function transformSetToArray(set) {
    let array = Array.from(set);
    let transform = {};
    array.forEach(element => {
        return transform[element] = null;
    })
    return transform;
}

/**
 * Returns the result of two comparing values.
 *
 * @param {string} [type] 'string' | 'date' | 'number'
 * @param {*}      [a]    greater value
 * @param {*}      [b]    lower value
 *
 * @returns {number} 1 | -1 | 0
 */
function sortArray(type, a, b) {
    switch (type) {
        case 'string':
            return a.localeCompare(b);
        case 'date':
            return new Date(b) - new Date(a);
        case 'number':
            return a - b;
        default:
            return;
    }
}

export {
    sendToast,
    formatDate,
    addTargetBlank,
    transformSetToArray,
    sortArray,
}