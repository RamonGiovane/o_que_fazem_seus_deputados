
let btn_pesquisar = document.getElementById("btn_pesquisar");
let campo_de_pesquisa = document.getElementById("campo_de_pesquisa");
let lista_deputados = document.getElementById("lista_de_deputados");
let currentYear = new Date().getFullYear();

let el;

//Guarda o elemento de um deputado dentro da lista HTML
let tagDeputado;

//Dicionário que guardará as despesas do deputado atual selecionado
let despesasDeputado;

let data_json; //deverá ser renomeado depois para lista_dep_json;

let despesas; //deverá ser renomeado depois para despesas_dep_xml;

btn_pesquisar.onclick = function (){
    //alert("oi");
}

const url_base = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'

request(url_base)
  .then(data => listarDeputados(data))
  //A linha acima pode ser representada abaixo
  // .then(function(data){
  //   return listarDeputados(data);
  // })


function listarDeputados(json_data) {
    
    data = json_data.dados;
    
    //Copiando para a variavel global
    data_json = data;
    
    /*Temporary shit*/
    lista_deputados.appendChild(document.createElement("br"));
    lista_deputados.appendChild(document.createElement("br"));
    /**/
    
    for (let i = 0; i < data.length; i++) {
      let card = document.createElement("div");
      let cardBody = document.createElement("div");
      let nome = document.createElement("card");
      let partido = document.createElement("span");
      
      //Definindo id e classes
      card.className = "card";
      card.id = i;
      cardBody.className = "cardBody"
      nome.className = "nome_deputado";
      partido.className = "nome_partido";
    
      //Definindo ponteiro do mouse
      card.style.cursor = "pointer";

      //Povoando o cartão
      nome.innerHTML = data[i].nome;
      partido.innerHTML = data[i].siglaPartido + '-' + data[i].siglaUf + '<i class="fa fa-caret-down"></i>';
    
      //Tratando eventos de mouse
      nome.addEventListener("pointerenter", previewDeputado);
      card.addEventListener("click", expandirInformacoes)

      //Ligando os elementos
      cardBody.appendChild(nome); cardBody.appendChild(partido);
      card.appendChild(cardBody);
      lista_deputados.appendChild(card);
    }

    function previewDeputado(event){
      //Esconde o anterior
      if(el != null) el.style.color = 'black';
    
      el = event.target // elemento onde o evento foi disparado
      el.style.color = '#007bff';
      
    }

    function setarInformacoesDeputado(elm){
      
      if(tagDeputado != null)
        esconderElemento(tagDeputado)
      
      console.log(elm.id);

      div = document.createElement("div");
      div.class = "conteudo";
      div.id = "cartao" + elm.id;
      
      //Recupera um deputado do JSON com a lista de deputados a partir do ID definido no HTML
      let dep = data_json[parseInt(elm.id)];

      console.log(dep.id)
      
      obterDespesas(dep.id);
      
      div.innerHTML = 
              '<table class="card">' +
                '<tr>' +
                '<td><br><img style="width: 114px; height: 152px;" src="' + dep.urlFoto + '"></img></td>' +
                '<td><span id="span_info" class="card-text">' +
                  'Nome completo: ' +  dep.nome + '<br>' +
                  'Partido: ' + dep.siglaPartido + ' (' + dep.siglaUf + ')<br>' +
                  'Email: <a href="mailto:' + dep.email +  '">' + dep.email  + 
                '</span></td>'+ 
                '</table>' +
                //'<tr><td>' + 
                  '<div class="card" style="width: 18rem">' +
                    '<h5 class="card-tile">Últimas notícias</h5>' +
                    '<p class="card-text">Teste teste</p>' +
                  '</div>';
                //'</td></tr>' +
              //'</table>';

      tagDeputado = div;
      elm.appendChild(div);
    
    }

    function webScrap(dados){

      // doc = htmlToDOM(dados);

      // tagGastos = "percentualgastocotaparlamentar";
      // let element  = doc.getElementById(tagGastos);
      // console.log(element);
    }

    
    function setarDespesas(data_html){
      console.log(data_html)
    }

    function expandirInformacoes(event){
      elm = event.currentTarget
      console.log(elm);
      setarInformacoesDeputado(elm);
    }

    function esconderElemento(elm){
      //Esconder so a classe
      elm.style.display = "none";
    }
  }