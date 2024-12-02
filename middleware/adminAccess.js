const { AdminAccess } = require("../models");

const checkAdminAccess = async (req, res, next) => {
  const accessKey = req.headers["x-admin-key"];

  if (!accessKey) {
    return res.status(401).json({ message: "Admin access key is required" });
  }

  try {
    const adminAccess = await AdminAccess.findOne({
      where: { access_key: accessKey },
    });

    if (!adminAccess) {
      return res.status(403).json({ message: "Invalid admin access key" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkAdminAccess;
