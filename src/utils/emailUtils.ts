// src/utils/emailUtils.ts
export function encodeEmail(email: string): string {
    return email.trim().toLowerCase()
        .replace(/[.#$/[\]@]/g, "_"); // remplace les caractères interdits Firestore par _
}
