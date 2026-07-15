import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export const useSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(formData.password !== formData.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try{
      const data = await registerUser(formData.username, formData.email, formData.password);

      if(data.token){
        alert("Register success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }else{
        alert(`Register failed: ${data.message}`);
      }
    }catch(error){
      console.error(error);
      alert("Something went wrong");
    }
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((current) => !current);
  };

  return {
    agreeTerms,
    formData,
    handleChange,
    handleSubmit,
    setAgreeTerms,
    showConfirmPassword,
    showPassword,
    toggleConfirmPassword,
    togglePassword,
  };
};
