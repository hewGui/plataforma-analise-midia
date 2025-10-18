 import { Request } from "express";

export interface RegisterUserBody{
    name?: string;
    email: string;
    password: string;
}

export interface LoginBody{
    email: string;
    password: string;
}

export interface JWTPayload{
    id: string;
}

export interface AuthenticatedRequest extends Request{
    userId?: string;
}