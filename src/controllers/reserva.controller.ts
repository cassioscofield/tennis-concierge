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
  HttpErrors,
} from '@loopback/rest';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';

export class ReservaController {
  constructor(
    @repository(ReservaRepository)
    public reservaRepository: ReservaRepository,
  ) { }

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
    if (this.getDuracao(reserva) < 60) {
      throw new HttpErrors.BadRequest('duracao menor que uma hora');
    }
    if (this.getDuracao(reserva) % 60) {
      throw new HttpErrors.BadRequest('duracao não é multiplo de 60');
    }
  }

  getDuracao(reserva: Reserva) {
    let duracaoEmMs = +(new Date(reserva.fimEm)) - +(new Date(reserva.inicioEm));
    return parseInt('' + (duracaoEmMs / (1000 * 60)));
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
    reserva.duracao = this.getDuracao(reserva);
    reserva.valor = reserva.duracao * 0.5;
    this.validate(reserva);
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
    this.validate(reserva);
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
