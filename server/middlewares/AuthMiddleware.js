import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;
    if(!token){
        return response.status(401).send("Unauthorized: token missing");
    }
    jwt.verify(token, process.env.JWT_KEY, async(err, payload) => {
        if(err) return response.status(401).send("Token invalid");
        request.userId = payload.userId;
        next();
    })
}