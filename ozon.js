ozon_win = null;

function findOnOzon() {
    title = document.getElementById("name-id").value;
     if (ozon_win) ozon_win.close();
    ozon_win = window.open(`https://www.ozon.ru/category/knigi-16500/?text=${title.replaceAll(' ','+')}`);
}

function parseInfoOzon() {
    fixInfo();
    let obj = {};
    let key = "";
    for (line of document.getElementById('book-info-id').value.split('\n')) {
        if (key.length>0) {
            obj[key] = line.trim();
            key = ""
        } else {
            key = line.trim();
        }
    }
    document.getElementById('authors-id').value = obj["Автор на обложке"];
    document.getElementById('publisher-id').value = obj["Издательство"];
    document.getElementById('date-id').value = obj["Год выпуска"];
    document.getElementById('isbn-id').value = obj["ISBN"].replaceAll('-','');
    document.getElementById('pages-id').value = obj["Количество страниц"];
    dimensions = obj["Размеры, мм"].split('x');
    for (let i=0;i<dimensions.length;i++) {
        value = Number(dimensions[i]);
        dimensions[i] = +value/10;
        console.log(dimensions[i]); 
    }
    setFormat(dimensions);
    setBinding(obj["Тип обложки"]);
    document.getElementById('conditions-id').innerHTML = conditions_list[1];
}