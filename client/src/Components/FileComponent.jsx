export function FileComponent ({file, onRename, onDelete}){
function handleDownload() {
window.location.href = `${import.meta.env.VITE_API_URL}/mydrive/download/file/${file.id}`;
} 
async function handleRename() {
     const newName = prompt("Enter new file name:");
  if (!newName) return;
   const response = await fetch(
  `${import.meta.env.VITE_API_URL}/mydrive/rename/file/${file.id}`,
  {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  }
);
        if (response.ok) {
  const updatedFile = await response.json();
  onRename(updatedFile);
            }else {
  const data = await response.json();
  alert(data.message);
}
    
        }

    
async function handleDelete() {
    const response = await fetch(
    `${import.meta.env.VITE_API_URL}/mydrive/delete/file/${file.id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
   if (response.ok) {
    onDelete(file.id);
  } else {
    const data = await response.json();
    alert(data.message);
  }}

    return(
        <div className="file-comp-container">
            <div className="file-info">
    <img src="assets/file.png" alt="file-image" className="file-icon" />
                <h3>{file.name}</h3>
                <p> {(file.size / 1024).toFixed(1)} KB •{" "}
                </p>
                <p> {new Date(file.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="file-actions">
                <button type="button" onClick={handleDownload}>
                    <img src="/assets/download.png" alt="download" />
                </button>
                 <button type="button" onClick={handleRename}>
                <img src="/assets/edit.png" alt="Rename" />
                </button>

                <button type="button" onClick={handleDelete}>
                <img src="/assets/delete.png" alt="Delete" />
                </button>
            </div>

        </div>
    )
}