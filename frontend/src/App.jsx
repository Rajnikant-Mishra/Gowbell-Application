// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//for auth routes
import { AuthProvider } from "./Components/contextsAuthsecurity/AuthContext";
import ProtectedRoute from "./Components/contextsAuthsecurity/ProtectedRoute";
import RedirectIfAuthenticated from "./Components/contextsAuthsecurity/RedirectIfAuthenticated";

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

//inventory
import Createinventory from "./Components/Inventory/Createinventory";
import Listinventory from "./Components/Inventory/listinventory";
import Updateinventory from "./Components/Inventory/Updateinventory";

import SchoolForm from "./Components/School/createschool/SchoolForm";
import SchoolList from "./Components/School/createschool/SchoolList";
import SchoolUpdate from "./Components/School/createschool/SchoolUpdate";

import InchargeForm from "./Components/School/incharge/InchargeForm";
import InchargeList from "./Components/School/incharge/InchargeList";
import InchargeUpdate from "./Components/School/incharge/InchargeUpdate";

import StudentForm from "./Components/Student/StudentForm";
import StudentList from "./Components/Student/StudentList";
import StudentUpdate from "./Components/Student/StudentUpdate";

//Omrco
import OmrcoList from "./Components/Exam/omrco/OmrcoList";
import OmrcoFrom from "./Components/Exam/omrco/OmrcoForm";
import OmrView from "./Components/Exam/omrco/OmrView";
import OmrUpdate from "./Components/Exam/omrco/OmrUpdate";

//question
import QuestionIssues from "./Components/Exam/question/QuestionIssues";
import QuestionCreate from "./Components/Exam/question/QuestionCreate";
import QuestionUpdated from "./Components/Exam/question/QuestionUpdated";

//conginment
import Create from "./Components/Consignment/create/Create";
import List from "./Components/Consignment/create/List";
import Update from "./Components/Consignment/create/Update";

import ListPacking from "./Components/Consignment/packing/ListPacking";
import CreatePacking from "./Components/Consignment/packing/CreatePacking";
import UpdatePacking from "./Components/Consignment/packing/UpadatePacking";

import StudentReport from "./Components/Reports/StudentReport";
import SchoolReport from "./Components/Reports/SchoolReport";
import ExamReport from "./Components/Reports/ExamReport";

import AdminProfile from "./Components/Pages/AdminProfile";

import User from "./Components/User/User";
import UserList from "./Components/User/UserList";
import UserUpdate from "./Components/User/UserUpdate";

import Role from "./Components/Role/Role";
import Rolelist from "./Components/Role/RoleList";
import UpdateRole from "./Components/Role/UpdateRole";

//exam
import Exam from "./Components/Exam/CreateExam/Exam";
import ExamList from "./Components/Exam/CreateExam/ExamList";

// wildcard
import WildcardList from "./Components/Exam/Wildcard/WildcardList";

//result
import Result from "./Components/Exam/Result/Result";
import ResultForm from "./Components/Exam/Result/ResultForm";
import UpdateResult from "./Components/Exam/Result/UpdateResult";
import ProcessResult from "./Components/Exam/Result/ProcessResult";

import OMRreceipt from "./Components/Exam/omrReceipt/OMRreceipt";

//menu
import Menu from "./Components/configuration/Menu/Menu";
import MenuList from "./Components/configuration/Menu/MenuList";
import MenuUpdate from "./Components/configuration/Menu/MenuUpdate";

//cleintmenu
import Assignpermission from "./Components/configuration/permissionmenus/Assignpermission";
import Listpermission from "./Components/configuration/permissionmenus/Listpermission";

//attributes
import CreateAttribute from "./Components/configuration/Attribute/CreateAttribute";
import ListAttribute from "./Components/configuration/Attribute/ListAttribute";

//items
import Itemform from "./Components/configuration/Item/Itemform";
import ItemList from "./Components/configuration/Item/ItemList";
import UpdatedItem from "./Components/configuration/Item/UpdatedItem";

//sub-items
import SubItemForm from "./Components/configuration/subitems/SubItemForm";
import SubItemList from "./Components/configuration/subitems/SubItemList";

//attendance
import AttendanceSheet from "./Components/Exam/Attendance/AttendanceSheet";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<RedirectIfAuthenticated element={<AdminLogin />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<AdminProfile />} />}
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
            path="/region"
            element={<ProtectedRoute element={<CityList />} />}
          />
          <Route
            path="/region/create"
            element={<ProtectedRoute element={<CityForm />} />}
          />
          <Route
            path="/region/update/:id"
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
          {/* //inventory */}
          <Route
            path="/create-inventory"
            element={<ProtectedRoute element={<Createinventory />} />}
          />
          <Route
            path="list-inventory"
            element={<ProtectedRoute element={<Listinventory />} />}
          />
          <Route
            path="/inventory/:id"
            element={<ProtectedRoute element={<Updateinventory />} />}
          />
          {/* School route */}
          <Route
            path="/school-create"
            element={<ProtectedRoute element={<SchoolForm />} />}
          />
          <Route
            path="/schoolList"
            element={<ProtectedRoute element={<SchoolList />} />}
          />
          <Route
            path="/school/update/:id"
            element={<ProtectedRoute element={<SchoolUpdate />} />}
          />
          {/* incharge route */}
          <Route
            path="/incharge-create"
            element={<ProtectedRoute element={<InchargeForm />} />}
          />
          <Route
            path="/inchargeList"
            element={<ProtectedRoute element={<InchargeList />} />}
          />
          <Route
            path="/incharge/update/:id"
            element={<ProtectedRoute element={<InchargeUpdate />} />}
          />
          <Route
            path="/student-create"
            element={<ProtectedRoute element={<StudentForm />} />}
          />
          <Route
            path="/studentList"
            element={<ProtectedRoute element={<StudentList />} />}
          />
          <Route
            path="/student/update/:id"
            element={<ProtectedRoute element={<StudentUpdate />} />}
          />
          {/* omr route */}
          <Route
            path="/omr-list"
            element={<ProtectedRoute element={<OmrcoList />} />}
          />
          <Route
            path="/omr-create"
            element={<ProtectedRoute element={<OmrcoFrom />} />}
          />
          <Route
            path="/omr/view/:id"
            element={<ProtectedRoute element={<OmrView />} />}
          />
          <Route
            path="/omr/update/:id"
            element={<ProtectedRoute element={<OmrUpdate />} />}
          />
          {/* //omr receipt */}
          <Route
            path="/omr-receipt"
            element={<ProtectedRoute element={<OMRreceipt />} />}
          />
          {/* //result */}
          <Route
            path="/result-list"
            element={<ProtectedRoute element={<Result />} />}
          />
          <Route
            path="/result-create"
            element={<ProtectedRoute element={<ResultForm />} />}
          />
          <Route
            path="/result/update/:id"
            element={<ProtectedRoute element={<UpdateResult />} />}
          />
          <Route
            path="/resultprocess-list"
            element={<ProtectedRoute element={<ProcessResult />} />}
          />

          {/* //question */}
          <Route
            path="/question-list"
            element={<ProtectedRoute element={<QuestionIssues />} />}
          />
          <Route
            path="/question-create"
            element={<ProtectedRoute element={<QuestionCreate />} />}
          />

          <Route
            path="/question/update/:id"
            element={<ProtectedRoute element={<QuestionUpdated />} />}
          />

          {/* //conginments */}
          <Route
            path="/consignment-list"
            element={<ProtectedRoute element={<List />} />}
          />
          <Route
            path="/consignment-create"
            element={<ProtectedRoute element={<Create />} />}
          />
          <Route
            path="/consignment/update/:id"
            element={<ProtectedRoute element={<Update />} />}
          />
          {/* //packing list */}
          <Route
            path="/packing-create"
            element={<ProtectedRoute element={<CreatePacking />} />}
          />
          <Route
            path="/packing-list"
            element={<ProtectedRoute element={<ListPacking />} />}
          />
          <Route
            path="/packing/update/:id"
            element={<ProtectedRoute element={<UpdatePacking />} />}
          />
          {/* report*/}
          <Route
            path="/students-report"
            element={<ProtectedRoute element={<StudentReport />} />}
          />
          <Route
            path="/schools-report"
            element={<ProtectedRoute element={<SchoolReport />} />}
          />
          <Route
            path="/exams-report"
            element={<ProtectedRoute element={<ExamReport />} />}
          />
          {/* //user & role */}
          <Route path="/user" element={<ProtectedRoute element={<User />} />} />
          <Route
            path="/user-list"
            element={<ProtectedRoute element={<UserList />} />}
          />
          <Route
            path="/users/:id"
            element={<ProtectedRoute element={<UserUpdate />} />}
          />
          {/* //role */}
          <Route path="/role" element={<ProtectedRoute element={<Role />} />} />
          <Route
            path="/role-list"
            element={<ProtectedRoute element={<Rolelist />} />}
          />
          <Route
            path="/role/update/:id"
            element={<ProtectedRoute element={<UpdateRole />} />}
          />
          {/* //Exam */}
          <Route path="/exam" element={<ProtectedRoute element={<Exam />} />} />
          <Route
            path="/examList"
            element={<ProtectedRoute element={<ExamList />} />}
          />


          {/* wildcard */}
          <Route path="/wildcard" element={<ProtectedRoute element={<WildcardList/>} />} />


          {/* //menu */}
          <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
          <Route
            path="/menu-list"
            element={<ProtectedRoute element={<MenuList />} />}
          />
          <Route
            path="/menu/update/:id"
            element={<ProtectedRoute element={<MenuUpdate />} />}
          />
          {/* //clientsmenu */}
          <Route
            path="/menu-permissions"
            element={<ProtectedRoute element={<Assignpermission />} />}
          />
          <Route
            path="/permissions-list"
            element={<ProtectedRoute element={<Listpermission />} />}
          />
          {/* <Route
            path="/menu/update/:id"
            element={<ProtectedRoute element={<MenuUpdate />} />}
          /> */}
          {/* //attributes */}
          <Route
            path="/create-attribute"
            element={<ProtectedRoute element={<CreateAttribute />} />}
          />
          <Route
            path="/list-attribute"
            element={<ProtectedRoute element={<ListAttribute />} />}
          />
          {/* //items */}
          <Route
            path="/create-item"
            element={<ProtectedRoute element={<Itemform />} />}
          />
          <Route
            path="/item-list"
            element={<ProtectedRoute element={<ItemList />} />}
          />
          <Route
            path="/item/update/:id"
            element={<ProtectedRoute element={<UpdatedItem />} />}
          />
          {/* //sub-items */}
          <Route
            path="/create-subitem"
            element={<ProtectedRoute element={<SubItemForm />} />}
          />
          <Route
            path="/subitem-list"
            element={<ProtectedRoute element={<SubItemList />} />}
          />
          {/* //attendance */}
          <Route
            path="/attendance"
            element={<ProtectedRoute element={<AttendanceSheet />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
