/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');

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
            .auth('testAD', 'testPassword');
        expect(res.statusCode).toEqual(201);
        //expect(res.body).toHaveProperty('created', true);
    });
});
