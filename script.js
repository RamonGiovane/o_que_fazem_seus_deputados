
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

function listarDeputados(json_data) {
    
    data = json_data.dados;
    
    //Copiando para a variavel global
    data_json = data;
    
    /*Temporary shit*/
    lista_deputados.appendChild(document.createElement("br"));
    lista_deputados.appendChild(document.createElement("br"));
    /**/
    
    for (let i = 0; i < data.length; i++) 
    {
      
      //despesas[data[i].id] = obterDespesas(data[i].id)

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
      card.style = `transition: 0.4s;
      margin: 15px 10px;
      padding: 20px;`;
    
      //Definindo ponteiro do mouse
      card.style.cursor = "pointer";

      //Povoando o cartão
      nome.innerHTML = "<h6>" + data[i].nome; + "</h6>"
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

      div = document.createElement("div");
      div.class = "conteudo";
      div.id = "cartao" + elm.id;
      
      //Recupera um deputado do JSON com a lista de deputados a partir do ID definido no HTML
      let dep = data_json[parseInt(elm.id)];

      console.log(dep.id)
      
      //obterDespesas(dep.id);
      let noticias; 
      obterNoticias(dep.nome, noticias);

      //img style="width: 114px; height: 152px;" 
      div.innerHTML = 
              
                
                // '<div class="card" style="width: 114px;">' +
                //   '<img class="card-img-top" width: 114px; height: 152px;" src="' + dep.urlFoto + '"></img>' +
                //   'Nome completo: ' +  dep.nome + '<br>' +
                //   'Partido: ' + dep.siglaPartido + ' (' + dep.siglaUf + ')<br>' +
                //   'Email: <a class="card-link" href="mailto:' + dep.email +  '">' + dep.email  + 
                // '</div>';
              
              
                `
              <br>
              <div style="cursor: pointer"> 
                <div class="card" style="width: 21rem; display: inline-block; ">
                  <img src="`+ dep.urlFoto +`" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title" style="margin-bottom:  25px; margin-top:  -7px;">Conheça</h5>
                    <span class="card-text">
                    Nome: ` +  dep.nome + `<br>
                    Partido: ` + dep.siglaPartido + ` (`+ dep.siglaUf + `)<br>
                    
                    <br>
                    <a class="card-link" href="https://www.camara.leg.br/deputados/` + dep.id  + `/biografia">Mais Informações</a> 
                    </span>
                  </div>
                </div>
                <div style="display: inline-block; margin-left: 20px">
                  <div class="card" style="width: 35rem; display:  block; margin-botto: -5px">
                    <h5 class="card-title" style="margin: 5px 12px;">Monitore</h5>
                    
                    <div class="list-group">
                      <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">List group item heading</h5>
                          <small>3 days ago</small>
                        </div>
                        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                        <small>Donec id elit non mi porta.</small>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">List group item heading</h5>
                          <small class="text-muted">3 days ago</small>
                        </div>
                        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                        <small class="text-muted">Donec id elit non mi porta.</small>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">List group item heading</h5>
                          <small class="text-muted">3 days ago</small>
                        </div>
                        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                        <small class="text-muted">Donec id elit non mi porta.</small>
                      </a>
                </div>
                  </div>
                  <br>
                  <div class="card" style="width: 35rem; display: block; margin-bottom:">
                  <h5 class="card-title" style="margin-bottom:  25px; margin-top:  -7px;">Monitore</h5>
                  <p class="card-text">Lorem fodase Lorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodas </p>
                  </div>
                </div>

              </div>
              `;
                  
              //   '<td><div id="span_info" class="card-text">' +
              //   '<h5 class="card-tile">Conheça</h5>' +
                  
              //   '</div></td>'+ 
              //   '</table>' +
              //   //'<tr><td>' + 
              //     '<div class="card" style="width: 18rem">' +
              //       '<h5 class="card-tile">Últimas notícias</h5>' +
              //       '<p class="card-text">Teste teste</p>' +
              //     '</div>';
              //   //'</td></tr>' +
              // //'</table>';
      //  div.innerHTML += 
      //         '<br>' +
      //         '<table>' +
                
      //           '<tr class="card" style="width: 18 rem; height: 2 rem;">' +
                
      //           '<td>' +
      //             '<img class="card-img-top" src="' + dep.urlFoto + '"></img>' +
                  
      //           '</td>' +
                  
      //           '<td><div id="span_info" class="card-text">' +
      //           '<h5 class="card-tile">Conheça</h5>' +
      //             'Nome completo: ' +  dep.nome + '<br>' +
      //             'Partido: ' + dep.siglaPartido + ' (' + dep.siglaUf + ')<br>' +
      //             'Email: <a class="card-link" href="mailto:' + dep.email +  '">' + dep.email  + 
      //           '</div></td>'+ 
      //           '</table>' +
      //           //'<tr><td>' + 
      //             '<div class="card" style="width: 18rem">' +
      //               '<h5 class="card-tile">Últimas notícias</h5>' +
      //               '<p class="card-text">Teste teste</p>' +
      //             '</div>';
      //           //'</td></tr>' +
      //         //'</table>';

      tagDeputado = div;
      elm.appendChild(div);
    
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