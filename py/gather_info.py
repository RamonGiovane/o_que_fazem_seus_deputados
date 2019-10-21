import requests 
import json

url_base = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'
proxy = 'https://cors-anywhere.herokuapp.com/'

def getHeaders():
    return {'Content-Type': 'application/html'}

def getURLCotaParlamentar(idDep, y):
    year = str(y)
    #https://www.camara.leg.br/cota-parlamentar/consulta-cota-parlamentar?ideDeputado=204525&dataInicio=012019&dataFim=122019
    return 'https://www.camara.leg.br/cota-parlamentar/consulta-cota-parlamentar?ideDeputado=' + str(idDep) +"&dataInicio=01" + year + "&dataFim=12" + year


def getURLVerbaGabinete(idDep, year):
    #https://www.camara.leg.br/deputados/204525/verba-gabinete?ano=2019
    return "https://www.camara.leg.br/deputados/" + idDep + "/verba-gabinete?ano=" + str(year)

def obterDespesas(id_dep):
    r = requisicaoHTTP(getURLCotaParlamentar(id_dep, 2019), getHeaders()).text
    print(r)
    
    # meses = doc.getElementsByClassName("numerico").length - 2; 
    # console.log( {"cota-parlamentar" : {"total-gasto" : totalGasto, "media-mensal" : totalGasto/meses}});
    # return {"cota-parlamentar" : {"total-gasto" : totalGasto, "media-mensal" : totalGasto/meses}}
  

def obterInformacoesDetalhadas(j):
    dados_completos = []
    
    for dep in j['dados']:
        obj = json.loads(requisicaoHTTP(dep['uri']).text)
        obj['nome'] = dep['nome']
        
        dados_completos.append(obj['dados'])
        #obj['desepesas'] = 
        #obterDespesas(dep['id'])
        print("Processed: " + dep['nome'])
  
        
    #print(dados_completos)
    return dados_completos

def exportarComoJSON(dados):
    with open('data.js', 'w+') as fp:
        fp.write("data = " + str(json.dumps(dados)))

def requisicaoHTTP(url, headers=None):
    return requests.get(url, headers)
    
    
    
def start():
    r = requisicaoHTTP(url_base)
    final = obterInformacoesDetalhadas(json.loads(r.text))
    exportarComoJSON(final)

if __name__ == "__main__":
    start()