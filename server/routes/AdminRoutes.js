import express from "express"
import {getMyJobs,getAllJobs, getAllUsers, getAllApp, updateApplication, deleteApplication, updateUser, deleteUser, getApplication,getAllApplicationsForRecruiter, getUser, getJob, updateJob, deleteJob} from '../controllers/AdminControllers.js'
import {isAuthenticated, authorizationRoles} from '../middlewares/auth.js'
import {applicationIdValidator,validateHandler , userIdValidator, JobIdValidator} from '../middlewares/validators.js'
const router = express.Router() ;

router.route("/admin/allJobs").get(isAuthenticated ,authorizationRoles("admin") , getAllJobs)
router.route("/admin/allUsers").get(isAuthenticated ,authorizationRoles("admin") , getAllUsers)
router.route("/admin/allApp").get(isAuthenticated ,authorizationRoles("admin") , getAllApp)

router.route("/admin/getApplication/:id").get(isAuthenticated ,authorizationRoles("recruiter") ,applicationIdValidator(),validateHandler, getApplication)
router.route("/admin/updateApplication/:id").put(isAuthenticated ,authorizationRoles("recruiter") ,applicationIdValidator(),validateHandler, updateApplication)
router.route("/admin/deleteApplication/:id").delete(isAuthenticated ,authorizationRoles("recruiter") ,applicationIdValidator(),validateHandler, deleteApplication)
router.get("/admin/allApplications",isAuthenticated,authorizationRoles("recruiter"),getAllApplicationsForRecruiter);

router.route("/admin/getUser/:id").get(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, getUser)
router.route("/admin/updateUser/:id").put(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, updateUser)
router.route("/admin/deleteUser/:id").delete(isAuthenticated ,authorizationRoles("admin") ,userIdValidator(),validateHandler, deleteUser)

router.route("/admin/getJob/:id").get(isAuthenticated ,authorizationRoles("recruiter") ,JobIdValidator(),validateHandler, getJob)
router.route("/admin/updateJob/:id").put(isAuthenticated ,authorizationRoles("recruiter") ,JobIdValidator(),validateHandler, updateJob)
router.route("/admin/deleteJob/:id").delete(isAuthenticated ,authorizationRoles("recruiter") ,JobIdValidator(),validateHandler, deleteJob)
router.route("/admin/myJobs").get(isAuthenticated, authorizationRoles("recruiter"), getMyJobs);


export default router ;