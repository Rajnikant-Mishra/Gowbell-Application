// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contextsAuthsecurity/AuthContext";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "animate.css";
// import styles from "./AdminLogin.module.css";
// import image from "../../../public/Group 3196.svg";
// import logo from "../../../public/logo GOWBELL.png";
// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         { email, password }
//       );
//       login(response.data.token);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Success!",
//         text: "You have logged in successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "animate__animated animate__fadeInDown",
//           title: "text-success fw-bold",
//           text: "text-dark",
//         },
//         background: "#fff",
//       }).then(() => {
//         navigate("/dashboard");
//       });
//     } catch (err) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Error!",
//         text: err.response?.data?.message || "Invalid email or password",
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         toast: true,
//         customClass: {
//           popup: "animate__animated animate__shakeX",
//           title: "text-danger fw-bold",
//           text: "text-dark",
//         },
//         background: "#fff",
//       });
//     }
//   };
//   return (
//     <div>
//       <nav class={`${styles.navbardiv}navbar  ps-4 py-4`}>
//         <div class="container-fluid">
//           <a class="navbar-brand" href="#">
//             <img
//               src={logo}
//               alt="Gowbell"
//               className={styles.logoimage}
//               height="50px"
//             />
//           </a>
//         </div>
//       </nav>
//       <div className={styles.container}>
//         <div className={`${styles.formContainer}`}>
//           <div className={`${styles.formWrapper} pb-4`}>
//             <form onSubmit={handleSubmit}>
//               <div className={`${styles.formGroup} ${styles.first} my-2 `}>
//                 <label htmlFor="email" className="my-3">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className={styles.formControl}
//                   placeholder="your-email@gmail.com"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   aria-label="email input"
//                   autoComplete="off"
//                 />
//               </div>
//               <div
//                 className={`${styles.formGroup} ${styles.last} ${styles.mb3} mb-3`}
//               >
//                 <label htmlFor="password" className="my-3">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className={styles.formControl}
//                   placeholder="Your Password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   aria-label="password input"
//                   autoComplete="off"
//                 />
//               </div>
//               <div className="d-flex mb-4 justify-content-between">
//                 <label
//                   className={`${styles.control} ${styles.controlCheckbox} mb-0`}
//                 >
//                   <span className={styles.caption}>Remember me</span>
//                   <input type="checkbox" />
//                   <div className={styles.control__indicator}></div>
//                 </label>
//                 <span className="ml-auto">
//                   <a href="#" className={styles.forgotPass}>
//                     Forgot Password
//                   </a>
//                 </span>
//               </div>
//               <button
//                 type="submit"
//                 className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
//               >
//                 Log In
//               </button>
//             </form>
//           </div>
//         </div>
//         <div
//           className={styles.bgImage}
//           style={{ backgroundImage: `url(${image})` }}
//         >
//           <div className={`${styles.about}`}>
//             <h3>Welcome To </h3>
//             <h3>Gowbell Foundation</h3>
//             <p>
//               Securely manage exams and streamline administration with ease.
//             </p>
//           </div>
//         </div>
//       </div>
//       <footer class={`${styles.footer}navbar  ps-4`}>
//         <div class="container-fluid">
//           <p className={styles.footerp}>
//             Copyright © 2024 Gowbell Foundation | Powered by{" "}
//             <a
//               href="https://evoquesys.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               EvoqueSys.
//             </a>
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };
// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css";
import styles from "./AdminLogin.module.css";
import image from "../../../public/Group 3196.svg";
import logo from "../../../public/logo GOWBELL.png";
import { API_BASE_URL } from "../ApiConfig/APIConfig";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${ API_BASE_URL }/api/auth/login`,
        { email, password }
      );
      login(response.data.token);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success!",
        text: "You have logged in successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "animate__animated animate__fadeInDown",
          title: "text-success fw-bold",
          text: "text-dark",
        },
        background: "#fff",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Invalid email or password",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        customClass: {
          popup: "animate__animated animate__shakeX",
          title: "text-danger fw-bold",
          text: "text-dark",
        },
        background: "#fff",
      });
    }
  };
  return (
    <div>
      <nav class={`${styles.navbardiv}navbar  ps-4 py-4`}>
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img
              src={logo}
              alt="Gowbell"
              className={styles.logoimage}
              height="50px"
            />
          </a>
        </div>
      </nav>
      <div className={styles.container}>
        <div className={`${styles.formContainer}`}>
          <div className={`${styles.formWrapper} pb-4`}>
            <form onSubmit={handleSubmit}>
              <div
                className={`${styles.formGroup} ${styles.first} ${styles.mb3} mb-3 `}
              >
                <label htmlFor="email" className="my-4">
                  Email
                </label>
                <input
                  type="email"
                  className={styles.formControl}
                  placeholder="your-email@gmail.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="email input"
                  autoComplete="off"
                />
              </div>
              <div
                className={`${styles.formGroup} ${styles.last} ${styles.mb3} mb-3`}
              >
                <label htmlFor="password" className="my-4">
                  Password
                </label>
                <input
                  type="password"
                  className={styles.formControl}
                  placeholder="Your Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="password input"
                  autoComplete="off"
                />
              </div>
              <div className="d-flex  mt-4 justify-content-between">
                <label
                  className={`${styles.control} ${styles.controlCheckbox} mb-0`}
                >
                  <span className={styles.caption}>Remember Me</span>
                  <input type="checkbox" />
                  <div className={styles.control__indicator}></div>
                </label>
              </div>
              <div className="d-flex mb-4 justify-content-between mt-5">
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                >
                  Login
                </button>
                <span className="ml-auto my-auto">
                  {/* <a href="#" className={styles.forgotPass}>
                    Forgot Password
                  </a> */}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div
          className={styles.bgImage}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className={`${styles.about}`}>
            <h3>Welcome To </h3>
            <h3>Gowbell Foundation</h3>
            <p>
              Securely manage exams and streamline administration with ease.
            </p>
          </div>
        </div>
      </div>
      <footer class={`${styles.footer}navbar  ps-4`}>
        <div class="container-fluid">
          <p className={styles.footerp}>
            Copyright © 2024 Gowbell Foundation | Powered by{" "}
            <a
              href="https://evoquesys.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              EvoqueSys.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
export default AdminLogin;







