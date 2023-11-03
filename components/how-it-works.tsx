export default function HowItWorks() {
  const sections = [
    {
      title: "Section 1",
      steps: ["Step 1", "Step 2", "Step 3"],
    },
    {
      title: "Section 2",
      steps: ["Step 1", "Step 2", "Step 3"],
    },
    {
      title: "Section 3",
      steps: ["Step 1", "Step 2", "Step 3"],
    },
    {
      title: "Section 4",
      steps: ["Step 1", "Step 2", "Step 3"],
    },
  ];

  return (
    <div className="how-it-works-section">
      <h2>How It Works</h2>
      {sections.map((section, index) => (
        <div className="section" key={index}>
          <h3>{section.title}</h3>
          <ol>
            {section.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
