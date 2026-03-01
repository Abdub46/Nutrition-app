export default function Article() {
  return (
    <div className="article-page">
      <div className="article-container">

        <div className="article-hero">
          <h1>Nutrition & Health Insights</h1>
          <p>
            Evidence-based guidance to help you understand your body,
            improve your nutrition status, and live healthier.
          </p>
        </div>

        <article className="article-content">

          <section>
            <h2>1. The Importance of a Balanced Diet</h2>
            <p>
              A balanced diet provides the body with essential macronutrients
              (carbohydrates, proteins, and fats) and micronutrients
              (vitamins and minerals) required for optimal growth, immunity,
              and energy production.
            </p>
            <p>
              Consuming a variety of fruits, vegetables, whole grains, lean
              proteins, and healthy fats ensures that your body functions
              efficiently and reduces the risk of chronic diseases such as
              diabetes and hypertension.
            </p>
          </section>

          <section>
            <h2>2. Understanding Body Mass Index (BMI)</h2>
            <p>
              Body Mass Index (BMI) is a simple measurement used to assess
              whether an individual has a healthy body weight for their height.
            </p>
            <ul>
              <li>Underweight: BMI less than 18.5</li>
              <li>Normal weight: BMI 18.5 – 24.9</li>
              <li>Overweight: BMI 25 – 29.9</li>
              <li>Obese: BMI 30 and above</li>
            </ul>
            <p>
              While BMI is a helpful screening tool, it should be interpreted
              alongside other health indicators such as diet quality,
              physical activity, and medical history.
            </p>
          </section>

          <section>
            <h2>3. Hydration and Its Role in Health</h2>
            <p>
              Water is essential for digestion, temperature regulation,
              nutrient transport, and detoxification. Dehydration can lead
              to fatigue, headaches, and reduced concentration.
            </p>
            <p>
              Adults should aim for at least 6–8 glasses of water daily,
              adjusting intake based on activity level and climate.
            </p>
          </section>

          <section>
            <h2>4. Monitoring Your Nutrition Progress</h2>
            <p>
              Regular tracking of your BMI, calorie intake, and dietary habits
              allows you to evaluate progress and make informed decisions.
              Small consistent improvements lead to sustainable long-term health.
            </p>
          </section>

        </article>

        <div className="article-footer">
          <p>© 2026 Nutrition Progress App. Empowering healthier lives.</p>
        </div>

      </div>
    </div>
  );
}

