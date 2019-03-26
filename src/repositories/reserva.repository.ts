import { DefaultCrudRepository } from '@loopback/repository';
import { Reserva } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ReservaRepository extends DefaultCrudRepository<
  Reserva,
  typeof Reserva.prototype.id
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Reserva, dataSource);
  }
}
