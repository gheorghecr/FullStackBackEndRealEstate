/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');

beforeAll(async (done) => {
    await request(app.callback())
        .post('/api/users')
        .field('firstName', 'Gheorghe')
        .field('lastName', 'craciun')
        .field('password', 'password')
        .field('username', 'gheorghe')
        .field('email', 'unique_email2@example.com');
    done();
});

describe('Post new user', () => {
    it('should create a new user', async () => {
        const res = await request(app.callback())
            .post('/api/users')
            .field('firstName', 'unique_112233')
            .field('lastName', 'craciun')
            .field('password', 'password')
            .field('username', 'giko1997')
            .field('email', 'unique_email@example.com');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);
    });
});

describe('Login', () => {
    it('Should login ', async () => {
        const res = await request(app.callback())
            .post('/api/users/login')
            .auth('gheorghe', 'password');
        expect(res.statusCode).toEqual(201);
    });
});

describe('Login with wrong username', () => {
    it('Should fail login ', async () => {
        const res = await request(app.callback())
            .post('/api/users/login')
            .auth('wrongID', 'password');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('errorMessage', 'Username does not exist');
    });
});

describe('Login with wrong password', () => {
    it('Should fail login ', async () => {
        const res = await request(app.callback())
            .post('/api/users/login')
            .auth('gheorghe', 'passee');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('errorMessage', 'Incorrect password');
    });
});
