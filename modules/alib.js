alib_win = null;

function findOnAlib() {
    isbn = document.getElementById("isbn-id").value;
     if (alib_win) alib_win.close();
    alib_win = window.open(`https://www.alib.ru/findp.php4?isbnp=${isbn}`);
}