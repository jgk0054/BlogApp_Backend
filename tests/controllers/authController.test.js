const authController = require('../../controllers/authController');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpMocks = require('node-mocks-http');

// Mock data for tests
const mockUser = {
    id: 1,
    username: "testUser",
    password: "testPassword",
    authorName: "Author Name",
    authorURL: "http://author.url",
    avatarURL: "http://avatar.url",
    role: "commenter"
};

const mockReq = httpMocks.createRequest();
const mockRes = httpMocks.createResponse();
let mockNext;

describe('Auth Controller', () => {
    // Before each test, setup mock database interactions
    beforeEach(() => {
        jest.clearAllMocks();
        mockNext = jest.fn();
    });

    test('login - should return token and user details', async () => {
        User.findUserByUsername = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue("mockToken");

        mockReq.body = { username: mockUser.username, password: mockUser.password };

        await authController.login(mockReq, mockRes, mockNext);

        expect(User.findUserByUsername).toBeCalledWith(mockUser.username);
        expect(bcrypt.compare).toBeCalledWith(mockUser.password, mockUser.password);
        expect(jwt.sign).toBeCalled();
        expect(mockRes._getData()).toEqual({ token: "mockToken", user: expect.any(Object) });
    });

    test('register - should return new user details', async () => {
        User.findUserByUsername = jest.fn().mockResolvedValue(null);
        User.createUser = jest.fn().mockResolvedValue(mockUser);

        mockReq.body = { username: "newUser", password: "newPassword", role: "commenter", author: {name: "test author"} };

        await authController.register(mockReq, mockRes, mockNext);

        expect(User.findUserByUsername).toBeCalledWith("newUser");
        expect(User.createUser).toBeCalled();
        expect(mockRes._getData()).toEqual(mockUser);
    });

    test('getUserById - should return user details', async () => {
        User.findById = jest.fn().mockResolvedValue(mockUser);

        mockReq.params = { id: mockUser.id };

        await authController.getUserById(mockReq, mockRes, mockNext);
        expect(User.findById).toBeCalledWith(mockUser.id);
        expect(mockRes._getData()).toEqual(mockUser);
    });
});