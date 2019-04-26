import {
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
} from '@loopback/rest';
import { Reserva } from '../models';
import { ReservaRepository } from '../repositories';

export interface DisponibilidadeServiceInterface {
  validaDisponibilidade(reserva: Reserva): Promise<Reserva>;
  listaDisponibilidade(reserva: Reserva): Promise<Reserva[]>;
  getDuracao(reserva: Reserva): any;
}

export class DisponibilidadeService implements DisponibilidadeServiceInterface {

  constructor(
    @repository(ReservaRepository)
    public reservaRepository: ReservaRepository,
  ) { }

  getDuracao(reserva: Reserva): any {
    let duracaoEmMs = +(new Date(reserva.fimEm)) - +(new Date(reserva.inicioEm));
    return parseInt('' + (duracaoEmMs / (1000 * 60)), 10);
  }

  deslocaUmaDuracao(reserva: Reserva, multiplicador: any) {
    let novaReserva = Object.assign({}, reserva);
    let offsetEmMs = reserva!.duracao * 60 * 1000 * parseInt(multiplicador, 10);
    let inicioEmMs = new Date(reserva.inicioEm).getTime() + offsetEmMs;
    let fimEmMs = new Date(reserva.fimEm).getTime() + offsetEmMs;
    novaReserva.inicioEm = new Date(inicioEmMs).toISOString();
    novaReserva.fimEm = new Date(fimEmMs).toISOString();
    return novaReserva;
  }

  inverteTipo(reserva: Reserva) {
    let novaReserva = Object.assign({}, reserva);
    novaReserva.tipo = reserva.tipo === 'SAIBRO' ? 'HARD' : 'SAIBRO';
    return novaReserva;
  }

  async listaDisponibilidade(reserva: Reserva): Promise<Reserva[]> {
    let disponibilidades: Reserva[] = [];
    reserva.duracao = this.getDuracao(reserva);
    if (await this.validaDisponibilidade(reserva)) {
      disponibilidades.push(reserva);
      return Promise.resolve(disponibilidades);
    }
    return new Promise((resolve, reject) => {
      let inverteTipo = this.validaDisponibilidade(this.inverteTipo(reserva));
      let deslocadaPraFrente = this.validaDisponibilidade(this.deslocaUmaDuracao(reserva, 1));
      let deslocadaPraTras = this.validaDisponibilidade(this.deslocaUmaDuracao(reserva, -1));
      let deslocadaPraFrente2 = this.validaDisponibilidade(this.deslocaUmaDuracao(reserva, 2));
      let deslocadaPraTras2 = this.validaDisponibilidade(this.deslocaUmaDuracao(reserva, -2));
      Promise.all([inverteTipo, deslocadaPraFrente, deslocadaPraTras, deslocadaPraFrente2, deslocadaPraTras2]).then(data => {
        var filtered = data.filter(Boolean);
        resolve(filtered);
      }).catch(err => {
        reject(err);
      });
    })
  }

  async validaDisponibilidade(reserva: Reserva): Promise<Reserva> {
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
          // Caso que há inclusao da nova data
          {
            inicioEm: { lte: reserva.inicioEm },
            fimEm: { gte: reserva.fimEm },
          },
        ],
      }
    });;
    if (reservas.length > 0) {
      return null;
    }
    return reserva;
  }

}
