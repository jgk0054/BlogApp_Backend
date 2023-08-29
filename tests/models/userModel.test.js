const db = require('../../db');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
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

describe('User Model', () => {
    // Before each test, setup mock database interactions
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('findUserByUsername - Should return user object', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [mockUser] });
        
        const user = await User.findUserByUsername(mockUser.username);
        expect(db.query).toBeCalledWith('SELECT * FROM users WHERE username = $1', [mockUser.username]);
        expect(user).toEqual(mockUser);
    });

    test('findUserByUsername - Should return null', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [] });
        
        const user = await User.findUserByUsername("nonexistentUser");
        
        expect(db.query).toBeCalledWith('SELECT * FROM users WHERE username = $1', ["nonexistentUser"]);
        expect(user).toBeNull();
    });

    test('findById - Should return user object', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [mockUser] });
        
        const user = await User.findById(mockUser.id);
        
        expect(db.query).toBeCalledWith('SELECT * FROM users WHERE id = $1', [mockUser.id]);
        expect(user).toEqual(mockUser);
    });

    test('findById - Should return null', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [] });
        
        const user = await User.findById(999);
        
        expect(db.query).toBeCalledWith('SELECT * FROM users WHERE id = $1', [999]);
        expect(user).toBeNull();
    });

    test('createUser - Should insert new user', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [mockUser] });
        
        const user = await User.createUser(
            mockUser.username,
            mockUser.password,
            mockUser.authorName,
            mockUser.authorURL,
            mockUser.avatarURL,
            mockUser.role
        );
        
        expect(db.query).toBeCalled();
        expect(user).toEqual(mockUser);
    });

    test('createUser - Should hash password', async () => {
        db.query = jest.fn().mockResolvedValue({ rows: [mockUser] });
        
        // Mock bcrypt.hash to return a hashed password and also to be called with a number for salt rounds
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mockUser.password, salt);
        bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
        
        const user = await User.createUser(
            mockUser.username,
            mockUser.password,
            mockUser.authorName,
            mockUser.authorURL,
            mockUser.avatarURL,
            mockUser.role
        );
        
        expect(user).toEqual(mockUser);
    });
});

