
## tennis-concierge


#### 1 - Como iniciar

* git clone git@git.ng.bluemix.net:cassio.scofield/tennis-concierge.git
* npm i
* npm start 

#### 2 - Como usar

###### Documentação da API
* GET /explorer

###### Rotas
* GET /reservas
* POST /reservas
* PUT /reservas
* DELETE /reservas
* GET /reservas/{id}
* GET /disponibilidade



#### 3 - Modelo

##### RESERVA:

Campos

* id - string ou int (autogerado)

* tipo - enum-string (HARD ou SAIBRO)

* status - enum-string (ativa, cancelada, paga)

* inicioEm - string-ISODate (2019-03-26T17:00:00.000Z)

* fimEm - string-ISODate (2019-03-26T18:00:00.000Z)

* duracao - int (em minutos)

* valor - decimal (em reais)

* criadoEm - string-ISODate (autogerado)

* canceladoEm - string-ISODate (autogerado)

JSON:
```javascript
{
  "id": 1,
  "tipo": "SAIBRO",
  "inicioEm": "2019-03-26T17:00:00.000Z",
  "fimEm": "2019-03-26T18:00:00.000Z",
  "status": "cancelado",
  "duracao": 60,
  "valor": 30,
  "canceladoEm": "2019-03-26T18:00:00.000Z"
}
```

#### 4 - Casos de teste

* Casos de teste estão descritos em formato postman:
 [tennis-concierge.postman_collection](https://git.ng.bluemix.net/cassio.scofield/tennis-concierge/wikis/uploads/c29cb984e632770e56e89194f096d0bd/tennis-concierge.postman_collection)

#### 5 - Deploy no IBM Cloud (bluemix)

* Baixar o CLI do bluemix em:
[https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use)

* Criar o arquivo manifest.yml na raiz do projeto
** Será necessário trocar o nome da aplicação porque a rota não estará disponível
```yml
---
applications:
- name: tennis-concierge
buildpack: https://github.com/cloudfoundry/nodejs-buildpack
memory: 256M
disk: 512M
instances: 1
```
* Fazer login no IBM Cloud
```script
$ bx login --sso
Terminal de API: https://api.ng.bluemix.net
Um código de tempo (obtenha um em https://iam-id-2.ng.bluemix.net/identity/passcode)>
Autenticando...
OK
Selecione uma conta:
1. IBM-cassio.scofield (a41e91a09d7ee7e6a9fb59bc6ac9a0fb)
2. IBM - Conta Oi (2d98304a85a1eae142aa7f4019b9c5d9)
3. OI MOVEL S.A. - EM RECUPERACAO JUD (b88a1347218504f6c45fadc174bb9a99)
Insira um número> 1

$ 1
Grupo de recursos de destino Default
Terminal de API:  https://api.ng.bluemix.net (versão da API: 2.106.0)
Região:  us-south
Usuário:  Cassio.Scofield@ibm.com
Conta:  IBM-cassio.scofield (a41e91a09d7ee7e6a9fb59bc6ac9a0fb)
Grupo de recursos:  Default
```
* Login no bluemix (cloud-foundry)
```shell
$ bx target --cf
Organização destinada cassio.scofield
Selecione um espaço (ou pressione Enter para ignorar):
1. dev
2. personal
Insira um número> 1

$ 1
Espaço destinado dev
Terminal de API:  https://api.ng.bluemix.net (versão da API: 2.106.0)
Região:  us-south
Usuário:  Cassio.Scofield@ibm.com
Conta:  IBM-cassio.scofield (a41e91a09d7ee7e6a9fb59bc6ac9a0fb)
Grupo de recursos:  Default
Organização:  cassio.scofield
Espaço:  dev
```
* Fazer upload dos arquivos e das configurações do manifest.yml
```shell
$ bx cf push
Chamando 'cf push'...
Pushing from manifest to org cassio.scofield / space dev as cassio.scofield@ibm.com...
Usando o arquivo manifest /Users/cassio/dev/tennis-concierge/manifest.yml
Getting app info...
Creating app with these attributes...
+ nome: tennis-concierge
path: /Users/cassio/dev/tennis-concierge
+ buildpack:  https://github.com/cloudfoundry/nodejs-buildpack
+ instâncias: 1
+ memória:  256M
routes:
+ tennis-concierge.mybluemix.net  
Creating app tennis-concierge...
Mapping routes...
Comparing local files to remote cache...
Packaging files to upload...

Waiting for app to start...

nome:  tennis-concierge
estado solicitado: started
instâncias:  1/1
utilização:  256M x 1 instances
routes:  tennis-concierge.mybluemix.net
última transferência por upload: Sat 30 Mar 14:41:49 -03 2019
pilha: cflinuxfs2
buildpack: https://github.com/cloudfoundry/nodejs-buildpack
start command: npm start

estado  desde  Cpu  memória  de discos  detalhes
#0 execução 2019-03-30T17:46:05Z 51.6% 45.6M of 256M 285.2M of 1G
```

* Pronto o seu aplicativo já estará disponível em tennis-concierge.mybluemix.net