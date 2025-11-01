/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorProvider } from "../context/ErrorProvider";
import { useGlobalError } from "../context/useGlobalError";
import { ErrorBanner } from "../components/ErrorBanner";

function TestComponent() {
    const { error, setError } = useGlobalError();

    return (
        <div>
            <button onClick={() => setError("Test error")}>Trigger Error</button>
            <p>{error ?? "No error"}</p>
        </div>
    );
}

test("ErrorProvider provides error state and setter", () => {
    render(
        <ErrorProvider>
            <TestComponent />
        </ErrorProvider>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger Error"));

    expect(screen.getByText("Test error")).toBeInTheDocument();
});

test("ErrorBanner displays and clears error on click", () => {
    render(
        <ErrorProvider>
            <TestComponent />
            <ErrorBanner />
        </ErrorProvider>
    );

    // No error initially
    expect(screen.queryByTestId("error-banner")).not.toBeInTheDocument();

    // Trigger error
    fireEvent.click(screen.getByText("Trigger Error"));

    // Banner is shown with error message
    const banner = screen.getByTestId("error-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent("Test error");

    // Click to clear error
    fireEvent.click(banner);

    // Banner disappeared
    expect(screen.queryByTestId("error-banner")).not.toBeInTheDocument();
});
