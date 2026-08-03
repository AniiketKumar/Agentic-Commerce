// stub — full content to be typed in
export interface DecodedToken {
    sub: string;
    role: string;
    exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
        } catch {
            return null;
            }
    }