let min = 0;
let hour = 0;
let sec = 0;
let hours = 0.0;
let interval = null;
let book_velocity = 0;
let books_count = 0;

//Оставляем вашу функцию
function startTimer() {
    if (interval) {
        sec = 0;
        min = 0;
        hour = 0;
        clearInterval(interval);
    }
    interval = setInterval(tick, 1000);
}

function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        books_count += 1;
        hours += hour+min/60.0+sec/3600.0;
        sec = 0;
        min = 0;
        hour = 0;
        document.getElementById('book-velocity-id').innerHTML = `${(books_count/hours).toFixed(2)}`;
    }
}

//Основная функция tick()
function tick() {
    sec++;
    if (sec >= 60) { //задаем числовые параметры, меняющиеся по ходу работы программы
        min++;
        sec = sec - 60;
    }
    if (min >= 60) {
        hour++;
        min = min - 60;
    }
    if (sec < 10) { //Визуальное оформление
        if (min < 10) {
            if (hour < 10) {
                document.getElementById('timer-id').innerHTML ='0' + hour + ':0' + min + ':0' + sec;
            } else {
                document.getElementById('timer-id').innerHTML = hour + ':0' + min + ':0' + sec;
            }
        } else {
            if (hour < 10) {
                document.getElementById('timer-id').innerHTML = '0' + hour + ':' + min + ':0' + sec;
            } else {
                document.getElementById('timer-id').innerHTML = hour + ':' + min + ':0' + sec;
            }
        }
    } else {
        if (min < 10) {
            if (hour < 10) {
                document.getElementById('timer-id').innerHTML = '0' + hour + ':0' + min + ':' + sec;
            } else {
                document.getElementById('timer-id').innerHTML = hour + ':0' + min + ':' + sec;
            }
        } else {
            if (hour < 10) {
                document.getElementById('timer-id').innerHTML = '0' + hour + ':' + min + ':' + sec;
            } else {
                document.getElementById('timer-id').innerHTML = hour + ':' + min + ':' + sec;
            }
        }
    }
}