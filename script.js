
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

//request(url_base)
  //.then(data => listarDeputados(data))
  let data1 = data[0]

  listarDeputados(data);

function listarDeputados(json_data) {
    
    data = json_data
    
    //Copiando para a variavel global
    data_json = data;
    
    /*Temporary shit*/
    lista_deputados.appendChild(document.createElement("br"));
    lista_deputados.appendChild(document.createElement("br"));
    /**/
    
    for (let i = 0; i < data.length; i++) 
    {
      let dep = data[i]['ultimoStatus']
      //despesas[dep.id] = obterDespesas(dep.id)

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
      //card.style.cursor = "arrow";

      //Povoando o cartão
      nome.innerHTML = "<h6>" + dep.nomeEleitoral; + "</h6>"
      partido.innerHTML = dep.siglaPartido + '-' + dep.siglaUf + '<i class="fa fa-caret-down"></i>';
    
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

      
      //obterDespesas(dep.id);
      //let noticias = []; 
      
      obterNoticias('Política+' + dep.ultimoStatus.nomeEleitoral).then(noticias =>  {
        
        console.log(noticias);
        renderizarDeuputado(noticias, despesas, dep, div);
      
      });
    }
     
    function renderizarDeuputado(noticias, despesas, dep, div) {
    //img style="width: 114px; height: 152px;" 
        div.innerHTML = 
                
                //Conheça
                  `
                <br>
                <div style="cursor: arrow; display: inline-block;"> 
                  <div class="card" style="width: 24rem; display: inline-block; ">
                    <img src="`+ dep.ultimoStatus.urlFoto +`" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title" style="margin-bottom:  25px; margin-top:  -7px;">Conheça</h5>
                      <span class="card-text">
                      <b>Nome</b>: ` +  dep.nomeCivil + `<br>
                      <b>Partido</b>: ` + dep.ultimoStatus.siglaPartido + ` (`+ dep.ultimoStatus.siglaUf + `)<br>
                      <br>
                      <b>Idade</b>: ` + calculateAge(dep.dataNascimento) + ` anos<br>
                      <b>Natural de</b>: ` + dep.municipioNascimento + ` (`+ dep.ufNascimento + `)<br>
                      <b>Escolaridade</b>: ` + dep.escolaridade  + ` <br>
                      <b>Status do Mandato</b>: <p style="display: inline; color: gold; background-color: darkblue; border-radius: 3px; font-weigth: bold">` +  dep.ultimoStatus.situacao + ` </p>
                      <br>
                      <br>
                      <a class="card-link" href="https://www.camara.leg.br/deputados/` + dep.ultimoStatus.id  + `/biografia">Mais Informações</a> 
                      </span>
                    </div>
                  </div>` 
                
                  //Informe-se
                 var html_str =
                  `
                  <div style="display: inline-block; margin-left: 20px; vertical-align:top; ">
                    <div class="card" style="width: 35rem; display: inline-block;">
                      <h5 class="card-title" style="margin: 5px 12px;">Informe-se</h5>
                      
                      <div class="list-group">
                      `
                      console.log(div.innerHTML)
                        //inserindo as notícias
                        for( i = 0; i<noticias.length; i++){
                          let n = noticias[i];
                          console.log(n.link)
                          html_str +=
                          `<a href="` + n.link + `" class="list-group-item list-group-item-action flex-column align-items-start">
                            <div class="d-flex w-10 justify-content-between" >
                               <h5 class="mb-0">` + n.titulo + `</h5>
                               <small>` + n.data + `</small>
                            </div>
                              <p class="mb-1">` + n.descricao   + `.</p>
                              <small>` + n.fonte + `</small>
                          </a>`
                        }
                        div.innerHTML += html_str +   
                      `
                      </div>   
                    </div>
                    </div>
                  </div>` ;
                  let gabinete = dep.ultimoStatus.gabinete;
                  str_html = 
                    `
                  <br><br>
                  <div class="card" style="width: 24rem; display: inline-block; margin-bottom: -5px">
                    <div style="margin-left: 12px">
                    <h5 class="card-title" style="margin-bottom:  25px;  margin: 12px 0px; ">Cobre</h5>
                    <h6 class="card-text">Entre em contato</h6>
                    <b>Gabinete: </b>` + gabinete.nome + ` Prédio: ` +  gabinete.predio + ` - ` +
                  
                    gabinete.andar + `º andar - Sala: ` + gabinete.sala +
                    `<br>
                    <b>Telefone:</b> ` + gabinete.telefone +

                    `<br><br>
                    <a href=mailto:`+gabinete.email + `>Enviar um email</a>
                    <br><br>
                    </div>`;

                    
                    for(index = 0; index < dep.redeSocial.length; index++){
                      let i = dep.redeSocial[index]
                      console.log("i porra" + i)
                      if(i.includes("instagram.com"))
                        str_html += '<a class=social-link href='+ i + '><i id="social" class="fa fa-instagram"></i></a>'
                      if(i.includes("facebook.com"))
                        str_html +=   '<a class=social-link href='+ i + '> <i id="social" class="fa fa-facebook-f"></i></a>'
                      if(i.includes("youtube.com"))
                        str_html +=  '<a class=social-link href='+ i + '> <i id="social" class="fa fa-youtube"></i></a>'
                      if(i.includes("twitter.com"))
                        str_html +=  '<a class=social-link href='+ i + '> <i id="social" class="fa fa-twitter"></i></a>'
                    
                    }
                  str_html +=
                  `</div>
                  <div class="card" style="width: 35rem; display: inline-block; margin-bottom:">
                    <h5 class="card-title" style="margin-bottom:  25px; margin: 5px 12px;">Monitore</h5>
                    <p class="card-text">Lorem fodase Lorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodasLorem fodas </p>
                  </div>
                </div>
                `;
                console.log(str_html)
                div.innerHTML += str_html;
          

        tagDeputado = div;
        elm.appendChild(div);
        window.scrollBy(0, -15);
        
                   
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