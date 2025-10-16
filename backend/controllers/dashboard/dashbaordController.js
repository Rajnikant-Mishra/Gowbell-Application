import SchoolStudentModel from "../../models/dashboard/dashboardModel.js";

const DashboardController = {
  // getCounts: async (req, res) => {
  //   try {
  //     // Expecting IDs from query params
  //     const filters = {
  //       session_id: req.query.session_id,
  //       country: req.query.country,
  //       state: req.query.state,
  //       district: req.query.district,
  //       city: req.query.city,
  //     };

  //     const totalSchools = await SchoolStudentModel.getTotalSchools(filters);
  //     const totalStudents = await SchoolStudentModel.getTotalStudents(filters);
  //     const medals = await SchoolStudentModel.getMedalCounts(filters);

  //     res.json({
  //       totalSchools,
  //       totalStudents,
  //       medals,
  //     });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // },

  getCounts: async (req, res) => {
    try {
      const filters = {
        session_id: req.query.session_id,
        country: req.query.country,
        state: req.query.state,
        district: req.query.district,
        city: req.query.city,
      };

      const schoolsData = await SchoolStudentModel.getTotalSchoolsWithChange(
        filters
      );
      const studentsData = await SchoolStudentModel.getTotalStudentsWithChange(filters);
      const medals = await SchoolStudentModel.getMedalCounts(filters);

      res.json({
        totalSchools: schoolsData.totalSchools,
        schoolChangePercentage: schoolsData.percentageChange,
        totalStudents: studentsData.totalStudents,
        studentChangePercentage: studentsData.percentageChange,
        medals,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAveragePercentage: async (req, res) => {
    try {
      const filters = {
        session_id: req.query.session_id,
        country: req.query.country,
        state: req.query.state,
        district: req.query.district,
        city: req.query.city,
      };

      const result = await SchoolStudentModel.calculateAveragePercentage(
        filters
      );

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error("Error calculating average:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getExamsBySchool: async (req, res) => {
    try {
      // Extract filters from query parameters
      const filters = {
        session_id: req.query.session_id,
        country: req.query.country,
        state: req.query.state,
        district: req.query.district,
        city: req.query.city,
      };

      // Call the model function with filters
      const exams = await SchoolStudentModel.getExamsBySchool(filters);

      res.json({ exams });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 📊 Get participation count per year
  getParticipationPerYear: async (req, res) => {
    try {
      const participation = await SchoolStudentModel.getParticipationPerYear();
      res.json({ participation });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all OMR records
  getOmrData: async (req, res) => {
    try {
      const filters = {
        country: req.query.country || null,
        state: req.query.state || null,
        district: req.query.district || null,
        city: req.query.city || null,
      };

      const results = await SchoolStudentModel.getAllomrdata(filters);
      return res.status(200).json({ success: true, data: results });
    } catch (err) {
      console.error("Error fetching OMR data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }
  },

  getSubjectCounts: (req, res) => {
    const filters = {
      session_id: req.query.session_id,
      country: req.query.country,
      state: req.query.state,
      district: req.query.district,
      city: req.query.city,
    };

    SchoolStudentModel.getSubjectCounts(filters, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, ...data });
    });
  },
};

export default DashboardController;
