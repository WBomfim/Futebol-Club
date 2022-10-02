export default {
  Valid: {
    email: "admin@admin.com",
    password: "secret_admin"
  },
  InvalidEmail: {
    email: "invalid@admin.com",
    password: "secret_admin"
  },
  InvalidPassword: {
    email: "admin@admin.com",
    password: "invalid_admin"
  },
  emptyEmail: {
    email: "",
    password: "secret_admin"
  },
  emptyPassword: {
    email: "admin@admin.com",
    password: ""
  }
}
