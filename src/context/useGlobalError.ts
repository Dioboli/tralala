// src/context/useGlobalError.ts
import { useContext } from "react";
import { ErrorContext } from "./ErrorContext";

export function useGlobalError() {
    return useContext(ErrorContext);
}
