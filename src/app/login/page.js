"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

export default function Login() {
    const [invalid, setInvalid] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    const checkEmpty = () => {
        const isEmptyUsername = username.length === 0;
        const isEmptyPassword = password.length === 0;

        setInvalid(isEmptyUsername);
        setEmpty(isEmptyPassword);

        if (!isEmptyUsername && !isEmptyPassword) {
            axios.get(`http://localhost:8080/api/v0.1/admins/` + username)
            .then((response) => {
                if (response.status === 202) {
                    if(response.data.password === password){
                        setLoginError(false);
                        router.push('/calendar');
                    }
                    else{
                        setLoginError(true);
                    }
                } else {
                    setLoginError(true);
                }
            })
            .catch((error) => {
                console.error("Login failed", error);
                setLoginError(true);
            });
        }
    };

    const usernameInput = (e) => {
        setUsername(e.target.value);
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
                        <label htmlFor="username" className="font-bold">
                            Username
                        </label>
                        <InputText
                            id="username"
                            type="text"
                            placeholder="Username"
                            className="w-full mb-3"
                            value={username}
                            onChange={usernameInput}
                        />
                        {invalid && (
                            <Message severity="error" text="Username is required" />
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
                            <Message severity="error" text="Password is required" />
                        )}
                    </div>

                    {loginError && (
                        <Message severity="error" text="Invalid username or password" />
                    )}

                    <br/><br/>
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
