const API_URL = "http://localhost:8000/api/auth";

export const registrarUsuario = async (nombre: string, username: string, password: string) => {
    const response = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar el usuario");
    }

    return response.json();
};
export const loginUser = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }

    return await response.json(); // Devuelve { id, nombre, username }
};