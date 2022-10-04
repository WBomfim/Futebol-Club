import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import Match from '../database/models/Match';
import { MatchIncludesTeams } from '../interfaces/ReturnService';
import matchesFake from './mocks/matchesGet';
import * as jwt from 'jsonwebtoken';
import { returnMatch, boryMatch } from './mocks/matchesPost';
import teamsFake from './mocks/teams';
import Team from '../database/models/Team';
import ValidateInfosMatch from '../schemas/ValidateInfosMatch';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testa as rotas do endpoint /matches', () => {
  let response: Response;
  const payload = { id: 1, username: 'Admin'};

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

  describe('Verifica o retorno ao criar uma nova partida', () => {
    const returnFindAllOk = [teamsFake[0], teamsFake[1]] as Team[];
    const returnFindAllFail = [teamsFake[0]] as Team[];

    before(() => {
      Sinon.stub(jwt, 'verify').resolves(payload);
      Sinon.stub(Match, 'create').resolves(returnMatch as Match);
    });

    after(() => {
      (jwt.verify as Sinon.SinonStub).restore();
      (Match.create as Sinon.SinonStub).restore();
    });

    it('Deve retornar um status 201 e a partida criada', async () => {
      Sinon.stub(ValidateInfosMatch, 'findAll').resolves(returnFindAllOk);
      
      response = await chai.request(app).post('/matches').send(boryMatch.valid).set('Authorization', 'tokentestes');
      expect(response.status).to.be.equal(201);
      expect(response.body).to.be.deep.equal(returnMatch);

      (ValidateInfosMatch.findAll as Sinon.SinonStub).restore();
    });

    it('Deve retornar um status 401 e uma mensagem de erro caso o time mandante seja igual ao time visitante', async () => {
      response = await chai.request(app).post('/matches').send(boryMatch.teamsEquals).set('Authorization', 'tokentestes');
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.have.property('message');
      expect(response.body.message).to.be.equal('It is not possible to create a match with two equal teams');
    });

    it('Deve retornar um status 404 e uma mensagem de erro caso um dos times não exista', async () => {
      Sinon.stub(ValidateInfosMatch, 'findAll').resolves(returnFindAllFail);
      
      response = await chai.request(app).post('/matches').send(boryMatch.teamNotExisting).set('Authorization', 'tokentestes');
      expect(response.status).to.be.equal(404);
      expect(response.body).to.be.have.property('message');
      expect(response.body.message).to.be.equal('There is no team with such id!');

      (ValidateInfosMatch.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Verifica o retorno ao finalizar ou atualizar uma partida', () => {
    before(() => {
      Sinon.stub(jwt, 'verify').resolves(payload);
      Sinon.stub(Match, 'update').resolves();
    });

    after(() => {
      (jwt.verify as Sinon.SinonStub).restore();
      (Match.update as Sinon.SinonStub).restore();
    });

    it('Deve retornar um status 200 e uma mensagem de sucesso ao finalizar uma partida', async () => {
      response = await chai.request(app).patch('/matches/1/finish').set('Authorization', 'tokentestes');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.have.property('message');
      expect(response.body.message).to.be.equal('Finished');
    });

    it('Deve retornar um status 200 e uma mensagem de sucesso ao atualizar uma partida', async () => {
      const bodyRequest = { "homeTeamGoals": 3, "awayTeamGoals": 1 };
      response = await chai.request(app).patch('/matches/1').send(bodyRequest).set('Authorization', 'tokentestes');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.have.property('message');
      expect(response.body.message).to.be.equal('Updated');
    });
  });
});
