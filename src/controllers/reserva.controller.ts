import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';
import { DisponibilidadeService } from '../services';

export class ReservaController {
  constructor(
    @repository(ReservaRepository) public reservaRepository: ReservaRepository,
  ) { }

  disponibilidadeService = new DisponibilidadeService(this.reservaRepository)

  validate(reserva: Reserva) {
    if (['SAIBRO', 'HARD'].indexOf(reserva.tipo) == -1) {
      throw new HttpErrors.BadRequest('tipo inválido, favor usar SAIBRO ou HARD');
    }
    if (reserva.status && ['ativa', 'paga', 'cancelada'].indexOf(reserva.status) == -1) {
      throw new HttpErrors.BadRequest('status inválido, favor usar ativa, paga ou cancelada');
    }
    if (new Date(reserva.inicioEm) >= new Date(reserva.fimEm)) {
      throw new HttpErrors.BadRequest('fimEm menor ou igual a inicioEm');
    }
    if (this.disponibilidadeService.getDuracao(reserva) < 60) {
      throw new HttpErrors.BadRequest('duracao menor que uma hora');
    }
    if (this.disponibilidadeService.getDuracao(reserva) % 60) {
      throw new HttpErrors.BadRequest('duracao não é multiplo de 60');
    }
  }

  @post('/reservas', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Reserva } } },
      },
    },
  })
  async create(@requestBody() reserva: Reserva): Promise<Reserva> {
    console.info(`GET /reserva request`, reserva)
    reserva.duracao = this.disponibilidadeService.getDuracao(reserva);
    reserva.valor = reserva.duracao * 0.5;
    this.validate(reserva);
    if (await this.disponibilidadeService.validaDisponibilidade(reserva)) {
      let response = await this.reservaRepository.create(reserva);
      console.info(`GET /reserva response`, response)
      return response;
    }
    throw new HttpErrors.UnprocessableEntity('Horário indisponível');
  }

  @get('/reservas', {
    responses: {
      '200': {
        description: 'Array of Reserva model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Reserva } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Reserva)) filter?: Filter,
  ): Promise<Reserva[]> {
    console.info(`GET /reserva request`, filter)
    let response = await this.reservaRepository.find(filter);
    console.info(`GET /reserva response`, response)
    return response;
  }

  @get('/reservas/{id}', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Reserva } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Reserva> {
    console.info(`GET /reserva/${id} request`)
    let response = await this.reservaRepository.findById(id);
    console.info(`GET /reserva/${id} response`, response);
    return response;
  }

  @put('/reservas/{id}', {
    responses: {
      '204': {
        description: 'Reserva PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() reserva: Reserva,
  ): Promise<Reserva> {
    console.info(`DELETE /reserva/${id} request`, reserva)
    this.validate(reserva);
    await this.reservaRepository.replaceById(id, reserva);
    let responseBody = await this.reservaRepository.findById(id);
    console.info(`PUT /reserva/${id} response`, responseBody)
    return responseBody;
  }

  @del('/reservas/{id}', {
    responses: {
      '204': {
        description: 'Reserva DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<Reserva> {
    console.info(`DELETE /reserva/${id} request`)
    let reserva = await this.reservaRepository.findById(id);
    reserva.status = 'cancelada';
    reserva.canceladaEm = new Date().toISOString();
    await this.reservaRepository.replaceById(id, reserva);
    let responseBody = await this.reservaRepository.findById(id);
    console.info(`DELETE /reserva/${id} response`, responseBody)
    return responseBody;
  }
}
