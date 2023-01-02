import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Forgot() {
  const [email, setEmail] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/reset-password", { email });
      router.push("/forgot-sent");
    } catch (error) {
      if (error.response) setErrorMsg(error.response.data);
      else throw error;
    }
  };

  return (
    <div className="flex justify-center mt-9">
      <div className="bg-gray-100 rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-3 p-6">
          <p>We'll send a password reset link</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full max-w-xs"
            id="email"
          />
          <button type="submit" className="btn">
            Reset password
          </button>
          {errorMsg && <p className="text-red-700">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
