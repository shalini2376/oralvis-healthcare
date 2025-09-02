import React, {useState} from 'react';

function TechnicianDashboard() {
    const [formData, setFormData] = useState({
        patientName: "",
        patientId: "",
        scanType: "",
        region: "",
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // handle Text Input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle file Input 
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // handle From Submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file){
            setMessage("Please select a file to upload");
            return;
        }

        const token = localStorage.getItem("token");
        const data = new FormData();

        // append fields
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key,value);
        });
        data.append("image", file);

        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            const result = await res.json();
            if(res.ok){
                setMessage(result.message);
                setImageUrl(result.imageUrl);
                console.log(result);

                // reset form data + file after form submission
                setFormData({
                  patientName: "",
                  patientId: "",
                  scanType: "",
                  region: "",
                });
                setFile(null);
                // Reset file input field (since React doesn't control it)
                e.target.reset();
            } else {
                setMessage("Error: " + (result.error || "Upload failed"));
            }
        } catch(err) {
            console.error(err)
            setMessage("Network error");
        }
    };

  return (
    <div className="mh-100 d-flex flex-column justify-content-center align-items-center">
        <h2 className="p-4 text-primary text-center">Welcome Technician🧑‍⚕️🦷- Upload data here! </h2>
    <form onSubmit={handleSubmit} className="border p-4 shadow-lg rounded ">
  <div className="form-group mb-2 w-100">
    <label htmlFor="patientName">Patient Name:</label>
    <input
      className="form-control"
      id="patientName"
      type="text"
      name="patientName"
      value={formData.patientName}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group mb-2">
    <label htmlFor="patientId">Patient ID:</label>
    <input
      className="form-control"
      id="patientId"
      type="text"
      name="patientId"
      value={formData.patientId}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group mb-2">
    <label htmlFor="scanType">Scan Type:</label>
    <input
      className="form-control"
      id="scanType"
      type="text"
      name="scanType"
      value={formData.scanType}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group mb-2">
    <label htmlFor="region">Region:</label>
    <input
      className="form-control"
      id="region"
      type="text"
      name="region"
      value={formData.region}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group mb-2">
    <label htmlFor="image">Upload Image:</label>
    <input
      className="form-control"
      id="image"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      required
    />
  </div>
    <div className="text-center">
        <button className="btn btn-primary mt-2" type="submit">Upload</button>
    </div>
    </form>
    {message && <p>{message}</p>}
    {imageUrl && (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p>Uploaded Image:</p>
          <img className="p-2 mb-3" src={imageUrl} alt="Uploaded scan" width="200" />
        </div>
      )}
    </div>
  );
}
export default TechnicianDashboard;
