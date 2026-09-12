const { prisma} = require("../lib/prisma");
const cloudinary = require("../config/cloudinary")
const fs = require("fs/promises");

const newFolder = async(req, res) =>{
    try{
          const {name, parentId} = req.body;
    const folder = await prisma.folder.create({
        data :{
            name, 
            userId : req.user.id,
            parentId: parentId ? Number(parentId) : null,
        }
    })
    res.status(201).json(folder);
    }catch(err){
        res.status(500).json({message : "Folder creation failed"})
    }
  
}

const newFile = async(req, res) =>{
    let uploadedFile;
    try{
          const {folderId} = req.body;
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
  resource_type: "auto",
});
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        resourceType: uploadedFile.resource_type,
        fileUrl: uploadedFile.secure_url,// view/download file
        public_id: uploadedFile.public_id,//Cloudinary's unique ID
        userId: req.user.id,
        folderId: folderId ? Number(folderId) : null,
      },
    });
    res.status(201).json(file);
    }catch(err){
         if (uploadedFile) {
      await cloudinary.uploader.destroy(uploadedFile.public_id); //deleting orphaned file
    }
        console.error(err)
        res.status(500).json({message : "File creation failed"})
    }finally {
  if (req.file?.path) {
    await fs.unlink(req.file.path).catch(() => {}); //so no duplicates
  }
}
  
}

const renameFolder = async(req,res) =>{
    try {
        const {id} = req.params;
        const {name } = req.body;

        const folder = await prisma.folder.update({
            where : {
                id:Number(id)
            },
            data :{
                name
            }
        })
        res.status(200).json(folder)
    } catch (err){
        res.status(500).json({message :"Folder rename failed"})
    }
}

const renameFile = async(req, res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;
        const file = await prisma.file.findUnique({
            where : {id :Number(id)}
        })

        if (!file) {
  return res.status(404).json({
    message: "File not found",
  });
}
        // rename in cloudinary 
const ext = file.name.split(".").pop();
        const renamed = await cloudinary.uploader.rename(
            file.public_id,
              `file_uploader/${name}.${ext}`
        )

        // update prisma 
        const updatedFile = await prisma.file.update({
            where : {id: Number(id)},
            data:{
               name: `${name}.${ext}`,
                public_id: renamed.public_id,
                fileUrl : renamed.secure_url
            }
        })

        res.status(200).json(updatedFile)
    }catch(err){
        res.status(500).json({message :"Fail to rename file"})
}
} 



const deleteFolder =async(req,res) =>{
    try {
        const id = req.params.id;

        // all files inside the folder
       const files = await prisma.file.findMany({
  where: { folderId: Number(id) }
});

// for each file in files destroy from cloud
for (const file of files) {
  await cloudinary.uploader.destroy(file.public_id);
}
// then delete from prisma
await prisma.file.deleteMany({
  where: { folderId: Number(id) }
});


    // first delete in file cause it would need folderId 
        await prisma.folder.delete({
            where :{
                id: Number(id)
            }
        });
       
        res.status(200).json({
      message: "Folder deleted successfully",
    });
    }catch (err) {
    res.status(500).json({
      message: "Failed to delete folder",
    });
  }
}

const deleteFile = async(req,res)=>{
    const id = req.params.id;
    try {
         

        //find file for cloudinary
        const file = await prisma.file.findUnique({
        where: { id: Number(id) },
        });
        // no such file exits
        if (!file) {
        return res.status(404).json({ message: "File not found" });
        }

        // destroy file in cloudinary
        await cloudinary.uploader.destroy(file.public_id);

        // delete in prisma
        await prisma.file.delete({
            where:{id : Number(id)}
        })

       
         res.status(200).json({
      message: "File deleted successfully",
    });

    } catch (err) {
    res.status(500).json({
      message: "Failed to delete file",
    });
  }
}

const downloadFile = async(req,res) => {
    const id = req.params.id;
    try {
         const file = await prisma.file.findUnique({
        where: { id: Number(id) },
        });
        if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }
    //mimeType : type/subtype egimage/png
    const format = file.mimeType.split("/")[1]; // "pdf"
    const downloadUrl = cloudinary.url(file.public_id, {
        resource_type: file.resourceType,
        type:"upload", // assets was stored by uploading
        flags:"attachment",//uploaded file as an attachment (download).
         format,
    })

    return res.status(302).redirect(downloadUrl)
  
    }catch (err) {
        console.error(err)
    res.status(500).json({
      message: "Failed to download file",
    });
  }
}
//to download cloudinary provides a downloadUrl and browser gets redirected to that download url and downloads the file 

// auto resource type is only for uploading 
const getDrive = async(req,res)=>{
    try {
        const folders = await prisma.folder.findMany({
            where:{userId : req.user.id},
            orderBy:{createdAt :"asc"}
        });

        const files = await prisma.file.findMany({
            where :{
                userId: req.user.id,
                folderId:null
            },
            orderBy:{createdAt:"asc"}
        })
         res.status(200).json({ folders, files });
    } catch(err){
        console.error(err);
        res.status(500).json({
      message: "Failed to fetch drive",
    });
    }
}

const  getFolderById = async(req,res) => {
    try {
        const {id} = req.params
        const folder = await prisma.folder.findUnique({
            where :{id:Number(id)},
            include:{
                children: true,
                files: true
            }
        })

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }
      if (folder.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }


        return  res.status(200).json({ folder });
    } catch(err){
        console.error(err);
         res.status(500).json({
      message: "Failed to fetch folder",
    });
    }
    
}




module.exports = {
  newFolder,
  newFile,
  renameFolder,
  renameFile,
  deleteFolder,
  deleteFile,
  downloadFile,
  getDrive,
  getFolderById
};


//worst bug ever  due to the type for download url so do :
//upload() → resource_type: "auto" is fine.
//url() → use image, video, or raw based on the stored MIME type.