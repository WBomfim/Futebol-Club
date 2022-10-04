import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import Match from '../database/models/Match';
import { MatchIncludesTeams } from '../interfaces/ReturnService';
import matchesFake from './mocks/matches';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testa as rotas do endpoint /matches', () => {
  let response: Response;

  describe('Verifica o retorno ao buscar todas as partidas cadastradas no banco de dados ', () => {
    it('Deve retornar um status 200 e um array com todas as partidas cadastradas', async () => {
      Sinon.stub(Match, 'findAll').resolves(matchesFake as MatchIncludesTeams[]);
      response = await chai.request(app).get('/matches');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesFake);
      (Match.findAll as Sinon.SinonStub).restore();
    });

    it('Deve retornar um status 404 e uma mensagem de erro caso não tenha partidas cadastradas', async () => {
      Sinon.stub(Match, 'findAll').resolves([]);
      response = await chai.request(app).get('/matches');
      expect(response.status).to.be.equal(404);
      expect(response.body).to.be.have.property('message');
      expect(response.body.message).to.be.equal('No matches found');
      (Match.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Verifica o retorno ao buscar todas as partidas filtradas pelo parametro passado na query', () => {
    it('Deve retornar um status 200 e um array com todas as partidas em andamento', async () => {
      const matchesInProgress = matchesFake.filter((match) => match.inProgress === true);
      Sinon.stub(Match, 'findAll').resolves(matchesInProgress as MatchIncludesTeams[]);
      response = await chai.request(app).get('/matches?inProgress=true');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesInProgress);
      (Match.findAll as Sinon.SinonStub).restore();
    });

    it('Deve retornar um status 200 e um array com todas as partidas finalizadas', async () => {
      const matchesFinished = matchesFake.filter((match) => match.inProgress === false);
      Sinon.stub(Match, 'findAll').resolves(matchesFinished as MatchIncludesTeams[]);
      response = await chai.request(app).get('/matches?inProgress=false');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesFinished);
      (Match.findAll as Sinon.SinonStub).restore();
    });
  });
});
