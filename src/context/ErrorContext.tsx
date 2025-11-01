import { createContext } from "react";

export type ErrorContextType = {
    error: string | null;
    setError: (err: string | null) => void;
};

export const ErrorContext = createContext<ErrorContextType>({
    error: null,
    setError: () => { }
});
