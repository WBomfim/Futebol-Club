import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import Match from '../database/models/Match';
import matchesFake from './mocks/matches';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testa as rotas do endpoint /matches', () => {});
