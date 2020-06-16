import M from "materialize-css";

function sendToast(string) {
    M.toast({
        html: string
    })
}

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

function addTargetBlank(content) {
    return content.replace('<a ', '<a target="_blank" ');
}

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