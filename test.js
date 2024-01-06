const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const app = require('../testcases/src/app');  

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  it('should get all records with a GET request', async () => {
    const res = await chai.request(app).get('/api/users');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
     
  });

  it('should create a new object with a POST request', async () => {
    const newUser = {
      username: 'NewUser',
      age: 28,
      hobbies: ['NewHobby1', 'NewHobby2'],
    };

    const res = await chai.request(app).post('/api/users').send(newUser);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
  });

  describe('API Tests', () => {
    let userId;

    it('should get a created record by its id', async () => {
      const res = await chai.request(app).get('/api/users');
      userId = res.body[0].id;  
      expect(res).to.have.status(200);
      expect(res.body[0]).to.have.property('id');
    });

    it('should update the created record with a PUT request', async () => {
      const updatedData = {
        username: 'UpdatedUser',
        age: 30,
        hobbies: ['UpdatedHobby1', 'UpdatedHobby2'],
      };

      const res = await chai.request(app).put(`/api/users/${userId}`).send(updatedData);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id').equal(userId);
    });

    it('should delete the created record with a DELETE request', async () => {
      const res = await chai.request(app).delete(`/api/users/${userId}`);
      expect(res).to.have.status(204);
    });

    it('should not get the deleted record by its id', async () => {
      const res = await chai.request(app).get(`/api/users/${userId}`);
      expect(res).to.have.status(404);
    });
  });
});
