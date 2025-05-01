export function isApiSuccess(response: any): boolean {
    return response?.data && response.data.status === "success";
  }
  
  export function isApiError(response: any): boolean {
    return response?.data && response.data.status === "error";
  }
  
  export function getApiMessage(response: any): string {
    if (response?.data?.message) {
      return response.data.message;
    }
    return "Une erreur est survenue.";
  }