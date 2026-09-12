const {Router} = require("express");
const driveRouter= Router();
const ensureAuthenticated = require("../middleware/auth");

driveRouter.use(ensureAuthenticated);

const upload = require("../middleware/multer");
const {
  newFolder,
  newFile,
  renameFolder,
  renameFile,
  deleteFolder,
  deleteFile,
  downloadFile,
  getDrive,
  getFolderById
} = require("../controllers/driveController");

driveRouter.get('/',getDrive);
driveRouter.get('/folder/:id',getFolderById);
driveRouter.post('/folder', newFolder)
driveRouter.post('/file',
     upload.single("file"),
   newFile);
driveRouter.delete('/delete/file/:id', deleteFile)
driveRouter.delete('/delete/folder/:id', deleteFolder);

driveRouter.put('/rename/file/:id', renameFile)
driveRouter.put('/rename/folder/:id', renameFolder)

driveRouter.get('/download/file/:id', downloadFile)

module.exports= driveRouter