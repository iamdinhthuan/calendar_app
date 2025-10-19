"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      // Get OAuth URL from backend
      const { auth_url } = await authApi.getLoginUrl();
      
      // Redirect to Google OAuth consent screen
      window.location.href = auth_url;
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to initiate login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogin} 
      disabled={loading}
      size="lg"
      className="text-lg px-8"
    >
      {loading ? "Loading..." : "Sign in with Google"}
    </Button>
  );
}

