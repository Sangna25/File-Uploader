import { useNavigate } from "react-router-dom";

export function FolderComponent({folder, onRename, onDelete}){
    
     const navigate = useNavigate()
    async function handleRename() {
    const newName = prompt("Enter new folder name:");

    if (!newName) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/mydrive/rename/folder/${folder.id}`,
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
      const updatedFolder = await response.json();
      onRename(updatedFolder);
    }
  }
   async function handleDelete() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/mydrive/delete/folder/${folder.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      onDelete(folder.id);
    }
  }

    return (
        <div className="folder-comp-container"
         onClick={() => navigate(`/mydrive/folder/${folder.id}`)}
         >
            <div className="folder-info">
    <img src="assets/folder.png" alt="folder-image" className="folder-icon" />
                <h2>{folder.name}</h2>
                <p>{new Date(folder.createdAt).toLocaleDateString()}</p>

            </div>
<div className="folder-action-wrapper">
            <div className="folder-action">
                 <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRename();
                    }}
                    >
                    <img src="assets/edit.png" alt="Rename" />
                    </button>
            </div>

                <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                }}
                >
                <img src="assets/delete.png" alt="Delete" />
                </button>
</div>
        </div>
    )
}