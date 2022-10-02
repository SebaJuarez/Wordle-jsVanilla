// SECTOR DE LOGICA, CREACION DE OBJETOS Y MANEJO DE LOS MISMOS-------------------------------------------------------------------- 
// enumerado para anotar coincidencias
const coincidencias = {
    NINGUNA : 1,
    EXISTE : 2,
    EXISTEYLUGAR : 3,
}
// enumerado para saber la condicion del jugador
const condicionDeJugador = {
    PERDIO : 1,
    SIGUE : 2,
    GANO : 3,
}
// almacena las palabras disponibles, devuelve una palabra secreta random, valida la existencia de una palabra
class Diccionario{
    // PALABRAS ADMITIDAS
    constructor(){
        this.caracteresAdmitidos = "abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMÑNOPQRSTUVWXYZÁÉÍÓÚ"
        this.palabrasDisopibles = //[ aca va el diccionario]
        this.cantidadDePalabras = this.palabrasDisopibles.length - 1;
    }

    // selecciono random una palabra secreta
    getPalabraSecreta(){
        var palabraSecreta = [];
        var indice = Math.round(Math.random()*this.cantidadDePalabras)
        palabraSecreta = this.palabrasDisopibles[indice];
        return Array.from(palabraSecreta);
    }

    // valido si existe la palabra que ingresa el jugador
    validarExistencia(palabraJugador){
        var palabra = palabraJugador.toString().replaceAll(",","");
        if(this.palabrasDisopibles.includes(palabraJugador)){
            return true
        } else {
            return false;
        }
    }

    getCaracteresAdmitidos(){
        return this.caracteresAdmitidos;
    }
}
//--------------------------------------------------------------------------------------------------------------
class RegistroCaracter{
    constructor(c){
        this.caracter = c;
        this.repeticiones = 1;
    }

    incRepeticion(){
        this.repeticiones ++;
    }

    decRepeticion(){
        this.repeticiones --;
    }

    getRepeticion(){
        return this.repeticiones;
    }

    setCaracter(c){
        this.caracter = c;
    }

    getCaracter(){
        return this.caracter;
    }
}
// guarda una palabra secreta,
class PalabraSecreta{
    constructor(palabraSecreta){
        this.palabraSecreta = palabraSecreta;
    }

    // DEVUELVE UN VECTOR CON LAS COINCIDENCIAS DE CADA PALABRA 
    devolverCoincidencias(palabraJugador){
        var vectorCoincidencias = [];
        var caracteresRepetidos = this.obtenerRepeticiones(this.palabraSecreta);

        // COLOCO EXISTENCIAS
        for(let i = 0; i < this.palabraSecreta.length; i++){
            if(this.palabraSecreta.includes(palabraJugador[i])){
                if(palabraJugador[i] == this.palabraSecreta[i]){
                    vectorCoincidencias[i] = coincidencias.EXISTEYLUGAR;
                    for(let j = 0; j<caracteresRepetidos.length; j++){
                        if(caracteresRepetidos[j].getCaracter() == this.palabraSecreta[i]){
                            caracteresRepetidos[j].decRepeticion();
                        }
                    }
                }
            }
        }
        // COLOCO EXISTENCIAS E INEXISTENCIAS
        for(let i = 0; i < this.palabraSecreta.length; i++){
            if(this.palabraSecreta.includes(palabraJugador[i])){
                if(palabraJugador[i] != this.palabraSecreta[i]){
                    for(let j = 0; j<caracteresRepetidos.length; j++){
                        if(caracteresRepetidos[j].getCaracter() == palabraJugador[i]){
                            if(caracteresRepetidos[j].getRepeticion() > 0){
                                vectorCoincidencias[i] = coincidencias.EXISTE;
                            } else {
                                vectorCoincidencias[i] = coincidencias.NINGUNA;
                            }
                        }
                    }
                }
            } else{
                vectorCoincidencias[i] = coincidencias.NINGUNA;
            }
        }
        return vectorCoincidencias;
    }

    getPalabraSecreta(){
        return this.palabraSecreta;
    }


    obtenerRepeticiones(p){
        var reps = [];
        var bandera;
        for(let i = 0; i < p.length;i++){
            bandera = false;
            if(i != 0){
                for(let j = 0; j < reps.length; j++){
                    if(reps[j].getCaracter() == p[i]){
                        bandera = true;
                        reps[j].incRepeticion();
                    }
                }
            }
            if(bandera == false){
                var reg = new RegistroCaracter(p[i]);
                reps.push(reg );
            }
        }
        return reps;
    }
    
}
class Jugador{
    constructor(){
        this.intentos = 0;
        this.estado = condicionDeJugador.SIGUE;
        this.palabra = "";
        this.ultimaPalabra = "";
    }

    getIntentos(){
        return this.intentos;
    }

    incIntentos(){
        this.intentos ++;
        if(this.getIntentos() == 6){
            this.ultimaPalabra = this.getPalabra();
        }
        this.palabra = "";
    }

    getEstado(){
        return this.estado;
    }

    setEstado(estado){
         this.estado = estado;
    }
    
    setUltimaPalabra(p){
        this.ultimaPalabra = p;
    }

    setPalabra(c){
        this.palabra =  c;
    }

    getPalabra(){
        return this.palabra;
    }

    getUltimaPalabra(){
       return this.ultimaPalabra;
    }
}
class Juego{

    constructor(){
        this.jugador = new Jugador();
        this.diccionario = new Diccionario();
        this.palabraSecreta = new PalabraSecreta(this.diccionario.getPalabraSecreta());
        this.vectorCoincidencias = [];
    }

    getPalabraSecreta(){
        return this.palabraSecreta.getPalabraSecreta();
    }

    getJugador(){
        return this.jugador;
    }

    getDiccionario(){
        return this.diccionario;
    }

    jugar(palabra){
        this.probarPalabra(palabra);
        return this.vectorCoincidencias;
    }

    probarPalabra(palabra){
        var palabraVector = Array.from(palabra);
       this.vectorCoincidencias = this.palabraSecreta.devolverCoincidencias(palabraVector);
    }

    condicionDeJugador(){
        for( let i = 0; i<this.vectorCoincidencias.length;i++){
            if(this.vectorCoincidencias[i] != coincidencias.EXISTEYLUGAR){
                if(this.jugador.getIntentos() > 5){
                    this.getJugador().setEstado(condicionDeJugador.PERDIO);
                    return condicionDeJugador.PERDIO
                } else{
                    this.getJugador().setEstado(condicionDeJugador.SIGUE);
                    return condicionDeJugador.SIGUE;
                }
            }
        }
        this.getJugador().setUltimaPalabra(this.getJugador().getPalabra());
        this.getJugador().setEstado(condicionDeJugador.GANO);
        return condicionDeJugador.GANO;
    }

    getVectorCoincidencias(){
        return this.vectorCoincidencias;
    }
}
class RegistroLocalStorage{
    constructor(juego){
        this.partidaCompleta = juego;
    }

    guardarDatosImportantes(){
        let datos = {
            palabraSecreta : this.partidaCompleta.getPalabraSecreta(),
            vectorCoincidencia : this.partidaCompleta.getVectorCoincidencias(),
            condicionDeJugador : this.partidaCompleta.getJugador().getEstado(),
        }
        return datos;
    }

    guardarPartida(){
        if(localStorage.getItem("historial")){
            let historial = JSON.parse(localStorage.getItem("historial"));
            historial.push(this.guardarDatosImportantes());
            localStorage.setItem("historial",JSON.stringify(historial));
        } else {
            let historial = [];
            historial.push(this.guardarDatosImportantes());
            localStorage.setItem("historial",JSON.stringify(historial));
        }
    }

    obtenerDatos(){
        if(localStorage.getItem("historial")){
            let historial = JSON.parse(localStorage.getItem("historial"));
            return historial;
        } 

        return false;
    }



}
//-------------- FIN DEL SECTOR DE CREACION DE OBJETOS Y LOGICA------------------------------------------------------------------------

//--------------- MANJEO DEL DOM E INTERACCION DE LOS OBJETOS CON LA INTERFAZ ---------------------------------------------------------
var juego = new Juego();
var registroLocalStorage = new RegistroLocalStorage(juego);
var casilla = cargarCasillas(juego.getJugador().getIntentos());
cargarDatosAlModalEstadisticas();
// cargo los input text en un array
function cargarCasillas(fila){
    var casilla = [];
    for(var i = 0 ; i < 6; i++){
    casilla[i] = document.getElementById('f'+(fila+1)+'-'+(i+1));
    }
    for(let i = 0;i < casilla.length;i++){
        casilla[i].firstChild.readOnly = false;
    }
    return casilla;
}
//-------------------------------------
// cargo el body para las animaciones de perder y ganar
const body = document.querySelector('body');
//----------- cargo las palabras del intento  n-------
function cargarPalabra(){
    var s = "";
    var casilla = cargarCasillas(juego.getJugador().getIntentos())
    s = casilla[0].firstChild.value + casilla[1].firstChild.value + casilla[2].firstChild.value + casilla[3].firstChild.value
        + casilla[4].firstChild.value + casilla[5].firstChild.value
    return s;    
}
//------------------------------------------------
// devuelvo los colores en los input text segun corresponda, guiandome por el vector de coincidencias
function devolucionVisual(vectorCoincidencias){
    pintarBotones(vectorCoincidencias,juego.getJugador().getPalabra());
    var casilla = cargarCasillas(juego.getJugador().getIntentos());
    for(let i = 0; i<vectorCoincidencias.length; i++){
        setTimeout(function(){
        //le agrego la animacion para dar vuelta los input
        casilla[i].classList.add("animation");
        // las casillas se pintan en 0.5 segundos, justo cuando se dan vuelta
            if(vectorCoincidencias[i] == coincidencias.EXISTE){
                casilla[i].firstChild.style.backgroundColor = 'rgb(127, 127, 53)';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            } else  if(vectorCoincidencias[i] == coincidencias.EXISTEYLUGAR)  {
                casilla[i].firstChild.style.backgroundColor = 'green';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            } else{
                casilla[i].firstChild.style.backgroundColor = 'gray';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            }
        }, 500);
        }
}
//-------------------------------------------------------------------------------------
// hago un readonly = true a los input del intento que gaste-------------------------
function readonlyPalabraUsada(fila){
    var casilla = cargarCasillas(fila);
    for(let i = 0;i < casilla.length;i++){
        casilla[i].firstChild.readOnly = true;
    }
}
// -------------------------------------------------------------------------------------
// hago un readonly = false para poder usar las siguientes casillas--------------------
function readonlySiguientePalabra(fila){
    var casilla = cargarCasillas(fila);
    for(let i = 0;i < casilla.length;i++){
        casilla[i].firstChild.readOnly = false;
    }
}
//------------------------------------------------------------------------------------
// funciones que setean el juego (ingreso por teclado o por teclado en pantalla)-------
function jugar(){
    juego.getJugador().setPalabra(cargarPalabra());
    devolucionVisual(juego.jugar(juego.getJugador().getPalabra()));
    readonlyPalabraUsada(juego.getJugador().getIntentos());
    juego.getJugador().incIntentos();
    evaluarCondicionJugador();
}
//-------------------------------------------------------------------------------------
// funcion para evaluar si el jugar perdio, gano o si sigue en juego-------------------
function evaluarCondicionJugador(){
    if((juego.getJugador().getIntentos() > 5)&&(juego.condicionDeJugador() == condicionDeJugador.PERDIO)){
        registroLocalStorage.guardarPartida();
        modalPerdio();
    } else  if((juego.getJugador().getIntentos() > 5)&&(juego.condicionDeJugador() == condicionDeJugador.GANO)){
        registroLocalStorage.guardarPartida();
        modalGanador();
    } else if ( juego.condicionDeJugador() == condicionDeJugador.GANO){
        registroLocalStorage.guardarPartida();
        modalGanador();
    } else{
        animacionPerdio();
        readonlySiguientePalabra(juego.getJugador().getIntentos());
    }
}
//--------------------------------------------------------------------------------------
// activar modal ganador -------------------------------------------
function modalGanador(){
let boton = document.getElementById('botonGano');
let texto = document.getElementById('nintento');
boton.click();
let vectorCoincidencias = juego.getVectorCoincidencias();
let palabra = juego.getPalabraSecreta();
    for (let i= 0; i < vectorCoincidencias.length; i++){
        let casilla = document.getElementById('f'+vectorCoincidencias.length+'-'+(i+1)+'g');
        casilla.firstChild.value = palabra[i];
        casilla.classList.add('animation');
    }
    texto.firstChild.value = juego.getJugador().getIntentos();
}
//------------------------------------------------------------------
// activar modal perdedor -------------------------------------------------------------
function modalPerdio(){
    let boton = document.getElementById('botonPerdio');
    boton.click();
    var casilla = [];
    var casillar=[];
    let barraProgeso = document.getElementById('barraProgreso');
    var fila = 5;
    var count = 0;
    let palabra = juego.getJugador().getUltimaPalabra();
    let palabraResultado = juego.getPalabraSecreta();
    for(var i = 0 ; i < 6; i++){
    casilla[i] = document.getElementById('f'+(fila+1)+'-'+(i+1)+'r');
    }
    let vectorCoincidencias = juego.jugar(palabra);
    for(let i = 0; i<vectorCoincidencias.length; i++){
        casilla[i].classList.add("animation");
        casilla[i].firstChild.value = palabra[i] ;
        //le agrego la animacion para dar vuelta los input
        // las casillas se pintan en 0.5 segundos, justo cuando se dan vuelta
            if(vectorCoincidencias[i] == coincidencias.EXISTE){
                casilla[i].firstChild.style.backgroundColor = 'rgb(127, 127, 53)';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            } else  if(vectorCoincidencias[i] == coincidencias.EXISTEYLUGAR)  {
                count++;
                casilla[i].firstChild.style.backgroundColor = 'green';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            } else{
                casilla[i].firstChild.style.backgroundColor = 'gray';
                casilla[i].firstChild.style.color = 'white';
                casilla[i].firstChild.classList.add("usado");
            }
        }
        for(var i = 0 ; i < 6; i++){
            casillar[i] = document.getElementById('f'+(fila+1)+'-'+(i+1)+'rr');
        }
        let vectorCoincidencias2 = juego.jugar(palabraResultado);
        for(let i = 0; i<vectorCoincidencias2.length; i++){
            casillar[i].classList.add("animation");
            casillar[i].firstChild.value = palabraResultado[i] ;
            //le agrego la animacion para dar vuelta los input
            // las casillas se pintan en 0.5 segundos, justo cuando se dan vuelta
                if(vectorCoincidencias2[i] == coincidencias.EXISTE){
                    casillar[i].firstChild.style.backgroundColor = 'rgb(127, 127, 53)';
                    casillar[i].firstChild.style.color = 'white';
                    casillar[i].firstChild.classList.add("usado");
                } else  if(vectorCoincidencias2[i] == coincidencias.EXISTEYLUGAR)  {
                    casillar[i].firstChild.style.backgroundColor = 'green';
                    casillar[i].firstChild.style.color = 'white';
                    casillar[i].firstChild.classList.add("usado");
                } else{
                    casillar[i].firstChild.style.backgroundColor = 'gray';
                    casillar[i].firstChild.style.color = 'white';
                    casillar[i].firstChild.classList.add("usado");
                }
            }
    barraProgeso.style.transition = 'all 2s ease 3s';
    barraProgeso.style.width = Math.round((count / 6) * 100)+'%';
    // juego.getPalabraSecreta().toString().replaceAll(",",""));
}
//-------------------------------------------------------------------------------------
// funcion para llenar los campos (siempre el primer lugar que contenga el caracter)
function llenarCampo(c){
    let casilla = cargarCasillas(juego.getJugador().getIntentos());
    for(let i = 0; i < casilla.length;i++){
       if (casilla[i].firstChild.value == ""){
        casilla[i].firstChild.value = c.toLowerCase();
        break;
       }
    }
}
//--------------------------------------------------------------------
// funcion que borra los campos, (siempre el ultimo lugar que contenga un caracter)
function borrarCampo(){
    let casilla = cargarCasillas(juego.getJugador().getIntentos());
    for(let i = casilla.length-1; i >= 0;i--){
       if (casilla[i].firstChild.value != ""){
        casilla[i].firstChild.value = "";
        break;
       }
    }
}
//------------------------------------------------------------------------------------
// evento que lee datos ingresados por teclado--------------------------------------
document.addEventListener('keydown', (event) => {
    body.classList.remove('error');
    var keyValue = event.key;
    if(Array.from(juego.getDiccionario().getCaracteresAdmitidos()).includes(keyValue)){
        llenarCampo(keyValue);
    } else  if(keyValue == 'Backspace'){
        borrarCampo();
    } else if(keyValue == 'Enter'){
        juego.getJugador().setPalabra(cargarPalabra());
        if(juego.getDiccionario().validarExistencia(juego.getJugador().getPalabra())){
            jugar();
        }
    }
  }, false);
//----------------------------------------------------------------------------------
// capturo el target del mouse por si se escribe por teclado en pantalla------------
function botonOnClick(e) {
    body.classList.remove('error');
    let keyValue = e.target.innerHTML.toLowerCase();
    if(Array.from(juego.getDiccionario().getCaracteresAdmitidos()).includes(keyValue)){
        llenarCampo(keyValue);
    } else  if(keyValue == 'del'){
        borrarCampo();
    } else if(keyValue == 'send'){
        juego.getJugador().setPalabra(cargarPalabra());
        if(juego.getDiccionario().validarExistencia(juego.getJugador().getPalabra())){
            jugar();
        }
    }
  }
// agrego el evento click a todos los botones 
  var botones = document.querySelectorAll('button');
  botones.forEach((boton) => {
    boton.addEventListener('click', botonOnClick);
  });
//----------------------------------------------------------------------------------
// pinto botones con el vector de coincidencias -------------------------------------
function pintarBotones(vectorCoincidencia,palabraJugador){
    var botones = document.querySelectorAll('button');
    // coloco los grises
    for(let i = 0; i < vectorCoincidencia.length;i++){
        if(vectorCoincidencia[i] == coincidencias.NINGUNA){
            botones.forEach((boton) => {
                let keyValue = boton.textContent.toLocaleLowerCase();
                if (keyValue == palabraJugador[i] ){
                    if((boton.style.backgroundColor != 'rgb(127, 127, 53)') && (boton.style.backgroundColor != 'green') ){
                        boton.style.backgroundColor = 'gray';
                        boton.style.color = 'white';
                    }
                }
              });
        }
    }
    //coloco los amarillos
    for(let i = 0; i < vectorCoincidencia.length;i++){
        if(vectorCoincidencia[i] == coincidencias.EXISTE){
            botones.forEach((boton) => {
                let keyValue = boton.textContent.toLocaleLowerCase();
                if (keyValue == palabraJugador[i] ){
                    if((boton.style.backgroundColor != 'green')){
                        boton.style.backgroundColor = 'rgb(127, 127, 53)';
                        boton.style.color = 'white';
                    }
                }
              });
        }
    }
    //coloco los verdes
    for(let i = 0; i < vectorCoincidencia.length;i++){
        if(vectorCoincidencia[i] == coincidencias.EXISTEYLUGAR){
            botones.forEach((boton) => {
                let keyValue = boton.textContent.toLocaleLowerCase();
                if (keyValue == palabraJugador[i] ){
                    boton.style.backgroundColor = 'green';
                    boton.style.color = 'white';
                }
                });
        }
    }
}
// -------------------------------------------------------
// cargar datos desde el localStorage al modal estadistica
function cargarDatosAlModalEstadisticas(){
    let historial = registroLocalStorage.obtenerDatos();
    let ganados = 0;
    let perdidos = 0;
    let totales = 0;
    let pganados = document.getElementById('pganados');
    let pperdidas = document.getElementById('pperdidas');
    let ptotales = document.getElementById('ptotales');
    let wrate= document.getElementById('wrate');
    let lrate= document.getElementById('lrate');

    // palabraSecreta : this.partidaCompleta.getPalabraSecreta(),
    // vectorCoincidencia : this.partidaCompleta.palabraSecreta.devolverCoincidencias(this.partidaCompleta.getJugador().getUltimaPalabra()),
    // condicionDeJugador : this.partidaCompleta.getJugador().getEstado(),


    if(historial != false){
        for(let i = 0; i<historial.length; i++){
            totales++;
            if(historial[i].condicionDeJugador == condicionDeJugador.GANO){
                ganados++;
            } else {
                perdidos++
            }
        }
    }
    pganados.textContent = ganados;
    pperdidas.textContent = perdidos;
    ptotales.textContent = totales;
    if(historial){
        wrate.textContent = ((ganados / totales) * 100).toFixed(2) + ' %';
        lrate.textContent = ((perdidos / totales) * 100).toFixed(2) + ' %';
    } else {
        wrate.textContent ='0 %';
        lrate.textContent ='0 %';
    }


    var cont = 1;
    for(let i = historial.length -1 ; i >= 0; i-- ){
        if(cont > 3 ){
            break;
        } else{
            let titulo = historial[i].palabraSecreta.toString().replaceAll(",","");
            let titulop = document.getElementById('p'+cont);
            let href = document.getElementById("href"+cont);
            let vectorCoincidencia = historial[i].vectorCoincidencia;
            let barraDeProgreso = document.getElementById('barraProgreso'+cont);
            barraDeProgreso.style.width = calcularPorcentajeProgreso(vectorCoincidencia)+'%';
            href.setAttribute('href',"https://dle.rae.es/"+titulo); 
            titulop.textContent = titulo;
        }
        cont ++;
    }

}
function calcularPorcentajeProgreso(v){

    var existe = 0;

    for(let i = 0; i < v.length; i++){
        if(v[i] == coincidencias.EXISTEYLUGAR){
            existe++
        }
    }

    return Math.round((existe / 6) * 100);
}
// animaciones --------------------------------------------------------------
function animacionPerdio(){
    body.classList.add('error');
}