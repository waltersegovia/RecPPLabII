var http = new XMLHttpRequest(); 
var trClick;

window.onload = function(){  
        
        var modificar = document.getElementById("btnModificar");
        modificar.onclick = ejecutarPost;

        http.onreadystatechange = callback;
        http.open("GET","http://localhost:3000/autos",true);
        http.send();    
}

function callback(){
        if (http.status==200 && http.readyState==4) {
            armarGrilla(JSON.parse(http.responseText));
        }
}
//Armo tablas
function armarGrilla(jsonObj){
  

    var tbody = document.getElementById("tbody");
    var autos = jsonObj; 
    
    for (var i = 0; i < autos.length; i++){    
       //Creo la fila
       var tr = document.createElement("tr");
       //Creo las colunmnas
       var td4 = document.createElement("td");  
       var nodoText4 = document.createTextNode(autos[i].id);    
       td4.appendChild(nodoText4);
       tr.appendChild(td4);

       var td = document.createElement("td");  
       var nodoText = document.createTextNode(autos[i].make);      
       td.appendChild(nodoText);
       td4.style.display="none";
       tr.appendChild(td);

       var td1 = document.createElement("td");  
       var nodoText1 = document.createTextNode(autos[i].model);      
       td1.appendChild(nodoText1);
       tr.appendChild(td1);
       
       // Creo el Año 
       var td2 = document.createElement("td");  
       var datoYear = autos[i].year;
       console.log(datoYear);
       var select = createSelect();
       select.value = datoYear;
       td2.appendChild(select);
    
       tr.appendChild(td2);

       // Creo la Fila 

       tr.addEventListener("change",obtenerDatosFila);
       tbody.appendChild(tr);
    }     
} 


function createSelect() {

    var select = document.createElement('select');
    select.setAttribute('class', "selectTable");

    for (var i = 2000; i <= 2020; i++) {
        option = document.createElement("option");
        option.setAttribute("value", i);
        var texto = document.createTextNode(i);
        option.appendChild(texto);
        select.appendChild(option);
    }
    return select;
}

function obtenerDatosFila(tr) {
    nuevoAño = {
        "id": tr.children[0].textContent,
        "year": tr.children[3].children[0].value
    }
    modificarAño(nuevoAño);
}

function modificarAño(nuevoAño) {
    var url = "http://localhost:3000/editarYear";
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(nuevoAño));
    xhr.onreadystatechange = manejadorRespuesta2;
}

function manejadorRespuesta2() {

    if (xhr.readyState == 4) {

        if (xhr.status == 200) {
            var respuesta = JSON.parse(xhr.responseText);
            if (respuesta.type == "ok") {

                if (nuevoAño  != null) {
                    cambiarFila(nuevoAño);
                }
            }
        }
    }
}

function cambiarFila(nuevoAño) {
    document.querySelectorAll('tr').forEach(function (value, index) {
        if (value.children[0].textContent == nuevoAño.id) {
            value.children[3].children[0].value = nuevoAño.year;
        }
    });
}

function clickGrilla(event){

    var contAgregar = document.getElementById("contAgregar");
    var btn = document.getElementById("btn");

    btn.hidden = true;
    contAgregar.hidden = false;
    
    trClick = event.target.parentNode; 
    /********  *********/
    document.getElementById("id").value = trClick.childNodes[0].innerHTML;
    document.getElementById("year").value = trClick.childNodes[3].innerHTML;
     
}

function ejecutarPost(){

    var httpPost = new XMLHttpRequest();
    var makeString = document.getElementById("make").value;
    var modelString = document.getElementById("model").value;
    var yearString = document.getElementById("year").value;

    //Validación de Datos
    if(makeString == "" || makeString.length < 3){
        document.getElementById("make").className="error";
        alert("Obligatorio / minimo 3 caracteres");
        return ;
    }
    else {
        document.getElementById("make").className="sinError";
    }

    if(modelString == "" || modelString.length < 3){
        document.getElementById("model").className="error";
        alert("Obligatorio / minimo 3 caracteres");
        return ;
    }
    else {
        document.getElementById("model").className="sinError";
    }

    httpPost.onreadystatechange=function(){

        var makeString = document.getElementById("make").value;
        var modelString = document.getElementById("model").value;
        var yearString = document.getElementById("year").value;

        if(httpPost.readyState == 4 && httpPost.status == 200){
                alert(httpPost.responseText);
                
                var coche = JSON.parse(http.responseText);
                var tbody = document.getElementById("tbody");

                //Creo la fila
                var tr = document.createElement("tr");
                //Creamos las colunmnas
                var td4 = document.createElement("td");  
                var nodoText4 = document.createTextNode(coche[0].id);    
                td4.appendChild(nodoText4);
                tr.appendChild(td4);

                var td = document.createElement("td");  
                var nodoText = document.createTextNode(coche[1].make);      
                td.appendChild(nodoText);
                td4.style.display="none";
                tr.appendChild(td);

                var td1 = document.createElement("td");  
                var nodoText1 = document.createTextNode(coche[2].model);      
                td1.appendChild(nodoText1);
                tr.appendChild(td1);

                var td2 = document.createElement("td");  
                var nodoText2 = document.createTextNode(coche[3].year);      
                td2.appendChild(nodoText2);
                tr.appendChild(td2);

                tr.addEventListener("change",obtenerDatosFila);
                tbody.appendChild(tr);

                //act screen
                document.getElementById("contenedor_carga").hidden = true;  
                
            }  
    }

    httpPost.open("POST","http://localhost:3000/nuevoAuto",true);
    httpPost.setRequestHeader("Content-Type","application/json");
    var json = {"make":makeString,"model":modelString,"year":yearString};
    httpPost.send(JSON.stringify(json));    

    document.getElementById("contenedor_carga").hidden = false;
        
    cerrar();
}

function eliminar(){
    var httpPost = new XMLHttpRequest();

    var id = document.getElementById("id").value;
    
    httpPost.onreadystatechange=function(){
        if(httpPost.readyState == 4 && httpPost.status == 200){
            alert(httpPost.responseText);
            if(JSON.parse(httpPost.responseText).type=="ok"){
                trClick.remove();
            }else{
                alert("Error al Eliminar !!!");
            }
            
            document.getElementById("contenedor_carga").hidden = true;
        }
    }
    httpPost.open("POST","http://localhost:3000/editarYear",true);
    httpPost.setRequestHeader("Content-Type","application/json");
    var json = {"id":id};
    httpPost.send(JSON.stringify(json));  
    document.getElementById("contenedor_carga").hidden = false;  
    cerrar();
}

function abrir(){
    var contAgregar = document.getElementById("contAgregar");
    var btn = document.getElementById("btn");

    btn.hidden = true;
    contAgregar.hidden = false;
}

function cerrar(){
    var contAgregar = document.getElementById("contAgregar");
    var btn = document.getElementById("btn");
    
    btn.hidden = false;
    contAgregar.hidden = true;
    
}
