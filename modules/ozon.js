ozon_win = null;

function findOnOzon() {
    let title = getTitleForSearch();
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
    setISBN(obj["ISBN"]);
    
    document.getElementById('pages-id').value = obj["Количество страниц"];
    if (obj["Размеры, мм"]) {
        dimensions = obj["Размеры, мм"].split('x');
        for (let i=0;i<dimensions.length;i++) {
            value = Number(dimensions[i]);
            dimensions[i] = +value/10;
            console.log(dimensions[i]); 
        }
        setFormat(dimensions);
    }
    if (obj["Тип обложки"]) {
        setBinding(obj["Тип обложки"]);
    }
    document.getElementById('conditions-id').innerHTML = conditions_list[1];
}