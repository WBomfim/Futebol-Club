import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { app } from '../app';
import Match from '../database/models/Match';
import fakeMatchesGet from './mocks/matchesGet';
import fakeLeaderBoard from './mocks/leaderBoard';
import fakeLeaderBoardHome from './mocks/leaderBoardHome';
import faekLeaderBoardAway from './mocks/leaderBoardAway';
import { MatchIncludesTeams } from './../interfaces/ReturnService';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testa as rotas para o endpoint /leaderboard', () => {
  const matchesFinished = fakeMatchesGet.filter((match) => match.inProgress === false);

  describe('Testa a rota /leaderboard', () => {
    it('Deve retornar o status 200 e um array com os times e suas pontuações', async () => {
      Sinon.stub(Match, 'findAll').resolves(matchesFinished as MatchIncludesTeams[]);

      const response = await chai.request(app).get('/leaderboard');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.eql(fakeLeaderBoard);

      (Match.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Testa a rota /leaderboard/home', () => {
    it('Deve retornar o status 200 e um array com os times que jogaram em casa e suas pontuações', async () => {
      Sinon.stub(Match, 'findAll').resolves(matchesFinished as MatchIncludesTeams[]);

      const response = await chai.request(app).get('/leaderboard/home');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.eql(fakeLeaderBoardHome);

      (Match.findAll as Sinon.SinonStub).restore();
    });
  });

  describe('Testa a rota /leaderboard/away', () => {
    it('Deve retornar o status 200 e um array com os times que jogaram fora de casa e suas pontuações', async () => {
      Sinon.stub(Match, 'findAll').resolves(matchesFinished as MatchIncludesTeams[]);

      const response = await chai.request(app).get('/leaderboard/away');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.eql(faekLeaderBoardAway);

      (Match.findAll as Sinon.SinonStub).restore();
    });
  });
});
