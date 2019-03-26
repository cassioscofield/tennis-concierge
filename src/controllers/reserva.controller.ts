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
import {Reserva} from '../models';
import {ReservaRepository} from '../repositories';

export class ReservaController {
  constructor(
    @repository(ReservaRepository)
    public reservaRepository : ReservaRepository,
  ) {}

  @post('/reservas', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: {'application/json': {schema: {'x-ts-type': Reserva}}},
      },
    },
  })
  async create(@requestBody() reserva: Reserva): Promise<Reserva> {
    return await this.reservaRepository.create(reserva);
  }

  @get('/reservas/count', {
    responses: {
      '200': {
        description: 'Reserva model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Reserva)) where?: Where,
  ): Promise<Count> {
    return await this.reservaRepository.count(where);
  }

  @get('/reservas', {
    responses: {
      '200': {
        description: 'Array of Reserva model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Reserva}},
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

  @patch('/reservas', {
    responses: {
      '200': {
        description: 'Reserva PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() reserva: Reserva,
    @param.query.object('where', getWhereSchemaFor(Reserva)) where?: Where,
  ): Promise<Count> {
    return await this.reservaRepository.updateAll(reserva, where);
  }

  @get('/reservas/{id}', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: {'application/json': {schema: {'x-ts-type': Reserva}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Reserva> {
    return await this.reservaRepository.findById(id);
  }

  @patch('/reservas/{id}', {
    responses: {
      '204': {
        description: 'Reserva PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() reserva: Reserva,
  ): Promise<void> {
    await this.reservaRepository.updateById(id, reserva);
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
    await this.reservaRepository.deleteById(id);
  }
}
