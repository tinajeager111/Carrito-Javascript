//1-definir variable o crear selectores
//se define con const para que mantenga su valor



const carrito = document.querySelector('#carrito');  //para id importante el numeral
//const carrito = document.querySelector('.nombreclaseCSS'); para css, importante el punto
//const carrito = document.querySelector('#carrito'); llama etiquetas de html

//console.log(carrito)


const listaCursos = document.querySelector('#lista-cursos');

const contenedorCarrito = document.querySelector('#lista-carrito tbody')

const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

//2- saber la estructura donde vamos a guardar 

let articulosCarrito =  [];

//3-definir los eventos (un evento puede ser input o un click, son cosas que debemos identificar)
//para identificar estos se usan funciones

cargarEventListener();
function cargarEventListener(){
    //click al boton de agregar carrito
    listaCursos.addEventListener('click',agregarCurso); //en los parametros definimos una funcion nueva para este evento

    carrito.addEventListener('click', eliminarCurso);

    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)
    
    /*()=>{
        articulosCarrito = [];
    });*/
 
    

}

//definir las funciones a utilizar
 
function agregarCurso(e){  //e captura el evento cuando se hace click

    e.preventDefault();  //se le agrega al boton para evitar el bug del salto 

    // console.log('ingreso a la funcion')

   // console.log(e.target.classList.contains ('agregar-carrito')) muestra la etiqueta sobre la que se hace click, el classList muestra los espacios donde esta la clase que se esta apuntando, no todo elbloque
                                                                //luego de posicionarnos ponemos la funcion de agregar al carrito 
        if(e.target.classList.contains('agregar-carrito')){
            //console.log('boton')

            const curso = e.target.parentElement.parentElement; //devuelve el elemento principal del elemento especificado . 
           // console.log(curso)

           leerDatoCurso(curso);
            //console.log('no es boton')
        }
    
        sincronizarLocalStorage();
        
    }                                                                 

function leerDatoCurso(curso){
    const infoCurso = {  //esto es lo que se define como un objeto
        imagen: curso.querySelector('img').src, //el source para la ruta de la imagen
        titulo: curso.querySelector('h4').textContent,  //textContent para el texto de una etiqueta 
        precio: curso.querySelector('.precio span').textContent,  //aqui habia una etiqueta dentro de otra
        id: curso.querySelector('a').getAttribute('data-id'),   //si queremoos posicionarnos en el data id, se considera atributo
        cantidad:1
    }

    //siguiente paso es aumentar la cantidad si se agrega otra vez

    if(articulosCarrito.some(curso => curso.id === infoCurso.id)){ //se le agrega un identificador, para el data id de diferentes cursos
       //si es verdad se crea una variable para no perder todo lo que ya se tiene
        const cursos = articulosCarrito.map(curso =>{
            if (curso.id === infoCurso.id){
                curso.cantidad++; //y si es verdad se aumenta la cantidad a 1
                return curso;  
            }
            
            else {
                return curso;  //si es falso se le retorna el curso sin ninguna modificacion
            }
        } )
       
        articulosCarrito = [... cursos] //sustituimos la cantidad anterior si se agrega otro 

        
    } 
    else{
        articulosCarrito = [...articulosCarrito, infoCurso] //los tres puntos hacen un duplicado para no perder la estructura
    }


    //console.log(articulosCarrito);
    //some permite agregar una condicion boolean

    //donde se van a mostrar los cursos? hay que crear una nueva funcion
    carritoHTML();
}


function carritoHTML(){
    vaciarCarrito();
    articulosCarrito.forEach(cursos => { //cada vez que se detecte un curso en el arreglo se siguen los siguientes pasos
        const row = document.createElement('tr'); //createElement para generar elementos dentro de html
        //usamos la etiqueta td para crear columnas ordenadas
        row.innerHTML =  ` 
        <td>
            <img src="${cursos.imagen}" width="100">
        </td>

        <td>${cursos.titulo}</td>
        <td>${cursos.precio}</td>
        <td>${cursos.cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${cursos.id}">X</a> 
        </td> 
        
        `//se guarda todo dentro del arreglo
         //al momento de generar elementos en html se deben usar comillas invertidas, otra version es invalida



        contenedorCarrito.appendChild(row); //el  appendchild permite generar nodos (innerhtml)
    
    })
     
    
}

function sincronizarLocalStorage(){
    localStorage.setItem('curso', JSON.stringify(articulosCarrito))
}

function eliminarCurso(e){ //al recibir el evento e procede

    e.preventDefault();
if(e.target.classList.contains('borrar-curso')){
    const cursoId = e.target.getAttribute('data-id'); //estamos guardando el id de cada  curso en una variante
    
    

    const existe = articulosCarrito.some(cursos => cursos.id === cursoId); //si este curso existe dentro del arreglo, usando el some se le pueden asignar condicionales sin necesidad de bucles

    if(existe){
        const cursos = articulosCarrito.map(cursos =>{ //

            if(cursos.cantidad > 1){
            
                if(cursos.id === cursoId){
                    cursos.cantidad--;
                    return cursos; //cada vez que decrementa se le devuelven los cursos restantes
                } else{
                    return cursos;
                }
//basicamente, estamos usanso el map para buscar la cantidad de ese mismo curso que se agrego, si es mayor a 1 le asignamos que al hacer el evento click
//se decremente 1

            }else{
                    // si la cantidad de cursos es =1
                    articulosCarrito = articulosCarrito.filter(cursos => cursos.id !== cursoId)
                    return cursos;
                    
                }
       
            })
        }

    
    }

    carritoHTML(); //despues de el decremento generamos la funcion que pone el curso con los datos
}



function vaciarCarrito(){

    //forma lenta, no es practica para una pagina con muchos elementos debido a la velocidad de la carga
   // contenedorCarrito.innerHTML= ''; tomamos la estructura que creamos en ese espacio y le asignas un vacio 

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
