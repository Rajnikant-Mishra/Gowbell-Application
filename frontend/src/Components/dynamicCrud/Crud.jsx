import { useEffect } from "react";

const Crud = () => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("roleDetails"));
    if (storedPermissions) {
      setPermissions(storedPermissions);
    }
  }, []);

  return (
    <>
      {permissions.create && <button>Create</button>}
      {permissions.edit && <button>Edit</button>}
      {permissions.update && <button>Update</button>}
      {permissions.delete && <button>Delete</button>}
    </>
  );
};

export default Crud;
