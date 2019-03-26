import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';

export class ReservaController {
  constructor(
    @repository(ReservaRepository)
    public reservaRepository: ReservaRepository,
  ) { }

  @post('/reservas', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Reserva } } },
      },
    },
  })
  async create(@requestBody() reserva: Reserva): Promise<Reserva> {
    let duracaoEmMs = +(new Date(reserva.fimEm)) - +(new Date(reserva.inicioEm));
    reserva.duracao = parseInt('' + (duracaoEmMs / (1000 * 60)));
    reserva.valor = reserva.duracao * 0.5;
    return await this.reservaRepository.create(reserva);
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
    return await this.reservaRepository.find(filter);
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
    return await this.reservaRepository.findById(id);
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
  ): Promise<void> {
    await this.reservaRepository.replaceById(id, reserva);
  }

  @del('/reservas/{id}', {
    responses: {
      '204': {
        description: 'Reserva DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    let reserva = await this.reservaRepository.findById(id);
    reserva.status = 'cancelada';
    reserva.canceladaEm = new Date().toISOString();
    await this.reservaRepository.replaceById(id, reserva);
  }
}
