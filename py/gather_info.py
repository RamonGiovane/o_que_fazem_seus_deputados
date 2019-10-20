import requests 
import json

url_base = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'

def obterInformacoesDetalhadas(j):
    dados_completos = []
    
    for dep in j['dados']:
        obj = json.loads(requisicaoHTTP(dep['uri']).text)
        obj['nome'] = dep['nome']
        dados_completos.append(obj['dados'])
        print("Processed: " + dep['nome'])
        
    print(dados_completos)
    return dados_completos

def exportarComoJSON(dados):
    with open('data.js', 'w+') as fp:
        fp.write("data = " + str(json.dumps(dados)))

def requisicaoHTTP(url):
    return requests.get(url)
    
    
    
def start():
    r = requisicaoHTTP(url_base)
    final = obterInformacoesDetalhadas(json.loads(r.text))
    exportarComoJSON(final)

if __name__ == "__main__":
    start()