$('document').ready(function () {
    function convertFormDataToObject(formData) {
        var object = {};
        formData.forEach(function (value, key) {
            object[key] = value;
        });
        return object;
    }

    // Кеширование кнопок
    var $downloadFileBtn = $('#downloadFile'),
        $animateBtn = $('#animate'),
        $cleanBtn = $('#clean'),
        $computeBtn = $('#compute');

    // Глобальные переменные
    var resultsArr;
    var tArr;
    var xArr;

    // Обработчик кнопки "Вычислить"
    $computeBtn.click(function () {
        var a = parseFloat(document.getElementById('inputA').value);
        var b = parseFloat(document.getElementById('inputB').value);
        var t = parseFloat(document.getElementById('inputT').value);
        var C = parseFloat(document.getElementById('inputC').value);
        var N = parseInt(document.getElementById('inputN').value);
        var M = parseInt(document.getElementById('inputM').value);


        function f(x, t) {              // функция U для системы
            return Math.sin(x) * Math.cos(t);
        }

        function phi(ti) {
            return Math.pow(Math.sin(ti), 3)
        }

        function psi(xi) {
                return Math.pow(Math.cos(xi), 2)
        }


        var h = (b - a) / N;             // разбиение на отрезки
        var tau = t / M;

        //console.log(h,tau);

        var massT = new Array(M + 1);                 // заполнение промежутка [0,T]
        //console.log('massT = ', massT);
        for (var j = 0; j < (M + 1); j++) {
            massT[j] = (j * tau);
            //console.log('M=', M, 'massT[',j,'] = ', massT[j]);
        }

        var massX = new Array(N + 1);                 // заполнение промежутка [a,b]
        for (var i = 0; i < (N + 1); i++) {
            massX[i] = (a + (i * h));
            //console.log('N=', N,'massX[',i,'] = ', massX[i]);
        }
        //jQuery('table').append('<tr>', 'massX[',i,']=',massX[i],'</tr>');}

        var massRes = Array(N + 1);                // создание двумерного массива с результатом
        var massPhpX = Array(N + 1);
        var massPhpT = Array(M + 1);

        for (j = 0; j < M + 1; j++) {
            massPhpT[j] = j * tau;
            console.log('M=', M, 'massT[',j,'] = ', massPhpT[j]);
        }

        for (i = 0; i < (N + 1); i++) {
            massRes[i] = Array(M + 1);
            massPhpX[i] = a + (i * h)
            //console.log('massRes[i] = ', massRes);
        }
        for (i = 0; i < N + 1; i++) {
            for (j = 0; j < M + 1; j++) {
                massRes[i][j] = 0;
                //console.log('N=', N, 'M=', M, 'massRes[', i, '][', j, '] = ', massRes[i][j]);
            }
        }


            for (j = 0; j < M + 1; j++) {            // заполняем верхнюю строку клетки
            massRes[0][j] = phi(massT[j]);
        }


        for (i = 0; i < N + 1; i++) {           // заполняем крайний левый столбец клетки
            massRes[i][0] = psi(massX[i]);
        }



        for (i = 1; i < N + 1; i++) {          // главная функция для расчета
            for (j = 0; j < M; j++) {
                massRes[i][j + 1] = C * tau / h * massRes[i - 1][j] + (1 - C * tau / h) * massRes[i][j] + tau * f(massX[i], massT[j])

            }
        }


        jQuery('table').append('<tr>', 'для a= ',a , ', b = ',b ,', T = ', t, ', C = ', C, ', N = ', N, ', M = ', M, ', получены следующие результаты:', '</tr>');
        for (var j = 0; j < M + 1; j++) {          // функция для вывода
            for (var i = 0; i < N + 1; i++) {

                jQuery('table').append('<tr>','t', j, ' = ', (j * tau).toFixed(2) ,', x', i, ' = ', (a + (i * h)).toFixed(2) , ', U(x,t) =' , massRes[i][j].toFixed(18), '</tr>');

                //jQuery('table').append('<tr>', 'massRes[', i, '][', j, '] = ', massRes[i][j], '</tr>');
            }
        }


        //consoleOut();

        // Активируем кнопку "Скачать"
        $downloadFileBtn.prop('disabled', false);
        // Сохраняем massRes снаружи обработчика
        resultsArr = massRes;
        xArr = massPhpX;
        //tArr = massPhpT;
        tArr = massT;
    });

    // Обработчик кнопки "Скачать"
    $downloadFileBtn.click(function (event) {
        var inputFormData = new FormData(document.forms.mainForm);

        if (inputFormData && resultsArr) {
            $.ajax({
                type: 'POST',
                url: '/server/controllers/download-file.php',
                data: {
                    input: convertFormDataToObject(inputFormData),
                    results: resultsArr,
                    xArr: xArr,
                    tArr: tArr,
                },
                success: function (response) {
                    if (response.filename) {
                        // Делаем клиентский редирект на файл
                        window.location.href = response.filename;
                    }
                }
            });
        }
    });
});