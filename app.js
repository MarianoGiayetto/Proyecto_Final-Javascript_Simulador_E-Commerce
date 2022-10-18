// Simulador de E-Commerce de productos para limpieza de autos //

// Declaro mis variables

// Lugar donde voy a mostrar mis productos en el HTML
const contenedorProductos = document.getElementById('contenedor-productos')
// Lugar donde se va a mostrar el contenido de mi carrito
const items = document.getElementById('items')
// Footer del contenido del carrito
const footer = document.getElementById('footer-carrito')
// Lugar donde se va a mostrar el resumen de la compra
const itemsFinalizar = document.getElementById('items-finalizar')
// Footer del resumen final de la compra
const footerFinalizar = document.getElementById('footer-finalizar')
// Número contador de productos del carrito
const badge = document.getElementById('badge')

// Plantillas Template de HTML a utilizar
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const templateBadge = document.getElementById('template-badge').content
const templateFinalizar = document.getElementById('template-finalizar').content
const templateFooterFinalizar = document.getElementById('template-footer-finalizar').content

// Declaro mi objeto carrito y array listado vacíos
let carrito = {} 
let listado = []

// Declaro y llamo luego a la función que obtiene los datos del archivo local data.json
function fetchProductos(){
  fetch('./data.json')
    .then( (res) => res.json())
    .then( (data) => {
      listado = data
      mostrarProductos(listado)
    })
}

fetchProductos()


// Escucho "clicks" en el listado de productos del carrito
items.addEventListener('click', e =>{
  btnAccion(e)
})  

// Dibujo mis tarjetas de productos
function mostrarProductos (productos) { 
    productos.forEach((producto)=>{
      templateCard.querySelector('h5').textContent = producto.nombre
      templateCard.querySelector('span').textContent = producto.precio
      templateCard.querySelector('img').setAttribute("src", producto.img)
      templateCard.querySelector(".btn-primary").dataset.id = producto.id
      const clone = templateCard.cloneNode(true)
      contenedorProductos.appendChild(clone)
  })
}

// Escucho "clicks" en el contenedor de productos
contenedorProductos.addEventListener('click', e =>{
  addCarrito(e)
})

// Reviso si el evento click se dá en el botón con la clase "btn-primary" y enviamos toda la info de nuestro producto
// al carrito
const addCarrito = e =>{
  if(e.target.classList.contains('btn-primary')){      
    enviarAlCarrito(e.target.parentElement)
  }
}

// Agrego el objeto al carrito creándolo con las propiedades del template-card (sin imagen)
// Le agrego además la propiedad cantidad y la igualo a 1
const enviarAlCarrito = objeto =>{
  const producto = {
    id: objeto.querySelector('.btn-primary').dataset.id,
    nombre: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('span').textContent,
    cantidad: 1,
  }
  Toastify({
    text: `"${producto.nombre}" se ha agregado al carrito`,    
    duration: 3000,
    gravity: "bottom",    
    style: {
      background: "linear-gradient(to right, #309c05, #73b109",
    }
    
    }).showToast();

// Reviso si ya existe el producto en el carrito e incremento su cantidad si ya existe 
// y lo muestro en el carrito
  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad= carrito[producto.id].cantidad + 1
  }
  carrito[producto.id] = {...producto}
  mostrarCarrito()
}

// Creo una función para mostrar el carrito
const mostrarCarrito = () =>{
  items.innerHTML = ''
// Obtengo un array de los valores de las propiedades del producto y los dibujo en el template carrito  
  Object.values(carrito).forEach(producto =>{
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.agregar').dataset.id = producto.id
    templateCarrito.querySelector('.quitar').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = producto.cantidad*producto.precio
    const clone = templateCarrito.cloneNode(true)
    items.appendChild(clone)
  })
  mostrarFooter()
  mostrarBadge()

  
// Agrego el carrito al Local Storage
  localStorage.setItem ('Carrito', JSON.stringify(carrito))


  // Escucho el botón Finalizar Compra
  const btnFinalizar = document.getElementById('finalizar')
  // Si el carrito está vacío deshabilito el botón Finalizar
    Object.keys(carrito).length === 0 ? btnFinalizar.className = 'btn btn-success disabled'
      : btnFinalizar.className = 'btn btn-success';
        
  btnFinalizar.addEventListener('click', ()=>{
    mostrarFinalizar()
    mostrarFooterFinalizar()
  })
}

// Creo una función que muestre el footer del carrito
const mostrarFooter = () =>{  
  footer.innerHTML = ''
// Me fijo si el carrito está vacío para modificar o no el footer del carrito
  if (Object.keys(carrito).length === 0){
    footer.innerHTML= `<th scope="row">Carrito vacío</th>`
  }
// Con el método reduce obtengo las cantidades y precios totales para mostrarlos luego en el footer del carrito 
  const totalCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0);
  const totalPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0);
  
  templateFooter.querySelectorAll('td')[0].textContent = totalCantidad
  templateFooter.querySelector('span').textContent = totalPrecio
  const clone = templateFooter.cloneNode(true)
  footer.appendChild(clone)
  
// Vaciar el carrito
  const btnVaciar = document.getElementById("vaciar-carrito")
  Object.keys(carrito).length === 0 ? btnVaciar.className = 'btn btn-danger disabled'
  : btnVaciar.className = 'btn btn-danger';
  btnVaciar. addEventListener('click', ()=>{
    carrito = {}
    Toastify({
      text: `Se ha vaciado con éxito el carrito`,    
      duration: 2000,
      gravity: "top",
      position: "center",    
      style: {
        background: "tomato"
      }
      
      }).showToast();
    mostrarCarrito();
    
  })
}

// Función para mostrar el número del carrito
const mostrarBadge = ()=>{
  badge.innerHTML=''
  const totalCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0);
  templateBadge.querySelector('span').textContent = totalCantidad
  const clone = templateBadge.cloneNode(true)
  badge.appendChild(clone)
}

// Agrego o quito productos de acuerdo al botón que se clickee en el carrito
const btnAccion = e =>{
  if (e.target.classList.contains('agregar')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
    carrito[e.target.dataset.id] = {...producto}
    mostrarCarrito()
  }
  if (e.target.classList.contains('quitar')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    producto.cantidad === 0 ? delete carrito[e.target.dataset.id]:carrito[e.target.dataset.id] = {...producto}      
    }
    mostrarCarrito()
  }


// Si en el LocalStorage existe el Key "Carrito", obtengo los datos del mismo convirtiéndolos para JS 
if (localStorage.getItem('Carrito')){
  carrito = JSON.parse(localStorage.getItem('Carrito'))
  mostrarCarrito()
}

// Buscador
let searchFormulario = document.getElementById('formulario')
searchFormulario.addEventListener("submit", buscar)
function buscar(e){
  contenedorProductos.innerHTML=''
  e.preventDefault();
  const texto = e.target.children[0].value.toLowerCase() 
  const resultado = listado.filter((el)=>el.nombre.toLowerCase().includes(texto))
  mostrarProductos(resultado)  
}

// Función para filtrar objetos según categoría con los inputs de tipo radio
const radios = document.querySelectorAll('.form-check-input')
radios.forEach((radio)=>{
  radio.addEventListener('change', e=>{
    contenedorProductos.innerHTML=''
    if (e.target.value == "option1"){      
      mostrarProductos(listado)
    } else if (e.target.value == "option2"){
      const shampoos = listado.filter((el)=> el.categoria.includes('shampoo'))
      mostrarProductos(shampoos)
    } else if (e.target.value == "option3"){
      const ceras = listado.filter((el)=> el.categoria.includes('cera'))
      mostrarProductos(ceras)
    }else if (e.target.value == "option4"){
      const cepillos = listado.filter((el)=> el.categoria.includes('cepillo'))
      mostrarProductos(cepillos) 
    }else if (e.target.value == "option5"){
      const microfibras = listado.filter((el)=> el.categoria.includes('micros'))
      mostrarProductos(microfibras) 
    }
  })
})


// Función que va a mostrar el resumen final de la compra
const mostrarFinalizar = () =>{
  itemsFinalizar.innerHTML = ''
  Object.values(carrito).forEach(producto =>{
    templateFinalizar.querySelectorAll('td')[0].textContent = producto.nombre
    templateFinalizar.querySelectorAll('td')[1].textContent = producto.cantidad
    templateFinalizar.querySelector('span').textContent = producto.cantidad*producto.precio
    const clone = templateFinalizar.cloneNode(true)
    itemsFinalizar.appendChild(clone)
    mostrarFooterFinalizar()    
  })  
}

// Función que va a mostrar el footer del resumen final de la compra
const mostrarFooterFinalizar = () =>{  
    footerFinalizar.innerHTML = ''
    const totalCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0);
    const totalPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0);
    templateFooterFinalizar.querySelectorAll('td')[0].textContent = totalCantidad
    templateFooterFinalizar.querySelector('span').textContent = totalPrecio
    const clone = templateFooterFinalizar.cloneNode(true)
    footerFinalizar.appendChild(clone)     
}

// Capturo la info de los inputs del formulario del resumen de la compra para mostrarlos en un Alert
let formularioCompra = document.getElementById('formulario-compra')
formularioCompra.addEventListener("submit", comprar)
function comprar(e){
  e.preventDefault();
  const nombre = e.target.children[1].children[1].value
  const apellido = e.target.children[2].children[1].value
  const mail = e.target.children[3].children[1].value.toLowerCase()
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: `Muchas gracias por su compra: ${nombre} ${apellido}.\n
    Pronto le enviaremos el resto de las instrucciones para continuar con su compra al mail:\n ${mail}`,
    timer: 7000,
    timerProgressBar: true,
    html: 'La ventana se cerrará en <b></b> segundos',
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
      const modalResumen=document.getElementById('exampleModal2')
      const modal = bootstrap.Modal.getInstance(modalResumen)
      modal.hide()
    }
  })    
  carrito = {}  
  mostrarCarrito()

}