const API_URL = "http://localhost:5000/api";

// handle response
const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/login";

        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();
};

// auth

export const registerUser = async (data) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to register");
    }

    return response.json();
};

export const loginUser = async (data) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to login");
    }

    return response.json();
};

// species

export const getSpecies = async (search = "", category = "All") => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (category !== "All") {
        params.append("category", category);
    }

    const response = await fetch(
        `${API_URL}/species?${params.toString()}`
    );

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch species");
    }

    return response.json();
};

export const getSpeciesById = async (id) => {
    const response = await fetch(`${API_URL}/species/${id}`);

    return handleResponse(response);
};

export const createSpecies = async (data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/species`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response);
};


export const updateSpecies = async (id, data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/species/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response);
};


export const deleteSpecies = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/species/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
};
// habitat

export const getHabitats = async () => {
    const response = await fetch(`${API_URL}/habitats`);

    return handleResponse(response);
};

// conservation status

export const getConservationStatuses = async () => {
    const response = await fetch(`${API_URL}/conservation-statuses`);

    return handleResponse(response);
};

// location

export const getLocations = async () => {
    const response = await fetch(`${API_URL}/locations`);

    return handleResponse(response);
};

// sighting

export const getSightings = async (
    search = "",
    species = "",
    location = "",
    date = ""
) => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (species) {
        params.append("species", species);
    }

    if (location) {
        params.append("location", location);
    }

    if (date) {
        params.append("date", date);
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/sightings?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return handleResponse(response);
};

export const getSightingById = async (id) => {
    const response = await fetch(
        `${API_URL}/sightings/${id}`
    );

    return handleResponse(response);
};

export const createSighting = async (data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/sightings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    return handleResponse(response);
};

export const updateSighting = async (id, data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/sightings/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    return handleResponse(response);
};

export const deleteSighting = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/sightings/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return handleResponse(response);
};


// conservation project

export const getConservationProjects = async (
    search = "",
    status = "All"
) => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (status !== "All") {
        params.append("status", status);
    }

    const response = await fetch(
        `${API_URL}/conservation-projects?${params.toString()}`
    );

    return handleResponse(response);
};

export const getConservationProjectById = async (id) => {
    const response = await fetch(`${API_URL}/conservation-projects/${id}`);

    return handleResponse(response);
};
export const createConservationProject = async (data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/conservation-projects`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    return handleResponse(response);
};


export const updateConservationProject = async (id, data) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/conservation-projects/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    return handleResponse(response);
};


export const deleteConservationProject = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/conservation-projects/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response);
};