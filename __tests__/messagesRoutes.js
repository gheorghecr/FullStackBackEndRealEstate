/* eslint-disable object-shorthand */
/* eslint-disable quotes */
/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../app');

const usernameGeral = 'gheorghe2';
const passwordGeral = 'password';
let propertyID;
let agentID;

beforeAll(async (done) => {
    const res = await request(app.callback())
        .post('/api/users')
        .field('firstName', 'Gheorghe')
        .field('lastName', 'craciun')
        .field('password', 'password')
        .field('username', 'gheorghe2')
        .field('email', 'unique2_email222@example.com')
        .field('sign_up_code', 'we_sell_houses_agent');
    agentID = res.body.id;

    const res2 = await request(app.callback())
        .post('/api/properties')
        .auth(usernameGeral, passwordGeral)
        .field('price', '1000')
        .field('title', 'Title for Property')
        .field('description', 'Description for property')
        .field('status', 'For Sale')
        .field('location', '142 Gulson Road');
    propertyID = res2.body.id;
    done();
});

describe('Post a new message', () => {
    it('should create a new message', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);
    });
});

describe('Post a new message And Archived', () => {
    it('should archive a message', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .put(`/api/messages/${res.body.id}`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('updated', true);
    });
});

describe('Post a new message And delete it', () => {
    it('should delete a message', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .delete(`/api/messages/${res.body.id}`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty('deleted', true);
    });
});

describe('Post a new message And delete it with wrong account', () => {
    it('should fail to delete message', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .delete(`/api/messages/${res.body.id}`)
            .auth('test', 'test');
        expect(res2.statusCode).toEqual(500);
    });
});

describe('Get agent messages', () => {
    it('should get a list of messages', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/messages/agent/${agentID}`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(200);
    });
});

describe('Get agent messages with wrong agentID', () => {
    it('should fail and give back 404', async () => {
        const res = await request(app.callback())
            .post('/api/messages')
            .auth(usernameGeral, passwordGeral)
            .send({
                fromEmail: 'unique2222@example.com',
                fromName: 'Title for Property',
                agentID: agentID,
                propertyID: propertyID,
                messageText: 'message in here',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('created', true);

        const res2 = await request(app.callback())
            .get(`/api/messages/agent/99999`)
            .auth(usernameGeral, passwordGeral);
        expect(res2.statusCode).toEqual(404);
    });
});
