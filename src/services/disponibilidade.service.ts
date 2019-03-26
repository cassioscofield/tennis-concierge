import {
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
} from '@loopback/rest';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';

export interface DisponibilidadeServiceInterface {
  validaDisponibilidade(reserva: Reserva): Promise<Boolean>;
  listaDisponibilidade(reserva: Reserva): Promise<Reserva[]>;
}

export class DisponibilidadeService implements DisponibilidadeServiceInterface {

  constructor(
    @repository(ReservaRepository)
    public reservaRepository: ReservaRepository,
  ) { }

  async listaDisponibilidade(reserva: Reserva): Promise<Reserva[]> {
    let disponibilidades: Reserva[] = [];
    if (await this.validaDisponibilidade(reserva)) {
      disponibilidades.push(reserva);
    }
    return Promise.resolve(disponibilidades);
  }

  async validaDisponibilidade(reserva: Reserva): Promise<Boolean> {
    let reservas = await this.reservaRepository.find({
      where: {
        // Remove canceladas
        status: { inq: ['ativa', 'paga'] },
        // Remove quadras diferentes
        tipo: reserva.tipo,
        // Analisa tempo
        or: [
          // Caso em que os inicios coincidem
          {
            inicioEm: reserva.inicioEm,
          },
          // Caso em que os fins coincidem
          {
            fimEm: reserva.fimEm,
          },
          // Caso onde há sobreposição do inicio
          {
            inicioEm: { between: [reserva.inicioEm, reserva.fimEm] }
          },
          // Caso que há sobreposição do fim
          {
            fimEm: { between: [reserva.inicioEm, reserva.fimEm] }
          },
        ],
      }
    });;
    if (reservas.length > 0) {
      throw new HttpErrors.UnprocessableEntity('Horário indisponível');
    }
    return true;
  }

}
