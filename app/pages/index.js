import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/login", { email, password });
      // logged in, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error.response) setErrorMsg(error.response.data);
      else throw error;
    }
  };

  return (
    <div className="flex justify-center mt-9">
      <div className="bg-gray-100 rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-3 p-6 pb-5">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full max-w-xs"
            id="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input w-full max-w-xs"
            id="password"
          />
          <button type="submit" className="btn">
            Login
          </button>
          {errorMsg && <p className="text-red-700">{errorMsg}</p>}
        </form>
        <div className="w-full h-0.5 bg-gray-200" />
        <div className="flex justify-center p-6 pt-4 flex-col space-y-2">
          <Link passHref href="/register">
            <a className="text-gray-500 text-sm text-center underline cursor-pointer">Don't have an account? Sign up</a>
          </Link>
          <Link passHref href="/forgot">
            <a className="text-gray-500 text-sm text-center underline cursor-pointer">Forgot your password?</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
