import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const data = await loginUser(formData.identifier, formData.password);

      if(data.token){
        alert("Login success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }else{
        alert(`Login failed: ${data.message}`);
      }
    }catch(error){
      console.error(error);
      alert("Something went wrong");
    }
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    rememberMe,
    setRememberMe,
    showPassword,
    togglePassword,
  };
};
