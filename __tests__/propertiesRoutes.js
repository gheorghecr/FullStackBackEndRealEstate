/* eslint-disable quotes */
/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');
const auth = require('../controllers/auth');

const usernameGeral = 'gheorghe1';
const passwordGeral = 'password';

beforeAll(async (done) => {
    const res = await request(app.callback())
        .post('/api/users')
        .field('firstName', 'Gheorghe')
        .field('lastName', 'craciun')
        .field('password', 'password')
        .field('username', 'gheorghe1')
        .field('email', 'unique_email222@example.com')
        .field('sign_up_code', 'we_sell_houses_agent');
    done();
});

describe('Post a new property', () => {
    it('should create a new property', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);
    });
});

describe('Post a new property and Delete it', () => {
    it('should delete a property', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .delete(`/api/properties/${res.body.id}`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('deleted', true);
    });
});

describe('Post a new property and Update it', () => {
    it('should update a property', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .put(`/api/properties/${res.body.id}`)
            .auth(usernameGeral, passwordGeral)
            .field('price', '10000')
            .field('title', 'Title for Property Update')
            .field('description', 'Description for property Update')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('updated', true);
    });
});

describe('Delete a property with normal account', () => {
    it('should fail, as only admin can delete', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        await request(app.callback())
            .post('/api/users')
            .field('firstName', 'Gheorghe')
            .field('lastName', 'craciun')
            .field('password', 'password')
            .field('username', 'gheorgheNoAdmin')
            .field('email', 'unique_email22222@example.com');

        const res2 = await request(app.callback())
            .delete(`/api/properties/${res.body.id}`)
            .auth('gheorgheNoAdmin', 'password');
        expect(res2.statusCode).toEqual(403);
    });
});

describe('Get property by ID', () => {
    it('should receive the property details back', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/properties/${res.body.id}`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
    });
});

describe('Get property by ID with wrong propertyID', () => {
    it('should fail and give back 404', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/properties/9999999`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(404);
    });
});

describe('Get property all properties', () => {
    it('should get a list of properties back', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/properties`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
    });
});

describe('Get property all properties for Admin', () => {
    it('should get a list of properties (admin) back', async () => {
        const res = await request(app.callback())
            .post('/api/properties')
            .auth(usernameGeral, passwordGeral)
            .field('price', '1000')
            .field('title', 'Title for Property')
            .field('description', 'Description for property')
            .field('status', 'For Sale')
            .field('location', '142 Gulson Road');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/properties/adminview`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
    });
});
