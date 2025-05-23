"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ButtonLoader from "../layout/ButtonLoader";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    /*  if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
*/
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login after successful registration
        router.push("/login?registered=true");
      } else {
        toast.error(data.message);
        //throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5">
        <div className="card shadow-sm rounded-4">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">
              नॆऊपाने परिवारमा सामेल हुनुहोस् |
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name_field" className="form-label">
                  पूरा नाम
                </label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email_field" className="form-label">
                  इमेल
                </label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password_field" className="form-label">
                  पासवर्ड
                </label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? <ButtonLoader /> : "दर्ता गर्नुहोस्"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
