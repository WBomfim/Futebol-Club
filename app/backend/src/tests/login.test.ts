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
  const userResponse = usersFake[0] as UserModel;
  let loginResponse: Response;

  describe('Verifica se o login é realizado com sucesso', () => {

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

  describe('Verifica os erros ao tentar um login com as informações inválidas', () => {
    it('Retorna um status code "401" e um objeto com a mensagem "Incorrect email or password" ao passar um email inválido', async () => {
      sinon.stub(UserModel, 'findOne').resolves(null);
      loginResponse = await chai.request(app).post('/login').send(loginFake.InvalidEmail);
      expect(loginResponse).to.have.status(401);
      expect(loginResponse.body).to.have.property('message');
      expect(loginResponse.body.message).to.be.equal('Incorrect email or password');
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('Retorna um status code "401" e um objeto com a mensagem "Incorrect email or password" ao passar uma senha inválida', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userResponse);
      loginResponse = await chai.request(app).post('/login').send(loginFake.InvalidPassword);
      expect(loginResponse).to.have.status(401);
      expect(loginResponse.body).to.have.property('message');
      expect(loginResponse.body.message).to.be.equal('Incorrect email or password');
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  });

  describe('Verifica os erros ao tentar um login com as informações vazias', () => {
    before(() => {
      sinon.stub(UserModel, 'findOne').resolves(userResponse);
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('Retorna um status code "400" e um objeto com a mensagem "All fields must be filled" ao passar um email vazio', async () => {
      loginResponse = await chai.request(app).post('/login').send(loginFake.emptyEmail);
      expect(loginResponse).to.have.status(400);
      expect(loginResponse.body).to.have.property('message');
      expect(loginResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('Retorna um status code "400" e um objeto com a mensagem "All fields must be filled" ao passar uma senha vazia', async () => {
      loginResponse = await chai.request(app).post('/login').send(loginFake.emptyPassword);
      expect(loginResponse).to.have.status(400);
      expect(loginResponse.body).to.have.property('message');
      expect(loginResponse.body.message).to.be.equal('All fields must be filled');
    });
  });
});
