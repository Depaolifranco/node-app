const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/configs');

const userOneId = new mongoose.Types.ObjectId();
const userOneSecondDeviceId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Javier',
  email: 'jsoriano@laborcorporativa.com.ar',
  password: 'abc123!!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, jwtSecret),
    },
    {
      token: jwt.sign({ _id: userOneSecondDeviceId }, jwtSecret),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should get an authenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get an user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should sign up a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Franco',
      email: 'fdepaoli@laborcorporativa.com.ar',
      password: 'h0ola',
    })
    .expect(201);
});

test('Should fail sign up because of repeated email', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Franco',
      email: userOne.email,
      password: 'h0ola',
    })
    .expect(400);
});

test('Should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test('Should fail login of non-existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'jsoriano@laborcorporativa.com.ar',
      password: 'abc1234!',
    })
    .expect(400);
});

test('Should update user data', async () => {
  const response = await request(app)
    .patch('/users/me')
    .send({
      email: 'fdepaoli@laborcorporativa.com.ar',
      name: 'Franco',
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body.name).toBe('Franco');
});

test('Should not update user data because of invalid parameter', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      email: 'fdepaoli@laborcorporativa.com.ar',
      name: 'Franco',
      location: 'Buenos Aires',
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400);
});

test('Should delete logged user', async () => {
  await request(app)
    .delete('/users')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not delete a user', async () => {
  await request(app).delete('/users').send().expect(401);
});

test('Should remove token form list', async () => {
  await request(app)
    .post('/users/logout')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user.tokens.some((x) => x.token === userOne.tokens[0].token)).toBe(false);
  expect(user.tokens.length).toBeGreaterThan(0);
});

test('Should not remove token form list', async () => {
  await request(app).post('/users/logout').send().expect(401);
});

test('Should remove all tokens form list', async () => {
  await request(app)
    .post('/users/logoutall')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user.tokens.length).toBe(0);
});

test('Should not remove all tokens form list', async () => {
  await request(app).post('/users/logoutall').send().expect(401);
});
