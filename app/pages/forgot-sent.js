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
      router.push("/reset?email=" + email);
    } catch (error) {
      if (error.response) setErrorMsg(error.response.data);
      else throw error;
    }
  };

  return (
    <div className="flex justify-center mt-9">
      <p>We've sent a reset link, check your email.</p>
    </div>
  );
}
