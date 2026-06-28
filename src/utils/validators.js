/**
 * Validates the user form data.
 * Returns an object of field-level error messages.
 */
export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = 'Enter a valid email address (e.g. name@example.com).';
  }

  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Department is required.';
  }

  return errors;
};

/**
 * Returns true if there are no validation errors.
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;
