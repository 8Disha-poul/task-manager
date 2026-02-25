import React, { useState } from "react";
import { loginUser } from "../services/user_services";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || "Invalid email or password" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background decoration */}
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Login Card */}
      <div className="container">
        <div className="row justify-content-center min-vh-100 align-items-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card login-card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-xl-5">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="logo-wrapper mb-3">
                    <div className="logo-circle">
                      <i className="fas fa-sign-in-alt fa-2x text-white"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted">Please sign in to your account</p>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <div>{errors.general}</div>
                    <button type="button" className="btn-close" onClick={() => setErrors({ ...errors, general: null })}></button>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label text-secondary fw-semibold">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                      </span>
                      <input
                        type="email"
                        className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-secondary fw-semibold">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FontAwesomeIcon icon={faLock} className="text-primary" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control bg-light border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary bg-light border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                      />
                      <label className="form-check-label text-muted" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none text-primary fw-semibold small">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold text-uppercase mb-4 login-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <p className="text-center text-muted mb-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                      Sign up here
                    </Link>
                  </p>

                  {/* Divider */}
                  <div className="position-relative my-4">
                    <hr className="text-muted" />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">
                      Or continue with
                    </span>
                  </div>

                  {/* Social Login */}
                  <div className="d-flex gap-3 justify-content-center">
                    <button className="btn btn-outline-danger px-4 py-2 rounded-3 social-btn">
                      <FontAwesomeIcon icon={faGoogle} className="me-2" />
                      Google
                    </button>
                    <button className="btn btn-outline-primary px-4 py-2 rounded-3 social-btn">
                      <FontAwesomeIcon icon={faFacebookF} className="me-2" />
                      Facebook
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

