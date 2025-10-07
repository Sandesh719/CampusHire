import express from "express"
import {getAllJobs, getAllUsers, getAllApp, updateApplication, deleteApplication, updateUser, deleteUser, getApplication, getUser, getJob, updateJob, deleteJob} from '../controllers/AdminControllers.js'
import {isAuthenticated, authorizationRoles} from '../middlewares/auth.js'
import {applicationIdValidator,validateHandler , userIdValidator, JobIdValidator} from '../middlewares/validators.js'
const router = express.Router() ;

router.route("/admin/allJobs").get(isAuthenticated ,authorizationRoles("admin") , getAllJobs)
router.route("/admin/allUsers").get(isAuthenticated ,authorizationRoles("admin") , getAllUsers)
router.route("/admin/allApp").get(isAuthenticated ,authorizationRoles("admin") , getAllApp)

router.route("/admin/getApplication/:id").get(isAuthenticated ,authorizationRoles("admin") ,applicationIdValidator(),validateHandler, getApplication)
router.route("/admin/updateApplication/:id").put(isAuthenticated ,authorizationRoles("admin") ,applicationIdValidator(),validateHandler, updateApplication)
router.route("/admin/deleteApplication/:id").delete(isAuthenticated ,authorizationRoles("admin") ,applicationIdValidator(),validateHandler, deleteApplication)

router.route("/admin/getUser/:id").get(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, getUser)
router.route("/admin/updateUser/:id").put(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, updateUser)
router.route("/admin/deleteUser/:id").delete(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, deleteUser)

router.route("/admin/getJob/:id").get(isAuthenticated ,authorizationRoles("admin") ,JobIdValidator(),validateHandler, getJob)
router.route("/admin/updateJob/:id").put(isAuthenticated ,authorizationRoles("admin") ,JobIdValidator(),validateHandler, updateJob)
router.route("/admin/deleteJob/:id").delete(isAuthenticated ,authorizationRoles("admin") ,JobIdValidator(),validateHandler, deleteJob)



export default router ;