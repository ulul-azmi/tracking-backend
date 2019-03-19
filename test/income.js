const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

const {
  clearUser,
  login,
  clearIncome,
  User,
  dummyIncome,
  createAdmin,
  generateUser,
} = require('../helpers/test');
const app = require('../app');

chai.use(chaiHttp);

describe('Income Report', () => {
  let userToken;
  let user;
  let admin;
  const invalidUserToken = 'asdasdasdsa';
  const tenThousand = 10000;
  let adminToken = null;

  const incomeReport = {
    destination: 'BSM',
    image: '/',
    amount: tenThousand,
    date: '2019-03-22',
    meta: {
      anonymous: false,
      charity: false,
    },
  };

  before(async () => {
    await clearUser();
    await clearIncome();
    const response = await login();
    userToken = response.token;
    user = response.user;
    const { token, admin: adminData } = await createAdmin();
    adminToken = token;
    admin = adminData;
  });

  after(async () => {
    await clearUser();
    await clearIncome();
  });

  describe('Creating new income', () => {
    it('logged in user can create new income report', async () => {
      const response = await chai
        .request(app)
        .post('/incomes')
        .send(incomeReport)
        .set('token', userToken);

      expect(response).to.have.status(201);
      expect(response.body).to.haveOwnProperty('amount');
      expect(response.body).to.haveOwnProperty('status');
      expect(response.body).to.haveOwnProperty('destination');
      expect(response.body).to.haveOwnProperty('date');
      expect(response.body.meta).to.haveOwnProperty('anonymous');
      expect(response.body.meta).to.haveOwnProperty('charity');
      expect(response.body.meta).to.haveOwnProperty('fromGuest');

      expect(response.body.amount).to.be.equal(tenThousand);
      expect(response.body.status).to.be.equal('pending');
      expect(response.body.destination).to.be.equal(incomeReport.destination);
      expect(response.body.userId).to.be.equal(user._id.toString());
      expect(response.body.date).to.be.include(incomeReport.date);
      expect(response.body.meta.fromGuest).to.be.false;
      expect(response.body.meta.anonymous).to.be.false;
      expect(response.body.meta.charity).to.be.false;
    });

    it('guest user can create a new income report and make the guest authenticated by creating new data', async () => {
      const withUser = {
        ...incomeReport,
        user: { ...generateUser(), email: 'john@mail.com' },
      };
      const response = await chai
        .request(app)
        .post('/incomes')
        .send(withUser);

      const createdUser = await User.findOne({ email: withUser.user.email });

      expect(response).to.have.status(201);
      expect(response.body.meta).to.haveOwnProperty('fromGuest');
      expect(response.body.userId).to.be.equal(createdUser._id.toString());
      expect(response.body.meta.fromGuest).to.be.true;
    });

    it('guest user using existing email will use that email as identifier instead of creating new user', async () => {
      const existingUser = {
        ...incomeReport,
        user: { ...generateUser(), email: 'kosasih@mail.com' },
      };

      const response = await chai
        .request(app)
        .post('/incomes')
        .send(existingUser);

      const findUser = await User.findOne({ email: existingUser.user.email });

      expect(response).to.have.status(201);
      expect(response.body.meta).to.haveOwnProperty('fromGuest');
      expect(response.body.userId).to.be.equal(findUser._id.toString());
      expect(response.body.meta.fromGuest).to.be.true;
    });

    it('every user can set anonymous to true if they want', async () => {
      const anonymousUser = {
        ...incomeReport,
        meta: {
          ...incomeReport.meta,
          anonymous: true,
        },
      };

      const response = await chai
        .request(app)
        .post('/incomes')
        .send(anonymousUser)
        .set('token', userToken);

      expect(response).to.have.status(201);

      expect(response.body.meta).to.haveOwnProperty('anonymous');
      expect(response.body.meta.anonymous).to.be.true;
    });

    it('every user can set charity to true if they want', async () => {
      const anonymousUser = {
        ...incomeReport,
        meta: {
          ...incomeReport.meta,
          charity: true,
        },
      };

      const response = await chai
        .request(app)
        .post('/incomes')
        .send(anonymousUser)
        .set('token', userToken);

      expect(response).to.have.status(201);

      expect(response.body.meta).to.haveOwnProperty('charity');
      expect(response.body.meta.charity).to.be.true;
    });

    it('should return 401 when creating income with invalid token', async () => {
      const response = await chai
        .request(app)
        .post('/incomes')
        .send(incomeReport)
        .set('token', invalidUserToken);

      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('unauthorized');
    });
  });

  describe('Fetch all income report', () => {
    let allIncome = null;

    beforeEach(async () => {
      await clearIncome();
      allIncome = await dummyIncome(user._id);
    });

    after(async () => clearIncome());

    it('should return the correct amount of incomes exclude every 10% for each income that accept charity', async () => {
      const response = await chai.request(app).get('/incomes/summary');

      expect(response).to.have.status(200);
      expect(response.body).to.haveOwnProperty('amount');
      expect(response.body).to.haveOwnProperty('charity');
      expect(response.body.amount).to.be.equal(48000);
      expect(response.body.charity).to.be.equal(2000);
    });

    it('should return the latest 10 income report', async () => {
      const response = await chai.request(app).get('/incomes?limit=10');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(allIncome.length);
      expect(response.body[0].userId).to.haveOwnProperty('name');
      expect(response.body[0].userId.name).to.be.equal('kosasih');
    });

    it('should unpopulate data for user that choose to be anonymous', async () => {
      const response = await chai.request(app).get('/incomes?limit=10');
      const anonymousData = allIncome[2];

      expect(response).to.have.status(200);
      expect(response.body[2].userId).not.to.be.an('object');
      expect(response.body[2].userId).to.be.equal(user._id.toString());
      expect(response.body[2].income).to.be.equal(anonymousData.income);
    });

    it('should show all data when admin visit fetch all data', async () => {
      const response = await chai
        .request(app)
        .get('/incomes?limit=10')
        .set('token', adminToken);

      expect(response.body[0].userId).to.be.an('object');
      expect(response.body[2].userId).to.be.an('object');
    });
  });

  describe('Approving pending income report', () => {
    let allIncome = null;

    before(async () => {
      await clearIncome();
      allIncome = await dummyIncome(user._id);
    });

    it('every admin can approve any pending request', async () => {
      const pendingRequest = allIncome[3];

      const response = await chai
        .request(app)
        .patch(`/incomes/verify/${pendingRequest._id}`)
        .send({ status: 'done' })
        .set('token', adminToken);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('done');
      expect(response.body._id).to.be.equal(pendingRequest._id.toString());
      expect(response.body.approvedBy).to.be.equal(admin._id.toString());
    });

    it('should return 401 when unauthorized user try to approve income request', async () => {
      const pendingRequest = allIncome[3];

      const response = await chai
        .request(app)
        .patch(`/incomes/verify/${pendingRequest._id}`)
        .set('token', userToken);

      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('unauthorized');
    });

    it('should return 404 when approving invalid income id', async () => {
      const invalidId = user._id.toString();

      const response = await chai
        .request(app)
        .patch(`/incomes/verify/${invalidId}`)
        .set('token', adminToken);

      expect(response).to.have.status(404);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('invalid id');
    });

    it('every admin can reject any pending request', async () => {
      const pendingRequest = allIncome[3];

      const response = await chai
        .request(app)
        .patch(`/incomes/verify/${pendingRequest._id}`)
        .send({ status: 'rejected' })
        .set('token', adminToken);

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.be.equal('rejected');
      expect(response.body._id).to.be.equal(pendingRequest._id.toString());
    });
  });
});
