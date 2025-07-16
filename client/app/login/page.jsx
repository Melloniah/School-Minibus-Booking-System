'use client';

import {useState} from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const Router= useRouter();
    const [email, setEmail]=useState("");
    const[password, setPassword]=useState("");

    const handleLogin = async (e) =>{
        e.preventDefault();

        try {
            const res= await fetch("http://localhost:5000/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({email, password}),
            });

            const data= await res.json();

            if (res.ok && data?.user){
                localStorage.setItem("token", data.user);
                localStorage.setItem("user", JSON.stringify(data.user));

                const role= data.user.role;
                Router.push(role==="admin" ? "/admin/dashboard": "/book-seat");
            }
            else {
                alert (data.error || "Login Failed. Please check your credentials and try again"
            )}
        } catch (err){
            console.error("Login error:", err);
            alert("Server error");
        }
    };

    return (
         <main className="p-4">
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md">
            <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
           />
           <button type="submit" className="bg-green-600 text-white p-2 rounded">
            Login
           </button>
          </form>
         </main>
         
    )
};