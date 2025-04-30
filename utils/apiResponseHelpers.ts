export function isApiSuccess(response: any): boolean {
    return response?.data?.status === "success";
}

export function isApiError(response: any): boolean {
    return response?.data?.status === "error";
}

export function getApiMessage(response: any): string {
    return response?.data?.message || "Une erreur est survenue.";
}