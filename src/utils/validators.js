export const isEmail=e=>/\S+@\S+\.\S+/.test(e);

export const isStrongPassword = pwd => (pwd || '').length >= 6;
