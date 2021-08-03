let pagina = 1;

const turno = {
  nombre: "",
  fecha: "",
  hora: "",
  servicio: [],
  telefono: ""
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
function iniciarApp() {
  mostrarServicios();
  //resalta el div actual segun el tab  al que se presiona
  mostrarSeccion();

  //Oculta o muestra una seccion segun el tab al que se presiona
  cambiarSeccion();
  //paginacion pagina siguiente y anterior
  paginaSiguiente();
  paginaAnterior();

  //comprueba la pagina actual para mostrar o ocultar la pagina siguiente
  botonesPaginador();

  //muestra el resumen del turno o mensaje de error en caso de no pasar la validacion
  mostrarResumen();
  // guarda el nombre y los datos del turno
  nombreTurno();
  //almacena la cita de la fecha en el objeto
  fechaTurno();
  //desahabilita fechas pasadas
  desahabilitarfechasAnteriores();
  //almancena el numero de telefono del cliente
  numTelefono();
  //guarda la hora del turno
  horaTurno();
}
function mostrarSeccion() {
  //Elminar  mostrar-seccion de la seccion anterior
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar-seccion");
  }
  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");
  //resalta la seccion actual
  const tabAnterior = document.querySelector(".tabs .actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
    //llamar la funcion de mostrar seccion
    mostrarSeccion();
  }

  //agrega mostrar seccion donde dimos click

  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add("actual");
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });
  });
}
async function mostrarServicios() {
  try {
    const resultado = await fetch("./servicios.json");
    const db = await resultado.json();
    const { servicios } = db;
    //generar HTML
    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;
      //DOM scripting
      //generar nombre del servicio
      const nombreServicio = document.createElement("P");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      //generar precio del servicio
      const precioServicio = document.createElement("P");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      const idServicio = document.createElement("p");
      idServicio.textContent = id;
      idServicio.classList.add("idServicio");

      //generar el div del servicio
      const servicioDiv = document.createElement("div");
      servicioDiv.classList.add("servicioDiv");
      servicioDiv.dataset.idServicio = id;
      //Se marca cuando pickeas un servicio
      servicioDiv.onclick = seleccionarServicio;

      //inyectar precio y nombre al div del servicio
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);
      //volcandolo en el HTML
      document.querySelector("#servicios").appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}
function seleccionarServicio(e) {
  let elemento;
  if (e.target.tagname === "P") {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }
  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");
    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");
    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent,
    };
    //console.log(servicioObj);
    agregarServicio(servicioObj);
  }
}
function eliminarServicio(id) {
  const { servicio } = turno;
  turno.servicio = servicio.filter((servicio) => servicio.id !== id);
}
function agregarServicio(servicioObj) {
  const { servicio } = turno;
  turno.servicio = [...servicio, servicioObj];
  
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++;
    console.log(pagina);
    botonesPaginador();
  });
}
function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;
    console.log(pagina);
    botonesPaginador();
  });
}
function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");
  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");
    mostrarResumen(); // si estamos en la pagina 3 carga el resumen
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSeccion();
}
function mostrarResumen() {
  const { nombre, fecha, hora, servicio ,telefono } = turno;
  const resumenDiv = document.querySelector(".contenido-resumen");
  //limpia el html previo
  while (resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  }

  if (Object.values(turno).includes("")) {
    const noServicios = document.createElement("P");
    noServicios.textContent ="Faltan datos de nombre ,fecha , hora o servicios";
    noServicios.classList.add("invalidar-cita");
    //resumenDIv
    resumenDiv.appendChild(noServicios);
    return;
  }
  //mostrar el resumen
  const nombreTurno = document.createElement("P");
  const turnoFecha = document.createElement("P");
  const horaTurno = document.createElement("P");
  const servTurno = document.createElement("P");
  const textoTel = document.createElement("P");

  nombreTurno.innerHTML = `<span>Nombre:</span> ${nombre}`;
  turnoFecha.innerHTML = `<span>fecha:</span> ${fecha}`;
  servTurno.innerHTML = `<span>Servicio:</span>${servicio}`;
  horaTurno.innerHTML = `<span>Hora:</span> ${hora}`;
  textoTel.innerHTML = `<span>Telefono:</span> ${telefono}`;


  const serviciosTurno = document.createElement('DIV');
  serviciosTurno.classList.add('resumen-servicios')

  resumenDiv.appendChild(nombreTurno);
  resumenDiv.appendChild(turnoFecha);
//iterar sobre cada servicio
let cantidad =0;
servicio.forEach(servicios=>{
 const  {nombre,precio} = servicios ;
 const {telefono}= turno ;
const contenedorServicio =document.createElement('DIV') ; 
contenedorServicio.classList.add('contenedor-servicio') ;
const textoTel=document.createElement('P')
textoTel.textContent=telefono;

const textoServicio=document.createElement('P')
textoServicio.textContent=nombre;

const precioServicio=document.createElement('P')
precioServicio.textContent=precio;
precioServicio.classList.add('precio')
const totalServicio = precio.split('$')
//console.log(parseInt(totalServicio[1].trim()));
cantidad+=parseInt(totalServicio[1].trim())
// colocar texto y precio en el div
contenedorServicio.appendChild(textoServicio);
contenedorServicio.appendChild(precioServicio);
serviciosTurno.appendChild(contenedorServicio);

})
resumenDiv.appendChild(nombreTurno);
resumenDiv.appendChild(turnoFecha);
resumenDiv.appendChild(horaTurno);
resumenDiv.appendChild(textoTel);
resumenDiv.appendChild(serviciosTurno);
const totalApagar= document.createElement('P')
totalApagar.classList.add('total')
totalApagar.innerHTML=`<span> Total a pagar :</span> $ ${cantidad} `
resumenDiv.appendChild(totalApagar)
}
function nombreTurno() {
  const nombreInput = document.querySelector("#nombre");
  nombreInput.addEventListener("input", (e) => {
    let nombreTexto = e.target.value.trim();
    if (nombreTexto === "" || nombreTexto.length < 2) {
      mostrarAlerta("Nombre no valido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      turno.nombre = nombreTexto;
    }
  });
}

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement("DIV");
  const alertaAnterior = document.querySelector(".alerta");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  //si ya hay una alerta entonces que no se sigan acumulando
  if (alertaAnterior) {
    return;
  }
  if (tipo === "error") {
    alerta.classList.add("error");
  }
  const formulario = document.querySelector(".formulario");
  formulario.appendChild(alerta);
  //eliminar alerta despues de cierto tiempo
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
function fechaTurno() {
  const fechaInput = document.querySelector("#fecha");
  fecha.addEventListener("input", (evento) => {
    const dia = new Date(evento.target.value).getUTCDay();
    if ([0].includes(dia)) {
      evento.preventDefault();
      fechaInput.value = "";
      mostrarAlerta("Domingo no es un dia valido", "error");
    } else {
      turno.fecha = fechaInput.value;
      console.log(turno);
    }
  });
}
function desahabilitarfechasAnteriores() {
  const inputFecha = document.querySelector("#fecha");

  const fechaAhora = new Date();
  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDate() + 1;
  //formato desado DD/MM/AAAA

  const fechaDesahabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${
    dia < 10 ? `0${dia}` : dia
  }`;
  inputFecha.min = fechaDesahabilitar;
}
function numTelefono() {
  const nombreInput = document.querySelector("#telefono");
  nombreInput.addEventListener("input", (e) => {
    let tel = parseInt(e.target.value);
    if (isNaN(tel == true)) {
      mostrarAlerta("Numero no valido");
    } else {
      turno.telefono = tel;
    }
  });
}
function horaTurno() {
  const horaInput = document.querySelector("#hora");
  horaInput.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":");
    if (hora[0] < 8 || hora[0] > 18) {
      mostrarAlerta("Hora no valida , por favor elija otra", "error");
    } else {
      turno.hora = horaCita;
    }
  });
}
