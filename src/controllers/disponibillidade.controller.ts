import { Request, RestBindings, post, HttpErrors, requestBody } from '@loopback/rest';
import { inject } from '@loopback/context';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';
import { DisponibilidadeService } from '../services';
import { repository } from '@loopback/repository';

export class DisponibilidadeController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(ReservaRepository) public reservaRepository: ReservaRepository,
  ) { }

  disponibilidadeService = new DisponibilidadeService(this.reservaRepository)

  @post('/disponibilidade', {
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
  async listaDisponibilidade(@requestBody() reserva: Reserva): Promise<Reserva[]> {
    console.info(`POST /disponibilidade request`, reserva);
    let response = await this.disponibilidadeService.listaDisponibilidade(reserva);
    console.info(`POST /disponibilidade response`, response);
    return response;
  }
}
