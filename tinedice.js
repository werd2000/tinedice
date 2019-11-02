const btnEmpezar = document.getElementById('btnEmpezar');
const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const ULTIMO_NIVEL = 10;

class Juego {
    constructor() {
        this.inicializar();
        this.generarSecuencia();
        setTimeout( () => {
            this.siguienteNivel();
        }, 1000);
    }

    inicializar() {
        this.elegirColor = this.elegirColor.bind(this);
        this.toogleBtnEmpezar();
        this.nivel = 1;
        this.mostrarNivel();
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    toogleBtnEmpezar() {
        if (btnEmpezar.classList.contains('hide')) {
            btnEmpezar.classList.remove('hide');
        } else {
            btnEmpezar.classList.add('hide');
        }
    }

    generarSecuencia() {
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
    }

    siguienteNivel() {
        this.subnivel = 0;
        this.mostrarNivel();
        this.iluminarSecuencia();
        this.agregarEventosClick();
    }

    transformarNumeroAColor(numero) {
        switch(numero) {
            case 0:
                return 'celeste';
            case 1:
                return 'violeta';
            case 2:
                return 'naranja';
            case 3:
                return 'verde'
        }
    }

    transformarColorANumero(color) {
        switch (color) {
            case 'celeste':
                return 0;
            case 'violeta':
                return 1;
            case 'naranja':
                return 2;
            case 'verde':
                return 3;
        }
    }

    iluminarSecuencia() {
        for (let i=0; i < this.nivel; i++) {
            const color = this.transformarNumeroAColor(this.secuencia[i]);
            setTimeout(() =>  this.iluminarColor(color), 1000 * i);
        }
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light');
        setTimeout( () => this.apagarColor(color), 350);
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light');
    }

    agregarEventosClick() {
        // TENGO QUE UNIR EL THIS QUE ES EL JUEGO A LA FUNCION ELEGIR COLOR
        // lo hago uno por uno o en la inicialización --^
        // this.colores.celeste.addEventListener('click', this.elegirColor.bind(this));
        // this.colores.verde.addEventListener('click', this.elegirColor.bind(this));
        // this.colores.violeta.addEventListener('click', this.elegirColor.bind(this));
        // this.colores.naranja.addEventListener('click', this.elegirColor.bind(this));
        this.colores.celeste.addEventListener('click', this.elegirColor);
        this.colores.verde.addEventListener('click', this.elegirColor);
        this.colores.violeta.addEventListener('click', this.elegirColor);
        this.colores.naranja.addEventListener('click', this.elegirColor);
    }

    eliminarEventosClick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor);
        this.colores.verde.removeEventListener('click', this.elegirColor);
        this.colores.violeta.removeEventListener('click', this.elegirColor);
        this.colores.naranja.removeEventListener('click', this.elegirColor);
    }

    elegirColor(evento) {
        const nombreColor = evento.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        this.iluminarColor(nombreColor);
        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++;
            if (this.nivel === this.subnivel) {
                this.nivel ++;
                this.eliminarEventosClick();

                if (this.nivel === (ULTIMO_NIVEL + 1)) {
                    // Ganó
                    this.ganoElJuego();
                } else {
                    // avanzar de nivel
                    console.log('siguiente nivel')
                    setTimeout( () => this.siguienteNivel(), 2000);
                }

            }
        } else {
            // perdió
            this.perdioElJuego();
        }
    }

    ganoElJuego() {
        this.audio('gano.mp3');
        this.nivel = 0;
        this.mostrarNivel();
        swal('Tine', 'Felicitaciones ganaste el juego!', 'success' )
        .then (() => {
            this.inicializar();
        })
    }

    perdioElJuego() {
        this.audio('perdio.mp3');
        this.nivel = 0;
        this.mostrarNivel();
        swal('Tine', 'Huy que macana perdiste el juego :(', 'error' )
        .then (() => {
            this.eliminarEventosClick();    
            this.inicializar();
        })
    }

    mostrarNivel() {
        const spanNivel = document.getElementById('nivel');
        spanNivel.innerText = this.nivel;
    }

    
    audio(sound) {
        var audio = new Audio();
        audio.src = './sound/' + sound;
        audio.play();
    }
}

function empezarJuego() {
    window.juego = new Juego();   
}

window.addEventListener('load', function() {
    const fecha = document.getElementById('fecha');
    fecha.innerText = new Date().toLocaleDateString();
})
