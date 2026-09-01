import { useState } from "react";
import axios from "axios";

import {
    Upload,
    Image as ImageIcon,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
    Leaf,
    Sparkles,
    Utensils,
    RefreshCw
} from "lucide-react";

import "./MealAnalyzer.css";


function MealAnalyzer() {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ---------------------------------------------
    // Image selection
    // ---------------------------------------------

    const handleImageChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            setError(
                "Please upload a JPG, PNG, or WebP image."
            );

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            setError(
                "Image must be smaller than 10 MB."
            );

            return;
        }

        setError("");
        setImage(file);

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview(
            URL.createObjectURL(file)
        );

        setAnalysis(null);
    };


    // ---------------------------------------------
    // Analyze meal
    // ---------------------------------------------

    const analyzeMeal = async () => {

        if (!image) {

            setError(
                "Please upload a meal image first."
            );

            return;
        }

        setLoading(true);
        setError("");
        setAnalysis(null);

        const formData = new FormData();

        formData.append(
            "file",
            image
        );

        try {

            const response = await axios.post(
                "http://localhost:8000/analyze-meal",
                formData
            );

            setAnalysis(
                response.data.analysis
            );

        } catch (error) {

            console.error(
                "Meal analysis failed:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to analyze the meal."
            );

        } finally {

            setLoading(false);

        }
    };


    // ---------------------------------------------
    // Reset
    // ---------------------------------------------

    const reset = () => {

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setImage(null);
        setPreview(null);
        setAnalysis(null);
        setError("");
    };


    return (

        <main className="meal-analyzer-page">

            <div className="meal-analyzer-wrapper">

                {/* =================================
                    Header
                ================================= */}

                <header className="meal-analyzer-header">

                    <div className="meal-analyzer-brand">

                        <div className="meal-analyzer-brand-icon">
                            <Leaf size={21} />
                        </div>

                        <span>
                            PCOSense
                        </span>

                    </div>


                    <div className="meal-analyzer-heading">

                        <div className="meal-analyzer-eyebrow">
                            AI NUTRITION ASSISTANT
                        </div>

                        <h1>
                            Meal Analyzer
                        </h1>

                        <p>
                            Understand how your meal fits into
                            a PCOS-friendly eating pattern.
                        </p>

                    </div>

                </header>


                {/* =================================
                    Main content
                ================================= */}

                <section className="meal-analyzer-content">

                    {!preview && (

                        <label
                            htmlFor="meal-image"
                            className="meal-upload-card"
                        >

                            <div className="meal-upload-icon">
                                <Upload size={27} />
                            </div>

                            <h2>
                                Upload a meal photo
                            </h2>

                            <p>
                                Take a photo or choose an
                                existing image of your meal.
                            </p>

                            <span className="meal-upload-button">
                                Choose image
                            </span>

                            <span className="meal-upload-formats">
                                JPG · PNG · WebP · Max 10 MB
                            </span>

                            <input
                                id="meal-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                hidden
                            />

                        </label>

                    )}


                    {/* =================================
                        Preview
                    ================================= */}

                    {preview && !analysis && (

                        <div className="meal-preview-section">

                            <div className="meal-preview-top">

                                <div>

                                    <span className="meal-section-label">
                                        YOUR MEAL
                                    </span>

                                    <h2>
                                        Ready to analyze
                                    </h2>

                                    <p>
                                        {image?.name}
                                    </p>

                                </div>


                                <button
                                    className="meal-secondary-button"
                                    onClick={reset}
                                    disabled={loading}
                                >

                                    <RefreshCw size={15} />

                                    Change photo

                                </button>

                            </div>


                            <div className="meal-image-container">

                                <img
                                    src={preview}
                                    alt="Uploaded meal"
                                    className="meal-preview-image"
                                />

                            </div>


                            <button
                                className="meal-analyze-button"
                                onClick={analyzeMeal}
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="meal-spin"
                                        />

                                        Analyzing your meal...

                                    </>

                                ) : (

                                    <>
                                        <Sparkles size={19} />

                                        Analyze meal

                                    </>

                                )}

                            </button>

                        </div>

                    )}


                    {/* =================================
                        Error
                    ================================= */}

                    {error && (

                        <div className="meal-error">

                            <AlertCircle size={17} />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        Analysis
                    ================================= */}

                    {analysis && (

                        <div className="meal-analysis-section">

                            <div className="meal-analysis-heading">

                                <div>

                                    <span className="meal-section-label">
                                        AI ANALYSIS
                                    </span>

                                    <h2>
                                        {analysis.meal_name}
                                    </h2>

                                </div>


                                <div className="meal-rating">

                                    <CheckCircle2 size={16} />

                                    {analysis.overall_rating}

                                </div>

                            </div>


                            {/* Foods */}

                            <section className="meal-analysis-block">

                                <div className="meal-block-heading">

                                    <ImageIcon size={17} />

                                    <h3>
                                        Foods identified
                                    </h3>

                                </div>


                                <div className="meal-food-tags">

                                    {analysis.foods_identified?.map(
                                        (food, index) => (

                                            <span
                                                key={index}
                                            >
                                                {food}
                                            </span>

                                        )
                                    )}

                                </div>

                            </section>


                            {/* Healthy aspects */}

                            <section className="meal-analysis-block">

                                <div className="meal-block-heading">

                                    <CheckCircle2 size={17} />

                                    <h3>
                                        What's good about this meal
                                    </h3>

                                </div>


                                <ul className="meal-analysis-list meal-positive-list">

                                    {analysis.healthy_aspects?.map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </section>


                            {/* PCOS considerations */}

                            <section className="meal-analysis-block">

                                <div className="meal-block-heading">

                                    <Leaf size={17} />

                                    <h3>
                                        PCOS considerations
                                    </h3>

                                </div>


                                <ul className="meal-analysis-list">

                                    {analysis.pcos_considerations?.map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </section>


                            {/* Suggestions */}

                            <section className="meal-analysis-block">

                                <div className="meal-block-heading">

                                    <Sparkles size={17} />

                                    <h3>
                                        Possible improvements
                                    </h3>

                                </div>


                                <ul className="meal-analysis-list">

                                    {analysis.suggestions?.map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </section>


                            {/* Confidence */}

                            <div className="meal-confidence">

                                <span>
                                    Image confidence
                                </span>

                                <strong>
                                    {analysis.confidence}
                                </strong>

                            </div>


                            {/* Disclaimer */}

                            <div className="meal-disclaimer">

                                <AlertCircle size={16} />

                                <span>
                                    {analysis.disclaimer}
                                </span>

                            </div>


                            <button
                                className="meal-analyze-another"
                                onClick={reset}
                            >

                                <Utensils size={16} />

                                Analyze another meal

                            </button>

                        </div>

                    )}

                </section>


                {/* =================================
                    Footer
                ================================= */}

                <footer className="meal-analyzer-footer">

                    <span>
                        PCOSense AI
                    </span>

                    <span>
                        General nutritional guidance ·
                        Not a medical diagnosis
                    </span>

                </footer>

            </div>

        </main>
    );
}


export default MealAnalyzer;