function setFormat(dimensions) {
    let dimensions_list=["Очень большой (cвыше 28 см)","Энциклопедический (25-27 см)",
    "Увеличенный (22-24 см)","Обычный (19-21 см)","Уменьшенный (11-18 см)",
    "Миниатюрный (менее 10 см)"];
    let dimensions_values=[28,25,22,19,11,10];
    max_side = Math.max(Number(dimensions[0]),Number(dimensions[1]));
    let i=0;
    while (i<dimensions_values.length && max_side<dimensions_values[i]) {i++}
    document.getElementById('formats-id').innerHTML = dimensions_list[i];
}

function setBinding(cover) {
    let bindings_list=["Переплет", "Бумажный (обложка)","Самодельный","Картонный","Твердый","Тканевый","Владельческий","Полукожанный","Составной","Кожанный"];
    if (~cover.indexOf("Мягкий")) {
        document.getElementById('bindings-id').innerHTML = bindings_list[1];
    } else if (~cover.indexOf("Твердый")){
        document.getElementById('bindings-id').innerHTML = bindings_list[4];
    } else {
        document.getElementById('bindings-id').innerHTML = bindings_list[0];
    }
}

function findTokenChitaiGorod(info, i, token) {
    while (i<info.length && ~info[i].trim().indexOf(token)==0) {i++;}
    if (i!=info.length) {
        return i;
    } else {
        return -1;
    }
}

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
    let conditions_list=["Состояние", "идеальное", "отличное", "хорошее", "удовлетворительное", "плохое"];
    info = document.getElementById("book-info-id").value.split('\n');
    document.getElementById('name-id').value = info[0].trim();
    document.getElementById('authors-id').value = `${info[1].trim().split(' ')[1]} ${info[1].trim()[0]}.`;
    document.getElementById('publisher-id').value = info[4].trim();
    i = findTokenChitaiGorod(info, 5, 'Год издания');
    if (~i) {
        document.getElementById('date-id').value = info[i].trim().split(' ')[2];
    }
    i = findTokenChitaiGorod(info, 5, 'ISBN');
    if (~i) {
        document.getElementById('isbn-id').value = info[i].trim().split(' ')[1].replaceAll('-','');
    }
    i = findTokenChitaiGorod(info, 5, 'Количество страниц');
    if (~i) {
        document.getElementById('pages-id').value = info[i].trim().split(' ')[2];
    }
    i = findTokenChitaiGorod(info, 5, 'Размер');
    if (~i) {
        setFormat(info[i].trim().split(' ')[1].split('x'));
    }
    i = findTokenChitaiGorod(info, 5, 'Тип обложки');
    if (~i) {
        setBinding(info[i].trim().split('Тип обложки')[1].trim());
    }
    document.getElementById('conditions-id').innerHTML = conditions_list[1];
}