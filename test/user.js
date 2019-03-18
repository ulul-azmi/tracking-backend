const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const { clearUser, generateUser } = require('../helpers/test');

const app = require('../app');

chai.use(chaiHttp);

describe('User Testing', () => {
  before(async () => {
    await clearUser();
  });

  after(async () => {
    await clearUser();
  });

  describe('Every user can register to our application', () => {
    it('should return 201 and create a new data in the database when user register to our application with role member', async () => {
      const user = generateUser();
      const response = await chai
        .request(app)
        .post('/users/register')
        .send(user);

      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body.email).to.be.equal(user.email);
      expect(response.body.profilePicture).to.be.equal(user.profilePicture);
      expect(response.body.name).to.be.equal(user.name);
      expect(response.body.phoneNumber).to.be.equal(user.phoneNumber);
      expect(response.body.instagram).to.be.equal(user.instagram);
      expect(response.body.role).to.be.equal('member');
      expect(response.body.password).not.to.be.equal(user.password);
    });

    it('should return 422 when validation failed when register with invalid data', async () => {
      const user = {};

      const response = await chai
        .request(app)
        .post('/users/register')
        .send(user);

      expect(response).to.have.status(422);
      expect(response.body).to.haveOwnProperty('errors');
    });
  });

  describe('Every user can login to our application', () => {
    it('should return the jwt token for the authenticated user', async () => {
      const user = {
        email: 'kosasih@mail.com',
        password: '123456',
      };
      const response = await chai
        .request(app)
        .post('/users/login')
        .send(user);

      expect(response).to.have.status(200);
      expect(response.body).to.haveOwnProperty('token');
      expect(response.body).to.haveOwnProperty('user');
      expect(response.body.user).to.haveOwnProperty('userId');
      expect(response.body.user).to.haveOwnProperty('role');
      expect(response.body.user).to.haveOwnProperty('profilePicture');
      expect(response.body.user).to.haveOwnProperty('email');
    });

    it('should return 401 when login with invalid credentials', async () => {
      const user = {
        email: 'kosasih@mail.com',
        password: '654321',
      };

      const response = await chai
        .request(app)
        .post('/users/login')
        .send(user);

      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('unauthorized');

      const user2 = {
        email: 'kosasih_non_existence@mail.com',
        password: '654321',
      };

      const response2 = await chai
        .request(app)
        .post('/users/login')
        .send(user2);
      expect(response2).to.have.status(401);
      expect(response2.body).to.haveOwnProperty('message');
      expect(response2.body.message).to.be.equal('unauthorized');
    });
  });
});
