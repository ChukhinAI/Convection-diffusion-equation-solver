jQuery('document').ready(function () {

    var global_masRes;
    var global_masRes_v2;
    var massPhpT;
    var global_masRes_v3;
    var global_masRes_v4;

    var chart = null;
    var $canvas = $("#setka");


    function eq_solve(layer_numb) {

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
        global_masRes_v3 = Array(N + 1);
        for (i = 0; i < (N + 1); i++) {
            massRes[i] = Array(M + 1);
            global_masRes_v3[i] = Array(M + 1);
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


        for (i = 1; i < N + 1; i++) {          // главная функция для расчета
            for (j = 0; j < M; j++) {
                massRes[i][j + 1] = C * tau / h * massRes[i - 1][j] + (1 - C * tau / h) * massRes[i][j] + tau * f(massX[i], massT[j]);

            }
        }

        //for (var k = 0; k < M + N + 1; k++) {
        global_masRes = new Array(M + N + 1);
        global_masRes_v2 = new Array(N + 1);
        //console.log("global_masRes_v2 = ", global_masRes_v2);

        for (var k = 0, i = 0; i < N + 1; i++) {          // главная функция для расчета
            for (j = 0; j < M + 1; j++ , k++) {

                //global_masRes[i] = massRes[j][i];
                //global_masRes_v3[j][i] = massRes[j][i];
            }
        }

        for (i = 0; i < N + 1; i++) {
            global_masRes_v2[i] = massRes[i][layer_numb];
        }

        var massPhpT = Array(M + 1);
        global_masRes_v4 = Array(N + 1);
        var x_data;
        for (j = 0; j < N + 1; j++) {
            massPhpT[j] = j * tau;
            if (j === 0) {
                x_data = a;
                global_masRes_v4[j] = [x_data, global_masRes_v2[j]];
            }
            else {
                x_data = x_data + h;
                global_masRes_v4[j] = [x_data, global_masRes_v2[j]];
                //console.log('glob_4 = ', global_masRes_v4);
            }
        }

    }

//==============================================================================================
    function test_1(layer_numb) {

        eq_solve(layer_numb);

        //var tstarr = [[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1], [50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]];
        //console.log(tstarr);

        Highcharts.chart('container', {
            chart: {
                type: 'spline',
                inverted: false
            },
            title: {
                text: 'U(x,t)'
            },
            subtitle: {
                text: 'решение частного случая'
            },
            xAxis: {
                reversed: false,
                //tickPixelInterval: 1500,
                title: {
                    enabled: true,
                    text: 'x data'
                },
                labels: {
                    //format: '{value} km'
                },
                maxPadding: 0.05,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 't data'
                },
                labels: {
                    //format: '{value}°'
                },
                lineWidth: 2
            },
            legend: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: 'x = {point.x}, U(x,t) = {point.y} '
            },
            plotOptions: {
                spline: {
                    marker: {
                        enable: false
                    }
                }
            },
            series: [{
                name: 'U(x,t)',
                //data: [[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1],
                    //[50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]]
                //data: global_masRes_v3 //просто отрисовывает все слева направо, не пойдет
                data: global_masRes_v4,
                animation: {
                    duration: 2000,
                }
            }]
        });
    }
//==============================================================================================


    //Готовим диаграмму
    function createDiagram(a, b, C, M, N, layer_numb) {

        var h = (b - a) / N;

        if (chart) {
            chart.destroy();
        }

        eq_solve(layer_numb);

        var ctx = document.getElementById("setka").getContext('2d');
        var labels = [];
        var data = [];
        data_test = global_masRes;
        data_test_v2 = global_masRes_v2;

        //Заполняем данными
        for (var x = parseFloat(a), i = 0; x <= parseFloat(b), i < N + 1; x = x + h, i++) {

            labels.push('' + x.toFixed(4));
            data.push(global_masRes_v2[i].toFixed(2));
            //console.log("glob = ", global_masRes[i]);
        }

        //Обновляем
        // setka.update();

        /* function f(x) { //Вычисление нужной функции
             //return Math.sin(x);
             return Math.acos(-Math.sin(x) / C);
         } */

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, //Подписи оси x
                datasets: [
                    {
                        label: 'U(x,t)', //Метка
                        //data: data, //Данные
                        //data: data_test_v2,
                        data: global_masRes_v2,
                        borderColor: 'red', //Цвет
                        borderWidth: 1, //Толщина линии
                        fill: false //Не заполнять под графиком
                    },
                    /*{
                        label: 'H(x,t)', //Метка
                        //data: data, //Данные
                        data: data_test,
                        borderColor: 'yellow', //Цвет
                        borderWidth: 1, //Толщина линии
                        fill: false //Не заполнять под графиком
                    } // работает */

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
                    duration: 150 // general animation time
                },
                hover: {
                    animationDuration: 150 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 150 // animation duration after a resize
            }
        });
    }


    jQuery('#animate').click(function () {

        //$(this).toggleClass("active");
        //$("#setka").css("visibility", "visible");

        var a = parseFloat(document.getElementById('inputA').value);
        var b = parseFloat(document.getElementById('inputB').value);
        var t = parseFloat(document.getElementById('inputT').value);
        var C = parseFloat(document.getElementById('inputC').value);
        var N = parseInt(document.getElementById('inputN').value);
        var M = parseInt(document.getElementById('inputM').value);
        var layer_numb = parseInt(document.getElementById('inputK').value);

        var ctx_setka = document.getElementById('setka');

        $('.chart-container').slideDown(400, function() {

            createDiagram(a, b, C, M, N, layer_numb);
            test_1(layer_numb);

        });

    });


});