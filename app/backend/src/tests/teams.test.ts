import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import Team from '../database/models/Team';
import teamsFake from './mocks/teams';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testa as rotas do endpoint /teams', () => {
  describe('Verifica o retorno ao acessar a rota /teams', () => {
    let responseTeams: Response

    it('Retorna um status code "200" e um array de objetos contendo os times', async () => {
      Sinon.stub(Team, 'findAll').resolves(teamsFake as Team[]);
      responseTeams = await chai.request(app).get('/teams');
      expect(responseTeams).to.have.status(200);
      expect(responseTeams.body).to.deep.equal(teamsFake);
      (Team.findAll as Sinon.SinonStub).restore();
    });

    it('Retorna um status code "404" e um objeto com a mensagem "Teams not found" quando não existem times cadastrados', async () => {
      Sinon.stub(Team, 'findAll').resolves([]);
      responseTeams = await chai.request(app).get('/teams');
      expect(responseTeams).to.have.status(404);
      expect(responseTeams.body).to.have.property('message');
      expect(responseTeams.body.message).to.be.equal('Teams not found');
      (Team.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Verifica o retorno ao acessar a rota /teams/1', () => {});
});
