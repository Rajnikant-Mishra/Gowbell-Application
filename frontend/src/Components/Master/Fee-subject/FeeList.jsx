// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   CssBaseline,
//   ThemeProvider,
//   createTheme,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Mainlayout from "../../Layouts/Mainlayout";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";

// const theme = createTheme({
//   palette: {
//     primary: { main: "#1976d2" },
//     error: { main: "#d32f2f" },
//   },
//   shape: {
//     borderRadius: 5,
//   },
// });

// const CreateFeeDialog = ({ open, onClose, onRefresh }) => {
//   const [subjectFee, setSubjectFee] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!subjectFee) {
//       setError("Subject fee is required");
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/fee/create`, {
//         subject_fee: subjectFee,
//       });
//       toast.success("Fee created successfully");
//       setSubjectFee("");
//       onRefresh();
//       onClose();
//     } catch {
//       setError("Failed to create fee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Create New Fee</DialogTitle>
//       <DialogContent>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//         <TextField
//           label="Subject Fee"
//           value={subjectFee}
//           onChange={(e) => setSubjectFee(e.target.value)}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Create"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const UpdateFeeDialog = ({ open, onClose, fee, onRefresh }) => {
//   const [subjectFee, setSubjectFee] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (fee) {
//       setSubjectFee(fee.subject_fee);
//     }
//   }, [fee]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!subjectFee) {
//       setError("Subject fee is required");
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.put(`${API_BASE_URL}/api/fee/${fee.id}`, {
//         subject_fee: subjectFee,
//       });
//       toast.success("Fee updated successfully");
//       onRefresh();
//       onClose();
//     } catch {
//       setError("Failed to update fee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Update Fee</DialogTitle>
//       <DialogContent>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//         <TextField
//           label="Subject Fee"
//           value={subjectFee}
//           onChange={(e) => setSubjectFee(e.target.value)}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const FeeTable = ({ onEdit, refresh, onRefresh }) => {
//   const [fees, setFees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/fee/fee-paginate`);
//         setFees(response.data.fees || []);
//         setError(null);
//       } catch {
//         setError("Failed to fetch fees");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFees();
//   }, [refresh]);

//   return (
//     <>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {loading ? (
//         <Box display="flex" justifyContent="center" my={4}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Card elevation={3} sx={{ borderRadius: 2 }}>
//           <CardContent>
//             <TableContainer component={Paper} elevation={0}>
//               <Table sx={{ border: "none" }}>
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       backgroundColor: "#1230ae",
//                       borderRadius: "5px",
//                     }}
//                   >
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         p: 2,
//                       }}
//                     >
//                       Subject Fee
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         p: 2,
//                       }}
//                       align="center"
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {fees.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={2} align="center">
//                         No fees found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     fees.map((fee) => (
//                       <TableRow
//                         key={fee.id}
//                         sx={{
//                           "&:hover": { backgroundColor: "#f5f5f5" },
//                         }}
//                       >
//                         <TableCell sx={{ py: 1.5 }}>{fee.subject_fee}</TableCell>
//                         <TableCell align="center">
//                           <IconButton
//                             color="primary"
//                             onClick={() => onEdit(fee)}
//                           >
//                             <Edit />
//                           </IconButton>

//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>
//       )}
//     </>
//   );
// };

// function App() {
//   const [openCreateDialog, setOpenCreateDialog] = useState(false);
//   const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
//   const [selectedFee, setSelectedFee] = useState(null);
//   const [refresh, setRefresh] = useState(false);

//   const handleRefresh = () => setRefresh(!refresh);

//   return (
//     <Mainlayout>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Container maxWidth="md" sx={{ py: 4 }}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={3}
//           >
//             <Typography variant="h4" fontWeight="bold">
//               Fee Management
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setOpenCreateDialog(true)}
//             >
//               Add New Fee
//             </Button>
//           </Box>

//           <FeeTable
//             onEdit={(fee) => {
//               setSelectedFee(fee);
//               setOpenUpdateDialog(true);
//             }}
//             refresh={refresh}
//             onRefresh={handleRefresh}
//           />

//           <CreateFeeDialog
//             open={openCreateDialog}
//             onClose={() => setOpenCreateDialog(false)}
//             onRefresh={handleRefresh}
//           />
//           <UpdateFeeDialog
//             open={openUpdateDialog}
//             onClose={() => setOpenUpdateDialog(false)}
//             fee={selectedFee}
//             onRefresh={handleRefresh}
//           />
//           <ToastContainer position="top-right" autoClose={3000} />
//         </Container>
//       </ThemeProvider>
//     </Mainlayout>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Mainlayout from "../../Layouts/Mainlayout";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    error: { main: "#d32f2f" },
  },
  shape: { borderRadius: 5 },
});

// ------------------- CREATE DIALOG -------------------
const CreateFeeDialog = ({ open, onClose, onRefresh }) => {
  const [subjectFee, setSubjectFee] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectFee) {
      setError("Subject fee is required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/fee/create`, {
        subject_fee: subjectFee,
      });
      toast.success("Fee created successfully");
      setSubjectFee("");
      onRefresh();
      onClose();
    } catch {
      setError("Failed to create fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Fee</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Subject Fee"
          value={subjectFee}
          onChange={(e) => setSubjectFee(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ------------------- UPDATE DIALOG -------------------
// const UpdateFeeDialog = ({ open, onClose, fee, onRefresh }) => {
//   const [subjectFee, setSubjectFee] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (fee) setSubjectFee(fee.subject_fee);
//   }, [fee]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!subjectFee) {
//       setError("Subject fee is required");
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.put(`${API_BASE_URL}/api/fee/${fee.id}`, {
//         subject_fee: subjectFee,
//       });
//       toast.success("Fee updated successfully");
//       onRefresh();
//       onClose();
//     } catch {
//       setError("Failed to update fee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Update Fee</DialogTitle>
//       <DialogContent>
//         {error && <Alert severity="error">{error}</Alert>}
//         <TextField
//           label="Subject Fee"
//           value={subjectFee}
//           onChange={(e) => setSubjectFee(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

const UpdateFeeDialog = ({ open, onClose, fee, onRefresh }) => {
  const [subjectFee, setSubjectFee] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fee) setSubjectFee(fee.subject_fee);
  }, [fee]);

  const handleChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and up to 5 digits
    if (/^\d{0,5}$/.test(value)) {
      setSubjectFee(value);
      setError(null);
    } else {
      setError("Only numbers up to 5 digits are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectFee) {
      setError("Subject fee is required");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/api/fee/${fee.id}`, {
        subject_fee: subjectFee,
      });
      toast.success("Fee updated successfully");
      onRefresh();
      onClose();
    } catch {
      setError("Failed to update fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Fee</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Subject Fee"
          value={subjectFee}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 5, inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ------------------- FEE TABLE (BORDERLESS) -------------------
const FeeTable = ({ onEdit, refresh, onRefresh, onFeeCountChange }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/fee/fee-paginate`
        );
        const fetchedFees = response.data.fees || [];
        setFees(fetchedFees);
        onFeeCountChange(fetchedFees.length); // send count to parent
        setError(null);
      } catch {
        setError("Failed to fetch fees");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [refresh]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ boxShadow: "none" }}
            >
              <Table
                sx={{
                  borderCollapse: "collapse",
                  "& td, & th": { border: "none" }, // Removes all borders
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#1230ae",
                      "& th": { color: "white", fontWeight: "bold", p: 2 },
                    }}
                  >
                    <TableCell>Subject Fee</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No fees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    fees.map((fee) => (
                      <TableRow
                        key={fee.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>
                          {fee.subject_fee}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(fee)}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// ------------------- MAIN COMPONENT -------------------
function App() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [feeCount, setFeeCount] = useState(0);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <Mainlayout>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold">
              Fee Management
            </Typography>

            {/* Show Add Button only if there are no fees */}
            {feeCount === 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
              >
                Add New Fee
              </Button>
            )}
          </Box>

          <FeeTable
            onEdit={(fee) => {
              setSelectedFee(fee);
              setOpenUpdateDialog(true);
            }}
            refresh={refresh}
            onRefresh={handleRefresh}
            onFeeCountChange={setFeeCount}
          />

          <CreateFeeDialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            onRefresh={handleRefresh}
          />
          <UpdateFeeDialog
            open={openUpdateDialog}
            onClose={() => setOpenUpdateDialog(false)}
            fee={selectedFee}
            onRefresh={handleRefresh}
          />
          <ToastContainer position="top-right" autoClose={3000} />
        </Container>
      </ThemeProvider>
    </Mainlayout>
  );
}

export default App;
