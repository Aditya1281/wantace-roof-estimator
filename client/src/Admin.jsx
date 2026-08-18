import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = "http://localhost:5000";

function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/leads`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load leads"
        );
      }

      setLeads(data.leads || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const totalLeads = leads.length;

  const averageMidpoint =
    totalLeads > 0
      ? Math.round(
          leads.reduce(
            (sum, lead) =>
              sum + (lead.estimate?.midpoint || 0),
            0
          ) / totalLeads
        )
      : 0;

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-page">

      <header className="admin-header">
        <div className="admin-container admin-header-content">

          <div>
            <h1 className="admin-title">
              Admin Dashboard
            </h1>

            <div className="admin-business">
              Northline Roofing & Exteriors
            </div>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchLeads}
          >
            ↻ Refresh Leads
          </button>

        </div>
      </header>

      <main className="admin-container admin-main">

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-label">
              TOTAL LEADS
            </div>

            <div className="stat-value">
              {totalLeads}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              AVERAGE MIDPOINT
            </div>

            <div className="stat-value">
              {formatCurrency(averageMidpoint)}
            </div>
          </div>

        </div>

        <section className="leads-section">

          <div className="section-header">

            <div>
              <h2>
                Customer Leads
              </h2>

              <p>
                View submitted roofing estimate requests.
              </p>
            </div>

            <div className="lead-count">
              {totalLeads}{" "}
              {totalLeads === 1 ? "Lead" : "Leads"}
            </div>

          </div>

          {leads.length === 0 ? (

            <div className="empty-leads">
              No customer leads found.
            </div>

          ) : (

            <div className="table-wrapper">

              <table className="leads-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Estimate</th>
                    <th>Midpoint</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>

                  {leads.map((lead) => (

                    <tr key={lead._id}>

                      <td className="customer-name">
                        {lead.name}
                      </td>

                      <td className="phone">
                        {lead.phone}
                      </td>

                      <td className="email">
                        {lead.email}
                      </td>

                      <td className="estimate">
                        {formatCurrency(
                          lead.estimate?.low
                        )}
                        {" - "}
                        {formatCurrency(
                          lead.estimate?.high
                        )}
                      </td>

                      <td className="midpoint">
                        {formatCurrency(
                          lead.estimate?.midpoint
                        )}
                      </td>

                      <td className="submitted">
                        {formatDate(
                          lead.createdAt
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Admin;