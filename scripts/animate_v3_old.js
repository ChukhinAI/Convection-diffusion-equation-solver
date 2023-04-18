jQuery('document').ready(function () {

var global_masRes;

var chart = null;


function eq_solve() {

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


    //jQuery('table').append('<tr>', psi(1),'</tr>');

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
    for (i = 0; i < (N + 1); i++) {
        massRes[i] = Array(M + 1);
        //console.log('massRes[i] = ', massRes);
    }
    for (i = 0; i < N + 1; i++) {
        for (j = 0; j < M + 1; j++) {
            massRes[i][j] = 0;
            //console.log('N=', N, 'M=', M, 'massRes[', i, '][', j, '] = ', massRes[i][j]);
        }
    }



    for (j = 0; j < M; j++) {            // заполняем верхнюю строку клетки
        massRes[0][j] = phi(massT[j]);
    }


    for (i = 0; i < N; i++) {           // заполняем крайний левый столбец клетки
        massRes[i][0] = psi(massX[i]);
    }


    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            //console.log('massRes[', i, '][', j, ']= ', massRes[i][j]);
        }
    }

    //jQuery('table').append('<tr>', massRes[i][j],'</tr>');}

    //jQuery('table').append('<tr>', 'для a= ',a , ' получены следующие результаты:', '</tr>'); // выводим надпись "результаты:"
    //jQuery("tr:contains('Получены следующие результаты:')").addClass('resClass');



        for (i = 1; i < N + 1; i++) {          // главная функция для расчета
            for (j = 0; j < M; j++) {
                massRes[i][j + 1] = C * tau / h * massRes[i - 1][j] + (1 - C * tau / h) * massRes[i][j] + tau * f(massX[i], massT[j]);


                //jQuery('table').append('<tr>', massRes[i][j], '</tr>');
            }
        }

        //for (var k = 0; k < M + N + 1; k++) {
            global_masRes = new Array(M + N + 1);

            for (var k = 0, i = 0; i < N + 1; i++) {          // главная функция для расчета
                for (j = 0; j < M; j++, k++) {

                    /* console.log('massRes = ', massRes);
                    console.log('i=', i, 'j=', j);
                    console.log('global_before = ', global_masRes); */
                    global_masRes[k] = massRes[i][j];
                    //console.log('k=', k, 'global_after = ', global_masRes);
                }
            }
        //}


}











    //Готовим диаграмму
    function createDiagram(a, b, C, M, N) {

        if (chart) {
            chart.destroy();
        }
        eq_solve();

        var ctx = document.getElementById("setka").getContext('2d');
        var labels = [];
        var data = [];
        data_test = global_masRes;

        //Заполняем данными
        //for (var x = -2*Math.PI; x<=2*Math.PI; x+=0.1) {
        for (var x = parseFloat(a), i = 0; x <= parseFloat(b), i < M + N + 2 ; x = x + 1, i++) {
            labels.push('' + x.toFixed(2));
            data.push(global_masRes[i].toFixed(2));
            console.log("glob = ", global_masRes[i]);
        }

        //Обновляем
        // setka.update();

       /* function f(x) { //Вычисление нужной функции
            //return Math.sin(x);
            return Math.acos(-Math.sin(x) / C);
        } */

        var setka = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, //Подписи оси x
                datasets: [
                    {
                        label: 'f(x,t)', //Метка
                        //data: data, //Данные
                        data: data_test,
                        borderColor: 'blue', //Цвет
                        borderWidth: 1, //Толщина линии
                        fill: false //Не заполнять под графиком
                    }
                    //Можно добавить другие графики
                ]
            },
            options: {
                responsive: true, //Вписывать в размер canvas
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true
                    }]
                },
                animation: {
                    duration: 1000 // general animation time
                },
                hover: {
                    animationDuration: 1000 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 1000 // animation duration after a resize
            }
        });
    }

    jQuery('#animate').click(function () {
        //$("#setka").slideDown("slow");
        //$(this).toggleClass("active");
        //$("#setka").css("visibility", "visible");

        var a = parseFloat(document.getElementById('inputA').value);
        var b = parseFloat(document.getElementById('inputB').value);
        var t = parseFloat(document.getElementById('inputT').value);
        var C = parseFloat(document.getElementById('inputC').value);
        var N = parseInt(document.getElementById('inputN').value);
        var M = parseInt(document.getElementById('inputM').value);

        var ctx_setka = document.getElementById('setka');
        clnt_height = ctx_setka.clientHeight;
        clnt_widht = ctx_setka.clientWidth;

        //Ставим загрузку диаграммы на событие загрузки страницы
        //window.addEventListener("load", Diagram);
        //var el = document.getElementById("animate");
        //el.addEventListener("click", Diagram);
        createDiagram(a, b, C, M, N);


        var formData = new FormData(document.forms.mainForm);
        var formDataObject = {};
        formData.forEach(function (value, key) {
            formDataObject[key] = value;
        });
        $.ajax({
            type: "GET",
            url: "https://equation-solver.000webhostapp.com/scripts/animate_v3.js",
            data: {
                result: b, a, C, M, N,
                input: formDataObject,
            },
            success: function () {
                console.log('DATA SUCCESSFULLY GETTED');
            },
        }
        );


    });
});