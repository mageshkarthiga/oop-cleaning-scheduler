"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RadioButton } from 'primereact/radiobutton';

export function SignIn() {
    const [error, setError] = useState(null);
    const [role, setRole] = useState('Admin'); // Default role
    const router = useRouter();

    const credentialsAction = async (formData) => {
        const data = {
            ...Object.fromEntries(formData),
            role: role,
        };

        // Call your API to verify credentials
        try {
            const response = await axios.post('/api/verify-credentials', {
                username: data.username,
                password: data.password,
                role: data.role,
            });

            if (response.data.valid) {
                // If credentials are valid, sign in with NextAuth
                const signInResponse = await signIn("credentials", {
                    username: data.username,
                    password: data.password,
                    redirect: false,
                });

                if (signInResponse?.error) {
                    setError("Invalid username or password");
                } else {
                    // Role-based API call or redirect can happen here
                    router.push('/dashboard'); // Redirect to a common dashboard
                }
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("An error occurred during verification");
            console.error(err);
        }
    };

    return (
        <div
            className="flex align-items-center justify-content-center"
            style={{ minHeight: "100vh", backgroundColor: "var(--primary-color)" }}
        >
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <img
                    src="https://i0.wp.com/homecleaningsg.com/wp-content/uploads/2022/12/header-logo.webp?fit=249%2C47&ssl=1"
                    alt="hyper"
                    height={50}
                    className="m-auto p-5"
                />
                <form
                    className="p-fluid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        credentialsAction(formData);
                    }}
                >
                    <div className="field">
                        <label htmlFor="credentials-username">Username</label>
                        <InputText
                            id="credentials-username"
                            name="username"
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="credentials-password">Password</label>
                        <InputText
                            id="credentials-password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="field">
                        <label>Role</label>
                        <div>
                            <RadioButton
                                inputId="admin"
                                name="role"
                                value="Admin"
                                onChange={(e) => setRole(e.value)}
                                checked={role === 'Admin'}
                            />
                            <label htmlFor="admin">Admin</label>
                            <RadioButton
                                inputId="worker"
                                name="role"
                                value="Worker"
                                onChange={(e) => setRole(e.value)}
                                checked={role === 'Worker'}
                            />
                            <label htmlFor="worker">Worker</label>
                        </div>
                    </div>
                    {error && <Message severity="error" text={error} />}
                    <Button
                        type="submit"
                        label="Sign In"
                        icon="pi pi-user"
                        className="w-full" // Full-width button
                    />
                </form>
            </div>
        </div>
    );
}
