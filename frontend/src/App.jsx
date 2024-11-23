// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./Components/contexts/AuthContext";
import AdminLogin from "./Components/Admin/AdminLogin";
import Dashboard from "./Components/Pages/Dashboard";
import CountryList from "./Components/Region/country/CountryList";
import CountryForm from "./Components/Region/country/CountryForm";
import UpdateCountry from "./Components/Region/country/UpdateCountry";

import StateList from "./Components/Region/state/StateList";
import StateForm from "./Components/Region/state/StateForm";
import UpdateState from "./Components/Region/state/UpdateState";

import DistrictList from "./Components/Region/district/DistrictList";
import DistrictForm from "./Components/Region/district/DistrictForm";
import UpdateDistrict from "./Components/Region/district/UpdateDistrict";

import CityList from "./Components/Region/city/CityList";
import CityForm from "./Components/Region/city/CityForm";
import UpdateCity from "./Components/Region/city/UpdateCity";

import AreaList from "./Components/Region/area/AreaList";
import AreaForm from "./Components/Region/area/AreaForm";
import UpdateArea from "./Components/Region/area/UpdateArea";

import ClassList from "./Components/Master/class/ClassList";
import ClassForm from "./Components/Master/class/ClassForm";
import UpdateClass from "./Components/Master/class/UpdateClass";

import SubjectList from "./Components/Master/subject/SubjectList";
import SubjectForm from "./Components/Master/subject/SubjectForm";
import UpdateSubject from "./Components/Master/subject/UpdateSubject";

import AffiliatedList from "./Components/Master/affiliated/AffiliatedList";
import AffiliatedForm from "./Components/Master/affiliated/AffiliatedForm";
import UpdateAffiliated from "./Components/Master/affiliated/UpdateAffiliated";

import BookList from "./Components/Inventory/Book/BookList";
import BookForm from "./Components/Inventory/Book/BookForm";
import BookUpdate from "./Components/Inventory/Book/BookUpdate";

import QuestionList from "./Components/Inventory/question/QuestionList";
import QuestionForm from "./Components/Inventory/question/QuestionForm";
import QuestionUpdate from "./Components/Inventory/question/QuestionUpdate";

import OmrList from "./Components/Inventory/Omr/OmrList";
import OmrForm from "./Components/Inventory/Omr/OmrForm";
import OmrUpdate from "./Components/Inventory/Omr/OmrUpdate";

import SchoolForm from "./Components/School/createschool/SchoolForm";
import SchoolList from "./Components/School/createschool/SchoolList";
import SchoolUpdate from "./Components/School/createschool/SchoolUpdate";

import InchargeForm from "./Components/School/incharge/InchargeForm";
import InchargeList from "./Components/School/incharge/InchargeList";
import InchargeUpdate from "./Components/School/incharge/InchargeUpdate";

import StudentForm from "./Components/Student/StudentForm";
import StudentList from "./Components/Student/StudentList";
import StudentUpdate from  "./Components/Student/StudentUpdate";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/admin" />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={<RedirectIfAuthenticated element={<AdminLogin />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/country"
            element={<ProtectedRoute element={<CountryList />} />}
          />
          <Route
            path="/create"
            element={<ProtectedRoute element={<CountryForm />} />}
          />
          <Route
            path="/update/:id"
            element={<ProtectedRoute element={<UpdateCountry />} />}
          />
          {/* state route */}
          <Route
            path="/state"
            element={<ProtectedRoute element={<StateList />} />}
          />
          <Route
            path="/state/create"
            element={<ProtectedRoute element={<StateForm />} />}
          />
          <Route
            path="/state/update/:id"
            element={<ProtectedRoute element={<UpdateState />} />}
          />
          {/*   District route */}
          <Route
            path="/district"
            element={<ProtectedRoute element={<DistrictList />} />}
          />
          <Route
            path="/district/create"
            element={<ProtectedRoute element={<DistrictForm />} />}
          />
          <Route
            path="/district/update/:id"
            element={<ProtectedRoute element={<UpdateDistrict />} />}
          />
          {/*  City  route */}
          <Route
            path="/city"
            element={<ProtectedRoute element={<CityList />} />}
          />
          <Route
            path="/city/create"
            element={<ProtectedRoute element={<CityForm />} />}
          />
          <Route
            path="/city/update/:id"
            element={<ProtectedRoute element={<UpdateCity />} />}
          />
          {/* Area route */}
          <Route
            path="/area"
            element={<ProtectedRoute element={<AreaList />} />}
          />
          <Route
            path="/area/create"
            element={<ProtectedRoute element={<AreaForm />} />}
          />
          <Route
            path="/area/update/:id"
            element={<ProtectedRoute element={<UpdateArea />} />}
          />
          {/* Class route */}
          <Route
            path="/class"
            element={<ProtectedRoute element={<ClassList />} />}
          />
          <Route
            path="/class/create"
            element={<ProtectedRoute element={<ClassForm />} />}
          />
          <Route
            path="/class/update/:id"
            element={<ProtectedRoute element={<UpdateClass />} />}
          />
          {/* sUBJECT route */}
          <Route
            path="/subject"
            element={<ProtectedRoute element={<SubjectList />} />}
          />
          <Route
            path="/subject/create"
            element={<ProtectedRoute element={<SubjectForm />} />}
          />
          <Route
            path="/subject/update/:id"
            element={<ProtectedRoute element={<UpdateSubject />} />}
          />
          {/* affiliated route */}
          <Route
            path="/affiliated"
            element={<ProtectedRoute element={<AffiliatedList />} />}
          />
          <Route
            path="/affiliated/create"
            element={<ProtectedRoute element={<AffiliatedForm />} />}
          />
          <Route
            path="/affiliated/update/:id"
            element={<ProtectedRoute element={<UpdateAffiliated />} />}
          />
          {/* Books route */}
          <Route
            path="/book"
            element={<ProtectedRoute element={<BookList />} />}
          />
          <Route
            path="/book/create"
            element={<ProtectedRoute element={<BookForm />} />}
          />
          <Route
            path="/book/update/:id"
            element={<ProtectedRoute element={<BookUpdate />} />}
          />
          {/* Questions route */}
          <Route
            path="/question"
            element={<ProtectedRoute element={<QuestionList />} />}
          />
          <Route
            path="/question/create"
            element={<ProtectedRoute element={<QuestionForm />} />}
          />
          <Route
            path="/question/update/:id"
            element={<ProtectedRoute element={<QuestionUpdate />} />}
          />
          {/* OMR route */}
          <Route
            path="/omr"
            element={<ProtectedRoute element={<OmrList />} />}
          />
          <Route
            path="/omr/create"
            element={<ProtectedRoute element={<OmrForm />} />}
          />
          <Route
            path="/omr/update/:id"
            element={<ProtectedRoute element={<OmrUpdate />} />}
          />
         
          {/* School route */}
          <Route
            path="/school-create"
            element={<ProtectedRoute element={<SchoolForm/>} />}
          />
          <Route
            path="/schoolList"
            element={<ProtectedRoute element={<SchoolList/>} />}
          />
          <Route
            path="/school/update/:id"
            element={<ProtectedRoute element={<SchoolUpdate/>} />}
          />


          {/* incharge route */}
          <Route
            path="/incharge-create"
            element={<ProtectedRoute element={<InchargeForm/>} />}
          />
          <Route
            path="/inchargeList"
            element={<ProtectedRoute element={<InchargeList/>} />}
          />
          <Route
            path="/incharge/update/:id"
            element={<ProtectedRoute element={<InchargeUpdate/>} />}
          />

          {/* student route */}
          <Route
            path="/student-create"
            element={<ProtectedRoute element={<StudentForm/>} />}
          />
          <Route
            path="/studentList"
            element={<ProtectedRoute element={<StudentList/>} />}
          />
          <Route
            path="/student/update/:id"
            element={<ProtectedRoute element={<StudentUpdate/>} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
