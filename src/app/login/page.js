"use client";
import React, { useState } from "react";
import axios from "axios";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

export default function Login() {
    const [checked, setChecked] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateEmail = (email) => {
        if (email.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        return false;
    };

    // Function to check if the email is valid and update the state
    const checkEmpty = () => {
        const isInvalid = !validateEmail(email);

        // Check if password is empty
        const isEmpty = password.length === 0;

        // Update state based on validations
        setInvalid(isInvalid);
        setEmpty(isEmpty);

        // Only show alert if there are no validation errors
        if (!isInvalid && !isEmpty) {
            axios.get('/api/v0.1/locations')
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const emailInput = (e) => {
        setEmail(e.target.value);
    };

    const passwordInput = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div
            className="flex align-items-center justify-content-center"
            style={{ minHeight: "100vh", backgroundColor: "var(--primary-color)" }}
        >
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img
                        src="https://i0.wp.com/homecleaningsg.com/wp-content/uploads/2022/12/header-logo.webp?fit=249%2C47&ssl=1"
                        alt="hyper"
                        height={50}
                        className="m-auto p-5"
                    />
                    <div className="text-900 text-3xl font-medium mb-3">
                        Login to Admin Console
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap align-items-center mb-3 gap-2">
                        <label htmlFor="email" className="font-bold">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="text"
                            placeholder="Email address"
                            className="w-full mb-3"
                            value={email}
                            onChange={emailInput}
                        />
                        {invalid && (
                            <Message severity="error" text="Email is invalid" />
                        )}
                    </div>

                    <div className="flex flex-wrap align-items-center mb-3 gap-2">
                        <label htmlFor="password" className="font-bold">
                            Password
                        </label>
                        <InputText
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="w-full mr-3"
                            value={password}
                            onChange={passwordInput}
                        />
                        {empty && (
                            <Message severity="error" text="Password is invalid" />
                        )}
                    </div>

                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox
                                id="rememberme"
                                onChange={(e) => setChecked(e.checked)}
                                checked={checked}
                                className="mr-2"
                            />
                            <label htmlFor="rememberme">Remember me</label>
                        </div>
                        <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                            Forgot your password?
                        </a>
                    </div>

                    <Button
                        label="Sign In"
                        icon="pi pi-user"
                        className="w-1/2"
                        onClick={checkEmpty}
                    />
                </div>
            </div>
        </div>
    );
}
