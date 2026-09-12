import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FolderComponent } from "../Components/FolderComponent";
import { FileComponent } from "../Components/FileComponent";


export function FolderPage(){

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
    const {id} = useParams()
   const [showFileForm, setShowFileForm] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
    useEffect(()=>{
        async function fetchFolder (){
            const response = await fetch(
                ` http://localhost:8080/mydrive/folder/${id}`,{
                    credentials:"include"
                }
            )

            if(!response.ok) return ;

            const {folder} = await response.json();
            setFolder(folder);
            setFiles(folder.files);
        }

        fetchFolder()
    }, [id])

    async function handleFileUpload(event) {
  event.preventDefault();

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderId", id);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/mydrive/file`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      const newFile = await response.json();
      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setShowFileForm(false);
    } else {
      const data = await response.json();
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}
  
  function handleRenameFile(updatedFile) {
  setFiles((currentFiles) =>
    currentFiles.map((currentFile) =>
      currentFile.id === updatedFile.id ? updatedFile : currentFile
    )
  );
}

function handleDeleteFile(deletedId) {
  setFiles((currentFiles) =>
    currentFiles.filter((currentFile) => currentFile.id !== deletedId)
  );
}
  
    return (
        <div className="folder-page-container">
              <h2>{folder?.name}</h2>
              <button onClick={() => setShowFileForm(true)}>
                Upload File
                </button>

                {showFileForm && (
                <form onSubmit={handleFileUpload}>
                    <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                    />

                    <button type="submit">Upload</button>
                    <button
                    type="button"
                    onClick={() => {
                        setShowFileForm(false);
                        setSelectedFile(null);
                    }}
                    >
                    Cancel
                    </button>
                </form>
                )}
                 <section className="file-section">
                    {files.length === 0 ? (
                        <p>No files found.</p>
                        ) : (
                        files.map((file) => (
                            <FileComponent
                            key={file.id}
                            file={file}
                            onRename={handleRenameFile}
                            onDelete={handleDeleteFile}
                            />
                        ))
                        )}
                 </section>

        </div>
    )
}