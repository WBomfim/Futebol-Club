import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import * as jwt from 'jsonwebtoken';
import UserModel from '../database/models/User';
import usersFake from './mocks/users';
import loginFake from './mocks/logins';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota /login', () => {
  let response: Response;
  const userResponse = usersFake[0] as UserModel;

  describe('Verifica se o login é realizado com sucesso', () => {
    it('Retorna um status code "200" e um objeto com a propriedade "token"', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userResponse);

      response = await chai.request(app).post('/login').send(loginFake.Valid);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token');
  
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  });

  describe('Verifica os erros ao tentar um login com as informações inválidas', () => {
    it('Retorna um status code "401" e um objeto com a mensagem "Incorrect email or password" ao passar um email inválido', async () => {
      sinon.stub(UserModel, 'findOne').resolves(null);

      response = await chai.request(app).post('/login').send(loginFake.InvalidEmail);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Incorrect email or password');

      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('Retorna um status code "401" e um objeto com a mensagem "Incorrect email or password" ao passar uma senha inválida', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userResponse);

      response = await chai.request(app).post('/login').send(loginFake.InvalidPassword);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Incorrect email or password');
      
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
      response = await chai.request(app).post('/login').send(loginFake.emptyEmail);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

    it('Retorna um status code "400" e um objeto com a mensagem "All fields must be filled" ao passar uma senha vazia', async () => {
      response = await chai.request(app).post('/login').send(loginFake.emptyPassword);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Verifica o retorno da role do usuário ao acessar a rota /login/validate com o token', () => {
    describe('Verifica o retorno quando o token é valido', () => {
      const payload = { id: 1, username: 'Admin'};
  
      it('Retorna um status code "200" e um objeto com a propriedade "role"', async () => {
        sinon.stub(jwt, 'verify').resolves(payload);
        sinon.stub(UserModel, 'findOne').resolves(userResponse);

        response = await chai.request(app).get('/login/validate').set('Authorization', 'tokentestes');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('role');
        expect(response.body.role).to.be.equal('admin');

        (jwt.verify as sinon.SinonStub).restore();
        (UserModel.findOne as sinon.SinonStub).restore();
      });
    });

    describe('Verifica o retorno quando o token é invalido ou inexistente', () => {
      before(() => {
        sinon.stub(jwt, 'verify').throws();
      });

      after(() => {
        (jwt.verify as sinon.SinonStub).restore();
      });

      it('Retorna um status code "401" com a mensagem "Invalid token"', async () => {
        response = await chai.request(app).get('/login/validate').set('Authorization', 'tokentestes');
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid token');
      });

      it('Retorna um status code "401" com a mensagem "Token not found"', async () => {
        response = await chai.request(app).get('/login/validate');
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Token not found');
      });
    });
  });
});
