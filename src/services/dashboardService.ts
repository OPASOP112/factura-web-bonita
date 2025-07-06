// src/services/dashboardService.ts
export const getDashboardStats = async () => {
    const response = await fetch("http://localhost:8000/api/stats");

    if (!response.ok) {
        throw new Error("Error al obtener las estadísticas");
    }

    return await response.json(); // { clientes: 10, empresas: 5, productos: 20, documentos: 15 }
};
