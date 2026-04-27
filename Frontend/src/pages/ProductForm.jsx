import React, { useState, useRef } from "react";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageFile: null,
    capturedImage: null,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  // Open camera
  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  // Capture photo
  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const imageData = canvasRef.current.toDataURL("image/png");
    setForm({ ...form, capturedImage: imageData });

    // Stop the camera
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
    alert("Form submitted! Check console for details.");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Upload from folder */}
        <div>
          <label className="block mb-1 font-medium">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {form.imageFile && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {form.imageFile.name}
            </p>
          )}
        </div>

        {/* Capture with camera */}
        <div>
          <label className="block mb-1 font-medium">Capture with Camera</label>
          {!isCameraOpen && (
            <button
              type="button"
              onClick={openCamera}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Open Camera
            </button>
          )}
          {isCameraOpen && (
            <div className="mt-2">
              <video ref={videoRef} width="320" height="240" className="border" />
              <button
                type="button"
                onClick={capturePhoto}
                className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Capture
              </button>
            </div>
          )}
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          {form.capturedImage && (
            <div className="mt-2">
              <p className="text-sm">Captured Photo:</p>
              <img src={form.capturedImage} alt="Captured" className="border rounded" />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
