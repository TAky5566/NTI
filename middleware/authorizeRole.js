// Middleware to authorize based on user role
const authorizeRole = (role) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      next({ message: 'Unauthorized', status: 401 });
      return;
    }
    const userRole = user.role;

    if (userRole !== role) {
      next({ message: "You don't have permission to access this resource", status: 403 });
      return;
    }
    next();
  };
};

export default authorizeRole;
