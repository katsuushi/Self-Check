export type ReturnData<T> =
    | { success: true; data: T }
    | { success: false; error: string; }
export type Success =
    | { success: true; }
    | { success: false; error: string; }
export type Result =
    | { success: true; data: string | Object; }
    | { success: false; error: string; }

