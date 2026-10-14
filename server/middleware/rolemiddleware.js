// Use after `protect` (it sets req.user = { id, role } from the JWT).
// Example: router.post("/", protect, restrictTo("interviewer"), handler)
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    next();
  };
};

export default restrictTo;