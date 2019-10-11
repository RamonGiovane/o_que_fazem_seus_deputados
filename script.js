var btn_pesquisar = document.getElementById("btn_pesquisar");
var campo_de_pesquisa = document.getElementById("campo_de_pesquisa");
var lista_deputados = document.getElementById("lista_de_deputados");

btn_pesquisar.onclick = function (){
    alert("oi");
}

var req_lista_deputados = new XMLHttpRequest();
req_lista_deputados.onloadend = function(){
    response = req_lista_deputados.responseText;
    
    listarDeputados(JSON.parse(this.response));
    
}
req_lista_deputados.open('GET', 'https://dadosabertos.camara.leg.br/api/v2/deputados', true)
req_lista_deputados.send();


function listarDeputados(data_json) {

    /*Temporary shit*/
    lista_deputados.appendChild(document.createElement("br"));
    lista_deputados.appendChild(document.createElement("br"));
    /**/
    
    for (var i = 0; i < data_json.dados.length; i++) {
      var div = document.createElement("div");
      var div2 = document.createElement("div");
      var span1 = document.createElement("div");
      var span2 = document.createElement("div");
      div.className = "card";
      div2.className = "card-body"

      span1.className = "nome_deputado";
      span2.className = "nome_partido";
      
      span1.innerHTML = data_json.dados[i].nome;
      span2.innerHTML = data_json.dados[i].siglaPartido;
      
      div2.appendChild(span1);
      div2.appendChild(span2);

      div.appendChild(div2);
      
      lista_deputados.appendChild(div);
    }
  }