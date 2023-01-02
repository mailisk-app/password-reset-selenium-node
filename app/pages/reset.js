import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Forgot() {
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [newPassword, setNewPassword] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { email: queryEmail, otp: queryOtp } = router.query;

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/confirm-reset-password", { email, otp, newPassword });
      router.push("/");
    } catch (error) {
      if (error.response) setErrorMsg(error.response.data);
      else throw error;
    }
  };

  useEffect(() => {
    if (queryEmail) setEmail(queryEmail);
    if (queryOtp) setOtp(queryOtp);
  }, [queryEmail]);

  return (
    <div className="flex justify-center mt-9">
      <div className="bg-gray-100 rounded-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-3 p-6">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full max-w-xs"
            id="email"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="input w-full max-w-xs"
            id="otp"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="input w-full max-w-xs"
            id="new-password"
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
