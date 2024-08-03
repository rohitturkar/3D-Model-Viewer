import React from "react";
import supabase from "../../utils/supabase";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = ({setModelLink}) => {
  const [open, setOpen] = React.useState(false);
  const navigate=useNavigate()

  const handleSubmit = async (file) => {
    setModelLink('')
    console.log(file, "file");
    setOpen(true);

    try {
      const { error } = await supabase.storage
        .from("modelview")
        .upload(`uploads/${file.name}`, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("modelview")
        .getPublicUrl(`uploads/${file.name}`);

        setModelLink(data?.publicUrl)

      toast.success("Model Uploaded Sucessfully");
   
      setOpen(false);
      navigate('/editor')
    
    } catch (error) {
        setModelLink('')
      toast.error(error.message);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-[80vh]">
        <div className="flex flex-col mt-10 w-[700px] p-10 outline-none border-2 bg-white rounded-md shadow-xl">
          <h4 className="mb-6 text-lg font-bold text-center text-[#444] lowercase">
            UPLOAD 3D MODEL AND VIEW ON EDITOR HERE
          </h4>
          <div className="flex justify-center items-center">
            <label className="border-2 border-dotted bg-gray-50 w-[700px] p-10 text-center flex flex-col justify-center items-center gap-4 rounded-md text-sm cursor-pointer">
              <p className="text-2xl text-amber-500 font-semibold">
                Upload or Drag and Drop Your 3D Model here
              </p>
              <input
                id="glbInput"
                type="file"
                accept=".glb"
                className="hidden"
                onChange={(event) => handleSubmit(event.target.files[0])}
              />
              <p className="text-center my-2 text-md font-semibold">
                Supported Format:- GLB
              </p>
              <label
                htmlFor="glbInput"
                className="bg-blue-700 text-lg text-white px-6 py-4 rounded-md outline-none"
              >
                UPLOAD MODEL
              </label>
            </label>
          </div>
        </div>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="flex flex-col mb-20 items-center justify-center gap-2">
          <CircularProgress color="inherit" />
          <p>Uploding Model...</p>
        </div>
      </Backdrop>
    </>
  );
};

export default Home;
