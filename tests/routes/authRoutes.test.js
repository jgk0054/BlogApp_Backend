const request = require('supertest');
const app = require('../../server');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock data for tests
const mockUser = {
    id: 1,
    username: "testUser",
    password: "testPassword",
    authorName: "Author Name",
    authorURL: "http://author.url",
    avatarURL: "http://avatar.url",
    role: "user"
};

describe('Auth Routes', () => {
    // Before each test, setup mock database interactions
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/auth/login - successful login', async () => {
        const salt = bcrypt.genSaltSync(10);

        let returnMockUser = JSON.parse(JSON.stringify(mockUser));
        returnMockUser.password = bcrypt.hashSync(mockUser.password, salt);
        User.findUserByUsername = jest.fn().mockResolvedValue(returnMockUser);
        const token = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: mockUser.username, password: mockUser.password });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/register - successful registration', async () => {
        User.findUserByUsername = jest.fn().mockResolvedValue(null);
        User.createUser = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: "newUser",
                password: "newPassword",
                author: { name: "New Author", url: "http://new.author.url" },
                role: "user"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUser);
    });

    test('GET /api/auth/user/:id - fetch user by ID', async () => {
        User.findById = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app)
            .get(`/api/auth/user/${mockUser.id}`)
            .set('Authorization', `Bearer ${jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET)}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUser);
    });
});