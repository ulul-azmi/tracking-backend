const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const {
  login,
  createAdmin,
  clearUser,
  dummyExpense,
  clearExpense,
  bulkCreateExpense,
} = require('../helpers/test');

const app = require('../app');

chai.use(chaiHttp);

describe('Expense Testing', () => {
  let admin;
  let adminToken;
  let userToken;

  before(async () => {
    await clearUser();
    await clearExpense();
    const { token, admin: adminData } = await createAdmin();
    adminToken = token;
    admin = adminData;

    const { token: serverToken } = await login();
    userToken = serverToken;
  });

  describe('Creating new Expense', () => {
    it('should return 201 when admin creating new expense', async () => {
      const expense = dummyExpense();

      const response = await chai
        .request(app)
        .post('/expenses')
        .send(expense)
        .set('token', adminToken);

      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.haveOwnProperty('name');
      expect(response.body).to.haveOwnProperty('amount');
      expect(response.body).to.haveOwnProperty('date');
      expect(response.body).to.haveOwnProperty('description');
      expect(response.body).to.haveOwnProperty('pictures');
      expect(response.body).to.haveOwnProperty('submitBy');
      expect(response.body.name).to.be.equal(expense.name);
      expect(response.body.amount).to.be.equal(expense.amount);
      expect(response.body.date).to.be.include(expense.date);
      expect(response.body.description).to.be.equal(expense.description);
      expect(response.body.pictures).to.be.an('array');
      expect(response.body.submitBy).to.be.equal(admin._id.toString());
    });

    it('should return 401 when creating expense with member token', async () => {
      const expense = dummyExpense();

      const response = await chai
        .request(app)
        .post('/expenses')
        .send(expense)
        .set('token', userToken);

      expect(response).to.have.status(401);
      expect(response.body.message).to.be.equal('unauthorized');
    });
  });

  describe('Fetching all income', () => {
    before(async () => clearExpense());

    it('should return summaries of all income', async () => {
      await bulkCreateExpense();

      const response = await chai.request(app).get('/expenses/summary');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.summary).to.be.equal(60000);
    });

    it('should return all expense that already exist', async () => {
      const response = await chai.request(app).get('/expenses');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(3);
    });

    it('should return all expense that already exist with correct limit', async () => {
      const response = await chai.request(app).get('/expenses?limit=1');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(1);
    });
  });

  describe('Revised income', () => {
    let allExpense = [];

    before(async () => {
      await clearExpense();
      allExpense = await bulkCreateExpense();
    });

    it('should return 200 when revised expense', async () => {
      const [firstExpense] = allExpense;

      const revised = {
        amount: 10000,
        reason: 'Tambah tukang parkir',
      };

      const response = await chai
        .request(app)
        .patch(`/expenses/revised/${firstExpense._id.toString()}`)
        .send(revised)
        .set('token', adminToken);

      expect(response).to.have.status(200);
      expect(response.body.logs).to.be.an('array');
      expect(response.body.logs[0].oldAmount).to.be.equal(firstExpense.amount);
      expect(response.body.logs[0].newAmount).to.be.equal(revised.amount);
      expect(response.body.logs[0].reason).to.be.equal(revised.reason);
    });

    it('should return 401 when revised with regular token', async () => {
      const [firstExpense] = allExpense;

      const revised = {
        amount: 10000,
        reason: 'Tambah tukang parkir',
      };

      const response = await chai
        .request(app)
        .patch(`/expenses/revised/${firstExpense._id.toString()}`)
        .send(revised)
        .set('token', userToken);

      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('unauthorized');
    });
  });
});
