document.addEventListener('DOMContentLoaded', () => {
    showAllProducts(productos);
});

var listaCarrito = [];

function agregarAlCarrito(boton) {
    let parentElement = boton.parentElement;
    let producto = {
        nombre: parentElement.querySelector("#nombre").textContent.trim(),
        cantidad: parseInt(parentElement.querySelector("#cantidad").value),
        imgUrl:  parentElement.parentElement.querySelector("img").src,
        precioUnitario: parseFloat(parentElement.querySelector("#precio").textContent),
    };

    if (producto.cantidad <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
    }
    if (!actualizarCarrito(producto.nombre, producto.cantidad)) listaCarrito.push(producto);
    mostrarDatosProducto();
    sumarTotal();
}


function mostrarDatosProducto() {
    const contenedor = document.getElementById('datosProducto');
    contenedor.innerHTML = ""; // Limpiar contenido previo
    listaCarrito.forEach((dato, index) => {
        contenedor.innerHTML += `
            <div>
                <h6>${dato.nombre}</h6> 
                <span class="precio-unitario-chart"> ${dato.precioUnitario}€ </span> <br>
            
                Cant: <input type="number" class="form-control form-control-sm mb-2" id="cantidad" value="${dato.cantidad}" min="1" onclick="actualizarPrecio(this)"/>
                <br> Subtotal:<span id="precio-unitario-carrito"> ${dato.cantidad * dato.precioUnitario}</span>€ 
            </div>
            <hr>
        `;
    });
}

function actualizarPrecio(inputField) {
    let parentElement = inputField.parentElement;
    let productoActualizar = parentElement.querySelector("h6").textContent;
    let nuevaCantidad = parseFloat(inputField.value);
    actualizarCarrito(productoActualizar, nuevaCantidad);
    mostrarDatosProducto();
    sumarTotal();
}

function actualizarCarrito(nombreProducto, nuevaCantidad) {
    let chartUpdated = false;
    listaCarrito.forEach((item) => {
        console.log(nombreProducto + "vs" + item.nombre);
        if (item.nombre == nombreProducto) {
            item.cantidad = nuevaCantidad;
            item.precioTotal = nuevaCantidad * item.precioUnitario;
            chartUpdated= true;
            console.log("Actualizando carrito function " + item.nombre + " a " + item.cantidad + " unidades");
        }
    });
    return chartUpdated;
}

function sumarTotal() {
    const precioTotal = document.getElementById('precio-total-carrito'); 
    const cantidadTotal = document.getElementById('cantidad-total-carrito');
    let sumaPrecioTotal = 0;
    let sumaCantidadTotal = 0;
    listaCarrito.forEach((dato) => {
        sumaPrecioTotal +=  dato.cantidad * dato.precioUnitario;
        sumaCantidadTotal += dato.cantidad;
    });
    precioTotal.textContent = sumaPrecioTotal;
    cantidadTotal.textContent = sumaCantidadTotal;
    return {
        sumaPrecioTotal: sumaPrecioTotal,
        sumaCantidadTotal: sumaCantidadTotal
    };
}

function comprarAhora() {
    let totales = sumarTotal();
    const layout1 = document.getElementById('layout-1');
    const layout2 = document.getElementById('layout-2');
    const textoConfirmacion = document.getElementById('texto-confirmacion');
    textoConfirmacion.textContent = `Tu pedido de ${totales.sumaCantidadTotal} productos con un importe total de ${totales.sumaPrecioTotal}€ se ha procesado con éxito .`;
    layout2.style.display = 'block';
    layout1.style.display = 'none';
}

function seguirComprando() {
    document.getElementById('layout-1').style.display = 'block';
    document.getElementById('layout-2').style.display = 'none';
}

function eliminarProducto() {
    listaCarrito.pop();
    mostrarDatosProducto()
    sumarTotal();
}

function showDetail(button){
    document.getElementById('main-store').style.display = 'none';
    const productDetail = document.getElementById('product-detail');
    productDetail.style.display = 'block';
    const parentElement = button.parentElement;
    let selectedProduct = parentElement.querySelector("#nombre").textContent.trim();
    productos.forEach(item => {
        if (item.nombre == parentElement.querySelector("#nombre").textContent.trim()) {
            selectedProduct = item;
            console.log("Encontrado: " + selectedProduct);
        }
    });

    newDiv = document.createElement('div');
    newDiv.classList.add('row');

    colButton = document.createElement('div');
    colButton.classList.add('col-md-2');

    colProduct = document.createElement('div');
    colProduct.classList.add('col-md-10');

    colButton.innerHTML = `
        <button type="button" class="btn btn-primary" onclick="showAllProducts()" >
            <span class="material-symbols-outlined">
                arrow_back
            </span>
        </button>
    `;

    colProduct.innerHTML  = `
        <div class="card shadow-sm" >
            <img src="${selectedProduct.imgUrl}" class="card-img-top img-fluid" alt="Imagen ${selectedProduct.nombre}" id="img-detail">
            <div class="card-body">
                <h5 class="card-title fw-bold" id="nombre">${selectedProduct.nombre}</h5>
                <p class="card-text text-muted">${selectedProduct.descripcion}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="card-text"> Precio: <span id="precio">${selectedProduct.precioUnitario}</span>€ </p>
                    <input type="number" class="form-control form-control-sm mb-2" id="cantidad" value="1" min="1"/>
                </div>
            </div>
            <button type="button" class="btn btn-primary w-100 mt-3" onclick="agregarAlCarrito(this)">
                Agregar al carrito
            </button>
        </div>
        `;
    productDetail.innerHTML=``;
    newDiv.appendChild(colButton);
    newDiv.appendChild(colProduct);
    productDetail.appendChild(newDiv);
}


function showAllProducts() {
    document.getElementById('product-detail').style.display = 'none';
    document.getElementById('main-store').style.display = 'block';

    const divResumen = document.getElementById('main-store');
    divResumen.innerHTML = "";

    let rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    productos.forEach(item => {
        let colDiv = document.createElement('div');
        colDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', 'mb-2');
        colDiv.innerHTML = `
            <div class="card">
                <img src="${item.imgUrl}" class="card-img-top" alt="Imagen del producto" onclick="showDetail(this)">
                <div class="card-body">
                    <h5 class="card-title" id="nombre">${item.nombre}</h5>
                    <p class="card-text">Precio: <span id="precio">${item.precioUnitario}</span>€</p>
                    <input type="number" class="form-control form-control-sm mb-2" value="1" min="1" id="cantidad"/>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(this)">Añadir</button>
                </div>
            </div>
        `;

        rowDiv.appendChild(colDiv);
    });
    divResumen.appendChild(rowDiv);
}

// Normalmente haríamos una lectura de un JSON o de la BBDD. Pero para entregarlo todo en un solo archivo, lo guardamos en una variable.
const productos = [
    {
        "id": 1,
        "nombre": "Reloj",
        "descripcion": "Un reloj perfecto para recordar el ritmo vertiginoso de una vida que no elegiste vivir pero que igualmente te mantiene esclavo del tiempo. ¡Pero no te deprimas! Pues este reloj también te recuerda que cada tik-tak te tendrá un segundo más cerca de la tumba.",
        "precioUnitario": 150.00,
        "imgUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 10
    },
    {
        "id": 2,
        "nombre": "Taburete",
        "descripcion": "¿Para qué necesitamos un asiento cómodo? Este taburete minimalista en gris olvidable nos recuerda que estamos aquí solo para encajar en espacios vacíos y sin alma. Un accesorio esencial para las vidas carentes de personalidad, perfecto para sentarse y contemplar el sinsentido desde lo alto de nuestra falta de originalidad.",
        "precioUnitario": 25.00,
        "imgUrl": "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 10
    },
    {
        "id": 3,
        "nombre": "Auriculares",
        "descripcion": "Aislamiento total del mundo con el sonido de alta fidelidad de estos auriculares, ideales para ignorar todo lo que nos rodea. Porque, realmente, ¿qué es el contacto humano cuando podemos sumergirnos en un mar de notas monocromáticas en un dispositivo hecho para la alienación personal?",
        "precioUnitario": 28.00,
        "imgUrl": "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
        "stock": 10
    },
    {
        "id": 4,
        "nombre": "Gafas",
        "descripcion": "Un accesorio imprescindible para quienes prefieren una visión en blanco y negro de la vida. Estas gafas de sol, un símbolo de protección UV y desapego emocional, filtran más que solo los rayos solares, dejándonos una visión uniforme y sin matices de un mundo donde la individualidad es opcional.",
        "precioUnitario": 80.00,
        "imgUrl": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
        "stock": 10
    },
    {
        "id": 5,
        "nombre": "Cámara",
        "descripcion": "Esta cámara DSLR de alta resolución captura cada detalle, pero sin revelar lo que realmente importa. Ideal para documentar momentos fugaces en blanco y negro, perfectos para alimentar la colección infinita de recuerdos impersonalizados y compartidos. Fotografía sin alma, para un mundo igual de apagado.",
        "precioUnitario": 1200.00,
        "imgUrl": "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=500&auto=format&fit=crop&q=60",
        "stock": 8
    },
    {
        "id": 6,
        "nombre": "Laptop",
        "descripcion": "El ultraligero portal al universo digital donde cada interacción es impersonal y sin alma. Con alto rendimiento para maximizar nuestra productividad vacía y nuestras horas de desconexión emocional. Todo en monocromo porque, después de todo, las computadoras no necesitan color.",
        "precioUnitario": 950.00,
        "imgUrl": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 15
    },
    {
        "id": 7,
        "nombre": "Botella de agua",
        "descripcion": "Perfecta para mantener tu agua tan fría e impersonal como tus interacciones diarias. Esta botella de acero inoxidable es ideal para quienes ven la hidratación como una obligación más en la interminable lista de tareas del día. No importa el color, porque el agua sabe igual en blanco o negro.",
        "precioUnitario": 9.99,
        "imgUrl": "https://images.unsplash.com/photo-1631201553014-776760c89381?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym90ZWxsYXxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 50
    },
    {
        "id": 8,
        "nombre": "Altavoz Bluetooth",
        "descripcion": "Porque el sonido ya no necesita presencia ni conexión emocional, solo decibeles. Este altavoz portátil convierte tu vida en un eco monótono, sin color ni distinción. Larga duración para acompañarte en tu viaje por la alienación en estéreo.",
        "precioUnitario": 60.00,
        "imgUrl": "https://plus.unsplash.com/premium_photo-1683141496040-eeef9702269f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 30
    },
    {
        "id": 9,
        "nombre": "Lámpara de escritorio",
        "descripcion": "Una fuente de luz LED que ilumina sin añadir matices. Su cuello flexible permite adaptarse a cualquier postura, mientras que su brillo ajustable asegura que nunca escapes de la iluminación fría y artificial, perfecta para las largas noches de trabajo sin propósito.",
        "precioUnitario": 25.00,
        "imgUrl": "https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFtcGFyYXxlbnwwfHwwfHx8MA%3D%3D",
        "stock": 20
    },
    {
        "id": 10,
        "nombre": "Zapatillas deportivas",
        "descripcion": "Ligeras y funcionales, ideales para correr sin dirección ni propósito. Estas zapatillas son el calzado perfecto para quienes prefieren un entrenamiento diario que los mantenga ocupados en el laberinto monocromático del conformismo social.",
        "precioUnitario": 85.00,
        "imgUrl": "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbnZlcnNlfGVufDB8fDB8fHww",
        "stock": 25
    }
]