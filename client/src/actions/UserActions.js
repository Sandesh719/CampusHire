import {
    registerRequest, registerSuccess, registerFail, loginRequest, loginSuccess, loginFail
    , isLoginRequest, isLoginSuccess, isLoginFail, getMeRequest, getMeSuccess, getMeFail,
    changePasswordRequest, changePasswordSuccess, changePasswordFail,
    updateProfileRequest, updateProfileSuccess, updateProfileFail,
    deleteAccountRequest, deleteAccountSuccess, deleteAccountFail, logoutClearState
} from '../slices/UserSlice'
import { toast } from 'react-toastify'
import axios from 'axios'



export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        const { data } = await axios.post("http://localhost:3000/api/v1/register",userData);

        dispatch(registerSuccess())
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('role', data.user.role)
        dispatch(logOrNot())
        toast.success("Registration successful !")

    } catch (err) {
        console.log(err);
      const message = err?.response?.data?.message || "";
      dispatch(registerFail(message || "Registration failed."))
      if (message.toLowerCase().includes("duplicate")) {
        toast.error("User already exists.")
      } else {
        toast.error(message || "Something went wrong.")
      }
    }
}


export const loginUser = (userData) => async (dispatch) => {
    try {
        dispatch(loginRequest())

        const { data } = await axios.post("http://localhost:3000/api/v1/login", userData);

        dispatch(loginSuccess())
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('role', data.user.role)
        dispatch(logOrNot())
        dispatch(me())
        toast.success("Login successful !")

    } catch (err) {
        dispatch(loginFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const logOrNot = () => async (dispatch) => {
    try {
        dispatch(isLoginRequest())
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.get("http://localhost:3000/api/v1/isLogin", config);

        dispatch(isLoginSuccess(data.isLogin))



    } catch (err) {
        dispatch(isLoginFail())
    }
}


export const me = () => async (dispatch) => {
    try {
        dispatch(getMeRequest())
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.get("http://localhost:3000/api/v1/me", config);
        localStorage.setItem("role", data.user.role)
        dispatch(getMeSuccess(data.user))

    } catch (err) {
        //console.log(err);
        dispatch(getMeFail())
    }
}


export const changePass = (userData) => async (dispatch) => {
    try {
        dispatch(changePasswordRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put("http://localhost:3000/api/v1/changePassword", userData, config)

        dispatch(changePasswordSuccess())
        toast.success("Password Changed successfully !")

    } catch (err) {
        dispatch(changePasswordFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put("http://localhost:3000/api/v1/updateProfile", userData, config)

        dispatch(updateProfileSuccess())
        toast.success("Profile Updated successfully !")
        dispatch(me())

    } catch (err) {
        dispatch(updateProfileFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const deleteAccount = (userData) => async (dispatch) => {
    try {
        console.log(userData)


        dispatch(deleteAccountRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put("http://localhost:3000/api/v1/deleteAccount", userData, config)

        console.log(data)

        dispatch(deleteAccountSuccess())
        if (data.message === "Account Deleted") {
            toast.success("Account Deleted successfully !")
            localStorage.removeItem('userToken')
            dispatch(logOrNot())
            dispatch(logoutClearState())
        }else{
            toast.error("Wrong Password !")
        }


    }
    catch (err) {
        dispatch(deleteAccountFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}