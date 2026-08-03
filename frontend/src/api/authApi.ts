// const BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(username: string, password: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        });

    if(!response.ok){
        throw new Error("Invalid username or password");
        }

    const data = await response.json();
    return data.token;
}

export async function register(username: string, email:string, password: string):
Promise<void> {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password }),
        });

    if(!response.ok){
        throw new Error("Registration failed. Username or email may already be taken.");
        }
    }