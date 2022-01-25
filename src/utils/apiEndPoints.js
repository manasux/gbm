const defaults = {
  methods: {
    GET: {
      method: 'GET',
    },
    POST: {
      method: 'POST',
    },
    PUT: {
      method: 'PUT',
    },
    DELETE: {
      method: 'DELETE',
    },
  },
  versions: {
    v1: {
      version: '/xapi/v1',
    },
  },
};

const apiEndPoints = {
  user: {
    fetchCurrent: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    updateCurrent: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    uploadAvatar: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/profileImage',
        headerProps: {
          'Content-Type': 'multipart/form-data',
        },
      },
    },
    updateProfile: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId',
      },
    },
    forgotPassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/reset/password',
      },
    },
    updatePassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/update/password',
      },
    },
    checkExistingUser: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/user/isExistingLoginId',
      },
    },
    resetPassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/reset/password',
      },
    },
  },
  request: {
    getRequestList: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/requests',
      },
    },
  },
  common: {
    getStateCodes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/common/country/:countryId/provinces',
      },
    },
  },
  company: {
    // POST endpoints for Add Company Page
    createCompany: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/companies',
      },
    },
    createCompanyPartners: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/partners',
      },
    },
    createEmployee: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/employees',
      },
    },

    // GET endpoints for Add Company Page

    getCompanyList: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies',
      },
    },

    getCompanyDetail: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:companyId',
      },
    },

    getCompany: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:companyId',
      },
    },

    getCompanyPartners: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/partners',
      },
    },

    getEmployeesInfo: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/employees',
      },
    },

    // Update endpoints for Add Company Page

    UpdateCompany: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/companies/:companyId',
      },
    },

    updateCompanyPartners: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/partners',
      },
    },

    updateEmployeesInfo: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/employees',
      },
    },
    // DELETE endpoints for Add Company Page

    deleteCompanyPartners: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/partners/:partnerId',
      },
    },

    deleteCompanyEmployees: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/companies/:companyId/employees/:employeesId',
      },
    },

    // ******************* //
    getAssigneeList: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:brandId/employees',
      },
    },
    getParticularAssignee: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/companies/:brandId/employees/:empId',
      },
    },

    getSupervisors: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/clients/invite/accepted',
      },
    },
  },

  staff: {
    createStaff: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/admin/clients/invite',
      },
    },
    inviteUser: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/clients/invite/accept',
      },
    },
    addClassToStaff: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId/class/association',
      },
    },
    deleteClassOfStaff: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/teachers/:staffId/class/association',
      },
    },
    getStaffList: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/clients/invite/:type',
      },
    },
    getStaffDetails: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customers/staff/:staffId',
      },
    },
    // API endpoint to delete staff contents
    deleteStaffContents: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/content/:contentId',
      },
    },
    // API endpoint to Activate/Deactivate staff contents
    enableDisableStaff: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/:staffStatus',
      },
    },
    updateStaffDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/staff/:staffId',
      },
    },
    updateStaffContents: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contents',
      },
    },
    getStaffContents: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:staffId/contents',
      },
    },
  },
  students: {
    getStudents: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:type',
      },
    },
    setApproval: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/students/:studentId/request/approve',
      },
    },
    getStudent: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId',
      },
    },
    updateStudentDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/students/:studentId',
      },
    },
    getStudentTaskNotes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks/:taskId/notes',
      },
    },
    getStudentTaskAssignment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks/:taskId/contents',
      },
    },
    getStudentTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/tasks',
      },
    },
    getStudentStats: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/students/:studentId/stats',
      },
    },
  },
  teachers: {
    getTeachers: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers',
      },
    },
    searchTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/tasks/search',
      },
    },
    getTeacherTasks: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks',
      },
    },
    getTaskNote: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks/:taskId/notes',
      },
    },
    getTaskAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/teachers/:teacherId/tasks/:taskId/contents',
      },
    },
  },
};

export default apiEndPoints;
