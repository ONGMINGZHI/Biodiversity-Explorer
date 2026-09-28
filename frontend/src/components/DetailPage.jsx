import { Link } from "react-router-dom";

function DetailPage({
    backLink,
    backText = "Back",
    title,
    subtitle,
    image,
    imageAlt,
    children
}) {
    return (
        <div className="page detail-page">

            {/* Back button */}
            <Link to={backLink} className="back-link">
                ← {backText}
            </Link>

            {/* Main information */}
            <div className="detail-hero">

                {/* Image */}
                {image && (
                    <div className="detail-image">
                        <img
                            src={image}
                            alt={imageAlt || title}
                        />
                    </div>
                )}

                {/* Title */}
                <div className="detail-header">
                    <h1>{title}</h1>

                    {subtitle && (
                        <p className="detail-subtitle">
                            {subtitle}
                        </p>
                    )}
                </div>

            </div>

            {/* Page-specific content */}
            <div className="detail-content">
                {children}
            </div>

        </div>
    );
}

export default DetailPage;