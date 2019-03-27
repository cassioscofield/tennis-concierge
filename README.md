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

