import { Entity, model, property } from '@loopback/repository';

@model()
export class Reserva extends Entity {

  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: 'SAIBRO',
  })
  tipo: string;

  @property({
    type: 'string',
    default: 'ativa',
  })
  status: string;

  @property({
    type: 'date',
    required: true,
  })
  inicioEm: string;

  @property({
    type: 'date',
    required: true,
  })
  fimEm: string;

  @property({
    type: 'date',
    required: false,
    default: new Date(),
  })
  criadoEm: string;

  @property({
    type: 'number'
  })
  valor?: number;

  @property({
    type: 'number'
  })
  duracao?: number;

  @property({
    type: 'date',
    required: false,
  })
  canceladaEm: string;

  constructor(data?: Partial<Reserva>) {
    super(data);
  }
}
