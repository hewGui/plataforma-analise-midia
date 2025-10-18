 
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