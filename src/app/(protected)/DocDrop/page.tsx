"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const addFile = useMutation(api.files.addFile);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach(file => {
      const fileType = file.type;
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        addFile({ name: file.name, type: fileType, content: fileContent });
      };
      reader.readAsDataURL(file);
    });
  }, [addFile]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #0070f3', padding: '20px', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name} - {file.size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadPage;