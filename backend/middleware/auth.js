import jwt from "jsonwebtoken"

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production")
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" })
  }
}

export function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Admin access required" })
    }
    next()
  })
}
