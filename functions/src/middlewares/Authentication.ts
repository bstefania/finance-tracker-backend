import { NextFunction } from 'express'
import { ApiError } from "./ErrorHandler"
import { HttpResponse } from "../types/General"
import admin from 'firebase-admin';
import { Request, Response } from 'express';

export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const unauthorizedStatusCode = HttpResponse.UNAUTHORIZED

  try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError(
          HttpResponse.UNAUTHORIZED,
          "Authorization header not provided!"
        )
      }
      if (!header.startsWith("Bearer ")) {
        throw new ApiError(
          HttpResponse.UNAUTHORIZED,
          "Only Bearer tokens are supported!"
        )
      }

      const token = header.substring(7, header.length)

      if (!token) {
        throw new ApiError(
          HttpResponse.UNAUTHORIZED,
          "'Unauthorized Header. Access Denied!"
        )
      }
      //reference => https://firebase.google.com/docs/auth/admin/manage-sessions
      const decodedToken = await admin.auth().verifyIdToken(token)
      if (decodedToken.uid) {
        req.headers.uid = decodedToken.uid;
      } else {
        new ApiError(unauthorizedStatusCode, "User not found!")
      }
      // if (!decodedToken.email_verified) {
      //   return res.status(401).send('Your email needs to be verified.')
      // }
      console.log(decodedToken)
      next();
  } catch (err: any) {
    let processedErr
    switch (err.code) {
      case 'auth/argument-error':
        // handle the case where the token argument is missing or invalid
        processedErr = new ApiError(unauthorizedStatusCode, "Invalid token!")
        break;
      case 'auth/id-token-expired':
        // handle the case where the token has expired
        processedErr = new ApiError(
          unauthorizedStatusCode,
          "The token has expired!"
        )
        break;
      case 'auth/id-token-revoked':
        // handle the case where the token has been revoked
        processedErr = new ApiError(unauthorizedStatusCode, "The token has been revoked!")
        break;
      case 'auth/invalid-argument':
        // handle the case where the token is malformed or has an incorrect signature
        processedErr = new ApiError(unauthorizedStatusCode, "Invalid token!")
        break;
      case 'auth/user-not-found':
        // handle the case where the user associated with the token does not exist
        processedErr = new ApiError(unauthorizedStatusCode, "User not found!")
        break;
      default:
        processedErr = err
    }
    next(processedErr)
  }
}
