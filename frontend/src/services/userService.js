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

    "String should have at most 72 characters":
      "Turi būti ne daugiau kaip 72 simboliai",

    "value is not a valid email address": "Neteisingas el. pašto formatas",

    "value is not a valid email address: The part after the @-sign is not valid. It should have a period.":
      "Neteisingas el. pašto formatas.",

    "Field required": "Laukas yra privalomas",

    "Value error, Slaptažodyje turi būti bent viena didžioji raidė":
      "Slaptažodyje turi būti bent viena didžioji raidė",

    "Value error, Slaptažodyje turi būti bent vienas specialus simbolis":
      "Slaptažodyje turi būti bent vienas specialus simbolis",
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

export async function updateUser(formData) {
  const input = {};

  if (formData.name) input.name = formData.name;
  if (formData.surname) input.surname = formData.surname;
  if (formData.email) input.email = formData.email;
  if (formData.password) input.password = formData.password;

  const response = await fetch(`http://127.0.0.1:8000/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail));
  }

  return data;
}

export async function getUser() {
  const response = await fetch(`http://127.0.0.1:8000/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail));
  }

  return data;
}

export async function deleteUser() {
  const response = await fetch("http://127.0.0.1:8000/users/me", {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail));
  }

  return data;
}

export async function getCurrentUserId() {
  try {
    // Token ištraukimas is localStorage
    const token = localStorage.getItem("token");

    // Kreipiamės į veikiantį adresą /me
    const response = await fetch("http://127.0.0.1:8000/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Nepavyko gauti vartotojo");
    }
    return data.id;
  } catch (err) {
    console.warn(`Klaida gaunant vartotojo informaciją: ${err.message}`);
  }
}

export async function updateSubscription(subscriptionType) {
  const response = await fetch ('http://127.0.0.1:8000/users/me/subscription', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ subscription_type: subscriptionType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Nepavyko gauti vartotojo prenumeratos informacijos");
  }

  return data;
}
