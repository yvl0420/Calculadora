document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    const pantalla = document.querySelector(".pantalla");
    const botonesCientificos = document.querySelector(".botones-cientificos");
    const botonModo = document.querySelector(".boton-modo");
    const calculadora = document.querySelector(".calculadora");

    // Variables que mantienen el estado de la calculadora
    let entradaActual = "0";
    let operador = null; 
    let entradaAnterior = null;
    let esperandoNuevoNumero = false;
    let modoCientifico = false;

    // Añadir event listeners a todos los botones de la calculadora
    document.querySelectorAll(".boton").forEach(boton => {
        boton.addEventListener("click", () => {
            const valor = boton.textContent; // Valor del botón presionado

            // Si el valor es un número o punto decimal, se maneja como un número
            if (!isNaN(valor) || valor === ".") {
                manejarNumero(valor);
            } else {
                // Si el valor es un operador o función, se maneja como una operación
                manejarOperacion(valor);
            }

            // Actualizar la pantalla después de cada acción
            actualizarPantalla();
        });
    });

    // Maneja la entrada de un número
    function manejarNumero(valor) {
        // Si estamos esperando un nuevo número (después de una operación), se reemplaza el número actual
        if (esperandoNuevoNumero) {
            entradaActual = valor;
            esperandoNuevoNumero = false;
        } else {
            // Si el número actual es "0" y no es un punto decimal, reemplazamos por el nuevo número
            if (entradaActual === "0" && valor !== ".") {
                entradaActual = valor;
            } else if (valor === "." && entradaActual.includes(".")) {
                // Si ya hay un punto decimal, no se permite agregar otro
                return;
            } else {
                // Si no, simplemente agregamos el valor al número actual
                entradaActual += valor;
            }
        }
    }

    // Maneja las operaciones
    function manejarOperacion(valor) {
        if (valor === "AC") {
            // Si se presiona "AC", reinicia todo
            entradaActual = "0";
            entradaAnterior = null;
            operador = null;
            esperandoNuevoNumero = false;
        } else if (valor === "+/-") {
            // Si se presiona "+/-", cambia el signo del número actual
            entradaActual = (parseFloat(entradaActual) * -1).toString();
        } else if (valor === "%") {
            // Si se presiona "%", convierte el número actual a su valor porcentual
            entradaActual = (parseFloat(entradaActual) / 100).toString();
        } else if (valor === "=") {
            // Si se presiona "=", realiza la operación
            if (operador && entradaAnterior !== null) {
                entradaActual = calcular(entradaAnterior, entradaActual, operador);
                operador = null;
                entradaAnterior = null;
                esperandoNuevoNumero = true;
            }
        } else {
            // Si hay un operador previamente seleccionado, realiza la operación antes de cambiar
            if (operador && !esperandoNuevoNumero) {
                entradaActual = calcular(entradaAnterior, entradaActual, operador);
            }
            operador = valor;
            entradaAnterior = entradaActual;
            esperandoNuevoNumero = true;
        }
    }

    // Función que realiza el cálculo según el operador
    function calcular(num1, num2, op) {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);

        // Realiza la operación dependiendo del operador
        switch (op) {
            case "+": return (num1 + num2).toString();
            case "-": return (num1 - num2).toString();
            case "×": return (num1 * num2).toString();
            case "÷": return num2 !== 0 ? (num1 / num2).toString() : "Error"; // No permitir división por cero
            default: return num2.toString(); // Devuelve el segundo número si no es ninguna operación
        }
    }

    // Actualiza el contenido de la pantalla
    function actualizarPantalla() {
        pantalla.textContent = entradaActual.length > 10 ? parseFloat(entradaActual).toExponential(4) : entradaActual;
    }

    // Cambia entre modo normal y modo científico
    botonModo.addEventListener("click", () => {
        modoCientifico = !modoCientifico; // Cambia el estado del modo científico

        if (modoCientifico) {
+            botonesCientificos.classList.add("mostrar-cientifico");
            calculadora.classList.add("expandida");
            botonModo.textContent = "Modo Normal";
        } else {
            botonesCientificos.classList.remove("mostrar-cientifico");
            calculadora.classList.remove("expandida");
            botonModo.textContent = "Modo Científico";
        }
    });

    document.querySelectorAll(".botones-cientificos .boton").forEach(boton => {
        boton.addEventListener("click", () => {
            const funcion = boton.textContent;
            let valor = parseFloat(entradaActual);

            if (isNaN(valor)) return;

            // Realizar la operación científica según la función seleccionada
            switch (funcion) {
                case "sin": entradaActual = Math.sin(valor * Math.PI / 180).toString(); break; // Seno
                case "cos": entradaActual = Math.cos(valor * Math.PI / 180).toString(); break; // Coseno
                case "tan": entradaActual = Math.tan(valor * Math.PI / 180).toString(); break; // Tangente
                case "ln": entradaActual = valor > 0 ? Math.log(valor).toString() : "Error"; break; // Logaritmo natural
                case "log": entradaActual = valor > 0 ? Math.log10(valor).toString() : "Error"; break; // Logaritmo en base 10
                case "π": entradaActual = Math.PI.toString(); break; // Valor de Pi
                case "e": entradaActual = Math.E.toString(); break; // Valor de e (constante de Euler)
                case "x²": entradaActual = (valor ** 2).toString(); break; // Cuadrado del valor
                case "√": entradaActual = valor >= 0 ? Math.sqrt(valor).toString() : "Error"; break; // Raíz cuadrada
                case "1/x": entradaActual = valor !== 0 ? (1 / valor).toString() : "Error"; break; // Inverso del valor
                default: return;
            }

            // Actualizar pantalla después de la operación científica
            actualizarPantalla();
        });
    });
});
