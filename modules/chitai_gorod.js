chitai_gorod_win = null;

function findOnChitaiGorod() {
    title = document.getElementById("name-id").value;
    if (!title.length) {
        title = document.getElementById("isbn-id").value;
        if (!title.length) return;
    }
     if (chitai_gorod_win) chitai_gorod_win.close();
    chitai_gorod_win = window.open(`https://www.chitai-gorod.ru/search?phrase=${title}`);
}

function parseInfoChitaiGorod() {
    fixInfo();
    info = document.getElementById("book-info-id").value.split('\n');
    document.getElementById('name-id').value = info[0].trim();
    document.getElementById('authors-id').value = `${info[1].trim().split(' ')[1]} ${info[1].trim()[0]}.`;
    document.getElementById('publisher-id').value = info[4].trim();
    i = findInfoToken(info, 5, 'Год издания');
    if (~i) {
        document.getElementById('date-id').value = info[i].trim().split(' ')[2];
    }
    i = findInfoToken(info, 5, 'ISBN');
    if (~i) {
        document.getElementById('isbn-id').value = info[i].trim().split(' ')[1].replaceAll('-','');
    }
    i = findInfoToken(info, 5, 'Количество страниц');
    if (~i) {
        document.getElementById('pages-id').value = info[i].trim().split(' ')[2];
    }
    i = findInfoToken(info, 5, 'Размер');
    if (~i) {
        setFormat(info[i].trim().split(' ')[1].split('x'));
    }
    i = findInfoToken(info, 5, 'Тип обложки');
    if (~i) {
        setBinding(info[i].trim().split('Тип обложки')[1].trim());
    }
    document.getElementById('conditions-id').innerHTML = conditions_list[1];
}