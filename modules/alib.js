alib_win = null;

function findOnAlib() {
    isbn = document.getElementById("isbn-id").value;
    if (alib_win) alib_win.close();
    if (isbn) {
        alib_win = window.open(`https://www.alib.ru/findp.php4?isbnp=${isbn}`);
    } else {
        title = document.getElementById("name-id").value.trim();
        alib_win = window.open(`https://www.alib.ru/findp.php4?title=${title.replaceAll(' ', '+').toLowerCase()}+&`);
    }
}