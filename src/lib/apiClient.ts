const API_BASE = "http://localhost:3001/api/v1";

class ApiClient {
  private get token(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bh_token");
    }
    return null;
  }

  private set token(value: string | null) {
    if (typeof window !== "undefined") {
      if (value) {
        localStorage.setItem("bh_token", value);
      } else {
        localStorage.removeItem("bh_token");
      }
    }
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set("Authorization", this.token);
    }
    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    // Capture token if present in authorization header (login/register)
    const authHeader = response.headers.get("Authorization");
    if (authHeader) {
      this.token = authHeader;
    }

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Request failed";
      try {
        const json = JSON.parse(text);
        errorMessage = json.error || json.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  // Authentication
  async register(params: any) {
    return this.request("/users/signup", {
      method: "POST",
      body: JSON.stringify({ user: params })
    });
  }

  async login(params: any) {
    return this.request("/users/login", {
      method: "POST",
      body: JSON.stringify({ user: params })
    });
  }

  async logout() {
    await this.request("/users/logout", { method: "DELETE" });
    this.token = null;
  }

  async guestUpgrade(params: any) {
    return this.request("/users/guest_upgrade", {
      method: "POST",
      body: JSON.stringify({ user: params })
    });
  }

  async getCurrentUser() {
    if (!this.token) return null;
    try {
      return await this.request("/users/me");
    } catch {
      this.token = null;
      return null;
    }
  }

  // Dive Sites
  async getDiveSites(month?: number) {
    const query = month !== undefined ? `?month=${month}` : "";
    return this.request(`/dive_sites${query}`);
  }

  async getDiveSite(id: string, month?: number) {
    const query = month !== undefined ? `?month=${month}` : "";
    return this.request(`/dive_sites/${id}${query}`);
  }

  // Trips
  async getTrips(params: { dive_site_id?: string; date_from?: string; date_to?: string; min_cert_level?: string } = {}) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/trips?${query}`);
  }

  // Bookings
  async getBookings() {
    return this.request("/bookings/mine");
  }

  async createBooking(bookingParams: any) {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify({ booking: bookingParams })
    });
  }

  async createPaymentIntent(bookingId: number) {
    return this.request(`/bookings/${bookingId}/payment_intent`, {
      method: "POST"
    });
  }

  // Courses & Enrollments
  async getCourses() {
    return this.request("/courses");
  }

  async enrollInCourse(courseId: number) {
    return this.request("/course_enrollments", {
      method: "POST",
      body: JSON.stringify({ course_enrollment: { course_id: courseId } })
    });
  }

  async getCourseEnrollments() {
    return this.request("/course_enrollments");
  }

  // Conservation Events & RSVPs
  async getConservationEvents() {
    return this.request("/conservation_events");
  }

  async createRsvp(rsvpParams: { conservation_event_id: number; guest_name?: string; guest_email?: string }) {
    return this.request("/rsvps", {
      method: "POST",
      body: JSON.stringify({ rsvp: rsvpParams })
    });
  }

  async getRsvps() {
    return this.request("/rsvps/mine");
  }

  // Logbook Entries
  async getLogEntries() {
    return this.request("/log_entries");
  }

  async createLogEntry(params: any) {
    return this.request("/log_entries", {
      method: "POST",
      body: JSON.stringify({ log_entry: params })
    });
  }

  // Certification Verification
  async submitCert(padiNumber: string, level: string, file?: File) {
    const formData = new FormData();
    formData.append("padi_cert_number", padiNumber);
    formData.append("padi_cert_level", level);
    if (file) {
      formData.append("cert_card_photo", file);
    }
    return this.request("/users/me/cert", {
      method: "PATCH",
      body: formData
    });
  }

  // Conservation Impact Stats
  async getImpactStats() {
    return this.request("/impact_stats");
  }
}

export const apiClient = new ApiClient();
