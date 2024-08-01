<template>

    <PrezUIStaticPage variant="stacked">
        <h1 class="page-title">About Prez</h1>
        <p>
            Prez is an open source an Application Programming Interface (API) that implements <a
                href="https://www.w3.org/standards/semanticweb/data">Linked Data</a>
            methods for providing access to a wide range of data on the web. It also implements the <a
                href="https://docs.ogc.org/is/17-069r3/17-069r3.html">OGC API:Features</a>
            for spatial data.
        </p>
        <p>
            Prez comes in a number of "flavours", one or more of which may be implemented in any one Prez system:
        </p>
        <ul>
            <li>
                <RouterLink to="/c">CatPrez</RouterLink> - for presenting data catalog information
            </li>
            <li>
                <RouterLink to="/s">SpacePrez</RouterLink> - for presenting spatial data
            </li>
            <li>
                <RouterLink to="/v">VocPrez</RouterLink> - for presenting vocabularies
            </li>
        </ul>
        <p>Each enabled flavour will have links to its home page in the main menu.</p>
        <h2>License</h2>
        <p>Prez is licensed using the <a href="https://github.com/rdflib/prez/blob/main/LICENSE" target="_blank"
                rel="noopener noreferrer">BSD 3-Clause licence</a>.</p>
        <h2>Documentation</h2>
        <p>See <a href="http://rdflib.dev/prez/" target="_blank" rel="noopener noreferrer">http://rdflib.dev/prez/</a> for
            detailed Prez documentation.</p>
    </PrezUIStaticPage>

</template>