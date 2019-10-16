async function proxyRequest(url, headerType="application/html"){
    
    var headers = new Headers();
    headers.append("Content-Type", headerType);
    
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

function obterDespesas(idDeputado, ano=2019){
    
    obterCotaParlamentar(idDeputado, ano);
    
    //Working
    //let verbaGabinete = obterVerbaGabinete(idDeputado, ano); 
}

function obterCotaParlamentar(idDeputado, ano){
    //console.log(getURLVerbaGabinete(idDeputado,ano))
   proxyRequest(getURLCotaParlamentar(idDeputado,ano)).then(html =>{
    console.log(html);
});
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

    ultima_verba = {"mes":mes.textContent, "disponivel":valorDisponivel.textContent.trim(), "gasto": valorTotal.textContent.trim()}
    return ultima_verba
});
}



function htmlToDOM(dados){
    let dom = new DOMParser();
    let doc = dom.parseFromString(dados, "text/html");
    return doc;
}