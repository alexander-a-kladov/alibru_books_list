google_win = null;

function findOnGoogle() {
     if (google_win) google_win.close();
    let search_str = getTitleForSearch().replaceAll(' ','+');
    google_win = window.open(`https://www.google.com/search?q=${search_str}`);
}