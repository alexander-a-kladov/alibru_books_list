function clearInputs() {
    inputs = ['isbn-id', 'pic1-id', 'pic2-id', 'pic3-id', 'pic4-id', 'pic5-id', 'book-info-id', 'name-id', 'authors-id', 'publisher-id', 'date-id', 'pages-id', 'description-id', 'second-name-id',
'publ-place-id', 'price-id', 'binding-id', 'format-id', 'condition-id', 'defects-id'];
    for (el of inputs) {
        document.getElementById(el).value = "";
    }
    startTimer();
}

function getTitleForSearch() {
    let title = document.getElementById("name-id").value;
    if (!title.length) {
        title = getPlainISBN();
    }
    if (!title.length) {
        title = document.getElementById('authors-id').value;
    }
    return title;
}

function findInfoToken(info, i, token) {
    while (i<info.length && ~info[i].trim().indexOf(token)==0) {i++;}
    if (i!=info.length) {
        return i;
    } else {
        return -1;
    }
}

function fixInfo() {
    let text=""
    for (let line of document.getElementById('book-info-id').value.split('\n')) {
        if (line.trim().length>0) {
            text+=`${line.trim()}\n`;
        }
    }
    document.getElementById('book-info-id').value = text;
}

function setFormat(dimensions) {
    let dimensions_list=["Очень большой (cвыше 28 см)","Энциклопедический (25-27 см)",
    "Увеличенный (22-24 см)","Обычный (19-21 см)","Уменьшенный (11-18 см)",
    "Миниатюрный (менее 10 см)"];
    let dimensions_values=[28,25,22,19,11,10];
    max_side = Math.max(Number(dimensions[0]),Number(dimensions[1]));
    let i=0;
    while (i<dimensions_values.length && max_side<dimensions_values[i]) {i++}
    document.getElementById('format-id').value = dimensions_list[i];
}

function setBinding(cover) {
    let bindings_list=["Переплет", "Бумажный (обложка)","Самодельный","Картонный","Твердый","Тканевый","Владельческий","Полукожанный","Составной","Кожанный"];
    if (~cover.indexOf("Мягкий")) {
        document.getElementById('binding-id').value = bindings_list[1];
    } else if (~cover.indexOf("Твердый")){
        document.getElementById('binding-id').value = bindings_list[4];
    } else {
        document.getElementById('binding-id').value = bindings_list[0];
    }
}

