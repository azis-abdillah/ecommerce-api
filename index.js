import { Role, Permission, PermissionAssignment } from "./app/authorization.js";
import prisma from "./app/prisma.js";

// console.log(Role.ADMINISTRATOR)
// console.log(Permission.BROWSE_BOOKS)
// console.log(PermissionAssignment.regular_user)

const administrator = await prisma.role.findUnique({
  where: { name: Role.ADMINISTRATOR },
  include: {
    permissions: {
      include: {
        permission: true,
      },
    },
  },
});

// administrator.permissions.forEach((permission) => {
//   console.log(permission.permission.name)
// })

const administratorPermissions = administrator.permissions.map((permission) => {
  return permission.permission.name;
});

console.log(administratorPermissions);

const regularUser = await prisma.role.findUnique({
  where: { name: Role.REGULAR_USER },
  include: {
    permissions: {
      include: {
        permission: true,
      },
    },
  },
});

// regularUser.permissions.forEach((permission) => {
//   console.log(permission.permission.name)
// })
