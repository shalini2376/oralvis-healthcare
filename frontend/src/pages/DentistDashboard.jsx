import { useEffect, useState } from "react";
import { generatePDF } from "../utils/pdfGenerator";

function DentistDashboard() {
    const [scans, setScans] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchScans = async () => {
            const token = localStorage.getItem("token");
            
            try {
                const res = await fetch("http://localhost:5000/scans", {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (!res.ok){
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                console.log("Scans from backend:", data)
                setScans(data);
            } catch(err) {
                console.error("Error fetching scans:", err)
            }
        };
        fetchScans();
    }, []);

  return (
      <div className="container my-4">
        <h2 className="text-center text-primary p-3">Welcome Dentist 🦷- See Uploaded Scans here!</h2>
        <div className="row">
            {scans.map((scan) => (
                <div className="col-md-4 mb-4" key={scan.id}>
                    <div className="card shadow-sm h-100">
                        <img 
                            src={scan.imageUrl}
                            className="card-img-top"
                            alt="Scan Thumbnail"
                            style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                            onClick={() => setSelectedImage(scan.imageUrl)}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{scan.patientName}</h5>
                            <p className="card-text mb-1">
                                <strong>ID:</strong> {scan.patientId}
                            </p>
                            <p className="card-text mb-1">
                            <strong>Type:</strong> {scan.scanType}
                            </p>
                            <p className="card-text mb-1">
                            <strong>Region:</strong> {scan.region}
                            </p>
                            <p className="card-text text-muted">
                            <small>{new Date(scan.uploadDate).toLocaleString()}</small>
                            </p>
                            <div className="d-flex flex-row gap-2 flex-wrap">
                                <button className="btn btn-primary btn-sm " onClick={() => setSelectedImage(scan.imageUrl)}>View Full Img</button>
                                <button className="btn btn-sm btn-primary" onClick={() => generatePDF(scan)}>Download Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0 shadow-none">
              <div className="modal-body d-flex justify-content-center">
                <img
                  src={selectedImage}
                  alt="Full Scan"
                  className="img-fluid"
                  style={{ maxHeight: "90vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DentistDashboard;
