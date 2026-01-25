jest.mock("../src/config/db.js", () => ({
    __esModule: true,
    default: {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }
    }
}))

jest.mock('bcrypt', () => ({
    hash: jest.fn(), 
    compare: jest.fn(), 
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}))

import prisma from "../src/config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { loginController, registerController } from "../src/users/users.controllers.js";

const mockReq = (body = {}, params = {}) => ({ body, params })
const mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('Login Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('loginController returns access token and expiration time', async () => {
        const mockReqData = {
            username: "some_user",
            password: "some_password"
        }
        const mockUser = {
            id: 1,
            username: "some_user",
            password: "hashed_password"
        }
        
        // Mock bcrypt and jwt signing
        prisma.user.findUnique.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockReturnValue("mock_token")

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await loginController(req, res)

        // Check bcrypt comparison and jwt signing
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { username: "some_user" }
        })
        expect(bcrypt.compare).toHaveBeenCalledWith("some_passsword", "hashed_password")
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 1 },
            expect.any(String),
            { expiresIn: "1h" }
        );

        // Check response body
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            access_token: "mock_token",
            expiresIn: 3600000, // 1 hour in milliseconds
        })
    })

    test("loginController returns invalid credentials on username mismatch", async () => {
        const mockReqData = {
            username: "some_user",
            password: "some_password"
        }

        // User with username "some_user" will NOT be found
        prisma.user.findUnique.mockResolvedValue(null)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await loginController(req, res)

        // Check user was looked for
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { username: "some_user" }
        })

        // Check response body has invalid credentials error
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            "error": "Request has invalid credentials"
        })
    })

    test("loginController returns invalid credentials on password mismatch", async () => {
        const mockReqData = {
            username: "some_user",
            password: "some_password"
        }
        const mockUser = {
            id: 1,
            username: "some_user",
            password: "hashed_password"
        }

        // Mock bcrypt comparison
        prisma.user.findUnique.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(false)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await loginController(req, res)

        expect(bcrypt.compare).toHaveBeenCalledWith("some_password", "hashed_password")

        // Check response body has invalid credentials error
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            "error": "Request has invalid credentials"
        })
    })
})

describe('Register Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("registerController creates new user and returns success message", async () => {
        const mockReqData = {
            username: "new_user",
            password: "new_password"
        }
        const mockCreatedUser = {
            id: 1,
            username: "new_user",
            password: "hashed_new_password"
        }

        // Mock bcrypt hashing and prisma create
        bcrypt.hash.mockResolvedValue("hashed_new_password")
        prisma.user.create.mockResolvedValue(mockCreatedUser)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await registerController(req, res)

        // Ensure password is hashed properly
        expect(bcrypt.hash).toHaveBeenCalledWith("new_password", 10)

        // Username and password will be only expected user fields for now
        expect(prisma.user.create).toHaveBeenCalledWith({
            username: "new_user",
            password: "hashed_new_password",
        })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            username: "new_user",
            message: "User new_user registered successfully",
        })
    })

    test("registerController returns error message on duplicate username (username must be unique)", async () => {
        const mockReqData = {
            username: "existing_user",
            password: "some_password",
        }
        const mockIdenticalUser = {
            id: 1,
            username: "existing_user",
            password: "hashed_password"
        }
        const errorMessage = "User with username 'existing_user' already exists. Please choose a different username."

        // Mock prisma findUnique to retrieve identical user
        prisma.user.findUnique.mockResolvedValue(mockIdenticalUser)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await registerController(req, res)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { username: "existing_user" }
        })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: errorMessage
        })
    })
})