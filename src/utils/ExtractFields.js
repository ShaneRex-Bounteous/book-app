const extractFields = (info) => {
    // Build a list of only the requested fields
    let requestedFields = info.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value);
    requestedFields = requestedFields.filter(field => field !== 'books');
    requestedFields = requestedFields.map(field => {
        if (field === 'author') {
            return 'author_id';
        } else {
            return field;
        }
    });

    return requestedFields
}

module.exports = extractFields