function getTrueISBN(isbn) {
    isbn_str = isbn.trim();
    if (!isbn_str.length) {
        return "";
    }
    if (isbn_str.length==13) {
        return `${isbn_str.slice(0,3)}-${isbn_str.slice(3,4)}-${isbn_str.slice(4,6)}-${isbn_str.slice(6,12)}-${isbn_str.slice(12,13)}`;
    } else {
        return `${isbn_str.slice(0,1)}-${isbn_str.slice(1,3)}-${isbn_str.slice(3,9)}-${isbn_str.slice(9,10)}`;
    }
}

function getPlainISBN() {
    return document.getElementById('isbn-id').value.trim().replaceAll('-','');
}
