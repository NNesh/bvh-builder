export function formatNumberToString(offset: number, precision = 2) {
    if (offset >= 0) {
        return ` ${offset.toFixed(precision)}`;
    }

    return offset.toFixed(precision);
}
