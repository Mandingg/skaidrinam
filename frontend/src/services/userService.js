function translateField(field) {
  const translations = {
    name: "Vardas",
    surname: "Pavardė",
    email: "El. paštas",
    password: "Slaptažodis",
  };

  return translations[field] || field;
}

function translateMessage(message) {
  const translations = {
    "String should have at least 8 characters": "Turi būti bent 8 simboliai",

    "value is not a valid email address": "Neteisingas el. pašto formatas",

    "Field required": "Laukas yra privalomas",
  };

  return translations[message] || message;
}

function getErrorMessage(detail) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((error) => {
        const field = translateField(error.loc?.[1] || "laukas");
        const message = translateMessage(error.msg);
        return `${field}: ${message}`;
      })
      .join(", ");
  }

  return "Įvyko klaida";
}

export async function registerUser(formData) {
  const payload = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    password: formData.password,
  };

  const response = await fetch("http://127.0.0.1:8000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail));
  }

  return data;
}

export const getCurrentUserId = () => {
  // Pavyzdžiui, ateityje:
  // const token = localStorage.getItem('token');
  // return decodeToken(token).userId;
  
  return 1; 
};