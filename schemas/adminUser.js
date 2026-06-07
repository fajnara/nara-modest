export const adminUserSchema = {
  name: "adminUser",
  title: "Admin User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nama",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      description: "Paste hasil bcrypt hash di sini.",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Super Admin", value: "superadmin" },
          { title: "Admin", value: "admin" },
        ],
      },
      initialValue: "admin",
    },
    {
      name: "isActive",
      title: "Aktif",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
};
