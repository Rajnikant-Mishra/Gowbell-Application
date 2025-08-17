


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../../Layouts/Mainlayout";
// import {
//   TextField,
//   Box,
//   Container,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";

// const CreateRoleForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     item_id: "",
//     parent_id: "",
//   });
//   const [items, setItems] = useState([]);
//   const [subItems, setSubItems] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/t1/items`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Add Authorization header if needed
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const itemsArray = data.data || data.items || data || [];
//           setItems(itemsArray);
//         } else {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Failed to fetch items.",
//             showConfirmButton: false,
//             timer: 1000,
//             timerProgressBar: true,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//         }
//       } catch (error) {
//         console.error("Fetch Items Error:", error);
//         Swal.fire({
//           title: "Error",
//           text: "An unexpected error occurred while fetching items.",
//           icon: "error",
//         });
//       }
//     };

//     const fetchSubItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/s1/all`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const subItemsArray = data.data || data.subitems || data || [];
//           setSubItems(subItemsArray);
//         } else {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Failed to fetch subitems.",
//             showConfirmButton: false,
//             timer: 1000,
//             timerProgressBar: true,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//         }
//       } catch (error) {
//         console.error("Fetch SubItems Error:", error);
//         Swal.fire({
//           title: "Error",
//           text: "An unexpected error occurred while fetching subitems.",
//           icon: "error",
//         });
//       }
//     };

//     fetchItems();
//     fetchSubItems();
//   }, []);



//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.item_id) {
//       setError("Please select an item.");
//       return;
//     }

//     if (!formData.name) {
//       setError("Sub Item name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/s1/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Add Authorization header if needed
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           item_id: parseInt(formData.item_id, 10),
//           parent_id: formData.parent_id
//             ? parseInt(formData.parent_id, 10)
//             : null,
//         }),
//       });

//       const errorData = await response.json();
//       if (response.ok) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           text: `Sub Item created successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         }).then(() => {
//           navigate("/subitem-list");
//         });
//       } else {
//         console.error("API Error Response:", errorData);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: errorData.message || "Failed to create sub item.",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       Swal.fire({
//         title: "Error",
//         text: "An unexpected error occurred.",
//         icon: "error",
//       });
//     }
//   };

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//     }));
//   }, []);

//   if (items.length === 0) {
//     return (
//       <Mainlayout>
//         <Container maxWidth="sm">
//           <Typography variant="h4" align="center" gutterBottom>
//             Loading items...
//           </Typography>
//         </Container>
//       </Mainlayout>
//     );
//   }

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "SubItem", link: "/subitem-list" },
//             { name: "Create SubItem" },
//           ]}
//         />
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 7,
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Create Sub Item
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
//               <InputLabel id="item-select-label" style={{ fontSize: "14px" }}>
//                 Item
//               </InputLabel>
//               <Select
//                 labelId="item-select-label"
//                 name="item_id"
//                 value={formData.item_id}
//                 onChange={handleChange}
//                 label="Item"
//                 style={{ fontSize: "14px" }}
//               >
//                 <MenuItem value="">
//                   <em>Select an item</em>
//                 </MenuItem>
//                 {items.map((item) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>


//             <TextField
//               label="Sub Item"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               required
//               InputProps={{ style: { fontSize: "14px" } }}
//               InputLabelProps={{ style: { fontSize: "14px" } }}
//               error={!!error}
//               helperText={error}
//             />

//              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//               <InputLabel id="parent-select-label" style={{ fontSize: "14px" }}>
//                 Parent SubItem (Optional)
//               </InputLabel>
//               <Select
//                 labelId="parent-select-label"
//                 name="parent_id"
//                 value={formData.parent_id}
//                 onChange={handleChange}
//                 label="Parent SubItem (Optional)"
//                 style={{ fontSize: "14px" }}
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {subItems.map((subItem) => (
//                   <MenuItem key={subItem.id} value={subItem.id}>
//                     {subItem.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//               <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/subitem-list")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateRoleForm;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Mainlayout from "../../Layouts/Mainlayout";
// import {
//   TextField,
//   Box,
//   Container,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import Breadcrumb from "../../CommonButton/Breadcrumb";
// import ButtonComp from "../../School/CommonComp/ButtonComp";
// import { API_BASE_URL } from "../../ApiConfig/APIConfig";
// import "../../Common-Css/Swallfire.css";

// const CreateRoleForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     item_id: "",
//     parent_id: "",
//   });
//   const [items, setItems] = useState([]);
//   const [subItems, setSubItems] = useState([]);
//   const [filteredSubItems, setFilteredSubItems] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/t1/items`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const itemsArray = data.data || data.items || data || [];
//           setItems(itemsArray);
//         } else {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Failed to fetch items.",
//             showConfirmButton: false,
//             timer: 1000,
//             timerProgressBar: true,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//         }
//       } catch (error) {
//         console.error("Fetch Items Error:", error);
//         Swal.fire({
//           title: "Error",
//           text: "An unexpected error occurred while fetching items.",
//           icon: "error",
//         });
//       }
//     };

//     const fetchSubItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/s1/all`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const subItemsArray = data.data || data.subitems || data || [];
//           setSubItems(subItemsArray);
//         } else {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Error!",
//             text: "Failed to fetch subitems.",
//             showConfirmButton: false,
//             timer: 1000,
//             timerProgressBar: true,
//             toast: true,
//             background: "#fff",
//             customClass: { popup: "small-swal" },
//           });
//         }
//       } catch (error) {
//         console.error("Fetch SubItems Error:", error);
//         Swal.fire({
//           title: "Error",
//           text: "An unexpected error occurred while fetching subitems.",
//           icon: "error",
//         });
//       }
//     };

//     fetchItems();
//     fetchSubItems();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "item_id") {
//       const selectedSubItems = subItems.filter(
//         (subItem) => subItem.item_id === parseInt(value, 10)
//       );
//       setFilteredSubItems(selectedSubItems);
//       setFormData((prev) => ({ ...prev, parent_id: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.item_id) {
//       setError("Please select an item.");
//       return;
//     }

//     if (!formData.name) {
//       setError("Sub Item name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/s1/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           item_id: parseInt(formData.item_id, 10),
//           parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
//         }),
//       });

//       const errorData = await response.json();
//       if (response.ok) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           text: `Sub Item created successfully!`,
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         }).then(() => {
//           navigate("/subitem-list");
//         });
//       } else {
//         console.error("API Error Response:", errorData);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error!",
//           text: errorData.message || "Failed to create sub item.",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           toast: true,
//           background: "#fff",
//           customClass: { popup: "small-swal" },
//         });
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       Swal.fire({
//         title: "Error",
//         text: "An unexpected error occurred.",
//         icon: "error",
//       });
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <Mainlayout>
//         <Container maxWidth="sm">
//           <Typography variant="h4" align="center" gutterBottom>
//             Loading items...
//           </Typography>
//         </Container>
//       </Mainlayout>
//     );
//   }

//   return (
//     <Mainlayout>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Breadcrumb
//           data={[
//             { name: "SubItem", link: "/subitem-list" },
//             { name: "Create SubItem" },
//           ]}
//         />
//       </div>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             mt: 7,
//             p: 2,
//             borderRadius: 2,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Create Sub Item
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
//               <InputLabel id="item-select-label" style={{ fontSize: "14px" }}>
//                 Item
//               </InputLabel>
//               <Select
//                 labelId="item-select-label"
//                 name="item_id"
//                 value={formData.item_id}
//                 onChange={handleChange}
//                 label="Item"
//                 style={{ fontSize: "14px" }}
//               >
//                 <MenuItem value="">
//                   <em>Select an item</em>
//                 </MenuItem>
//                 {items.map((item) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Sub Item"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               required
//               InputProps={{ style: { fontSize: "14px" } }}
//               InputLabelProps={{ style: { fontSize: "14px" } }}
//               error={!!error}
//               helperText={error}
//               sx={{ mb: 2 }}
//             />

//             {filteredSubItems.length > 0 && (
//               <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                 <InputLabel id="parent-select-label" style={{ fontSize: "14px" }}>
//                   Parent SubItem (Optional)
//                 </InputLabel>
//                 <Select
//                   labelId="parent-select-label"
//                   name="parent_id"
//                   value={formData.parent_id}
//                   onChange={handleChange}
//                   label="Parent SubItem (Optional)"
//                   style={{ fontSize: "14px" }}
//                 >
//                   <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem>
//                   {filteredSubItems.map((subItem) => (
//                     <MenuItem key={subItem.id} value={subItem.id}>
//                       {subItem.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )}

//             <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//               <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
//               <ButtonComp
//                 text="Cancel"
//                 type="button"
//                 sx={{ flexGrow: 1 }}
//                 onClick={() => navigate("/subitem-list")}
//               />
//             </Box>
//           </form>
//         </Box>
//       </Container>
//     </Mainlayout>
//   );
// };

// export default CreateRoleForm;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mainlayout from "../../Layouts/Mainlayout";
import {
  TextField,
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import Breadcrumb from "../../CommonButton/Breadcrumb";
import ButtonComp from "../../School/CommonComp/ButtonComp";
import { API_BASE_URL } from "../../ApiConfig/APIConfig";
import "../../Common-Css/Swallfire.css";

const CreateRoleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    item_id: "",
    parent_id: "",
  });
  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [filteredSubItems, setFilteredSubItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/t1/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const itemsArray = data.data || data.items || data || [];
          setItems(itemsArray);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Failed to fetch items.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: { popup: "small-swal" },
          });
        }
      } catch (error) {
        console.error("Fetch Items Error:", error);
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred while fetching items.",
          icon: "error",
        });
      }
    };

    const fetchSubItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/s1/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const subItemsArray = data.data || data.subitems || data || [];
          setSubItems(subItemsArray);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text: "Failed to fetch subitems.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            toast: true,
            background: "#fff",
            customClass: { popup: "small-swal" },
          });
        }
      } catch (error) {
        console.error("Fetch SubItems Error:", error);
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred while fetching subitems.",
          icon: "error",
        });
      }
    };

    fetchItems();
    fetchSubItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "item_id") {
      // Filter sub-items based on the selected item_id
      const selectedSubItems = subItems.filter(
        (subItem) => subItem.item_id === parseInt(value, 10)
      );
      setFilteredSubItems(selectedSubItems);
      // Reset parent_id when item changes to prevent invalid selections
      setFormData((prev) => ({ ...prev, parent_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_id) {
      setError("Please select an item.");
      return;
    }

    if (!formData.name) {
      setError("Sub Item name is required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/s1/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          item_id: parseInt(formData.item_id, 10),
          parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        }),
      });

      const errorData = await response.json();
      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: `Sub Item created successfully!`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        }).then(() => {
          navigate("/subitem-list");
        });
      } else {
        console.error("API Error Response:", errorData);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to create sub item.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          background: "#fff",
          customClass: { popup: "small-swal" },
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  if (items.length === 0) {
    return (
      <Mainlayout>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Loading items...
          </Typography>
        </Container>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb
          data={[
            { name: "SubItem", link: "/subitem-list" },
            { name: "Create SubItem" },
          ]}
        />
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 7,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Sub Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
              <InputLabel id="item-select-label" style={{ fontSize: "14px" }}>
                Item
              </InputLabel>
              <Select
                labelId="item-select-label"
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                label="Item"
                style={{ fontSize: "14px" }}
              >
                <MenuItem value="">
                  <em>Select an item</em>
                </MenuItem>
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Sub Item"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              InputProps={{ style: { fontSize: "14px" } }}
              InputLabelProps={{ style: { fontSize: "14px" } }}
              error={!!error}
              helperText={error}
              sx={{ mb: 2 }}
            />

            {filteredSubItems.length > 0 && (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="parent-select-label" style={{ fontSize: "14px" }}>
                  Parent SubItem (Optional)
                </InputLabel>
                <Select
                  labelId="parent-select-label"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleChange}
                  label="Parent SubItem (Optional)"
                  style={{ fontSize: "14px" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {filteredSubItems.map((subItem) => (
                    <MenuItem key={subItem.id} value={subItem.id}>
                      {subItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <ButtonComp text="Submit" type="submit" sx={{ flexGrow: 1 }} />
              <ButtonComp
                text="Cancel"
                type="button"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/subitem-list")}
              />
            </Box>
          </form>
        </Box>
      </Container>
    </Mainlayout>
  );
};

export default CreateRoleForm;