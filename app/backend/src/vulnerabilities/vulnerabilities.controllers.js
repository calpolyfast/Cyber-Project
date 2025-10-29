import prisma from "../config/db.js";

export const getAllVulnerabilities = async (req, res) => {
  try {
    const vulns = await prisma.vulnerability.findMany({
      include: { vulnerabilityGroup: true },
    });
    res.status(200).json(vulns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVulnerabilityById = async (req, res) => {
    try {
        const vuln = await prisma.vulnerability.findUnique({
            where: { id: Number(req.params.id)}
        })

        if(!vuln) {
            return res.status(404).json({ error: 'Vulnerability not found' })
        }
        res.status(200).json(vuln)
    }
    catch(err){
        res.status(500).json({ error: err.message})
    }
}

export const createVulnerability = async (req, res) => {
  try {
    const { description, vulnerabilityGroupId } = req.body;
    const vuln = await prisma.vulnerability.create({
      data: { description, vulnerabilityGroupId: Number(vulnerabilityGroupId) },
    });
    res.status(201).json(vuln);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVulnerability = async (req, res) => {
  try {
    await prisma.vulnerability.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).json({ message: 'Vulnerability deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};