jest.mock("../src/config/db.js", () => ({
    __esModule: true,
    default: {
            vulnerability: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }
    }
}))

import prisma from "../src/config/db.js";
import { getAllVulnerabilities, getVulnerabilityById } from "../src/vulnerabilities/vulnerabilities.controllers";

const mockRequest = (body = {}, params = {}) => ({ body, params })
const mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('Vulnerability Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('getAllVulnerabilities returns list of all vulnerabilities in db', async () => {
        const mockVulnerabilityGroup = {
            id: 1,
            name: 'Injection Stuff',
        }
        const mockData = [
            { 
                id: 1, 
                description: 'SQL Injection', 
                vulnerabilityGroupId: mockVulnerabilityGroup.id,
                vulnerabilityGroup: mockVulnerabilityGroup
            }
        ]
        prisma.vulnerability.findMany.mockResolvedValue(mockData)

        const req = mockRequest()
        const res = mockRes()

        await getAllVulnerabilities(req, res)

        expect(prisma.vulnerability.findMany).toHaveBeenCalledWith({
            include: { vulnerabilityGroup: true },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    })

    test('getVulnerabilityById returns vulnerability from db', async () => {
        const mockVulnerabilityGroup = {
            id: 1,
            name: 'Injection Stuff',
        }
        const mockData = { 
            id: 1, 
            description: 'SQL Injection', 
            vulnerabilityGroupId: mockVulnerabilityGroup.id,
            vulnerabilityGroup: mockVulnerabilityGroup
        }

        prisma.vulnerability.findUnique.mockResolvedValue(mockData)
        
        const req = mockRequest({}, { id: '1' })
        const res = mockRes()

        await getVulnerabilityById(req, res)

        expect(prisma.vulnerability.findUnique).toHaveBeenCalledWith({
            include: { vulnerabilityGroup: true },
            where: { id: 1 }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
        
    })
})