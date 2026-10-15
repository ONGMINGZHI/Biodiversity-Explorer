import "./Footer.css";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-about">
                    <h3>Biodiversity Explorer</h3>
                    <p>Discover Malaysia's wildlife, habitats, and conservation efforts.</p>
                </div>

                <div className="footer-sources">
                    <h4>Data Sources & References</h4>
                    <ul>
                        <li>
                            <a href="https://www.wikipedia.org/" target="_blank" rel="noreferrer">
                                Wikipedia
                            </a>
                        </li>
                        <li>
                            <a href="https://www.inaturalist.org/" target="_blank" rel="noreferrer">
                                iNaturalist
                            </a>
                        </li>
                        <li>
                            <a href="https://powo.science.kew.org/" target="_blank" rel="noreferrer">
                                Kew — Plants of the World Online
                            </a>
                        </li>
                        <li>
                            <a href="https://www.mybis.gov.my/" target="_blank" rel="noreferrer">
                                Malaysia Biodiversity Information System (MyBIS)
                            </a>
                        </li>
                    </ul>
                </div>
                


            </div>
            <div className="footer-taxonomy">
    <h4>Taxonomy Note</h4>
    <p>
        Biodiversity Explorer uses a traditional taxonomic classification
        structure for educational purposes, organizing organisms by kingdom,
        phylum, class, order, family, genus, and species. Some classifications
        may differ from modern taxonomic databases as scientific understanding
        and classification systems continue to evolve.
    </p>
</div>

            <div className="footer-bottom">
                <p>Images and information are credited to their respective sources. Please refer to individual licenses and attribution details.</p>
                <p>© 2026 Biodiversity Explorer · Sem 2 project</p>
            </div>
        </footer>
    );
}

export default Footer;
