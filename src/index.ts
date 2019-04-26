import { TennisConciergeApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import { DisponibilidadeService } from './services';

export { TennisConciergeApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new TennisConciergeApplication(options);
  await app.boot();
  await app.start();

  app.bind('services.disponibilidade').to(DisponibilidadeService);

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/explorer`);

  return app;
}
