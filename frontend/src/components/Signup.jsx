import React, { useState } from "react";
import { registerUser } from "../services/user_services";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faSpinner,
  faGoogle,
  faFacebookF,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faFacebookF as faFacebookBrand } from '@fortawesome/free-brands-svg-icons';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Check password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "#dc3545";
    if (passwordStrength <= 2) return "#ffc107";
    if (passwordStrength <= 3) return "#17a2b8";
    if (passwordStrength <= 4) return "#28a745";
    return "#28a745";
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!form.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
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

    setLoading(true);

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });

      // Show success message
      alert(res.data.message || "Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ 
        general: err.response?.data?.message || "Error signing up. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Background decoration */}
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Signup Card */}
      <div className="container">
        <div className="row justify-content-center min-vh-100 align-items-center py-4">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card signup-card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-xl-5">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="logo-wrapper mb-3">
                    <div className="logo-circle">
                      <i className="fas fa-user-plus fa-2x text-white"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Create Account</h2>
                  <p className="text-muted">Join us today! It's free and easy</p>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <div>{errors.general}</div>
                    <button type="button" className="btn-close" onClick={() => setErrors({ ...errors, general: null })}></button>
                  </div>
                )}

                {/* Success Message Example */}
                {/* <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  <div>Account created successfully! Please check your email.</div>
                  <button type="button" className="btn-close"></button>
                </div> */}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-secondary fw-semibold">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                      </span>
                      <input
                        type="text"
                        className={`form-control bg-light border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                        placeholder="Create a password"
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
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password Strength:</small>
                          <small style={{ color: getPasswordStrengthColor() }}>
                            {getPasswordStrengthText()}
                          </small>
                        </div>
                        <div className="progress" style={{ height: "5px" }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor(),
                              transition: "width 0.3s ease"
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label text-secondary fw-semibold">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FontAwesomeIcon icon={faLock} className="text-primary" />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control bg-light border-start-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary bg-light border-start-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="mb-3 bg-light p-3 rounded-3">
                    <small className="text-muted d-block mb-2">Password must contain:</small>
                    <div className="row g-2">
                      <div className="col-6">
                        <small className={form.password.length >= 6 ? "text-success" : "text-muted"}>
                          <FontAwesomeIcon icon={form.password.length >= 6 ? faCheckCircle : faTimesCircle} className="me-1" />
                          At least 6 characters
                        </small>
                      </div>
                      <div className="col-6">
                        <small className={/[a-z]/.test(form.password) ? "text-success" : "text-muted"}>
                          <FontAwesomeIcon icon={/[a-z]/.test(form.password) ? faCheckCircle : faTimesCircle} className="me-1" />
                          One lowercase letter
                        </small>
                      </div>
                      <div className="col-6">
                        <small className={/[A-Z]/.test(form.password) ? "text-success" : "text-muted"}>
                          <FontAwesomeIcon icon={/[A-Z]/.test(form.password) ? faCheckCircle : faTimesCircle} className="me-1" />
                          One uppercase letter
                        </small>
                      </div>
                      <div className="col-6">
                        <small className={/[0-9]/.test(form.password) ? "text-success" : "text-muted"}>
                          <FontAwesomeIcon icon={/[0-9]/.test(form.password) ? faCheckCircle : faTimesCircle} className="me-1" />
                          One number
                        </small>
                      </div>
                      <div className="col-6">
                        <small className={/[$@#&!]/.test(form.password) ? "text-success" : "text-muted"}>
                          <FontAwesomeIcon icon={/[$@#&!]/.test(form.password) ? faCheckCircle : faTimesCircle} className="me-1" />
                          One special character
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-muted" htmlFor="agreeTerms">
                        I agree to the{' '}
                        <a href="#" className="text-primary text-decoration-none">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.agreeTerms}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold text-uppercase mb-4 signup-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Login Link */}
                  <p className="text-center text-muted mb-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in here
                    </Link>
                  </p>

                  {/* Divider */}
                  <div className="position-relative my-4">
                    <hr className="text-muted" />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">
                      Or sign up with
                    </span>
                  </div>

                  {/* Social Signup */}
                  <div className="d-flex gap-3 justify-content-center">
                    <button className="btn btn-outline-danger px-4 py-2 rounded-3 social-btn">
                      <FontAwesomeIcon icon={faGoogleBrand} className="me-2" />
                      Google
                    </button>
                    <button className="btn btn-outline-primary px-4 py-2 rounded-3 social-btn">
                      <FontAwesomeIcon icon={faFacebookBrand} className="me-2" />
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

export default Signup;