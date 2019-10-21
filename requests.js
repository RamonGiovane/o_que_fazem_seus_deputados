
let noticias_cache = []

async function proxyRequest(url, headerType="application/html"){
    
    var headers = new Headers();
    headers.append("Content-Type", headerType);
    
    console.log(url);
    const res = await fetch("https://cors-anywhere.herokuapp.com/" + url, { headers });
    
    const retorno = await res.text();
      // parser = new DOMParser();
      // retorno = await parser.parseFromString(html, "text/html");
      //console.log('retornoo',retorno);
    
      return retorno;
    }

    
async function request(url, json_parse=true){
  const res = await fetch(url);
  let retorno ;
  if(json_parse)
    retorno = await res.json();
  else {
    retorno = await res.text();
  }
  return retorno;
}


function getURLCotaParlamentar(idDep, year=currentYear){
    //https://www.camara.leg.br/cota-parlamentar/consulta-cota-parlamentar?ideDeputado=204525&dataInicio=012019&dataFim=122019
    return "https://www.camara.leg.br/cota-parlamentar/consulta-cota-parlamentar?ideDeputado=" + idDep + //204525
    "&dataInicio=01" + year + //2019
    "&dataFim=12" + year;
}

function getURLVerbaGabinete(idDep, year=currentYear){
    //https://www.camara.leg.br/deputados/204525/verba-gabinete?ano=2019
    return "https://www.camara.leg.br/deputados/" + idDep + "/verba-gabinete?ano=" + year;
}

async function obterNoticias(nomeDeputado){
  
  //Consulta o cache
  if(nomeDeputado in noticias_cache) return noticias_cache[nomeDeputado];

  return await proxyRequest(getURLNoticiasDeputado(nomeDeputado)).then(async txt => {
    let r = htmlToDOM(txt);
    let itens = r.getElementsByTagName('item');
    
    
   
    console.log(itens);

    async function a (itens) {
      i = 0;
      let retorno = [] ;
     

      for(i = 0; i< 5; i++){
        let titulo =  itens[i].firstElementChild.textContent;

        if(titulo.length > 75){
          titulo = titulo.substring(0, 72)
          titulo += '...'
        }
        
        console.log(itens[i].firstElementChild);
        retorno.push(
          { 'titulo': titulo,
            'descricao': itens[i].firstElementChild.textContent,
            'fonte' : itens[i].firstElementChild.textContent.split(" - ")[1],
            'link' : itens[i].lastElementChild.previousElementSibling.textContent.split('"')[1],
            'data' : formatDate(itens[i].lastElementChild.previousElementSibling.previousElementSibling.textContent)
          });
          
        }
        noticias_cache[nomeDeputado] = retorno;
        return retorno;
    }
    const f = await a(itens);

    return  f;
   
  });
}

function calculateAge(birthday) { 
  var ageDifMs = Date.now() - new Date(birthday).getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function formatDate(str_date){
  let date  =  new Date(str_date);
  return date.toLocaleDateString();
}

function obterDespesas(idDeputado, ano=2019){
    
    obterCotaParlamentar(idDeputado, ano);
    
    //Working
    //let verbaGabinete = obterVerbaGabinete(idDeputado, ano); 
}

function getURLNoticiasDeputado(nomeDeputado){
  
  return "https://news.google.com/rss/search?q=" + nomeDeputado.replace(" ", "+") + "&hl=pt-BR&gl=BR";
}

function formatNumber(str_number){
  str_number = str_number.trim().replace("R$", "");
  str_number = str_number.replace(".", "");
  str_number = str_number.replace(",", ".");
  return parseFloat(str_number);
}

function obterCotaParlamentar(idDeputado, ano){
    //console.log(getURLVerbaGabinete(idDeputado,ano))
    proxyRequest(getURLCotaParlamentar(idDeputado,ano)).then(html =>{
    
    let doc = htmlToDOM(html);
    
    //Obtendo as verbas de todos os meses
    console.log(doc.getElementById("totalFinalAgregado").textContent)
    let totalGasto = formatNumber(doc.getElementById("totalFinalAgregado").textContent);
    
    //Contém o número de meses em que as cotas foram registradas no ano (-2 está retirando duas tags que não fazem parte da soma)
    let meses = doc.getElementsByClassName("numerico").length - 2; 
    console.log( {"cota-parlamentar" : {"total-gasto" : totalGasto, "media-mensal" : totalGasto/meses}});
    return {"cota-parlamentar" : {"total-gasto" : totalGasto, "media-mensal" : totalGasto/meses}}
  });
}
function compare(a, b) {
  let aint = parseInt(a.zip);
  let bint = parseInt(b.zip);
    
  if (aint > bint)
      return -1;
  if (aint < bint)
      return 1;
    return 0;
  }
function obterVerbaGabinete(idDeputado, ano){
    //console.log(getURLVerbaGabinete(idDeputado,ano))
   proxyRequest(getURLVerbaGabinete(idDeputado,ano)).then(html =>{
    let doc = htmlToDOM(html);
    
    //Obtendo as verbas de todos os meses
    let verbas = doc.getElementsByTagName("tr");
    
    //Obtendo a verba do último mes registrado
    let last = verbas[verbas.length-1];

    let mes = last.firstElementChild
    let valorDisponivel = mes.nextElementSibling;
    let valorTotal = last.lastElementChild;
    console.log(mes)
    console.log(mes + valorDisponivel + valorTotal)
    console.log("Mes: " + mes.textContent.trim() + " Disp: " + valorDisponivel.textContent.trim() + " Total: " + valorTotal.textContent.trim())

    ultima_verba = {"verba-gabinete" : {"mes": mes.textContent, "disponivel":valorDisponivel.textContent.trim(), "gasto": valorTotal.textContent.trim()}}
    return ultima_verba
});
}



function htmlToDOM(dados){
    let dom = new DOMParser();
    let doc = dom.parseFromString(dados, "text/html");
    return doc;
}
