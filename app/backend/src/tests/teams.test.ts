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
  let response: Response
  
  describe('Verifica o retorno ao acessar a rota /teams', () => {

    it('Retorna um status code "200" e um array de objetos contendo os times', async () => {
      Sinon.stub(Team, 'findAll').resolves(teamsFake as Team[]);
      response = await chai.request(app).get('/teams');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(teamsFake);
      (Team.findAll as Sinon.SinonStub).restore();
    });

    it('Retorna um status code "404" e um objeto com a mensagem "Teams not found" quando não existem times cadastrados', async () => {
      Sinon.stub(Team, 'findAll').resolves([]);
      response = await chai.request(app).get('/teams');
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Teams not found');
      (Team.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Verifica o retorno ao acessar a rota /teams/1', () => {
    it('Retorna um status code "200" e um objeto contendo o time', async () => {
      Sinon.stub(Team, 'findOne').resolves(teamsFake[0] as Team);
      response = await chai.request(app).get('/teams/1');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(teamsFake[0]);
      (Team.findOne as Sinon.SinonStub).restore();
    });

    it('Retorna um status code "404" e um objeto com a mensagem "Team not found" quando o time não existe', async () => {
      Sinon.stub(Team, 'findOne').resolves(null);
      response = await chai.request(app).get('/teams/1');
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Team not found');
      (Team.findOne as Sinon.SinonStub).restore();
    });
  });
});
