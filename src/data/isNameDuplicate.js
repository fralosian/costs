export function isNameDuplicate(list, name) {
    if (!Array.isArray(list) || !name) return false;

    return list.some(
        (item) => item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
}
