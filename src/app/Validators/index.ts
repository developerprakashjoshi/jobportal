//* validators/index.js
import {createUser,updateUser,deleteUser} from './UserValidator'
import {createPermission,updatePermission,deletePermission} from './PermissionValidator'
import {createRole,updateRole,deleteRole} from './RoleValidator'
import {login,sendOtp,verifyOtp} from './AuthValidator'
import {studentSchema} from './StudentValidator'
export default  module.exports = {
    createUser,updateUser,deleteUser,studentSchema,
    createPermission,updatePermission,deletePermission,
    createRole,updateRole,deleteRole,
    login,sendOtp,verifyOtp
}