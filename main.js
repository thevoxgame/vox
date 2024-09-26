// Configuración del canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ANCHO = canvas.width;
const ALTO = canvas.height;

//Imagenes
const imagenNave = new Image();
imagenNave.src = '/Users/marionaldi/Desktop/JUEGO VOX/imagenes/nave.png'; // Cambia esto a la ruta de tu imagen

const imagenEnemigo = new Image();
imagenEnemigo.src = '/Users/marionaldi/Desktop/JUEGO VOX/imagenes/fernando.png'; // Cambia esto a la ruta de tu imagen

const imagenEnemigo2 = new Image();
imagenEnemigo2.src = '/Users/marionaldi/Desktop/JUEGO VOX/imagenes/pepe.png'; // Cambia esto a la ruta de tu imagen

const imagenEscudo = new Image();
imagenEscudo.src = '/Users/marionaldi/Desktop/JUEGO VOX/imagenes/escudo.png'; // Cambia esto a la ruta de tu imagen

const imagenObstaculo = new Image();
imagenObstaculo.src = '/Users/marionaldi/Desktop/JUEGO VOX/imagenes/agenda.png'; // Cambia esto a la ruta de tu imagen


// Variables de juego
let teclas = {};
let gameOver = false; // Indica si el juego ha terminado
let dificultad = 1; // Incrementa la dificultad con el tiempo
let tiempoJugado = 0; // Para medir el tiempo que ha pasado en la partida


// Eventos de teclado
document.addEventListener('keydown', (e) => teclas[e.code] = true);
document.addEventListener('keyup', (e) => teclas[e.code] = false);

// Clase Jugador
class Jugador {
    constructor() {
        this.ancho = 90;
        this.alto = 80;
        this.x = ANCHO / 2 - this.ancho / 2;
        this.y = ALTO - this.alto - 10;
        this.velocidad = 5;
        this.balas = [];
        this.escudo = 0; // Nivel de escudo (protección)
        this.maxEscudo = 3; // Máximo de 3 escudos
        this.vivo = true; // El jugador empieza vivo
    }

    mover() {
        if (teclas["ArrowLeft"] && this.x > 0) {
            this.x -= this.velocidad;
        }
        if (teclas["ArrowRight"] && this.x < ANCHO - this.ancho) {
            this.x += this.velocidad;
        }
    }

    disparar() {
        if (teclas["Space"]) {
            // Crear una bala
            this.balas.push(new Bala(this.x + this.ancho / 2, this.y));
            teclas["Space"] = false; // Evita disparos continuos
        }
    }

    dibujar() {
        ctx.drawImage(imagenNave, this.x, this.y, this.ancho, this.alto);
        
        // Dibujar barra de escudo (si el jugador tiene escudo)
        ctx.fillStyle = "blue";
        ctx.font = "16px Arial";
        ctx.fillText(`Escudos: ${this.escudo}`, 10, 20);
        if (this.escudo >= this.maxEscudo) {
            ctx.fillText("Máximo escudos", 10, 40); // Mensaje de máximo escudos
        }
    }
    
    

    actualizar() {
        this.mover();
        this.disparar();
        this.balas.forEach((bala, index) => {
            bala.actualizar();
            if (bala.y < 0) {
                this.balas.splice(index, 1); // Eliminar la bala fuera de la pantalla
            }
        });
    }

    agregarEscudo() {
        if (this.escudo < this.maxEscudo) {
            this.escudo++;
        }
    }

    recibirDaño() {
        if (this.escudo > 0) {
            this.escudo--; // Se pierde solo un escudo
        } else {
            this.vivo = false;
            gameOver = true; // Terminar el juego si no hay escudos
        }
    }

    morirInstantaneamente() {
        this.vivo = false;
        gameOver = true; // Muerte instantánea, sin importar el escudo
    }
}

// Clase Bala
class Bala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidad = 7;
        this.ancho = 5;
        this.alto = 10;
    }

    actualizar() {
        this.y -= this.velocidad;
        this.dibujar();
    }

    dibujar() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
}

// Clase Enemigo (meteorito)
class Enemigo {
    constructor() {
        this.ancho = 55;
        this.alto = 70;
        this.x = Math.random() * (ANCHO - this.ancho);
        this.y = Math.random() * -ALTO; // Inicia fuera de la pantalla
        this.velocidad = Math.random() * 3 + 1; // Velocidad inicial
    }

    actualizar() {
        this.y += this.velocidad * dificultad; // Velocidad ajustada por la dificultad
        if (this.y > ALTO) {
            this.y = Math.random() * -ALTO; // Reaparece arriba
            this.x = Math.random() * (ANCHO - this.ancho); // Posición aleatoria en X
            this.velocidad = Math.random() * 3 + 1; // Nueva velocidad base
        }
        this.dibujar();
    }

    dibujar() {
        ctx.drawImage(imagenEnemigo, this.x, this.y, this.ancho, this.alto);
    }
    
}

// Clase Enemigo2 (enemigo diferente)
class Enemigo2 {
    constructor() {
        this.ancho = 55;
        this.alto = 70;
        this.x = Math.random() * (ANCHO - this.ancho);
        this.y = Math.random() * -ALTO; // Inicia fuera de la pantalla
        this.velocidad = Math.random() * 2 + 1; // Velocidad diferente
    }

    actualizar() {
        this.y += this.velocidad * dificultad; // Velocidad ajustada por la dificultad
        if (this.y > ALTO) {
            this.y = Math.random() * -ALTO; // Reaparece arriba
            this.x = Math.random() * (ANCHO - this.ancho); // Posición aleatoria en X
            this.velocidad = Math.random() * 2 + 1; // Nueva velocidad base
        }
        this.dibujar();
    }

    dibujar() {
        ctx.drawImage(imagenEnemigo2, this.x, this.y, this.ancho, this.alto);
    }
}


// Clase Escudo
class Escudo {
    constructor() {
        this.ancho = 40;
        this.alto = 50;
        this.x = Math.random() * (ANCHO - this.ancho);
        this.y = Math.random() * -ALTO; // Aparecen arriba
        this.velocidad = 2; // Velocidad de caída
    }

    actualizar() {
        this.y += this.velocidad;
        if (this.y > ALTO) {
            this.y = Math.random() * -ALTO; // Reaparece arriba si sale de la pantalla
            this.x = Math.random() * (ANCHO - this.ancho);
        }
        this.dibujar();
    }

    dibujar() {
    ctx.drawImage(imagenEscudo, this.x, this.y, this.ancho, this.alto);
}

}

// Clase Obstáculo Mortal
class ObstaculoMortal {
    constructor() {
        this.ancho = 50;
        this.alto = 50;
        this.x = Math.random() * (ANCHO - this.ancho);
        this.y = Math.random() * -ALTO; // Aparece fuera de la pantalla
        this.velocidad = 4; // Velocidad constante
    }

    actualizar() {
        this.y += this.velocidad;
        if (this.y > ALTO) {
            this.y = Math.random() * -ALTO;
            this.x = Math.random() * (ANCHO - this.ancho);
        }
        this.dibujar();
    }

    dibujar() {
        ctx.drawImage(imagenObstaculo, this.x, this.y, this.ancho, this.alto); // Dibuja la imagen
    }
}

// Inicialización del jugador, enemigos, escudos y obstáculos mortales
const jugador = new Jugador();
const enemigos = [];
const enemigos2 = [];
const escudos = [];
const obstaculosMortales = [];

// Generar enemigos iniciales
for (let i = 0; i < 5; i++) {
    enemigos.push(new Enemigo());
}

// Generar enemigos de tipo 2
for (let i = 0; i < 3; i++) {
    enemigos2.push(new Enemigo2());
}

// Generar escudos iniciales
for (let i = 0; i < 2; i++) {
    escudos.push(new Escudo());
}

// Función para generar enemigos de forma infinita
function generarEnemigos() {
    if (enemigos.length < 5) {  // Aseguramos que haya al menos 5 enemigos siempre
        let enemigo = new Enemigo();
        enemigos.push(enemigo);
    }
}

// Función para generar enemigos de tipo 2 de forma infinita
function generarEnemigos2() {
    if (enemigos2.length < 3) {  // Aseguramos que haya al menos 3 enemigos de tipo 2
        let enemigo2 = new Enemigo2();
        enemigos2.push(enemigo2);
    }
}

// Función para generar escudos continuamente con menor frecuencia
function generarEscudos() {
    const probabilidad = 0.005; // Baja probabilidad de generar un escudo
    if (Math.random() < probabilidad) {
        escudos.push(new Escudo());
    }
}

// Función para generar obstáculos mortales con baja frecuencia
function generarObstaculosMortales() {
    const probabilidad = 0.001; // Aún menor probabilidad de generar un obstáculo mortal
    if (Math.random() < probabilidad) {
        obstaculosMortales.push(new ObstaculoMortal());
    }
}

// Función de Game Over
function mostrarGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, ALTO / 2 - 100, ANCHO, 200);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";  // Alinear el texto al centro para el Game Over
    ctx.fillText("¡Game Over!", ANCHO / 2, ALTO / 2 - 20);

    ctx.font = "30px Arial";
    ctx.fillText("Presiona 'R' para reiniciar", ANCHO / 2, ALTO / 2 + 30);

    // Restablecer la alineación a la izquierda después de dibujar Game Over
    ctx.textAlign = "left";

    document.addEventListener('keydown', reiniciarJuego);
}

// Función para reiniciar el juego
function reiniciarJuego(e) {
    if (e.code === 'KeyR') {
        gameOver = false;
        jugador.vivo = true;
        jugador.escudo = 0;
        dificultad = 1; // Reiniciar la dificultad
        tiempoJugado = 0; // Reiniciar el tiempo jugado

        jugador.x = ANCHO / 2 - jugador.ancho / 2;
        jugador.y = ALTO - jugador.alto - 10;
        jugador.balas = [];

        enemigos.length = 0;
        for (let i = 0; i < 5; i++) {
            enemigos.push(new Enemigo());
        }

        escudos.length = 0;
        for (let i = 0; i < 2; i++) {
            escudos.push(new Escudo());
        }

        obstaculosMortales.length = 0;

        document.removeEventListener('keydown', reiniciarJuego);
        loop();
    }
}



// Bucle de juego
function loop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, ANCHO, ALTO);

        // Incrementar el tiempo jugado
        tiempoJugado++;

        // Incrementa la dificultad gradualmente cada 500 cuadros (aproximadamente cada 8 segundos si el FPS es 60)
        if (tiempoJugado % 500 === 0) {
            dificultad += 0.1;
            nivelActual = Math.floor(dificultad); // Actualizar nivel basado en la dificultad

    
        }

        jugador.actualizar();
        jugador.dibujar();

        enemigos.forEach(enemigo => enemigo.actualizar());
        jugador.balas.forEach(bala => {
            enemigos.forEach((enemigo, eIndex) => {
                if (bala.x < enemigo.x + enemigo.ancho &&
                    bala.x + bala.ancho > enemigo.x &&
                    bala.y < enemigo.y + enemigo.alto &&
                    bala.y + bala.alto > enemigo.y) {
                    enemigos.splice(eIndex, 1); // Eliminar el enemigo al impactar
                    jugador.balas = jugador.balas.filter(b => b !== bala); // Eliminar la bala
                }
            });
        });

        enemigos2.forEach(enemigo2 => enemigo2.actualizar());
        jugador.balas.forEach(bala => {
            enemigos2.forEach((enemigo2, eIndex) => {
                if (bala.x < enemigo2.x + enemigo2.ancho &&
                    bala.x + bala.ancho > enemigo2.x &&
                    bala.y < enemigo2.y + enemigo2.alto &&
                    bala.y + bala.alto > enemigo2.y) {
                    enemigos2.splice(eIndex, 1); // Eliminar el enemigo2 al impactar
                    jugador.balas = jugador.balas.filter(b => b !== bala); // Eliminar la bala
                }
            });
        });

        // Actualizar y manejar colisiones con el nuevo tipo de enemigo (Enemigo2)
        enemigos2.forEach((enemigo2, index) => {
            enemigo2.actualizar();

            if (jugador.x < enemigo2.x + enemigo2.ancho &&
                jugador.x + jugador.ancho > enemigo2.x &&
                jugador.y < enemigo2.y + enemigo2.alto &&
                jugador.y + jugador.alto > enemigo2.y) {

                // Si el jugador tiene escudo, lo pierde
                if (jugador.escudo > 0) {
                    jugador.escudo--;
                    enemigos2.splice(index, 1); // Eliminar el enemigo
                } else {
                    // Si no tiene escudo, muere
                    jugador.morirInstantaneamente();
                }
            }
        });

        escudos.forEach((escudo, index) => {
            escudo.actualizar();
            if (jugador.x < escudo.x + escudo.ancho &&
                jugador.x + jugador.ancho > escudo.x &&
                jugador.y < escudo.y + escudo.alto &&
                jugador.y + jugador.alto > escudo.y) {
                jugador.agregarEscudo();
                escudos.splice(index, 1);
            }
        });

        obstaculosMortales.forEach((obstaculo, index) => {
            obstaculo.actualizar();
            if (jugador.x < obstaculo.x + obstaculo.ancho &&
                jugador.x + jugador.ancho > obstaculo.x &&
                jugador.y < obstaculo.y + obstaculo.alto &&
                jugador.y + jugador.alto > obstaculo.y) {
                jugador.morirInstantaneamente(); // Muerte instantánea
            }
        });

        enemigos.forEach((enemigo, index) => {
            if (jugador.x < enemigo.x + enemigo.ancho &&
                jugador.x + jugador.ancho > enemigo.x &&
                jugador.y < enemigo.y + enemigo.alto &&
                jugador.y + jugador.alto > enemigo.y) {
                jugador.recibirDaño();
                enemigos.splice(index, 1);
            }
        });

        enemigos2.forEach((enemigo2, index) => {
            if (jugador.x < enemigo2.x + enemigo2.ancho &&
                jugador.x + jugador.ancho > enemigo2.x &&
                jugador.y < enemigo2.y + enemigo2.alto &&
                jugador.y + jugador.alto > enemigo2.y) {
                jugador.recibirDaño();
                enemigos2.splice(index, 1);
            }
        });

    

        generarEnemigos();
        generarEnemigos2();
        generarEscudos();
        generarObstaculosMortales();

        requestAnimationFrame(loop);
    } else {
        mostrarGameOver();
    }
}

// Iniciar el juego
loop();


