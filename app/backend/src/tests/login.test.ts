import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import UserModel from '../database/models/User';
import usersFake from './mocks/users';
import loginFake from './mocks/logins';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota POST /login', () => {
  describe('Verifica se o login é realizado com sucesso', () => {
    let loginResponse: Response;
    const userResponse = usersFake[0] as UserModel;

    before(() => {
      sinon.stub(UserModel, 'findOne').resolves(userResponse);
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('Retorna um status code "200" e um objeto com a propriedade "token"', async () => {
      loginResponse = await chai.request(app).post('/login').send(loginFake.Valid);
      expect(loginResponse).to.have.status(200);
      expect(loginResponse.body).to.have.property('token');
    });
  });
});
