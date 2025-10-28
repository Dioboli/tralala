// src/utils/emailUtils.ts
export function encodeEmail(email: string): string {
    // Toujours tout en minuscule pour garantir l’unicité même sur GMAIL
    return encodeURIComponent(email.trim().toLowerCase());
}
