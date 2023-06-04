import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};

// import jwt from 'jsonwebtoken';

// export const checkAuth = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1] || '';

//     console.log(req.headers.authorization);

//     if (token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.userId = decoded.id;
//             next();
//         } catch (error) {
//             return res.status(403).json({
//                 message: "No access",
//             });
//         }
//     } else {
//         return res.status(403).json({
//             message: "No access",
//         });
//     }
// };
