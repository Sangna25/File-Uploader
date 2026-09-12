import { useState } from "react";
import { useEffect } from "react";
import {FileComponent} from "../Components/FileComponent"
import {FolderComponent} from "../Components/FolderComponent"
export function MyDrive(){
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
   
    const [showFolderForm, setShowFolderForm] = useState(false);
const [folderName, setFolderName] = useState("");

const [ showFileForm, setShowFileForm] = useState(false)
const [selectedFile, setSelectedFile] = useState(null); // just like fromEntries

    useEffect(()=>{
        async function fetchDrive() {
            const response = await fetch("http://localhost:8080/mydrive", {
                credentials:"include"
            })
            if (!response.ok) return;
            const {folders,files} = await response.json()
            
            setFiles(files);
            setFolders(folders);
        }
        fetchDrive()
    },[])


    async function  handleFolderUpload(event) {
        event.preventDefault()
        try {
            const response = await fetch("http://localhost:8080/mydrive/folder", {
                credentials:"include",
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                name: folderName,
                
                })
            })
            if(response.ok){
                const newFolder = await response.json();
                setFolders((prev) => [...prev, newFolder]);
                setFolderName("");
                setShowFolderForm(false);
            }else {
  const data = await response.json();
  alert(data.message);
}
        } catch (err) {
    console.error(err);
  }
    }

                async function handleFileUpload(event) {
            event.preventDefault();
            try{
            const formData = new FormData();
            formData.append("file", selectedFile);
            // no content type : broswer auto adds multipart/form-data

            const response = await fetch("http://localhost:8080/mydrive/file", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                const newFile = await response.json();
                setFiles((prev) => [...prev, newFile]);
                setSelectedFile(null);
                setShowFileForm(false);
            }else {
                const data = await response.json();
                alert(data.message);
                }
            } 
            catch (err) {
    console.error(err);
    alert("File upload failed");
            }}
function handleRenameFile(updatedFile) {
  setFiles((prev) =>
    prev.map((file) =>
      file.id === updatedFile.id ? updatedFile : file
    )
  );
}
function handleDeleteFile(deletedId) {
  setFiles((currentFiles) =>
    currentFiles.filter((currentFile) => currentFile.id !== deletedId)
  );
}

function handleRenameFolder(updatedFolder) {
  setFolders((currentFolders) =>
    currentFolders.map((currentFolder) =>
      currentFolder.id === updatedFolder.id
        ? updatedFolder
        : currentFolder
    )
  );
}

function handleDeleteFolder(deletedId) {
  setFolders((currentFolders) =>
    currentFolders.filter(
      (currentFolder) => currentFolder.id !== deletedId
    )
  );
}

    return (
        <div className="myDrive-container">
            <div className="drive-header">
                <h2>My Drive</h2>
                <p className="drive-subtitle">Manage and organize your cloud documents and folders</p>
                {showFolderForm && (
                    <form onSubmit={handleFolderUpload} className="folder-form">
                        <input
                        type="text"
                        placeholder="Folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        required
                        />

                        <button type="submit">Create</button>
                        <button
                        type="button"
                        onClick={() => {
                            setShowFolderForm(false);
                            setFolderName("");
                        }}
                        >
                        Cancel
                        </button>
                    </form>
                    )}

                    {showFileForm && (
                            <form onSubmit={handleFileUpload} className="file-form">
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

                            <button onClick={() => 
                            {setShowFolderForm(true);
                            setShowFileForm(false);
                            setSelectedFile(null);
                            }}>
                            New Folder
                            </button>
                            <button onClick={() => {
                                setShowFileForm(true);
                                setShowFolderForm(false);
                                setFolderName("");
                            }
                                
                            }>
                                Upload File
                                </button>
                        </div>


            <section className="folder-section">
                <h1>My Folders</h1>
            {
                (folders.length === 0) ? <div className="no-result">
                    <p>No folders Found.</p>
                </div>  : folders.map((folder) => (
                     <div className="folder-container" key={folder.id}>
                    <FolderComponent folder={folder} onDelete={handleDeleteFolder} onRename={handleRenameFolder}></FolderComponent>
                </div>
                ))
            }
            </section>

            <section className="file-section">
                <h1>My Files</h1>            {
                (files.length === 0) ? <div className="no-result">
                    <p>No files Found.</p>
                </div>  : files.map((file) => (
                     <div className="file-container" key={file.id}>
                    <FileComponent file={file} onRename={handleRenameFile} onDelete={handleDeleteFile}></FileComponent>
                </div>
                ))
            }
            </section>

        </div>
    )
}