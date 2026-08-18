import { useEffect, useState } from "react";
import Admin from "./Admin";
import "./App.css";

const API_URL = "https://wantace-roof-estimator-1-vblj.onrender.com";

function App() {
  // Admin page
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  // Customer page
  return <CustomerEstimator />;
}

function CustomerEstimator() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [savingLead, setSavingLead] = useState(false);

  const [form, setForm] = useState({
    roof_area: "",
    material: "",
    pitch: "",
    layers: "",
    stories: "",
  });

  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [leadMessage, setLeadMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/config`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load configuration");
        }

        return response.json();
      })
      .then((data) => {
        setConfig(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setResult(null);
    setError("");
    setLeadMessage("");
  };

  const getQuestion = (key) => {
    return config?.questions?.find(
      (question) => question.key === key
    );
  };

  const calculateEstimate = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);
    setLeadMessage("");

    if (
      !form.roof_area ||
      !form.material ||
      !form.pitch ||
      !form.layers ||
      !form.stories
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setCalculating(true);

      const response = await fetch(
        `${API_URL}/api/estimate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roof_area: Number(form.roof_area),
            material: form.material,
            pitch: form.pitch,
            layers: form.layers,
            stories: form.stories,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to calculate estimate"
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
    }
  };

  const saveLead = async () => {
    setLeadMessage("");

    if (!result) {
      setLeadMessage(
        "Please calculate your estimate first."
      );
      return;
    }

    if (
      !leadForm.name ||
      !leadForm.phone ||
      !leadForm.email
    ) {
      setLeadMessage(
        "Please enter your name, phone and email."
      );
      return;
    }

    try {
      setSavingLead(true);

      const response = await fetch(
        `${API_URL}/api/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: leadForm.name,
            phone: leadForm.phone,
            email: leadForm.email,
            estimate: result.estimate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save lead"
        );
      }

      setLeadMessage(
        "Thank you! Your estimate has been saved successfully."
      );

      setLeadForm({
        name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      setLeadMessage(error.message);
    } finally {
      setSavingLead(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading roofing estimator...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="error-screen">
        <h2>Unable to load estimator</h2>
        <p>
          {error || "Configuration not found."}
        </p>
      </div>
    );
  }

  const roofAreaQuestion = getQuestion("roof_area");
  const materialQuestion = getQuestion("material");
  const pitchQuestion = getQuestion("pitch");
  const layersQuestion = getQuestion("layers");
  const storiesQuestion = getQuestion("stories");

  return (
    <div className="app">

      <header className="header">
        <div className="container header-content">

          <div>
            <div className="brand">
              {config.business.name}
            </div>

            <div className="location">
              {config.business.region}
            </div>
          </div>

          <div className="badge">
            Free Estimate
          </div>

        </div>
      </header>

      <main className="container main">

        <section className="hero">

          <p className="eyebrow">
            ROOFING COST ESTIMATOR
          </p>

          <h1>
            Get your roofing estimate
          </h1>

          <p className="hero-text">
            Tell us a little about your roof and we'll
            calculate an estimated project range.
          </p>

        </section>

        <div className="content-grid">

          <form
            className="estimator-card"
            onSubmit={calculateEstimate}
          >

            <div className="card-header">

              <h2>
                Tell us about your roof
              </h2>

              <p>
                Complete the information below.
              </p>

            </div>

            <div className="form-group">

              <label htmlFor="roof_area">
                {roofAreaQuestion?.label}
              </label>

              <div className="input-with-unit">

                <input
                  id="roof_area"
                  name="roof_area"
                  type="number"
                  min={roofAreaQuestion?.min}
                  max={roofAreaQuestion?.max}
                  placeholder="e.g. 2000"
                  value={form.roof_area}
                  onChange={handleChange}
                />

                <span>
                  {roofAreaQuestion?.unit}
                </span>

              </div>

            </div>

            <SelectField
              question={materialQuestion}
              value={form.material}
              onChange={handleChange}
            />

            <SelectField
              question={pitchQuestion}
              value={form.pitch}
              onChange={handleChange}
            />

            <SelectField
              question={layersQuestion}
              value={form.layers}
              onChange={handleChange}
            />

            <SelectField
              question={storiesQuestion}
              value={form.stories}
              onChange={handleChange}
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              className="calculate-btn"
              type="submit"
              disabled={calculating}
            >
              {calculating
                ? "Calculating..."
                : "Calculate My Estimate"}
            </button>

          </form>

          <aside className="result-card">

            {!result ? (

              <div className="empty-result">

                <div className="estimate-icon">
                  $
                </div>

                <h2>
                  Your estimate
                </h2>

                <p>
                  Complete the form to see your
                  estimated roofing cost.
                </p>

              </div>

            ) : (

              <div className="result">

                <p className="result-label">
                  ESTIMATED PROJECT RANGE
                </p>

                <div className="price">
                  ${result.estimate.low.toLocaleString()}
                  {" - "}
                  ${result.estimate.high.toLocaleString()}
                </div>

                <p className="price-note">
                  Estimated in {result.estimate.currency}
                </p>

                <div className="breakdown">

                  <h3>
                    Estimate breakdown
                  </h3>

                  <BreakdownRow
                    label="Roof area"
                    value={`${result.breakdown.roof_area.toLocaleString()} sq ft`}
                  />

                  <BreakdownRow
                    label="Adjusted area"
                    value={`${result.breakdown.adjusted_area.toLocaleString()} sq ft`}
                  />

                  <BreakdownRow
                    label="Material"
                    value={result.selections.material}
                  />

                  <BreakdownRow
                    label="Pitch"
                    value={result.selections.pitch}
                  />

                  <BreakdownRow
                    label="Layers"
                    value={result.selections.layers}
                  />

                  <BreakdownRow
                    label="Stories"
                    value={result.selections.stories}
                  />

                  <BreakdownRow
                    label="Tear-off"
                    value={`$${result.breakdown.tear_off_cost.toLocaleString()}`}
                  />

                  <BreakdownRow
                    label="Permit"
                    value={`$${result.breakdown.permit_fee.toLocaleString()}`}
                  />

                </div>

                <div className="midpoint">

                  <span>
                    Estimated midpoint
                  </span>

                  <strong>
                    ${result.estimate.midpoint.toLocaleString()}
                  </strong>

                </div>

                <p className="disclaimer">
                  This is an initial estimate. Final pricing
                  may vary after an on-site inspection.
                </p>

                <div className="lead-form">

                  <h3>
                    Get your detailed estimate
                  </h3>

                  <p>
                    Enter your contact details to save
                    your estimate.
                  </p>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={leadForm.name}
                    onChange={(event) =>
                      setLeadForm({
                        ...leadForm,
                        name: event.target.value,
                      })
                    }
                  />

                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm({
                        ...leadForm,
                        phone: event.target.value,
                      })
                    }
                  />

                  <input
                    type="email"
                    placeholder="Email address"
                    value={leadForm.email}
                    onChange={(event) =>
                      setLeadForm({
                        ...leadForm,
                        email: event.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="save-lead-btn"
                    onClick={saveLead}
                    disabled={savingLead}
                  >
                    {savingLead
                      ? "Saving..."
                      : "Request My Estimate"}
                  </button>

                  {leadMessage && (
                    <div className="lead-message">
                      {leadMessage}
                    </div>
                  )}

                </div>

              </div>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

function SelectField({
  question,
  value,
  onChange,
}) {
  if (!question) {
    return null;
  }

  return (
    <div className="form-group">

      <label htmlFor={question.key}>
        {question.label}
      </label>

      <select
        id={question.key}
        name={question.key}
        value={value}
        onChange={onChange}
      >

        <option value="">
          Select an option
        </option>

        {question.options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}

function BreakdownRow({
  label,
  value,
}) {
  return (
    <div className="breakdown-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default App;