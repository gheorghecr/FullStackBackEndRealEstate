/* eslint-disable quotes */
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
        .field('email', 'unique_email2@example.com')
        .field('sign_up_code', 'we_sell_houses_agent');
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

describe('Get a list of all users', () => {
    it('should return a list of users', async () => {
        const res = await request(app.callback())
            .get('/api/users')
            .auth('gheorghe', 'password');
        expect(res.statusCode).toEqual(200);
    });
});

describe('Get a list of all users', () => {
    it('should fail as user is not registered', async () => {
        const res = await request(app.callback())
            .get('/api/users')
            .auth('giko1997', 'password');
        expect(res.statusCode).toEqual(401);
    });
});

describe('Register and then delete account', () => {
    it('should register an account and then delete it', async () => {
        const res = await request(app.callback())
            .post('/api/users')
            .field('firstName', 'unique1111')
            .field('lastName', 'craciun')
            .field('password', 'password')
            .field('username', 'uni11111')
            .field('email', 'unique_email1111@example.com');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');

        const res2 = await request(app.callback())
            .delete(`/api/users/${res.body.id}`)
            .auth('gheorghe', 'password');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('deleted', true);
    });
});
