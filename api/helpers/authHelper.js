const jwt = require("jsonwebtoken");

module.exports = {
  getCurrentUser: (req) => {
    try {
      // Ejemplo para JWT en headers
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("No token provided");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw new Error("Authentication failed");
    }
  },
};
